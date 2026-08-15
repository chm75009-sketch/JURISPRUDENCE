/* Cas contradictoires : chaque scénario contient une faute précise, et le test
   échoue si le contrôle censé la voir ne la voit pas. C'est la seule façon de
   savoir qu'un contrôle contrôle quelque chose. */
const {C}=require("./controles.js");
const BASE={entreprise:"T",effectif:320,effectifGroupe:602,groupe:true,cause:"1",
 nbLicenciements:22,dateNotification:"2026-06-15",dateEntretien:"2026-06-02",
 dateInfoCSE:"2026-03-09",datesReunionsCSE:["2026-03-23","2026-04-14"],dateAvisCSE:"2026-04-14",
 dateNotifAdmin:"2026-03-24",etablissementsDistincts:1,cseExistant:true,expertise:false,
 consequencesSSCT:"réorganisation des rotations",perimetreOrdre:"entreprise",
 effectifEtablissement:320,idcc:"1486",conventionJointe:true,accordsJoints:true,
 societes:[{nom:"A"},{nom:"B"}],
 postesDisponibles:[{societe:"A",intitule:"Régleur"},{societe:"B",intitule:"Cariste"}],
 offresFaites:[{intitule:"Régleur",employeur:"A",descriptif:"d",contrat:"CDI",lieu:"L",
   remuneration:"30 000 €",classification:"N3",dateCertaine:true,salarie:"S1",delaiReponse:"15 jours"},
  {intitule:"Cariste",employeur:"B",descriptif:"d",contrat:"CDI",lieu:"L",
   remuneration:"26 000 €",classification:"N2",dateCertaine:true,salarie:"S1",delaiReponse:"15 jours"}],
 pieces:[{code:"etat-postes",fichier:"postes.pdf",date:"2026-06-01",periode:"juin 2026",
   auteur:"DRH groupe",version:"1",perimetre:"groupe France",lue:true},
  {code:"renseignements-cse",fichier:"info.pdf",date:"2026-03-09",periode:"2026",
   auteur:"direction",version:"1",perimetre:"entreprise",lue:true},
  {code:"comptes-groupe",fichier:"cons.pdf",date:"2026-04-30",periode:"2025",
   auteur:"groupe",version:"1",perimetre:"secteur d'activité du groupe",lue:true},
  {code:"conventionJointe",fichier:"ccn.pdf",date:"2026-01-10",periode:"2026",
   auteur:"branche",version:"avenant 46",lue:true,perimetre:"branche"},
  {code:"accord-methode",fichier:"acc.pdf",date:"2026-02-01",periode:"2026",
   auteur:"entreprise",version:"1",perimetre:"entreprise",lue:true}],
 trimestres:[{libelle:"T2-25",n:9240,n1:10180,perimetre:"secteur"}],
 resultatExploitation:[{annee:2025,valeur:-1870}],tresorerie:[{annee:2025,valeur:-580}],
 formationProposee:[{contenu:"adaptation",duree:"120 h",reponse:"refus"}],
 postesSupprimes:[{intitule:"Régleur",avant:10,apres:-12}],
 pse:{voie:"accord",suffrages:62,evitement:"14 postes d'intérim supprimés",
  reclassementInterne:"11 postes",formation:"350 heures",creation:"12 000 €",
  suivi:"commission tous les 2 mois",dateDecisionAdmin:"2026-06-10"}};
