/* L'INDEX DE L'ÉGALITÉ PROFESSIONNELLE, CALCULÉ.

   Ce fichier ne fait que le calcul. Il ne touche ni à l'écran ni au stockage :
   on lui passe les salariés et les chiffres de l'année, il rend les points de
   chaque indicateur et le niveau de résultat. C'est egalite.html qui lit le
   registre du personnel, les taux relevés par l'écran des minima et les
   quelques chiffres que l'application ne détient pas.

   POURQUOI IL EXISTE. La contre-vérification du 26 septembre 2026 relevait que
   l'index n'était pas calculé : la section du plan d'action portait « [__]
   points » et rien d'autre. Le chiffre est désormais calculé à partir du
   registre et des rémunérations, ou l'écran dit lequel des quatre indicateurs
   manque, et pourquoi.

   LES TEXTES, LUS À LA SOURCE.

   L. 1142-8 (LEGIARTI000044605453) : dans les entreprises d'au moins cinquante
   salariés, l'employeur publie chaque année l'ensemble des indicateurs relatifs
   aux écarts de rémunération entre les femmes et les hommes.

   D. 1142-2 (LEGIARTI000038026011), pour plus de deux cent cinquante salariés :
   cinq indicateurs, calculés selon l'annexe I. D. 1142-2-1
   (LEGIARTI000038026015), de cinquante à deux cent cinquante salariés : quatre
   indicateurs, calculés selon l'annexe II.

   D. 1142-3 (LEGIARTI000038026019) : le niveau de résultat est déterminé selon
   les annexes I et II. D. 1142-4 (LEGIARTI000045250060) : publication au plus
   tard le 1er mars, sur le site internet de l'entreprise lorsqu'il en existe
   un, et à défaut par tout moyen. D. 1142-5 (LEGIARTI000045250047) : mise à
   disposition du comité social et économique, résultats présentés par catégorie
   socio-professionnelle, niveau ou coefficient. D. 1142-6
   (LEGIARTI000045250040) : sous soixante-quinze points, les mesures de
   correction de L. 1142-9 doivent être mises en œuvre. L. 1142-10
   (LEGIARTI000051289090) : trois ans pour se mettre en conformité, puis une
   pénalité au maximum de 1 % des rémunérations.

   L. 3221-3 (LEGIARTI000006902819) définit la rémunération retenue : le salaire
   de base et tous les autres avantages et accessoires payés par l'employeur au
   salarié en raison de l'emploi.

   Les articles D. 1142-2 à D. 1142-11 ont été lus le 28 septembre 2026 au relais
   Légifrance, filtre par nom du code. Ils portent tous l'état ABROGE_DIFF :
   abrogés à effet différé, donc applicables à ce jour. Les annexes I et II ne
   sont pas servies par le relais, qui ne connaît que les articles numérotés :
   leur texte a été lu dans la copie du code du travail publiée par
   codes.droit.org le 1er septembre 2026 (articles « Annexe I »,
   LEGIARTI000038137262, et « Annexe II », LEGIARTI000038137266), et le barème
   de l'écart de rémunération, ses vingt-deux lignes, a été relu sur la page
   Légifrance de l'annexe II : les deux lectures donnent les mêmes nombres.  */
