/* La grille du comité social et économique : ce que la loi exige, règle par règle.
   Chaque règle porte son article et, quand il en existe un dans le corpus, l'arrêt
   publié qui l'applique. Les arrêts ne sont pas recopiés : ils sont lus dans
   cse_corpus.json à partir de leur numéro de pourvoi. Un numéro absent du corpus
   fait échouer le chargement — aucune référence ne peut donc être inventée. */
const fs = require("fs");
const M = require("./moteur-cse.js");
const CORPUS = Object.values(JSON.parse(fs.readFileSync(__dirname + "/cse_corpus.json", "utf8")));
const T = JSON.parse(fs.readFileSync(__dirname + "/textes_cse.json", "utf8"));

/* A("21-16.996") renvoie l'arrêt du corpus, ou jette. */
function A(num, date) {
  const l = CORPUS.filter(d => d.num === num && (!date || d.date === date));
  if (l.length !== 1) throw new Error(`Arrêt ${num}${date ? " du " + date : ""} : ${l.length} correspondance(s) dans le corpus.`);
  const d = l[0];
  return { num: d.num, date: d.date, ch: d.ch, sol: d.sol,
    sommaire: (d.sommaire || "").replace(/\s+/g, " ").trim(),
    rapport: (d.pub || []).some(x => /Rapport/i.test(x)) };
}
const texte = n => { const v = T[n]; if (!v || !v.texte) throw new Error(`Article ${n} non lu à la source.`); return v.texte.replace(/\s+/g, " ").trim(); };

const G = [];
const r = o => { o.fondement.forEach(texte); G.push(o); return o; };
const vide = x => x === undefined || x === null || x === "" || (Array.isArray(x) && !x.length);

/* ---------------- A · Mise en place et périmètre ---------------- */
r({ id: "CSE-A-01", rubrique: "Mise en place",
 question: "Un comité social et économique doit-il être mis en place ?",
 si: f => typeof f.effectif === "number",
 alors: f => { const d = M.delegation(f.effectif);
   if (!d.du) return "L'effectif est inférieur à onze salariés : aucun comité n'est obligatoire. L'obligation naît lorsque l'effectif d'au moins onze salariés est atteint pendant douze mois consécutifs.";
   return `L'effectif de ${f.effectif} salariés place l'entreprise dans la tranche ${d.tranche} : la délégation du personnel comporte ${d.titulaires} titulaire(s) et autant de suppléants, chaque titulaire disposant de ${d.heures} heures de délégation par mois, soit ${d.total} heures au total. Ces valeurs sont supplétives : un accord peut les modifier à condition que le volume global d'heures par collège reste au moins égal au minimum légal.`; },
 fondement: ["L2311-2", "L2314-1", "R2314-1", "L2314-7"],
 juris: [], pieces: ["registre du personnel", "états mensuels d'effectif sur douze mois"],
 erreurs: ["Apprécier le seuil à une date donnée au lieu de le mesurer sur douze mois consécutifs."] });

r({ id: "CSE-A-02", rubrique: "Mise en place",
 question: "Le seuil de onze salariés est-il atteint sur douze mois consécutifs ?",
 si: f => Array.isArray(f.effectifsMensuels),
 alors: f => { const s = M.seuilAtteint(f.effectifsMensuels, 11);
   return s.atteint
     ? `Le seuil de onze salariés est atteint pendant ${s.consecutifs} mois consécutifs : l'obligation de mettre en place un comité est née.`
     : `Le seuil de onze salariés n'est atteint que pendant ${s.consecutifs} mois consécutifs au maximum. L'obligation n'est pas née, mais elle naîtra dès que douze mois consécutifs seront réunis.`; },
 fondement: ["L2311-2", "L1111-2"],
 juris: [], pieces: ["déclarations sociales nominatives des douze derniers mois"],
 erreurs: ["Oublier de compter les salariés mis à disposition présents depuis un an."] });

r({ id: "CSE-A-03", rubrique: "Périmètre",
 question: "Comment le nombre et le périmètre des établissements distincts sont-ils fixés ?",
 si: f => f.etablissementsMultiples === true,
 alors: () => "L'ordre des sources est strict : un accord d'entreprise majoritaire d'abord ; à défaut, une décision de l'employeur prise compte tenu de l'autonomie de gestion du responsable d'établissement, notamment en matière de gestion du personnel ; la décision administrative ne vient qu'en dernier lieu. Le juge saisi de la contestation se prononce sur la légalité de la décision au regard de l'ensemble des circonstances de fait à la date où elle a été prise, et lorsqu'il l'annule il lui appartient de statuer lui-même sur le découpage.",
 fondement: ["L2313-2", "L2313-4", "L2313-5"],
 juris: [A("20-60.258"), A("19-11.918"), A("19-21.086"), A("19-17.298")],
 pieces: ["accord de découpage ou décision unilatérale datée", "organigrammes", "délégations de pouvoir des responsables d'établissement"],
 erreurs: ["Refuser l'autonomie de gestion au motif que les fonctions support sont centralisées : la centralisation ne l'exclut pas.",
   "Ajouter au texte des critères qu'il ne prévoit pas — la Cour censure."] });

