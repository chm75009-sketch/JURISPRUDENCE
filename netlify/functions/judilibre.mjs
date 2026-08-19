/* =========================================================================
   Relais Judilibre — la clé portée par l'application.

   Raison d'être : sur le modèle des relais Légifrance et Anthropic, c'est
   l'application qui détient la clé Judilibre (variable d'environnement
   Netlify, jamais dans le code — le dépôt est public). Le navigateur demande
   un chemin de l'API et ses paramètres ; le relais y appose la clé et renvoie
   la réponse telle quelle. La règle « relaxed → écarté » reste appliquée côté
   page : le relais ne filtre rien, il ne fait que porter la clé.

   Si la variable n'est pas configurée, une clé apportée par le navigateur
   (mode historique, localStorage de l'utilisateur) sert de repli. Ni l'une ni
   l'autre ne sont journalisées ni renvoyées.

   Variables d'environnement attendues :
     JUDILIBRE_KEY_ID     la clé (KeyId PISTE) du site ; absente et aucune clé
                          apportée → 503 { erreur: "cle-absente" }
     ORIGINES_AUTORISEES  (facultatif) origines séparées par des virgules
   ========================================================================= */

const API_JUDILIBRE = "https://api.piste.gouv.fr/cassation/judilibre/v1.0";

/* Seuls les chemins que l'application utilise : le relais n'est pas un proxy
   ouvert vers PISTE. */
const CHEMINS_PERMIS = ["/search", "/decision", "/taxonomy"];

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

  let demande;
  try{ demande = await req.json(); }
  catch(e){ return new Response(JSON.stringify({erreur:"REQUETE_INVALIDE"}), {status:400, headers:entetes}); }

  /* La clé du site d'abord ; à défaut, celle que le navigateur apporte (mode
     historique). Jamais journalisée, jamais renvoyée. */
  const cle = process.env.JUDILIBRE_KEY_ID || String(demande.cle||"").slice(0,120);
  if(!cle)
    return new Response(JSON.stringify({erreur:"cle-absente"}), {status:503, headers:entetes});

  const chemin = String(demande.chemin||"");
  if(!CHEMINS_PERMIS.includes(chemin))
    return new Response(JSON.stringify({erreur:"CHEMIN_REFUSE"}), {status:400, headers:entetes});

  /* Les paramètres arrivent en paires [clé, valeur] : certains se répètent
     (field, jurisdiction…), un objet les écraserait. */
  const params = new URLSearchParams();
  for(const paire of (Array.isArray(demande.params) ? demande.params.slice(0,80) : [])){
    if(Array.isArray(paire) && paire.length === 2)
      params.append(String(paire[0]).slice(0,40), String(paire[1]).slice(0,300));
  }

  let rep;
  try{
    rep = await fetch(API_JUDILIBRE+chemin+"?"+params.toString(),
      {headers:{"KeyId":cle, "accept":"application/json"}});
  }catch(e){
    return new Response(JSON.stringify({erreur:"JUDILIBRE_INJOIGNABLE"}), {status:502, headers:entetes});
  }

  /* Réponse retransmise telle quelle : la page garde ses règles (relaxed
     écarté, messages d'erreur), le relais ne fait que porter la clé. */
  const corps = await rep.text();
  const sortie = Object.assign({}, entetes);
  sortie["content-type"] = rep.headers.get("content-type") || "application/json; charset=utf-8";
  return new Response(corps, {status: rep.status, headers: sortie});
};
