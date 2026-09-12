/* VÉRIFIER LES DOCUMENTS À ONGLETS - le garde-fou du téléchargement.

   POURQUOI CE SCRIPT EXISTE

   Le 12 septembre 2026, le document unique téléchargé en Word s'arrêtait à sa
   section 4 : son onglet portait des sous-boutons, et le bouton Word
   n'emportait que le morceau ouvert. L'utilisatrice l'a vu avant moi, sur le
   fichier lui-même. Le défaut n'était pas dans le texte produit, qui était
   complet, mais dans le découpage : un onglet coupé en morceaux dont aucun ne
   rend le tout.

   Ce script mesure, pour chaque document qui porte « parties », ce que chaque
   onglet et chaque sous-bouton contiennent vraiment, et refuse :

   1. une partie ou une sous-partie vide ;
   2. une ligne du document produit qui n'est reprise dans aucun onglet
      (le découpage perd du texte) ;
   3. un onglet à sous-boutons qui ne dit pas ce que ses morceaux sont :
      « entier: true » quand ce sont les morceaux d'un même document, et le
      bouton Word emporte alors l'onglet entier ; « pieces: true » quand ce
      sont des lettres autonomes, chacune emportée seule ;
   4. un onglet de document dont la première ligne n'est pas la dénomination
      de l'entreprise (l'en-tête de la fiche, exigé le 12 septembre 2026 :
      « les infos doivent apparaître dans tous les documents »).

   Le point 3 est le garde-fou proprement dit : un module ajouté demain avec
   des sous-boutons ne passera pas sans avoir tranché la question.

   Usage : node moteur/commun/verifier-onglets.js
   Sortie 0 si tout passe, 1 sinon.  */

"use strict";
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const DOCS = path.join(__dirname, "..", "..", "docs");

/* Le navigateur en trompe-l'oeil : ces fichiers sont écrits pour la page, et
   n'ont besoin ici que d'un « window » où se poser. */
const bac = { console };
bac.window = bac;
bac.document = {
  createElement: () => ({ style: {}, appendChild() {}, setAttribute() {} }),
  head: { appendChild() {} },
  body: { appendChild() {}, removeChild() {} },
  getElementById: () => null,
  addEventListener() {},
};
bac.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
bac.navigator = { userAgent: "node" };
vm.createContext(bac);

const FICHIERS = [
  "feuille-doc.js", "profil.js", "documents-produits.js",
  "documents-rh.js", "bdese-grille.js",
  "documents-sst.js", "documents-sst-2.js",
  "documents-discipline.js", "documents-discipline-2.js",
  "documents-cse.js", "documents-cse-2.js", "documents-cse-3.js",
  "documents-bdese.js", "documents-nao.js", "documents-pse.js",
  "documents-eco-fond.js", "documents-eco-procedure.js",
  "documents-eco-cse.js", "documents-eco-2.js",
];
for (const f of FICHIERS) {
  const p = path.join(DOCS, f);
  if (!fs.existsSync(p)) continue;
  try { vm.runInContext(fs.readFileSync(p, "utf8"), bac, { filename: f }); }
  catch (e) { console.log("! " + f + " ne se charge pas : " + e.message); }
}

const DP = bac.DocumentsProduits;
if (!DP) { console.log("! documents-produits.js ne s'est pas chargé."); process.exit(1); }

/* Deux fiches, parce que l'effectif commande le contenu : sous trois cents
   salariés et au-dessus, la base de données ne suit pas la même grille. */
const FICHE = {
  denomination: "SARL TEC",
  siret: "53845047900034",
  adresse: "23 avenue du Château, 95100 Argenteuil",
  responsable: "Chadi EL SAFADI, gérant",
  effectif: 81,
  secteur: "transport et logistique",
  conventionCollective: "0016 - Convention collective nationale des transports routiers",
};
const PROFILS = [
  { nom: "81 salariés", p: FICHE },
  { nom: "320 salariés", p: Object.assign({}, FICHE, { effectif: 320 }) },
];

const texte = (t) => bac.FeuilleDoc.texte(bac.FeuilleDoc.blocs(String(t == null ? "" : t)));
const lignes = (t) => texte(t).split("\n").map((x) => x.trim()).filter((x) => x);