r({ id: "CSE-A-04", rubrique: "Périmètre",
 question: "Dans quel délai la décision sur les établissements distincts peut-elle être contestée ?",
 si: f => f.etablissementsMultiples === true,
 alors: () => "La notification de la décision de l'employeur consiste en une information spécifique et préalable à l'organisation des élections : c'est elle qui fait courir le délai de recours. Les contestations de la décision administrative relèvent du tribunal judiciaire, en dernier ressort, à l'exclusion de tout autre recours.",
 fondement: ["L2313-5", "R2313-1"],
 juris: [A("18-22.948"), A("18-23.655")],
 pieces: ["preuve de la notification, par un moyen conférant date certaine"],
 erreurs: ["Confondre l'information générale sur les élections avec la notification spécifique du découpage."] });

r({ id: "CSE-A-05", rubrique: "Périmètre",
 question: "Des représentants de proximité peuvent-ils être mis en place ?",
 si: f => f.representantsProximite === true || f.etablissementsMultiples === true,
 alors: () => "Uniquement par l'accord d'entreprise majoritaire qui détermine le nombre et le périmètre des établissements distincts. Cet accord fixe lui-même leur nombre, leurs attributions, les modalités de leur désignation et leurs heures de délégation. Aucune autre voie n'est ouverte : ni décision unilatérale, ni usage.",
 fondement: ["L2313-7", "L2313-2"],
 juris: [A("22-13.303"), A("21-13.206"), A("23-12.990")],
 pieces: ["accord d'entreprise instituant les représentants de proximité"],
 erreurs: ["Instituer des représentants de proximité par décision unilatérale.",
   "Oublier qu'ils bénéficient du statut protecteur au titre de l'article L. 2411-1, 4°."] });

r({ id: "CSE-A-06", rubrique: "Périmètre",
 question: "Que devient l'unité économique et sociale ?",
 si: f => f.ues === true,
 alors: () => "Une unité économique et sociale regroupant au moins onze salariés donne lieu à un comité commun ; si elle comporte au moins deux établissements, des comités d'établissement et un comité central sont constitués. L'accord collectif qui la reconnaît, dont l'objet est de mettre en place un comité selon les règles de droit commun, n'est ni un accord interentreprises ni un accord de groupe : sa contestation suit le régime de l'accord d'entreprise.",
 fondement: ["L2313-8", "L2313-9"],
 juris: [A("22-13.672"), A("19-21.057")],
 pieces: ["accord ou décision de justice reconnaissant l'unité économique et sociale"],
 erreurs: ["Soumettre la contestation de l'accord de reconnaissance au régime de l'accord de groupe."] });

/* ---------------- B · Élections ---------------- */
r({ id: "CSE-B-01", rubrique: "Élections",
 question: "Quand et comment les élections doivent-elles être engagées ?",
 si: f => typeof f.effectif === "number" && f.effectif >= 11,
 alors: () => "L'employeur informe le personnel tous les quatre ans de l'organisation des élections, par tout moyen permettant de conférer date certaine. Le document précise la date envisagée pour le premier tour, qui doit se tenir au plus tard le quatre-vingt-dixième jour suivant la diffusion.",
 fondement: ["L2314-4", "L2314-5"],
 juris: [A("17-26.522")],
 pieces: ["note d'information au personnel, datée", "invitations adressées aux organisations syndicales"],
 erreurs: ["Inviter les seules organisations représentatives : l'article L. 2314-5 vise aussi celles qui respectent les valeurs républicaines, sont indépendantes, légalement constituées depuis deux ans et dont le champ couvre l'entreprise."] });

r({ id: "CSE-B-02", rubrique: "Élections",
 question: "À quelles conditions le protocole préélectoral est-il valable, et que purge-t-il ?",
 si: f => f.electionsEnCours === true || f.protocole !== undefined,
 alors: () => "Sa validité est subordonnée à sa signature par la majorité des organisations ayant participé à la négociation, dont les organisations représentatives ayant recueilli la majorité des suffrages exprimés aux dernières élections. Lorsqu'il remplit ces conditions, il ne peut plus être contesté devant le juge judiciaire qu'en ce qu'il contiendrait des stipulations contraires à l'ordre public, notamment aux principes généraux du droit électoral.",
 fondement: ["L2314-6"],
 juris: [A("20-20.962"), A("23-15.822"), A("22-13.535"), A("18-20.841")],
 pieces: ["protocole signé, avec la liste des signataires et leurs suffrages"],
 erreurs: ["Croire qu'un protocole valablement conclu reste attaquable pour toute irrégularité : il ne l'est plus que pour violation de l'ordre public.",
   "Signer sans réserve puis contester après le scrutin : la contestation est irrecevable."] });

r({ id: "CSE-B-03", rubrique: "Élections",
 question: "Quelle est l'obligation de loyauté dans la négociation du protocole ?",
 si: f => f.electionsEnCours === true,
 alors: () => "L'employeur est tenu de mener loyalement la négociation, notamment en mettant à la disposition des organisations participantes les éléments d'information indispensables à celle-ci.",
 fondement: ["L2314-6", "L2314-13"],
 juris: [A("19-10.780")],
 pieces: ["éléments transmis aux organisations, avec preuve de la date de transmission"],
 erreurs: ["Négocier la répartition des sièges sans communiquer les effectifs par collège."] });

