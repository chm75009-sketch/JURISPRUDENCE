/* LES JOURS FÉRIÉS, EN UN SEUL ENDROIT.

   Ils servaient au forfait en jours, qui les calculait pour lui seul ; les
   échéances du comité, du licenciement et des contrôles tombaient un samedi ou
   un 25 décembre sans que rien ne le dise. Demandé le 27 septembre 2026, à
   propos du kit des élections dont le quatre-vingt-dixième jour tombait un
   samedi 26 décembre : « alerter sur les fériés ».

   La liste est celle de l'article L. 3133-1 du code du travail
   (LEGIARTI000033020901, deux lectures espacées concordantes au relais
   Légifrance le 27 septembre 2026) : « Les fêtes légales ci-après désignées
   sont des jours fériés : 1° Le 1er janvier ; 2° Le lundi de Pâques ; 3° Le
   1er mai ; 4° Le 8 mai ; 5° L'Ascension ; 6° Le lundi de Pentecôte ; 7° Le
   14 juillet ; 8° L'Assomption ; 9° La Toussaint ; 10° Le 11 novembre ;
   11° Le jour de Noël. » Les quatre fêtes mobiles se calculent depuis Pâques,
   par l'algorithme de Meeus.

   Ce fichier ne décide rien : il dit ce qu'est une date. C'est à chaque écran
   de choisir s'il repousse l'échéance, s'il avertit, ou s'il se taît. Une
   échéance légale qui tombe un dimanche ne se déplace pas toute seule : selon
   les textes, elle est prorogée au premier jour ouvrable (R. 1332-3 pour la
   sanction disciplinaire) ou elle ne l'est pas, et l'acte doit alors être fait
   avant. */
(function (global) {
  "use strict";

  function deuxChiffres(n) { return String(n).padStart(2, "0"); }
  function iso(d) {
    return d.getFullYear() + "-" + deuxChiffres(d.getMonth() + 1) + "-" + deuxChiffres(d.getDate());
  }
  function enDate(v) {
    if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(v == null ? "" : v).trim());
    if (!m) return null;
    var d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0);
    return isNaN(d.getTime()) ? null : d;
  }

  /* Pâques, par le calcul de Meeus. */
  function paques(an) {
    var a = an % 19, b = Math.floor(an / 100), c = an % 100;
    var d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    var g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
    var i = Math.floor(c / 4), k = c % 4;
    var l = (32 + 2 * e + 2 * i - h - k) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451);
    var mois = Math.floor((h + l - 7 * m + 114) / 31);
    var jr = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(an, mois - 1, jr, 12, 0, 0);
  }

  /* Les onze fêtes légales de l'année, chacune avec le nom sous lequel on la
     nomme dans un courrier. */
  function feries(an) {
    var p = paques(an), L = [];
    function pose(d, nom) { L.push({ d: iso(d), nom: nom }); }
    function depuisPaques(n) {
      return new Date(p.getFullYear(), p.getMonth(), p.getDate() + n, 12, 0, 0);
    }
    pose(new Date(an, 0, 1, 12), "le 1er janvier");
    pose(depuisPaques(1), "le lundi de Pâques");
    pose(new Date(an, 4, 1, 12), "le 1er mai");
    pose(new Date(an, 4, 8, 12), "le 8 mai");
    pose(depuisPaques(39), "l'Ascension");
    pose(depuisPaques(50), "le lundi de Pentecôte");
    pose(new Date(an, 6, 14, 12), "le 14 juillet");
    pose(new Date(an, 7, 15, 12), "l'Assomption");
    pose(new Date(an, 10, 1, 12), "la Toussaint");
    pose(new Date(an, 10, 11, 12), "le 11 novembre");
    pose(new Date(an, 11, 25, 12), "le jour de Noël");
    return L;
  }

  /* Rend le nom de la fête légale, ou la chaîne vide. */
  function nomFerie(v) {
    var d = enDate(v);
    if (!d) return "";
    var j = iso(d), L = feries(d.getFullYear());
    for (var i = 0; i < L.length; i++) if (L[i].d === j) return L[i].nom;
    return "";
  }
  function estFerie(v) { return nomFerie(v) !== ""; }
  function estSamedi(v) { var d = enDate(v); return !!d && d.getDay() === 6; }
  function estDimanche(v) { var d = enDate(v); return !!d && d.getDay() === 0; }

  /* Ce qui empêche de tenir un acte ce jour-là, en une phrase, ou rien. Le
     texte est écrit pour être collé à la suite d'un fondement : il commence
     donc par une majuscule et se termine par un point. */
  function avertissement(v) {
    var d = enDate(v);
    if (!d) return "";
    var f = nomFerie(d);
    if (f) return " Attention : cette date est " + f + ", jour férié (L. 3133-1). Tenez l'acte avant.";
    if (d.getDay() === 0) return " Attention : cette date est un dimanche. Tenez l'acte avant.";
    if (d.getDay() === 6) return " Attention : cette date est un samedi. Tenez l'acte avant.";
    return "";
  }

  /* Le premier jour ouvrable à partir d'une date : samedis, dimanches et
     fériés écartés. Sert là où un texte proroge expressément le terme. */
  function premierOuvrable(v) {
    var d = enDate(v);
    if (!d) return null;
    var x = new Date(d.getTime());
    while (x.getDay() === 0 || x.getDay() === 6 || estFerie(x)) x.setDate(x.getDate() + 1);
    return x;
  }

  global.JoursFeries = {
    paques: paques, feries: feries, nomFerie: nomFerie, estFerie: estFerie,
    estSamedi: estSamedi, estDimanche: estDimanche,
    avertissement: avertissement, premierOuvrable: premierOuvrable, iso: iso,
  };
})(typeof window !== "undefined" ? window : this);
