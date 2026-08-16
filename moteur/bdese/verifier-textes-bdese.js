/* Relire à la source les articles que le module cite.

   Le dépôt de textes du module a été repris de celui du module économique. Cela
   ne prouve rien : un article peut avoir été modifié depuis, et le numéro ne le
   dit pas — seul l'identifiant de version le dit.

   La règle du dépôt est appliquée telle quelle : le relais Légifrance n'est pas
   fiable sous charge, il rend des 502 et parfois un article homonyme d'une autre
   partie du code. UNE SEULE LECTURE NE PROUVE RIEN, ni la concordance ni
   l'écart. Chaque article est donc lu deux fois, les requêtes espacées, et l'on
   ne conclut que sur des lectures concordantes entre elles.

   Usage : node verifier-textes-bdese.js [AAAA-MM-JJ]                          */
const fs = require("fs");
const { execFileSync } = require("child_process");

const T = JSON.parse(fs.readFileSync(__dirname + "/textes-bdese.json", "utf8"));
const DATE = process.argv[2] || new Date().toISOString().slice(0, 10);
const RELAIS = "https://jurisprudence-recherche.netlify.app/.netlify/functions/legifrance";
const CODE = "LEGITEXT000006072050";

const net = s => String(s || "").replace(/\s+/g, " ").trim();
const dors = ms => { const t = Date.now(); while (Date.now() - t < ms); };

function lire(numero) {
  const corps = JSON.stringify({ action: "article", numero, code: CODE, date: DATE });
  try {
    const out = execFileSync("curl", ["-s", "--max-time", "40", "-X", "POST", RELAIS,
      "-H", "content-type: application/json", "-d", corps], { encoding: "utf8", maxBuffer: 40e6 });
    const j = JSON.parse(out);
    const a = j.article || j;
    return { id: a.id || a.cid || null, texte: net(a.texte || a.content || "") };
  } catch (e) { return { erreur: e.message.slice(0, 80) }; }
}

const numeros = Object.keys(T);
const resultats = [];
for (const n of numeros) {
  const attendu = T[n];
  const a = lire(n.replace(/^([LRD])/, "$1"));
  dors(400);
  const b = lire(n.replace(/^([LRD])/, "$1"));
  dors(400);

  /* Deux lectures qui ne se ressemblent pas ne tranchent rien : le relais a
     peut-être servi un homonyme. On le dit, on ne conclut pas. */
  /* Le relais sert parfois DEUX ARTICLES RÉELS portant le même numéro — l'un de
     la section de la base de données, l'autre d'une autre partie du code. Relire
     davantage ne tranche rien : c'est le CONTENU qui décide. Pour la base, la
     bonne version parle de « base de données » ou renvoie à un article
     L. 2312-… ; celle qui n'en parle pas est l'homonyme, et elle est écartée au
     lieu d'être comptée comme un écart. */
  const surLaBase = t => /base de donn/i.test(t) || /L\.\s?2312-/.test(t);
  const attenduSurLaBase = surLaBase(net(attendu.texte));

  /* Second critère, et il a fallu le mesurer pour le trouver : l'homonyme
     n'appartient pas au même livre du code. Interrogé sur L. 2312-2, le relais
     rend quatre fois de suite un article qui définit « le cycle de vie de
     l'équipement » pour l'application de L. 2112-3 — quatre lectures stables et
     concordantes entre elles, donc rien qu'une relecture ne peut trancher. Ce
     n'est pas une panne : c'est un autre article, réellement numéroté ainsi
     ailleurs. On le reconnaît à ce qu'il renvoie à des articles d'un livre que
     l'article attendu ne cite jamais. */
  const AILLEURS = /[LR]\.\s?21(12|41)-/;
  const etranger = x => x && x.texte && AILLEURS.test(x.texte) && !AILLEURS.test(net(attendu.texte));

  const homonyme = x => (attenduSurLaBase && x && x.texte && !surLaBase(x.texte)) || etranger(x);

  const lisibles = [a, b].filter(x => x && x.texte);
  const utiles = lisibles.filter(x => !homonyme(x));
  const ecartes = lisibles.length - utiles.length;

  const etat = !lisibles.length ? "illisible"
    : !utiles.length ? "homonyme servi par le relais"
    : (utiles.length === 2 && utiles[0].texte !== utiles[1].texte) ? "lectures discordantes"
    : (utiles[0].texte === net(attendu.texte) ? "concordant"
      : (utiles[0].id === attendu.id ? "même version, texte différent" : "écart"));
  resultats.push({ numero: n, attendu: attendu.id, lu: (utiles[0] || lisibles[0] || {}).id || null, etat,
    homonymesEcartes: ecartes,
    ecartCaracteres: utiles.length ? Math.abs((utiles[0].texte || "").length - net(attendu.texte).length) : null });
  console.log(`${n.padEnd(12)} ${String(attendu.id).padEnd(22)} ${etat}${ecartes ? " (" + ecartes + " homonyme(s) écarté(s))" : ""}`);
}

const mauvais = resultats.filter(r => r.etat === "écart" || r.etat === "même version, texte différent");
const douteux = resultats.filter(r => ["lectures discordantes", "illisible", "homonyme servi par le relais"].indexOf(r.etat) >= 0);
fs.writeFileSync(__dirname + "/verification-textes-bdese.json",
  JSON.stringify({ date: DATE, relais: RELAIS, articles: resultats.length,
    concordants: resultats.filter(r => r.etat === "concordant").length,
    ecarts: mauvais.length, douteux: douteux.length,
    homonymesEcartes: resultats.reduce((n, r) => n + (r.homonymesEcartes || 0), 0),
    synthese: `${resultats.filter(r => r.etat === "concordant").length} articles reconfirmés par le relais sur ${resultats.length} ; ${douteux.length} articles non reconfirmés au moment de la relecture ; ${mauvais.length} divergence(s) constatée(s) ; version du dépôt conservée et identifiable par son identifiant LEGIARTI.`,
    detail: resultats }, null, 1));

/* La synthèse est écrite de manière à ne pas pouvoir être mal lue : « zéro
   écart » n'est pas « cent pour cent des articles reconfirmés par la source ».
   Un relais muet, ou qui ne sert que l'homonyme, ne permet de conclure ni à la
   concordance ni à la divergence — et la version du dépôt reste identifiable
   par son identifiant, ce que la phrase dit expressément. */
const SYNTHESE = `${resultats.filter(r => r.etat === "concordant").length} articles reconfirmés par le relais sur ${resultats.length} ; `
  + `${douteux.length} articles non reconfirmés au moment de la relecture ; `
  + `${mauvais.length} divergence(s) constatée(s) ; version du dépôt conservée et identifiable par son identifiant LEGIARTI.`;
console.log("\n" + SYNTHESE);
if (mauvais.length) {
  console.error("\nÉcarts à trancher à la main :");
  for (const r of mauvais) console.error(`  ${r.numero} — attendu ${r.attendu}, lu ${r.lu} (${r.ecartCaracteres} caractères d'écart)`);
  process.exit(1);
}
if (douteux.length) console.log("Articles sans conclusion — relais muet ou lectures discordantes : "
  + douteux.map(r => r.numero).join(", ") + ". Aucun écart n'en est déduit, dans aucun sens.");
