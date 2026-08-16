/* Le questionnaire vierge du comité social et économique.
   La colonne « contrôle attendu » n'est pas écrite à la main : elle est déduite
   du code des contrôles, en cherchant quels champs chaque contrôle interroge.
   Questionnaire et registre ne peuvent donc pas diverger. */
const fs = require("fs");
const O = require("./outils.js");
const { C, DETECTION } = require("./controles-cse.js");
const ACT = require("./actions-cse.js");
const GRILLE = require("./grille-cse.js");
const T = JSON.parse(fs.readFileSync(__dirname + "/textes_cse.json", "utf8"));
const SRC = fs.readFileSync(__dirname + "/controles-cse.js", "utf8");

/* Quels contrôles lisent ce champ ?  On lit la source, pas une liste
   tenue à la main. Un contrôle qui passe la fiche entière au moteur — M.cssct(f) —
   lit indirectement les champs que cette fonction du moteur lit : il faut donc
   résoudre le moteur aussi, sans quoi le questionnaire se croit incomplet. */
const MSRC = fs.readFileSync(__dirname + "/moteur-cse.js", "utf8");
/* champs lus par chaque fonction du moteur */
const CHAMPS_MOTEUR = {};
for (const m of MSRC.matchAll(/function (\w+)\(([^)]*)\)\s*\{/g)) {
  const nom = m[1];
  const debut = m.index;
  /* le corps s'arrête à la prochaine déclaration de premier niveau */
  const suite = MSRC.slice(debut).split(/\n(?=function |const [A-Za-z_]+ = |module\.exports)/)[0];
  CHAMPS_MOTEUR[nom] = [...new Set([...suite.matchAll(/\b(?:o|f)\.(\w+)/g)].map(x => x[1])
    .concat([...suite.matchAll(/const \{ ([^}]+) \} = o/g)].flatMap(x => x[1].split(",").map(y => y.trim()))))];
}
/* les fonctions fléchées du moteur, qui reçoivent aussi la fiche */
for (const m of MSRC.matchAll(/const (\w+) = (?:o|e|f) =>([^;]+);/g))
  CHAMPS_MOTEUR[m[1]] = [...new Set([...m[2].matchAll(/\b(?:o|f)\.(\w+)/g)].map(x => x[1]))];

function corpsDe(id) {
  const bloc = SRC.split(`c("${id}"`)[1];
  return bloc ? bloc.split("\nc(")[0] : "";
}

/* L'inspection du code ne voit que ce qui est écrit « f.nom ». Elle est
   aveugle à f["nom"] et à const {nom} = f — deux écritures parfaitement
   valables. La sonde, elle, observe l'exécution : elle enveloppe la fiche dans
   un Proxy et enregistre chaque accès, quelle que soit la notation. Elle ne
   voit en revanche que le chemin parcouru par les fiches d'épreuve. Les deux
   mesures sont donc réunies : l'une rattrape ce que l'autre manque. */
const SONDE = require("./sonde.js");
const LUS_SONDE = SONDE.champsLus(C);

