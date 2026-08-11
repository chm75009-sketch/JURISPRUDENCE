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

/* =========================================================================
   Fonds KALI — conventions collectives nationales.

   Même API, même abonnement, mêmes identifiants que les codes : seuls les
   points d'accès diffèrent. La hiérarchie est : un CONTENEUR (KALICONT) par
   convention, identifié par son numéro IDCC, qui regroupe des TEXTES
   (KALITEXT : texte de base, annexes, avenants), eux-mêmes composés de
   sections (KALISCTA) et d'articles (KALIARTI).

   Les formes de réponse de la DILA varient d'un fonds à l'autre et ne sont pas
   documentées champ par champ. La lecture ci-dessous est donc tolérante : elle
   accepte plusieurs noms pour la même donnée, et, si elle ne reconnaît rien,
   renvoie la liste des clés rencontrées plutôt qu'un silence — un défaut qu'on
   ne peut pas diagnostiquer est un défaut qu'on ne corrige pas.
   ========================================================================= */

const prem = (o, ...noms) => { for(const n of noms) if(o && o[n] != null && o[n] !== "") return o[n]; return ""; };
const tab  = (o, ...noms) => { for(const n of noms) if(Array.isArray(o && o[n])) return o[n]; return []; };

/* Recherche de conventions par intitulé, ou par numéro IDCC. */
async function chercherConventions(q, idcc){
  const champ = idcc ? "IDCC" : "TITLE";
  const valeur = idcc || q;
  const filtres = [{facette:"LEGAL_STATUS", valeurs:["VIGUEUR","VIGUEUR_ETEN","VIGUEUR_NON_ETEN"]}];
  if(idcc) filtres.push({facette:"IDCC", valeurs:[String(idcc)]});
  const d = await appelLegifrance("/search", {
    fond: "KALI",
    recherche: {
      filtres, sort:"PERTINENCE", operateur:"ET", typePagination:"DEFAUT",
      pageNumber:1, pageSize:20,
      champs:[{typeChamp:champ, operateur:"ET",
        criteres:[{typeRecherche:"UN_DES_MOTS", valeur:String(valeur), operateur:"ET"}]}],
    },
  });
  const sortie = (d.results||[]).map(r => ({
    id: prem(r, "id", "cid", "titleId"),
    titre: prem(r, "title", "titre", "nature"),
    idcc: prem(r, "idcc", "numIdcc"),
    etat: prem(r, "etat", "legalStatus"),
  })).filter(x => x.id || x.titre);
  return sortie.length ? sortie : {vide:true, cles:Object.keys(d||{})};
}

/* Une convention entière : son intitulé et la liste de ses textes. */
async function lireConvention(idcc, id){
  const d = id
    ? await appelLegifrance("/consult/kaliCont", {id:String(id)})
    : await appelLegifrance("/consult/kaliContIdcc", {id:String(idcc)});
  const c = d.container || d.conteneur || d;
  const textes = [];
  const parcourir = (n, chemin) => {
    if(!n || typeof n !== "object") return;
    const titre = prem(n, "title", "titre", "nature");
    const ident = prem(n, "id", "cid");
    if(/^KALITEXT/.test(String(ident)))
      textes.push({ id:String(ident), titre:String(titre||"(sans intitulé)"),
        nature: prem(n, "nature", "type"), date: prem(n, "dateTexte", "dateDebut", "datePubli"),
        etat: prem(n, "etat", "legalStatus"), chemin });
    for(const cle of ["sections","children","enfants","articles","textes","texts","liens"])
      for(const f of tab(n, cle)) parcourir(f, chemin.concat(titre ? [String(titre)] : []));
  };
  parcourir(c, []);
  return {
    titre: String(prem(c, "title", "titre") || ""),
    idcc: String(prem(c, "idcc", "numIdcc") || idcc || ""),
    id: String(prem(c, "id", "cid") || id || ""),
    textes,
    ...(textes.length ? {} : {diag:{cles:Object.keys(c||{})}}),
  };
}

/* Le contenu d'un texte : sections et articles, à plat et dans l'ordre. */
async function lireTexteCcn(id){
  const d = await appelLegifrance("/consult/kaliText", {id:String(id)});
  const t = d.text || d.texte || d;
  const blocs = [];
  const parcourir = (n, niveau) => {
    if(!n || typeof n !== "object") return;
    const titre = prem(n, "title", "titre", "intitule");
    const contenu = prem(n, "content", "contenu", "texteHtml", "texte");
    const num = prem(n, "num", "numero");
    if(titre && !contenu) blocs.push({type:"section", niveau, titre:String(titre)});
    if(contenu) blocs.push({type:"article", niveau, num:String(num||""),
                            titre:String(titre||""), html:String(contenu)});
    for(const cle of ["sections","articles","children","enfants"])
      for(const f of tab(n, cle)) parcourir(f, niveau+1);
  };
  parcourir(t, 0);
  return {
    id: String(prem(t, "id", "cid") || id),
    titre: String(prem(t, "title", "titre") || ""),
    date: String(prem(t, "dateTexte", "dateDebut", "datePubli") || ""),
    etat: String(prem(t, "etat", "legalStatus") || ""),
    blocs,
    ...(blocs.length ? {} : {diag:{cles:Object.keys(t||{})}}),
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

  /* Conventions collectives. L'absence d'« action » conserve le comportement
     d'origine : une version ancienne de la page continue de fonctionner. */
  const action = String(demande.action||"").slice(0,20);
  if(action.startsWith("ccn")){
    const erreurs = ["RELAIS_NON_CONFIGURE","IDENTIFIANTS_REFUSES","API_NON_SOUSCRITE","QUOTA"];
    try{
      let r;
      if(action === "ccn-recherche")
        r = await chercherConventions(String(demande.q||"").slice(0,120),
                                      String(demande.idcc||"").slice(0,10));
      else if(action === "ccn-texte")
        r = await lireTexteCcn(String(demande.id||"").slice(0,40));
      else
        r = await lireConvention(String(demande.idcc||"").slice(0,10),
                                 String(demande.id||"").slice(0,40));
      return new Response(JSON.stringify(r), {status:200, headers:entetes});
    }catch(e){
      const c = erreurs.includes(e.message) ? e.message : "ERREUR_LEGIFRANCE";
      const s = c==="QUOTA" ? 429 : (c==="RELAIS_NON_CONFIGURE" ? 503 : 502);
      return new Response(JSON.stringify({erreur:c, detail:String(e.message).slice(0,80)}),
                          {status:s, headers:entetes});
    }
  }

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
