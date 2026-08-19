/* Assistant Claude — panneau de conversation présent sur toutes les pages.

   Une passerelle directe entre la juriste et Claude, avec le contexte de son
   travail : la page courante et son brouillon sont transmis au modèle, qui
   dispose en outre de deux outils — lire un article du code du travail via le
   relais Légifrance, chercher dans Judilibre avec la clé déjà enregistrée.

   C'est l'APPLICATION qui porte la connexion à Claude, sur le modèle du
   relais Légifrance : la page appelle la fonction Netlify « assistant », qui
   détient la clé API Anthropic (variable d'environnement, jamais dans le code)
   et retransmet le flux SSE tel quel. Aucune clé n'est demandée à
   l'utilisateur. En second recours seulement — relais non activé — une clé
   personnelle peut être saisie : elle vit alors dans CE navigateur
   (localStorage), n'est envoyée qu'à api.anthropic.com (accès direct officiel,
   en-tête anthropic-dangerous-direct-browser-access) et jamais journalisée.

   Règles non négociables :
   — toute recherche Judilibre « relaxed » est écartée : une requête élargie
     ramène des décisions sans rapport avec la demande (règle absolue du dépôt) ;
   — le contenu d'un article fait foi sur son numéro : le relais Légifrance peut
     servir un homonyme d'une autre partie du code.

   Le panneau exige la connexion ; le reste de l'application marche hors ligne. */

