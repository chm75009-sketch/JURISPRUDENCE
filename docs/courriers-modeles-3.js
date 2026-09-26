/* LES COURRIERS DU TRANSPORT ROUTIER DE MARCHANDISES.

   POURQUOI CE FICHIER EXISTE

   L'audit du 26 septembre 2026 a relevé qu'aucun modèle ne servait le métier
   du client : ni la protestation après une avarie, ni l'action directe en
   paiement contre l'expéditeur ou le destinataire, ni la mise en demeure
   avant rétention, ni le courrier au service qui tient le registre des
   transporteurs. Ce sont pourtant les quatre lettres qu'un transporteur écrit
   dans l'année.

   CE QUI A CHANGÉ DEPUIS courriers-modeles.js

   Ce fichier-là porte, en tête, que « le relais Légifrance de l'application
   ne sert que le code du travail ». Ce n'est plus exact, et la correction est
   datée : le 26 septembre 2026, interrogé avec le NOM du code, le relais a
   servi le code de commerce, le code des transports, le code de la route et
   le code civil, chaque article rendu avec son identifiant de version et le
   nom du code en retour. Les articles cités ici ont donc été lus à la source
   ce jour-là, deux lectures concordantes chacun :

     L. 133-1  LEGIARTI000006220288  code de commerce : le voiturier est
               garant de la perte, hors force majeure, et des avaries autres
               que celles qui viennent du vice propre de la chose ou de la
               force majeure ; toute clause contraire est nulle ;
     L. 133-3  LEGIARTI000021486442  code de commerce : la réception éteint
               toute action pour avarie ou perte partielle si, dans les trois
               jours non compris les jours fériés qui suivent celui de la
               réception, le destinataire n'a pas notifié sa protestation
               motivée par acte extrajudiciaire ou par lettre recommandée ;
     L. 133-6  LEGIARTI000017853204  code de commerce : les actions pour
               avaries, pertes ou retards se prescrivent par un an ;
     L. 132-8  LEGIARTI000006220236  code de commerce : la lettre de voiture
               forme un contrat entre l'expéditeur, le voiturier et le
               destinataire ; le voiturier a une action directe en paiement
               contre l'expéditeur et le destinataire, garants du prix du
               transport, et toute clause contraire est réputée non écrite ;
     L. 132-2  LEGIARTI000006220212  code de commerce : le privilège du
               commissionnaire sur la valeur des marchandises ;
     R. 3211-9  LEGIARTI000033449967  code des transports : l'inscription au
               registre électronique national des entreprises de transport par
               route, par le préfet de la région du siège ;
     R. 3211-12 LEGIARTI000046177442  code des transports : les licences et
               leurs copies certifiées conformes numérotées, dont le nombre
               correspond à celui des véhicules ;
     R. 3211-43 LEGIARTI000033450051  code des transports : le gestionnaire de
               transport, qui dirige effectivement et en permanence l'activité.

   CE QUI RESTE ENTRE CROCHETS

   Le droit de rétention du voiturier n'est fondé sur aucun des articles
   ci-dessus : L. 132-2 donne un privilège au commissionnaire, non au
   voiturier, et le contrat type applicable n'est pas lu par l'application. La
   lettre de mise en demeure le dit en toutes lettres plutôt que d'annoncer un
   droit qu'elle ne peut pas fonder.                                        */

