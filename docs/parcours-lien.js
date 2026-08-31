/* LE PONT ENTRE L'AUDIT ET L'ACCOMPAGNEMENT
   ==========================================

   L'audit dit ce qui manque. Il ne doit pas s'arrêter là : quand une pièce
   n'existe pas, l'utilisateur n'a pas besoin d'un second constat, il a besoin
   de la procédure qui la fait naître — le modèle, la consultation du comité,
   l'inspection du travail, le greffe du conseil de prud'hommes, l'affichage,
   l'entrée en vigueur. C'est ce que déroulent les parcours guidés
   (docs/parcours.html, docs/parcours.js).

   Ce fichier ne fait qu'une chose : dire, pour un identifiant de contrôle,
   quel parcours le régularise. La correspondance se fait sur la RUBRIQUE de
   l'identifiant — « SST-CTL-DUE-04 » est un contrôle du document unique, quel
   que soit son numéro —, jamais contrôle par contrôle : un contrôle ajouté
   demain à une rubrique déjà connue trouvera son parcours sans qu'on y touche.

   Le module social ne passe pas par ici : chacune de ses obligations porte
   déjà sa clé de parcours dans le moteur (`regularisation.parcours`).

   Aucun texte de loi n'est cité ici, et ce fichier n'en cite jamais : il ne
   fait que router. Les fondements, les délais et les sanctions vivent dans les
   parcours et dans les moteurs, où ils ont été lus à la source. */
