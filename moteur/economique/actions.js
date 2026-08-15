/* Ce qu'il faut faire, contrôle par contrôle.
   Le contrôle dit ce qui ne va pas ; ce fichier dit quel geste le corrige et
   avant quel acte de la procédure. Rien d'autre : aucune règle de droit
   nouvelle n'est introduite ici, seul l'impératif correspondant est écrit. */
const AV_CSE = "Avant de convoquer le comité";
const AV_OFF = "Avant d'adresser les offres de reclassement";
const AV_NOT = "Avant la notification des licenciements";
const AV_DEC = "Avant de décider";
const AV_ADM = "Avant la saisine ou l'information de l'administration";
const NOW = "Immédiatement";

/* faire : l'action, à l'impératif. quand : l'acte avant lequel elle doit être faite. */
const A = {
"CTL-REC-01": { faire: "Établir un état daté et signé des postes disponibles, société par société, et le verser au dossier.", quand: AV_OFF },
"CTL-REC-02": { faire: "Interroger chaque société française du périmètre de permutation et conserver la réponse écrite, même négative.", quand: AV_OFF },
"CTL-REC-03": { faire: "Reprendre chaque offre pour qu'elle porte les sept mentions : intitulé, descriptif, employeur, nature du contrat, lieu, rémunération, classification.", quand: AV_OFF },
"CTL-REC-04": { faire: "Faire établir et dater une attestation d'absence de poste disponible, appuyée sur un état des effectifs et des mouvements.", quand: AV_NOT },
"CTL-REC-05": { faire: "Documenter les actions de formation et d'adaptation proposées, ou motiver par écrit leur impossibilité.", quand: AV_NOT },
"CTL-REC-06": { faire: "Redater l'état des postes : il doit être antérieur à la notification et couvrir la période de recherche.", quand: AV_NOT },
"CTL-REC-07": { faire: "Proposer les postes disponibles qui n'ont pas été offerts, ou motiver poste par poste leur exclusion.", quand: AV_OFF },
"CTL-REC-08": { faire: "Adresser à chaque salarié une offre écrite et personnalisée, par un moyen conférant date certaine.", quand: AV_NOT },
"CTL-REC-09": { faire: "Indiquer dans chaque offre le délai de réflexion et le moyen de réponse.", quand: AV_OFF },
"CTL-REC-10": { faire: "Recueillir l'accord exprès et écrit du salarié avant toute proposition de poste de catégorie inférieure.", quand: AV_OFF },
"CTL-REC-11": { faire: "Adosser l'absence de poste à des pièces extérieures : registre du personnel, organigramme, extraction de la base RH.", quand: AV_NOT },
"CTL-EMP-01": { faire: "Documenter la suppression poste par poste : organigramme avant et après, fiches de poste, redistribution des tâches.", quand: AV_CSE },
"CTL-EMP-02": { faire: "Justifier tout recrutement ou recours à des contrats précaires sur les emplois supprimés, ou y mettre fin.", quand: AV_NOT },
"CTL-ECO-01": { faire: "Produire la démonstration comptable chiffrée : comptes, liasses fiscales, situations intermédiaires, rapport du commissaire aux comptes.", quand: AV_CSE },
"CTL-ECO-02": { faire: "Refaire la démonstration au bon périmètre : secteur d'activité du groupe, et non la seule entreprise.", quand: AV_CSE },
"CTL-ECO-03": { faire: "Faire établir par un tiers l'analyse de la menace sur la compétitivité du secteur d'activité.", quand: AV_DEC },
"CTL-ECO-04": { faire: "Dater et documenter la mutation technologique : devis, factures, calendrier de déploiement, effets sur les postes.", quand: AV_CSE },
"CTL-CSE-01": { faire: "Convoquer et consulter le comité social et économique dans les formes légales avant tout acte suivant.", quand: AV_NOT },
"CTL-CSE-02": { faire: "Reprendre le calendrier : respecter les délais entre convocation, réunions et remise de l'avis.", quand: AV_NOT },
"CTL-CSE-03": { faire: "Joindre à la convocation l'intégralité des renseignements exigés par le texte applicable au régime de la procédure.", quand: AV_CSE },
"CTL-CSE-04": { faire: "Recueillir l'avis du comité, ou constater par écrit l'expiration du délai qui vaut avis rendu.", quand: AV_NOT },
"CTL-CSE-05": { faire: "Informer ou saisir l'administration dans le délai et sur le support exigés, et conserver l'accusé de réception.", quand: AV_ADM },
"CTL-CSE-06": { faire: "Reporter la première réunion pour laisser au comité le délai légal entre la convocation et la séance.", quand: AV_CSE },
"CTL-CSE-07": { faire: "Consulter l'instance compétente : comité central, comité d'établissement, ou les deux selon le niveau de la décision.", quand: AV_CSE },
"CTL-CSE-08": { faire: "Verser le procès-verbal de carence, ou organiser les élections avant d'engager la procédure.", quand: AV_CSE },
"CTL-CSE-09": { faire: "Intégrer au calendrier le délai de l'expertise décidée par le comité et, le cas échéant, sa contestation.", quand: AV_DEC },
"CTL-CSE-10": { faire: "Exposer par écrit au comité les conséquences du projet sur la santé, la sécurité et les conditions de travail.", quand: AV_CSE },
"CTL-PSE-01": { faire: "Établir un plan de sauvegarde de l'emploi couvrant les mesures exigées par les textes.", quand: AV_CSE },
"CTL-PSE-02": { faire: "Calibrer le plan sur les moyens du groupe et produire les éléments financiers qui en justifient le niveau.", quand: AV_ADM },
"CTL-PSE-03": { faire: "Arrêter la voie retenue — accord majoritaire ou document unilatéral — et la faire figurer au dossier.", quand: AV_CSE },
"CTL-PSE-04": { faire: "Ne pas notifier avant la décision de validation ou d'homologation de l'administration.", quand: AV_NOT },
"CTL-PSE-05": { faire: "Chiffrer chaque mesure du plan : montants, nombre de bénéficiaires, durée, budget affecté.", quand: AV_CSE },
"CTL-PSE-06": { faire: "Joindre le plan à la convocation du comité, et non le remettre en séance.", quand: AV_CSE },
"CTL-PSE-07": { faire: "Vérifier que les signataires de l'accord atteignent le seuil de représentativité exigé, sinon basculer sur le document unilatéral.", quand: AV_ADM },
"CTL-PRT-01": { faire: "Demander à l'inspecteur du travail l'autorisation de licencier chaque salarié protégé et attendre la décision.", quand: AV_NOT },
"CTL-IND-01": { faire: "Faire examiner par un professionnel la situation de chaque salarié en arrêt, congé maternité ou inaptitude.", quand: AV_NOT },
"CTL-COE-01": { faire: "Faire examiner par un professionnel le risque de co-emploi signalé au dossier.", quand: AV_DEC },
"CTL-CCN-01": { faire: "Verser la convention collective applicable et les accords d'entreprise, puis relancer l'audit.", quand: AV_DEC },
"CTL-CCN-02": { faire: "Vérifier que le texte versé correspond à l'IDCC déclaré et qu'il est à jour de ses avenants.", quand: AV_DEC },
"CTL-CCN-03": { faire: "Confronter chaque accord versé aux règles légales de délai, de critères d'ordre et d'indemnisation.", quand: AV_DEC },
"CTL-USA-01": { faire: "Recenser les usages et engagements unilatéraux plus favorables applicables dans l'entreprise.", quand: AV_DEC },
"CTL-CTX-01": { faire: "Signaler l'existence de tout contentieux ou contrôle en cours à la direction et au conseil juridique de l'entreprise avant toute décision.", quand: NOW },
"CTL-PCE-01": { faire: "Compléter les métadonnées de chaque pièce : date, période couverte, auteur, version, périmètre.", quand: AV_DEC },
"CTL-PCE-02": { faire: "Remplacer ou compléter les pièces postérieures à l'acte qu'elles justifient.", quand: AV_DEC },
"CTL-PCE-03": { faire: "Produire les pièces au périmètre à démontrer : secteur d'activité du groupe, et non la seule entreprise.", quand: AV_DEC },
"CTL-PCE-04": { faire: "Faire lire et viser chaque pièce déposée : une pièce non lue ne démontre rien.", quand: AV_DEC },
"CTL-EFF-01": { faire: "Réconcilier l'effectif de l'établissement et celui de l'entreprise, pièces à l'appui.", quand: AV_CSE },
"CTL-EFF-02": { faire: "Ramener le périmètre d'application des critères d'ordre à celui qu'autorisent la loi et l'accord applicable.", quand: AV_NOT },
};
const ORDRE = [NOW, AV_CSE, AV_OFF, AV_ADM, AV_NOT, AV_DEC];
const de = id => A[id] || { faire: "Reprendre ce point avec votre conseil.", quand: AV_DEC };
const rangQuand = q => { const i = ORDRE.indexOf(q); return i < 0 ? ORDRE.length : i; };
/* Les interdits, en deux registres.
   « constaté » : l'écart est établi, la formule affirme. « à vérifier » : la
   donnée manque, la formule suspend sans affirmer d'irrégularité. Confondre les
   deux ferait passer une absence d'information pour une violation. */