r({ id: "CSE-B-04", rubrique: "Élections",
 question: "Comment se répartissent le personnel et les sièges entre les collèges ?",
 si: f => f.electionsEnCours === true,
 alors: f => { const c = M.colleges({ effectif: f.effectif, nbCadres: f.nbCadres });
   return (c ? c.motif + " " : "") +
     "La répartition fait l'objet d'un accord aux conditions de l'article L. 2314-6 ; à défaut, l'autorité administrative décide, en appliquant un critère de proportionnalité entre l'effectif de chaque collège et le nombre de sièges, tempéré par les circonstances particulières de l'entreprise. Sa saisine proroge de plein droit les mandats en cours jusqu'à la proclamation des résultats, et sa décision est contestée devant le tribunal judiciaire en dernier ressort."; },
 fondement: ["L2314-13", "L2314-11", "R2314-3"],
 juris: [A("17-27.175"), A("22-22.524"), A("21-19.551"), A("25-14.504")],
 pieces: ["accord de répartition ou saisine de l'autorité administrative", "effectifs par collège"],
 erreurs: ["Organiser le scrutin pendant que l'autorité administrative est saisie : le processus est suspendu."] });

r({ id: "CSE-B-05", rubrique: "Élections",
 question: "Qui est électeur et qui est éligible ?",
 si: f => f.electionsEnCours === true,
 alors: () => "Sont éligibles les électeurs de dix-huit ans révolus travaillant dans l'entreprise depuis un an au moins, à l'exclusion des proches de l'employeur et des salariés qui disposent d'une délégation écrite particulière d'autorité leur permettant d'être assimilés au chef d'entreprise, ou qui le représentent effectivement devant le comité. Les deux conditions sont alternatives et strictement entendues. Les salariés mis à disposition présents dans les locaux depuis au moins un an doivent être inscrits sur les listes de l'entreprise utilisatrice.",
 fondement: ["L2314-18", "L2314-19", "L2314-23", "L1111-2"],
 juris: [A("19-25.982"), A("24-16.430"), A("25-14.195"), A("22-10.903")],
 pieces: ["listes électorales par collège", "organigramme et délégations de pouvoir écrites"],
 erreurs: ["Exclure un responsable qui n'assiste aux réunions qu'à titre ponctuel et avec voix consultative.",
   "Appliquer la jurisprudence antérieure à la loi du 21 décembre 2022 sans vérifier la rédaction applicable."] });

r({ id: "CSE-B-06", rubrique: "Élections",
 question: "Comment composer une liste au regard de la représentation équilibrée ?",
 si: f => f.electionsEnCours === true,
 alors: f => { const l = M.listeParitaire(f.liste || {});
   if (!l) return "La règle impose, pour chaque collège, une liste composée d'un nombre de femmes et d'hommes correspondant à leur part sur la liste électorale, les candidats alternant jusqu'à épuisement des candidats d'un des sexes. Les données du collège n'étant pas renseignées, aucun calcul n'a été fait.";
   if (!l.applicable) return l.motif;
   if (l.conflit || l.indifferent) return l.motif + " " + l.sanction;
   return `${l.motif} Part des femmes sur la liste électorale : ${l.partF} %. Ordre imposé par l'alternance : ${l.alternance}. ${l.exclusion || ""} ${l.alternance_note}`; },
 fondement: ["L2314-30", "L2314-31", "L2314-32"],
 juris: [A("18-60.173"), A("17-60.263"), A("24-11.781"), A("24-16.515"), A("20-60.118")],
 pieces: ["liste électorale du collège avec la répartition femmes-hommes", "protocole mentionnant la proportion"],
 erreurs: ["Calculer la proportion sur le nombre de sièges au lieu du nombre de candidats de la liste.",
   "Croire que le premier candidat doit être du sexe majoritaire : l'alternance s'examine candidat par candidat.",
   "Oublier que la règle s'applique séparément aux titulaires et aux suppléants."] });

r({ id: "CSE-B-07", rubrique: "Élections",
 question: "Que se passe-t-il si la règle de représentation équilibrée n'est pas respectée ?",
 si: f => f.electionsEnCours === true || f.contentieuxElectoral === true,
 alors: () => "Le non-respect de la proportion entraîne l'annulation de l'élection des derniers élus du sexe surreprésenté, en suivant l'ordre inverse de la liste. Le non-respect de l'alternance entraîne l'annulation de l'élection de tout élu dont le positionnement est irrégulier. L'annulation ne fait perdre son mandat à l'élu qu'à compter du jour où elle est prononcée et reste sans incidence sur sa candidature et son score. Surtout, le siège annulé ne se remplace pas : ni par rectification de l'attribution des sièges, ni par un suppléant.",
 fondement: ["L2314-32", "L2314-37", "L2314-10"],
 juris: [A("19-12.596"), A("19-15.505"), A("23-60.107"), A("24-60.159"), A("20-16.859")],
 pieces: ["procès-verbaux des élections", "listes de candidats déposées"],
 erreurs: ["Faire remplacer l'élu dont l'élection est annulée par un suppléant : l'article L. 2314-37 ne s'applique pas."] });

r({ id: "CSE-B-08", rubrique: "Élections",
 question: "Le vote électronique peut-il être mis en place ?",
 si: f => f.voteElectronique === true,
 alors: () => "Il peut être ouvert par un accord d'entreprise ou de groupe et, à défaut d'accord, par une décision unilatérale de l'employeur, selon les modalités fixées par décret pris après avis de la Commission nationale de l'informatique et des libertés. Le code électoral ne lui est pas applicable : le test du système et la vérification que l'urne est vide, scellée et chiffrée n'ont pas à intervenir immédiatement avant l'ouverture du scrutin.",
 fondement: ["L2314-26", "R2314-5"],
 juris: [A("19-23.533"), A("20-17.076"), A("22-21.249")],
 pieces: ["accord ou décision unilatérale", "cahier des charges du prestataire", "procès-verbaux de test et de scellement"],
 erreurs: ["Transposer les exigences du code électoral au vote électronique professionnel."] });

