/* ENGENDRER LA GRILLE DE LA BASE, DÉPLOYÉE LIGNE À LIGNE
   =====================================================

   Le module porte le découpage du décret, vérifié rubrique par rubrique
   (contenu-bdese.js). Ce script le met à plat : une ligne par information que
   la base doit porter. C'est ce qui permet de sortir un tableur que le client
   remplit, au lieu d'une liste de dix thèmes qu'il devrait déployer lui-même.

   Deux arbres : R. 2312-8 en deçà de trois cents salariés, R. 2312-9 au-delà.

   Usage :  node moteur/bdese/engendrer-grille.js                            */
const fs = require("fs");
const path = require("path");
const C = require(path.join(__dirname, "contenu-bdese.js")).construire().contenu;

/* LÀ OÙ LE TABLEAU DU DÉCRET S'ARRÊTE, ET OÙ SES NOTES COMMENCENT.

   Le découpage suit le texte de R. 2312-9 tel qu'il est publié. Or ce texte
   ne s'arrête pas à la dernière ligne du tableau : il enchaîne sur la
   nomenclature des qualifications (note II) puis sur les cinquante-deux notes
   de bas de page, sans rupture typographique que l'extraction puisse voir.
   Résultat mesuré le 12 septembre 2026 dans le classeur livré : la rubrique
   Environnement se terminait par dix lignes qui n'étaient ni des rubriques ni
   des informations — « techniciens », « agents de maîtrise », « (effectif du
   mois », et le bloc des notes (1) à (52). Elles s'affichaient au client comme
   des données à porter.

   La coupure se fait donc ici, sur la première ligne de la nomenclature, qui
   est stable et littérale. Tout ce qui suit, dans ce sujet, est du commentaire
   du décret, non du contenu dû. */
const FIN_DU_TABLEAU = "employés, techniciens et agents de maîtrise (ETAM)";

/* LA COUPURE VAUT POUR TOUT CE QUI SUIT, PAS SEULEMENT POUR SON SUJET.

   Première version : la coupure s'appliquait à l'intérieur du sujet qui porte
   la ligne de nomenclature, et les sujets suivants du même arbre continuaient
   de sortir. Le classeur d'au moins trois cents salariés livrait donc encore,
   dans la rubrique Environnement, « et ouvriers. II.-Une structure de
   qualification détaillée », « techniciens », puis les notes (1) à (52), toutes
   présentées comme des informations à renseigner. Relevé le 25 septembre 2026
   sur le classeur produit pour un effectif de trois cent vingt.

   La nomenclature et les notes closent le texte du décret : une fois cette
   ligne rencontrée, plus rien de ce qui suit n'est du contenu dû. */
function lignes(arbre) {
  const out = [];
  let fini = false;
  arbre.rubriques.forEach(function (r) {
    if (fini) return;
    const sections = r.sections || [];
    sections.forEach(function (s) {
      if (fini) return;
      (s.sujets || []).forEach(function (su) {
        if (fini) return;
        let infos = (su.informations && su.informations.length) ? su.informations : [su.intitule];
        const coupe = infos.indexOf(FIN_DU_TABLEAU);
        if (coupe >= 0) { infos = infos.slice(0, coupe); fini = true; }
        /* Deux fragments survivent à la coupure parce qu'ils appartiennent à
           un autre sujet : « (effectif du mois » et « . (20) Faire une grille
           des rémunérations… ». Une information due commence par une lettre ou
           un chiffre ; celle qui commence par une ponctuation est un morceau de
           phrase, jamais une donnée à porter. Mesuré : la règle retire ces deux
           lignes-là et aucune autre, sur les deux arbres. */
        infos = infos.filter(function (i) { return /^[A-Za-zÀ-ÿ0-9]/.test(String(i).trim()); });
        /* LE SUJET NE REPREND PAS LA PREMIÈRE INFORMATION.

           Le texte du décret écrit « i) Formation professionnelle continue
           (44) : Pourcentage de la masse salariale afférent à la formation
           continue », où ce qui suit le deux-points est déjà la première
           information. L'extraction gardait le tout comme intitulé de sujet,
           et le classeur affichait la même phrase en colonne Sujet et en
           colonne Information. Relevé le 25 septembre 2026. */
        let sujet = (su.lettre ? su.lettre + ") " : "") + su.intitule;
        const sansLettre = String(su.intitule).trim();
        const k = sansLettre.indexOf(" : ");
        if (k > 0) {
          const tete = sansLettre.slice(0, k).trim();
          const queue = sansLettre.slice(k + 3).trim();
          const premiere = String(infos[0] || "").trim();
          if (premiere && premiere.indexOf(queue) === 0) {
            /* La queue est déjà la première information : on ne garde que la
               tête. */
            sujet = (su.lettre ? su.lettre + ") " : "") + tete;
          } else if (queue && infos.indexOf(queue) < 0) {
            /* La queue est une information que l'extraction a collée au sujet :
               elle n'avait donc aucune ligne où être renseignée. Elle reprend
               sa place, en tête de la liste. Relevé le 25 septembre 2026 :
               « Effectif total au 31/12 », « Nombre d'embauches par contrat à
               durée indéterminée » et « Total des départs » manquaient au
               classeur des entreprises d'au moins trois cents salariés. */
            sujet = (su.lettre ? su.lettre + ") " : "") + tete;
            infos = [queue].concat(infos);
          }
        }
        /* LES EXPOSANTS PERDUS À L'EXTRACTION.

           Le décret écrit « × 10⁶ » et « × 10³ » dans les taux d'accidents du
           travail. Le texte servi les rend « × 106 » et « × 10 ³ », ce qui
           change le sens d'un taux. Relevé le 25 septembre 2026. */
        infos = infos.map(function (i) {
          return String(i)
            .replace(/×\s*106\b/g, "× 10⁶")
            .replace(/×\s*103\b/g, "× 10³")
            .replace(/×\s*10\s+([²³⁶])/g, "× 10$1");
        });
        infos.forEach(function (i) {
          /* Une rubrique sans section produit une ligne qui se répète
             elle-même : « Environnement (1) », en section, en sujet et en
             information. Ce n'est pas une donnée à porter, c'est le titre de
             la rubrique revenu trois fois. On l'écarte, sans toucher aux
             rubriques qui n'ont qu'une seule information réelle, comme le
             montant de la contribution aux activités sociales. */
          const secTitre = (s.lettre ? s.lettre + ". " : "") + s.titre;
          if (secTitre === i && String(r.titre).indexOf(i) === 0) return;
          out.push([
            r.titre,
            (s.lettre ? s.lettre + ". " : "") + s.titre,
            /* Un sujet qui répète mot pour mot son unique information ne dit
               rien de plus : la colonne reste vide. */
            (sujet === String(i).trim() ||
             sujet.replace(/^[ivx]+\)\s*/i, "").trim() === String(i).trim()) ? "" : sujet,
            i,
          ]);
        });
      });
    });
    if (!sections.length) out.push([r.titre, "", "", r.titre]);
  });
  return out;
}

