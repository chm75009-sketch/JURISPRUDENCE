/* La grille — licenciement économique. Chaque règle est une fiche autonome :
   une condition, une conséquence, un fondement, une jurisprudence, des pièces,
   des erreurs. Rien ne peut être écrit dans un audit qui ne vienne d'ici. */
const M = require("./moteur.js");
const A = (num, date, ch, portee, apport) => ({ num, date, ch, portee, apport });

const R = [
/* ===================== SOCLE ===================== */
{id:"SOC-01", rubrique:"Socle · qualification",
 question:"Le licenciement envisagé est-il un licenciement pour motif économique ?",
 si:f=>true,
 alors:f=>`Trois conditions cumulatives : un motif non inhérent à la personne du salarié ; une conséquence sur l'emploi — suppression, transformation, ou modification refusée d'un élément essentiel du contrat ; et l'une des quatre causes de l'article. Il faut en outre que la conséquence sur l'emploi soit « consécutive » à la cause : c'est le maillon le plus souvent manquant.`,
 fondement:["L. 1233-3, alinéa 1er","L. 1233-2"],
 juris:[A("10-10.110","2011-02-16","soc.","toujours valable","La lettre qui « ne faisait état que d'une baisse d'activité, sans autre précision » ne satisfait pas à l'exigence légale."),
        A("15-11.046","2016-05-03","soc.","toujours valable","La lettre mentionnant la suppression de l'emploi « consécutive à la réorganisation justifiée par des difficultés économiques » répond aux exigences.")],
 pieces:["Organigramme nominatif avant et après","Note de causalité poste par poste","Lettre de licenciement"],
 erreurs:["Établir la difficulté et la suppression sans écrire le lien entre les deux"], valeur:"consacré par la loi"},

{id:"SOC-02", rubrique:"Socle · périmètre",
 question:"À quel niveau la cause économique s'apprécie-t-elle ?",
 si:f=>true,
 alors:f=>{const p=M.perimetre(f);
   return `La cause s'apprécie au niveau de ${p.niveau}. ${p.motif}`+
     (p.exclusions&&p.exclusions.length?` Sont exclues du périmètre, faute d'être établies sur le territoire national : ${p.exclusions.join(", ")}.`:"")+
     ` La matérialité de la suppression, elle, s'apprécie toujours au niveau de l'entreprise.`;},
 fondement:["L. 1233-3","L. 233-1, L. 233-3 I et II et L. 233-16 du code de commerce, par renvoi"],
 juris:[A("11-13.736","2012-06-26","soc.","toujours valable","La cause s'apprécie au niveau de l'entreprise ou du secteur d'activité du groupe, « mais jamais à un niveau inférieur à celui de l'entreprise »."),
        A("19-26.054","2021-03-31","soc.","toujours valable","« Il incombe à l'employeur de démontrer, dans le périmètre pertinent, la réalité et le sérieux du motif invoqué. » L'étendue du secteur relève de l'appréciation souveraine."),
        A("23-15.503","2024-06-26","soc.","toujours valable","La spécialisation ne suffit pas à exclure le rattachement à un secteur plus étendu ; faisceau d'indices : nature des produits, clientèle ciblée, réseaux et modes de distribution."),
        A("07-45.668","2009-06-23","soc.","dépassé sur un point","Disait que l'implantation dans un pays différent ne suffit pas à exclure le rattachement ; la limite territoriale de 2017 a renversé ce membre de phrase."),
        A("22-12.201","2026-03-18","soc.","toujours valable","Une société de gestion de fonds exerçant les droits de vote n'est pas une entreprise en contrôlant d'autres : les participations du fonds sont hors périmètre.")],
 pieces:["Organigramme capitalistique daté","Note de définition du secteur d'activité","Comptes de chaque société du secteur"],
 erreurs:["Apprécier au niveau de l'établissement ou du service","Retenir un périmètre étroit au motif de la spécialisation","Produire les comptes de la seule entreprise alors qu'elle appartient à un groupe"],
 valeur:"valable, sauf sur la limite territoriale"},

{id:"SOC-03", rubrique:"Socle · date",
 question:"À quelle date le motif s'apprécie-t-il ?",
 si:f=>true,
 alors:f=>`À la date du licenciement. Des éléments postérieurs peuvent éclairer cette appréciation, mais ne la déplacent pas. Une situation comptable à la date la plus proche de la notification est donc requise : un dossier bâti sur la clôture précédente laisse un intervalle sans preuve.`,
 fondement:["L. 1233-3"],
 juris:[A("00-40.898","2002-03-26","soc.","toujours valable","« Si le motif économique devait s'apprécier à la date du licenciement, il pouvait être tenu compte d'éléments postérieurs pour cette appréciation. »"),
        A("99-43.999","2001-10-02","soc.","toujours valable","Des difficultés « sensiblement diminué[es] » au jour du licenciement ne suffisent plus.")],
 pieces:["Situation comptable intermédiaire à la date la plus proche de la notification"],
 erreurs:["Dater la difficulté du jour où le projet a été conçu"], valeur:"toujours valable"},

{id:"SOC-04", rubrique:"Socle · état du texte",
 question:"Quelle version de l'article L. 1233-3 s'applique ?",
 si:f=>!!f.dateNotification,
 alors:f=>{const e=M.etatTexte(f.dateNotification);
   return `Version « ${e.etat} » : ${e.contenu}. Les arrêts rendus sous une version antérieure ne valent que pour ce que la réforme n'a pas modifié.`;},
 fondement:["L. 1233-3, versions LEGIARTI000019071191, LEGIARTI000033024152, LEGIARTI000035643769 puis 36261870"],
 juris:[], pieces:[], erreurs:["Invoquer un arrêt antérieur à 2016 sur les indicateurs chiffrés ou les seuils"], valeur:"—"},

{id:"SOC-05", rubrique:"Socle · reclassement",
 question:"Quelle est l'étendue de l'obligation de reclassement ?",
 si:f=>true,
 alors:f=>`Le licenciement ne peut intervenir que lorsque tous les efforts de formation et d'adaptation ont été réalisés et que le reclassement ne peut être opéré sur les emplois disponibles situés sur le territoire national, dans l'entreprise ou les entreprises du groupe assurant la permutation de tout ou partie du personnel.`+
   (f.groupe?` L'entreprise appartenant à un groupe, la recherche doit couvrir chacune des sociétés françaises.`:` L'entreprise n'appartenant à aucun groupe, la recherche est limitée à l'entreprise — l'absence de groupe doit néanmoins être établie.`),
 fondement:["L. 1233-4"],
 juris:[A("13-12.048","2014-07-02","soc.","toujours valable","« Il n'y a pas de manquement à l'obligation de reclassement si l'employeur justifie de l'absence de poste disponible, à l'époque du licenciement. » L'absence de poste se prouve."),
        A("13-12.535","2014-12-09","soc.","toujours valable","Cessation totale et absence de groupe : la suppression de tous les postes emporte l'impossibilité du reclassement.")],
 pieces:["État daté de tous les postes disponibles, y compris ceux non proposés et le motif de leur exclusion","Offres écrites et réponses","Attestation d'absence de poste disponible"],
 erreurs:["Affirmer l'absence de poste sans l'établir","Ne produire que les postes proposés"], valeur:"modifié dans son périmètre depuis 2017"},

{id:"SOC-06", rubrique:"Socle · ordre des licenciements",
 question:"Les critères d'ordre s'appliquent-ils ?",
 si:f=>true,
 alors:f=>{const conv=f.convention&&f.convention.criteresOrdre;
  return (conv
   ? `La convention collective fixe des critères d'ordre : ils s'appliquent, à l'exclusion des critères légaux — l'article L. 1233-5 ne joue qu'« en l'absence de convention ou accord collectif de travail applicable ».`
   : `La convention collective ne fixant pas de critères, ceux de l'article L. 1233-5 s'appliquent : charges de famille, ancienneté, caractéristiques sociales rendant la réinsertion difficile, qualités professionnelles appréciées par catégorie. L'employeur peut en privilégier un, à condition de tenir compte de tous les autres.`)
   + (f.nbLicenciements<=1
   ? ` Le licenciement étant individuel, les critères s'appliquent néanmoins dès que plusieurs salariés relèvent de la même catégorie professionnelle.`
   : ``)
   + ` Sur demande écrite du salarié, les critères retenus doivent lui être indiqués par écrit.`;},
 fondement:["L. 1233-5","L. 1233-7","L. 1233-17"],
 juris:[A("17-18.136","2020-02-26","soc.","toujours valable","L'existence d'un préjudice résultant de l'inobservation des règles d'ordre et son évaluation relèvent du pouvoir souverain des juges du fond.")],
 pieces:["Relevé des clauses de la convention, daté avant la consultation","Grille des critères, barème et classement par salarié"],
 erreurs:["Appliquer les critères légaux sans avoir lu la convention","Négliger les critères parce qu'un seul salarié est licencié"],
 valeur:"toujours valable"},

{id:"SOC-07", rubrique:"Socle · lettre",
 question:"Que doit contenir la lettre de licenciement ?",
 si:f=>true,
 alors:f=>`Elle doit énoncer la cause économique et son incidence sur l'emploi ou le contrat du salarié — les deux, et non l'une des deux — et mentionner la priorité de réembauche et ses conditions de mise en œuvre. Depuis l'ordonnance du 22 septembre 2017, les motifs peuvent être précisés après la notification, et à défaut de demande du salarié une insuffisance de motivation n'ouvre plus, à elle seule, qu'une indemnité plafonnée à un mois de salaire.`,
 fondement:["L. 1233-16","L. 1233-45","L. 1235-2"],
 juris:[A("00-40.214","2002-06-11","soc.","dépassé sur sa sanction","La lettre doit comporter l'énonciation de la cause « mais également l'énonciation des incidences de ces éléments sur l'emploi ou le contrat de travail ». La sanction de l'imprécision a changé en 2017."),
        A("11-14.223","2012-03-27","soc.","toujours valable","La lettre faisant état de la cause et indiquant qu'elle entraîne une suppression, une transformation ou une modification est suffisamment motivée.")],
 pieces:["Lettre de licenciement"],
 erreurs:["Énoncer la cause sans son incidence sur l'emploi","Omettre la mention de la priorité de réembauche"],
 valeur:"exigence maintenue, sanction dépassée"},

{id:"SOC-08", rubrique:"Socle · procédure",
 question:"Quel régime de procédure s'applique, et quels documents transmettre ?",
 si:f=>f.nbLicenciements!==undefined,
 alors:f=>{const r=M.regimeEco(f);
  return `Régime : ${r.libelle}. Consultation du comité social et économique : ${r.consultationCSE?"oui":"non"}${r.note?" — "+r.note:""}.`+
   (r.consultationCSE?` Réunions : ${r.reunions}. Avis : ${r.delaiAvis}. Documents joints à la convocation : ${r.documents}.`:"")+
   ` Plan de sauvegarde de l'emploi : ${r.pse?"obligatoire, avec validation ou homologation administrative":"non dû"}.`;},
 fondement:["L. 1233-8","L. 1233-10","L. 1233-28","L. 1233-29","L. 1233-30","L. 1233-31","L. 1233-32","L. 1233-61","L. 1233-57-3"],
 juris:[A("18-23.692","2020-03-25","soc.","toujours valable","Le juge judiciaire n'est pas compétent pour se prononcer sur le contenu du plan de sauvegarde de l'emploi, qui relève de l'administration sous le contrôle du juge administratif.")],
 pieces:["Convocation avec décharge","Les sept renseignements","Procès-verbaux de réunion"],
 erreurs:["Remettre les renseignements en séance au lieu de les joindre à la convocation","Notifier avant la décision de validation ou d'homologation"],
 valeur:"—"},

{id:"SOC-09", rubrique:"Socle · calendrier",
 question:"Quels délais individuels respecter ?",
 si:f=>!!f.dateEntretien,
 alors:f=>{const c=M.calendrier(f);
  return `Entretien préalable le ${c.entretien}, la convocation devant être présentée au moins cinq jours ouvrables avant. Notification au plus tôt le ${c.notificationAuPlusTot} — délai de ${c.delaiApplique}. Un délai conventionnel plus favorable au salarié prime.`;},
 fondement:["L. 1233-11","L. 1233-13","L. 1233-15","L. 1233-39"],
 juris:[], pieces:["Convocation à l'entretien préalable","Compte rendu d'entretien"],
 erreurs:["Notifier avant l'expiration du délai","Omettre la mention du conseiller extérieur en l'absence d'institutions représentatives"],
 valeur:"—"},

{id:"SOC-10", rubrique:"Socle · accompagnement",
 question:"Quel dispositif d'accompagnement proposer ?",
 si:f=>true,
 alors:f=>{const a=M.accompagnement(f);
  return `Dispositif dû : ${a.type}. ${a.motif} ${a.motifEcart} `+
   `Il est proposé lors de l'entretien préalable ou à l'issue de la dernière réunion des représentants du personnel${M.regimeEco(f).pse?", et, lorsqu'un plan de sauvegarde de l'emploi est établi, après la notification par l'autorité administrative de sa décision de validation ou d'homologation":""}.`+
   (a.incertain?` RÉSERVE : l'effectif total du groupe n'étant pas renseigné, la conclusion vaut sous réserve de sa vérification.`:``);},
 fondement:f=>{const a=M.accompagnement(f);
  return [`${a.texte} — texte appliqué`, `${a.ecarte} — écarté, ${a.motifEcart.charAt(0).toLowerCase()+a.motifEcart.slice(1)}`];},
 juris:[], pieces:["Proposition remise contre décharge, avec énoncé du motif économique"],
 erreurs:["Omettre l'énoncé du motif dans le document remis avec la proposition : en cas d'adhésion, il n'y a pas de lettre de licenciement"],
 valeur:"—"},

{id:"SOC-11", rubrique:"Socle · accord de performance collective",
 question:"Le licenciement suit-il le refus d'un accord de performance collective ?",
 si:f=>f.refusAPC===true,
 alors:f=>`Ce licenciement n'est pas un licenciement économique. Il « repose sur un motif spécifique qui constitue une cause réelle et sérieuse » et suit la seule procédure du licenciement individuel. L'employeur dispose de deux mois à compter de la notification du refus pour l'engager. Ni critères d'ordre, ni plan de sauvegarde de l'emploi, ni contrat de sécurisation professionnelle à ce titre.`,
 fondement:["L. 2254-2, III, IV et V","L. 1232-2 à L. 1232-14"],
 juris:[A("23-23.231","2025-09-10","soc.","toujours valable","Il appartient au juge d'apprécier le caractère réel et sérieux du motif au regard de la convention n° 158 de l'Organisation internationale du travail.")],
 pieces:["Accord de performance collective","Information des salariés avec date certaine","Refus écrit du salarié"],
 erreurs:["Traiter ce licenciement comme économique","Le croire soustrait à tout contrôle"],
 valeur:"—"},

/* Le co-emploi n'était énoncé nulle part dans la grille : seul un contrôle de
   détection le mentionnait, et avec la moitié de la formule. */
{id:"COE-01", rubrique:"Groupe · co-emploi",
 question:"À quelles conditions une société du groupe peut-elle être qualifiée de coemployeur ?",
 si:f=>f.groupe===true,
 alors:()=>"Hors l'existence d'un lien de subordination, une société faisant partie d'un groupe ne peut être qualifiée de coemployeur du personnel employé par une autre que s'il existe, au-delà de la nécessaire coordination des actions économiques entre les sociétés du groupe et de l'état de domination économique que cette appartenance peut engendrer, une immixtion permanente de cette société dans la gestion économique et sociale de la société employeur, conduisant à la perte totale d'autonomie d'action de cette dernière. Les deux conditions sont cumulatives : l'immixtion permanente, et la perte totale d'autonomie. La coordination économique et la domination, à elles seules, ne suffisent jamais.",
 fondement:["L. 1221-1"],
 juris:[A("18-13.769","2020-11-25","soc.","toujours valable",
   "Formule actuelle du co-emploi. Publié au Bulletin et au Rapport annuel, formation plénière de chambre.")],
 pieces:["Organigramme fonctionnel et capitalistique","Délégations de pouvoir du dirigeant de la filiale",
   "Conventions de trésorerie, de prestations de services et de marque",
   "Comptes rendus des instances de direction de la filiale"],
 erreurs:["Retenir le co-emploi de la seule domination économique de la mère.",
   "S'arrêter à la confusion d'intérêts, d'activités et de direction : c'est la première moitié de la formule, et elle ne suffit pas.",
   "Confondre le co-emploi avec la responsabilité délictuelle de la mère, qui obéit à d'autres conditions."],
 valeur:"principe", source:"rédigée"},

/* Le seuil de dix ne se lit pas sur le projet mais sur une fenêtre de temps,
   et deux textes distincts l'étendent. La grille ne l'énonçait nulle part. */
{id:"SEU-01", rubrique:"Socle · seuil de dix",
 question:"Comment se compte le seuil de dix licenciements ?",
 si:f=>typeof f.nbLicenciements==="number",
 alors:f=>{const c=require("./moteur.js").comptes30j(f);
   return "Le seuil de dix ne se compte pas sur le projet mais sur « une même période de trente jours » : les licenciements économiques déjà prononcés dans cette fenêtre s'y ajoutent. "
    + c.motif + (c.motifRefus ? " " + c.motifRefus : "")
    + " Deux extensions s'y ajoutent : à partir de dix refus de modification d'un élément essentiel du contrat, le licenciement de ces salariés relève du régime collectif (L. 1233-25) ; et lorsqu'une entreprise d'au moins cinquante salariés a prononcé plus de dix licenciements économiques sur trois mois consécutifs sans jamais atteindre dix sur trente jours, tout nouveau licenciement des trois mois suivants relève du même régime (L. 1233-26).";},
 fondement:["L. 1233-8","L. 1233-25","L. 1233-26","L. 1233-28","L. 1233-61"],
 juris:[],
 pieces:["Registre des entrées et sorties sur les trois derniers mois",
   "Lettres de proposition de modification et réponses des salariés",
   "Notifications de licenciement économique des trois derniers mois"],
 erreurs:["Compter le seuil sur le seul projet, en ignorant les licenciements déjà prononcés dans les trente jours.",
   "Additionner les refus de modification aux autres licenciements : l'article L. 1233-25 exige dix refus, il ne les cumule pas.",
   "Fractionner un projet en séries successives de moins de dix : l'article L. 1233-26 y fait échec."],
 valeur:"principe", source:"rédigée"},

/* Le jour de l'expiration lui-même : un arbitrage, non un signe de comparaison.
   Il est écrit ici pour être discuté, et non enfoui dans un « < ». */
{id:"AVI-01", rubrique:"Procédure · avis du comité",
 question:"Que vaut une notification faite le jour même de l'expiration du délai d'avis ?",
 si:f=>typeof f.nbLicenciements==="number"&&f.nbLicenciements>1,
 alors:f=>{const r=M.regimeEco(f); const mois=M.delaiAvisMois(r);
   const dep=Array.isArray(f.datesReunionsCSE)&&f.datesReunionsCSE.length?[...f.datesReunionsCSE].sort()[0]:null;
   const exp=dep&&mois?M.ajouteMois(dep,mois):null;
   return "À défaut d'avis rendu, le comité est réputé avoir été consulté « à l'expiration » du délai. "
    + (exp?`Ici, le délai de ${r.delaiAvis} court depuis la première réunion du ${dep} et expire le ${exp}. `:"")
    + "Le texte ne dit pas si le jour de l'expiration est compris ou non. Deux lectures se soutiennent : le délai s'achève à la fin de ce jour, et notifier le matin même serait prématuré ; ou l'expiration est acquise dès l'entrée dans ce jour. "
    + "La base ne tranche pas et ne le fera pas tant qu'aucun arrêt publié ne le fera : elle traite la notification antérieure comme irrégulière, et la notification du jour même comme un risque signalé, en recommandant de décaler d'un jour. Ce décalage supprime la difficulté sans rien coûter.";},
 fondement:["L. 1233-30, II","L. 1233-8"],
 juris:[],
 pieces:["Convocations et procès-verbaux des réunions, datés","Preuve de la remise des informations au comité"],
 erreurs:["Notifier le jour même de l'expiration en croyant le délai acquis : la question n'est pas réglée.",
   "Faire courir le délai depuis la convocation au lieu de la première réunion.",
   "Retenir comme première réunion la première de la liste plutôt que la plus ancienne."],
 valeur:"arbitrage", source:"rédigée"},
];