r({ id: "CSE-B-09", rubrique: "Élections",
 question: "Dans quel délai les élections peuvent-elles être contestées ?",
 si: f => f.contentieuxElectoral === true || f.electionsEnCours === true,
 alors: () => "Trois jours suivant la publication de la liste électorale pour l'électorat ; quinze jours suivant l'élection ou la désignation pour la régularité des opérations et la désignation des représentants syndicaux. La contestation des résultats qui procède d'une contestation du périmètre — lequel n'est pas un élément spécifique au premier tour — reste recevable dans les quinze jours du second tour.",
 fondement: ["R2314-24", "L2314-32"],
 juris: [A("20-17.286"), A("19-23.428"), A("23-19.384")],
 pieces: ["procès-verbaux datés", "preuve de la publication des listes électorales"],
 erreurs: ["Calculer le délai depuis la proclamation au lieu de l'élection."] });

r({ id: "CSE-B-10", rubrique: "Élections",
 question: "Quand des élections partielles sont-elles dues ?",
 si: f => typeof f.titulairesInitiaux === "number",
 alors: f => { const e = M.electionsPartielles(f); return e ? e.motif + " " + e.portee : ""; },
 fondement: ["L2314-10", "L2314-29"],
 juris: [A("21-60.183")],
 pieces: ["procès-verbal constatant les vacances", "dates de fin des mandats"],
 erreurs: ["Oublier que les élections partielles suivent les mêmes règles de représentation équilibrée."] });

/* ---------------- C · Attributions et consultations ---------------- */
r({ id: "CSE-C-01", rubrique: "Attributions",
 question: "Quelles attributions le comité exerce-t-il, compte tenu de l'effectif ?",
 si: f => typeof f.effectif === "number" && f.effectif >= 11,
 alors: f => { const a = M.attributions(f.effectif);
   return `Avec ${f.effectif} salariés, le régime applicable est : ${a.regime} (${a.texte}). Le franchissement du seuil de cinquante salariés ne produit ses effets qu'à l'expiration d'un délai de douze mois à compter de la date à laquelle il a été atteint pendant douze mois consécutifs.`; },
 fondement: ["L2312-1", "L2312-2", "L2312-5", "L2312-8"],
 juris: [], pieces: ["états d'effectif"],
 erreurs: ["Appliquer les attributions des entreprises d'au moins cinquante salariés dès le franchissement du seuil."] });

r({ id: "CSE-C-02", rubrique: "Consultations",
 question: "Sur quoi le comité doit-il être consulté ponctuellement ?",
 si: f => typeof f.effectif === "number" && f.effectif >= 50,
 alors: () => "Sur les questions intéressant l'organisation, la gestion et la marche générale de l'entreprise, notamment les mesures de nature à affecter le volume ou la structure des effectifs, la modification de l'organisation économique ou juridique, les conditions d'emploi et de travail, l'introduction de nouvelles technologies et tout aménagement important modifiant les conditions de santé et de sécurité. Cette consultation ponctuelle n'est pas subordonnée au respect préalable de la consultation sur les orientations stratégiques.",
 fondement: ["L2312-8", "L2312-37", "L2312-55"],
 juris: [A("20-23.660"), A("23-13.806"), A("21-11.935")],
 pieces: ["ordre du jour et convocation", "note d'information remise au comité", "procès-verbal"],
 erreurs: ["Décider avant de consulter : l'absence de consultation légalement obligatoire est un trouble manifestement illicite.",
   "Consulter le comité d'établissement sur un projet qui excède les pouvoirs du chef d'établissement."] });

r({ id: "CSE-C-03", rubrique: "Consultations",
 question: "De quel délai le comité dispose-t-il pour rendre son avis ?",
 si: f => typeof f.effectif === "number" && f.effectif >= 50,
 alors: f => { const d = M.delaiConsultation(f.consultation || {});
   return `${d.motif} Le délai court à compter de ${d.depart} (${d.depart_texte}). ${d.effet} Le comité doit disposer d'un délai d'examen suffisant, d'informations précises et écrites, et de la réponse motivée de l'employeur à ses observations ; s'il estime ne pas disposer d'éléments suffisants, il saisit le président du tribunal judiciaire.`; },
 fondement: ["L2312-15", "R2312-5", "R2312-6"],
 juris: [A("23-11.339"), A("21-17.729")],
 pieces: ["preuve de la remise des informations, datée", "accusé de mise à disposition dans la base de données"],
 erreurs: ["Faire courir le délai depuis la convocation au lieu de la remise des informations.",
   "Devant le président du tribunal statuant selon la procédure accélérée au fond, retenir la date du placement au lieu de celle de l'assignation."] });

r({ id: "CSE-C-04", rubrique: "Consultations",
 question: "Quelles sont les consultations récurrentes, et qu'un accord peut-il en faire ?",
 si: f => typeof f.effectif === "number" && f.effectif >= 50,
 alors: f => f.accordConsultations
   ? "Un accord d'entreprise peut définir le contenu, la périodicité et les modalités des trois consultations récurrentes, la liste des informations nécessaires, le nombre de réunions annuelles — qui ne peut être inférieur à six — et les niveaux auxquels les consultations sont conduites. L'accord versé doit être confronté à ces limites."
   : "À défaut d'accord, le comité est consulté chaque année sur les orientations stratégiques, sur la situation économique et financière et sur la politique sociale, les conditions de travail et l'emploi. Les deux premières sont conduites au niveau de l'entreprise, sauf décision contraire de l'employeur.",
 fondement: ["L2312-17", "L2312-19", "L2312-22", "L2312-26"],
 juris: [A("21-25.233"), A("21-25.748"), A("23-10.857")],
 pieces: ["accord sur les consultations récurrentes, s'il existe", "calendrier annuel des consultations"],
 erreurs: ["Fixer par accord moins de six réunions annuelles."] });