const CAS=[
 ["offre de reclassement émanant d'une société étrangère","CTL-REC-12","non conforme",
  f=>{f.societes=[{nom:"A"},{nom:"B",etranger:true}];}],
 ["fermeture d'un établissement sans recherche de repreneur","CTL-REP-01","non conforme",
  f=>{f.effectif=1200; f.effectifEtablissement=1200; f.fermetureEtablissement=true;}],
 ["catégorie professionnelle d'un seul salarié protégé","CTL-ORD-02","non conforme",
  f=>{f.categories=[{nom:"Chef d'atelier zone Est",effectif:1,salaries:[{nom:"P1"}]},
       {nom:"Régleur",effectif:12,salaries:[{nom:"S1"},{nom:"S2"}]}];
      f.salariesProteges=[{nom:"P1",mandat:"élu",autorisation:"2026-05-01"}];}],
 ["avis non rendu et notification antérieure à l'expiration du délai","CTL-CSE-04","non conforme",
  f=>{f.dateAvisCSE="avis non rendu"; f.datesReunionsCSE=["2026-03-23","2026-04-14"];
      f.dateNotification="2026-05-01";}],
 ["mention « avis non rendu » lue comme un avis rendu","CTL-CSE-04","non conforme",
  f=>{f.dateAvisCSE="avis non rendu"; f.dateNotification="2026-04-01";}],
 ["poste disponible non proposé","CTL-REC-07","non conforme",
  f=>{f.offresFaites=f.offresFaites.slice(0,1);}],
 ["offre sans rémunération","CTL-REC-03","non conforme",
  f=>{delete f.offresFaites[0].remuneration;}],
 ["société du groupe non interrogée","CTL-REC-02","risque à vérifier",
  f=>{f.postesDisponibles=[{societe:"A",intitule:"Régleur"}]; f.offresFaites=f.offresFaites.slice(0,1);}],
 ["état des postes postérieur à la notification","CTL-REC-06","non conforme",
  f=>{f.pieces[0].date="2026-06-20";}],
 ["offre sans délai de réponse","CTL-REC-09","risque à vérifier",
  f=>{delete f.offresFaites[0].delaiReponse;}],
 ["poste de catégorie inférieure sans accord exprès","CTL-REC-10","non conforme",
  f=>{f.offresFaites[1].categorieInferieure=true;}],
 ["pièce seulement cochée, sans métadonnées","CTL-PCE-01","risque à vérifier",
  f=>{f.pieces=["etat-postes"];}],
 ["pièce postérieure à l'acte","CTL-PCE-02","non conforme",
  f=>{f.pieces[0].date="2026-07-01";}],
 ["pièce déposée mais non lue","CTL-PCE-04","risque à vérifier",
  f=>{f.pieces[0].lue=false;}],
 ["convocation postérieure à la réunion","CTL-CSE-06","non conforme",
  f=>{f.dateInfoCSE="2026-03-25";}],
 ["convocation deux jours avant la réunion","CTL-CSE-06","risque à vérifier",
  f=>{f.dateInfoCSE="2026-03-21";}],
 ["comité central non réuni malgré plusieurs établissements","CTL-CSE-07","non conforme",
  f=>{f.etablissementsDistincts=4; f.cseCentralConsulte=false;}],
 ["aucun comité et aucune carence","CTL-CSE-08","non conforme",
  f=>{f.cseExistant=false;}],
 ["conséquences santé et sécurité non exposées","CTL-CSE-10","risque à vérifier",
  f=>{delete f.consequencesSSCT;}],
 ["notification administrative avant la première réunion","CTL-CSE-05","non conforme",
  f=>{f.dateNotifAdmin="2026-03-10";}],
 ["effectif d'établissement supérieur à celui de l'entreprise","CTL-EFF-01","non conforme",
  f=>{f.effectifEtablissement=400;}],
 ["critères d'ordre appliqués à l'établissement sans accord","CTL-EFF-02","risque à vérifier",
  f=>{f.perimetreOrdre="établissement";}],
 ["accord majoritaire sous les 50 %","CTL-PSE-07","non conforme",
  f=>{f.pse.suffrages=41;}],
 ["mesures du plan non chiffrées","CTL-PSE-05","risque à vérifier",
  f=>{f.pse.evitement="des mesures seront prises"; f.pse.formation="formations adaptées";
      f.pse.reclassementInterne="postes proposés"; f.pse.creation="aide au projet";}],
 ["plan postérieur à la convocation","CTL-PSE-06","non conforme",
  f=>{f.pieces.push({code:"pse",fichier:"pse.pdf",date:"2026-03-20",periode:"2026",
      auteur:"direction",version:"1",perimetre:"entreprise",lue:true});}],
 ["notification avant la décision d'homologation","CTL-PSE-04","non conforme",
  f=>{f.pse.dateDecisionAdmin="2026-06-20";}],
 ["salarié protégé sans autorisation","CTL-PRT-01","non conforme",
  f=>{f.salariesProteges=[{nom:"X",mandat:"membre du CSE"}];}],
 ["intérimaire sur un emploi supprimé","CTL-EMP-02","non conforme",
  f=>{f.postesSupprimes=[{intitule:"Régleur",avant:10,apres:5}];
      f.precaires=[{emploi:"Régleur",type:"intérim"}];}],
 ["attestation d'absence de poste établie par la direction","CTL-REC-11","risque à vérifier",
  f=>{f.postesDisponibles=[]; f.offresFaites=[];
      f.pieces.push({code:"attestation-absence-poste",fichier:"a.pdf",date:"2026-06-01",
        periode:"juin",auteur:"La DRH",version:"1",perimetre:"groupe",lue:true});}],
  ["état des postes absent","CTL-REC-01","donnée manquante",
   f=>{delete f.postesDisponibles;}],
  ["état des postes annoncé sans pièce versée","CTL-REC-01","risque à vérifier",
   f=>{f.pieces=f.pieces.filter(p=>p.code!=="etat-postes");}],
  ["aucun poste et aucune attestation d'absence","CTL-REC-04","risque à vérifier",
   f=>{f.postesDisponibles=[];}],
  ["aucune formation proposée sur une mutation technologique","CTL-REC-05","non conforme",
   f=>{f.cause="2"; delete f.formationProposee;}],
  ["offres non adressées à tous les salariés","CTL-REC-08","non conforme",
   f=>{f.nbLicenciements=3; f.offresFaites.forEach(o=>o.salarie="S1");}],
  ["suppressions déclarées différentes du nombre de licenciements","CTL-EMP-01","risque à vérifier",
   f=>{f.postesSupprimes=[{intitule:"Régleur",avant:10,apres:9}];}],
  ["aucune pièce comptable renseignée","CTL-ECO-01","donnée manquante",
   f=>{f.cause="1"; delete f.trimestres; delete f.resultatExploitation; delete f.tresorerie;}],
  ["données comptables sans périmètre de secteur","CTL-ECO-02","risque à vérifier",
   f=>{f.trimestres=[{libelle:"T1",n:100,n1:120}];}],
  ["mutation technologique non décrite","CTL-ECO-04","donnée manquante",
   f=>{f.cause="2"; delete f.mutation;}],
  ["une seule réunion là où deux sont exigées","CTL-CSE-01","non conforme",
   f=>{f.datesReunionsCSE=["2026-03-23"];}],
  ["moins de quinze jours entre les deux réunions","CTL-CSE-02","non conforme",
   f=>{f.datesReunionsCSE=["2026-03-23","2026-03-30"];}],
  ["document des sept renseignements non versé","CTL-CSE-03","risque à vérifier",
   f=>{f.pieces=f.pieces.filter(p=>p.code!=="renseignements-cse");}],
  ["aucun avis rendu et délai non établi","CTL-CSE-04","risque à vérifier",
   f=>{delete f.dateAvisCSE;}],
  ["plan de sauvegarde sans mesure de suivi","CTL-PSE-01","risque à vérifier",
   f=>{delete f.pse.suivi;}],
  ["comptes du groupe non versés alors qu'un plan est dû","CTL-PSE-02","risque à vérifier",
   f=>{f.pieces=f.pieces.filter(p=>p.code!=="comptes-groupe");}],
  ["voie du plan non arrêtée","CTL-PSE-03","donnée manquante",
   f=>{delete f.pse.voie;}],
  ["convention et accords non versés","CTL-CCN-01","risque à vérifier",
   f=>{f.conventionJointe=false; f.accordsJoints=false;}],
  ["comptes du groupe sans périmètre déclaré","CTL-PCE-03","risque à vérifier",
   f=>{const p=f.pieces.find(x=>x.code==="comptes-groupe"); if(p) delete p.perimetre;}],
  ["convention déclarée mais non versée comme pièce","CTL-CCN-02","risque à vérifier",
   f=>{f.pieces=f.pieces.filter(p=>!/convention/i.test(p.code));}],
  ["accords annoncés mais non lus","CTL-CCN-03","risque à vérifier",
   f=>{f.accordsJoints=true; f.pieces=f.pieces.filter(p=>!/accord/i.test(p.code));}],
];
/* Version du moteur : empreinte des fichiers qui décident. Deux exécutions qui
   portent la même empreinte sont reproductibles ; une empreinte différente veut
   dire que le résultat a pu changer. */