/* ===================== CAUSE 1 ===================== */
R.push(
{id:"ECO-1-01", rubrique:"1° Difficultés économiques",
 question:"Comment les difficultés économiques se caractérisent-elles ?",
 si:f=>f.cause==="1",
 alors:f=>`Deux voies, toutes deux ouvertes. Soit « l'évolution significative d'au moins un indicateur économique tel qu'une baisse des commandes ou du chiffre d'affaires, des pertes d'exploitation ou une dégradation de la trésorerie ou de l'excédent brut d'exploitation » — le « tel que » ouvre la liste. Soit « tout autre élément de nature à justifier de ces difficultés », qui n'exige aucun indicateur.`,
 fondement:["L. 1233-3, 1°"],
 juris:[A("20-19.661","2023-02-01","soc.","toujours valable","Reprise du texte : l'évolution significative d'au moins un indicateur suffit."),
        A("22-18.852","2023-10-18","soc.","toujours valable","Censure de l'arrêt qui valide sans caractériser l'indicateur.")],
 pieces:["Comptes annuels des trois derniers exercices, société et secteur"],
 erreurs:["Croire la liste des indicateurs limitative"], valeur:"état actuel du droit"},

{id:"ECO-1-02", rubrique:"1° Difficultés économiques",
 question:"Le seuil trimestriel est-il atteint ?",
 /* Le seuil trimestriel chiffré est né le 1er décembre 2016 : il ne peut pas
    être opposé à un licenciement notifié avant. */
 si:f=>f.cause==="1"&&Array.isArray(f.trimestres)&&f.trimestres.length>0
   &&(!f.dateNotification||f.dateNotification>="2016-12-01"),
 alors:f=>{const b=M.baisseTrimestrielle(f);
  const d=b.detail.map(x=>`${x.libelle} ${(x.ecart*100).toFixed(1)} %`).join(" · ");
  return `Effectif ${f.effectif} — tranche « ${b.tranche} » : ${b.seuilRequis} trimestre(s) consécutif(s) requis. Constatés : ${b.trimestresConsecutifs}. ${b.atteint?"Le seuil est ATTEINT.":"Le seuil n'est PAS atteint."} Détail : ${d}. La comparaison porte sur le même trimestre de l'année précédente, et non d'exercice à exercice.`;},
 fondement:["L. 1233-3, 1° a) à d)"],
 juris:[A("20-19.957","2022-06-01","soc.","méthode imposée","La durée « s'apprécie en comparant le niveau des commandes ou du chiffre d'affaires au cours de la période contemporaine de la notification par rapport à celui de l'année précédente à la même période ».")],
 pieces:["Tableau trimestriel comparé","Déclarations de taxe sur la valeur ajoutée mensuelles","Attestation de l'expert-comptable sur la méthode"],
 erreurs:["Comparer d'exercice à exercice","Choisir des trimestres non consécutifs"],
 valeur:"état actuel du droit"},

{id:"ECO-1-03", rubrique:"1° Difficultés économiques",
 question:"Que faire si le seuil n'est pas atteint ?",
 si:f=>f.cause==="1"&&Array.isArray(f.trimestres)&&f.trimestres.length>0&&!M.baisseTrimestrielle(f).atteint,
 alors:f=>`Le dossier n'est pas perdu. Lorsque l'indicateur chiffré n'est pas établi, le juge doit rechercher si les difficultés sont caractérisées par un autre indicateur — pertes d'exploitation, dégradation de la trésorerie ou de l'excédent brut d'exploitation — ou par tout autre élément. Ces indicateurs doivent donc être documentés au dossier.`,
 fondement:["L. 1233-3, 1°"],
 juris:[A("20-18.511","2022-09-21","soc.","toujours valable","« Il appartient au juge, au vu de l'ensemble des éléments versés au dossier, de rechercher si les difficultés économiques sont caractérisées par l'évolution significative d'au moins un des autres indicateurs […] ou tout autre élément. »")],
 pieces:["Compte de résultat détaillé","Tableau de trésorerie et excédent brut d'exploitation","Note sur les autres éléments invoqués"],
 erreurs:["Abandonner la cause au seul motif que le seuil n'est pas atteint"],
 valeur:"état actuel du droit"},

{id:"ECO-1-04", rubrique:"1° Difficultés économiques",
 question:"Les difficultés peuvent-elles être imputables à l'employeur ?",
 si:f=>f.cause==="1"||f.cause==="4",
 alors:f=>`L'employeur ne peut se prévaloir de difficultés qu'il a lui-même provoquées par sa faute ou sa légèreté blâmable. Mais le juge ne peut déduire la faute de la seule absence de difficultés, ni l'absence de faute de leur existence : les deux questions se démontrent séparément.`,
 fondement:[],
 juris:[A("10-30.045","2011-02-01","soc.","toujours valable","Le juge ne peut déduire la faute de la seule absence de difficultés ni l'inverse, mais peut prendre en compte la situation économique pour apprécier le comportement de l'employeur."),
        A("19-12.025","2021-03-17","soc.","toujours valable","La construction est maintenue après confrontation au droit de l'Union.")],
 pieces:["Chronologie documentée des causes","Recherches de solution alternative et leurs échecs"],
 erreurs:["Laisser croire que la difficulté résulte d'un choix de gestion non expliqué"],
 valeur:"toujours valable"});