const INTERDITS = {
"CTL-PSE-04": "Ne notifiez aucun licenciement tant que l'administration n'a pas validé ou homologué le plan.",
"CTL-PRT-01": "Ne notifiez aucun licenciement à un salarié protégé sans l'autorisation de l'inspecteur du travail.",
"CTL-CSE-05": "N'engagez pas l'étape suivante sans avoir informé ou saisi l'administration.",
"CTL-CSE-01": "Ne notifiez aucun licenciement avant la consultation du comité.",
"CTL-CSE-02": "Ne notifiez pas : le calendrier de consultation n'est pas régulier.",
"CTL-CSE-07": "Ne poursuivez pas : l'instance consultée n'est pas celle que la loi désigne.",
"CTL-CSE-08": "N'engagez pas la procédure sans comité ni procès-verbal de carence.",
"CTL-REC-08": "Ne notifiez pas : les offres de reclassement ne sont pas régulièrement adressées.",
"CTL-PSE-06": "Ne tenez pas la réunion : le plan doit être joint à la convocation.",
"CTL-PSE-07": "Ne déposez pas l'accord : la condition de représentativité n'est pas remplie.",
};
const SUSPENS = {
"CTL-PSE-04": "Ne notifiez aucun licenciement tant que la décision de validation ou d'homologation n'a pas été vérifiée.",
"CTL-PRT-01": "Ne notifiez aucun licenciement tant que la présence de salariés protégés et le sort de leur autorisation n'ont pas été vérifiés.",
"CTL-CSE-05": "N'engagez pas l'étape suivante tant que l'information ou la saisine de l'administration n'a pas été vérifiée.",
"CTL-CSE-01": "Ne notifiez aucun licenciement tant que la tenue de la consultation du comité n'a pas été vérifiée.",
"CTL-CSE-02": "Ne notifiez pas tant que le calendrier de consultation n'a pas été vérifié.",
"CTL-CSE-07": "Ne poursuivez pas tant que l'instance compétente n'a pas été vérifiée.",
"CTL-CSE-08": "N'engagez pas la procédure tant que l'existence d'un comité ou d'un procès-verbal de carence n'a pas été vérifiée.",
"CTL-REC-08": "Ne notifiez pas tant que la régularité de l'envoi des offres de reclassement n'a pas été vérifiée.",
"CTL-PSE-06": "Ne tenez pas la réunion tant que la remise du plan avec la convocation n'a pas été vérifiée.",
"CTL-PSE-07": "Ne déposez pas l'accord tant que la condition de représentativité n'a pas été vérifiée.",
};
/* Trois registres selon ce que l'application a réellement constaté. */
const interdit = (id, etat) => etat === "non conforme"
  ? (INTERDITS[id] || "Ne poursuivez pas avant correction de ce point.")
  : (SUSPENS[id] || "Ne franchissez pas l'étape correspondante tant que ce point n'a pas été vérifié.");
module.exports = { A, de, ORDRE, rangQuand, INTERDITS, SUSPENS, interdit };
