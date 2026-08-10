/* =========================================================================
   Relais Légifrance.

   Raison d'être : l'API Légifrance exige un jeton OAuth2, et le serveur
   d'authentification de PISTE (oauth.piste.gouv.fr) répond 403 à toute requête
   portant un en-tête « Origin » — c'est-à-dire à toute requête émise par un
   navigateur. Une page web ne peut donc pas obtenir de jeton elle-même.

   Ce relais fait ce travail côté serveur : il détient les identifiants PISTE
   (variables d'environnement, jamais dans le code), obtient le jeton, interroge
   Légifrance et ne renvoie au navigateur que le texte de l'article demandé.

   Variables d'environnement attendues :
     PISTE_CLIENT_ID      identifiant OAuth de l'application PISTE
     PISTE_CLIENT_SECRET  secret associé
     ORIGINES_AUTORISEES  (facultatif) origines séparées par des virgules
   ========================================================================= */

const LF_OAUTH = "https://oauth.piste.gouv.fr/api/oauth/token";
const LF_API   = "https://api.piste.gouv.fr/dila/legifrance/lf-engine-app";

/* Origines autorisées à appeler ce relais. Le limiter évite qu'un tiers ne
   consomme le quota PISTE du propriétaire. */
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

/* Jeton mis en cache entre deux invocations tant que l'instance reste chaude. */
let jeton = null, expire = 0;

async function obtenirJeton(){
  const id = process.env.PISTE_CLIENT_ID, secret = process.env.PISTE_CLIENT_SECRET;
  if(!id || !secret) throw new Error("RELAIS_NON_CONFIGURE");
  if(jeton && Date.now() < expire) return jeton;
  const rep = await fetch(LF_OAUTH, {
    method: "POST",
    headers: {"content-type":"application/x-www-form-urlencoded"},
    body: new URLSearchParams({grant_type:"client_credentials",
      client_id:id, client_secret:secret, scope:"openid"}),
  });
  if(!rep.ok) throw new Error(rep.status===429 ? "QUOTA" : "IDENTIFIANTS_REFUSES");
  const d = await rep.json();
  if(!d.access_token) throw new Error("IDENTIFIANTS_REFUSES");
  jeton = d.access_token;
  expire = Date.now() + Math.max(60, (Number(d.expires_in)||3600) - 60)*1000;
  return jeton;
}

async function appelLegifrance(chemin, corps){
  const t = await obtenirJeton();
  const rep = await fetch(LF_API+chemin, {
    method: "POST",
    headers: {"Authorization":"Bearer "+t, "content-type":"application/json", "accept":"application/json"},
    body: JSON.stringify(corps),
  });
  if(rep.status===401){ jeton = null; throw new Error("IDENTIFIANTS_REFUSES"); }
  if(rep.status===403) throw new Error("API_NON_SOUSCRITE");
  if(rep.status===429) throw new Error("QUOTA");
  if(!rep.ok) throw new Error("HTTP_"+rep.status);
  return rep.json();
}

/* « L. 1154-1 » → « L1154-1 » : format attendu par le champ NUM_ARTICLE. */
function normaliserNumero(n){
  const s = String(n||"").trim();
  const m = /^([A-Za-z]+)\.?\s*(.+)$/.exec(s);
  return (m ? m[1]+m[2] : s).replace(/\s+/g,"");
}

async function chercherArticle(numero, nomCode, dateIso){
  const filtres = [];
  if(nomCode) filtres.push({facette:"NOM_CODE", valeurs:[nomCode]});
  const t = dateIso ? Date.parse(String(dateIso).slice(0,10)) : NaN;
  if(!Number.isNaN(t)) filtres.push({facette:"DATE_VERSION", singleDate:t});
  const d = await appelLegifrance("/search", {
    fond: "CODE_DATE",
    recherche: {
      filtres, sort:"PERTINENCE", operateur:"ET", typePagination:"DEFAUT",
      pageNumber:1, pageSize:10,
      champs:[{typeChamp:"NUM_ARTICLE", operateur:"ET",
        criteres:[{typeRecherche:"EXACTE", valeur:normaliserNumero(numero), operateur:"ET"}]}],
    },
  });
  for(const item of (d.results||[])){
    for(const sec of (item.sections||[])){
      for(const ex of (sec.extracts||[])){
        if(ex.type && ex.type!=="articles") continue;
        if(ex.id) return {id:ex.id, num:ex.num, titreCode:item.title||item.titre||nomCode||""};
      }
    }
    if(item.id && /^LEGIARTI/.test(item.id)) return {id:item.id, num:item.num, titreCode:item.title||""};
  }
  return null;
}

async function lireArticle(id, dateIso){
  const corps = {id};
  if(dateIso) corps.date = String(dateIso).slice(0,10);
  const d = await appelLegifrance("/consult/getArticle", corps);
  const a = d.article || d;
  return {
    id: a.id||id,
    num: a.num||a.numero||"",
    texte: a.texte || a.contenu || (Array.isArray(a.values) ? a.values.join("\n") : ""),
    etat: a.etat||"",
  };
}

export default async (req) => {
  const origine = req.headers.get("origin");
  const entetes = enTetesCors(origine);

  if(req.method === "OPTIONS") return new Response(null, {status:204, headers:entetes});
  if(req.method !== "POST")
    return new Response(JSON.stringify({erreur:"METHODE"}), {status:405, headers:entetes});
  /* Origine inconnue : on refuse plutôt que de laisser consommer le quota. */
  if(origine && !entetes["access-control-allow-origin"])
    return new Response(JSON.stringify({erreur:"ORIGINE_REFUSEE"}), {status:403, headers:entetes});

  let demande;
  try{ demande = await req.json(); }
  catch(e){ return new Response(JSON.stringify({erreur:"REQUETE_INVALIDE"}), {status:400, headers:entetes}); }

  const numero = String(demande.numero||"").slice(0,40);
  const code   = demande.code ? String(demande.code).slice(0,120) : null;
  const date   = demande.date ? String(demande.date).slice(0,10) : null;
  if(!numero)
    return new Response(JSON.stringify({erreur:"NUMERO_MANQUANT"}), {status:400, headers:entetes});

  try{
    /* Le nom du code déduit de la citation peut être imparfait : on réessaie
       sans restriction plutôt que de conclure à une absence. */
    let trouve = await chercherArticle(numero, code, date);
    let elargi = false;
    if(!trouve && code){
      trouve = await chercherArticle(numero, null, date);
      elargi = !!trouve;
    }
    if(!trouve)
      return new Response(JSON.stringify({trouve:false}), {status:200, headers:entetes});

    const art = await lireArticle(trouve.id, date);
    return new Response(JSON.stringify({
      trouve: true, elargi,
      id: art.id, num: art.num || trouve.num || numero,
      texte: art.texte, etat: art.etat,
      code: trouve.titreCode || code || "",
    }), {status:200, headers:entetes});
  }catch(e){
    const connues = ["RELAIS_NON_CONFIGURE","IDENTIFIANTS_REFUSES","API_NON_SOUSCRITE","QUOTA"];
    const code_err = connues.includes(e.message) ? e.message : "ERREUR_LEGIFRANCE";
    const statut = code_err==="QUOTA" ? 429 : (code_err==="RELAIS_NON_CONFIGURE" ? 503 : 502);
    return new Response(JSON.stringify({erreur:code_err}), {status:statut, headers:entetes});
  }
};
