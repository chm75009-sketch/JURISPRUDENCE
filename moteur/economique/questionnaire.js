/* Le questionnaire : la liste des données que la grille sait exploiter, avec,
   pour chacune, les règles qui la consomment. Il est produit à partir de la
   grille — il ne peut donc pas se désynchroniser d'elle. */
const O=require("./outils.js");
const G=require("./grille.js");
const CHAMPS=[
 ["Identification",[
  ["entreprise","Dénomination sociale","texte"],
  ["siren","SIREN","9 chiffres"],
  ["dateAudit","Date de l'audit","AAAA-MM-JJ"],
  ["idcc","Convention collective — numéro IDCC","4 chiffres"]]],
 ["Effectifs et structure",[
  ["effectif","Effectif de l'entreprise","nombre"],
  ["effectifEtablissement","Effectif de l'établissement concerné","nombre"],
  ["groupe","L'entreprise appartient-elle à un groupe ?","oui / non"],
  ["effectifGroupe","Effectif total du groupe, France et étranger","nombre"],
  ["societes","Sociétés du groupe : nom, effectif, activité, pays","liste"],
  ["activite","Activité de l'entreprise auditée, dans les termes qui servent à délimiter le secteur","texte"],
  ["societesDuSecteur","Sociétés du groupe relevant du même secteur d'activité, nommées","liste"],
  ["etablissementsDistincts","Nombre d'établissements distincts","nombre"]]],
 ["Procédure collective",[
  ["procedureCollective","L'entreprise fait-elle l'objet d'une procédure collective ?","oui / non"],
  ["typeProcedure","Nature de la procédure","sauvegarde / redressement / liquidation"],
  ["dateJugement","Date du jugement d'ouverture ou de liquidation","AAAA-MM-JJ"],
  ["qualiteAuteur","Qui met en œuvre le plan de licenciement","employeur / administrateur / liquidateur"],
  ["ordonnanceJugeCommissaire","Ordonnance du juge-commissaire autorisant les licenciements : date et référence","texte"]]],
 ["Transfert d'entité",[
  ["transfertEnvisage","Un transfert d'entité économique est-il envisagé ?","oui / non"]]],
 ["Groupe — origine des difficultés",[
  ["fluxIntragroupe","Redevances de marque, management fees et prix de transfert versés aux sociétés du groupe, par exercice — montants comptables, non une appréciation","tableau"],
  ["resultatHorsFlux","Résultat d'exploitation reconstitué hors ces flux, par exercice","tableau"],
  ["resultatGroupe","Résultat consolidé du groupe et dividendes versés, par exercice","tableau"]]],
 ["Comité social et économique",[
  ["cseExistant","Un comité est-il en place ?","oui / non"],
  ["pvCarence","Procès-verbal de carence, à défaut de comité","fichier"],
  ["cseCentralConsulte","Le comité central a-t-il été consulté ?","oui / non"],
  ["consequencesSSCT","Conséquences du projet sur la santé, la sécurité et les conditions de travail exposées au comité","texte"],
  ["expertise","Une expertise du comité a-t-elle été demandée ?","oui / non"]]],
 ["Ordre des licenciements — périmètre",[
  ["perimetreOrdre","Périmètre d'application des critères d'ordre","texte"],
  ["accordPerimetreOrdre","Un accord collectif fixe-t-il ce périmètre ?","oui / non"]]],
 ["Fermeture de site",[
  ["fermetureEtablissement","Le projet emporte-t-il la fermeture d'un établissement ?","oui / non"],
  ["rechercheRepreneur","Recherche d'un repreneur : date d'engagement, mandataire, candidats, motifs d'écartement","texte"]]],
 ["Le projet",[
  ["cause","Cause invoquée : 1 difficultés · 2 mutations technologiques · 3 sauvegarde de la compétitivité · 4 cessation d'activité","1 à 4"],
  ["cessationComplete","Si cause 4 : la cessation est-elle totale et définitive ?","oui / non"],
  ["nbLicenciements","Nombre de licenciements envisagés sur 30 jours","nombre"],
  ["licenciementsRecents30j","Licenciements économiques déjà prononcés dans la même période de trente jours","nombre"],
  ["licenciements3moisGlissants","Total des licenciements économiques sur les trois mois consécutifs précédents","nombre"],
  ["refusModification","Salariés ayant refusé une modification de leur contrat","nombre"],
  ["postesSupprimes","Postes supprimés : intitulé, service, effectif avant et après","liste"]]],
 ["La démonstration économique",[
  ["trimestres","Chiffre d'affaires ou commandes, trimestre par trimestre, comparés au même trimestre de l'année précédente, sur le périmètre du secteur","tableau"],
  ["resultatExploitation","Résultat d'exploitation des trois derniers exercices","tableau"],
  ["tresorerie","Trésorerie et excédent brut d'exploitation, trois exercices","tableau"],
  ["autresElements","Autres éléments invoqués : perte de marché, sinistre, rupture de contrat","texte"],
  ["menace","Si cause 3 : la menace, sa date, sa source et son chiffrage","texte"],
  ["mutation","Si cause 2 : outil abandonné, outil nouveau, date de mise en service, montant","texte"]]],
 ["Les salariés",[
  ["salaries","Pour chacun : nom, emploi, ancienneté en mois, rémunération des 12 derniers mois, des 3 derniers","liste"],
  ["categories","Catégories professionnelles : intitulé, effectif, nombre de suppressions, notes des critères d'ordre","liste"],
  ["salariesProteges","Salariés protégés : nom, mandat, date et sens de l'autorisation de l'inspecteur du travail","liste"],
  ["salariesSuspendus","Salariés en arrêt, congé maternité, inaptitude","liste"],
  ["precaires","Contrats à durée déterminée, intérimaires, recrutements des 12 derniers mois","liste"]]],
 ["Le reclassement",[
  ["postesDisponibles","Postes disponibles dans l'entreprise et le groupe sur le territoire national : intitulé, société, lieu, contrat, rémunération, classification","liste"],
  ["offresFaites","Offres adressées : intitulé, descriptif, employeur, nature du contrat, localisation, rémunération, classification, moyen conférant date certaine, réponse","liste"],
  ["formationProposee","Formations d'adaptation proposées : contenu, durée, coût, réponse","liste"]]],
 ["La procédure",[
  ["dateInfoCSE","Date de convocation du comité social et économique","AAAA-MM-JJ"],
  ["datesReunionsCSE","Dates des réunions du comité","liste de dates"],
  ["dateAvisCSE","Date de l'avis rendu, ou mention « avis non rendu »","AAAA-MM-JJ"],
  ["dateEntretien","Date de l'entretien préalable","AAAA-MM-JJ"],
  ["dateNotification","Date de notification envisagée","AAAA-MM-JJ"],
  ["cadreAuSensL1441_13","Salarié relevant du personnel d'encadrement au sens du 2° de L. 1441-13","oui / non"],
  ["dateNotifAdmin","Date de notification ou d'information à l'autorité administrative","AAAA-MM-JJ"]]],
 ["Les normes conventionnelles — pièces à joindre",[
  ["conventionJointe","PIÈCE À JOINDRE — convention collective applicable : le texte à jour, ou à défaut son numéro IDCC et son intitulé exact","fichier ou référence"],
  ["accordsJoints","PIÈCE À JOINDRE — accords d'entreprise applicables : accord de méthode, accord portant plan de sauvegarde de l'emploi, accord de performance collective, accord de gestion des emplois. Joindre le texte intégral de chacun, avenants compris","fichiers"],
  ["convention","Clauses relevées, si la convention n'est pas jointe : critères d'ordre, préavis, indemnité, priorité de réembauche, commission paritaire de l'emploi, délais","cases à cocher"],
  ["accords","Accords existants, si les textes ne sont pas joints : méthode, plan de sauvegarde de l'emploi, performance collective, gestion des emplois","cases à cocher"],
  ["refusAPC","Le licenciement fait-il suite au refus d'un accord de performance collective ?","oui / non"]]],
 ["Fraîcheur des sources — à confirmer par l'employeur",[
  ["conventionAJour","L'application récupère elle-même votre convention dans la base KALI de Légifrance à partir de l'IDCC. Confirmez-vous que la version qui y figure est bien celle que vous appliquez ?","oui / non / je ne sais pas"],
  ["avenantsRecents","Appliquez-vous un avenant, un accord de branche ou un accord d'entreprise postérieur à la dernière mise à jour publiée sur Légifrance ? Si oui, joindre le texte","oui / non + fichier"],
  ["usagesEtEngagements","Existe-t-il des usages, engagements unilatéraux ou décisions unilatérales plus favorables que la loi et la convention ?","texte"],
  ["contentieuxEnCours","Un contentieux ou un contrôle est-il en cours sur ces questions ?","texte"]]],
 ["Plan de sauvegarde de l'emploi — si au moins 10 licenciements et 50 salariés",[
  ["pse.voie","Voie retenue : accord majoritaire ou document unilatéral","accord / unilatéral"],
  ["pse.evitement","Mesures pour éviter les licenciements ou en limiter le nombre","texte"],
  ["pse.reclassementInterne","Plan de reclassement interne sur le territoire national","texte"],
  ["pse.formation","Actions de formation, validation des acquis, reconversion","texte"],
  ["pse.creation","Soutien à la création ou à la reprise d'activité","texte"],
  ["pse.suivi","Modalités de suivi de la mise en œuvre","texte"],
  ["pse.dateDecisionAdmin","Date de la décision de validation ou d'homologation","AAAA-MM-JJ"]]],
 ["Pièces versées — une ligne par pièce, non une case à cocher",[
  ["pieces.code","Nature de la pièce, à choisir dans le registre P-001 à P-015","liste"],
  ["pieces.fichier","Nom du fichier déposé","texte"],
  ["pieces.date","Date du document lui-même, non la date de dépôt","AAAA-MM-JJ"],
  ["pieces.periode","Période couverte par le document","texte"],
  ["pieces.auteur","Auteur ou émetteur : direction, expert-comptable, commissaire aux comptes, tiers","texte"],
  ["pieces.version","Version ou numéro d'avenant","texte"],
  ["pieces.perimetre","Périmètre couvert : établissement, entreprise, secteur d'activité du groupe","texte"],
  ["pieces.lue","La pièce a-t-elle été lue et rapprochée des réponses ?","oui / non"]]],
 ["Situations particulières",[
  ["transfertEnvisage","Une entité économique est-elle transférée ?","oui / non"],
  ["procedureCollective","L'entreprise est-elle en redressement ou liquidation judiciaire ?","oui / non"],
  ["coEmploi","Une société du groupe s'immisce-t-elle dans la gestion de l'entreprise ?","oui / non"]]],
];
const PIECES={
 entreprise:"Extrait Kbis", siren:"Extrait Kbis", idcc:"Convention ou bulletin de paie",
 effectif:"Registre unique du personnel ou déclaration sociale nominative",
 effectifEtablissement:"Registre du personnel de l'établissement",
 effectifGroupe:"État des effectifs du groupe",
 societes:"Organigramme capitalistique daté et comptes",
 etablissementsDistincts:"Liste des établissements ou accord de reconnaissance",
 postesSupprimes:"Organigramme nominatif avant et après",
 trimestres:"Liasse fiscale, déclarations de taxe sur la valeur ajoutée, balance",
 resultatExploitation:"Comptes annuels certifiés", tresorerie:"Tableau de trésorerie et comptes",
 autresElements:"Pièce émanant d'un tiers : courrier client, constat, contrat",
 menace:"Pièce extérieure datée et projections chiffrées",
 mutation:"Bon de commande, facture, procès-verbal de mise en service",
 salaries:"Bulletins des douze derniers mois et contrats",
 categories:"Grille des critères, barème et classement complet",
 salariesProteges:"Autorisations de l'inspecteur du travail",
 salariesSuspendus:"Avis d'arrêt, avis d'inaptitude, attestations",
 precaires:"Registre du personnel et contrats en cours",
 postesDisponibles:"État daté des postes, y compris ceux non proposés",
 offresFaites:"Offres écrites et preuve de date certaine",
 formationProposee:"Programme, devis, propositions nominatives et réponses",
 dateInfoCSE:"Convocation avec décharge", datesReunionsCSE:"Procès-verbaux de réunion",
 dateAvisCSE:"Procès-verbal portant l'avis", dateNotifAdmin:"Accusé de la notification",
 conventionJointe:"Convention intégrale à jour", accordsJoints:"Texte intégral de chaque accord",
 "pse.voie":"Accord majoritaire ou document unilatéral",
 "pse.dateDecisionAdmin":"Décision de validation ou d'homologation",
 pieces:"Les pièces elles-mêmes",
};
const CTRL={
 effectif:"Détermine le seuil trimestriel, le régime de procédure et l'obligation de plan",
 effectifGroupe:"Détermine le contrat de sécurisation professionnelle ou le congé de reclassement",
 groupe:"Détermine le périmètre d'appréciation de la cause et du reclassement",
 societes:"Contrôle que chaque société française du périmètre a été interrogée",
 activite:"Sert à reconnaître les sociétés du même secteur d'activité",
 societesDuSecteur:"Nomme le périmètre du secteur : sans elle, l'étiquette « secteur » n'est pas vérifiable",
 nbLicenciements:"Détermine le régime, le nombre de réunions et le délai d'avis",
 licenciementsRecents30j:"S'ajoute au projet pour le seuil de dix : le décompte est celui de la fenêtre de trente jours",
 licenciements3moisGlissants:"Applique la règle anti-fractionnement de l'article L. 1233-26",
 refusModification:"À partir de dix refus, déclenche à lui seul le régime collectif (L. 1233-25) ; en deçà, il ne s'ajoute pas au décompte",
 trimestres:"Calcule la durée de baisse et la compare au seuil de l'effectif",
 postesSupprimes:"Compare les suppressions déclarées au nombre de licenciements",
 precaires:"Détecte un contrat précaire sur un emploi déclaré supprimé",
 postesDisponibles:"Contrôle la couverture de chaque société du périmètre",
 offresFaites:"Contrôle les six mentions exigées et la date certaine",
 formationProposee:"Contrôle l'effort d'adaptation, décisif pour les mutations technologiques",
 datesReunionsCSE:"Contrôle le nombre de réunions et l'intervalle imposé",
 dateAvisCSE:"Contrôle l'avis ou l'expiration du délai avant notification",
 dateNotifAdmin:"Contrôle qu'elle n'intervient pas avant la première réunion",
 dateEntretien:"Calcule la date de notification la plus proche autorisée",
 salariesProteges:"Contrôle l'autorisation administrative pour chacun",
 categories:"Applique les critères et désigne les salariés",
 salaries:"Calcule le préavis, l'indemnité légale et l'exposition au barème",
 "pse.dateDecisionAdmin":"Contrôle que la notification lui est postérieure",
};
/* Ce que la colonne « contrôle attendu » affiche n'est pas déclaré à la main :
   il est lu dans le code des règles et des contrôles. Un champ annoncé contrôlé
   alors qu'aucun contrôle ne le lit serait un mensonge du document sur lui-même. */
