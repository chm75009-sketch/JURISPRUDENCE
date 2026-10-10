/* LES COURRIERS DU MÉTIER, SUITE : le chargement, le conducteur, le garage, la
   licence, l'assurance de la flotte, et les administrations locales.

   Même règle que les quatre fichiers précédents : rien n'affirme un droit non
   lu à la source, et tout ce que l'application ne peut pas connaître reste
   entre crochets. Les textes cités ici ont été relus au relais le 10 octobre
   2026, deux lectures concordantes chacun :

     R. 4515-4   LEGIARTI000018529684  code du travail : les opérations de
                 chargement ou de déchargement font l'objet d'un document écrit,
                 dit « protocole de sécurité », remplaçant le plan de prévention
                 (champ d'application à R. 4515-1) ;
     R. 3211-12  LEGIARTI000046177442  code des transports : la licence est
                 accompagnée de copies certifiées conformes numérotées dont le
                 nombre correspond à celui des véhicules ; l'original est
                 conservé dans l'établissement.

   Ce qui n'a pas été relu à la source cette session n'est pas cité : les
   obligations qui tiennent aux règlements européens (temps de conduite,
   tachygraphe, accès à la profession) sont décrites en fait, sans numéro. */

(function (window) {
  "use strict";
  var CM = window.CourriersModeles;
  if (!CM) return;
  var a = CM.ajouter;

  /* ─────────────────────────────── Client ────────────────────────────── */

  a("client", "cli-nonconf", "Refus de prise en charge d'un chargement non conforme",
    "Chargement du [DATE] : refus motivé",
    ["Madame, Monsieur,",
     "",
     "Lors de la présentation au chargement le [DATE] à [LIEU], notre conducteur n'a pas pu prendre en charge la marchandise en l'état.",
     "",
     "Motif : [surcharge au regard du poids autorisé du véhicule ou de l'essieu / emballage insuffisant ou abîmé / palettes instables / marchandise impossible à arrimer en sécurité / nature non conforme à la commande]. Charger ainsi aurait exposé la marchandise, le conducteur et les autres usagers, et engagé notre responsabilité.",
     "",
     "Nous pouvons reprendre ce transport dès que [la charge est conforme / l'emballage est repris / le conditionnement permet l'arrimage]. Dites-moi quand la marchandise sera présentée en état d'être chargée.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  a("client", "cli-protocole", "Demande du protocole de sécurité avant la première livraison",
    "Première intervention sur votre site : protocole de sécurité",
    ["Madame, Monsieur,",
     "",
     "Avant notre première intervention sur votre site, je vous remercie d'établir avec nous le protocole de sécurité.",
     "",
     "Les opérations de chargement ou de déchargement font l'objet d'un document écrit, dit « protocole de sécurité », qui remplace le plan de prévention (article R. 4515-4 du code du travail). Il décrit notamment les lieux et horaires, les consignes de circulation et de manœuvre sur votre site, les moyens de manutention, les équipements de protection exigés et les risques particuliers.",
     "",
     "Merci de me transmettre votre protocole, ou de me dire qui le prépare, afin que nos conducteurs en aient connaissance avant de se présenter.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  a("client", "cli-rdv", "Demande de rendez-vous de chargement ou de livraison",
    "Transport du [DATE] : créneau de rendez-vous",
    ["Madame, Monsieur,",
     "",
     "Pour le transport prévu le [DATE] ([enlèvement / livraison] à [LIEU]), je vous remercie de me confirmer un créneau de rendez-vous.",
     "",
     "Caler l'heure nous évite l'attente du véhicule et vous évite l'encombrement de vos quais. Proposez-moi une plage, ou dites-moi la procédure de prise de rendez-vous de votre site.",
     "",
     "À défaut de créneau confirmé, le véhicule se présentera le [DATE] entre [HEURE] et [HEURE], et l'attente éventuelle au-delà du temps prévu sera facturée.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  a("client", "cli-attest-assur", "Envoi d'une attestation d'assurance marchandises transportées",
    "Votre demande : attestation d'assurance",
    ["Madame, Monsieur,",
     "",
     "Vous trouverez ci-joint, comme vous me l'avez demandé, l'attestation de notre assurance des marchandises transportées, en cours de validité.",
     "",
     "Elle précise l'assureur, le numéro de police, la période de garantie et les limites d'indemnisation. Je reste à votre disposition pour toute précision, et vous informerai de tout changement affectant cette couverture.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  /* ───────────────────────── Salarié (conducteur) ────────────────────── */

  a("salarie", "sal-echeance", "Rappel d'une échéance : permis, FCO, carte ou visite",
    "Un titre à renouveler avant le [DATE]",
    ["Bonjour [PRÉNOM],",
     "",
     "Un de tes titres arrive à échéance et doit être à jour pour que tu puisses continuer à conduire :",
     "",
     "[PRÉCISER : permis de conduire valable jusqu'au DATE / FCO à repasser avant le DATE / carte de conducteur à renouveler avant le DATE / visite médicale du permis valable jusqu'au DATE].",
     "",
     "Merci de lancer la démarche dès maintenant, les délais de rendez-vous sont parfois longs, et de me transmettre le justificatif une fois fait. Si tu as besoin d'aide pour la prise de rendez-vous ou d'un aménagement de planning, dis-le-moi.",
     "",
     "Merci, et à bientôt."]);

  a("salarie", "sal-carte-tele", "Demande de remise de la carte conducteur pour téléchargement",
    "Téléchargement de ta carte conducteur",
    ["Bonjour [PRÉNOM],",
     "",
     "Nous devons télécharger les données de ta carte de conducteur dans les délais réglementaires.",
     "",
     "Merci de la remettre à [NOM / SERVICE] le [DATE], ou de passer la présenter au dépôt. L'opération ne prend que quelques minutes et la carte t'est aussitôt rendue.",
     "",
     "Pense aussi à ce que les données du chronotachygraphe du véhicule soient téléchargées : les deux se complètent.",
     "",
     "Merci, et à bientôt."]);

  a("salarie", "sal-attest-activites", "Attestation d'activités pour un contrôle routier",
    "Attestation de tes activités du [DATE] au [DATE]",
    ["Bonjour [PRÉNOM],",
     "",
     "Voici, pour tenir à bord en cas de contrôle, l'attestation de tes activités sur la période du [DATE] au [DATE], pendant laquelle tu n'as pas conduit.",
     "",
     "Elle indique les jours concernés et leur motif : [congé / repos / maladie / autre travail que la conduite / absence]. Elle complète les relevés de ta carte et du chronotachygraphe pour cette période.",
     "",
     "Garde-la dans la cabine avec tes autres documents. Dis-moi si une date doit être corrigée.",
     "",
     "Merci, et bonne route."]);

  a("salarie", "sal-restitution", "Demande de restitution du matériel en fin de contrat",
    "Fin de ton contrat : matériel à rendre",
    ["Bonjour [PRÉNOM],",
     "",
     "Ton contrat prend fin le [DATE]. Merci de rendre à cette date le matériel de l'entreprise qui t'a été confié :",
     "",
     "[LISTE : carte de conducteur si elle appartient à l'entreprise, badge d'accès, carte carburant, carte de télépéage, clés du véhicule et du dépôt, téléphone, tablette, vêtements de travail, documents de bord].",
     "",
     "Nous ferons ensemble un point de remise, et je te confirmerai par écrit que tout a été rendu. Si un élément manque ou est hors d'usage, nous le noterons simplement à ce moment-là.",
     "",
     "Merci pour ton travail, et bonne continuation."]);

  a("salarie", "sal-decoucher", "Information sur un découcher ou un changement d'affectation",
    "Ta tournée du [DATE]",
    ["Bonjour [PRÉNOM],",
     "",
     "Pour la tournée du [DATE], ton affectation change : [NOUVELLE TOURNÉE / NOUVEAU VÉHICULE / DÉPART ANTICIPÉ], et elle comporte un découcher la nuit du [DATE] à [LIEU].",
     "",
     "Les frais de repas et de découcher sont pris en charge selon nos règles habituelles [préciser le mode : forfait, note de frais]. Pense à prévoir tes repos, et dis-moi si cette organisation te pose une difficulté personnelle, nous regarderons.",
     "",
     "Merci, et bonne route."]);

  /* ─────────────────────────────── Fournisseur ───────────────────────── */

  a("fournisseur", "fou-garage", "Réclamation à un garage sur une réparation mal faite",
    "Intervention du [DATE] sur le véhicule [IMMATRICULATION]",
    ["Madame, Monsieur,",
     "",
     "Vous êtes intervenus le [DATE] sur notre véhicule [IMMATRICULATION] pour [NATURE DE LA RÉPARATION], facturé [MONTANT] euros.",
     "",
     "Le défaut n'est pas réglé : [DESCRIPTION : le problème persiste / un nouveau défaut est apparu depuis / le véhicule est immobilisé]. Cette panne nous prive d'un véhicule d'exploitation et nous cause un préjudice.",
     "",
     "Je vous demande de reprendre l'intervention sans frais, dans le cadre de votre garantie, et au plus vite compte tenu de l'immobilisation. Merci de me rappeler pour convenir d'un rendez-vous.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  a("fournisseur", "fou-location", "Contestation de l'état des lieux d'un véhicule de location rendu",
    "Restitution du [DATE] : contestation des dégâts facturés",
    ["Madame, Monsieur,",
     "",
     "Vous nous facturez [MONTANT] euros au titre de dégâts constatés sur le véhicule [IMMATRICULATION / RÉFÉRENCE] rendu le [DATE].",
     "",
     "Je conteste cette facturation : [MOTIF : les dégâts figuraient déjà sur l'état des lieux de départ / l'état des lieux de retour a été fait sans nous / l'usure invoquée est normale / les photographies ne datent pas de la restitution]. Je joins [état des lieux de départ, photographies datées, contrat].",
     "",
     "Je vous remercie d'annuler cette facture, ou de me communiquer les éléments contradictoires qui la justifieraient.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  a("fournisseur", "fou-carte-carb", "Opposition après la perte ou le vol d'une carte carburant",
    "Carte carburant n° [NUMÉRO] : opposition",
    ["Madame, Monsieur,",
     "",
     "Je vous demande de mettre immédiatement en opposition la carte carburant n° [NUMÉRO], rattachée au véhicule [IMMATRICULATION] ou au conducteur [NOM], [perdue / volée] le [DATE].",
     "",
     "Merci de me confirmer par écrit la date et l'heure de la mise en opposition, et de ne tenir pour nôtres aucune transaction postérieure. Je vous remercie également d'émettre une carte de remplacement.",
     "",
     "[Une plainte est déposée / sera déposée pour le vol, sous la référence NUMÉRO.]",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  /* ───────────────── Transport : licence et administration ───────────── */

  a("transport", "tr-copies", "Demande de copies conformes supplémentaires de la licence",
    "Licence n° [NUMÉRO] : copies conformes supplémentaires",
    ["Madame, Monsieur,",
     "",
     "Notre entreprise est titulaire de la licence [communautaire / de transport intérieur] n° [NUMÉRO]. Notre parc a augmenté : nous mettons désormais [NOMBRE] véhicules en circulation.",
     "",
     "La licence est accompagnée de copies certifiées conformes numérotées dont le nombre correspond à celui des véhicules (article R. 3211-12 du code des transports). Je vous demande donc la délivrance de [NOMBRE] copie(s) conforme(s) supplémentaire(s), pour que chaque véhicule dispose de la sienne à bord.",
     "",
     "Vous trouverez ci-joint [les justificatifs des véhicules concernés / le formulaire de demande]. Je reste à votre disposition pour tout complément.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  a("transport", "tr-gestionnaire", "Changement de gestionnaire de transport",
    "Déclaration d'un nouveau gestionnaire de transport",
    ["Madame, Monsieur,",
     "",
     "Je vous informe du changement de gestionnaire de transport de notre entreprise.",
     "",
     "Le précédent gestionnaire, [NOM], a cessé ses fonctions le [DATE]. Le nouveau gestionnaire est [NOM], [titulaire de l'attestation de capacité professionnelle n° [NUMÉRO] / dont la demande de reconnaissance est jointe]. Il dirige effectivement et en permanence l'activité de transport et a un lien réel avec l'entreprise.",
     "",
     "Vous trouverez ci-joint [les pièces justifiant sa capacité et son lien avec l'entreprise]. Je vous remercie d'enregistrer cette modification au registre et de me confirmer que notre situation reste régulière.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  a("transport", "tr-carte-cond", "Perte, vol ou défaillance d'une carte de conducteur",
    "Carte de conducteur de [NOM] : [perte / vol / défaillance]",
    ["Madame, Monsieur,",
     "",
     "Je vous déclare la [perte / le vol / la défaillance] de la carte de conducteur de [NOM], n° [NUMÉRO], survenue le [DATE].",
     "",
     "[En cas de vol : une plainte a été déposée le [DATE] sous la référence [NUMÉRO].] Je sollicite la délivrance d'une carte de remplacement dans les meilleurs délais.",
     "",
     "Dans l'attente, le conducteur conserve les feuilles d'enregistrement ou les justificatifs d'activité prévus, pour que son temps de conduite et de repos reste contrôlable.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  /* ─────────────────────────────── Assurance ─────────────────────────── */

  a("assurance", "ass-vol", "Déclaration d'un vol de marchandises ou de véhicule",
    "Déclaration de vol du [DATE]",
    ["Madame, Monsieur,",
     "",
     "Je vous déclare le vol survenu le [DATE] à [LIEU], au titre de notre contrat n° [NUMÉRO] :",
     "",
     "[Véhicule [IMMATRICULATION], [marque et modèle] / Marchandise transportée : [NATURE], [VALEUR] euros, pour le compte de [CLIENT]]. Circonstances : [DESCRIPTION]. Une plainte a été déposée le [DATE] auprès de [COMMISSARIAT / GENDARMERIE], sous la référence [NUMÉRO], dont copie est jointe.",
     "",
     "Je joins [la lettre de voiture, la facture de la marchandise, les photographies, le dépôt de plainte]. Merci de m'indiquer la marche à suivre et les pièces encore utiles, et de m'ouvrir un dossier de sinistre.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  a("assurance", "ass-sinistralite", "Demande du relevé de sinistralité de la flotte",
    "Demande de relevé de sinistralité",
    ["Madame, Monsieur,",
     "",
     "Dans le cadre de [la mise en concurrence de notre assurance flotte / le renouvellement de notre contrat], je vous remercie de me transmettre le relevé de sinistralité de notre flotte.",
     "",
     "Il couvrirait les [NOMBRE] dernières années et indiquerait, par exercice, le nombre de sinistres, leur nature, leur coût et la part de responsabilité retenue.",
     "",
     "Ce document m'est demandé par [l'assureur pressenti / notre courtier]. Je vous remercie de me l'adresser avant le [DATE].",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  /* ─────────────────────────── Mairie et préfecture ──────────────────── */

  a("mairie", "mai-stationnement", "Demande d'autorisation de stationnement ou de livraison",
    "Demande d'autorisation : [stationnement / livraison] le [DATE]",
    ["Madame, Monsieur le Maire,",
     "",
     "Notre entreprise doit effectuer [un stationnement / une livraison] le [DATE] à [ADRESSE], pour [MOTIF : livraison volumineuse, déménagement, chantier, marchandise lourde].",
     "",
     "Je sollicite l'autorisation [d'occuper temporairement la voie ou une place de stationnement / de livrer en dehors des horaires autorisés], de [HEURE] à [HEURE], pour un véhicule [TYPE, IMMATRICULATION] de [GABARIT]. La signalisation et la sécurité des lieux seront assurées conformément à vos prescriptions.",
     "",
     "Je vous remercie de me faire connaître les démarches et les éventuelles redevances. Je me tiens à votre disposition pour tout complément.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur le Maire, l'expression de ma considération distinguée."]);

  a("mairie", "mai-fourriere", "Contestation d'une mise en fourrière",
    "Véhicule [IMMATRICULATION] : contestation de la mise en fourrière",
    ["Madame, Monsieur,",
     "",
     "Notre véhicule [IMMATRICULATION] a été mis en fourrière le [DATE] à [LIEU], et les frais d'enlèvement et de garde nous sont réclamés.",
     "",
     "Je conteste cette mesure : [MOTIF : le stationnement était autorisé, justificatif joint / le véhicule était en cours de livraison, dans un créneau autorisé / l'arrêté ou la signalisation n'étaient pas en place / l'adresse du propriétaire était connue et aucun avis n'a été donné]. Je joins [les pièces : autorisation, photographies datées, bon de livraison].",
     "",
     "Je vous remercie de réexaminer cette décision et d'annuler ou de réduire les frais. À défaut, merci de m'indiquer la voie et le délai de recours.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération distinguée."]);

})(typeof window !== "undefined" ? window : this);
