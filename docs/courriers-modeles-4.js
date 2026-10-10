/* LES COURRIERS DU CLIENT, SUITE : la relation de transport, du devis à la
   livraison et à la facture.

   Même règle que les trois fichiers précédents : rien n'affirme un droit qui
   n'a pas été lu à la source, et tout ce que l'application ne peut pas
   connaître reste entre crochets, visible. Les seuls textes cités ici ont été
   relus au relais le 10 octobre 2026, deux lectures concordantes chacun :

     L. 3222-1  LEGIARTI000046194417  code des transports : lorsque le contrat
                mentionne les charges de gazole retenues pour le prix, ce prix
                est révisé DE PLEIN DROIT pour couvrir la variation du coût du
                gazole entre la date du contrat et la réalisation du transport,
                et la facture fait apparaître ces charges ;
     L. 133-3   LEGIARTI000021486442  code de commerce : la réception éteint
                toute action pour avarie ou perte partielle si, dans les trois
                jours (jours fériés non compris) qui suivent, le destinataire
                n'a pas notifié sa protestation motivée par acte extrajudiciaire
                ou lettre recommandée ;
     L. 132-8   LEGIARTI000006220236  code de commerce : action directe en
                paiement du transporteur contre l'expéditeur et le destinataire.
                Le courrier correspondant est dans la famille « Transport », il
                n'est pas repris ici.

   Ce fichier ne porte que des lettres de gestion. Les pièces du métier qui
   tiennent un délai ou fondent un droit (protestation après avarie, mise en
   demeure avant rétention, action directe) sont dans la famille Transport,
   qui les date et les fonde article par article. */

