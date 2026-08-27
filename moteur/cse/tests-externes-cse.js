/* Contre-épreuves du module CSE.
   Même principe que celles du module économique : chacune énonce le
   comportement attendu, échoue tant que le constat n'est pas corrigé, et
   passe ensuite.

   Exécution :  node tests-externes-cse.js
   Sortie non nulle si une contre-épreuve échoue.

   Référence : contre-audit du module CSE, 15 août 2026, constats C-01 à C-08. */

const fs = require("fs");
const M = require("./moteur-cse.js");
const { C } = require("./controles-cse.js");
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

/* Dossier de référence : effectif déclaré à 299, relevés mensuels tous
   au-dessus de 312. Les deux sont versés au même dossier. */
const CONTRADICTOIRE = {
  effectif: 299,
  effectifsMensuels: [313, 314, 312, 316, 315, 313, 317, 314, 312, 315, 316, 314, 313, 315],
  cssct: false, membresCssct: [], reunionsTenues: 6, reunionsSante: 4,
  pieces: ["etats-effectifs"],
};

/* ------------------------------------------------------------------ C-01 */
epreuve("C-01", "L'effectif déclaré est confronté aux relevés mensuels versés", () => {
  const incoherence = C.some(x => {
    const s = x.verdict.toString();
    return /effectifsMensuels/.test(s) && /\.effectif\b/.test(s);
  });
  return incoherence || "aucun contrôle ne lit à la fois l'effectif déclaré et la série mensuelle";
});
epreuve("C-01", "La commission santé-sécurité n'est pas écartée sur un effectif démenti par le dossier", () => {
  const v = verdict("CSE-CTL-SST-01", CONTRADICTOIRE);
  return v.etat !== "sans objet" ||
    "commission déclarée non obligatoire alors que les quatorze relevés mensuels dépassent trois cents";
});
epreuve("C-01", "Le nombre de réunions n'est pas validé sur un effectif démenti par le dossier", () => {
  const v = verdict("CSE-CTL-CON-05", CONTRADICTOIRE);
  return v.etat !== "conforme" ||
    "six réunions validées alors que douze sont dues au-delà de trois cents salariés";
});

/* ------------------------------------------------------------------ C-02 */
epreuve("C-02", "Un premier tour antérieur à l'information du personnel est irrecevable", () => {
  const v = verdict("CSE-CTL-ELE-02", { dateInformationPersonnel: "2026-06-25", datePremierTour: "2026-03-02" });
  return v.etat !== "conforme" || `verdict « ${v.etat} » : ${(v.motif || "").slice(0, 70)}`;
});
epreuve("C-02", "Un avis rendu avant la remise des informations est irrecevable", () => {
  const v = verdict("CSE-CTL-CON-02", { consultation: {
    dateRemiseInformations: "2026-07-01", dateAvis: "2026-05-04", expertise: false } });
  return v.etat !== "conforme" || `verdict « ${v.etat} » : ${(v.motif || "").slice(0, 70)}`;
});

/* ------------------------------------------------------------------ C-03 */
/* Ces deux épreuves reprochaient au dépôt d'avoir tronqué L. 2314-33 et
   d'ignorer la limite de trois mandats successifs. Vérification faite à la
   source, par le relais Légifrance, le 27 août 2026, sur trois lectures
   concordantes : le dépôt porte LEGIARTI000052437191, 334 caractères, et cette
   version NE COMPORTE PLUS la limite de mandats. Celle-ci figurait dans la
   version précédente, LEGIARTI000036761951, 1 189 caractères, en vigueur
   jusqu'en octobre 2025 — c'est elle que le contre-audit lisait. Le texte
   moissonné n'était donc pas tronqué : il était à jour.

   Ce qui reste à garantir n'est pas le contenu d'un état du droit, qui change,
   mais l'accord entre le texte moissonné et ce que le moteur en fait. C'est ce
   que ces deux épreuves vérifient désormais — et elles échoueront d'elles-mêmes
   si la limite revient au texte sans revenir au moteur. */
epreuve("C-03", "L'article L. 2314-33 est moissonné entier, non coupé en route", () => {
  const T = JSON.parse(fs.readFileSync(__dirname + "/textes_cse.json", "utf8"));
  const a = T["L2314-33"] || {}, t = a.texte || "";
  if (!a.id) return "aucun identifiant de version : impossible de dire quelle version a été lue";
  if (!/^Les membres de la délégation du personnel/.test(t))
    return `le texte ne commence pas par l'alinéa 1er : « ${t.slice(0, 60)} »`;
  return /\.$/.test(t.trim()) ||
    `texte de ${t.length} caractères s'achevant sans point — coupé : « …${t.slice(-60)} »`;
});
epreuve("C-03", "La limite de mandats successifs est exploitée si, et seulement si, le texte la porte", () => {
  const T = JSON.parse(fs.readFileSync(__dirname + "/textes_cse.json", "utf8"));
  const porte = /mandats successifs/.test((T["L2314-33"] || {}).texte || "");
  const s = C.map(x => x.verdict.toString()).join(" ") + M.mandat.toString();
  const exploite = /mandatsSuccessifs|nombreMandats|mandats successifs/.test(s);
  if (porte === exploite) return true;
  return porte
    ? "le texte moissonné porte la limite de mandats, mais ni le moteur ni les contrôles ne la connaissent"
    : "le moteur oppose une limite de mandats que le texte moissonné ne porte pas";
});

/* ------------------------------------------------------------------ C-04 */
epreuve("C-04", "La garantie de non-divergence observe les accès plutôt que de les deviner", () => {
  const q = fs.readFileSync(__dirname + "/questionnaire-cse.js", "utf8");
  return /Proxy/.test(q) ||
    "les champs lus sont déduits par expression régulière : f[\"nom\"] et la déstructuration lui échappent";
});