/* ===================== CAUSE 2 ===================== */
R.push(
{id:"ECO-2-01", rubrique:"2° Mutations technologiques",
 question:"Faut-il prouver des difficultés économiques ?",
 si:f=>f.cause==="2",
 alors:f=>`Non. La mutation technologique est une cause autonome : elle n'exige la preuve d'aucune difficulté, ni d'aucune menace sur la compétitivité. Aucun arrêt publié ne la définit ; la Cour en a seulement fixé la place parmi les quatre causes.`,
 fondement:["L. 1233-3, 2°"],
 juris:[A("99-43.342","2001-07-11","soc.","toujours valable","Le licenciement doit être consécutif à l'une des quatre causes ; la réorganisation non justifiée par des difficultés ou des mutations technologiques doit être indispensable à la sauvegarde de la compétitivité."),
        A("07-41.953","2008-12-16","soc.","toujours valable","Même formule, sous l'ancien texte.")],
 pieces:["Cahier des charges du changement","Factures et procès-verbal de mise en service","Étude d'impact poste par poste"],
 erreurs:["Ajouter à la loi en exigeant des difficultés","Qualifier de mutation technologique un simple changement d'organisation"],
 valeur:"état actuel du droit, nourri d'avant 2016"},

{id:"ECO-2-02", rubrique:"2° Mutations technologiques",
 question:"Quelle est la contrepartie de cette dispense ?",
 si:f=>f.cause==="2",
 alors:f=>`L'obligation d'adaptation. Le licenciement ne peut intervenir que lorsque tous les efforts de formation et d'adaptation ont été réalisés. C'est le terrain sur lequel le litige se noue : proposition nominative, programme daté, prise en charge, et conservation des refus écrits.`,
 fondement:["L. 1233-4"],
 juris:[],
 pieces:["Plan de formation et propositions nominatives","Réponses et refus écrits","Tableau de suivi des propositions et des suites"],
 erreurs:["Licencier sans avoir proposé de formation","Ne pas proposer en priorité les postes créés par la mutation"],
 valeur:"toujours valable"});

