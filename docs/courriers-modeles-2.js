/* LES COURRIERS DE L'ENTREPRISE, SUITE : salarié, impôts, URSSAF, assurance,
   banque. Même règle que dans courriers-modeles.js : rien qui affirme un
   droit non lu à la source, et tout ce que l'application ne peut pas savoir
   reste entre crochets, visible.

   SUR LA FAMILLE « SALARIÉ », UNE LIMITE VOULUE

   On ne trouvera ici aucune lettre disciplinaire, aucune convocation à
   entretien préalable, aucune rupture. Ces pièces existent dans
   l'application, dans les modules qui les fondent article par article et
   calculent leurs délais. Les mettre ici, sans ce fondement, serait produire
   une lettre juste dans sa forme et fausse dans son effet. Ce fichier s'en
   tient à la gestion courante : ce qu'on écrit à un salarié un mardi matin.  */

(function (window) {
  "use strict";
  var CM = window.CourriersModeles;
  if (!CM) return;
  var a = CM.ajouter;

  /* ══════════════════════════════════════════════════════════════════════
     SALARIÉ
     ══════════════════════════════════════════════════════════════════════ */

  a("salarie", "sal-accueil", "Message d'accueil avant la prise de poste",
    "Votre arrivée le [DATE]",
    ["Bonjour [PRÉNOM],",
     "",
     "Nous nous réjouissons de votre arrivée le [DATE] au poste de [EMPLOI].",
     "",
     "Rendez-vous à [HEURE] à l'adresse suivante : [LIEU]. Demandez [NOM DE LA PERSONNE QUI VOUS ACCUEILLE].",
     "",
     "Pensez à apporter : pièce d'identité, carte Vitale ou attestation, relevé d'identité bancaire, [PERMIS ET CARTE DE QUALIFICATION LE CAS ÉCHÉANT], et [AUTRES PIÈCES].",
     "",
     "Votre première journée sera consacrée à [PROGRAMME : accueil sécurité, remise des équipements, prise en main du véhicule, présentation de l'équipe].",
     "",
     "À bientôt,"]);

  a("salarie", "sal-conges-oui", "Réponse favorable à une demande de congés",
    "Votre demande de congés du [DATE]",
    ["Bonjour [PRÉNOM],",
     "",
     "J'ai bien reçu votre demande de congés du [DATE], pour la période du [DATE] au [DATE].",
     "",
     "Cette demande est acceptée. Votre absence est enregistrée sur ces dates, soit [NOMBRE] jours ouvrables.",
     "",
     "Avant votre départ, merci de voir avec [NOM] la continuité de [CE QUI DOIT ÊTRE REPRIS].",
     "",
     "Bonnes vacances,"]);

  a("salarie", "sal-conges-non", "Refus ou report d'une demande de congés",
    "Votre demande de congés du [DATE]",
    ["Bonjour [PRÉNOM],",
     "",
     "J'ai bien reçu votre demande de congés pour la période du [DATE] au [DATE].",
     "",
     "Je ne peux pas y répondre favorablement, pour la raison suivante : [MOTIF DE SERVICE PRÉCIS : plusieurs absences déjà accordées sur la même période, activité, remplacement impossible]. Ce n'est pas la demande qui est en cause, c'est la période.",
     "",
     "Je vous propose les dates suivantes : [DATES DE REMPLACEMENT]. Dites-moi si elles vous conviennent, ou proposez-m'en d'autres.",
     "",
     "Cordialement,"],
    "L'ordre des départs et les délais de prévenance obéissent au code du travail et, souvent, à la convention collective. Le module « congés payés » de l'application les traite avec leurs articles.");

  a("salarie", "sal-attestation", "Attestation d'emploi",
    "Votre attestation d'emploi",
    ["Je soussigné [REPRÉSENTANT LÉGAL], agissant en qualité de [QUALITÉ] de la société [DÉNOMINATION], atteste que [CIVILITÉ NOM PRÉNOM] est employé dans notre entreprise depuis le [DATE], en qualité de [EMPLOI], dans le cadre d'un contrat [NATURE DU CONTRAT].",
     "",
     "Sa rémunération mensuelle brute s'élève à [MONTANT] euros.",
     "",
     "Cette attestation est établie à la demande de l'intéressé pour faire valoir ce que de droit.",
     "",
     "Fait à [LIEU], le [DATE]."]);

  a("salarie", "sal-acompte", "Réponse à une demande d'acompte",
    "Votre demande d'acompte",
    ["Bonjour [PRÉNOM],",
     "",
     "J'ai bien reçu votre demande d'acompte du [DATE], d'un montant de [MONTANT] euros.",
     "",
     "[Elle est acceptée : le versement interviendra le [DATE] par virement, et la somme sera déduite de votre paie du mois de [MOIS].] [Elle ne peut pas être satisfaite, pour la raison suivante : [MOTIF].]",
     "",
     "Cordialement,"]);

  a("salarie", "sal-rappel", "Rappel d'une consigne de travail",
    "[OBJET DE LA CONSIGNE]",
    ["Bonjour [PRÉNOM],",
     "",
     "Je reviens sur [LE FAIT CONSTATÉ, DATÉ ET DÉCRIT SANS JUGEMENT].",
     "",
     "La consigne est la suivante : [CONSIGNE PRÉCISE]. Elle tient à [RAISON : sécurité, qualité de service, obligation réglementaire].",
     "",
     "Je vous remercie de l'appliquer à compter de maintenant. Si quelque chose l'empêche sur le terrain, venez m'en parler : ce qui ne se dit pas ne se règle pas.",
     "",
     "Cordialement,"],
    "Ce message est un rappel de consigne, non une sanction. Dès lors qu'un écrit reproche un comportement et vise à le corriger, il peut être requalifié en sanction disciplinaire : dans ce cas, passez par le module discipline, qui tient les délais et les garanties.");

  a("salarie", "sal-felicitations", "Félicitations après une réussite",
    "Bravo pour [OBJET]",
    ["Bonjour [PRÉNOM],",
     "",
     "Je tenais à vous dire que [CE QUI A ÉTÉ FAIT ET CE QUE CELA A PRODUIT].",
     "",
     "C'est le genre de travail qui se voit peu et qui compte beaucoup. Merci.",
     "",
     "Cordialement,"]);

  a("salarie", "sal-visite", "Convocation à la visite médicale",
    "Votre visite médicale du [DATE]",
    ["Bonjour [PRÉNOM],",
     "",
     "Vous êtes convoqué à une visite [D'INFORMATION ET DE PRÉVENTION / DE REPRISE / PÉRIODIQUE] auprès du service de prévention et de santé au travail.",
     "",
     "Date : [DATE] à [HEURE]. Lieu : [ADRESSE DU SERVICE].",
     "",
     "Cette visite a lieu pendant le temps de travail et le temps de trajet est pris en charge. Merci de me prévenir sans délai si vous êtes empêché, afin de reprendre un rendez-vous.",
     "",
     "Cordialement,"]);

  a("salarie", "sal-entretien-pro", "Convocation à l'entretien professionnel",
    "Votre entretien professionnel du [DATE]",
    ["Bonjour [PRÉNOM],",
     "",
     "Je vous propose de faire le point sur votre parcours et vos perspectives lors d'un entretien professionnel.",
     "",
     "Date : [DATE] à [HEURE]. Lieu : [LIEU]. Durée prévue : [DURÉE].",
     "",
     "Cet entretien ne porte pas sur l'évaluation de votre travail : il porte sur vos souhaits d'évolution, vos besoins de formation et les moyens d'y répondre. Vous pouvez le préparer en notant ce que vous souhaitez aborder.",
     "",
     "Cordialement,"]);

  a("salarie", "sal-solde", "Envoi des documents de fin de contrat",
    "Vos documents de fin de contrat",
    ["Bonjour [PRÉNOM],",
     "",
     "Votre contrat a pris fin le [DATE]. Vous trouverez ci-joint : votre certificat de travail, votre reçu pour solde de tout compte, l'attestation destinée à France Travail et le récapitulatif de vos droits en matière d'épargne salariale s'il y a lieu.",
     "",
     "Le solde de tout compte, d'un montant de [MONTANT] euros, [vous a été versé le [DATE] / sera versé le [DATE]] par virement.",
     "",
     "Je vous remercie pour le travail accompli et vous souhaite une bonne continuation.",
     "",
     "Cordialement,"]);

  /* ══════════════════════════════════════════════════════════════════════
     IMPÔTS
     ══════════════════════════════════════════════════════════════════════ */

  a("fisc", "fis-delai", "Demande de délai de paiement",
    "Demande de délai de paiement, [IMPÔT CONCERNÉ], SIREN [NUMÉRO]",
    ["Madame, Monsieur,",
     "",
     "Notre société est redevable de [IMPÔT CONCERNÉ] pour un montant de [MONTANT] euros, échu le [DATE].",
     "",
     "Nous rencontrons une difficulté de trésorerie, dont voici la cause : [MOTIF PRÉCIS ET DATÉ : perte d'un client important, impayés, sinistre, baisse d'activité]. Les pièces justificatives sont jointes.",
     "",
     "Nous sollicitons un échelonnement en [NOMBRE] mensualités de [MONTANT] euros, à compter du [DATE]. Nous nous engageons à régler à leur échéance toutes les impositions courantes pendant cette période.",
     "",
     "Nous restons à votre disposition pour tout élément complémentaire.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."],
    "La demande se dépose en principe depuis la messagerie sécurisée de l'espace professionnel. Joignez les pièces dès l'envoi : une demande nue est rejetée.");

  a("fisc", "fis-remise", "Demande de remise de pénalités",
    "Demande de remise gracieuse de pénalités, SIREN [NUMÉRO]",
    ["Madame, Monsieur,",
     "",
     "Nous avons reçu un avis mettant à notre charge des pénalités d'un montant de [MONTANT] euros, au titre de [IMPÔT ET PÉRIODE].",
     "",
     "Le retard à l'origine de ces pénalités tient à [CIRCONSTANCE : erreur de saisie corrigée depuis, maladie du dirigeant, changement de logiciel, défaillance d'un tiers], et non à une volonté de nous soustraire à nos obligations.",
     "",
     "Notre entreprise est à jour de ses autres obligations déclaratives et de paiement, [PRÉCISER : depuis sa création, depuis telle année]. Le principal a été acquitté le [DATE].",
     "",
     "Nous sollicitons la remise gracieuse de ces pénalités.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."]);

  a("fisc", "fis-reclam", "Réclamation contre une imposition",
    "Réclamation, [IMPÔT ET PÉRIODE], SIREN [NUMÉRO]",
    ["Madame, Monsieur,",
     "",
     "Par la présente réclamation, nous contestons [L'IMPOSITION CONTESTÉE : nature, période, montant], mise en recouvrement le [DATE], avis n° [NUMÉRO].",
     "",
     "Les motifs sont les suivants : [EXPOSÉ DES FAITS, PUIS DU MOTIF DE LA CONTESTATION].",
     "",
     "Les pièces suivantes sont jointes : [LISTE].",
     "",
     "Nous sollicitons en conséquence [LA DÉCHARGE / LA RÉDUCTION] de cette imposition, ainsi que le sursis de paiement des sommes contestées.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."],
    "Les délais de réclamation sont enfermés dans des dates strictes et varient selon l'impôt : faites-les vérifier avant d'envoyer, la forclusion ne se rattrape pas.");

  a("fisc", "fis-controle", "Réponse à une demande de renseignements",
    "Votre demande du [DATE], SIREN [NUMÉRO]",
    ["Madame, Monsieur,",
     "",
     "Nous avons bien reçu votre demande du [DATE] relative à [OBJET].",
     "",
     "Vous trouverez ci-joint les éléments demandés : [LISTE DES PIÈCES, DANS L'ORDRE DE VOTRE DEMANDE].",
     "",
     "[Sur le point [X], voici l'explication : [EXPLICATION].]",
     "",
     "Nous restons à votre disposition pour tout complément et pour convenir d'un rendez-vous si vous le jugez utile.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."],
    "Une demande de l'administration porte un délai de réponse. Notez-le dès réception et répondez avant, quitte à demander un report écrit.");

  a("fisc", "fis-tva", "Demande de remboursement de crédit de TVA",
    "Demande de remboursement de crédit de TVA, SIREN [NUMÉRO]",
    ["Madame, Monsieur,",
     "",
     "Notre société présente un crédit de TVA de [MONTANT] euros au titre de [PÉRIODE].",
     "",
     "La demande de remboursement a été déposée le [DATE] depuis notre espace professionnel, sous la référence [RÉFÉRENCE].",
     "",
     "Ce crédit s'explique par [CAUSE : investissements réalisés sur la période, opérations exonérées, décalage entre achats et ventes]. Les justificatifs sont joints : [LISTE].",
     "",
     "Nous vous remercions de bien vouloir procéder au remboursement sur le compte dont le relevé d'identité bancaire est joint.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."]);

  a("fisc", "fis-adresse", "Changement de situation de l'entreprise",
    "Changement [D'ADRESSE / DE DIRIGEANT / D'ACTIVITÉ], SIREN [NUMÉRO]",
    ["Madame, Monsieur,",
     "",
     "Nous vous informons du changement suivant, effectif au [DATE] : [CHANGEMENT].",
     "",
     "Les formalités correspondantes ont été accomplies le [DATE] auprès du guichet des formalités des entreprises, sous la référence [RÉFÉRENCE].",
     "",
     "Nous vous remercions de mettre à jour nos coordonnées et de nous confirmer la prise en compte de cette modification.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."]);

  /* ══════════════════════════════════════════════════════════════════════
     URSSAF
     ══════════════════════════════════════════════════════════════════════ */

  a("urssaf", "urs-delai", "Demande de délai de paiement",
    "Demande de délai, compte cotisant n° [NUMÉRO]",
    ["Madame, Monsieur,",
     "",
     "Notre entreprise est redevable de cotisations d'un montant de [MONTANT] euros au titre de la période [PÉRIODE].",
     "",
     "Nous traversons une difficulté de trésorerie liée à [MOTIF]. Les déclarations sociales nominatives ont été déposées à bonne date : seul le paiement est en cause.",
     "",
     "Nous sollicitons un échéancier en [NOMBRE] mensualités de [MONTANT] euros à compter du [DATE], et nous engageons à régler à leur date les cotisations courantes.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."],
    "La part salariale des cotisations n'entre en général pas dans un échéancier : préparez son règlement immédiat.");

  a("urssaf", "urs-majorations", "Demande de remise de majorations de retard",
    "Demande de remise de majorations, compte cotisant n° [NUMÉRO]",
    ["Madame, Monsieur,",
     "",
     "Des majorations de retard d'un montant de [MONTANT] euros ont été appelées au titre de [PÉRIODE].",
     "",
     "Le principal a été réglé le [DATE]. Le retard tenait à [CIRCONSTANCE].",
     "",
     "Notre entreprise est à jour de ses obligations déclaratives et n'a pas connu d'incident au cours des [DURÉE] précédentes.",
     "",
     "Nous sollicitons la remise de ces majorations.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."]);

  a("urssaf", "urs-mise-demeure", "Contestation d'une mise en demeure",
    "Contestation de la mise en demeure du [DATE], n° [NUMÉRO]",
    ["Lettre recommandée avec accusé de réception",
     "",
     "Madame, Monsieur,",
     "",
     "Nous avons reçu le [DATE] une mise en demeure portant sur un montant de [MONTANT] euros au titre de [PÉRIODE ET NATURE].",
     "",
     "Nous la contestons pour les motifs suivants : [MOTIFS : cotisations déjà réglées le [DATE], référence du virement ; erreur d'assiette ; période déjà régularisée ; salarié non concerné].",
     "",
     "Les pièces justificatives sont jointes : [LISTE].",
     "",
     "Nous saisissons en conséquence la commission de recours amiable de cette contestation.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."],
    "La saisine de la commission de recours amiable est enfermée dans un délai court à compter de la réception de la mise en demeure. Vérifiez la date portée sur l'accusé de réception et le délai indiqué sur la mise en demeure elle-même.");

  a("urssaf", "urs-controle", "Réponse à une lettre d'observations",
    "Réponse à votre lettre d'observations du [DATE]",
    ["Lettre recommandée avec accusé de réception",
     "",
     "Madame, Monsieur,",
     "",
     "Nous avons reçu le [DATE] votre lettre d'observations faisant suite au contrôle de notre entreprise, pour un redressement envisagé de [MONTANT] euros.",
     "",
     "Nous formulons les observations suivantes, point par point :",
     "",
     "Point n° [NUMÉRO], [INTITULÉ] : [OBSERVATION ET PIÈCES].",
     "Point n° [NUMÉRO], [INTITULÉ] : [OBSERVATION ET PIÈCES].",
     "",
     "[Nous acceptons en revanche les points n° [NUMÉROS], dont nous avons pris acte.]",
     "",
     "Nous vous remercions de bien vouloir en tenir compte avant l'établissement de la mise en recouvrement.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."],
    "Le délai pour répondre à une lettre d'observations est bref et il est décisif : la réponse écrite est ce qui sera examiné ensuite.");

  a("urssaf", "urs-attestation", "Demande d'attestation de vigilance",
    "Demande d'attestation de vigilance, compte cotisant n° [NUMÉRO]",
    ["Madame, Monsieur,",
     "",
     "Nous sollicitons la délivrance de notre attestation de vigilance, à jour au [DATE], destinée à [DONNEUR D'ORDRE / APPEL D'OFFRES].",
     "",
     "Notre compte cotisant porte le numéro [NUMÉRO] et nos déclarations sont à jour au [DATE].",
     "",
     "Nous vous remercions de nous l'adresser [PAR VOTRE ESPACE EN LIGNE / À L'ADRESSE SUIVANTE].",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."]);

  /* ══════════════════════════════════════════════════════════════════════
     ASSURANCE
     ══════════════════════════════════════════════════════════════════════ */

  a("assurance", "ass-sinistre", "Déclaration de sinistre",
    "Déclaration de sinistre, contrat n° [NUMÉRO]",
    ["Madame, Monsieur,",
     "",
     "Nous déclarons un sinistre survenu le [DATE] à [LIEU], au titre du contrat n° [NUMÉRO].",
     "",
     "Circonstances : [RÉCIT FACTUEL, DATÉ ET HEURÉ, SANS APPRÉCIATION].",
     "",
     "Dommages constatés : [DESCRIPTION ET ESTIMATION].",
     "",
     "Personnes impliquées : [NOMS ET QUALITÉS]. Témoins : [NOMS ET COORDONNÉES].",
     "",
     "Pièces jointes : [CONSTAT, PHOTOGRAPHIES, DÉPÔT DE PLAINTE, FACTURES, PROCÈS-VERBAL].",
     "",
     "Nous vous remercions de nous indiquer les suites données et, le cas échéant, la date de passage de l'expert.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."],
    "Les délais de déclaration sont courts et figurent au contrat, plus courts encore en cas de vol. Déclarez d'abord, complétez ensuite.");

  a("assurance", "ass-relance", "Relance sur un dossier de sinistre",
    "Sinistre n° [NUMÉRO] : relance",
    ["Madame, Monsieur,",
     "",
     "Notre sinistre n° [NUMÉRO], déclaré le [DATE], n'a pas connu d'avancée depuis [DATE].",
     "",
     "À ce jour : [ÉTAT DU DOSSIER : expertise réalisée le [DATE], pièces transmises le [DATE], aucune proposition reçue].",
     "",
     "Ce retard nous cause le préjudice suivant : [CONSÉQUENCE CONCRÈTE : véhicule immobilisé, activité réduite, avance de frais].",
     "",
     "Nous vous remercions de nous indiquer, sous [NOMBRE] jours, l'état exact du dossier et la date à laquelle une proposition d'indemnisation nous sera faite.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."]);

  a("assurance", "ass-refus", "Contestation d'un refus de garantie",
    "Sinistre n° [NUMÉRO] : contestation du refus de prise en charge",
    ["Lettre recommandée avec accusé de réception",
     "",
     "Madame, Monsieur,",
     "",
     "Par courrier du [DATE], vous refusez la prise en charge du sinistre n° [NUMÉRO], au motif suivant : [MOTIF INVOQUÉ, CITÉ MOT POUR MOT].",
     "",
     "Nous contestons ce refus : [MOTIFS DE LA CONTESTATION, EN VISANT LES CLAUSES DU CONTRAT ET LES FAITS ÉTABLIS].",
     "",
     "Les pièces suivantes, déjà en votre possession ou jointes à la présente, l'établissent : [LISTE].",
     "",
     "Nous vous demandons de réexaminer ce dossier sous [NOMBRE] jours. À défaut, nous saisirons [LE SERVICE RÉCLAMATIONS PUIS LE MÉDIATEUR DE L'ASSURANCE].",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."]);

  a("assurance", "ass-resil", "Résiliation d'un contrat à l'échéance",
    "Résiliation du contrat n° [NUMÉRO]",
    ["Lettre recommandée avec accusé de réception",
     "",
     "Madame, Monsieur,",
     "",
     "Nous vous informons de notre décision de résilier le contrat n° [NUMÉRO], souscrit le [DATE], à son échéance du [DATE].",
     "",
     "Nous vous remercions de nous adresser confirmation de cette résiliation, ainsi que le décompte des sommes éventuellement dues ou à rembourser, et un relevé d'informations.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."],
    "Le préavis figure au contrat. Envoyez la lettre assez tôt pour qu'elle arrive avant la date limite : c'est la réception qui compte, non l'envoi.");

  a("assurance", "ass-devis", "Demande d'étude et de devis",
    "Demande d'étude de nos garanties",
    ["Madame, Monsieur,",
     "",
     "Notre entreprise exerce l'activité suivante : [ACTIVITÉ]. Elle emploie [EFFECTIF] salariés et exploite [PARC, LOCAUX, MATÉRIEL].",
     "",
     "Nous souhaitons une étude portant sur : [GARANTIES SOUHAITÉES : responsabilité civile, flotte, marchandises transportées, locaux, perte d'exploitation, protection juridique].",
     "",
     "Notre situation actuelle : [ASSUREUR ACTUEL, ÉCHÉANCE, SINISTRALITÉ DES TROIS DERNIÈRES ANNÉES].",
     "",
     "Nous vous remercions de nous adresser une proposition chiffrée avant le [DATE], avec le détail des franchises et des exclusions.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."]);

  a("assurance", "ass-modif", "Modification du risque assuré",
    "Contrat n° [NUMÉRO] : modification du risque",
    ["Madame, Monsieur,",
     "",
     "Nous vous informons de la modification suivante, effective au [DATE] : [MODIFICATION : nouveau véhicule, cession, nouveau local, nouvelle activité, variation d'effectif].",
     "",
     "Nous vous remercions d'établir l'avenant correspondant et de nous préciser l'incidence sur la prime.",
     "",
     "Jusqu'à réception de cet avenant, merci de nous confirmer que [CE QUI DOIT RESTER COUVERT] demeure garanti.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."],
    "Une modification du risque non déclarée peut réduire ou supprimer la garantie au moment du sinistre. Déclarez tôt, et gardez la preuve de l'envoi.");

  /* ══════════════════════════════════════════════════════════════════════
     BANQUE
     ══════════════════════════════════════════════════════════════════════ */

  a("banque", "ban-decouvert", "Demande de découvert ou d'augmentation",
    "Demande d'autorisation de découvert, compte n° [NUMÉRO]",
    ["Madame, Monsieur,",
     "",
     "Nous sollicitons [UNE AUTORISATION DE DÉCOUVERT / UNE AUGMENTATION DE NOTRE AUTORISATION] à hauteur de [MONTANT] euros, pour la période du [DATE] au [DATE].",
     "",
     "Cette demande tient à [MOTIF : décalage entre encaissements et décaissements, délais de règlement clients, saisonnalité, investissement].",
     "",
     "Éléments joints : [DERNIER BILAN, SITUATION INTERMÉDIAIRE, PLAN DE TRÉSORERIE SUR SIX MOIS, CARNET DE COMMANDES].",
     "",
     "Nous restons à votre disposition pour en parler lors d'un rendez-vous.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."]);

  a("banque", "ban-pret", "Demande de financement",
    "Demande de financement, [OBJET]",
    ["Madame, Monsieur,",
     "",
     "Nous sollicitons un financement de [MONTANT] euros sur [DURÉE], destiné à [OBJET PRÉCIS : acquisition de véhicules, matériel, aménagement, reprise].",
     "",
     "L'investissement se justifie ainsi : [JUSTIFICATION ÉCONOMIQUE, CHIFFRÉE : gain attendu, contrat obtenu, économie réalisée].",
     "",
     "Notre apport s'élève à [MONTANT] euros. Les documents suivants sont joints : [LIASSES FISCALES, PRÉVISIONNEL, DEVIS, CARNET DE COMMANDES].",
     "",
     "Nous vous remercions de l'attention que vous porterez à cette demande.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."]);

  a("banque", "ban-frais", "Contestation de frais bancaires",
    "Contestation de frais, compte n° [NUMÉRO]",
    ["Madame, Monsieur,",
     "",
     "Notre relevé du [DATE] fait apparaître des frais d'un montant de [MONTANT] euros, au titre de [NATURE DES FRAIS].",
     "",
     "Ces frais [ne correspondent pas aux conditions tarifaires qui nous ont été communiquées / font suite à un incident dont l'origine ne nous est pas imputable : [EXPLICATION]].",
     "",
     "Nous vous demandons leur restitution, ainsi que le détail du calcul appliqué.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."]);

  a("banque", "ban-prelevement", "Opposition à un prélèvement",
    "Opposition à prélèvement, compte n° [NUMÉRO]",
    ["Madame, Monsieur,",
     "",
     "Nous vous demandons de faire opposition au prélèvement suivant : créancier [NOM], référence de mandat [RÉFÉRENCE], montant [MONTANT] euros, date [DATE].",
     "",
     "Motif : [PRÉLÈVEMENT NON AUTORISÉ / CONTRAT RÉSILIÉ LE [DATE] / MONTANT ERRONÉ / DOUBLON].",
     "",
     "Nous vous remercions de nous confirmer la prise en compte de cette opposition et, le cas échéant, de procéder au remboursement des sommes déjà prélevées.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."]);

  a("banque", "ban-cheque", "Information sur un chèque impayé reçu",
    "Chèque impayé n° [NUMÉRO] : demande de représentation",
    ["Madame, Monsieur,",
     "",
     "Le chèque n° [NUMÉRO], d'un montant de [MONTANT] euros, remis à l'encaissement le [DATE], nous est revenu impayé le [DATE].",
     "",
     "Nous vous remercions de [LE REPRÉSENTER LE [DATE] / NOUS DÉLIVRER LE CERTIFICAT DE NON-PAIEMENT].",
     "",
     "Merci également de nous confirmer les frais appliqués à cette opération.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."]);
})(window);
