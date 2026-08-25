/* Les documents que l'application PRODUIT — module « comité social et économique ».

   POURQUOI CE FICHIER EXISTE

   Le module d'audit dit ce qui manque ; les fiches de régularisation disent
   quoi faire. Aucun des deux ne fait le travail : un employeur à qui l'on
   explique en six étapes comment convoquer son comité n'a toujours pas de
   convocation. Ce fichier écrit la pièce elle-même — au nom de l'entreprise,
   avec ses courriers d'accompagnement et son calendrier calculé.

   TROIS RÈGLES ONT COMMANDÉ L'ÉCRITURE

   1. Rien qui n'ait été lu à la source. Aucun article n'est cité ici qui ne
      figure dans « moteur/cse/textes_cse.json ». Aucun montant, aucun délai,
      aucune mention n'est inventé. Un texte que le dépôt n'a pas capté — la
      loi du 9 décembre 2016, un article d'un autre code — est signalé comme
      tel plutôt que résumé de mémoire.

   2. L'ordre des trois étages. Beaucoup d'obligations du comité ne sont
      supplétives : L. 2312-22 ne joue qu'« en l'absence d'accord prévu à
      l'article L. 2312-19 », L. 2313-4 qu'« en l'absence d'accord », L. 2315-44
      qu'« en l'absence d'accord prévu aux articles L. 2315-41 et L. 2315-42 »,
      L. 2315-46 et L. 2315-49 qu'« en l'absence d'accord prévu à l'article
      L. 2315-45 », R. 2312-6 qu'« à défaut d'accord ». Tout document qui touche
      à l'un de ces sujets commence donc par dire quel étage il applique, et
      pourquoi l'étage supérieur ne s'applique pas.

   3. Ce qui manque sort entre crochets. Un document qui devinerait les choix
      de l'employeur — le nombre de membres d'une commission, l'échelle des
      délégations, la date d'une réunion — lui ferait adopter des règles qu'il
      n'a pas voulues. Le crochet est visible : il se remplit, il ne se subit
      pas.

   LES DÉLAIS SE DISENT AVEC LEUR POINT DE DÉPART, et se calculent dès qu'une
   date du dossier le permet : quatre-vingt-dix jours à compter de la diffusion
   de l'information au personnel, quinze jours à compter de l'établissement du
   procès-verbal de carence, un mois à compter de la remise des informations,
   trois jours à compter de la communication de l'ordre du jour, dix jours à
   compter de l'acte contesté. Une date absente ne fait pas taire le délai :
   elle le laisse en toutes lettres, avec son point de départ nommé. */