/* ===================== CAUSE 3 ===================== */
R.push(
{id:"ECO-3-01", rubrique:"3° Sauvegarde de la compétitivité",
 question:"Que faut-il démontrer ?",
 si:f=>f.cause==="3",
 alors:f=>`Une menace, non une difficulté déjà réalisée. La réorganisation est un motif économique autonome, mais si elle n'est justifiée ni par des difficultés ni par des mutations technologiques, elle doit être indispensable à la sauvegarde de la compétitivité de l'entreprise ou du secteur d'activité du groupe.`,
 fondement:["L. 1233-3, 3°"],
 juris:[A("00-44.007","2002-09-24","soc.","toujours valable","« La réorganisation de l'entreprise constitue un motif économique autonome », le juge vérifiant qu'elle était destinée à sauvegarder la compétitivité."),
        A("99-43.342","2001-07-11","soc.","toujours valable","Elle doit être « indispensable à la sauvegarde de la compétitivité de l'entreprise ou du secteur d'activité du groupe ».")],
 pieces:["Note stratégique datée exposant la menace","Pièces établissant l'événement extérieur","Étude comparative de compétitivité"],
 erreurs:["Présenter la réorganisation comme un gain de rentabilité"],
 valeur:"état actuel du droit, nourri d'avant 2016"},

{id:"ECO-3-02", rubrique:"3° Sauvegarde de la compétitivité",
 question:"Quelle est la limite à ne pas franchir ?",
 si:f=>f.cause==="3",
 alors:f=>`La recherche de rentabilité. La réorganisation « qui répond moins à une nécessité économique qu'à une volonté de l'employeur de privilégier le niveau de rentabilité au détriment de la stabilité de l'emploi », décidée « dans l'unique but de supprimer les emplois permanents », n'est pas une cause valable. Le dossier doit donc comporter un scénario de référence : ce qu'il advient si rien n'est fait.`,
 fondement:[],
 juris:[A("98-42.746","1999-12-01","soc.","toujours valable","Formule de référence sur la réorganisation de pure rentabilité.")],
 pieces:["Projections chiffrées avec et sans réorganisation","Alternatives examinées et écartées, chacune chiffrée"],
 erreurs:["Écrire que la réorganisation améliorera la rentabilité","Ne pas construire de scénario de référence"],
 valeur:"toujours valable"});