const fs=require("fs"), crypto=require("crypto");
const FICHIERS=["moteur.js","controles.js","controles2.js","grille-eco.js","grille-auto.js","pieces.js","preuve.js"];
const VERSION=crypto.createHash("sha256")
  .update(FICHIERS.map(f=>fs.readFileSync(f,"utf8")).join("")).digest("hex").slice(0,12);
const HORODATAGE=new Date().toISOString().slice(0,19).replace("T"," ");
/* Ce que le cas modifie par rapport au dossier de référence : on le mesure en
   comparant avant et après, pour ne pas décrire la faute de mémoire. */
const bref=v=>{ if(v===undefined) return "absent";
  if(Array.isArray(v)) return `liste de ${v.length}`;
  if(v&&typeof v==="object") return "objet";
  return JSON.stringify(v); };
function diff(a,b,prefixe=""){
  const out=[];
  const cles=new Set([...Object.keys(a||{}),...Object.keys(b||{})]);
  for(const k of cles){
    const x=a?a[k]:undefined, y=b?b[k]:undefined;
    if(JSON.stringify(x)===JSON.stringify(y)) continue;
    if(Array.isArray(x)&&Array.isArray(y)){
      if(x.length!==y.length){ out.push(`${prefixe}${k} : ${x.length} élément(s) → ${y.length}`); continue; }
      x.forEach((e,i)=>{ if(JSON.stringify(e)!==JSON.stringify(y[i]))
        out.push(...diff(e,y[i],`${prefixe}${k}[${i}].`)); });
      continue;
    }
    if(x&&y&&typeof x==="object"&&typeof y==="object")
      { out.push(...diff(x,y,prefixe+k+".")); continue; }
    out.push(`${prefixe}${k} : ${bref(x)} → ${bref(y)}`);
  }
  return out;
}
fs.writeFileSync("dossier-reference.json",JSON.stringify(BASE,null,1));
let ko=0; const RAPPORT=[];
CAS.forEach(([nom,id,attendu,casse],i)=>{
  const f=JSON.parse(JSON.stringify(BASE)); casse(f);
  const ctl=C.find(x=>x.id===id);
  let v; try{ v=ctl.verdict(f); }catch(e){ v={etat:"ERREUR "+e.message,motif:String(e.message)}; }
  const ok=v.etat===attendu;
  if(!ok) ko++;
  RAPPORT.push({cas:`T-${String(i+1).padStart(3,"0")}`, intitule:nom, controle:id,
    objet:ctl?ctl.objet:"—", injecte:diff(BASE,f).join(" ; ")||"—",
    attendu, obtenu:v.etat, verdict:ok?"succès":"ÉCHEC",
    constat:(v.motif||"").replace(/\s+/g," ").slice(0,260),
    version:VERSION, execute:HORODATAGE});
  console.log((ok?"ok  ":"KO  ")+nom.padEnd(56)+id.padEnd(12)+v.etat+(ok?"":`  (attendu ${attendu})`));
});
fs.writeFileSync("rapport-tests.json",JSON.stringify(
  {version:VERSION,execute:HORODATAGE,total:CAS.length,echecs:ko,cas:RAPPORT},null,1));
console.log(`\nmoteur ${VERSION} · exécuté le ${HORODATAGE}`);
console.log(ko?`\n${ko} cas sur ${CAS.length} en échec`:`\nles ${CAS.length} cas contradictoires sont détectés`);
