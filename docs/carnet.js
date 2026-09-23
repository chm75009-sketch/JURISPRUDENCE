/* LE CARNET DES DESTINATAIRES.

   POURQUOI CE FICHIER EXISTE

   Demande du 15 septembre 2026 : « on peut faire le lien entre les lettres
   d'avertissement, licenciement, etc. avec le registre du personnel ?
   sélectionner le salarié, objet du courrier quel qu'il soit, et ensuite
   enchaîner ; et pareil pour les clients et les fournisseurs ».

   Jusqu'ici, écrire à un salarié voulait dire retaper son nom, son emploi et
   son adresse à chaque lettre, alors que le registre les porte déjà. Et pour
   un client ou un fournisseur, il n'existait rien du tout : ni nom, ni
   adresse, ni référence de compte.

   CE QU'IL GARDE

   Deux sources, une seule façon de s'en servir.

   - LES SALARIÉS viennent du registre du personnel, sans être recopiés : la
     liste se lit à chaque ouverture, donc un salarié ajouté au registre
     apparaît aussitôt dans les courriers, et un salarié sorti porte sa date
     de sortie. Le carnet ne les modifie jamais.

   - LES CLIENTS, FOURNISSEURS ET AUTRES CORRESPONDANTS (impôts, URSSAF,
     assurance, banque) sont saisis ici et gardés sur ce poste, rangés par
     famille de courrier.

   OÙ

   Dans le stockage local du navigateur, comme tout le reste. Rien n'est
   envoyé.

   L'API

     Carnet.pour(famille)          -> [{ id, nom, lignes[], champs{} }]
     Carnet.ajouter(famille, o)    -> la fiche créée
     Carnet.modifier(id, o)
     Carnet.supprimer(id)
     Carnet.lire(id)

   « lignes » est le bloc destinataire, prêt à poser en tête d'une lettre :
   le nom, puis ce qui l'identifie, puis l'adresse. « champs » donne de quoi
   remplir les crochets d'un modèle, [NOM], [PRÉNOM], [EMPLOI].              */

