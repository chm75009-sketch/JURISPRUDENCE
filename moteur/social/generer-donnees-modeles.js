/* Les données que les modèles complets du plan d'action embarquent, générées
   depuis les modules dédiés — jamais recopiées à la main.

   — Les rubriques de la BDESE : le découpage des décrets R. 2312-8 (moins de
     trois cents salariés) et R. 2312-9 (au moins trois cents) réalisé par le
     module BDESE depuis les textes lus à la source (textes-bdese.json, avec
     leurs identifiants de version). Rubriques, sections et sujets — le détail
     ligne à ligne des informations reste dans le module dédié.

   — La table de l'article R. 2314-1 (délégation du comité : titulaires et
     heures par tranche d'effectif), extraite par le module CSE.

   La publication échoue si un module source manque : un modèle ne s'écrit pas
   sur des données absentes.

   Usage : node generer-donnees-modeles.js                                   */
const fs = require("fs");
const path = require("path");

const C = require("../bdese/contenu-bdese.js");
const b = C.construire();

const alleger = c => ({
  article: c.article, version: c.version, seuil: c.seuil,
  rubriques: c.rubriques.map(r => ({
    n: r.n, titre: r.titre,
    sections: r.sections.map(s => ({
      lettre: s.lettre || null, titre: s.titre || null,
      sujets: s.sujets.map(su => su.intitule),
    })),
  })),
});

const R2314 = JSON.parse(fs.readFileSync(path.join(__dirname, "../cse/_r2314_1.json"), "utf8"));
if (!Array.isArray(R2314) || !R2314.length) throw new Error("table R. 2314-1 introuvable dans le module CSE");

const out = {
  bdese: {
    source: "découpage des décrets par moteur/bdese/contenu-bdese.js, textes lus à la source",
    plancher: b.plancher,
    plancherSource: b.planchierTexte + " (" + b.planchierVersion + ")",
    moins300: alleger(b.contenu["moins300"]),
    auMoins300: alleger(b.contenu["au moins300"]),
  },
  r2314_1: {
    source: "table de R. 2314-1 extraite par le module CSE (moteur/cse/_r2314_1.json)",
    tranches: R2314, /* [effectif min, effectif max, titulaires, heures mensuelles] */
  },
};

fs.writeFileSync(path.join(__dirname, "donnees-modeles.json"), JSON.stringify(out, null, 1));
const nb = c => c.rubriques.reduce((s, r) => s + r.sections.reduce((x, y) => x + y.sujets.length, 0), 0);
console.log(`donnees-modeles.json écrit — BDESE : ${out.bdese.moins300.rubriques.length} rubriques (< 300, ${nb(out.bdese.moins300)} sujets), `
  + `${out.bdese.auMoins300.rubriques.length} rubriques (≥ 300, ${nb(out.bdese.auMoins300)} sujets) · R. 2314-1 : ${R2314.length} tranches`);