function controlesDe(champ) {
  const out = [];
  for (const ctl of C) {
    if ((LUS_SONDE[ctl.id] || []).includes(champ)) { out.push(ctl.id); continue; }
    const corps = corpsDe(ctl.id);
    if (!corps) continue;
    const motifs = [new RegExp(`f\\.${champ}\\b`), new RegExp(`"${champ}"`)];
    /* Les pièces sont lues par l'auxiliaire piece(f, "..."), où le champ
       « pieces » n'apparaît pas littéralement : on le reconnaît en propre. */
    if (champ === "pieces") motifs.push(/piece\(f,/);
    let vu = motifs.some(m => m.test(corps));
    /* lecture indirecte : le contrôle passe la fiche entière à une fonction du moteur */
    if (!vu) for (const m of corps.matchAll(/M\.(\w+)\(\s*f\s*[,)]/g))
      if ((CHAMPS_MOTEUR[m[1]] || []).includes(champ)) { vu = true; break; }
    if (vu) out.push(ctl.id);
  }
  return out;
}

/* Tous les champs que les contrôles lisent, quelle qu'en soit l'écriture :
   ce que la sonde a vu passer, et ce que le code écrit littéralement. */
function champsLusParLesControles() {
  const s = new Set();
  for (const ctl of C) {
    for (const ch of LUS_SONDE[ctl.id] || []) s.add(ch);
    const corps = corpsDe(ctl.id);
    for (const m of corps.matchAll(/\bf\.([a-zA-Z_][a-zA-Z0-9_]*)/g)) s.add(m[1]);
    for (const m of corps.matchAll(/M\.(\w+)\(\s*f\s*[,)]/g))
      for (const ch of CHAMPS_MOTEUR[m[1]] || []) s.add(ch);
    if (/piece\(f,/.test(corps)) s.add("pieces");
  }
  return s;
}

const A = O(); const { sur, t1, trait, h1, h2, h3, p, note, puce, enc, tab } = A;
const LIGNES = [];
const q = (rubrique, champ, libelle, format, piece) => LIGNES.push({ rubrique, champ, libelle, format, piece });

q("Identité", "entreprise", "Dénomination sociale et numéro SIREN", "texte", "extrait Kbis");
q("Identité", "dateAudit", "Date à laquelle la situation est décrite", "AAAA-MM-JJ", "—");
q("Effectifs", "effectif", "Effectif de l'entreprise au sens de l'article L. 1111-2", "nombre", "registre du personnel");
q("Effectifs", "effectifsMensuels", "Effectif mois par mois sur les quatorze derniers mois", "liste de nombres", "états d'effectif ou déclarations sociales nominatives");
q("Effectifs", "nbCadres", "Nombre d'ingénieurs, chefs de service et cadres assimilés", "nombre", "organigramme");
q("Effectifs", "masseSalariale", "Masse salariale brute de l'exercice, assiette de l'article L. 2312-83", "euros", "déclarations sociales nominatives");
q("Effectifs", "masseSalarialeN1", "Masse salariale brute de l'exercice précédent", "euros", "déclarations sociales nominatives");
q("Périmètre", "etablissementsMultiples", "L'entreprise comporte-t-elle plusieurs établissements distincts ?", "oui / non", "—");
q("Périmètre", "sourceDecoupage", "Source du découpage : accord, décision unilatérale, décision administrative", "texte", "accord ou décision, daté");
q("Périmètre", "ues", "L'entreprise fait-elle partie d'une unité économique et sociale ?", "oui / non", "accord ou décision de justice");
q("Périmètre", "representantsProximite", "Des représentants de proximité sont-ils en place ?", "oui / non", "accord d'entreprise les instituant");
q("Comité", "comiteExistant", "Un comité social et économique est-il en place ?", "oui / non", "procès-verbal des élections ou de carence");
q("Comité", "dateDernieresElections", "Date du premier tour des dernières élections", "AAAA-MM-JJ", "procès-verbal");
q("Comité", "dureeAccord", "Durée conventionnelle des mandats, si un accord en fixe une", "nombre d'années", "accord de branche, de groupe ou d'entreprise");
q("Comité", "titulairesElus", "Nombre de titulaires effectivement élus", "nombre", "procès-verbal");
q("Comité", "titulairesInitiaux", "Nombre de titulaires élus à l'origine", "nombre", "procès-verbal");
q("Comité", "titulairesRestants", "Nombre de titulaires encore en fonction", "nombre", "—");
q("Comité", "collegeVide", "Un collège électoral n'est-il plus représenté au comité ?", "oui / non", "procès-verbal et registre des départs");
q("Comité", "moisAvantTerme", "Nombre de mois restant à courir jusqu'au terme des mandats", "nombre de mois", "procès-verbal des dernières élections");
q("Comité", "partiellesOrganisees", "Des élections partielles ont-elles été organisées ?", "oui / non", "procès-verbal");
q("Élections", "electionsEnCours", "Un processus électoral est-il en cours ?", "oui / non", "—");
q("Élections", "dateInformationPersonnel", "Date de l'information du personnel sur l'organisation des élections", "AAAA-MM-JJ", "note d'information, à date certaine");
q("Élections", "datePremierTour", "Date envisagée ou tenue du premier tour", "AAAA-MM-JJ", "protocole ou note d'information");
q("Élections", "syndicatsInvites", "Organisations syndicales invitées à négocier le protocole", "liste", "preuves d'envoi des invitations");
q("Élections", "protocole", "Protocole : nombre de signataires, de participants, part des suffrages, mention de la proportion femmes-hommes", "objet", "protocole signé");
q("Élections", "listesDeposees", "Pour chaque liste : inscrits femmes et hommes du collège, nombre de sièges à pourvoir dans ce collège, et sexe de chaque candidat dans l'ordre de dépôt", "liste d'objets", "listes déposées, liste électorale et protocole");
q("Élections", "voteElectronique", "Le vote électronique est-il utilisé ?", "oui / non", "accord ou décision unilatérale, cahier des charges");
q("Consultations", "consultationsRecurrentes", "Consultations récurrentes conduites sur l'exercice", "liste d'objets", "ordres du jour et procès-verbaux");
q("Consultations", "consultation", "Pour la consultation en cours : date de remise des informations, date de l'avis, existence d'une expertise", "objet", "preuve de remise, datée");
q("Consultations", "instanceConsultee", "Instance consultée : centrale, d'établissement, ou les deux", "texte", "convocations");
q("Consultations", "mesuresAdaptation", "Le projet comporte-t-il des mesures d'adaptation spécifiques à un ou plusieurs établissements ?", "oui / non", "note de présentation du projet");
q("Fonctionnement", "reunionsTenues", "Nombre de réunions du comité tenues sur l'année", "nombre", "convocations et procès-verbaux");
q("Fonctionnement", "reunionsSante", "Nombre de réunions ayant porté, en tout ou partie, sur la santé et la sécurité", "nombre", "ordres du jour");
q("Fonctionnement", "accordPeriodicite", "Un accord fixe-t-il la périodicité des consultations et le nombre de réunions ?", "oui / non", "accord d'entreprise");
q("Fonctionnement", "reunionsAccord", "Nombre de réunions annuelles prévu par cet accord", "nombre", "accord d'entreprise");
q("Fonctionnement", "heuresAccordees", "Volume mensuel total d'heures de délégation accordé", "nombre", "protocole ou accord");
q("Fonctionnement", "heuresRetenues", "Des heures de délégation ont-elles été retenues sur la paie ?", "oui / non", "bulletins de paie");
q("Fonctionnement", "formationsDispensees", "Formations dispensées aux élus", "liste", "attestations de formation");
q("Santé et sécurité", "cssct", "Une commission santé, sécurité et conditions de travail est-elle en place ?", "oui / non", "accord ou résolution de désignation");
q("Santé et sécurité", "seveso", "L'établissement relève-t-il des articles L. 4521-1 et suivants ?", "oui / non", "arrêté de classement");
q("Santé et sécurité", "membresCssct", "Membres de la commission, avec le collège de chacun", "liste d'objets", "résolution de désignation");
q("Budgets", "subventionVersee", "Subvention de fonctionnement versée sur l'exercice", "euros", "justificatifs de versement");
q("Budgets", "ascAnneeN", "Contribution aux activités sociales et culturelles de l'exercice", "euros", "justificatifs de versement");
q("Budgets", "ascAnneeN1", "Même contribution, exercice précédent", "euros", "justificatifs de versement");
q("Budgets", "ancienneteASC", "L'accès aux activités sociales est-il subordonné à une condition d'ancienneté ?", "oui / non", "règlement des activités sociales");
q("Expertises", "expertise", "Expertise en cours : cas de recours, part employeur, date du point de départ, date de saisine du juge", "objet", "délibération, cahier des charges");
q("Expertises", "nbLicenciements", "Nombre de licenciements économiques envisagés sur trente jours", "nombre", "projet de licenciement");
q("Normes", "accordsCse", "Accords collectifs applicables au comité", "liste", "accords versés en intégralité");
q("Normes", "contentieuxCse", "Contentieux ou procédure en cours concernant le comité", "texte", "actes de procédure");
q("Normes", "faitsEntrave", "Faits susceptibles de caractériser une entrave", "texte", "—");
q("Pièces", "pieces", "Identifiants des pièces effectivement versées", "liste", "les pièces elles-mêmes");

sur("Questionnaire d'audit · comité social et économique");
t1("Questionnaire à remplir par l'employeur");
sur(`${LIGNES.length} données · ${C.length} contrôles · ${GRILLE.length} règles · ${Object.values(T).filter(v => v && v.texte).length} articles lus à la source le 15 août 2026`);
trait();

enc("Avant de commencer — ce que ce questionnaire produit, et ce qu'il ne produit pas",
 "Les réponses alimentent des contrôles, et chaque contrôle rend l'un de cinq états : conforme, non conforme, risque à vérifier, donnée manquante, sans objet. Une donnée non renseignée ne produit jamais « conforme » : elle produit « donnée manquante », et le rapport le dit. Une déclaration non justifiée par une pièce ne produit jamais « conforme » non plus : elle produit « risque à vérifier ». C'est la seule façon d'obtenir un résultat qui ne mente pas.");
enc("Convention collective et accords d'entreprise",
 "Le résultat est établi sur la seule loi tant que vos textes conventionnels ne sont pas joints. Or un accord d'entreprise peut légalement modifier le nombre de membres du comité, le volume des heures de délégation, la durée des mandats, la périodicité et le contenu des consultations, le nombre de réunions et le niveau auquel les consultations sont conduites. Joignez la convention collective applicable, ou à défaut son numéro IDCC, et l'intégralité des accords d'entreprise portant sur le comité. Tant qu'ils ne le sont pas, le rapport porte la réserve correspondante.");
enc("Fraîcheur des textes",
 "Les articles ont été lus sur Légifrance le 15 août 2026 et les arrêts arrêtés au 8 juillet 2026. Trois questions restent posées à chaque audit, parce que l'application ne peut pas y répondre seule : la version de la convention collective que vous appliquez est-elle bien la dernière publiée ; des avenants ou accords ont-ils été signés sans être encore publiés ; des usages ou engagements unilatéraux plus favorables existent-ils dans l'entreprise ? Ils ne figurent dans aucune base publique et priment s'ils sont plus favorables.");

h1("Les données à renseigner");
p("Colonne « contrôle attendu » : les contrôles que cette donnée alimente. Elle n'a pas été écrite à la main — elle est déduite du code des contrôles, ce qui interdit au questionnaire et au registre de diverger.");
const RUBS = [...new Set(LIGNES.map(l => l.rubrique))];
let sansControle = [];
for (const rub of RUBS) {
  h3(rub);
  const l = LIGNES.filter(x => x.rubrique === rub);
  tab(["Donnée", "Ce qu'il faut renseigner", "Format", "Pièce à joindre", "Contrôle attendu"],
    l.map(x => { const ctl = controlesDe(x.champ);
      if (!ctl.length) sansControle.push(x.champ);
      return [x.champ, x.libelle, x.format, x.piece, ctl.length ? ctl.join(", ") : "aucun — donnée de contexte, reprise telle quelle dans le rapport"]; }));
}

h1("Annexe · Registre des contrôles");
p("Les trente-cinq contrôles exécutés, leur objet, leur fondement et leur portée. Un contrôle marqué « détection » ne conclut jamais à la conformité : il signale une situation qui appelle un examen extérieur à l'application.");
tab(["Contrôle", "Rubrique", "Objet", "Priorité", "Fondement", "Type"],
  C.map(x => [x.id, x.rubrique, x.objet, ACT.gr(x.id), (x.fondement || []).join(" · ") || "—",
    DETECTION.has(x.id) ? "détection" : "conformité"]));

h1("Annexe · Ce que commande chaque résultat");
tab(["Résultat", "Ce qu'il veut dire", "Ce que vous devez en faire"], [
 ["BLOQUÉ", "Un texte s'oppose à la poursuite.", "Corriger avant tout acte suivant."],
 ["RISQUE ÉLEVÉ", "Rien n'interdit de poursuivre, mais un point expose à l'annulation ou à la sanction.", "Traiter avant de décider."],
 ["À COMPLÉTER", "Le dossier n'est pas assez renseigné pour conclure.", "Produire les pièces, puis relancer l'audit."],
 ["CONFORME AU VU DES PIÈCES", "Aucun écart sur les points contrôlés, compte tenu des pièces versées.", "Ce n'est pas une validation juridique."],
 ["REVUE PROFESSIONNELLE OBLIGATOIRE", "La situation comporte un élément que l'application ne sait pas trancher seule.", "Faire relire le dossier par un professionnel."]]);

/* Vérification de non-divergence, dans les deux sens.

   Premier sens : tout contrôle doit être atteint par au moins une donnée du
   questionnaire, sinon une exigence serait contrôlée sans être demandée.

   Second sens, qui manquait : tout champ qu'un contrôle lit doit être demandé,
   sinon le contrôle interroge une donnée que personne ne peut renseigner et
   conclut sur du vide. C'est le sens qui se dégrade en silence, parce qu'il ne
   se voit sur aucune page — il fallait le mesurer. Les champs de contexte
   déclarés ci-dessous en sont exclus, et cette liste est courte à dessein.

   Les deux sens font échouer la génération : une garantie qui se contente
   d'imprimer un avertissement ne garantit rien. */
const CONTEXTE = new Set([
  "entreprise",   /* intitulé repris dans le rapport, aucun contrôle ne le lit */
  "ues",          /* déclenche la mention de revue professionnelle, non un contrôle */
]);
const atteints = new Set(LIGNES.flatMap(l => controlesDe(l.champ)));
const orphelins = C.filter(x => !atteints.has(x.id)).map(x => x.id);
const demandes = new Set(LIGNES.map(l => l.champ));
const nonDemandes = [...champsLusParLesControles()]
  .filter(ch => !demandes.has(ch) && !CONTEXTE.has(ch)).sort();
const contexteInutile = [...CONTEXTE].filter(ch => controlesDe(ch).length);

h1("Annexe · Contrôle de non-divergence");
tab(["Vérification", "Résultat"], [
 ["Données demandées", String(LIGNES.length)],
 ["Contrôles de la base", String(C.length)],
 ["Contrôles atteints par au moins une donnée du questionnaire", String(atteints.size)],
 ["Contrôles qu'aucune donnée n'alimente", orphelins.length ? orphelins.join(", ") : "aucun"],
 ["Données n'alimentant aucun contrôle", sansControle.length ? [...new Set(sansControle)].join(", ") : "aucune"],
 ["Champs lus par un contrôle sans être demandés", nonDemandes.length ? nonDemandes.join(", ") : "aucun"],
 ["Champs déclarés de contexte", [...CONTEXTE].join(", ")]]);
note("Les champs de contexte n'alimentent aucun contrôle et c'est voulu : « entreprise » n'est qu'un intitulé repris dans le rapport, et « ues » déclenche la mention de revue professionnelle obligatoire en tête du rapport, non un contrôle de conformité.");
note("La colonne « contrôle attendu » et cette annexe procèdent du même calcul, qui réunit deux mesures indépendantes : l'inspection du code des contrôles, et une sonde qui observe leur exécution sur un jeu de fiches d'épreuve. La sonde voit les écritures que l'inspection manque — f[\"nom\"], const {nom} = f — et l'inspection voit les branches que la sonde n'exécute pas.");
note("Si cette annexe signale un écart, la génération échoue : le questionnaire et les contrôles ont divergé, et le rapport ne doit pas être diffusé en l'état.");

fs.writeFileSync("_quest_cse.js", "module.exports=" + JSON.stringify(A.D) + ";");
fs.writeFileSync("_quest_cse.json", JSON.stringify(A.D));
console.log(`${LIGNES.length} données · ${C.length} contrôles · atteints ${atteints.size} · orphelins ${orphelins.length ? orphelins.join(",") : "aucun"} · données sans contrôle ${[...new Set(sansControle)].length} · champs lus non demandés ${nonDemandes.length ? nonDemandes.join(",") : "aucun"}`);

let echec = false;
if (orphelins.length) { console.error("ÉCHEC — contrôles qu'aucune donnée du questionnaire n'alimente : " + orphelins.join(", ")); echec = true; }
if (nonDemandes.length) { console.error("ÉCHEC — champs lus par un contrôle sans être demandés au questionnaire : " + nonDemandes.join(", ") + ". Ajoutez la question, ou déclarez le champ de contexte en le motivant."); echec = true; }
if (contexteInutile.length) { console.error("ÉCHEC — champs déclarés de contexte alors qu'un contrôle les lit : " + contexteInutile.join(", ")); echec = true; }
if (echec) process.exit(1);
