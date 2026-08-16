/* Contre-épreuves du module économique.
   Écrites de l'extérieur, sans connaissance de l'implémentation : chacune
   énonce le comportement attendu, pas celui observé. Elles échouent tant que
   le constat correspondant n'est pas corrigé, et passent ensuite — c'est leur
   seule raison d'être.

   Exécution :  node tests-externes.js
   Sortie non nulle si une contre-épreuve échoue.

   Référence : contre-audit du 15 août 2026, constats F-01 à F-19. */

const M = require("./moteur.js");
const { C } = require("./controles.js");
const ctl = id => C.find(x => x.id === id);
const verdict = (id, f) => { try { return ctl(id).verdict(f); } catch (e) { return { etat: "ERREUR", motif: e.message }; } };

let echecs = 0, total = 0;
function epreuve(ref, intitule, fn) {
  total++;
  let ok = false, detail = "";
  try { const r = fn(); ok = r === true; detail = r === true ? "" : String(r); }
  catch (e) { detail = "exception : " + e.message; }
  if (!ok) echecs++;
  console.log(`${ok ? "  ok  " : "ÉCHEC "} ${ref.padEnd(6)} ${intitule}${ok ? "" : "\n         → " + detail}`);
}

/* ------------------------------------------------------------------ F-01
   Révisée le 16 août 2026. La rédaction initiale visait regimeEco, prise
   isolément, et concluait que le moteur ignorait la règle des trente jours.
   C'était mal viser : la règle est appliquée, mais ailleurs — la fonction
   trenteJours du moteur et la règle PRO-01 de la grille la tiennent
   correctement. Le défaut n'est pas arithmétique, il est de composition ;
   il est décrit en F-19. Seule subsiste ici l'exigence de fond.

   Une deuxième contre-épreuve a été retirée : elle exigeait que huit
   licenciements plus deux refus de modification fassent dix. L'article
   L. 1233-25 ne dit pas cela — il ouvre le régime collectif « lorsqu'au moins
   dix salariés ont refusé la modification d'un élément essentiel de leur
   contrat ». Le seuil de dix refus comme déclencheur autonome, que le moteur
   applique, est la lecture littérale. L'addition réclamée était soutenable
   mais discutée, et une contre-épreuve ne doit pas imposer au moteur une
   lecture incertaine du texte. L'erreur était de l'auteur, pas du moteur. */
epreuve("F-01", "Le régime restitué au client tient compte des licenciements des trente jours antérieurs", () => {
  const f = { effectif: 50, nbLicenciements: 9, licenciementsRecents30j: 1, refusModification: 0 };
  const t = M.trenteJours(f);
  const r = M.regimeEco({ ...f, nbLicenciements: t.total });
  return (t.total === 10 && r.pse === true) ||
    `total recalculé ${t.total}, plan dû sur ce total : ${r.pse}`;
});

/* ------------------------------------------------------------------ F-02 */
epreuve("F-02", "Un refus d'autorisation n'est pas une autorisation", () => {
  const v = verdict("CTL-PRT-01", { salariesProteges: [
    { nom: "A", mandat: "membre du CSE", autorisation: "2026-05-12 — refus de l'inspecteur du travail" }] });
  return v.etat !== "conforme" || `verdict « ${v.etat} » sur un refus : ${v.motif}`;
});
epreuve("F-02", "Une autorisation postérieure à la notification ne vaut pas autorisation", () => {
  const v = verdict("CTL-PRT-01", { dateNotification: "2026-05-16",
    salariesProteges: [{ nom: "B", mandat: "délégué syndical", autorisation: "2026-06-08" }] });
  return v.etat !== "conforme" || `verdict « ${v.etat} » sur une autorisation postérieure de 23 jours`;
});

/* ------------------------------------------------------------------ F-03 */
epreuve("F-03", "Un poste ne peut être à la fois disponible et supprimé", () => {
  const f = { entreprise: "X", postesSupprimes: [{ intitule: "Régleur", avant: 14, apres: 8 }],
    postesDisponibles: [{ societe: "X", intitule: "Régleur", lieu: "Vierzon" }],
    offresFaites: [{ intitule: "Régleur", employeur: "X", salarie: "S1" }] };
  const v = verdict("CTL-REC-07", f);
  return v.etat !== "conforme" || "aucun contrôle ne croise les deux listes";
});

/* ------------------------------------------------------------------ F-04 */
epreuve("F-04", "Un poste unique proposé à cinq salariés ne vaut pas cinq offres", () => {
  const mm = { intitule: "Opérateur", descriptif: "d", employeur: "SŒUR", contrat: "CDI",
    lieu: "Salbris", remuneration: "25 200 €", classification: "N2", dateCertaine: true, delaiReponse: "15 jours" };
  const f = { nbLicenciements: 9, societes: [{ nom: "SŒUR", etranger: false }],
    offresFaites: ["S1","S2","S3","S4","S5"].map(s => ({ ...mm, salarie: s })) };
  const v = verdict("CTL-REC-03", f);
  return v.etat !== "conforme" || "cinq offres portant sur un seul poste sont validées sans réserve";
});