(function (window) {
  "use strict";
  var CM = window.CourriersModeles;
  if (!CM) return;
  var a = CM.ajouter;

  /* ─────────────────── Avant la prise en charge ──────────────────────── */

  a("client", "cli-commande", "Confirmation d'une commande de transport",
    "Votre commande du [DATE] : confirmation",
    ["Madame, Monsieur,",
     "",
     "Je vous confirme la prise en charge de votre commande du [DATE].",
     "",
     "Enlèvement : [LIEU], le [DATE], entre [HEURE] et [HEURE]. Livraison : [LIEU], le [DATE]. Nature de la marchandise : [NATURE], [POIDS] kg, [NOMBRE] colis ou [QUANTITÉ] palettes. Prix convenu : [MONTANT] euros hors taxes, selon notre devis ou nos conditions.",
     "",
     "Merci de me signaler avant l'enlèvement toute particularité : marchandise fragile, température dirigée, matière dangereuse, accès ou horaires contraints, rendez-vous obligatoire.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  a("client", "cli-cgt", "Envoi des conditions générales de transport",
    "Nos conditions générales",
    ["Madame, Monsieur,",
     "",
     "Vous trouverez ci-joint nos conditions générales, qui s'appliquent à nos prestations sauf convention écrite différente.",
     "",
     "Elles précisent notamment les modalités d'enlèvement et de livraison, les délais, les prix et leurs révisions, les réserves à porter à la livraison et les délais pour le faire, ainsi que les conditions de paiement.",
     "",
     "Je vous remercie de m'en retourner un exemplaire daté et signé, ou de m'en accuser réception par retour.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  a("client", "cli-compte", "Ouverture de compte : pièces à fournir",
    "Ouverture de votre compte",
    ["Madame, Monsieur,",
     "",
     "Pour ouvrir votre compte et préparer la facturation, je vous remercie de me transmettre les pièces suivantes :",
     "",
     "- un extrait Kbis de moins de trois mois ;",
     "- un relevé d'identité bancaire ;",
     "- l'adresse de facturation et, si elle diffère, l'adresse d'enlèvement ou de livraison ;",
     "- le nom et les coordonnées de la personne à contacter pour l'exploitation et pour la comptabilité ;",
     "- le cas échéant, votre numéro de TVA intracommunautaire.",
     "",
     "Dès réception, je vous confirme l'ouverture du compte et les conditions de règlement.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  a("client", "cli-cadre", "Proposition d'un contrat cadre",
    "Proposition d'un accord sur la durée",
    ["Madame, Monsieur,",
     "",
     "Nos échanges récents portent sur des transports réguliers. Je vous propose de les encadrer par un accord sur la durée, qui nous évitera de renégocier chaque commande.",
     "",
     "Il fixerait : le périmètre des transports confiés, les volumes ou fréquences prévus, la grille de prix et ses révisions (dont la variation du gazole), les délais, les engagements de chacun et la durée de l'accord.",
     "",
     "Je vous adresse un projet ci-joint. Disons-nous un moment pour en parler et l'ajuster à votre organisation.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  a("client", "cli-refus-cmd", "Refus d'une commande",
    "Votre demande du [DATE]",
    ["Madame, Monsieur,",
     "",
     "Je vous remercie de votre demande du [DATE] pour [OBJET].",
     "",
     "Je ne peux malheureusement pas la prendre en charge : [MOTIF : délai trop court, poids ou dimensions hors de nos moyens, marchandise hors de notre activité, zone non desservie, plan de charge complet à cette date].",
     "",
     "Si votre besoin peut s'adapter (une autre date, un autre conditionnement), revenez vers moi, je regarderai volontiers. À défaut, je peux vous orienter vers un confrère.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  a("client", "cli-annul", "Facturation d'une annulation tardive",
    "Annulation du [DATE] : frais",
    ["Madame, Monsieur,",
     "",
     "Vous avez annulé le [DATE] le transport prévu le [DATE], alors que [le véhicule était déjà affecté / le chauffeur était en route / l'enlèvement était programmé].",
     "",
     "Cette annulation tardive nous laisse des frais engagés que je suis conduit à vous facturer : [MONTANT] euros hors taxes, correspondant à [DÉTAIL : mise à disposition du véhicule, kilomètres déjà parcourus, créneau réservé]. Vous trouverez la facture ci-jointe.",
     "",
     "Je reste bien sûr disponible pour reprogrammer ce transport.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  /* ───────────────── Pendant le transport et à la livraison ──────────── */

  a("client", "cli-non-livre", "Impossibilité de livrer : demande d'instructions",
    "Livraison du [DATE] non effectuée : vos instructions",
    ["Madame, Monsieur,",
     "",
     "Notre chauffeur s'est présenté le [DATE] à [HEURE] à [ADRESSE] pour la livraison de [MARCHANDISE], et n'a pas pu la remettre : [MOTIF : destinataire absent, local fermé, accès impossible, adresse erronée, refus de décharger].",
     "",
     "La marchandise est [en attente à bord / revenue à notre dépôt]. Je vous remercie de me donner vos instructions : nouvelle présentation le [DATE], livraison à une autre adresse, mise à disposition au dépôt, ou retour.",
     "",
     "Chaque jour d'immobilisation et chaque nouvelle présentation pouvant donner lieu à des frais, je vous invite à me répondre au plus vite.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  a("client", "cli-refus-dest", "Marchandise refusée par le destinataire",
    "Refus à la livraison du [DATE] : vos instructions",
    ["Madame, Monsieur,",
     "",
     "Le destinataire a refusé le [DATE] la livraison de [MARCHANDISE] à [ADRESSE], au motif de [MOTIF indiqué par le destinataire : erreur de commande, marchandise non conforme, dommage allégué, délai].",
     "",
     "Nous avons consigné ce refus. La marchandise est [à bord / au dépôt] et reste à votre disposition. Dites-moi la suite : nouvelle livraison, retour à l'expéditeur, ou mise à disposition.",
     "",
     "Les frais de retour, d'attente ou de stockage éventuels vous seront précisés selon la solution retenue.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  a("client", "cli-pod", "Envoi de la preuve de livraison",
    "Livraison du [DATE] : preuve de livraison",
    ["Madame, Monsieur,",
     "",
     "Je vous confirme la livraison de [MARCHANDISE] le [DATE] à [LIEU].",
     "",
     "Vous trouverez ci-joint la preuve de livraison : [bon de livraison / lettre de voiture] signé par le destinataire, [et la photographie datée de la marchandise remise]. Elle porte la date, l'heure et, le cas échéant, les réserves émises à la réception.",
     "",
     "Je reste à votre disposition pour toute précision.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  /* ─────────────────────── Dommages et sinistres ─────────────────────── */

  a("client", "cli-reserves-tard", "Contestation de réserves tardives",
    "Vos réserves du [DATE] : notre position",
    ["Madame, Monsieur,",
     "",
     "Vous nous avez adressé le [DATE] des réserves pour [avarie / perte partielle] sur la marchandise livrée le [DATE].",
     "",
     "La réception éteint toute action pour avarie ou perte partielle lorsque le destinataire n'a pas notifié de protestation motivée, par acte extrajudiciaire ou lettre recommandée, dans les trois jours qui suivent la réception, jours fériés non compris (article L. 133-3 du code de commerce). Vos réserves nous étant parvenues le [DATE], soit au-delà de ce délai, je suis au regret de ne pouvoir y donner suite sur ce fondement.",
     "",
     "Cela ne ferme pas le dialogue : si des éléments établissent que le dommage nous est imputable, communiquez-les-moi et je les examinerai.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  a("client", "cli-indemn", "Proposition d'indemnisation d'un dommage",
    "Dommage du [DATE] : proposition d'indemnisation",
    ["Madame, Monsieur,",
     "",
     "Après examen des réserves et des pièces relatives au dommage constaté le [DATE] sur [MARCHANDISE], je vous propose de régler ce différend à l'amiable.",
     "",
     "Sur la base de [VALEUR JUSTIFIÉE : facture, expertise], et compte tenu des limites d'indemnisation applicables à notre contrat [préciser : contrat type, convention, plafond au kilo ou au colis], je vous propose une indemnité de [MONTANT] euros, pour solde de tout compte sur ce dossier.",
     "",
     "Dites-moi si cette proposition vous convient : je vous adresserai alors le règlement et un reçu pour solde.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  a("client", "cli-refus-dom", "Refus de prise en charge d'un dommage",
    "Dommage du [DATE] : notre position",
    ["Madame, Monsieur,",
     "",
     "Vous nous imputez le dommage constaté le [DATE] sur [MARCHANDISE]. Après vérification, je ne peux pas en accepter la charge.",
     "",
     "En effet, [MOTIF ÉTABLI PAR LES PIÈCES : emballage insuffisant ou défectueux à la remise, vice propre de la marchandise, consignes de l'expéditeur, cause extérieure, absence de réserve à la réception]. Je joins [les pièces qui l'établissent].",
     "",
     "Je reste disposé à réexaminer le dossier si vous m'apportez des éléments nouveaux.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  a("client", "cli-sinistre", "Information que le sinistre est déclaré à l'assureur",
    "Dommage du [DATE] : déclaration à notre assureur",
    ["Madame, Monsieur,",
     "",
     "Je vous confirme avoir déclaré à notre assureur le sinistre relatif au dommage constaté le [DATE] sur [MARCHANDISE], sous la référence [NUMÉRO DE SINISTRE].",
     "",
     "L'assureur ou son expert pourra vous contacter. Je vous remercie de conserver la marchandise endommagée et son emballage en l'état jusqu'à l'expertise, et de tenir à disposition les pièces utiles : facture, bon de livraison, photographies, réserves.",
     "",
     "Je vous tiendrai informé de la suite donnée.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  /* ──────────────────────────── Facturation ──────────────────────────── */

  a("client", "cli-attente", "Facturation de l'attente ou de l'immobilisation",
    "Transport du [DATE] : temps d'attente",
    ["Madame, Monsieur,",
     "",
     "Lors du transport du [DATE], notre véhicule a été immobilisé [au chargement / à la livraison] à [LIEU], de [HEURE] à [HEURE], soit [DURÉE] au-delà du temps d'intervention prévu.",
     "",
     "Cette attente, qui n'est pas de notre fait, se facture selon [nos conditions / le contrat type applicable] : [MONTANT] euros hors taxes. Vous trouverez la facture ci-jointe, avec le relevé des heures.",
     "",
     "Pour l'éviter à l'avenir, je reste à votre disposition pour caler les créneaux avec le site concerné.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  a("client", "cli-annexes", "Facturation de prestations annexes",
    "Transport du [DATE] : prestations annexes",
    ["Madame, Monsieur,",
     "",
     "Le transport du [DATE] a donné lieu à des prestations qui ne figuraient pas dans le prix convenu : [DÉTAIL : hayon, manutention, prise de rendez-vous, livraison en étage, retour de supports, pesée].",
     "",
     "Je vous les facture séparément, pour [MONTANT] euros hors taxes. Le détail figure sur la facture jointe.",
     "",
     "Si ces prestations doivent se répéter, nous pouvons les intégrer au prix de base pour simplifier la facturation.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  a("client", "cli-retour", "Facturation des frais de retour ou de stockage",
    "Marchandise du [DATE] : frais de retour et de stockage",
    ["Madame, Monsieur,",
     "",
     "La marchandise livrée le [DATE] n'a pu être remise [refus du destinataire / absence / adresse erronée], et vous nous avez demandé [son retour / sa mise en attente à notre dépôt].",
     "",
     "Les frais correspondants s'élèvent à [MONTANT] euros hors taxes : [transport de retour, et stockage à compter du [DATE], à [MONTANT] euros par jour ou par palette]. La facture est jointe.",
     "",
     "La marchandise reste à votre disposition. Dites-moi la suite que vous souhaitez lui donner.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  a("client", "cli-gazole", "Répercussion de la hausse du gazole",
    "Révision du prix : variation du gazole",
    ["Madame, Monsieur,",
     "",
     "Nos prix tiennent compte du coût du gazole, qui a évolué depuis la date de notre contrat.",
     "",
     "Lorsque le contrat de transport mentionne les charges de gazole retenues pour le prix, ce prix est révisé de plein droit pour couvrir la variation du coût du gazole entre la date du contrat et la réalisation du transport, et la facture fait apparaître ces charges (article L. 3222-1 du code des transports).",
     "",
     "En application de cette règle, la part gazole de vos prochaines factures sera ajustée selon [l'indice retenu au contrat / l'indice CNR gazole] : de [TAUX ou MONTANT] à [TAUX ou MONTANT]. Le détail apparaîtra sur chaque facture.",
     "",
     "Je me tiens à votre disposition pour vous présenter le calcul.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  /* ───────────────────── Paiement et sécurité ────────────────────────── */

  a("client", "cli-paiement", "Confirmation de réception d'un paiement",
    "Votre règlement : bien reçu",
    ["Madame, Monsieur,",
     "",
     "Je vous confirme la bonne réception de votre règlement de [MONTANT] euros, reçu le [DATE], en paiement de [la facture n° [NUMÉRO] / les factures n° [NUMÉROS]].",
     "",
     "Votre compte est à jour [ou : il reste dû [MONTANT] euros au titre de [FACTURE]]. Je vous remercie de votre règlement.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  a("client", "cli-suspension", "Suspension des prestations pour impayé",
    "Suspension de nos prestations",
    ["Madame, Monsieur,",
     "",
     "Malgré mes relances, votre compte présente un impayé de [MONTANT] euros, au titre de [FACTURES et DATES].",
     "",
     "Je suis contraint de suspendre nos prestations à compter du [DATE], jusqu'au règlement de cet arriéré. Les commandes déjà confirmées [seront traitées / sont également suspendues : préciser].",
     "",
     "Dès réception de votre paiement, ou d'un échéancier que nous aurons convenu, je reprends le service sans délai. Appelez-moi, une difficulté se règle mieux en parlant.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

  a("client", "cli-rib", "Confirmation d'un changement de nos coordonnées bancaires",
    "Important : nos nouvelles coordonnées bancaires",
    ["Madame, Monsieur,",
     "",
     "Nos coordonnées bancaires changent. À compter du [DATE], vos règlements sont à adresser sur le compte suivant : [IBAN], [BIC], au nom de SARL TEC.",
     "",
     "Par prudence contre les fraudes, ce changement vous est confirmé par ce courrier signé, et il figurera sur nos prochaines factures. Avant tout virement sur de nouvelles coordonnées, quelles qu'elles soient, appelez-nous au [NUMÉRO] pour les vérifier : nous ne vous demanderons jamais un virement en urgence vers un compte inconnu par un simple e-mail.",
     "",
     "Je vous remercie de mettre à jour nos coordonnées dans vos systèmes de paiement.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées."]);

})(typeof window !== "undefined" ? window : this);
