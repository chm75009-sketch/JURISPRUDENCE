/* Chaîne de publication. Trois objets distincts, une seule empreinte :
   1. le manifeste des contrôles — le catalogue ;
   2. le registre d'exécution — le journal des tests ;
   3. le dossier de référence et ses mutations — de quoi les rejouer.
   Ce programme les produit dans cet ordre et les estampille. */
const fs=require("fs"), crypto=require("crypto"), {execSync}=require("child_process");
const FICHIERS=["moteur.js","controles.js","controles2.js","grille-eco.js","grille-auto.js","pieces.js","preuve.js"];
const h=s=>crypto.createHash("sha256").update(s).digest("hex").slice(0,12);
const empreintes=Object.fromEntries(FICHIERS.map(f=>[f,h(fs.readFileSync(f,"utf8"))]));
const EMPREINTE=h(FICHIERS.map(f=>fs.readFileSync(f,"utf8")).join(""));

console.log("1. exécution des cas contradictoires");
execSync("node tests-contradictoires.js", {stdio:"pipe"});

console.log("2. propositions du formulaire, vérifiées dans les deux sens");
{
  const { ECARTS } = require("./propositions.js");
  if (ECARTS.length) {
    ECARTS.forEach(e => console.error("ÉCART — " + e));
    console.error("ÉCHEC — le formulaire proposerait autre chose que ce que la base sait lire.");
    process.exit(1);
  }
}

console.log("3. manifeste des contrôles");
const MAN=require("./manifeste.js");
const m0=MAN.construire(); const v=MAN.verifier();
/* Les empreintes individuelles en tête : c'est elles qui disent lequel des sept
   fichiers a changé, quand l'empreinte globale se contente de dire qu'un a changé. */
const m={ objet:"manifeste des contrôles", empreinte:m0.empreinte,
  empreintesFichiers:empreintes, genere:m0.genere, verification:v, ...m0 };
delete m.empreintesParFichier;
m.objets={
 manifeste:"manifeste-controles.json — le catalogue des contrôles",
 registre:"rapport-tests.json — le journal d'exécution des tests",
 dossier:"dossier-reference.json — le dossier sur lequel les mutations sont appliquées",
};
m.objets={
 manifeste:"manifeste-controles.json — le catalogue des contrôles",
 registre:"rapport-tests.json — le journal d'exécution des tests",
 dossier:"dossier-reference.json — le dossier sur lequel les mutations sont appliquées",
};
fs.writeFileSync("manifeste-controles.json", JSON.stringify(m,null,1));

console.log("4. estampillage du registre d'exécution");
const R=JSON.parse(fs.readFileSync("rapport-tests.json","utf8"));
const couverts=new Set(R.cas.map(c=>c.controle));
const enrichi={
 objet:"registre d'exécution des tests",
 version:R.version, execute:R.execute,
 manifeste:{empreinte:EMPREINTE, fichier:"manifeste-controles.json"},
 dossierReference:"dossier-reference.json",
 totalCas:R.total, succes:R.total-R.echecs, echecs:R.echecs,
 controlesTotal:m.compteurs.controles,
 controlesConformite:m.compteurs.conformite,
 controlesDetection:m.compteurs.detection,
 controlesDistinctsCouverts:couverts.size,
 controlesConformiteSansTest:v.conformiteSansTest.length,
 empreintesFichiers:empreintes,
 detectionSansTest:m.controles.filter(c=>c.type!=="conformité").map(c=>c.id),
 repartitionEtats:R.cas.reduce((a,c)=>(a[c.obtenu]=(a[c.obtenu]||0)+1,a),{}),
 cas:R.cas,
};
fs.writeFileSync("rapport-tests.json", JSON.stringify(enrichi,null,1));

console.log("5. estampillage du dossier de référence");
const D=JSON.parse(fs.readFileSync("dossier-reference.json","utf8"));
fs.writeFileSync("dossier-reference.json", JSON.stringify({
 objet:"dossier de référence des cas contradictoires",
 manifeste:{empreinte:EMPREINTE, fichier:"manifeste-controles.json"},
 registre:"rapport-tests.json",
 empreintesFichiers:empreintes,
 note:"Chaque cas du registre applique une mutation à ce dossier ; la colonne « donnée injectée » en donne la différence, valeur avant puis valeur après.",
 dossier:D}, null, 1));

/* contrôle final : les trois objets portent-ils la même empreinte ? */
const lu=f=>JSON.parse(fs.readFileSync(f,"utf8"));
const e=[lu("manifeste-controles.json").empreinte,
         lu("rapport-tests.json").manifeste.empreinte,
         lu("dossier-reference.json").manifeste.empreinte];
console.log("\nempreinte commune :", new Set(e).size===1 ? e[0] : "DIVERGENCE " + e.join(" / "));
console.log("compteurs :", JSON.stringify(m.compteurs));
console.log("vérification :", JSON.stringify(v));
