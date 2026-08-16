/* La validation des entrées du module comité.

   Le module économique avait déjà la sienne ; celui-ci n'en avait aucune. Une
   date d'élections au 30 février était acceptée sans broncher — new Date la
   décale au 1er ou au 2 mars — et le contrôle du renouvellement prononçait une
   conformité sur un jour qui n'existe pas. Un effectif de 299,5, une masse
   salariale négative, un nombre de titulaires décimal passaient de même.

   Ce fichier ne juge rien du droit : il dit seulement si la donnée est lisible.
   Ce qui n'est pas lisible n'est ni conforme ni non conforme — c'est à corriger
   avant tout examen, et le contrôle de recevabilité le dit en tête du rapport. */
const { estDateISO } = require("./dates.js");

const estEntierPositif = x => typeof x === "number" && Number.isFinite(x) && Number.isInteger(x) && x >= 0;
const estNombreFini = x => typeof x === "number" && Number.isFinite(x) && x >= 0;

const DATES = ["dateAudit", "dateDernieresElections", "dateInformationPersonnel", "datePremierTour"];
const ENTIERS = ["effectif", "nbCadres", "titulairesElus", "titulairesInitiaux",
  "titulairesRestants", "reunionsTenues", "reunionsSante", "reunionsAccord",
  "heuresAccordees", "nbLicenciements", "dureeAccord"];
const MONTANTS = ["masseSalariale", "masseSalarialeN1", "subventionVersee", "ascAnneeN", "ascAnneeN1"];

const ATTENDU = {};
DATES.forEach(c => ATTENDU[c] = "date au format AAAA-MM-JJ");
ENTIERS.forEach(c => ATTENDU[c] = "entier positif");
MONTANTS.forEach(c => ATTENDU[c] = "montant en euros, positif");
Object.assign(ATTENDU, {
  effectifsMensuels: "liste de nombres entiers positifs",
  "consultation.dateRemiseInformations": "date au format AAAA-MM-JJ",
  "consultation.dateAvis": "date au format AAAA-MM-JJ",
  "expertise.dateDepart": "date au format AAAA-MM-JJ",
  "expertise.dateSaisine": "date au format AAAA-MM-JJ",
  "expertise.partEmployeur": "pourcentage de 0 à 100",
  "protocole.suffragesSignataires": "pourcentage de 0 à 100",
  "protocole.nbSignataires": "entier positif",
  "protocole.nbParticipants": "entier positif",
  listesDeposees: "liste d'objets : inscrits femmes et hommes, sièges à pourvoir, candidats",
});

/* Deux natures d'anomalie, et la distinction commande ce qui en découle.

   « lisibilité » : la valeur ne peut pas exister — le 30 février, un effectif
   décimal, un montant négatif. Aucun contrôle ne peut rien conclure de ce qu'il
   a lu là, et moteur/commun/recevabilite.js le lui interdit.

   « cohérence » : deux valeurs parfaitement lisibles se contredisent — plus de
   titulaires restants qu'élus à l'origine, un avis antérieur à la remise des
   informations. Ce n'est pas un obstacle à l'examen, c'est son objet : les
   contrôles doivent au contraire pouvoir le constater. */
