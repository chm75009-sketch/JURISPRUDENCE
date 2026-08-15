/* Le recueil du comité social et économique : les règles d'abord, la
   jurisprudence classée ensuite. Aucun arrêt n'est résumé ici — le sommaire
   reproduit est celui de la Cour. Les conclusions de série sont mesurées sur le
   corpus, les synthèses sont écrites à la main et citées. */
const fs = require("fs");
const O = require("./outils.js");
const SYN = require("./cse_syntheses.js");
const T = JSON.parse(fs.readFileSync("textes_cse.json", "utf8"));
const D = JSON.parse(fs.readFileSync("cse_corpus.json", "utf8"));

const A = O();
const { sur, t1, trait, h1, h2, h3, p, note, puce, enc, tab } = A;
const MOIS = ["", "janvier", "février", "mars", "avril", "mai", "juin", "juillet",
  "août", "septembre", "octobre", "novembre", "décembre"];
const dateFr = s => { const [a, m, j] = s.split("-"); return `${+j}${+j === 1 ? "er" : ""} ${MOIS[+m]} ${a}`; };
const net = s => String(s || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const art = n => { const v = T[n]; return v && v.texte ? net(v.texte) : null; };
/* Un extrait d'article n'est écrit que s'il a été lu : sinon, on le dit. */
const cite = (n, max) => { const t = art(n); return t ? (max && t.length > max ? t.slice(0, max) + "…" : t)
  : "[article non lu à la source — non cité]"; };

const ARRETS = Object.values(D).sort((a, b) => a.date.localeCompare(b.date));
const RUB = [
  ["A", "Mise en place, périmètre, établissements distincts et unité économique et sociale"],
  ["B", "Élections professionnelles"],
  ["C", "Attributions générales et consultations ponctuelles"],
  ["D", "Consultations récurrentes et base de données"],
  ["E", "Fonctionnement, moyens et heures de délégation"],
  ["F", "Commission santé, sécurité et conditions de travail et représentants de proximité"],
  ["G", "Budgets du comité"],
  ["H", "Expertises"],
  ["I", "Comité social et économique central et comités d'établissement"],
  ["J", "Délit d'entrave"],
  ["K", "Statut protecteur, représentants syndicaux et désignations"],
];
const SOUS = [
  ["B1", "Le protocole d'accord préélectoral"],
  ["B2", "Électorat et éligibilité"],
  ["B3", "Collèges électoraux et répartition des sièges"],
  ["B4", "Représentation équilibrée des femmes et des hommes"],
  ["B5", "Vote électronique"],
  ["B6", "Contentieux électoral, délais et désignations"],
];
const de = (code, sous) => ARRETS.filter(d => sous ? d.sous === code : d.rubrique === code && !d.sous);
const deRub = code => ARRETS.filter(d => d.rubrique === code);

/* ---------------- en-tête ---------------- */
sur("Recueil de jurisprudence · Cour de cassation, décisions publiées");
t1("Le comité social et économique");
sur(`${ARRETS.length} arrêts publiés, du ${dateFr(ARRETS[0].date)} au ${dateFr(ARRETS[ARRETS.length-1].date)} — ${Object.values(T).filter(v => v && v.texte).length} articles du code du travail lus à la source le 15 août 2026`);
trait();

h1("Avertissement — ce que ce recueil contient, et ce qu'il ne contient pas");
p("Le comité social et économique a été créé par l'ordonnance n° 2017-1386 du 22 septembre 2017. Il s'est substitué au comité d'entreprise, aux délégués du personnel et au comité d'hygiène, de sécurité et des conditions de travail, au plus tard au 1er janvier 2020. La jurisprudence rassemblée ici est celle qui applique ce régime : les décisions qui statuent sur les anciennes institutions en ont été écartées, même récentes, parce qu'elles jugent un autre droit.");
tab(["Ce qui a été fait", "Comment", "Résultat mesuré"], [
 ["Recherche des décisions", "Interrogation de la base Judilibre de la Cour de cassation, décisions publiées au Bulletin ou au Rapport annuel. Aucune requête dont la réponse portait la mention « relaxed » n'a été retenue : une requête relaxée ramène des décisions sans rapport avec la recherche.", `${ARRETS.length} arrêts retenus`],
 ["Filtre du champ", "Une décision n'est retenue que si son visa, son sommaire ou son titrage mentionne le comité social et économique, un représentant de proximité, un conseil d'entreprise ou une commission santé, sécurité et conditions de travail — ou vise un article L. 2311-1 à L. 2317-6 ou L. 2321-1 —, et qu'elle est postérieure au 1er janvier 2018. Les numéros d'articles seuls ne suffisaient pas avant cette date : ils désignaient d'autres institutions.", "décisions antérieures écartées"],
 ["Lecture des textes", "Chaque article du champ a été demandé un par un au relais Légifrance, dans sa version en vigueur au 15 août 2026. Aucune règle n'est écrite ici sur un article qui n'a pas été lu.", `${Object.values(T).filter(v => v && v.texte).length} articles lus`],
 ["Classement", "Rattachement par le visa d'abord — c'est le texte que la Cour a elle-même appliqué —, par le sommaire et le titrage à défaut. Les arrêts que la méthode ne rattachait pas ont été lus un par un et rattachés à la main.", "aucun arrêt laissé sans rubrique"],
]);
enc("Ce que ce recueil ne couvre pas",
 "Il ne contient que des décisions publiées : les arrêts non publiés, même instructifs, n'y figurent pas. Il ne contient aucune décision rendue sur le comité d'entreprise, les délégués du personnel ou le CHSCT. Il ne traite pas du comité de groupe ni du comité d'entreprise européen, sauf lorsqu'un arrêt du champ les rencontre. Enfin, deux rubriques du plan sont pauvres et il faut le dire plutôt que de le masquer : les budgets ne portent qu'un arrêt, et le délit d'entrave aucun.");

/* ---------------- Partie I : les règles ---------------- */
h1("Première partie · Les règles");
p("Cette partie n'est pas un commentaire. Chaque case des tableaux qui suivent porte l'article qui la fonde, dans sa version en vigueur au 15 août 2026. Elle sert de grille de lecture à la seconde partie : un arrêt ne se comprend que rapporté au texte qu'il applique.");

h2("1 · La mise en place");
tab(["Question", "Règle", "Article"], [
 ["À partir de quel effectif ?", "Onze salariés, atteints pendant douze mois consécutifs.", "L. 2311-2"],
 ["Comment se calcule l'effectif ?", "Contrats à durée indéterminée à temps plein comptés intégralement ; contrats à durée déterminée, contrats intermittents et salariés mis à disposition présents depuis un an au prorata de leur temps de présence.", "L. 1111-2"],
 ["Qui déclenche les élections ?", "L'employeur informe le personnel tous les quatre ans, par tout moyen conférant date certaine ; le premier tour se tient au plus tard le quatre-vingt-dixième jour suivant.", "L. 2314-4"],
 ["Pour quelle durée le comité est-il élu ?", "Quatre ans.", "L. 2314-33"],
 ["Cette durée peut-elle être réduite ?", "Oui, entre deux et quatre ans, par accord de branche, de groupe ou d'entreprise.", "L. 2314-34"],
 ["Que se passe-t-il au franchissement de cinquante salariés ?", "Les attributions récurrentes d'information et de consultation s'exercent à l'expiration d'un délai de douze mois à compter de la date à laquelle le seuil a été atteint pendant douze mois consécutifs.", "L. 2312-2"],
 ["Quand faut-il des élections partielles ?", "Si un collège n'est plus représenté ou si le nombre de titulaires est réduit de moitié ou plus, sauf si l'événement survient moins de six mois avant le terme des mandats.", "L. 2314-10"],
]);

h2("2 · Le périmètre : établissements distincts, unité économique et sociale, représentants de proximité");
tab(["Cas", "Qui décide", "Article"], [
 ["Nombre et périmètre des établissements distincts", "Un accord d'entreprise majoritaire, conclu dans les conditions du premier alinéa de L. 2232-12.", "L. 2313-2"],
 ["À défaut d'accord", "L'employeur, compte tenu de l'autonomie de gestion du responsable d'établissement, notamment en matière de gestion du personnel.", "L. 2313-4"],
 ["Contestation de la décision administrative", "Le tribunal judiciaire, en dernier ressort, à l'exclusion de tout autre recours.", "L. 2313-5"],
 ["Entreprise d'au moins cinquante salariés à deux établissements ou plus", "Comités d'établissement et comité central.", "L. 2313-1"],
 ["Unité économique et sociale d'au moins onze salariés", "Un comité commun ; le découpage y est fixé par accord conclu au niveau de l'unité.", "L. 2313-8"],
 ["Représentants de proximité", "Uniquement l'accord d'entreprise de L. 2313-2, qui fixe leur nombre, leurs attributions, leur désignation et leurs heures.", "L. 2313-7"],
]);

h2("3 · Les attributions, selon l'effectif");
tab(["Effectif", "Ce que le comité peut faire", "Article"], [
 ["Moins de onze", "Aucun comité n'est obligatoire.", "L. 2311-2"],
 ["Onze à quarante-neuf", "Présenter les réclamations individuelles et collectives ; contribuer à promouvoir la santé, la sécurité et l'amélioration des conditions de travail ; réaliser les enquêtes en matière d'accidents du travail et de maladies professionnelles.", "L. 2312-5"],
 ["Cinquante et plus", "Assurer l'expression collective des salariés ; être informé et consulté sur l'organisation, la gestion et la marche générale de l'entreprise, notamment sur les mesures affectant le volume ou la structure des effectifs et sur la modification de l'organisation économique ou juridique.", "L. 2312-8"],
 ["Trois cents et plus", "Réunion mensuelle de droit à défaut d'accord ; commission santé, sécurité et conditions de travail obligatoire ; expertise en vue de la négociation sur l'égalité professionnelle.", "L. 2315-28, L. 2315-36, L. 2315-94, 3°"],
 ["Mille et plus", "Le rapport du droit d'alerte économique est établi par la commission économique, à défaut d'accord.", "L. 2312-63"],
]);

h2("4 · Les consultations récurrentes et les délais");
tab(["Objet", "Règle supplétive", "Article"], [
 ["Les trois consultations", "Orientations stratégiques ; situation économique et financière ; politique sociale, conditions de travail et emploi. Le comité est informé au cours de ces consultations des conséquences environnementales de l'activité.", "L. 2312-17"],
 ["Ce qu'un accord peut changer", "Le contenu, la périodicité et les modalités des consultations, la liste des informations, le nombre de réunions annuelles — qui ne peut être inférieur à six —, et les niveaux auxquels les consultations sont conduites.", "L. 2312-19"],
 ["À défaut d'accord", "Les trois consultations sont annuelles ; celles sur les orientations stratégiques et la situation économique et financière sont conduites au niveau de l'entreprise.", "L. 2312-22"],
 ["Ce à quoi le comité a droit", "Un délai d'examen suffisant, des informations précises et écrites, et la réponse motivée de l'employeur à ses observations. S'il estime ne pas disposer d'éléments suffisants, il saisit le président du tribunal judiciaire.", "L. 2312-15"],
 ["Point de départ du délai", "La communication des informations, ou l'information de leur mise à disposition dans la base de données.", "R. 2312-5"],
 ["Durée à défaut d'accord", "Un mois ; deux mois en cas d'expertise ; trois mois en cas d'expertises menées à la fois au niveau central et au niveau d'établissements. À l'expiration, le comité est réputé avoir rendu un avis négatif.", "R. 2312-6"],
]);
enc("La conséquence pratique",
 "Le délai ne court pas de la convocation mais de la remise effective des informations, et son expiration vaut avis — négatif. L'employeur qui laisse courir le délai obtient donc un avis, mais un avis défavorable, et il devra établir la date à laquelle les informations ont été remises.");

h2("5 · Les élections");
tab(["Étape", "Règle", "Article"], [
 ["Invitation à négocier", "Sont invitées les organisations satisfaisant aux critères de respect des valeurs républicaines et d'indépendance, légalement constituées depuis deux ans et dont le champ couvre l'entreprise, ainsi que les organisations représentatives et celles ayant constitué une section syndicale.", "L. 2314-5"],
 ["Validité du protocole", "Signature par la majorité des organisations ayant participé à la négociation, dont les organisations représentatives ayant recueilli la majorité des suffrages exprimés aux dernières élections.", "L. 2314-6"],
 ["Ce que le protocole peut modifier", "Le nombre de sièges ou le volume des heures individuelles, à condition que le volume global des heures par collège reste au moins égal au minimum légal.", "L. 2314-7"],
 ["Collèges", "Deux collèges ; un troisième pour les ingénieurs et cadres dans les entreprises d'au moins cinq cent un salariés ou lorsque leur nombre est au moins égal à vingt-cinq.", "L. 2314-11"],
 ["Répartition des sièges et du personnel", "Accord aux conditions de L. 2314-6 ; à défaut, décision de l'autorité administrative.", "L. 2314-13"],
 ["Éligibilité", "Électeurs de dix-huit ans révolus travaillant dans l'entreprise depuis un an au moins, à l'exclusion des proches de l'employeur et des salariés disposant d'une délégation écrite particulière d'autorité ou le représentant effectivement devant le comité.", "L. 2314-19"],
 ["Mode de scrutin", "Scrutin de liste à deux tours avec représentation proportionnelle à la plus forte moyenne ; second tour dans les quinze jours si les votants sont moins de la moitié des inscrits.", "L. 2314-29"],
 ["Vote électronique", "Ouvert par accord d'entreprise ou, à défaut, par décision de l'employeur.", "L. 2314-26"],
 ["Représentation équilibrée", "Listes composées d'un nombre de femmes et d'hommes correspondant à leur part dans le collège, et alternées jusqu'à épuisement des candidats d'un sexe.", "L. 2314-30"],
 ["Sanction", "Annulation de l'élection des élus du sexe surreprésenté en surnombre, en suivant l'ordre inverse de la liste ; annulation de tout élu dont le positionnement méconnaît l'alternance.", "L. 2314-32"],
 ["Délai de contestation", "Trois jours pour l'électorat à compter de la publication de la liste électorale ; quinze jours pour la régularité de l'élection ou la désignation de représentants syndicaux.", "R. 2314-24"],
]);

h2("6 · La composition et les moyens");
p("À défaut de stipulation d'un accord, le nombre de titulaires et le crédit mensuel d'heures sont fixés par le tableau de l'article R. 2314-1, apprécié dans le cadre de l'entreprise ou de chaque établissement distinct. Les valeurs ci-dessous en sont l'extrait littéral.");
tab(["Effectif", "Titulaires", "Heures par mois et par titulaire", "Total mensuel"], [
 ["11 à 24", "1", "10", "10"], ["25 à 49", "2", "10", "20"], ["50 à 74", "4", "18", "72"],
 ["75 à 99", "5", "19", "95"], ["100 à 124", "6", "21", "126"], ["150 à 174", "8", "21", "168"],
 ["200 à 249", "10", "22", "220"], ["300 à 399", "11", "22", "242"], ["500 à 599", "13", "24", "312"],
 ["1000 à 1249", "17", "24", "408"], ["1500 à 1749", "20", "26", "520"], ["2000 à 2249", "22", "26", "572"],
 ["5000 à 5249", "29", "29", "841"], ["10000", "35", "34", "1190"],
]);
note("Extrait du tableau de l'article R. 2314-1 ; le tableau complet compte cinquante-six tranches, de onze à dix mille salariés.");
tab(["Moyen", "Règle", "Article"], [
 ["Réunions", "Au moins une fois par mois dans les entreprises d'au moins trois cents salariés, une fois tous les deux mois en deçà, à défaut d'accord. Au moins quatre réunions annuelles portent sur la santé, la sécurité et les conditions de travail.", "L. 2315-28, L. 2315-27"],
 ["Résolutions", "Prises à la majorité des membres présents ; le président ne participe pas au vote lorsqu'il consulte les élus en tant que délégation du personnel.", "L. 2315-32"],
 ["Temps de délégation", "De plein droit du temps de travail, payé à l'échéance normale ; l'employeur qui conteste son utilisation saisit le juge.", "L. 2315-10"],
 ["Formation santé et sécurité", "Cinq jours au minimum pour les membres de la délégation du personnel et le référent.", "L. 2315-18"],
 ["Formation économique", "Cinq jours au maximum pour les titulaires élus pour la première fois, dans les entreprises d'au moins cinquante salariés, financée par le comité.", "L. 2315-63"],
]);

h2("7 · La commission santé, sécurité et conditions de travail");
tab(["Question", "Règle", "Article"], [
 ["Quand est-elle obligatoire ?", "Entreprises et établissements distincts d'au moins trois cents salariés, et établissements classés Seveso.", "L. 2315-36"],
 ["Peut-elle être imposée en deçà ?", "Oui, par l'inspecteur du travail, notamment en raison de la nature des activités ou de l'agencement des locaux.", "L. 2315-37"],
 ["Que peut-elle recevoir ?", "Tout ou partie des attributions du comité en matière de santé, de sécurité et de conditions de travail, à l'exception du recours à l'expert et des attributions consultatives.", "L. 2315-38"],
 ["Comment est-elle composée ?", "Présidée par l'employeur ; au moins trois représentants du personnel, dont au moins un du second collège ou, le cas échéant, du troisième. Désignés par le comité parmi ses membres, par résolution, pour une durée qui prend fin avec le mandat des élus.", "L. 2315-39"],
]);

h2("8 · Les budgets");
tab(["Budget", "Montant", "Article"], [
 ["Fonctionnement", "0,20 % de la masse salariale brute de cinquante à moins de deux mille salariés ; 0,22 % à partir de deux mille.", "L. 2315-61"],
 ["Activités sociales et culturelles", "Fixée par accord d'entreprise ; à défaut, le rapport à la masse salariale brute ne peut être inférieur à celui de l'année précédente.", "L. 2312-81"],
 ["Assiette", "Ensemble des gains et rémunérations soumis à cotisations de sécurité sociale, à l'exception des indemnités versées à l'occasion de la rupture du contrat à durée indéterminée.", "L. 2312-83"],
 ["Entreprise à plusieurs comités", "Montant global déterminé au niveau de l'entreprise, répartition entre comités d'établissement fixée par accord.", "L. 2312-82"],
]);

h2("9 · Les expertises");
tab(["Cas de recours", "Qui paie", "Article"], [
 ["Consultation sur la situation économique et financière", "L'employeur, en totalité.", "L. 2315-88, L. 2315-80, 1°"],
 ["Consultation sur la politique sociale", "L'employeur, en totalité.", "L. 2315-91, L. 2315-80, 1°"],
 ["Risque grave identifié et actuel", "L'employeur, en totalité.", "L. 2315-94, 1°, L. 2315-80, 1°"],
 ["Licenciement collectif pour motif économique", "L'employeur, en totalité.", "L. 2315-92, I, 3°, L. 2315-80, 1°"],
 ["Consultation sur les orientations stratégiques", "Le comité à hauteur de 20 % sur son budget de fonctionnement, l'employeur à hauteur de 80 %.", "L. 2315-87, L. 2315-80, 2°"],
 ["Consultations ponctuelles hors licenciement collectif", "Même partage : 20 % le comité, 80 % l'employeur.", "L. 2315-80, 2°"],
 ["Toute autre expertise choisie par le comité", "Le comité, sur ses seuls fonds.", "L. 2315-81"],
]);
tab(["Contestation par l'employeur", "Point de départ du délai de dix jours", "Article"], [
 ["La nécessité de l'expertise", "La délibération du comité décidant le recours.", "L. 2315-86, 1°"],
 ["Le choix de l'expert", "La désignation de l'expert.", "L. 2315-86, 2°"],
 ["Le coût prévisionnel, l'étendue ou la durée", "La notification du cahier des charges et des informations.", "L. 2315-86, 3°"],
 ["Le coût final", "La notification de ce coût.", "L. 2315-86, 4°"],
 ["Délai", "Dix jours dans tous les cas.", "R. 2315-49"],
]);

h2("10 · Le comité central et le conseil d'entreprise");
tab(["Question", "Règle", "Article"], [
 ["Que fait le comité central ?", "Il exerce les attributions qui concernent la marche générale de l'entreprise et excèdent les pouvoirs des chefs d'établissement. Il est seul consulté sur les projets décidés au niveau de l'entreprise ne comportant pas de mesures d'adaptation spécifiques à un établissement.", "L. 2316-1"],
 ["Comment est-il composé ?", "L'employeur, et un nombre égal de délégués titulaires et de suppléants élus par chaque comité d'établissement parmi ses membres.", "L. 2316-4"],
 ["Répartition des sièges entre établissements", "Accord aux conditions de L. 2314-6 ; en cas de désaccord, décision de l'autorité administrative du siège.", "L. 2316-8"],
 ["Le conseil d'entreprise", "Il exerce toutes les attributions du comité et est seul compétent pour négocier, conclure et réviser les conventions et accords d'entreprise ou d'établissement.", "L. 2321-1"],
]);

h2("11 · La protection des élus et le délit d'entrave");
tab(["Question", "Règle", "Article"], [
 ["Qui est protégé ?", "Le délégué syndical, le membre élu de la délégation du personnel, le représentant syndical au comité, le représentant de proximité, et les membres des instances européennes et de groupe, y compris pendant une procédure collective.", "L. 2411-1"],
 ["Quelle est la protection ?", "Le licenciement ne peut intervenir qu'après autorisation de l'inspecteur du travail.", "L. 2411-5"],
 ["Pendant combien de temps après le mandat ?", "Six mois après l'expiration du mandat ou la disparition de l'institution, pour l'ancien élu et l'ancien représentant syndical désigné depuis deux ans non reconduits.", "L. 2411-5"],
 ["Entrave à la constitution ou à la désignation", "Un an d'emprisonnement et 7 500 euros d'amende.", "L. 2317-1"],
 ["Entrave au fonctionnement régulier", "7 500 euros d'amende.", "L. 2317-1"],
]);

/* ---------------- Partie II : la jurisprudence ---------------- */
h1("Seconde partie · La jurisprudence classée");
p("Chaque arrêt est donné dans son sommaire, c'est-à-dire le résumé écrit par la Cour elle-même, sans reformulation. Chaque série se termine par une conclusion mesurée sur le corpus, puis par une synthèse.");
tab(["Rubrique", "Intitulé", "Arrêts"],
  RUB.map(([c, lib]) => [c, lib, String(deRub(c).length)]));

/* conclusion de série, calculée */
function conclusion(liste) {
  if (!liste.length) return;
  const sol = {}; liste.forEach(d => sol[d.sol] = (sol[d.sol] || 0) + 1);
  const rap = liste.filter(d => (d.pub || []).some(x => /Rapport/i.test(x))).length;
  const ans = {}; liste.forEach(d => ans[d.date.slice(0, 4)] = (ans[d.date.slice(0, 4)] || 0) + 1);
  const arts = {};
  liste.forEach(d => (d.req || []).forEach(a => { if (/^L\. 23/.test(a)) arts[a] = (arts[a] || 0) + 1; }));
  const top = Object.entries(arts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => `${e[0]} (${e[1]})`);
  h3("Conclusion de la série — ce que le corpus montre");
  tab(["Mesure", "Valeur"], [
   ["Nombre d'arrêts", String(liste.length)],
   ["Période", `${dateFr(liste[0].date)} — ${dateFr(liste[liste.length - 1].date)}`],
   ["Sens des décisions", Object.entries(sol).sort((a, b) => b[1] - a[1]).map(e => `${e[0]} : ${e[1]}`).join(" · ")],
   ["Publiés aussi au Rapport annuel", String(rap)],
   ["Répartition par année", Object.entries(ans).sort().map(e => `${e[0]} : ${e[1]}`).join(" · ")],
   ["Articles les plus souvent appliqués", top.length ? top.join(" · ") : "—"],
  ]);
}
function synthese(code) {
  const s = SYN[code];
  if (!s) return;
  h3("Synthèse — " + (SOUS.concat(RUB).find(e => e[0] === code) || [, code])[1]);
  s.forEach(p);
}
function arretsDe(liste) {
  for (const d of liste) {
    h3(`Cass. ${d.ch.replace("Chambre ", "ch. ")} ${dateFr(d.date)}, n° ${d.num} — ${d.sol}`);
    if (d.sommaire) p(net(d.sommaire));
    else note("Cette décision ne comporte pas de sommaire publié. Titrage de la Cour : " + (d.themes || []).join(" · ") + ".");
    const meta = [];
    if (d.visa) meta.push("Visa : " + net(d.visa));
    if ((d.pub || []).some(x => /Rapport/i.test(x))) meta.push("Publié au Rapport annuel de la Cour.");
    if (meta.length) note(meta.join("  —  "));
  }
}

for (const [code, lib] of RUB) {
  h2(`${code} · ${lib}`);
  const total = deRub(code);
  if (!total.length) {
    p("Aucun arrêt du corpus ne se rattache à cette rubrique.");
    synthese(code);
    continue;
  }
  if (code === "B") {
    p(`${total.length} arrêts, répartis en six séries. Le contentieux électoral représente à lui seul ${Math.round(100 * total.length / ARRETS.length)} % du corpus : c'est le premier poste du contentieux du comité social et économique.`);
    for (const [sc, slib] of SOUS) {
      const l = de(sc, true);
      if (!l.length) continue;
      h3(`${sc} · ${slib}`);
      arretsDe(l);
      conclusion(l);
      synthese(sc);
    }
    continue;
  }
  arretsDe(total);
  conclusion(total);
  synthese(code);
}

h1("Ce que ce recueil ne dit pas");
puce("Il ne contient aucune décision non publiée : la Cour publie ce qu'elle veut faire connaître, et le corpus reflète ce choix, non l'ensemble du contentieux.");
puce("Il ne contient aucune décision de cour d'appel ni de tribunal judiciaire.");
puce("Il ne traite pas du contentieux administratif de l'autorisation de licenciement des salariés protégés, qui relève du juge administratif.");
puce("Il ne contient aucun arrêt sur le délit d'entrave, et un seul sur les budgets : sur ces deux points, il faut se reporter aux textes.");
puce("Il ne dit rien des stipulations conventionnelles applicables dans une entreprise donnée : convention collective de branche et accords d'entreprise doivent être lus séparément.");
enc("Le refus est une réponse",
 "Signaler ce que le corpus ne couvre pas n'est pas une précaution de style : c'est la condition pour que ce qu'il couvre soit exact. Une rubrique vide reste vide.");

fs.writeFileSync("_cse_items.js", "module.exports=" + JSON.stringify(A.D) + ";");
fs.writeFileSync("_cse_items.json", JSON.stringify(A.D));
console.log("items :", A.D.length, "· arrêts :", ARRETS.length);