"use strict";
(function (window) {

  var CLE = "carnet-destinataires";
  var CLE_REGISTRE = "registre-personnel";

  function lireTout() {
    try { return JSON.parse(window.localStorage.getItem(CLE) || "[]") || []; }
    catch (e) { return []; }
  }
  function garder(L) {
    try { window.localStorage.setItem(CLE, JSON.stringify(L)); } catch (e) {}
  }
  function identifiant() {
    return "d" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }
  function net(v) { return String(v == null ? "" : v).trim(); }

  /* ─────────────────────────────── les salariés ─────────────────────── */
  /* Lus dans le registre, jamais recopiés : le registre est la source, le
     carnet n'en est qu'une vue. */
  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet",
    "août", "septembre", "octobre", "novembre", "décembre"];
  function enFrancais(iso) {
    var s = net(iso);
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!m) return s;
    var j = parseInt(m[3], 10);
    return (j === 1 ? "1er" : j) + " " + MOIS[parseInt(m[2], 10) - 1] + " " + m[1];
  }

  function salaries() {
    var E = null;
    try { E = JSON.parse(window.localStorage.getItem(CLE_REGISTRE) || "null"); } catch (e) {}
    var L = (E && E.salaries) || [];
    return L.filter(function (s) {
      /* Les lignes d'exemple du registre ne sont pas des destinataires, et une
         ligne sans nom n'en est pas un non plus. */
      return !s.ex && net(s.nom);
    }).map(function (s) {
      var nom = (net(s.nom) + " " + net(s.pre)).trim();
      var lignes = [nom];
      if (net(s.emp)) lignes.push(net(s.emp));
      if (net(s.adresse)) lignes.push(net(s.adresse));
      var sortie = net(s.sor);
      return {
        id: "reg:" + (s.id || nom),
        sorte: "salarie",
        nom: nom,
        detail: [net(s.emp), sortie ? "sorti le " + enFrancais(sortie) : "en poste"]
          .filter(Boolean).join(" · "),
        sorti: !!sortie,
        lignes: lignes,
        champs: {
          "NOM": net(s.nom),
          "PRÉNOM": net(s.pre),
          "NOM ET PRÉNOM": nom,
          "CIVILITÉ NOM PRÉNOM": nom,
          "NOM DU SALARIÉ": nom,
          "EMPLOI": net(s.emp),
          "QUALIFICATION": net(s.qua),
          "DATE D'ENTRÉE": enFrancais(s.ent),
          "DATE DE SORTIE": enFrancais(s.sor),
        },
        duRegistre: true,
      };
    });
  }

  /* ──────────────────── les correspondants saisis ici ───────────────── */
  function fiche(o) {
    var nom = net(o.nom);
    var lignes = [nom];
    if (net(o.contact)) lignes.push("À l'attention de " + net(o.contact));
    net(o.adresse).split("\n").forEach(function (l) {
      if (net(l)) lignes.push(net(l));
    });
    var detail = [net(o.contact), net(o.reference) ? "réf. " + net(o.reference) : "",
      net(o.courriel)].filter(Boolean).join(" · ");
    return {
      id: o.id, sorte: o.famille, nom: nom, detail: detail, lignes: lignes,
      sorti: false,
      champs: {
        "NOM": nom,
        "NOM DU CLIENT": nom,
        "NOM DU FOURNISSEUR": nom,
        "INTERLOCUTEUR": net(o.contact),
        "RÉFÉRENCE": net(o.reference),
        "COURRIEL": net(o.courriel),
        "TÉLÉPHONE": net(o.telephone),
      },
      brut: o,
      duRegistre: false,
    };
  }

  /* LES SALARIÉS DU REGISTRE, ET CEUX QUI N'Y SONT PAS.
  
     Le registre donne les salariés en poste ou sortis. Mais on écrit aussi à
     un ancien salarié que le registre ne porte plus, à un candidat, à
     quelqu'un qui n'y est pas encore : ceux-là se saisissent à la main et
     viennent à la suite. Sans ce rattrapage, on pouvait les saisir et ils
     disparaissaient. Mesuré le 23 septembre 2026. */
  function pour(famille) {
    if (famille === "salarie") {
      var mains = lireTout()
        .filter(function (o) { return o.famille === "salarie"; })
        .map(fiche)
        .sort(function (a, b) { return a.nom.localeCompare(b.nom, "fr"); });
      return salaries().concat(mains);
    }
    return lireTout()
      .filter(function (o) { return o.famille === famille; })
      .map(fiche)
      .sort(function (a, b) { return a.nom.localeCompare(b.nom, "fr"); });
  }

  /* UN DESTINATAIRE QUI N'EST PAS ENCORE AU CARNET.

     Demande du 23 septembre 2026 : « une fois le contact mis sur le document
     on doit nous demander si ensuite il faut le rajouter à la liste ». La
     fiche se construit donc sans être gardée, la lettre s'écrit avec, et la
     question vient après. Elle n'a pas d'identifiant, ce qui la distingue
     d'une fiche du carnet : c'est à cela que la lettre voit qu'il reste une
     question à poser. */
  function provisoire(famille, o) {
    var n = {
      id: "", famille: String(famille || ""),
      nom: net(o.nom), contact: net(o.contact), adresse: net(o.adresse),
      courriel: net(o.courriel), telephone: net(o.telephone), reference: net(o.reference),
    };
    return fiche(n);
  }

  function ajouter(famille, o) {
    var L = lireTout();
    var n = {
      id: identifiant(), famille: String(famille || ""),
      nom: net(o.nom), contact: net(o.contact), adresse: net(o.adresse),
      courriel: net(o.courriel), telephone: net(o.telephone), reference: net(o.reference),
      cree: new Date().toISOString(),
    };
    L.push(n);
    garder(L);
    return fiche(n);
  }

  function modifier(id, o) {
    var L = lireTout(), sortie = null;
    L.forEach(function (x) {
      if (x.id !== id) return;
      ["nom", "contact", "adresse", "courriel", "telephone", "reference"].forEach(function (c) {
        if (o[c] != null) x[c] = net(o[c]);
      });
      sortie = fiche(x);
    });
    garder(L);
    return sortie;
  }

  function supprimer(id) {
    garder(lireTout().filter(function (x) { return x.id !== id; }));
  }

  function lire(id) {
    if (String(id).indexOf("reg:") === 0) {
      var t = null;
      salaries().forEach(function (s) { if (s.id === id) t = s; });
      return t;
    }
    var f = null;
    lireTout().forEach(function (x) { if (x.id === id) f = fiche(x); });
    return f;
  }

  window.Carnet = {
    pour: pour, ajouter: ajouter, provisoire: provisoire, modifier: modifier,
    supprimer: supprimer, lire: lire, salaries: salaries,
  };
})(window);
