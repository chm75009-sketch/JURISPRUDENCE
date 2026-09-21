/* =========================================================================
   Relais Gallica - la presse numérisée de la Bibliothèque nationale.

   Raison d'être : le navigateur ne peut pas interroger Gallica directement.
   D'une part la bibliothèque ne renvoie aucun en-tête d'autorisation croisée,
   d'autre part elle refuse par un 403 toute requête dépourvue d'en-tête
   d'agent - mesuré le 21 septembre 2026, le même appel passe avec, échoue
   sans. Le relais ajoute l'en-tête, appelle Gallica, et renvoie un JSON déjà
   mis en forme : la page n'a pas à lire du XML.

   Aucune clé n'est nécessaire : les services utilisés ici sont ouverts.

     action "recherche"  le catalogue, par le protocole SRU
     action "detail"     la date exacte d'un numéro et les passages trouvés
     action "texte"      le texte océrisé d'une page, tiré de son fichier ALTO

   Ce que le relais ne sait pas faire, et qu'il ne faut pas lui demander :
   RetroNews, Europresse et les archives payantes des journaux exigent un
   compte. Rien ici n'y donne accès.

   Variables d'environnement : aucune.
     ORIGINES_AUTORISEES  (facultatif) origines séparées par des virgules
   ========================================================================= */

const SRU      = "https://gallica.bnf.fr/SRU";
const SERVICES = "https://gallica.bnf.fr/services";
const ELEMENT  = "https://gallica.bnf.fr/RequestDigitalElement";

const AGENT = "Mozilla/5.0 (compatible; presse-ancienne/1.0)";

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
  if(origine){
    let hote = "";
    try{ hote = new URL(origine).hostname; }catch(e){ hote = ""; }
    if(permis.includes(origine) || /\.netlify\.app$/.test(hote)){
      h["access-control-allow-origin"] = origine;
      h["vary"] = "Origin";
    }
  }
  h["access-control-allow-headers"] = "content-type";
  h["access-control-allow-methods"] = "POST, OPTIONS";
  return h;
}

/* ---------- Lecture du XML, sans bibliothèque ---------------------------- */

