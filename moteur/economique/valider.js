/* La validation des entrées.
   Le moteur ne plantait sur rien — ni sur le 30 février, ni sur un effectif
   négatif, ni sur 9,5 licenciements — et rendait des verdicts, dont des
   conformités, sur des données qui ne peuvent pas exister. Robuste n'est pas
   juste : une valeur impossible doit être signalée, non interprétée.
   Ce fichier ne juge rien du droit : il dit seulement si la donnée est lisible. */

const estDateISO = s => {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [a, m, j] = s.split("-").map(Number);
  if (m < 1 || m > 12) return false;
  const dernier = new Date(Date.UTC(a, m, 0)).getUTCDate();
  return j >= 1 && j <= dernier;                     /* le 30 février tombe ici */
};
const estEntierPositif = x => typeof x === "number" && Number.isFinite(x) && Number.isInteger(x) && x >= 0;
const estNombreFini = x => typeof x === "number" && Number.isFinite(x);

/* Ce que chaque champ doit être. Un champ absent n'est pas invalide : il est
   manquant, et les contrôles le disent déjà. */
const ATTENDU = {
  dateAudit: "date", dateEntretien: "date", dateNotification: "date",
  dateInfoCSE: "date", dateAvisCSE: "date ou « avis non rendu »",
  dateNotifAdmin: "date",
  effectif: "entier positif", effectifEtablissement: "entier positif",
  effectifGroupe: "entier positif", nbLicenciements: "entier positif",
  licenciementsRecents30j: "entier positif", refusModification: "entier positif",
  licenciements3moisGlissants: "entier positif", etablissementsDistincts: "entier positif",
  idcc: "quatre chiffres", siren: "neuf chiffres",
  cause: "1, 2, 3 ou 4",
};

function valider(f) {
  const A = [];
  const dit = (champ, valeur, motif) => A.push({ champ, valeur, motif, attendu: ATTENDU[champ] });
  const a = (champ) => Object.prototype.hasOwnProperty.call(f, champ) && f[champ] !== null && f[champ] !== "";

  for (const champ of ["dateAudit", "dateEntretien", "dateNotification", "dateInfoCSE",
                       "dateNotifAdmin"])
    if (a(champ) && !estDateISO(f[champ]))
      dit(champ, f[champ], "date inexistante ou format non reconnu — le format attendu est AAAA-MM-JJ");

  if (a("dateAvisCSE") && !estDateISO(f.dateAvisCSE) && !/non rendu/i.test(String(f.dateAvisCSE)))
    dit("dateAvisCSE", f.dateAvisCSE, "ni date valide, ni mention « avis non rendu »");

  for (const champ of ["effectif", "effectifEtablissement", "effectifGroupe", "nbLicenciements",
                       "licenciementsRecents30j", "refusModification", "licenciements3moisGlissants",
                       "etablissementsDistincts"])
    if (a(champ) && !estEntierPositif(f[champ]))
      dit(champ, f[champ], typeof f[champ] === "number"
        ? (f[champ] < 0 ? "valeur négative" : "valeur décimale, alors qu'il s'agit d'un dénombrement")
        : "valeur non numérique");

  if (a("idcc") && !/^\d{4}$/.test(String(f.idcc)))
    dit("idcc", f.idcc, "un identifiant de convention collective compte quatre chiffres");
  if (a("siren") && !/^\d{9}$/.test(String(f.siren).replace(/\s/g, "")))
    dit("siren", f.siren, "un SIREN compte neuf chiffres");
  if (a("cause") && !["1", "2", "3", "4"].includes(String(f.cause)))
    dit("cause", f.cause, "la cause est l'un des quatre cas de l'article L. 1233-3");

  /* Cohérences internes de dates : elles ne dépendent d'aucune règle de fond. */
  if (estDateISO(f.dateEntretien) && estDateISO(f.dateNotification) && f.dateNotification < f.dateEntretien)
    dit("dateNotification", f.dateNotification, `antérieure à l'entretien préalable du ${f.dateEntretien}`);
  if (Array.isArray(f.datesReunionsCSE)) {
    const mauvaises = f.datesReunionsCSE.filter(d => !estDateISO(d));
    if (mauvaises.length) dit("datesReunionsCSE", mauvaises.join(", "), "date(s) inexistante(s) ou mal formée(s)");
  }
  if (estEntierPositif(f.effectif) && estEntierPositif(f.effectifEtablissement)
      && f.effectifEtablissement > f.effectif)
    dit("effectifEtablissement", f.effectifEtablissement,
        `supérieur à l'effectif de l'entreprise (${f.effectif})`);
  if (estEntierPositif(f.effectif) && estEntierPositif(f.effectifGroupe) && f.effectifGroupe < f.effectif)
    dit("effectifGroupe", f.effectifGroupe,
        `inférieur à l'effectif de l'entreprise (${f.effectif}), alors que celle-ci en fait partie`);
  if (estEntierPositif(f.nbLicenciements) && estEntierPositif(f.effectif) && f.nbLicenciements > f.effectif)
    dit("nbLicenciements", f.nbLicenciements, `supérieur à l'effectif de l'entreprise (${f.effectif})`);

  return A;
}
module.exports = { valider, estDateISO, estEntierPositif, ATTENDU };
