/* Les modèles de régularisation — étape 5 du parcours client.

   Chaque contrôle non conforme ou à vérifier a droit à mieux qu'un rappel de
   texte : une note chiffrée sur le dossier remis — les délais de convocation,
   la périodicité de chaque négociation, le seuil de trois cents salariés, les
   dates réellement déclarées. Rien n'est une coquille générique : quand une
   donnée manque pour calculer, la note le dit et pose un exemple marqué
   « [exemple] », jamais une valeur inventée présentée comme celle du client.

   Chaque fonction reçoit le même dossier `f` que les contrôles et le moteur
   de régime (moteur-nao.js), et rend un classeur de pièces
   (moteur/commun/outils.js) — la même fabrique que le rapport d'audit, pour
   que ce modèle s'imprime exactement comme le reste du module.

   Les seuls textes, délais et thèmes cités sont ceux déjà lus et posés par
   moteur-nao.js et controles-nao.js : ce fichier ne capture aucun article, il
   met en chiffres ce qui l'est déjà. Deux contrôles n'ont pas de modèle —
   NAO-CTL-REG-01 (l'assujettissement, qui ne se régularise pas) et
   NAO-CTL-PEN-01 (l'exposition, qui mesure les autres et ne se régularise pas
   pour elle-même) — comme regularisation-nao.js les laisse à null. */
const O = require("./outils.js");
const D = require("./dates.js");
const M = require("./moteur-nao.js");
const { ITEMS_REMUNERATION, ITEMS_EGALITE } = require("./controles-nao.js");

const q = x => (x !== undefined && x !== null && String(x).trim() !== "" ? String(x).trim() : null);
const nb = x => (typeof x === "number" && isFinite(x) ? x : (x !== undefined && x !== null && x !== "" && isFinite(+x) ? +x : null));
const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";
const ex = v => v + " [exemple]";
const nomE = f => q(f.entreprise) || "l'entreprise auditée";
const jour0 = f => (D.estDateISO(f.dateAudit) ? f.dateAudit : new Date().toISOString().slice(0, 10));
const nego = (f, cle) => (f.negos || {})[cle] || {};

/* Un mois après, en respectant les fins de mois — même règle que les autres
   modules du dépôt. */
function moisApres(iso, n) {
  if (!D.estDateISO(iso)) return null;
  const [a, m, j] = iso.split("-").map(Number);
  const an = a + Math.floor((m - 1 + n) / 12), mo = ((m - 1 + n) % 12) + 1;
  const dernier = new Date(Date.UTC(an, mo, 0)).getUTCDate();
  return `${an}-${String(mo).padStart(2, "0")}-${String(Math.min(j, dernier)).padStart(2, "0")}`;
}
function joursApres(iso, n) {
  if (!D.estDateISO(iso)) return null;
  const [a, m, j] = iso.split("-").map(Number);
  const t = Date.UTC(a, m - 1, j) + n * 86400000;
  return new Date(t).toISOString().slice(0, 10);
}

/* ═══════════════════════════════════════════════════ le régime applicable ═══ */

function modeleReg02(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Le calendrier des négociations — accord de méthode ou régime supplétif — " + nomE(f));
  const r = M.regime(f);
  h1("Le régime, calculé sur ce dossier");
  p(r.motif);
  const acc = f.accordMethode || {};
  if (dit(acc.existe)) {
    const mentions = Array.isArray(acc.mentions) ? acc.mentions : [];
    h1("Les cinq mentions de L. 2242-11, sur ce que le dossier déclare");
    tab(["Mention", "Déclarée"], M.MENTIONS.map(([cle, lib]) => [lib, mentions.includes(cle) ? "présente" : "absente"]));
    const duree = nb(acc.dureeAns);
    p(`Durée déclarée de l'accord : ${duree === null ? "non renseignée" : duree + " an(s)"} — le plafond légal est de quatre ans (L. 2242-11).`);
  }
  if (r.regime === "accord de méthode" && r.periodicites) {
    h1("Les périodicités que cet accord fixe, thème par thème");
    tab(["Négociation", "Périodicité retenue"], Object.values(M.THEMES).map(t => [t.titre, (r.periodicites[t.cle] || 4) + " an(s)"]));
  }
  note("Un accord qui ne porte pas les cinq mentions, dont la durée excède quatre ans, ou qui n'est pas tenu, ne fait pas écran : le régime supplétif de L. 2242-13 reprend sa place sans qu'il soit besoin de le dénoncer.");
  return A.D;
}

/* ═══════════════════════════════════════════════ les quatre périodicités ═══ */

