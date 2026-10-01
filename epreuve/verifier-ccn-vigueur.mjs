/* LES MONTANTS CONVENTIONNELS PORTÉS À LA MAIN, ET CE QU'ILS ÉCRASENT.

   docs/ccn-vigueur.js garde sur le poste les montants que l'application ne
   sait pas lire : les grilles de la convention collective du transport. Ce
   qui est saisi l'emporte sur ce que le code porte, et c'est précisément ce
   qui rend le module dangereux : une saisie mal relue, et le contrat sort
   avec un montant qui n'est écrit nulle part.

   Les cas, choisis parce que chacun décide quelque chose :
     - rien de saisi : le défaut du code sort, et la source du code avec lui ;
     - un montant saisi : il sort, avec la référence de son avenant ;
     - une virgule décimale, écriture française, doit être lue ;
     - zéro, le vide et le négatif ne sont pas des saisies : le défaut revient ;
     - une référence commune à toute une famille, posée une fois, sert partout ;
     - une saisie sans référence du tout le dit, au lieu de se taire ;
     - effacer une ligne rend le défaut, et n'efface pas les autres ;
     - le compte des montants portés à la main est juste ;
     - un localStorage en panne ne fait pas tomber le module ;
     - les onze clés du module sont bien celles que le contrat interroge.

     node epreuve/verifier-ccn-vigueur.mjs                                   */
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../docs/ccn-vigueur.js", import.meta.url), "utf8");

/* Un localStorage de bureau, et un qui refuse tout : les deux existent chez
   les utilisateurs, le second en navigation privée. */
function poste(enPanne) {
  const sac = new Map();
  return {
    localStorage: {
      getItem: (k) => { if (enPanne) throw new Error("refus"); return sac.has(k) ? sac.get(k) : null; },
      setItem: (k, v) => { if (enPanne) throw new Error("refus"); sac.set(k, String(v)); },
      removeItem: (k) => { sac.delete(k); },
    },
    _sac: sac,
  };
}
function charger(enPanne) {
  const w = poste(enPanne);
  new Function("window", src)(w);
  return w.CcnVigueur;
}

let fautes = 0;
function faute(m) { console.log("FAUTE " + m); fautes++; }
function egal(quoi, vu, attendu) {
  if (String(vu) !== String(attendu))
    faute(quoi + " : « " + vu + " » au lieu de « " + attendu + " »");
}

/* ---- 1. rien de saisi : le défaut du code --------------------------------- */
{
  const V = charger();
  egal("le défaut d'un montant non saisi", V.valeur("repas", 16.2), 16.2);
  egal("la source d'un montant non saisi", V.source("repas", "avenant n° 81"), "avenant n° 81");
  egal("rien n'est porté à la main", V.saisi("repas"), false);
  egal("le compte est à zéro", V.combien(), 0);
}

/* ---- 2. un montant saisi l'emporte, avec sa référence -------------------- */
{
  const V = charger();
  V.poser("repas", "17.40", "avenant n° 82 du 3 décembre 2026");
  egal("le montant saisi sort", V.valeur("repas", 16.2), 17.4);
  egal("la référence saisie sort", V.source("repas", "avenant n° 81"),
    "avenant n° 82 du 3 décembre 2026");
  egal("le montant est porté à la main", V.saisi("repas"), true);
  egal("les voisins gardent leur défaut", V.valeur("casseCroute", 8.87), 8.87);
  egal("la source des voisins ne bouge pas", V.source("casseCroute", "avenant n° 81"),
    "avenant n° 81");
}

/* ---- 3. la virgule décimale française ------------------------------------ */
{
  const V = charger();
  V.poser("casseCroute", "9,15", "avenant n° 82");
  egal("la virgule est lue comme un point", V.valeur("casseCroute", 8.87), 9.15);
  V.poser("speciale", "  11,05 €  ", "avenant n° 82");
  egal("les espaces et l'euro sont ignorés", V.valeur("speciale", 9.72), 11.05);
}

/* ---- 4. zéro, le vide et le négatif ne sont pas des saisies -------------- */
{
  const V = charger();
  for (const mauvais of ["0", "0,00", "-3", "", "   ", "abc", "€"]) {
    V.poser("nuitTaux", mauvais, "avenant n° 82");
    egal("« " + mauvais + " » n'écrase pas le défaut", V.valeur("nuitTaux", 20), 20);
    egal("« " + mauvais + " » n'est pas une saisie", V.saisi("nuitTaux"), false);
    egal("« " + mauvais + " » laisse la source du code",
      V.source("nuitTaux", "accord du 11 octobre 2023"), "accord du 11 octobre 2023");
  }
}