r({ id: "CSE-C-05", rubrique: "Attributions",
 question: "Le comité peut-il contester une clause d'accord collectif qui le prive d'une prérogative ?",
 si: () => true,
 alors: () => "Oui. Le comité est recevable à invoquer par voie d'exception, sans condition de délai, l'illégalité d'une clause d'un accord collectif aux motifs qu'elle viole ses droits propres résultant des prérogatives qui lui sont reconnues. Le délai de deux mois de l'article L. 2262-14 ne lui est donc pas opposable par cette voie. La solution est fondée sur le droit au recours juridictionnel effectif et sur la directive 2002/14.",
 fondement: ["L2312-8", "L2262-14"],
 juris: [A("20-20.077"), A("20-16.002"), A("20-18.442")],
 pieces: ["accord collectif contesté", "délibération du comité"],
 erreurs: ["Opposer au comité le délai de deux mois de l'action en nullité alors qu'il agit par voie d'exception."] });

r({ id: "CSE-C-06", rubrique: "Attributions",
 question: "Comment s'exerce le droit d'alerte économique ?",
 si: f => typeof f.effectif === "number" && f.effectif >= 50,
 alors: f => "Lorsque le comité a connaissance de faits de nature à affecter de manière préoccupante la situation économique de l'entreprise, il peut demander des explications à l'employeur ; la demande est inscrite de droit à l'ordre du jour de la prochaine séance. Dans les entreprises divisées en établissements distincts, ce droit appartient au comité central et non aux comités d'établissement, car il suppose une situation affectant l'entreprise."
   + (f.effectif >= 1000 ? " L'entreprise employant au moins mille salariés, le rapport est établi par la commission économique, à défaut d'accord." : ""),
 fondement: ["L2312-63", "L2315-46", "L2315-92"],
 juris: [A("21-13.312"), A("22-10.586")],
 pieces: ["demande d'explications", "ordre du jour de la séance", "rapport établi le cas échéant"],
 erreurs: ["Laisser un comité d'établissement exercer l'alerte économique."] });

/* ---------------- D · Base de données ---------------- */
r({ id: "CSE-D-01", rubrique: "Base de données",
 question: "Que doit contenir la base de données, et qui peut en demander l'accès ?",
 si: f => typeof f.effectif === "number" && f.effectif >= 50,
 alors: () => "En l'absence d'accord, le contenu de la base de données économiques, sociales et environnementales est celui que fixe le code. Les demandes relatives à l'accès à cette base et aux informations qu'elle contient, dont les membres du comité sont bénéficiaires, relèvent du régime de l'article L. 2312-59 : le membre de la délégation du personnel dispose d'une voie directe devant le juge.",
 fondement: ["L2312-18", "L2312-21", "L2312-36", "L2312-59", "R2312-9", "R2312-10"],
 juris: [A("24-10.326"), A("21-25.748"), A("20-17.186"), A("24-15.990")],
 pieces: ["base de données à jour", "traces d'accès accordés aux élus"],
 erreurs: ["Traiter une demande d'accès à la base comme une simple réclamation."] });

/* ---------------- E · Fonctionnement et moyens ---------------- */
r({ id: "CSE-E-01", rubrique: "Moyens",
 question: "Combien de réunions le comité doit-il tenir ?",
 si: f => typeof f.effectif === "number" && f.effectif >= 11,
 alors: f => { const u = M.reunions(f);
   return u.sourceAccord ? u.motif
     : `${u.motif} ${u.sante_motif} (${u.sante_texte}). Le comité est en outre réuni à la suite de tout accident ayant entraîné ou pu entraîner des conséquences graves, en cas d'événement grave lié à l'activité, ou à la demande motivée de deux de ses membres.`; },
 fondement: ["L2315-27", "L2315-28", "L2312-19"],
 juris: [], pieces: ["convocations et ordres du jour", "procès-verbaux"],
 erreurs: ["Compter les réunions santé et sécurité en dehors des réunions du comité : elles en font partie."] });

r({ id: "CSE-E-02", rubrique: "Moyens",
 question: "Qui dispose d'heures de délégation, et comment sont-elles payées ?",
 si: f => typeof f.effectif === "number" && f.effectif >= 11,
 alors: f => { const d = M.delegation(f.effectif);
   return (d.du ? `Chaque titulaire dispose de ${d.heures} heures par mois (${d.tranche}). ` : "")
     + "Le suppléant n'en dispose que s'il les tient de la mutualisation, du protocole préélectoral, ou du remplacement momentané d'un titulaire. Dans une entreprise divisée en établissements distincts, le nombre d'heures s'apprécie selon l'effectif de l'établissement. Le temps passé est de plein droit du temps de travail payé à l'échéance normale : l'employeur qui conteste son utilisation paie d'abord et saisit le juge ensuite."; },
 fondement: ["L2315-7", "L2315-9", "L2315-10", "R2314-1"],
 juris: [A("20-21.269"), A("20-16.333"), A("24-17.361"), A("19-22.038")],
 pieces: ["bons de délégation ou relevés d'heures", "bulletins de paie"],
 erreurs: ["Retenir les heures sur la paie avant toute décision du juge.",
   "Accorder d'office des heures aux suppléants."] });

