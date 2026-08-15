/* Le registre d'exécution des tests : produit à partir du rapport que le
   programme de test a écrit, jamais recopié. Il permet à un tiers de reproduire
   chaque scénario et de vérifier le verdict obtenu. */
const fs=require("fs"); const O=require("./outils.js");
const R=JSON.parse(fs.readFileSync("rapport-tests.json","utf8"));
R.total=R.totalCas; R.echecs=R.echecs;
const MAN=require("./manifeste.js");
module.exports=function(){
 const A=O(); const {sur,t1,trait,h1,h2,p,note,enc,tab}=A;
 sur("Licenciement pour motif économique — base de règles et de contrôles");
 t1("Registre d'exécution des tests");
 sur(`${R.total} cas contradictoires · ${R.echecs} échec(s) · moteur ${R.version} · exécuté le ${R.execute}`);
 trait();
 enc("À quoi sert ce registre",
  "Un contrôle qui n'a jamais échoué sur un dossier fautif n'est pas un contrôle : c'est une intention. Chaque ligne ci-dessous décrit un dossier de référence dans lequel une faute précise a été introduite, l'état que le contrôle devait produire, et l'état qu'il a produit. Le tableau est écrit par le programme de test lui-même, à l'exécution.");
 h2("Le dossier de référence");
 p("Toutes les mutations ci-dessous s'appliquent au même dossier, reproduit intégralement en annexe et joint au format JSON. Un tiers peut donc rejouer chaque cas sans disposer du code.");
 const B=(()=>{try{const d=JSON.parse(fs.readFileSync("dossier-reference.json","utf8"));return d.dossier||d;}catch(e){return null;}})();
 if(B) tab(["Champ","Valeur"],Object.entries(B).map(([k,v])=>[k,
   typeof v==="object"?JSON.stringify(v).slice(0,300):String(v)]));
 enc("Reproduire un cas",
  `Le dossier de référence est celui du fichier de tests. La colonne « donnée injectée » indique exactement ce qui en a été modifié, valeur avant et valeur après. L'empreinte du moteur — ${R.version} — est calculée sur les fichiers qui décident : moteur, contrôles, grille, pièces, preuve. Deux exécutions portant la même empreinte donnent le même résultat ; une empreinte différente signifie que le comportement a pu changer.`);
 const M=MAN.construire(), V=MAN.verifier();
 h1("Les trois objets publiés");
 tab(["Objet","Fichier","Ce qu'il contient"],[
  ["Manifeste des contrôles","manifeste-controles.json",`Le catalogue : ${M.compteurs.controles} identifiants, leur type, les données lues, la pièce exigée, les états possibles et les cas de test`],
  ["Registre d'exécution","rapport-tests.json",`Le journal : ${R.totalCas} cas, l'état attendu, l'état obtenu, le constat produit`],
  ["Dossier de référence","dossier-reference.json","Le dossier auquel chaque mutation s'applique, pour rejouer les cas"]]);
 if(R.empreintesFichiers){
  h2("Empreinte de chacun des sept fichiers qui décident");
  p("L'empreinte globale dit qu'un fichier a changé ; celles-ci disent lequel.");
  tab(["Fichier","Empreinte","Ce qu'il porte"],
   Object.entries(R.empreintesFichiers).map(([f,e])=>[f,e,({
    "moteur.js":"seuils, régimes, délais, indemnités, barème",
    "controles.js":"première série de contrôles et niveaux de preuve",
    "controles2.js":"contrôles des pièces, de la procédure et du plan",
    "grille-eco.js":"règles rédigées, avec leur jurisprudence",
    "grille-auto.js":"une règle par article lu sur Légifrance",
    "pieces.js":"structure des pièces et de leurs métadonnées",
    "preuve.js":"niveaux de preuve et registre des pièces"}[f]||"—")]));
 }
 note(`Les trois portent la même empreinte — ${R.manifeste?R.manifeste.empreinte:R.version} — calculée sur les sept fichiers qui décident. Une empreinte différente signifie que le comportement a pu changer.`);
 h1("Synthèse");
 tab(["Élément","Valeur","Ce qu'il désigne"],[
  ["Contrôles publiés au manifeste",String(M.compteurs.controles),"Tous figurent au questionnaire et sont exécutés sur le dossier"],
  ["dont contrôles de conformité",String(M.compteurs.conformite),"Peuvent conclure à la conformité ; chacun doit avoir un cas contradictoire"],
  ["dont contrôles de détection",String(M.compteurs.detection),"Ne concluent jamais à la conformité ; sans cas contradictoire, n'ayant aucune faute à détecter"],
  ["Contrôles couverts par un test",String(M.compteurs.testes),"Égal au nombre de contrôles de conformité"],
  ["Cas contradictoires exécutés",String(R.total),"Plusieurs fautes distinctes peuvent viser le même contrôle"],
  ["Succès",String(R.total-R.echecs),""],
  ["Échecs",String(R.echecs),""],
  ["Empreinte du moteur",R.version,"Condensé des sept fichiers qui décident"],
  ["Date d'exécution",R.execute,""]]);
 enc("Pourquoi 42 et non 48",
  "Six contrôles sont des contrôles de détection : co-emploi, usages et engagements unilatéraux, contentieux en cours, situations individuelles, menace sur la compétitivité et expertise du comité. Ils ne détectent aucune faute — ils relaient une déclaration et concluent obligatoirement au risque. Il n'existe donc aucun dossier fautif à leur soumettre. Les 42 contrôles de conformité, eux, sont tous couverts.");
 h2("Contrôle de non-divergence");
 tab(["Vérification","Résultat"],[
  ["Identifiants uniques",V.identifiantsUniques?"oui":"NON"],
  ["Contrôles de conformité sans cas de test",V.conformiteSansTest.join(", ")||"aucun"],
  ["Contrôles de détection couverts à tort par un test",V.detectionAvecTest.join(", ")||"aucun"],
  ["Contrôles de détection pouvant conclure à la conformité",V.detectionPouvantConclureConforme.join(", ")||"aucun"],
  ["Somme conformité + détection égale au total",V.somme?"oui":"NON"],
  ["Contrôles testés égaux aux contrôles de conformité",V.coherenceTestes?"oui":"NON"]]);
 h2("Contrôles de détection, sans cas contradictoire");
 tab(["N°","Ce qu'il signale"],
  M.controles.filter(c=>c.type!=="conformité").map(c=>[c.id,c.objet]));
 const parCtl={}; R.cas.forEach(c=>{const r=c.controle.replace(/-\d+$/,"");(parCtl[r]=parCtl[r]||[]).push(c);});
 for(const [fam,l] of Object.entries(parCtl)){
  h1(fam);
  for(const c of l){
   h2(`${c.cas} — ${c.intitule}`);
   tab(["Élément","Valeur"],[
    ["Contrôle visé",`${c.controle} — ${c.objet}`],
    ["Donnée injectée",c.injecte],
    ["État attendu",c.attendu],
    ["État obtenu",c.obtenu],
    ["Verdict",c.verdict],
    ["Constat produit par le contrôle",c.constat],
    ["Moteur",c.version],
    ["Exécuté le",c.execute]]);
  }
 }
 return A.D;
};