function valider(f) {
  const A = [];
  const dit = (champ, valeur, motif, nature) =>
    A.push({ champ, valeur, motif, nature: nature || "lisibilité", attendu: ATTENDU[champ] });
  const incoherent = (champ, valeur, motif) => dit(champ, valeur, motif, "cohérence");
  const a = (o, c) => o && Object.prototype.hasOwnProperty.call(o, c) && o[c] !== null && o[c] !== "";

  for (const c of DATES)
    if (a(f, c) && !estDateISO(f[c]))
      dit(c, f[c], "date inexistante ou format non reconnu — le format attendu est AAAA-MM-JJ");

  for (const c of ENTIERS)
    if (a(f, c) && !estEntierPositif(f[c]))
      dit(c, f[c], typeof f[c] === "number"
        ? (f[c] < 0 ? "valeur négative" : "valeur décimale, alors qu'il s'agit d'un dénombrement")
        : "valeur non numérique");

  for (const c of MONTANTS)
    if (a(f, c) && !estNombreFini(f[c]))
      dit(c, f[c], typeof f[c] === "number" ? "montant négatif ou non fini" : "valeur non numérique");

  if (a(f, "effectifsMensuels")) {
    if (!Array.isArray(f.effectifsMensuels))
      dit("effectifsMensuels", f.effectifsMensuels, "les relevés mensuels doivent former une liste");
    else {
      const mauvais = f.effectifsMensuels.filter(x => !estEntierPositif(x));
      if (mauvais.length) dit("effectifsMensuels", mauvais.join(", "),
        `${mauvais.length} relevé(s) ne sont pas des entiers positifs`);
      else if (f.effectifsMensuels.length < 12)
        incoherent("effectifsMensuels", f.effectifsMensuels.length + " relevé(s)",
          "moins de douze relevés : la règle des douze mois consécutifs ne peut pas être vérifiée");
    }
  }

  /* Les objets imbriqués : la fiche les porte tels quels, les contrôles les
     lisent tels quels, ils se valident donc tels quels. */
  for (const [objet, champs] of [["consultation", ["dateRemiseInformations", "dateAvis"]],
                                 ["expertise", ["dateDepart", "dateSaisine"]]])
    for (const c of champs)
      if (a(f[objet], c) && !estDateISO(f[objet][c]))
        dit(`${objet}.${c}`, f[objet][c], "date inexistante ou format non reconnu");

  for (const [objet, c] of [["expertise", "partEmployeur"], ["protocole", "suffragesSignataires"]])
    if (a(f[objet], c) && !(typeof f[objet][c] === "number" && f[objet][c] >= 0 && f[objet][c] <= 100))
      dit(`${objet}.${c}`, f[objet][c], "un pourcentage se situe entre 0 et 100");

  for (const c of ["nbSignataires", "nbParticipants"])
    if (a(f.protocole, c) && !estEntierPositif(f.protocole[c]))
      dit(`protocole.${c}`, f.protocole[c], "valeur non entière ou négative");

  if (Array.isArray(f.listesDeposees)) f.listesDeposees.forEach((l, i) => {
    const nom = l && l.nom ? l.nom : `liste n° ${i + 1}`;
    for (const c of ["femmesInscrites", "hommesInscrits", "siegesAPourvoir"])
      if (a(l, c) && !estEntierPositif(l[c]))
        dit("listesDeposees", `${nom} · ${c} = ${l[c]}`, "valeur non entière ou négative");
    if (Array.isArray(l && l.candidats)) {
      const s = l.candidats.filter(x => !x || (x.sexe !== "F" && x.sexe !== "H"));
      if (s.length) dit("listesDeposees", `${nom} · ${s.length} candidat(s)`,
        "le sexe de chaque candidat doit être « F » ou « H »");
    }
  });

  /* Cohérences internes : elles ne dépendent d'aucune règle de fond. */
  const ordre = (a1, c1, a2, c2, quoi1, quoi2) => {
    if (estDateISO(a1) && estDateISO(a2) && a2 < a1)
      incoherent(c2, a2, `antérieure à ${quoi1} du ${a1} — ${quoi2} ne peut pas la précéder`);
  };
  ordre(f.dateInformationPersonnel, "dateInformationPersonnel", f.datePremierTour, "datePremierTour",
    "l'information du personnel", "le premier tour");
  if (f.consultation) ordre(f.consultation.dateRemiseInformations, "consultation.dateRemiseInformations",
    f.consultation.dateAvis, "consultation.dateAvis", "la remise des informations", "l'avis du comité");
  if (f.expertise) ordre(f.expertise.dateDepart, "expertise.dateDepart",
    f.expertise.dateSaisine, "expertise.dateSaisine", "le point de départ", "la saisine du juge");
  if (estDateISO(f.dateAudit) && estDateISO(f.dateDernieresElections) && f.dateDernieresElections > f.dateAudit)
    incoherent("dateDernieresElections", f.dateDernieresElections,
      `postérieure à la date d'audit (${f.dateAudit}) : des élections à venir ne peuvent pas être les dernières tenues`);

  if (estEntierPositif(f.titulairesInitiaux) && estEntierPositif(f.titulairesRestants)
      && f.titulairesRestants > f.titulairesInitiaux)
    incoherent("titulairesRestants", f.titulairesRestants,
      `supérieur au nombre de titulaires élus à l'origine (${f.titulairesInitiaux})`);
  if (estEntierPositif(f.effectif) && estEntierPositif(f.nbCadres) && f.nbCadres > f.effectif)
    incoherent("nbCadres", f.nbCadres, `supérieur à l'effectif de l'entreprise (${f.effectif})`);
  if (estEntierPositif(f.reunionsSante) && estEntierPositif(f.reunionsTenues)
      && f.reunionsSante > f.reunionsTenues)
    incoherent("reunionsSante", f.reunionsSante,
      `supérieur au nombre total de réunions tenues (${f.reunionsTenues})`);

  return A;
}

/* Les champs que ce fichier sait examiner. Une fiche qui n'en porte aucun n'est
   pas « recevable » : il n'y a rien à examiner, et le contrôle le dit. */
const CHAMPS_VALIDES = [...DATES, ...ENTIERS, ...MONTANTS,
  "effectifsMensuels", "listesDeposees", "consultation", "expertise", "protocole"];
const examines = f => CHAMPS_VALIDES.filter(c =>
  Object.prototype.hasOwnProperty.call(f || {}, c) && f[c] !== null && f[c] !== "").length;

module.exports = { valider, estDateISO, estEntierPositif, ATTENDU, CHAMPS_VALIDES, examines };
if (require.main === module) {
  const fs = require("fs");
  const f = JSON.parse(fs.readFileSync(process.argv[2] || __dirname + "/fiche-cse.json", "utf8"));
  const A = valider(f);
  console.log(A.length ? A.map(x => `${x.champ} = ${x.valeur} — ${x.motif}`).join("\n") : "aucune anomalie de saisie");
}
