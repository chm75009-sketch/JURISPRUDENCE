/* Les mesures du plan de sauvegarde de l'emploi, extraites de l'article et non
   recopiées.

   Le module économique tenait cinq rubriques écrites à la main. L'article
   L. 1233-62 en énumère sept — le 1° bis, introduit pour la reprise d'activité,
   ne s'y trouvait pas, et le 3° (reclassement externe, réactivation du bassin
   d'emploi) et le 6° (réduction ou aménagement du temps de travail) non plus.
   Une liste recopiée dérive à la première modification du texte ; celle-ci est
   découpée depuis le texte lui-même, et la couverture du découpage est mesurée.

   L'énumération suit la ponctuation de l'article :
     « Le plan prévoit des mesures telles que : 1° … ; 1° bis … ; 2° … ; 6° … »

   Le « telles que » est décisif et il est rendu tel quel : la liste n'est pas
   limitative — un plan peut comporter d'autres mesures — mais l'administration
   contrôle le plan au regard de ces rubriques. L'absence d'une rubrique n'est
   donc pas une non-conformité en soi ; c'est un point que le plan doit avoir
   examiné et, s'il l'écarte, avoir motivé.

   Usage : node mesures.js          mesure la couverture du découpage          */
const fs = require("fs");
/* Le dépôt de textes du module : les douze articles dont il a besoin, repris du
   dépôt économique avec leur identifiant de version. Un article peut être
   modifié sans changer de numéro — c'est LEGIARTI… qui dit laquelle des
   versions successives a été lue. */
const T = JSON.parse(fs.readFileSync(__dirname + "/textes-pse.json", "utf8"));

const net = s => String(s || "").replace(/\s+/g, " ").trim();
function texte(n) {
  const v = T[n];
  if (!v || !v.texte) throw new Error(`Article ${n} non lu à la source.`);
  return net(v.texte);
}
const version = n => (T[n] && T[n].id) || null;

/* Le découpage. Les marqueurs sont ceux de l'article : un chiffre suivi du
   signe degré, éventuellement suivi de « bis ». On coupe dessus, on garde le
   marqueur avec son texte, et l'on retient l'intervalle consommé pour pouvoir
   mesurer ce qui a été laissé de côté. */
const MARQUEUR = /(\d+°(?:\s+bis)?)\s+/g;

function decouper(article) {
  const t = texte(article);
  const debut = t.indexOf("telles que :");
  const corps = debut >= 0 ? t.slice(debut + "telles que :".length) : t;
  const decalage = debut >= 0 ? debut + "telles que :".length : 0;

  const bornes = [];
  let m;
  MARQUEUR.lastIndex = 0;
  while ((m = MARQUEUR.exec(corps)) !== null) bornes.push({ marque: net(m[1]), i: m.index, apres: m.index + m[0].length });

  const mesures = [];
  for (let k = 0; k < bornes.length; k++) {
    const fin = k + 1 < bornes.length ? bornes[k + 1].i : corps.length;
    const brut = net(corps.slice(bornes[k].apres, fin).replace(/[;.]\s*$/, ""));
    if (!brut) continue;
    mesures.push({
      cle: bornes[k].marque.replace(/\s+/g, "-").replace("°", ""),
      marque: bornes[k].marque,
      texte: brut,
      /* Le libellé court : la première proposition, jusqu'à la première virgule
         suivie d'un mot de liaison, ou les quatre-vingts premiers caractères.
         Il sert d'intitulé de champ ; le texte intégral reste sous les yeux. */
      intitule: brut.length <= 88 ? brut : net(brut.slice(0, 85)) + "…",
      debut: decalage + bornes[k].apres,
      finTexte: decalage + fin,
    });
  }

  /* La couverture : ce que le découpage a consommé, rapporté au texte de
     l'énumération. L'en-tête (« Le plan … prévoit des mesures telles que : »)
     n'est pas une mesure et n'entre pas au dénominateur. */
  const total = t.length - decalage;
  const consomme = mesures.reduce((n, x) => n + (x.finTexte - x.debut), 0);
  return {
    article,
    version: version(article),
    limitative: !/telles que/.test(t),
    mesures,
    couverture: total ? Math.round((consomme / total) * 1000) / 10 : 0,
    caracteres: { total, consomme, reste: total - consomme },
  };
}

const L1233_62 = decouper("L1233-62");

/* Le plan de reclassement de l'article L. 1233-61 n'est pas une mesure parmi
   les autres : le texte en fait le cœur du plan (« Ce plan intègre un plan de
   reclassement »), et il vise nommément les salariés dont la réinsertion est
   particulièrement difficile. Il est donc traité à part, avec son texte. */
const RECLASSEMENT = {
  article: "L1233-61",
  version: version("L1233-61"),
  texte: (() => {
    const t = texte("L1233-61");
    const i = t.indexOf("Ce plan intègre");
    const j = t.indexOf("Lorsque le plan de sauvegarde");
    return net(t.slice(i >= 0 ? i : 0, j > 0 ? j : t.length));
  })(),
};

/* Le suivi, article L. 1233-63 : trois obligations distinctes que le plan doit
   porter, et que l'employeur doit exécuter. Elles sont relevées dans le texte
   et non résumées. */
const SUIVI = {
  article: "L1233-63",
  version: version("L1233-63"),
  texte: texte("L1233-63"),
  exige: [
    { cle: "modalites", intitule: "Le plan détermine les modalités de suivi de la mise en œuvre effective des mesures du plan de reclassement" },
    { cle: "consultation", intitule: "Le suivi fait l'objet d'une consultation régulière et détaillée du comité, dont l'avis est transmis à l'autorité administrative" },
    { cle: "bilan", intitule: "L'autorité administrative reçoit un bilan, établi par l'employeur, de la mise en œuvre effective du plan" },
  ],
};

module.exports = { L1233_62, RECLASSEMENT, SUIVI, decouper };

if (require.main === module) {
  const d = L1233_62;
  console.log(`L. 1233-62 — version ${d.version}`);
  console.log(`${d.mesures.length} mesures énumérées, liste ${d.limitative ? "limitative" : "non limitative (« telles que »)"}`);
  for (const m of d.mesures) console.log(`  ${m.marque.padEnd(7)} ${m.intitule}`);
  console.log(`couverture ${d.couverture} % — ${d.caracteres.consomme}/${d.caracteres.total} caractères, reste ${d.caracteres.reste}`);
  if (d.couverture < 95) { console.error("Couverture insuffisante : le découpage laisse du texte de côté."); process.exit(1); }
  console.log(`\nL. 1233-61 — plan de reclassement (version ${RECLASSEMENT.version})\n  ${RECLASSEMENT.texte}`);
  console.log(`\nL. 1233-63 — suivi (version ${SUIVI.version}) : ${SUIVI.exige.length} obligations`);
}
