/* Les documents que l'application PRODUIT — module « comité social et économique »,
   seconde série.

   POURQUOI UN SECOND FICHIER

   « documents-cse.js » couvre dix-neuf points du module : les effectifs, la mise
   en place, le périmètre, les élections et les consultations. Il restait
   vingt-sept points sans document — les moyens du comité, la commission santé,
   sécurité et conditions de travail, les commissions obligatoires, les deux
   budgets, les expertises, et les deux points à faire examiner. Ce fichier les
   écrit. Deux fichiers plutôt qu'un seul de six mille lignes : on travaille sur
   les budgets sans risquer d'abîmer les élections, et le registre refuse de
   lui-même tout identifiant déjà pris.

   LES TROIS RÈGLES SONT CELLES DU PREMIER FICHIER, ET ELLES N'ONT PAS BOUGÉ

   1. Rien qui n'ait été lu à la source. Aucun article n'est reproduit ici qui ne
      figure dans « moteur/cse/textes_cse.json », le corpus capté du module. Un
      article seulement RENVOYÉ par un texte lu — R. 612-1 du code de commerce,
      auquel D. 2315-29 emprunte ses montants, L. 2315-81-1 auquel L. 2315-86
      renvoie, L. 1233-30 auquel L. 1233-34 renvoie, L. 4521-1 auquel L. 2315-36
      renvoie, L. 2315-22-1 réservé par L. 2315-18 — est NOMMÉ, jamais reproduit
      ni paraphrasé : le document dit alors expressément que l'application ne l'a
      pas lu, et renvoie le lecteur au texte.

   2. Aucune peine annoncée qui ne soit portée par un texte capté. L'article
      L. 2317-1 punit l'entrave à la constitution du comité, à la libre
      désignation de ses membres et à son fonctionnement régulier : il est cité
      là où le module l'a retenu pour fondement, et nulle part ailleurs. Pour
      tout le reste — les heures non payées, la subvention non versée, la
      commission mal composée, l'expertise mal financée — le document dit ce qui
      se joue réellement : une dette qui reste due, une désignation annulable,
      une délibération irrégulière, une décision prise sur une consultation qui
      n'en était pas une.

   3. Les faits et les chiffres ne s'inventent jamais. Aucun document n'écrit la
      masse salariale de l'entreprise, le nombre de ses élus, le nom de ses
      représentants ni le montant d'une facture. Tout cela sort entre crochets —
      sauf ce que le dossier porte lui-même, et qui est alors repris tel quel.

   L'ORDRE DES TROIS ÉTAGES COMMANDE ICI PLUS QU'AILLEURS. Les moyens de la
   commission santé et sécurité, les commissions obligatoires, la contribution
   aux activités sociales : tout cela est supplétif. L. 2315-44 ne joue qu'« en
   l'absence d'accord prévu aux articles L. 2315-41 et L. 2315-42 », L. 2315-46,
   L. 2315-49, L. 2315-50 et L. 2315-56 qu'« en l'absence d'accord prévu à
   l'article L. 2315-45 », le plancher de L. 2312-81 qu'« à défaut d'accord »,
   R. 2314-1 qu'« à défaut de stipulations dans l'accord prévu à l'article
   L. 2314-7 ». Chaque document commence donc par dire quel étage il applique, et
   pourquoi l'étage supérieur ne s'applique pas. */
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
    var e = String(Math.floor(Math.abs(s)));
    var d = Math.round((Math.abs(s) - Math.floor(Math.abs(s))) * 100);
    e = e.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return (s < 0 ? "-" : "") + e + (d ? "," + (d < 10 ? "0" + d : d) : "") + " €";
  }

  /* Les listes de la fiche arrivent tantôt en tableau, tantôt en chaîne JSON,
     tantôt en texte libre : le générateur ne doit pas s'y casser. */
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

  /* Une réponse oui/non de la fiche, telle qu'elle a été saisie. On ne devine
     rien : « non renseigné » est une troisième valeur, et elle se voit. */
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
    L.push("discutera devant l'inspection du travail ou devant le juge.");
    L.push("");
    L.push(TRAIT);
    L.push("");
  }

  function pied(L, arts, sansReserve) {
    L.push("");
    L.push(TRAIT);
    L.push("");
    if (arts && arts.length) {
      L.push("FONDEMENT — les articles du code du travail lus à la source :");
      L.push(arts.join(" · ") + ".");
    } else {
      L.push("FONDEMENT — aucun article n'est cité ici : ce document ne prononce aucune");
      L.push("règle de droit, il rétablit des données. Ce sont les contrôles qui les");
      L.push("liront ensuite qui portent, chacun, leur propre fondement.");
    }
    L.push("");
    if (!sansReserve) {
      L.push("Ce document ne vaut pas consultation juridique. Votre convention collective,");
      L.push("vos accords d'entreprise, vos usages et vos engagements unilatéraux peuvent");
      L.push("ajouter des exigences que l'application ne lit pas, et priment lorsqu'ils sont");
      L.push("plus favorables. L'application n'apprécie pas ce que la loi confie à");
      L.push("l'appréciation du juge.");
    }
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

  /* Le bloc de calendrier, écrit une fois : chaque document en porte un, et les
     dates y sont calculées, jamais recopiées de mémoire. */
  function calendrier(L, lignes) {
    L.push("");
    L.push(DOUBLE);
    L.push("VOTRE CALENDRIER");
    L.push(DOUBLE);
    L.push("");
    lignes.forEach(function (x) { L.push(x); });
  }

  /* Le tableau de R. 2314-1, tel que le moteur du module le lit. On ne le
     recopie pas ici : deux copies d'un même tableau finissent par diverger, et
     celle qui diverge est toujours celle qu'on ne relit pas. */
  function delegationLegale(effectif) {
    try {
      var M = global.MoteurCSE && global.MoteurCSE.moteur;
      if (M && typeof M.delegation === "function" && effectif != null)
        return M.delegation(effectif);
    } catch (e) {}
    return null;
  }

  /* Le rappel de l'ordre des sources pour la commission santé et sécurité :
     trois documents s'en servent, il est écrit une fois. */
  function ordreCssct(L) {
    L.push("  1er étage — l'ACCORD D'ENTREPRISE défini à l'article L. 2313-2 fixe les");
    L.push("     modalités de mise en place de la ou des commissions, en définissant les");
    L.push("     six points énumérés aux 1° à 6° de l'article L. 2315-41.");
    L.push("");
    L.push("  2e étage — EN L'ABSENCE DE DÉLÉGUÉ SYNDICAL, un accord entre l'employeur et");
    L.push("     le comité, adopté à la majorité des membres titulaires élus de la");
    L.push("     délégation du personnel, fixe ces mêmes modalités (L. 2315-42).");
    L.push("");
    L.push("  3e étage — EN L'ABSENCE D'ACCORD prévu aux articles L. 2315-41 et L. 2315-42,");
    L.push("     le RÈGLEMENT INTÉRIEUR DU COMITÉ définit les modalités mentionnées aux 1° à");
    L.push("     6° de L. 2315-41 (L. 2315-44). Le comité détermine ce règlement intérieur");
    L.push("     lui-même (L. 2315-24).");
    L.push("");
    L.push("  HORS DES CAS de L. 2315-36 et L. 2315-37 — l'accord de L. 2313-2 ou, en");
    L.push("     l'absence de délégué syndical, l'accord avec le comité peut en outre fixer");
    L.push("     le NOMBRE ET LE PÉRIMÈTRE des commissions (L. 2315-43) ; en l'absence d'un");
    L.push("     tel accord, l'employeur peut les fixer (L. 2315-44, second alinéa).");
    L.push("");
  }

  /* ══════════════════════════════════════════════════════════════════════════
     RECEVABILITÉ DES DONNÉES
     ══════════════════════════════════════════════════════════════════════════ */

  /* Ce point n'a pas de fondement légal : il ne constate aucun manquement de
     l'employeur, il constate que le dossier n'est pas lisible. Le document est
     donc une feuille de travail, et non un acte — mais c'est une feuille de
     travail qui doit être datée et signée, parce qu'elle dit sur quelle pièce
     chaque valeur a été relue. */
  DP.ajouter("CSE-CTL-REC-01", {
    nom: "La fiche de reprise des données du dossier, avec la pièce d'origine de chaque valeur",
    detail: "Le relevé des valeurs saisies, la pièce sur laquelle chacune se relit, le " +
            "contrôle de l'ordre des dates, et le procès-verbal de correction à signer " +
            "avant de relancer l'audit.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var L = [];

      L = L.concat(entete(ctx, "Fiche de reprise des données de l'audit du comité", ""));
      usage(L);

      L.push("OBJET, ET CE QUE CE DOCUMENT N'EST PAS");
      L.push("");
      L.push("Ce document ne prononce aucune règle de droit et ne constate aucun");
      L.push("manquement. Il sert à une seule chose : rétablir des données que");
      L.push("l'application a jugées impossibles ou mal formées — une date qui n'existe");
      L.push("pas, un dénombrement fractionnaire, un montant négatif, une chronologie");
      L.push("inversée.");
      L.push("");
      L.push("L'enjeu n'est pas mince. Un contrôle qui lit une valeur impossible conclut");
      L.push("sur un nombre qui n'existe pas, et ce qu'il rend alors — conforme comme non");
      L.push("conforme — ne vaut rien. Tant que la donnée n'est pas corrigée, les contrôles");
      L.push("qui la lisent ne prononcent rien, ni dans un sens ni dans l'autre.");
      L.push("");
      L.push("RÈGLE DE MÉTHODE — chaque valeur se relit SUR LA PIÈCE D'ORIGINE, jamais de");
      L.push("mémoire : une valeur rectifiée au jugé remplace une erreur par une autre.");
      L.push("");

      titre(L, "1 — Ce que le dossier porte aujourd'hui");
      L.push("Reportez ci-dessous, champ par champ, ce que l'application a lu, ce qui a été");
      L.push("retenu après vérification, et la pièce sur laquelle la valeur retenue se lit.");
      L.push("");
      L.push("   Champ · valeur saisie · valeur retenue · pièce d'origine · relue le");
      L.push("");

      var vus = 0;
      [
        ["entreprise", "Dénomination sociale", "extrait Kbis"],
        ["dateAudit", "Date à laquelle la situation est décrite", "—"],
        ["effectif", "Effectif au sens de L. 1111-2", "registre du personnel"],
        ["effectifsMensuels", "Effectif mois par mois", "états d'effectif ou déclarations sociales nominatives"],
        ["nbCadres", "Nombre de cadres au sens de L. 2314-11", "organigramme et classification"],
        ["masseSalariale", "Masse salariale brute de l'exercice", "déclarations sociales nominatives"],
        ["masseSalarialeN1", "Masse salariale brute de l'exercice précédent", "déclarations sociales nominatives"],
        ["dateDernieresElections", "Date du premier tour des dernières élections", "procès-verbal des élections"],
        ["dateInformationPersonnel", "Date de l'information du personnel", "note d'information à date certaine"],
        ["datePremierTour", "Date du premier tour", "protocole ou note d'information"],
        ["titulairesElus", "Titulaires effectivement élus", "procès-verbal des élections"],
        ["titulairesInitiaux", "Titulaires élus à l'origine", "procès-verbal des élections"],
        ["titulairesRestants", "Titulaires encore en fonction", "registre des départs"],
        ["reunionsTenues", "Réunions du comité tenues sur l'année", "convocations et procès-verbaux"],
        ["reunionsSante", "Réunions ayant porté sur la santé et la sécurité", "ordres du jour"],
        ["heuresAccordees", "Volume mensuel d'heures de délégation accordé", "protocole ou accord"],
        ["subventionVersee", "Subvention de fonctionnement versée", "justificatifs de versement"],
        ["ascAnneeN", "Contribution aux activités sociales de l'exercice", "justificatifs de versement"],
        ["ascAnneeN1", "Même contribution, exercice précédent", "justificatifs de versement"],
        ["joursFormationSSCT", "Jours de formation santé et sécurité dispensés", "attestations de formation"],
        ["nbLicenciements", "Licenciements envisagés sur trente jours", "projet de licenciement"],
      ].forEach(function (c) {
        var v = f[c[0]];
        var brut = v === undefined ? "[non renseigné]"
          : (Array.isArray(v) ? v.join(" · ") : (typeof v === "object" ? JSON.stringify(v) : String(v)));
        if (brut.length > 60) brut = brut.slice(0, 57) + "…";
        if (v !== undefined) vus++;
        L.push("   " + c[1]);
        L.push("      saisi : " + brut + "  ·  retenu : [ ]  ·  pièce : " + c[2] + "  ·  relu le [ ]");
      });
      L.push("");
      L.push(vus + " champ(s) sur 21 sont renseignés au dossier. Les autres restent vides :");
      L.push("une donnée vide n'est pas une erreur de saisie, elle produit « donnée");
      L.push("manquante » et non « conforme ».");
      L.push("");

      titre(L, "2 — L'ordre des dates");
      L.push("Une chronologie inversée n'est pas un délai tenu, et l'application refuse de");
      L.push("la lire comme tel. Vérifiez que chaque couple ci-dessous se suit dans l'ordre");
      L.push("où les actes ont eu lieu.");
      L.push("");
      [
        ["Information du personnel", f.dateInformationPersonnel, "Premier tour", f.datePremierTour,
         "l'information précède le tour, et l'écart ne peut excéder quatre-vingt-dix jours"],
        ["Dernières élections", f.dateDernieresElections, "Date d'audit", f.dateAudit,
         "l'élection précède l'audit"],
        ["Remise des informations au comité", (objet(f.consultation) || {}).dateRemise, "Avis du comité", (objet(f.consultation) || {}).dateAvis,
         "la remise précède l'avis, et fait courir le délai"],
        ["Acte contesté (expertise)", (objet(f.expertise) || {}).dateDepart, "Saisine du juge", (objet(f.expertise) || {}).dateSaisine,
         "l'acte précède la saisine, et l'écart ne peut excéder dix jours"],
      ].forEach(function (c) {
        var a = dateDe(c[1]), b = dateDe(c[3]);
        var etat = (a && b) ? (a.getTime() <= b.getTime() ? "ordre correct" : "ORDRE INVERSÉ — à reprendre")
                            : "[l'une des deux dates manque : rien n'est prononcé]";
        L.push("   " + c[0] + " : " + jourOu(c[1], "date") + "");
        L.push("   " + c[2] + " : " + jourOu(c[3], "date"));
        L.push("      attendu — " + c[4]);
        L.push("      état — " + etat);
        L.push("");
      });

      titre(L, "3 — Procès-verbal de correction");
      L.push("Je soussigné(e) " + signataire(ctx) + ",");
      L.push("agissant pour " + nom(ctx) + ", certifie que les valeurs portées en colonne");
      L.push("« retenue » du tableau ci-dessus ont été relues une à une sur les pièces");
      L.push("nommées en regard, et non reconstituées de mémoire.");
      L.push("");
      L.push("Champs corrigés : [nombre] · champs confirmés sans changement : [nombre].");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le " + leJour(d0) + ".");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièces jointes : les pièces d'origine nommées au tableau.");

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — vous rassemblez les pièces d'origine et remplissez",
        "les colonnes « retenue » et « pièce ».",
        "",
        "Il ne s'agit pas d'actes juridiques mais de saisies : comptez quelques heures si",
        "les pièces sont réunies, quelques jours s'il faut les demander à la paie ou aux",
        "établissements. Si vous les demandez aujourd'hui, fixez la remise au " +
          leJour(dans(d0, 7)) + " au plus tard.",
        "",
        "Dès la fiche signée — relancez l'audit. C'est la seule façon de savoir ce que les",
        "contrôles disent réellement : tant qu'une donnée reste illisible, ceux qui la",
        "lisent ne concluent pas, et l'ensemble du rapport repose sur eux.",
      ]);

      return pied(L, []);
    },
  });

  /* ══════════════════════════════════════════════════════════════════════════
     MISE EN PLACE — LE FRANCHISSEMENT DU SEUIL
     ══════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CSE-CTL-MEP-01", {
    nom: "Les états d'effectif mensuels, le constat de franchissement du seuil de onze salariés et le calendrier qu'il ouvre",
    detail: "L'état mois par mois, la méthode de calcul de l'article L. 1111-2 catégorie " +
            "par catégorie, le constat daté du douzième mois consécutif, et le calendrier " +
            "des quatre-vingt-dix jours qui court de l'information du personnel.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var mois = liste(f.effectifsMensuels);
      var eff = effectifDe(ctx);
      var L = [];

      L = L.concat(entete(ctx, "États d'effectif mensuels et constat de franchissement du seuil de onze salariés",
        "articles L. 2311-2, L. 1111-2 et L. 2314-4 du code du travail"));
      usage(L);

      L.push("CE QUE LE TEXTE EXIGE, ET POURQUOI L'ÉTAT EST LA SEULE PREUVE");
      L.push("");
      L.push("« Un comité social et économique est mis en place dans les entreprises d'au");
      L.push("moins onze salariés. Sa mise en place n'est obligatoire que si l'effectif d'au");
      L.push("moins onze salariés est atteint pendant DOUZE MOIS CONSÉCUTIFS. Les modalités");
      L.push("de calcul des effectifs sont celles prévues aux articles L. 1111-2 et");
      L.push("L. 1251-54 » (L. 2311-2).");
      L.push("");
      L.push("Un seuil ne se franchit donc pas le jour où on le constate : il se franchit");
      L.push("sur une durée. Sans les états mensuels, ni l'obligation ni son point de départ");
      L.push("ne sont démontrables — et c'est du franchissement que court l'obligation");
      L.push("d'informer le personnel de l'organisation des élections (L. 2314-4).");
      L.push("");
      L.push("L'application n'a pas lu l'article L. 1251-54, auquel L. 2311-2 renvoie pour");
      L.push("les salariés temporaires : il n'appartient pas au corpus capté du module. Il");
      L.push("est nommé ici pour que vous le vérifiiez, non résumé.");
      L.push("");

      titre(L, "1 — L'état mois par mois");
      L.push(nom(ctx));
      L.push("");
      L.push("ÉTAT RÉCAPITULATIF DES EFFECTIFS MENSUELS");
      L.push("Effectif calculé selon les modalités de l'article L. 1111-2 du code du travail");
      L.push("");
      if (mois.length) {
        L.push("Les " + mois.length + " valeurs ci-dessous sont celles que porte votre dossier. Datez chaque");
        L.push("ligne du mois qu'elle recouvre et joignez, pour chacune, l'état d'effectif ou");
        L.push("la déclaration sociale nominative qui l'établit.");
        L.push("");
        var suite = 0, meilleure = 0, debut = null, debutMeilleure = null;
        mois.forEach(function (v, i) {
          var n = nb(v);
          var atteint = n != null && n >= 11;
          if (atteint) { if (suite === 0) debut = i + 1; suite++; if (suite > meilleure) { meilleure = suite; debutMeilleure = debut; } }
          else suite = 0;
          L.push("   Mois " + (i + 1 < 10 ? " " : "") + (i + 1) + " — [mois et année] : " +
            (n == null ? "[effectif]" : n + " salariés") +
            (atteint ? "   ≥ 11" : "") + "   ·   pièce : [ ]");
        });
        L.push("");
        L.push("PLUS LONGUE SÉRIE CONSÉCUTIVE À ONZE SALARIÉS OU PLUS : " + meilleure + " mois" +
          (meilleure ? " (du mois " + debutMeilleure + " au mois " + (debutMeilleure + meilleure - 1) + " de l'état)" : "") + ".");
        L.push("");
        if (meilleure >= 12) {
          L.push("Douze mois consécutifs sont atteints : le seuil de L. 2311-2 est franchi. Datez");
          L.push("le douzième mois de la série — c'est LA DATE DE FRANCHISSEMENT, et elle doit");
          L.push("figurer sur l'état :");
          L.push("");
          L.push("   Date de franchissement du seuil de onze salariés : [DATE]");
        } else {
          L.push("Douze mois consécutifs ne sont pas atteints par les valeurs versées. Deux");
          L.push("lectures sont possibles, et une seule est vraie :");
          L.push("  · soit la série est réellement plus courte, et l'obligation de mise en");
          L.push("    place n'est pas née — L. 2311-2 le dit expressément ;");
          L.push("  · soit l'état est incomplet. Étendez-le : on ne voit où commence une série");
          L.push("    de douze mois qu'en observant une période plus large que douze mois.");
        }
      } else {
        L.push("Votre dossier ne porte aucun relevé mensuel. Complétez le tableau ci-dessous");
        L.push("sur une période PLUS LARGE que douze mois : c'est ce qui permet de voir où");
        L.push("commence la série de douze mois consécutifs, et non de la supposer.");
        L.push("");
        for (var i = 1; i <= 14; i++)
          L.push("   Mois " + (i < 10 ? " " : "") + i + " — [mois et année] : [effectif] salariés   ·   pièce : [ ]");
        L.push("");
        L.push("   Plus longue série consécutive à onze salariés ou plus : [ ] mois");
        L.push("   Date de franchissement, s'il y en a une : [DATE]");
      }
      L.push("");
      if (eff != null) {
        L.push("Effectif déclaré au dossier : " + eff + " salariés. Cette valeur n'est qu'une");
        L.push("synthèse ; ce sont les relevés ci-dessus qui font foi.");
        L.push("");
      }

      titre(L, "2 — La méthode, catégorie par catégorie (L. 1111-2)");
      L.push("1° Comptent INTÉGRALEMENT : les salariés titulaires d'un contrat de travail à");
      L.push("durée indéterminée à temps plein et les travailleurs à domicile.");
      L.push("   Nombre retenu : [ ]");
      L.push("");
      L.push("2° Comptent À DUE PROPORTION de leur temps de présence au cours des douze mois");
      L.push("précédents : les salariés titulaires d'un contrat à durée déterminée, les");
      L.push("salariés titulaires d'un contrat de travail intermittent, les salariés mis à la");
      L.push("disposition de l'entreprise par une entreprise extérieure qui sont présents");
      L.push("dans les locaux de l'entreprise utilisatrice et y travaillent depuis au moins");
      L.push("un an, ainsi que les salariés temporaires.");
      L.push("   Nombre retenu : [ ]  ·  détail du prorata : [ ]");
      L.push("");
      L.push("3° Comptent en DIVISANT LA SOMME TOTALE DES HORAIRES inscrits dans leurs");
      L.push("contrats de travail par la durée légale ou la durée conventionnelle du");
      L.push("travail : les salariés à temps partiel, quelle que soit la nature de leur");
      L.push("contrat.");
      L.push("   Somme des horaires contractuels : [ ] h  ·  durée retenue : [ ] h");
      L.push("   Nombre retenu : [ ]");
      L.push("");
      L.push("EXCLUSIONS À MOTIVER — le 2° de L. 1111-2 exclut du décompte les salariés");
      L.push("titulaires d'un contrat à durée déterminée et les salariés mis à disposition");
      L.push("par une entreprise extérieure, salariés temporaires compris, LORSQU'ILS");
      L.push("REMPLACENT un salarié absent ou dont le contrat de travail est suspendu,");
      L.push("notamment du fait d'un congé de maternité, d'un congé d'adoption ou d'un congé");
      L.push("parental d'éducation.");
      L.push("");
      L.push("   [Lister chaque exclusion : nom ou matricule, contrat, salarié remplacé, motif");
      L.push("    de l'absence. Une exclusion non motivée se retourne contre celui qui l'a");
      L.push("    pratiquée.]");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le " + leJour(d0) + ".");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièces jointes : les états d'effectif mensuels ou les déclarations sociales");
      L.push("nominatives correspondantes.");
      L.push("");

      titre(L, "3 — Ce que le franchissement déclenche");
      L.push("« Lorsque le seuil de onze salariés a été franchi dans les conditions prévues");
      L.push("au deuxième alinéa de l'article L. 2311-2, l'employeur informe le personnel");
      L.push("tous les quatre ans de l'organisation des élections par tout moyen permettant");
      L.push("de conférer DATE CERTAINE à cette information. Le document diffusé précise la");
      L.push("DATE ENVISAGÉE POUR LE PREMIER TOUR. Celui-ci doit se tenir, au plus tard, le");
      L.push("QUATRE-VINGT-DIXIÈME JOUR suivant la diffusion » (L. 2314-4).");
      L.push("");
      L.push("Trois exigences, et elles se prouvent chacune séparément :");
      L.push("  · l'information est diffusée ;");
      L.push("  · elle porte date certaine ;");
      L.push("  · elle précise la date envisagée du premier tour.");
      L.push("");
      L.push("La note d'information elle-même, ses deux invitations syndicales et le");
      L.push("procès-verbal de carence sont produits par le document du point CSE-CTL-MEP-02");
      L.push("de ce même module : ce document-ci s'arrête au constat du franchissement.");

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — vous datez et signez l'état des effectifs",
        "mensuels, et vous y portez la date de franchissement.",
        "",
        "Si le seuil est franchi et qu'aucune information du personnel n'est encore partie,",
        "elle doit partir sans attendre. En partant aujourd'hui, le premier tour devrait se",
        "tenir au plus tard le " + leJour(dans(d0, 90)) + " — quatre-vingt-dix jours après la",
        "diffusion (L. 2314-4). Ce n'est pas une cible : c'est un maximum.",
        "",
        "Prévoyez à rebours, dans cet intervalle : l'invitation des organisations",
        "syndicales à négocier le protocole doit leur PARVENIR au plus tard quinze jours",
        "avant la première réunion de négociation. En partant aujourd'hui, cette première",
        "réunion ne peut donc pas se tenir avant le " + leJour(dans(d0, 15)) + ".",
        "",
        "Ensuite — tous les quatre ans, l'information du personnel est renouvelée",
        "(L. 2314-4). Portez dès maintenant l'échéance suivante à votre agenda.",
      ]);

      return pied(L, ["L. 1111-2", "L. 2311-2", "L. 2314-4"]);
    },
  });

  /* ══════════════════════════════════════════════════════════════════════════
     PÉRIMÈTRE — L'AUTONOMIE DE GESTION
     ══════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CSE-CTL-PER-02", {
    nom: "Le recueil des délégations de pouvoir des responsables d'établissement, avec sa trame et sa fiche d'autonomie",
    detail: "La trame de délégation de pouvoir portant sur la gestion du personnel, la " +
            "fiche d'autonomie à remplir établissement par établissement, le courrier de " +
            "demande aux responsables, et le bordereau du recueil.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var multi = oui(f.etablissementsMultiples);
      var source = f.sourceDecoupage;
      var etabs = cro(p.etablissementsDistincts, "nombre d'établissements distincts");
      var L = [];

      L = L.concat(entete(ctx, "Recueil des délégations de pouvoir des responsables d'établissement",
        "articles L. 2313-2 et L. 2313-4 du code du travail"));
      usage(L);

      L.push("POURQUOI CE RECUEIL, ET POURQUOI LUI SEUL NE SUFFIT PAS");
      L.push("");
      L.push("« En l'absence d'accord conclu dans les conditions mentionnées aux articles");
      L.push("L. 2313-2 et L. 2313-3, l'employeur fixe le nombre et le périmètre des");
      L.push("établissements distincts, COMPTE TENU DE L'AUTONOMIE DE GESTION DU RESPONSABLE");
      L.push("DE L'ÉTABLISSEMENT, NOTAMMENT EN MATIÈRE DE GESTION DU PERSONNEL »");
      L.push("(L. 2313-4).");
      L.push("");
      L.push("C'est le seul critère que le texte retienne lorsque le découpage est fixé par");
      L.push("l'employeur. Sans pièce, l'autonomie n'est pas établie — et le périmètre, donc");
      L.push("les élections tenues sur ce périmètre, reste contestable.");
      L.push("");
      L.push("L'ORDRE DES SOURCES D'ABORD. L'article L. 2313-2 confie la détermination du");
      L.push("nombre et du périmètre des établissements distincts à UN ACCORD D'ENTREPRISE");
      L.push("conclu dans les conditions prévues au premier alinéa de l'article L. 2232-12.");
      L.push("L'employeur ne les fixe qu'« en l'absence » d'un tel accord (L. 2313-4). Si");
      L.push("votre découpage repose sur un accord régulier, ce recueil n'est pas commandé");
      L.push("par L. 2313-4 — il reste utile, mais il n'est pas dû à ce titre.");
      L.push("");
      L.push("  Votre entreprise comporte-t-elle plusieurs établissements distincts ? " +
        (multi === true ? "oui" : multi === false ? "non" : "[à renseigner]"));
      L.push("  Source du découpage portée au dossier : " +
        (source ? String(source) : "[accord d'entreprise / décision unilatérale / décision administrative]"));
      L.push("  Nombre d'établissements distincts : " + etabs);
      L.push("");
      if (multi === false) {
        L.push("Votre dossier déclare une entreprise à instance unique. Le présent recueil");
        L.push("n'a alors pas d'objet : conservez-le pour le jour où un découpage sera");
        L.push("envisagé, car c'est ce jour-là qu'il faudra l'établir, et non après.");
        L.push("");
      }

      titre(L, "1 — Trame de délégation de pouvoir");
      L.push("Une par établissement. Ce qui suit est une TRAME : les matières déléguées, la");
      L.push("chose la plus importante du document, ne peuvent pas être devinées par");
      L.push("l'application — elles dépendent de votre organisation réelle, et une");
      L.push("délégation qui ne correspond pas aux faits ne prouve rien.");
      L.push("");
      L.push(nom(ctx));
      L.push(cro(p.adresse, "adresse du siège"));
      L.push("");
      L.push("DÉLÉGATION DE POUVOIR");
      L.push("Établissement de [DÉNOMINATION ET ADRESSE DE L'ÉTABLISSEMENT]");
      L.push("");
      L.push("Entre " + nom(ctx) + ", représentée par " + signataire(ctx) + ",");
      L.push("et [NOM, PRÉNOM, FONCTION DU RESPONSABLE D'ÉTABLISSEMENT], ci-après le");
      L.push("délégataire.");
      L.push("");
      L.push("Article 1 — Objet");
      L.push("Le délégataire reçoit délégation pour diriger l'établissement de [ ] et y");
      L.push("exercer, dans les matières énumérées à l'article 2, les pouvoirs de");
      L.push("l'employeur.");
      L.push("");
      L.push("Article 2 — Matières déléguées");
      L.push("La délégation porte sur la GESTION DU PERSONNEL, que l'article L. 2313-4 cite");
      L.push("expressément, et notamment sur :");
      L.push("   a) [l'embauche : entretiens, choix des candidats, signature des contrats de");
      L.push("      travail — préciser les limites, s'il y en a] ;");
      L.push("   b) [la discipline : conduite des procédures et prononcé des sanctions —");
      L.push("      préciser lesquelles] ;");
      L.push("   c) [l'organisation et la durée du travail : horaires, plannings, heures");
      L.push("      supplémentaires, congés] ;");
      L.push("   d) [la rupture des contrats de travail — préciser si elle est déléguée, et");
      L.push("      dans quelles limites] ;");
      L.push("   e) [la santé et la sécurité dans l'établissement] ;");
      L.push("   f) [le budget de l'établissement et les engagements de dépense, dans la");
      L.push("      limite de … ].");
      L.push("");
      L.push("[Supprimez ce que vous ne déléguez pas. Une délégation gonflée pour les besoins");
      L.push("de la démonstration se retourne contre celui qui l'a écrite : elle sera");
      L.push("confrontée aux faits.]");
      L.push("");
      L.push("Article 3 — Moyens");
      L.push("Le délégataire dispose de [l'autorité, la compétence et les moyens : effectif");
      L.push("placé sous son autorité, budget propre, pouvoir de signature — décrire].");
      L.push("");
      L.push("Article 4 — Durée et fin");
      L.push("La présente délégation prend effet le [DATE] et demeure en vigueur jusqu'à");
      L.push("[terme ou révocation expresse].");
      L.push("");
      L.push("Fait en deux exemplaires à " + lieu(ctx) + ", le [DATE].");
      L.push("");
      L.push("Le délégant                                Le délégataire");
      L.push(signataire(ctx) + "     [Nom et signature]");
      L.push("");

      titre(L, "2 — Fiche d'autonomie, un exemplaire par établissement");
      L.push("La délégation écrite dit ce qui est permis ; la fiche dit ce qui se fait. Le");
      L.push("juge se prononce au regard de l'ensemble des circonstances de fait, non sur");
      L.push("une affirmation : c'est cette seconde colonne qui emporte la décision.");
      L.push("");
      L.push("   Établissement : [ ]   ·   responsable : [ ]   ·   effectif : [ ]");
      L.push("");
      L.push("   Élément                                   Prévu par la délégation · Constaté en fait");
      L.push("   Embauche et signature des contrats ......  [oui/non] · [nombre de contrats signés sur l'année, avec exemples]");
      L.push("   Discipline et sanctions prononcées ......  [oui/non] · [nombre et nature des sanctions prononcées sur l'année]");
      L.push("   Organisation et durée du travail ........  [oui/non] · [décisions prises : plannings, horaires, heures supplémentaires]");
      L.push("   Budget propre de l'établissement ........  [oui/non] · [montant et périmètre]");
      L.push("   Organigramme rattachant le personnel ....  [oui/non] · [pièce jointe]");
      L.push("   Rupture des contrats de travail .........  [oui/non] · [nombre sur l'année]");
      L.push("");
      L.push("   Pièces jointes à la fiche : délégation signée · organigramme · budget ·");
      L.push("   exemples de contrats signés · exemples de sanctions prononcées.");
      L.push("");
      L.push("   Établie le [DATE] par [nom et qualité].");
      L.push("");

      courrier(L, 1, "demande aux responsables d'établissement", [
        "Un exemplaire par responsable. Joignez-y la trame de l'article 1 et la fiche de",
        "l'article 2 : demander « vos délégations » sans dire ce qu'on en fera ne ramène",
        "rien d'exploitable.",
      ]);
      papier(L, ctx, ["[Nom et prénom du responsable]",
                      "Responsable de l'établissement de [ ]"], leJour(d0));
      L.push("Objet : délégation de pouvoir et éléments d'autonomie de gestion");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Le nombre et le périmètre des établissements distincts de l'entreprise doivent");
      L.push("être établis compte tenu de l'autonomie de gestion du responsable de chaque");
      L.push("établissement, notamment en matière de gestion du personnel (article L. 2313-4");
      L.push("du code du travail).");
      L.push("");
      L.push("Je vous prie de bien vouloir me retourner, pour le " + leJour(dans(d0, 21)) + " :");
      L.push("  · votre délégation de pouvoir écrite, datée et signée — ou, si elle n'existe");
      L.push("    pas encore, la trame ci-jointe renseignée de vos matières réelles ;");
      L.push("  · la fiche d'autonomie ci-jointe, renseignée ;");
      L.push("  · l'organigramme de l'établissement, le budget dont vous disposez, et des");
      L.push("    exemples de contrats de travail signés et de sanctions prononcées par vous");
      L.push("    au cours des douze derniers mois.");
      L.push("");
      L.push("Ces pièces ne servent pas à apprécier votre travail : elles établissent le");
      L.push("périmètre sur lequel les instances représentatives du personnel sont élues.");
      L.push("");
      salutation(L, ctx, "Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération distinguée.");
      L.push("Pièces jointes : trame de délégation de pouvoir · fiche d'autonomie");
      L.push("");

      titre(L, "3 — Bordereau du recueil");
      L.push("Le recueil complet, daté, versé au dossier : c'est lui qui répond au contrôle.");
      L.push("");
      L.push("   Établissement · responsable · délégation signée le · fiche établie le · pièces jointes");
      L.push("   [ ] · [ ] · [ ] · [ ] · [ ]");
      L.push("   [ ] · [ ] · [ ] · [ ] · [ ]");
      L.push("   [ ] · [ ] · [ ] · [ ] · [ ]");
      L.push("");
      L.push("Nombre d'établissements distincts retenus : " + etabs + " · nombre de délégations");
      L.push("versées : [ ]. Ces deux nombres doivent être égaux ; un établissement sans");
      L.push("délégation est un établissement dont l'autonomie n'est pas établie.");
      L.push("");
      L.push("Recueil arrêté à " + lieu(ctx) + ", le " + leJour(d0) + ".");
      L.push("");
      L.push(signataire(ctx));

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — vous adressez le courrier 1 aux responsables",
        "d'établissement, avec la trame et la fiche.",
        "",
        "Le " + leJour(dans(d0, 21)) + " — retour attendu des délégations et des fiches. Trois",
        "semaines suffisent : les pièces existent, il s'agit de les réunir.",
        "",
        "Le " + leJour(dans(d0, 28)) + " — vous arrêtez le bordereau du recueil, vous le datez",
        "et vous le versez au dossier.",
        "",
        "Ensuite, à chaque mouvement — un changement de responsable, une réorganisation,",
        "un transfert d'activité modifie l'autonomie réelle. Le recueil se met à jour ce",
        "jour-là, et non lorsque le périmètre est contesté.",
      ]);

      return pied(L, ["L. 2232-12", "L. 2313-2", "L. 2313-4"]);
    },
  });

  /* ══════════════════════════════════════════════════════════════════════════
     CONSULTATIONS — LE NIVEAU CONSULTÉ
     ══════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CSE-CTL-CON-04", {
    nom: "La note de saisine précisant le niveau de consultation, ses deux courriers et son calendrier des sept jours",
    detail: "La qualification du projet, la saisine du comité central, celle de chaque " +
            "comité d'établissement concerné, et le calendrier qui fait remonter les avis " +
            "sept jours avant l'échéance du comité central.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var cons = objet(f.consultation);
      var inst = f.instanceConsultee;
      var mesures = oui(f.mesuresAdaptation);
      var remise = dateDe(cons.dateRemise);
      var expert = oui(cons.expertise);
      var L = [];

      L = L.concat(entete(ctx, "Note de saisine — niveau de consultation retenu",
        "articles L. 2316-1, L. 2316-20, L. 2316-22 et R. 2312-6 du code du travail"));
      usage(L);

      L.push("LA QUESTION, ET POURQUOI ELLE N'EST PAS SECONDAIRE");
      L.push("");
      L.push("Consulter le mauvais niveau, c'est ne pas consulter. La décision prise ensuite");
      L.push("repose alors sur une consultation qui n'en était pas une, et rien dans le");
      L.push("dossier ne le signale : les convocations existent, les procès-verbaux aussi.");
      L.push("");
      L.push("« Le comité social et économique central d'entreprise exerce les attributions");
      L.push("qui concernent la marche générale de l'entreprise et qui excèdent les limites");
      L.push("des pouvoirs des chefs d'établissement. IL EST SEUL CONSULTÉ SUR : 1° Les");
      L.push("projets décidés au niveau de l'entreprise qui NE COMPORTENT PAS de mesures");
      L.push("d'adaptation spécifiques à un ou plusieurs établissements. Dans ce cas, son");
      L.push("avis accompagné des documents relatifs au projet est transmis, par tout moyen,");
      L.push("aux comités sociaux et économiques d'établissement ; 2° Les projets et");
      L.push("consultations récurrentes décidés au niveau de l'entreprise lorsque leurs");
      L.push("éventuelles mesures de mise en œuvre, qui feront ultérieurement l'objet d'une");
      L.push("consultation spécifique au niveau approprié, ne sont pas encore définies ;");
      L.push("3° Les mesures d'adaptation COMMUNES À PLUSIEURS ÉTABLISSEMENTS des projets");
      L.push("prévus au 4° du II de l'article L. 2312-8 » (L. 2316-1).");
      L.push("");
      L.push("« Le comité social et économique d'établissement a les mêmes attributions que");
      L.push("le comité social et économique d'entreprise, DANS LA LIMITE DES POUVOIRS");
      L.push("CONFIÉS AU CHEF DE CET ÉTABLISSEMENT. Le comité social et économique");
      L.push("d'établissement est consulté sur les mesures d'adaptation des décisions");
      L.push("arrêtées au niveau de l'entreprise SPÉCIFIQUES À L'ÉTABLISSEMENT et qui");
      L.push("relèvent de la compétence du chef de cet établissement » (L. 2316-20).");
      L.push("");
      L.push("Le 4° du II de l'article L. 2312-8, auquel le 3° de L. 2316-1 renvoie, vise");
      L.push("« l'introduction de nouvelles technologies, tout aménagement important");
      L.push("modifiant les conditions de santé et de sécurité ou les conditions de");
      L.push("travail ».");
      L.push("");

      titre(L, "1 — La qualification du projet");
      L.push(nom(ctx));
      L.push("");
      L.push("NOTE DE SAISINE — NIVEAU DE CONSULTATION RETENU");
      L.push("");
      L.push("Projet : [INTITULÉ DU PROJET]");
      L.push("Décidé au niveau : [de l'entreprise / de l'établissement de …]");
      L.push("Date de la décision d'engager la consultation : [DATE]");
      L.push("");
      L.push("QUATRE QUESTIONS, DANS CET ORDRE. La réponse à la quatrième découle des trois");
      L.push("premières ; ne la donnez pas avant.");
      L.push("");
      L.push("  1. Le projet comporte-t-il des mesures d'adaptation SPÉCIFIQUES à un ou");
      L.push("     plusieurs établissements ? .......... " +
        (mesures === true ? "oui (porté au dossier)" : mesures === false ? "non (porté au dossier)" : "[oui / non]"));
      L.push("     Si oui, lesquelles et pour quels établissements : [ ]");
      L.push("");
      L.push("  2. Ces mesures relèvent-elles de la COMPÉTENCE DU CHEF de l'établissement");
      L.push("     concerné ? (L. 2316-20) .............. [oui / non]");
      L.push("     Fondement : [délégation de pouvoir du responsable, en date du …]");
      L.push("");
      L.push("  3. Les mesures d'adaptation sont-elles COMMUNES à plusieurs établissements,");
      L.push("     et le projet relève-t-il du 4° du II de L. 2312-8 — introduction de");
      L.push("     nouvelles technologies, aménagement important modifiant les conditions de");
      L.push("     santé et de sécurité ou les conditions de travail ? ...... [oui / non]");
      L.push("     Si oui, le comité central est SEUL consulté (L. 2316-1, 3°).");
      L.push("");
      L.push("  4. NIVEAU RETENU : [le comité central seul / le comité central et les comités");
      L.push("     d'établissement de … / les comités d'établissement de …]");
      L.push("     Instance portée au dossier : " + (inst ? String(inst) : "[non renseignée]"));
      L.push("");
      if (mesures === true && String(inst) === "central") {
        L.push("  ATTENTION — votre dossier déclare à la fois des mesures d'adaptation");
        L.push("  spécifiques à des établissements et une consultation du seul comité central.");
        L.push("  Les deux ne se concilient pas : les comités d'établissement concernés");
        L.push("  doivent également être consultés sur les mesures qui leur sont propres");
        L.push("  (L. 2316-20).");
        L.push("");
      }
      L.push("Fait à " + lieu(ctx) + ", le " + leJour(d0) + ".");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      courrier(L, 1, "saisine du comité social et économique central", [
        "À adresser dans tous les cas : le comité central est consulté seul, ou en même",
        "temps que les comités d'établissement.",
      ]);
      papier(L, ctx, ["Aux membres du comité social et économique central",
                      "d'entreprise"], leJour(d0));
      L.push("Objet : consultation sur [INTITULÉ DU PROJET]");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Je vous saisis pour avis du projet suivant : [INTITULÉ ET OBJET].");
      L.push("");
      L.push("Ce projet est décidé au niveau de l'entreprise. [Il ne comporte pas de mesures");
      L.push("d'adaptation spécifiques à un ou plusieurs établissements : votre comité est");
      L.push("donc seul consulté (L. 2316-1, 1°), et le présent avis, accompagné des");
      L.push("documents relatifs au projet, sera transmis par tout moyen aux comités sociaux");
      L.push("et économiques d'établissement.] [Ou : il comporte des mesures d'adaptation");
      L.push("spécifiques aux établissements de …, sur lesquelles les comités");
      L.push("d'établissement concernés sont saisis parallèlement (L. 2316-20).]");
      L.push("");
      L.push("Les informations nécessaires à votre avis vous sont [remises avec la présente /");
      L.push("mises à disposition dans la base de données économiques, sociales et");
      L.push("environnementales, ce dont la présente vaut information]. C'est de cette");
      L.push("communication, ou de cette information de mise à disposition, que court le");
      L.push("délai de consultation (R. 2312-5).");
      L.push("");
      L.push("La réunion est fixée au [DATE], l'ordre du jour vous étant communiqué trois");
      L.push("jours au moins à l'avance.");
      L.push("");
      salutation(L, ctx);
      L.push("Pièces jointes : note de présentation du projet · [documents afférents]");
      L.push("");

      courrier(L, 2, "saisine d'un comité social et économique d'établissement", [
        "Un exemplaire par établissement concerné, et seulement s'il existe des mesures",
        "d'adaptation qui lui sont spécifiques ET relèvent de la compétence de son chef",
        "(L. 2316-20). Saisir un comité d'établissement d'un projet qui excède les pouvoirs",
        "de son chef ne régularise rien : c'est le comité central qui est compétent.",
      ]);
      papier(L, ctx, ["Aux membres du comité social et économique",
                      "de l'établissement de [ ]"], "[DATE D'ENVOI]");
      L.push("Objet : consultation sur les mesures d'adaptation du projet [INTITULÉ]");
      L.push("spécifiques à l'établissement de [ ]");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Le projet [INTITULÉ], décidé au niveau de l'entreprise, comporte des mesures");
      L.push("d'adaptation spécifiques à votre établissement et relevant de la compétence de");
      L.push("son chef. Votre comité est consulté sur ces mesures, en application de");
      L.push("l'article L. 2316-20 du code du travail.");
      L.push("");
      L.push("   Mesures d'adaptation soumises à votre avis : [ÉNUMÉRER]");
      L.push("");
      L.push("Le comité social et économique central est parallèlement consulté sur le projet");
      L.push("lui-même.");
      L.push("");
      L.push("VOTRE AVIS DOIT ÊTRE RENDU ET TRANSMIS AU COMITÉ CENTRAL AU PLUS TARD LE");
      L.push("[DATE], soit sept jours avant la date à laquelle celui-ci est réputé avoir été");
      L.push("consulté et avoir rendu un avis négatif. À défaut, votre avis est réputé");
      L.push("négatif (R. 2312-6, II).");
      L.push("");
      salutation(L, ctx);
      L.push("Pièces jointes : note de présentation des mesures d'adaptation");
      L.push("");

      titre(L, "2 — Le calendrier des deux niveaux (R. 2312-6, II)");
      L.push("« Lorsqu'il y a lieu de consulter à la fois le comité social et économique");
      L.push("central et un ou plusieurs comités d'établissement en application du second");
      L.push("alinéa de l'article L. 2316-22, les délais prévus au I s'appliquent AU COMITÉ");
      L.push("CENTRAL. Dans ce cas, l'avis de chaque comité d'établissement est rendu et");
      L.push("transmis au comité social et économique central AU PLUS TARD SEPT JOURS AVANT");
      L.push("la date à laquelle ce dernier est réputé avoir été consulté et avoir rendu un");
      L.push("avis négatif en application du I. A défaut, l'avis du comité d'établissement");
      L.push("est réputé négatif » (R. 2312-6, II).");
      L.push("");
      L.push("Un accord peut définir l'ordre et les délais dans lesquels les avis sont rendus");
      L.push("et transmis (L. 2316-22) : cherchez-le d'abord, R. 2312-6 ne joue qu'« à défaut");
      L.push("d'accord ».");
      L.push("");
      L.push("À défaut d'accord, le délai du comité central est d'UN MOIS à compter de la");
      L.push("date prévue à R. 2312-5 ; DEUX MOIS en cas d'intervention d'un expert ; TROIS");
      L.push("MOIS en cas d'intervention d'une ou plusieurs expertises dans le cadre d'une");
      L.push("consultation se déroulant à la fois au niveau du comité central et d'un ou");
      L.push("plusieurs comités d'établissement (R. 2312-6, I).");
      L.push("");
      L.push("   Remise des informations, ou information de leur mise à disposition : " +
        (remise ? leJour(remise) : "[DATE]"));
      L.push("   Expertise en cours : " + (expert === true ? "oui" : expert === false ? "non" : "[oui / non]"));
      var jours = expert === true ? 60 : 30;
      if (remise) {
        L.push("   Délai retenu : " + (expert === true ? "deux mois (expertise)" : "un mois (à défaut d'accord et sans expertise)"));
        L.push("   Le comité central est réputé avoir rendu un avis négatif le : " + leJour(dans(remise, jours)));
        L.push("   Les avis des comités d'établissement doivent lui être transmis au plus tard");
        L.push("   le : " + leJour(dans(remise, jours - 7)));
      } else {
        L.push("   Délai retenu : [un mois / deux mois avec expert / trois mois]");
        L.push("   Échéance du comité central : [DATE DE REMISE + délai]");
        L.push("   Transmission des avis d'établissement : [cette échéance moins sept jours]");
      }
      L.push("");
      L.push("Ces deux dates figurent au courrier 2 : c'est pour cela qu'elles y figurent.");

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — vous qualifiez le projet (partie 1) et vous",
        "adressez le courrier 1 au comité central, avec les informations.",
        "",
        (remise
          ? "Le délai court depuis le " + leJour(remise) + ", date de remise portée au dossier."
          : "Le délai courra de la remise des informations, ou de l'information de leur mise") ,
        (remise ? "" : "à disposition dans la base de données (R. 2312-5) — pas de la convocation."),
        "",
        (remise
          ? "Le " + leJour(dans(remise, jours - 7)) + " — dernier jour pour que les avis des comités"
          : "Sept jours avant l'échéance du comité central — dernier jour pour que les avis"),
        (remise ? "d'établissement parviennent au comité central." : "des comités d'établissement lui parviennent."),
        "",
        (remise
          ? "Le " + leJour(dans(remise, jours)) + " — le comité central est réputé consulté et avoir"
          : "À l'échéance — le comité central est réputé consulté et avoir rendu un avis"),
        (remise ? "rendu un avis négatif s'il ne s'est pas prononcé (R. 2312-6, I)." : "négatif s'il ne s'est pas prononcé (R. 2312-6, I)."),
        "",
        "Après l'avis — s'il s'agissait d'un projet du 1° de L. 2316-1, l'avis du comité",
        "central accompagné des documents relatifs au projet est transmis, par tout moyen,",
        "aux comités d'établissement. Cette transmission n'est pas une consultation : elle",
        "est due quand même.",
      ]);

      return pied(L, ["L. 2312-8", "L. 2316-1", "L. 2316-20", "L. 2316-22",
                      "R. 2312-5", "R. 2312-6"]);
    },
  });

  /* ══════════════════════════════════════════════════════════════════════════
     LES MOYENS DU COMITÉ
     ══════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CSE-CTL-MOY-01", {
    nom: "La note de rétablissement du crédit d'heures, la décision sur les moyens matériels et la régularisation de paie",
    detail: "Le volume dû lu dans le tableau de R. 2314-1, la vérification du volume global " +
            "que L. 2314-7 impose au protocole, la décision de mise à disposition du local " +
            "et du matériel, et l'ordre de régularisation des heures non accordées.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var eff = effectifDe(ctx);
      var accordees = nb(f.heuresAccordees);
      var d = delegationLegale(eff);
      var L = [];

      L = L.concat(entete(ctx, "Crédit d'heures de délégation et moyens matériels du comité",
        "articles L. 2314-7, L. 2315-7 à L. 2315-16, L. 2315-20, L. 2315-25 et R. 2314-1 du code du travail"));
      usage(L);

      L.push("L'ORDRE DES SOURCES — ET LA CONTREPARTIE QUE LE PROTOCOLE DOIT RESPECTER");
      L.push("");
      L.push("  1er étage — le PROTOCOLE PRÉÉLECTORAL peut modifier le nombre de sièges ou le");
      L.push("     volume des heures individuelles de délégation, « DÈS LORS QUE LE VOLUME");
      L.push("     GLOBAL DE CES HEURES, AU SEIN DE CHAQUE COLLÈGE, EST AU MOINS ÉGAL À CELUI");
      L.push("     RÉSULTANT DES DISPOSITIONS LÉGALES au regard de l'effectif de");
      L.push("     l'entreprise » (L. 2314-7). Un protocole qui abaisse ce volume global ne");
      L.push("     vaut pas : les heures manquantes restent dues.");
      L.push("");
      L.push("  2e étage — À DÉFAUT DE STIPULATIONS dans l'accord prévu à L. 2314-7, le temps");
      L.push("     mensuel nécessaire est fixé dans les limites du tableau de R. 2314-1. Ce");
      L.push("     nombre d'heures PEUT ÊTRE AUGMENTÉ en cas de circonstances");
      L.push("     exceptionnelles (R. 2314-1).");
      L.push("");
      L.push("  PLANCHER ABSOLU — le nombre d'heures de délégation « ne peut être inférieur à");
      L.push("     DIX HEURES par mois dans les entreprises de moins de cinquante salariés et");
      L.push("     à SEIZE HEURES dans les autres entreprises » (L. 2315-7). Aucun accord, ni");
      L.push("     aucun protocole, ne descend en dessous.");
      L.push("");

      titre(L, "1 — Votre décompte");
      L.push("  Effectif retenu ............................ " +
        (eff == null ? "[à renseigner]" : eff + " salariés"));
      if (d && d.du && d.titulaires != null) {
        L.push("  Tranche du tableau de R. 2314-1 ............ " + d.tranche + " salariés");
        L.push("  Titulaires prévus par le tableau ........... " + d.titulaires);
        L.push("  Heures par titulaire et par mois ........... " + d.heures + " h");
        L.push("  VOLUME GLOBAL MENSUEL DÛ ................... " + d.total + " h" +
          " (" + d.titulaires + " × " + d.heures + ")");
      } else if (d && d.du === false) {
        L.push("  " + d.motif);
      } else {
        L.push("  Tranche du tableau de R. 2314-1 ............ [à relever dans le tableau]");
        L.push("  Titulaires prévus · heures par titulaire ... [ ] · [ ] h");
        L.push("  VOLUME GLOBAL MENSUEL DÛ ................... [titulaires × heures]");
      }
      L.push("  Volume effectivement accordé ............... " +
        (accordees == null ? "[à renseigner]" : accordees + " h par mois"));
      if (d && d.du && d.total != null && accordees != null) {
        var ecart = d.total - accordees;
        L.push("  ÉCART ...................................... " +
          (ecart > 0 ? ecart + " h par mois MANQUANTES" : "aucun — le volume légal est atteint"));
        if (ecart > 0) {
          L.push("");
          L.push("  Ces " + ecart + " heures mensuelles sont dues. Le temps passé en délégation est");
          L.push("  de plein droit considéré comme temps de travail et payé à l'échéance");
          L.push("  normale (L. 2315-10) : les heures non accordées ne s'éteignent pas, elles");
          L.push("  se régularisent.");
        }
      }
      L.push("");
      L.push("  Le tableau de R. 2314-1 s'apprécie DANS LE CADRE DE L'ENTREPRISE OU DE CHAQUE");
      L.push("  ÉTABLISSEMENT DISTINCT (R. 2314-1). Si votre entreprise comporte plusieurs");
      L.push("  établissements distincts, reprenez ce décompte pour chacun.");
      L.push("");

      titre(L, "2 — Note de rétablissement du crédit d'heures");
      L.push(nom(ctx));
      L.push("");
      L.push("NOTE DE RÉTABLISSEMENT DU CRÉDIT D'HEURES DE DÉLÉGATION");
      L.push("");
      L.push("Article 1 — Volume rétabli");
      L.push("À compter du [DATE D'EFFET], chaque membre titulaire de la délégation du");
      L.push("personnel du comité social et économique dispose de " +
        (d && d.heures != null ? d.heures : "[ ]") + " heures de délégation");
      L.push("par mois, soit un volume global de " + (d && d.total != null ? d.total : "[ ]") +
        " heures mensuelles pour " + (d && d.titulaires != null ? d.titulaires : "[ ]") + " titulaires.");
      L.push("");
      L.push("Article 2 — Fondement retenu");
      L.push("[Rayer la mention inutile.]");
      L.push("  · le tableau de l'article R. 2314-1, à défaut de stipulations dans l'accord");
      L.push("    prévu à l'article L. 2314-7 ;");
      L.push("  · l'accord ou le protocole du [date], dont le volume global par collège a été");
      L.push("    vérifié au moins égal à celui du tableau (L. 2314-7) : [détail par collège].");
      L.push("");
      L.push("Article 3 — Circonstances exceptionnelles");
      L.push("Ce nombre d'heures peut être augmenté en cas de circonstances exceptionnelles");
      L.push("(R. 2314-1). [Préciser, le cas échéant, la procédure retenue pour en décider.]");
      L.push("");
      L.push("Article 4 — Ce qui ne s'impute pas sur le crédit");
      L.push("Est payé comme temps de travail effectif, SANS ÊTRE DÉDUIT des heures de");
      L.push("délégation, le temps passé par les membres de la délégation du personnel :");
      L.push("  1° à la recherche de mesures préventives dans toute situation d'urgence et de");
      L.push("     gravité, notamment lors de la mise en œuvre de la procédure de danger");
      L.push("     grave et imminent prévue à l'article L. 4132-2 ;");
      L.push("  2° aux réunions du comité et de ses commissions, dans ce cas dans la limite");
      L.push("     d'une durée globale fixée par accord d'entreprise ou, à défaut, par décret");
      L.push("     en Conseil d'État ;");
      L.push("  3° aux enquêtes menées après un accident du travail grave ou des incidents");
      L.push("     répétés ayant révélé un risque grave ou une maladie professionnelle ou à");
      L.push("     caractère professionnel grave (L. 2315-11).");
      L.push("");
      L.push("À DÉFAUT D'ACCORD D'ENTREPRISE, le temps passé aux réunions mentionnées au 2°");
      L.push("n'est pas déduit du crédit dès lors que la durée annuelle globale de ces");
      L.push("réunions n'excède pas TRENTE HEURES pour les entreprises de 300 à 1 000");
      L.push("salariés et SOIXANTE HEURES pour les entreprises d'au moins 1 000 salariés");
      L.push("(R. 2315-7). Par dérogation, le temps passé aux réunions de la commission");
      L.push("santé, sécurité et conditions de travail est rémunéré comme du temps de travail");
      L.push("et n'est pas déduit des heures de délégation (R. 2315-7, dernier alinéa).");
      L.push("");
      L.push("Le temps consacré aux formations prévues au chapitre est pris sur le temps de");
      L.push("travail, rémunéré comme tel, et n'est pas déduit des heures de délégation");
      L.push("(L. 2315-16).");
      L.push("");
      L.push("Article 5 — Report et répartition");
      L.push("Le temps prévu à L. 2315-7 peut être utilisé cumulativement DANS LA LIMITE DE");
      L.push("DOUZE MOIS, sans qu'un membre puisse disposer dans le mois de plus d'une fois");
      L.push("et demie son crédit ; le représentant informe l'employeur au plus tard HUIT");
      L.push("JOURS avant la date prévue d'utilisation (R. 2315-5).");
      L.push("");
      L.push("La répartition des heures entre les membres (L. 2315-9) ne peut conduire l'un");
      L.push("d'eux à disposer, dans le mois, de plus d'une fois et demie le crédit d'un");
      L.push("titulaire au sens de R. 2314-1 ; les titulaires concernés informent l'employeur");
      L.push("du nombre d'heures réparties au titre de chaque mois AU PLUS TARD HUIT JOURS");
      L.push("avant la date prévue pour leur utilisation, par un document écrit précisant");
      L.push("leur identité et le nombre d'heures mutualisées pour chacun (R. 2315-6).");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le " + leJour(d0) + ".");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      titre(L, "3 — Décision de mise à disposition du local et du matériel");
      L.push("Les heures ne sont pas le seul moyen que la loi impose, et les autres");
      L.push("s'oublient plus facilement encore parce qu'ils ne se comptent pas.");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("DÉCISION DE MISE À DISPOSITION DES MOYENS DU COMITÉ SOCIAL ET ÉCONOMIQUE");
      L.push("");
      L.push("Article 1 — Local du comité (L. 2315-25)");
      L.push("L'employeur met à la disposition du comité social et économique UN LOCAL");
      L.push("AMÉNAGÉ et LE MATÉRIEL NÉCESSAIRE à l'exercice de ses fonctions.");
      L.push("   Local affecté : [désignation, bâtiment, étage, surface]");
      L.push("   Conditions d'accès : [clés, horaires, badge]");
      L.push("   Matériel mis à disposition : [table et sièges, armoire fermant à clé, poste");
      L.push("   informatique, imprimante, ligne téléphonique, accès internet, adresse de");
      L.push("   messagerie — énumérer précisément : « le matériel nécessaire » se prouve par");
      L.push("   une liste, pas par une affirmation]");
      L.push("");
      L.push("Article 2 — Local de la délégation du personnel (L. 2315-20)");
      L.push("L'employeur met à la disposition des membres de la délégation du personnel LE");
      L.push("LOCAL NÉCESSAIRE pour leur permettre d'accomplir leur mission et, notamment, de");
      L.push("se réunir.");
      L.push("   [Préciser s'il s'agit du même local ou d'un autre.]");
      L.push("");
      L.push("Article 3 — Réunions d'information dans le local (L. 2315-26)");
      L.push("Le comité peut organiser, dans le local mis à sa disposition, des réunions");
      L.push("d'information internes au personnel, portant notamment sur des problèmes");
      L.push("d'actualité, et inviter des personnalités extérieures, syndicales ou autres,");
      L.push("dans les conditions prévues par les articles L. 2142-10 et L. 2142-11. Ces");
      L.push("réunions ont lieu EN DEHORS DU TEMPS DE TRAVAIL des participants ; toutefois,");
      L.push("les membres de la délégation du personnel peuvent se réunir sur leur temps de");
      L.push("délégation.");
      L.push("[Les articles L. 2142-10 et L. 2142-11, auxquels L. 2315-26 renvoie, ne");
      L.push("figurent pas dans le corpus lu par l'application : ils sont nommés, non");
      L.push("résumés. Vérifiez-en le contenu avant d'écrire une règle d'invitation.]");
      L.push("");
      L.push("Article 4 — Déplacement et circulation (L. 2315-14)");
      L.push("Pour l'exercice de leurs fonctions, les membres élus de la délégation du");
      L.push("personnel et les représentants syndicaux au comité peuvent, DURANT LES HEURES");
      L.push("DE DÉLÉGATION, se déplacer hors de l'entreprise. Ils peuvent également, tant");
      L.push("durant les heures de délégation qu'EN DEHORS DE LEURS HEURES HABITUELLES DE");
      L.push("TRAVAIL, circuler librement dans l'entreprise et y prendre tous contacts");
      L.push("nécessaires à l'accomplissement de leur mission, notamment auprès d'un salarié");
      L.push("à son poste de travail, sous réserve de ne pas apporter de gêne importante à");
      L.push("l'accomplissement du travail des salariés.");
      L.push("");
      L.push("Article 5 — Affichage (L. 2315-15)");
      L.push("Les membres de la délégation du personnel peuvent faire afficher les");
      L.push("renseignements qu'ils ont pour rôle de porter à la connaissance du personnel sur");
      L.push("des emplacements obligatoirement prévus et destinés aux communications");
      L.push("syndicales, ainsi qu'aux portes d'entrée des lieux de travail.");
      L.push("   Emplacements affectés : [énumérer]");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le " + leJour(d0) + ".");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      courrier(L, 1, "notification aux membres du comité et ordre de régularisation", [
        "Adressez la note et la décision aux membres du comité, et transmettez à la paie",
        "l'ordre de régularisation s'il y a des heures manquantes.",
      ]);
      papier(L, ctx, ["Aux membres de la délégation du personnel",
                      "du comité social et économique",
                      "Copie : service de la paie"], leJour(d0));
      L.push("Objet : rétablissement du crédit d'heures de délégation et moyens du comité");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Je vous notifie ci-joint le rétablissement du crédit d'heures de délégation au");
      L.push("volume que les dispositions légales imposent au regard de l'effectif de");
      L.push("l'entreprise, ainsi que la décision de mise à disposition du local et du");
      L.push("matériel.");
      L.push("");
      if (d && d.total != null && accordees != null && d.total - accordees > 0) {
        L.push("Le volume global mensuel passe de " + accordees + " à " + d.total + " heures, soit " +
          (d.total - accordees) + " heures");
        L.push("mensuelles rétablies. Les heures non accordées sur les périodes écoulées sont");
        L.push("régularisées sur la paie de [MOIS] : le temps passé en délégation est de plein");
        L.push("droit du temps de travail payé à l'échéance normale (L. 2315-10).");
      } else {
        L.push("[Le cas échéant : les heures non accordées sur les périodes écoulées sont");
        L.push("régularisées sur la paie de [MOIS] — le temps passé en délégation est de plein");
        L.push("droit du temps de travail payé à l'échéance normale (L. 2315-10).]");
      }
      L.push("");
      salutation(L, ctx);
      L.push("Pièces jointes : note de rétablissement du crédit d'heures · décision de mise à");
      L.push("disposition des moyens");

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — vous arrêtez le décompte, vous signez la note et la",
        "décision, et vous les notifiez aux membres du comité.",
        "",
        "Le rétablissement du crédit prend effet immédiatement : il n'est subordonné à",
        "aucune formalité et à aucun accord. Les heures sont dues du jour où elles le sont.",
        "",
        "Sur la paie du mois suivant — la régularisation des heures non accordées. Si la",
        "paie de ce mois est déjà arrêtée, la régularisation intervient au plus tard sur",
        "celle du mois d'après, soit vers le " + leJour(dans(d0, 60)) + ".",
        "",
        "Au prochain franchissement de tranche d'effectif — le tableau de R. 2314-1 change",
        "de ligne, et le volume dû avec lui. Recontrôlez à chaque variation d'effectif :",
        "l'obligation suit l'effectif, elle n'attend pas les élections suivantes.",
      ]);

      return pied(L, ["L. 2314-7", "L. 2315-7", "L. 2315-9", "L. 2315-10", "L. 2315-11",
                      "L. 2315-14", "L. 2315-15", "L. 2315-16", "L. 2315-20", "L. 2315-25",
                      "L. 2315-26", "R. 2314-1", "R. 2315-5", "R. 2315-6", "R. 2315-7"]);
    },
  });

  DP.ajouter("CSE-CTL-MOY-02", {
    nom: "La note explicative de la composition de la délégation du personnel",
    detail: "Le rapprochement du tableau de R. 2314-1, du protocole et du procès-verbal " +
            "des élections, la cause écrite de l'écart, et le test des élections partielles.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var eff = effectifDe(ctx);
      var elus = nb(f.titulairesElus);
      var init = nb(f.titulairesInitiaux);
      var reste = nb(f.titulairesRestants);
      var collegeVide = oui(f.collegeVide);
      var moisAvant = nb(f.moisAvantTerme);
      var d = delegationLegale(eff);
      var L = [];

      L = L.concat(entete(ctx, "Note explicative de la composition de la délégation du personnel",
        "articles L. 2314-7, L. 2314-10 et R. 2314-1 du code du travail"));
      usage(L);

      L.push("CE QUE CETTE NOTE ÉTABLIT");
      L.push("");
      L.push("Un nombre de titulaires inférieur à celui du tableau réglementaire n'est pas");
      L.push("nécessairement une irrégularité. Il peut avoir trois causes, et elles");
      L.push("n'appellent pas les mêmes suites :");
      L.push("");
      L.push("  · un PROTOCOLE qui a modifié le nombre de sièges — ce que L. 2314-7 permet,");
      L.push("    à la condition que le volume global des heures de délégation, au sein de");
      L.push("    chaque collège, reste au moins égal à celui qui résulte des dispositions");
      L.push("    légales ;");
      L.push("  · des SIÈGES NON POURVUS faute de candidats — cela se lit sur le");
      L.push("    procès-verbal des élections, et non sur une déclaration ;");
      L.push("  · des VACANCES survenues en cours de mandat — et c'est le seul cas qui peut");
      L.push("    ouvrir des élections partielles (L. 2314-10).");
      L.push("");
      L.push("Tant que la cause n'est pas établie par écrit, l'écart reste un doute, et le");
      L.push("doute se retourne contre l'employeur le jour où le périmètre est discuté.");
      L.push("");

      titre(L, "1 — Le rapprochement");
      L.push("  Effectif retenu ............................ " +
        (eff == null ? "[à renseigner]" : eff + " salariés"));
      if (d && d.du && d.titulaires != null) {
        L.push("  Tranche du tableau de R. 2314-1 ............ " + d.tranche + " salariés");
        L.push("  Titulaires prévus par le tableau ........... " + d.titulaires);
        L.push("  Heures par titulaire ....................... " + d.heures + " h · total " + d.total + " h");
      } else {
        L.push("  Tranche du tableau de R. 2314-1 ............ [à relever]");
        L.push("  Titulaires prévus par le tableau ........... [ ]");
      }
      L.push("  Titulaires effectivement élus .............. " + (elus == null ? "[à renseigner]" : elus));
      L.push("  Titulaires élus à l'origine ................ " + (init == null ? "[à renseigner]" : init));
      L.push("  Titulaires encore en fonction .............. " + (reste == null ? "[à renseigner]" : reste));
      if (d && d.titulaires != null && elus != null) {
        var e = d.titulaires - elus;
        L.push("  ÉCART avec le tableau ...................... " +
          (e > 0 ? e + " siège(s) de moins" : e < 0 ? Math.abs(e) + " siège(s) de plus" : "aucun"));
      }
      L.push("");

      titre(L, "2 — La cause de l'écart, établie et non déclarée");
      L.push(nom(ctx));
      L.push("");
      L.push("NOTE EXPLICATIVE DE LA COMPOSITION DE LA DÉLÉGATION DU PERSONNEL");
      L.push("");
      L.push("Cochez la cause retenue et joignez la pièce qui l'établit. Une seule case, et");
      L.push("une pièce : deux causes déclarées ensemble n'en prouvent aucune.");
      L.push("");
      L.push("  [ ] 1. LE PROTOCOLE PRÉÉLECTORAL A MODIFIÉ LE NOMBRE DE SIÈGES");
      L.push("         Protocole du [date], article [ ].");
      L.push("         Nombre de sièges qu'il fixe : [ ]");
      L.push("         Vérification imposée par L. 2314-7 — le volume global des heures, AU");
      L.push("         SEIN DE CHAQUE COLLÈGE, est-il au moins égal à celui qui résulte des");
      L.push("         dispositions légales au regard de l'effectif ?");
      L.push("");
      L.push("            Collège · sièges · heures individuelles · volume global · volume légal");
      L.push("            1er ..... [ ] · [ ] h · [ ] h · [ ] h");
      L.push("            2e ...... [ ] · [ ] h · [ ] h · [ ] h");
      L.push("            3e ...... [ ] · [ ] h · [ ] h · [ ] h");
      L.push("");
      L.push("         Si un collège est en deçà, la stipulation ne vaut pas pour ce collège :");
      L.push("         les heures manquantes sont dues (L. 2314-7, L. 2315-10).");
      L.push("         Pièce jointe : protocole signé.");
      L.push("");
      L.push("  [ ] 2. DES SIÈGES N'ONT PAS ÉTÉ POURVUS FAUTE DE CANDIDATS");
      L.push("         Procès-verbal des élections du [date].");
      L.push("         Sièges non pourvus, collège par collège : [ ]");
      L.push("         Ce constat se lit sur le procès-verbal ; aucune déclaration ne le");
      L.push("         remplace.");
      L.push("         Pièce jointe : procès-verbal des élections.");
      L.push("");
      L.push("  [ ] 3. DES VACANCES SONT SURVENUES EN COURS DE MANDAT");
      L.push("         Titulaires à l'origine : " + (init == null ? "[ ]" : init) +
        " · encore en fonction : " + (reste == null ? "[ ]" : reste));
      L.push("         Détail : [nom ou matricule · collège · date de la vacance · cause —");
      L.push("         décès, démission, rupture du contrat de travail, perte des conditions");
      L.push("         requises pour être éligible (L. 2314-33)]");
      L.push("         Pièce jointe : registre des départs et procès-verbaux.");
      L.push("");

      titre(L, "3 — Le test des élections partielles (L. 2314-10)");
      L.push("« Des élections partielles sont organisées À L'INITIATIVE DE L'EMPLOYEUR si un");
      L.push("collège électoral n'est plus représenté ou si le nombre des membres titulaires");
      L.push("de la délégation du personnel du comité social et économique est RÉDUIT DE");
      L.push("MOITIÉ OU PLUS, sauf si ces événements interviennent MOINS DE SIX MOIS avant le");
      L.push("terme du mandat des membres de la délégation du personnel » (L. 2314-10).");
      L.push("");
      L.push("  a) Un collège électoral n'est-il plus représenté ? ..... " +
        (collegeVide === true ? "oui" : collegeVide === false ? "non" : "[oui / non]"));
      L.push("  b) Les titulaires sont-ils réduits de moitié ou plus ?");
      if (init != null && reste != null) {
        L.push("     " + init + " à l'origine, " + reste + " en fonction — moitié atteinte : " +
          (reste * 2 <= init ? "OUI" : "non"));
      } else {
        L.push("     [titulaires à l'origine] à [titulaires en fonction] — moitié atteinte : [ ]");
      }
      L.push("  c) L'événement est-il intervenu moins de six mois avant le terme des");
      L.push("     mandats ? ......... " + (moisAvant == null ? "[mois restant à courir : ?]"
        : moisAvant + " mois restant à courir — " + (moisAvant < 6 ? "OUI : les partielles ne sont pas dues" : "non")));
      L.push("");
      L.push("  CONCLUSION : [des élections partielles sont dues / ne sont pas dues].");
      L.push("");
      L.push("Si elles sont dues, elles se déroulent DANS LES CONDITIONS FIXÉES À L'ARTICLE");
      L.push("L. 2314-29, pour pourvoir TOUS LES SIÈGES VACANTS DANS LES COLLÈGES INTÉRESSÉS");
      L.push("— et non le seul siège dont la vacance a déclenché l'obligation —, sur la base");
      L.push("des dispositions en vigueur lors de l'élection précédente. Les candidats sont");
      L.push("élus pour la durée du mandat restant à courir (L. 2314-10).");
      L.push("");
      L.push("Le processus lui-même — information du personnel, invitation des organisations");
      L.push("syndicales, protocole — est celui du point CSE-CTL-ELE-07 de ce module, dont");
      L.push("le document produit les pièces.");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le " + leJour(d0) + ".");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièces jointes : protocole préélectoral · procès-verbal des élections ·");
      L.push("registre des départs.");

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — vous rapprochez les trois pièces et vous cochez la",
        "cause. Quelques jours suffisent : il s'agit de pièces qui existent déjà.",
        "",
        "Si la cause est le protocole — vérifiez le volume global par collège avant de",
        "clore. C'est la seule vérification que L. 2314-7 impose, et c'est celle qu'on",
        "oublie : le nombre de sièges se regarde, le volume d'heures ne se regarde pas.",
        "",
        "Si la cause est une vacance et que les partielles sont dues — le processus",
        "électoral entier s'ouvre. Comptez jusqu'à quatre-vingt-dix jours entre la",
        "diffusion de l'information au personnel et le premier tour (L. 2314-4) : partie",
        "aujourd'hui, l'information conduirait à un premier tour le " + leJour(dans(d0, 90)) + " au",
        "plus tard.",
        "",
        "À chaque départ d'un titulaire — refaites le test b) du paragraphe 3. Le seuil de",
        "la moitié se franchit d'un seul départ, et la date de ce départ est celle qui",
        "compte pour l'exception des six mois.",
      ]);

      return pied(L, ["L. 2314-7", "L. 2314-10", "L. 2314-29", "L. 2314-33",
                      "L. 2315-10", "R. 2314-1"]);
    },
  });

  DP.ajouter("CSE-CTL-MOY-03", {
    nom: "Le remboursement des heures de délégation retenues, le registre de suivi et la note aux représentants",
    detail: "Le relevé des retenues, l'ordre de remboursement sur la paie suivante, le " +
            "registre de suivi des heures qui remplace la retenue préalable, et la lettre " +
            "de contestation devant le juge — après paiement.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var retenues = oui(f.heuresRetenues);
      var L = [];

      L = L.concat(entete(ctx, "Remboursement des heures de délégation retenues et suivi des heures",
        "articles L. 2315-10, L. 2315-11 et L. 2315-16 du code du travail"));
      usage(L);

      L.push("LA RÈGLE, ET L'ORDRE QU'ELLE IMPOSE");
      L.push("");
      L.push("« Le temps passé en délégation est DE PLEIN DROIT considéré comme temps de");
      L.push("travail et PAYÉ À L'ÉCHÉANCE NORMALE. L'employeur qui entend contester");
      L.push("l'utilisation faite des heures de délégation SAISIT LE JUGE JUDICIAIRE »");
      L.push("(L. 2315-10).");
      L.push("");
      L.push("Deux choses dans une seule phrase, et c'est leur ordre qui compte. Le paiement");
      L.push("est de plein droit : il ne se subordonne à aucune justification préalable de");
      L.push("l'usage des heures. La contestation vient APRÈS, et devant le juge. La retenue");
      L.push("opérée avant inverse cet ordre — et les heures restent dues quel que soit le");
      L.push("sort de la contestation.");
      L.push("");
      L.push("  Des heures ont-elles été retenues, selon votre dossier ? " +
        (retenues === true ? "oui" : retenues === false ? "non" : "[à renseigner]"));
      L.push("");

      titre(L, "1 — Relevé des retenues opérées");
      L.push("Une ligne par salarié et par mois. Le montant se lit sur le bulletin de paie ;");
      L.push("le nombre d'heures aussi.");
      L.push("");
      L.push("   Salarié ou matricule · mandat · mois · heures retenues · montant · bulletin");
      L.push("   [ ] · [ ] · [ ] · [ ] h · [ ] € · [référence]");
      L.push("   [ ] · [ ] · [ ] · [ ] h · [ ] € · [référence]");
      L.push("   [ ] · [ ] · [ ] · [ ] h · [ ] € · [référence]");
      L.push("");
      L.push("   TOTAL À REMBOURSER : [ ] heures · [ ] €");
      L.push("");
      L.push("VÉRIFIEZ AUSSI CE QUI A PU ÊTRE DÉDUIT DU CRÉDIT SANS DEVOIR L'ÊTRE. C'est la");
      L.push("seconde source de retenue, et la plus discrète : elle ne se voit pas sur le");
      L.push("bulletin, mais sur le compteur d'heures.");
      L.push("");
      L.push("   Motif · heures déduites du crédit · à rétablir");
      L.push("   Recherche de mesures préventives en situation d'urgence et de gravité,");
      L.push("   notamment danger grave et imminent (L. 2315-11, 1°) ....... [ ] h · [oui]");
      L.push("   Réunions du comité et de ses commissions (L. 2315-11, 2°) . [ ] h · [oui,");
      L.push("      dans la limite de la durée globale fixée par accord ou, à défaut, par");
      L.push("      R. 2315-7 : trente heures par an de 300 à 1 000 salariés, soixante heures");
      L.push("      au-delà]");
      L.push("   Réunions de la commission santé, sécurité et conditions de travail : ce");
      L.push("      temps est rémunéré comme du temps de travail et n'est pas déduit du");
      L.push("      crédit (R. 2315-7, dernier alinéa) ..................... [ ] h · [oui]");
      L.push("   Enquêtes après un accident du travail grave ou des incidents répétés ayant");
      L.push("      révélé un risque grave ou une maladie professionnelle ou à caractère");
      L.push("      professionnel grave (L. 2315-11, 3°) ................... [ ] h · [oui]");
      L.push("   Formations (L. 2315-16) ..................................  [ ] h · [oui]");
      L.push("");

      titre(L, "2 — Ordre de remboursement");
      L.push(nom(ctx));
      L.push("");
      L.push("ORDRE DE RÉGULARISATION — HEURES DE DÉLÉGATION");
      L.push("À : [service de la paie]");
      L.push("");
      L.push("Les retenues énumérées au relevé ci-joint ont été opérées sur des heures de");
      L.push("délégation. Le temps passé en délégation étant de plein droit considéré comme");
      L.push("temps de travail et payé à l'échéance normale (article L. 2315-10 du code du");
      L.push("travail), ces retenues sont à rembourser intégralement sur la paie de [MOIS].");
      L.push("");
      L.push("   Montant total à rembourser : [ ] €");
      L.push("   Heures à rétablir au compteur de délégation : [ ] h");
      L.push("   Libellé du bulletin : « régularisation heures de délégation — période … »");
      L.push("");
      L.push("Aucune nouvelle retenue ne doit être opérée sur des heures de délégation, y");
      L.push("compris lorsque l'usage des heures paraît discutable : la contestation se porte");
      L.push("devant le juge judiciaire, après paiement.");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le " + leJour(d0) + ".");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      titre(L, "3 — Registre de suivi des heures, qui remplace la retenue");
      L.push("Le suivi n'est pas interdit : c'est la retenue préalable qui l'est. Un registre");
      L.push("tenu contradictoirement donne à l'employeur ce que la retenue ne lui donnait");
      L.push("pas — une pièce datée à produire devant le juge, le jour où il conteste.");
      L.push("");
      L.push("   Représentant · mandat · crédit mensuel · mois");
      L.push("   Date · heures prises · report utilisé (R. 2315-5) · heures mutualisées");
      L.push("   reçues ou cédées (R. 2315-6) · solde du crédit");
      L.push("   [ ] · [ ] h · [ ] h · [ ] h · [ ] h");
      L.push("   [ ] · [ ] h · [ ] h · [ ] h · [ ] h");
      L.push("");
      L.push("   Hors crédit, payé comme temps de travail effectif (L. 2315-11) :");
      L.push("   Date · nature (urgence et gravité · réunion du comité ou d'une commission ·");
      L.push("   enquête après accident grave) · heures");
      L.push("   [ ] · [ ] · [ ] h");
      L.push("");
      L.push("   Formation (L. 2315-16), prise sur le temps de travail et non déduite :");
      L.push("   Date · intitulé · heures ... [ ] · [ ] · [ ] h");
      L.push("");
      L.push("DEUX DÉLAIS D'INFORMATION que le registre doit faire apparaître, parce qu'ils");
      L.push("sont à la charge du représentant et non de l'employeur :");
      L.push("  · REPORT — le crédit peut être utilisé cumulativement dans la limite de douze");
      L.push("    mois, sans dépasser dans le mois une fois et demie le crédit ; le");
      L.push("    représentant informe l'employeur AU PLUS TARD HUIT JOURS avant la date");
      L.push("    prévue d'utilisation (R. 2315-5) ;");
      L.push("  · MUTUALISATION — la répartition entre membres ne peut conduire l'un d'eux à");
      L.push("    disposer dans le mois de plus d'une fois et demie le crédit d'un titulaire");
      L.push("    au sens de R. 2314-1 ; les titulaires informent l'employeur AU PLUS TARD");
      L.push("    HUIT JOURS avant, par un document écrit précisant l'identité de chacun et");
      L.push("    le nombre d'heures mutualisées (R. 2315-6).");
      L.push("");

      courrier(L, 1, "note aux représentants concernés", null);
      papier(L, ctx, ["Aux membres de la délégation du personnel",
                      "du comité social et économique concernés"], leJour(d0));
      L.push("Objet : régularisation des heures de délégation");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Des heures de délégation ont été retenues sur vos bulletins de paie. Le temps");
      L.push("passé en délégation étant de plein droit considéré comme temps de travail et");
      L.push("payé à l'échéance normale (L. 2315-10), ces retenues sont remboursées sur la");
      L.push("paie de [MOIS] et les compteurs sont rétablis.");
      L.push("");
      L.push("Un registre de suivi des heures, dont le modèle est joint, est mis en place à");
      L.push("compter du [DATE]. Il ne conditionne pas le paiement, qui reste dû quelle que");
      L.push("soit son alimentation : il sert à ce que chacun — vous comme la direction —");
      L.push("dispose du même relevé.");
      L.push("");
      L.push("Je vous rappelle enfin les deux délais de huit jours qui vous incombent : celui");
      L.push("du report d'heures d'un mois sur l'autre (R. 2315-5) et celui de la");
      L.push("mutualisation entre membres (R. 2315-6).");
      L.push("");
      salutation(L, ctx);
      L.push("Pièces jointes : relevé des retenues remboursées · modèle de registre de suivi");
      L.push("");

      courrier(L, 2, "contestation de l'utilisation des heures — après paiement", [
        "N'utilisez ce courrier QU'APRÈS avoir payé. Il ouvre une contestation devant le",
        "juge judiciaire : c'est la voie que L. 2315-10 impose, et la seule.",
      ]);
      papier(L, ctx, ["[Nom du représentant]",
                      "Membre de la délégation du personnel",
                      "du comité social et économique"], "[DATE D'ENVOI]");
      L.push("Lettre recommandée avec demande d'avis de réception");
      L.push("");
      L.push("Objet : utilisation des heures de délégation");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Les heures de délégation que vous avez déclarées au titre de [PÉRIODE] vous ont");
      L.push("été intégralement payées à l'échéance normale, comme l'article L. 2315-10 du");
      L.push("code du travail l'impose.");
      L.push("");
      L.push("J'entends toutefois contester l'utilisation qui en a été faite pour les heures");
      L.push("suivantes : [ÉNUMÉRER, avec les dates et les motifs].");
      L.push("");
      L.push("Je vous invite à m'apporter, avant le [DATE], toute précision sur l'usage de");
      L.push("ces heures. À défaut, je saisirai le juge judiciaire, seule voie ouverte à");
      L.push("l'employeur qui entend contester cette utilisation.");
      L.push("");
      salutation(L, ctx, "Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération distinguée.");

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — vous établissez le relevé des retenues et vous",
        "signez l'ordre de régularisation. Vous cessez immédiatement toute nouvelle",
        "retenue : c'est la première chose à faire, et elle ne demande aucune formalité.",
        "",
        "Sur la paie du mois suivant — le remboursement. Si la paie du mois est déjà",
        "arrêtée, la régularisation figure au plus tard sur celle du mois d'après, soit",
        "vers le " + leJour(dans(d0, 60)) + ".",
        "",
        "Le " + leJour(dans(d0, 30)) + " — mise en service du registre de suivi, à la première",
        "échéance mensuelle utile. Il se tient contradictoirement, mois par mois.",
        "",
        "Si vous entendez contester — le courrier 2 part APRÈS le paiement, jamais avant.",
        "La saisine du juge judiciaire est la seule voie que L. 2315-10 laisse ouverte.",
      ]);

      return pied(L, ["L. 2315-10", "L. 2315-11", "L. 2315-16", "R. 2314-1",
                      "R. 2315-5", "R. 2315-6", "R. 2315-7"]);
    },
  });

  DP.ajouter("CSE-CTL-MOY-04", {
    nom: "Le plan de formation des élus, ses convocations, sa prise en charge et ses attestations",
    detail: "Le recensement des bénéficiaires, la durée due membre par membre, la " +
            "convocation, la demande à l'organisme, le tableau de prise en charge et le " +
            "bordereau des attestations.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var eff = effectifDe(ctx);
      var faites = liste(f.formationsDispensees);
      var renouv = oui(f.mandatRenouvele);
      var L = [];

      L = L.concat(entete(ctx, "Formation des membres du comité en santé, sécurité et conditions de travail",
        "articles L. 2315-16 à L. 2315-18 et L. 2315-63 du code du travail"));
      usage(L);

      L.push("DEUX FORMATIONS DISTINCTES, QUE L'ON CONFOND TOUJOURS");
      L.push("");
      L.push("A — LA FORMATION EN SANTÉ, SÉCURITÉ ET CONDITIONS DE TRAVAIL (L. 2315-18)");
      L.push("Elle bénéficie aux MEMBRES DE LA DÉLÉGATION DU PERSONNEL du comité ET au");
      L.push("référent prévu au dernier alinéa de l'article L. 2314-1 — le référent en");
      L.push("matière de lutte contre le harcèlement sexuel et les agissements sexistes,");
      L.push("désigné par le comité parmi ses membres sous la forme d'une résolution adoptée");
      L.push("selon les modalités de L. 2315-32.");
      L.push("");
      L.push("   Durée minimale : CINQ JOURS lors du premier mandat.");
      L.push("   En cas de renouvellement du mandat :");
      L.push("     1° TROIS JOURS pour chaque membre de la délégation du personnel, quelle");
      L.push("        que soit la taille de l'entreprise ;");
      L.push("     2° CINQ JOURS pour les membres de la commission santé, sécurité et");
      L.push("        conditions de travail dans les entreprises d'AU MOINS TROIS CENTS");
      L.push("        salariés.");
      L.push("   FINANCEMENT PRIS EN CHARGE PAR L'EMPLOYEUR (L. 2315-18, dernier alinéa).");
      L.push("");
      L.push("   [L'article L. 2315-22-1, que L. 2315-18 réserve, ne figure pas dans le");
      L.push("   corpus lu par l'application : il est nommé, non résumé.]");
      L.push("");
      L.push("B — LE STAGE DE FORMATION ÉCONOMIQUE (L. 2315-63)");
      L.push("Dans les entreprises d'au moins cinquante salariés, les MEMBRES TITULAIRES élus");
      L.push("POUR LA PREMIÈRE FOIS bénéficient, dans les conditions et limites prévues à");
      L.push("l'article L. 2145-11, d'un stage d'une durée MAXIMALE de cinq jours. Son");
      L.push("FINANCEMENT EST PRIS EN CHARGE PAR LE COMITÉ. Cette formation peut notamment");
      L.push("porter sur les conséquences environnementales de l'activité des entreprises ;");
      L.push("elle est imputée sur la durée du congé de formation économique, sociale,");
      L.push("environnementale et syndicale prévu aux articles L. 2145-5 et suivants.");
      L.push("");
      L.push("Retenez la différence, qui est celle qui coûte : la première est une DURÉE");
      L.push("MINIMALE payée par l'employeur, la seconde une DURÉE MAXIMALE payée par le");
      L.push("comité. Les confondre, c'est soit sous-former, soit facturer au mauvais budget.");
      L.push("");
      L.push("  Effectif retenu : " + (eff == null ? "[à renseigner]" : eff + " salariés") +
        "  ·  mandat en cours : " +
        (renouv === true ? "renouvellement" : renouv === false ? "premier mandat" : "[premier mandat / renouvellement]"));
      L.push("  Formations déclarées au dossier : " +
        (faites.length ? faites.join(" · ") : "[aucune n'est déclarée]"));
      L.push("");

      titre(L, "1 — Recensement et durée due, membre par membre");
      L.push("Le tableau se remplit nominativement : la durée dépend de la qualité du mandat");
      L.push("de chacun, et non d'une moyenne d'entreprise.");
      L.push("");
      L.push("   Nom · qualité (titulaire, suppléant, référent harcèlement) · membre de la");
      L.push("   commission santé et sécurité · premier mandat ou renouvellement · durée due");
      L.push("   · durée suivie · dates · organisme · attestation");
      L.push("");
      L.push("   [ ] · [ ] · [oui/non] · [1er / renouvellement] · [ ] j · [ ] j · [ ] · [ ] · [ ]");
      L.push("   [ ] · [ ] · [oui/non] · [1er / renouvellement] · [ ] j · [ ] j · [ ] · [ ] · [ ]");
      L.push("   [ ] · [ ] · [oui/non] · [1er / renouvellement] · [ ] j · [ ] j · [ ] · [ ] · [ ]");
      L.push("");
      L.push("   RÈGLE DE LECTURE DE LA COLONNE « durée due » :");
      L.push("     premier mandat .......................................... 5 jours");
      L.push("     renouvellement, membre de la délégation ................. 3 jours");
      L.push("     renouvellement, membre de la commission santé et sécurité");
      L.push("     dans une entreprise d'au moins 300 salariés ............. 5 jours");
      if (eff != null) {
        L.push("     Votre effectif étant de " + eff + " salariés, la durée de cinq jours au");
        L.push("     renouvellement " + (eff >= 300 ? "S'APPLIQUE" : "ne s'applique pas") +
          " aux membres de la commission (L. 2315-18, 2°).");
      }
      L.push("");
      L.push("   STAGE DE FORMATION ÉCONOMIQUE — colonne séparée, pour les titulaires élus");
      L.push("   pour la première fois : [nom · dates · durée, cinq jours au maximum · pris en");
      L.push("   charge par le comité].");
      L.push("");

      titre(L, "2 — Ce que la formation doit couvrir, et par qui elle est dispensée");
      L.push("La formation en santé, sécurité et conditions de travail a pour objet :");
      L.push("  1° de développer l'aptitude des membres à déceler et à mesurer les risques");
      L.push("     professionnels et leur capacité d'analyse des conditions de travail ;");
      L.push("  2° de les initier aux méthodes et procédés à mettre en œuvre pour prévenir");
      L.push("     les risques professionnels et améliorer les conditions de travail");
      L.push("     (R. 2315-9).");
      L.push("");
      L.push("Elle est dispensée DÈS LA PREMIÈRE DÉSIGNATION des membres, selon un programme");
      L.push("théorique et pratique préétabli qui tient compte des caractéristiques de la");
      L.push("branche professionnelle, des caractères spécifiques de l'entreprise et du rôle");
      L.push("du représentant (R. 2315-10).");
      L.push("");
      L.push("Le RENOUVELLEMENT de la formation fait l'objet de STAGES DISTINCTS de celui");
      L.push("organisé en application de R. 2315-9 ; il a pour objet d'actualiser les");
      L.push("connaissances et de se perfectionner, sur un programme plus spécialisé, adapté");
      L.push("aux demandes du stagiaire et tenant compte des changements technologiques et");
      L.push("d'organisation (R. 2315-11).");
      L.push("");
      L.push("ORGANISMES — la formation en santé, sécurité et conditions de travail est");
      L.push("dispensée soit par des organismes figurant sur une liste arrêtée par le ministre");
      L.push("chargé du travail selon la procédure de R. 2145-3, soit par des organismes");
      L.push("agréés par le préfet de région selon la procédure de R. 2315-8 (R. 2315-12). Les");
      L.push("formations du chapitre sont dispensées soit par un organisme enregistré auprès");
      L.push("de l'autorité administrative dans les conditions des articles L. 6351-1 à");
      L.push("L. 6351-8, soit par l'un des organismes mentionnés à l'article L. 2145-5 ; elles");
      L.push("sont RENOUVELÉES lorsque les représentants ont exercé leur mandat pendant");
      L.push("QUATRE ANS, consécutifs ou non (L. 2315-17).");
      L.push("");
      L.push("   Organisme retenu : [dénomination] · liste ou agrément : [référence]");
      L.push("");

      titre(L, "3 — La prise en charge, poste par poste");
      L.push("   Rémunération de l'organisme — à la charge de l'employeur, à concurrence d'un");
      L.push("   montant qui ne peut dépasser, PAR JOUR ET PAR STAGIAIRE, l'équivalent de");
      L.push("   TRENTE-SIX FOIS le montant horaire du salaire minimum de croissance");
      L.push("   (R. 2315-21) ........................... [ ] € · plafond : [36 × SMIC horaire]");
      L.push("");
      L.push("   Frais de déplacement — à la charge de l'employeur à hauteur du TARIF DE");
      L.push("   SECONDE CLASSE des chemins de fer applicable au trajet le plus direct depuis");
      L.push("   le siège de l'établissement jusqu'au lieu de la formation");
      L.push("   (R. 2315-20) ........................................................ [ ] €");
      L.push("");
      L.push("   Frais de séjour — à hauteur du montant de l'indemnité de mission fixée en");
      L.push("   application de la réglementation applicable aux déplacements temporaires des");
      L.push("   fonctionnaires (R. 2315-20) ......................................... [ ] €");
      L.push("");
      L.push("   [Le montant horaire du salaire minimum de croissance et l'indemnité de");
      L.push("   mission des fonctionnaires ne sont pas dans le corpus lu par l'application :");
      L.push("   ce sont des valeurs à jour à reporter, non des valeurs à deviner.]");
      L.push("");
      L.push("IMPUTATION — les dépenses de rémunération des organismes de formation et les");
      L.push("frais de déplacement et de séjour exposés par les stagiaires NE S'IMPUTENT PAS");
      L.push("sur la participation au développement de la formation professionnelle continue");
      L.push("prévue à l'article L. 6331-1. Dans les entreprises de moins de trois cents");
      L.push("salariés, les dépenses engagées au titre de la rémunération du temps de");
      L.push("formation des stagiaires sont déductibles, DANS LA LIMITE DE 0,08 % du montant");
      L.push("des salaires payés pendant l'année en cours, du montant de la participation des");
      L.push("employeurs au financement de la formation professionnelle continue (R. 2315-22).");
      L.push("");
      L.push("TEMPS DE TRAVAIL — le temps consacré aux formations est pris sur le temps de");
      L.push("travail et rémunéré comme tel ; il n'est PAS DÉDUIT des heures de délégation");
      L.push("(L. 2315-16). Une formation imputée sur le crédit d'heures est une formation");
      L.push("payée deux fois par l'élu.");
      L.push("");

      courrier(L, 1, "convocation en formation", null);
      papier(L, ctx, ["[Nom et prénom]",
                      "Membre de la délégation du personnel du comité",
                      "social et économique"], leJour(d0));
      L.push("Objet : formation en santé, sécurité et conditions de travail");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("En application de l'article L. 2315-18 du code du travail, vous bénéficiez de la");
      L.push("formation nécessaire à l'exercice de vos missions en matière de santé, de");
      L.push("sécurité et de conditions de travail.");
      L.push("");
      L.push("   Durée due au titre de votre mandat : [cinq jours (premier mandat) / trois");
      L.push("   jours (renouvellement) / cinq jours (renouvellement, membre de la commission");
      L.push("   dans une entreprise d'au moins trois cents salariés)]");
      L.push("   Dates : du [DATE] au [DATE]");
      L.push("   Organisme : [dénomination et adresse] · lieu : [ ]");
      L.push("");
      L.push("Ce temps est pris sur votre temps de travail et rémunéré comme tel ; il n'est");
      L.push("pas déduit de vos heures de délégation (L. 2315-16). Le financement de la");
      L.push("formation est pris en charge par l'employeur (L. 2315-18).");
      L.push("");
      L.push("Merci de me retourner l'attestation de présence dès la fin du stage : c'est");
      L.push("elle, et elle seule, qui établira que la formation a été dispensée.");
      L.push("");
      salutation(L, ctx, "Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération distinguée.");

      courrier(L, 2, "demande à l'organisme de formation", null);
      papier(L, ctx, ["[Organisme de formation]",
                      "[Adresse]"], leJour(d0));
      L.push("Objet : formation des membres du comité social et économique en santé,");
      L.push("sécurité et conditions de travail");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Je souhaite inscrire [NOMBRE] membres de la délégation du personnel du comité");
      L.push("social et économique de " + nom(ctx) + " à la formation prévue à");
      L.push("l'article L. 2315-18 du code du travail, pour une durée de [ ] jours.");
      L.push("");
      L.push("Je vous remercie de me confirmer :");
      L.push("  · que vous figurez sur la liste arrêtée par le ministre chargé du travail ou");
      L.push("    que vous êtes agréé par le préfet de région (R. 2315-12), en précisant la");
      L.push("    référence ;");
      L.push("  · le programme théorique et pratique préétabli, et la façon dont il tient");
      L.push("    compte des caractéristiques de notre branche, des caractères spécifiques de");
      L.push("    l'entreprise et du rôle du représentant (R. 2315-10) ;");
      L.push("  · s'il s'agit d'un stage de renouvellement, en quoi il se distingue du stage");
      L.push("    initial et sur quels points il est plus spécialisé (R. 2315-11) ;");
      L.push("  · le coût par jour et par stagiaire, ainsi que les frais annexes.");
      L.push("");
      L.push("Notre secteur d'activité est : " + cro((ctx.profil || {}).secteur, "secteur d'activité") + ".");
      L.push("");
      salutation(L, ctx, "Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération distinguée.");

      titre(L, "4 — Bordereau des attestations");
      L.push("   Nom · dates de la formation · durée · organisme · attestation reçue le");
      L.push("   [ ] · [ ] · [ ] j · [ ] · [ ]");
      L.push("   [ ] · [ ] · [ ] j · [ ] · [ ]");
      L.push("");
      L.push("Membres non encore formés : [ ]. Tant qu'il en reste un, l'obligation n'est pas");
      L.push("remplie : L. 2315-18 vise les membres de la délégation du personnel, sans");
      L.push("distinguer.");
      L.push("");
      L.push("Bordereau arrêté à " + lieu(ctx) + ", le " + leJour(d0) + ".");
      L.push("");
      L.push(signataire(ctx));

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — vous recensez les bénéficiaires et vous adressez le",
        "courrier 2 aux organismes pour obtenir dates et devis.",
        "",
        "Le " + leJour(dans(d0, 21)) + " — retours des organismes attendus, choix de l'organisme,",
        "réservation des sessions.",
        "",
        "Le " + leJour(dans(d0, 30)) + " — envoi des convocations (courrier 1). Prévenez",
        "suffisamment tôt : cinq jours d'absence se remplacent, et une convocation tardive",
        "est le premier motif de report.",
        "",
        "Vers le " + leJour(dans(d0, 75)) + " — tenue des sessions. Deux à trois mois entre la",
        "décision et la formation est un délai réaliste ; en deçà, les places manquent.",
        "",
        "Dès la fin de chaque session — recueil de l'attestation de présence et inscription",
        "au bordereau. L'attestation est la seule pièce qui établisse que la formation a",
        "été dispensée : une facture prouve un achat, pas une présence.",
        "",
        "Au bout de quatre ans de mandat, consécutifs ou non — la formation est renouvelée",
        "(L. 2315-17). Portez l'échéance à votre agenda dès aujourd'hui.",
      ]);

      return pied(L, ["L. 2314-1", "L. 2315-16", "L. 2315-17", "L. 2315-18", "L. 2315-32",
                      "L. 2315-63", "R. 2315-8", "R. 2315-9", "R. 2315-10", "R. 2315-11",
                      "R. 2315-12", "R. 2315-20", "R. 2315-21", "R. 2315-22"]);
    },
  });

  /* ══════════════════════════════════════════════════════════════════════════
     LA COMMISSION SANTÉ, SÉCURITÉ ET CONDITIONS DE TRAVAIL

     Les arrêts cités dans cette section sont ceux que le module a lus dans la
     base Judilibre le 21 août 2026, réponse non relaxée. Ils ne sont invoqués
     que pour ce qu'ils disent : le sommaire publié, quand il existe, fixe la
     limite.
     ══════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CSE-CTL-SST-01", {
    nom: "L'acte constitutif de la commission santé, sécurité et conditions de travail : ordre du jour, résolution de désignation et procès-verbal",
    detail: "Le test du seuil, l'ordre des sources pour fixer les modalités, l'ordre du " +
            "jour, la résolution de désignation à la majorité des membres présents, le " +
            "procès-verbal, et la notification aux membres désignés.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var eff = effectifDe(ctx);
      var enPlace = oui(f.cssct);
      var seveso = oui(f.seveso);
      var membres = liste(f.membresCssct);
      var srcMod = f.sourceModalitesCssct;
      var L = [];

      L = L.concat(entete(ctx, "Constitution de la commission santé, sécurité et conditions de travail",
        "articles L. 2315-36 à L. 2315-44, L. 2315-32 et L. 2312-34 du code du travail"));
      usage(L);

      L.push("QUAND LA COMMISSION EST DUE");
      L.push("");
      L.push("« Une commission santé, sécurité et conditions de travail est créée au sein du");
      L.push("comité social et économique dans : 1° Les entreprises d'au moins trois cent");
      L.push("salariés ; 2° Les établissements distincts d'au moins trois cent salariés ;");
      L.push("3° Les établissements mentionnés aux articles L. 4521-1 et suivants »");
      L.push("(L. 2315-36).");
      L.push("");
      L.push("Le seuil de trois cents salariés « est réputé franchi lorsque l'effectif de");
      L.push("l'entreprise dépasse ce seuil PENDANT DOUZE MOIS CONSÉCUTIFS », et l'employeur");
      L.push("dispose d'un délai d'UN AN à compter du franchissement pour se conformer");
      L.push("complètement aux obligations d'information et de consultation qui en découlent");
      L.push("(L. 2312-34).");
      L.push("");
      L.push("EN DEÇÀ DE TROIS CENTS SALARIÉS — « l'inspecteur du travail PEUT IMPOSER la");
      L.push("création d'une commission santé, sécurité et conditions de travail lorsque");
      L.push("cette mesure est nécessaire, notamment en raison de la nature des activités, de");
      L.push("l'agencement ou de l'équipement des locaux. Cette décision peut être contestée");
      L.push("devant le directeur régional des entreprises, de la concurrence, de la");
      L.push("consommation, du travail et de l'emploi » (L. 2315-37).");
      L.push("");
      L.push("[Les articles L. 4521-1 et suivants, auxquels renvoie le 3° de L. 2315-36, ne");
      L.push("figurent pas dans le corpus lu par l'application : ils sont nommés, non");
      L.push("résumés. Si votre établissement relève d'une installation classée soumise à ce");
      L.push("régime, vérifiez-les — la commission est alors due quel que soit l'effectif.]");
      L.push("");
      L.push("VOTRE SITUATION");
      L.push("  Effectif retenu ............................ " +
        (eff == null ? "[à renseigner]" : eff + " salariés"));
      L.push("  Seuil de trois cents atteint ............... " +
        (eff == null ? "[à établir sur douze mois consécutifs]"
          : (eff >= 300 ? "oui — sur quels douze mois consécutifs : [du … au …]" : "non, selon l'effectif déclaré")));
      L.push("  Établissement visé par L. 4521-1 et s. .... " +
        (seveso === true ? "oui" : seveso === false ? "non" : "[à renseigner]"));
      L.push("  Commission actuellement en place ........... " +
        (enPlace === true ? "oui" : enPlace === false ? "non" : "[à renseigner]"));
      L.push("  Membres désignés portés au dossier ......... " +
        (membres.length ? membres.length : "[aucun]"));
      L.push("");

      titre(L, "1 — Fixer les modalités AVANT de désigner");
      L.push("On ne désigne pas les membres d'une commission dont on n'a pas dit combien elle");
      L.push("compte de membres, ce qu'elle fait et avec quels moyens. L'ordre des sources");
      L.push("est le suivant, et il n'est pas indifférent :");
      L.push("");
      ordreCssct(L);
      L.push("  Ce qui fixe aujourd'hui vos modalités, selon le dossier : " +
        (srcMod ? String(srcMod) : "[accord d'entreprise / accord avec le comité / règlement intérieur du comité / rien]"));
      L.push("");
      L.push("LES SIX POINTS que l'acte doit définir (L. 2315-41, 1° à 6°) :");
      L.push("  1° le nombre de membres de la ou des commissions ;");
      L.push("  2° les missions déléguées à la ou les commissions par le comité et leurs");
      L.push("     modalités d'exercice ;");
      L.push("  3° leurs modalités de fonctionnement, notamment le nombre d'heures de");
      L.push("     délégation dont bénéficient les membres pour l'exercice de leurs");
      L.push("     missions ;");
      L.push("  4° les modalités de leur formation, conformément aux articles L. 2315-16 à");
      L.push("     L. 2315-18 ;");
      L.push("  5° le cas échéant, les moyens qui leur sont alloués ;");
      L.push("  6° le cas échéant, les conditions et modalités dans lesquelles une formation");
      L.push("     spécifique correspondant aux risques ou facteurs de risques particuliers,");
      L.push("     en rapport avec l'activité de l'entreprise, peut être dispensée aux");
      L.push("     membres de la commission.");
      L.push("");
      L.push("Le document du point CSE-CTL-SST-06 de ce module rédige cet acte, article par");
      L.push("article. Le présent document porte la désignation.");
      L.push("");

      titre(L, "2 — Ordre du jour de la réunion de désignation");
      L.push("L'ordre du jour est ÉTABLI PAR LE PRÉSIDENT ET LE SECRÉTAIRE (L. 2315-29) et");
      L.push("communiqué par le président aux membres du comité, à l'agent de contrôle de");
      L.push("l'inspection du travail et à l'agent des services de prévention des organismes");
      L.push("de sécurité sociale TROIS JOURS AU MOINS avant la réunion (L. 2315-30).");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("ORDRE DU JOUR — RÉUNION DU COMITÉ SOCIAL ET ÉCONOMIQUE DU [DATE]");
      L.push("Communiqué le " + leJour(d0) + ".");
      L.push("");
      L.push("   1. Approbation du procès-verbal de la réunion du [date].");
      L.push("   2. Modalités de mise en place de la commission santé, sécurité et conditions");
      L.push("      de travail : [présentation de l'accord du … / du chapitre du règlement");
      L.push("      intérieur du comité].");
      L.push("   3. DÉSIGNATION DES MEMBRES DE LA COMMISSION SANTÉ, SÉCURITÉ ET CONDITIONS DE");
      L.push("      TRAVAIL — résolution soumise au vote.");
      L.push("   4. Moyens de la commission : heures de délégation, formation, moyens alloués.");
      L.push("   5. Calendrier de ses réunions.");
      L.push("");
      L.push("Le président                              Le secrétaire du comité");
      L.push(signataire(ctx) + "        [Nom]");
      L.push("");

      titre(L, "3 — Résolution de désignation");
      L.push("« La commission est PRÉSIDÉE PAR L'EMPLOYEUR ou son représentant. Elle comprend");
      L.push("AU MINIMUM TROIS MEMBRES représentants du personnel, dont au moins un");
      L.push("représentant du second collège, ou le cas échéant du troisième collège prévus à");
      L.push("l'article L. 2314-11. Les membres de la commission santé, sécurité et");
      L.push("conditions de travail sont DÉSIGNÉS PAR LE COMITÉ SOCIAL ET ÉCONOMIQUE PARMI");
      L.push("SES MEMBRES, par une résolution adoptée selon les modalités définies à");
      L.push("l'article L. 2315-32, POUR UNE DURÉE QUI PREND FIN AVEC CELLE DU MANDAT DES");
      L.push("MEMBRES ÉLUS DU COMITÉ » (L. 2315-39).");
      L.push("");
      L.push("« Les résolutions du comité social et économique sont prises À LA MAJORITÉ DES");
      L.push("MEMBRES PRÉSENTS. Le président du comité ne participe pas au vote lorsqu'il");
      L.push("consulte les membres élus du comité en tant que délégation du personnel »");
      L.push("(L. 2315-32).");
      L.push("");
      L.push("RÉSOLUTION N° [ ] — DÉSIGNATION DES MEMBRES DE LA COMMISSION SANTÉ, SÉCURITÉ ET");
      L.push("CONDITIONS DE TRAVAIL");
      L.push("");
      L.push("Le comité social et économique de " + nom(ctx) + ", réuni le [DATE],");
      L.push("");
      L.push("Vu les articles L. 2315-36 à L. 2315-44 du code du travail ;");
      L.push("Vu l'article L. 2315-39 ;");
      L.push("Vu l'article L. 2315-32 ;");
      L.push("Vu [l'accord d'entreprise du … / l'accord avec le comité du … / le chapitre [ ]");
      L.push("du règlement intérieur du comité] fixant les modalités de mise en place de la");
      L.push("commission ;");
      L.push("");
      L.push("DÉSIGNE, parmi les membres du comité, pour une durée qui prend fin avec celle du");
      L.push("mandat des membres élus du comité :");
      L.push("");
      L.push("   1. [Nom, prénom] — élu(e) au [premier / deuxième / troisième] collège");
      L.push("   2. [Nom, prénom] — élu(e) au [ ] collège");
      L.push("   3. [Nom, prénom] — élu(e) au [ ] collège");
      L.push("   [ … si l'acte fixant les modalités prévoit davantage de membres]");
      L.push("");
      L.push("VÉRIFICATIONS À OPÉRER AVANT LE VOTE, et à porter au procès-verbal :");
      L.push("  · trois membres représentants du personnel au minimum " +
        (membres.length ? "— votre dossier en porte " + membres.length : "") + " ;");
      L.push("  · au moins un représentant du SECOND collège ou, le cas échéant, du TROISIÈME");
      L.push("    collège prévu à L. 2314-11. Lorsqu'un troisième collège est institué, le");
      L.push("    siège lui revient : ce n'est pas une alternative (Soc., 26 février 2025,");
      L.push("    n° 24-12.295, publié — le point CSE-CTL-SST-02 traite ce point pour");
      L.push("    lui-même) ;");
      L.push("  · les membres sont désignés PARMI LES MEMBRES DU COMITÉ (L. 2315-39).");
      L.push("");
      L.push("Résultat du vote : [ ] voix pour · [ ] contre · [ ] abstentions, sur [ ] membres");
      L.push("présents. Le président n'a pas pris part au vote (L. 2315-32).");
      L.push("");
      L.push("Résolution [adoptée / rejetée].");
      L.push("");

      titre(L, "4 — Ce qui suit immédiatement la désignation");
      L.push("PRÉSIDENCE ET ASSISTANCE — la commission est présidée par l'employeur ou son");
      L.push("représentant. L'employeur peut se faire assister par des collaborateurs");
      L.push("appartenant à l'entreprise et choisis en dehors du comité ; ENSEMBLE, ILS NE");
      L.push("PEUVENT PAS ÊTRE EN NOMBRE SUPÉRIEUR à celui des représentants du personnel");
      L.push("titulaires (L. 2315-39).");
      L.push("");
      L.push("SECRET ET DISCRÉTION — les dispositions de l'article L. 2315-3 relatives au");
      L.push("secret professionnel et à l'obligation de discrétion sont applicables aux");
      L.push("collaborateurs de l'employeur (L. 2315-39). Les membres de la délégation du");
      L.push("personnel sont tenus au secret professionnel pour toutes les questions");
      L.push("relatives aux procédés de fabrication, et à une obligation de discrétion à");
      L.push("l'égard des informations revêtant un caractère confidentiel et présentées comme");
      L.push("telles par l'employeur (L. 2315-3).");
      L.push("");
      L.push("QUI ASSISTE AUX RÉUNIONS — assistent avec voix consultative aux réunions de la");
      L.push("commission le médecin du travail, qui peut donner délégation à un membre de");
      L.push("l'équipe pluridisciplinaire du service de prévention et de santé au travail");
      L.push("ayant compétence en matière de santé au travail ou de conditions de travail, et");
      L.push("le responsable interne du service de sécurité et des conditions de travail ou,");
      L.push("à défaut, l'agent chargé de la sécurité et des conditions de travail");
      L.push("(L. 2314-3, I). L'agent de contrôle de l'inspection du travail et les agents des");
      L.push("services de prévention des organismes de sécurité sociale sont INVITÉS aux");
      L.push("réunions de la commission (L. 2314-3, II, 1°).");
      L.push("");
      L.push("HEURES — le temps passé aux réunions de la commission est rémunéré comme du");
      L.push("temps de travail et n'est pas déduit des heures de délégation prévues pour les");
      L.push("membres titulaires (R. 2315-7, dernier alinéa).");
      L.push("");

      courrier(L, 1, "notification aux membres désignés", null);
      papier(L, ctx, ["[Nom et prénom]",
                      "Membre du comité social et économique"], "[DATE]");
      L.push("Objet : votre désignation à la commission santé, sécurité et conditions de");
      L.push("travail");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Par résolution adoptée le [DATE] à la majorité de ses membres présents, le");
      L.push("comité social et économique vous a désigné(e) membre de la commission santé,");
      L.push("sécurité et conditions de travail (article L. 2315-39 du code du travail).");
      L.push("");
      L.push("Votre mandat au sein de la commission prend fin avec celui des membres élus du");
      L.push("comité.");
      L.push("");
      L.push("Vous bénéficiez de la formation nécessaire à l'exercice de vos missions en");
      L.push("matière de santé, de sécurité et de conditions de travail, dont le financement");
      L.push("est pris en charge par l'employeur (L. 2315-18) : une convocation vous sera");
      L.push("adressée séparément.");
      L.push("");
      L.push("Les heures de délégation attachées à vos missions au sein de la commission sont");
      L.push("celles que fixe [l'accord du … / le règlement intérieur du comité], au titre du");
      L.push("3° de l'article L. 2315-41.");
      L.push("");
      salutation(L, ctx, "Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération distinguée.");
      L.push("Pièce jointe : extrait du procès-verbal portant la résolution");

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — vous établissez l'ordre du jour avec le secrétaire",
        "et vous le communiquez. La réunion ne peut pas se tenir avant le " +
          leJour(dans(d0, 3)) + " : l'ordre du jour est communiqué trois jours au moins avant",
        "(L. 2315-30).",
        "",
        "Si les modalités ne sont pas encore fixées — c'est par là qu'il faut commencer.",
        "Comptez deux à trois mois pour négocier l'accord de L. 2315-41 ou de L. 2315-42,",
        "une réunion du comité pour compléter son règlement intérieur à défaut d'accord",
        "(L. 2315-44). Une désignation opérée sans modalités écrites laisse la commission",
        "sans missions ni moyens établis.",
        "",
        "À la réunion — la résolution est votée à la majorité des membres présents, le",
        "président n'y prenant pas part (L. 2315-32). Le décompte des voix est porté au",
        "procès-verbal : c'est la pièce qui établira la régularité.",
        "",
        "Dans les quinze jours de la réunion — à défaut d'accord, le secrétaire établit le",
        "procès-verbal et le communique à l'employeur et aux membres (R. 2315-25), soit au",
        "plus tard le " + leJour(dans(d0, 18)) + " si la réunion se tient le " + leJour(dans(d0, 3)) + ".",
        "",
        "Dans les deux à trois mois — la formation des membres désignés. Sa durée dépend de",
        "la qualité du mandat et de l'effectif (L. 2315-18) : le point CSE-CTL-SST-07 la",
        "traite pour elle-même.",
      ]);

      return pied(L, ["L. 2312-34", "L. 2314-3", "L. 2314-11", "L. 2315-3", "L. 2315-18",
                      "L. 2315-29", "L. 2315-30", "L. 2315-32", "L. 2315-36", "L. 2315-37",
                      "L. 2315-39", "L. 2315-41", "L. 2315-42", "L. 2315-43", "L. 2315-44",
                      "R. 2315-7", "R. 2315-25"]);
    },
  });

  DP.ajouter("CSE-CTL-SST-02", {
    nom: "La résolution rectificative : le siège réservé au second ou au troisième collège",
    detail: "Le décompte des collèges au sens de L. 2314-11, la règle d'ordre public du " +
            "siège réservé, la résolution rectificative et sa notification.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var membres = liste(f.membresCssct);
      var cadres = nb(f.nbCadres);
      var eff = effectifDe(ctx);
      var L = [];

      L = L.concat(entete(ctx, "Résolution rectificative — composition de la commission santé, sécurité et conditions de travail",
        "articles L. 2315-39, L. 2314-11 et L. 2315-32 du code du travail"));
      usage(L);

      L.push("LA RÈGLE, ET CE QU'UN ARRÊT PUBLIÉ EN A DIT");
      L.push("");
      L.push("« Elle comprend AU MINIMUM TROIS MEMBRES représentants du personnel, dont AU");
      L.push("MOINS UN REPRÉSENTANT DU SECOND COLLÈGE, OU LE CAS ÉCHÉANT DU TROISIÈME COLLÈGE");
      L.push("prévus à l'article L. 2314-11 » (L. 2315-39).");
      L.push("");
      L.push("La formule « ou le cas échéant » a longtemps été lue comme une alternative");
      L.push("laissée au comité. Ce n'en est pas une : Soc., 26 février 2025, n° 24-12.295,");
      L.push("publié — « Il résulte de l'article L. 2315-39 du code du travail dont les");
      L.push("dispositions sont d'ordre public que, dans les entreprises ou établissements où");
      L.push("est institué, en application de l'article L. 2314-11 du code du travail, un");
      L.push("troisième collège électoral, UN SIÈGE AU MOINS à la commission santé, sécurité");
      L.push("et conditions de travail DOIT ÊTRE ATTRIBUÉ À UN ÉLU au comité social et");
      L.push("économique REPRÉSENTANT LE TROISIÈME COLLÈGE. » L'arrêt casse le jugement qui");
      L.push("voyait dans le texte une simple alternative entre le second et le troisième");
      L.push("collège.");
      L.push("");
      L.push("Ce qui se joue n'est pas une amende : c'est l'ANNULATION de la désignation.");
      L.push("Une commission dont la composition est annulée n'a exercé aucune des missions");
      L.push("qu'elle croyait exercer.");
      L.push("");

      titre(L, "1 — Combien de collèges votre entreprise compte-t-elle ?");
      L.push("« Les membres de la délégation du personnel du comité social et économique sont");
      L.push("élus sur des listes établies par les organisations syndicales pour chaque");
      L.push("catégorie de personnel : d'une part, par le collège des ouvriers et employés ;");
      L.push("d'autre part, par le collège des ingénieurs, chefs de service, techniciens,");
      L.push("agents de maîtrise et assimilés.");
      L.push("");
      L.push("Dans les entreprises d'au moins CINQ CENT UN salariés, les ingénieurs, les chefs");
      L.push("de service et cadres administratifs, commerciaux ou techniques assimilés ont au");
      L.push("moins un délégué titulaire au sein du second collège, élu dans les mêmes");
      L.push("conditions.");
      L.push("");
      L.push("En outre, dans les entreprises, QUEL QUE SOIT LEUR EFFECTIF, dont le nombre des");
      L.push("ingénieurs, chefs de service et cadres administratifs, commerciaux ou techniques");
      L.push("assimilés sur le plan de la classification est AU MOINS ÉGAL À VINGT-CINQ AU");
      L.push("MOMENT DE LA CONSTITUTION OU DU RENOUVELLEMENT DE L'INSTANCE, ces catégories");
      L.push("constituent UN TROISIÈME COLLÈGE.");
      L.push("");
      L.push("Par dérogation, dans les établissements ou entreprises n'élisant qu'un membre");
      L.push("titulaire et un suppléant, il est mis en place un COLLÈGE ÉLECTORAL UNIQUE");
      L.push("regroupant l'ensemble des catégories professionnelles » (L. 2314-11).");
      L.push("");
      L.push("VOTRE DÉCOMPTE — la date compte autant que le nombre : le texte se place AU");
      L.push("MOMENT DE LA CONSTITUTION OU DU RENOUVELLEMENT DE L'INSTANCE, et non au jour où");
      L.push("l'on s'interroge.");
      L.push("");
      L.push("  Effectif ................................... " +
        (eff == null ? "[à renseigner]" : eff + " salariés"));
      L.push("  Cadres au sens de L. 2314-11 ............... " +
        (cadres == null ? "[à renseigner]" : cadres));
      L.push("  Décompte fait au moment de ................. [la constitution / le");
      L.push("     renouvellement de l'instance, le [DATE]]");
      L.push("  Troisième collège institué ? ............... " +
        (cadres == null ? "[oui / non]" : (cadres >= 25 ? "OUI — vingt-cinq cadres au moins" : "non — moins de vingt-cinq cadres")));
      L.push("  Nombre de collèges retenu au protocole ..... [ ]");
      L.push("");
      L.push("  SIÈGE RÉSERVÉ : " +
        (cadres == null ? "[au second collège, ou au troisième s'il est institué]"
          : (cadres >= 25 ? "au TROISIÈME collège (Soc., 26 février 2025)" : "au SECOND collège (L. 2315-39)")));
      L.push("");

      titre(L, "2 — La composition actuelle, confrontée à la règle");
      L.push("   Membre · collège d'élection · titulaire ou suppléant au comité");
      if (membres.length) {
        membres.forEach(function (m, i) {
          var col = m && m.college != null ? m.college : null;
          L.push("   " + (i + 1) + ". [nom] · collège " + (col == null ? "[ ]" : col) + " · [titulaire / suppléant]");
        });
        L.push("");
        L.push("   " + membres.length + " membre(s) portés au dossier. Minimum légal : trois (L. 2315-39).");
        var attendu = (cadres != null && cadres >= 25) ? 3 : 2;
        var ok = membres.some(function (m) { return m && Number(m.college) === attendu; });
        L.push("   Un membre du " + (attendu === 3 ? "troisième" : "second") + " collège figure-t-il parmi eux ? " +
          (ok ? "oui" : "NON — la composition est à reprendre"));
      } else {
        L.push("   1. [nom] · collège [ ] · [titulaire / suppléant]");
        L.push("   2. [nom] · collège [ ] · [titulaire / suppléant]");
        L.push("   3. [nom] · collège [ ] · [titulaire / suppléant]");
        L.push("");
        L.push("   Aucun membre n'est porté au dossier. Reportez la composition telle qu'elle");
        L.push("   résulte de la résolution de désignation, et confrontez-la à la règle.");
      }
      L.push("");

      titre(L, "3 — Résolution rectificative");
      L.push("La désignation se reprend par une NOUVELLE RÉSOLUTION du comité, adoptée à la");
      L.push("majorité des membres présents (L. 2315-32). Elle ne se corrige ni par une note");
      L.push("de la direction, ni par un accord entre organisations syndicales.");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("RÉSOLUTION N° [ ] — DÉSIGNATION RECTIFICATIVE DES MEMBRES DE LA COMMISSION");
      L.push("SANTÉ, SÉCURITÉ ET CONDITIONS DE TRAVAIL");
      L.push("");
      L.push("Le comité social et économique de " + nom(ctx) + ", réuni le [DATE],");
      L.push("");
      L.push("Vu l'article L. 2315-39 du code du travail, dont les dispositions sont d'ordre");
      L.push("public ;");
      L.push("Vu l'article L. 2314-11 du même code ;");
      L.push("Vu l'article L. 2315-32 du même code ;");
      L.push("");
      L.push("Constatant que [la commission ne comprend aucun élu représentant le " +
        (cadres != null && cadres >= 25 ? "troisième" : "second") + " collège /");
      L.push("la commission comprend moins de trois représentants du personnel] ;");
      L.push("");
      L.push("DÉSIGNE, parmi les membres du comité, pour une durée qui prend fin avec celle du");
      L.push("mandat des membres élus du comité :");
      L.push("");
      L.push("   1. [Nom, prénom] — élu(e) au [ ] collège");
      L.push("   2. [Nom, prénom] — élu(e) au [ ] collège");
      L.push("   3. [Nom, prénom] — élu(e) au " + (cadres != null && cadres >= 25 ? "TROISIÈME" : "SECOND") +
        " collège [siège réservé]");
      L.push("");
      L.push("Résultat du vote : [ ] pour · [ ] contre · [ ] abstentions, sur [ ] membres");
      L.push("présents. Le président n'a pas pris part au vote (L. 2315-32).");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le [DATE].");
      L.push("");
      L.push("Le secrétaire du comité                    Le président");
      L.push("[Nom]                                      " + signataire(ctx));
      L.push("");

      courrier(L, 1, "notification de la rectification aux membres", null);
      papier(L, ctx, ["Aux membres du comité social et économique",
                      "Aux membres de la commission santé, sécurité",
                      "et conditions de travail"], leJour(d0));
      L.push("Objet : composition de la commission santé, sécurité et conditions de travail");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("La composition de la commission santé, sécurité et conditions de travail doit");
      L.push("comprendre au minimum trois représentants du personnel, dont au moins un");
      L.push("représentant du second collège ou, le cas échéant, du troisième collège prévu à");
      L.push("l'article L. 2314-11 du code du travail (article L. 2315-39).");
      L.push("");
      L.push("Ces dispositions sont d'ordre public. Lorsqu'un troisième collège est institué");
      L.push("dans l'entreprise, un siège au moins doit être attribué à un élu le");
      L.push("représentant : la Cour de cassation l'a jugé le 26 février 2025 (n° 24-12.295,");
      L.push("publié), en cassant le jugement qui voyait dans le texte une alternative.");
      L.push("");
      L.push("La désignation sera donc reprise par une résolution rectificative, inscrite à");
      L.push("l'ordre du jour de la réunion du [DATE]. Le projet de résolution est joint.");
      L.push("");
      salutation(L, ctx);
      L.push("Pièce jointe : projet de résolution rectificative");

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — vous établissez le décompte des collèges à la date",
        "de constitution ou de renouvellement de l'instance, et vous confrontez la",
        "composition actuelle à la règle.",
        "",
        "Le point est inscrit à l'ordre du jour, établi par le président et le secrétaire",
        "(L. 2315-29) et communiqué trois jours au moins avant la réunion (L. 2315-30) : la",
        "réunion ne peut donc pas se tenir avant le " + leJour(dans(d0, 3)) + ".",
        "",
        "À la réunion — la résolution rectificative est votée à la majorité des membres",
        "présents. Une réunion suffit : il n'y a pas de formalité préalable, et la Cour a",
        "jugé qu'aucune résolution préalable fixant les modalités de l'élection n'est",
        "requise (Soc., 27 novembre 2019, n° 19-14.224, publié).",
        "",
        "Dans les quinze jours — le procès-verbal, à défaut d'accord (R. 2315-25), soit au",
        "plus tard le " + leJour(dans(d0, 18)) + ".",
        "",
        "Au prochain renouvellement de l'instance — refaites le décompte des cadres. C'est",
        "à ce moment-là que le troisième collège s'institue ou disparaît, et le siège",
        "réservé change avec lui.",
      ]);

      return pied(L, ["L. 2314-11", "L. 2315-29", "L. 2315-30", "L. 2315-32", "L. 2315-39",
                      "R. 2315-25"]);
    },
  });

  DP.ajouter("CSE-CTL-SST-03", {
    nom: "Le procès-verbal de la réunion portant résolution de désignation, avec son ordre du jour et son décompte des voix",
    detail: "L'ordre du jour des trois jours, le déroulé du vote à la majorité des membres " +
            "présents, le procès-verbal complet, et le rappel de ce qu'un accord ne peut pas " +
            "imposer.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var des = objet(f.designationCssct);
      var res = oui(des.resolution);
      var maj = oui(des.majoriteMembresPresents);
      var L = [];

      L = L.concat(entete(ctx, "Procès-verbal de désignation des membres de la commission santé, sécurité et conditions de travail",
        "articles L. 2315-39, L. 2315-32, L. 2315-29, L. 2315-30 et L. 2315-34 du code du travail"));
      usage(L);

      L.push("CE QUE LA DÉSIGNATION EXIGE, ET CE QU'ELLE N'EXIGE PAS");
      L.push("");
      L.push("Les membres de la commission « sont désignés par le comité social et économique");
      L.push("parmi ses membres, par une RÉSOLUTION ADOPTÉE SELON LES MODALITÉS DÉFINIES À");
      L.push("L'ARTICLE L. 2315-32, pour une durée qui prend fin avec celle du mandat des");
      L.push("membres élus du comité » (L. 2315-39).");
      L.push("");
      L.push("Et L. 2315-32 : « Les résolutions du comité social et économique sont prises À");
      L.push("LA MAJORITÉ DES MEMBRES PRÉSENTS. Le président du comité social et économique");
      L.push("NE PARTICIPE PAS AU VOTE lorsqu'il consulte les membres élus du comité en tant");
      L.push("que délégation du personnel. »");
      L.push("");
      L.push("CE QU'IL N'EST PAS BESOIN DE FAIRE — Soc., 27 novembre 2019, n° 19-14.224,");
      L.push("publié : « la désignation des membres d'une CSSCT, que sa mise en place soit");
      L.push("obligatoire ou conventionnelle, résulte d'un vote des membres du CSE à la");
      L.push("majorité des voix des membres présents lors du vote, SANS QU'IL SOIT BESOIN");
      L.push("D'UNE RÉSOLUTION PRÉALABLE FIXANT LES MODALITÉS DE L'ÉLECTION ». La Cour tire");
      L.push("cette solution de la combinaison de L. 2315-39 et de L. 2315-32, alinéa 1.");
      L.push("");
      L.push("CE QU'UN ACCORD NE PEUT PAS IMPOSER — Soc., 11 février 2026, n° 24-16.408 : la");
      L.push("Cour rappelle que les dispositions de L. 2315-39 sont d'ordre public, et retient");
      L.push("qu'une stipulation d'accord attribuant « un siège à chaque organisation");
      L.push("syndicale représentée au CSE, par ordre de représentativité » ne peut pas être");
      L.push("interprétée comme imposant une désignation PROPORTIONNELLE au résultat");
      L.push("électoral de chaque syndicat, une telle interprétation étant contraire aux");
      L.push("articles L. 2315-32 et L. 2315-39.");
      L.push("");
      L.push("VOTRE SITUATION, telle que le dossier la porte");
      L.push("  Une résolution du comité a-t-elle désigné les membres ? " +
        (res === true ? "oui" : res === false ? "NON" : "[à renseigner]"));
      L.push("  A-t-elle été adoptée à la majorité des membres présents ? " +
        (maj === true ? "oui" : maj === false ? "NON" : "[à renseigner]"));
      L.push("");

      titre(L, "1 — Ordre du jour");
      L.push("Établi par le président et le secrétaire (L. 2315-29), communiqué par le");
      L.push("président aux membres du comité, à l'agent de contrôle de l'inspection du");
      L.push("travail et à l'agent des services de prévention des organismes de sécurité");
      L.push("sociale TROIS JOURS AU MOINS avant la réunion (L. 2315-30).");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("ORDRE DU JOUR — RÉUNION DU COMITÉ SOCIAL ET ÉCONOMIQUE DU [DATE]");
      L.push("Communiqué le " + leJour(d0) + " · réunion au plus tôt le " + leJour(dans(d0, 3)) + ".");
      L.push("");
      L.push("   1. Approbation du procès-verbal de la réunion du [date].");
      L.push("   2. Désignation des membres de la commission santé, sécurité et conditions de");
      L.push("      travail — résolution soumise au vote (L. 2315-39, L. 2315-32).");
      L.push("   3. [Le cas échéant : désignation du référent en matière de lutte contre le");
      L.push("      harcèlement sexuel et les agissements sexistes, également par résolution");
      L.push("      adoptée selon les modalités de L. 2315-32 (L. 2314-1).]");
      L.push("");
      L.push("Destinataires : les membres du comité · l'agent de contrôle de l'inspection du");
      L.push("travail · l'agent des services de prévention des organismes de sécurité sociale");
      L.push("(L. 2315-30).");
      L.push("");
      L.push("Le président                              Le secrétaire du comité");
      L.push(signataire(ctx) + "        [Nom]");
      L.push("");

      titre(L, "2 — Procès-verbal de la réunion");
      L.push(nom(ctx));
      L.push("");
      L.push("PROCÈS-VERBAL DE LA RÉUNION DU COMITÉ SOCIAL ET ÉCONOMIQUE");
      L.push("Séance du [DATE], ouverte à [heure], à [lieu]");
      L.push("");
      L.push("PRÉSENTS");
      L.push("   Président : " + signataire(ctx) + " [ou son représentant : nom et qualité]");
      L.push("   Collaborateurs assistant le président : [noms] — ils ne peuvent, avec le");
      L.push("      président, être en nombre supérieur à celui des représentants du");
      L.push("      personnel titulaires lorsqu'il s'agit de la commission (L. 2315-39).");
      L.push("   Membres titulaires présents : [noms — préciser le collège de chacun]");
      L.push("   Membres suppléants présents : [noms] — le suppléant assiste aux réunions EN");
      L.push("      L'ABSENCE DU TITULAIRE (L. 2314-1).");
      L.push("   Secrétaire : [nom]");
      L.push("");
      L.push("   NOMBRE DE MEMBRES PRÉSENTS PRENANT PART AU VOTE : [ ]");
      L.push("   (le président n'en fait pas partie — L. 2315-32)");
      L.push("   MAJORITÉ REQUISE : plus de la moitié de ce nombre, soit [ ] voix.");
      L.push("");
      L.push("POINT 2 — DÉSIGNATION DES MEMBRES DE LA COMMISSION SANTÉ, SÉCURITÉ ET");
      L.push("CONDITIONS DE TRAVAIL");
      L.push("");
      L.push("Le président rappelle que les membres de la commission sont désignés par le");
      L.push("comité parmi ses membres, par une résolution adoptée selon les modalités de");
      L.push("l'article L. 2315-32, pour une durée qui prend fin avec celle du mandat des");
      L.push("membres élus du comité (L. 2315-39), et qu'aucune résolution préalable fixant");
      L.push("les modalités de l'élection n'est requise.");
      L.push("");
      L.push("Candidatures présentées : [noms et collèges].");
      L.push("");
      L.push("RÉSOLUTION SOUMISE AU VOTE :");
      L.push("« Le comité social et économique désigne, parmi ses membres, pour une durée qui");
      L.push("prend fin avec celle du mandat des membres élus du comité, en qualité de");
      L.push("membres de la commission santé, sécurité et conditions de travail :");
      L.push("   1. [Nom] — [ ] collège");
      L.push("   2. [Nom] — [ ] collège");
      L.push("   3. [Nom] — [ ] collège ».");
      L.push("");
      L.push("VOTE — à main levée [ou : à bulletin secret, si le comité en décide ainsi].");
      L.push("   Pour : [ ]   ·   Contre : [ ]   ·   Abstentions : [ ]");
      L.push("   Sur [ ] membres présents prenant part au vote.");
      L.push("   Le président n'a pas pris part au vote (L. 2315-32).");
      L.push("");
      L.push("   RÉSOLUTION [ADOPTÉE / REJETÉE] à la majorité des membres présents.");
      L.push("");
      L.push("DÉCLARATIONS — [reproduire ici les déclarations, que L. 2315-34 fait consigner");
      L.push("au procès-verbal].");
      L.push("");
      L.push("Séance levée à [heure].");
      L.push("");
      L.push("Le secrétaire du comité                    Le président");
      L.push("[Nom et signature]                         " + signataire(ctx));
      L.push("");

      titre(L, "3 — Ce que le procès-verbal doit impérativement porter");
      L.push("Trois mentions, et ce sont les trois qui manquent d'habitude :");
      L.push("");
      L.push("  · LE NOMBRE DE MEMBRES PRÉSENTS. Sans lui, la majorité n'est pas vérifiable :");
      L.push("    « à la majorité des membres présents » est un rapport, pas un mot.");
      L.push("  · LE DÉCOMPTE DES VOIX, pour, contre et abstentions.");
      L.push("  · LA MENTION QUE LE PRÉSIDENT N'A PAS PRIS PART AU VOTE (L. 2315-32).");
      L.push("");
      L.push("ÉTABLISSEMENT ET COMMUNICATION — les délibérations sont consignées dans un");
      L.push("procès-verbal établi par LE SECRÉTAIRE du comité, dans un délai et selon des");
      L.push("modalités définis par un accord conclu dans les conditions du premier alinéa de");
      L.push("l'article L. 2312-16 ou, à défaut, par décret (L. 2315-34). À DÉFAUT D'ACCORD,");
      L.push("le secrétaire l'établit DANS UN DÉLAI DE QUINZE JOURS et le communique à");
      L.push("l'employeur et aux membres du comité (R. 2315-25).");
      L.push("");
      L.push("À l'issue de ce délai, le procès-verbal est transmis à l'employeur, qui fait");
      L.push("connaître LORS DE LA RÉUNION SUIVANT CETTE TRANSMISSION sa décision motivée sur");
      L.push("les propositions qui lui ont été soumises (L. 2315-34).");
      L.push("");
      L.push("Le procès-verbal peut, APRÈS AVOIR ÉTÉ ADOPTÉ, être affiché ou diffusé dans");
      L.push("l'entreprise par le secrétaire, selon des modalités précisées par le règlement");
      L.push("intérieur du comité (L. 2315-35).");
      L.push("");
      if (maj === false) {
        L.push("VOTRE DOSSIER DÉCLARE UNE RÈGLE DE MAJORITÉ AUTRE QUE CELLE DES MEMBRES");
        L.push("PRÉSENTS. La désignation est à reprendre : L. 2315-32, alinéa 1, est la seule");
        L.push("règle à laquelle L. 2315-39 renvoie, et elle vaut que la commission soit");
        L.push("obligatoire ou conventionnelle (Soc., 27 novembre 2019, n° 19-14.224).");
        L.push("");
      }
      if (res === false) {
        L.push("VOTRE DOSSIER DÉCLARE QUE LES MEMBRES N'ONT PAS ÉTÉ DÉSIGNÉS PAR UNE");
        L.push("RÉSOLUTION DU COMITÉ. C'est la désignation elle-même qui est à reprendre :");
        L.push("L. 2315-39 impose qu'ils le soient par le comité, parmi ses membres, par une");
        L.push("résolution adoptée selon les modalités de L. 2315-32.");
        L.push("");
      }

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — l'ordre du jour est établi par le président et le",
        "secrétaire, puis communiqué aux membres, à l'inspection du travail et aux services",
        "de prévention (L. 2315-29, L. 2315-30).",
        "",
        "Le " + leJour(dans(d0, 3)) + " au plus tôt — la réunion. Trois jours au moins séparent la",
        "communication de l'ordre du jour de la réunion : c'est un minimum, pas une cible.",
        "",
        "À la réunion — le vote, à la majorité des membres présents, le président n'y",
        "prenant pas part. Le décompte est porté au procès-verbal séance tenante.",
        "",
        "Le " + leJour(dans(d0, 18)) + " au plus tard — à défaut d'accord, le secrétaire établit le",
        "procès-verbal dans les quinze jours de la réunion et le communique à l'employeur",
        "et aux membres (R. 2315-25).",
        "",
        "À la réunion suivant cette transmission — l'employeur fait connaître sa décision",
        "motivée sur les propositions qui lui ont été soumises (L. 2315-34).",
      ]);

      return pied(L, ["L. 2312-16", "L. 2314-1", "L. 2315-29", "L. 2315-30", "L. 2315-32",
                      "L. 2315-34", "L. 2315-35", "L. 2315-39", "R. 2315-25"]);
    },
  });

  DP.ajouter("CSE-CTL-SST-04", {
    nom: "La résolution rétablissant la composition initiale de la commission après un remplacement irrégulier",
    detail: "Le relevé des remplacements et de leur cause, le test des quatre fins " +
            "anticipées de mandat de L. 2314-33, la résolution de rétablissement et la " +
            "notification aux intéressés.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var r = objet(f.remplacementCssct);
      var fait = oui(r.effectue);
      var cause = r.cause;
      var L = [];

      L = L.concat(entete(ctx, "Rétablissement de la composition de la commission santé, sécurité et conditions de travail",
        "articles L. 2315-39, L. 2314-33 et L. 2315-32 du code du travail"));
      usage(L);

      L.push("LE PRINCIPE : UN TERME COMMUN, ET LUI SEUL");
      L.push("");
      L.push("Les membres de la commission sont désignés par le comité parmi ses membres");
      L.push("« pour une durée qui PREND FIN AVEC CELLE DU MANDAT DES MEMBRES ÉLUS DU");
      L.push("COMITÉ » (L. 2315-39). Ce terme commun commande : le comité ne peut pas");
      L.push("recomposer sa commission au gré des équilibres.");
      L.push("");
      L.push("Soc., 28 mai 2026, n° 24-22.914, publié : « Sauf dans les cas de fin anticipée");
      L.push("de mandat énumérés à l'article L. 2314-33 du code du travail, le comité social");
      L.push("et économique NE PEUT PROCÉDER AU REMPLACEMENT des membres d'une commission");
      L.push("santé, sécurité et conditions de travail initialement désignés AVANT LE TERME");
      L.push("DU MANDAT DES MEMBRES ÉLUS DU COMITÉ. » La Cour précise que ni un accord");
      L.push("d'entreprise ne peut y déroger, L. 2315-39 étant d'ordre public.");
      L.push("");
      L.push("L'arrêt statuait sur L. 2314-33 dans sa version antérieure à la loi n° 2025-989");
      L.push("du 24 octobre 2025 ; les causes de fin anticipée qu'il énumère sont celles de");
      L.push("la version lue par l'application.");
      L.push("");
      L.push("LES QUATRE CAUSES, ET RIEN D'AUTRE — « Les membres de la délégation du");
      L.push("personnel du comité social et économique sont élus pour quatre ans. Les");
      L.push("fonctions de ces membres prennent fin par LE DÉCÈS, LA DÉMISSION, LA RUPTURE DU");
      L.push("CONTRAT DE TRAVAIL, LA PERTE DES CONDITIONS REQUISES POUR ÊTRE ÉLIGIBLE. Ils");
      L.push("CONSERVENT LEUR MANDAT en cas de changement de catégorie professionnelle »");
      L.push("(L. 2314-33).");
      L.push("");
      L.push("Le changement de catégorie professionnelle n'est donc pas une cause de fin de");
      L.push("mandat : c'est écrit dans le texte, et c'est le motif de remplacement le plus");
      L.push("fréquemment invoqué à tort.");
      L.push("");
      L.push("VOTRE SITUATION, telle que le dossier la porte");
      L.push("  Un remplacement est-il intervenu depuis la désignation initiale ? " +
        (fait === true ? "oui" : fait === false ? "non" : "[à renseigner]"));
      L.push("  Cause déclarée : " + (cause ? "« " + String(cause) + " »" : "[non renseignée]"));
      L.push("");

      titre(L, "1 — Relevé des remplacements et de leur cause");
      L.push("Une ligne par remplacement, depuis la désignation initiale. La cause s'établit");
      L.push("par une pièce : la démission par son écrit, la rupture du contrat par le solde");
      L.push("de tout compte, la perte d'éligibilité par ce qui l'a fait perdre.");
      L.push("");
      L.push("   Membre remplacé · date · cause invoquée · pièce · figure-t-elle à L. 2314-33 ?");
      L.push("   [ ] · [ ] · [ ] · [ ] · [oui / NON]");
      L.push("   [ ] · [ ] · [ ] · [ ] · [oui / NON]");
      L.push("   [ ] · [ ] · [ ] · [ ] · [oui / NON]");
      L.push("");
      L.push("   TEST — la cause invoquée est-elle l'une des quatre suivantes ?");
      L.push("     le décès .......................................................... [ ]");
      L.push("     la démission ...................................................... [ ]");
      L.push("     la rupture du contrat de travail .................................. [ ]");
      L.push("     la perte des conditions requises pour être éligible ............... [ ]");
      L.push("");
      L.push("   Si aucune case n'est cochée, le remplacement est irrégulier — quelle que");
      L.push("   soit la stipulation d'accord qui l'aurait autorisé.");
      L.push("");
      L.push("   Causes fréquemment invoquées et qui NE FIGURENT PAS dans la liste : le");
      L.push("   changement de catégorie professionnelle (le texte dit expressément que le");
      L.push("   mandat est conservé), la perte de confiance, la réorganisation des services,");
      L.push("   le changement d'équilibre entre organisations syndicales, l'absence répétée");
      L.push("   aux réunions.");
      L.push("");

      titre(L, "2 — Résolution de rétablissement");
      L.push(nom(ctx));
      L.push("");
      L.push("RÉSOLUTION N° [ ] — RÉTABLISSEMENT DE LA COMPOSITION INITIALE DE LA COMMISSION");
      L.push("SANTÉ, SÉCURITÉ ET CONDITIONS DE TRAVAIL");
      L.push("");
      L.push("Le comité social et économique de " + nom(ctx) + ", réuni le [DATE],");
      L.push("");
      L.push("Vu l'article L. 2315-39 du code du travail, dont les dispositions sont d'ordre");
      L.push("public, aux termes duquel les membres de la commission sont désignés pour une");
      L.push("durée qui prend fin avec celle du mandat des membres élus du comité ;");
      L.push("Vu l'article L. 2314-33 du même code ;");
      L.push("Vu l'article L. 2315-32 du même code ;");
      L.push("");
      L.push("Constatant que le remplacement de [NOM] intervenu le [DATE] repose sur une cause");
      L.push("— [CAUSE INVOQUÉE] — qui ne figure pas parmi les fins anticipées de mandat");
      L.push("énumérées à l'article L. 2314-33 ;");
      L.push("");
      L.push("Constatant qu'aucune stipulation d'accord ne peut déroger à l'article");
      L.push("L. 2315-39 ;");
      L.push("");
      L.push("RÉTABLIT [NOM] dans ses fonctions de membre de la commission santé, sécurité et");
      L.push("conditions de travail, pour la durée restant à courir jusqu'au terme du mandat");
      L.push("des membres élus du comité ;");
      L.push("");
      L.push("CONSTATE que la désignation de [NOM DU REMPLAÇANT], intervenue le [DATE], est");
      L.push("privée d'effet.");
      L.push("");
      L.push("Résultat du vote : [ ] pour · [ ] contre · [ ] abstentions, sur [ ] membres");
      L.push("présents. Le président n'a pas pris part au vote (L. 2315-32).");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le [DATE].");
      L.push("");
      L.push("Le secrétaire du comité                    Le président");
      L.push("[Nom]                                      " + signataire(ctx));
      L.push("");

      titre(L, "3 — Ce qu'il faut examiner en même temps");
      L.push("  · LES ACTES PRIS DANS L'INTERVALLE. Une commission irrégulièrement composée a");
      L.push("    pu siéger, rendre des avis pour le comité — ce qu'elle ne pouvait pas faire");
      L.push("    (L. 2315-38) — ou proposer des expertises. Recensez-les : [liste].");
      L.push("  · LA STIPULATION D'ACCORD QUI A SERVI DE FONDEMENT. Si l'accord qui organise");
      L.push("    la commission autorise le remplacement en dehors des quatre causes, la");
      L.push("    clause ne peut pas s'appliquer ; le point CSE-CTL-DET-01 traite l'examen");
      L.push("    des clauses pour lui-même.");
      L.push("  · LE SIÈGE DU SECOND OU DU TROISIÈME COLLÈGE. Le rétablissement recompose la");
      L.push("    commission : vérifiez qu'après rétablissement, un siège au moins revient");
      L.push("    encore à un élu du collège que L. 2315-39 réserve.");
      L.push("");

      courrier(L, 1, "notification aux membres concernés", null);
      papier(L, ctx, ["[Nom du membre rétabli]",
                      "[Nom du membre dont la désignation est privée d'effet]",
                      "Copie : membres du comité social et économique"], leJour(d0));
      L.push("Objet : composition de la commission santé, sécurité et conditions de travail");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Les membres de la commission santé, sécurité et conditions de travail sont");
      L.push("désignés pour une durée qui prend fin avec celle du mandat des membres élus du");
      L.push("comité (article L. 2315-39 du code du travail). Sauf dans les cas de fin");
      L.push("anticipée de mandat énumérés à l'article L. 2314-33 — le décès, la démission,");
      L.push("la rupture du contrat de travail, la perte des conditions requises pour être");
      L.push("éligible —, le comité ne peut pas procéder au remplacement des membres");
      L.push("initialement désignés avant ce terme (Soc., 28 mai 2026, n° 24-22.914, publié).");
      L.push("");
      L.push("Le remplacement intervenu le [DATE] ne reposant sur aucune de ces causes, le");
      L.push("comité a rétabli la composition initiale par résolution du [DATE], dont copie");
      L.push("est jointe.");
      L.push("");
      salutation(L, ctx, "Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération distinguée.");
      L.push("Pièce jointe : extrait du procès-verbal portant la résolution");

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — vous relevez chaque remplacement et sa cause, par",
        "écrit, avec la pièce qui l'établit.",
        "",
        "Le point est inscrit à l'ordre du jour, communiqué trois jours au moins avant la",
        "réunion (L. 2315-30) : la réunion ne peut pas se tenir avant le " + leJour(dans(d0, 3)) + ".",
        "",
        "À la réunion — la résolution de rétablissement, votée à la majorité des membres",
        "présents (L. 2315-32). Une seule réunion suffit.",
        "",
        "Le " + leJour(dans(d0, 18)) + " au plus tard — le procès-verbal, à défaut d'accord",
        "(R. 2315-25), puis la notification aux deux membres concernés.",
        "",
        "Jusqu'au terme du mandat des élus — aucune recomposition, sauf survenance de",
        "l'une des quatre causes de L. 2314-33. Le terme commun est la règle, et l'accord",
        "n'y déroge pas.",
      ]);

      return pied(L, ["L. 2314-33", "L. 2315-30", "L. 2315-32", "L. 2315-38", "L. 2315-39",
                      "R. 2315-25"]);
    },
  });

  DP.ajouter("CSE-CTL-SST-05", {
    nom: "L'avenant délimitant la délégation consentie à la commission, et la charte des enquêtes après accident",
    detail: "La clause de délégation réécrite dans les limites de L. 2315-38, la liste de " +
            "ce qui ne se délègue jamais, la charte des enquêtes et des inspections, et la " +
            "reprise des avis et expertises décidés par la seule commission.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var del = objet(f.delegationCssct);
      var avis = oui(del.avisDelegue);
      var exp = oui(del.expertDelegue);
      var srcMod = f.sourceModalitesCssct;
      var L = [];

      L = L.concat(entete(ctx, "Délimitation de la délégation consentie à la commission santé, sécurité et conditions de travail",
        "article L. 2315-38 du code du travail"));
      usage(L);

      L.push("LA LIMITE, ET ELLE EST D'ORDRE PUBLIC");
      L.push("");
      L.push("« La commission santé, sécurité et conditions de travail se voit confier, PAR");
      L.push("DÉLÉGATION du comité social et économique, TOUT OU PARTIE DES ATTRIBUTIONS du");
      L.push("comité relatives à la santé, à la sécurité et aux conditions de travail, À");
      L.push("L'EXCEPTION DU RECOURS À UN EXPERT prévu à la sous-section 10 ET DES");
      L.push("ATTRIBUTIONS CONSULTATIVES du comité » (L. 2315-38).");
      L.push("");
      L.push("Soc., 13 mai 2026, n° 25-12.560 : « Aux termes de l'article L. 2315-38 du même");
      L.push("code, DONT LES DISPOSITIONS SONT D'ORDRE PUBLIC, la commission santé, sécurité");
      L.push("et conditions de travail se voit confier, par délégation du comité social et");
      L.push("économique, tout ou partie des attributions du comité relatives à la santé, à");
      L.push("la sécurité et aux conditions de travail, à l'exception du recours à un expert");
      L.push("prévu à la sous-section 10 et des attributions consultatives du comité. »");
      L.push("L'accord en cause réservait expressément au comité le recueil de l'avis et la");
      L.push("décision de recourir à l'expert.");
      L.push("");
      L.push("« D'ordre public » veut dire que l'accord ne peut pas en disposer autrement. Ce");
      L.push("qui se joue n'est donc pas la validité de l'accord seul : un AVIS rendu par la");
      L.push("seule commission n'est pas l'avis du comité, et la décision prise ensuite");
      L.push("repose sur une consultation qui n'a pas eu lieu ; une EXPERTISE décidée par la");
      L.push("commission n'a pas été décidée par qui devait la décider.");
      L.push("");
      L.push("VOTRE SITUATION, telle que le dossier la porte");
      L.push("  Les attributions consultatives sont-elles déléguées ? " +
        (avis === true ? "OUI — à retirer" : avis === false ? "non" : "[à renseigner]"));
      L.push("  Le recours à l'expert est-il délégué ? .............. " +
        (exp === true ? "OUI — à retirer" : exp === false ? "non" : "[à renseigner]"));
      L.push("  Acte qui organise la commission : " +
        (srcMod ? String(srcMod) : "[accord d'entreprise / accord avec le comité / règlement intérieur du comité]"));
      L.push("");

      titre(L, "1 — Ce qui peut être délégué, et ce qui ne peut pas l'être");
      L.push("PEUT ÊTRE DÉLÉGUÉ — tout ou partie des attributions du comité relatives à la");
      L.push("santé, à la sécurité et aux conditions de travail. Parmi celles que le corpus");
      L.push("lu par l'application nomme :");
      L.push("");
      L.push("  · procéder, à intervalles réguliers, à des INSPECTIONS en matière de santé,");
      L.push("    de sécurité et des conditions de travail (L. 2312-13) ;");
      L.push("  · réaliser des ENQUÊTES en matière d'accidents du travail ou de maladies");
      L.push("    professionnelles ou à caractère professionnel (L. 2312-13, L. 2312-5) ;");
      L.push("  · demander à entendre le chef d'une entreprise voisine dont l'activité expose");
      L.push("    les travailleurs de son ressort à des nuisances particulières");
      L.push("    (L. 2312-13) ;");
      L.push("  · faire appel, à titre consultatif et occasionnel, au concours de toute");
      L.push("    personne de l'entreprise qui paraîtrait qualifiée (L. 2312-13) ;");
      L.push("  · procéder à l'ANALYSE DES RISQUES PROFESSIONNELS auxquels peuvent être");
      L.push("    exposés les travailleurs, notamment les femmes enceintes, ainsi que des");
      L.push("    effets de l'exposition aux facteurs de risques professionnels mentionnés à");
      L.push("    l'article L. 4161-1 (L. 2312-9, 1°) ;");
      L.push("  · contribuer notamment à faciliter l'accès des femmes à tous les emplois, à");
      L.push("    la résolution des problèmes liés à la maternité, à l'adaptation et à");
      L.push("    l'aménagement des postes de travail afin de faciliter l'accès et le");
      L.push("    maintien des personnes handicapées à tous les emplois (L. 2312-9, 2°) ;");
      L.push("  · susciter toute initiative utile et proposer notamment des actions de");
      L.push("    prévention du harcèlement moral, du harcèlement sexuel et des agissements");
      L.push("    sexistes définis à l'article L. 1142-2-1 — le refus de l'employeur étant");
      L.push("    motivé (L. 2312-9, 3°).");
      L.push("");
      L.push("NE PEUT JAMAIS ÊTRE DÉLÉGUÉ (L. 2315-38) :");
      L.push("  · LES ATTRIBUTIONS CONSULTATIVES DU COMITÉ. Le comité émet ses avis et ses");
      L.push("    vœux lui-même (L. 2312-15) ; la commission peut préparer, elle ne peut pas");
      L.push("    rendre.");
      L.push("  · LE RECOURS À UN EXPERT prévu à la sous-section 10. Le comité peut décider");
      L.push("    d'y recourir « le cas échéant SUR PROPOSITION DES COMMISSIONS constituées");
      L.push("    en son sein » (L. 2315-78) : c'est là ce que les commissions apportent à");
      L.push("    l'expertise, et la seule chose qu'elles y apportent.");
      L.push("");
      L.push("À VÉRIFIER AUSSI — les droits d'alerte. Le membre de la délégation du personnel");
      L.push("qui constate une atteinte aux droits des personnes, à leur santé physique et");
      L.push("mentale ou aux libertés individuelles saisit immédiatement l'employeur, qui");
      L.push("procède SANS DÉLAI à une enquête avec lui (L. 2312-59) ; un membre exerce les");
      L.push("droits d'alerte en situation de danger grave et imminent ainsi qu'en matière de");
      L.push("santé publique et d'environnement dans les conditions prévues, selon le cas,");
      L.push("aux articles L. 4132-1 à L. 4132-5 et L. 4133-1 à L. 4133-4 (L. 2312-60). Ces");
      L.push("droits sont exercés INDIVIDUELLEMENT par le membre : une clause qui les");
      L.push("canaliserait par la commission les déplacerait. [Les articles L. 4132-1 à");
      L.push("L. 4132-5 et L. 4133-1 à L. 4133-4 ne figurent pas au corpus lu par");
      L.push("l'application, à l'exception de L. 4132-2 : ils sont nommés, non résumés.]");
      L.push("");

      titre(L, "2 — Avenant délimitant la délégation");
      L.push("À porter à l'accord de L. 2315-41 ou de L. 2315-42, ou au chapitre correspondant");
      L.push("du règlement intérieur du comité (L. 2315-44), selon ce qui organise votre");
      L.push("commission.");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("AVENANT N° [ ] — DÉLÉGATION CONSENTIE À LA COMMISSION SANTÉ, SÉCURITÉ ET");
      L.push("CONDITIONS DE TRAVAIL");
      L.push("");
      L.push("Article 1 — Objet");
      L.push("Le présent avenant remplace l'article [ ] de [l'accord du … / du règlement");
      L.push("intérieur du comité], relatif aux missions déléguées à la commission et à leurs");
      L.push("modalités d'exercice (L. 2315-41, 2°).");
      L.push("");
      L.push("Article 2 — Missions déléguées");
      L.push("Le comité social et économique délègue à la commission santé, sécurité et");
      L.push("conditions de travail les attributions suivantes, relatives à la santé, à la");
      L.push("sécurité et aux conditions de travail :");
      L.push("   a) [les inspections à intervalles réguliers — L. 2312-13] ;");
      L.push("   b) [les enquêtes en matière d'accidents du travail et de maladies");
      L.push("      professionnelles ou à caractère professionnel — L. 2312-13, L. 2312-5] ;");
      L.push("   c) [l'analyse des risques professionnels — L. 2312-9, 1°] ;");
      L.push("   d) [l'instruction des projets soumis à consultation, à charge d'en rendre");
      L.push("      compte au comité, qui seul rend l'avis] ;");
      L.push("   e) [ … ].");
      L.push("[Ne laissez que ce que vous déléguez réellement. Une délégation large et vague");
      L.push("ne donne aucun pouvoir de plus à la commission : elle rend seulement incertain");
      L.push("ce qu'elle peut faire.]");
      L.push("");
      L.push("Article 3 — Ce qui demeure au comité");
      L.push("Conformément à l'article L. 2315-38 du code du travail, dont les dispositions");
      L.push("sont d'ordre public, sont EXPRESSÉMENT EXCLUS de la délégation :");
      L.push("   1° LES ATTRIBUTIONS CONSULTATIVES DU COMITÉ. Le comité social et économique");
      L.push("      rend seul ses avis et ses vœux. La commission peut instruire, préparer et");
      L.push("      rapporter ; elle ne délibère pas à la place du comité.");
      L.push("   2° LE RECOURS À UN EXPERT prévu à la sous-section 10. La commission peut");
      L.push("      PROPOSER une expertise ; le comité seul la décide, par délibération.");
      L.push("");
      L.push("Article 4 — Modalités d'exercice");
      L.push("La commission rend compte de ses travaux au comité [à chaque réunion portant");
      L.push("sur la santé, la sécurité et les conditions de travail / selon la périodicité");
      L.push("suivante : …]. Ses rapports sont [transmis aux membres du comité avant la");
      L.push("réunion / annexés au procès-verbal].");
      L.push("");
      L.push("Article 5 — Entrée en vigueur");
      L.push("Le présent avenant entre en vigueur le [DATE]. Il est notifié aux membres de la");
      L.push("commission et à ceux du comité.");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le [DATE].");
      L.push("");
      L.push("[Signatures selon l'instrument : parties à l'accord d'entreprise · employeur et");
      L.push("membres titulaires du comité pour l'accord de L. 2315-42 · secrétaire et");
      L.push("président pour la modification du règlement intérieur du comité.]");
      L.push("");

      titre(L, "3 — Charte des inspections et des enquêtes");
      L.push("Les enquêtes et les inspections sont, elles, parfaitement délégables — et c'est");
      L.push("le cœur de ce que fait une commission. Une charte évite deux écueils : l'enquête");
      L.push("qui n'a lieu que si quelqu'un y pense, et l'enquête qui déborde sur l'avis.");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("CHARTE DES INSPECTIONS ET DES ENQUÊTES DE LA COMMISSION SANTÉ, SÉCURITÉ ET");
      L.push("CONDITIONS DE TRAVAIL");
      L.push("");
      L.push("Article 1 — Inspections régulières (L. 2312-13)");
      L.push("La commission procède, à intervalles réguliers, à des inspections en matière de");
      L.push("santé, de sécurité et des conditions de travail.");
      L.push("   Périodicité retenue : [ ]   ·   périmètre : [unités de travail, sites]");
      L.push("   Compte rendu : [modèle joint], transmis au comité et à l'employeur.");
      L.push("");
      L.push("Article 2 — Déclenchement d'une enquête");
      L.push("La commission réalise une enquête en matière d'accidents du travail ou de");
      L.push("maladies professionnelles ou à caractère professionnel (L. 2312-13). Elle est");
      L.push("déclenchée :");
      L.push("   · à la suite de tout accident du travail [préciser le seuil retenu : tout");
      L.push("     accident, tout accident avec arrêt, tout accident grave] ;");
      L.push("   · à la suite d'incidents répétés ayant révélé un risque grave ;");
      L.push("   · en cas de maladie professionnelle ou à caractère professionnel déclarée ;");
      L.push("   · [à la demande de … ].");
      L.push("");
      L.push("Article 3 — Composition de l'équipe d'enquête et délais");
      L.push("   Composition : [au moins un membre de la commission et un représentant de");
      L.push("   l'employeur — préciser].");
      L.push("   Délai de déclenchement : [ ] jours ouvrés à compter de la connaissance des");
      L.push("   faits.  ·  Remise du rapport : [ ] jours ouvrés.");
      L.push("");
      L.push("Article 4 — Temps passé");
      L.push("Le temps passé aux enquêtes menées après un accident du travail grave ou des");
      L.push("incidents répétés ayant révélé un risque grave ou une maladie professionnelle ou");
      L.push("à caractère professionnel grave EST PAYÉ COMME TEMPS DE TRAVAIL EFFECTIF ET");
      L.push("N'EST PAS DÉDUIT des heures de délégation (L. 2315-11, 3°). Il en va de même du");
      L.push("temps passé à la recherche de mesures préventives dans toute situation d'urgence");
      L.push("et de gravité, notamment lors de la mise en œuvre de la procédure de danger");
      L.push("grave et imminent prévue à l'article L. 4132-2 (L. 2315-11, 1°).");
      L.push("");
      L.push("Article 5 — Trame du rapport d'enquête");
      L.push("   1. Faits : date, heure, lieu, poste, personnes concernées, circonstances.");
      L.push("   2. Constatations matérielles : [équipements, organisation, consignes].");
      L.push("   3. Causes retenues, immédiates et sous-jacentes.");
      L.push("   4. Mesures de prévention proposées, avec échéance et responsable.");
      L.push("   5. Renvoi au document unique d'évaluation des risques : le risque était-il");
      L.push("      évalué ? l'évaluation doit-elle être révisée ?");
      L.push("   6. Suites : le comité est informé des suites réservées à ses observations");
      L.push("      (L. 2312-13).");
      L.push("");
      L.push("Article 6 — Ce que l'enquête ne fait pas");
      L.push("Le rapport d'enquête n'est pas un avis. Lorsque les faits appellent une");
      L.push("consultation du comité, celui-ci est saisi et rend lui-même son avis");
      L.push("(L. 2315-38, L. 2312-15). Lorsqu'ils appellent une expertise, la commission peut");
      L.push("la PROPOSER au comité, qui seul la décide (L. 2315-38, L. 2315-78).");
      L.push("");
      L.push("Article 7 — Réunion consécutive à un accident grave");
      L.push("Le comité est réuni à la suite de tout accident ayant entraîné ou ayant pu");
      L.push("entraîner des conséquences graves, ainsi qu'en cas d'événement grave lié à");
      L.push("l'activité de l'entreprise ayant porté atteinte ou ayant pu porter atteinte à la");
      L.push("santé publique ou à l'environnement, ou à la demande motivée de deux de ses");
      L.push("membres représentants du personnel (L. 2315-27). L'agent de contrôle de");
      L.push("l'inspection du travail et les agents des services de prévention des organismes");
      L.push("de sécurité sociale sont invités aux réunions du comité consécutives à un");
      L.push("accident du travail ayant entraîné un arrêt de travail d'au moins HUIT JOURS ou");
      L.push("à une maladie professionnelle ou à caractère professionnel (L. 2314-3, II, 3°).");
      L.push("");
      L.push("Adoptée par le comité social et économique le [DATE].");
      L.push("");

      titre(L, "4 — Reprendre ce qui a été fait dans l'intervalle");
      L.push("Retirer la clause ne suffit pas : ce qui a été décidé sous son empire doit");
      L.push("l'être à nouveau, par qui devait le décider.");
      L.push("");
      L.push("   Acte · date · pris par · à reprendre par le comité ? · date de reprise");
      L.push("   Avis rendu sur [ ] · [ ] · [commission / comité] · [oui/non] · [ ]");
      L.push("   Expertise décidée sur [ ] · [ ] · [commission / comité] · [oui/non] · [ ]");
      L.push("   [ ] · [ ] · [ ] · [ ] · [ ]");
      L.push("");
      L.push("Un avis rendu par la seule commission se reprend par une délibération du");
      L.push("comité ; une expertise décidée par elle se reprend par une délibération du");
      L.push("comité également (le point CSE-CTL-EXP-04 produit cette délibération).");

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — vous relisez la clause de délégation et vous isolez",
        "ce qui excède L. 2315-38. Vous recensez les avis et les expertises pris dans",
        "l'intervalle.",
        "",
        "Selon l'instrument, comptez :",
        "  · un avenant à l'accord d'entreprise — deux à trois mois de négociation ;",
        "  · un avenant à l'accord avec le comité de L. 2315-42 — une à deux réunions ;",
        "  · une modification du règlement intérieur du comité — une réunion, l'ordre du",
        "    jour étant communiqué trois jours au moins avant, soit au plus tôt le " +
          leJour(dans(d0, 3)) + ".",
        "",
        "Sans attendre l'avenant — les avis se rendent dès maintenant par le comité, et les",
        "expertises se décident par lui. La clause contraire ne s'applique pas : elle est",
        "contraire à un texte d'ordre public, et il n'y a pas à attendre sa réécriture pour",
        "cesser de l'appliquer.",
        "",
        "À l'entrée en vigueur — notification aux membres de la commission et du comité,",
        "puis adoption de la charte des inspections et des enquêtes.",
      ]);

      return pied(L, ["L. 2312-5", "L. 2312-9", "L. 2312-13", "L. 2312-15", "L. 2312-59",
                      "L. 2312-60", "L. 2314-3", "L. 2315-11", "L. 2315-27", "L. 2315-38",
                      "L. 2315-41", "L. 2315-42", "L. 2315-44", "L. 2315-78"]);
    },
  });

  DP.ajouter("CSE-CTL-SST-06", {
    nom: "L'acte fixant les modalités de la commission : accord d'entreprise, accord avec le comité, ou chapitre du règlement intérieur",
    detail: "L'ordre des trois sources, l'acte rédigé article par article sur les six " +
            "points de L. 2315-41, l'ordre du jour et le procès-verbal type des réunions de " +
            "la commission, et le courrier d'ouverture de la négociation.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var srcMod = f.sourceModalitesCssct;
      var eff = effectifDe(ctx);
      var L = [];

      L = L.concat(entete(ctx, "Modalités de mise en place et de fonctionnement de la commission santé, sécurité et conditions de travail",
        "articles L. 2315-41 à L. 2315-44 et L. 2315-24 du code du travail"));
      usage(L);

      L.push("POURQUOI CET ACTE EST LE PREMIER DE TOUS");
      L.push("");
      L.push("Une commission sans règles écrites n'a ni missions ni moyens établis, et");
      L.push("l'étendue de la délégation qu'elle exerce ne peut pas être vérifiée. On ne sait");
      L.push("alors ni combien elle compte de membres, ni ce qu'elle fait, ni de combien");
      L.push("d'heures ses membres disposent — et c'est cette incertitude, plus que");
      L.push("l'irrégularité elle-même, qui se paie le jour d'un contentieux.");
      L.push("");
      L.push("L'ORDRE DES TROIS SOURCES");
      L.push("");
      ordreCssct(L);
      L.push("  Ce que votre dossier déclare : " +
        (srcMod ? "« " + String(srcMod) + " »" : "[non renseigné]"));
      if (String(srcMod) === "aucune") {
        L.push("");
        L.push("  RIEN NE FIXE AUJOURD'HUI LES MODALITÉS. À défaut d'accord prévu aux articles");
        L.push("  L. 2315-41 et L. 2315-42, c'est le règlement intérieur du comité qui DOIT");
        L.push("  définir les modalités mentionnées aux 1° à 6° de L. 2315-41 (L. 2315-44).");
        L.push("  Ce n'est pas une faculté.");
      }
      L.push("");

      titre(L, "1 — L'acte, article par article");
      L.push("Le corps qui suit est le même quel que soit l'instrument : ce sont les six");
      L.push("points de L. 2315-41 qui commandent, et ils ne changent pas selon que l'acte");
      L.push("est un accord ou un chapitre du règlement intérieur. Seuls l'en-tête et les");
      L.push("signatures diffèrent.");
      L.push("");
      L.push("EN-TÊTE À CHOISIR :");
      L.push("  [A] ACCORD D'ENTREPRISE relatif à la commission santé, sécurité et conditions");
      L.push("      de travail, conclu dans les conditions de l'article L. 2313-2 du code du");
      L.push("      travail (L. 2315-41), entre " + nom(ctx) + ", représentée par");
      L.push("      " + signataire(ctx) + ", et les organisations syndicales représentatives");
      L.push("      [ … ].");
      L.push("  [B] ACCORD ENTRE L'EMPLOYEUR ET LE COMITÉ SOCIAL ET ÉCONOMIQUE, en l'absence");
      L.push("      de délégué syndical, adopté à la majorité des membres titulaires élus de");
      L.push("      la délégation du personnel du comité (L. 2315-42).");
      L.push("  [C] CHAPITRE [ ] DU RÈGLEMENT INTÉRIEUR DU COMITÉ SOCIAL ET ÉCONOMIQUE, à");
      L.push("      défaut d'accord prévu aux articles L. 2315-41 et L. 2315-42 (L. 2315-44),");
      L.push("      le comité déterminant ce règlement intérieur (L. 2315-24).");
      L.push("");
      L.push("      [Rappel pour l'option C : sauf accord de l'employeur, un règlement");
      L.push("      intérieur ne peut comporter des clauses lui imposant des obligations ne");
      L.push("      résultant pas de dispositions légales ; cet accord constitue un engagement");
      L.push("      unilatéral qu'il peut dénoncer à l'issue d'un délai raisonnable et après");
      L.push("      en avoir informé les membres de la délégation du personnel (L. 2315-24).]");
      L.push("");
      L.push("ARTICLE 1 — CHAMP ET FONDEMENT");
      L.push("Le présent acte fixe les modalités de mise en place et de fonctionnement de la");
      L.push("commission santé, sécurité et conditions de travail créée au sein du comité");
      L.push("social et économique de " + nom(ctx) + " en application de");
      L.push("[l'article L. 2315-36, 1° ou 2° — entreprise ou établissement distinct d'au");
      L.push("moins trois cents salariés / l'article L. 2315-36, 3° / la décision de");
      L.push("l'inspecteur du travail du [date], prise en application de L. 2315-37 / une");
      L.push("mise en place volontaire hors des cas de L. 2315-36 et L. 2315-37, le nombre et");
      L.push("le périmètre étant alors fixés par le présent acte, L. 2315-43].");
      L.push("");
      L.push("ARTICLE 2 — NOMBRE DE MEMBRES (L. 2315-41, 1°)");
      L.push("La commission comprend [NOMBRE] membres représentants du personnel.");
      L.push("Ce nombre ne peut être inférieur à TROIS, et un siège au moins revient à un");
      L.push("représentant du second collège ou, le cas échéant, du troisième collège prévu à");
      L.push("l'article L. 2314-11 (L. 2315-39).");
      L.push("Les membres sont désignés par le comité parmi ses membres, par une résolution");
      L.push("adoptée à la majorité des membres présents, pour une durée qui prend fin avec");
      L.push("celle du mandat des membres élus du comité (L. 2315-39, L. 2315-32).");
      L.push("[Le cas échéant, en l'absence d'accord prévu à l'article L. 2315-45, les membres");
      L.push("des commissions peuvent être choisis parmi des salariés de l'entreprise");
      L.push("n'appartenant pas au comité (R. 2315-28) — cette faculté ne vaut pas pour la");
      L.push("commission santé, sécurité et conditions de travail, dont L. 2315-39 impose que");
      L.push("les membres soient désignés parmi les membres du comité.]");
      L.push("");
      L.push("ARTICLE 3 — MISSIONS DÉLÉGUÉES ET MODALITÉS D'EXERCICE (L. 2315-41, 2°)");
      L.push("Le comité délègue à la commission : [ÉNUMÉRER].");
      L.push("Sont expressément exclus de la délégation, conformément à l'article L. 2315-38");
      L.push("dont les dispositions sont d'ordre public : les attributions consultatives du");
      L.push("comité et le recours à un expert prévu à la sous-section 10.");
      L.push("[Le point CSE-CTL-SST-05 de ce module rédige cette délimitation en détail.]");
      L.push("");
      L.push("ARTICLE 4 — FONCTIONNEMENT ET HEURES DE DÉLÉGATION (L. 2315-41, 3°)");
      L.push("  4.1 Présidence — la commission est présidée par l'employeur ou son");
      L.push("      représentant. L'employeur peut se faire assister par des collaborateurs");
      L.push("      appartenant à l'entreprise et choisis en dehors du comité ; ensemble, ils");
      L.push("      ne peuvent pas être en nombre supérieur à celui des représentants du");
      L.push("      personnel titulaires (L. 2315-39).");
      L.push("  4.2 Rapporteur — [le comité désigne parmi les membres de la commission un");
      L.push("      rapporteur chargé de rendre compte au comité].");
      L.push("  4.3 Périodicité — la commission se réunit [ ] fois par an, et en outre");
      L.push("      [à la suite d'un accident grave / à la demande de … ].");
      L.push("  4.4 Convocation et ordre du jour — [délai et auteur : préciser]. Rappel : les");
      L.push("      réunions du comité portant sur la santé et la sécurité obéissent, elles, à");
      L.push("      L. 2315-29 et L. 2315-30.");
      L.push("  4.5 Heures de délégation — chaque membre de la commission dispose de [ ]");
      L.push("      heures par mois pour l'exercice de ses missions au sein de la commission.");
      L.push("      Ces heures s'ajoutent [ou : ne s'ajoutent pas] au crédit dont il dispose");
      L.push("      comme membre de la délégation du personnel. [Le nombre est un choix que la");
      L.push("      loi laisse à l'acte : le 3° de L. 2315-41 impose de le fixer, il n'en fixe");
      L.push("      pas le montant.]");
      L.push("  4.6 Temps de réunion — le temps passé aux réunions de la commission est");
      L.push("      rémunéré comme du temps de travail et n'est pas déduit des heures de");
      L.push("      délégation prévues pour les membres titulaires (R. 2315-7, dernier");
      L.push("      alinéa).");
      L.push("  4.7 Participants de droit — assistent avec voix consultative aux réunions de");
      L.push("      la commission le médecin du travail, qui peut donner délégation à un");
      L.push("      membre de l'équipe pluridisciplinaire du service de prévention et de santé");
      L.push("      au travail ayant compétence en matière de santé au travail ou de");
      L.push("      conditions de travail, et le responsable interne du service de sécurité et");
      L.push("      des conditions de travail ou, à défaut, l'agent chargé de la sécurité et");
      L.push("      des conditions de travail (L. 2314-3, I). L'agent de contrôle de");
      L.push("      l'inspection du travail et les agents des services de prévention des");
      L.push("      organismes de sécurité sociale sont invités aux réunions de la commission");
      L.push("      (L. 2314-3, II, 1°).");
      L.push("  4.8 Secret et discrétion — les membres sont tenus au secret professionnel");
      L.push("      pour les questions relatives aux procédés de fabrication et à une");
      L.push("      obligation de discrétion à l'égard des informations confidentielles");
      L.push("      présentées comme telles par l'employeur (L. 2315-3). Il en va de même des");
      L.push("      collaborateurs assistant l'employeur (L. 2315-39).");
      L.push("");
      L.push("ARTICLE 5 — FORMATION (L. 2315-41, 4°)");
      L.push("Les membres bénéficient de la formation prévue aux articles L. 2315-16 à");
      L.push("L. 2315-18, d'une durée minimale de CINQ JOURS lors du premier mandat ; en cas");
      L.push("de renouvellement, de TROIS JOURS pour chaque membre de la délégation du");
      L.push("personnel quelle que soit la taille de l'entreprise et de CINQ JOURS pour les");
      L.push("membres de la commission dans les entreprises d'au moins trois cents salariés");
      L.push("(L. 2315-18)" + (eff != null ? " — votre effectif étant de " + eff + " salariés" : "") + ".");
      L.push("Le temps consacré à ces formations est pris sur le temps de travail, rémunéré");
      L.push("comme tel, et n'est pas déduit des heures de délégation (L. 2315-16). Le");
      L.push("financement est pris en charge par l'employeur (L. 2315-18).");
      L.push("Le présent acte ne peut pas descendre sous ces durées : il en fixe les");
      L.push("modalités, non le plancher.");
      L.push("   Modalités retenues : [organisme, calendrier, groupage des sessions].");
      L.push("");
      L.push("ARTICLE 6 — MOYENS ALLOUÉS (L. 2315-41, 5°)");
      L.push("[Le cas échéant : local, matériel, documentation, accès aux registres et");
      L.push("documents mentionnés à l'article L. 4711-1 — présentés au comité au cours de la");
      L.push("réunion qui suit leur réception par l'employeur, chaque membre pouvant à tout");
      L.push("moment en demander la transmission (R. 2315-23) —, budget de déplacement entre");
      L.push("sites, temps de préparation.]");
      L.push("");
      L.push("ARTICLE 7 — FORMATION SPÉCIFIQUE AUX RISQUES PARTICULIERS (L. 2315-41, 6°)");
      L.push("[Le cas échéant : conditions et modalités dans lesquelles une formation");
      L.push("spécifique correspondant aux risques ou facteurs de risques particuliers, en");
      L.push("rapport avec l'activité de l'entreprise, est dispensée aux membres.]");
      L.push("Activité de l'entreprise : " + cro((ctx.profil || {}).secteur, "secteur d'activité") + ".");
      L.push("Risques particuliers identifiés : [reprendre le document unique d'évaluation");
      L.push("des risques].");
      L.push("");
      L.push("ARTICLE 8 — DURÉE, RÉVISION, DÉPÔT");
      L.push("[Pour les options A et B : durée, révision, dénonciation, et dépôt selon les");
      L.push("formalités applicables à l'instrument retenu. Pour l'option C : le chapitre");
      L.push("s'intègre au règlement intérieur du comité et se modifie comme lui.]");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le [DATE].");
      L.push("");

      titre(L, "2 — Ordre du jour et procès-verbal type d'une réunion de la commission");
      L.push("Ce sont les deux pièces qui font exister la commission dans le dossier. Sans");
      L.push("elles, ses travaux ne se prouvent pas.");
      L.push("");
      L.push("ORDRE DU JOUR — RÉUNION DE LA COMMISSION SANTÉ, SÉCURITÉ ET CONDITIONS DE");
      L.push("TRAVAIL DU [DATE]");
      L.push("Adressé le [DATE] aux membres, au médecin du travail et au responsable du");
      L.push("service de sécurité et des conditions de travail (L. 2314-3, I) ; l'agent de");
      L.push("contrôle de l'inspection du travail et les agents des services de prévention des");
      L.push("organismes de sécurité sociale y sont invités (L. 2314-3, II, 1°).");
      L.push("");
      L.push("   1. Approbation du compte rendu de la réunion du [date].");
      L.push("   2. Suites données aux observations de la commission (L. 2312-13).");
      L.push("   3. Accidents du travail et maladies professionnelles survenus depuis la");
      L.push("      dernière réunion : enquêtes réalisées, rapports, mesures proposées.");
      L.push("   4. Inspections réalisées à intervalles réguliers : constats et suites.");
      L.push("   5. Analyse des risques professionnels : révision du document unique.");
      L.push("   6. Documents mentionnés à l'article L. 4711-1 reçus depuis la dernière");
      L.push("      réunion (R. 2315-23), et observations de l'inspecteur du travail, du");
      L.push("      médecin inspecteur du travail et des agents des services de prévention.");
      L.push("   7. Projets à instruire pour le comité — POUR PRÉPARATION SEULEMENT : le");
      L.push("      comité rend seul son avis (L. 2315-38).");
      L.push("   8. [Le cas échéant : propositions de recours à un expert à soumettre au");
      L.push("      comité, qui seul décide (L. 2315-38, L. 2315-78).]");
      L.push("");
      L.push("COMPTE RENDU DE LA RÉUNION DE LA COMMISSION DU [DATE]");
      L.push("   Présents : [membres · président ou son représentant · collaborateurs ·");
      L.push("   médecin du travail · responsable sécurité · invités présents]");
      L.push("   Absents excusés : [ ]");
      L.push("   Point par point : [constats · propositions · échéances · responsables]");
      L.push("   Propositions soumises au comité : [ ]");
      L.push("   Prochaine réunion : [date]");
      L.push("   Rapporteur : [nom et signature]");
      L.push("");
      L.push("Le compte rendu de la commission n'est pas le procès-verbal du comité : celui-ci");
      L.push("est établi par le secrétaire du comité (L. 2315-34) et, à défaut d'accord, dans");
      L.push("les quinze jours (R. 2315-25).");
      L.push("");

      courrier(L, 1, "ouverture de la négociation, ou saisine du comité", [
        "Adressez la version A aux organisations syndicales représentatives s'il en existe ;",
        "la version B au comité en l'absence de délégué syndical. Le règlement intérieur du",
        "comité ne vient qu'après, et à défaut d'accord.",
      ]);
      papier(L, ctx, ["[Aux organisations syndicales représentatives dans l'entreprise]",
                      "[ou : Aux membres du comité social et économique]"], leJour(d0));
      L.push("Objet : modalités de mise en place de la commission santé, sécurité et");
      L.push("conditions de travail");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("L'article L. 2315-41 du code du travail confie à l'accord d'entreprise défini à");
      L.push("l'article L. 2313-2 le soin de fixer les modalités de mise en place de la");
      L.push("commission santé, sécurité et conditions de travail, en définissant le nombre");
      L.push("de ses membres, les missions qui lui sont déléguées et leurs modalités");
      L.push("d'exercice, ses modalités de fonctionnement — notamment le nombre d'heures de");
      L.push("délégation —, les modalités de formation de ses membres, et le cas échéant les");
      L.push("moyens qui lui sont alloués et la formation spécifique correspondant aux risques");
      L.push("particuliers de notre activité.");
      L.push("");
      L.push("[Version A] J'ouvre en conséquence la négociation d'un accord d'entreprise sur");
      L.push("ces six points, et vous convie à une première réunion le [DATE].");
      L.push("");
      L.push("[Version B] En l'absence de délégué syndical dans l'entreprise, l'article");
      L.push("L. 2315-42 permet qu'un accord entre l'employeur et le comité, adopté à la");
      L.push("majorité des membres titulaires élus de la délégation du personnel, fixe ces");
      L.push("mêmes modalités. Je soumets à cette fin le projet ci-joint, inscrit à l'ordre du");
      L.push("jour de la réunion du [DATE].");
      L.push("");
      L.push("À défaut d'accord, c'est le règlement intérieur du comité qui devra définir ces");
      L.push("modalités (L. 2315-44).");
      L.push("");
      salutation(L, ctx);
      L.push("Pièce jointe : projet d'acte fixant les modalités de la commission");

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — vous adressez le courrier 1 et vous joignez le projet",
        "d'acte. La recherche de l'accord doit être réelle : le règlement intérieur du",
        "comité ne joue qu'« en l'absence d'accord prévu aux articles L. 2315-41 et",
        "L. 2315-42 ».",
        "",
        "Première réunion de négociation — à fixer vers le " + leJour(dans(d0, 15)) + ".",
        "",
        "Comptez deux à trois mois pour un accord d'entreprise, soit une conclusion vers le",
        leJour(dans(d0, 75)) + ". Pour l'accord avec le comité de L. 2315-42, une à deux",
        "réunions suffisent.",
        "",
        "À défaut d'accord — une réunion du comité pour compléter son règlement intérieur,",
        "l'ordre du jour étant communiqué trois jours au moins avant (L. 2315-30).",
        "",
        "Dès l'acte adopté — la désignation des membres peut avoir lieu (point",
        "CSE-CTL-SST-01), puis leur formation dans les deux à trois mois (point",
        "CSE-CTL-SST-07). L'ordre compte : on ne désigne pas dans un cadre qui n'existe",
        "pas.",
      ]);

      return pied(L, ["L. 2313-2", "L. 2314-3", "L. 2314-11", "L. 2315-3", "L. 2315-16",
                      "L. 2315-18", "L. 2315-24", "L. 2315-29", "L. 2315-30", "L. 2315-32",
                      "L. 2315-34", "L. 2315-36", "L. 2315-37", "L. 2315-38", "L. 2315-39",
                      "L. 2315-41", "L. 2315-42", "L. 2315-43", "L. 2315-44", "L. 2315-78",
                      "R. 2315-7", "R. 2315-23", "R. 2315-25", "R. 2315-28"]);
    },
  });

  DP.ajouter("CSE-CTL-SST-07", {
    nom: "La formation des membres de la commission : durée due, convocation, prise en charge et attestations",
    detail: "La durée minimale calculée sur la qualité du mandat et l'effectif, ce que " +
            "l'accord peut et ne peut pas faire, la convocation, la formation spécifique aux " +
            "risques de l'activité, et le bordereau des attestations.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var eff = effectifDe(ctx);
      var renouv = oui(f.mandatRenouvele);
      var jours = nb(f.joursFormationSSCT);
      var membres = liste(f.membresCssct);
      var enPlace = oui(f.cssct);
      var L = [];

      var due = null;
      if (renouv === false) due = 5;
      else if (renouv === true && eff != null) due = eff >= 300 ? 5 : 3;

      L = L.concat(entete(ctx, "Formation des membres de la commission santé, sécurité et conditions de travail",
        "articles L. 2315-18, L. 2315-16 et L. 2315-41, 4°, du code du travail"));
      usage(L);

      L.push("LA DURÉE, ET CE QUI LA COMMANDE");
      L.push("");
      L.push("« Les membres de la délégation du personnel du comité social et économique et le");
      L.push("référent prévu au dernier alinéa de l'article L. 2314-1 bénéficient de la");
      L.push("formation nécessaire à l'exercice de leurs missions en matière de santé, de");
      L.push("sécurité et de conditions de travail prévues au chapitre II du présent titre,");
      L.push("dans des conditions déterminées par décret en Conseil d'État.");
      L.push("");
      L.push("La formation est d'une durée minimale de CINQ JOURS lors du premier mandat des");
      L.push("membres de la délégation du personnel. En cas de renouvellement de ce mandat, la");
      L.push("formation est d'une durée minimale :");
      L.push("  1° De TROIS JOURS pour chaque membre de la délégation du personnel, quelle que");
      L.push("     soit la taille de l'entreprise ;");
      L.push("  2° De CINQ JOURS pour les membres de la commission santé, sécurité et");
      L.push("     conditions de travail DANS LES ENTREPRISES D'AU MOINS TROIS CENTS");
      L.push("     salariés.");
      L.push("");
      L.push("Sans préjudice des dispositions de l'article L. 2315-22-1, le financement de la");
      L.push("formation prévue au premier alinéa du présent article EST PRIS EN CHARGE PAR");
      L.push("L'EMPLOYEUR dans des conditions prévues par décret en Conseil d'État »");
      L.push("(L. 2315-18).");
      L.push("");
      L.push("[L'article L. 2315-22-1, que ce texte réserve, ne figure pas dans le corpus lu");
      L.push("par l'application : il est nommé, non résumé.]");
      L.push("");
      L.push("CE QUE L'ACCORD PEUT, ET CE QU'IL NE PEUT PAS. L'acte qui organise la commission");
      L.push("fixe « les modalités de leur formation conformément aux articles L. 2315-16 à");
      L.push("L. 2315-18 » (L. 2315-41, 4°). Il choisit donc l'organisme, le calendrier, le");
      L.push("groupage des sessions — mais il ne descend pas sous le plancher de L. 2315-18,");
      L.push("auquel il doit être « conforme ».");
      L.push("");

      titre(L, "1 — Votre durée due");
      L.push("  Commission en place ........................ " +
        (enPlace === true ? "oui" : enPlace === false ? "non" : "[à renseigner]"));
      L.push("  Effectif retenu ............................ " +
        (eff == null ? "[à renseigner]" : eff + " salariés"));
      L.push("  Mandat en cours ............................ " +
        (renouv === true ? "renouvellement" : renouv === false ? "premier mandat" : "[premier mandat / renouvellement]"));
      L.push("  DURÉE MINIMALE DUE ......................... " +
        (due == null ? "[5 jours au premier mandat · 3 jours au renouvellement · 5 jours au renouvellement pour les membres de la commission si l'effectif atteint 300]"
          : due + " jours"));
      if (due != null && renouv === true) {
        L.push("     Fondement : L. 2315-18, " + (due === 5 ? "2° — membres de la commission dans une entreprise d'au moins trois cents salariés"
          : "1° — trois jours au renouvellement, quelle que soit la taille de l'entreprise") + ".");
      } else if (due === 5) {
        L.push("     Fondement : L. 2315-18, deuxième alinéa — cinq jours lors du premier mandat.");
      }
      L.push("  Jours effectivement dispensés .............. " +
        (jours == null ? "[à renseigner]" : jours));
      if (due != null && jours != null) {
        var manque = due - jours;
        L.push("  ÉCART ...................................... " +
          (manque > 0 ? manque + " jour(s) MANQUANT(S)" : "aucun"));
      }
      L.push("  Membres de la commission portés au dossier . " +
        (membres.length ? membres.length : "[aucun]"));
      L.push("");
      L.push("La durée s'apprécie MEMBRE PAR MEMBRE, et non en moyenne : un membre nommé en");
      L.push("cours de mandat pour la première fois relève des cinq jours du premier mandat,");
      L.push("quand ses collègues relèvent du renouvellement.");
      L.push("");

      titre(L, "2 — Le tableau nominatif");
      L.push("   Membre · collège · premier mandat ou renouvellement · durée due · jours");
      L.push("   suivis · dates · organisme · attestation reçue le");
      if (membres.length) {
        membres.forEach(function (m, i) {
          var col = m && m.college != null ? m.college : null;
          L.push("   " + (i + 1) + ". [nom] · collège " + (col == null ? "[ ]" : col) +
            " · [1er / renouvellement] · " + (due == null ? "[ ]" : due) + " j · [ ] j · [ ] · [ ] · [ ]");
        });
      } else {
        L.push("   1. [nom] · collège [ ] · [1er / renouvellement] · [ ] j · [ ] j · [ ] · [ ] · [ ]");
        L.push("   2. [nom] · collège [ ] · [1er / renouvellement] · [ ] j · [ ] j · [ ] · [ ] · [ ]");
        L.push("   3. [nom] · collège [ ] · [1er / renouvellement] · [ ] j · [ ] j · [ ] · [ ] · [ ]");
      }
      L.push("");
      L.push("   Total de jours à programmer : [ ].");
      L.push("");

      titre(L, "3 — La formation spécifique aux risques de l'activité (L. 2315-41, 6°)");
      L.push("L'acte qui organise la commission peut prévoir « les conditions et modalités");
      L.push("dans lesquelles une FORMATION SPÉCIFIQUE correspondant aux risques ou facteurs");
      L.push("de risques particuliers, en rapport avec l'activité de l'entreprise peut être");
      L.push("dispensée aux membres de la commission » (L. 2315-41, 6°).");
      L.push("");
      L.push("Elle ne remplace pas la formation de L. 2315-18 : elle s'y ajoute.");
      L.push("");
      L.push("   Activité de l'entreprise : " + cro((ctx.profil || {}).secteur, "secteur d'activité"));
      L.push("   Convention collective : " + cro((ctx.profil || {}).conventionCollective, "convention collective applicable"));
      L.push("   Risques ou facteurs de risques particuliers identifiés au document unique :");
      L.push("      [ÉNUMÉRER]");
      L.push("   Formation spécifique retenue : [intitulé · durée · organisme]");
      L.push("   Prévue par : [article … de l'accord / du règlement intérieur du comité]");
      L.push("");

      titre(L, "4 — Ce qui encadre la formation, quel que soit l'organisme");
      L.push("OBJET (R. 2315-9) — développer l'aptitude des membres à déceler et à mesurer");
      L.push("les risques professionnels et leur capacité d'analyse des conditions de");
      L.push("travail ; les initier aux méthodes et procédés à mettre en œuvre pour prévenir");
      L.push("les risques professionnels et améliorer les conditions de travail.");
      L.push("");
      L.push("PROGRAMME (R. 2315-10) — théorique et pratique, préétabli, tenant compte des");
      L.push("caractéristiques de la branche professionnelle, des caractères spécifiques de");
      L.push("l'entreprise et du rôle du représentant. Elle est dispensée DÈS LA PREMIÈRE");
      L.push("DÉSIGNATION.");
      L.push("");
      L.push("RENOUVELLEMENT (R. 2315-11) — stages DISTINCTS de celui organisé en application");
      L.push("de R. 2315-9, plus spécialisés, adaptés aux demandes du stagiaire et tenant");
      L.push("compte des changements technologiques et d'organisation. Les formations sont");
      L.push("renouvelées lorsque les représentants ont exercé leur mandat pendant QUATRE ANS,");
      L.push("consécutifs ou non (L. 2315-17).");
      L.push("");
      L.push("ORGANISMES (R. 2315-12) — organismes figurant sur une liste arrêtée par le");
      L.push("ministre chargé du travail selon la procédure de R. 2145-3, ou organismes agréés");
      L.push("par le préfet de région selon la procédure de R. 2315-8.");
      L.push("");
      L.push("PRISE EN CHARGE — rémunération de l'organisme à la charge de l'employeur, dans");
      L.push("la limite de TRENTE-SIX FOIS le montant horaire du salaire minimum de croissance");
      L.push("par jour et par stagiaire (R. 2315-21) ; frais de déplacement au tarif de");
      L.push("SECONDE CLASSE des chemins de fer sur le trajet le plus direct depuis le siège");
      L.push("de l'établissement jusqu'au lieu de la formation, et frais de séjour à hauteur");
      L.push("de l'indemnité de mission des déplacements temporaires des fonctionnaires");
      L.push("(R. 2315-20).");
      L.push("");
      L.push("TEMPS DE TRAVAIL — pris sur le temps de travail, rémunéré comme tel, NON DÉDUIT");
      L.push("des heures de délégation (L. 2315-16).");
      L.push("");

      courrier(L, 1, "convocation d'un membre de la commission", null);
      papier(L, ctx, ["[Nom et prénom]",
                      "Membre de la commission santé, sécurité",
                      "et conditions de travail"], leJour(d0));
      L.push("Objet : formation en santé, sécurité et conditions de travail");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("En qualité de membre de la commission santé, sécurité et conditions de travail,");
      L.push("vous bénéficiez de la formation prévue à l'article L. 2315-18 du code du");
      L.push("travail.");
      L.push("");
      L.push("   Durée due : " + (due == null ? "[ ]" : due) + " jours — [premier mandat / renouvellement" +
        (eff != null && eff >= 300 ? ", entreprise d'au moins trois cents salariés" : "") + "]");
      L.push("   Dates : du [DATE] au [DATE]   ·   organisme : [ ]   ·   lieu : [ ]");
      L.push("   [Le cas échéant : formation spécifique aux risques particuliers de");
      L.push("   l'activité, prévue au 6° de l'article L. 2315-41 — dates : … ]");
      L.push("");
      L.push("Ce temps est pris sur votre temps de travail et rémunéré comme tel ; il n'est");
      L.push("pas déduit de vos heures de délégation (L. 2315-16). Le financement est pris en");
      L.push("charge par l'employeur (L. 2315-18).");
      L.push("");
      L.push("Merci de me remettre l'attestation de présence dès la fin du stage.");
      L.push("");
      salutation(L, ctx, "Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération distinguée.");

      titre(L, "5 — Bordereau des attestations et des justificatifs");
      L.push("   Membre · dates · jours · organisme · attestation · facture acquittée par");
      L.push("   l'employeur");
      L.push("   [ ] · [ ] · [ ] j · [ ] · [ ] · [ ]");
      L.push("   [ ] · [ ] · [ ] j · [ ] · [ ] · [ ]");
      L.push("");
      L.push("Deux pièces, et elles ne prouvent pas la même chose : l'attestation de présence");
      L.push("établit que la formation a été SUIVIE, la facture acquittée par l'employeur");
      L.push("qu'elle a été PRISE EN CHARGE par lui. Il faut les deux.");
      L.push("");
      L.push("Bordereau arrêté à " + lieu(ctx) + ", le " + leJour(d0) + ".");
      L.push("");
      L.push(signataire(ctx));

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — vous établissez le tableau nominatif et vous",
        "consultez les organismes.",
        "",
        "Le " + leJour(dans(d0, 21)) + " — choix de l'organisme et réservation des sessions.",
        "",
        "Le " + leJour(dans(d0, 30)) + " — envoi des convocations. " +
          (due == null ? "Trois à cinq jours" : due + " jours") + " d'absence se remplacent :",
        "prévenez tôt.",
        "",
        "Vers le " + leJour(dans(d0, 75)) + " — tenue des sessions. Deux à trois mois entre la",
        "décision et la formation est un délai réaliste.",
        "",
        "Dès la fin de chaque session — attestation de présence et facture au bordereau.",
        "",
        "Après quatre ans de mandat, consécutifs ou non — renouvellement de la formation,",
        "par des stages distincts et plus spécialisés (L. 2315-17, R. 2315-11).",
      ]);

      return pied(L, ["L. 2314-1", "L. 2315-16", "L. 2315-17", "L. 2315-18", "L. 2315-41",
                      "R. 2315-8", "R. 2315-9", "R. 2315-10", "R. 2315-11", "R. 2315-12",
                      "R. 2315-20", "R. 2315-21"]);
    },
  });

  /* ▽ nouveaux générateurs ▽ */

})(typeof window !== "undefined" ? window : this);
