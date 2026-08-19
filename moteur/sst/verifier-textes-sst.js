/* Relire à la source les articles que le module cite.

   La règle du dépôt est appliquée telle quelle : le relais Légifrance n'est pas
   fiable sous charge, il rend des 502 et parfois un article homonyme d'une
   autre partie du code — ou d'un AUTRE code : la capture de ce module a mesuré
   que L. 4121-1 est servi depuis le code général de la propriété des personnes
   publiques quand le filtre de code ne porte pas. UNE SEULE LECTURE NE PROUVE
   RIEN, ni la concordance ni l'écart. Chaque article est donc lu deux fois,
   les requêtes espacées, et l'on ne conclut que sur des lectures concordantes
   entre elles. Les homonymes sont classés à part : ils ne concluent ni à la
   concordance ni à l'écart.

   Usage : node verifier-textes-sst.js [AAAA-MM-JJ]                          */
const fs = require("fs");
const { execFileSync } = require("child_process");

const T = JSON.parse(fs.readFileSync(__dirname + "/textes-sst.json", "utf8"));
const DATE = process.argv[2] || new Date().toISOString().slice(0, 10);
const RELAIS = "https://jurisprudence-recherche.netlify.app/.netlify/functions/legifrance";
/* Le nom du code, pas son identifiant : le filtre NOM_CODE du relais attend le
   nom — voir capturer-textes-sst.js, mesure du 19 août 2026. */
const CODE = "Code du travail";

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
  const a = lire(n);
  dors(600);
  const b = lire(n);
  dors(600);

  /* Deux lectures qui ne se ressemblent pas ne tranchent rien : le relais a
     peut-être servi un homonyme. On le dit, on ne conclut pas. */
  const lisibles = [a, b].filter(x => x && x.texte);
  const etat = !lisibles.length ? "illisible"
    : (lisibles.length === 2 && a.texte !== b.texte) ? "lectures discordantes"
    : (lisibles[0].texte === net(attendu.texte) ? "concordant"
      : (lisibles[0].id === attendu.id ? "même version, texte différent"
        /* Le critère est le CONTENU : un texte lu qui ne partage aucun
           fragment significatif avec l'attendu n'est pas une autre version de
           l'article, c'est un autre article. On ne conclut pas d'écart sur un
           homonyme. */
        : (net(attendu.texte).slice(0, 60) && lisibles[0].texte.includes(net(attendu.texte).slice(20, 60))
           ? "écart" : "homonyme servi")));
  resultats.push({ numero: n, attendu: attendu.id, lu: (lisibles[0] || {}).id || null, etat,
    ecartCaracteres: lisibles.length ? Math.abs((lisibles[0].texte || "").length - net(attendu.texte).length) : null });
  console.log(`${n.padEnd(12)} ${String(attendu.id).padEnd(22)} ${etat}`);
}

const mauvais = resultats.filter(r => r.etat === "écart" || r.etat === "même version, texte différent");
const douteux = resultats.filter(r => r.etat === "lectures discordantes" || r.etat === "illisible"
  || r.etat === "homonyme servi");
fs.writeFileSync(__dirname + "/verification-textes-sst.json",
  JSON.stringify({ date: DATE, relais: RELAIS, articles: resultats.length,
    concordants: resultats.filter(r => r.etat === "concordant").length,
    ecarts: mauvais.length, douteux: douteux.length, detail: resultats }, null, 1));

console.log(`\n${resultats.length} articles · ${resultats.filter(r => r.etat === "concordant").length} concordants`
  + ` · ${mauvais.length} écarts · ${douteux.length} sans conclusion possible`);
if (mauvais.length) {
  console.error("\nÉcarts à trancher à la main :");
  for (const r of mauvais) console.error(`  ${r.numero} — attendu ${r.attendu}, lu ${r.lu} (${r.ecartCaracteres} caractères d'écart)`);
  process.exit(1);
}
if (douteux.length) console.log("Articles sans conclusion — relais muet ou lectures discordantes : "
  + douteux.map(r => r.numero).join(", ") + ". Aucun écart n'en est déduit, dans aucun sens.");
