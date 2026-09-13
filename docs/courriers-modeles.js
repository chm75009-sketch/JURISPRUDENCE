/* LES COURRIERS ET LES E-MAILS DE L'ENTREPRISE.

   POURQUOI CE FICHIER EXISTE

   Demande du 13 septembre 2026 : « un générateur d'e-mail ou de courrier type
   ou personnalisé : client, fournisseur, fisc, salarié, assurance ». Le reste
   de l'application produit les pièces que la loi impose ; celles-ci sont
   d'une autre nature. Ce sont les lettres de tous les jours, celles qu'un
   dirigeant écrit mal ou n'écrit pas parce qu'il n'a pas le temps : la
   relance d'un impayé, la contestation d'une facture, la demande de délai au
   service des impôts, la déclaration d'un sinistre.

   DEUX RÈGLES TENUES PARTOUT DANS CE FICHIER

   1. AUCUNE AFFIRMATION DE DROIT QUI N'AIT ÉTÉ LUE À LA SOURCE. Le relais
      Légifrance de l'application ne sert que le code du travail : on ne cite
      donc ici ni le code de commerce, ni le livre des procédures fiscales, ni
      le code des assurances. Les lettres disent ce qu'elles demandent, elles
      n'invoquent pas d'article que le dépôt n'aurait pas vérifié. Là où un
      fondement compte, il est laissé entre crochets, à vérifier avant envoi.

   2. CE QUE L'APPLICATION NE PEUT PAS SAVOIR RESTE ENTRE CROCHETS. Un numéro
      de facture, un montant, une date d'échéance : la lettre les porte en
      clair, visibles, jamais devinés. Ce qui vient de la fiche d'entreprise,
      en revanche, est écrit tout seul et suit chaque changement de la fiche.

   Les lettres disciplinaires ne sont pas ici : elles ont leur module, qui les
   fonde article par article. Ce fichier s'arrête à la gestion courante.  */

