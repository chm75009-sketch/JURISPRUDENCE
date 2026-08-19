/* =========================================================================
   Relais Anthropic — l'assistant de l'application.

   Raison d'être : c'est l'application qui porte la connexion à Claude, sur le
   modèle du relais Légifrance — la clé API Anthropic vit dans une variable
   d'environnement Netlify, jamais dans le code, jamais dans le navigateur des
   utilisateurs. Le navigateur envoie le corps d'une requête Messages ; le
   relais y appose la clé côté serveur et RETRANSMET LE FLUX SSE tel quel.

   Ce que le relais ne fait jamais :
   — journaliser ou renvoyer la clé ;
   — appeler autre chose que api.anthropic.com/v1/messages (aucun champ d'URL
     ou de point d'accès n'est accepté du navigateur) ;
   — laisser passer un corps non borné (max_tokens plafonné à 16000, seuls les
     champs attendus sont transmis, modèle pris dans une liste fermée).

   Variables d'environnement attendues :
     ANTHROPIC_API_KEY    la clé API Anthropic du site (absente → 503
                          { erreur: "cle-absente" }, que la page sait afficher)
     ORIGINES_AUTORISEES  (facultatif) origines séparées par des virgules
   ========================================================================= */

const API_ANTHROPIC = "https://api.anthropic.com/v1/messages";
const VERSION_API = "2023-06-01";
const MAX_TOKENS_PLAFOND = 16000;
const MODELES_PERMIS = ["claude-opus-5", "claude-sonnet-5", "claude-haiku-4-5"];

/* Origines autorisées — même politique que le relais Légifrance : le limiter
   évite qu'un tiers ne consomme le crédit API du propriétaire. */
const ORIGINES_PAR_DEFAUT = [
  "https://chm75009-sketch.github.io",
];
function originesAutorisees(){
  const sup = (process.env.ORIGINES_AUTORISEES||"").split(",").map(s=>s.trim()).filter(Boolean);
  return ORIGINES_PAR_DEFAUT.concat(sup);
}
function enTetesCors(origine){
  const permis = originesAutorisees();
  const h = {"content-type":"application/json; charset=utf-8"};
  /* Une requête de même origine n'envoie pas d'en-tête Origin : rien à ajouter. */
  if(origine && (permis.includes(origine) || /\.netlify\.app$/.test(new URL(origine).hostname))){
    h["access-control-allow-origin"] = origine;
    h["vary"] = "Origin";
  }
  h["access-control-allow-headers"] = "content-type";
  h["access-control-allow-methods"] = "POST, OPTIONS";
  return h;
}

export default async (req) => {
  const origine = req.headers.get("origin");
  const entetes = enTetesCors(origine);

  if(req.method === "OPTIONS") return new Response(null, {status:204, headers:entetes});
  if(req.method !== "POST")
    return new Response(JSON.stringify({erreur:"METHODE"}), {status:405, headers:entetes});
  if(origine && !entetes["access-control-allow-origin"])
    return new Response(JSON.stringify({erreur:"ORIGINE_REFUSEE"}), {status:403, headers:entetes});

  /* La clé du site. Jamais journalisée, jamais renvoyée : elle ne sert qu'à
     construire l'en-tête du seul appel sortant. */
  const cle = process.env.ANTHROPIC_API_KEY;
  if(!cle)
    return new Response(JSON.stringify({erreur:"cle-absente"}), {status:503, headers:entetes});

  let demande;
  try{ demande = await req.json(); }
  catch(e){ return new Response(JSON.stringify({erreur:"REQUETE_INVALIDE"}), {status:400, headers:entetes}); }

  if(!Array.isArray(demande.messages) || !demande.messages.length)
    return new Response(JSON.stringify({erreur:"REQUETE_INVALIDE"}), {status:400, headers:entetes});

  /* Seuls les champs attendus sont transmis, et bornés. Rien de ce que le
     navigateur envoie ne peut changer la destination de l'appel. */
  const corps = {
    model: MODELES_PERMIS.includes(demande.model) ? demande.model : MODELES_PERMIS[0],
    max_tokens: Math.max(1, Math.min(MAX_TOKENS_PLAFOND, parseInt(demande.max_tokens, 10) || MAX_TOKENS_PLAFOND)),
    stream: !!demande.stream,
    messages: demande.messages,
  };
  if(demande.system != null) corps.system = demande.system;
  if(Array.isArray(demande.tools)) corps.tools = demande.tools;

  let rep;
  try{
    rep = await fetch(API_ANTHROPIC, {
      method: "POST",
      headers: {
        "x-api-key": cle,
        "anthropic-version": VERSION_API,
        "content-type": "application/json",
      },
      body: JSON.stringify(corps),
    });
  }catch(e){
    return new Response(JSON.stringify({erreur:"ANTHROPIC_INJOIGNABLE"}), {status:502, headers:entetes});
  }

  /* Retransmission telle quelle : statut, type de contenu, et le CORPS EN FLUX
     — le navigateur lit le SSE au fil de l'eau comme s'il parlait à l'API.
     (Si la plateforme met le flux en tampon, la page reçoit tout d'un bloc et
     le parse à l'identique : dégradation d'affichage, jamais de panne.) */
  const sortie = Object.assign({}, entetes);
  sortie["content-type"] = rep.headers.get("content-type") || "application/json; charset=utf-8";
  const attente = rep.headers.get("retry-after");
  if(attente) sortie["retry-after"] = attente;
  /* L'en-tête retry-after doit être lisible par la page (requête cross-origin). */
  sortie["access-control-expose-headers"] = "retry-after";
  if(corps.stream){
    sortie["cache-control"] = "no-cache";
    sortie["x-accel-buffering"] = "no";
  }
  return new Response(rep.body, {status: rep.status, headers: sortie});
};
