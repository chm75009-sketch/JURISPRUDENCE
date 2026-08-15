/* Une règle par article lu. La conséquence est le texte de l'article lui-même,
   condensé sans être reformulé : ce que la loi dit ne se paraphrase pas.
   La condition d'application est déduite des seuils que l'article énonce.
   La jurisprudence est rattachée par le visa. */
const fs=require("fs");
const T=JSON.parse(fs.readFileSync("textes_eco.json","utf8"));
const RAT=JSON.parse(fs.readFileSync("rattachement.json","utf8"));
const D=JSON.parse(fs.readFileSync("eco_textes.json","utf8"));
const parNum={}; D.forEach(d=>parNum[d.num]=d);

const jolim=n=>n.replace(/^([LRD])(\d{4})-(.+)$/,"$1. $2-$3");
const lien=id=>`https://www.legifrance.gouv.fr/codes/article_lc/${id}`;

/* --- rubriques, par plage d'articles --- */
const RUB=[
 [/^L1233-(1|2|3|4|5|6|7)$/,"Socle · définition, cause, reclassement, ordre"],
 [/^L1233-(8|9|10|11|12|13|14|15|16|17|18|19|20)$/,"Procédure · moins de dix licenciements"],
 [/^L1233-(2[1-9]|3[0-9]|4[0-9]|5[0-9]|60)$/,"Procédure · dix licenciements ou plus"],
 [/^L1233-(6[1-9]|70)$/,"Plan de sauvegarde de l'emploi"],
 [/^L1233-(7[1-9]|8[0-9]|9[01])$/,"Accompagnement, revitalisation, obligations postérieures"],
 [/^L1234-/,"Préavis et indemnité de licenciement"],
 [/^L1235-/,"Contentieux, sanctions et indemnisation"],
 [/^R1233-|^D1233-/,"Dispositions réglementaires — procédure"],
 [/^R1234-|^R1235-/,"Dispositions réglementaires — indemnités et contentieux"],
 [/^L1224-/,"Transfert d'entreprise"],
 [/^L2254-/,"Accord de performance collective"],
 [/^L3253-/,"Procédure collective et garantie des créances"],
 [/^L1237-/,"Rupture conventionnelle collective"],
 [/^L1471-/,"Prescription"],
];
const rubrique=n=>(RUB.find(([r])=>r.test(n))||[null,"Autres textes du champ"])[1];

/* --- condition d'application déduite du texte --- */
function condition(n,t){
  const s=t.toLowerCase();
  const c=[];
  if(/moins de dix salariés dans une même période de trente jours/.test(s)) c.push("n<10");
  if(/au moins dix salariés dans une même période de trente jours|dix salariés ou plus/.test(s)) c.push("n>=10");
  if(/d'au moins cinquante salariés|de cinquante salariés ou plus|employant habituellement au moins cinquante/.test(s)) c.push("e>=50");
  if(/de moins de cinquante salariés|employant habituellement moins de cinquante/.test(s)) c.push("e<50");
  if(/d'au moins onze salariés/.test(s)) c.push("e>=11");
  if(/d'au moins mille salariés|au total au moins mille salariés/.test(s)) c.push("e1000");
  if(/redressement ou (de )?liquidation judiciaire/.test(s)&&/^L3253|^L1233-58/.test(n)) c.push("pc");
  return c;
}
const TEST={
 "n<10":f=>(f.nbLicenciements??0)<10&&(f.nbLicenciements??0)>=1,
 "n>=10":f=>(f.nbLicenciements??0)>=10,
 "e>=50":f=>(f.effectif??0)>=50,
 "e<50":f=>(f.effectif??0)<50,
 "e>=11":f=>(f.effectif??0)>=11,
 "e1000":f=>(f.effectif??0)>=1000||(f.effectifGroupe??0)>=1000,
 "pc":f=>f.procedureCollective===true,
};

/* --- question : première proposition normative de l'article --- */
function question(n,t){
  const p=t.split(/(?<=\.)\s+/)[0].replace(/\s+/g," ").trim();
  return (p.length>170?p.slice(0,167)+"…":p);
}
const condense=t=>{const s=t.replace(/\s+/g," ").trim();return s.length>1400?s.slice(0,1397)+"…":s;};

const R=[];
for(const [n,v] of Object.entries(T)){
  if(!v||!v.texte) continue;
  const cond=condition(n,v.texte);
  const arrets=(RAT[n]||[]).map(a=>({num:a.num,date:a.date,ch:a.ch,sol:a.sol,pub:a.pub,
    sommaire:(parNum[a.num]||{}).sommaire||null,
    lien:`https://www.courdecassation.fr/decision/${(parNum[a.num]||{}).id||""}`}));
  R.push({
    id:"ART-"+n, rubrique:rubrique(n), article:jolim(n),
    question:question(n,v.texte),
    si:f=>cond.every(c=>TEST[c](f)),
    conditionsLisibles:cond,
    alors:()=>condense(v.texte),
    fondement:[jolim(n)],
    lienLegifrance:lien(v.id),
    juris:arrets,
    pieces:[], erreurs:[], valeur:"texte en vigueur au 15 août 2026",
    source:"article"
  });
}
module.exports=R;