(function () {
  "use strict";

  /* ------------------------------ Constantes ------------------------------ */

  var API_ANTHROPIC = "https://api.anthropic.com/v1/messages";
  var CLE_STOCKAGE = "assistant-cle-anthropic";   // clé personnelle (repli seulement)
  var CLE_MODELE = "assistant-modele";
  var MODELE_DEFAUT = "claude-opus-5";
  var MODELES = [
    { id: "claude-opus-5", nom: "Opus (défaut)" },
    { id: "claude-sonnet-5", nom: "Sonnet" },
    { id: "claude-haiku-4-5", nom: "Haiku" }
  ];
  var MAX_TOKENS = 16000;
  var MAX_TOURS = 8;                              // garde-fou de la boucle d'outils

  /* Le relais Légifrance : même origine sur Netlify, adresse complète partout
     ailleurs (GitHub Pages, installation locale). */
  var RELAIS = /\.netlify\.app$/.test(location.hostname)
    ? "/.netlify/functions/legifrance"
    : "https://jurisprudence-recherche.netlify.app/.netlify/functions/legifrance";

  /* Le relais Anthropic de l'application : c'est LUI qui détient la clé, le
     navigateur ne fait que lui transmettre la conversation. */
  var RELAIS_ASSISTANT = /\.netlify\.app$/.test(location.hostname)
    ? "/.netlify/functions/assistant"
    : "https://jurisprudence-recherche.netlify.app/.netlify/functions/assistant";

  /* Judilibre : le relais de l'application d'abord (clé côté serveur) ; en
     repli, l'appel direct avec la clé que l'utilisateur a pu enregistrer sur
     la page de recherche. */
  var API_JUDILIBRE = "https://api.piste.gouv.fr/cassation/judilibre/v1.0";
  var CLE_JUDILIBRE = "judilibre_keyid";
  var RELAIS_JUDILIBRE = /\.netlify\.app$/.test(location.hostname)
    ? "/.netlify/functions/judilibre"
    : "https://jurisprudence-recherche.netlify.app/.netlify/functions/judilibre";
  var relaisJudiAbsent = false;   // mémorisé : inutile de réessayer un relais non activé

  /* --------------------------- Rôle et outils ----------------------------- */

  /* Le système est STABLE : rien de daté, rien de propre à la page. Le contexte
     volatil (page, brouillon) vient après, dans le premier message — c'est ce
     qui permet au cache de préfixe de servir. */
  var SYSTEME =
    "Tu es l'assistant intégré de l'application Jurisprudence, au service d'une " +
    "juriste experte des relations collectives de travail (CSE, PSE, BDESE, NAO, " +
    "licenciement économique). Tu tutoies le droit, pas l'utilisatrice : vouvoiement, " +
    "français précis.\n\n" +
    "Règles impératives :\n" +
    "1. Réponds court. Le résultat d'abord, la démarche seulement si on te la demande.\n" +
    "2. Aucune affirmation juridique non sourcée. Pour citer un article du code du " +
    "travail, lis-le d'abord avec l'outil article_code_travail ; pour la jurisprudence, " +
    "utilise recherche_judilibre. Si tu n'as pas pu vérifier, dis-le explicitement.\n" +
    "3. Chaque article cité via l'outil l'est avec son identifiant de version LEGIARTI " +
    "(un numéro d'article ne suffit pas : l'article peut changer sans changer de numéro).\n" +
    "4. Le relais Légifrance peut servir un homonyme d'une autre partie du code : " +
    "vérifie que le CONTENU de l'article parle bien du sujet cherché avant de t'en " +
    "servir ; sinon signale le doute.\n" +
    "5. Une recherche Judilibre élargie (relaxed) est écartée d'office : reformule " +
    "plutôt que d'exploiter des résultats sans rapport.\n" +
    "6. Tu assistes, tu ne te substitues ni au conseil ni au juge : un point douteux " +
    "se nomme, il ne se tranche pas.";

  var OUTILS = [
    {
      name: "article_code_travail",
      description:
        "Lit un article du code du travail sur Légifrance (relais de l'application) " +
        "et renvoie son texte avec son identifiant de version LEGIARTI. " +
        "ATTENTION : le relais peut servir un article homonyme d'une autre partie du " +
        "code portant le même numéro — c'est le CONTENU qui fait foi, pas le numéro : " +
        "vérifie que le texte rendu parle bien du sujet cherché, et en cas de doute " +
        "signale-le au lieu de citer.",
      input_schema: {
        type: "object",
        properties: {
          numero: {
            type: "string",
            description: "Numéro de l'article, ex. « L1233-3 » ou « R2312-9 » (sans espace ni point)."
          },
          date: {
            type: "string",
            description: "Date de version AAAA-MM-JJ (facultatif : sans date, version en vigueur)."
          }
        },
        required: ["numero"]
      }
    },
    {
      name: "recherche_judilibre",
      description:
        "Recherche dans Judilibre (Cour de cassation et cours d'appel, base " +
        "officielle) avec la clé déjà enregistrée par l'utilisatrice. Renvoie les " +
        "décisions correspondant exactement à la requête. Toute réponse que l'API " +
        "« élargit » (relaxed) est écartée : dans ce cas, reformule la requête " +
        "(termes plus proches du vocabulaire des juges) au lieu d'insister.",
      input_schema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Termes de recherche, dans le vocabulaire des juges."
          },
          page_size: {
            type: "integer",
            description: "Nombre de décisions à ramener (1 à 20, défaut 10)."
          }
        },
        required: ["query"]
      }
    }
  ];

  /* ------------------------------- État ----------------------------------- */

  var historique = [];        // messages de la conversation, en mémoire seulement
  var enCours = false;
  var controleur = null;      // AbortController de l'appel en cours
  var dernierTexte = null;    // pour « Réessayer » après une erreur

  function cle() { try { return localStorage.getItem(CLE_STOCKAGE) || ""; } catch (e) { return ""; } }
  function modele() {
    try {
      var m = localStorage.getItem(CLE_MODELE);
      return MODELES.some(function (x) { return x.id === m; }) ? m : MODELE_DEFAUT;
    } catch (e) { return MODELE_DEFAUT; }
  }

  /* ------------------------------ Utilitaires ----------------------------- */

  function echap(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* Mise en forme minimale du texte de l'assistant : gras, code, sauts de
     ligne. Tout est échappé d'abord — le modèle n'écrit jamais de HTML brut. */
  function rendreTexte(s) {
    var t = echap(s);
    t = t.replace(/\*\*([^*\n]+)\*\*/g, "<b>$1</b>");
    t = t.replace(/`([^`\n]+)`/g, "<code>$1</code>");
    return t.replace(/\n/g, "<br>");
  }

  function tronquer(s, n) {
    s = String(s == null ? "" : s);
    return s.length > n ? s.slice(0, n) + "\n[… tronqué à " + n + " caractères]" : s;
  }

  /* Sérialisation lisible d'un objet de brouillon : « clé : valeur » ligne à
     ligne, en ignorant les champs vides. */
  function serialiser(objet, prefixe, lignes, profondeur) {
    if (lignes.length > 200) return lignes;
    for (var k in objet) {
      if (!Object.prototype.hasOwnProperty.call(objet, k)) continue;
      var v = objet[k];
      if (v == null || v === "" || (Array.isArray(v) && !v.length)) continue;
      var nom = prefixe ? prefixe + " · " + k : k;
      if (Array.isArray(v)) {
        if (v.every(function (x) { return typeof x !== "object" || x === null; }))
          lignes.push(nom + " : " + v.join(", "));
        else if (profondeur < 3)
          v.forEach(function (x, i) { serialiser(x, nom + "[" + (i + 1) + "]", lignes, profondeur + 1); });
      } else if (typeof v === "object") {
        if (profondeur < 3) serialiser(v, nom, lignes, profondeur + 1);
      } else {
        lignes.push(nom + " : " + String(v));
      }
    }
    return lignes;
  }

  function lireBrouillon(cleStockage, titre) {
    var brut;
    try { brut = localStorage.getItem(cleStockage); } catch (e) { return ""; }
    if (!brut) return "";
    var lignes = [];
    try {
      var o = JSON.parse(brut);
      if (o && typeof o === "object") serialiser(o, "", lignes, 0);
      else lignes.push(String(o));
    } catch (e) { lignes.push(String(brut).slice(0, 500)); }
    if (!lignes.length) return "";
    return "\n\n" + titre + " (« " + cleStockage + "», stockage local) :\n" + lignes.join("\n");
  }

  /* Le contexte volatil : page courante et brouillons. Construit au début de
     chaque conversation, placé APRÈS le système stable — bon pour le cache. */
  function construireContexte() {
    var page = location.pathname.split("/").pop() || "index.html";
    var ctx = "Contexte de travail (généré par l'application, non écrit par l'utilisatrice).\n" +
      "Page courante : " + page + " — " + (document.title || "");
    var cleBrouillon = window.__CLE ||
      (page.indexOf("agenda") === 0 ? "agenda-brouillon" : null);
    if (cleBrouillon) ctx += lireBrouillon(cleBrouillon, "Brouillon de la page");
    ctx += lireBrouillon("profil-entreprise", "Profil de l'entreprise");
    return tronquer(ctx, 6000);
  }

  /* ------------------------------- Outils --------------------------------- */

  function avecDelai(promesse, ms) {
    return new Promise(function (resoudre, rejeter) {
      var t = setTimeout(function () { rejeter(new Error("TROP_LONG")); }, ms);
      promesse.then(function (v) { clearTimeout(t); resoudre(v); },
                    function (e) { clearTimeout(t); rejeter(e); });
    });
  }

  /* Chaque exécuteur renvoie { content: string, is_error?: true } — jamais une
     exception : une panne d'outil est un tool_result d'erreur, pas un plantage. */
  function outilArticle(entree) {
    var numero = String(entree && entree.numero || "").trim();
    if (!numero) return Promise.resolve({ content: "Paramètre « numero » manquant.", is_error: true });
    var corps = { action: "article", numero: numero, code: "Code du travail" };
    if (entree.date) corps.date = String(entree.date).slice(0, 10);
    return avecDelai(fetch(RELAIS, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(corps)
    }), 25000).then(function (rep) {
      return rep.json().catch(function () { return null; }).then(function (d) {
        if (!rep.ok || !d || d.erreur)
          return { content: "Relais Légifrance en erreur (" + (d && d.erreur || "HTTP " + rep.status) +
            "). Le relais n'est pas fiable sous charge : réessayer peut suffire.", is_error: true };
        if (!d.trouve)
          return { content: "Article " + numero + " introuvable sur Légifrance" +
            (corps.date ? " à la date " + corps.date : "") +
            " : texte abrogé, renuméroté, ou numéro erroné.", is_error: true };
        var tete = "Article " + (d.num || numero) + " — " + (d.code || "Code du travail") +
          "\nIdentifiant de version : " + (d.id || "inconnu") +
          (d.etat ? "\nÉtat : " + d.etat : "") +
          (d.elargi ? "\nATTENTION : introuvable dans le code du travail sous ce numéro ; " +
            "l'article rendu vient d'un AUTRE code — ne le citer comme code du travail sous aucun prétexte." : "") +
          "\nRappel : le relais peut servir un homonyme d'une autre partie du code ; " +
          "le contenu fait foi.";
        return { content: tete + "\n\n" + tronquer(d.texte || "(texte indisponible)", 14000) };
      });
    }).catch(function (e) {
      return {
        content: e && e.message === "TROP_LONG"
          ? "Le relais Légifrance n'a pas répondu en vingt-cinq secondes."
          : "Relais Légifrance injoignable (réseau).", is_error: true
      };
    });
  }

  /* La recherche elle-même : d'abord le relais de l'application (aucune clé
     envoyée), et si sa clé n'est pas configurée, l'appel direct avec la clé
     personnelle du navigateur. Rend la réponse HTTP, quelle qu'elle soit. */
  function judilibreChercher(paires) {
    if (!relaisJudiAbsent) {
      return avecDelai(fetch(RELAIS_JUDILIBRE, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ chemin: "/search", params: paires })
      }), 20000).then(function (rep) {
        if (rep.status === 503 || rep.status === 404 || rep.status === 405) {
          return rep.json().catch(function () { return null; }).then(function (d) {
            if (rep.status !== 503 || (d && d.erreur === "cle-absente")) {
              relaisJudiAbsent = true;          // relais non activé : repli direct
              return judilibreDirect(paires);
            }
            return rep;                          // autre 503 : rendu tel quel
          });
        }
        return rep;
      }, function () { relaisJudiAbsent = true; return judilibreDirect(paires); });
    }
    return judilibreDirect(paires);
  }

  function judilibreDirect(paires) {
    var k = "";
    try { k = localStorage.getItem(CLE_JUDILIBRE) || ""; } catch (e) {}
    if (!k) return Promise.reject(new Error("PAS_DE_CLE_JUDILIBRE"));
    var p = new URLSearchParams();
    paires.forEach(function (x) { p.append(x[0], x[1]); });
    return avecDelai(fetch(API_JUDILIBRE + "/search?" + p.toString(), {
      headers: { "KeyId": k, "accept": "application/json" }
    }), 20000);
  }

  function outilJudilibre(entree) {
    var q = String(entree && entree.query || "").trim();
    if (!q) return Promise.resolve({ content: "Paramètre « query » manquant.", is_error: true });
    var taille = Math.max(1, Math.min(20, parseInt(entree.page_size, 10) || 10));
    return judilibreChercher([["query", q], ["page_size", String(taille)]]).then(function (rep) {
      if (rep.status === 401 || rep.status === 403)
        return { content: "Clé Judilibre refusée par l'API.", is_error: true };
      if (rep.status === 429)
        return { content: "Quota Judilibre atteint : patienter quelques instants.", is_error: true };
      if (!rep.ok) return { content: "Judilibre en erreur (HTTP " + rep.status + ").", is_error: true };
      return rep.json().then(function (d) {
        /* Règle absolue : une réponse élargie ramène des décisions sans rapport
           avec la recherche — elle est écartée, jamais exploitée. */
        if (d && d.relaxed) return {
          content: "Recherche élargie par l'API (relaxed) : résultats écartés — ils ne " +
            "correspondent pas exactement à la requête. Reformuler avec des termes plus " +
            "proches du vocabulaire des juges, ou une expression plus courte.",
          is_error: true
        };
        var resultats = (d && d.results) || [];
        if (!resultats.length) return { content: "Aucune décision pour « " + q + " » (recherche exacte, non élargie)." };
        var lignes = resultats.map(function (r, i) {
          var jur = r.jurisdiction === "cc" ? "Cour de cassation" : (r.jurisdiction || "");
          return (i + 1) + ". " + [
            r.decision_date || "date inconnue",
            [jur, r.chamber || ""].filter(Boolean).join(" — "),
            r.number ? "n° " + r.number : "",
            r.solution || ""
          ].filter(Boolean).join(" · ") +
            (r.summary ? "\n   Sommaire : " + tronquer(String(r.summary).replace(/\s+/g, " "), 400) : "") +
            (r.id ? "\n   id Judilibre : " + r.id : "");
        });
        return {
          content: "Judilibre — " + (d.total || resultats.length) + " décision(s), recherche exacte " +
            "(non élargie), " + resultats.length + " affichée(s) :\n" + lignes.join("\n")
        };
      });
    }).catch(function (e) {
      if (e && e.message === "PAS_DE_CLE_JUDILIBRE") return {
        content: "La connexion Judilibre de l'application n'est pas activée (variable " +
          "JUDILIBRE_KEY_ID dans les réglages Netlify du site) et aucune clé personnelle " +
          "n'est enregistrée dans ce navigateur. L'utilisatrice peut soit activer la " +
          "connexion du site, soit saisir sa clé sur la page de recherche " +
          "(bandeau « Votre clé Judilibre »).",
        is_error: true
      };
      return {
        content: e && e.message === "TROP_LONG"
          ? "Judilibre n'a pas répondu en vingt secondes."
          : "Judilibre injoignable (réseau, ou api.piste.gouv.fr bloqué).", is_error: true
      };
    });
  }

  function executerOutil(nom, entree) {
    if (nom === "article_code_travail") return outilArticle(entree || {});
    if (nom === "recherche_judilibre") return outilJudilibre(entree || {});
    return Promise.resolve({ content: "Outil inconnu : " + nom, is_error: true });
  }

  /* --------------------- Appel Anthropic en streaming ---------------------- */

  function ErreurApi(code, detail) {
    var e = new Error(code);
    e.detail = detail || "";
    return e;
  }

  /* Un appel à /v1/messages en SSE. `surTexte` reçoit le texte au fil de l'eau ;
     la promesse rend { stop_reason, contenu } où `contenu` est la liste des
     blocs (text, tool_use avec input déjà parsé) à rejouer dans l'historique.

     Par défaut, l'appel passe par le relais de l'application (la clé vit côté
     serveur, rien n'est demandé à l'utilisateur). Si une clé personnelle a été
     saisie en repli, l'appel va directement à api.anthropic.com avec elle. */
  function appelClaude(messages, surTexte, signal) {
    var clePerso = cle();
    var adresse = clePerso ? API_ANTHROPIC : RELAIS_ASSISTANT;
    var entetes = { "content-type": "application/json" };
    if (clePerso) {
      /* La clé personnelle ne part QUE vers api.anthropic.com, jamais ailleurs. */
      entetes["x-api-key"] = clePerso;
      entetes["anthropic-version"] = "2023-06-01";
      entetes["anthropic-dangerous-direct-browser-access"] = "true";
    }
    var corps = {
      model: modele(),
      max_tokens: MAX_TOKENS,
      stream: true,
      /* Pas de paramètre `thinking` : sur claude-opus-5 le raisonnement
         adaptatif est actif par défaut, et le configurer serait refusé. */
      system: [{ type: "text", text: SYSTEME, cache_control: { type: "ephemeral" } }],
      tools: OUTILS,
      messages: messages
    };
    return fetch(adresse, {
      method: "POST",
      headers: entetes,
      body: JSON.stringify(corps),
      signal: signal
    }).catch(function (e) {
      if (e && e.name === "AbortError") throw e;
      throw ErreurApi("RESEAU");
    }).then(function (rep) {
      if (rep.status === 401)
        throw ErreurApi(clePerso ? "CLE_INVALIDE" : "CLE_RELAIS_REFUSEE");
      if (rep.status === 429) throw ErreurApi("QUOTA", rep.headers.get("retry-after") || "");
      if (rep.status === 529 || rep.status >= 500 || !rep.ok) {
        return rep.json().catch(function () { return null; }).then(function (d) {
          /* Le relais signale par un code explicite que la clé du site n'est
             pas configurée : l'assistant n'est pas encore activé. */
          if (d && d.erreur === "cle-absente") throw ErreurApi("CLE_ABSENTE");
          if (rep.status === 529 || rep.status >= 500) throw ErreurApi("SURCHARGE");
          throw ErreurApi("API", d && (d.error && d.error.message || d.erreur) || "HTTP " + rep.status);
        });
      }
      return lireFlux(rep, surTexte);
    });
  }

  function lireFlux(rep, surTexte) {
    var lecteur = rep.body.getReader();
    var decodeur = new TextDecoder();
    var tampon = "";
    var blocs = {};                 // index → bloc en cours d'accumulation
    var stop = null;

    function traiter(donnee) {
      var ev;
      try { ev = JSON.parse(donnee); } catch (e) { return; }
      switch (ev.type) {
        case "content_block_start":
          var b = ev.content_block || {};
          if (b.type === "text") blocs[ev.index] = { type: "text", text: b.text || "" };
          else if (b.type === "tool_use") blocs[ev.index] = { type: "tool_use", id: b.id, name: b.name, json: "" };
          else blocs[ev.index] = { type: b.type };   // thinking, etc. : ignoré au rejeu
          break;
        case "content_block_delta":
          var d = ev.delta || {}, bloc = blocs[ev.index];
          if (!bloc) break;
          if (d.type === "text_delta" && bloc.type === "text") {
            bloc.text += d.text || "";
            surTexte(d.text || "");
          } else if (d.type === "input_json_delta" && bloc.type === "tool_use") {
            bloc.json += d.partial_json || "";
          }
          break;
        case "message_delta":
          if (ev.delta && ev.delta.stop_reason) stop = ev.delta.stop_reason;
          break;
        case "error":
          throw ErreurApi("API", ev.error && ev.error.message || "erreur de flux");
      }
    }

    function boucle() {
      return lecteur.read().then(function (r) {
        if (r.done) return fin();
        tampon += decodeur.decode(r.value, { stream: true });
        var lignes = tampon.split("\n");
        tampon = lignes.pop();
        for (var i = 0; i < lignes.length; i++) {
          var l = lignes[i];
          if (l.lastIndexOf("data:", 0) === 0) traiter(l.slice(5).trim());
        }
        return boucle();
      });
    }

    function fin() {
      var contenu = [];
      Object.keys(blocs).map(Number).sort(function (a, b) { return a - b; }).forEach(function (i) {
        var b = blocs[i];
        if (b.type === "text" && b.text) contenu.push({ type: "text", text: b.text });
        else if (b.type === "tool_use") {
          var entree = {};
          /* L'entrée d'outil se parse toujours en JSON — jamais de lecture de la
             chaîne brute (l'échappement peut varier d'un modèle à l'autre). */
          try { entree = b.json ? JSON.parse(b.json) : {}; } catch (e) { entree = {}; }
          contenu.push({ type: "tool_use", id: b.id, name: b.name, input: entree });
        }
      });
      return { stop_reason: stop, contenu: contenu };
    }

    return boucle();
  }

  /* --------------------------- Boucle d'outils ----------------------------- */

  function conversation(texteUtilisateur) {
    var premier = historique.length === 0;
    var contenu = premier
      ? [{ type: "text", text: construireContexte() }, { type: "text", text: texteUtilisateur }]
      : texteUtilisateur;
    historique.push({ role: "user", content: contenu });

    controleur = new AbortController();
    var tours = 0;

    function tour() {
      tours++;
      if (tours > MAX_TOURS)
        return Promise.reject(ErreurApi("API", "trop d'appels d'outils d'affilée (" + MAX_TOURS + ")"));
      var bulle = null;
      return appelClaude(historique, function (morceau) {
        if (!bulle) bulle = nouvelleBulle("bot");
        bulle.__texte = (bulle.__texte || "") + morceau;
        bulle.innerHTML = rendreTexte(bulle.__texte);
        defiler();
      }, controleur.signal).then(function (r) {
        if (r.contenu.length) historique.push({ role: "assistant", content: r.contenu });

        if (r.stop_reason === "refusal") {
          noteSobre("Claude a décliné cette demande. Reformulez, ou changez d'angle.");
          return;
        }
        if (r.stop_reason === "max_tokens")
          noteSobre("Réponse tronquée (plafond de tokens atteint). Demandez la suite.");

        if (r.stop_reason !== "tool_use") return;   // end_turn : conversation rendue

        /* Exécuter TOUS les appels d'outils, puis renvoyer TOUS les résultats
           dans UN SEUL message user — jamais éclatés. */
        var appels = r.contenu.filter(function (b) { return b.type === "tool_use"; });
        if (!appels.length) return;
        return Promise.all(appels.map(function (a) {
          var note = noteOutil(a.name, a.input);
          return executerOutil(a.name, a.input).then(function (res) {
            note(res.is_error);
            var tr = { type: "tool_result", tool_use_id: a.id, content: res.content };
            if (res.is_error) tr.is_error = true;
            return tr;
          });
        })).then(function (resultats) {
          historique.push({ role: "user", content: resultats });
          return tour();
        });
      });
    }
    return tour();
  }

  /* ------------------------------ Interface -------------------------------- */

  var ui = {};   // références DOM

  var STYLE =
    "#assist-bouton{position:fixed;right:18px;bottom:18px;z-index:9990;width:54px;height:54px;" +
    "border-radius:50%;border:none;background:#1F3864;color:#fff;font:600 22px/1 system-ui;" +
    "cursor:pointer;box-shadow:0 4px 14px rgba(22,24,29,.28);display:flex;align-items:center;" +
    "justify-content:center}" +
    "#assist-bouton:hover{background:#2a4a80}" +
    "#assist-panneau{position:fixed;top:0;right:0;bottom:0;z-index:9991;width:min(430px,100vw);" +
    "background:#fff;border-left:1px solid #dcdfe4;box-shadow:-6px 0 24px rgba(22,24,29,.14);" +
    "display:none;flex-direction:column;font:15px/1.55 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;" +
    "color:#2b313a}" +
    "#assist-panneau.ouvert{display:flex}" +
    ".assist-tete{display:flex;align-items:center;gap:8px;padding:12px 14px;" +
    "border-bottom:1px solid #dcdfe4;background:#f6f7f9}" +
    ".assist-tete b{font:600 16px/1.2 system-ui;color:#16181d;margin-right:auto}" +
    ".assist-tete select{font:13px/1.2 system-ui;padding:5px 6px;border:1px solid #dcdfe4;" +
    "border-radius:7px;background:#fff;color:#2b313a;max-width:110px}" +
    ".assist-tete button{font:13px/1.2 system-ui;padding:6px 10px;border-radius:7px;cursor:pointer;" +
    "border:1px solid #dcdfe4;background:#fff;color:#2b313a}" +
    ".assist-tete button:hover{border-color:#1F3864;color:#1F3864}" +
    "#assist-fil{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}" +
    ".assist-msg{max-width:92%;padding:9px 12px;border-radius:12px;white-space:normal;" +
    "overflow-wrap:break-word}" +
    ".assist-msg.user{align-self:flex-end;background:#1F3864;color:#fff;border-bottom-right-radius:4px}" +
    ".assist-msg.bot{align-self:flex-start;background:#f1f3f6;color:#16181d;border-bottom-left-radius:4px}" +
    ".assist-msg.bot code{background:#e4e8ee;padding:1px 4px;border-radius:4px;font-size:13px}" +
    ".assist-note{align-self:flex-start;font-size:13px;color:#5f6874;background:#fbf7f1;" +
    "border:1px solid #e5d9c4;border-radius:9px;padding:6px 10px}" +
    ".assist-erreur{align-self:stretch;font-size:14px;color:#8a2d2d;background:#fdf3f3;" +
    "border:1px solid #ecc8c8;border-radius:9px;padding:9px 12px}" +
    ".assist-erreur button{margin-top:6px;font:13px/1.2 system-ui;padding:6px 12px;border-radius:7px;" +
    "border:1px solid #8a2d2d;background:#fff;color:#8a2d2d;cursor:pointer;display:block}" +
    ".assist-saisie{display:flex;gap:8px;padding:12px 14px;border-top:1px solid #dcdfe4;background:#f6f7f9}" +
    ".assist-saisie textarea{flex:1;resize:none;font:15px/1.45 system-ui;padding:9px 11px;" +
    "border:1px solid #dcdfe4;border-radius:9px;min-height:44px;max-height:150px;background:#fff;color:#16181d}" +
    ".assist-saisie button{font:600 14px/1 system-ui;padding:0 16px;border-radius:9px;border:none;" +
    "background:#1F3864;color:#fff;cursor:pointer}" +
    ".assist-saisie button:disabled{opacity:.45;cursor:default}" +
    "#assist-cle-ecran{padding:22px 18px;overflow-y:auto}" +
    "#assist-cle-ecran h2{font:600 18px/1.3 system-ui;color:#16181d;margin:0 0 10px}" +
    "#assist-cle-ecran p{margin:0 0 10px;font-size:14px;color:#5f6874}" +
    "#assist-cle-ecran a{color:#1F3864}" +
    "#assist-cle-ecran input{width:100%;font:14px/1.3 ui-monospace,monospace;padding:9px 11px;" +
    "border:1px solid #dcdfe4;border-radius:9px;margin:4px 0 12px;background:#fff;color:#16181d}" +
    "#assist-cle-ecran button{font:600 14px/1 system-ui;padding:11px 18px;border-radius:9px;" +
    "border:none;background:#1F3864;color:#fff;cursor:pointer}" +
    ".assist-pied{padding:7px 14px;border-top:1px solid #eef0f3;font-size:12px;color:#8a93a0;" +
    "display:flex;gap:10px;align-items:center}" +
    ".assist-pied a{color:#8a93a0;cursor:pointer;text-decoration:underline}" +
    "@media (max-width:520px){#assist-panneau{width:100vw}}";

  function nouvelleBulle(genre) {
    var d = document.createElement("div");
    d.className = "assist-msg " + genre;
    ui.fil.appendChild(d);
    defiler();
    return d;
  }

  function noteSobre(texte) {
    var d = document.createElement("div");
    d.className = "assist-note";
    d.textContent = texte;
    ui.fil.appendChild(d);
    defiler();
  }

  /* Une ligne par appel d'outil : ce que fait l'assistant se voit. Renvoie une
     fonction de clôture (réussite / échec). */
  function noteOutil(nom, entree) {
    var d = document.createElement("div");
    d.className = "assist-note";
    var libelle = nom === "article_code_travail"
      ? "Lecture de l'article " + (entree && entree.numero || "?") + " (Légifrance)"
      : nom === "recherche_judilibre"
        ? "Recherche Judilibre : « " + tronquer(entree && entree.query || "?", 60) + " »"
        : "Outil " + nom;
    d.textContent = libelle + "…";
    ui.fil.appendChild(d);
    defiler();
    return function (echec) {
      d.textContent = libelle + (echec ? " — échec (transmis à l'assistant)" : " — reçu");
    };
  }

  function erreurUi(err) {
    var d = document.createElement("div");
    d.className = "assist-erreur";
    var texte, bouton = null;
    switch (err.message) {
      case "CLE_INVALIDE":
        texte = "Clé invalide : l'API Anthropic a refusé cette clé (401).";
        bouton = { libelle: "Ressaisir la clé", action: function () { montrerEcranCle(true); } };
        break;
      case "CLE_ABSENTE":
        texte = "L'assistant n'est pas encore activé : ajouter la variable " +
          "ANTHROPIC_API_KEY dans les réglages Netlify du site (Site configuration " +
          "→ Environment variables). En attendant, une clé personnelle peut servir de recours.";
        bouton = { libelle: "Saisir une clé personnelle", action: function () { montrerEcranCle(false); } };
        break;
      case "CLE_RELAIS_REFUSEE":
        texte = "La clé configurée dans Netlify est refusée par l'API Anthropic (401) : " +
          "la vérifier dans les réglages du site. Une clé personnelle peut servir de recours.";
        bouton = { libelle: "Saisir une clé personnelle", action: function () { montrerEcranCle(false); } };
        break;
      case "QUOTA":
        var attente = parseInt(err.detail, 10);
        texte = "Limite de requêtes atteinte (429)." +
          (attente ? " Réessayez dans " + attente + " seconde" + (attente > 1 ? "s" : "") + "." : " Patientez un instant.");
        bouton = { libelle: "Réessayer", action: reessayer, delai: attente ? attente * 1000 : 0 };
        break;
      case "SURCHARGE":
        texte = "L'API Anthropic est momentanément surchargée.";
        bouton = { libelle: "Réessayer", action: reessayer };
        break;
      case "RESEAU":
        texte = "Connexion impossible à api.anthropic.com. L'assistant exige la connexion " +
          "— le reste de l'application fonctionne hors ligne, pas ce panneau.";
        bouton = { libelle: "Réessayer", action: reessayer };
        break;
      default:
        texte = "L'API a répondu par une erreur : " + (err.detail || err.message);
        bouton = { libelle: "Réessayer", action: reessayer };
    }
    d.textContent = texte;
    if (bouton) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = bouton.libelle;
      if (bouton.delai) {
        b.disabled = true;
        setTimeout(function () { b.disabled = false; }, bouton.delai);
      }
      b.addEventListener("click", function () { d.remove(); bouton.action(); });
      d.appendChild(b);
    }
    ui.fil.appendChild(d);
    defiler();
  }

  function defiler() { ui.fil.scrollTop = ui.fil.scrollHeight; }

  function verrouiller(v) {
    enCours = v;
    ui.envoyer.disabled = v;
    ui.champ.disabled = v;
    ui.envoyer.textContent = v ? "…" : "Envoyer";
  }

  function envoyer(texte) {
    texte = (texte == null ? ui.champ.value : texte).trim();
    if (!texte || enCours) return;
    /* Aucune clé exigée : le relais de l'application porte la connexion. */
    ui.champ.value = "";
    dernierTexte = texte;
    var instantane = historique.length;      // pour revenir en arrière si l'appel échoue
    nouvelleBulle("user").textContent = texte;
    verrouiller(true);
    conversation(texte).catch(function (e) {
      if (e && e.name === "AbortError") { noteSobre("Réponse interrompue."); return; }
      /* L'appel a échoué : on retire le tour raté de l'historique pour que
         « Réessayer » reparte d'un état propre. */
      historique.length = instantane;
      erreurUi(e);
    }).then(function () { verrouiller(false); ui.champ.focus(); });
  }

  function reessayer() {
    if (dernierTexte) envoyer(dernierTexte);
  }

  function nouvelleConversation() {
    if (controleur) { try { controleur.abort(); } catch (e) {} }
    historique = [];
    dernierTexte = null;
    ui.fil.innerHTML = "";
    verrouiller(false);
    noteSobre("Nouvelle conversation. Le contexte de la page (brouillon, profil) sera joint au premier message.");
  }

  /* --------------------------- Écran de la clé ----------------------------- */

  /* L'écran de clé PERSONNELLE — un repli, jamais un préalable : par défaut,
     c'est le relais de l'application qui porte la connexion. */
  function montrerEcranCle(remplacement) {
    ui.fil.style.display = "none";
    ui.saisie.style.display = "none";
    ui.pied.style.display = "none";
    ui.ecranCle.style.display = "block";
    ui.ecranCle.innerHTML =
      "<h2>" + (remplacement ? "Ressaisir la clé personnelle" : "Clé API personnelle (recours)") + "</h2>" +
      "<p>Par défaut, l'assistant passe par la connexion de l'application — aucune clé " +
      "à fournir. Cet écran sert de recours si cette connexion n'est pas activée&nbsp;: " +
      "avec une clé personnelle, le navigateur appelle alors l'API Anthropic directement. " +
      "La clé reste dans ce navigateur (stockage local), n'est envoyée qu'à " +
      "api.anthropic.com, et jamais dans un serveur de l'application ni dans le code.</p>" +
      "<p>Pas encore de clé&nbsp;? Créez-la sur " +
      '<a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">console.anthropic.com</a>' +
      " (rubrique «&nbsp;API keys&nbsp;»).</p>" +
      '<label for="assist-cle-champ" style="font-size:13px;color:#2b313a">Clé API (sk-ant-…)</label>' +
      '<input id="assist-cle-champ" type="password" autocomplete="off" spellcheck="false" placeholder="sk-ant-…">' +
      '<button type="button" id="assist-cle-ok">Enregistrer la clé</button> ' +
      '<button type="button" id="assist-cle-annuler" style="background:#fff;color:#2b313a;border:1px solid #dcdfe4">Annuler</button>' +
      (cle() ? '<p style="margin-top:12px;font-size:12.5px"><a id="assist-cle-retirer" ' +
        'style="color:#8a2d2d;cursor:pointer;text-decoration:underline">Retirer la clé personnelle</a> ' +
        "et revenir à la connexion de l'application.</p>" : "");
    var champ = document.getElementById("assist-cle-champ");
    var ok = document.getElementById("assist-cle-ok");
    function valider() {
      var v = champ.value.trim();
      if (!v) { champ.focus(); return; }
      try { localStorage.setItem(CLE_STOCKAGE, v); } catch (e) {
        alert("Impossible d'enregistrer la clé (stockage local indisponible).");
        return;
      }
      masquerEcranCle();
    }
    ok.addEventListener("click", valider);
    document.getElementById("assist-cle-annuler").addEventListener("click", masquerEcranCle);
    var retirer = document.getElementById("assist-cle-retirer");
    if (retirer) retirer.addEventListener("click", function () {
      try { localStorage.removeItem(CLE_STOCKAGE); } catch (e) {}
      masquerEcranCle();
    });
    champ.addEventListener("keydown", function (e) { if (e.key === "Enter") valider(); });
    champ.focus();
  }

  function masquerEcranCle() {
    ui.ecranCle.style.display = "none";
    ui.fil.style.display = "flex";
    ui.saisie.style.display = "flex";
    ui.pied.style.display = "flex";
    ui.champ.focus();
  }

  /* ---------------------------- Construction ------------------------------- */

  function construire() {
    var style = document.createElement("style");
    style.textContent = STYLE;
    document.head.appendChild(style);

    var bouton = document.createElement("button");
    bouton.id = "assist-bouton";
    bouton.type = "button";
    bouton.setAttribute("aria-label", "Ouvrir l'assistant Claude");
    bouton.title = "Assistant Claude";
    bouton.innerHTML = "&#10022;";              // ✦
    document.body.appendChild(bouton);

    var panneau = document.createElement("aside");
    panneau.id = "assist-panneau";
    panneau.setAttribute("aria-label", "Assistant Claude");
    panneau.innerHTML =
      '<div class="assist-tete">' +
      "<b>Assistant</b>" +
      '<select id="assist-modele" aria-label="Modèle">' +
      MODELES.map(function (m) { return '<option value="' + m.id + '">' + m.nom + "</option>"; }).join("") +
      "</select>" +
      '<button type="button" id="assist-nouvelle" title="Effacer la conversation">Nouvelle</button>' +
      '<button type="button" id="assist-fermer" aria-label="Fermer">&#10005;</button>' +
      "</div>" +
      '<div id="assist-cle-ecran" style="display:none"></div>' +
      '<div id="assist-fil" aria-live="polite"></div>' +
      '<div class="assist-saisie">' +
      '<textarea id="assist-champ" rows="2" placeholder="Votre question… (Entrée pour envoyer)" aria-label="Message"></textarea>' +
      '<button type="button" id="assist-envoyer">Envoyer</button>' +
      "</div>" +
      '<div class="assist-pied">' +
      "<span>La conversation reste en mémoire, rien n'est conservé.</span>" +
      '<a id="assist-changer-cle" style="margin-left:auto">clé personnelle</a>' +
      "</div>";
    document.body.appendChild(panneau);

    ui.panneau = panneau;
    ui.fil = document.getElementById("assist-fil");
    ui.champ = document.getElementById("assist-champ");
    ui.envoyer = document.getElementById("assist-envoyer");
    ui.ecranCle = document.getElementById("assist-cle-ecran");
    ui.saisie = panneau.querySelector(".assist-saisie");
    ui.pied = panneau.querySelector(".assist-pied");

    var selecteur = document.getElementById("assist-modele");
    selecteur.value = modele();
    selecteur.addEventListener("change", function () {
      try { localStorage.setItem(CLE_MODELE, selecteur.value); } catch (e) {}
    });

    bouton.addEventListener("click", function () {
      /* Pas d'écran de clé au premier usage : l'assistant tente d'abord le
         relais de l'application, qui porte la connexion. */
      if (panneau.classList.toggle("ouvert")) ui.champ.focus();
    });
    document.getElementById("assist-fermer").addEventListener("click", function () {
      panneau.classList.remove("ouvert");
    });
    document.getElementById("assist-nouvelle").addEventListener("click", nouvelleConversation);
    document.getElementById("assist-changer-cle").addEventListener("click", function () {
      montrerEcranCle(!!cle());
    });
    ui.envoyer.addEventListener("click", function () { envoyer(); });
    ui.champ.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); envoyer(); }
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", construire);
  else
    construire();
})();
