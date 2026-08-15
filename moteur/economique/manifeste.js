/* Le manifeste : un seul fichier, produit par inspection du code, dont dérivent
   le questionnaire, le registre d'exécution et le rapport d'audit. Tant que les
   trois documents le lisent, ils ne peuvent plus afficher des listes différentes. */
const fs=require("fs"), crypto=require("crypto");
const REG=require("./registre.js");
const FICHIERS=["moteur.js","controles.js","controles2.js","grille-eco.js","grille-auto.js","pieces.js","preuve.js"];
function construire(){
  const controles=REG.construire();
  const empreinte=crypto.createHash("sha256")
    .update(FICHIERS.map(f=>fs.readFileSync(f,"utf8")).join("")).digest("hex").slice(0,12);
  let tests=null;
  try{ tests=JSON.parse(fs.readFileSync("rapport-tests.json","utf8")); }catch(e){}
  const testes=new Set(tests?tests.cas.map(c=>c.controle):[]);
  const detection=controles.filter(c=>c.type!=="conformité").map(c=>c.id);
  return {
    empreinte,
    genere:new Date().toISOString().slice(0,19).replace("T"," "),
    compteurs:{
      controles:controles.length,
      conformite:controles.length-detection.length,
      detection:detection.length,
      testes:testes.size,
      casDeTest:tests?tests.total:0,
      echecs:tests?tests.echecs:null,
      regles:require("./grille.js").length,
    },
    definitions:[
      ["contrôles publiés","Nombre d'identifiants uniques du manifeste. Chacun est exécuté sur le dossier soumis, et chacun figure au questionnaire."],
      ["contrôles de conformité","Ceux qui peuvent conclure à la conformité. Chacun doit être couvert par au moins un cas contradictoire."],
      ["contrôles de détection","Ceux qui ne concluent jamais à la conformité : ils signalent une situation hors du champ automatisable. Ils n'ont pas de cas contradictoire, n'ayant aucune faute à détecter — seulement une déclaration à relayer."],
      ["contrôles couverts par un test","Identifiants uniques visés par au moins un scénario fautif. Ils sont, par construction, les contrôles de conformité."],
      ["cas contradictoires","Nombre de scénarios fautifs exécutés. Il excède le nombre de contrôles couverts, plusieurs fautes distinctes pouvant viser le même contrôle."],
    ],
    controles: controles.map(c=>({...c, teste: testes.has(c.id)})),
  };
}
/* Contrôle de non-divergence, publié dans les deux documents. */
function verifier(){
  const m=construire();
  const conf=m.controles.filter(c=>c.type==="conformité");
  return {
    identifiantsUniques:new Set(m.controles.map(c=>c.id)).size===m.controles.length,
    conformiteSansTest:conf.filter(c=>!c.teste).map(c=>c.id),
    detectionAvecTest:m.controles.filter(c=>c.type!=="conformité"&&c.teste).map(c=>c.id),
    detectionPouvantConclureConforme:m.controles.filter(c=>c.type!=="conformité"&&c.etats.includes("conforme")).map(c=>c.id),
    somme: m.compteurs.conformite+m.compteurs.detection===m.compteurs.controles,
    coherenceTestes: m.compteurs.testes===m.compteurs.conformite,
  };
}
if(require.main===module){
  const m=construire();
  fs.writeFileSync("manifeste-controles.json",JSON.stringify(m,null,1));
  console.log(JSON.stringify(m.compteurs));
  console.log(JSON.stringify(verifier()));
}
module.exports={construire,verifier};