let fautes = 0;
function faute(m) { fautes++; console.log("  FAUTE : " + m); }

const ids = Object.keys(DP.tous).filter((id) => typeof DP.pour(id).parties === "function");
console.log("Documents à onglets : " + ids.length + " (" + ids.join(", ") + ")");

for (const { nom: quel, p: profil } of PROFILS) {
  if (!profil) continue;
  const ctx = { profil, fiche: {}, donnees: {}, aujourdhui: new Date("2026-09-12") };
  console.log("\n--- fiche " + quel);
  for (const id of ids) {
    const gen = DP.pour(id);
    let parties, produit;
    try { produit = lignes(gen.produire(ctx)); parties = gen.parties(ctx); }
    catch (e) { faute(id + " : " + e.message); continue; }

    console.log(" " + id + " - " + gen.nom + " (" + produit.length + " lignes produites)");
    if (!parties || !parties.length) { faute(id + " : aucune partie."); continue; }

    const dedans = new Set();
    for (const p of parties) {
      const s = p.sous && p.sous.length ? p.sous : null;

      /* 1. Rien de vide. */
      if (!s && !String(p.texte || "").trim()) faute(id + " · onglet « " + p.nom + " » vide.");
      if (s) for (const x of s)
        if (!String(x.texte || "").trim())
          faute(id + " · onglet « " + p.nom + " », sous-bouton « " + x.nom + " » vide.");

      /* 3. Un onglet à sous-boutons dit ce que ses morceaux sont. */
      if (s && !p.entier && !p.pieces)
        faute(id + " · onglet « " + p.nom + " » porte " + s.length + " sous-boutons sans dire " +
          "ce qu'ils sont : ajouter « entier: true » (morceaux d'un même document, le Word " +
          "emporte le tout) ou « pieces: true » (lettres autonomes).");
      if (s && p.entier && p.pieces)
        faute(id + " · onglet « " + p.nom + " » porte à la fois entier et pieces.");
      if (!s && (p.entier || p.pieces))
        faute(id + " · onglet « " + p.nom + " » porte entier ou pieces sans sous-boutons.");

      /* Un onglet « entier » doit avoir de quoi emporter le tout : la somme de
         ses morceaux, qui est ce que le bouton Word recompose. */
      if (s && p.entier) {
        const somme = s.reduce((n, x) => n + lignes(x.texte).length, 0);
        if (somme < 2) faute(id + " · onglet « " + p.nom + " » : rien à emporter.");
      }

      for (const x of (s || [p])) lignes(x.texte).forEach((l) => dedans.add(l));
    }

    /* 2. Le découpage ne perd rien. Les lignes de l'en-tête d'identité sont
       rendues différemment selon leur place dans la feuille : on les compare
       donc sur le texte brut, avant mise en page. */
    const brut = new Set();
    for (const p of parties) {
      const s = p.sous && p.sous.length ? p.sous : [p];
      for (const x of s) String(x.texte || "").split("\n").forEach((l) => { l = l.trim(); if (l) brut.add(l); });
    }
    const perdues = [];
    String(gen.produire(ctx)).split("\n").forEach((l) => {
      l = l.trim();
      if (l && !brut.has(l) && !dedans.has(l)) perdues.push(l);
    });
    if (perdues.length) {
      faute(id + " : " + perdues.length + " ligne(s) du document ne sont dans aucun onglet.");
      perdues.slice(0, 5).forEach((l) => console.log("          | " + l.slice(0, 100)));
    }

    /* 4. L'en-tête de l'entreprise ouvre l'onglet du document. */
    const premier = parties[0];
    const morceau = premier.sous && premier.sous.length ? premier.sous[0] : premier;
    const tete = lignes(morceau.texte)[0] || "";
    if (profil.denomination && tete.indexOf(profil.denomination) < 0)
      faute(id + " · le premier onglet n'ouvre pas sur l'entreprise mais sur « " +
        tete.slice(0, 60) + " ».");
  }
}

console.log("\n" + (fautes ? fautes + " faute(s)." : "Rien à redire."));
process.exit(fautes ? 1 : 0);
