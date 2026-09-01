const m=require("/tmp/claude-0/-home-user-JURISPRUDENCE/4906ca9a-cefd-5b6b-bc85-5b1671a87815/scratchpad/v.js");
const CLIENTS=[
 {n:"A — 8 salariés, artisan",        p:{effectif:8,  denomination:"A", cseExiste:"non"}},
 {n:"B — 12 salariés",                p:{effectif:12, denomination:"B", cseExiste:"non"}},
 {n:"C — 18 salariés",                p:{effectif:18, denomination:"C", cseExiste:"non"}},
 {n:"D — 49 salariés",                p:{effectif:49, denomination:"D", cseExiste:"oui"}},
 {n:"E — 74 salariés",                p:{effectif:74, denomination:"E", cseExiste:"oui"}},
 {n:"F — 320 salariés",               p:{effectif:320,denomination:"F", cseExiste:"oui"}},
 {n:"G — 1 200 salariés",             p:{effectif:1200,denomination:"G",cseExiste:"oui"}},
];
const par=m.P.map(p=>p.cle);
console.log("étapes visibles par client\n");
console.log("parcours".padEnd(15)+CLIENTS.map(c=>c.p.effectif.toString().padStart(6)).join(""));
m.P.forEach(function(p){
  var l=p.cle.padEnd(15);
  CLIENTS.forEach(function(c){ m.setProfil(c.p); l+=String(p.etapes.filter(e=>m.visible(e,{})).length).padStart(6); });
  console.log(l);
});
console.log("\n— étapes identiques pour tous les effectifs alors qu'elles citent un seuil —");
