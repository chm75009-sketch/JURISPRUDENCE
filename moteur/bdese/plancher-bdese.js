/* Le plancher légal, et la manière dont il se retrouve dans le décret.

   La loi et le décret ne nomment pas les mêmes choses de la même façon, et
   c'est le piège de ce module. Le plancher de l'article L. 2312-21, alinéa 3,
   énumère « l'investissement social » et « l'investissement matériel et
   immatériel » ; le décret, lui, réunit les deux sous une rubrique
   « Investissements » et les distingue en sections. Un contrôle qui
   comparerait les libellés mot à mot conclurait que le plancher n'est pas
   couvert alors qu'il l'est — cinq faux manquements sur un dossier parfait, ce
   qui s'est produit à la première écriture.

   La correspondance est donc déclarée ici, et VÉRIFIÉE : chaque intitulé cité
   comme équivalent doit exister dans le découpage du décret, en rubrique ou en
   section. S'il n'existe pas — parce que le décret a changé —, le module refuse
   de se charger. Une table de correspondance qui dérive en silence est pire que
   pas de table du tout. */
const CONTENU = require("./contenu-bdese.js");

/* Sans accents, sans casse, sans ponctuation : « Egalité » et « égalité »
   désignent la même chose, et le décret écrit les deux. */
const net = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/* Ce que le décret nomme, rubriques et sections réunies. */
const INTITULES = (() => {
  const b = CONTENU.construire().contenu;
  const out = [];
  for (const cle of Object.keys(b))
    for (const r of b[cle].rubriques) {
      out.push({ titre: r.titre, niveau: "rubrique", parent: null, arbre: cle });
      for (const s of r.sections) out.push({ titre: s.titre, niveau: "section", parent: r.titre, arbre: cle });
    }
  return out;
})();

/* La rubrique qui contient un intitulé donné : déclarer « Investissements »
   couvre l'investissement social et l'investissement matériel et immatériel,
   que le décret range en sections sous cette rubrique. La filiation est lue
   dans le découpage, non écrite à la main. */
function parentsDe(intitule) {
  const n = net(intitule);
  return [...new Set(INTITULES
    .filter(x => net(x.titre) === n || net(x.titre).startsWith(n.slice(0, 24)))
    .map(x => x.parent).filter(Boolean))];
}

const existe = intitule => INTITULES.some(x => net(x.titre).startsWith(net(intitule).slice(0, 24))
  || net(intitule).startsWith(net(x.titre).slice(0, 24)));

/* Pour chaque thème du plancher, les intitulés du décret qui le portent. Le
   thème est cité tel que la loi l'écrit ; l'équivalent tel que le décret
   l'écrit. */
const CORRESPONDANCE = [
  { plancher: "investissement social", decret: ["Investissement social"] },
  { plancher: "investissement matériel et immatériel", decret: ["Investissement matériel et immatériel"] },
  { plancher: "égalité professionnelle entre les femmes et les hommes au sein de l'entreprise",
    decret: ["Egalité professionnelle entre les femmes et les hommes au sein de l'entreprise"] },
  { plancher: "fonds propres", decret: ["Fonds propres, endettement et impôts"] },
  { plancher: "endettement", decret: ["Fonds propres, endettement et impôts"] },
  { plancher: "ensemble des éléments de la rémunération des salariés et dirigeants",
    decret: ["Rémunération des salariés et dirigeants, dans l'ensemble de leurs éléments"] },
  { plancher: "activités sociales et culturelles", decret: ["Activités sociales et culturelles"] },
  { plancher: "rémunération des financeurs", decret: ["Rémunération des financeurs, en dehors des éléments mentionnés au 4°"] },
  { plancher: "flux financiers à destination de l'entreprise", decret: ["Flux financiers à destination de l'entreprise"] },
  { plancher: "conséquences environnementales de l'activité de l'entreprise", decret: ["Environnement"] },
];

/* La vérification, au chargement : la table ne peut pas mentir longtemps. */
const PLANCHER = CONTENU.PLANCHER;
(() => {
  const ecarts = [];
  for (const t of PLANCHER)
    if (!CORRESPONDANCE.some(c => net(c.plancher) === net(t)))
      ecarts.push(`Le thème « ${t} » du plancher n'a pas de correspondance déclarée.`);
  for (const c of CORRESPONDANCE) {
    if (!PLANCHER.some(t => net(t) === net(c.plancher)))
      ecarts.push(`« ${c.plancher} » est déclaré comme thème du plancher, mais L. 2312-21, al. 3, ne le porte pas.`);
    for (const d of c.decret)
      if (!existe(d)) ecarts.push(`« ${d} » est cité comme intitulé du décret, mais le découpage ne le contient pas.`);
  }
  if (ecarts.length) throw new Error("Plancher et décret ont divergé :\n  " + ecarts.join("\n  "));
})();

/* Un thème du plancher est-il couvert par ce que l'utilisateur a déclaré ? Il
   l'est si le libellé de la loi s'y retrouve, ou celui du décret. */
function couvert(theme, declares) {
  const d = declares.map(net);
  const c = CORRESPONDANCE.find(x => net(x.plancher) === net(theme));
  /* Le thème est couvert par son libellé légal, par l'intitulé du décret qui le
     porte, ou par la rubrique du décret qui contient cet intitulé. */
  const equivalents = c ? c.decret : [];
  const formes = [theme].concat(equivalents).concat(equivalents.flatMap(parentsDe));
  return formes.some(fo => {
    const n = net(fo);
    return d.some(x => x.includes(n) || n.includes(x) || x.startsWith(n.slice(0, 20)));
  });
}

function absents(declares) {
  return PLANCHER.filter(t => !couvert(t, declares || []));
}

module.exports = { PLANCHER, CORRESPONDANCE, couvert, absents, net, INTITULES, parentsDe };

if (require.main === module) {
  console.log(`${PLANCHER.length} thèmes au plancher · ${INTITULES.length} intitulés dans le décret · correspondance vérifiée`);
  for (const c of CORRESPONDANCE) console.log(`  ${c.plancher}\n     → ${c.decret.join(" ; ")}`);
}