(function (window) {
  "use strict";
  var CM = window.CourriersModeles;
  if (!CM) return;
  var a = CM.ajouter;

  /* La famille s'ajoute à celles du premier fichier. */
  if (CM.FAMILLES && !CM.FAMILLES.some(function (f) { return f.cle === "transport"; })) {
    CM.FAMILLES.push({ cle: "transport", nom: "Transport",
      sous: "Avaries, paiement du prix, registre des transporteurs" });
  }

  /* ══════════════════════════════════════════════════════════════════════
     AVARIE, PERTE, RETARD
     ══════════════════════════════════════════════════════════════════════ */

  a("transport", "tr-protestation", "Protestation motivée après une avarie ou une perte partielle",
    "Protestation motivée, lettre de voiture n° [NUMÉRO] du [DATE]",
    ["Lettre recommandée avec accusé de réception",
     "",
     "Madame, Monsieur,",
     "",
     "Nous avons réceptionné le [DATE DE RÉCEPTION] l'envoi transporté sous la lettre de voiture n° [NUMÉRO] du [DATE], portant sur [NATURE ET NOMBRE DE COLIS, POIDS].",
     "",
     "À la réception, les dommages suivants ont été constatés : [DÉCRIRE PRÉCISÉMENT : colis enfoncés, palette éventrée, emballage percé, nombre de colis manquants, température relevée]. Des réserves ont été portées sur le récépissé de livraison le jour même, dans les termes suivants : [REPRENDRE LES RÉSERVES ÉCRITES].",
     "",
     "Par la présente, nous vous notifions notre protestation motivée. Elle vous est adressée dans les trois jours, non compris les jours fériés, qui suivent celui de la réception, conformément à l'article L. 133-3 du code de commerce.",
     "",
     "Le voiturier est garant de la perte des objets transportés, hors les cas de force majeure, et des avaries autres que celles qui proviennent du vice propre de la chose ou de la force majeure (article L. 133-1 du code de commerce).",
     "",
     "Nous évaluons provisoirement le préjudice à [MONTANT] euros, sous réserve de [EXPERTISE, FACTURE DE REMPLACEMENT, DÉVALORISATION]. Les pièces suivantes sont jointes : [LETTRE DE VOITURE, RÉCÉPISSÉ AVEC RÉSERVES, PHOTOGRAPHIES DATÉES, FACTURE DE LA MARCHANDISE].",
     "",
     "Nous vous demandons de nous faire connaître sous [NOMBRE] jours la suite que vous entendez donner à cette réclamation et, le cas échéant, la déclaration de sinistre auprès de votre assureur.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."],
    "Le délai de trois jours de l'article L. 133-3 se compte à partir du lendemain de la réception, jours fériés non compris, et la protestation se fait par acte extrajudiciaire ou par lettre recommandée : le courriel ne suffit pas. Une demande d'expertise formée dans le même délai vaut protestation. Passé ce délai, la réception éteint l'action pour avarie ou perte partielle. Les actions pour avaries, pertes ou retards se prescrivent par un an (L. 133-6).");

  a("transport", "tr-reserves", "Confirmation des réserves portées à la livraison",
    "Réserves du [DATE] : confirmation, lettre de voiture n° [NUMÉRO]",
    ["Lettre recommandée avec accusé de réception",
     "",
     "Madame, Monsieur,",
     "",
     "Lors de la livraison du [DATE], effectuée sous la lettre de voiture n° [NUMÉRO], notre conducteur a porté sur le récépissé les réserves suivantes : [REPRENDRE MOT POUR MOT LES RÉSERVES ÉCRITES].",
     "",
     "Nous vous les confirmons par la présente, et vous précisons ce qui a été constaté : [CIRCONSTANCES, HEURE, LIEU, PERSONNE PRÉSENTE].",
     "",
     "Les photographies prises sur place, datées, sont jointes au présent courrier.",
     "",
     "Nous restons à votre disposition pour toute vérification contradictoire.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."],
    "Des réserves imprécises, du type « sous réserve de déballage », ne valent pas : elles doivent décrire ce qui a été vu. La confirmation écrite dans les trois jours de l'article L. 133-3 est ce qui les rend opposables.");

  /* ══════════════════════════════════════════════════════════════════════
     LE PRIX DU TRANSPORT
     ══════════════════════════════════════════════════════════════════════ */

  a("transport", "tr-action-directe", "Action directe en paiement contre l'expéditeur ou le destinataire",
    "Transport du [DATE], lettre de voiture n° [NUMÉRO] : demande de paiement",
    ["Lettre recommandée avec accusé de réception",
     "",
     "Madame, Monsieur,",
     "",
     "Nous avons exécuté, le [DATE], le transport de [NATURE DE LA MARCHANDISE] de [LIEU DE CHARGEMENT] à [LIEU DE LIVRAISON], sous la lettre de voiture n° [NUMÉRO], à la demande de [DONNEUR D'ORDRE].",
     "",
     "Le prix de ce transport, [MONTANT] euros, facturé le [DATE] sous le numéro [NUMÉRO DE FACTURE], n'a pas été réglé à ce jour malgré nos relances des [DATES].",
     "",
     "La lettre de voiture forme un contrat entre l'expéditeur, le voiturier et le destinataire. Le voiturier a une action directe en paiement de ses prestations à l'encontre de l'expéditeur et du destinataire, lesquels sont garants du paiement du prix du transport ; toute clause contraire est réputée non écrite (article L. 132-8 du code de commerce).",
     "",
     "En votre qualité de [EXPÉDITEUR / DESTINATAIRE] de cet envoi, vous êtes garant de ce paiement. Nous vous demandons en conséquence de nous régler la somme de [MONTANT] euros dans un délai de [NOMBRE] jours à compter de la réception de la présente.",
     "",
     "Copie de la lettre de voiture, du récépissé de livraison et de la facture est jointe.",
     "",
     "À défaut de règlement dans ce délai, nous saisirons la juridiction compétente sans nouvel avis.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."],
    "L'action directe de L. 132-8 suppose que le transport ait bien été exécuté et que la lettre de voiture le prouve : joignez-la, avec le récépissé signé. Elle se dirige contre l'expéditeur ou le destinataire, qui ne sont pas votre donneur d'ordre : dites clairement à quel titre vous écrivez. Les actions nées du contrat de transport se prescrivent par un an (L. 133-6).");

  a("transport", "tr-retention", "Mise en demeure avant rétention de la marchandise",
    "Marchandise du [DATE] : mise en demeure avant rétention",
    ["Lettre recommandée avec accusé de réception, doublée d'un envoi par voie électronique",
     "",
     "Madame, Monsieur,",
     "",
     "Nous détenons, depuis le [DATE], la marchandise suivante : [NATURE, NOMBRE DE COLIS, POIDS], prise en charge sous la lettre de voiture n° [NUMÉRO].",
     "",
     "Les sommes suivantes nous restent dues à ce jour : [DÉTAIL DES FACTURES, NUMÉROS, DATES, MONTANTS], soit un total de [MONTANT] euros.",
     "",
     "Nous vous mettons en demeure de régler cette somme dans un délai de [NOMBRE] jours à compter de la réception de la présente.",
     "",
     "À défaut, nous examinerons les suites à donner, y compris le maintien de la marchandise en notre possession et la saisine de la juridiction compétente.",
     "",
     "Nous vous précisons que la marchandise est entreposée à [LIEU], dans les conditions suivantes : [CONDITIONS DE CONSERVATION], et que les frais de garde courent à compter du [DATE], à [MONTANT] euros par [JOUR / SEMAINE].",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."],
    "Attention, et la lettre est écrite pour cela : retenir une marchandise n'est pas un droit qui va de soi. L'article L. 132-2 du code de commerce donne un privilège au commissionnaire de transport, non au voiturier. Le droit de rétention du transporteur, quand il existe, se fonde sur le contrat type applicable à l'opération, que l'application n'a pas lu, et il est apprécié strictement par les tribunaux. Vérifiez votre contrat type et faites-vous conseiller avant de retenir quoi que ce soit : une rétention injustifiée se paie cher. Cette lettre est une mise en demeure de payer, elle n'exerce aucune rétention.");

  /* ══════════════════════════════════════════════════════════════════════
     LE REGISTRE DES TRANSPORTEURS
     ══════════════════════════════════════════════════════════════════════ */

  a("transport", "tr-dreal", "Courrier au service qui tient le registre des transporteurs",
    "Entreprise [DÉNOMINATION], n° d'inscription [NUMÉRO] : [OBJET]",
    ["Madame, Monsieur,",
     "",
     "Notre entreprise est inscrite au registre électronique national des entreprises de transport par route sous le numéro [NUMÉRO D'INSCRIPTION].",
     "",
     "Nous vous informons de la modification suivante, et vous demandons de la porter au registre : [CHOISIR ET COMPLÉTER : changement d'adresse du siège ; ouverture ou fermeture d'un établissement secondaire ; changement de gestionnaire de transport ; augmentation ou diminution du parc ; changement de la forme juridique ou de la dénomination].",
     "",
     "Elle prend effet le [DATE].",
     "",
     "[SI CHANGEMENT DE GESTIONNAIRE DE TRANSPORT] La personne physique qui dirige effectivement et en permanence nos activités de transport est, à compter de cette date, [NOM ET PRÉNOM], titulaire de l'attestation de capacité professionnelle n° [NUMÉRO], et liée à l'entreprise en qualité de [EMPLOYÉ / DIRECTEUR / DIRIGEANT / ASSOCIÉ / HABILITÉE PAR CONTRAT]. Les pièces justificatives sont jointes.",
     "",
     "[SI VARIATION DU PARC] Notre parc compte désormais [NOMBRE] véhicules à moteur, dont [NOMBRE] de plus de 3,5 tonnes. Nous sollicitons en conséquence la délivrance de [NOMBRE] copie(s) certifiée(s) conforme(s) supplémentaire(s) de notre licence, ou vous restituons [NOMBRE] copie(s) devenue(s) sans objet.",
     "",
     "Les pièces suivantes sont jointes : [LISTE DES PIÈCES].",
     "",
     "Nous restons à votre disposition pour tout élément complémentaire.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."],
    "Les entreprises ayant leur siège en France sont inscrites au registre par le préfet de la région du siège (R. 3211-9 du code des transports). L'inscription donne lieu à la licence, accompagnée de copies certifiées conformes numérotées dont le nombre correspond à celui des véhicules (R. 3211-12) : toute variation du parc se signale. Le gestionnaire de transport est la personne physique qui dirige effectivement et en permanence l'activité (R. 3211-43) ; son changement se déclare. Adressez le courrier au service de l'État chargé des transports de votre région, dont les coordonnées figurent sur votre licence.");

  a("transport", "tr-copie-perdue", "Déclaration de perte ou de vol d'une copie conforme de licence",
    "Copie conforme n° [NUMÉRO] : déclaration de perte ou de vol",
    ["Madame, Monsieur,",
     "",
     "Notre entreprise, inscrite au registre électronique national des entreprises de transport par route sous le numéro [NUMÉRO D'INSCRIPTION], vous déclare la perte ou le vol de la copie certifiée conforme n° [NUMÉRO] de sa licence, affectée au véhicule immatriculé [IMMATRICULATION].",
     "",
     "Les circonstances sont les suivantes : [DATE, LIEU, CIRCONSTANCES]. [SI VOL] Le dépôt de plainte a été effectué le [DATE] auprès de [SERVICE], sous le numéro [NUMÉRO], dont copie est jointe.",
     "",
     "Nous vous demandons la délivrance d'une copie de remplacement.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."],
    "La copie certifiée conforme accompagne le véhicule : sans elle, le transport se fait sans titre à bord. L'original de la licence, lui, reste dans l'établissement (R. 3211-12 du code des transports).");

})(window);
