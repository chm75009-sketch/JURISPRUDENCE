/* Les valeurs qu'une question accepte, et la preuve que la base les exploite.

   Un formulaire qui demande « source du découpage : texte » laisse l'utilisateur
   deviner ce que la base sait lire. Il écrit « DUE », le contrôle cherche
   « décision unilatérale », et la réponse tombe dans la catégorie des choses que
   personne ne vérifie. Proposer une liste supprime la devinette — à condition
   que la liste soit celle que le code reconnaît vraiment.

   D'où les deux vérifications, l'une et l'autre exécutées à la publication :

   1. Toute valeur proposée doit apparaître littéralement dans le code qui la
      reconnaît. On ne propose pas ce qu'on ne sait pas exploiter.
   2. Toute chaîne littérale à laquelle le code compare un champ doit figurer
      parmi les propositions de ce champ. On ne reconnaît pas en silence une
      valeur que le formulaire n'offre jamais.

   La seconde est la plus utile : c'est elle qui empêche un contrôle d'attendre
   « redressement » quand la question n'en dit rien. Elles échouent toutes deux
   la publication.

   Chaque entrée porte « libre » : la liste est-elle fermée, ou l'utilisateur
   peut-il écrire autre chose ? Fermée, elle interdit ; ouverte, elle propose et
   laisse la porte ouverte — un dossier réel comporte toujours le cas qu'on
   n'avait pas prévu. */

const NUM = new Set(["number", "string", "boolean", "object", "undefined", "function"]);

/* Les littéraux auxquels le code compare un champ, champ par champ. Les
   comparaisons de type — typeof f.x !== "number" — sont écartées. */
function litterauxCompares(sources) {
  const out = {};
  for (const src of sources) {
    for (const m of src.matchAll(/\bf\.([A-Za-z_][A-Za-z0-9_.]*)\s*(?:===|!==)\s*"([^"]*)"/g)) {
      const champ = m[1], val = m[2];
      if (NUM.has(val)) continue;
      (out[champ] = out[champ] || new Set()).add(val);
    }
  }
  return out;
}

function verifier(PROP, sources) {
  const ecarts = [];
  const texte = sources.join("\n");
  const compares = litterauxCompares(sources);
  /* 1. ce qui est proposé doit être reconnu — sauf pour les champs sur lesquels
     le code ne discrimine pas. Un champ que nul contrôle ne compare à rien est
     repris tel quel dans le rapport : les valeurs qu'on y propose ne sont alors
     qu'une aide à la saisie, et le fichier doit le déclarer par « indicatif ».
     Sans cette déclaration, la vérification s'applique et échoue. */
  for (const [champ, d] of Object.entries(PROP)) {
    if (d.indicatif) {
      if (compares[champ])
        ecarts.push(`${champ} : déclaré indicatif, alors que le code compare ce champ à ${[...compares[champ]].map(v => "« " + v + " »").join(", ")}. Les propositions doivent alors être celles que le code reconnaît.`);
      continue;
    }
    for (const v of d.valeurs)
      if (!texte.includes('"' + v + '"'))
        ecarts.push(`${champ} : la valeur « ${v} » est proposée mais n'apparaît nulle part dans le code — le formulaire offrirait ce que la base ne sait pas lire. Si le code ne discrimine pas sur ce champ, déclarez « indicatif » ; s'il la traite par sa branche par défaut, déclarez-la dans « autres ».`);
    /* « autres » : les valeurs que le code ne nomme pas et traite par sa branche
       par défaut. Les offrir est utile — l'utilisateur ne devine plus ce qu'il
       peut écrire — mais il faut le dire, sans quoi on ne saurait plus lesquelles
       la base discrimine réellement. Elles ne doivent justement pas figurer dans
       le code : si elles y sont, elles relèvent de « valeurs ». */
    for (const v of d.autres || [])
      if (texte.includes('"' + v + '"'))
        ecarts.push(`${champ} : la valeur « ${v} » est déclarée parmi « autres », alors que le code la nomme. Elle relève de « valeurs ».`);
  }
  /* 2. ce qui est reconnu doit être proposé */
  for (const [champ, vals] of Object.entries(compares)) {
    const d = PROP[champ];
    for (const v of vals)
      if (!d || !(d.valeurs.includes(v) || (d.autres || []).includes(v)))
        ecarts.push(`${champ} : le code compare ce champ à « ${v} », qui n'est pas proposé — la valeur serait reconnue sans jamais être offerte.`);
  }
  return ecarts;
}

/* Ce que le formulaire propose : les valeurs discriminantes d'abord, puis les
   autres. L'ordre n'est pas indifférent — les premières sont celles dont la
   base tire une conséquence. */
const offertes = d => [...(d.valeurs || []), ...(d.autres || [])];

module.exports = { verifier, litterauxCompares, offertes };