function noteEcheance(f, cle) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  const t = M.THEMES[cle];
  t1(`Calcul de la périodicité — ${t.titre} — ` + nomE(f));
  const e = M.echeances(f).themes[cle];
  if (e.du === false) { A.D.push({ k: "p", t: "Sans objet en l'état de l'effectif déclaré : cette négociation triennale n'est pas due en deçà de trois cents salariés (" + t.fondement + ")." }); return A.D; }
  if (e.du === null) { A.D.push({ k: "p", t: "Donnée manquante pour calculer : l'assujettissement ou le seuil de trois cents salariés n'est pas établi sur ce dossier." }); return A.D; }
  const ans = e.periodiciteMois / 12;
  h1("Le calcul, sur les dates déclarées");
  if (/jamais engagée|inexploitables/.test(e.etat)) {
    const depart = jour0(f);
    const limiteEx = moisApres(depart, e.periodiciteMois);
    p(`Aucune date d'engagement exploitable n'est renseignée pour cette négociation. À titre d'illustration, si elle était engagée à la date de situation du dossier, ${ex(depart)}, le terme de la périodicité de ${ans} an(s) serait le ${ex(limiteEx)}.`);
    note("Si la négociation n'a réellement jamais été engagée, le manquement est déjà constitué : le calcul ci-dessus n'est qu'une illustration du rythme à tenir, non la date qui s'applique à ce dossier.");
    return A.D;
  }
  const limite = moisApres(e.nego.dateEngagement, e.periodiciteMois);
  tab(["Étape", "Date"], [
    ["Dernière négociation engagée", e.nego.dateEngagement],
    [`Terme de la périodicité de ${ans} an(s) (${t.fondement})`, limite],
    ["Situation décrite au", jour0(f)],
  ]);
  p(e.etat === "en retard"
    ? `La périodicité de ${ans} an(s) est dépassée d'environ ${e.retardMois} mois : son terme du ${limite} est déjà passé à la date de situation du dossier (${jour0(f)}).`
    : `La périodicité de ${ans} an(s) est tenue : son terme du ${limite} n'est pas encore atteint à la date de situation du dossier (${jour0(f)}).`);
  return A.D;
}
const modelePer01 = f => noteEcheance(f, "remuneration");
const modelePer02 = f => noteEcheance(f, "egalite");
const modelePer03 = f => noteEcheance(f, "gepp");
const modelePer04 = f => noteEcheance(f, "experimentes");

/* ═══════════════════════════════════════════════════ la demande syndicale ═══ */

function modeleDem01(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Calcul des deux délais de la demande syndicale — L. 2242-13, dernier alinéa — " + nomE(f));
  const d = M.demandeSyndicale(f);
  h1("Le calcul, sur ce dossier");
  if (!d.connue || !d.recue) { p(d.motif); return A.D; }
  const ds = f.demandeSyndicale || {};
  const limiteTransmission = joursApres(ds.date, 8);
  const limiteConvocation = joursApres(ds.date, 15);
  tab(["Étape", "Date", "Délai légal"], [
    ["Demande syndicale reçue", ds.date, "point de départ"],
    ["Terme des huit jours (transmission aux autres organisations)", ds.date ? limiteTransmission : "—", "8 jours"],
    ["Transmission déclarée", q(ds.dateTransmissionAutresOS) || "non renseignée", d.transmission && d.transmission.jours != null ? d.transmission.jours + " jour(s) après la demande" : "—"],
    ["Terme des quinze jours (convocation des parties)", ds.date ? limiteConvocation : "—", "15 jours"],
    ["Convocation déclarée", q(ds.dateConvocation) || "non renseignée", d.convocation && d.convocation.jours != null ? d.convocation.jours + " jour(s) après la demande" : "—"],
  ]);
  const griefs = [];
  if (d.transmission && d.transmission.fait === false) griefs.push("la transmission aux autres organisations n'est pas dans les huit jours");
  if (d.convocation && d.convocation.fait === false) griefs.push("la convocation des parties n'est pas dans les quinze jours");
  if (griefs.length) p("Écart constaté : " + griefs.join(" ; ") + ".");
  note("Se soustraire à la convocation des parties dans ce délai est puni d'un an d'emprisonnement et de 3 750 € d'amende (L. 2243-1) : ces deux délais se comptent en jours, pas en jours ouvrés.");
  return A.D;
}

/* ═══════════════════════════════════════════════════ la loyauté ═══ */

function modeleLoy01(f) {
  const A = O(); const { t1, h1, tab, note } = A;
  t1("Grille des quatre mentions de la première réunion — L. 2242-14 — " + nomE(f));
  const r = f.premiereReunion || {};
  h1("Ce que le dossier déclare");
  tab(["Mention (L. 2242-14)", "État déclaré"], [
    ["Date de la première réunion", q(r.date) || "non renseignée"],
    ["Lieu et calendrier des réunions fixés", dit(r.lieuCalendrierFixes) ? "oui" : nie(r.lieuCalendrierFixes) ? "non" : "non renseigné"],
    ["Informations remises aux négociateurs", dit(r.informationsRemises) ? "oui" : nie(r.informationsRemises) ? "non" : "non renseigné"],
    ["Date de remise de ces informations", q(r.dateRemiseInformations) || "non renseignée"],
  ]);
  note("Ces quatre mentions établissent l'engagement sérieux et loyal de la négociation : leur absence prive un accord sur les salaires effectifs de toute possibilité de dépôt régulier (L. 2242-6).");
  return A.D;
}