function deXml(s){
  return String(s||"")
    .replace(/&lt;/g,"<").replace(/&gt;/g,">")
    .replace(/&quot;/g,'"').replace(/&apos;/g,"'")
    .replace(/&#x([0-9a-fA-F]+);/g, (m,h)=>String.fromCodePoint(parseInt(h,16)))
    .replace(/&#(\d+);/g, (m,d)=>String.fromCodePoint(parseInt(d,10)))
    .replace(/&amp;/g,"&");
}
/* Le contenu de Gallica arrive encodé deux fois : &amp;#224; pour à. Une
   première passe rend &#224;, la seconde rend la lettre. */
function deEntites(s){
  return String(s||"")
    .replace(/&#x([0-9a-fA-F]+);/g, (m,h)=>String.fromCodePoint(parseInt(h,16)))
    .replace(/&#(\d+);/g, (m,d)=>String.fromCodePoint(parseInt(d,10)))
    .replace(/&lt;/g,"<").replace(/&gt;/g,">")
    .replace(/&quot;/g,'"').replace(/&apos;/g,"'")
    .replace(/&amp;/g,"&");
}
function premier(xml, nom){
  const m = new RegExp("<"+nom+"[^>]*>([\\s\\S]*?)</"+nom+">").exec(xml);
  return m ? m[1] : "";
}
function toutes(xml, nom){
  const re = new RegExp("<"+nom+"[^>]*>([\\s\\S]*?)</"+nom+">","g");
  const out = []; let m;
  while((m = re.exec(xml))) out.push(m[1]);
  return out;
}

/* Les guillemets et les antislashs briseraient la requête SRU : ils sortent. */
function propre(s, taille){
  return String(s||"").replace(/["\\]/g," ").replace(/\s+/g," ").trim().slice(0, taille||120);
}
/* Une date arrive en 2026-09-21 et repart en 2026/09/21, la seule forme que
   le champ gallicapublication_date accepte. */
function dateSru(s){
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s||"").trim());
  return m ? m[1]+"/"+m[2]+"/"+m[3] : "";
}
function entier(v, defaut, mini, maxi){
  const n = parseInt(v, 10);
  if(!isFinite(n)) return defaut;
  return Math.min(maxi, Math.max(mini, n));
}

/* Gallica coupe la communication de temps à autre, sans motif et sans que la
   requête suivante échoue : un seul appel ne prouve donc rien. Deux essais,
   espacés d'une demi-seconde, suffisent dans tous les cas mesurés le
   21 septembre 2026. */
async function gallica(url, essais){
  const n = essais || 2;
  let derniere;
  for(let i = 0; i < n; i++){
    try{
      const rep = await fetch(url, {headers:{"user-agent":AGENT, "accept":"application/xml,text/xml,*/*"}});
      if(rep.ok || rep.status < 500) return rep;
      derniere = new Error("HTTP " + rep.status);
    }catch(e){ derniere = e; }
    if(i + 1 < n) await new Promise(r => setTimeout(r, 500));
  }
  throw derniere || new Error("GALLICA");
}

/* ---------- La requête SRU ----------------------------------------------- */

function construireRequete(d){
  const mots = propre(d.mots, 200);
  const morceaux = [];

  /* « adj » cherche les mots dans l'ordre et collés, « all » les cherche tous
     où qu'ils soient. C'est la seule différence entre une expression et une
     liste de mots. */
  if(mots) morceaux.push('gallica ' + (d.exact ? 'adj' : 'all') + ' "' + mots + '"');

  /* Un fascicule est un numéro de journal ou de revue. Sans ce filtre, la
     recherche ramène aussi les livres et les images. */
  if(d.presse !== false) morceaux.push('dc.type all "fascicule"');

  const titre = propre(d.titre, 120);
  if(titre) morceaux.push('dc.title all "' + titre + '"');

  /* Sans texte océrisé, un numéro ne peut donner aucun passage : il s'affiche
     sans extrait. Le filtre est laissé au choix de la page. */
  if(d.avecTexte) morceaux.push('ocr.quality all "Texte disponible"');

  const du = dateSru(d.du), au = dateSru(d.au);
  if(du) morceaux.push('gallicapublication_date>="' + du + '"');
  if(au) morceaux.push('gallicapublication_date<="' + au + '"');

  return morceaux.join(" and ");
}

async function recherche(d){
  const requete = construireRequete(d);
  if(!requete) return {statut:400, corps:{erreur:"REQUETE_VIDE"}};

  const parPage = entier(d.parPage, 10, 1, 20);
  const debut   = entier(d.debut, 1, 1, 9000);

  const p = new URLSearchParams();
  p.set("operation","searchRetrieve");
  p.set("version","1.2");
  p.set("query", requete);
  p.set("maximumRecords", String(parPage));
  p.set("startRecord", String(debut));

  let rep, xml;
  try{
    rep = await gallica(SRU + "?" + p.toString());
    xml = await rep.text();
  }catch(e){
    return {statut:502, corps:{erreur:"GALLICA_INJOIGNABLE"}};
  }
  if(!rep.ok) return {statut:502, corps:{erreur:"GALLICA_"+rep.status}};

  const diag = premier(xml, "diag:message");
  if(diag) return {statut:400, corps:{erreur:"SRU", message:deXml(diag), requete}};

  const total = parseInt(premier(xml, "srw:numberOfRecords") || "0", 10) || 0;

  const resultats = toutes(xml, "srw:record").map(r => {
    const ark   = deXml(premier(r, "uri")).trim();
    const titres = toutes(r, "dc:title").map(deXml);
    return {
      ark,
      titre:     titres[0] || "Sans titre",
      editeur:   deXml(toutes(r, "dc:publisher")[0] || ""),
      periode:   deXml(toutes(r, "dc:date")[0] || ""),
      typedoc:   deXml(premier(r, "typedoc")).trim(),
      vignette:  ark ? "https://gallica.bnf.fr/ark:/12148/" + ark + ".thumbnail" : "",
      lien:      ark ? "https://gallica.bnf.fr/ark:/12148/" + ark : ""
    };
  }).filter(x => x.ark);

  return {statut:200, corps:{total, debut, parPage, requete, resultats}};
}

/* ---------- Le détail d'un numéro ---------------------------------------- */

/* La recherche SRU renvoie la fiche du titre, pas celle du numéro : la date
   qu'elle porte est celle de la collection entière (« 1894-1919 »). La date
   exacte du fascicule se lit dans OAIRecord, un appel de plus par résultat. */
async function fichier(ark){
  const notice = gallica(SERVICES + "/OAIRecord?ark=" + encodeURIComponent(ark))
    .then(r => r.ok ? r.text() : "").catch(() => "");
  /* Le nombre de pages ne figure pas dans la notice : il se demande à part,
     en même temps, pour que la fiche du numéro arrive d'un seul coup. */
  const pages = gallica(SERVICES + "/Pagination?ark=" + encodeURIComponent(ark))
    .then(r => r.ok ? r.text() : "").catch(() => "");

  const [xml, pag] = await Promise.all([notice, pages]);
  if(!xml) return {};
  return {
    date:    deXml(toutes(xml, "dc:date")[0] || "").trim(),
    titre:   deXml(toutes(xml, "dc:title")[0] || "").trim(),
    editeur: deXml(toutes(xml, "dc:publisher")[0] || "").trim(),
    typedoc: deXml(premier(xml, "typedoc")).trim(),
    pages:   parseInt(premier(pag, "nbVueImages") || "0", 10) || 0,
    qualite: parseFloat(deXml(premier(xml, "nqamoyen")) || "0") || 0
  };
}

/* Les passages trouvés dans le numéro, page par page. Le service rend le mot
   cherché entouré d'une balise : elle est convertie en segments, pour que la
   page les affiche sans jamais interpréter du HTML venu d'ailleurs. */
function segments(contenu){
  const brut = deXml(contenu);
  const out = [];
  const re = /<span class=['"]highlight['"]>([\s\S]*?)<\/span>/g;
  let i = 0, m;
  const net = t => deEntites(t).replace(/<[^>]*>/g, "").replace(/\s+/g," ");
  while((m = re.exec(brut))){
    if(m.index > i) out.push({t: net(brut.slice(i, m.index)), h:false});
    out.push({t: net(m[1]), h:true});
    i = m.index + m[0].length;
  }
  if(i < brut.length) out.push({t: net(brut.slice(i)), h:false});
  return out.filter(s => s.t !== "");
}

async function passages(ark, mots, exact){
  const q = propre(mots, 200);
  if(!q) return [];
  try{
    const p = new URLSearchParams();
    p.set("ark", "ark:/12148/" + ark);
    p.set("query", exact ? '"' + q + '"' : q);
    const rep = await gallica(SERVICES + "/ContentSearch?" + p.toString());
    if(!rep.ok) return [];
    const xml = await rep.text();
    return toutes(xml, "item").map(it => {
      const pid = deXml(premier(it, "p_id"));
      const n = /(\d+)/.exec(pid);
      return {page: n ? parseInt(n[1], 10) : 0, segments: segments(premier(it, "content"))};
    }).filter(x => x.page > 0 && x.segments.length);
  }catch(e){ return []; }
}

async function detail(d){
  const ark = propre(d.ark, 60).replace(/[^A-Za-z0-9]/g, "");
  if(!ark) return {statut:400, corps:{erreur:"ARK_ABSENT"}};
  const [f, ext] = await Promise.all([fichier(ark), passages(ark, d.mots, d.exact)]);
  return {statut:200, corps:Object.assign({ark, extraits:ext}, f)};
}

/* ---------- Le texte d'une page ------------------------------------------ */

/* La page en texte brut passe par une vérification de sécurité qui renvoie un
   formulaire à la place du texte : mesuré le 21 septembre 2026. Le fichier
   ALTO, lui, est servi directement. Il porte un mot par balise, avec sa
   position ; les lignes sont reconstituées ici. */
async function texte(d){
  const ark = propre(d.ark, 60).replace(/[^A-Za-z0-9]/g, "");
  const page = entier(d.page, 1, 1, 20000);
  if(!ark) return {statut:400, corps:{erreur:"ARK_ABSENT"}};

  let rep, xml;
  try{
    rep = await gallica(ELEMENT + "?O=" + encodeURIComponent(ark) + "&E=ALTO&Deb=" + page);
    xml = await rep.text();
  }catch(e){
    return {statut:502, corps:{erreur:"GALLICA_INJOIGNABLE"}};
  }
  if(!rep.ok) return {statut:502, corps:{erreur:"PAGE_SANS_TEXTE"}};

  const lignes = [];
  const reLigne = /<TextLine\b[\s\S]*?<\/TextLine>/g;
  let m;
  while((m = reLigne.exec(xml))){
    const mots = [];
    const reMot = /CONTENT="([^"]*)"/g;
    let w;
    while((w = reMot.exec(m[0]))) mots.push(deXml(w[1]));
    const ligne = mots.join(" ").replace(/\s+/g," ").trim();
    if(ligne) lignes.push(ligne);
  }
  if(!lignes.length) return {statut:200, corps:{ark, page, texte:"", vide:true}};
  return {statut:200, corps:{ark, page, texte:lignes.join("\n")}};
}

/* ---------- L'entrée ------------------------------------------------------ */

export default async (req) => {
  const origine = req.headers.get("origin");
  const entetes = enTetesCors(origine);

  if(req.method === "OPTIONS") return new Response(null, {status:204, headers:entetes});
  if(req.method !== "POST")
    return new Response(JSON.stringify({erreur:"METHODE"}), {status:405, headers:entetes});
  if(origine && !entetes["access-control-allow-origin"])
    return new Response(JSON.stringify({erreur:"ORIGINE_REFUSEE"}), {status:403, headers:entetes});

  let d;
  try{ d = await req.json(); }
  catch(e){ return new Response(JSON.stringify({erreur:"REQUETE_INVALIDE"}), {status:400, headers:entetes}); }

  let r;
  switch(String(d.action||"")){
    case "recherche": r = await recherche(d); break;
    case "detail":    r = await detail(d);    break;
    case "texte":     r = await texte(d);     break;
    default:          r = {statut:400, corps:{erreur:"ACTION_INCONNUE"}};
  }
  return new Response(JSON.stringify(r.corps), {status:r.statut, headers:entetes});
};
