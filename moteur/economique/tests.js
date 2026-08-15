/* Batterie de cas de référence : les quatre simulations déjà écrites, plus les
   cas limites. Un écart entre l'attendu et le produit est une régression. */
const audit=require("./audit-client.js"); const M=require("./moteur.js");
const CAS=[
 {nom:"Ardenne — seuil atteint",f:{entreprise:"A",effectif:84,cause:"1",groupe:true,nbLicenciements:6,
   dateEntretien:"2026-04-16",dateNotification:"2026-04-28",convention:{criteresOrdre:false},
   trimestres:[{libelle:"T2",n:9240,n1:10180},{libelle:"T3",n:8610,n1:9970},{libelle:"T4",n:8120,n1:9640},{libelle:"T1",n:7480,n1:9310}]},
  attendu:{regime:"PETIT_COLLECTIF",pse:false,seuil:true,regle:"ECO-1-02"}},
 {nom:"Seuil manqué — 300 salariés, 3 trimestres",f:{effectif:320,cause:"1",groupe:true,nbLicenciements:22,
   trimestres:[{libelle:"T2",n:90,n1:100},{libelle:"T3",n:88,n1:100},{libelle:"T4",n:86,n1:100}]},
  attendu:{regime:"GRAND_COLLECTIF",pse:true,seuil:false,regle:"ECO-1-03"}},
 {nom:"Individuel — 1 salarié",f:{effectif:120,cause:"1",groupe:false,nbLicenciements:1},
  attendu:{regime:"INDIVIDUEL",pse:false,cse:false}},
 {nom:"Cessation partielle",f:{effectif:47,cause:"4",groupe:false,nbLicenciements:47,cessationComplete:false},
  attendu:{regime:"GRAND_PETITE_ENTREPRISE",pse:false,mot:"cessation partielle"}},
 {nom:"Refus d'accord de performance collective",f:{effectif:200,groupe:false,nbLicenciements:1,refusAPC:true},
  attendu:{regle:"SOC-11"}},
 {nom:"Mille salariés — congé de reclassement",f:{effectif:1200,cause:"3",groupe:false,nbLicenciements:40},
  attendu:{accompagnement:"congé de reclassement"}},
 {nom:"Notification trop tôt",f:{effectif:60,cause:"1",groupe:false,nbLicenciements:4,
   dateEntretien:"2026-04-16",dateNotification:"2026-04-20"},
  attendu:{anomalie:true}},
];
let ko=0;
for(const c of CAS){
  const d=audit(c.f); const txt=JSON.stringify(d);
  const r=M.regimeEco(c.f); const a=c.attendu; const pb=[];
  if(a.regime&&r.code!==a.regime) pb.push(`régime ${r.code} ≠ ${a.regime}`);
  if(a.pse!==undefined&&r.pse!==a.pse) pb.push(`pse ${r.pse} ≠ ${a.pse}`);
  if(a.cse!==undefined&&r.consultationCSE!==a.cse) pb.push(`cse ${r.consultationCSE} ≠ ${a.cse}`);
  if(a.seuil!==undefined){const b=M.baisseTrimestrielle(c.f); if(b.atteint!==a.seuil) pb.push(`seuil ${b.atteint} ≠ ${a.seuil}`);}
  if(a.regle&&!txt.includes(a.regle)) pb.push(`règle ${a.regle} absente`);
  if(a.mot&&!txt.includes(a.mot)) pb.push(`« ${a.mot} » absent`);
  if(a.accompagnement&&M.accompagnement(c.f).type!==a.accompagnement) pb.push("accompagnement");
  if(a.anomalie&&!txt.includes("Anomalie de calendrier")) pb.push("anomalie non détectée");
  console.log((pb.length?"KO  ":"ok  ")+c.nom.padEnd(46)+(pb.join(" · ")||`${d.length} éléments`));
  if(pb.length) ko++;
}
console.log(ko?`\n${ko} cas en échec`:"\ntous les cas passent");