function modeleLoy02(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Grille des conditions de dépôt — accord sur les salaires effectifs — L. 2242-6 — " + nomE(f));
  const n = nego(f, "remuneration");
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Issue de la négociation sur les salaires effectifs", q(n.issue) || "non renseignée"],
    ["Procès-verbal d'ouverture des négociations sur les écarts femmes-hommes", dit(n.pvOuvertureEcarts) ? "oui" : nie(n.pvOuvertureEcarts) ? "non" : "non renseigné"],
    ["Réponses motivées apportées aux propositions syndicales", dit(f.reponsesMotivees) ? "oui" : nie(f.reponsesMotivees) ? "non" : "non renseigné"],
  ]);
  if (n.issue === "accord" && (!dit(n.pvOuvertureEcarts) || !dit(f.reponsesMotivees)))
    p("L'accord sur les salaires effectifs ne peut pas être régulièrement déposé tant que ces deux conditions ne sont pas réunies (L. 2242-6) : sans dépôt, la période n'est pas couverte au regard des pénalités.");
  note("« Produire le document » écrit le procès-verbal d'ouverture, prêt à compléter des propositions réellement échangées — jamais devinées par l'application.");
  return A.D;
}

function modeleUni01(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Note de retrait — décision unilatérale pendant négociation — L. 2242-4 — " + nomE(f));
  const d = f.decisionUnilaterale || {};
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Décision unilatérale prise pendant une négociation en cours", dit(d.prise) ? "oui" : nie(d.prise) ? "non" : "non renseigné"],
    ["Matière concernée", q(d.matiere) || "non renseignée"],
    ["Urgence invoquée", dit(d.urgence) ? "oui — à documenter" : nie(d.urgence) ? "non" : "non renseigné"],
  ]);
  if (dit(d.prise) && !dit(d.urgence))
    p("Sans urgence établie, L. 2242-4 interdit cette décision tant que la négociation est en cours dans la matière concernée : elle est annulable, et son maintien nourrit le grief d'entrave.");
  note("Le terme de la négociation ne se décrète pas : elle reste en cours tant qu'aucun procès-verbal de désaccord n'est établi (Soc., 15 avril 2026, n° 24-15.653).");
  return A.D;
}

/* ═══════════════════════════════════════════════════ l'issue ═══ */

function modeleIss01(f) {
  const A = O(); const { t1, h1, tab, note } = A;
  t1("Grille des issues et des dépôts, négociation par négociation — L. 2242-5 — " + nomE(f));
  h1("Ce que le dossier déclare");
  const rows = Object.values(M.THEMES).map(t => {
    const n = nego(f, t.cle);
    return [t.titre, q(n.issue) || "non renseignée", dit(n.depot) ? "oui" : nie(n.depot) ? "non" : "—"];
  });
  tab(["Négociation", "Issue déclarée", "Dépôt déclaré"], rows);
  note("Le procès-verbal de désaccord n'est complet que s'il consigne les propositions respectives des parties en leur dernier état et les mesures que l'employeur entend appliquer unilatéralement (L. 2242-5) ; sans dépôt dans les conditions de D. 2231-2, il ne produit aucun effet (R. 2242-1).");
  return A.D;
}

/* ═══════════════════════════════════════════════════ l'égalité professionnelle ═══ */

function modeleEga01(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Grille du plan d'action annuel — égalité professionnelle — L. 2242-3 — " + nomE(f));
  const n = nego(f, "egalite");
  const pl = n.planAction || {};
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Issue de la négociation sur l'égalité professionnelle", q(n.issue) || "non renseignée"],
    ["Plan d'action existant", dit(pl.existe) ? "oui" : nie(pl.existe) ? "non" : "non renseigné"],
    ["Plan d'action déposé auprès de l'autorité administrative", dit(pl.depot) ? "oui" : nie(pl.depot) ? "non" : "non renseigné"],
  ]);
  if (!dit(pl.existe) || !dit(pl.depot))
    p("Sans accord ni plan d'action déposé, aucune pièce ne couvre l'entreprise au regard de la pénalité de L. 2242-8.");
  note("Sans accord, ce plan est la seule pièce qui couvre l'entreprise : sa rédaction ne se contente pas d'énoncer des objectifs, elle en chiffre le coût, condition que L. 2242-3 pose expressément.");
  return A.D;
}