r({ id: "CSE-E-03", rubrique: "Moyens",
 question: "Les élus peuvent-ils se déplacer et prendre les contacts nécessaires ?",
 si: f => typeof f.effectif === "number" && f.effectif >= 11,
 alors: () => "Pour l'exercice de leurs fonctions, les membres élus et les représentants syndicaux peuvent, durant les heures de délégation, se déplacer hors de l'entreprise ; ils peuvent également, durant ces heures et en dehors de leurs heures habituelles de travail, circuler librement dans l'entreprise et y prendre tous contacts nécessaires, sous réserve de ne pas apporter de gêne importante à l'accomplissement du travail.",
 fondement: ["L2315-14", "L2315-15"],
 juris: [A("22-22.145"), A("20-14.416")],
 pieces: [], erreurs: ["Subordonner le déplacement à une autorisation préalable."] });

r({ id: "CSE-E-04", rubrique: "Moyens",
 question: "Comment les résolutions du comité sont-elles adoptées ?",
 si: f => typeof f.effectif === "number" && f.effectif >= 50,
 alors: () => "À la majorité des membres présents. Le président ne participe pas au vote lorsqu'il consulte les membres élus en tant que délégation du personnel.",
 fondement: ["L2315-32"],
 juris: [], pieces: ["procès-verbaux mentionnant le décompte des voix"],
 erreurs: ["Faire voter le président sur une résolution prise en tant que délégation du personnel."] });

r({ id: "CSE-E-05", rubrique: "Moyens",
 question: "Quelles formations les élus reçoivent-ils ?",
 si: f => typeof f.effectif === "number" && f.effectif >= 11,
 alors: f => "Tous les membres de la délégation du personnel et le référent en matière de lutte contre le harcèlement sexuel bénéficient d'une formation en santé, sécurité et conditions de travail d'une durée minimale de cinq jours."
   + (f.effectif >= 50 ? " Dans les entreprises d'au moins cinquante salariés, les titulaires élus pour la première fois bénéficient en outre d'un stage de formation économique de cinq jours au maximum, financé par le comité." : ""),
 fondement: ["L2315-18", "L2315-63", "L2145-11"],
 juris: [], pieces: ["attestations de formation", "délibération de prise en charge"],
 erreurs: ["Faire supporter la formation économique par l'employeur : elle est financée par le comité."] });

/* ---------------- F · Commission santé, sécurité et conditions de travail ---------------- */
r({ id: "CSE-F-01", rubrique: "Santé et sécurité",
 question: "Une commission santé, sécurité et conditions de travail est-elle obligatoire ?",
 si: f => typeof f.effectif === "number",
 alors: f => { const c = M.cssct(f); return c.motif + (c.reserve ? " " + c.reserve : ""); },
 fondement: ["L2315-36", "L2315-37", "L2315-38"],
 juris: [], pieces: ["accord ou décision instituant la commission"],
 erreurs: ["Déléguer à la commission le recours à l'expert ou les attributions consultatives : le texte l'exclut."] });

r({ id: "CSE-F-02", rubrique: "Santé et sécurité",
 question: "Comment la commission est-elle composée et ses membres désignés ?",
 si: f => f.cssct === true || (typeof f.effectif === "number" && f.effectif >= 300),
 alors: () => "Elle est présidée par l'employeur et comprend au minimum trois représentants du personnel, dont au moins un du second collège ou, le cas échéant, du troisième. Ses membres sont désignés par le comité parmi ses membres, par une résolution adoptée à la majorité des membres présents, pour une durée qui prend fin avec le mandat des élus. Le comité ne peut pas les remplacer avant ce terme, hors les cas de fin anticipée de mandat. Les contestations de ces désignations relèvent du tribunal judiciaire dans le délai de quinze jours.",
 fondement: ["L2315-39", "L2315-32", "L2314-33", "R2314-24"],
 juris: [A("19-14.224"), A("24-12.295"), A("24-22.914"), A("23-20.714"), A("24-60.197")],
 pieces: ["résolution de désignation", "procès-verbal de la séance"],
 erreurs: ["Omettre le siège réservé au troisième collège là où il a été institué : la règle est d'ordre public.",
   "Remplacer un membre en cours de mandat hors les cas de l'article L. 2314-33."] });

/* ---------------- G · Budgets ---------------- */
r({ id: "CSE-G-01", rubrique: "Budgets",
 question: "Quelle subvention de fonctionnement l'employeur doit-il verser ?",
 si: f => typeof f.effectif === "number",
 alors: f => { const b = M.budgetFonctionnement(f.effectif, f.masseSalariale);
   if (!b.du) return b.motif;
   return `La subvention est de ${b.tauxTexte} de la masse salariale brute` + (b.montant !== null ? `, soit ${b.montant.toLocaleString("fr-FR")} euros pour la masse salariale déclarée` : ", la masse salariale n'étant pas renseignée")
     + `. Assiette : ${b.assiette} (${b.assiette_texte}). Cette subvention s'ajoute à la contribution aux activités sociales et culturelles.`; },
 fondement: ["L2315-61", "L2312-81", "L2312-83"],
 juris: [], pieces: ["déclarations sociales nominatives", "justificatifs de versement"],
 erreurs: ["Inclure dans l'assiette les indemnités versées à l'occasion de la rupture du contrat à durée indéterminée."] });

