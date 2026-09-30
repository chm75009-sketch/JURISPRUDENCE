/* LA BARRE DU HAUT : RETOUR, MENU, QUITTER.

   POURQUOI CE FICHIER EXISTE

   Demande du 24 septembre 2026 : « retour en arrière à chaque étape. À chaque
   étape, et le bouton menu », et, la question d'avant, le bouton pour se
   déconnecter.

   L'application avait un retour posé par droits.js sur les pages qui le
   chargent, un lien « Accueil » sur celles qui ne le chargent pas, et rien du
   tout pour passer d'un module à l'autre : il fallait remonter à l'accueil,
   puis redescendre. Quant à quitter, cela n'existait pas.

   CE QU'IL FAIT

   - Il pose un bouton « Retour » là où il n'y en a pas, quelle que soit la
     charpente de la page (le bandeau « header.site » des pages d'audit, la
     rangée « .haut » des pages de gestion).
   - Il pose un bouton « Menu » partout, qui ouvre la liste des modules.
   - Il pose « Quitter » dans ce menu, mais seulement là où il y a une séance à
     quitter, c'est-à-dire sur l'espace d'un client, derrière son mot de passe.
     Sur l'application ouverte, il n'y a rien à quitter et le bouton ne paraît
     pas.

   LE RETOUR À CHAQUE ÉTAPE

   Une page qui avance par écrans successifs sait seule ce qu'est l'écran
   précédent. Elle le dit :

       Barre.avant(function () {
         if (surLEcranDeuxieme) { montrerPremier(); return true; }
         return false;                 // plus d'étape : on quitte la page
       });

   Tant que la fonction rend « true », le bouton reste dans la page et remonte
   les étapes une à une. Quand elle rend « false », le bouton fait ce qu'il a
   toujours fait : l'écran précédent du navigateur si l'on vient de
   l'application, l'accueil sinon.                                          */