/* ===================== CAUSE 4 ===================== */
R.push(
{id:"ECO-4-01", rubrique:"4° Cessation d'activité",
 question:"La cessation invoquée est-elle complète ?",
 si:f=>f.cause==="4",
 alors:f=>(f.cessationComplete===false
  ? `NON — cessation partielle. Elle ne justifie un licenciement économique qu'en cas de difficultés économiques, de mutation technologique ou de réorganisation nécessaire à la sauvegarde de la compétitivité. Il faut donc se replier sur le 1°, le 2° ou le 3° et en fournir la preuve, peu important que la fermeture résulte de la décision d'un tiers.`
  : `La cessation doit être complète et définitive pour constituer en elle-même une cause. Fermer un établissement, abandonner une branche ou arrêter un site n'entre pas dans le 4°.`),
 fondement:["L. 1233-3, 4°"],
 juris:[A("15-21.183","2017-03-23","soc.","toujours valable","« Seule une cessation complète de l'activité de l'employeur peut constituer en elle-même une cause économique de licenciement […]. Une cessation partielle ne justifie un licenciement économique qu'en cas de difficultés économiques, de mutation technologique ou de réorganisation nécessaire à la sauvegarde de sa compétitivité, peu important que la fermeture d'un établissement résulte de la décision d'un tiers. »")],
 pieces:["Décision de cessation","Preuve de l'arrêt de toute l'activité","Preuve du caractère définitif"],
 erreurs:["Invoquer le 4° pour la fermeture d'un site"],
 valeur:"toujours valable"},

{id:"ECO-4-02", rubrique:"4° Cessation d'activité",
 question:"Que reste-t-il à prouver une fois la cessation établie ?",
 si:f=>f.cause==="4",
 alors:f=>`L'absence de faute et de légèreté blâmable. La cessation « constitue en soi un motif économique de licenciement » à cette seule condition. C'est là que se joue le dossier : recherche de reprise documentée, chronologie des causes, et — si l'entreprise appartient à un groupe — la démonstration que la fermeture n'a pas été décidée pour réaliser des économies au détriment de l'emploi.`,
 fondement:[],
 juris:[A("98-44.647","2001-01-16","soc.","toujours valable","La cessation d'activité, quand elle n'est pas due à la faute ou à la légèreté blâmable de l'employeur, constitue en soi un motif économique."),
        A("03-47.880","2006-02-28","soc.","toujours valable","Même formule."),
        A("10-30.045","2011-02-01","soc.","toujours valable","Fermeture d'une filiale saine décidée pour réaliser des économies : comportement fautif retenu.")],
 pieces:["Mandat de recherche de repreneur","Journal des candidats et motifs d'échec","Situation financière au jour de la décision"],
 erreurs:["Se croire dispensé de tout dossier parce que la cessation est visible"],
 valeur:"toujours valable"});



