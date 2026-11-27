/* LA RECHERCHE DU CHEF DE PARC : une barre, un micro, et on arrive au bon
   endroit.

   Le chef de parc n'a pas tout le menu de l'application : il a son parc, et
   trois gestes qui reviennent, faire un entretien, déclarer une réparation,
   déclarer un sinistre. Il le dit ou il l'écrit, on comprend, et un grand
   bouton l'ouvre. Même principe que la recherche de l'accueil, mais réduit à
   ce qui le concerne.

   Demande du 11 novembre 2026 : « pour le chef de parc, comme on l'a fait pour
   tous les autres, touche recherche, et avec la voix vocale aussi. Il
   recherche faire un entretien, une réparation, déclarer un sinistre. »

   Tout se calcule dans le navigateur, hors ligne, sans serveur et sans
   intelligence artificielle : on normalise le texte et on compte les
   mots-clés. */
(function () {
  "use strict";

  /* Les destinations du parc, et seulement elles : le chef de parc ne sort pas
     de son espace. Chaque entrée mène à une page qui existe pour lui. */
  var DEST = [
    { nom: "Faire un entretien ou une réparation", ou: "Ouvrir un véhicule, onglet Entretien",
      page: "flotte.html?faire=entretien",
      mots: "entretien entretenir entretiens reparation reparations reparer repare vidange vidanger revision reviser maintenance intervention intervenir panne pannes tombe depanner depannage depanneuse remorquer remorquage travaux garage garagiste concession atelier mecanique mecanicien pneu pneus pneumatique pneumatiques crevaison creve permutation geometrie parallelisme frein freins freinage plaquette plaquettes disque disques embrayage boite vitesse huile niveau niveaux liquide adblue filtre filtres courroie distribution batterie demarre demarrage ampoule eclairage phare phares feu feux clignotant amortisseur amortisseurs suspension direction moteur turbo injecteur radiateur refroidissement fuite fuit bruit voyant clim climatisation chauffage essuie glace balai retroviseur hayon benne frigo groupe froid graissage graisser lavage laver nettoyer nettoyage carrosserie peinture debosselage soudure changer remplacer piece pieces faire note kilometres" },
    { nom: "Déclarer un sinistre", ou: "Accident, bris de glace, vol...",
      page: "parc-sinistres.html",
      mots: "sinistre sinistres accident accidente accidents declarer declaration bris glace pare brise impact fissure vol vole volee voler cambriole cambriolage effraction carburant gasoil siphonne incendie feu brule vandalisme vandalise tague casse choc degat degats dommage dommages collision accroche accrochage accroché heurte percute tamponne rentre dedans marche arriere constat amiable expert expertise franchise assurance assureur tiers rayure raye carrosserie enfonce pietons blesse recule reculer reculant arrache arracher retroviseur mur poteau barriere portail quai" },
    { nom: "Voir les dépenses du parc", ou: "Coûts d'entretien, par véhicule",
      page: "parc-depenses.html",
      mots: "depense depenses cout couts coute facture factures facturer devis combien prix budget argent depenser total somme montant euros ht ttc paye payer garage garages garagiste regle achat achete frais historique annee mois comparer rentabilite cher" },
    { nom: "Liste des véhicules", ou: "Chercher un camion, sa fiche",
      page: "flotte.html",
      mots: "vehicule vehicules camion camions voiture voitures fourgon fourgons utilitaire utilitaires porteur porteurs tracteur tracteurs semi remorque remorques poids lourd lourds pl vl flotte parc liste tous immatriculation immat plaque chercher trouver rechercher fiche fiches conducteur chauffeur affectation affecter attribuer kilometrage compteur photo photos document documents carte grise marque modele ajouter nouveau acheter vendre vendu sortir" },
    { nom: "Échéances à surveiller", ou: "Contrôles et assurances qui approchent",
      page: "flotte.html?etat=proche",
      mots: "echeance echeances controle technique ct assurance attestation alerte alertes date dates expire expiration bientot prochain prochaine prochains approche arrive surveiller rappel limiteur vitesse chronotachygraphe tachygraphe etalonnage licence copie conforme extincteur extincteurs renouveler renouvellement tachy mines" },
    { nom: "Échéances dépassées", ou: "Ce qui n'est plus à jour",
      page: "flotte.html?etat=depasse",
      mots: "controle technique ct assurance depasse depassee depassees depasses retard perime perimee perimes expire expiree expirees caduc hors delai oublie oublies plus jour plus valable pas jour" },
    { nom: "Véhicules sans relevé kilométrique", ou: "Kilométrage à saisir",
      page: "flotte.html?etat=sanskm",
      mots: "camion camions vehicule vehicules sans releve kilometrique kilometrage km kilometres compteur saisir releve noter releves manquant" },
    { nom: "Véhicules sans conducteur", ou: "Camions libres",
      page: "flotte.html?etat=libre",
      mots: "camion camions vehicule vehicules sans conducteur libre libres disponible disponibles dispo inutilise inutilises gare parking reserve personne affecte" },
    { nom: "Fiches à compléter", ou: "Véhicules incomplets",
      page: "flotte.html?etat=incomplet",
      mots: "camion camions vehicule vehicules fiche fiches completer incomplet incomplete incompletes incomplets manque manquant manquante informations infos renseigner remplir vide vides" },
    { nom: "Tableau de bord du parc", ou: "La synthèse du parc",
      page: "parc-tableau.html",
      /* « chef de parc » mène à son tableau de bord, pas aux dépenses
         (relevé le 27 novembre 2026). */
      mots: "chef parc espace tableau bord synthese resume vue ensemble accueil indicateur indicateurs kpi structure surveillance etat general bilan point chiffres statistiques stats graphique" },
    { nom: "Paramètres du parc", ou: "Listes et réglages",
      page: "parc-parametres.html",
      mots: "ajouter liste parametres parametre reglages reglage regler listes types type depenses garages garage entreprises fournisseurs prestataires configurer configuration personnaliser categories" },
    { nom: "Contrôler les papiers à bord", ou: "Ouvrir un véhicule, onglet À bord",
      page: "flotte.html?faire=bord",
      mots: "papiers bord documents carte grise licence copie conforme lettre voiture triangle gilet proces verbal controle controler verifier cocher manque manquant" }
  ];

  /* Quand rien n'est compris, on propose les trois gestes les plus courants. */
  var PLUS = ["flotte.html", "parc-sinistres.html", "parc-depenses.html"];

  var VIDES = { "je": 1, "j": 1, "veux": 1, "veut": 1, "voudrais": 1, "souhaite": 1, "faire": 1,
    "fais": 1, "faut": 1, "un": 1, "une": 1, "des": 1, "le": 1, "la": 1, "les": 1, "de": 1,
    "du": 1, "d": 1, "a": 1, "au": 1, "aux": 1, "pour": 1, "mon": 1, "ma": 1, "mes": 1,
    "ce": 1, "cette": 1, "comment": 1, "ou": 1, "et": 1, "en": 1, "sur": 1, "avec": 1,
    "me": 1, "se": 1, "son": 1, "sa": 1, "il": 1, "elle": 1, "y": 1, "ne": 1, "plus": 1, "pas": 1,
    "est": 1, "qu": 1, "que": 1, "qui": 1, "on": 1, "nous": 1, "vous": 1, "ils": 1, "elles": 1,
    "mais": 1, "donc": 1, "par": 1, "dans": 1, "chez": 1, "ai": 1, "as": 1, "avoir": 1,
    "voir": 1, "afficher": 1, "montrer": 1, "ouvrir": 1 };

  function norm(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9 ]/g, " ");
  }
  function toks(s) {
    return norm(s).split(/\s+/).filter(function (w) { return w.length > 1 && !VIDES[w]; });
  }
  DEST.forEach(function (d) {
    d._m = norm(d.nom + " " + d.mots).split(/\s+/).filter(Boolean);
    d._s = " " + toks(d.nom).join(" ") + " | " + toks(d.mots).join(" ") + " ";
  });

  /* DEUX MOTS QUI SE SUIVENT DISENT PLUS QU'UN MOT SEUL : quand deux mots de
     la demande se suivent aussi dans l'entrée, l'entrée gagne deux points. */
  function expressions(d, qs) {
    var s = 0;
    for (var i = 0; i + 1 < qs.length; i++) {
      if (d._s.indexOf(" " + qs[i] + " " + qs[i + 1]) >= 0) s += 2;
    }
    return s;
  }

  /* LES MOTS DE PERSONNE NE DÉCIDENT PAS. Relevé le 25 novembre 2026 :
     « sanctionner un chauffeur » ouvrait la liste des véhicules, parce que
     « chauffeur » y figure. Ces mots désignent quelqu'un, pas ce qu'on veut
     faire : ils ne comptent plus que pour un point. */
  var GENERIQUES = { chauffeur: 1, chauffeurs: 1, conducteur: 1, conducteurs: 1, salarie: 1,
    salaries: 1, employe: 1, employes: 1, personne: 1, gars: 1, quelqu: 1, homme: 1, lui: 1,
    /* Le camion désigne l'objet, pas le geste : « camion volé » est un sinistre,
       « camion en panne » un entretien. */
    camion: 1, camions: 1, vehicule: 1, vehicules: 1, voiture: 1, voitures: 1 };

  /* CE QUI N'EST PAS DU PARC. Une sanction, un contrat, la paie, un arrêt :
     le chef de parc n'en a pas la main. Plutôt que de l'envoyer n'importe où,
     on le lui dit. */
  var HORS_PARC = ["sanction", "sanctionn", "avertiss", "avertir", "blame", "punir", "punition",
    "licenci", "renvoy", "virer", "vire", "mise a pied", "faute", "contrat", "embauch", "recrut",
    "salaire", "paie", "paye", "conge", "demission", "rupture", "absence", "absent", "abandon",
    "retard", "arret maladie", "maladie", "inaptitude", "visite medicale", "discipl", "convoc",
    "entretien prealable", "heures supp", "prime", "mutuelle",
    "avertis", "recadr", "reprimand", "engueul", "mise en demeure", "cdd", "cdi", "avenant", "dpae",
    "salair", "bulletin", "fiche de paie", "remuner", "augment", "conges", "vacances", "rtt", "demissio",
    "arret de travail", "accident du travail", "medecin du travail", "inapte", "reclass", "cse",
    "election", "syndic", "greve", "urssaf", "prud", "harcel", "mutuel", "retraite", "formation",
    "entretien annuel", "entretien professionnel", "promesse d embauche", "periode d essai",
    "solde de tout compte", "certificat de travail", "rupture conventionnelle", "amende", "contravention",
    "radar", "designer le conducteur", "pv de stationnement", "exces de vitesse", "malade",
    "vient plus", "revient plus", "venu travailler", "pas venu",
    /* Relevé le 27 novembre 2026 : le registre du personnel, le document
       unique, la fiche d'un salarié, les heures supplémentaires et les
       papiers personnels du chauffeur (permis, carte conducteur, FIMO, FCO)
       ouvraient un écran du parc ou « Je n'ai pas compris ». Ce sont des
       sujets de la direction : le chef de parc reçoit le message hors parc. */
    "registre du personnel", "registre unique", "personnel", "document unique", "duerp",
    "fiche salari", "fiche du salari", "fiche de salari", "fiches salari", "fiches des salari",
    "dossier du salari", "dossier salari", "heures sup", "heure sup",
    "papiers du chauffeur", "papier du chauffeur", "papiers chauffeur", "papiers du conducteur",
    "papier du conducteur", "papiers conducteur", "permis", "carte conducteur", "carte de conducteur",
    "carte du conducteur", "fimo", "fco", "reglement interieur", "attestation employeur",
    "france travail", "pole emploi",
    /* Relevé le 27 novembre 2026 : « combien de temps je peux conduire ? »
       ouvrait les dépenses et « forfait jours cadre » n'était pas compris.
       Le temps de conduite et de repos du chauffeur et le forfait en jours
       sont des sujets de la direction. */
    "combien de temps", "temps de conduite", "conduire", "conduite", "temps de repos", "repos", "amplitude",
    "forfait", "cadre"];

  /* LES EXPRESSIONS MAL TAPÉES SONT AUSSI HORS DU PARC. Relevé le
     27 novembre 2026 : « entretine prépalable » ouvrait l'entretien des
     camions, parce que « entretine » ressemble à « entretien ». Une
     expression de plusieurs mots est reconnue quand chacun de ses mots l'est,
     au début du mot ou à une faute de frappe près (voir proche) ; un mot seul
     ne l'est qu'à son début, pour qu'une faute ne fasse pas d'un mot du parc
     un mot de la direction. La demande se lit mot à mot ; les mots pris par
     une expression hors du parc sont retirés de ce qui reste. */
  var HORS_TRIES = HORS_PARC.slice().sort(function (a, b) { return b.length - a.length; })
    .map(function (h) { return h.split(" "); });
  function motHors(q, h, flou) {
    return q.indexOf(h) === 0 || (flou && proche(q, h));
  }
  function analyser(texte) {
    var w = norm(texte).split(/\s+/).filter(Boolean), pris = [], hors = false, i, j, k;
    /* « entretien annuel du camion » est l'entretien d'un véhicule, pas
       l'entretien annuel d'un salarié (relevé le 27 novembre 2026) : quand la
       demande nomme un véhicule, « entretien ... » reste du parc. */
    var vehicule = w.some(function (x) { return /^(camion|vehicule|voiture|remorque|semi|tracteur|porteur|utilitaire|fourgon|poids)/.test(x); });
    /* Les expressions longues d'abord : « fiche de paie » avant « paie ». */
    for (k = 0; k < HORS_TRIES.length; k++) {
      var hw = HORS_TRIES[k], flou = hw.length > 1;
      if (vehicule && hw[0] === "entretien") continue;
      for (i = 0; i + hw.length <= w.length; i++) {
        for (j = 0; j < hw.length; j++) if (pris[i + j] || !motHors(w[i + j], hw[j], flou)) break;
        if (j === hw.length) { for (j = 0; j < hw.length; j++) pris[i + j] = true; hors = true; }
      }
    }
    return { hors: hors, reste: w.filter(function (x, n) { return !pris[n]; }) };
  }
  /* Ce qui reste de la demande une fois retirés les mots hors du parc :
     « accident du travail » ne laisse pas « accident » passer pour un sinistre. */
  function resteDuParc(texte) {
    return " " + analyser(texte).reste.join(" ") + " ";
  }
  function horsParc(texte) {
    return analyser(texte).hors;
  }

  /* « PAS ÇA ? » NE PROPOSE QUE CE QUI A UN VRAI RAPPORT (27 novembre 2026) :
     une autre piste n'est retenue que si elle obtient au moins les trois
     quarts du score de la première. Trois au plus. */
  var SEUIL_AUTRES = 0.75;
  function retenir(liste) {
    if (!liste.length) return [];
    var min = liste[0].s * SEUIL_AUTRES;
    return [liste[0]].concat(liste.slice(1).filter(function (o) { return o.s >= min; }).slice(0, 3));
  }

  /* LES FORMES D'UN MÊME MOT. « téléphonait » est « téléphone », « camions »
     est « camion », « malade » est « maladie » : un mot reconnu à sa racine
     compte comme un début de mot. Le reste de la phrase ne trompe pas pour
     autant : « contrat » ne rejoint pas « contravention », la fin diffère. */
  function memeRacine(q, m) {
    if (m.length >= 5 && q.indexOf(m) === 0) return true;
    var court = q.length <= m.length ? q : m, long = court === q ? m : q;
    if (court.length < 5) return false;
    var n = 0;
    while (n < court.length && court.charAt(n) === long.charAt(n)) n++;
    return n >= court.length - 1 && "ersx".indexOf(court.charAt(court.length - 1)) >= 0;
  }

  /* LES MOTS MAL TAPÉS. Relevé le 25 novembre 2026 : « entretine
     prépalable » ne menait nulle part. Une lettre de trop, de moins, changée
     ou inversée (deux à partir de huit lettres) : le mot est reconnu comme
     celui qu'on voulait écrire. Seulement pour les mots de cinq lettres et
     plus, pour que « vol » ne devienne pas « col ». */
  function proche(q, m) {
    if (q.length < 5 || m.length < 5) return false;
    var max = Math.min(q.length, m.length) >= 8 ? 2 : 1;
    if (Math.abs(q.length - m.length) > max) return false;
    var a = [], i, j;
    for (i = 0; i <= q.length; i++) { a[i] = [i]; }
    for (j = 0; j <= m.length; j++) a[0][j] = j;
    for (i = 1; i <= q.length; i++) {
      var minLigne = 99;
      for (j = 1; j <= m.length; j++) {
        var c = q.charAt(i - 1) === m.charAt(j - 1) ? 0 : 1;
        var v = Math.min(a[i - 1][j] + 1, a[i][j - 1] + 1, a[i - 1][j - 1] + c);
        if (i > 1 && j > 1 && q.charAt(i - 1) === m.charAt(j - 2) && q.charAt(i - 2) === m.charAt(j - 1)) v = Math.min(v, a[i - 2][j - 2] + 1);
        a[i][j] = v; if (v < minLigne) minLigne = v;
      }
      if (minLigne > max) return false;
    }
    return a[q.length][m.length] <= max;
  }

  function score(d, qs) {
    if (!qs.length) return 0;
    var s = 0, lus = [];
    qs.forEach(function (q) {
      var hit = 0, i, lu = q;
      for (i = 0; i < d._m.length; i++) {
        if (d._m[i] === q) { hit = 3; break; }
        if (!hit && d._m[i].indexOf(q) === 0) { hit = 2; lu = d._m[i]; }
      }
      if (!hit) {
        for (i = 0; i < d._m.length; i++) { if (memeRacine(q, d._m[i])) { hit = 2; lu = d._m[i]; break; } }
      }
      if (!hit) { for (i = 0; i < d._m.length; i++) { if (d._m[i].indexOf(q) > 0) { hit = 1; break; } } }
      if (!hit) {
        for (i = 0; i < d._m.length; i++) { if (proche(q, d._m[i])) { hit = 2; lu = d._m[i]; break; } }
      }
      if (GENERIQUES[q] && hit) hit = 1;
      s += hit; lus.push(lu);
    });
    return s ? s + expressions(d, lus) : 0;
  }
  function classer(texte) {
    var qs = toks(texte);
    if (!qs.length) return [];
    return DEST.map(function (d) { return { d: d, s: score(d, qs) }; })
      .filter(function (o) { return o.s > 0; })
      .sort(function (a, b) { return b.s - a.s; });
  }
  function parPage(page) { for (var i = 0; i < DEST.length; i++) if (DEST[i].page === page) return DEST[i]; return null; }

  var CSS = '' +
    '.rp-carte{background:var(--surface,#fff);border:1px solid var(--filet,#dcdfe4);' +
    'border-radius:16px;padding:15px 16px;margin:16px 0 0;box-shadow:0 1px 2px rgba(22,24,29,.05)}' +
    '.rp-tete{display:flex;align-items:center;gap:13px;margin:0 2px 12px}' +
    '.rp-mic{flex:0 0 auto;width:52px;height:52px;box-sizing:border-box;padding:0;border:0;border-radius:50%;' +
    'background:#efeefc;color:#4f46e5;cursor:pointer;display:flex;align-items:center;justify-content:center;' +
    '-webkit-appearance:none;appearance:none}' +
    '.rp-mic svg{width:24px;height:24px}' +
    '.rp-mic.rp-indispo{opacity:.55}' +
    '.rp-mic.rp-on{background:#fde7e7;color:var(--rouge,#c0392b);animation:rp-pulse 1s ease-in-out infinite}' +
    '@keyframes rp-pulse{0%,100%{opacity:1}50%{opacity:.45}}' +
    '.rp-titre{font:700 16px/1.2 inherit;color:var(--texte,#16181d)}' +
    '.rp-sous{display:block;color:var(--texte-2,#5f6874);font-size:13px;margin-top:2px}' +
    '.rp-ligne{display:flex;gap:9px}' +
    '.rp-champ{flex:1 1 auto;min-width:0;border:1px solid var(--filet,#cfd6e0);border-radius:12px;' +
    'background:var(--fond-champ,#f7f8fa);color:var(--texte,#16181d);font:inherit;font-size:16px;padding:13px 14px;outline:0}' +
    '.rp-champ:focus{border-color:var(--accent,#1F3864);background:#fff}' +
    '.rp-ok{flex:0 0 auto;border:0;border-radius:12px;background:var(--accent,#1F3864);color:#fff;' +
    'font:700 16px inherit;padding:0 20px;min-height:48px;cursor:pointer;-webkit-appearance:none;appearance:none}' +
    '.rp-ecoute{margin:12px 2px 0;color:var(--rouge,#c0392b);font-size:14px;font-weight:600}' +
    '.rp-res{margin-top:13px;display:flex;flex-direction:column;gap:9px}' +
    '.rp-compris{color:var(--texte-2,#5f6874);font-size:14px}.rp-compris b{color:var(--texte,#16181d)}' +
    '.rp-ouvrir{display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;' +
    'background:var(--accent,#1F3864);color:#fff;border-radius:14px;padding:15px;font:700 16px inherit}' +
    '.rp-pasca{color:var(--texte-2,#5f6874);font-size:13px;margin:3px 2px 0}' +
    '.rp-autres{display:flex;flex-direction:column;gap:8px}' +
    '.rp-item{display:flex;align-items:center;gap:12px;background:var(--surface,#fff);border:1px solid var(--filet,#dcdfe4);' +
    'border-radius:12px;padding:12px 14px;text-decoration:none;color:inherit}' +
    '.rp-nom{font-size:15px;font-weight:600}' +
    '.rp-ou{display:block;color:var(--texte-2,#5f6874);font-size:13px;margin-top:1px}' +
    '.rp-fl{margin-left:auto;color:var(--texte-3,#7b838d);font-size:20px}' +
    '.rp-vide{color:var(--texte-2,#5f6874);font-size:14px;padding:4px 2px}';

  var MIC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/><path d="M8 21h8"/></svg>';
  var STOP = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';

  function construire(hote) {
    if (!document.getElementById("rp-style")) {
      var st = document.createElement("style"); st.id = "rp-style"; st.textContent = CSS;
      document.head.appendChild(st);
    }
    hote.innerHTML =
      '<div class="rp-carte">' +
      '<div class="rp-tete">' +
      '<button type="button" class="rp-mic" aria-label="Dicter">' + MIC + '</button>' +
      '<div><span class="rp-titre">Que voulez-vous faire ?</span>' +
      '<span class="rp-sous">Dites ou écrivez : un entretien, une réparation, un sinistre...</span></div>' +
      '</div>' +
      '<div class="rp-ligne">' +
      '<input class="rp-champ" type="text" inputmode="search" autocomplete="off" aria-label="Votre demande" ' +
      'placeholder="Ex. : déclarer un sinistre">' +
      '<button type="button" class="rp-ok">OK</button>' +
      '</div>' +
      '<div class="rp-ecoute" hidden>Je vous écoute...</div>' +
      '<div class="rp-res"></div>' +
      '</div>';

    var champ = hote.querySelector(".rp-champ");
    var ok = hote.querySelector(".rp-ok");
    var res = hote.querySelector(".rp-res");
    var ecoute = hote.querySelector(".rp-ecoute");
    var mic = hote.querySelector(".rp-mic");

    function blocAutres(dests) {
      var box = document.createElement("div"); box.className = "rp-autres";
      dests.forEach(function (d) {
        var a = document.createElement("a"); a.className = "rp-item"; a.href = d.page;
        a.innerHTML = '<span><span class="rp-nom"></span><span class="rp-ou"></span></span><span class="rp-fl">›</span>';
        a.querySelector(".rp-nom").textContent = d.nom;
        a.querySelector(".rp-ou").textContent = d.ou;
        box.appendChild(a);
      });
      return box;
    }

    function rendre() {
      res.textContent = "";
      var texte = champ.value.trim();
      if (!texte) return;
      var liste = retenir(classer(texte));
      /* Une demande hors du parc n'ouvre rien du parc, sauf si elle porte
         aussi un vrai geste du parc (« réparation », « sinistre »...). */
      var lu = analyser(texte);
      var gestesDuParc = toks(lu.reste.join(" ")).filter(function (q) {
        return !GENERIQUES[q] && !horsParc(q) && classer(q).some(function (o) { return o.s >= 2; });
      });
      if (lu.hors && !gestesDuParc.length) {
        var h = document.createElement("div"); h.className = "rp-vide";
        h.textContent = "Cette démarche ne se fait pas depuis l'espace du parc : sanctions, contrats, paie, absences et dossiers du personnel se traitent depuis l'accès de T.E.C. Prévenez la direction.";
        res.appendChild(h);
        return;
      }
      if (liste.length) {
        var best = liste[0].d;
        var c = document.createElement("div"); c.className = "rp-compris";
        c.innerHTML = "✓ J'ai compris : <b></b>";
        c.querySelector("b").textContent = best.nom;
        res.appendChild(c);
        var bouton = document.createElement("a"); bouton.className = "rp-ouvrir"; bouton.href = best.page;
        bouton.innerHTML = "Ouvrir <span>›</span>";
        res.appendChild(bouton);
        var autres = liste.slice(1, 4);
        if (autres.length) {
          var pasca = document.createElement("div"); pasca.className = "rp-pasca"; pasca.textContent = "Pas ça ?";
          res.appendChild(pasca);
          res.appendChild(blocAutres(autres.map(function (o) { return o.d; })));
        }
      } else {
        var v = document.createElement("div"); v.className = "rp-vide";
        v.textContent = "Je n'ai pas compris, vous vouliez peut-être :";
        res.appendChild(v);
        res.appendChild(blocAutres(PLUS.map(parPage).filter(Boolean)));
      }
    }

    var minut = null;
    champ.addEventListener("input", function () {
      if (minut) window.clearTimeout(minut);
      minut = window.setTimeout(rendre, 450);
    });
    champ.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); if (minut) window.clearTimeout(minut); rendre(); }
    });
    ok.addEventListener("click", function () { if (minut) window.clearTimeout(minut); rendre(); champ.focus(); });

    /* LE MICRO : dictée en français, le texte s'écrit en direct, arrêt au bout
       de dix secondes ou à un second appui. Sans reconnaissance vocale, on
       invite à dicter au clavier. */
    /* CHROME, FIREFOX OU EDGE SUR IPHONE NE DICTENT PAS. Relevé le
     24 novembre 2026 : « la commande vocale ne fonctionne pas sur Chrome ».
     Sur iPhone, seul Safari donne la reconnaissance vocale aux pages ; les
     autres navigateurs annoncent l'outil, mais il ne démarre jamais, sans un
     message (bogue WebKit 239816). On les reconnaît à leur nom, et le micro
     renvoie alors au micro du clavier. Et partout ailleurs, une écoute qui
     n'a pas démarré au bout de huit secondes est abandonnée avec le même
     message, plutôt que de laisser croire qu'elle écoute. */
    var IOS_AUTRE = /(CriOS|FxiOS|EdgiOS|OPiOS|GSA)\//.test(navigator.userAgent || "");
    var SR = IOS_AUTRE ? null : (window.SpeechRecognition || window.webkitSpeechRecognition);
    var reco = null, enEcoute = false, minuterie = null, guet = null, entendu = false, erreur = false;

    function finEcoute() {
      enEcoute = false; mic.classList.remove("rp-on"); mic.innerHTML = MIC; ecoute.hidden = true;
      if (minuterie) { window.clearTimeout(minuterie); minuterie = null; }
      if (guet) { window.clearTimeout(guet); guet = null; }
    }
    function message(txt) {
      res.textContent = "";
      var v = document.createElement("div"); v.className = "rp-vide"; v.textContent = txt; res.appendChild(v);
    }
    function clavier() {
      champ.focus();
      message(IOS_AUTRE
        ? "Sur iPhone, seul Safari sait dicter ici. Touchez le micro de votre clavier pour dicter, ou ouvrez l'application dans Safari."
        : "Touchez le micro de votre clavier pour dicter, ou écrivez votre demande.");
    }

    if (!SR) { mic.classList.add("rp-indispo"); mic.addEventListener("click", clavier); }
    else {
      mic.addEventListener("click", function () {
        if (enEcoute) { try { reco.stop(); } catch (e) {} return; }
        try {
          entendu = false; erreur = false;
          reco = new SR(); reco.lang = "fr-FR"; reco.interimResults = true; reco.maxAlternatives = 1;
          reco.onstart = function () {
            if (guet) { window.clearTimeout(guet); guet = null; }
            enEcoute = true; mic.classList.add("rp-on"); mic.innerHTML = STOP; ecoute.hidden = false;
            minuterie = window.setTimeout(function () { try { reco.stop(); } catch (e) {} }, 10000);
          };
          reco.onresult = function (e) {
            var t = ""; for (var k = 0; k < e.results.length; k++) t += e.results[k][0].transcript;
            if (t) { entendu = true; champ.value = t; rendre(); }
          };
          reco.onerror = function (ev) {
            finEcoute();
            var c = ev && ev.error;
            erreur = true;
            if (c !== "aborted" && window.MicroChamp && window.MicroChamp.raison) { champ.focus(); message(window.MicroChamp.raison(c)); return; }
            if (c === "not-allowed" || c === "service-not-allowed") message("Le micro n'est pas autorisé. Autorisez-le, ou écrivez votre demande.");
            else if (c === "no-speech") message("Je n'ai rien entendu. Réessayez, ou écrivez votre demande.");
            else if (c === "audio-capture") message("Aucun micro détecté. Écrivez votre demande.");
            else clavier();
          };
          reco.onend = function () {
            /* Une écoute finie sans un mot compris le dit, au lieu de se taire. */
            var vide = enEcoute && !entendu && !erreur;
            finEcoute(); champ.focus();
            if (vide && window.MicroChamp && window.MicroChamp.raison) message(window.MicroChamp.raison("rien"));
          };
          reco.start();
          guet = window.setTimeout(function () {
            guet = null;
            if (enEcoute) return;
            try { reco.abort(); } catch (e) {}
            finEcoute(); clavier();
          }, 8000);
        } catch (e) { finEcoute(); clavier(); }
      });
    }
  }

  function demarrer() {
    var hote = document.getElementById("recherche-parc");
    if (hote) construire(hote);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();
})();