(function (window) {
  "use strict";

  /* Les familles, dans l'ordre où elles s'affichent. */
  var FAMILLES = [
    { cle: "client", nom: "Client", sous: "Devis, relances, litiges, tarifs" },
    { cle: "fournisseur", nom: "Fournisseur", sous: "Commandes, factures, retards, résiliation" },
    { cle: "salarie", nom: "Salarié", sous: "Gestion courante, congés, attestations" },
    { cle: "fisc", nom: "Impôts", sous: "Délais, réclamations, contrôle" },
    { cle: "urssaf", nom: "URSSAF", sous: "Délais, majorations, contestation" },
    { cle: "assurance", nom: "Assurance", sous: "Sinistres, garanties, résiliation" },
    { cle: "banque", nom: "Banque", sous: "Financement, frais, incidents" },
  ];

  var M = [];
  function ajouter(famille, id, nom, objet, corps, note) {
    M.push({ famille: famille, id: id, nom: nom, objet: objet, corps: corps, note: note || "" });
  }

  /* ══════════════════════════════════════════════════════════════════════
     CLIENT
     ══════════════════════════════════════════════════════════════════════ */

  ajouter("client", "cli-devis", "Envoi d'un devis",
    "Votre demande du [DATE] : notre proposition",
    ["Madame, Monsieur,",
     "",
     "Vous nous avez consultés le [DATE] pour [OBJET DE LA DEMANDE]. Vous trouverez notre proposition ci-jointe.",
     "",
     "Elle porte sur [PRESTATION], pour un montant de [MONTANT] euros hors taxes. Le prix tient compte de [CE QUI LE COMMANDE : volume, distance, fréquence, délai]. Il est valable jusqu'au [DATE], au-delà de laquelle il sera à revoir.",
     "",
     "Je reste à votre disposition pour en parler et l'ajuster si votre besoin a bougé depuis notre échange.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."]);

  ajouter("client", "cli-relance1", "Relance d'un impayé (première relance)",
    "Facture n° [NUMÉRO] du [DATE] : relance",
    ["Madame, Monsieur,",
     "",
     "Sauf erreur de notre part, notre facture n° [NUMÉRO] du [DATE], d'un montant de [MONTANT] euros, échue le [DATE D'ÉCHÉANCE], n'a pas été réglée à ce jour.",
     "",
     "Il s'agit probablement d'un simple oubli. Je vous remercie de procéder au règlement, ou de me dire si une pièce vous manque pour le faire.",
     "",
     "Si le paiement a été émis entre-temps, considérez ce message comme sans objet et acceptez mes excuses.",
     "",
     "Bien cordialement,"]);

  ajouter("client", "cli-relance2", "Relance d'un impayé (deuxième relance)",
    "Facture n° [NUMÉRO] du [DATE] : deuxième relance",
    ["Madame, Monsieur,",
     "",
     "Ma relance du [DATE] est restée sans réponse. La facture n° [NUMÉRO] du [DATE], d'un montant de [MONTANT] euros, échue le [DATE D'ÉCHÉANCE], demeure impayée.",
     "",
     "Je vous demande de la régler avant le [DATE], ou de m'appeler pour convenir d'un échéancier si votre trésorerie l'impose : une difficulté dite se règle, une difficulté tue s'aggrave.",
     "",
     "À défaut de réponse de votre part sous [NOMBRE] jours, je serai contraint de poursuivre le recouvrement.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."],
    "Les pénalités de retard et l'indemnité forfaitaire de recouvrement sont dues de plein droit entre professionnels ; leur montant et leur base figurent dans vos conditions générales de vente. Vérifiez-les avant de les chiffrer dans la lettre.");

  ajouter("client", "cli-md", "Mise en demeure de payer",
    "Mise en demeure de payer, facture n° [NUMÉRO]",
    ["Lettre recommandée avec accusé de réception",
     "",
     "Madame, Monsieur,",
     "",
     "Malgré mes relances des [DATES], la facture n° [NUMÉRO] du [DATE], d'un montant de [MONTANT] euros, reste impayée.",
     "",
     "Par la présente, je vous mets en demeure de me régler cette somme dans un délai de [NOMBRE] jours à compter de la réception de ce courrier.",
     "",
     "Passé ce délai, et sans règlement de votre part, je confierai ce dossier à [AVOCAT, HUISSIER DE JUSTICE, SOCIÉTÉ DE RECOUVREMENT] et saisirai la juridiction compétente, sans nouvel avis.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."],
    "Envoyez-la en recommandé avec accusé de réception : c'est la date de réception qui fait courir le délai et qui se prouve.");

  ajouter("client", "cli-echeancier", "Proposition d'échéancier",
    "Facture n° [NUMÉRO] : proposition d'échelonnement",
    ["Madame, Monsieur,",
     "",
     "Vous m'avez fait part de vos difficultés de trésorerie au sujet de la facture n° [NUMÉRO], d'un montant de [MONTANT] euros.",
     "",
     "Je vous propose de l'échelonner ainsi : [NOMBRE] versements de [MONTANT] euros, le [JOUR] de chaque mois, à compter du [DATE].",
     "",
     "Cet échelonnement vaut pour autant que chaque échéance soit honorée à sa date. Le premier incident le rendrait caduc et rendrait immédiatement exigible le solde restant dû.",
     "",
     "Si cet aménagement vous convient, retournez-moi ce courrier signé, ou confirmez-le par retour de message.",
     "",
     "Bien cordialement,"]);

  ajouter("client", "cli-hausse", "Revalorisation des tarifs",
    "Évolution de nos tarifs au [DATE]",
    ["Madame, Monsieur,",
     "",
     "Nous travaillons ensemble depuis [DURÉE], et je tiens à vous informer à l'avance d'une évolution de nos prix.",
     "",
     "À compter du [DATE], nos tarifs seront revalorisés de [POURCENTAGE] %. Cette hausse tient à [MOTIF : coût du carburant, revalorisation des salaires de la convention collective, prix des pièces et de l'entretien, assurances].",
     "",
     "Le détail poste par poste figure en pièce jointe. Les prestations commandées avant le [DATE] restent facturées aux conditions actuelles.",
     "",
     "Je suis à votre disposition pour en discuter et regarder ensemble ce qui peut être optimisé de votre côté comme du nôtre.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."],
    "Dans le transport routier de marchandises, la répercussion des variations du prix du gazole obéit à un mécanisme particulier. Vérifiez la clause de votre contrat avant d'envoyer.");

  ajouter("client", "cli-retard", "Explication d'un retard de livraison",
    "Votre commande n° [NUMÉRO] : point sur le délai",
    ["Madame, Monsieur,",
     "",
     "Je reviens vers vous au sujet de votre commande n° [NUMÉRO], prévue le [DATE].",
     "",
     "Elle sera livrée avec un retard de [DURÉE], pour la raison suivante : [MOTIF PRÉCIS]. Je préfère vous le dire maintenant plutôt que de vous laisser l'attendre.",
     "",
     "La nouvelle date est fixée au [DATE], et [NOM] suit ce dossier personnellement. Nous avons pris les dispositions suivantes pour que cela ne se reproduise pas : [MESURES].",
     "",
     "Je vous prie de m'excuser pour cette gêne.",
     "",
     "Bien cordialement,"]);

  ajouter("client", "cli-litige", "Réponse à une réclamation",
    "Votre réclamation du [DATE]",
    ["Madame, Monsieur,",
     "",
     "J'ai bien reçu votre réclamation du [DATE] relative à [OBJET].",
     "",
     "J'ai fait vérifier ce qui s'est passé : [CE QUE LA VÉRIFICATION A ÉTABLI]. [Votre réclamation est fondée sur ce point / Les éléments dont je dispose ne permettent pas de retenir ce grief, pour la raison suivante : [MOTIF]].",
     "",
     "Je vous propose donc : [GESTE, AVOIR, REPRISE DE LA PRESTATION, RIEN ET POURQUOI].",
     "",
     "Je reste à votre disposition pour en parler de vive voix, ce qui est souvent plus simple qu'un échange de courriers.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."]);

  ajouter("client", "cli-avoir", "Envoi d'un avoir",
    "Avoir n° [NUMÉRO] sur la facture n° [NUMÉRO]",
    ["Madame, Monsieur,",
     "",
     "Comme convenu lors de notre échange du [DATE], vous trouverez ci-joint l'avoir n° [NUMÉRO], d'un montant de [MONTANT] euros, établi sur la facture n° [NUMÉRO] du [DATE].",
     "",
     "Il correspond à [MOTIF : prestation non exécutée, geste commercial, erreur de facturation].",
     "",
     "Il sera [déduit de votre prochaine facture / remboursé par virement le [DATE]].",
     "",
     "Bien cordialement,"]);

  ajouter("client", "cli-resiliation", "Fin d'une relation commerciale",
    "Notre contrat du [DATE] : fin de la relation",
    ["Lettre recommandée avec accusé de réception",
     "",
     "Madame, Monsieur,",
     "",
     "Je vous informe que nous mettrons fin, au [DATE], à la relation commerciale qui nous lie depuis [DURÉE], au titre du contrat du [DATE].",
     "",
     "Le préavis que je vous donne est de [DURÉE]. Il tient compte de l'ancienneté de nos relations et du temps qu'il vous faut pour vous organiser autrement.",
     "",
     "D'ici là, les prestations en cours seront exécutées normalement et dans les mêmes conditions. [NOM] reste votre interlocuteur pour la transition.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."],
    "La rupture d'une relation commerciale établie suppose un préavis écrit tenant compte de sa durée. Un préavis trop court engage la responsabilité de son auteur : faites vérifier la durée retenue.");

  ajouter("client", "cli-remerciement", "Remerciement après une commande",
    "Merci pour votre confiance",
    ["Madame, Monsieur,",
     "",
     "Votre commande du [DATE] a bien été exécutée le [DATE]. Je tenais à vous remercier de votre confiance.",
     "",
     "Si quelque chose n'a pas été à la hauteur, dites-le-moi directement : c'est ainsi que nous progressons. Si tout s'est bien passé, un mot de votre part nous est également utile.",
     "",
     "Nous restons à votre disposition pour vos prochains besoins, notamment [PRESTATION QUE VOUS SOUHAITEZ METTRE EN AVANT].",
     "",
     "Bien cordialement,"]);

  /* ══════════════════════════════════════════════════════════════════════
     FOURNISSEUR
     ══════════════════════════════════════════════════════════════════════ */

  ajouter("fournisseur", "fou-commande", "Passation d'une commande",
    "Commande n° [NUMÉRO] du [DATE]",
    ["Madame, Monsieur,",
     "",
     "Faisant suite à votre proposition du [DATE], je vous passe commande de [DÉSIGNATION], pour un montant de [MONTANT] euros hors taxes.",
     "",
     "Livraison attendue le [DATE] à l'adresse suivante : [ADRESSE DE LIVRAISON]. Le règlement interviendra [CONDITIONS DE RÈGLEMENT].",
     "",
     "Merci de m'accuser réception de cette commande et de me confirmer la date de livraison.",
     "",
     "Bien cordialement,"]);

  ajouter("fournisseur", "fou-conteste", "Contestation d'une facture",
    "Facture n° [NUMÉRO] du [DATE] : contestation",
    ["Madame, Monsieur,",
     "",
     "J'ai reçu votre facture n° [NUMÉRO] du [DATE], d'un montant de [MONTANT] euros. Elle appelle une observation.",
     "",
     "[CE QUI EST CONTESTÉ : quantité facturée supérieure à la quantité livrée, prix différent du devis accepté, prestation non exécutée, doublon avec la facture n° X].",
     "",
     "Selon [NOTRE COMMANDE DU DATE / VOTRE DEVIS DU DATE / LE BON DE LIVRAISON N° X], le montant dû est de [MONTANT] euros.",
     "",
     "Je vous remercie de m'adresser une facture rectificative ou un avoir. Le règlement interviendra à réception de la facture corrigée.",
     "",
     "Bien cordialement,"]);

  ajouter("fournisseur", "fou-retard", "Retard de livraison",
    "Commande n° [NUMÉRO] : retard de livraison",
    ["Madame, Monsieur,",
     "",
     "Ma commande n° [NUMÉRO] du [DATE] devait être livrée le [DATE]. Elle ne l'est toujours pas.",
     "",
     "Ce retard a les conséquences suivantes sur notre activité : [CONSÉQUENCES CONCRÈTES].",
     "",
     "Je vous demande de me confirmer aujourd'hui une date ferme de livraison. À défaut de livraison avant le [DATE], je me réserve la possibilité d'annuler la commande et de me fournir ailleurs.",
     "",
     "Bien cordialement,"]);

  ajouter("fournisseur", "fou-qualite", "Réclamation sur la qualité",
    "Commande n° [NUMÉRO] : non-conformité",
    ["Madame, Monsieur,",
     "",
     "La livraison du [DATE], au titre de la commande n° [NUMÉRO], n'est pas conforme.",
     "",
     "Constaté à la réception : [DESCRIPTION PRÉCISE : références manquantes, articles endommagés, produit différent de celui commandé, quantités]. Des photographies sont jointes.",
     "",
     "Je vous demande [LE REMPLACEMENT / LA REPRISE ET L'AVOIR CORRESPONDANT] avant le [DATE]. Les marchandises restent à votre disposition dans nos locaux, sans que leur conservation vaille acceptation.",
     "",
     "Bien cordialement,"]);

  ajouter("fournisseur", "fou-md", "Mise en demeure de livrer ou d'exécuter",
    "Mise en demeure, commande n° [NUMÉRO]",
    ["Lettre recommandée avec accusé de réception",
     "",
     "Madame, Monsieur,",
     "",
     "Malgré mes demandes des [DATES], la commande n° [NUMÉRO] du [DATE] n'a pas été [LIVRÉE / EXÉCUTÉE].",
     "",
     "Je vous mets en demeure d'y procéder dans un délai de [NOMBRE] jours à compter de la réception de la présente.",
     "",
     "À défaut, je considérerai le contrat comme résolu à vos torts et solliciterai le remboursement des sommes versées, soit [MONTANT] euros, ainsi que la réparation du préjudice subi.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."]);

  ajouter("fournisseur", "fou-geste", "Demande de geste commercial",
    "Notre contrat du [DATE] : demande de révision",
    ["Madame, Monsieur,",
     "",
     "Nous travaillons ensemble depuis [DURÉE], pour un volume annuel de l'ordre de [MONTANT] euros.",
     "",
     "[CIRCONSTANCE : hausse de vos tarifs, difficultés rencontrées sur les dernières livraisons, évolution de nos volumes]. Je souhaite que nous en parlions.",
     "",
     "Je vous demande [CE QUE VOUS DEMANDEZ : remise de X %, gel des tarifs jusqu'au DATE, geste sur la commande n° X, allongement du délai de règlement].",
     "",
     "Je reste attaché à notre relation et je préfère la renégocier que la remettre en cause. Pouvons-nous en parler avant le [DATE] ?",
     "",
     "Bien cordialement,"]);

  ajouter("fournisseur", "fou-resil", "Résiliation d'un contrat à échéance",
    "Résiliation du contrat n° [NUMÉRO] à son échéance",
    ["Lettre recommandée avec accusé de réception",
     "",
     "Madame, Monsieur,",
     "",
     "Je vous informe que je ne renouvellerai pas le contrat n° [NUMÉRO], conclu le [DATE], qui vient à échéance le [DATE].",
     "",
     "Cette lettre vaut dénonciation dans le respect du préavis de [DURÉE] prévu à l'article [NUMÉRO] du contrat.",
     "",
     "Je vous remercie de me confirmer la date de fin des prestations et de m'indiquer les modalités de restitution [DU MATÉRIEL / DES DONNÉES / DES DOCUMENTS] en votre possession.",
     "",
     "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."],
    "Vérifiez dans le contrat la durée du préavis et la forme exigée pour la dénonciation avant d'envoyer : un préavis manqué reconduit le contrat pour une période entière.");

  ajouter("fournisseur", "fou-delai", "Demande de délai de paiement",
    "Facture n° [NUMÉRO] : demande de délai",
    ["Madame, Monsieur,",
     "",
     "Votre facture n° [NUMÉRO] du [DATE], d'un montant de [MONTANT] euros, vient à échéance le [DATE].",
     "",
     "Notre trésorerie connaît une tension passagère, liée à [MOTIF]. Je préfère vous en informer avant l'échéance plutôt que de vous laisser constater un impayé.",
     "",
     "Je vous propose de régler cette facture en [NOMBRE] fois : [ÉCHÉANCIER]. Les commandes en cours continueront d'être réglées dans les conditions habituelles.",
     "",
     "Merci de me dire si cette proposition vous convient.",
     "",
     "Bien cordialement,"]);

  ajouter("fournisseur", "fou-rib", "Vigilance sur un changement de coordonnées bancaires",
    "Votre demande de changement de coordonnées bancaires",
    ["Madame, Monsieur,",
     "",
     "Nous avons reçu, le [DATE], une demande de modification de vos coordonnées bancaires.",
     "",
     "Conformément à nos règles internes, aucun changement n'est pris en compte sans vérification. Je vous remercie de me confirmer cette demande par téléphone, au numéro que nous avons au contrat, et de m'adresser [UN RIB SUR PAPIER À VOTRE EN-TÊTE / LA CONFIRMATION SIGNÉE DU DIRIGEANT].",
     "",
     "Tant que cette vérification n'est pas faite, les règlements continueront d'être effectués sur le compte habituel.",
     "",
     "Bien cordialement,"],
    "La fraude au changement de RIB est fréquente et coûte cher. Ne jamais valider sur la seule foi d'un courriel, même parfaitement imité : rappeler le fournisseur au numéro connu, jamais à celui indiqué dans le message.");

  ajouter("fournisseur", "fou-attestation", "Demande d'attestation de vigilance",
    "Demande d'attestation de vigilance",
    ["Madame, Monsieur,",
     "",
     "Dans le cadre de nos relations contractuelles, je vous remercie de m'adresser votre attestation de vigilance en cours de validité, ainsi que [LES AUTRES PIÈCES DEMANDÉES : extrait d'immatriculation, liste des salariés étrangers soumis à autorisation de travail, attestation d'assurance].",
     "",
     "Ces pièces sont à renouveler tous les six mois pendant toute la durée du contrat.",
     "",
     "Merci de me les faire parvenir avant le [DATE].",
     "",
     "Bien cordialement,"],
    "L'obligation de vigilance du donneur d'ordre relève du code du travail (travail dissimulé) : le module social de l'application la traite avec ses articles.");

  window.CourriersModeles = { FAMILLES: FAMILLES, MODELES: M, ajouter: ajouter };
})(window);