/* ===================== INDEMNITÉS, PRÉAVIS, BARÈME ===================== */
R.push(
{id:"IND-01", rubrique:"Indemnités · indemnité légale",
 question:"Quelle indemnité de licenciement est due ?",
 si:f=>Array.isArray(f.salaries)&&f.salaries.length>0,
 alors:f=>f.salaries.map(s=>{const i=M.indemniteLegale(s);
   if(!i) return `${s.nom} : ancienneté non renseignée.`;
   if(!i.du) return `${s.nom} : ${i.motif}`;
   return `${s.nom} — ${i.detail}. Salaire de référence retenu : ${i.salaireReference?i.salaireReference.valeur+" € ("+i.salaireReference.retenue+")":"non calculable, rémunération non renseignée"}. Indemnité légale : ${i.montant!==null?i.montant+" €":"non calculable"}.`;}).join(" "),
 fondement:["L. 1234-9","R. 1234-2","R. 1234-4"],
 juris:[], pieces:["Bulletins des douze derniers mois","Contrat de travail et avenants"],
 erreurs:["Retenir la moyenne des douze mois sans comparer au tiers des trois derniers","Appliquer l'indemnité légale sans vérifier l'indemnité conventionnelle"],
 valeur:"—"},

{id:"IND-02", rubrique:"Indemnités · préavis",
 question:"Quelle est la durée du préavis ?",
 si:f=>Array.isArray(f.salaries)&&f.salaries.length>0,
 alors:f=>f.salaries.map(s=>{const p=M.preavis(s);
   return `${s.nom} : ${p.duree?p.duree:"durée fixée par la convention, l'accord ou les usages"} — ${p.motif}`;}).join(" ")
   +` Une durée conventionnelle ou contractuelle plus favorable au salarié prime.`,
 fondement:["L. 1234-1"], juris:[], pieces:["Convention collective — clause de préavis"],
 erreurs:["Appliquer le préavis légal sans vérifier la convention"], valeur:"—"},

{id:"IND-03", rubrique:"Indemnités · risque contentieux",
 question:"À quoi l'entreprise s'expose-t-elle si la cause est jugée sans cause réelle et sérieuse ?",
 si:f=>Array.isArray(f.salaries)&&f.salaries.length>0,
 alors:f=>{const l=f.salaries.map(s=>{const b=M.bareme(s.anciennete,f.effectif);
   return `${s.nom} (${b.anciennete} ans) : de ${b.minMois===null?"sans minimum":b.minMois+" mois"} à ${b.maxMois} mois de salaire brut${b.derogation?" — "+b.derogation:""}`;}).join(" · ");
   return `Fourchette d'indemnisation du barème : ${l}. Le juge peut tenir compte des indemnités versées à l'occasion de la rupture, à l'exception de l'indemnité légale de licenciement.`;},
 fondement:["L. 1235-3"], juris:[],
 pieces:[], erreurs:["Négliger l'exposition financière dans l'arbitrage entre sécuriser le dossier et notifier vite"],
 valeur:"—"},

/* ===================== PÉRIMÈTRE DE PROCÉDURE ===================== */
{id:"PRO-01", rubrique:"Procédure · règle des trente jours",
 question:"Le régime doit-il être calculé sur un total supérieur au projet en cours ?",
 si:f=>M.trenteJours(f).alerte.length>0,
 alors:f=>M.trenteJours(f).alerte.join(" ")+
  ` Régime recalculé sur ${M.trenteJours(f).total} licenciements : ${M.regimeEco({...f,nbLicenciements:M.trenteJours(f).total}).libelle}.`,
 fondement:["L. 1233-8","L. 1233-25","L. 1233-28"],
 juris:[], pieces:["État des licenciements économiques prononcés dans les trente jours"],
 erreurs:["Fractionner un projet pour rester sous le seuil de dix"], valeur:"—"},

{id:"PRO-02", rubrique:"Procédure · autorité administrative",
 question:"Quand et comment informer l'administration ?",
 si:f=>true,
 alors:f=>{const r=M.regimeEco(f);
  return r.code==="GRAND_COLLECTIF"||r.code==="GRAND_PETITE_ENTREPRISE"
   ? `Notification à l'autorité administrative de tout projet d'au moins dix licenciements sur trente jours, au plus tôt le lendemain de la date prévue pour la première réunion du comité. Elle est accompagnée de tout renseignement sur la convocation, l'ordre du jour et la tenue de cette réunion, et indique le cas échéant l'intention d'ouvrir la négociation d'un accord.`
   : `Information de l'autorité administrative des licenciements prononcés, après notification.`;},
 fondement:["L. 1233-19","L. 1233-46"], juris:[],
 pieces:["Notification ou information à l'autorité administrative, avec sa date"],
 erreurs:["Notifier à l'administration avant la première réunion du comité"], valeur:"—"},

{id:"PRO-03", rubrique:"Procédure · offres de reclassement",
 question:"Sous quelle forme les offres de reclassement doivent-elles être faites ?",
 si:f=>true,
 alors:f=>`Offres personnalisées, ou liste des offres disponibles communiquée aux salariés, par tout moyen conférant date certaine. Chaque offre écrite précise l'intitulé du poste et son descriptif, le nom de l'employeur, la nature du contrat, la localisation, le niveau de rémunération et la classification. En cas de liste, elle comprend les postes disponibles sur le territoire national dans l'entreprise et les autres entreprises du groupe, et précise les critères de départage entre salariés.`,
 fondement:["L. 1233-4","D. 1233-2-1"], juris:[],
 pieces:["Offres écrites avec preuve de date certaine","Liste des offres et ses actualisations"],
 erreurs:["Proposer oralement","Omettre la rémunération ou la classification","Communiquer une liste sans critères de départage"],
 valeur:"—"},

/* ===================== SALARIÉS PROTÉGÉS ===================== */
{id:"PRT-01", rubrique:"Salariés protégés",
 question:"Des salariés protégés sont-ils concernés ?",
 si:f=>Array.isArray(f.salariesProteges)&&f.salariesProteges.length>0,
 alors:f=>{const p=M.proteges(f);
  return `${p.nombre} salarié(s) protégé(s) dans le périmètre : ${p.liste.map(x=>x.nom+" ("+x.mandat+")").join(", ")}. ${p.consequence}`;},
 fondement:["L. 2411-1"],
 juris:[A("12-22.546","2014-01-22","soc.","toujours valable","En présence d'une autorisation administrative devenue définitive, le juge judiciaire ne peut apprécier le caractère réel et sérieux du motif au regard de la cause économique ni le respect de l'obligation de reclassement.")],
 pieces:["Demande d'autorisation à l'inspecteur du travail","Décision d'autorisation"],
 erreurs:["Notifier avant l'autorisation","Oublier qu'un ancien élu peut rester protégé pendant la période postérieure au mandat"],
 valeur:"toujours valable"},

/* ===================== TRANSFERT ET PROCÉDURE COLLECTIVE ===================== */
{id:"TRF-01", rubrique:"Transfert d'entreprise",
 question:"Une entité économique autonome est-elle transférée ?",
 si:f=>f.transfertEnvisage===true,
 alors:f=>`Lorsque survient une modification dans la situation juridique de l'employeur, tous les contrats de travail en cours subsistent entre le nouvel employeur et le personnel. Le licenciement économique prononcé à cette occasion se heurte à ce texte : il faut établir qu'aucune entité économique autonome conservant son identité n'est transférée.`,
 fondement:["L. 1224-1"], juris:[],
 pieces:["Acte de cession et son périmètre","Déclaration de l'acquéreur sur l'absence de reprise de clientèle, de contrats et de personnel"],
 erreurs:["Céder l'outil, la clientèle et une partie du personnel tout en licenciant le reste"],
 valeur:"—"},

{id:"PCO-01", rubrique:"Procédure collective",
 question:"L'entreprise fait-elle l'objet d'une procédure collective ?",
 si:f=>f.procedureCollective===true,
 alors:f=>`Le régime est celui de l'article L. 1233-58 : l'employeur, l'administrateur ou le liquidateur met en œuvre un plan de licenciement dans les conditions des articles L. 1233-24-1 à L. 1233-24-4, et consulte le comité selon le seuil applicable — L. 1233-8 en dessous de dix licenciements, L. 1233-29 premier alinéa pour dix et plus dans une entreprise de moins de cinquante salariés, L. 1233-30 I au-delà. Les créances résultant de la rupture sont couvertes par l'assurance dans les délais de l'article L. 3253-8, plus longs lorsqu'un plan de sauvegarde de l'emploi est élaboré.`,
 fondement:["L. 1233-58","L. 3253-8"], juris:[],
 pieces:["Jugement d'ouverture","Ordonnance du juge-commissaire, le cas échéant"],
 erreurs:["Laisser expirer les délais de l'article L. 3253-8, qui conditionnent la garantie des créances"],
 valeur:"—"},

{id:"REV-01", rubrique:"Revitalisation des bassins d'emploi",
 question:"L'entreprise est-elle tenue de contribuer à la revitalisation ?",
 si:f=>(f.effectif>=1000||f.effectifGroupe>=1000)&&f.nbLicenciements>=10,
 alors:f=>`L'entreprise relevant de l'article L. 1233-71, un licenciement collectif affectant par son ampleur l'équilibre du ou des bassins d'emploi l'oblige à contribuer à la création d'activités et au développement des emplois. Le préfet dispose de deux mois à compter de la notification de la décision de validation ou d'homologation pour indiquer si l'obligation s'applique. Ces dispositions ne s'appliquent pas aux entreprises en redressement ou en liquidation judiciaire.`,
 fondement:["L. 1233-84","D. 1233-38"], juris:[], pieces:["Échanges avec le préfet","Convention de revitalisation"],
 erreurs:["Ignorer le délai de réponse du préfet"], valeur:"—"},

/* ===================== ORDRE CALCULÉ ===================== */
{id:"ORD-01", rubrique:"Ordre des licenciements · application",
 question:"Quels salariés le classement désigne-t-il ?",
 si:f=>Array.isArray(f.categories)&&f.categories.length>0,
 alors:f=>f.categories.map(c=>{const o=M.ordre(c); if(!o) return "";
   const lic=o.classement.filter(s=>s.licencie).map(s=>`${s.nom} (${s.total} pts)`).join(", ");
   const gar=o.classement.filter(s=>!s.licencie).slice(0,3).map(s=>`${s.nom} (${s.total})`).join(", ");
   return `Catégorie « ${o.categorie} » — ${o.effectif} salariés, ${o.suppressions} suppression(s). Désignés par le classement : ${lic}. Premiers maintenus : ${gar}. En cas d'égalité, l'ancienneté départage.`;}).join(" "),
 fondement:["L. 1233-5","L. 1233-7","L. 1233-17"],
 juris:[A("17-18.136","2020-02-26","soc.","toujours valable","Le préjudice résultant de l'inobservation des règles d'ordre et son évaluation relèvent du pouvoir souverain des juges du fond.")],
 pieces:["Grille des critères, barème et classement complet","Entretiens annuels des trois derniers exercices, au soutien du critère des qualités professionnelles"],
 erreurs:["Noter les qualités professionnelles sans support documentaire","Restreindre le périmètre d'application des critères en dessous de la zone d'emploi, en l'absence d'accord"],
 valeur:"toujours valable"});

module.exports = R;