/* ------------------------------------------------------------------ C-05 */
epreuve("C-05", "L'alinéa 4 de L. 2314-30 s'ouvre sur les sièges à pourvoir, non sur les candidats", () => {
  /* Cinq candidats pour six sièges, stricte égalité : les sièges sont pairs,
     l'alinéa 4 ne doit pas s'appliquer. */
  const r = M.listeParitaire({ candidats: 5, sieges: 6, femmes: 40, hommes: 40 });
  return r.indifferent !== true ||
    "composition déclarée indifférente alors que les sièges à pourvoir sont en nombre pair";
});
epreuve("C-05", "Le nombre de sièges est recueilli par le contrôle des listes", () => {
  const s = ctl("CSE-CTL-ELE-05").verdict.toString();
  return /sieges/.test(s) || "le contrôle ne transmet jamais le nombre de sièges au calcul de parité";
});

/* ------------------------------------------------------------------ C-06 */
epreuve("C-06", "Un néant déclaré se distingue d'une absence de réponse", () => {
  const v = verdict("CSE-CTL-DET-02", { contentieuxCse: [] });
  return v.etat !== "donnée manquante" || "un tableau vide est traité comme une absence de réponse";
});

/* ------------------------------------------------------------------ C-07 */
epreuve("C-07", "Une date impossible ne produit jamais de verdict de conformité", () => {
  const f = { effectif: 299, dateDernieresElections: "2023-02-30", dateAudit: "2026-08-15" };
  const conformes = C.filter(x => { try { return x.verdict(f).etat === "conforme"; } catch (e) { return false; } });
  return !conformes.length ||
    `${conformes.length} conformité(s) sur une date inexistante : ${conformes.map(x => x.id).join(", ")}`;
});
/* Même correction que F-16 du module économique : ce qui est interdit, c'est
   de CONCLURE d'une donnée impossible. Le contrôle de recevabilité, lui, ne
   conclut pas d'elle — il la dénonce, et c'est son « non conforme » qui bloque
   le rapport. L'épreuve le comptait comme un verdict de trop et échouait sur
   le comportement même qu'elle demande. */
epreuve("C-07", "Un effectif décimal est irrecevable", () => {
  const f = { effectif: 299.6, heuresAccordees: 242, titulairesElus: 11 };
  const rendus = C.filter(x => x.id !== "CSE-CTL-REC-01")
    .filter(x => { try { const e = x.verdict(f).etat; return e === "conforme" || e === "non conforme"; } catch (e) { return false; } });
  if (rendus.length)
    return `${rendus.length} verdict(s) rendus sur un effectif de 299,6 : ${rendus.map(x => x.id).join(", ")}`;
  const rec = verdict("CSE-CTL-REC-01", f);
  return rec.etat === "non conforme"
    || `le contrôle de recevabilité ne dénonce pas l'effectif décimal : ${rec.etat}`;
});

/* ------------------------------------------------------------------ C-08 */
epreuve("C-08", "Un article cité dont le texte est vide fait échouer le chargement", () => {
  const T = JSON.parse(fs.readFileSync(__dirname + "/textes_cse.json", "utf8"));
  const vides = Object.entries(T).filter(([k, v]) => !v || !v.texte).map(([k]) => k);
  const src = fs.readFileSync(__dirname + "/grille-cse.js", "utf8");
  const garde = /\.texte\b[^\n]*(throw|Error)/.test(src) || /texte manquant|article vide/i.test(src);
  return garde || `${vides.length} entrées sans texte, et le chargement ne vérifie que la présence de la clé`;
});

/* ---------------------------------------------------- propriétés à préserver
   Celles-ci passent aujourd'hui. Elles figurent ici pour qu'une correction
   ultérieure ne les casse pas sans qu'on le sache. */
epreuve("tenu", "Le tableau de R. 2314-1 reste conforme au texte moissonné", () => {
  const T = JSON.parse(fs.readFileSync(__dirname + "/textes_cse.json", "utf8"));
  const t = T["R2314-1"].texte;
  const lignes = [...t.matchAll(/(\d+)\s*à\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/g)]
    .map(m => m.slice(1, 5).map(Number));
  const ecarts = lignes.filter((l, i) => JSON.stringify(M.R2314_1[i].slice(0, 4)) !== JSON.stringify(l));
  return !ecarts.length || `${ecarts.length} ligne(s) divergent du texte officiel`;
});
epreuve("tenu", "Le seuil de douze mois consécutifs se remet à zéro sur une interruption", () => {
  const s = M.seuilAtteint([11,11,10,11,11,11,11,11,11,11,11,11,11], 11);
  return s.atteint === false || "une interruption ne remet pas le compteur à zéro";
});
epreuve("tenu", "L'alternance irrégulière est refusée même à proportion exacte", () => {
  const v = verdict("CSE-CTL-ELE-05", { listesDeposees: [{ nom: "c1",
    femmesInscrites: 60, hommesInscrits: 40,
    candidats: [{sexe:"F"},{sexe:"F"},{sexe:"F"},{sexe:"H"},{sexe:"H"}] }] });
  return v.etat === "non conforme" || `ordre F·F·F·H·H accepté : ${v.etat}`;
});
epreuve("tenu", "L'arrondi impossible de L. 2314-30 est signalé, jamais tranché", () => {
  const r = M.listeParitaire({ candidats: 2, sieges: 2, femmes: 1, hommes: 3 });
  return r.conflit === true || "le cas indéterminé n'est plus signalé";
});

console.log(`\n${total - echecs} contre-épreuve(s) satisfaite(s) sur ${total}.`);
if (echecs) { console.log(`${echecs} en échec — voir le contre-audit du module CSE, 15 août 2026.`); process.exit(1); }
