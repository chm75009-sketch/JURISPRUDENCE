/* La grille complète : les règles rédigées — qui portent l'interprétation, les
   pièces et les erreurs — puis une règle par article lu sur Légifrance. */
const H=require("./grille-eco.js").map(r=>({...r,source:"rédigée",
  valeur:r.valeur||"—",lienLegifrance:null}));
const A=require("./grille-auto.js");
module.exports=[...H,...A];