function modeleEga02(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Calcul de la couverture et de la publication de l'index — L. 2242-8 — " + nomE(f));
  const eff = nb(f.effectif);
  const n = nego(f, "egalite");
  const couvert = n.issue === "accord" || dit((n.planAction || {}).existe);
  h1("Le calcul, sur ce dossier");
  tab(["Point", "Valeur"], [
    ["Effectif déclaré", eff === null ? "non renseigné" : eff + " salarié(s)"],
    ["Seuil de cinquante salariés (L. 2242-8)", eff === null ? "non apprécié faute d'effectif" : (eff >= 50 ? "atteint" : "non atteint — sans objet")],
    ["Couverture par un accord ou un plan d'action", couvert ? "oui" : "non établie en l'état"],
    ["Index de L. 1142-8 publié", dit(f.indexEgalitePublie) ? "oui" : nie(f.indexEgalitePublie) ? "non" : "non renseigné"],
  ]);
  if (eff !== null && eff >= 50 && (!couvert || !dit(f.indexEgalitePublie)))
    p("La pénalité de L. 2242-8 va jusqu'à 1 % des rémunérations versées au titre des périodes non couvertes : la couverture et la publication de l'index sont deux manquements distincts, qui s'apprécient séparément.");
  note("Le montant de la pénalité est fixé par l'administration selon les efforts constatés : cette note dit l'exposition sur ce dossier, jamais un chiffrage.");
  return A.D;
}

/* ═══════════════════════════════════════════════════ le contenu des négociations ═══ */

function noteContenu(f, cle, items, fondement, titre) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1(`Grille du contenu — ${titre} — ${fondement} — ` + nomE(f));
  const n = nego(f, cle);
  h1("Ce que le dossier déclare");
  const traites = Array.isArray(n.themesTraites) ? n.themesTraites : [];
  tab([`Thème (${fondement})`, "Rattaché à la négociation"],
    items.map(([marque, lib]) => [lib, traites.includes(marque) ? "oui" : "non déclaré"]));
  const absents = items.filter(([marque]) => !traites.includes(marque));
  if (absents.length)
    p(`${absents.length} thème(s) sur ${items.length} ne sont pas rattachés à la négociation : un thème légal laissé hors de la table doit l'être en connaissance de cause, et se répare en l'inscrivant à l'ordre du jour d'une réunion complémentaire.`);
  note("L'obligation porte sur la négociation de chaque thème, non sur sa conclusion : un thème abordé et resté sans accord n'est pas un manquement pour autant.");
  return A.D;
}
const modeleCon01 = f => noteContenu(f, "remuneration", ITEMS_REMUNERATION, "L. 2242-15", "rémunération, temps de travail et partage de la valeur ajoutée");
const modeleCon02 = f => noteContenu(f, "egalite", ITEMS_EGALITE, "L. 2242-17", "égalité professionnelle et qualité de vie et des conditions de travail");

function modeleCon03(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Note d'appui sur la base de données — négociation égalité — L. 2242-17, 2° — " + nomE(f));
  const n = nego(f, "egalite");
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Négociation égalité engagée", q(n.dateEngagement) || "non renseignée"],
    ["Appui sur les données de la base de données économiques, sociales et environnementales", dit(n.appuiBDESE) ? "oui" : nie(n.appuiBDESE) ? "non" : "non renseigné"],
  ]);
  if (nie(n.appuiBDESE))
    p("Des négociateurs privés du diagnostic comparé femmes-hommes de la base ne négocient pas en connaissance de cause : c'est un grief de loyauté autant que de contenu. Le module « base de données (BDESE) » de cette application audite la tenue de cette base pour elle-même.");
  note("L. 2242-17, 2° impose que cette négociation s'appuie sur les données mentionnées au 2° de l'article L. 2312-36.");
  return A.D;
}

const MODELES = {
  "NAO-CTL-REG-02": modeleReg02,
  "NAO-CTL-PER-01": modelePer01,
  "NAO-CTL-PER-02": modelePer02,
  "NAO-CTL-PER-03": modelePer03,
  "NAO-CTL-PER-04": modelePer04,
  "NAO-CTL-DEM-01": modeleDem01,
  "NAO-CTL-LOY-01": modeleLoy01,
  "NAO-CTL-LOY-02": modeleLoy02,
  "NAO-CTL-UNI-01": modeleUni01,
  "NAO-CTL-ISS-01": modeleIss01,
  "NAO-CTL-EGA-01": modeleEga01,
  "NAO-CTL-EGA-02": modeleEga02,
  "NAO-CTL-CON-01": modeleCon01,
  "NAO-CTL-CON-02": modeleCon02,
  "NAO-CTL-CON-03": modeleCon03,
};

module.exports = { MODELES };
