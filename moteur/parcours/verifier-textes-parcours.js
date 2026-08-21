/* Relire à la source les articles que les parcours guidés citent.

   La règle du dépôt est appliquée telle quelle : le relais Légifrance n'est pas
   fiable sous charge — 502, et parfois un article homonyme d'une autre partie
   du code, ou d'un autre code lorsque le filtre ne porte pas. UNE SEULE LECTURE
   NE PROUVE RIEN, ni la concordance ni l'écart. Chaque article est donc lu deux
   fois, les requêtes espacées, et l'on ne conclut que sur des lectures
   concordantes entre elles. Les homonymes sont classés à part : ils ne
   concluent ni à la concordance ni à l'écart.

   Le filtre est le NOM du code — « Code du travail » —, jamais un LEGITEXT :
   c'est ce qui a redressé, à la capture, les deux homonymes que porte encore
   moteur/nao/textes-nao.json (L. 2242-1 et L. 2242-10).

   Usage : node verifier-textes-parcours.js [AAAA-MM-JJ]                      */
const fs = require("fs");
const { execFileSync } = require("child_process");

const T = JSON.parse(fs.readFileSync(__dirname + "/textes-parcours.json", "utf8"));
const DATE = process.argv[2] || new Date().toISOString().slice(0, 10);
const RELAIS = "https://jurisprudence-recherche.netlify.app/.netlify/functions/legifrance";
const CODE = "Code du travail";

const net = s => String(s || "").replace(/\s+/g, " ").trim();
const dors = ms => new Promise(r => setTimeout(r, ms));

function lire(numero) {
  const corps = JSON.stringify({ action: "article", numero, code: CODE, date: DATE });
  try {
    const out = execFileSync("curl", ["-s", "--max-time", "40", "-X", "POST", RELAIS,
      "-H", "content-type: application/json", "-d", corps], { encoding: "utf8", maxBuffer: 40e6 });
    const j = JSON.parse(out);
    const a = j.article || j;
    return { id: a.id || a.cid || null, texte: net(a.texte || a.content || "") };
  } catch (e) { return { erreur: String(e.message).slice(0, 80) }; }
}

(async function () {
  const numeros = Object.keys(T);
  const resultats = [];
  for (const n of numeros) {
    const attendu = T[n];
    const a = lire(n); await dors(600);
    const b = lire(n); await dors(600);

    const lisibles = [a, b].filter(x => x && x.texte);
    const reference = net(attendu.texte);
    const etat = !lisibles.length ? "illisible"
      : (lisibles.length === 2 && a.texte !== b.texte) ? "lectures discordantes"
      : (lisibles[0].texte === reference ? "concordant"
        : (lisibles[0].id === attendu.id ? "même version, texte différent"
          /* Le critère est le CONTENU : un texte lu qui ne partage aucun
             fragment significatif avec l'attendu n'est pas une autre version de
             l'article, c'est un autre article. On ne conclut pas d'écart sur un
             homonyme. */
          : (reference.length > 60 && lisibles[0].texte.includes(reference.slice(20, 60))
             ? "écart" : "homonyme servi")));
    resultats.push({ numero: n, attendu: attendu.id, lu: (lisibles[0] || {}).id || null, etat,
      ecartCaracteres: lisibles.length ? Math.abs((lisibles[0].texte || "").length - reference.length) : null });
    console.log(`${n.padEnd(12)} ${String(attendu.id).padEnd(22)} ${etat}`);
  }

  const mauvais = resultats.filter(r => r.etat === "écart" || r.etat === "même version, texte différent");
  const douteux = resultats.filter(r => r.etat === "lectures discordantes" || r.etat === "illisible"
    || r.etat === "homonyme servi");
  const concordants = resultats.filter(r => r.etat === "concordant").length;
  fs.writeFileSync(__dirname + "/verification-textes-parcours.json",
    JSON.stringify({ date: DATE, relais: RELAIS, code: CODE, articles: resultats.length,
      concordants, ecarts: mauvais.length, douteux: douteux.length, detail: resultats }, null, 1));

  console.log(`\n${resultats.length} articles · ${concordants} concordants`
    + ` · ${mauvais.length} écarts · ${douteux.length} sans conclusion possible`);
  if (mauvais.length) {
    console.error("\nÉcarts à trancher à la main :");
    for (const r of mauvais)
      console.error(`  ${r.numero} — attendu ${r.attendu}, lu ${r.lu} (${r.ecartCaracteres} caractères d'écart)`);
    process.exitCode = 1;
  }
})();
