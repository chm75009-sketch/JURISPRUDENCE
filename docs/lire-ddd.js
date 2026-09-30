/* LE FICHIER BRUT DE LA CARTE DE CONDUCTEUR.

   POURQUOI CE FICHIER EXISTE

   L'écran du décompte des heures refusait les .ddd : « son format vient des
   annexes du règlement européen, et un décompte qu'on ne peut pas vérifier ne
   vaut rien ». C'était vrai du décompte, pas du fichier : sa structure est
   publique, et le bloc des activités du conducteur se lit. Le reproche revient
   trois fois dans les contre-vérifications, la dernière le 29 septembre 2026,
   « .ddd expliqué, non lu ».

   CE QU'IL LIT, ET CE QU'IL NE LIT PAS

   Il lit le bloc des activités journalières d'une carte de conducteur, celui
   qui porte, pour chaque jour, la suite des changements d'activité avec leur
   minute. De là viennent le début de journée, la fin, et le total des pauses :
   les trois colonnes que le relevé attend.

   Il ne vérifie AUCUNE signature. Un .ddd est scellé : la carte signe ses
   blocs, et cette signature se vérifie avec les certificats de l'autorité
   européenne, que l'application n'a pas. Le fichier est donc lu comme un
   tableau que quelqu'un aurait tapé : il peut avoir été modifié, et rien ici ne
   le dira. C'est écrit à l'écran, à côté des jours décodés, et l'utilisateur
   confirme avant que quoi que ce soit entre dans le relevé.

   Il ne lit pas les fichiers de l'unité embarquée (.esm, .v1b, .tgd) : leur
   structure n'est pas celle de la carte, et ce qui n'a pas été essayé n'est pas
   annoncé.

   LA STRUCTURE, TELLE QU'ELLE EST LUE

   Un .ddd de carte est une suite de blocs :

       identifiant du fichier   2 octets
       marque                   1 octet   (0x00 données, 0x01 signature)
       longueur                 2 octets
       données                  longueur octets

   Le bloc cherché porte l'identifiant 0x0504, « Driver_Activity_Data ». Son
   contenu :

       pointeur du plus ancien jour   2 octets
       pointeur du plus récent        2 octets
       tampon circulaire des jours    le reste

   Et chaque jour, dans ce tampon :

       longueur de l'enregistrement précédent   2 octets
       longueur de cet enregistrement           2 octets
       date                                     4 octets, secondes depuis 1970
       compteur de présence du jour             2 octets
       distance du jour                         2 octets
       changements d'activité                   2 octets chacun, jusqu'au bout

   Un changement d'activité tient sur seize bits :

       bit 15      emplacement : conducteur ou convoyeur
       bit 14      équipage
       bits 13-12  activité : 0 repos, 1 disponibilité, 2 travail, 3 conduite
       bits 11-0   la minute, comptée depuis minuit

   Le tampon est circulaire : les jours s'y suivent, et le dernier est suivi du
   plus ancien. On part du pointeur du plus ancien et on avance de la longueur
   de chaque enregistrement, en repassant au début quand on dépasse la fin.

   USAGE

     LireDDD.jours(file)  →  Promise([{ iso, debut, fin, pause, conduite,
                                         travail, disponibilite, repos,
                                         distance, emplacement }, ...])

   Tout se fait sur le poste : rien n'est envoyé.                            */