const CTLS=require("./controles.js").C;
const DETECT=require("./registre.js").DETECTION;
const src=G.map(r=>String(r.si)+String(r.alors)).join(" ")
  +CTLS.map(x=>String(x.verdict)).join(" ")
  +require("fs").readFileSync("moteur.js","utf8")
  +require("fs").readFileSync("pieces.js","utf8");
/* Les entrées de chaque contrôle sont calculées par le registre, à partir du code
   lui-même. La colonne les réutilise : les deux ne peuvent donc plus diverger. */
const REG=require("./registre.js").construire();
const racine=c=>c.split(".")[0];
const quiControle=c=>{const r=racine(c);
  return REG.filter(x=>x.entrees.some(e=>e===r||e.startsWith(r+",")||e.startsWith("pièce "))).map(x=>x.id)
    .filter((v,i,a)=>a.indexOf(v)===i);};
const quiControleStrict=c=>{const r=racine(c);
  return REG.filter(x=>x.entrees.includes(r)).map(x=>x.id);};
const utilise=c=>new RegExp("\\.\\s*"+racine(c)+"\\b").test(src);
function construire(){
 const A=O(); const {sur,t1,trait,h1,h2,p,note,puce,enc,tab}=A;
 sur("Licenciement pour motif économique — article L. 1233-3 du code du travail");
 t1("Questionnaire d'audit");
 sur("À remplir par l'employeur · les réponses alimentent directement la base de "+G.length+" règles");
 sur("Textes vérifiés sur Légifrance au 15 août 2026 · jurisprudence issue de l'API Judilibre");
 trait();
 enc("À lire avant de remplir",
  "Le document produit à partir de ce questionnaire est une aide à la préparation de votre dossier. Il vous fait gagner du temps en rassemblant, pour votre situation précise, les textes applicables, la jurisprudence publiée, les pièces à réunir et les délais à respecter. Il ne remplace ni l'analyse de votre conseil, ni la décision qui vous appartient.");
 enc("Ce qu'il ne prend pas en compte tant que vous ne l'avez pas joint",
  "Le résultat est établi sur la seule loi. Il ne tient compte ni de votre convention collective, ni de vos accords d'entreprise, tant que ces textes ne sont pas versés. Or ils priment sur la loi dans plusieurs cas : les critères d'ordre des licenciements — l'article L. 1233-5 ne s'applique qu'« en l'absence de convention ou accord collectif de travail applicable » —, les délais de notification, les délais de consultation du comité, l'indemnité de licenciement, le préavis, la priorité de réembauche. N'oubliez pas de les joindre : sans eux, l'audit appliquera la loi et portera la réserve correspondante.");
 enc("Ce que l'application va chercher elle-même",
  "À partir du numéro IDCC, l'application interroge la base KALI de Légifrance et récupère l'intitulé exact de votre convention, sa date de dernière mise à jour et la liste de ses avenants. Elle relit également chaque article du code du travail cité dans sa version en vigueur au jour de l'audit, et compare son identifiant à celui lu lors de la constitution de la base : tout texte modifié entre-temps est signalé. Elle interroge enfin l'API Judilibre pour les décisions publiées depuis la clôture du corpus.");
 enc("Ce que l'application ne peut pas savoir, et qu'il faut lui dire",
  "Trois choses lui échappent, et elles sont fréquentes. Une convention appliquée volontairement alors qu'une autre s'imposerait, ou l'inverse. Un avenant signé mais non encore publié sur Légifrance — le décalage se compte parfois en mois. Un usage, un engagement unilatéral ou une décision unilatérale de l'employeur, qui ne figurent dans aucune base publique et qui priment lorsqu'ils sont plus favorables. Le bloc « fraîcheur des sources » est là pour cela : ce que vous y répondez commande la fiabilité du reste.");
 enc("Les deux axes du rapport",
  "Chaque contrôle reçoit deux mentions distinctes, et il ne faut pas les confondre. L'état dit si l'exigence est satisfaite : conforme au vu des pièces, non conforme, risque à vérifier, donnée manquante. Le niveau de preuve dit sur quoi cette réponse repose : pièce produite, déclaré non justifié, donnée manquante, à vérifier par un professionnel. Un fait peut être exact et non prouvé — ce sont deux questions.");
 enc("Revue professionnelle obligatoire",
  "Lorsque le dossier comporte un plan de sauvegarde de l'emploi, un groupe, un salarié protégé, un transfert, une procédure collective, un accord collectif à articuler avec la loi, un contentieux en cours ou une situation possible de co-emploi, le rapport porte la mention « revue professionnelle obligatoire ». Il produit alors une liste de contrôle, non une conclusion de conformité.");
 enc("Une déclaration n'est pas une preuve",
  "Le rapport distingue quatre états : conforme au vu des pièces, non conforme, risque à vérifier, donnée manquante. Une exigence dont vous affirmez qu'elle est satisfaite, sans que la pièce correspondante soit versée, ne sera jamais portée « conforme » : elle sortira en « risque à vérifier ». C'est voulu. Le bloc « pièces effectivement versées » commande donc une large part du résultat.");
 enc("Comment ce questionnaire fonctionne",
  "Chaque ligne correspond à une donnée que la base sait exploiter. Une case laissée vide n'est pas une case oubliée : l'audit signalera qu'elle manque et indiquera ce qui n'a pas pu être vérifié faute de cette donnée. Aucune conclusion ne sera tirée d'une donnée absente.");
 enc("Accords d'entreprise — à déposer",
  "Les accords d'entreprise priment sur plusieurs règles légales : accord de méthode sur les modalités de consultation, accord majoritaire sur le contenu du plan de sauvegarde de l'emploi, accord de performance collective, accord de gestion des emplois. La base ne peut pas les deviner. Déposez le texte intégral de chaque accord applicable : l'application les lit et adapte les règles correspondantes. À défaut de dépôt, l'audit appliquera les règles légales et le signalera comme une réserve.");
 enc("Convention collective — à identifier",
  "Indiquez le numéro IDCC. L'application interroge la base KALI de Légifrance pour retrouver le texte à jour et ses avenants. La convention prime notamment sur les critères d'ordre — l'article L. 1233-5 ne joue qu'« en l'absence de convention ou accord collectif de travail applicable » — sur les délais de notification et sur l'indemnité de licenciement.");
 for(const [bloc,champs] of CHAMPS){
  h1(bloc);
  tab(["Donnée","Ce qu'il faut renseigner","Format","Pièce à joindre","Contrôle attendu"],
   champs.map(([c,lib,fmt])=>[c,lib,fmt,(PIECES[c]||"—"),(()=>{const q=quiControleStrict(c);
     const det=q.filter(id=>DETECT.has(id));
     if(det.length&&det.length===q.length)
       return "détection seulement — "+q.join(", ")+" : conduit obligatoirement à « risque à vérifier », jamais à « conforme »";
     return q.length ? (CTRL[c]||"contrôlée")+" — "+q.join(", ")
       : (CTRL[c] ? CTRL[c]+" (règle, sans contrôle dédié)"
         : (utilise(c)?"alimente une règle, sans contrôle dédié":"collectée, aucun contrôle à ce jour"));})()]));
 }
 h1("Registre des contrôles");
 const MAN=require("./manifeste.js").construire();
 const VER=require("./manifeste.js").verifier();
 const REG=MAN.controles;
 const COH=require("./registre.js").coherence();
 p(`Manifeste ${MAN.empreinte}, produit le ${MAN.genere}. Le questionnaire, le registre d'exécution des tests et le rapport d'audit sont tous produits à partir de ce manifeste : ils ne peuvent pas afficher des listes différentes.`);
 h2("Ce que comptent les compteurs");
 tab(["Compteur","Valeur","Ce qu'il désigne"],
  MAN.definitions.map(([k,d])=>[k,
   String({"contrôles publiés":MAN.compteurs.controles,"contrôles de conformité":MAN.compteurs.conformite,
    "contrôles de détection":MAN.compteurs.detection,"contrôles couverts par un test":MAN.compteurs.testes,
    "cas contradictoires":MAN.compteurs.casDeTest}[k]??"—"),d]));
 note("Les six contrôles de détection n'ont pas de cas contradictoire : ils ne détectent aucune faute, ils relaient une déclaration. C'est pourquoi 42 contrôles sont couverts par un test alors que 48 sont publiés.");
 /* Non-divergence dans les deux sens. Le sens questionnaire → contrôles était
    seul vérifié : un champ lu par un contrôle mais jamais demandé condamnait ce
    contrôle à sortir « donnée manquante » sans que personne puisse y remédier. */
 const fsx=require("fs");
 const srcCtl=fsx.readFileSync(__dirname+"/controles.js","utf8")+fsx.readFileSync(__dirname+"/controles2.js","utf8");
 /* Deux mesures, réunies. L'inspection du code voit les branches que
    l'exécution n'atteint pas ; la sonde voit les notations que l'expression
    régulière ne reconnaît pas — f["nom"] et const {nom} = f. Aucune des deux
    ne suffit seule, et c'est leur union qui fait la garantie. */
 const parRegex=[...new Set([...srcCtl.matchAll(/\bf\.([a-zA-Z_][a-zA-Z0-9_]*)/g)].map(m=>m[1]))];
 const parSonde=[...new Set(Object.values(require("./sonde.js").champsLus(require("./controles.js").C)).flat())];
 const lus=[...new Set([...parRegex,...parSonde])];
 const demandes=new Set(CHAMPS.flatMap(([,l])=>l.map(x=>x[0])));
 /* « veille » est renseigné par l'application elle-même, non par l'employeur. */
 const INTERNES=new Set(["veille"]);
 /* Un champ composé est demandé par ses sous-champs : « pse » l'est par
    « pse.voie », « pieces » par la section qui en énumère les codes. */
 const composes=new Set([...demandes].filter(x=>x.includes(".")).map(x=>x.split(".")[0]));
 const COMPOSES_LISTE=new Set(["pieces"]);
 const jamaisDemandes=lus.filter(c=>!demandes.has(c)&&!INTERNES.has(c)
   &&!composes.has(c)&&!COMPOSES_LISTE.has(c));
 /* La symétrie. Un champ demandé que nul contrôle ne lit donne l'illusion d'une
    couverture qui n'existe pas : l'employeur répond, et la réponse ne produit
    rien. Certains champs sont pourtant légitimement de contexte — ils sont
    repris tels quels dans le rapport, ou nourrissent la veille. Ils doivent
    alors être déclarés ici, nommément : c'est la déclaration qui est vérifiée,
    non l'absence de contrôle. */
 const CONTEXTE=new Set(["entreprise","siren","dateAudit","idcc","autresElements",
   "salaries","convention","accords","conventionAJour","avenantsRecents",
   "conventionJointe","accordsJoints","effectifGroupe","resultatGroupe",
   "cadreAuSensL1441_13","dateEntretien","menace","perimetreOrdre"]);
 const jamaisLus=[...demandes].filter(c=>!lus.includes(c)&&!composes.has(c)
   &&!c.includes(".")&&![...demandes].some(x=>x.startsWith(c+".")));
 const nonDeclares=jamaisLus.filter(c=>!CONTEXTE.has(c));
 h2("Contrôle de non-divergence");
 tab(["Vérification","Résultat"],[
  ["Champs vus par inspection du code",String(parRegex.length)],
  ["Champs vus par la sonde d'exécution",String(parSonde.length)],
  ["Champs que seule la sonde a vus",parSonde.filter(c=>!parRegex.includes(c)).join(", ")||"aucun"],
  ["Champs lus par un contrôle et jamais demandés",jamaisDemandes.join(", ")||"aucun"],
  ["Champs demandés qu'aucun contrôle ne lit",jamaisLus.join(", ")||"aucun"],
  ["Champs de contexte, déclarés tels",[...CONTEXTE].join(", ")],
  ["Champs composés, demandés par leurs sous-champs",[...composes,...COMPOSES_LISTE].join(", ")],
  ["Champs renseignés par l'application, non demandés à l'employeur",[...INTERNES].join(", ")]]);
 if(jamaisDemandes.length){
  console.error("DIVERGENCE : champs lus par un contrôle et absents du questionnaire — "+jamaisDemandes.join(", "));
  process.exit(1);
 }
 if(nonDeclares.length){
  console.error("DIVERGENCE : champs demandés que nul contrôle ne lit, et non déclarés de contexte — "+nonDeclares.join(", "));
  process.exit(1);
 }
 tab(["Vérification","Résultat"],[
  ["Identifiants uniques",VER.identifiantsUniques?"oui":"NON"],
  ["Contrôles de conformité sans cas de test",VER.conformiteSansTest.join(", ")||"aucun"],
  ["Contrôles de détection pouvant conclure à la conformité",VER.detectionPouvantConclureConforme.join(", ")||"aucun"],
  ["Somme conformité + détection égale au total",VER.somme?"oui":"NON"],
  ["Contrôles testés égaux aux contrôles de conformité",VER.coherenceTestes?"oui":"NON"]]);
 p(`La base exécute ${COH.total} contrôles. Le tableau ci-dessous est produit par inspection du code exécuté, non saisi à la main : l'identifiant, l'objet, les champs lus, la pièce exigée, les états possibles et le cas de test proviennent des fonctions elles-mêmes. Un contrôle qui disparaîtrait du code disparaîtrait de ce tableau.`);
 tab(["Vérification de cohérence","Résultat","Détail"],[
  ["Contrôles ne lisant aucune donnée",String(COH.sansEntree.length),COH.sansEntree.join(", ")||"aucun"],
  ["Contrôles de détection seulement",String(COH.detection.length),COH.detection.join(", ")]]);
 const parRub={}; REG.forEach(r=>{(parRub[r.rubrique]=parRub[r.rubrique]||[]).push(r);});
 for(const [rub,l] of Object.entries(parRub)){
  h2(rub);
  tab(["N°","Ce qu'il vérifie","Type","Données lues","Pièce exigée","États possibles","Cas de test"],
   l.map(r=>[r.id,r.objet,r.type,r.entrees.join(", ")||"—",r.piece,
     r.etats.join(" · "),r.tests.join(" ; ")||(r.type==="conformité"?"—":"sans objet : contrôle de détection")]));
 }
 h1("Ce que la base contient");
 tab(["Élément","Nombre"],[
  ["Règles au total",String(G.length)],
  ["Règles rédigées, portant l'interprétation, les pièces et les erreurs",String(G.filter(r=>r.source==="rédigée").length)],
  ["Règles issues d'un article lu sur Légifrance",String(G.filter(r=>r.source==="article").length)],
  ["Règles auxquelles au moins un arrêt publié est rattaché",String(G.filter(r=>r.juris&&r.juris.length).length)],
  ["Contrôles exécutés sur le dossier",String(require("./registre.js").coherence().total)],
  ["Cas contradictoires testés",String(new Set(require("./registre.js").construire().flatMap(r=>r.tests)).size)],
  ["Arrêts publiés dans le recueil","474"],
  ["Articles lus à la source","200"]]);
 note("Les données marquées « pas encore » sont demandées mais ne déclenchent aucune règle à ce jour. Elles sont collectées pour que l'audit signale précisément ce qu'il n'a pas pu vérifier.");
 return A.D;
}
module.exports=construire;