r({ id: "CSE-G-02", rubrique: "Budgets",
 question: "Comment se fixe la contribution aux activités sociales et culturelles ?",
 si: f => typeof f.effectif === "number" && f.effectif >= 50,
 alors: () => "Par accord d'entreprise. À défaut, le rapport de cette contribution à la masse salariale brute ne peut être inférieur au même rapport existant pour l'année précédente. Dans les entreprises comportant plusieurs comités d'établissement, le montant global est déterminé au niveau de l'entreprise et sa répartition fixée par accord. Le comité définit ses actions, mais l'ouverture du droit à en bénéficier ne peut être subordonnée à une condition d'ancienneté : tous les salariés et les stagiaires y ont vocation.",
 fondement: ["L2312-81", "L2312-82", "L2312-78", "R2312-35"],
 juris: [A("22-16.812"), A("25-10.126")],
 pieces: ["accord sur la contribution", "comptes du comité"],
 erreurs: ["Réserver les activités sociales aux salariés ayant une certaine ancienneté.",
   "Refuser à un élu l'accès aux archives et documents comptables du comité."] });

/* ---------------- H · Expertises ---------------- */
r({ id: "CSE-H-01", rubrique: "Expertises",
 question: "Dans quels cas le comité peut-il recourir à un expert, et qui paie ?",
 si: f => typeof f.effectif === "number" && f.effectif >= 50,
 alors: f => { const c = f.expertise && f.expertise.cas;
   const e = c ? M.financementExpertise(c) : null;
   if (!e) return "Le financement dépend du cas de recours : intégralement à la charge de l'employeur pour la consultation sur la situation économique et financière, sur la politique sociale, en cas de risque grave et en cas de licenciement collectif pour motif économique ; réparti à 80 % pour l'employeur et 20 % pour le comité sur son budget de fonctionnement pour la consultation sur les orientations stratégiques et les consultations ponctuelles ; intégralement à la charge du comité pour toute expertise libre.";
   return `Cas de recours : ${c} (${e.texte}). Financement : ` + (e.employeur === 100 ? "intégralement à la charge de l'employeur" : (e.comite === 100 ? "intégralement à la charge du comité, sur ses fonds" : `${e.employeur} % employeur, ${e.comite} % comité sur son budget de fonctionnement`)) + ` (${e.finance}).`; },
 fondement: ["L2315-78", "L2315-80", "L2315-81", "L2315-87", "L2315-88", "L2315-91", "L2315-92", "L2315-94"],
 juris: [A("21-23.393"), A("22-10.293"), A("19-23.589"), A("23-22.733"), A("21-23.427")],
 pieces: ["délibération désignant l'expert", "lettre de mission et cahier des charges"],
 erreurs: ["Refuser à l'expert désigné pour la situation économique et financière l'accès aux comptes du groupe.",
   "Faire supporter au comité une expertise que la loi met à la charge de l'employeur."] });

r({ id: "CSE-H-02", rubrique: "Expertises",
 question: "Dans quel délai l'employeur peut-il contester l'expertise ?",
 si: f => f.expertise !== undefined,
 alors: f => { const o = (f.expertise && f.expertise.objetContestation) || "nécessité";
   const c = M.contestationExpertise(o);
   if (!c) return "Le délai est de dix jours, le point de départ variant selon l'objet de la contestation.";
   return `Dix jours, à compter de ${c.depart} (${c.depart_texte}, R. 2315-49). ${c.computation} ${c.saisine} Le délai de contestation de la nécessité ne court qu'à compter du jour où l'employeur a été mis en mesure de connaître la délibération.`; },
 fondement: ["L2315-86", "R2315-49"],
 juris: [A("21-16.996"), A("22-10.761"), A("22-21.892"), A("24-12.816"), A("21-20.454")],
 pieces: ["délibération notifiée", "cahier des charges reçu, daté"],
 erreurs: ["Faire courir le délai du jour de la délibération alors que l'employeur n'en a pas été informé.",
   "Compter le premier jour du délai : il ne court qu'à compter du lendemain."] });

r({ id: "CSE-H-03", rubrique: "Expertises",
 question: "Une expertise est-elle ouverte en cas de licenciement collectif ?",
 si: f => typeof f.nbLicenciements === "number",
 alors: f => f.nbLicenciements >= 10
   ? "Dans les entreprises d'au moins cinquante salariés, lorsque le projet concerne au moins dix salariés dans une même période de trente jours, le comité peut décider de recourir à un expert-comptable ; les frais sont intégralement à la charge de l'employeur."
   : "Aucune mesure d'expertise n'est prévue lorsque le projet porte sur moins de dix salariés dans une même période de trente jours : la contestation par l'employeur d'une expertise décidée dans ce cas est sans objet légal.",
 fondement: ["L1233-34", "L2315-92", "L2315-80"],
 juris: [A("23-22.270"), A("25-13.280")],
 pieces: ["projet de licenciement", "délibération du comité"],
 erreurs: ["Décider une expertise sur le fondement de L. 1233-34 en deçà de dix licenciements."] });

