/* Recherche rapide de l'accueil.

   Le dirigeant tape un mot ou une phrase (« je veux rédiger un contrat »,
   « contester une contravention », « avertissement ») et arrive directement
   sur le bon écran. Tout se passe dans le navigateur, sans serveur : rien
   n'est envoyé nulle part, et la recherche marche hors ligne.

   Le classement est volontairement simple : on normalise (minuscules, sans
   accents), on enlève les mots vides (« je », « veux », « un »...), et on
   compte, pour chaque écran, combien de mots utiles de la demande tombent sur
   un de ses mots-clés. Pas d'intelligence artificielle, donc pas de surprise.

   L'index ci-dessous ne pointe que vers des pages qui existent. Toute
   destination nouvelle s'ajoute ici, avec ses mots-clés et ses synonymes. */
(function () {
  "use strict";

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

  var CSS = '' +
    '.rr-bloc{margin:0 0 var(--e5,24px)}' +
    '.rr-barre{position:relative;display:flex;align-items:center;gap:10px;background:var(--surface,#fff);' +
    'border:1px solid var(--filet,#dcdfe4);border-radius:var(--r2,12px);padding:0 14px;height:var(--h-champ,48px);box-shadow:var(--ombre,0 1px 2px rgba(22,24,29,.05))}' +
    '.rr-barre:focus-within{border-color:var(--accent,#1F3864);box-shadow:0 0 0 2px var(--accent-clair,#e9edf5)}' +
    '.rr-barre svg{flex:0 0 auto;width:19px;height:19px;color:var(--texte-2,#5f6874)}' +
    '.rr-barre input{flex:1 1 auto;min-width:0;border:0;outline:0;background:transparent;color:var(--texte,#16181d);font:inherit;font-size:var(--t4,18px)}' +
    '.rr-barre input::-webkit-search-cancel-button,.rr-barre input::-webkit-search-decoration{-webkit-appearance:none;appearance:none}' +
    '.rr-x{flex:0 0 auto;border:0;background:transparent;color:var(--texte-2,#5f6874);font-size:22px;line-height:1;padding:4px;cursor:pointer;display:none}' +
    '.rr-mic{flex:0 0 auto;width:38px;height:38px;min-height:0;box-sizing:border-box;padding:0;border:0;' +
    'border-radius:50%;background:var(--accent,#1F3864);color:#fff;cursor:pointer;display:none;' +
    'align-items:center;justify-content:center;-webkit-appearance:none;appearance:none}' +
    '.rr-mic.rr-dispo{display:flex}' +
    '.rr-mic svg{width:20px;height:20px}' +
    '.rr-mic.rr-on{background:var(--rouge,#c0392b);animation:rr-pulse 1s ease-in-out infinite}' +
    '@keyframes rr-pulse{0%,100%{opacity:1}50%{opacity:.35}}' +
    '.rr-res{margin-top:10px;display:flex;flex-direction:column;gap:8px}' +
    '.rr-item{display:flex;align-items:center;gap:12px;background:var(--surface,#fff);border:1px solid var(--filet,#dcdfe4);' +
    'border-radius:var(--r2,12px);padding:12px 14px;text-decoration:none;color:inherit;box-shadow:var(--ombre,0 1px 2px rgba(22,24,29,.05))}' +
    '.rr-item.rr-sel{border-color:var(--accent,#1F3864);box-shadow:0 0 0 2px var(--accent-clair,#e9edf5)}' +
    '.rr-tx{min-width:0}' +
    '.rr-nom{font-size:var(--t3,16px);font-weight:600}' +
    '.rr-ou{display:block;color:var(--texte-2,#5f6874);font-size:var(--t1,14px);margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.rr-fl{margin-left:auto;color:var(--texte-3,#7b838d);font-size:20px}' +
    '.rr-vide{color:var(--texte-2,#5f6874);font-size:var(--t2,15px);padding:12px 2px}';

  function construire(hote) {
    var style = document.getElementById("rr-style");
    if (!style) {
      style = document.createElement("style");
      style.id = "rr-style";
      style.textContent = CSS;
      document.head.appendChild(style);
    }

    hote.classList.add("rr-bloc");
    var barre = document.createElement("label");
    barre.className = "rr-barre";
    barre.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
      '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>' +
      '<input type="search" inputmode="search" autocomplete="off" ' +
      'placeholder="rédiger un contrat, avertissement, contravention..." aria-label="Rechercher un écran">' +
      '<button type="button" class="rr-mic" aria-label="Recherche vocale">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
      '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/><path d="M8 21h8"/></svg>' +
      '</button>' +
      '<button type="button" class="rr-x" aria-label="Effacer">&times;</button>';
    var res = document.createElement("div");
    res.className = "rr-res";
    hote.appendChild(barre);
    hote.appendChild(res);

    var q = barre.querySelector("input");
    var x = barre.querySelector(".rr-x");
    var sel = 0, courant = [];

    function aller(d) { window.location.href = d.page; }

    function rendre() {
      var qs = toks(q.value);
      x.style.display = q.value ? "block" : "none";
      if (!qs.length) { res.textContent = ""; courant = []; return; }
      var liste = DEST.map(function (d) { return { d: d, s: score(d, qs) }; })
        .filter(function (o) { return o.s > 0; })
        .sort(function (a, b) { return b.s - a.s; })
        .slice(0, 6);
      courant = liste;
      if (sel >= liste.length) sel = 0;
      res.textContent = "";
      if (!liste.length) {
        var v = document.createElement("div");
        v.className = "rr-vide";
        v.textContent = "Aucun écran ne correspond. Essayez un autre mot.";
        res.appendChild(v);
        return;
      }
      liste.forEach(function (o, i) {
        var a = document.createElement("a");
        a.className = "rr-item" + (i === sel ? " rr-sel" : "");
        a.href = o.d.page;
        a.innerHTML = '<span class="rr-tx"><span class="rr-nom"></span><span class="rr-ou"></span></span><span class="rr-fl">&#8250;</span>';
        a.querySelector(".rr-nom").textContent = o.d.nom;
        a.querySelector(".rr-ou").textContent = o.d.ou;
        res.appendChild(a);
      });
    }

    q.addEventListener("input", function () { sel = 0; rendre(); });
    q.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, courant.length - 1); rendre(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); rendre(); }
      else if (e.key === "Enter" && courant[sel]) { e.preventDefault(); aller(courant[sel].d); }
      else if (e.key === "Escape") { q.value = ""; sel = 0; rendre(); }
    });
    x.addEventListener("click", function () { q.value = ""; sel = 0; rendre(); q.focus(); });

    /* Recherche vocale : dictée en français, comme sur nomos. Le bouton
       n'apparaît que si le navigateur gère la reconnaissance vocale. Rien
       n'est envoyé : la dictée remplit le champ et lance la recherche. */
    var mic = barre.querySelector(".rr-mic");
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR && mic) {
      var reco = null, ecoute = false;
      mic.classList.add("rr-dispo");
      mic.addEventListener("click", function () {
        if (ecoute) { try { reco.stop(); } catch (e) {} return; }
        try {
          reco = new SR();
          reco.lang = "fr-FR";
          reco.interimResults = false;
          reco.maxAlternatives = 1;
          reco.onstart = function () { ecoute = true; mic.classList.add("rr-on"); };
          reco.onresult = function (e) {
            var t = "";
            try { t = e.results[0][0].transcript; } catch (err) { t = ""; }
            if (t) { q.value = t; sel = 0; rendre(); }
          };
          reco.onerror = function () { ecoute = false; mic.classList.remove("rr-on"); };
          reco.onend = function () { ecoute = false; mic.classList.remove("rr-on"); q.focus(); };
          reco.start();
        } catch (e) { ecoute = false; mic.classList.remove("rr-on"); }
      });
    }
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