/* ------------------------------------------------------------------ F-05 */
epreuve("F-05", "Un critère d'ordre identique pour tous ne départage personne", () => {
  const cat = n => ({ nom: n, effectif: 9, suppressions: 3, salaries: [
    { nom: n + "1", charges: 0, anciennetePoints: 0, social: 0, qualites: 3 },
    { nom: n + "2", charges: 0, anciennetePoints: 0, social: 0, qualites: 1 }] });
  const v = verdict("CTL-ORD-02", { categories: [cat("A"), cat("B")], salariesProteges: [] });
  return v.etat !== "conforme" || "charges, ancienneté et situation sociale à zéro pour tous : verdict conforme";
});

/* ------------------------------------------------------------------ F-11 */
epreuve("F-11", "Le lundi de Pâques est un jour férié", () => {
  const d = M.ajouteJoursOuvrables("2026-04-01", 5);   /* Pâques 2026 : 5 avril */
  return d === "2026-04-08" || `cinq jours ouvrables depuis le 1er avril donnent ${d}, attendu 2026-04-08`;
});
epreuve("F-11", "L'Ascension est un jour férié", () => {
  const d = M.ajouteJoursOuvrables("2026-05-09", 5);   /* Ascension 2026 : 14 mai */
  return d === "2026-05-16" || `donne ${d}, attendu 2026-05-16`;
});
epreuve("F-11", "Le lundi de Pentecôte est un jour férié", () => {
  const d = M.ajouteJoursOuvrables("2026-05-20", 5);   /* Pentecôte 2026 : 25 mai */
  return d === "2026-05-27" || `donne ${d}, attendu 2026-05-27`;
});

/* ------------------------------------------------------------------ F-12 */
epreuve("F-12", "L'ordre des réunions n'a pas d'influence sur l'expiration du délai", () => {
  const base = { effectif: 200, nbLicenciements: 12, dateInfoCSE: "2026-03-02",
    dateAvisCSE: "avis non rendu", dateNotification: "2026-06-05" };
  const a = verdict("CTL-CSE-04", { ...base, datesReunionsCSE: ["2026-03-16", "2026-03-31"] });
  const b = verdict("CTL-CSE-04", { ...base, datesReunionsCSE: ["2026-03-31", "2026-03-16"] });
  const date = m => (String(m).match(/expire le (\d{4}-\d{2}-\d{2})/) || [])[1] || "?";
  return date(a.motif) === date(b.motif) || `expiration ${date(a.motif)} à l'endroit, ${date(b.motif)} à l'envers`;
});

/* ------------------------------------------------------------------ F-13 */
epreuve("F-13", "La limite territoriale ne s'applique pas avant le 24 septembre 2017", () => {
  const p = M.perimetre({ groupe: true, dateNotification: "2015-06-01",
    societes: [{ nom: "SŒUR ITALIE", etranger: true }] });
  return !(p.exclusions || []).length || `société étrangère exclue sur un dossier de 2015 : ${p.exclusions.join(", ")}`;
});

/* ------------------------------------------------------------------ F-16 */
epreuve("F-16", "Une date impossible ne produit jamais de verdict de conformité", () => {
  const f = { effectif: 60, nbLicenciements: 12, dateNotification: "2026-02-30", dateEntretien: "2026-02-20" };
  const conformes = C.filter(x => { try { return x.verdict(f).etat === "conforme"; } catch (e) { return false; } });
  return !conformes.length || `${conformes.length} conformité(s) sur une date inexistante : ${conformes.map(x => x.id).join(", ")}`;
});
epreuve("F-16", "Un effectif négatif est irrecevable", () => {
  const f = { effectif: -50, nbLicenciements: 12 };
  const rendus = C.filter(x => { try { const e = x.verdict(f).etat; return e === "conforme" || e === "non conforme"; } catch (e) { return false; } });
  return !rendus.length || `${rendus.length} verdict(s) rendus sur un effectif de -50`;
});

/* ------------------------------------------------------------------ F-17 */
epreuve("F-17", "Un néant déclaré se distingue d'une absence de réponse", () => {
  const v = verdict("CTL-EMP-02", { postesSupprimes: [{ intitule: "P", avant: 5, apres: 2 }], precaires: [] });
  return v.etat !== "donnée manquante" || "un tableau vide est traité comme une absence de réponse";
});

