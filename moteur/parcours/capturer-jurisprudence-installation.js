/* Capturer à la source les arrêts que le parcours « Installer le CSE :
   la première réunion » cite.

   Règle absolue du dépôt : toute requête dont la réponse porte « relaxed:true »
   est ÉCARTÉE — une requête relaxée ramène des décisions sans rapport avec la
   recherche. Ici, on ne cherche pas par mots : on cherche chaque arrêt par son
   NUMÉRO DE POURVOI, puis on vérifie que la décision servie porte bien ce
   numéro. Le sommaire retenu est celui que publie la Cour ; à défaut de
   sommaire, on ne cite rien plutôt qu'un résumé de notre cru.

   La clé Judilibre est lue dans le fichier local .jk, jamais écrite dans le
   dépôt (CLAUDE.md).

   Usage : JK=<clé> node capturer-jurisprudence-installation.js
      ou : node capturer-jurisprudence-installation.js /chemin/vers/.jk       */
const fs = require("fs");
const { execFileSync } = require("child_process");

const API = "https://api.piste.gouv.fr/cassation/judilibre/v1.0";
const CLE = process.env.JK
  || (process.argv[2] ? fs.readFileSync(process.argv[2], "utf8").trim() : "");
if (!CLE) { console.error("Clé Judilibre absente : JK=<clé> ou chemin du .jk en argument."); process.exit(1); }

/* Les arrêts recherchés, et ce qu'on attend d'eux. */
const POURVOIS = [
  "88-20.411",  /* désignation du secrétaire : le chef d'établissement y participe */
  "25-10.126",  /* égal accès de tous les membres aux archives et comptes du comité */
  "09-12.758",  /* reddition des comptes du comité sortant (art. R. 2323-38, abrogé) */
  "19-14.224",  /* désignation des membres de la CSSCT : vote à la majorité des présents */
  "24-12.295",  /* L. 2315-39 d'ordre public : siège du troisième collège */
  "24-22.914",  /* pas de remplacement des membres de la CSSCT avant le terme du mandat */
  "11-28.324",  /* le règlement intérieur de l'instance et les prérogatives de l'employeur */
];

const dors = ms => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const sansBalises = s => String(s || "").replace(/<[^>]+>/g, "").replace(/\s+\n/g, "\n").trim();

function chercher(numero) {
  const url = API + "/search?" + new URLSearchParams({
    query: numero, operator: "exact", page_size: "8",
    resolve_references: "true", jurisdiction: "cc",
  }).toString();
  const out = execFileSync("curl", ["-s", "--max-time", "45", "-H", "KeyId: " + CLE, url],
    { encoding: "utf8", maxBuffer: 40e6 });
  const d = JSON.parse(out);
  if (d.relaxed) return { relaxee: true };
  return { resultats: d.results || [] };
}

const sortie = { source: "API Judilibre (Cour de cassation)", date: new Date().toISOString().slice(0, 10),
  regle: "recherche par numéro de pourvoi, réponse relaxée écartée, sommaire publié seul retenu",
  decisions: {}, nonRetenus: {} };

for (const numero of POURVOIS) {
  const r = chercher(numero);
  dors(800);
  if (r.relaxee) {
    sortie.nonRetenus[numero] = { motif: "réponse relaxée — écartée" };
    console.log(numero.padEnd(11) + " ÉCARTÉ (relaxed)");
    continue;
  }
  const x = (r.resultats || []).filter(y => y.number === numero)[0];
  if (!x) {
    sortie.nonRetenus[numero] = { motif: "aucune décision servie ne porte ce numéro de pourvoi" };
    console.log(numero.padEnd(11) + " NON TROUVÉ");
    continue;
  }
  sortie.decisions[numero] = {
    judilibre: x.id, chambre: x.chamber, date: x.decision_date, numero: x.number,
    solution: x.solution || "", publication: x.publication || [],
    sommaire: sansBalises(x.summary),
  };
  console.log(numero.padEnd(11) + " " + x.decision_date + "  " +
    (x.publication || []).join(", ") + "  " + (sansBalises(x.summary).slice(0, 60) || "(sans sommaire publié)"));
}

fs.writeFileSync(__dirname + "/jurisprudence-installation.json", JSON.stringify(sortie, null, 1));
console.log("\n" + Object.keys(sortie.decisions).length + " arrêts lus · " +
  Object.keys(sortie.nonRetenus).length + " écartés");