/* ---- 5. une référence commune à toute une famille ------------------------ */
{
  const V = charger();
  V.poserSource("avenant n° 82 du 3 décembre 2026");
  V.poser("repas", "17,40");
  V.poser("repasUnique", "9,30");
  egal("la référence commune sert au premier", V.source("repas", "avenant n° 81"),
    "avenant n° 82 du 3 décembre 2026");
  egal("la référence commune sert au second", V.source("repasUnique", "avenant n° 81"),
    "avenant n° 82 du 3 décembre 2026");
  /* Une référence propre à une ligne passe devant la commune. */
  V.poser("casseCroute", "9,15", "avenant n° 83 du 4 janvier 2027");
  egal("la référence de la ligne passe devant",
    V.source("casseCroute", "avenant n° 81"), "avenant n° 83 du 4 janvier 2027");
  /* Et un montant non saisi garde le défaut du code, référence commune ou non. */
  egal("la référence commune ne contamine pas un non-saisi",
    V.source("speciale", "avenant n° 81"), "avenant n° 81");
}

/* ---- 6. une saisie sans aucune référence le dit -------------------------- */
{
  const V = charger();
  V.poser("grandDeplacement1", "63,20");
  const s = V.source("grandDeplacement1", "avenant n° 81");
  if (!/référence non précisée/.test(s))
    faute("une saisie sans référence doit le dire, et non rendre « " + s + " »");
  if (/avenant n° 81/.test(s))
    faute("une saisie sans référence ne doit pas rendre la source du code : « " + s + " »");
}

/* ---- 7. effacer une ligne, sans toucher aux autres ---------------------- */
{
  const V = charger();
  V.poser("repas", "17,40", "avenant n° 82");
  V.poser("casseCroute", "9,15", "avenant n° 82");
  egal("deux montants portés", V.combien(), 2);
  V.poser("repas", "", "");
  egal("le montant effacé rend le défaut", V.valeur("repas", 16.2), 16.2);
  egal("la source effacée rend celle du code", V.source("repas", "avenant n° 81"),
    "avenant n° 81");
  egal("l'autre montant survit", V.valeur("casseCroute", 8.87), 9.15);
  egal("le compte retombe à un", V.combien(), 1);
}

/* ---- 8. le compte des montants portés à la main ------------------------- */
{
  const V = charger();
  egal("le compte part de zéro", V.combien(), 0);
  V.CHAMPS.forEach((c, i) => V.poser(c.c, String(i + 1), "avenant n° 82"));
  egal("le compte vaut le nombre de champs", V.combien(), V.CHAMPS.length);
  /* Une clé inconnue ne compte pas : le compte suit les champs déclarés. */
  V.poser("inventee", "42", "avenant n° 82");
  egal("une clé hors des champs ne compte pas", V.combien(), V.CHAMPS.length);
}

/* ---- 9. un localStorage en panne ne fait pas tomber le module ----------- */
{
  const V = charger(true);
  egal("en panne, le défaut sort quand même", V.valeur("repas", 16.2), 16.2);
  egal("en panne, la source du code sort", V.source("repas", "avenant n° 81"), "avenant n° 81");
  egal("en panne, rien n'est saisi", V.saisi("repas"), false);
  egal("en panne, le compte est à zéro", V.combien(), 0);
  let tombe = "";
  try { V.poser("repas", "17,40", "avenant n° 82"); V.poserSource("avenant n° 82"); }
  catch (e) { tombe = e.message; }
  egal("en panne, l'écriture ne lève rien", tombe, "");
}

/* ---- 10. les onze clés, et celles que le contrat interroge -------------- */
{
  const V = charger();
  const cles = V.CHAMPS.map((c) => c.c);
  egal("le nombre de champs", cles.length, 11);
  const attendues = ["garantieAnnuelle", "repas", "repasUnique", "repasUniqueNuit",
    "casseCroute", "speciale", "grandDeplacement1", "grandDeplacement2",
    "nuitTaux", "amplitudePart", "amplitudePlafond"];
  attendues.forEach((c) => {
    if (cles.indexOf(c) === -1) faute("la clé « " + c + " » a disparu des champs");
  });
  cles.forEach((c) => {
    if (attendues.indexOf(c) === -1) faute("la clé « " + c + " » est nouvelle, et sans épreuve");
  });
  /* Chaque champ porte un intitulé et une famille, sinon l'écran le rend nu. */
  V.CHAMPS.forEach((c) => {
    if (!c.nom || !String(c.nom).trim()) faute("le champ « " + c.c + " » n'a pas d'intitulé");
    if (!c.famille || !String(c.famille).trim()) faute("le champ « " + c.c + " » n'a pas de famille");
  });
  /* Et le contrat doit interroger chacune d'elles : une clé déclarée que
     personne ne lit est un champ qui ne sert à rien. */
  const ct = readFileSync(new URL("../docs/contrats-transport.js", import.meta.url), "utf8");
  cles.forEach((c) => {
    if (ct.indexOf('"' + c + '"') === -1)
      faute("la clé « " + c + " » n'est lue nulle part dans le contrat");
  });
}

console.log("montants conventionnels : cas essayés 10 | fautes " + fautes);
process.exit(fautes ? 1 : 0);