/* ------------------------------------------------------------------ F-07/08/09 */
epreuve("F-07", "La cessation d'activité est contrôlée", () => {
  const lit = C.some(x => /cessationComplete/.test(x.verdict.toString()));
  return lit || "aucun contrôle ne lit cessationComplete";
});
epreuve("F-08", "La procédure collective est contrôlée", () => {
  const lit = C.some(x => /procedureCollective/.test(x.verdict.toString()));
  return lit || "aucun contrôle ne lit procedureCollective";
});
epreuve("F-09", "Le transfert d'entité est contrôlé", () => {
  const lit = C.some(x => /transfertEnvisage/.test(x.verdict.toString()));
  return lit || "aucun contrôle ne lit transfertEnvisage";
});

/* ------------------------------------------------------------------ F-10 */
epreuve("F-10", "La reconstitution hors flux intragroupe est vérifiée par le calcul", () => {
  /* Résultat -390, flux déclarés 500, reconstitution annoncée 41 : incohérent. */
  const f = { groupe: true, effectif: 200, nbLicenciements: 12,
    societes: [{ nom: "SŒUR", etranger: false }],
    resultatExploitation: [{ annee: 2025, valeur: -390 }],
    fluxIntragroupe: [{ annee: 2025, total: 500 }],
    resultatHorsFlux: [{ annee: 2025, valeur: 41 }] };
  const v = verdict("CTL-FRA-01", f);
  return /incohér|ne s'accorde|arithmétique/i.test(v.motif || "") ||
    `reconstitution incohérente acceptée : ${(v.motif || "").slice(0, 80)}`;
});

/* ------------------------------------------------------------------ F-18 */
epreuve("F-18", "Le registre voit les champs lus en notation crochets", () => {
  const R = require("./registre.js").construire();
  const sonde = { id: "SONDE", verdict: f => f["champSonde"] ? 1 : 0 };
  const vus = require("./registre.js").construire.length;   /* signature stable */
  /* On ne peut pas injecter dans le registre sans modifier la source :
     l'épreuve porte sur la présence d'un mécanisme d'observation à l'exécution. */
  const fs = require("fs");
  const src = fs.readFileSync(__dirname + "/registre.js", "utf8");
  return /Proxy/.test(src) || "le registre déduit les champs par expression régulière, sans observer les accès";
});

/* ------------------------------------------------------------------ F-19
   Constaté le 16 août 2026. Sur le dossier Sologne, la grille tire deux règles
   qui répondent en sens contraire à la même question, et les imprime toutes
   deux dans le même rapport :
     SOC-08  « Plan de sauvegarde de l'emploi : non dû. »
     PRO-01  « Régime recalculé sur 10 licenciements : 10 licenciements ou plus,
               entreprise d'au moins 50 salariés. »
   Le moteur connaît donc la bonne règle, l'énonce, et laisse la conclusion
   fausse à côté d'elle. Devant un juge, un rapport qui se contredit ne vaut
   rien : il faut une règle de préséance entre règles concurrentes. */
epreuve("F-19", "Deux règles de la grille ne répondent pas en sens contraire à la même question", () => {
  const G = require("./grille-eco.js");
  const R = G.R || G.REGLES || G.regles || G;
  const f = require("./fiche-sologne.json");
  const tirees = [];
  for (const r of R) {
    try { if (r.si && r.si(f)) tirees.push([r.id || "?", String(typeof r.alors === "function" ? r.alors(f) : r.alors)]); }
    catch (e) { /* règle en défaut : hors sujet ici */ }
  }
  const nie = tirees.filter(([, t]) => /plan de sauvegarde de l'emploi\s*:\s*non dû/i.test(t)).map(([i]) => i);
  const affirme = tirees.filter(([, t]) => /10 licenciements ou plus, entreprise d'au moins 50/i.test(t)).map(([i]) => i);
  return !(nie.length && affirme.length) ||
    `${nie.join(",")} écarte le plan de sauvegarde, ${affirme.join(",")} le rend dû, dans le même rapport`;
});

/* ---------------------------------------------------- propriétés à préserver */
epreuve("tenu", "Deux exécutions du même dossier rendent exactement les mêmes verdicts", () => {
  const f = require("./fiche-sologne.json");
  const passe = () => JSON.stringify(C.map(c => {
    try { const v = c.verdict(f); return [c.id, v.etat, v.motif]; } catch (e) { return [c.id, "ERREUR", e.message]; }
  }));
  return passe() === passe() || "les verdicts diffèrent d'une exécution à l'autre";
});
epreuve("tenu", "Aucun contrôle ne dépend de l'heure ni du hasard", () => {
  const fs = require("fs");
  const src = ["moteur.js", "controles.js", "controles2.js"]
    .map(n => fs.readFileSync(__dirname + "/" + n, "utf8")).join("\n");
  const t = src.match(/Date\.now|new Date\(\s*\)|Math\.random/g);
  return !t || `${t.length} recours à l'horloge ou au hasard : ${[...new Set(t)].join(", ")}`;
});

console.log(`\n${total - echecs} contre-épreuve(s) satisfaite(s) sur ${total}.`);
if (echecs) { console.log(`${echecs} en échec — voir le contre-audit du 15 août 2026.`); process.exit(1); }