(function (global) {
  "use strict";

  var DP = global.DocumentsProduits;
  if (!DP || typeof DP.ajouter !== "function") return;

  var cro = DP.outils.cro;
  var leJour = DP.outils.leJour;
  var dans = DP.outils.dans;
  var entete = DP.outils.entete;

  /* ─────────────────────────────── petits outils ─────────────────────────── */

  var TRAIT = "────────────────────────────────────────────────────────────────────────";
  var DOUBLE = "════════════════════════════════════════════════════════════════════════";

  /* Une date du dossier, quand elle est lisible. Une date illisible ne devient
     jamais « aujourd'hui » : elle reste absente, et le document le dit. */
  function dateDe(v) {
    if (!v) return null;
    var x = v instanceof Date ? v : new Date(String(v));
    return isNaN(x) ? null : x;
  }

  function jourOu(v, quoi) {
    var x = dateDe(v);
    return x ? leJour(x) : "[" + (quoi || "date") + "]";
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
    var p = ctx.profil || {};
    var f = ctx.fiche || {};
    return cro(p.denomination || p.entreprise || f.entreprise, "DÉNOMINATION SOCIALE");
  }

  function lieu(ctx) { return cro((ctx.profil || {}).ville, "lieu"); }
  function signataire(ctx) { return cro((ctx.profil || {}).responsable, "Nom et qualité du représentant légal"); }

  function effectifDe(ctx) {
    var p = ctx.profil || {}, f = ctx.fiche || {};
    return nb(f.effectif != null ? f.effectif : p.effectif);
  }

  /* Le mode d'emploi, écrit une fois. Il dit ce que vaut un crochet : c'est la
     seule chose que le lecteur doit comprendre avant de signer. */
  function usage(L) {
    L.push("COMMENT SE SERVIR DE CE DOCUMENT");
    L.push("");
    L.push("Ce qui est écrit sans crochets est imposé par la loi et fondé sur l'article");
    L.push("cité en regard. Ce qui est ENTRE CROCHETS vous appartient : soit la loi vous");
    L.push("en laisse le choix, soit l'application ne dispose pas de la donnée. Remplacez");
    L.push("chaque crochet, ou supprimez la ligne si elle ne vous concerne pas — n'en");
    L.push("laissez aucun dans le document que vous signez, adressez ou déposez.");
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
    L.push("FONDEMENT — les articles du code du travail lus à la source :");
    L.push(arts.join(" · ") + ".");
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
    var p = ctx.profil || {};
    L.push(nom(ctx));
    L.push(cro(p.adresse, "adresse du siège"));
    L.push("");
    destinataire.forEach(function (x) { L.push(x); });
    L.push("");
    L.push(lieu(ctx) + ", le " + (dateLigne || leJour(ctx.aujourdhui)));
    L.push("");
  }

  function salutation(L, ctx, formule) {
    L.push(formule || "Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma considération distinguée.");
    L.push("");
    L.push(cro((ctx.profil || {}).responsable, "Nom et qualité"));
    L.push("");
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

  /* ══════════════════════════════════════════════════════════════════════════
     EFFECTIFS ET SEUILS
     ══════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CSE-CTL-COH-01", {
    nom: "L'état récapitulatif des effectifs mensuels, et sa note de méthode",
    detail: "L'état mois par mois, la méthode de calcul de l'article L. 1111-2 catégorie " +
            "par catégorie, et les exclusions à motiver.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var L = [];
      var mois = liste(f.effectifsMensuels);

      L = L.concat(entete(ctx, "État récapitulatif des effectifs mensuels",
        "articles L. 1111-2 et L. 2311-2 du code du travail"));
      usage(L);

      L.push("OBJET");
      L.push("");
      L.push("Tout le régime du comité — nombre de sièges, crédit d'heures, périodicité");
      L.push("des réunions, commissions, budgets — se calcule sur l'effectif. L'article");
      L.push("L. 2311-2 renvoie ce calcul aux articles L. 1111-2 et L. 1251-54. Le présent");
      L.push("état établit l'effectif mois par mois : c'est lui, et non une déclaration,");
      L.push("qui fait foi.");
      L.push("");

      L.push("I — L'ÉTAT MOIS PAR MOIS");
      L.push("");
      L.push("Effectif de " + nom(ctx) + ", calculé selon l'article L. 1111-2 :");
      L.push("");
      if (mois.length) {
        mois.forEach(function (v, i) {
          L.push("   Mois " + (i + 1) + " — [mois et année] : " + v + " salariés");
        });
        L.push("");
        L.push("Les " + mois.length + " valeurs ci-dessus sont celles que porte votre dossier.");
        L.push("Datez chaque ligne du mois qu'elle recouvre et joignez, pour chacune, l'état");
        L.push("d'effectif ou la déclaration sociale nominative qui l'établit.");
      } else {
        L.push("   [Mois 1 — mois et année] : [effectif] salariés");
        L.push("   [Mois 2 …] : […]");
        L.push("   [… jusqu'au douzième mois au moins : le seuil de onze salariés ne rend");
        L.push("    la mise en place du comité obligatoire que s'il est atteint pendant");
        L.push("    douze mois consécutifs — L. 2311-2.]");
      }
      L.push("");

      L.push("II — LA MÉTHODE, CATÉGORIE PAR CATÉGORIE (L. 1111-2)");
      L.push("");
      L.push("1° Comptent intégralement dans l'effectif : les salariés titulaires d'un");
      L.push("contrat de travail à durée indéterminée à temps plein et les travailleurs à");
      L.push("domicile.");
      L.push("   Nombre retenu : [ ]");
      L.push("");
      L.push("2° Comptent à due proportion de leur temps de présence au cours des douze");
      L.push("mois précédents : les salariés titulaires d'un contrat à durée déterminée,");
      L.push("les salariés titulaires d'un contrat de travail intermittent, les salariés");
      L.push("mis à disposition par une entreprise extérieure qui sont présents dans les");
      L.push("locaux de l'entreprise utilisatrice et y travaillent depuis au moins un an,");
      L.push("ainsi que les salariés temporaires.");
      L.push("   Nombre retenu : [ ]  ·  détail du prorata : [ ]");
      L.push("");
      L.push("3° Comptent en divisant la somme totale des horaires inscrits dans leurs");
      L.push("contrats de travail par la durée légale ou la durée conventionnelle du");
      L.push("travail : les salariés à temps partiel, quelle que soit la nature de leur");
      L.push("contrat.");
      L.push("   Somme des horaires contractuels : [ ] h  ·  durée retenue : [ ] h");
      L.push("   Nombre retenu : [ ]");
      L.push("");
      L.push("EXCLUSIONS À MOTIVER — le 2° de l'article L. 1111-2 exclut du décompte les");
      L.push("salariés titulaires d'un contrat à durée déterminée et les salariés mis à");
      L.push("disposition par une entreprise extérieure, y compris les salariés");
      L.push("temporaires, lorsqu'ils remplacent un salarié absent ou dont le contrat de");
      L.push("travail est suspendu, notamment du fait d'un congé de maternité, d'un congé");
      L.push("d'adoption ou d'un congé parental d'éducation.");
      L.push("");
      L.push("   [Lister ici chaque exclusion : nom ou matricule, contrat, salarié remplacé,");
      L.push("    motif de l'absence. Une exclusion non motivée se retourne contre celui qui");
      L.push("    l'a pratiquée.]");
      L.push("");

      L.push("III — CE QUE L'ÉTAT ÉTABLIT");
      L.push("");
      L.push("Le comité social et économique est mis en place dans les entreprises d'au");
      L.push("moins onze salariés ; sa mise en place n'est obligatoire que si l'effectif");
      L.push("d'au moins onze salariés est atteint pendant douze mois consécutifs");
      L.push("(L. 2311-2).");
      L.push("");
      L.push("   Le seuil de onze salariés est-il atteint sur douze mois consécutifs ?");
      L.push("   [oui / non] — mois de départ : [ ]  ·  mois d'arrivée : [ ]");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le " + leJour(ctx.aujourdhui) + ".");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièces jointes : les états d'effectif mensuels ou les déclarations sociales");
      L.push("nominatives correspondantes.");

      return pied(L, ["L. 1111-2", "L. 2311-2"]);
    },
  });

  DP.ajouter("CSE-CTL-COH-02", {
    nom: "La note de franchissement de seuil et son calendrier de mise en conformité",
    detail: "La date du franchissement, le délai que la loi laisse pour s'y conformer — " +
            "calculé —, et la liste datée des obligations qui s'ouvrent.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var eff = effectifDe(ctx);
      var L = [];

      L = L.concat(entete(ctx, "Note de franchissement de seuil",
        "articles L. 2311-2, L. 2312-2 et L. 2312-34 du code du travail"));
      usage(L);

      L.push("I — LE FRANCHISSEMENT, DATÉ");
      L.push("");
      L.push("Effectif porté au dossier : " + (eff == null ? "[effectif]" : eff + " salariés") + ".");
      L.push("");
      L.push("Un seuil ne se franchit pas le jour où on le constate : il se franchit sur");
      L.push("une durée, et c'est de cette durée que courent les délais.");
      L.push("");
      L.push("  · Onze salariés — la mise en place du comité n'est obligatoire que si");
      L.push("    l'effectif d'au moins onze salariés est atteint pendant douze mois");
      L.push("    consécutifs (L. 2311-2).");
      L.push("    Douze mois consécutifs du [mois] au [mois] · seuil atteint le [date].");
      L.push("");
      L.push("  · Cinquante salariés — lorsque, postérieurement à la mise en place du");
      L.push("    comité, l'effectif atteint au moins cinquante salariés pendant douze mois");
      L.push("    consécutifs, le comité exerce l'ensemble des attributions récurrentes");
      L.push("    d'information et de consultation à l'expiration d'un délai de douze mois");
      L.push("    à compter de la date à laquelle ce seuil a été atteint pendant douze mois");
      L.push("    consécutifs (L. 2312-2).");
      L.push("    Seuil atteint le [date] · attributions dues le [date + 12 mois].");
      L.push("    Si, à l'expiration de ce délai de douze mois, le mandat du comité restant");
      L.push("    à courir est inférieur à un an, ce délai court à compter de son");
      L.push("    renouvellement (L. 2312-2).");
      L.push("    Lorsque l'entreprise n'était pas pourvue d'un comité, le délai est d'un an");
      L.push("    à compter de sa mise en place (L. 2312-2, dernier alinéa).");
      L.push("");
      L.push("  · Trois cents salariés — le seuil est réputé franchi lorsque l'effectif de");
      L.push("    l'entreprise dépasse ce seuil pendant douze mois consécutifs, et");
      L.push("    l'employeur dispose d'un délai d'un an à compter du franchissement pour");
      L.push("    se conformer complètement aux obligations d'information et de");
      L.push("    consultation qui en découlent (L. 2312-34).");
      L.push("    Seuil franchi le [date] · conformité complète due le [date + 1 an].");
      L.push("");

      L.push("II — CE QUE LE SEUIL OUVRE");
      L.push("");
      L.push("À cinquante salariés — l'ensemble des attributions récurrentes d'information");
      L.push("et de consultation définies par la section 3 (L. 2312-2) : orientations");
      L.push("stratégiques, situation économique et financière, politique sociale,");
      L.push("conditions de travail et emploi (L. 2312-17).");
      L.push("   État : [dues depuis le … / non encore dues]");
      L.push("");
      L.push("À trois cents salariés :");
      L.push("  · la commission santé, sécurité et conditions de travail, créée au sein du");
      L.push("    comité (L. 2315-36, 1° et 2°) ;");
      L.push("  · à défaut d'accord prévu à l'article L. 2315-45, la commission de la");
      L.push("    formation (L. 2315-49), la commission d'information et d'aide au logement");
      L.push("    (L. 2315-50) et la commission de l'égalité professionnelle (L. 2315-56).");
      L.push("   État, commission par commission : [ ]");
      L.push("");
      L.push("À mille salariés — à défaut d'accord prévu à l'article L. 2315-45, la");
      L.push("commission économique, créée au sein du comité ou du comité central");
      L.push("(L. 2315-46).");
      L.push("   État : [ ]");
      L.push("");
      L.push("À deux mille salariés — le taux de la subvention de fonctionnement passe de");
      L.push("0,20 % à 0,22 % de la masse salariale brute (L. 2315-61).");
      L.push("   État : [ ]");
      L.push("");

      L.push("III — LE CALENDRIER DE MISE EN CONFORMITÉ");
      L.push("");
      L.push("Ces obligations sont dues depuis le franchissement, non depuis sa");
      L.push("découverte. Le tableau ci-dessous se remplit dans l'ordre des échéances, la");
      L.push("plus proche d'abord.");
      L.push("");
      L.push("   Obligation · article · due depuis le · action · échéance retenue");
      L.push("   [ ] · [ ] · [ ] · [ ] · [ ]");
      L.push("   [ ] · [ ] · [ ] · [ ] · [ ]");
      L.push("   [ ] · [ ] · [ ] · [ ] · [ ]");
      L.push("");
      L.push("Établi le " + leJour(ctx.aujourdhui) + " à " + lieu(ctx) + ".");
      L.push("");
      L.push(signataire(ctx));

      return pied(L, ["L. 2311-2", "L. 2312-2", "L. 2312-17", "L. 2312-34",
                      "L. 2315-36", "L. 2315-45", "L. 2315-46", "L. 2315-49",
                      "L. 2315-50", "L. 2315-56", "L. 2315-61"]);
    },
  });

  /* ══════════════════════════════════════════════════════════════════════════
     MISE EN PLACE DU COMITÉ
     ══════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CSE-CTL-MEP-02", {
    nom: "L'information du personnel, ses deux invitations syndicales, le procès-verbal de carence et sa transmission",
    detail: "La note d'information à date certaine, les courriers aux organisations " +
            "syndicales, le procès-verbal de carence, sa transmission à l'inspection du " +
            "travail dans les quinze jours, et le calendrier des quatre-vingt-dix jours.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var eff = effectifDe(ctx);
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = [];

      L = L.concat(entete(ctx, "Mise en place du comité social et économique",
        "articles L. 2314-4, L. 2314-5, L. 2314-8 et L. 2314-9 du code du travail"));
      usage(L);

      L.push("CE QUE CE DOSSIER CONTIENT");
      L.push("");
      L.push("  1. La note d'information du personnel sur l'organisation des élections.");
      L.push("  2. L'invitation des organisations syndicales à négocier le protocole");
      L.push("     d'accord préélectoral — deux canaux, que le texte distingue.");
      L.push("  3. Le procès-verbal de carence, à n'établir que si le processus n'a");
      L.push("     produit aucun élu.");
      L.push("  4. Le courrier de transmission du procès-verbal de carence à l'inspection");
      L.push("     du travail.");
      L.push("  5. Le calendrier, calculé.");
      L.push("");
      L.push("Les quatre premiers ne se font pas « ensuite » : sans eux, la mise en place");
      L.push("n'a pas eu lieu. Le fait d'apporter une entrave à la constitution d'un comité");
      L.push("social et économique, notamment par la méconnaissance des dispositions des");
      L.push("articles L. 2314-1 à L. 2314-9, est puni d'un emprisonnement d'un an et");
      L.push("d'une amende de 7 500 € (L. 2317-1).");
      L.push("");

      titre(L, "1 — Note d'information du personnel");
      L.push("À diffuser PAR TOUT MOYEN PERMETTANT DE CONFÉRER DATE CERTAINE à cette");
      L.push("information (L. 2314-4). Sans date certaine, le point de départ des");
      L.push("quatre-vingt-dix jours est indémontrable, et le respect du délai avec lui.");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("NOTE D'INFORMATION AU PERSONNEL");
      L.push("Organisation des élections des membres de la délégation du personnel");
      L.push("du comité social et économique");
      L.push("");
      L.push(lieu(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("L'effectif de " + nom(ctx) + (eff != null ? ", qui s'établit à " + eff + " salariés," : ",") );
      L.push("ayant atteint le seuil de onze salariés pendant douze mois consécutifs");
      L.push("(L. 2311-2), il est procédé à l'élection des membres de la délégation du");
      L.push("personnel du comité social et économique.");
      L.push("");
      L.push("Conformément à l'article L. 2314-4 du code du travail, la présente note vous");
      L.push("informe de l'organisation de ces élections.");
      L.push("");
      L.push("DATE ENVISAGÉE POUR LE PREMIER TOUR : " + jourOu(f.datePremierTour, "DATE — mention obligatoire"));
      L.push("");
      L.push("Cette mention est exigée par l'article L. 2314-4 : le document diffusé");
      L.push("précise la date envisagée pour le premier tour. Ce premier tour doit se tenir");
      L.push("au plus tard le quatre-vingt-dixième jour suivant la diffusion de la présente");
      L.push("note.");
      L.push("");
      L.push("[Le cas échéant, précisez ici : le lieu et les horaires du scrutin, les");
      L.push("modalités de dépôt des candidatures, la date de la première réunion de");
      L.push("négociation du protocole d'accord préélectoral. Ces mentions ne sont pas");
      L.push("imposées par L. 2314-4 : elles sont utiles, et elles vous engagent.]");
      L.push("");
      if (eff != null && eff >= 11 && eff <= 20) {
        L.push("MENTION PROPRE À VOTRE EFFECTIF — l'entreprise comptant entre onze et vingt");
        L.push("salariés, les organisations syndicales ne seront invitées à négocier le");
        L.push("protocole qu'à la condition qu'au moins un salarié se soit porté candidat");
        L.push("aux élections dans un délai de trente jours à compter de la présente");
        L.push("information (L. 2314-5, dernier alinéa). Les candidatures sont donc reçues");
        L.push("jusqu'au " + (dateDe(d0) ? leJour(dans(d0, 30)) : "[date]") + " inclus.");
        L.push("Le salarié qui se porte candidat bénéficie de la protection prévue aux");
        L.push("articles L. 2411-7, L. 2412-3 et L. 2413-1 à compter de la date à laquelle");
        L.push("l'employeur a eu connaissance de l'imminence de sa candidature (L. 2314-5).");
        L.push("");
      } else {
        L.push("[Si l'effectif de l'entreprise est compris entre onze et vingt salariés,");
        L.push("ajoutez la mention suivante : les organisations syndicales ne seront invitées");
        L.push("à négocier le protocole qu'à la condition qu'au moins un salarié se soit");
        L.push("porté candidat dans un délai de trente jours à compter de la présente");
        L.push("information (L. 2314-5, dernier alinéa).]");
        L.push("");
      }
      L.push("Diffusion : [préciser le moyen retenu et ce qui lui confère date certaine —");
      L.push("affichage avec constat daté, remise contre émargement, courrier recommandé,");
      L.push("courriel avec accusé de réception]. Conservez cette preuve.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      courrier(L, 1, "invitation des organisations syndicales à négocier le protocole", [
        "L'article L. 2314-5 distingue DEUX canaux, et il faut les tenir tous les deux :",
        "les organisations du premier alinéa sont informées « par tout moyen » ; celles du",
        "deuxième alinéa « y sont également invitées PAR COURRIER ». L'invitation doit",
        "parvenir au plus tard QUINZE JOURS avant la date de la première réunion de",
        "négociation.",
      ]);
      papier(L, ctx, ["[Organisation syndicale — dénomination]", "[Adresse]"],
        leJour(d0));
      L.push("Lettre recommandée avec demande d'avis de réception");
      L.push("");
      L.push("Objet : organisation des élections au comité social et économique —");
      L.push("invitation à négocier le protocole d'accord préélectoral");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("En application de l'article L. 2314-5 du code du travail, je vous informe de");
      L.push("l'organisation des élections des membres de la délégation du personnel du");
      L.push("comité social et économique de " + nom(ctx) + " et vous invite :");
      L.push("");
      L.push("  · à négocier le protocole d'accord préélectoral ;");
      L.push("  · à établir les listes de vos candidats aux fonctions de membre de la");
      L.push("    délégation du personnel.");
      L.push("");
      L.push("La première réunion de négociation se tiendra le [DATE DE LA PREMIÈRE RÉUNION]");
      L.push("à [heure], à [lieu].");
      L.push("");
      L.push("Le premier tour du scrutin est envisagé le " + jourOu(f.datePremierTour, "date envisagée") + ".");
      L.push("L'information du personnel prévue à l'article L. 2314-4 a été diffusée le");
      L.push(jourOu(f.dateInformationPersonnel, "date de diffusion") + ".");
      L.push("");
      salutation(L, ctx);
      L.push("À QUI L'ADRESSER — établissez la liste avant d'envoyer, et conservez-la :");
      L.push("");
      L.push("  Premier alinéa de L. 2314-5, informées PAR TOUT MOYEN — les organisations");
      L.push("  syndicales qui satisfont aux critères de respect des valeurs républicaines");
      L.push("  et d'indépendance, légalement constituées depuis au moins deux ans, et dont");
      L.push("  le champ professionnel et géographique couvre l'entreprise ou");
      L.push("  l'établissement concernés.");
      L.push("     [Lister]");
      L.push("");
      L.push("  Deuxième alinéa de L. 2314-5, invitées PAR COURRIER — les organisations");
      L.push("  syndicales reconnues représentatives dans l'entreprise ou l'établissement,");
      L.push("  celles ayant constitué une section syndicale dans l'entreprise ou");
      L.push("  l'établissement, ainsi que les syndicats affiliés à une organisation");
      L.push("  syndicale représentative au niveau national et interprofessionnel.");
      var inv = liste(f.syndicatsInvites);
      if (inv.length) {
        L.push("     Votre dossier porte : " + inv.map(function (x) {
          return typeof x === "string" ? x : (x && x.nom) || String(x);
        }).join(", ") + ".");
        L.push("     [Vérifiez que cette liste est complète : l'omission d'une seule");
        L.push("      organisation entache le processus électoral.]");
      } else {
        L.push("     [Lister]");
      }
      L.push("");

      courrier(L, 2, "procès-verbal de carence", [
        "À N'ÉTABLIR QUE SI le comité n'a pas été mis en place ou renouvelé à l'issue du",
        "processus électoral (L. 2314-9). Un procès-verbal de carence établi sans que le",
        "processus ait été régulièrement conduit ne couvre rien.",
      ]);
      L.push(nom(ctx));
      L.push("");
      L.push("PROCÈS-VERBAL DE CARENCE");
      L.push("Élections des membres de la délégation du personnel");
      L.push("du comité social et économique");
      L.push("");
      L.push("Établi le [DATE D'ÉTABLISSEMENT] — c'est de cette date que courent les quinze");
      L.push("jours de transmission à l'inspection du travail, et les six mois de");
      L.push("l'article L. 2314-8.");
      L.push("");
      L.push("Je soussigné(e) " + signataire(ctx) + ",");
      L.push("agissant pour " + nom(ctx) + ", constate ce qui suit.");
      L.push("");
      L.push("  1. L'information du personnel prévue à l'article L. 2314-4 a été diffusée");
      L.push("     le " + jourOu(f.dateInformationPersonnel, "date") + ", par [moyen conférant date certaine].");
      L.push("");
      L.push("  2. Les organisations syndicales ont été informées et invitées à négocier le");
      L.push("     protocole d'accord préélectoral le [date], dans les conditions de");
      L.push("     l'article L. 2314-5. [Lister les organisations et le canal retenu.]");
      L.push("");
      L.push("  3. Le premier tour du scrutin s'est tenu le " + jourOu(f.datePremierTour, "date") + ".");
      L.push("     [Résultat : nombre d'inscrits, de votants, de listes déposées.]");
      L.push("");
      L.push("  4. [Le cas échéant : le nombre des votants étant inférieur à la moitié des");
      L.push("     électeurs inscrits, un second tour a été organisé le [date], au cours");
      L.push("     duquel les électeurs pouvaient voter pour des listes autres que celles");
      L.push("     présentées par une organisation syndicale (L. 2314-29).]");
      L.push("");
      L.push("  5. Aucun membre de la délégation du personnel n'a été élu.");
      L.push("     [Préciser la cause : absence de candidature, absence de votants…]");
      L.push("");
      L.push("En conséquence, le comité social et économique n'a pu être");
      L.push("[mis en place / renouvelé], et le présent procès-verbal de carence est établi");
      L.push("en application de l'article L. 2314-9 du code du travail.");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le [DATE D'ÉTABLISSEMENT].");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("PUBLICITÉ — l'employeur porte le procès-verbal à la connaissance des salariés");
      L.push("dans l'entreprise par tout moyen permettant de donner date certaine à cette");
      L.push("information (L. 2314-9).");
      L.push("   Moyen retenu : [ ]  ·  date : [ ]");
      L.push("");

      courrier(L, 3, "transmission du procès-verbal de carence à l'inspection du travail", [
        "DANS LES QUINZE JOURS de l'établissement du procès-verbal, par tout moyen",
        "permettant de conférer date certaine (L. 2314-9). C'est l'agent de contrôle qui",
        "communique ensuite copie du procès-verbal aux organisations syndicales de",
        "salariés du département concerné : ne vous en chargez pas à sa place.",
      ]);
      papier(L, ctx, ["Monsieur l'Inspecteur du travail",
                      "[Unité de contrôle compétente]", "[Adresse]"], "[DATE D'ENVOI]");
      L.push("Lettre recommandée avec demande d'avis de réception");
      L.push("");
      L.push("Objet : transmission du procès-verbal de carence (L. 2314-9)");
      L.push("");
      L.push("Monsieur l'Inspecteur,");
      L.push("");
      L.push("En application de l'article L. 2314-9 du code du travail, je vous transmets");
      L.push("le procès-verbal de carence établi le [DATE D'ÉTABLISSEMENT] à l'issue du");
      L.push("processus électoral engagé au sein de " + nom(ctx) + ".");
      L.push("");
      L.push("Ce procès-verbal a été porté à la connaissance des salariés le [date], par");
      L.push("[moyen conférant date certaine].");
      L.push("");
      L.push("Je vous prie d'agréer, Monsieur l'Inspecteur, l'expression de ma");
      L.push("considération distinguée.");
      L.push("");
      L.push(cro((ctx.profil || {}).responsable, "Nom et qualité"));
      L.push("");
      L.push("Pièce jointe : procès-verbal de carence");
      L.push("");

      titre(L, "Votre calendrier");
      var dinfo = dateDe(f.dateInformationPersonnel);
      var dtour = dateDe(f.datePremierTour);
      if (dinfo) {
        L.push("Information du personnel diffusée le " + leJour(dinfo) + ".");
        L.push("Le premier tour doit se tenir au plus tard le " + leJour(dans(dinfo, 90)) +
               " — quatre-vingt-dixième jour suivant la diffusion (L. 2314-4).");
        if (dtour) {
          var ecart = Math.round((dtour - dinfo) / 86400000);
          L.push("Premier tour porté au dossier : " + leJour(dtour) + ", soit " + ecart +
                 " jours après la diffusion — " +
                 (ecart <= 90 ? "le délai est tenu." : "LE DÉLAI EST DÉPASSÉ."));
          if (ecart > 90) {
            L.push("Il faut alors reprendre le processus : diffuser une NOUVELLE information");
            L.push("au personnel, portant une nouvelle date envisagée pour le premier tour, et");
            L.push("recommencer le décompte à partir de cette diffusion.");
          }
        } else {
          L.push("Aucune date de premier tour n'est portée au dossier : [à fixer].");
        }
      } else {
        L.push("Aucune date de diffusion n'est portée au dossier.");
        L.push("Si vous diffusez l'information aujourd'hui, " + leJour(d0) + ", le premier");
        L.push("tour devra se tenir au plus tard le " + leJour(dans(d0, 90)) + ".");
      }
      L.push("");
      L.push("Quinze jours au moins avant la première réunion de négociation : l'invitation");
      L.push("des organisations syndicales doit leur être PARVENUE (L. 2314-5). Le délai se");
      L.push("compte à la réception, non à l'envoi.");
      L.push("");
      L.push("Si le scrutin ne produit aucun élu : procès-verbal de carence, publicité");
      L.push("auprès des salariés à date certaine, et transmission à l'inspection du");
      L.push("travail dans les quinze jours de son établissement (L. 2314-9).");
      L.push("");
      L.push("Après un procès-verbal de carence : la demande d'un salarié ou d'une");
      L.push("organisation syndicale tendant à l'organisation d'élections ne peut");
      L.push("intervenir qu'à l'issue d'un délai de SIX MOIS après l'établissement de ce");
      L.push("procès-verbal ; saisi d'une telle demande, l'employeur engage la procédure de");
      L.push("l'article L. 2314-5 DANS LE MOIS suivant sa réception (L. 2314-8).");

      return pied(L, ["L. 2311-2", "L. 2314-4", "L. 2314-5", "L. 2314-8", "L. 2314-9",
                      "L. 2314-29", "L. 2317-1"]);
    },
  });

  DP.ajouter("CSE-CTL-MEP-03", {
    nom: "L'information du personnel pour le renouvellement, et son calendrier à rebours",
    detail: "Le terme des mandats daté, le compte à rebours depuis le premier tour, " +
            "la note au personnel et l'invitation syndicale des deux mois.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = [];
      var duree = nb(f.dureeAccord);
      var delec = dateDe(f.dateDernieresElections);
      var terme = null;
      if (delec) {
        terme = new Date(delec.getTime());
        terme.setFullYear(terme.getFullYear() + (duree && duree >= 2 && duree <= 4 ? duree : 4));
      }

      L = L.concat(entete(ctx, "Renouvellement du comité social et économique",
        "articles L. 2314-4, L. 2314-5, L. 2314-33 et L. 2314-34 du code du travail"));
      usage(L);

      L.push("I — LE TERME DES MANDATS EN COURS");
      L.push("");
      L.push("Les membres de la délégation du personnel du comité social et économique");
      L.push("sont élus pour quatre ans (L. 2314-33). Par dérogation, un accord de branche,");
      L.push("un accord de groupe ou un accord d'entreprise, selon le cas, peut fixer une");
      L.push("durée comprise entre deux et quatre ans (L. 2314-34).");
      L.push("");
      L.push("  Premier tour des dernières élections : " + jourOu(f.dateDernieresElections, "date"));
      L.push("  Durée applicable : " + (duree ? duree + " ans, fixée par accord — [référence de l'accord]"
                                             : "quatre ans (L. 2314-33), à défaut d'accord dérogatoire"));
      L.push("  Terme des mandats : " + (terme ? leJour(terme) : "[date]"));
      L.push("");
      if (duree && (duree < 2 || duree > 4)) {
        L.push("  ATTENTION — la durée portée au dossier (" + duree + " ans) est hors des bornes");
        L.push("  de deux à quatre ans que fixe L. 2314-34. Elle ne peut pas être appliquée :");
        L.push("  reprenez l'accord par avenant, ou revenez à la durée légale de quatre ans.");
        L.push("");
      }

      L.push("II — LE CALENDRIER, COMPTÉ À REBOURS");
      L.push("");
      L.push("Deux exigences se croisent, et c'est la plus contraignante qui commande :");
      L.push("");
      L.push("  · le premier tour a lieu DANS LA QUINZAINE PRÉCÉDANT l'expiration du mandat");
      L.push("    des délégués en exercice (L. 2314-5) ;");
      L.push("  · le premier tour se tient AU PLUS TARD LE QUATRE-VINGT-DIXIÈME JOUR suivant");
      L.push("    la diffusion de l'information du personnel (L. 2314-4) ;");
      L.push("  · l'invitation des organisations syndicales est effectuée DEUX MOIS AVANT");
      L.push("    l'expiration du mandat des délégués en exercice (L. 2314-5) ;");
      L.push("  · cette invitation doit parvenir AU PLUS TARD QUINZE JOURS avant la date de");
      L.push("    la première réunion de négociation (L. 2314-5).");
      L.push("");
      if (terme) {
        var quinzaine = dans(terme, -15);
        var deuxMois = new Date(terme.getTime()); deuxMois.setMonth(deuxMois.getMonth() - 2);
        L.push("  Terme des mandats ................................ " + leJour(terme));
        L.push("  Premier tour, dans la quinzaine précédant ........ entre le " +
               leJour(quinzaine) + " et le " + leJour(terme));
        L.push("  Invitation des organisations syndicales .......... " + leJour(deuxMois));
        L.push("  Information du personnel, au plus tard ........... " + leJour(dans(quinzaine, -90)));
        L.push("     (quatre-vingt-dix jours avant la première date possible du premier tour)");
        L.push("");
        var reste = Math.round((terme - d0) / 86400000);
        L.push("  Nous sommes le " + leJour(d0) + " : il reste " + reste + " jour(s) avant le terme.");
        if (reste < 90) {
          L.push("  Le délai des quatre-vingt-dix jours de L. 2314-4 ne peut plus être tenu");
          L.push("  avant le terme : diffusez l'information sans attendre et documentez la");
          L.push("  date de chaque acte. Le retard se constate, il ne se rattrape pas.");
        }
      } else {
        L.push("  [La date du premier tour des dernières élections n'est pas au dossier :");
        L.push("   sans elle, aucune de ces échéances ne peut être calculée. Reprenez-la sur");
        L.push("   le procès-verbal des élections.]");
      }
      L.push("");

      titre(L, "Note d'information du personnel — renouvellement");
      L.push("À diffuser par tout moyen permettant de conférer date certaine (L. 2314-4).");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("NOTE D'INFORMATION AU PERSONNEL");
      L.push("Renouvellement du comité social et économique");
      L.push("");
      L.push(lieu(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Le mandat des membres de la délégation du personnel du comité social et");
      L.push("économique de " + nom(ctx) + " vient à son terme le");
      L.push((terme ? leJour(terme) : "[date]") + ".");
      L.push("");
      L.push("Conformément à l'article L. 2314-4 du code du travail, aux termes duquel");
      L.push("l'employeur informe le personnel tous les quatre ans de l'organisation des");
      L.push("élections, la présente note vous informe de l'organisation des élections");
      L.push("destinées à renouveler cette délégation.");
      L.push("");
      L.push("DATE ENVISAGÉE POUR LE PREMIER TOUR : " + jourOu(f.datePremierTour, "DATE — mention obligatoire"));
      L.push("");
      L.push("Ce premier tour se tiendra au plus tard le quatre-vingt-dixième jour suivant");
      L.push("la diffusion de la présente note, et dans la quinzaine précédant l'expiration");
      L.push("des mandats en cours.");
      L.push("");
      L.push("[Le cas échéant : lieu et horaires du scrutin, modalités de dépôt des");
      L.push("candidatures, date de la première réunion de négociation du protocole.]");
      L.push("");
      L.push("Diffusion : [moyen retenu et ce qui lui confère date certaine]. Conservez");
      L.push("cette preuve : c'est d'elle que court le délai de quatre-vingt-dix jours.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      courrier(L, 1, "invitation des organisations syndicales — renouvellement", [
        "À adresser DEUX MOIS AVANT l'expiration du mandat des délégués en exercice",
        "(L. 2314-5). Les organisations du deuxième alinéa de L. 2314-5 sont invitées PAR",
        "COURRIER ; celles du premier alinéa sont informées par tout moyen.",
      ]);
      papier(L, ctx, ["[Organisation syndicale — dénomination]", "[Adresse]"],
        terme ? leJour((function () { var x = new Date(terme.getTime()); x.setMonth(x.getMonth() - 2); return x; })())
              : "[DATE — deux mois avant le terme]");
      L.push("Lettre recommandée avec demande d'avis de réception");
      L.push("");
      L.push("Objet : renouvellement du comité social et économique — invitation à négocier");
      L.push("le protocole d'accord préélectoral");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Le mandat des membres de la délégation du personnel du comité social et");
      L.push("économique de " + nom(ctx) + " expire le " + (terme ? leJour(terme) : "[date]") + ".");
      L.push("");
      L.push("En application de l'article L. 2314-5 du code du travail, qui prévoit que");
      L.push("dans le cas d'un renouvellement de l'institution cette invitation est");
      L.push("effectuée deux mois avant l'expiration du mandat des délégués en exercice,");
      L.push("je vous informe de l'organisation des élections et vous invite à négocier le");
      L.push("protocole d'accord préélectoral ainsi qu'à établir les listes de vos");
      L.push("candidats.");
      L.push("");
      L.push("La première réunion de négociation se tiendra le [DATE], à [heure], à [lieu].");
      L.push("La présente invitation vous parvient plus de quinze jours avant cette date,");
      L.push("comme le même article l'exige.");
      L.push("");
      L.push("Le premier tour du scrutin est envisagé le " + jourOu(f.datePremierTour, "date") + ",");
      L.push("dans la quinzaine précédant l'expiration des mandats en cours.");
      L.push("");
      salutation(L, ctx);

      return pied(L, ["L. 2314-4", "L. 2314-5", "L. 2314-33", "L. 2314-34", "L. 2317-1"]);
    },
  });

  DP.ajouter("CSE-CTL-MEP-04", {
    nom: "L'avenant fixant la durée du mandat, et le constat de retour à la durée légale",
    detail: "L'avenant qui ramène la durée dans la fourchette de deux à quatre ans, ou " +
            "l'écrit qui constate que la durée légale s'applique.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var duree = nb(f.dureeAccord);
      var delec = dateDe(f.dateDernieresElections);
      var L = [];

      L = L.concat(entete(ctx, "Durée du mandat des représentants du personnel au comité",
        "articles L. 2314-33 et L. 2314-34 du code du travail"));
      usage(L);

      L.push("LE POINT DE DROIT");
      L.push("");
      L.push("Les membres de la délégation du personnel du comité social et économique sont");
      L.push("élus pour quatre ans (L. 2314-33). Par dérogation, un accord de branche, un");
      L.push("accord de groupe ou un accord d'entreprise, selon le cas, PEUT fixer une");
      L.push("durée du mandat comprise entre deux et quatre ans (L. 2314-34).");
      L.push("");
      L.push("Deux conséquences, et elles sont strictes :");
      L.push("  · l'instrument — seul un accord de branche, de groupe ou d'entreprise le");
      L.push("    peut. Ni une décision unilatérale, ni le règlement intérieur du comité,");
      L.push("    ni le protocole d'accord préélectoral ne sont cet instrument ;");
      L.push("  · la borne — deux ans au moins, quatre ans au plus. Une durée hors de ces");
      L.push("    bornes ne s'applique pas, et c'est la durée légale de quatre ans qui");
      L.push("    reprend son empire.");
      L.push("");
      L.push("Situation portée au dossier : " +
        (duree == null ? "aucune durée conventionnelle."
                       : "durée conventionnelle de " + duree + " an(s) — " +
                         (duree >= 2 && duree <= 4 ? "dans les bornes." : "HORS DES BORNES de L. 2314-34.")));
      L.push("");

      titre(L, "Avenant fixant la durée du mandat");
      L.push("AVENANT N° [ ] À [intitulé et date de l'accord de branche, de groupe ou");
      L.push("d'entreprise en cause]");
      L.push("");
      L.push("Entre les soussignés :");
      L.push("");
      L.push(nom(ctx) + ", " + cro((ctx.profil || {}).adresse, "adresse du siège") + ",");
      L.push("représentée par " + signataire(ctx) + ",");
      L.push("d'une part,");
      L.push("");
      L.push("et les organisations syndicales représentatives suivantes :");
      L.push("   [Organisation — représentée par …]");
      L.push("   [Organisation — représentée par …]");
      L.push("d'autre part,");
      L.push("");
      L.push("[Le cas échéant, adapter : s'il s'agit d'un accord de branche ou de groupe,");
      L.push("les parties sont celles de cet accord, et l'avenant se négocie à ce niveau.]");
      L.push("");
      L.push("PRÉAMBULE");
      L.push("");
      L.push("L'article " + (duree == null ? "[article]" : "[article]") + " de l'accord visé ci-dessus fixe à " +
        (duree == null ? "[durée]" : duree) + " an(s) la durée du");
      L.push("mandat des représentants du personnel au comité social et économique. Cette");
      L.push("durée n'entre pas dans la fourchette de deux à quatre ans que l'article");
      L.push("L. 2314-34 du code du travail assigne à toute dérogation à la durée légale.");
      L.push("Les parties conviennent de la ramener dans cette fourchette.");
      L.push("");
      L.push("ARTICLE 1 — DURÉE DU MANDAT");
      L.push("");
      L.push("La durée du mandat des membres de la délégation du personnel du comité social");
      L.push("et économique est fixée à [DURÉE RETENUE — entre deux et quatre ans] ans.");
      L.push("");
      L.push("[Ou, si les parties renoncent à toute dérogation : les stipulations de");
      L.push("l'article [ ] de l'accord visé sont supprimées. La durée du mandat est celle");
      L.push("de quatre ans fixée par l'article L. 2314-33 du code du travail.]");
      L.push("");
      L.push("ARTICLE 2 — MANDATS EN COURS");
      L.push("");
      L.push("[Préciser : la nouvelle durée s'applique-t-elle aux mandats en cours, ou");
      L.push("seulement à ceux issus du prochain scrutin ? Ce choix vous appartient, et il");
      L.push("commande la date de terme ci-dessous. Écrivez-le : un avenant muet sur ce");
      L.push("point se plaide dans les deux sens.]");
      L.push("");
      L.push("ARTICLE 3 — ENTRÉE EN VIGUEUR, DÉPÔT ET PUBLICITÉ");
      L.push("");
      L.push("Le présent avenant entre en vigueur le [DATE].");
      L.push("[Il est déposé et publié dans les conditions applicables à l'accord qu'il");
      L.push("modifie. L'application ne lit pas les articles relatifs au dépôt des accords :");
      L.push("reportez-vous à eux, ou faites-les vérifier.]");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le [DATE], en [nombre] exemplaires originaux.");
      L.push("");
      L.push("Pour l'entreprise                        Pour les organisations syndicales");
      L.push(signataire(ctx));
      L.push("");

      titre(L, "Variante — constat de retour à la durée légale");
      L.push("À établir si aucun avenant n'est négocié : il faut alors écrire quelle durée");
      L.push("s'applique, et en tirer les dates.");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("NOTE — DURÉE DES MANDATS AU COMITÉ SOCIAL ET ÉCONOMIQUE");
      L.push("");
      L.push(lieu(ctx) + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("La stipulation de [référence de l'accord] fixant à " +
        (duree == null ? "[durée]" : duree) + " an(s) la durée du mandat");
      L.push("des représentants du personnel au comité social et économique n'entre pas");
      L.push("dans la fourchette de deux à quatre ans de l'article L. 2314-34 du code du");
      L.push("travail. Elle ne peut recevoir application.");
      L.push("");
      L.push("En conséquence, la durée du mandat est celle de QUATRE ANS fixée par");
      L.push("l'article L. 2314-33 du code du travail.");
      L.push("");
      if (delec) {
        var t4 = new Date(delec.getTime()); t4.setFullYear(t4.getFullYear() + 4);
        L.push("Le premier tour des dernières élections s'étant tenu le " + leJour(delec) + ",");
        L.push("le terme des mandats en cours est fixé au " + leJour(t4) + ".");
        L.push("L'information du personnel prévue à l'article L. 2314-4 devra être diffusée");
        L.push("au plus tard le " + leJour(dans(t4, -105)) + " pour que le premier tour puisse");
        L.push("se tenir dans la quinzaine précédant ce terme sans dépasser les");
        L.push("quatre-vingt-dix jours de l'article L. 2314-4.");
      } else {
        L.push("[Reportez la date du premier tour des dernières élections, puis ajoutez");
        L.push("quatre ans : c'est le terme des mandats en cours.]");
      }
      L.push("");
      L.push(signataire(ctx));

      return pied(L, ["L. 2314-4", "L. 2314-33", "L. 2314-34"]);
    },
  });

  /* ══════════════════════════════════════════════════════════════════════════
     PÉRIMÈTRE
     ══════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CSE-CTL-PER-01", {
    nom: "L'accord déterminant les établissements distincts, et la décision unilatérale de repli",
    detail: "L'accord d'entreprise d'abord, l'accord avec le comité ensuite, et — à " +
            "défaut seulement — la décision de l'employeur motivée sur l'autonomie de gestion.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var L = [];

      L = L.concat(entete(ctx, "Nombre et périmètre des établissements distincts",
        "articles L. 2313-2, L. 2313-3, L. 2313-4 et L. 2313-5 du code du travail"));
      usage(L);

      L.push("L'ORDRE DES SOURCES, ET POURQUOI IL COMMANDE");
      L.push("");
      L.push("  1er étage — un accord d'entreprise, conclu dans les conditions prévues au");
      L.push("     premier alinéa de l'article L. 2232-12, détermine le nombre et le");
      L.push("     périmètre des établissements distincts (L. 2313-2).");
      L.push("");
      L.push("  2e étage — EN L'ABSENCE d'un tel accord ET EN L'ABSENCE DE DÉLÉGUÉ SYNDICAL,");
      L.push("     un accord entre l'employeur et le comité social et économique, adopté à");
      L.push("     la majorité des membres titulaires élus de la délégation du personnel,");
      L.push("     peut les déterminer (L. 2313-3).");
      L.push("");
      L.push("  3e étage — EN L'ABSENCE des accords ci-dessus, l'employeur fixe le nombre et");
      L.push("     le périmètre des établissements distincts, COMPTE TENU DE L'AUTONOMIE DE");
      L.push("     GESTION du responsable de l'établissement, notamment en matière de");
      L.push("     gestion du personnel (L. 2313-4).");
      L.push("");
      L.push("L'ordre n'est pas indicatif : L. 2313-4 ne joue qu'« en l'absence d'accord");
      L.push("conclu dans les conditions mentionnées aux articles L. 2313-2 et L. 2313-3 ».");
      L.push("Une décision unilatérale prise sans qu'une négociation ait été réellement");
      L.push("engagée n'a pas de socle.");
      L.push("");
      L.push("Source portée au dossier : " + cro(f.sourceDecoupage, "à renseigner") + ".");
      L.push("");

      titre(L, "1 — Accord d'entreprise déterminant les établissements distincts");
      L.push("ACCORD D'ENTREPRISE RELATIF AU NOMBRE ET AU PÉRIMÈTRE DES ÉTABLISSEMENTS");
      L.push("DISTINCTS");
      L.push("");
      L.push("Entre " + nom(ctx) + ", " + cro((ctx.profil || {}).adresse, "adresse du siège") + ",");
      L.push("représentée par " + signataire(ctx) + ", d'une part,");
      L.push("");
      L.push("et les organisations syndicales représentatives dans l'entreprise :");
      L.push("   [Organisation — représentée par …]");
      L.push("   [Organisation — représentée par …]");
      L.push("d'autre part,");
      L.push("");
      L.push("PRÉAMBULE");
      L.push("");
      L.push("Le présent accord est conclu en application de l'article L. 2313-2 du code du");
      L.push("travail, aux termes duquel un accord d'entreprise, conclu dans les conditions");
      L.push("prévues au premier alinéa de l'article L. 2232-12, détermine le nombre et le");
      L.push("périmètre des établissements distincts.");
      L.push("");
      L.push("ARTICLE 1 — NOMBRE D'ÉTABLISSEMENTS DISTINCTS");
      L.push("");
      L.push("Le nombre d'établissements distincts au sein de " + nom(ctx));
      L.push("est fixé à [NOMBRE].");
      L.push("");
      L.push("ARTICLE 2 — PÉRIMÈTRE DE CHAQUE ÉTABLISSEMENT");
      L.push("");
      L.push("   Établissement n° 1 — [dénomination] · [adresse] · [sites, services et");
      L.push("   effectifs rattachés] · [responsable]");
      L.push("   Établissement n° 2 — [ … ]");
      L.push("   [Autant de lignes que d'établissements. Le périmètre se décrit par ce qu'il");
      L.push("   contient, non par ce qu'il exclut : un salarié qui ne se reconnaît dans");
      L.push("   aucun périmètre n'a pas d'électeurs.]");
      L.push("");
      L.push("ARTICLE 3 — CONSÉQUENCES SUR LA REPRÉSENTATION");
      L.push("");
      L.push("[Préciser ce que les parties en tirent : mise en place d'un comité social et");
      L.push("économique dans chaque établissement distinct et d'un comité central, date");
      L.push("d'effet au regard du processus électoral en cours, sort des mandats en cours.");
      L.push("Ces choix vous appartiennent.]");
      L.push("");
      L.push("ARTICLE 4 — DURÉE, RÉVISION, DÉPÔT");
      L.push("");
      L.push("Le présent accord est conclu pour [durée]. Il entre en vigueur le [date].");
      L.push("[Modalités de révision et de dénonciation. Dépôt et publicité : l'application");
      L.push("ne lit pas les articles relatifs au dépôt des accords collectifs — reportez-");
      L.push("vous à eux.]");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le [DATE], en [nombre] exemplaires.");
      L.push("");

      titre(L, "2 — Variante : accord avec le comité, en l'absence de délégué syndical");
      L.push("À n'employer QUE s'il n'existe pas de délégué syndical dans l'entreprise :");
      L.push("c'est la condition que pose L. 2313-3.");
      L.push("");
      L.push("ACCORD ENTRE L'EMPLOYEUR ET LE COMITÉ SOCIAL ET ÉCONOMIQUE");
      L.push("");
      L.push("Il est constaté qu'aucun délégué syndical n'est désigné au sein de");
      L.push(nom(ctx) + " à la date du présent accord.");
      L.push("");
      L.push("Le comité social et économique, réuni le [date], a adopté le présent accord");
      L.push("À LA MAJORITÉ DES MEMBRES TITULAIRES ÉLUS de la délégation du personnel :");
      L.push("   membres titulaires élus : [ ]  ·  voix pour : [ ]  ·  voix contre : [ ]");
      L.push("   abstentions : [ ]");
      L.push("");
      L.push("[Reprendre ensuite les articles 1 à 4 ci-dessus.]");
      L.push("");

      titre(L, "3 — Variante de dernier recours : décision de l'employeur");
      L.push("À n'employer QU'À DÉFAUT des accords ci-dessus. Elle doit être motivée sur");
      L.push("l'autonomie de gestion du responsable de l'établissement, notamment en");
      L.push("matière de gestion du personnel (L. 2313-4) — c'est le seul critère que le");
      L.push("texte donne, et c'est sur lui que la décision se discutera.");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("DÉCISION FIXANT LE NOMBRE ET LE PÉRIMÈTRE DES ÉTABLISSEMENTS DISTINCTS");
      L.push("");
      L.push(lieu(ctx) + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("Vu l'article L. 2313-4 du code du travail ;");
      L.push("");
      L.push("Constatant qu'aucun accord n'a pu être conclu dans les conditions des");
      L.push("articles L. 2313-2 et L. 2313-3, la négociation ayant été engagée le [date]");
      L.push("et [close / demeurée sans accord] le [date] ;");
      L.push("");
      L.push("DÉCIDE");
      L.push("");
      L.push("Article 1 — Le nombre d'établissements distincts est fixé à [NOMBRE].");
      L.push("");
      L.push("Article 2 — Le périmètre de chacun est le suivant :");
      L.push("   [Établissement · périmètre · responsable]");
      L.push("");
      L.push("Article 3 — MOTIVATION : l'autonomie de gestion des responsables");
      L.push("d'établissement, notamment en matière de gestion du personnel, est établie");
      L.push("par les éléments suivants :");
      L.push("   [Délégation de pouvoir consentie : date, objet, étendue.]");
      L.push("   [Décisions de gestion du personnel prises au niveau de l'établissement :");
      L.push("    embauche, discipline, organisation du temps de travail, congés.]");
      L.push("   [Budget propre et pouvoir d'engagement.]");
      L.push("");
      L.push("Article 4 — La présente décision est portée à la connaissance des");
      L.push("organisations syndicales et [du comité social et économique / des salariés] le");
      L.push("[date], par [moyen].");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("EN CAS DE LITIGE — le nombre et le périmètre des établissements distincts sont");
      L.push("fixés par l'autorité administrative du siège de l'entreprise (L. 2313-5).");
      L.push("Lorsqu'elle intervient dans le cadre d'un processus électoral global, la");
      L.push("saisine de l'autorité administrative SUSPEND ce processus jusqu'à la décision");
      L.push("et entraîne la prorogation des mandats des élus en cours jusqu'à la");
      L.push("proclamation des résultats du scrutin. La décision de l'autorité");
      L.push("administrative peut faire l'objet d'un recours devant le juge judiciaire, à");
      L.push("l'exclusion de tout autre recours administratif ou contentieux (L. 2313-5).");

      return pied(L, ["L. 2232-12", "L. 2313-2", "L. 2313-3", "L. 2313-4", "L. 2313-5"]);
    },
  });

  DP.ajouter("CSE-CTL-PER-03", {
    nom: "L'accord instituant les représentants de proximité",
    detail: "Le seul instrument que la loi admet, avec les quatre points que l'accord " +
            "doit définir, et le constat à écrire si aucun accord n'existe.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var eff = effectifDe(ctx);
      var del = delegationLegale(eff);
      var L = [];

      L = L.concat(entete(ctx, "Représentants de proximité",
        "articles L. 2313-2 et L. 2313-7 du code du travail"));
      usage(L);

      L.push("LE POINT DE DROIT");
      L.push("");
      L.push("« L'accord d'entreprise défini à l'article L. 2313-2 peut mettre en place des");
      L.push("représentants de proximité » (L. 2313-7). C'est le seul instrument que le");
      L.push("texte admet : ni décision unilatérale, ni usage, ni règlement intérieur du");
      L.push("comité ne peuvent en instituer. Un dispositif sans base conventionnelle n'est");
      L.push("pas un dispositif : il n'a ni statut, ni protection, ni heures.");
      L.push("");
      L.push("Situation portée au dossier : représentants de proximité " +
        (String(f.representantsProximite) === "oui" ? "en place." :
         String(f.representantsProximite) === "non" ? "absents." : "[à renseigner]."));
      L.push("");

      titre(L, "Accord instituant les représentants de proximité");
      L.push("ACCORD D'ENTREPRISE RELATIF AUX REPRÉSENTANTS DE PROXIMITÉ");
      L.push("");
      L.push("Entre " + nom(ctx) + ", représentée par " + signataire(ctx) + ",");
      L.push("d'une part,");
      L.push("et les organisations syndicales représentatives dans l'entreprise :");
      L.push("   [Organisation — représentée par …]");
      L.push("d'autre part,");
      L.push("");
      L.push("PRÉAMBULE");
      L.push("");
      L.push("Le présent accord est conclu en application de l'article L. 2313-7 du code du");
      L.push("travail. Il relève de l'accord d'entreprise défini à l'article L. 2313-2,");
      L.push("conclu dans les conditions prévues au premier alinéa de l'article L. 2232-12.");
      L.push("");
      L.push("[Le cas échéant : le présent accord est celui qui détermine également le");
      L.push("nombre et le périmètre des établissements distincts. Précisez-le : c'est le");
      L.push("même accord que le texte vise.]");
      L.push("");
      L.push("ARTICLE 1 — NOMBRE DE REPRÉSENTANTS DE PROXIMITÉ (L. 2313-7, 1°)");
      L.push("");
      L.push("Le nombre de représentants de proximité est fixé à [NOMBRE].");
      L.push("[Le cas échéant, par périmètre : [périmètre] — [nombre].]");
      L.push("");
      L.push("ARTICLE 2 — ATTRIBUTIONS (L. 2313-7, 2°)");
      L.push("");
      L.push("Les représentants de proximité exercent les attributions suivantes,");
      L.push("notamment en matière de santé, de sécurité et de conditions de travail :");
      L.push("   [Énumérer. Le texte impose que l'accord les définisse ; il ne dit pas");
      L.push("    lesquelles : c'est votre choix, et il doit être écrit.]");
      L.push("");
      L.push("ARTICLE 3 — MODALITÉS DE DÉSIGNATION (L. 2313-7, 3°)");
      L.push("");
      L.push("Les représentants de proximité sont membres du comité social et économique ou");
      L.push("désignés par lui (L. 2313-7, dernier alinéa).");
      L.push("   [Préciser : qui désigne, selon quelle procédure, à quelle majorité, sur");
      L.push("    quelle candidature, dans quel délai après la proclamation des résultats.]");
      L.push("");
      L.push("Leur mandat prend fin avec celui des membres élus du comité (L. 2313-7).");
      L.push("");
      L.push("ARTICLE 4 — MODALITÉS DE FONCTIONNEMENT ET HEURES DE DÉLÉGATION");
      L.push("(L. 2313-7, 4°)");
      L.push("");
      L.push("Chaque représentant de proximité bénéficie de [NOMBRE] heures de délégation");
      L.push("par mois.");
      L.push("   [Préciser également : fréquence et forme des réunions, interlocuteur dans");
      L.push("    l'entreprise, moyens matériels, articulation avec la commission santé,");
      L.push("    sécurité et conditions de travail lorsqu'elle existe.]");
      L.push("");
      L.push("ARTICULATION DES HEURES — lorsque les membres du comité social et économique");
      L.push("sont également représentants de proximité, le temps nécessaire à l'exercice");
      L.push("de leurs fonctions défini par le présent accord peut rester inchangé par");
      L.push("rapport au temps dont ils disposent en vertu de l'accord prévu à l'article");
      L.push("L. 2314-7 ou, à défaut, du tableau de l'article R. 2314-1 (R. 2314-1).");
      if (del && del.du) {
        L.push("   Pour un effectif de " + eff + " salariés, tranche « " + del.tranche + " » du");
        L.push("   tableau de R. 2314-1 : " + del.titulaires + " titulaires, " + del.heures +
               " heures par mois et par titulaire,");
        L.push("   soit " + del.total + " heures au total.");
      } else {
        L.push("   [Reportez ici la ligne du tableau de R. 2314-1 correspondant à votre");
        L.push("    effectif : nombre de titulaires, heures mensuelles, total.]");
      }
      L.push("");
      L.push("ARTICLE 5 — DURÉE, RÉVISION, DÉPÔT");
      L.push("");
      L.push("[Durée, entrée en vigueur, révision, dénonciation, dépôt et publicité.]");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le [DATE], en [nombre] exemplaires.");
      L.push("");

      titre(L, "Variante — constat d'absence d'accord");
      L.push("À établir si aucun accord n'institue les représentants de proximité et");
      L.push("qu'aucune négociation n'aboutit. Un dispositif de fait ne se laisse pas");
      L.push("mourir en silence : il se clôt par écrit, et les personnes concernées en sont");
      L.push("informées.");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("NOTE — REPRÉSENTANTS DE PROXIMITÉ");
      L.push("");
      L.push(lieu(ctx) + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("L'article L. 2313-7 du code du travail réserve la mise en place de");
      L.push("représentants de proximité à l'accord d'entreprise défini à l'article");
      L.push("L. 2313-2.");
      L.push("");
      L.push("Aucun accord de cette nature n'a été conclu au sein de " + nom(ctx) + ".");
      L.push("[Le cas échéant : une négociation a été engagée le [date] et n'a pas abouti");
      L.push("le [date].]");
      L.push("");
      L.push("En conséquence, [aucun représentant de proximité n'est institué / le");
      L.push("dispositif existant, dépourvu de base conventionnelle, prend fin le [date]].");
      L.push("");
      L.push("Les personnes concernées et le comité social et économique en sont informés");
      L.push("par la présente note.");
      L.push("");
      L.push(signataire(ctx));

      return pied(L, ["L. 2232-12", "L. 2313-2", "L. 2313-7", "L. 2314-7", "R. 2314-1"]);
    },
  });

  /* ══════════════════════════════════════════════════════════════════════════
     ÉLECTIONS
     ══════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CSE-CTL-ELE-01", {
    nom: "Les deux invitations syndicales à négocier le protocole, et leur registre d'envoi",
    detail: "Le courrier du deuxième alinéa, la note du premier alinéa, la liste des " +
            "organisations à ne pas oublier et le registre des preuves de réception.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var eff = effectifDe(ctx);
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var inv = liste(f.syndicatsInvites);
      var L = [];

      L = L.concat(entete(ctx, "Invitation à négocier le protocole d'accord préélectoral",
        "article L. 2314-5 du code du travail"));
      usage(L);

      L.push("CE QUE LE TEXTE EXIGE, ET CE QU'ON OUBLIE");
      L.push("");
      L.push("L'article L. 2314-5 vise DEUX ENSEMBLES d'organisations, avec DEUX CANAUX");
      L.push("différents. L'erreur ordinaire consiste à n'écrire qu'aux organisations");
      L.push("représentatives : le texte est plus large, et l'omission d'une seule");
      L.push("organisation entache le processus électoral.");
      L.push("");
      L.push("  A. Informées PAR TOUT MOYEN de l'organisation des élections et invitées à");
      L.push("     négocier le protocole et à établir les listes de leurs candidats — les");
      L.push("     organisations syndicales qui satisfont aux critères de respect des");
      L.push("     valeurs républicaines et d'indépendance, légalement constituées depuis");
      L.push("     au moins deux ans et dont le champ professionnel et géographique couvre");
      L.push("     l'entreprise ou l'établissement concernés.");
      L.push("");
      L.push("  B. Invitées ÉGALEMENT PAR COURRIER — les organisations syndicales reconnues");
      L.push("     représentatives dans l'entreprise ou l'établissement, celles ayant");
      L.push("     constitué une section syndicale dans l'entreprise ou l'établissement,");
      L.push("     ainsi que les syndicats affiliés à une organisation syndicale");
      L.push("     représentative au niveau national et interprofessionnel.");
      L.push("");
      L.push("LE DÉLAI — l'invitation doit PARVENIR au plus tard quinze jours avant la date");
      L.push("de la première réunion de négociation. Le délai se compte à la réception :");
      L.push("c'est pourquoi le recommandé avec avis de réception, pour l'ensemble B, vaut");
      L.push("mieux qu'un envoi simple.");
      L.push("");
      L.push("EN CAS DE RENOUVELLEMENT — l'invitation est effectuée DEUX MOIS avant");
      L.push("l'expiration du mandat des délégués en exercice, et le premier tour a lieu");
      L.push("dans la quinzaine précédant cette expiration (L. 2314-5).");
      L.push("");
      if (eff != null && eff >= 11 && eff <= 20) {
        L.push("VOTRE CAS — l'effectif de l'entreprise (" + eff + " salariés) étant compris entre");
        L.push("onze et vingt salariés, l'employeur n'invite les organisations mentionnées");
        L.push("aux premier et deuxième alinéas qu'À LA CONDITION qu'au moins un salarié se");
        L.push("soit porté candidat aux élections dans un délai de trente jours à compter de");
        L.push("l'information prévue à l'article L. 2314-4 (L. 2314-5, dernier alinéa).");
        var di = dateDe(f.dateInformationPersonnel);
        if (di) L.push("Information diffusée le " + leJour(di) + " : les candidatures sont reçues " +
                       "jusqu'au " + leJour(dans(di, 30)) + ".");
        L.push("Le salarié qui se porte candidat bénéficie de la protection prévue aux");
        L.push("articles L. 2411-7, L. 2412-3 et L. 2413-1 à compter de la date à laquelle");
        L.push("l'employeur a eu connaissance de l'imminence de sa candidature.");
        L.push("");
      }

      titre(L, "1 — Courrier aux organisations de l'ensemble B (par courrier)");
      papier(L, ctx, ["[Organisation syndicale — dénomination]",
                      "[Union départementale / fédération, le cas échéant]", "[Adresse]"],
        leJour(d0));
      L.push("Lettre recommandée avec demande d'avis de réception");
      L.push("");
      L.push("Objet : élections au comité social et économique — invitation à négocier le");
      L.push("protocole d'accord préélectoral");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("En application de l'article L. 2314-5 du code du travail, je vous informe de");
      L.push("l'organisation des élections des membres de la délégation du personnel du");
      L.push("comité social et économique de " + nom(ctx) + ", et vous invite :");
      L.push("");
      L.push("  · à négocier le protocole d'accord préélectoral ;");
      L.push("  · à établir les listes de vos candidats aux fonctions de membre de la");
      L.push("    délégation du personnel.");
      L.push("");
      L.push("PREMIÈRE RÉUNION DE NÉGOCIATION : le [DATE], à [heure], à [lieu].");
      L.push("");
      L.push("La présente invitation vous est adressée de telle sorte qu'elle vous");
      L.push("parvienne au plus tard quinze jours avant cette date, comme l'article");
      L.push("L. 2314-5 l'exige.");
      L.push("");
      L.push("L'information du personnel prévue à l'article L. 2314-4 a été diffusée le");
      L.push(jourOu(f.dateInformationPersonnel, "date") + " ; la date envisagée pour le premier tour est le");
      L.push(jourOu(f.datePremierTour, "date") + ".");
      L.push("");
      L.push("[Le cas échéant : ordre du jour de la réunion — répartition du personnel dans");
      L.push("les collèges électoraux et des sièges entre les catégories, proportion de");
      L.push("femmes et d'hommes par collège, nombre de sièges et volume des heures de");
      L.push("délégation, modalités d'organisation et de déroulement des opérations");
      L.push("électorales, recours éventuel au vote électronique.]");
      L.push("");
      salutation(L, ctx);
      L.push("Pièce jointe : note d'information du personnel du " +
        jourOu(f.dateInformationPersonnel, "date"));
      L.push("");

      titre(L, "2 — Note aux organisations de l'ensemble A (par tout moyen)");
      L.push("Même contenu, autre canal. « Par tout moyen » n'est pas « sans trace » :");
      L.push("gardez de quoi établir l'envoi et sa date.");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("INFORMATION SUR L'ORGANISATION DES ÉLECTIONS ET INVITATION À NÉGOCIER LE");
      L.push("PROTOCOLE D'ACCORD PRÉÉLECTORAL");
      L.push("");
      L.push(lieu(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Destinataires : les organisations syndicales qui satisfont aux critères de");
      L.push("respect des valeurs républicaines et d'indépendance, légalement constituées");
      L.push("depuis au moins deux ans et dont le champ professionnel et géographique");
      L.push("couvre l'entreprise ou l'établissement concernés (L. 2314-5, premier alinéa).");
      L.push("");
      L.push("[Reprendre le corps du courrier n° 1 : objet, date et lieu de la première");
      L.push("réunion, date envisagée du premier tour, ordre du jour.]");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      titre(L, "3 — Registre des envois et des réceptions");
      L.push("C'est cette pièce qui prouvera le respect du délai de quinze jours. Sans");
      L.push("elle, la date de réception se discute — et le processus avec elle.");
      L.push("");
      L.push("  Première réunion de négociation : le [DATE].");
      L.push("  Réception au plus tard le : [DATE moins quinze jours].");
      L.push("");
      L.push("  Organisation · ensemble (A/B) · canal · date d'envoi · date de réception ·");
      L.push("  preuve");
      if (inv.length) {
        inv.forEach(function (x) {
          var n = typeof x === "string" ? x : (x && x.nom) || String(x);
          L.push("  " + n + " · [A/B] · [canal] · [envoi] · [réception] · [preuve]");
        });
        L.push("");
        L.push("  [Les organisations ci-dessus sont celles que porte votre dossier. Complétez");
        L.push("   la liste : une organisation de l'ensemble A oubliée entache le scrutin");
        L.push("   autant qu'une organisation représentative oubliée.]");
      } else {
        L.push("  [Organisation] · [A/B] · [canal] · [envoi] · [réception] · [preuve]");
        L.push("  [Organisation] · [A/B] · [canal] · [envoi] · [réception] · [preuve]");
      }
      L.push("");
      L.push("Où chercher les destinataires : les organisations représentatives dans");
      L.push("l'entreprise se lisent sur les résultats du dernier scrutin ; celles ayant");
      L.push("constitué une section syndicale, sur les désignations reçues ; les syndicats");
      L.push("affiliés à une organisation représentative au niveau national et");
      L.push("interprofessionnel, auprès des unions départementales correspondantes.");
      L.push("");
      L.push("CE QUE L'INVITATION EXPOSE — le fait d'apporter une entrave à la constitution");
      L.push("du comité ou à la libre désignation de ses membres, notamment par la");
      L.push("méconnaissance des dispositions des articles L. 2314-1 à L. 2314-9, est puni");
      L.push("d'un emprisonnement d'un an et d'une amende de 7 500 € (L. 2317-1).");

      return pied(L, ["L. 2314-4", "L. 2314-5", "L. 2317-1"]);
    },
  });

  DP.ajouter("CSE-CTL-ELE-02", {
    nom: "La nouvelle information du personnel, et le décompte des quatre-vingt-dix jours",
    detail: "Le décompte fait à partir de vos dates, et la note qui rouvre le processus " +
            "lorsque le délai est dépassé.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var dinfo = dateDe(f.dateInformationPersonnel);
      var dtour = dateDe(f.datePremierTour);
      var L = [];

      L = L.concat(entete(ctx, "Information du personnel et délai du premier tour",
        "article L. 2314-4 du code du travail"));
      usage(L);

      L.push("LE TEXTE, ET LE DÉCOMPTE");
      L.push("");
      L.push("« Lorsque le seuil de onze salariés a été franchi dans les conditions prévues");
      L.push("au deuxième alinéa de l'article L. 2311-2, l'employeur informe le personnel");
      L.push("tous les quatre ans de l'organisation des élections par tout moyen permettant");
      L.push("de conférer date certaine à cette information. Le document diffusé précise la");
      L.push("date envisagée pour le premier tour. Celui-ci doit se tenir, au plus tard, le");
      L.push("quatre-vingt-dixième jour suivant la diffusion » (L. 2314-4).");
      L.push("");
      L.push("Trois obligations, et non une : la DATE CERTAINE de la diffusion, la MENTION");
      L.push("de la date envisagée dans le document, et le DÉLAI de quatre-vingt-dix jours");
      L.push("qui court de la diffusion — non de la décision d'organiser le scrutin, non de");
      L.push("l'invitation syndicale, non du protocole.");
      L.push("");
      L.push("VOTRE DÉCOMPTE");
      L.push("");
      if (dinfo) {
        var lim = dans(dinfo, 90);
        L.push("  Diffusion de l'information au personnel .......... " + leJour(dinfo));
        L.push("  Quatre-vingt-dixième jour suivant ............... " + leJour(lim));
        L.push("  Premier tour porté au dossier .................. " +
               (dtour ? leJour(dtour) : "[non renseigné]"));
        if (dtour) {
          var e = Math.round((dtour - dinfo) / 86400000);
          L.push("  Écart ......................................... " + e + " jours");
          L.push("");
          if (e > 90) {
            L.push("  LE DÉLAI EST DÉPASSÉ de " + (e - 90) + " jour(s). Le processus ne peut pas être");
            L.push("  sauvé par une simple correction de date : il faut le reprendre, en");
            L.push("  diffusant une NOUVELLE information au personnel. Le modèle en est donné");
            L.push("  ci-dessous, et le décompte repart de sa diffusion.");
          } else if (e < 0) {
            L.push("  LA CHRONOLOGIE EST INVERSÉE : le premier tour précède la diffusion de");
            L.push("  l'information. L'une des deux dates est fausse — reprenez-les sur les");
            L.push("  pièces d'origine avant toute autre chose.");
          } else {
            L.push("  Le délai est tenu. Conservez la preuve de diffusion : c'est elle, et");
            L.push("  elle seule, qui établit le point de départ.");
          }
        } else {
          L.push("");
          L.push("  Aucune date de premier tour n'est portée au dossier. Elle ne peut pas");
          L.push("  être postérieure au " + leJour(lim) + ".");
        }
      } else {
        L.push("  Aucune date de diffusion n'est portée au dossier : sans elle, le point de");
        L.push("  départ du délai est indémontrable, et le respect du délai avec lui.");
        L.push("");
        L.push("  Si l'information est diffusée aujourd'hui, " + leJour(d0) + ", le premier");
        L.push("  tour devra se tenir au plus tard le " + leJour(dans(d0, 90)) + ".");
      }
      L.push("");

      titre(L, "Note d'information du personnel");
      L.push("À diffuser par tout moyen permettant de conférer date certaine. Si vous");
      L.push("reprenez un processus dont le délai est expiré, c'est la diffusion de CETTE");
      L.push("note qui fait repartir les quatre-vingt-dix jours.");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("NOTE D'INFORMATION AU PERSONNEL");
      L.push("Organisation des élections des membres de la délégation du personnel");
      L.push("du comité social et économique");
      L.push("");
      L.push(lieu(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Conformément à l'article L. 2314-4 du code du travail, vous êtes informés de");
      L.push("l'organisation des élections des membres de la délégation du personnel du");
      L.push("comité social et économique de " + nom(ctx) + ".");
      L.push("");
      if (dinfo && dtour && Math.round((dtour - dinfo) / 86400000) > 90) {
        L.push("[Mention de reprise, à conserver si le processus précédent est repris : une");
        L.push("première information avait été diffusée le " + leJour(dinfo) + ". Le premier");
        L.push("tour n'ayant pu se tenir dans le délai de quatre-vingt-dix jours suivant");
        L.push("cette diffusion, le processus est repris et le délai court à compter de la");
        L.push("présente information.]");
        L.push("");
      }
      L.push("DATE ENVISAGÉE POUR LE PREMIER TOUR : [DATE]");
      L.push("");
      L.push("Cette mention est imposée par l'article L. 2314-4. Le premier tour se tiendra");
      L.push("au plus tard le " + leJour(dans(d0, 90)) + ", quatre-vingt-dixième jour suivant");
      L.push("la diffusion de la présente note.");
      L.push("");
      L.push("[Le cas échéant : lieu et horaires du scrutin, modalités de dépôt des");
      L.push("candidatures, date de la première réunion de négociation du protocole");
      L.push("d'accord préélectoral, second tour éventuel.]");
      L.push("");
      L.push("Moyen de diffusion retenu, et ce qui lui confère date certaine :");
      L.push("[affichage constaté et daté · remise contre émargement · courrier recommandé ·");
      L.push("courriel avec accusé de réception · publication horodatée sur l'intranet].");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("CONSERVEZ : la preuve de diffusion et un exemplaire de la note portant la");
      L.push("mention de la date envisagée. Ces deux pièces établissent, l'une le point de");
      L.push("départ du délai, l'autre le respect de la mention obligatoire.");

      return pied(L, ["L. 2311-2", "L. 2314-4", "L. 2317-1"]);
    },
  });

  DP.ajouter("CSE-CTL-ELE-03", {
    nom: "Le protocole d'accord préélectoral, sa feuille de signatures et le calcul de la double majorité",
    detail: "Le protocole rédigé, la feuille de signatures, le décompte des deux " +
            "majorités et le constat à écrire si elles ne sont pas réunies.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var eff = effectifDe(ctx);
      var pr = objet(f.protocole);
      var del = delegationLegale(eff);
      var L = [];

      L = L.concat(entete(ctx, "Protocole d'accord préélectoral",
        "articles L. 2314-6, L. 2314-7, L. 2314-11, L. 2314-13 et L. 2314-28 du code du travail"));
      usage(L);

      L.push("LA DOUBLE MAJORITÉ — CE QUI REND LE PROTOCOLE VALABLE");
      L.push("");
      L.push("« Sauf dispositions législatives contraires, la validité du protocole");
      L.push("d'accord préélectoral conclu entre l'employeur et les organisations");
      L.push("syndicales intéressées est subordonnée à sa signature par la majorité des");
      L.push("organisations syndicales ayant participé à sa négociation, dont les");
      L.push("organisations syndicales représentatives ayant recueilli la majorité des");
      L.push("suffrages exprimés lors des dernières élections professionnelles ou, lorsque");
      L.push("ces résultats ne sont pas disponibles, la majorité des organisations");
      L.push("représentatives dans l'entreprise » (L. 2314-6).");
      L.push("");
      L.push("Deux conditions CUMULATIVES :");
      L.push("  1. la majorité en NOMBRE des organisations AYANT PARTICIPÉ À LA NÉGOCIATION");
      L.push("     — et non de l'ensemble des organisations invitées ;");
      L.push("  2. parmi les signataires, les organisations représentatives ayant recueilli");
      L.push("     la MAJORITÉ DES SUFFRAGES exprimés aux dernières élections");
      L.push("     professionnelles ; à défaut de résultats disponibles, la majorité des");
      L.push("     organisations représentatives dans l'entreprise.");
      L.push("");
      L.push("VOTRE DÉCOMPTE");
      L.push("");
      var part = nb(pr.nbParticipants), sig = nb(pr.nbSignataires), suf = nb(pr.suffragesSignataires);
      L.push("  Organisations ayant participé à la négociation ... " + (part == null ? "[nombre]" : part));
      L.push("  Organisations signataires ....................... " + (sig == null ? "[nombre]" : sig));
      if (part != null && sig != null) {
        var maj = Math.floor(part / 2) + 1;
        L.push("  Majorité en nombre requise ...................... " + maj);
        L.push("  Première condition .............................. " +
               (sig >= maj ? "remplie." : "NON REMPLIE."));
      } else {
        L.push("  Majorité en nombre requise ...................... [plus de la moitié]");
      }
      L.push("  Suffrages des représentatives signataires ....... " +
             (suf == null ? "[pourcentage]" : suf + " %"));
      if (suf != null)
        L.push("  Seconde condition ............................... " +
               (suf > 50 ? "remplie." : "NON REMPLIE — il faut la majorité des suffrages exprimés."));
      L.push("");
      L.push("  [Joignez le procès-verbal des dernières élections : c'est lui qui établit");
      L.push("   les suffrages, et lui seul.]");
      L.push("");
      L.push("SI LA DOUBLE MAJORITÉ N'EST PAS RÉUNIE — le protocole ne purge rien. Les");
      L.push("stipulations qu'il porte sont sans effet, et ce sont les règles légales qui");
      L.push("s'appliquent : la composition des collèges de l'article L. 2314-11 et le");
      L.push("tableau de l'article R. 2314-1. Rouvrez la négociation, ou écrivez quelles");
      L.push("règles légales vous appliquez à la place — le constat figure en fin de");
      L.push("document.");
      L.push("");

      titre(L, "Protocole d'accord préélectoral");
      L.push("PROTOCOLE D'ACCORD PRÉÉLECTORAL");
      L.push("Élections des membres de la délégation du personnel");
      L.push("du comité social et économique de " + nom(ctx));
      L.push("");
      L.push("Entre " + nom(ctx) + ", " + cro((ctx.profil || {}).adresse, "adresse du siège") + ",");
      L.push("représentée par " + signataire(ctx) + ",");
      L.push("");
      L.push("et les organisations syndicales ayant participé à la négociation :");
      L.push("   [Organisation — représentée par …]");
      L.push("   [Organisation — représentée par …]");
      L.push("");
      L.push("ARTICLE 1 — CHAMP ET EFFECTIF");
      L.push("");
      L.push("Le présent protocole s'applique à l'élection des membres de la délégation du");
      L.push("personnel du comité social et économique de " + nom(ctx));
      L.push("[/ de l'établissement distinct de …].");
      L.push("Effectif retenu, calculé selon l'article L. 1111-2 : " +
        (eff == null ? "[effectif]" : eff) + " salariés.");
      L.push("");
      L.push("ARTICLE 2 — COLLÈGES ÉLECTORAUX");
      L.push("");
      L.push("À défaut d'accord modifiant leur nombre et leur composition (L. 2314-12), les");
      L.push("collèges sont ceux de l'article L. 2314-11 :");
      L.push("  · le collège des ouvriers et employés ;");
      L.push("  · le collège des ingénieurs, chefs de service, techniciens, agents de");
      L.push("    maîtrise et assimilés.");
      L.push("");
      L.push("Dans les entreprises d'au moins cinq cent un salariés, les ingénieurs, chefs");
      L.push("de service et cadres administratifs, commerciaux ou techniques assimilés ont");
      L.push("au moins un délégué titulaire au sein du second collège (L. 2314-11).");
      L.push("");
      L.push("Dans les entreprises, quel que soit leur effectif, dont le nombre de ces");
      L.push("mêmes catégories est au moins égal à VINGT-CINQ au moment de la constitution");
      L.push("ou du renouvellement de l'instance, elles constituent un TROISIÈME COLLÈGE");
      L.push("(L. 2314-11).");
      var nbc = nb(f.nbCadres);
      if (nbc != null)
        L.push("   Votre dossier porte " + nbc + " ingénieurs, chefs de service et cadres assimilés : " +
               (nbc >= 25 ? "le troisième collège est constitué." : "le troisième collège n'est pas dû."));
      else
        L.push("   [Nombre d'ingénieurs, chefs de service et cadres assimilés : … ]");
      L.push("");
      L.push("Dans les établissements ou entreprises n'élisant qu'un titulaire et un");
      L.push("suppléant, il est mis en place, pour chacune de ces élections, un COLLÈGE");
      L.push("ÉLECTORAL UNIQUE regroupant l'ensemble des catégories professionnelles");
      L.push("(L. 2314-11, dernier alinéa).");
      L.push("");
      L.push("Composition retenue : [décrire chaque collège et les catégories qu'il");
      L.push("regroupe].");
      L.push("");
      L.push("ARTICLE 3 — RÉPARTITION DU PERSONNEL ET DES SIÈGES,");
      L.push("PROPORTION DE FEMMES ET D'HOMMES (L. 2314-13)");
      L.push("");
      L.push("La répartition des sièges entre les différentes catégories de personnel et la");
      L.push("répartition du personnel dans les collèges électoraux sont arrêtées comme");
      L.push("suit :");
      L.push("   Collège 1 — inscrits : [ ] · sièges titulaires : [ ] · suppléants : [ ]");
      L.push("   Collège 2 — inscrits : [ ] · sièges titulaires : [ ] · suppléants : [ ]");
      L.push("   [Collège 3 — … ]");
      L.push("");
      L.push("PROPORTION DE FEMMES ET D'HOMMES COMPOSANT CHAQUE COLLÈGE ÉLECTORAL —");
      L.push("mention IMPOSÉE par l'article L. 2314-13, deuxième alinéa :");
      L.push("   Collège 1 — femmes : [ ] soit [ ] % · hommes : [ ] soit [ ] %");
      L.push("   Collège 2 — femmes : [ ] soit [ ] % · hommes : [ ] soit [ ] %");
      L.push("   [Collège 3 — … ]");
      if (pr.proportionFH === false) {
        L.push("   [Votre dossier indique que cette mention NE FIGURE PAS au protocole : sans");
        L.push("    elle, les listes se composent à l'aveugle et s'exposent à l'annulation.]");
      }
      L.push("");
      L.push("Cette proportion est portée à la connaissance des salariés par tout moyen");
      L.push("permettant de donner une date certaine, dès l'accord ou la décision");
      L.push("intervenus (L. 2314-31).");
      L.push("");
      L.push("ARTICLE 4 — NOMBRE DE SIÈGES ET HEURES DE DÉLÉGATION (L. 2314-7)");
      L.push("");
      if (del && del.du) {
        L.push("À défaut de stipulations du présent protocole, le tableau de l'article");
        L.push("R. 2314-1 fixe, pour un effectif de " + eff + " salariés (tranche « " +
               del.tranche + " ») :");
        L.push("   nombre de titulaires ......................... " + del.titulaires);
        L.push("   heures mensuelles par titulaire .............. " + del.heures);
        L.push("   volume global mensuel ....................... " + del.total + " heures");
      } else {
        L.push("[Reportez la ligne du tableau de R. 2314-1 correspondant à votre effectif :");
        L.push(" nombre de titulaires, heures mensuelles, total.]");
      }
      L.push("");
      L.push("Le protocole peut modifier le nombre de sièges ou le volume des heures");
      L.push("individuelles de délégation DÈS LORS QUE le volume global de ces heures, AU");
      L.push("SEIN DE CHAQUE COLLÈGE, est au moins égal à celui résultant des dispositions");
      L.push("légales au regard de l'effectif de l'entreprise (L. 2314-7).");
      L.push("");
      L.push("   Stipulation retenue : [nombre de sièges par collège] · [heures");
      L.push("   individuelles] · [volume global par collège, à comparer au volume légal].");
      L.push("");
      L.push("ARTICLE 5 — MODALITÉS D'ORGANISATION ET DE DÉROULEMENT DU SCRUTIN");
      L.push("(L. 2314-28)");
      L.push("");
      L.push("Les modalités d'organisation et de déroulement des opérations électorales");
      L.push("font l'objet du présent accord et respectent les principes généraux du droit");
      L.push("électoral (L. 2314-28).");
      L.push("");
      L.push("   Dates et heures du premier tour : [ ] · du second tour : [ ]");
      L.push("   Lieu et modalités du vote : [ ]");
      L.push("   Dépôt des candidatures : [date limite] · [forme]");
      L.push("   Composition et fonctionnement des bureaux de vote : [ ]");
      L.push("   Affichage des listes électorales : [date] · [lieu]");
      L.push("   Propagande électorale : [ ]");
      L.push("   Vote par correspondance : [ ]");
      L.push("");
      L.push("L'élection a lieu pendant le temps de travail ; un accord contraire peut être");
      L.push("conclu entre l'employeur et l'ensemble des organisations syndicales");
      L.push("représentatives dans l'entreprise, notamment en cas de travail en continu");
      L.push("(L. 2314-27).");
      L.push("");
      L.push("Les modalités sur lesquelles aucun accord n'a pu intervenir peuvent être");
      L.push("fixées par une décision du juge judiciaire (L. 2314-28) : le président du");
      L.push("tribunal judiciaire statue en dernier ressort selon la procédure accélérée au");
      L.push("fond (R. 2314-2).");
      L.push("");
      L.push("ARTICLE 6 — MODE DE SCRUTIN");
      L.push("");
      L.push("Le scrutin est de liste à deux tours avec représentation proportionnelle à la");
      L.push("plus forte moyenne. Au premier tour, chaque liste est établie par les");
      L.push("organisations syndicales mentionnées aux premier et deuxième alinéas de");
      L.push("l'article L. 2314-5. Si le nombre des votants est inférieur à la moitié des");
      L.push("électeurs inscrits, il est procédé, dans un délai de quinze jours, à un");
      L.push("second tour pour lequel les électeurs peuvent voter pour des listes autres");
      L.push("que celles présentées par une organisation syndicale (L. 2314-29).");
      L.push("");
      L.push("L'élection a lieu au scrutin secret sous enveloppe ; elle peut également");
      L.push("avoir lieu par vote électronique si un accord d'entreprise ou, à défaut,");
      L.push("l'employeur le décide (L. 2314-26). Il est procédé à des votes séparés pour");
      L.push("les titulaires et pour les suppléants, dans chacune des catégories");
      L.push("professionnelles formant des collèges distincts (L. 2314-26).");
      L.push("");
      L.push("ARTICLE 7 — COMPOSITION DES LISTES");
      L.push("");
      L.push("Pour chaque collège, les listes comportant plusieurs candidats sont composées");
      L.push("d'un nombre de femmes et d'hommes correspondant à la part de femmes et");
      L.push("d'hommes INSCRITS SUR LA LISTE ÉLECTORALE, et alternativement d'un candidat");
      L.push("de chaque sexe jusqu'à épuisement des candidats de l'un des sexes");
      L.push("(L. 2314-30). Cette règle s'applique séparément à la liste des titulaires et");
      L.push("à celle des suppléants.");
      L.push("");
      L.push("ARTICLE 8 — TRANSMISSION DES PROCÈS-VERBAUX");
      L.push("");
      L.push("Après la proclamation des résultats, l'employeur transmet, dans les meilleurs");
      L.push("délais, par tout moyen, une copie des procès-verbaux aux organisations");
      L.push("syndicales de salariés qui ont présenté des listes de candidats aux scrutins");
      L.push("concernés ainsi qu'à celles ayant participé à la négociation du présent");
      L.push("protocole (L. 2314-29, dernier alinéa).");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le [DATE], en [nombre] exemplaires.");
      L.push("");

      titre(L, "Feuille de signatures");
      L.push("Elle est la pièce qui établit la double majorité. Faites-la signer le jour");
      L.push("même, et annexez-y le procès-verbal des dernières élections.");
      L.push("");
      L.push("  Organisations AYANT PARTICIPÉ à la négociation (total : " +
        (part == null ? "[ ]" : part) + ")");
      L.push("");
      L.push("  Organisation · représentative (oui/non) · suffrages obtenus aux dernières");
      L.push("  élections (%) · a participé · signe · nom du signataire · date · signature");
      L.push("");
      L.push("  [ ] · [ ] · [ ] · [ ] · [ ] · [ ] · [ ] · ______________");
      L.push("  [ ] · [ ] · [ ] · [ ] · [ ] · [ ] · [ ] · ______________");
      L.push("  [ ] · [ ] · [ ] · [ ] · [ ] · [ ] · [ ] · ______________");
      L.push("");
      L.push("  Pour l'employeur : " + signataire(ctx) + " · date : [ ] · ______________");
      L.push("");
      L.push("  TOTAUX — participants : [ ] · signataires : [ ] · majorité en nombre");
      L.push("  atteinte : [oui/non] · suffrages des représentatives signataires : [ ] % ·");
      L.push("  majorité des suffrages atteinte : [oui/non]");
      L.push("");
      L.push("  Pièce annexée : procès-verbal des dernières élections professionnelles.");
      L.push("  [Si ces résultats ne sont pas disponibles, la seconde condition se mesure");
      L.push("   sur la majorité des organisations représentatives dans l'entreprise");
      L.push("   (L. 2314-6) : indiquez-les et comptez-les.]");
      L.push("");

      titre(L, "Constat, si la double majorité n'est pas réunie");
      L.push(nom(ctx));
      L.push("");
      L.push("NOTE — INVALIDITÉ DU PROTOCOLE ET RÈGLES APPLIQUÉES");
      L.push("");
      L.push(lieu(ctx) + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("Le protocole d'accord préélectoral du [date] ne remplit pas la condition de");
      L.push("double majorité de l'article L. 2314-6 : [préciser laquelle des deux fait");
      L.push("défaut, avec les nombres].");
      L.push("");
      L.push("La négociation a été [rouverte le … / close sans accord le …].");
      L.push("");
      L.push("À défaut de protocole valable, les règles suivantes sont appliquées :");
      L.push("  · composition des collèges électoraux : article L. 2314-11 ;");
      L.push("  · nombre de titulaires et heures de délégation : tableau de l'article");
      L.push("    R. 2314-1" +
        (del && del.du ? " — " + del.titulaires + " titulaires, " + del.heures +
                          " heures mensuelles, " + del.total + " heures au total" : "") + " ;");
      L.push("  · répartition du personnel et des sièges : [à défaut d'accord, et lorsque au");
      L.push("    moins une organisation syndicale a répondu à l'invitation à négocier,");
      L.push("    l'autorité administrative décide de cette répartition (L. 2314-13). Sa");
      L.push("    saisine SUSPEND le processus électoral jusqu'à la décision et entraîne la");
      L.push("    prorogation des mandats des élus en cours jusqu'à la proclamation des");
      L.push("    résultats.]");
      L.push("");
      L.push(signataire(ctx));

      return pied(L, ["L. 1111-2", "L. 2314-5", "L. 2314-6", "L. 2314-7", "L. 2314-11",
                      "L. 2314-12", "L. 2314-13", "L. 2314-26", "L. 2314-27", "L. 2314-28",
                      "L. 2314-29", "L. 2314-30", "L. 2314-31", "R. 2314-1", "R. 2314-2"]);
    },
  });

  DP.ajouter("CSE-CTL-ELE-04", {
    nom: "L'avenant portant la proportion de femmes et d'hommes, et la note aux salariés",
    detail: "L'avenant au protocole qui porte la proportion collège par collège, et " +
            "l'information des salariés à date certaine, avant l'ouverture du dépôt des listes.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var listes = liste(f.listesDeposees);
      var L = [];

      L = L.concat(entete(ctx, "Proportion de femmes et d'hommes par collège électoral",
        "articles L. 2314-13, L. 2314-30 et L. 2314-31 du code du travail"));
      usage(L);

      L.push("POURQUOI CETTE MENTION N'EST PAS UNE FORMALITÉ");
      L.push("");
      L.push("L'accord de répartition « mentionne la proportion de femmes et d'hommes");
      L.push("composant chaque collège électoral » (L. 2314-13, deuxième alinéa). Et « dès");
      L.push("qu'un accord ou une décision de l'autorité administrative ou de l'employeur");
      L.push("sur la répartition du personnel est intervenu, l'employeur porte à la");
      L.push("connaissance des salariés, par tout moyen permettant de donner une date");
      L.push("certaine à cette information, la proportion de femmes et d'hommes composant");
      L.push("chaque collège électoral » (L. 2314-31).");
      L.push("");
      L.push("C'est cette proportion — celle des INSCRITS SUR LA LISTE ÉLECTORALE, non");
      L.push("l'effectif global de l'entreprise — qui commande la composition des listes de");
      L.push("candidats (L. 2314-30). Sans elle, les organisations composent à l'aveugle,");
      L.push("et l'élection des candidats du sexe surreprésenté en surnombre est annulée");
      L.push("par le juge (L. 2314-32).");
      L.push("");
      L.push("DIFFUSEZ AVANT L'OUVERTURE DU DÉPÔT DES LISTES : après, l'information ne sert");
      L.push("plus à rien.");
      L.push("");

      titre(L, "1 — Avenant au protocole d'accord préélectoral");
      L.push("AVENANT N° [ ] AU PROTOCOLE D'ACCORD PRÉÉLECTORAL DU [DATE]");
      L.push("");
      L.push("Entre " + nom(ctx) + ", représentée par " + signataire(ctx) + ",");
      L.push("et les organisations syndicales ayant participé à la négociation :");
      L.push("   [Organisation] · [Organisation]");
      L.push("");
      L.push("PRÉAMBULE — le protocole du [date] ne mentionne pas la proportion de femmes");
      L.push("et d'hommes composant chaque collège électoral, que l'article L. 2314-13 du");
      L.push("code du travail impose. Le présent avenant y remédie.");
      L.push("");
      L.push("ARTICLE UNIQUE — PROPORTION DE FEMMES ET D'HOMMES PAR COLLÈGE");
      L.push("");
      L.push("Sur la base de la liste électorale arrêtée le [DATE] :");
      L.push("");
      if (listes.length) {
        listes.forEach(function (x, i) {
          var fi = nb(x && x.femmesInscrites), hi = nb(x && x.hommesInscrits);
          var tot = (fi != null && hi != null) ? fi + hi : null;
          var lib = (x && x.nom) ? String(x.nom) : "Collège " + (i + 1);
          L.push("   " + lib);
          if (tot) {
            L.push("      inscrits : " + tot + "  ·  femmes : " + fi + " (" +
                   (Math.round(fi / tot * 1000) / 10) + " %)  ·  hommes : " + hi + " (" +
                   (Math.round(hi / tot * 1000) / 10) + " %)");
            var sieges = nb(x && x.siegesAPourvoir);
            if (sieges) {
              L.push("      sièges à pourvoir : " + sieges);
              L.push("      candidats attendus, avant arrondi : femmes " +
                     (Math.round(fi / tot * sieges * 100) / 100) + " · hommes " +
                     (Math.round(hi / tot * sieges * 100) / 100));
            }
          } else {
            L.push("      inscrits : [ ] · femmes : [ ] ([ ] %) · hommes : [ ] ([ ] %)");
          }
        });
        L.push("");
        L.push("   [Ces valeurs sont celles que porte votre dossier. Vérifiez-les sur la");
        L.push("    liste électorale elle-même avant de signer.]");
      } else {
        L.push("   Collège 1 — inscrits : [ ] · femmes : [ ] soit [ ] % · hommes : [ ] soit [ ] %");
        L.push("   Collège 2 — inscrits : [ ] · femmes : [ ] soit [ ] % · hommes : [ ] soit [ ] %");
        L.push("   [Collège 3 — … ]");
      }
      L.push("");
      L.push("Les autres stipulations du protocole demeurent inchangées.");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le [DATE], en [nombre] exemplaires.");
      L.push("");
      L.push("[Feuille de signatures : le présent avenant obéit à la condition de validité");
      L.push("de l'article L. 2314-6, comme le protocole qu'il modifie — L. 2314-13 renvoie");
      L.push("aux conditions de cet article.]");
      L.push("");

      titre(L, "2 — Note d'information des salariés (L. 2314-31)");
      L.push("À diffuser par tout moyen permettant de donner une DATE CERTAINE, dès");
      L.push("l'accord ou la décision intervenus, et avant l'ouverture du dépôt des listes.");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("NOTE D'INFORMATION AU PERSONNEL");
      L.push("Proportion de femmes et d'hommes composant chaque collège électoral");
      L.push("");
      L.push(lieu(ctx) + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("En application de l'article L. 2314-31 du code du travail, vous êtes informés");
      L.push("de la proportion de femmes et d'hommes composant chaque collège électoral");
      L.push("pour les élections des membres de la délégation du personnel du comité social");
      L.push("et économique de " + nom(ctx) + ".");
      L.push("");
      L.push("Cette proportion, arrêtée sur la liste électorale du [DATE], est la suivante :");
      L.push("");
      L.push("   [Reprendre le tableau de l'avenant, collège par collège.]");
      L.push("");
      L.push("CE QU'ELLE COMMANDE — pour chaque collège, les listes de candidats comportant");
      L.push("plusieurs candidats sont composées d'un nombre de femmes et d'hommes");
      L.push("correspondant à cette part, et alternativement d'un candidat de chaque sexe");
      L.push("jusqu'à épuisement des candidats de l'un des sexes (L. 2314-30). La règle");
      L.push("s'applique séparément à la liste des titulaires et à celle des suppléants.");
      L.push("");
      L.push("Dépôt des listes : jusqu'au [DATE LIMITE].");
      L.push("");
      L.push("Moyen de diffusion retenu, et ce qui lui confère date certaine : [ ].");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Destinataires complémentaires recommandés : les organisations syndicales");
      L.push("ayant participé à la négociation du protocole et celles invitées à établir");
      L.push("des listes. Le texte impose l'information des salariés ; ce sont les");
      L.push("organisations qui composent les listes.");

      return pied(L, ["L. 2314-6", "L. 2314-13", "L. 2314-30", "L. 2314-31", "L. 2314-32"]);
    },
  });

  DP.ajouter("CSE-CTL-ELE-05", {
    nom: "La notification d'irrégularité des listes aux organisations syndicales",
    detail: "Le calcul de la proportion et de l'arrondi, la vérification de l'alternance, " +
            "et le courrier de demande de rectification avant le scrutin.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var listes = liste(f.listesDeposees);
      var L = [];

      L = L.concat(entete(ctx, "Composition des listes de candidats — notification d'irrégularité",
        "articles L. 2314-30 et L. 2314-32 du code du travail"));
      usage(L);

      L.push("LA RÈGLE, ET SON ARITHMÉTIQUE");
      L.push("");
      L.push("Pour chaque collège, les listes qui comportent plusieurs candidats sont");
      L.push("composées d'un nombre de femmes et d'hommes correspondant à la part de femmes");
      L.push("et d'hommes INSCRITS SUR LA LISTE ÉLECTORALE. Les listes sont composées");
      L.push("ALTERNATIVEMENT d'un candidat de chaque sexe jusqu'à épuisement des candidats");
      L.push("d'un des sexes (L. 2314-30, premier alinéa).");
      L.push("");
      L.push("Lorsque le calcul n'aboutit pas à un nombre entier de candidats à désigner");
      L.push("pour chacun des deux sexes, l'arrondi est arithmétique :");
      L.push("   1° à l'entier SUPÉRIEUR en cas de décimale supérieure ou égale à 5 ;");
      L.push("   2° à l'entier INFÉRIEUR en cas de décimale strictement inférieure à 5.");
      L.push("");
      L.push("Deux cas particuliers, écrits dans le texte :");
      L.push("  · en cas de nombre impair de sièges à pourvoir ET de stricte égalité entre");
      L.push("    les femmes et les hommes inscrits sur les listes électorales, la liste");
      L.push("    comprend indifféremment un homme ou une femme supplémentaire ;");
      L.push("  · lorsque l'application de ces règles conduit à exclure totalement la");
      L.push("    représentation de l'un ou l'autre sexe, la liste peut comporter un");
      L.push("    candidat du sexe qui, à défaut, ne serait pas représenté ; ce candidat NE");
      L.push("    PEUT PAS être en première position sur la liste.");
      L.push("");
      L.push("La règle s'applique SÉPARÉMENT à la liste des titulaires et à celle des");
      L.push("suppléants (L. 2314-30, dernier alinéa).");
      L.push("");
      L.push("CE QUE COÛTE L'IRRÉGULARITÉ — constatée par le juge APRÈS l'élection, la");
      L.push("méconnaissance de la première phrase du premier alinéa entraîne l'annulation");
      L.push("de l'élection d'un nombre d'élus du sexe surreprésenté égal au nombre de");
      L.push("candidats en surnombre, le juge annulant l'élection des derniers élus de ce");
      L.push("sexe en suivant l'ordre inverse de la liste ; la méconnaissance de");
      L.push("l'alternance entraîne l'annulation de l'élection du ou des élus dont le");
      L.push("positionnement ne la respecte pas (L. 2314-32). Le cas échéant, il est fait");
      L.push("application des élections partielles de l'article L. 2314-10.");
      L.push("");
      L.push("D'où l'objet du courrier ci-dessous : faire rectifier AVANT le scrutin.");
      L.push("Après, seul le juge tranche, et il annule.");
      L.push("");

      L.push("VOTRE VÉRIFICATION, LISTE PAR LISTE");
      L.push("");
      if (listes.length) {
        listes.forEach(function (x, i) {
          var lib = (x && x.nom) ? String(x.nom) : "Liste " + (i + 1);
          var fi = nb(x && x.femmesInscrites), hi = nb(x && x.hommesInscrits);
          var si = nb(x && x.siegesAPourvoir);
          var cand = liste(x && x.candidats);
          L.push("  " + lib);
          if (fi != null && hi != null && si) {
            var tot = fi + hi;
            var attF = fi / tot * si, attH = hi / tot * si;
            var arr = function (v) { var e = Math.floor(v); return (v - e) >= 0.5 ? e + 1 : e; };
            L.push("     inscrits : " + tot + " (femmes " + fi + ", hommes " + hi + ") · sièges : " + si);
            L.push("     part appliquée aux sièges : femmes " + (Math.round(attF * 100) / 100) +
                   " · hommes " + (Math.round(attH * 100) / 100));
            L.push("     après arrondi de L. 2314-30 : femmes " + arr(attF) + " · hommes " + arr(attH));
            if (cand.length) {
              var nF = cand.filter(function (c) { return String(c && c.sexe).toUpperCase() === "F"; }).length;
              var nH = cand.length - nF;
              L.push("     liste déposée : " + cand.length + " candidats — femmes " + nF + ", hommes " + nH);
              var ordre = cand.map(function (c) { return String(c && c.sexe).toUpperCase(); }).join(" ");
              L.push("     ordre de dépôt : " + ordre);
              var alt = true;
              for (var k = 1; k < cand.length; k++) {
                var a = String(cand[k - 1] && cand[k - 1].sexe).toUpperCase();
                var b = String(cand[k] && cand[k].sexe).toUpperCase();
                if (a === b) { alt = false; break; }
              }
              L.push("     alternance stricte respectée jusqu'à épuisement : " +
                     (alt ? "oui" : "NON — voir L. 2314-30, première phrase du premier alinéa"));
              if (nF !== arr(attF) || nH !== arr(attH))
                L.push("     ÉCART DE PROPORTION : attendu femmes " + arr(attF) + " / hommes " +
                       arr(attH) + ", déposé femmes " + nF + " / hommes " + nH + ".");
            } else {
              L.push("     [Composition de la liste déposée : à reporter.]");
            }
          } else {
            L.push("     [Inscrits femmes et hommes du collège, sièges à pourvoir, et sexe de");
            L.push("      chaque candidat dans l'ordre de dépôt : à reporter.]");
          }
          L.push("");
        });
        L.push("  [Le décompte ci-dessus est fait sur les valeurs de votre dossier. Il");
        L.push("   n'apprécie ni les deux cas particuliers du texte — nombre impair de sièges");
        L.push("   avec stricte égalité des inscrits, et sexe qui serait totalement exclu —");
        L.push("   ni ce que le juge tirerait des circonstances. Reprenez-le sur la liste");
        L.push("   électorale et sur la liste déposée avant de notifier quoi que ce soit.]");
      } else {
        L.push("  [Aucune liste n'est portée au dossier. Pour chaque collège et pour chacune");
        L.push("   des deux listes — titulaires et suppléants —, reportez : inscrits femmes,");
        L.push("   inscrits hommes, sièges à pourvoir, et le sexe de chaque candidat dans");
        L.push("   l'ordre de dépôt. Le calcul se fait ensuite comme ci-dessus.]");
      }
      L.push("");

      courrier(L, 1, "notification d'irrégularité et demande de rectification", [
        "À adresser à l'organisation QUI A DÉPOSÉ la liste, avant le scrutin, par écrit,",
        "et à conserver avec la réponse. C'est la seule voie qui évite l'annulation :",
        "après l'élection, le juge annule (L. 2314-32).",
      ]);
      papier(L, ctx, ["[Organisation syndicale ayant déposé la liste]", "[Adresse]"],
        leJour(ctx.aujourdhui));
      L.push("Lettre remise en main propre contre décharge [ou recommandée avec avis de");
      L.push("réception]");
      L.push("");
      L.push("Objet : composition de la liste de candidats déposée le [DATE] — collège [ ],");
      L.push("[titulaires / suppléants]");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Vous avez déposé le [DATE], pour le collège [ ], une liste de [nombre]");
      L.push("candidats aux fonctions de membre [titulaire / suppléant] de la délégation du");
      L.push("personnel du comité social et économique.");
      L.push("");
      L.push("La part de femmes et d'hommes inscrits sur la liste électorale de ce collège,");
      L.push("telle qu'elle a été portée à la connaissance des salariés le [date] en");
      L.push("application de l'article L. 2314-31, est de [ ] % de femmes et [ ] % d'hommes.");
      L.push("");
      L.push("Appliquée aux [nombre] sièges à pourvoir, et après l'arrondi prescrit par");
      L.push("l'article L. 2314-30, cette part conduit à une liste comportant [ ] femmes et");
      L.push("[ ] hommes. La liste déposée comporte [ ] femmes et [ ] hommes.");
      L.push("");
      L.push("[Le cas échéant : la liste déposée ne respecte pas non plus l'alternance");
      L.push("prescrite par la seconde phrase du premier alinéa de l'article L. 2314-30, aux");
      L.push("positions [ ].]");
      L.push("");
      L.push("Je vous invite en conséquence à la rectifier avant le scrutin, prévu le");
      L.push("[DATE], et au plus tard le [DATE LIMITE].");
      L.push("");
      L.push("Je vous rappelle que la constatation par le juge, après l'élection, du");
      L.push("non-respect de ces prescriptions entraîne l'annulation de l'élection des élus");
      L.push("concernés dans les conditions de l'article L. 2314-32 du code du travail.");
      L.push("");
      salutation(L, ctx);
      L.push("Pièces jointes : liste déposée · proportion de femmes et d'hommes du collège");
      L.push("communiquée le [date] · liste électorale du collège");

      return pied(L, ["L. 2314-10", "L. 2314-30", "L. 2314-31", "L. 2314-32"]);
    },
  });

  DP.ajouter("CSE-CTL-ELE-06", {
    nom: "L'accord ou la décision ouvrant le vote électronique, et le cahier des charges",
    detail: "L'accord d'entreprise ou de groupe d'abord, la décision de l'employeur à " +
            "défaut seulement, et le cahier des charges à tenir à la disposition des salariés.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var L = [];

      L = L.concat(entete(ctx, "Vote électronique aux élections du comité",
        "article L. 2314-26 du code du travail et articles R. 2314-5 et R. 2314-6"));
      usage(L);

      L.push("L'ORDRE DES SOURCES");
      L.push("");
      L.push("L'élection a lieu au scrutin secret sous enveloppe ; elle « peut également");
      L.push("avoir lieu par vote électronique, selon les modalités fixées par un décret en");
      L.push("Conseil d'État pris après avis de la Commission nationale de l'informatique");
      L.push("et des libertés, SI UN ACCORD D'ENTREPRISE OU, À DÉFAUT, L'EMPLOYEUR le");
      L.push("décide » (L. 2314-26).");
      L.push("");
      L.push("Le décret précise : « la possibilité de recourir à un vote électronique est");
      L.push("ouverte par un accord d'entreprise ou par un accord de groupe. À défaut");
      L.push("d'accord, l'employeur peut décider de ce recours, qui vaut aussi, le cas");
      L.push("échéant, pour les élections partielles se déroulant en cours de mandat »");
      L.push("(R. 2314-5).");
      L.push("");
      L.push("La décision unilatérale ne se conçoit donc qu'après une négociation");
      L.push("réellement engagée. Datez-la : c'est ce qui la distingue d'un passage en");
      L.push("force.");
      L.push("");
      L.push("Situation portée au dossier : vote électronique " +
        (String(f.voteElectronique) === "oui" ? "utilisé." :
         String(f.voteElectronique) === "non" ? "non utilisé." : "[à renseigner]."));
      L.push("");

      titre(L, "1 — Accord ouvrant le recours au vote électronique");
      L.push("ACCORD [D'ENTREPRISE / DE GROUPE] RELATIF AU RECOURS AU VOTE ÉLECTRONIQUE");
      L.push("POUR L'ÉLECTION DES MEMBRES DE LA DÉLÉGATION DU PERSONNEL DU COMITÉ SOCIAL");
      L.push("ET ÉCONOMIQUE");
      L.push("");
      L.push("Entre " + nom(ctx) + ", représentée par " + signataire(ctx) + ",");
      L.push("et les organisations syndicales représentatives : [ ]");
      L.push("");
      L.push("ARTICLE 1 — OUVERTURE DU RECOURS");
      L.push("");
      L.push("Le recours au vote électronique est ouvert pour l'élection des membres de la");
      L.push("délégation du personnel du comité social et économique, en application de");
      L.push("l'article L. 2314-26 du code du travail et de l'article R. 2314-5.");
      L.push("");
      L.push("Le vote électronique est organisé [sur le lieu de travail / à distance / sur");
      L.push("le lieu de travail et à distance] (R. 2314-5).");
      L.push("");
      L.push("ARTICLE 2 — MAINTIEN OU EXCLUSION DU VOTE SOUS ENVELOPPE");
      L.push("");
      L.push("[CHOISIR, et l'écrire : la mise en place du vote électronique n'interdit pas");
      L.push("le vote à bulletin secret sous enveloppe si l'accord ou l'employeur n'exclut");
      L.push("pas cette modalité (R. 2314-5, dernier alinéa). Un accord muet laisse donc la");
      L.push("double modalité ouverte — ce qui peut être voulu, ou pas.]");
      L.push("");
      L.push("   Le vote à bulletin secret sous enveloppe est [maintenu / exclu].");
      L.push("");
      L.push("ARTICLE 3 — CAHIER DES CHARGES");
      L.push("");
      L.push("Un cahier des charges respectant les dispositions des articles R. 2314-6 et");
      L.push("suivants est établi dans le cadre du présent accord (R. 2314-5). Il est annexé");
      L.push("au présent accord.");
      L.push("");
      L.push("ARTICLE 4 — ÉLECTIONS PARTIELLES");
      L.push("");
      L.push("[Le cas échéant : le présent accord vaut également pour les élections");
      L.push("partielles se déroulant en cours de mandat (R. 2314-5).]");
      L.push("");
      L.push("ARTICLE 5 — DURÉE, RÉVISION, DÉPÔT");
      L.push("");
      L.push("[Durée, entrée en vigueur, révision, dépôt et publicité.]");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le [DATE].");
      L.push("");

      titre(L, "2 — Variante de repli : décision de l'employeur");
      L.push("À N'EMPLOYER QU'À DÉFAUT D'ACCORD. Écrivez la négociation qui a précédé :");
      L.push("c'est elle qui fonde le repli.");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("DÉCISION DE RECOURIR AU VOTE ÉLECTRONIQUE");
      L.push("");
      L.push(lieu(ctx) + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("Vu l'article L. 2314-26 du code du travail et l'article R. 2314-5 ;");
      L.push("");
      L.push("Constatant qu'aucun accord d'entreprise ni accord de groupe n'a pu être");
      L.push("conclu sur le recours au vote électronique, la négociation ayant été engagée");
      L.push("le [date] et [close sans accord / demeurée sans réponse] le [date] ;");
      L.push("");
      L.push("DÉCIDE");
      L.push("");
      L.push("Article 1 — L'élection des membres de la délégation du personnel du comité");
      L.push("social et économique aura lieu par vote électronique, [sur le lieu de travail");
      L.push("/ à distance / les deux].");
      L.push("");
      L.push("Article 2 — Le vote à bulletin secret sous enveloppe est [maintenu / exclu].");
      L.push("");
      L.push("Article 3 — Le cahier des charges prévu à l'article R. 2314-5 est établi par");
      L.push("l'employeur et annexé à la présente décision.");
      L.push("");
      L.push("Article 4 — [Le cas échéant : la présente décision vaut également pour les");
      L.push("élections partielles se déroulant en cours de mandat.]");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      titre(L, "3 — Cahier des charges");
      L.push("Établi dans le cadre de l'accord ou, à défaut, par l'employeur (R. 2314-5).");
      L.push("Il est TENU À LA DISPOSITION DES SALARIÉS SUR LE LIEU DE TRAVAIL et MIS SUR");
      L.push("L'INTRANET de l'entreprise lorsqu'il en existe un (R. 2314-5).");
      L.push("");
      L.push("CAHIER DES CHARGES DU SYSTÈME DE VOTE ÉLECTRONIQUE");
      L.push(nom(ctx) + " — élections du [DATE]");
      L.push("");
      L.push("1. OBJET ET PÉRIMÈTRE");
      L.push("   Élection des membres [titulaires et suppléants] de la délégation du");
      L.push("   personnel du comité social et économique, collèges [ ], premier et second");
      L.push("   tours. Nombre d'électeurs attendus : [ ].");
      L.push("");
      L.push("2. PRESTATAIRE");
      L.push("   La conception et la mise en place du système peuvent être confiées à un");
      L.push("   prestataire choisi par l'employeur sur la base du présent cahier des");
      L.push("   charges (R. 2314-6).");
      L.push("   Prestataire retenu : [ ] · [coordonnées] · [date du contrat]");
      L.push("");
      L.push("3. EXIGENCES QUE LE TEXTE IMPOSE AU SYSTÈME (R. 2314-6)");
      L.push("   Le système retenu assure :");
      L.push("     · la CONFIDENTIALITÉ DES DONNÉES TRANSMISES, notamment de celles des");
      L.push("       fichiers constitués pour établir les listes électorales des collèges");
      L.push("       électoraux ;");
      L.push("     · la SÉCURITÉ DE L'ADRESSAGE DES MOYENS D'AUTHENTIFICATION ;");
      L.push("     · la sécurité de l'ÉMARGEMENT ;");
      L.push("     · la sécurité de l'ENREGISTREMENT des votes ;");
      L.push("     · la sécurité du DÉPOUILLEMENT.");
      L.push("   Pour chacune, décrire la mesure retenue et la preuve qui l'établit :");
      L.push("     [ ]");
      L.push("");
      L.push("4. DÉROULEMENT");
      L.push("   Ouverture et clôture du scrutin : [dates et heures]");
      L.push("   Modalités d'authentification des électeurs et d'acheminement des moyens");
      L.push("   d'authentification : [ ]");
      L.push("   Assistance aux électeurs : [ ]");
      L.push("   Liste d'émargement et procès-verbal : [ ]");
      L.push("   Scellement, conservation et destruction des fichiers : [ ]");
      L.push("");
      L.push("5. MISE À DISPOSITION");
      L.push("   Le présent cahier des charges est tenu à la disposition des salariés sur le");
      L.push("   lieu de travail à compter du [DATE], à [lieu], et mis sur l'intranet de");
      L.push("   l'entreprise [le cas échéant] à compter du [DATE].");
      L.push("");
      L.push("RÉSERVE — les articles R. 2314-7 et suivants, qui complètent les exigences du");
      L.push("cahier des charges, ne sont pas repris ici : le dépôt n'en a capté que les");
      L.push("articles R. 2314-5 et R. 2314-6. Faites vérifier le cahier des charges au");
      L.push("regard de l'ensemble du paragraphe avant de le publier, ainsi qu'au regard des");
      L.push("obligations relatives aux traitements de données personnelles, que");
      L.push("l'application ne lit pas.");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le [DATE].");
      L.push("");
      L.push(signataire(ctx));

      return pied(L, ["L. 2314-26", "R. 2314-5", "R. 2314-6"]);
    },
  });

  DP.ajouter("CSE-CTL-ELE-07", {
    nom: "L'information du personnel sur les élections partielles, et le test des deux cas",
    detail: "Le test des deux cas de L. 2314-10, l'exception des six mois, et la note " +
            "d'information au personnel avec son calendrier.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var init = nb(f.titulairesInitiaux), rest = nb(f.titulairesRestants);
      var moisAvant = nb(f.moisAvantTerme);
      var L = [];

      L = L.concat(entete(ctx, "Élections partielles",
        "article L. 2314-10 du code du travail"));
      usage(L);

      L.push("LE TEST, EN TROIS TEMPS");
      L.push("");
      L.push("« Des élections partielles sont organisées à l'initiative de l'employeur si un");
      L.push("collège électoral n'est plus représenté OU si le nombre des membres titulaires");
      L.push("de la délégation du personnel du comité social et économique est réduit de");
      L.push("moitié ou plus, SAUF si ces événements interviennent moins de six mois avant");
      L.push("le terme du mandat des membres de la délégation du personnel » (L. 2314-10).");
      L.push("");
      L.push("  1. Un collège électoral n'est-il plus représenté ?");
      L.push("     Réponse au dossier : " +
        (String(f.collegeVide) === "oui" ? "oui." :
         String(f.collegeVide) === "non" ? "non." : "[à renseigner]."));
      L.push("");
      L.push("  2. Le nombre de titulaires est-il réduit de moitié ou plus ?");
      if (init != null && rest != null) {
        L.push("     Titulaires élus à l'origine : " + init + " · encore en fonction : " + rest);
        L.push("     Réduction : " + (init - rest) + " sur " + init + ", soit " +
               (Math.round((init - rest) / init * 1000) / 10) + " %.");
        L.push("     Seuil atteint (moitié ou plus) : " + ((init - rest) >= init / 2 ? "OUI." : "non."));
      } else {
        L.push("     [Nombre de titulaires élus à l'origine et nombre encore en fonction : à");
        L.push("      reporter sur le procès-verbal des élections et le registre des départs.]");
      }
      L.push("");
      L.push("  3. L'exception des six mois — l'événement est-il intervenu moins de six mois");
      L.push("     avant le terme du mandat ?");
      if (moisAvant != null) {
        L.push("     Mois restant à courir jusqu'au terme des mandats : " + moisAvant + ".");
        L.push("     " + (moisAvant < 6
          ? "Moins de six mois : l'exception joue, et les élections partielles ne sont pas dues."
          : "Six mois ou plus : l'exception ne joue pas."));
        L.push("     [Attention : le texte compare la DATE DE L'ÉVÉNEMENT au terme du mandat,");
        L.push("      non la date d'aujourd'hui. Si l'événement est ancien, reprenez sa date.]");
      } else {
        L.push("     [Date de l'événement : … · terme des mandats : … · écart : … ]");
      }
      L.push("");
      L.push("SI LES ÉLECTIONS SONT DUES — elles se déroulent dans les conditions fixées à");
      L.push("l'article L. 2314-29, POUR POURVOIR TOUS LES SIÈGES VACANTS DANS LES COLLÈGES");
      L.push("INTÉRESSÉS, sur la base des dispositions en vigueur lors de l'élection");
      L.push("précédente. Les candidats sont élus pour la durée du mandat restant à courir");
      L.push("(L. 2314-10).");
      L.push("");
      L.push("Trois conséquences pratiques :");
      L.push("  · on ne pourvoit pas le seul siège dont la vacance a déclenché l'obligation :");
      L.push("    TOUS les sièges vacants des collèges intéressés ;");
      L.push("  · on ne renégocie pas le protocole : ce sont les dispositions en vigueur lors");
      L.push("    de l'élection précédente qui s'appliquent ;");
      L.push("  · le terme reste commun : celui du mandat en cours.");
      L.push("");

      titre(L, "Note d'information du personnel");
      L.push("Le processus est un processus électoral entier : l'information du personnel");
      L.push("précède le scrutin, et le premier tour se tient au plus tard le");
      L.push("quatre-vingt-dixième jour suivant sa diffusion (L. 2314-4).");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("NOTE D'INFORMATION AU PERSONNEL");
      L.push("Organisation d'élections partielles au comité social et économique");
      L.push("");
      L.push(lieu(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("[Exposer le fait générateur : à la suite de [départs, démissions, ruptures de");
      L.push("contrat…] intervenus le [date], le collège [ ] n'est plus représenté / le");
      L.push("nombre des membres titulaires de la délégation du personnel est réduit de");
      L.push("moitié ou plus, passant de [ ] à [ ].]");
      L.push("");
      L.push("En application de l'article L. 2314-10 du code du travail, des élections");
      L.push("partielles sont organisées à l'initiative de l'employeur pour pourvoir tous");
      L.push("les sièges vacants dans les collèges intéressés.");
      L.push("");
      L.push("Collèges intéressés et sièges à pourvoir :");
      L.push("   Collège [ ] — titulaires : [ ] · suppléants : [ ]");
      L.push("   Collège [ ] — titulaires : [ ] · suppléants : [ ]");
      L.push("");
      L.push("DATE ENVISAGÉE POUR LE PREMIER TOUR : [DATE]");
      L.push("Ce premier tour se tiendra au plus tard le " + leJour(dans(d0, 90)) + ",");
      L.push("quatre-vingt-dixième jour suivant la diffusion de la présente note (L. 2314-4).");
      L.push("");
      L.push("Le scrutin se déroule dans les conditions fixées à l'article L. 2314-29, sur");
      L.push("la base des dispositions en vigueur lors de l'élection précédente. Les");
      L.push("candidats seront élus pour la durée du mandat restant à courir, soit jusqu'au");
      L.push("[TERME DES MANDATS EN COURS].");
      L.push("");
      L.push("Diffusion : [moyen conférant date certaine].");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("À FAIRE EN MÊME TEMPS — inviter les organisations syndicales dans les");
      L.push("conditions de l'article L. 2314-5 : information par tout moyen pour les");
      L.push("organisations du premier alinéa, courrier pour celles du deuxième, et");
      L.push("réception au plus tard quinze jours avant la première réunion de négociation.");
      L.push("");
      L.push("VARIANTE — CONSTAT QUE LES ÉLECTIONS PARTIELLES NE SONT PAS DUES");
      L.push("");
      L.push("Si l'exception des six mois joue, écrivez-le plutôt que de laisser la");
      L.push("question ouverte :");
      L.push("");
      L.push("   « Les événements ayant [privé le collège [ ] de représentation / réduit de");
      L.push("   moitié ou plus le nombre des membres titulaires] sont intervenus le [date],");
      L.push("   soit moins de six mois avant le terme du mandat des membres de la");
      L.push("   délégation du personnel, fixé au [date]. En application du premier alinéa de");
      L.push("   l'article L. 2314-10 du code du travail, il n'y a pas lieu d'organiser des");
      L.push("   élections partielles. »");
      L.push("");
      L.push("   Fait à " + lieu(ctx) + ", le " + leJour(d0) + " — " + signataire(ctx));

      return pied(L, ["L. 2314-4", "L. 2314-5", "L. 2314-10", "L. 2314-29", "L. 2314-33"]);
    },
  });

  /* ══════════════════════════════════════════════════════════════════════════
     CONSULTATIONS ET RÉUNIONS
     ══════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CSE-CTL-CON-01", {
    nom: "Les trois consultations récurrentes : ordres du jour, convocations et bordereaux",
    detail: "L'ordre des sources, l'ordre du jour et la convocation des trois jours, la " +
            "note d'information par consultation et la réponse motivée.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var faites = liste(f.consultationsRecurrentes).map(function (x) {
        return typeof x === "string" ? x : (x && x.objet) || String(x);
      });
      var TROIS = ["orientations stratégiques", "situation économique et financière",
                   "politique sociale, conditions de travail et emploi"];
      var L = [];

      L = L.concat(entete(ctx, "Consultations récurrentes du comité social et économique",
        "articles L. 2312-17, L. 2312-19 et L. 2312-22 du code du travail"));
      usage(L);

      L.push("I — L'ORDRE DES SOURCES, À DIRE AVANT TOUT");
      L.push("");
      L.push("Un accord d'entreprise, conclu dans les conditions prévues au premier alinéa");
      L.push("de l'article L. 2232-12 ou, en l'absence de délégué syndical, un accord entre");
      L.push("l'employeur et le comité social et économique adopté à la majorité des");
      L.push("membres titulaires de la délégation du personnel, PEUT définir (L. 2312-19) :");
      L.push("   1° le contenu, la périodicité et les modalités des consultations");
      L.push("      récurrentes ainsi que la liste et le contenu des informations");
      L.push("      nécessaires à ces consultations ;");
      L.push("   2° le nombre de réunions annuelles du comité prévues à l'article L. 2315-27,");
      L.push("      qui ne peut être inférieur à six ;");
      L.push("   3° les niveaux auxquels les consultations sont conduites et, le cas échéant,");
      L.push("      leur articulation ;");
      L.push("   4° les délais dans lesquels les avis du comité sont rendus.");
      L.push("Il peut aussi prévoir un AVIS UNIQUE portant sur tout ou partie des thèmes.");
      L.push("La périodicité qu'il prévoit NE PEUT ÊTRE SUPÉRIEURE À TROIS ANS (L. 2312-19).");
      L.push("");
      L.push("EN L'ABSENCE de cet accord — et alors seulement —, le comité est consulté");
      L.push("CHAQUE ANNÉE sur les trois thèmes (L. 2312-22).");
      L.push("");
      L.push("Situation portée au dossier : " +
        (String(f.accordPeriodicite) === "oui"
          ? "un accord fixe la périodicité des consultations. Reportez ci-dessous sa référence, la périodicité qu'il retient et les niveaux qu'il fixe : c'est lui qui commande, non le régime supplétif."
          : String(f.accordPeriodicite) === "non"
            ? "aucun accord ne fixe la périodicité. Le régime supplétif annuel de L. 2312-22 s'applique."
            : "[l'existence d'un accord n'est pas renseignée — cherchez-le avant d'appliquer le supplétif]."));
      L.push("");
      L.push("   Accord applicable : [référence et date] · périodicité retenue : [ ] ·");
      L.push("   niveaux : [ ] · délais d'avis : [ ]");
      L.push("");

      L.push("II — CE QUI RESTE À CONDUIRE");
      L.push("");
      TROIS.forEach(function (t) {
        var fait = faites.some(function (x) { return String(x).toLowerCase().indexOf(t.split(",")[0].toLowerCase()) >= 0; });
        L.push("   " + (fait ? "[conduite]" : "[À CONDUIRE]") + "  " +
               t.charAt(0).toUpperCase() + t.slice(1));
      });
      L.push("");
      L.push("Ces trois thèmes sont ceux de l'article L. 2312-17. Au cours de ces");
      L.push("consultations, le comité est INFORMÉ DES CONSÉQUENCES ENVIRONNEMENTALES de");
      L.push("l'activité de l'entreprise (L. 2312-17, L. 2312-22).");
      L.push("");
      L.push("Au cours de l'une au moins de ces consultations, au choix de l'employeur, le");
      L.push("comité est consulté sur les informations en matière de durabilité prévues aux");
      L.push("articles L. 232-6-3 et L. 233-28-4 du code de commerce et sur les moyens de");
      L.push("les obtenir et de les vérifier, dès lors que l'entreprise remplit l'une des");
      L.push("conditions que pose l'article L. 2312-17.");
      L.push("   [Votre entreprise est-elle soumise à ces obligations du code de commerce ?");
      L.push("    L'application ne lit pas le code de commerce : faites vérifier.]");
      L.push("   Consultation retenue pour ce point : [ ]");
      L.push("");
      L.push("NIVEAUX, à défaut d'accord (L. 2312-22) — les consultations sur les");
      L.push("orientations stratégiques et sur la situation économique et financière sont");
      L.push("conduites AU NIVEAU DE L'ENTREPRISE, sauf si l'employeur en décide autrement");
      L.push("et sous réserve de l'accord de groupe prévu à l'article L. 2312-20. La");
      L.push("consultation sur la politique sociale est conduite À LA FOIS au niveau central");
      L.push("et au niveau des établissements lorsque sont prévues des mesures d'adaptation");
      L.push("spécifiques à ces établissements.");
      L.push("   Mesures d'adaptation spécifiques prévues : " +
        (String(f.mesuresAdaptation) === "oui" ? "OUI — la double consultation s'impose." :
         String(f.mesuresAdaptation) === "non" ? "non." : "[à renseigner]."));
      L.push("");

      titre(L, "1 — Ordre du jour et convocation");
      L.push("L'ordre du jour de chaque réunion est ÉTABLI PAR LE PRÉSIDENT ET LE");
      L.push("SECRÉTAIRE (L. 2315-29). Les consultations rendues obligatoires par une");
      L.push("disposition législative ou réglementaire ou par un accord collectif y sont");
      L.push("inscrites DE PLEIN DROIT par le président ou le secrétaire — ce qui signifie");
      L.push("que le désaccord du secrétaire ne peut pas les tenir hors de l'ordre du jour.");
      L.push("");
      L.push("Il est communiqué par le président aux membres du comité, à l'agent de");
      L.push("contrôle de l'inspection du travail et à l'agent des services de prévention");
      L.push("des organismes de sécurité sociale TROIS JOURS AU MOINS avant la réunion");
      L.push("(L. 2315-30).");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("ORDRE DU JOUR ET CONVOCATION");
      L.push("Réunion du comité social et économique du [DATE DE LA RÉUNION]");
      L.push("");
      L.push(lieu(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Établi conjointement par le président et le secrétaire du comité, le [DATE].");
      L.push("");
      L.push("Destinataires :");
      L.push("   · les membres du comité social et économique (titulaires et suppléants) ;");
      L.push("   · l'agent de contrôle de l'inspection du travail ;");
      L.push("   · l'agent des services de prévention des organismes de sécurité sociale.");
      L.push("   [Ces deux derniers sont destinataires de plein droit : L. 2315-30.]");
      L.push("");
      L.push("Date, heure et lieu : le [DATE] à [heure], à [lieu].");
      L.push("Communication du présent ordre du jour : le [DATE], soit au moins trois jours");
      L.push("avant la réunion (L. 2315-30).");
      L.push("");
      L.push("ORDRE DU JOUR");
      L.push("");
      L.push("  1. Approbation du procès-verbal de la réunion du [date].");
      L.push("");
      L.push("  2. CONSULTATION RÉCURRENTE — [thème retenu parmi les trois de L. 2312-17].");
      L.push("     Inscrite de plein droit (L. 2315-29).");
      L.push("     Informations remises ou mises à disposition le [DATE DE REMISE] : voir le");
      L.push("     bordereau annexé. Le délai de consultation court de cette date");
      L.push("     (R. 2312-5).");
      L.push("     Conséquences environnementales de l'activité de l'entreprise : point");
      L.push("     traité au titre de L. 2312-17.");
      L.push("     [Le cas échéant : informations en matière de durabilité.]");
      L.push("     Avis attendu au plus tard le [DATE].");
      L.push("");
      L.push("  3. [Autres points.]");
      L.push("");
      L.push("  4. Questions jointes à une demande de réunion émanant de la majorité des");
      L.push("     membres, le cas échéant (L. 2315-31).");
      L.push("");
      L.push("Le président                              Le secrétaire du comité");
      L.push(signataire(ctx) + "        [Nom]");
      L.push("");

      titre(L, "2 — Bordereau de remise des informations");
      L.push("Il fait courir le délai. Sans lui, la date de départ se discute — et l'avis");
      L.push("rendu hors délai avec elle.");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("BORDEREAU DE REMISE DES INFORMATIONS AU COMITÉ SOCIAL ET ÉCONOMIQUE");
      L.push("Consultation sur [thème]");
      L.push("");
      L.push("Date de remise ou d'information de la mise à disposition : [DATE]");
      L.push("Mode : [remise contre émargement / envoi avec accusé de réception /");
      L.push("information de la mise à disposition dans la base de données économiques,");
      L.push("sociales et environnementales]");
      L.push("");
      L.push("Pièces remises ou mises à disposition :");
      L.push("   1. [ ]");
      L.push("   2. [ ]");
      L.push("   3. [ ]");
      L.push("");
      L.push("La base de données économiques, sociales et environnementales rassemble");
      L.push("l'ensemble des informations nécessaires aux consultations et informations");
      L.push("récurrentes ; la mise à disposition actualisée des éléments transmis de");
      L.push("manière récurrente VAUT COMMUNICATION des rapports et informations au comité");
      L.push("(L. 2312-18). Le délai de consultation court de la communication ou de");
      L.push("l'information de leur mise à disposition (R. 2312-5).");
      L.push("");
      L.push("Reçu par : [nom et qualité] · le [date] · signature : ______________");
      L.push("");

      titre(L, "3 — Réponse motivée aux observations du comité");
      L.push("Le comité « dispose à cette fin d'un délai d'examen suffisant et");
      L.push("d'informations précises et écrites transmises ou mises à disposition par");
      L.push("l'employeur, ET DE LA RÉPONSE MOTIVÉE DE L'EMPLOYEUR À SES PROPRES");
      L.push("OBSERVATIONS » (L. 2312-15). La réponse motivée n'est pas une politesse :");
      L.push("elle fait partie de ce dont le comité doit disposer POUR rendre son avis.");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("RÉPONSE MOTIVÉE AUX OBSERVATIONS DU COMITÉ");
      L.push("Consultation sur [thème] · observations formulées le [date]");
      L.push("");
      L.push(lieu(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Observation n° 1 — [reprendre l'observation telle qu'elle a été formulée]");
      L.push("Réponse — [motivée : ce qui est retenu, ce qui ne l'est pas, et pourquoi]");
      L.push("");
      L.push("Observation n° 2 — [ ]");
      L.push("Réponse — [ ]");
      L.push("");
      L.push("Cette réponse est adressée au comité avant qu'il ne rende son avis.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("APRÈS L'AVIS — l'employeur rend compte, EN LA MOTIVANT, de la suite donnée aux");
      L.push("avis et vœux du comité (L. 2312-15, dernier alinéa). C'est un second écrit,");
      L.push("distinct du premier, et il vient après.");
      L.push("");
      L.push("POUR LA CONSULTATION SUR LES ORIENTATIONS STRATÉGIQUES — l'avis du comité est");
      L.push("transmis à l'organe chargé de l'administration ou de la surveillance de");
      L.push("l'entreprise, qui formule une RÉPONSE ARGUMENTÉE ; le comité en reçoit");
      L.push("communication et peut y répondre (L. 2312-24). Prévoyez ce circuit : il");
      L.push("n'appartient pas à l'employeur seul.");

      return pied(L, ["L. 2232-12", "L. 2312-15", "L. 2312-17", "L. 2312-18", "L. 2312-19",
                      "L. 2312-20", "L. 2312-22", "L. 2312-24", "L. 2315-27", "L. 2315-29",
                      "L. 2315-30", "L. 2315-31", "R. 2312-5", "R. 2312-7"]);
    },
  });

  DP.ajouter("CSE-CTL-CON-02", {
    nom: "Le bordereau de remise daté, et le calcul du délai de consultation",
    detail: "La date de remise qui fait courir le délai, le délai applicable — un, deux " +
            "ou trois mois — calculé, et la règle des sept jours entre établissements et central.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var c = objet(f.consultation);
      var dRemise = dateDe(c.dateRemiseInformations);
      var dAvis = dateDe(c.dateAvis);
      var expertise = c.expertise === true || c.expert === true ||
                      (f.expertise && Object.keys(objet(f.expertise)).length > 0);
      var L = [];

      L = L.concat(entete(ctx, "Remise des informations et délai de consultation",
        "articles L. 2312-15 et L. 2312-16 du code du travail, articles R. 2312-5 et R. 2312-6"));
      usage(L);

      L.push("D'OÙ PART LE DÉLAI");
      L.push("");
      L.push("« Pour l'ensemble des consultations mentionnées au présent code pour");
      L.push("lesquelles la loi n'a pas fixé de délai spécifique, le délai de consultation");
      L.push("du comité social et économique court à compter de la communication par");
      L.push("l'employeur des informations prévues par le code du travail pour la");
      L.push("consultation ou de l'information par l'employeur de leur mise à disposition");
      L.push("dans la base de données économiques, sociales et environnementales »");
      L.push("(R. 2312-5).");
      L.push("");
      L.push("Ni la convocation, ni l'ordre du jour, ni la réunion ne font courir le délai :");
      L.push("la remise des informations, et elle seule.");
      L.push("");
      L.push("QUEL DÉLAI — L'ORDRE DES SOURCES");
      L.push("");
      L.push("  1er étage — l'accord de l'article L. 2312-19, 4°, peut fixer les délais dans");
      L.push("     lesquels les avis du comité sont rendus. L'article L. 2312-16 vise");
      L.push("     également, en l'absence de délégué syndical, un accord entre l'employeur");
      L.push("     et le comité adopté à la majorité des membres titulaires.");
      L.push("");
      L.push("  2e étage — À DÉFAUT D'ACCORD, R. 2312-6 : le comité est réputé avoir été");
      L.push("     consulté et avoir rendu un AVIS NÉGATIF à l'expiration d'un délai");
      L.push("       · d'UN MOIS à compter de la date prévue à R. 2312-5 ;");
      L.push("       · de DEUX MOIS en cas d'intervention d'un expert ;");
      L.push("       · de TROIS MOIS en cas d'intervention d'une ou plusieurs expertises");
      L.push("         dans le cadre d'une consultation se déroulant à la fois au niveau du");
      L.push("         comité central et d'un ou plusieurs comités d'établissement.");
      L.push("");
      L.push("À l'expiration de ces délais, le comité est RÉPUTÉ avoir été consulté et avoir");
      L.push("rendu un avis négatif (L. 2312-16). Ce n'est pas une sanction : c'est un");
      L.push("effet, et il joue même si personne ne l'invoque.");
      L.push("");

      L.push("VOTRE DÉCOMPTE");
      L.push("");
      L.push("  Accord fixant les délais : " +
        (String(f.accordPeriodicite) === "oui"
          ? "votre dossier signale un accord sur la périodicité et le nombre de réunions. Vérifiez s'il fixe AUSSI les délais d'avis (L. 2312-19, 4°) : si oui, ce sont les siens qui s'appliquent, et le décompte ci-dessous ne vaut pas."
          : "[à vérifier avant d'appliquer le supplétif]"));
      L.push("");
      if (dRemise) {
        var m1 = new Date(dRemise.getTime()); m1.setMonth(m1.getMonth() + 1);
        var m2 = new Date(dRemise.getTime()); m2.setMonth(m2.getMonth() + 2);
        var m3 = new Date(dRemise.getTime()); m3.setMonth(m3.getMonth() + 3);
        L.push("  Remise des informations ......................... " + leJour(dRemise));
        L.push("  Terme à un mois (cas ordinaire) ................ " + leJour(m1));
        L.push("  Terme à deux mois (intervention d'un expert) ... " + leJour(m2));
        L.push("  Terme à trois mois (expertises, central et");
        L.push("     établissements) ............................. " + leJour(m3));
        L.push("");
        if (dAvis) {
          L.push("  Avis rendu ..................................... " + leJour(dAvis));
          var ok1 = dAvis <= m1, ok2 = dAvis <= m2;
          L.push("  Dans le délai d'un mois : " + (ok1 ? "oui." : "NON."));
          L.push("  Dans le délai de deux mois : " + (ok2 ? "oui." : "NON."));
          if (!ok1) {
            L.push("");
            L.push("  Si aucun expert n'est intervenu et qu'aucun accord ne fixe un délai plus");
            L.push("  long, le comité était RÉPUTÉ avoir rendu un avis négatif le " + leJour(m1) + ".");
            L.push("  Un avis recueilli après cette date ne fait pas disparaître l'avis réputé");
            L.push("  négatif : il s'y ajoute. Faites établir laquelle des deux situations est");
            L.push("  la vôtre, et tirez-en les conséquences par écrit.");
          }
        } else {
          L.push("  Aucune date d'avis n'est portée au dossier.");
        }
        if (expertise) {
          L.push("");
          L.push("  Votre dossier fait état d'une expertise : le délai est alors de deux mois,");
          L.push("  soit jusqu'au " + leJour(m2) + " ; de trois mois, soit jusqu'au " +
                 leJour(m3) + ", si la consultation se déroule à la fois au niveau du comité");
          L.push("  central et d'un ou plusieurs comités d'établissement (R. 2312-6, I).");
        }
      } else {
        L.push("  [Aucune date de remise n'est portée au dossier. Sans elle, aucun terme ne");
        L.push("   peut être calculé : c'est la première chose à établir, et elle se prouve");
        L.push("   par le bordereau ci-dessous.]");
      }
      L.push("");
      L.push("CENTRAL ET ÉTABLISSEMENTS — lorsqu'il y a lieu de consulter à la fois le");
      L.push("comité central et un ou plusieurs comités d'établissement en application du");
      L.push("second alinéa de l'article L. 2316-22, les délais ci-dessus s'appliquent AU");
      L.push("COMITÉ CENTRAL. L'avis de chaque comité d'établissement est rendu et transmis");
      L.push("au comité central AU PLUS TARD SEPT JOURS avant la date à laquelle celui-ci");
      L.push("est réputé avoir rendu un avis négatif ; à défaut, l'avis du comité");
      L.push("d'établissement est réputé négatif (R. 2312-6, II).");
      if (dRemise) {
        var mm1 = new Date(dRemise.getTime()); mm1.setMonth(mm1.getMonth() + 1);
        L.push("   Sur la base d'un délai d'un mois : les comités d'établissement doivent");
        L.push("   avoir rendu et transmis leur avis au plus tard le " + leJour(dans(mm1, -7)) + ".");
      }
      L.push("");

      titre(L, "Bordereau de remise des informations");
      L.push(nom(ctx));
      L.push("");
      L.push("BORDEREAU DE REMISE DES INFORMATIONS AU COMITÉ SOCIAL ET ÉCONOMIQUE");
      L.push("");
      L.push("Consultation : [objet]");
      L.push("Instance : [comité social et économique / comité central / comité");
      L.push("d'établissement de …]");
      L.push("");
      L.push("DATE DE REMISE OU D'INFORMATION DE LA MISE À DISPOSITION : " +
        (dRemise ? leJour(dRemise) : "[DATE]"));
      L.push("");
      L.push("C'est de cette date que court le délai de consultation (R. 2312-5).");
      L.push("");
      L.push("Mode retenu :");
      L.push("   [ ] remise en main propre contre émargement");
      L.push("   [ ] envoi avec accusé de réception");
      L.push("   [ ] information de la mise à disposition dans la base de données");
      L.push("       économiques, sociales et environnementales — préciser la date de");
      L.push("       l'information et son support");
      L.push("");
      L.push("Pièces remises ou mises à disposition — les énumérer, il ne suffit pas de dire");
      L.push("qu'elles l'ont été :");
      L.push("   1. [ ]");
      L.push("   2. [ ]");
      L.push("   3. [ ]");
      L.push("");
      L.push("Délai applicable : [un mois / deux mois / trois mois / délai fixé par l'accord");
      L.push("du … ] · terme : [DATE].");
      L.push("");
      L.push("Reçu pour le comité par : [nom et qualité]");
      L.push("Le [date]                                  Signature : ______________");
      L.push("");
      L.push("Pour l'employeur : " + signataire(ctx));
      L.push("");
      L.push("SI LE COMITÉ ESTIME NE PAS DISPOSER D'ÉLÉMENTS SUFFISANTS — il peut saisir le");
      L.push("président du tribunal judiciaire statuant selon la procédure accélérée au");
      L.push("fond pour qu'il ordonne la communication des éléments manquants. Cette saisine");
      L.push("N'A PAS pour effet de prolonger le délai ; toutefois, en cas de difficultés");
      L.push("particulières d'accès aux informations nécessaires à la formulation de l'avis");
      L.push("motivé, le juge PEUT décider la prolongation du délai (L. 2312-15).");

      return pied(L, ["L. 2312-15", "L. 2312-16", "L. 2312-18", "L. 2312-19", "L. 2316-22",
                      "R. 2312-5", "R. 2312-6"]);
    },
  });

  DP.ajouter("CSE-CTL-CON-03", {
    nom: "La note d'information écrite au comité, et la réponse motivée à ses observations",
    detail: "L'écrit précis que le texte exige, sa remise datée, la réponse motivée avant " +
            "l'avis et le compte rendu motivé après.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = [];

      L = L.concat(entete(ctx, "Information du comité et réponse motivée",
        "articles L. 2312-15 et L. 2312-18 du code du travail"));
      usage(L);

      L.push("CE QUE LE COMITÉ DOIT AVOIR, ET QUAND");
      L.push("");
      L.push("« Le comité social et économique émet des avis et des vœux dans l'exercice de");
      L.push("ses attributions consultatives. Il dispose à cette fin d'un DÉLAI D'EXAMEN");
      L.push("SUFFISANT et d'INFORMATIONS PRÉCISES ET ÉCRITES transmises ou mises à");
      L.push("disposition par l'employeur, et de LA RÉPONSE MOTIVÉE DE L'EMPLOYEUR À SES");
      L.push("PROPRES OBSERVATIONS » (L. 2312-15).");
      L.push("");
      L.push("Trois choses, donc, et non une : le temps, l'écrit précis, la réponse motivée.");
      L.push("Une réunion où l'on expose oralement un projet ne satisfait aucune des trois.");
      L.push("");
      L.push("Les éléments d'information transmis de manière récurrente au comité sont mis à");
      L.push("la disposition de ses membres dans la base de données économiques, sociales et");
      L.push("environnementales, et cette MISE À DISPOSITION ACTUALISÉE VAUT COMMUNICATION");
      L.push("des rapports et informations au comité, dans les conditions et limites fixées");
      L.push("par décret en Conseil d'État (L. 2312-18).");
      L.push("");

      titre(L, "1 — Note d'information au comité");
      L.push(nom(ctx));
      L.push("");
      L.push("NOTE D'INFORMATION AU COMITÉ SOCIAL ET ÉCONOMIQUE");
      L.push("Consultation sur [OBJET DE LA CONSULTATION]");
      L.push("");
      L.push(lieu(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Remise ou mise à disposition le [DATE] — c'est de cette date que court le");
      L.push("délai de consultation (R. 2312-5).");
      L.push("");
      L.push("1. OBJET DE LA CONSULTATION");
      L.push("   [Décrire le projet ou la question soumise. Nommer la disposition qui rend");
      L.push("    la consultation obligatoire.]");
      L.push("");
      L.push("2. EXPOSÉ DU PROJET");
      L.push("   [Ce qui est envisagé, dans le détail : contenu, calendrier, périmètre,");
      L.push("    services et postes concernés, chiffres.]");
      L.push("");
      L.push("3. MOTIFS");
      L.push("   [Pourquoi. Les raisons économiques, techniques ou d'organisation, avec les");
      L.push("    éléments qui les établissent.]");
      L.push("");
      L.push("4. CONSÉQUENCES");
      L.push("   [Sur l'emploi, l'organisation du travail, les conditions de travail, la");
      L.push("    santé et la sécurité, la rémunération, la formation. Chiffrées quand elles");
      L.push("    peuvent l'être.]");
      L.push("");
      L.push("5. MESURES ENVISAGÉES");
      L.push("   [Accompagnement, formation, aménagements, calendrier de mise en œuvre.]");
      L.push("");
      L.push("6. PIÈCES JOINTES OU MISES À DISPOSITION");
      L.push("   [Énumérer. Si elles sont dans la base de données économiques, sociales et");
      L.push("    environnementales, dire lesquelles, où, et à quelle date l'information de");
      L.push("    leur mise à disposition a été donnée — L. 2312-18, R. 2312-5.]");
      L.push("");
      L.push("7. DÉLAI ET DATE D'AVIS");
      L.push("   Le comité est invité à rendre son avis au plus tard le [DATE].");
      L.push("   [Fondement du délai retenu : accord du … / R. 2312-6.]");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Reçu pour le comité par [nom et qualité], le [date] — signature : __________");
      L.push("");

      titre(L, "2 — Réponse motivée aux observations (avant l'avis)");
      L.push(nom(ctx));
      L.push("");
      L.push("RÉPONSE MOTIVÉE AUX OBSERVATIONS DU COMITÉ SOCIAL ET ÉCONOMIQUE");
      L.push("Consultation sur [objet] · observations du [date]");
      L.push("");
      L.push(lieu(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Vous avez formulé le [date] les observations reprises ci-dessous. J'y réponds");
      L.push("avant que vous ne rendiez votre avis, comme l'article L. 2312-15 du code du");
      L.push("travail le prévoit.");
      L.push("");
      L.push("   Observation 1 — [texte de l'observation]");
      L.push("   Réponse — [ce qui est retenu, ce qui ne l'est pas, et le motif de chaque");
      L.push("   position. « Nous en prenons note » n'est pas une réponse motivée.]");
      L.push("");
      L.push("   Observation 2 — [ ]");
      L.push("   Réponse — [ ]");
      L.push("");
      L.push("   Observation 3 — [ ]");
      L.push("   Réponse — [ ]");
      L.push("");
      salutation(L, ctx);

      titre(L, "3 — Compte rendu motivé de la suite donnée (après l'avis)");
      L.push("« L'employeur rend compte, en la motivant, de la suite donnée aux avis et");
      L.push("vœux du comité » (L. 2312-15, dernier alinéa). C'est un écrit distinct de la");
      L.push("réponse aux observations, et il vient après l'avis.");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("SUITE DONNÉE À L'AVIS DU COMITÉ SOCIAL ET ÉCONOMIQUE DU [DATE]");
      L.push("");
      L.push(lieu(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Avis rendu : [favorable / défavorable / réputé négatif à l'expiration du");
      L.push("délai — préciser la date et le fondement].");
      L.push("");
      L.push("Vœux formulés : [ ]");
      L.push("");
      L.push("Suite donnée, et sa motivation :");
      L.push("   [Point par point : ce qui a été modifié au projet à la suite de l'avis, ce");
      L.push("    qui ne l'a pas été, et pourquoi.]");
      L.push("");
      L.push("Ce compte rendu est porté au procès-verbal de la réunion du [date].");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("À SAVOIR — le comité a également accès à l'information utile détenue par les");
      L.push("administrations publiques et les organismes agissant pour leur compte,");
      L.push("conformément aux dispositions légales relatives à l'accès aux documents");
      L.push("administratifs (L. 2312-15).");

      return pied(L, ["L. 2312-15", "L. 2312-18", "R. 2312-5", "R. 2312-6"]);
    },
  });

  DP.ajouter("CSE-CTL-CON-05", {
    nom: "Le calendrier annuel des réunions, la convocation type et le rattrapage",
    detail: "L'accord d'abord, le supplétif ensuite, le nombre de réunions dû calculé " +
            "sur votre effectif, le calendrier de l'année et la convocation des trois jours.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var eff = effectifDe(ctx);
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var tenues = nb(f.reunionsTenues);
      var accord = String(f.accordPeriodicite) === "oui";
      var parAccord = nb(f.reunionsAccord);
      var L = [];

      L = L.concat(entete(ctx, "Calendrier annuel des réunions du comité",
        "articles L. 2312-19, L. 2315-27 à L. 2315-31 et L. 2315-34 du code du travail"));
      usage(L);

      L.push("COMBIEN DE RÉUNIONS, ET SUR QUEL FONDEMENT");
      L.push("");
      L.push("  1er étage — l'accord de l'article L. 2312-19 peut fixer le nombre de");
      L.push("     réunions annuelles du comité prévues à l'article L. 2315-27. Ce nombre");
      L.push("     NE PEUT ÊTRE INFÉRIEUR À SIX (L. 2312-19, 2°).");
      L.push("");
      L.push("  2e étage — À DÉFAUT de cet accord (L. 2315-28) : dans les entreprises d'au");
      L.push("     moins TROIS CENTS salariés, le comité se réunit au moins UNE FOIS PAR");
      L.push("     MOIS ; dans les entreprises de moins de trois cents salariés, au moins");
      L.push("     UNE FOIS TOUS LES DEUX MOIS. Le comité peut tenir une seconde réunion à");
      L.push("     la demande de la majorité de ses membres.");
      L.push("");
      L.push("  Dans tous les cas — au moins QUATRE réunions annuelles portent, en tout ou");
      L.push("     partie, sur les attributions du comité en matière de santé, sécurité et");
      L.push("     conditions de travail (L. 2315-27).");
      L.push("");
      var du = null, base = "";
      if (accord && parAccord != null) { du = parAccord; base = "l'accord du [référence], qui fixe " + parAccord + " réunions annuelles (L. 2312-19, 2°)"; }
      else if (!accord && eff != null) {
        du = eff >= 300 ? 12 : 6;
        base = "l'article L. 2315-28, à défaut d'accord — " +
          (eff >= 300 ? "au moins une réunion par mois" : "au moins une réunion tous les deux mois") +
          " pour un effectif de " + eff + " salariés";
      }
      L.push("VOTRE DÉCOMPTE");
      L.push("");
      L.push("  Effectif ....................................... " + (eff == null ? "[à renseigner]" : eff + " salariés"));
      L.push("  Accord fixant le nombre de réunions ............ " +
        (accord ? "oui — " + (parAccord != null ? parAccord + " réunions annuelles" : "[nombre à reporter]")
                : String(f.accordPeriodicite) === "non" ? "non" : "[à vérifier]"));
      if (accord && parAccord != null && parAccord < 6) {
        L.push("  ATTENTION — un accord ne peut pas fixer un nombre de réunions inférieur à");
        L.push("  six (L. 2312-19, 2°). La stipulation qui le ferait ne peut pas s'appliquer.");
      }
      L.push("  Nombre dû ...................................... " +
        (du == null ? "[à établir]" : du + " par an, en application de " + base));
      L.push("  Réunions tenues sur l'année .................... " +
        (tenues == null ? "[à renseigner]" : tenues));
      if (du != null && tenues != null) {
        var manque = du - tenues;
        L.push("  Écart .......................................... " +
          (manque > 0 ? manque + " réunion(s) MANQUANTE(S)" : "aucun"));
        if (manque > 0) {
          L.push("");
          L.push("  Les réunions manquantes se rattrapent avant la clôture de l'année de");
          L.push("  référence. Chacune se convoque avec un ordre du jour communiqué trois");
          L.push("  jours au moins à l'avance (L. 2315-30) : la première peut donc se tenir");
          L.push("  dès le " + leJour(dans(d0, 3)) + " si l'ordre du jour part aujourd'hui.");
        }
      }
      L.push("");
      L.push("  Réunions ayant porté sur la santé et la sécurité : " +
        (nb(f.reunionsSante) == null ? "[à renseigner]" : nb(f.reunionsSante)) +
        " — quatre au moins sont dues (L. 2315-27).");
      L.push("");

      titre(L, "1 — Calendrier annuel des réunions");
      L.push(nom(ctx));
      L.push("");
      L.push("CALENDRIER ANNUEL DES RÉUNIONS DU COMITÉ SOCIAL ET ÉCONOMIQUE");
      L.push("Année [ANNÉE]");
      L.push("");
      L.push("Fondement du nombre de réunions retenu : " + (base || "[accord du … / L. 2315-28]") + ".");
      L.push("");
      L.push("   N° · date · heure · lieu · porte en tout ou partie sur la santé, la");
      L.push("   sécurité et les conditions de travail (L. 2315-27) · consultation");
      L.push("   récurrente inscrite");
      L.push("");
      var n = du || 6;
      for (var i = 1; i <= n; i++)
        L.push("   " + (i < 10 ? " " : "") + i + " · [date] · [heure] · [lieu] · [oui/non] · [ ]");
      L.push("");
      L.push("Quatre au moins des réunions ci-dessus doivent porter, en tout ou partie, sur");
      L.push("les attributions du comité en matière de santé, sécurité et conditions de");
      L.push("travail — plus fréquemment en cas de besoin, notamment dans les branches");
      L.push("d'activité présentant des risques particuliers (L. 2315-27).");
      L.push("");
      L.push("RÉUNIONS SUPPLÉMENTAIRES, de droit (L. 2315-27) — le comité est en outre réuni");
      L.push("à la suite de tout accident ayant entraîné ou ayant pu entraîner des");
      L.push("conséquences graves, en cas d'événement grave lié à l'activité de l'entreprise");
      L.push("ayant porté atteinte ou ayant pu porter atteinte à la santé publique ou à");
      L.push("l'environnement, ou à la demande motivée de deux de ses membres représentants");
      L.push("du personnel sur les sujets relevant de la santé, de la sécurité ou des");
      L.push("conditions de travail.");
      L.push("");
      L.push("SECONDE RÉUNION — le comité peut tenir une seconde réunion à la demande de la");
      L.push("majorité de ses membres (L. 2315-28) ; les questions jointes à la demande de");
      L.push("convocation sont inscrites à l'ordre du jour (L. 2315-31).");
      L.push("");
      L.push("Communiqué aux membres du comité le [date].");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      titre(L, "2 — Convocation et ordre du jour");
      L.push("L'ordre du jour est ÉTABLI PAR LE PRÉSIDENT ET LE SECRÉTAIRE (L. 2315-29),");
      L.push("puis communiqué par le président aux membres du comité, à l'agent de contrôle");
      L.push("de l'inspection du travail et à l'agent des services de prévention des");
      L.push("organismes de sécurité sociale TROIS JOURS AU MOINS avant la réunion");
      L.push("(L. 2315-30).");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("CONVOCATION ET ORDRE DU JOUR");
      L.push("Réunion du comité social et économique du [DATE]");
      L.push("");
      L.push(lieu(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Réunion n° [ ] de l'année [ ] · [date] à [heure] · [lieu]");
      L.push("Ordre du jour communiqué le " + leJour(d0) + ", soit " +
        "au moins trois jours avant la réunion.");
      L.push("");
      L.push("Destinataires : les membres du comité (titulaires et suppléants), l'agent de");
      L.push("contrôle de l'inspection du travail, l'agent des services de prévention des");
      L.push("organismes de sécurité sociale (L. 2315-30).");
      L.push("[Le suppléant assiste aux réunions en l'absence du titulaire (L. 2314-1) : la");
      L.push("convocation lui est adressée pour qu'il puisse le remplacer.]");
      L.push("");
      L.push("ORDRE DU JOUR");
      L.push("   1. Approbation du procès-verbal de la réunion du [date].");
      L.push("   2. [Point.]");
      L.push("   3. [Consultation obligatoire — inscrite de plein droit, L. 2315-29.]");
      L.push("   4. [Le cas échéant : questions jointes à la demande de réunion de la");
      L.push("      majorité des membres, L. 2315-31.]");
      L.push("   5. [Le cas échéant : points relevant de la santé, de la sécurité et des");
      L.push("      conditions de travail — cette réunion est alors l'une des quatre de");
      L.push("      L. 2315-27.]");
      L.push("");
      L.push("Le président                              Le secrétaire du comité");
      L.push(signataire(ctx) + "        [Nom]");
      L.push("");

      titre(L, "3 — Après la réunion : le procès-verbal");
      L.push("Les délibérations du comité sont consignées dans un procès-verbal établi par");
      L.push("LE SECRÉTAIRE du comité, dans un délai et selon des modalités définis par un");
      L.push("accord conclu dans les conditions de l'article L. 2312-16 ou, à défaut, par");
      L.push("décret (L. 2315-34).");
      L.push("");
      L.push("À DÉFAUT D'ACCORD — le secrétaire établit le procès-verbal dans un délai de");
      L.push("QUINZE JOURS et le communique à l'employeur et aux membres du comité");
      L.push("(R. 2315-25).");
      L.push("");
      L.push("À l'issue de ce délai, le procès-verbal est transmis à l'employeur, qui fait");
      L.push("connaître LORS DE LA RÉUNION SUIVANT CETTE TRANSMISSION sa décision motivée");
      L.push("sur les propositions qui lui ont été soumises ; les déclarations sont");
      L.push("consignées dans le procès-verbal (L. 2315-34).");
      L.push("");
      L.push("Le procès-verbal peut, APRÈS AVOIR ÉTÉ ADOPTÉ, être affiché ou diffusé dans");
      L.push("l'entreprise par le secrétaire du comité, selon des modalités précisées par le");
      L.push("règlement intérieur du comité (L. 2315-35).");
      L.push("");
      L.push("   Réunion du [date] · procès-verbal dû le [date + 15 jours] · transmis le [ ] ·");
      L.push("   décision motivée de l'employeur à la réunion du [ ].");
      L.push("");
      L.push("RÉSOLUTIONS — les résolutions du comité sont prises à la majorité des membres");
      L.push("présents. Le président ne participe pas au vote lorsqu'il consulte les membres");
      L.push("élus du comité en tant que délégation du personnel (L. 2315-32).");

      return pied(L, ["L. 2312-16", "L. 2312-19", "L. 2314-1", "L. 2315-27", "L. 2315-28",
                      "L. 2315-29", "L. 2315-30", "L. 2315-31", "L. 2315-32", "L. 2315-34",
                      "L. 2315-35", "R. 2315-25"]);
    },
  });

  DP.ajouter("CSE-CTL-CON-06", {
    nom: "Le calendrier des quatre réunions santé-sécurité, et ses trois courriers",
    detail: "Le calendrier annuel, son information à l'inspection du travail, au médecin " +
            "du travail et aux services de prévention, et la confirmation écrite quinze " +
            "jours avant chaque réunion.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var faites = nb(f.reunionsSante);
      var L = [];

      L = L.concat(entete(ctx, "Réunions consacrées à la santé, à la sécurité et aux conditions de travail",
        "article L. 2315-27 du code du travail"));
      usage(L);

      L.push("CE QUE LE TEXTE EXIGE");
      L.push("");
      L.push("« Au moins QUATRE RÉUNIONS du comité social et économique portent annuellement");
      L.push("EN TOUT OU PARTIE sur les attributions du comité en matière de santé, sécurité");
      L.push("et conditions de travail, plus fréquemment en cas de besoin, notamment dans");
      L.push("les branches d'activité présentant des risques particuliers » (L. 2315-27).");
      L.push("");
      L.push("« En tout ou partie » : le texte n'exige pas quatre réunions exclusivement");
      L.push("consacrées à ces sujets, mais quatre réunions qui les traitent. Une réunion");
      L.push("ordinaire dont l'ordre du jour comporte un point de santé et de sécurité");
      L.push("compte — encore faut-il que l'ordre du jour et le procès-verbal l'établissent.");
      L.push("");
      L.push("DEUX OBLIGATIONS D'INFORMATION, souvent oubliées, et qui sont dans le même");
      L.push("article :");
      L.push("  · l'employeur INFORME ANNUELLEMENT l'agent de contrôle de l'inspection du");
      L.push("    travail, le médecin du travail et l'agent des services de prévention des");
      L.push("    organismes de sécurité sociale DU CALENDRIER RETENU pour les réunions");
      L.push("    consacrées aux sujets relevant de la santé, de la sécurité ou des");
      L.push("    conditions de travail ;");
      L.push("  · il leur CONFIRME PAR ÉCRIT, AU MOINS QUINZE JOURS À L'AVANCE, la tenue de");
      L.push("    ces réunions (L. 2315-27).");
      L.push("");
      L.push("VOTRE DÉCOMPTE");
      L.push("");
      L.push("  Réunions ayant porté sur ces sujets .......... " +
        (faites == null ? "[à renseigner]" : faites));
      L.push("  Minimum annuel .............................. 4");
      if (faites != null) {
        var reste = 4 - faites;
        L.push("  À rattraper avant la clôture de l'année ..... " + (reste > 0 ? reste : 0));
        if (reste > 0) {
          L.push("");
          L.push("  Chacune doit être confirmée par écrit quinze jours au moins à l'avance :");
          L.push("  si la confirmation part aujourd'hui, " + leJour(d0) + ", la réunion ne peut");
          L.push("  pas se tenir avant le " + leJour(dans(d0, 15)) + ". Et l'ordre du jour doit");
          L.push("  être communiqué trois jours au moins avant la réunion (L. 2315-30).");
        }
      }
      L.push("");

      titre(L, "1 — Calendrier annuel des réunions santé, sécurité et conditions de travail");
      L.push(nom(ctx));
      L.push("");
      L.push("CALENDRIER ANNUEL DES RÉUNIONS DU COMITÉ SOCIAL ET ÉCONOMIQUE");
      L.push("CONSACRÉES, EN TOUT OU PARTIE, À LA SANTÉ, À LA SÉCURITÉ");
      L.push("ET AUX CONDITIONS DE TRAVAIL");
      L.push("Année [ANNÉE]");
      L.push("");
      L.push("   Réunion 1 — [date] · [heure] · [lieu] · sujets : [ ]");
      L.push("   Réunion 2 — [date] · [heure] · [lieu] · sujets : [ ]");
      L.push("   Réunion 3 — [date] · [heure] · [lieu] · sujets : [ ]");
      L.push("   Réunion 4 — [date] · [heure] · [lieu] · sujets : [ ]");
      L.push("   [Réunions supplémentaires, en cas de besoin : … ]");
      L.push("");
      L.push("[Le cas échéant, préciser : ces réunions sont celles des n° [ ] du calendrier");
      L.push("général des réunions du comité — une même réunion peut porter en partie sur");
      L.push("ces sujets et en partie sur d'autres.]");
      L.push("");
      L.push("Établi le " + leJour(d0) + " par " + signataire(ctx) + ".");
      L.push("");

      courrier(L, 1, "information annuelle du calendrier", [
        "UN SEUL courrier par an, adressé aux TROIS destinataires que le texte nomme.",
        "Envoyez-le dès que le calendrier est arrêté : c'est une information annuelle, pas",
        "une confirmation de réunion.",
      ]);
      papier(L, ctx, ["Monsieur l'Inspecteur du travail — [unité de contrôle]",
                      "Monsieur / Madame le Médecin du travail — [service de prévention et de",
                      "santé au travail]",
                      "Monsieur / Madame l'Agent des services de prévention — [organisme de",
                      "sécurité sociale]"], leJour(d0));
      L.push("Objet : calendrier annuel des réunions du comité social et économique");
      L.push("consacrées à la santé, à la sécurité et aux conditions de travail");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("En application du dernier alinéa de l'article L. 2315-27 du code du travail,");
      L.push("aux termes duquel l'employeur informe annuellement l'agent de contrôle de");
      L.push("l'inspection du travail, le médecin du travail et l'agent des services de");
      L.push("prévention des organismes de sécurité sociale du calendrier retenu pour les");
      L.push("réunions consacrées aux sujets relevant de la santé, de la sécurité ou des");
      L.push("conditions de travail, je vous communique ce calendrier pour l'année [ANNÉE].");
      L.push("");
      L.push("   [Reprendre les quatre dates.]");
      L.push("");
      L.push("La tenue de chacune de ces réunions vous sera confirmée par écrit au moins");
      L.push("quinze jours à l'avance, comme le même article le prévoit.");
      L.push("");
      salutation(L, ctx, "Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération distinguée.");
      L.push("Pièce jointe : calendrier annuel");
      L.push("");

      courrier(L, 2, "confirmation écrite quinze jours avant chaque réunion", [
        "UN courrier PAR RÉUNION, aux mêmes trois destinataires, au moins quinze jours",
        "avant sa tenue. Le délai se compte à rebours depuis la date de la réunion.",
      ]);
      papier(L, ctx, ["Monsieur l'Inspecteur du travail — [unité de contrôle]",
                      "Monsieur / Madame le Médecin du travail",
                      "Monsieur / Madame l'Agent des services de prévention"], "[DATE D'ENVOI]");
      L.push("Objet : confirmation de la tenue de la réunion du [DATE DE LA RÉUNION] du");
      L.push("comité social et économique, portant sur la santé, la sécurité et les");
      L.push("conditions de travail");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("En application de l'article L. 2315-27 du code du travail, je vous confirme la");
      L.push("tenue de la réunion du comité social et économique de " + nom(ctx));
      L.push("qui portera, en tout ou partie, sur les attributions du comité en matière de");
      L.push("santé, de sécurité et de conditions de travail :");
      L.push("");
      L.push("   Date : [DATE] · heure : [ ] · lieu : [ ]");
      L.push("");
      L.push("La présente confirmation vous est adressée plus de quinze jours avant cette");
      L.push("date. L'ordre du jour vous sera communiqué trois jours au moins avant la");
      L.push("réunion (L. 2315-30).");
      L.push("");
      salutation(L, ctx, "Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération distinguée.");

      courrier(L, 3, "convocation d'une réunion consécutive à un accident ou à une demande", [
        "Pour les réunions que le texte impose EN OUTRE : accident ayant entraîné ou ayant",
        "pu entraîner des conséquences graves, événement grave lié à l'activité de",
        "l'entreprise ayant porté ou pu porter atteinte à la santé publique ou à",
        "l'environnement, ou demande motivée de deux membres représentants du personnel",
        "sur les sujets relevant de la santé, de la sécurité ou des conditions de travail",
        "(L. 2315-27).",
      ]);
      L.push(nom(ctx));
      L.push("");
      L.push("CONVOCATION — RÉUNION EXCEPTIONNELLE DU COMITÉ SOCIAL ET ÉCONOMIQUE");
      L.push("");
      L.push(lieu(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Fait générateur : [accident du … / événement grave du … / demande motivée de");
      L.push("[deux membres] reçue le …].");
      L.push("");
      L.push("Le comité social et économique est réuni le [DATE] à [heure], à [lieu].");
      L.push("");
      L.push("ORDRE DU JOUR");
      L.push("   1. [Exposé des faits.]");
      L.push("   2. [Mesures prises et envisagées.]");
      L.push("   3. [Le cas échéant : questions jointes à la demande des membres.]");
      L.push("");
      L.push("Copie du présent ordre du jour est adressée à l'agent de contrôle de");
      L.push("l'inspection du travail et à l'agent des services de prévention des organismes");
      L.push("de sécurité sociale (L. 2315-30).");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("SI L'EMPLOYEUR EST DÉFAILLANT — à la demande d'au moins la moitié des membres");
      L.push("du comité, celui-ci peut être convoqué par l'agent de contrôle de l'inspection");
      L.push("du travail et siéger sous sa présidence (L. 2315-27). C'est ce que la carence");
      L.push("expose : la réunion se tient quand même, mais sans vous.");

      return pied(L, ["L. 2315-27", "L. 2315-30", "L. 2315-31"]);
    },
  });

})(typeof window !== "undefined" ? window : this);