/* L'INDEX DE L'ÉGALITÉ, QUE LE TABLEAU DU DÉCRET NE PORTE PAS.

   R. 2312-7 (LEGIARTI000047548416, lu le 25 septembre 2026) : la base
   « comporte également les indicateurs relatifs aux écarts de rémunération
   entre les femmes et les hommes et aux actions mises en œuvre pour les
   supprimer mentionnés à l'article L. 1142-8 ». Ces indicateurs ne sont ni
   dans le tableau de R. 2312-8 ni dans celui de R. 2312-9 : ils s'y ajoutent,
   et la base les ignorait. Relevé le 25 septembre 2026.

   L. 1142-8 (LEGIARTI000044605453) vise les entreprises d'au moins cinquante
   salariés, donc les deux arbres. Les composantes de l'index sont fixées par
   décret et ne sont pas recopiées ici : ce qui est dû, c'est de porter dans la
   base les indicateurs publiés et ce qui en découle, la négociation et les
   mesures de correction de L. 1142-9, le délai de mise en conformité de
   L. 1142-10. */
const EGALITE = [
  "Indicateurs relatifs aux écarts de rémunération entre les femmes et les hommes et aux actions mises en œuvre pour les supprimer, tels que publiés chaque année (L. 1142-8)",
  "Note globale obtenue, et date de la publication sur le site du ministère chargé du travail",
  "Mesures de correction et, le cas échéant, programmation de mesures financières de rattrapage salarial lorsque les résultats sont en deçà du niveau fixé par décret (L. 1142-9)",
  "Objectifs de progression publiés, et échéance des trois ans de mise en conformité (L. 1142-10)",
];
function avecEgalite(L) {
  const rubrique = (L.find(function (x) { return /Egalité professionnelle/i.test(x[0]); }) || [])[0] ||
    "Egalité professionnelle entre les femmes et les hommes";
  return L.concat(EGALITE.map(function (i) {
    return [rubrique, "Index de l'égalité professionnelle (R. 2312-7)", "", i];
  }));
}

const G = { moins300: avecEgalite(lignes(C["moins300"])), plus300: avecEgalite(lignes(C["au moins300"])) };
const entete = [
  "/* LA GRILLE DE LA BASE DE DONNÉES, DÉPLOYÉE LIGNE À LIGNE",
  "",
  "   Engendré depuis moteur/bdese/contenu-bdese.js. Une ligne par information",
  "   que la base doit porter. Deux arbres : R. 2312-8 en deçà de trois cents",
  "   salariés, R. 2312-9 au-delà.",
  "",
  "   NE PAS MODIFIER À LA MAIN — regénérer avec :",
  "   node moteur/bdese/engendrer-grille.js                                   */",
  "window.GRILLE_BDESE = " + JSON.stringify(G) + ";",
  "",
].join("\n");
fs.writeFileSync(path.join(__dirname, "..", "..", "docs", "bdese-grille.js"), entete);
console.log("grille écrite — moins de 300 : " + G.moins300.length +
            " lignes · au moins 300 : " + G.plus300.length + " lignes");