(function () {
  "use strict";

  /* rubrique de l'identifiant -> { p: clé du parcours, nom: son intitulé } */
  var RUBRIQUES = {
    /* Discipline et règlement intérieur */
    "DIS-CTL-RI": { p: "ri", nom: "Établir ou mettre à jour le règlement intérieur" },
    "DIS-CTL-SAN": { p: "sanction", nom: "Sanctionner un salarié" },
    "DIS-CTL-EXP": { p: "sanction", nom: "Sanctionner un salarié" },

    /* Santé, sécurité et conditions de travail */
    "SST-CTL-DUE": { p: "duerp", nom: "Mettre à jour le DUERP" },
    "SST-CTL-CSS": { p: "commissions", nom: "Constituer les commissions du comité" },
    "SST-CTL-HAR": { p: "affichages", nom: "Tenir les affichages et informations obligatoires" },
    "SST-CTL-PEN": { p: "duerp", nom: "Mettre à jour le DUERP" },

    /* Comité social et économique. Les élections elles-mêmes ne sont pas ici :
       elles se conduisent dans Juris Expert, et le parcours d'installation le
       dit en tête — c'est donc lui qui reçoit les contrôles d'élection, avec
       le renvoi qu'il porte. */
    "CSE-CTL-ELE": { p: "installation", nom: "Installer le CSE : la première réunion" },
    "CSE-CTL-MEP": { p: "installation", nom: "Installer le CSE : la première réunion" },
    "CSE-CTL-DET": { p: "installation", nom: "Installer le CSE : la première réunion" },
    "CSE-CTL-COM": { p: "commissions", nom: "Constituer les commissions du comité" },
    "CSE-CTL-SST": { p: "commissions", nom: "Constituer les commissions du comité" },
    "CSE-CTL-REC": { p: "reunion", nom: "Tenir une réunion du CSE" },
    "CSE-CTL-CON": { p: "reunion", nom: "Tenir une réunion du CSE" },
    "CSE-CTL-EXP": { p: "reunion", nom: "Tenir une réunion du CSE" },
    "CSE-CTL-MOY": { p: "installation", nom: "Installer le CSE : la première réunion" },
    "CSE-CTL-BUD": { p: "installation", nom: "Installer le CSE : la première réunion" },
    "CSE-CTL-PER": { p: "reunion", nom: "Tenir une réunion du CSE" },

    /* Base de données économiques et sociales */
    "BDESE-CTL-CNT": { p: "bdese", nom: "Constituer ou mettre à jour la BDESE" },
    "BDESE-CTL-MAD": { p: "bdese", nom: "Constituer ou mettre à jour la BDESE" },
    "BDESE-CTL-REG": { p: "bdese", nom: "Constituer ou mettre à jour la BDESE" },
    "BDESE-CTL-DAT": { p: "bdese", nom: "Constituer ou mettre à jour la BDESE" },
    "BDESE-CTL-ETB": { p: "bdese", nom: "Constituer ou mettre à jour la BDESE" },
    "BDESE-CTL-PRV": { p: "bdese", nom: "Constituer ou mettre à jour la BDESE" },
    "BDESE-CTL-CSL": { p: "reunion", nom: "Tenir une réunion du CSE" },

    /* Négociations obligatoires */
    "NAO-CTL-PER": { p: "nao", nom: "Conduire les négociations obligatoires" },
    "NAO-CTL-ISS": { p: "nao", nom: "Conduire les négociations obligatoires" },
    "NAO-CTL-CON": { p: "nao", nom: "Conduire les négociations obligatoires" },
    "NAO-CTL-LOY": { p: "nao", nom: "Conduire les négociations obligatoires" },
    "NAO-CTL-DEM": { p: "nao", nom: "Conduire les négociations obligatoires" },
    "NAO-CTL-UNI": { p: "nao", nom: "Conduire les négociations obligatoires" },
    "NAO-CTL-REG": { p: "nao", nom: "Conduire les négociations obligatoires" },
    "NAO-CTL-EGA": { p: "index", nom: "Publier l'index de l'égalité professionnelle" },
    "NAO-CTL-PEN": { p: "index", nom: "Publier l'index de l'égalité professionnelle" },

    /* Plan de sauvegarde de l'emploi. Le PSE n'a pas de parcours qui lui soit
       propre : ce qui s'y régularise passe par le comité — consultation,
       réunions, expertise. On ne renvoie donc que là où le renvoi est exact,
       et rien ailleurs : un lien qui ne mène pas à la bonne procédure vaut
       moins que pas de lien du tout. */
    "PSE-CTL-CSE": { p: "reunion", nom: "Tenir une réunion du CSE" },
    "PSE-CTL-CON": { p: "reunion", nom: "Tenir une réunion du CSE" },
  };

  /* L'audit économique n'a pas de parcours qui lui soit propre — la procédure
     de licenciement économique est elle-même l'objet de l'audit. Seule sa
     consultation du comité renvoie à un parcours existant. Ses identifiants
     n'ont pas de préfixe de module (« CTL-CSE-04 » et non « ECO-CTL-CSE-04 »),
     d'où la seconde forme reconnue plus bas. */
  RUBRIQUES["CTL-CSE"] = { p: "reunion", nom: "Tenir une réunion du CSE" };

  /* Le nom lisible de chaque parcours, pour l'intitulé du lien. Il double ce
     que porte docs/parcours.js : cette page-ci ne charge pas les parcours,
     qui pèsent trop lourd pour un simple libellé. */
  var PAR_CLE = {
    ri: "Établir ou mettre à jour le règlement intérieur",
    duerp: "Mettre à jour le DUERP",
    sanction: "Sanctionner un salarié",
    commissions: "Constituer les commissions du CSE",
    reunion: "Tenir une réunion du CSE",
    installation: "Installer le CSE : la première réunion",
    nao: "Conduire les négociations obligatoires",
    index: "Publier l'index de l'égalité professionnelle",
    affichages: "Mettre en place les affichages obligatoires",
    registre: "Tenir le registre unique du personnel",
    bdese: "Constituer la base de données (BDESE)",
    entretiens: "Organiser les entretiens de parcours professionnel",
    embauche: "Embaucher : les formalités obligatoires",
    conges: "Organiser les congés payés",
    findecontrat: "Établir les documents de fin de contrat",
  };

  /* Ce que l'utilisateur a à faire, dit comme il le dirait — « faire le
     règlement intérieur », non « ouvrir le parcours n° 5 ». */
  var ACTIONS = {
    ri: "Faire le règlement intérieur →",
    duerp: "Faire le document unique →",
    installation: "Installer le comité →",
    commissions: "Constituer la commission santé-sécurité →",
    bdese: "Constituer la base de données →",
    registre: "Ouvrir le registre du personnel →",
    index: "Publier l'index de l'égalité →",
    nao: "Ouvrir les négociations →",
  };

  function rubrique(id) {
    var s = String(id || "");
    var m = s.match(/^([A-Z]+-CTL-[A-Z0-9]+)-/) || s.match(/^(CTL-[A-Z0-9]+)-/);
    return m ? m[1] : null;
  }

  window.ParcoursLien = {
    /* Le parcours qui régularise ce contrôle, ou null. */
    pour: function (id) {
      var r = rubrique(id);
      return (r && RUBRIQUES[r]) || null;
    },
    /* Le lien tout fait, ou une chaîne vide — à concaténer sans condition. */
    lien: function (id, classe) {
      var p = this.pour(id);
      if (!p) return "";
      return '<a' + (classe ? ' class="' + classe + '"' : "") +
        ' href="parcours.html?p=' + p.p + '">Procédure pas à pas : « ' + p.nom + " » →</a>";
    },

    /* LA BASCULE. Quand le questionnaire apprend que la pièce n'existe pas,
       il n'a plus rien à demander sur elle : continuer à l'interroger sur le
       contenu d'un document inexistant serait du temps perdu. On bascule
       aussitôt sur la procédure qui le fait naître.

       `table` associe le nom d'un champ à { p: parcours, si: fonction }. La
       bascule ne part que sur la réponse « non » — « en cours » et « autre »
       ne concluent rien, et « oui » n'appelle pas de création —, et seulement
       si la pièce est due : `si` le dit quand un seuil commande.

       Appelée depuis le gestionnaire « change » du questionnaire, avec
       l'événement. */
    /* LA PREMIÈRE PIÈCE MANQUANTE, et l'action qui la crée. Sert au bouton de
       tête de la barre d'actions du questionnaire : quand la pièce n'existe
       pas, l'action principale n'est pas de lire un rapport sur son absence,
       c'est de la faire. Rend null si rien ne manque. */
    premiere: function (table, valeur) {
      var trouve = null;
      Object.keys(table || {}).forEach(function (nom) {
        if (trouve) return;
        var b = table[nom];
        var v = valeur(nom);
        if (v !== false && String(v) !== "non") return;
        if (typeof b.si === "function" && !b.si()) return;
        if (!PAR_CLE[b.p]) return;
        trouve = { p: b.p, nom: PAR_CLE[b.p], action: ACTIONS[b.p] || ("Ouvrir « " + PAR_CLE[b.p] + " »") };
      });
      return trouve;
    },

    /* LA BASCULE. Quand le questionnaire apprend que la pièce n'existe pas,
       il n'a plus rien à demander sur elle : continuer à l'interroger sur le
       contenu d'un document inexistant serait du temps perdu. On bascule
       aussitôt sur la procédure qui le fait naître.

       `table` associe le nom d'un champ à { p: parcours, si: fonction }. La
       bascule ne part que sur la réponse « non » — « en cours » et « autre »
       ne concluent rien, et « oui » n'appelle pas de création —, et seulement
       si la pièce est due : `si` le dit quand un seuil commande.

       Appelée depuis le gestionnaire « change » du questionnaire, avec
       l'événement. */
    /* LA PREMIÈRE PIÈCE MANQUANTE, et l'action qui la crée. Sert au bouton de
       tête de la barre d'actions du questionnaire : quand la pièce n'existe
       pas, l'action principale n'est pas de lire un rapport sur son absence,
       c'est de la faire. Rend null si rien ne manque. */
    premiere: function (table, valeur) {
      var trouve = null;
      Object.keys(table || {}).forEach(function (nom) {
        if (trouve) return;
        var b = table[nom];
        var v = valeur(nom);
        if (v !== false && String(v) !== "non") return;
        if (typeof b.si === "function" && !b.si()) return;
        if (!PAR_CLE[b.p]) return;
        trouve = { p: b.p, nom: PAR_CLE[b.p], action: ACTIONS[b.p] || ("Ouvrir « " + PAR_CLE[b.p] + " »") };
      });
      return trouve;
    },

    /* « NON » VEUT DIRE : ON CONSTRUIT, TOUT DE SUITE.

       La bascule ne jouait qu'à l'instant de la réponse. En rouvrant le
       dossier le lendemain, la réponse « non » déjà enregistrée, on
       retombait sur le questionnaire : il fallait encore cliquer. Une
       question à laquelle on a répondu « non » n'a pas à être reposée, et
       la procédure n'a pas à être demandée deux fois.

       Le seul risque est la boucle — l'audit renvoie au parcours, le
       parcours renvoie à l'audit, qui renvoie au parcours. Le lien de
       retour du parcours porte donc « ?revoir=1 », et ce paramètre suspend
       la bascule le temps d'une visite : on peut ainsi revenir corriger sa
       réponse. */
    basculeAuChargement: function (table, valeur) {
      try {
        if (new URLSearchParams(location.search).get("revoir")) return false;
      } catch (_) {}
      var due = this.premiere(table, valeur);
      if (!due) return false;
      location.replace("parcours.html?p=" + due.p);
      return true;
    },

    bascule: function (ev, table) {
      if (!ev || !ev.target) return false;
      /* Les modules ne nomment pas leurs champs de la même façon : la
         discipline et la BDESE emploient l'attribut « name », le comité, la
         santé-sécurité, la négociation et le plan de sauvegarde emploient
         « data-nom ». On lit les deux plutôt que d'uniformiser six pages. */
      var nom = ev.target.name ||
        (ev.target.getAttribute && ev.target.getAttribute("data-nom")) || "";
      if (!nom) return false;
      var b = table && table[nom];
      if (!b) return false;
      if (String(ev.target.value) !== "non") return false;
      if (typeof b.si === "function" && !b.si()) return false;
      location.href = "parcours.html?p=" + b.p;
      return true;
    },
  };
})();