"use strict";
(function (window, document) {

  var MODULES = [
    { page: "index.html", nom: "Accueil" },
    { page: "auditer.html", nom: "Audit et conformité" },
    { page: "gerer.html", nom: "Gestion du quotidien" },
    { page: "registre.html", nom: "Registre du personnel" },
    { page: "courriers.html", nom: "Courriers et e-mails" },
    { page: "notes-service.html", nom: "Notes de service" },
    { page: "contrats-transport.html", nom: "Contrats du transport" },
    { page: "heures.html", nom: "Décompte des heures" },
    { page: "forfait.html", nom: "Forfait en jours" },
    { page: "flotte.html", nom: "Flotte et conducteurs" },
    { page: "agenda.html", nom: "Agenda social" },
    { page: "mes-documents.html", nom: "Mes documents" },
    { page: "questions.html", nom: "Mes questions" },
    { page: "recherche.html", nom: "Recherche de jurisprudence" },
    /* TROIS ENTRÉES QUI MANQUAIENT AU MENU. « Ni contrôles, ni parcours, ni
       "Mes données" ne figurent dans le menu » : liste du 26 septembre 2026.
       Les contrôles et les parcours s'ouvrent depuis l'audit, mais celui qui
       cherche un parcours guidé n'a pas à passer par une ligne d'audit pour le
       trouver ; et les données du poste ne se géraient que par le pied de
       l'accueil, où personne ne va les chercher. */
    /* Et une quatrième, le 29 septembre 2026 : celui qui arrive avec un
       règlement intérieur sous le bras n'a pas à passer par une ligne d'audit
       pour le faire lire. controler.html réunit les neuf contrôles. */
    { page: "controler.html", nom: "Contrôler un document" },
    { page: "parcours.html", nom: "Parcours guidés" },
    { page: "documents.html", nom: "Modèles de documents" },
    { page: "index.html#mes-donnees", nom: "Mes données de ce poste" },
  ];

  var AVANT = null;
  var page = location.pathname.split("/").pop() || "index.html";

  function $(s, r) { return (r || document).querySelector(s); }

  /* ─────────────────────────── le retour ────────────────────────────── */
  function interne() {
    try { return !!document.referrer && new URL(document.referrer).origin === location.origin; }
    catch (e) { return false; }
  }

  function retourner(ev) {
    if (AVANT) {
      var reste = false;
      try { reste = AVANT() === true; } catch (e) { reste = false; }
      if (reste) { if (ev) ev.preventDefault(); return; }
    }
    if (interne() && history.length > 1) {
      if (ev) ev.preventDefault();
      history.back();
      return;
    }
    if (ev && ev.currentTarget && ev.currentTarget.getAttribute &&
        ev.currentTarget.getAttribute("href")) return;   /* le lien fait le reste */
    if (ev) ev.preventDefault();
    location.href = "index.html";
  }

  /* ──────────────────────────── le menu ─────────────────────────────── */
  function seance() {
    try { return window.sessionStorage.getItem("seance-ouverte") === "oui"; }
    catch (e) { return false; }
  }

  function fermer() {
    var p = $("#barre-menu");
    if (p) p.remove();
    document.documentElement.style.overflow = "";
  }

  function ouvrir() {
    if ($("#barre-menu")) { fermer(); return; }
    var p = document.createElement("div");
    p.id = "barre-menu";
    /* SE DÉCONNECTER SE TROUVE EN HAUT, PAS APRÈS DIX-SEPT ENTRÉES.

       Le bouton était sous la liste des modules et sous celui de
       l'installation : son sommet tombait à 1073 points sur un écran de 844,
       c'est-à-dire hors de vue, et il fallait faire défiler tout le menu pour
       fermer sa séance. Relevé le 29 septembre 2026. Il est dans la tête du
       menu, à côté de « Fermer », là où on le cherche. */
    var uT = utilisateurConnecte();
    var h = '<div class="fond" data-fermer="1"></div><nav class="feuille" aria-label="Menu">' +
      '<div class="tete"><b>Menu</b>' +
      ((uT || seance())
        ? '<button type="button" class="quitter-tete" id="barre-quitter-tete">' +
          (uT ? "Se déconnecter" : "Quitter") + "</button>"
        : "") +
      '<button type="button" class="x" data-fermer="1" aria-label="Fermer">Fermer</button></div><ul>';
    MODULES.forEach(function (m) {
      var ici = m.page === page ? ' class="ici" aria-current="page"' : "";
      h += '<li><a href="' + m.page + '"' + ici + '>' + m.nom + "</a></li>";
    });
    h += "</ul>";
    /* L'installation, à portée de doigt : demandé le 25 septembre 2026, « un
       bouton pour l'installer sur PC ou téléphone ». Le détail de ce qu'il
       fait selon le navigateur est dans installer.js. */
    h += '<button type="button" class="installer-app" id="barre-installer">' +
      "Installer l'application</button>";
    /* QUITTER, ET CHANGER SON CODE.

       Deux défauts, relevés le 26 septembre 2026. Le bouton « Quitter »
       renvoyait à « entrer.html », une page qui n'a jamais existé dans ce
       dépôt : le menu conduisait à une erreur. Et un utilisateur connecté ne
       pouvait pas changer son propre code : seul un administrateur le
       pouvait pour lui, ce qui oblige à confier son code à quelqu'un pour en
       changer.

       Le bouton ne s'affiche donc que s'il y a une séance à fermer, c'est-à-
       dire un utilisateur connecté, et il ferme cette séance-là. */
    var u = utilisateurConnecte();
    if (u) {
      h += '<button type="button" class="installer-app" id="barre-moncode">' +
        "Changer mon code d'accès</button>";
      h += '<button type="button" class="quitter" id="barre-quitter">Se déconnecter</button>' +
        '<p class="apres">Vous êtes connecté comme <b>' + ech(u.nom) + "</b>. " +
        "Le code d'accès sera redemandé à la prochaine ouverture. " +
        "Rien de ce qui est sur cet appareil n'est effacé.</p>";
    } else if (seance()) {
      h += '<button type="button" class="quitter" id="barre-quitter">Quitter</button>' +
        '<p class="apres">La séance se referme. ' +
        "Rien de ce qui est sur cet appareil n'est effacé.</p>";
    }
    h += "</nav>";
    p.innerHTML = h;
    document.body.appendChild(p);
    document.documentElement.style.overflow = "hidden";
    p.addEventListener("click", function (ev) {
      if (ev.target.getAttribute && ev.target.getAttribute("data-fermer")) fermer();
    });
    var q = $("#barre-quitter");
    if (q) q.addEventListener("click", quitter);
    var qt = $("#barre-quitter-tete");
    if (qt) qt.addEventListener("click", quitter);
    var mc = $("#barre-moncode");
    if (mc) mc.addEventListener("click", changerMonCode);
    if (window.Installer) window.Installer.brancher();
  }

  function ech(x) {
    return String(x == null ? "" : x).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function utilisateurConnecte() {
    try {
      return (window.Droits && window.Droits.utilisateur && window.Droits.utilisateur()) || null;
    } catch (e) { return null; }
  }

  /* QUITTER. La séance se referme. Ce qui est sur l'appareil n'est pas
     touché : quitter n'est pas effacer. Quand une équipe est en place, c'est
     la session de l'utilisateur qui se ferme, et l'écran de connexion revient
     là où il est demandé. */
  function quitter() {
    try { window.sessionStorage.removeItem("seance-ouverte"); } catch (e) {}
    /* LE BATTEMENT DE LA SÉANCE PARTAGÉE S'ARRÊTE AUSSI.

       Sur le site du client, la séance se partage entre onglets par une marque
       horodatée dans localStorage (verrou.js). La laisser derrière soi
       reviendrait à rouvrir la porte pendant vingt secondes après avoir cliqué
       sur « Quitter ». Cette clé n'existe pas dans l'application elle-même :
       la retirer n'y fait rien. */
    try { window.localStorage.removeItem("seance-battement"); } catch (e) {}
    var u = utilisateurConnecte();
    if (u && window.Droits && window.Droits.deconnecter) {
      window.Droits.deconnecter().then(function () { location.reload(); })
        .catch(function () { location.reload(); });
      return;
    }
    location.replace("index.html");
  }

  /* CHANGER SON PROPRE CODE. L'ancien code est redemandé : sans lui, il
     suffirait de trouver une session ouverte pour prendre la place de
     quelqu'un. Le changement passe par Droits, qui l'inscrit au journal. */
  function changerMonCode() {
    var u = utilisateurConnecte();
    if (!u || !window.Droits || !window.Droits.changerMonCode) return;
    var ancien = window.prompt("Votre code d'accès actuel :");
    if (ancien === null) return;
    var neuf = window.prompt("Votre nouveau code d'accès, quatre caractères au moins :");
    if (neuf === null) return;
    var encore = window.prompt("Saisissez-le une seconde fois :");
    if (encore === null) return;
    if (String(neuf) !== String(encore)) {
      window.alert("Les deux saisies ne sont pas les mêmes : rien n'a été changé.");
      return;
    }
    window.Droits.changerMonCode(ancien, neuf).then(function () {
      window.alert("Votre code d'accès a été changé. Il sera demandé à la prochaine connexion.");
      fermer();
    }).catch(function (ex) {
      window.alert(ex && ex.message ? ex.message : "Le code n'a pas pu être changé.");
    });
  }

  /* ─────────────────────── la pose dans la page ─────────────────────── */
  function poser() {
    /* Les deux charpentes du dépôt : le bandeau des pages d'audit, la rangée
       des pages de gestion. La première qui existe reçoit les boutons. */
    var outils = $("header.site .outils");
    var bandeau = $("header.site .wrap");
    var haut = $(".haut");
    var ou = outils || haut || bandeau;   /* là où va le retour */
    var la = bandeau || haut;             /* là où va le menu, à droite */
    if (!ou || !la) return;

    var retour = ou.querySelector("a.retour, button.retour, #retour");
    if (!retour && page !== "index.html") {
      retour = document.createElement("a");
      retour.className = "retour";
      retour.href = "index.html";
      retour.textContent = "← Retour";
      retour.addEventListener("click", retourner);
      ou.insertBefore(retour, ou.firstChild);
    }
    /* Le bouton qui existe déjà garde son écouteur : le nôtre passe avant lui
       seulement quand la page a déclaré une étape précédente, et dans ce cas
       il arrête l'événement. */
    if (retour) retour.addEventListener("click", function (ev) {
      if (!AVANT) return;
      var reste = false;
      try { reste = AVANT() === true; } catch (e) { reste = false; }
      if (reste) { ev.preventDefault(); ev.stopImmediatePropagation(); }
    }, true);

    /* RETOUR VEUT DIRE : LÀ D'OÙ JE VIENS.

       Relevé le 27 septembre 2026 : le retour du forfait en jours ramenait à
       Gérer, celui du registre et des visites à l'accueil, quel que soit
       l'écran d'où l'on venait. Un dirigeant qui ouvre le registre depuis
       l'audit se retrouvait à l'accueil, et devait refaire deux clics.

       Le lien écrit dans la page reste : il est le chemin par défaut, celui qui
       vaut quand on arrive par un favori, par une notification ou par une
       adresse collée. Mais quand la page précédente est une page de
       l'application, c'est elle qu'on retrouve. `retourner` fait déjà ce tri :
       il suffit de le brancher sur le bouton qui existait. */
    if (retour && retour.tagName === "A" && retour.getAttribute("href")) {
      retour.addEventListener("click", retourner);
    }

    /* LE MENU SUIT L'ÉCRAN, IL NE RESTE PAS SUR LE PREMIER.

       Une page qui avance par écrans a une rangée « .haut » par écran, et le
       menu n'allait que dans la première : sur Gérer, le protocole de sécurité
       et l'autorisation de conduite s'ouvraient sans menu, comme les
       quarante autres documents, parce que la rangée qui le portait était
       cachée avec la liste. Relevé le 29 septembre 2026. Chaque rangée reçoit
       le sien. */
    function poserMenu(ou2, premier) {
      if (!ou2 || ou2.querySelector(".menu")) return;
      var b = document.createElement("button");
      b.type = "button";
      if (premier && !document.getElementById("barre-bouton-menu"))
        b.id = "barre-bouton-menu";
      b.className = "menu";
      b.setAttribute("aria-label", "Menu");
      b.textContent = "Menu";
      b.addEventListener("click", ouvrir);
      ou2.appendChild(b);
    }
    poserMenu(la, true);
    if (!outils && !bandeau) {
      Array.prototype.forEach.call(document.querySelectorAll(".haut"), function (x) {
        poserMenu(x, false);
      });
    }
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") fermer();
  });

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", poser);
  else poser();

  /* LES PAGES QUI AVANCENT PAR ÉCRANS.

     Presque toutes les pages du dépôt montrent une section à la fois et
     cachent les autres. Plutôt que de réécrire chacune, on regarde le DOM :
     dès qu'une autre section devient visible, l'écran quitté est empilé. Le
     bouton Retour dépile et rappelle la fonction d'affichage de la page,
     celle qu'elle emploie elle-même, pour que l'écran revienne dans l'état
     que la page attend.

         Barre.ecrans(ecran);        // « ecran » est la fonction de la page

     Le drapeau « revient » évite d'empiler le retour lui-même, ce qui
     enfermerait l'utilisateur dans un va-et-vient entre deux écrans. */
  function ecrans(montrer, selecteur) {
    if (typeof montrer !== "function") return;
    var sel = selecteur || "main > section[id], main > .wrap > section[id], body > main section[id]";
    var vus = [], courant = null, revient = false;

    function visible(s) {
      if (s.hasAttribute("hidden")) return false;
      if (s.classList.contains("cache")) return false;
      var st = window.getComputedStyle(s);
      return st.display !== "none" && st.visibility !== "hidden";
    }
    function lequel() {
      var L = document.querySelectorAll(sel), i;
      for (i = 0; i < L.length; i++) if (visible(L[i])) return L[i].id;
      return null;
    }
    function regarder() {
      var id = lequel();
      if (id === courant) return;
      if (!revient && courant) vus.push(courant);
      courant = id;
    }

    courant = lequel();
    var obs = new window.MutationObserver(regarder);
    document.querySelectorAll(sel).forEach(function (s) {
      obs.observe(s, { attributes: true, attributeFilter: ["hidden", "class", "style"] });
    });

    AVANT = function () {
      if (!vus.length) return false;
      var id = vus.pop();
      revient = true;
      try { montrer(id); } catch (e) {}
      courant = lequel();
      window.setTimeout(function () { revient = false; }, 0);
      window.scrollTo(0, 0);
      return true;
    };
  }

  /* L'ONGLET PORTE LE NOM DE L'ENTREPRISE, NON CELUI DU LOGICIEL.

     « La barre dit T.E.C, mais les onglets disent Jurisprudence » : liste du
     26 septembre 2026. Le nom de l'entreprise ne peut pas être écrit dans le
     code, puisque l'application sert à d'autres : il se lit sur la fiche, au
     chargement de chaque page. L'écran garde son nom, l'entreprise le suit.

     Une fiche vide laisse le titre tel quel : on n'invente pas de nom. */
  (function titreDeLaPage() {
    var nom = "";
    try {
      var p = (window.Profil && window.Profil.lire) ? window.Profil.lire() : null;
      if (!p) p = JSON.parse(window.localStorage.getItem("profil-entreprise") || "null");
      nom = String((p && (p.denomination || p.entreprise)) || "").trim();
    } catch (e) { nom = ""; }
    if (!nom) return;
    var t = String(document.title || "").trim();
    /* Le suffixe du logiciel s'en va, l'entreprise prend sa place. */
    t = t.replace(/\s*[-\u00b7]\s*Jurisprudence.*$/i, "").replace(/^Jurisprudence.*$/i, "");
    document.title = t ? t + " \u00b7 " + nom : nom;
  })();

  /* LA LIGNE DE L'ENTREPRISE, SUR CHAQUE PAGE.

     « Ligne entreprise, effectif : absente sur dix-sept pages sur téléphone et
     sur sept sur ordinateur » : liste du 26 septembre 2026. Celui qui ouvre un
     écran doit voir de qui il parle, et à quel effectif les seuils se
     calculent. La ligne se pose sous le bandeau, en petit, et elle ne coûte
     rien aux pages qui portaient déjà leur propre mention : celles qui ont un
     « #ent » vide le reçoivent, les autres reçoivent la ligne.

     Une fiche sans dénomination ne donne rien : on n'invente pas de nom. */
  function ligneEntreprise() {
    var p = null;
    try {
      p = (window.Profil && window.Profil.lire) ? window.Profil.lire() : null;
      if (!p) p = JSON.parse(window.localStorage.getItem("profil-entreprise") || "null");
    } catch (e) { p = null; }
    var nom = String((p && (p.denomination || p.entreprise)) || "").trim();
    if (!nom) return;
    var eff = parseInt(String((p && p.effectif) || "").replace(/[^0-9]/g, ""), 10);
    /* TROIS CHIFFRES CIRCULAIENT, ET AUCUN NE DISAIT CE QU'IL ÉTAIT.

       La porte annonçait « Effectif inscrit 85 salariés », le registre
       « 85 inscrits · 82 en poste », cette ligne « 82 salariés », et la fiche
       « entre 80 et 82 ». Trois grandeurs différentes, toutes appelées
       « salariés » : les lignes du registre, les salariés en poste, et
       l'effectif de L. 1111-2 qui commande les seuils. Relevé le 29 septembre
       2026. Un seul chiffre fait référence, celui que la fiche retient, et il
       est désormais nommé : « effectif retenu ». */
    var texte = nom + (isFinite(eff) && eff > 0 ? " · effectif retenu " + eff : "");
    /* Le rappel de l'entreprise des pages de gestion. Deux écrans de la base
       de données appellent « ent » leur champ de saisie de la dénomination :
       ce n'est pas un rappel, et y écrire le nom ne se verrait pas. */
    var dedans = document.querySelector(".haut #ent, header.site #ent");
    if (dedans && /^(INPUT|TEXTAREA|SELECT)$/.test(dedans.tagName)) dedans = null;
    if (dedans) {
      var deja = String(dedans.textContent || "").trim();
      /* Vide : on écrit le rappel. Déjà écrit par la page, mais sans
         l'effectif : on l'ajoute, puisque c'est lui qui commande les seuils.
         Écrit autrement : on n'y touche pas, la page sait ce qu'elle dit. */
      if (!deja) dedans.textContent = texte;
      else if (deja === nom && texte !== nom) dedans.textContent = texte;
      return;
    }
    var tete = document.querySelector("header.site");
    if (!tete) return;
    /* LA PAGE QUI SE PRÉSENTE DÉJÀ N'A PAS BESOIN QU'ON LA PRÉSENTE.

       « SARL TEC · 82 salariés » puis, deux lignes plus bas, « SARL TEC ·
       85 inscrits · 82 en poste » : le rappel était posé par-dessus celui que
       la page écrit elle-même, sur l'agenda, l'accueil, le registre, les
       audits, les parcours et les modèles. Relevé le 29 septembre 2026. On
       cherche donc, en tête de la page, une ligne courte qui commence déjà par
       la dénomination : si elle est là, celle-ci dit ce qu'il faut, et souvent
       mieux, puisqu'elle connaît le registre. */
    var nôtre = tete.querySelector(".ent-ligne");
    var debut = tete.parentNode || document;
    var candidats = debut.querySelectorAll("header.site p, header.site div, main > p, main > div, main > section > p");
    var propre = false;
    for (var i = 0; i < candidats.length && i < 40; i++) {
      var c = candidats[i];
      if (c === nôtre || (nôtre && nôtre.contains(c))) continue;
      var t = String(c.textContent || "").trim();
      if (t.length > 200) continue;
      if (t.indexOf(nom) === 0 && /salari|inscrit|effectif/i.test(t)) { propre = true; break; }
    }
    /* Certaines pages écrivent leur rappel après coup : la ligne posée trop
       tôt se retire dès que le leur paraît. */
    if (propre) {
      if (nôtre && nôtre.parentNode) nôtre.parentNode.removeChild(nôtre);
      return;
    }
    if (nôtre) return;
    var l = document.createElement("p");
    l.className = "ent-ligne";
    l.textContent = texte;
    tete.appendChild(l);
  }
  /* barre.js est chargé dans l'en-tête du document : le bandeau n'existe pas
     encore quand ce fichier s'exécute. La ligne se pose donc quand la page
     est lue. */
  /* Deux passages : au moment où la page est lue, et une fois tout chargé,
     parce que certains écrans écrivent leur rappel après coup. */
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", ligneEntreprise);
  else ligneEntreprise();
  window.addEventListener("load", ligneEntreprise);
  /* Un troisième passage, court : les écrans qui remplissent leur rappel
     depuis le registre le font après le chargement. */
  window.setTimeout(ligneEntreprise, 700);

  window.Barre = {
    avant: function (fn) { AVANT = typeof fn === "function" ? fn : null; },
    ecrans: ecrans,
    retour: retourner,
    ouvrirMenu: ouvrir,
    fermerMenu: fermer,
    quitter: quitter,
  };

})(window, document);