"use strict";
(function (window) {

  /* Les identifiants des blocs d'une carte de conducteur. Seul le premier est
     lu ; les autres sont nommés pour que le message d'échec puisse dire ce
     qu'il a trouvé plutôt que « fichier illisible ». */
  var EF = {
    0x0504: "activités du conducteur",
    0x0501: "identification de la carte",
    0x0502: "certificat de la carte",
    0x0505: "véhicules utilisés",
    0x0506: "lieux de début et de fin de journée",
    0x0507: "situations de conduite en équipage",
    0x0508: "conditions particulières",
  };

  var ACTIVITES = ["repos", "disponibilite", "travail", "conduite"];

  function mot(t, i) { return (t[i] << 8) | t[i + 1]; }
  function long32(t, i) {
    return ((t[i] << 24) | (t[i + 1] << 16) | (t[i + 2] << 8) | t[i + 3]) >>> 0;
  }

  /* Les blocs du fichier, dans l'ordre où ils s'y trouvent. Un fichier tronqué
     s'arrête là où il est tronqué : on garde ce qui précède. */
  function blocs(t) {
    var out = [], i = 0;
    while (i + 5 <= t.length) {
      var fid = mot(t, i), marque = t[i + 2], n = mot(t, i + 3);
      if (i + 5 + n > t.length) break;
      out.push({ fid: fid, marque: marque, debut: i + 5, fin: i + 5 + n });
      i += 5 + n;
    }
    return out;
  }

  /* La date d'un jour : quatre octets, le nombre de secondes depuis le
     1er janvier 1970, à midi UTC pour le jour courant. On n'en garde que la
     date, jamais l'heure : le relevé compte des journées. */
  function jourIso(secondes) {
    if (!secondes) return "";
    var d = new Date(secondes * 1000);
    if (isNaN(d.getTime())) return "";
    var deux = function (x) { return (x < 10 ? "0" : "") + x; };
    return d.getUTCFullYear() + "-" + deux(d.getUTCMonth() + 1) + "-" + deux(d.getUTCDate());
  }

  function hhmm(minutes) {
    var m = Math.max(0, Math.min(1439, Math.round(minutes)));
    var deux = function (x) { return (x < 10 ? "0" : "") + x; };
    return deux(Math.floor(m / 60)) + ":" + deux(m % 60);
  }

  /* Un enregistrement de jour, décodé. Les changements d'activité sont des
     instants : la durée d'une activité court jusqu'au changement suivant, et la
     dernière court jusqu'à la fin de la journée telle que la carte la donne,
     c'est-à-dire jusqu'au dernier changement enregistré. On ne prolonge pas
     jusqu'à minuit : ce serait inventer du temps. */
  function unJour(t, deb, fin) {
    if (fin - deb < 12) return null;
    var date = long32(t, deb + 4);
    var distance = mot(t, deb + 10);
    var chgts = [];
    for (var i = deb + 12; i + 2 <= fin; i += 2) {
      var v = mot(t, i);
      chgts.push({
        equipage: !!(v & 0x4000),
        convoyeur: !!(v & 0x8000),
        activite: ACTIVITES[(v >> 12) & 0x03],
        minute: v & 0x07ff,
      });
    }
    chgts.sort(function (a, b) { return a.minute - b.minute; });
    var duree = { repos: 0, disponibilite: 0, travail: 0, conduite: 0 };
    for (var k = 0; k < chgts.length; k++) {
      var jusqua = (k + 1 < chgts.length) ? chgts[k + 1].minute : chgts[k].minute;
      duree[chgts[k].activite] += Math.max(0, jusqua - chgts[k].minute);
    }
    /* Le début et la fin de la journée : le premier et le dernier instant qui
       ne sont pas du repos. Une journée entièrement au repos n'a ni l'un ni
       l'autre, et elle est rendue comme telle. */
    var actifs = chgts.filter(function (c) { return c.activite !== "repos"; });
    var debutMin = actifs.length ? actifs[0].minute : null;
    var finMin = null;
    if (actifs.length) {
      var dernier = actifs[actifs.length - 1];
      var apres = chgts.filter(function (c) { return c.minute > dernier.minute; })[0];
      finMin = apres ? apres.minute : dernier.minute;
    }
    /* La pause : le repos pris ENTRE le début et la fin de la journée. Le repos
       d'avant la prise de poste et celui d'après n'en sont pas. */
    var pause = 0;
    if (debutMin !== null && finMin !== null) {
      for (var j = 0; j < chgts.length; j++) {
        if (chgts[j].activite !== "repos") continue;
        if (chgts[j].minute < debutMin || chgts[j].minute >= finMin) continue;
        var suite = (j + 1 < chgts.length) ? Math.min(chgts[j + 1].minute, finMin) : finMin;
        pause += Math.max(0, suite - chgts[j].minute);
      }
    }
    return {
      iso: jourIso(date),
      debut: debutMin === null ? "" : hhmm(debutMin),
      fin: finMin === null ? "" : hhmm(finMin),
      pause: pause,
      conduite: duree.conduite,
      travail: duree.travail,
      disponibilite: duree.disponibilite,
      repos: duree.repos,
      distance: distance,
      emplacement: chgts.length && chgts[0].convoyeur ? "convoyeur" : "conducteur",
      changements: chgts.length,
    };
  }

  /* Le tampon circulaire, parcouru du plus ancien jour au plus récent. La
     boucle est bornée par le nombre de jours qu'un tampon peut porter : un
     pointeur faux ne doit pas la faire tourner sans fin. */
  function joursDuBloc(t, deb, fin) {
    var taille = fin - deb;
    if (taille < 8) return [];
    var vieux = mot(t, deb);
    var zone = deb + 4, n = taille - 4;
    if (n <= 0 || vieux >= n) return [];
    var out = [], vus = {}, p = vieux, tours = 0;
    while (tours++ < 600) {
      if (p + 4 > n) break;
      var lg = mot(t, zone + p + 2);
      if (lg < 12 || lg > n) break;
      if (vus[p]) break;
      vus[p] = true;
      /* Un enregistrement peut enjamber la fin du tampon : on le recolle. */
      var morceau;
      if (p + lg <= n) {
        morceau = t.subarray(zone + p, zone + p + lg);
      } else {
        morceau = new Uint8Array(lg);
        var tete = n - p;
        morceau.set(t.subarray(zone + p, zone + n), 0);
        morceau.set(t.subarray(zone, zone + (lg - tete)), tete);
      }
      var j = unJour(morceau, 0, lg);
      if (j && j.iso) out.push(j);
      p = (p + lg) % n;
      if (p === vieux) break;
    }
    /* Le même jour peut apparaître deux fois dans un tampon réécrit : on garde
       le dernier, qui est le plus complet. */
    var parJour = {};
    out.forEach(function (j) { parJour[j.iso] = j; });
    return Object.keys(parJour).sort().map(function (k) { return parJour[k]; });
  }

  function jours(f) {
    if (!f) return Promise.reject(new Error("aucun fichier"));
    return f.arrayBuffer().then(function (b) {
      var t = new Uint8Array(b);
      var B = blocs(t);
      if (!B.length) throw new Error("structure");
      var vu = B.filter(function (x) { return x.fid === 0x0504 && x.marque === 0x00; })[0];
      if (!vu) {
        var noms = [];
        B.forEach(function (x) {
          var nom = EF[x.fid];
          if (nom && noms.indexOf(nom) < 0) noms.push(nom);
        });
        var e = new Error("activites");
        e.trouve = noms;
        throw e;
      }
      var J = joursDuBloc(t, vu.debut, vu.fin);
      if (!J.length) throw new Error("vide");
      return J;
    });
  }

  window.LireDDD = { jours: jours, blocs: blocs, EF: EF };

})(window);