(function () {
  "use strict";

  /* LE BARÈME DE L'ÉCART DE RÉMUNÉRATION, identique dans les deux annexes.
     La case 0 est l'écart nul ; la case n vaut pour un écart supérieur à n-1 et
     inférieur ou égal à n pour cent. Au-delà de vingt pour cent : zéro point. */
  var BAREME_ECART = [40, 39, 38, 37, 36, 35, 34, 33, 31, 29, 27, 25, 23, 21,
    19, 17, 14, 11, 8, 5, 2];

  function pointsEcart(e) {
    if (!isFinite(e)) return 0;
    var v = Math.abs(e);
    if (v === 0) return 40;
    if (v > 20) return 0;
    return BAREME_ECART[Math.ceil(v)];
  }

  /* Les quatre tranches d'âge de l'annexe, dans ses mots. */
  var TRANCHES = [
    { cle: "a", nom: "moins de 30 ans", de: 0, a: 29 },
    { cle: "b", nom: "de 30 à 39 ans", de: 30, a: 39 },
    { cle: "c", nom: "de 40 à 49 ans", de: 40, a: 49 },
    { cle: "d", nom: "50 ans et plus", de: 50, a: 999 }
  ];
  function tranche(age) {
    for (var i = 0; i < TRANCHES.length; i++)
      if (age >= TRANCHES[i].de && age <= TRANCHES[i].a) return TRANCHES[i];
    return null;
  }

  /* Les quatre catégories socioprofessionnelles de l'annexe, dans ses mots. */
  var CSP = [
    { cle: "ouvriers", nom: "Ouvriers" },
    { cle: "employes", nom: "Employés" },
    { cle: "tam", nom: "Techniciens et agents de maîtrise" },
    { cle: "cadres", nom: "Ingénieurs et cadres" }
  ];
  function nomCsp(cle) {
    var t = CSP.filter(function (c) { return c.cle === cle; })[0];
    return t ? t.nom : "";
  }

  function arrondi1(x) { return Math.round(x * 10) / 10; }

  /* L'âge au dernier jour de la période de référence, soit le 31 décembre de
     l'année retenue : « les caractéristiques individuelles des salariés
     suivantes sont appréciées au dernier jour de la période de référence
     annuelle choisie par l'employeur ». */
  function ageAu(nais, annee) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(nais || ""))) return null;
    var n = String(nais).split("-");
    var an = annee - Number(n[0]);
    /* Anniversaire au 31 décembre : l'âge est atteint dans l'année entière. */
    return an;
  }

  /* ═══════════════════════════════════════════════════════════════════════
     INDICATEUR 1 : L'ÉCART DE RÉMUNÉRATION.

     Groupes par tranche d'âge et par catégorie de postes équivalents ; seuls
     ceux qui comptent au moins trois femmes et trois hommes sont retenus ;
     écart en pourcentage de la rémunération moyenne des hommes ; seuil de
     pertinence de deux points par coefficient, de cinq points par catégorie
     socioprofessionnelle ; pondération par l'effectif du groupe ; valeur
     absolue arrondie à la première décimale.
     ══════════════════════════════════════════════════════════════════════ */
  function ecartRemuneration(pris, base, annee) {
    var seuil = base === "coef" ? 2 : 5;
    var cases = {};
    pris.forEach(function (s) {
      var age = ageAu(s.nais, annee);
      var t = age === null ? null : tranche(age);
      var cat = base === "coef" ? String(s.coef || "").trim() : String(s.csp || "").trim();
      if (!t || !cat || !isFinite(s.rem) || s.rem <= 0) return;
      var k = cat + " · " + t.nom;
      cases[k] = cases[k] || { nom: k, cat: cat, tranche: t.nom, f: [], h: [] };
      if (s.sexe === "F") cases[k].f.push(s.rem);
      else if (s.sexe === "H") cases[k].h.push(s.rem);
    });
    var groupes = [], retenu = 0, somme = 0, total = 0;
    Object.keys(cases).forEach(function (k) {
      var g = cases[k];
      g.nbF = g.f.length; g.nbH = g.h.length;
      g.effectif = g.nbF + g.nbH;
      g.pris = g.nbF >= 3 && g.nbH >= 3;
      if (g.pris) {
        g.moyF = g.f.reduce(function (a, b) { return a + b; }, 0) / g.nbF;
        g.moyH = g.h.reduce(function (a, b) { return a + b; }, 0) / g.nbH;
        g.ecart = g.moyH === 0 ? 0 : (g.moyH - g.moyF) / g.moyH * 100;
        g.ajuste = g.ecart > 0 ? Math.max(0, g.ecart - seuil)
                 : (g.ecart < 0 ? Math.min(0, g.ecart + seuil) : 0);
        retenu += g.effectif;
      }
      groupes.push(g);
    });
    groupes.sort(function (a, b) { return a.nom < b.nom ? -1 : 1; });
    groupes.forEach(function (g) {
      if (!g.pris) return;
      g.poids = g.effectif / retenu;
      somme += g.ajuste * g.poids;
    });
    total = pris.length;
    var part = total ? retenu / total : 0;
    var signe = somme;
    var global = arrondi1(Math.abs(somme));
    return {
      cle: "remuneration", nom: "Écart de rémunération entre les femmes et les hommes",
      max: 40, seuil: seuil, base: base, groupes: groupes,
      retenu: retenu, effectif: total, part: part, signe: signe, resultat: global,
      points: pointsEcart(global),
      etat: retenu === 0 ? "manque" : (part < 0.4 ? "incalculable" : "calcule"),
      pourquoi: retenu === 0
        ? "aucun groupe ne réunit trois femmes et trois hommes dont la rémunération est connue"
        : (part < 0.4 ? "l'effectif des groupes retenus, " + retenu + " salariés, est inférieur à " +
            "40 % de l'effectif pris en compte, " + total + " salariés" : "")
    };
  }

  /* ═══════════════════════════════════════════════════════════════════════
     INDICATEUR 2, ANNEXE II : L'ÉCART DE TAUX D'AUGMENTATIONS INDIVIDUELLES.

     Toutes les augmentations individuelles, promotion ou non. L'écart absolu de
     taux est appliqué au plus petit des deux effectifs pour donner un écart en
     nombre de salariés ; le barème est lu sur les deux, et le résultat le plus
     favorable est retenu.
     ══════════════════════════════════════════════════════════════════════ */
  function pointsAug2(ecartPts, ecartSal) {
    function bar(v) {
      if (v <= 2) return 35;
      if (v <= 5) return 25;
      if (v <= 10) return 15;
      return 0;
    }
    return Math.max(bar(ecartPts), bar(ecartSal));
  }

  function augmentations2(pris, aug) {
    var nbF = pris.filter(function (s) { return s.sexe === "F"; }).length;
    var nbH = pris.filter(function (s) { return s.sexe === "H"; }).length;
    var af = Number(aug && aug.f), ah = Number(aug && aug.h);
    var r = { cle: "augmentations", max: 35, nbF: nbF, nbH: nbH,
      nom: "Écart de taux d'augmentations individuelles entre les femmes et les hommes" };
    if (vide((aug || {}).f) || vide((aug || {}).h) || !isFinite(af) || !isFinite(ah)) {
      r.etat = "manque"; r.points = 0;
      r.pourquoi = "le nombre de femmes et le nombre d'hommes augmentés dans l'année ne sont pas renseignés";
      return r;
    }
    if (af + ah === 0) {
      r.etat = "incalculable"; r.points = 0;
      r.pourquoi = "aucune augmentation individuelle n'est intervenue au cours de la période de référence";
      return r;
    }
    if (nbF < 5 || nbH < 5) {
      r.etat = "incalculable"; r.points = 0;
      r.pourquoi = "l'entreprise ne comporte pas au moins cinq femmes et cinq hommes pris en compte (" +
        nbF + " femmes, " + nbH + " hommes)";
      return r;
    }
    var tf = af / nbF * 100, th = ah / nbH * 100;
    r.tauxF = arrondi1(tf); r.tauxH = arrondi1(th);
    r.resultat = arrondi1(Math.abs(th - tf));
    r.salaries = arrondi1(Math.abs(th - tf) / 100 * Math.min(nbF, nbH));
    r.points = pointsAug2(r.resultat, r.salaries);
    r.faveur = th > tf ? "H" : (tf > th ? "F" : "");
    r.etat = "calcule";
    return r;
  }

  /* ═══════════════════════════════════════════════════════════════════════
     INDICATEURS 2 ET 3, ANNEXE I : AUGMENTATIONS HORS PROMOTION, PROMOTIONS.

     Quatre groupes, les catégories socioprofessionnelles ; seuls ceux qui
     comptent au moins dix femmes et dix hommes sont retenus ; écart en points
     de pourcentage, pondéré par l'effectif du groupe.
     ══════════════════════════════════════════════════════════════════════ */
  function pointsAug1(v, max) {
    if (v <= 2) return max;
    if (v <= 5) return 10;
    if (v <= 10) return 5;
    return 0;
  }

  function parCsp(pris, chiffres, quoi, max, nom) {
    var cases = {};
    CSP.forEach(function (c) { cases[c.cle] = { cle: c.cle, nom: c.nom, nbF: 0, nbH: 0 }; });
    pris.forEach(function (s) {
      var c = cases[String(s.csp || "")];
      if (!c) return;
      if (s.sexe === "F") c.nbF++; else if (s.sexe === "H") c.nbH++;
    });
    var groupes = [], retenu = 0, somme = 0, aucun = true, manque = false;
    CSP.forEach(function (c) {
      var g = cases[c.cle];
      var d = (chiffres || {})[c.cle] || {};
      g.f = vide(d.f) ? "" : String(d.f);
      g.h = vide(d.h) ? "" : String(d.h);
      g.effectif = g.nbF + g.nbH;
      g.pris = g.nbF >= 10 && g.nbH >= 10;
      if (!g.pris) { groupes.push(g); return; }
      if (g.f === "" || g.h === "") { manque = true; groupes.push(g); return; }
      var af = Number(g.f), ah = Number(g.h);
      if (af + ah > 0) aucun = false;
      g.tauxF = af / g.nbF * 100;
      g.tauxH = ah / g.nbH * 100;
      g.ecart = g.tauxH - g.tauxF;
      retenu += g.effectif;
      groupes.push(g);
    });
    var r = { cle: quoi, nom: nom, max: max, groupes: groupes,
      retenu: retenu, effectif: pris.length };
    if (manque || retenu === 0) {
      r.etat = "manque"; r.points = 0;
      r.pourquoi = retenu === 0 && !manque
        ? "aucune catégorie socioprofessionnelle ne réunit dix femmes et dix hommes"
        : "les chiffres de chaque catégorie retenue ne sont pas tous renseignés";
      return r;
    }
    if (aucun) {
      r.etat = "incalculable"; r.points = 0;
      r.pourquoi = quoi === "promotions"
        ? "aucune promotion n'est intervenue au cours de la période de référence"
        : "aucune augmentation individuelle n'est intervenue au cours de la période de référence";
      return r;
    }
    groupes.forEach(function (g) {
      if (!g.pris || g.ecart === undefined) return;
      g.poids = g.effectif / retenu;
      somme += g.ecart * g.poids;
    });
    r.part = pris.length ? retenu / pris.length : 0;
    if (r.part < 0.4) {
      r.etat = "incalculable"; r.points = 0;
      r.pourquoi = "l'effectif des groupes retenus, " + retenu + " salariés, est inférieur à 40 % " +
        "de l'effectif pris en compte, " + pris.length + " salariés";
      return r;
    }
    r.signe = somme;
    r.resultat = arrondi1(Math.abs(somme));
    r.points = pointsAug1(r.resultat, max);
    r.faveur = somme > 0 ? "H" : (somme < 0 ? "F" : "");
    r.etat = "calcule";
    return r;
  }

  /* ═══════════════════════════════════════════════════════════════════════
     LE RETOUR DE CONGÉ DE MATERNITÉ. Cent pour cent, quinze points ; en
     dessous, zéro. Incalculable si aucun retour, ou si aucune augmentation
     n'est intervenue pendant les congés.
     ══════════════════════════════════════════════════════════════════════ */
  /* Un champ vide n'est pas un zéro, et un zéro n'est pas un champ vide :
     « String(v || "") » confondait les deux, et zéro retour de congé de
     maternité était lu comme une donnée manquante. Relevé le 28 septembre 2026
     en éprouvant le calcul. */
  function vide(v) {
    return v === undefined || v === null || String(v).trim() === "";
  }

  function maternite(mat) {
    var m = mat || {};
    var r = { cle: "maternite", max: 15,
      nom: "Salariées augmentées à leur retour de congé de maternité" };
    var ret = Number(m.retours), aug = Number(m.augmentees);
    if (vide(m.retours)) {
      r.etat = "manque"; r.points = 0;
      r.pourquoi = "le nombre de retours de congé de maternité dans l'année n'est pas renseigné";
      return r;
    }
    if (!isFinite(ret) || ret === 0) {
      r.etat = "incalculable"; r.points = 0;
      r.pourquoi = "aucun retour de congé de maternité n'est intervenu au cours de la période de référence";
      return r;
    }
    if (m.pendant !== "oui") {
      r.etat = "incalculable"; r.points = 0;
      r.pourquoi = "aucune augmentation n'est intervenue pendant la durée de ces congés";
      return r;
    }
    if (vide(m.augmentees) || !isFinite(aug)) {
      r.etat = "manque"; r.points = 0;
      r.pourquoi = "le nombre de salariées augmentées à leur retour n'est pas renseigné";
      return r;
    }
    r.retours = ret; r.augmentees = aug;
    r.resultat = ret === 0 ? 0 : Math.round(aug / ret * 1000) / 10;
    r.points = aug >= ret ? 15 : 0;
    r.etat = "calcule";
    return r;
  }

  /* ═══════════════════════════════════════════════════════════════════════
     LES DIX PLUS HAUTES RÉMUNÉRATIONS. Le plus petit des deux nombres, femmes
     et hommes, parmi les dix salariés les mieux payés.
     ══════════════════════════════════════════════════════════════════════ */
  function hautes(pris) {
    var r = { cle: "hautes", max: 10,
      nom: "Salariés du sexe sous-représenté parmi les dix plus hautes rémunérations" };
    var connus = pris.filter(function (s) { return isFinite(s.rem) && s.rem > 0; })
      .sort(function (a, b) { return b.rem - a.rem; });
    if (connus.length < 10) {
      r.etat = "manque"; r.points = 0;
      r.pourquoi = "la rémunération n'est connue que pour " + connus.length +
        " salariés : il en faut dix pour classer les dix plus hautes";
      return r;
    }
    var dix = connus.slice(0, 10);
    var f = dix.filter(function (s) { return s.sexe === "F"; }).length;
    var h = dix.filter(function (s) { return s.sexe === "H"; }).length;
    r.femmes = f; r.hommes = h;
    r.resultat = Math.min(f, h);
    r.points = r.resultat >= 4 ? 10 : (r.resultat >= 2 ? 5 : 0);
    r.dix = dix.map(function (s) { return { nom: s.nom, sexe: s.sexe, rem: s.rem }; });
    r.etat = "calcule";
    return r;
  }

  /* ═══════════════════════════════════════════════════════════════════════
     LE NIVEAU DE RÉSULTAT.

     Somme des points des indicateurs calculés. Quand un indicateur n'est pas
     calculable, le total est ramené sur cent par proportionnalité ; et si le
     maximum atteignable avant proportionnalité descend sous soixante-quinze
     points, le niveau de résultat ne peut pas être déterminé.
     ══════════════════════════════════════════════════════════════════════ */
  function calculer(e) {
    var entree = e || {};
    var annee = Number(entree.annee) || new Date().getFullYear() - 1;
    var effectif = Number(entree.effectif);
    var grande = isFinite(effectif) && effectif > 250;
    var base = entree.base === "coef" ? "coef" : "csp";

    /* Les salariés pris en compte : ni apprentis, ni contrats de
       professionnalisation, ni ceux que l'employeur a écartés comme absents
       plus de la moitié de la période, mis à disposition ou expatriés. */
    var tous = (entree.salaries || []).map(function (s) { return s; });
    var ecartes = tous.filter(function (s) { return s.ecarte || s.motif; });
    var pris = tous.filter(function (s) {
      return !s.ecarte && !s.motif && (s.sexe === "F" || s.sexe === "H");
    });

    var ind = [];
    /* LE CLASSEMENT PAR COEFFICIENT PEUT NE PAS TENIR.

       « Si, en application de cette règle, le calcul de l'indicateur par niveau
       ou coefficient hiérarchique est rendu impossible, au regard du critère
       défini au paragraphe 5.1, le classement par niveau ou coefficient n'est
       pas retenu et les salariés sont regroupés selon les quatre catégories
       socioprofessionnelles. » Le repli est donc dans le texte : il se fait
       tout seul, et l'indicateur dit par quoi il a été obtenu. */
    var un0 = ecartRemuneration(pris, base, annee);
    if (base === "coef" && un0.etat !== "calcule") {
      var parCat = ecartRemuneration(pris, "csp", annee);
      if (parCat.etat === "calcule") {
        parCat.repli = true;
        un0 = parCat;
      }
    }
    ind.push(un0);
    if (grande) {
      ind.push(parCsp(pris, entree.aug, "augmentations", 20,
        "Écart de taux d'augmentations individuelles hors promotion"));
      ind.push(parCsp(pris, entree.promo, "promotions", 15,
        "Écart de taux de promotions entre les femmes et les hommes"));
    } else {
      ind.push(augmentations2(pris, entree.aug2));
    }
    ind.push(maternite(entree.mat));
    ind.push(hautes(pris));

    /* Les mesures de correction du 5.2 : quand l'écart de rémunération est
       calculable sans être au maximum, l'entreprise obtient le maximum de
       points à l'indicateur des augmentations, et sous l'annexe I à celui des
       promotions, si les écarts y favorisent la population la moins payée. */
    var un = ind[0], correction = [];
    if (un.etat === "calcule" && un.points < un.max && un.signe !== 0) {
      var moinsPayee = un.signe > 0 ? "F" : "H";
      ind.forEach(function (i) {
        if (i.cle !== "augmentations" && i.cle !== "promotions") return;
        if (i.etat !== "calcule" || i.faveur !== moinsPayee) return;
        if (i.points === i.max) return;
        i.pointsAvant = i.points;
        i.points = i.max;
        i.correction = true;
        correction.push(i.nom);
      });
    }

    var calcules = ind.filter(function (i) { return i.etat === "calcule"; });
    var manquants = ind.filter(function (i) { return i.etat === "manque"; });
    var incalculables = ind.filter(function (i) { return i.etat === "incalculable"; });
    var points = calcules.reduce(function (a, i) { return a + i.points; }, 0);
    var maxAtteint = calcules.reduce(function (a, i) { return a + i.max; }, 0);

    var sortie = {
      annee: annee, effectif: isFinite(effectif) ? effectif : null,
      annexe: grande ? "I" : "II", base: ind[0].base || base, repli: !!ind[0].repli,
      article: grande ? "D. 1142-2" : "D. 1142-2-1",
      indicateurs: ind, pris: pris.length, ecartes: ecartes.length,
      points: points, maxAtteint: maxAtteint,
      manquants: manquants.length, incalculables: incalculables.length,
      correction: correction
    };
    if (manquants.length) {
      sortie.etat = "incomplet";
      sortie.niveau = null;
      return sortie;
    }
    if (maxAtteint < 75) {
      sortie.etat = "indeterminable";
      sortie.niveau = null;
      return sortie;
    }
    sortie.etat = "calcule";
    sortie.niveau = maxAtteint === 100 ? points : Math.round(points / maxAtteint * 100);
    sortie.proportionnalite = maxAtteint !== 100;
    return sortie;
  }

  window.IndexEgalite = {
    BAREME_ECART: BAREME_ECART, pointsEcart: pointsEcart,
    TRANCHES: TRANCHES, tranche: tranche, CSP: CSP, nomCsp: nomCsp,
    ageAu: ageAu, calculer: calculer
  };
})();