/* ---------------- I · Comité central ---------------- */
r({ id: "CSE-I-01", rubrique: "Comité central",
 question: "Qui du comité central ou des comités d'établissement doit être consulté ?",
 si: f => f.etablissementsMultiples === true,
 alors: () => "Le comité central exerce les attributions qui concernent la marche générale de l'entreprise et excèdent les pouvoirs des chefs d'établissement ; il est seul consulté sur les projets décidés au niveau de l'entreprise qui ne comportent pas de mesures d'adaptation spécifiques à un ou plusieurs établissements. Le comité d'établissement a les mêmes attributions que celui d'entreprise, mais dans la limite des pouvoirs confiés au chef d'établissement, et il est consulté sur les mesures d'adaptation. Les contestations relatives au comité central relèvent du tribunal du siège de l'entreprise.",
 fondement: ["L2316-1", "L2316-20", "L2316-21", "L2316-8"],
 juris: [A("21-11.935"), A("22-21.239"), A("20-19.974"), A("24-14.344")],
 pieces: ["accord de répartition des sièges", "note de présentation du projet précisant son niveau"],
 erreurs: ["Consulter le seul comité central sur un projet comportant des mesures d'adaptation par établissement."] });

/* ---------------- J · Entrave ---------------- */
r({ id: "CSE-J-01", rubrique: "Entrave",
 question: "Que risque l'employeur en cas d'entrave ?",
 si: () => true,
 alors: () => "L'entrave à la constitution d'un comité, d'un comité d'établissement ou d'un comité central, ou à la libre désignation de leurs membres, notamment par la méconnaissance des articles L. 2314-1 à L. 2314-9, est punie d'un an d'emprisonnement et de 7 500 euros d'amende. L'entrave au fonctionnement régulier est punie de 7 500 euros d'amende. Aucun arrêt publié du corpus ne se rattache à ce texte : il n'y a donc pas de jurisprudence de référence à citer ici.",
 fondement: ["L2317-1"],
 juris: [], pieces: [],
 erreurs: ["Croire que l'absence de jurisprudence publiée récente vaut absence de risque pénal."] });

/* ---------------- K · Protection ---------------- */
r({ id: "CSE-K-01", rubrique: "Protection",
 question: "Qui est protégé, et pendant combien de temps ?",
 si: () => true,
 alors: () => "Bénéficient de la protection le délégué syndical, le membre élu de la délégation du personnel, le représentant syndical au comité, le représentant de proximité et les membres des instances de groupe et européennes, y compris pendant une procédure de sauvegarde, de redressement ou de liquidation judiciaire. Leur licenciement ne peut intervenir qu'après autorisation de l'inspecteur du travail. L'ancien élu et l'ancien représentant syndical désigné depuis deux ans non reconduits restent protégés pendant les six mois suivant l'expiration de leur mandat ou la disparition de l'institution.",
 fondement: ["L2411-1", "L2411-5"],
 juris: [A("23-12.990")],
 pieces: ["liste nominative des mandats en cours et échus depuis moins de six mois"],
 erreurs: ["Oublier le représentant de proximité, protégé au titre de l'article L. 2411-1, 4°."] });

r({ id: "CSE-K-02", rubrique: "Protection",
 question: "Qui peut être désigné représentant syndical au comité ?",
 si: f => typeof f.effectif === "number",
 alors: f => typeof f.effectif !== "number" ? "" : (f.effectif < 300
   ? "Dans les entreprises de moins de trois cents salariés et dans les établissements qui en relèvent, le délégué syndical est de droit représentant syndical au comité : la désignation d'un représentant distinct n'est pas ouverte."
   : "Dans les entreprises de plus de trois cents salariés, un représentant syndical distinct du délégué syndical peut être désigné. Cette prérogative est réservée aux organisations reconnues représentatives dans l'entreprise ou l'établissement ; le représentant de section syndicale n'y a pas droit.")
   + " Un même salarié ne peut siéger dans le même comité à la fois comme élu et comme représentant syndical, les fonctions délibératives et consultatives étant inconciliables.",
 fondement: ["L2143-22", "L2314-2", "L2143-3", "L2143-6"],
 juris: [A("25-17.467"), A("23-18.331"), A("20-13.694"), A("20-20.397"), A("18-23.764"), A("19-13.269")],
 pieces: ["lettres de désignation", "résultats du premier tour par organisation"],
 erreurs: ["Admettre la désignation d'un représentant syndical distinct dans une entreprise de moins de trois cents salariés.",
   "Laisser un élu cumuler son mandat avec celui de représentant syndical au même comité."] });

r({ id: "CSE-K-03", rubrique: "Protection",
 question: "À quelles conditions un délégué syndical peut-il être désigné ?",
 si: () => true,
 alors: () => "Le délégué syndical est choisi parmi les candidats ayant recueilli au moins 10 % des suffrages exprimés au premier tour des dernières élections des titulaires. Le syndicat peut désigner un candidat présenté sur la liste d'un autre syndicat qui l'accepte librement. Lorsque tous les élus ou candidats qualifiés ont renoncé, il peut désigner un adhérent ou un ancien élu, la renonciation devant être établie. L'annulation de l'élection prononcée au titre de la représentation équilibrée est sans effet sur la condition de score personnel.",
 fondement: ["L2143-3", "L2143-4", "L2143-6", "L2122-1"],
 juris: [A("18-19.379"), A("19-14.605"), A("19-24.678"), A("21-23.348"), A("20-17.688"), A("21-17.916")],
 pieces: ["procès-verbaux du premier tour avec les scores nominatifs", "lettres de renonciation"],
 erreurs: ["Refuser la désignation d'un candidat au motif qu'il figurait sur la liste d'un autre syndicat.",
   "Tirer de l'annulation d'une élection au titre de la parité la perte du score personnel de 10 %."] });

module.exports = G;
if (require.main === module) {
  console.log(`${G.length} règles · ${G.reduce((n, x) => n + x.juris.length, 0)} références de jurisprudence · ` +
    `${new Set(G.flatMap(x => x.fondement)).size} articles distincts cités`);
}
