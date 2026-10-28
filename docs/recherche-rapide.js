/* L'ASSISTANT DE L'ACCUEIL : une barre, deux onglets.

   Deux usages nettement séparés, choisis par deux onglets en haut de la barre.

   - « Faire une action » : le dirigeant dit ou écrit ce qu'il veut faire
     (« rédiger un contrat », « contester une contravention », « abandon de
     poste »). On lui répond « J'ai compris : tel écran » et un grand bouton
     l'ouvre, exactement comme le bouton de l'écran lui-meme. En dessous,
     « Pas ça ? » et les autres pistes. Si rien n'est compris, les écrans les
     plus utilisés.

   - « Poser une question » : le dirigeant pose une question metier et reçoit
     une réponse d'une base intégrée. La base est montée à l'étape suivante ;
     l'onglet est en place, avec son champ et son micro.

   Tout se calcule dans le navigateur, sans serveur, hors ligne. Pas
   d'intelligence artificielle : on normalise le texte et on compte les
   mots-clés trouvés. Demandé par le client, sur le modèle de Nomos.

   AJOUT PUR : aucune destination existante n'a été retirée. L'index DEST est
   celui d'avant, repris en entier ; seule la présentation a été enrichie. */
(function () {
  "use strict";

  /* L'index des actions : chaque entrée mène à un écran qui existe, avec les
     mots que le dirigeant emploie vraiment. Toute destination nouvelle
     s'ajoute ici. */
  var DEST = [
    { nom: "Éditer un contrat de travail", ou: "Contrats du transport", page: "contrats-transport.html",
      mots: "contrat travail cdi cdd embauche embaucher recruter recrutement rediger ecrire etablir faire salarie employe ouvrier chauffeur conducteur engager engagement promesse essai avenant temps partiel complet nouveau transport" },
    { nom: "Contester une contravention", ou: "Avis de contravention", page: "contraventions.html",
      mots: "contravention amende pv proces verbal stationnement exces vitesse radar feu rouge contester designer denoncer conducteur fps forfait post stationnement infraction prune flash contestation requete" },
    { nom: "Contrôle URSSAF", ou: "Contrôle URSSAF", page: "controle-urssaf.html",
      mots: "urssaf controle cotisations redressement inspecteur avis contradictoire charte deduction forfaitaire specifique dfs frais deplacement grand deplacement lettre observations recours commission amiable prescription mandataire exoneration reduction generale cotisation redresser inspection recouvrement" },
    { nom: "Avertissement, sanction, discipline", ou: "Discipline", page: "audit-discipline.html",
      mots: "avertissement sanction sanctionner discipline disciplinaire infliger donner mettre blame mise a pied faute reproche punir rappel ordre recadrer reprimande comportement mauvaise conduite retard insubordination procedure" },
    { nom: "Licenciement", ou: "Discipline", page: "audit-discipline.html",
      mots: "licenciement licencier renvoyer virer congedier rupture depart faute grave lourde entretien prealable convocation motif cause reelle serieuse separer mettre dehors remercier" },
    { nom: "Registre des sanctions", ou: "Discipline", page: "sanctions.html",
      mots: "registre sanctions historique avertissements suivi disciplinaire" },
    { nom: "Mise en demeure, absence, abandon de poste", ou: "Courriers et e-mails", page: "courriers.html",
      mots: "mise demeure absence absent injustifiee abandon poste presomption demission relance relancer justifier reprendre revenir courrier lettre disparu vient plus repond plus" },
    { nom: "Courriers types", ou: "Courriers et e-mails", page: "courriers.html",
      mots: "courrier lettre modele type attestation convocation reponse reclamation client fournisseur salarie demande relance ecrire envoyer mail e-mail" },
    { nom: "Règlement intérieur", ou: "Règlement intérieur", page: "controler-ri.html",
      mots: "reglement interieur ri discipline affichage depot greffe inspection obligatoire redaction regles internes controler" },
    { nom: "Document unique (DUERP)", ou: "Document unique", page: "duerp.html",
      mots: "duerp document unique risques professionnels securite danger evaluation prevention penibilite accident travail sante hygiene" },
    { nom: "Registre du personnel", ou: "Registre du personnel", page: "registre.html",
      mots: "registre personnel unique entree sortie salaries liste effectif embauche depart mouvement declarer dpae ajouter salarie" },
    { nom: "Flotte et conducteurs", ou: "Flotte et conducteurs", page: "flotte.html",
      mots: "flotte vehicule camion voiture parc conducteur affectation carte grise assurance immatriculation controle technique entretien poids lourd" },
    { nom: "Forfait en jours", ou: "Forfait en jours", page: "forfait.html",
      mots: "forfait jours cadre autonomie suivi charge entretien convention temps travail jours travailles decompte" },
    { nom: "Décompte des heures", ou: "Décompte des heures", page: "heures.html",
      mots: "heures supplementaires paie paye payer salaire bulletin fiche majoration nuit prime panier decompte temps travail" },
    { nom: "Minima conventionnels", ou: "Minima conventionnels", page: "minima.html",
      mots: "minima conventionnel salaire minimum grille coefficient convention collective taux horaire smic" },
    { nom: "Notes de service", ou: "Notes de service", page: "notes-service.html",
      mots: "note service consigne information affichage directive interne communication informer prevenir equipe" },
    { nom: "Visites médicales", ou: "Visites médicales", page: "visites.html",
      mots: "visite medicale reprise embauche suivi medecine travail aptitude inaptitude sst examen rendez vous docteur" },
    { nom: "Complémentaire santé (mutuelle)", ou: "Complémentaire santé", page: "controler-mutuelle.html",
      mots: "mutuelle complementaire sante frais prevoyance affiliation dispense remboursement" },
    { nom: "Affichages obligatoires", ou: "Affichages obligatoires", page: "controler-affichages.html",
      mots: "affichage obligatoire panneau horaires collectifs inspection medecine egalite consignes securite" },
    { nom: "Égalité femmes-hommes", ou: "Égalité professionnelle", page: "egalite.html",
      mots: "egalite femmes hommes index ecart remuneration penalite publication parite discrimination" },
    { nom: "Base de données (BDESE)", ou: "Ma base de données", page: "bdese.html",
      mots: "bdese base donnees economiques sociales environnementales information consultation" },
    { nom: "Comité social et économique (CSE)", ou: "Comité social", page: "audit-cse.html",
      mots: "cse comite social economique elections representants personnel delegue reunion" },
    { nom: "Négociation annuelle (NAO)", ou: "Négociation annuelle", page: "audit-nao.html",
      mots: "nao negociation annuelle obligatoire salaires delegue syndical accord augmentation" },
    { nom: "Santé et sécurité au travail", ou: "Santé et sécurité", page: "audit-sst.html",
      mots: "sst sante securite travail risques accident prevention protection equipement" },
    { nom: "Licenciement économique (PSE)", ou: "Plan de sauvegarde", page: "audit-pse.html",
      mots: "pse plan sauvegarde emploi licenciement economique collectif reclassement" },
    { nom: "Agenda social et échéances", ou: "Agenda social", page: "agenda.html",
      mots: "agenda echeance delai calendrier rappel date retroplanning planning" },
    { nom: "Mes documents", ou: "Mes documents", page: "mes-documents.html",
      mots: "documents dossier mes fichiers telecharger archive garder enregistrer sauvegarde retrouver" },
    { nom: "Modèles de documents", ou: "Modèles de documents", page: "documents.html",
      mots: "modele document vierge type exemple trame" },
    { nom: "Équipe et droits", ou: "Équipe", page: "equipe.html",
      mots: "equipe droits acces journal collaborateur partage utilisateur" },
    { nom: "Jurisprudence et textes", ou: "Recherche Judilibre", page: "recherche.html",
      mots: "jurisprudence arret decision cour cassation judilibre texte legifrance article loi recherche juridique" },
    { nom: "Audit et conformité", ou: "Toutes les obligations", page: "auditer.html",
      mots: "audit conformite obligations controle verifier diagnostic" },
    { nom: "Gérer le quotidien", ou: "Documents du quotidien", page: "gerer.html",
      mots: "gerer gestion quotidien rh documents embauche rupture" }
  ];

  /* Quand rien n'est compris, on propose les écrans les plus utilisés. Faute
     de mesure d'usage, cette liste est choisie à la main parmi les plus
     courants ; elle se corrige le jour où l'on compte vraiment les ouvertures. */
  var PLUS_UTILISES = ["gerer.html", "courriers.html", "registre.html",
    "heures.html", "contrats-transport.html"];

  var VIDES = { "je": 1, "j": 1, "veux": 1, "veut": 1, "voudrais": 1, "souhaite": 1, "faire": 1,
    "fais": 1, "faut": 1, "un": 1, "une": 1, "des": 1, "le": 1, "la": 1, "les": 1, "de": 1,
    "du": 1, "d": 1, "a": 1, "au": 1, "aux": 1, "pour": 1, "mon": 1, "ma": 1, "mes": 1,
    "ce": 1, "cette": 1, "comment": 1, "ou": 1, "et": 1, "en": 1, "sur": 1, "avec": 1,
    "me": 1, "se": 1, "son": 1, "sa": 1, "il": 1, "elle": 1, "y": 1, "ne": 1, "plus": 1, "pas": 1 };

  function norm(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9 ]/g, " ");
  }
  function toks(s) {
    return norm(s).split(/\s+/).filter(function (w) { return w && !VIDES[w]; });
  }
  DEST.forEach(function (d) { d._m = norm(d.nom + " " + d.mots).split(/\s+/).filter(Boolean); });

  function score(d, qs) {
    if (!qs.length) return 0;
    var s = 0;
    qs.forEach(function (q) {
      var hit = 0, i;
      for (i = 0; i < d._m.length; i++) {
        if (d._m[i].indexOf(q) === 0) { hit = (d._m[i] === q ? 3 : 2); break; }
      }
      if (!hit) {
        for (i = 0; i < d._m.length; i++) { if (d._m[i].indexOf(q) > 0) { hit = 1; break; } }
      }
      s += hit;
    });
    return s;
  }
  function classer(texte) {
    var qs = toks(texte);
    if (!qs.length) return [];
    return DEST.map(function (d) { return { d: d, s: score(d, qs) }; })
      .filter(function (o) { return o.s > 0; })
      .sort(function (a, b) { return b.s - a.s; });
  }
  function parPage(page) {
    for (var i = 0; i < DEST.length; i++) if (DEST[i].page === page) return DEST[i];
    return null;
  }

  /* Une demande qui est en réalité une question : elle finit par « ? » ou
     commence par un mot interrogatif. On le repère pour proposer de basculer
     vers l'onglet des réponses. */
  var DEBUTS_Q = /^(combien|quel|quelle|quels|quelles|comment|est-?ce que|peut-?on|peut on|faut-?il|faut il|que faire|quand|pourquoi|qui|a quelle|a quel)\b/;
  function estQuestion(texte) {
    var t = norm(texte).trim();
    if (!t) return false;
    return /\?\s*$/.test(texte.trim()) || DEBUTS_Q.test(t);
  }

  var CSS = '' +
    '.rr-carte{background:var(--surface,#fff);border:1px solid var(--filet,#dcdfe4);' +
    'border-radius:16px;padding:16px;margin:0 0 var(--e5,24px);box-shadow:0 1px 3px rgba(22,24,29,.06)}' +
    '.rr-onglets{display:flex;gap:10px;margin:0 0 14px}' +
    '.rr-onglet{flex:1 1 0;min-width:0;display:flex;align-items:center;justify-content:center;gap:8px;' +
    'border:0;border-radius:12px;padding:13px 10px;font:600 15px/1.1 inherit;cursor:pointer;' +
    'background:var(--accent-clair,#eef1f7);color:var(--texte-2,#5f6874);-webkit-appearance:none;appearance:none}' +
    '.rr-onglet.rr-actif{background:var(--accent,#1F3864);color:#fff}' +
    '.rr-tete{display:flex;align-items:center;gap:14px;margin:4px 2px 12px}' +
    '.rr-mic{flex:0 0 auto;width:56px;height:56px;min-height:0;box-sizing:border-box;padding:0;border:0;' +
    'border-radius:50%;background:#efeefc;color:#4f46e5;cursor:pointer;display:flex;' +
    'align-items:center;justify-content:center;-webkit-appearance:none;appearance:none}' +
    '.rr-mic svg{width:26px;height:26px}' +
    '.rr-mic.rr-indispo{opacity:.55}' +
    '.rr-mic.rr-on{background:#fde7e7;color:var(--rouge,#c0392b);animation:rr-pulse 1s ease-in-out infinite}' +
    '@keyframes rr-pulse{0%,100%{opacity:1}50%{opacity:.45}}' +
    '.rr-titre{font:700 17px/1.2 inherit;color:var(--texte,#16181d)}' +
    '.rr-sous{display:block;color:var(--texte-2,#5f6874);font-size:14px;margin-top:2px}' +
    '.rr-ligne{display:flex;gap:10px}' +
    '.rr-champ{flex:1 1 auto;min-width:0;border:1px solid var(--filet,#cfd6e0);border-radius:12px;' +
    'background:var(--fond-champ,#f7f8fa);color:var(--texte,#16181d);font:inherit;font-size:16px;padding:14px 15px;outline:0}' +
    '.rr-champ:focus{border-color:var(--accent,#1F3864);background:#fff}' +
    '.rr-ok{flex:0 0 auto;border:0;border-radius:12px;background:var(--accent,#1F3864);color:#fff;' +
    'font:700 16px inherit;padding:0 22px;min-height:50px;cursor:pointer;-webkit-appearance:none;appearance:none}' +
    '.rr-ecoute{margin:12px 2px 0;color:var(--rouge,#c0392b);font-size:15px;font-weight:600}' +
    '.rr-res{margin-top:14px;display:flex;flex-direction:column;gap:10px}' +
    '.rr-compris{color:var(--texte-2,#5f6874);font-size:14px}' +
    '.rr-compris b{color:var(--texte,#16181d)}' +
    '.rr-ouvrir{display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;' +
    'background:var(--accent,#1F3864);color:#fff;border-radius:14px;padding:16px;font:700 17px inherit}' +
    '.rr-pasca{color:var(--texte-2,#5f6874);font-size:14px;margin:4px 2px 0}' +
    '.rr-autres{display:flex;flex-direction:column;gap:8px}' +
    '.rr-item{display:flex;align-items:center;gap:12px;background:var(--surface,#fff);border:1px solid var(--filet,#dcdfe4);' +
    'border-radius:12px;padding:12px 14px;text-decoration:none;color:inherit}' +
    '.rr-nom{font-size:15px;font-weight:600}' +
    '.rr-ou{display:block;color:var(--texte-2,#5f6874);font-size:13px;margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.rr-fl{margin-left:auto;color:var(--texte-3,#7b838d);font-size:20px}' +
    '.rr-bascule{display:block;width:100%;text-align:left;border:1px dashed var(--filet,#cfd6e0);' +
    'background:var(--accent-clair,#eef1f7);color:var(--accent,#1F3864);border-radius:12px;' +
    'padding:12px 14px;font:600 14px inherit;cursor:pointer}' +
    '.rr-vide{color:var(--texte-2,#5f6874);font-size:15px;padding:6px 2px}' +
    '.rr-attente{background:var(--accent-clair,#eef1f7);border-radius:12px;padding:14px;color:var(--texte-2,#5f6874);font-size:14px}';

  var MIC_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/><path d="M8 21h8"/></svg>';
  var STOP_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';

  function ech(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var MODES = {
    action: { titre: "Que voulez-vous faire ?", sous: "Dites ou écrivez ce que vous voulez faire",
      exemple: "Ex. : je veux déclarer un incident", micSous: "Touchez le micro et dites ce que vous voulez faire" },
    question: { titre: "Posez votre question", sous: "Une question sur la réglementation transport",
      exemple: "Ex. : combien de temps je peux conduire par jour ?", micSous: "Touchez le micro et posez votre question" }
  };

  function construire(hote) {
    if (!document.getElementById("rr-style")) {
      var st = document.createElement("style");
      st.id = "rr-style";
      st.textContent = CSS;
      document.head.appendChild(st);
    }

    var mode = "action";
    hote.innerHTML =
      '<div class="rr-carte">' +
      '<div class="rr-onglets">' +
      '<button type="button" class="rr-onglet rr-actif" data-mode="action">🧭 Faire une action</button>' +
      '<button type="button" class="rr-onglet" data-mode="question">❓ Poser une question</button>' +
      '</div>' +
      '<div class="rr-tete">' +
      '<button type="button" class="rr-mic" aria-label="Dicter">' + MIC_SVG + '</button>' +
      '<div><span class="rr-titre"></span><span class="rr-sous"></span></div>' +
      '</div>' +
      '<div class="rr-ligne">' +
      '<input class="rr-champ" type="text" inputmode="search" autocomplete="off" aria-label="Votre demande">' +
      '<button type="button" class="rr-ok">OK</button>' +
      '</div>' +
      '<div class="rr-ecoute" hidden>Je vous écoute...</div>' +
      '<div class="rr-res"></div>' +
      '</div>';

    var onglets = hote.querySelectorAll(".rr-onglet");
    var titreEl = hote.querySelector(".rr-titre");
    var sousEl = hote.querySelector(".rr-sous");
    var champ = hote.querySelector(".rr-champ");
    var ok = hote.querySelector(".rr-ok");
    var res = hote.querySelector(".rr-res");
    var ecoute = hote.querySelector(".rr-ecoute");
    var mic = hote.querySelector(".rr-mic");

    function aller(page) { window.location.href = page; }

    function majTete() {
      var m = MODES[mode];
      titreEl.textContent = m.titre;
      sousEl.textContent = m.sous;
      champ.setAttribute("placeholder", m.exemple);
    }

    /* MODE ACTION : « J'ai compris », le bouton qui ouvre, puis les autres. */
    function rendreAction() {
      res.textContent = "";
      var texte = champ.value.trim();
      if (!texte) return;
      var liste = classer(texte);

      if (liste.length) {
        var best = liste[0].d;
        var compris = document.createElement("div");
        compris.className = "rr-compris";
        compris.innerHTML = "✓ J'ai compris : <b></b>";
        compris.querySelector("b").textContent = best.nom;
        res.appendChild(compris);

        var bouton = document.createElement("a");
        bouton.className = "rr-ouvrir";
        bouton.href = best.page;
        bouton.innerHTML = "Ouvrir <span>›</span>";
        res.appendChild(bouton);

        var autres = liste.slice(1, 4);
        if (autres.length) {
          var pasca = document.createElement("div");
          pasca.className = "rr-pasca";
          pasca.textContent = "Pas ça ?";
          res.appendChild(pasca);
          res.appendChild(blocAutres(autres.map(function (o) { return o.d; })));
        }
      } else {
        var v = document.createElement("div");
        v.className = "rr-vide";
        v.textContent = "Je n'ai pas compris, vous vouliez peut-être :";
        res.appendChild(v);
        var sugg = PLUS_UTILISES.map(parPage).filter(Boolean);
        res.appendChild(blocAutres(sugg));
      }

      if (estQuestion(texte)) {
        var bascule = document.createElement("button");
        bascule.type = "button";
        bascule.className = "rr-bascule";
        bascule.textContent = "❓ C'est une question ? Voir la réponse";
        bascule.addEventListener("click", function () { basculer("question"); });
        res.appendChild(bascule);
      }
    }

    function blocAutres(dests) {
      var box = document.createElement("div");
      box.className = "rr-autres";
      dests.forEach(function (d) {
        var a = document.createElement("a");
        a.className = "rr-item";
        a.href = d.page;
        a.innerHTML = '<span><span class="rr-nom"></span><span class="rr-ou"></span></span><span class="rr-fl">›</span>';
        a.querySelector(".rr-nom").textContent = d.nom;
        a.querySelector(".rr-ou").textContent = d.ou;
        box.appendChild(a);
      });
      return box;
    }

    /* MODE QUESTION : la base de réponses est montée à l'étape suivante. */
    function rendreQuestion() {
      res.textContent = "";
      var texte = champ.value.trim();
      if (!texte) return;
      var a = document.createElement("div");
      a.className = "rr-attente";
      a.textContent = "La base de réponses du transport est en cours de constitution. " +
        "Elle répondra ici aux questions de temps de conduite, de repos, de documents à bord, etc.";
      res.appendChild(a);
    }

    function rendre() {
      if (mode === "action") rendreAction();
      else rendreQuestion();
    }

    function basculer(m) {
      mode = m;
      for (var i = 0; i < onglets.length; i++) {
        onglets[i].classList.toggle("rr-actif", onglets[i].getAttribute("data-mode") === m);
      }
      majTete();
      rendre();
      champ.focus();
    }

    for (var i = 0; i < onglets.length; i++) {
      onglets[i].addEventListener("click", function () { basculer(this.getAttribute("data-mode")); });
    }

    /* L'affichage se met à jour pendant la frappe, après un court répit, et à
       la validation (OK ou Entrée). */
    var minut = null;
    champ.addEventListener("input", function () {
      if (minut) window.clearTimeout(minut);
      minut = window.setTimeout(rendre, 450);
    });
    champ.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); if (minut) window.clearTimeout(minut); rendre(); }
    });
    ok.addEventListener("click", function () { if (minut) window.clearTimeout(minut); rendre(); champ.focus(); });

    /* LE MICRO. Dictée en français, le texte s'écrit en direct. Il s'arrête
       au bout de dix secondes, ou à un second appui. Si le navigateur ne gère
       pas la reconnaissance vocale, ou si le micro est refusé, on met le
       curseur dans le champ et on invite à dicter par le clavier. */
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    var reco = null, enEcoute = false, minuterie = null;

    function finEcoute() {
      enEcoute = false;
      mic.classList.remove("rr-on");
      mic.innerHTML = MIC_SVG;
      ecoute.hidden = true;
      if (minuterie) { window.clearTimeout(minuterie); minuterie = null; }
    }
    function message(txt) {
      res.textContent = "";
      var v = document.createElement("div");
      v.className = "rr-vide";
      v.textContent = txt;
      res.appendChild(v);
    }
    function dicterAuClavier() {
      champ.focus();
      message("Touchez le micro de votre clavier pour dicter, ou écrivez votre demande.");
    }

    if (!SR) {
      mic.classList.add("rr-indispo");
      mic.addEventListener("click", dicterAuClavier);
    } else {
      mic.addEventListener("click", function () {
        if (enEcoute) { try { reco.stop(); } catch (e) {} return; }
        try {
          reco = new SR();
          reco.lang = "fr-FR";
          reco.interimResults = true;
          reco.maxAlternatives = 1;
          reco.onstart = function () {
            enEcoute = true;
            mic.classList.add("rr-on");
            mic.innerHTML = STOP_SVG;
            ecoute.hidden = false;
            minuterie = window.setTimeout(function () { try { reco.stop(); } catch (e) {} }, 10000);
          };
          reco.onresult = function (e) {
            var t = "";
            for (var k = 0; k < e.results.length; k++) t += e.results[k][0].transcript;
            if (t) { champ.value = t; rendre(); }
          };
          reco.onerror = function (ev) {
            finEcoute();
            var c = ev && ev.error;
            if (c === "not-allowed" || c === "service-not-allowed") message("Le micro n'est pas autorisé. Autorisez-le, ou écrivez votre demande.");
            else if (c === "no-speech") message("Je n'ai rien entendu. Réessayez, ou écrivez votre demande.");
            else if (c === "audio-capture") message("Aucun micro détecté. Écrivez votre demande.");
            else dicterAuClavier();
          };
          reco.onend = function () { finEcoute(); champ.focus(); };
          reco.start();
        } catch (e) { finEcoute(); dicterAuClavier(); }
      });
    }

    majTete();
  }

  function demarrer() {
    var hote = document.getElementById("recherche-rapide");
    if (hote) construire(hote);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", demarrer);
  } else {
    demarrer();
  }
})();
