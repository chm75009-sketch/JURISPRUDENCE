/* L'ASSISTANT DE L'ACCUEIL : une barre, deux onglets.

   Deux usages nettement séparés, choisis par deux onglets en haut de la barre.

   - « Faire une action » : le dirigeant dit ou écrit ce qu'il veut faire
     (« rédiger un contrat », « contester une contravention », « abandon de
     poste »). On lui répond « J'ai compris : tel écran » et un grand bouton
     l'ouvre, exactement comme le bouton de l'écran lui-meme. En dessous,
     « Pas ça ? » et les autres pistes. Si rien n'est compris, les écrans les
     plus utilisés.

   - « Poser une question » : le dirigeant pose une question metier et reçoit
     une réponse d'une base intégrée. La base est montée à l'étape suivante ;
     l'onglet est en place, avec son champ et son micro.

   Tout se calcule dans le navigateur, sans serveur, hors ligne. Pas
   d'intelligence artificielle : on normalise le texte et on compte les
   mots-clés trouvés. Demandé par le client, sur le modèle de Nomos.

   AJOUT PUR : aucune destination existante n'a été retirée. L'index DEST est
   celui d'avant, repris en entier ; seule la présentation a été enrichie. */
(function () {
  "use strict";

  /* L'index des actions : chaque entrée mène à un écran qui existe, avec les
     mots que le dirigeant emploie vraiment. Toute destination nouvelle
     s'ajoute ici. */
  var DEST = [
    /* LE LICENCIEMENT MÈNE À SA PROCÉDURE, PAS À UN AUDIT.

       Relevé le 22 novembre 2026 : dire « licenciement » ouvrait l'audit de
       la discipline, qui demande si l'entreprise a un règlement des sanctions.
       Celui qui dit « licenciement » veut la convocation à l'entretien
       préalable et la lettre : elles existent dans Gérer, et la recherche n'y
       menait pas. Ces trois entrées sont en tête, pour l'emporter à égalité. */
    /* CE QU'ON DIT MÈNE AU DOCUMENT, PAS À UN AUDIT NI À UNE LISTE.

       Demande du 25 novembre 2026 : « que les mots prononcés renvoient aux
       parties concernées, et pas n'importe où ». Chaque geste de « Gérer » a
       désormais son entrée, qui ouvre le document lui-même. Placées en tête,
       elles l'emportent à égalité sur les audits. */
    { nom: "Avertissement : sanctionner un salarié", ou: "Gérer, la lettre d'avertissement", page: "gerer.html#avert",
      mots: "insolent impoli malpoli grossier grossierete injure injurie client clients avertissement avertir donner infliger mettre sanction sanctions sanctionner sanctionne blame punir punition recadrer reprimande rappel ordre faute retard retards comportement insubordination insolence refus mauvais travail disciplinaire recadrage rappeler engueuler gronder remontrance observation ecrite lettre premier dernier insulte insulter manque respect irrespect desobeissance desobeir refuse obeir tard retarde excès vitesse telephone volant conduite dangereuse accrochage negligence oubli erreur bavure manquement consigne" },
    { nom: "Mise à pied disciplinaire", ou: "Gérer, la sanction et sa notification", page: "gerer.html#miseapied",
      mots: "mise pied disciplinaire sanction sanctionner suspendre suspension jours sans salaire punir mettre lourde temporaire privation retenue" },
    { nom: "Rupture conventionnelle", ou: "Gérer, la convention et le calendrier", page: "gerer.html#rc",
      mots: "rupture conventionnelle commun accord amiable separer separation negocier depart homologation partir rc ensemble arrangement parties indemnite specifique homologuer dreets formulaire cerfa veut" },
    { nom: "Démission", ou: "Gérer, la démission et le préavis", page: "gerer.html#demission",
      mots: "donne donner remis remet demission demissionner demissionne quitter partir depart volontaire lettre preavis demissionnaire quitte entreprise lache part veut dispense" },
    { nom: "Abandon de poste", ou: "Gérer, la mise en demeure", page: "gerer.html#abandon",
      mots: "abandon poste disparu vient venu revient plus absence injustifiee presomption demission mise demeure abandonne injoignable repond absent sans nouvelles lache travail" },
    { nom: "Fin de CDD", ou: "Gérer, le terme du contrat", page: "gerer.html#fincdd",
      mots: "fin cdd terme echeance renouveler renouvellement indemnite precarite arrive finir terminer contrat duree determinee non prime contrat" },
    { nom: "Suspension ou retrait du permis", ou: "Gérer, le conducteur sans permis", page: "gerer.html#permis",
      mots: "permis suspension suspendu retrait retire points perdu annule annulation conduire plus invalide zero point solde nul interdit gendarmerie police alcool alcoolemie stupefiants excès vitesse" },
    { nom: "Arrêt maladie", ou: "Gérer, l'arrêt et la reprise", page: "gerer.html#maladie",
      mots: "arret maladie malade certificat medical medical indemnites journalieres subrogation prolongation arrete travail medecin reprise ij carence absence" },
    { nom: "Accident du travail", ou: "Gérer, la déclaration", page: "gerer.html#at",
      mots: "mal fait douleur dos dechargement dechargeant decharger chargeant manutention accident travail at blesse blessure trajet declaration declarer cpam blesser tombe chute mission 48 heures temoin depot entrepot atelier quai chantier route" },
    { nom: "Inaptitude", ou: "Gérer, l'avis du médecin du travail", page: "gerer.html#inaptitude",
      mots: "inaptitude inapte medecin travail avis reclassement impossibilite reprise" },
    { nom: "Congés payés", ou: "Gérer, la demande et la réponse", page: "gerer.html#conges",
      mots: "conges conge payes vacances poser demande refuser accorder jours repos rtt periode prise ordre departs" },
    { nom: "Entretien professionnel", ou: "Gérer, le compte rendu", page: "gerer.html#entretien",
      mots: "entretien professionnel annuel evaluation bilan six ans formation perspectives evolution" },
    { nom: "Déclaration d'embauche (DPAE)", ou: "Gérer, la DPAE", page: "gerer.html#dpae",
      mots: "dpae declaration prealable embauche declarer urssaf nouveau salarie arrivee" },
    { nom: "Avenant au contrat", ou: "Gérer, l'avenant", page: "gerer.html#avenant",
      mots: "augmenter avenant modifier modification changer changement horaires poste salaire augmentation mutation lieu temps travail" },
    { nom: "Titres du conducteur", ou: "Gérer, les titres à contrôler", page: "gerer.html#titres",
      mots: "titres permis carte conducteur fimo fco qualification verifier controler validite chronotachygraphe initiale formation continue expire expiration" },
    { nom: "Autorisation de conduite", ou: "Gérer, l'autorisation", page: "gerer.html#autorisation",
      mots: "autorisation conduite caces engin chariot nacelle grue elevateur hayon" },
    { nom: "Certificat de travail et solde de tout compte", ou: "Gérer, les documents de fin de contrat", page: "gerer.html#fin",
      mots: "certificat travail solde tout compte attestation france pole emploi papiers fin contrat sortie stc depart papiers" },
    { nom: "Promesse d'embauche", ou: "Gérer, la promesse", page: "gerer.html#promesse",
      mots: "promesse embauche engagement proposition offre emploi" },
    { nom: "Départ à la retraite", ou: "Gérer, la retraite", page: "gerer.html#retraite",
      mots: "retraite depart retraiter partir age pension demande salarie" },
    { nom: "Contrat CDI", ou: "Gérer, le contrat", page: "gerer.html#cdi",
      mots: "embaucher embauche recruter cdi contrat duree indeterminee embaucher definitivement titulariser permanent" },
    { nom: "Contrat CDD", ou: "Gérer, le contrat", page: "gerer.html#cdd",
      mots: "embaucher embauche recruter cdd contrat duree determinee temporaire remplacement surcroit activite saisonnier" },
    { nom: "Temps partiel", ou: "Gérer, le contrat", page: "gerer.html#partiel",
      mots: "embaucher embauche recruter contrat temps partiel mi temps heures complementaires reduit" },
    { nom: "Contrat de professionnalisation", ou: "Gérer, le contrat", page: "gerer.html#pro",
      mots: "embaucher embauche recruter professionnalisation contrat pro alternance apprenti apprentissage formation tuteur" },
    { nom: "Mutuelle : mise en place", ou: "Gérer, la décision unilatérale", page: "gerer.html#mutuelle",
      mots: "mettre place mutuelle decision unilaterale due complementaire sante obligatoire" },
    { nom: "Mutuelle : demande de dispense", ou: "Gérer, la dispense", page: "gerer.html#dispense",
      mots: "dispense mutuelle refuser mutuelle deja couvert conjoint ayant droit" },
    { nom: "Visite d'information et de prévention", ou: "Gérer, la VIP", page: "gerer.html#vip",
      mots: "vip visite information prevention embauche medecine travail" },
    { nom: "Protocole de sécurité", ou: "Gérer, chargement et déchargement", page: "gerer.html#protocole",
      mots: "protocole securite chargement dechargement quai livraison client entreprise exterieure" },
    { nom: "Mise à la retraite", ou: "Gérer, décidée par l'employeur", page: "gerer.html#miseretraite",
      mots: "mise retraite mettre retraite 70 ans employeur decide" },
    { nom: "Convocation du CSE", ou: "Gérer, la convocation", page: "gerer.html#convoc",
      mots: "reunion cse convoquer convocation cse reunion comite elus" },
    { nom: "Ordre du jour du CSE", ou: "Gérer, l'ordre du jour", page: "gerer.html#odj",
      mots: "ordre jour odj reunion cse" },
    { nom: "Procès-verbal du CSE", ou: "Gérer, le procès-verbal", page: "gerer.html#pv",
      mots: "proces verbal pv compte rendu reunion cse" },
    { nom: "Accord NAO", ou: "Gérer, l'accord", page: "gerer.html#nao",
      mots: "accord nao negociation annuelle signer" },
    { nom: "PV de désaccord", ou: "Gérer, la NAO sans accord", page: "gerer.html#desaccord",
      mots: "annuelle desaccord pv desaccord echec negociation nao" },
    { nom: "Élections du CSE", ou: "Gérer, information, invitations, carence", page: "gerer.html#elections",
      mots: "elections election cse vote voter candidats candidature liste protocole preelectoral pv carence proces verbal carence premier second tour scrutin" },
    { nom: "Suivi tachygraphe", ou: "Tachygraphe et cartes conducteurs", page: "conformite-transport.html",
      mots: "tachygraphe chronotachygraphe carte conducteur telechargement ddd temps conduite repos pause infraction controle dreal drieat 561 temps service" },
    /* LA PANNE EST UN ENTRETIEN, PAS UN SINISTRE. Relevé le 27 novembre 2026 :
       « camion en panne » ouvrait les sinistres du parc, faute d'une entrée
       pour l'entretien. La fiche du camion a son onglet Entretien, que
       flotte.html?faire=entretien ouvre directement. */
    { nom: "Entretien ou réparation d'un camion", ou: "Fiche du camion, onglet Entretien", page: "flotte.html?faire=entretien",
      mots: "panne pannes depanner depannage depanneuse remorquer reparation reparations reparer repare entretien entretenir vidange revision maintenance garage garagiste mecanique mecanicien atelier pneu pneus crevaison creve frein freins plaquettes embrayage batterie demarre demarrage moteur fuite huile voyant ampoule phare clim climatisation hayon groupe froid adblue courroie" },
    { nom: "Sinistres du parc", ou: "Accident, bris de glace, vol", page: "parc-sinistres.html",
      mots: "sinistre sinistres declarer declaration accident camion vehicule bris glace vol vole incendie vandalisme choc degats dommage collision accrochage constat assurance" },
    { nom: "Dépenses du parc", ou: "Coûts par véhicule", page: "parc-depenses.html",
      mots: "depenses cout couts parc facture factures garage reparation entretien budget" },
    { nom: "Tableau de bord du parc", ou: "La synthèse du parc", page: "parc-tableau.html",
      mots: "tableau bord parc synthese chef parc vue ensemble" },
    { nom: "Paramètres du parc", ou: "Listes et réglages du parc", page: "parc-parametres.html",
      mots: "parametres reglages parc listes types depenses entreprises garages" },
    { nom: "Fiches des salariés", ou: "Salariés", page: "salaries.html",
      mots: "salaries fiche salarie dossier personnel coordonnees" },
    { nom: "Parcours guidés", ou: "Pas à pas", page: "parcours.html",
      mots: "parcours guide pas pas etapes accompagnement" },
    { nom: "Mes 5 questions à poser", ou: "Questions", page: "questions.html",
      mots: "questions poser avocat cabinet demander conseil" },
    { nom: "Contrôler un document", ou: "Déposer et vérifier", page: "controler.html",
      mots: "controler verifier relire document existant deposer clause illicite conforme" },
    { nom: "Audit et conformité", ou: "Toutes les obligations", page: "auditer.html",
      mots: "audit conformite obligations controle verifier diagnostic suis je en regle" },
    { nom: "Audit social", ou: "Audit social", page: "audit-social.html",
      mots: "audit social obligations effectif seuils" },
    { nom: "Licenciement pour faute", ou: "Convocation à l'entretien préalable, puis lettre de licenciement", page: "gerer.html#faute",
      mots: "venu bourre ivre saoul alcoolise ebriete drogue drogue stupefiants travail battu battre bagarre frappe frapper coup coups collegue violent agression agresse menace menacer licenciement licencier renvoyer virer congedier rupture depart faute simple grave lourde licenciement faute grave entretien prealable convocation convoquer procedure lettre notification motif cause reelle serieuse separer mettre dehors remercier preavis indemnite salarie conducteur chauffeur employe licencie licencies renvoi viré porte vol vole voler gasoil carburant marchandise caisse alcool violence bagarre insubordination" },
    { nom: "Licenciement économique", ou: "Convocation, entretien préalable, lettre", page: "gerer.html#eco",
      mots: "supprimer postes manque travail assez licenciement licencier economique motif suppression poste emploi supprime difficultes entretien prealable convocation procedure lettre contrat securisation professionnelle economiques baisse activite chiffre affaires perte marche reorganisation csp" },
    { nom: "Mise à pied conservatoire", ou: "Écarter le salarié le temps de la procédure", page: "gerer.html#conservatoire",
      mots: "mise pied conservatoire ecarter tout suite immediatement sur champ suspendre attente procedure licenciement faute grave entretien prealable convocation immediatement renvoyer maison" },
    { nom: "Éditer un contrat de travail", ou: "Contrats du transport", page: "contrats-transport.html",
      mots: "poids lourd pl spl super lourd contrat travail cdi cdd embauche embaucher recruter recrutement rediger ecrire etablir faire salarie employe ouvrier chauffeur conducteur engager engagement promesse essai avenant temps partiel complet nouveau transport routier signer periode" },
    { nom: "Contester une contravention", ou: "Avis de contravention", page: "contraventions.html",
      mots: "recu recue recois contravention amende pv proces verbal stationnement exces vitesse radar feu rouge contester designer denoncer conducteur fps forfait post stationnement infraction prune flash contestation requete ticket excès ceinture telephone ants majoree avis" },
    { nom: "Contrôle URSSAF", ou: "Contrôle URSSAF", page: "controle-urssaf.html",
      mots: "urssaf controle cotisations redressement inspecteur avis contradictoire charte deduction forfaitaire specifique dfs frais deplacement grand deplacement lettre observations recours commission amiable prescription mandataire exoneration reduction generale cotisation redresser inspection recouvrement controleur mise demeure" },
    { nom: "Avertissement, sanction, discipline", ou: "Discipline", page: "audit-discipline.html",
      mots: "avertissement sanction sanctionner discipline disciplinaire infliger donner mettre blame mise a pied faute reproche punir rappel ordre recadrer reprimande comportement mauvaise conduite retard insubordination procedure audit conformite regles echelle sanctions" },
    { nom: "Registre des sanctions", ou: "Discipline", page: "sanctions.html",
      mots: "registre sanctions historique avertissements suivi disciplinaire passes anterieures liste trois ans" },
    { nom: "Mise en demeure, absence, abandon de poste", ou: "Courriers et e-mails", page: "courriers.html",
      mots: "mise demeure absence absent injustifiee abandon poste presomption demission relance relancer justifier reprendre revenir courrier lettre disparu vient plus repond plus" },
    { nom: "Courriers types", ou: "Courriers et e-mails", page: "courriers.html",
      mots: "courrier lettre modele type attestation convocation reponse reclamation client fournisseur salarie demande relance ecrire envoyer mail e-mail courriers lettres email rediger" },
    { nom: "Règlement intérieur", ou: "Règlement intérieur", page: "controler-ri.html",
      mots: "reglement interieur ri discipline affichage depot greffe inspection obligatoire redaction regles internes controler sanctions conseil prud hommes 50 salaries" },
    { nom: "Document unique (DUERP)", ou: "Document unique", page: "duerp.html",
      mots: "duerp document unique risques professionnels securite danger evaluation prevention penibilite accident travail sante hygiene plan action mise jour annuelle" },
    { nom: "Registre du personnel", ou: "Registre du personnel", page: "registre.html",
      mots: "registre personnel unique entree sortie salaries liste effectif embauche depart mouvement declarer dpae ajouter salarie entrees sorties nouveau" },
    { nom: "La flotte", ou: "La flotte, les camions", page: "flotte.html",
      mots: "flotte vehicule camion camions voiture ajouter nouveau parc conducteur affectation carte grise assurance immatriculation controle technique entretien poids lourd vehicules pl semi remorque tracteur porteur fourgon utilitaire plaque kilometrage" },
    { nom: "Papiers personnels du chauffeur", ou: "Fiche du chauffeur, poids lourd ou pas", page: "salaries.html?g=roulant",
      mots: "papiers chauffeur conducteur personnels permis carte qualification fimo fco code 95 carte conducteur poids lourd leger avoir sur lui controler verifier livret individuel controle" },
    { nom: "Papiers à bord du camion", ou: "Fiche du camion, onglet À bord", page: "flotte.html?faire=bord",
      mots: "papiers bord camion vehicule carte grise licence copie conforme lettre voiture triangle gilet controle technique proces verbal location controler verifier cocher" },
    { nom: "Forfait en jours", ou: "Forfait en jours", page: "forfait.html",
      mots: "forfait jours cadre autonomie suivi charge entretien convention temps travail jours travailles decompte annuel 218 repos" },
    { nom: "Décompte des heures", ou: "Décompte des heures", page: "heures.html",
      mots: "heures supplementaires paie paye payer salaire bulletin fiche majoration nuit prime panier decompte temps travail sup dimanche repas amplitude coupure" },
    { nom: "Minima conventionnels", ou: "Minima conventionnels", page: "minima.html",
      mots: "minima conventionnel salaire minimum grille coefficient convention collective taux horaire smic groupe augmentation" },
    { nom: "Notes de service", ou: "Notes de service", page: "notes-service.html",
      mots: "note service consigne information affichage directive interne communication informer prevenir equipe rappel regle" },
    { nom: "Visites médicales", ou: "Visites médicales", page: "visites.html",
      mots: "visite medicale reprise embauche suivi medecine travail aptitude inaptitude sst examen rendez vous docteur medecin periodique" },
    { nom: "Complémentaire santé (mutuelle)", ou: "Complémentaire santé", page: "controler-mutuelle.html",
      mots: "mutuelle complementaire sante frais prevoyance affiliation dispense remboursement adhesion obligatoire" },
    { nom: "Affichages obligatoires", ou: "Affichages obligatoires", page: "controler-affichages.html",
      mots: "affichage obligatoire panneau horaires collectifs inspection medecine egalite consignes securite affichages travail harcelement" },
    { nom: "Égalité femmes-hommes", ou: "Égalité professionnelle", page: "egalite.html",
      mots: "egalite femmes hommes index ecart remuneration penalite publication parite discrimination salaires" },
    { nom: "Base de données (BDESE)", ou: "Ma base de données", page: "bdese.html",
      mots: "bdese base donnees economiques sociales environnementales information consultation bdes cse" },
    { nom: "Comité social et économique (CSE)", ou: "Comité social", page: "audit-cse.html",
      mots: "cse comite social economique elections representants personnel delegue reunion delegues elus consultation" },
    { nom: "Négociation annuelle (NAO)", ou: "Négociation annuelle", page: "audit-nao.html",
      mots: "nao negociation annuelle obligatoire salaires delegue syndical accord augmentation syndicat" },
    { nom: "Santé et sécurité au travail", ou: "Santé et sécurité", page: "audit-sst.html",
      mots: "sst sante securite travail risques accident prevention protection equipement epi" },
    { nom: "Licenciement économique (PSE)", ou: "Plan de sauvegarde", page: "audit-pse.html",
      mots: "pse plan sauvegarde emploi licenciement economique collectif reclassement dix salaries" },
    { nom: "Agenda social et échéances", ou: "Agenda social", page: "agenda.html",
      mots: "agenda echeance delai calendrier rappel date retroplanning planning echeances delais rappels dates a faire" },
    { nom: "Mes documents", ou: "Mes documents", page: "mes-documents.html",
      mots: "documents dossier mes fichiers telecharger archive garder enregistrer sauvegarde retrouver pieces scans" },
    { nom: "Modèles de documents", ou: "Modèles de documents", page: "documents.html",
      mots: "modele document vierge type exemple trame modeles formulaire" },
    { nom: "Équipe et droits", ou: "Équipe", page: "equipe.html",
      mots: "donner comptable expert associe secretaire inviter equipe droits acces journal collaborateur partage utilisateur mot passe" },
    { nom: "Jurisprudence et textes", ou: "Recherche Judilibre", page: "recherche.html",
      mots: "chercher trouver jurisprudence arret decision cour cassation judilibre texte legifrance article loi recherche juridique arrets appel code travail" },
    { nom: "Gérer le quotidien", ou: "Documents du quotidien", page: "gerer.html",
      mots: "gerer gestion quotidien rh documents embauche rupture" }
  ];

  /* Quand rien n'est compris, on propose les écrans les plus utilisés. Faute
     de mesure d'usage, cette liste est choisie à la main parmi les plus
     courants ; elle se corrige le jour où l'on compte vraiment les ouvertures. */
  var PLUS_UTILISES = ["gerer.html", "courriers.html", "registre.html",
    "heures.html", "contrats-transport.html"];

  var VIDES = { "je": 1, "j": 1, "veux": 1, "veut": 1, "voudrais": 1, "souhaite": 1, "faire": 1,
    "fais": 1, "faut": 1, "un": 1, "une": 1, "des": 1, "le": 1, "la": 1, "les": 1, "de": 1,
    "du": 1, "d": 1, "a": 1, "au": 1, "aux": 1, "pour": 1, "mon": 1, "ma": 1, "mes": 1,
    "ce": 1, "cette": 1, "comment": 1, "ou": 1, "et": 1, "en": 1, "sur": 1, "avec": 1,
    "me": 1, "se": 1, "son": 1, "sa": 1, "il": 1, "elle": 1, "y": 1, "ne": 1, "plus": 1, "pas": 1,
    "est": 1, "qu": 1, "que": 1, "qui": 1, "on": 1, "nous": 1, "vous": 1, "ils": 1, "elles": 1,
    "mais": 1, "donc": 1, "par": 1, "dans": 1, "chez": 1, "ai": 1, "as": 1, "avoir": 1 };

  function norm(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9 ]/g, " ");
  }
  function toks(s) {
    return norm(s).split(/\s+/).filter(function (w) { return w.length > 1 && !VIDES[w]; });
  }
  DEST.forEach(function (d) {
    d._m = norm(d.nom + " " + d.mots).split(/\s+/).filter(Boolean);
    d._s = " " + toks(d.nom) .join(" ") + " | " + toks(d.mots).join(" ") + " ";
  });

  /* DEUX MOTS QUI SE SUIVENT DISENT PLUS QU'UN MOT SEUL. « certificat de
     travail » n'est pas « certificat médical », « mise à la retraite » n'est
     pas « départ à la retraite » : quand deux mots de la demande se suivent
     aussi dans l'entrée, l'entrée gagne deux points. */
  function expressions(d, qs) {
    var s = 0;
    for (var i = 0; i + 1 < qs.length; i++) {
      if (d._s.indexOf(" " + qs[i] + " " + qs[i + 1]) >= 0) s += 2;
    }
    return s;
  }

  /* LES MOTS DE PERSONNE NE DÉCIDENT PAS. « chauffeur », « salarié » désignent
     quelqu'un, pas ce qu'on veut faire : ils ne comptent que pour un point,
     pour que le geste (sanctionner, licencier, déclarer) choisisse l'écran. */
  var GENERIQUES = { chauffeur: 1, chauffeurs: 1, conducteur: 1, conducteurs: 1, salarie: 1,
    salaries: 1, employe: 1, employes: 1, personne: 1, gars: 1, quelqu: 1, homme: 1, lui: 1,
    /* « attestation employeur » : l'employeur, c'est celui qui cherche, il ne
       choisit pas l'écran (relevé le 27 novembre 2026, la mise à la retraite
       sortait à égalité avec l'attestation). */
    employeur: 1 };

  /* LES FORMES D'UN MÊME MOT. « téléphonait » est « téléphone », « camions »
     est « camion », « malade » est « maladie » : un mot reconnu à sa racine
     compte comme un début de mot. Le reste de la phrase ne trompe pas pour
     autant : « contrat » ne rejoint pas « contravention », la fin diffère. */
  function memeRacine(q, m) {
    if (m.length >= 5 && q.indexOf(m) === 0) return true;
    var court = q.length <= m.length ? q : m, long = court === q ? m : q;
    if (court.length < 5) return false;
    var n = 0;
    while (n < court.length && court.charAt(n) === long.charAt(n)) n++;
    return n >= court.length - 1 && "ersx".indexOf(court.charAt(court.length - 1)) >= 0;
  }

  /* LES MOTS MAL TAPÉS. Relevé le 25 novembre 2026 : « entretine
     prépalable » ne menait nulle part. Une lettre de trop, de moins, changée
     ou inversée (deux à partir de huit lettres) : le mot est reconnu comme
     celui qu'on voulait écrire. Seulement pour les mots de cinq lettres et
     plus, pour que « vol » ne devienne pas « col ». */
  function proche(q, m) {
    if (q.length < 5 || m.length < 5) return false;
    var max = Math.min(q.length, m.length) >= 8 ? 2 : 1;
    if (Math.abs(q.length - m.length) > max) return false;
    var a = [], i, j;
    for (i = 0; i <= q.length; i++) { a[i] = [i]; }
    for (j = 0; j <= m.length; j++) a[0][j] = j;
    for (i = 1; i <= q.length; i++) {
      var minLigne = 99;
      for (j = 1; j <= m.length; j++) {
        var c = q.charAt(i - 1) === m.charAt(j - 1) ? 0 : 1;
        var v = Math.min(a[i - 1][j] + 1, a[i][j - 1] + 1, a[i - 1][j - 1] + c);
        if (i > 1 && j > 1 && q.charAt(i - 1) === m.charAt(j - 2) && q.charAt(i - 2) === m.charAt(j - 1)) v = Math.min(v, a[i - 2][j - 2] + 1);
        a[i][j] = v; if (v < minLigne) minLigne = v;
      }
      if (minLigne > max) return false;
    }
    return a[q.length][m.length] <= max;
  }

  function score(d, qs) {
    if (!qs.length) return 0;
    var s = 0, lus = [];
    qs.forEach(function (q) {
      var hit = 0, i, lu = q;
      for (i = 0; i < d._m.length; i++) {
        if (d._m[i] === q) { hit = 3; break; }
        if (!hit && d._m[i].indexOf(q) === 0) { hit = 2; lu = d._m[i]; }
      }
      if (!hit) {
        for (i = 0; i < d._m.length; i++) { if (memeRacine(q, d._m[i])) { hit = 2; lu = d._m[i]; break; } }
      }
      if (!hit) {
        for (i = 0; i < d._m.length; i++) { if (d._m[i].indexOf(q) > 0) { hit = 1; break; } }
      }
      if (!hit) {
        for (i = 0; i < d._m.length; i++) { if (proche(q, d._m[i])) { hit = 2; lu = d._m[i]; break; } }
      }
      if (GENERIQUES[q] && hit) hit = 1;
      s += hit; lus.push(lu);
    });
    return s ? s + expressions(d, lus) : 0;
  }
  function classer(texte) {
    var qs = toks(texte);
    if (!qs.length) return [];
    return DEST.map(function (d) { return { d: d, s: score(d, qs) }; })
      .filter(function (o) { return o.s > 0; })
      .sort(function (a, b) { return b.s - a.s; });
  }

  /* « PAS ÇA ? » NE PROPOSE QUE CE QUI A UN VRAI RAPPORT. Relevé le
     27 novembre 2026 : « solde de tout compte » proposait en second la
     suspension du permis et le procès-verbal du CSE, sur un mot isolé
     (« tout », « compte »). Une autre piste n'est retenue que si elle obtient
     au moins les trois quarts du score de la première : elle répond alors à
     la demande presque aussi bien, elle n'y touche pas par hasard. Trois au
     plus. */
  var SEUIL_AUTRES = 0.75;
  function retenir(liste) {
    if (!liste.length) return [];
    var min = liste[0].s * SEUIL_AUTRES;
    return [liste[0]].concat(liste.slice(1).filter(function (o) { return o.s >= min; }).slice(0, 3));
  }

  /* CE QUI N'A PAS ENCORE D'ÉCRAN. Relevé le 27 novembre 2026 : « congé
     maternité » ouvrait les congés payés, « fin de période d'essai » le
     contrat de travail. Aucun écran de l'application ne traite la maternité,
     le congé de paternité, le congé parental, ni la rupture de la période
     d'essai : mieux vaut le dire que mener ailleurs. Le jour où l'écran
     existe, on retire la ligne et on ajoute l'entrée dans DEST. */
  var SANS_ECRAN = [
    { si: /\b(maternite|grossesse|enceinte)\b/, sujet: "la maternité" },
    { si: /\bpaternite\b/, sujet: "le congé de paternité" },
    { si: /\bparental\b/, sujet: "le congé parental" },
    { si: /\bessai\b/, et: /\b(fin|finir|terminer|termine|rompre|romp[a-z]*|rupture|arreter|arrete|interromp[a-z]*|stopper|garder|convient|renvoyer|licenci[a-z]*|virer|vire|separer|partir|quitter|quitte|terme)\b/,
      sujet: "la rupture de la période d'essai" }
  ];
  function sansEcran(texte) {
    var t = norm(texte);
    for (var i = 0; i < SANS_ECRAN.length; i++) {
      var c = SANS_ECRAN[i];
      if (c.si.test(t) && (!c.et || c.et.test(t))) return c.sujet;
    }
    return null;
  }

  /* LA BASE DE RÉPONSES N'EXISTE PAS ENCORE. Tant qu'elle n'existe pas, aucun
     bouton ne promet une réponse : l'onglet « Poser une question » renvoie
     aux questions au cabinet, et le bouton « C'est une question ? » reste
     caché. Le jour où la base est montée, on passe ce drapeau à true. */
  var BASE_REPONSES = false;

  function parPage(page) {
    for (var i = 0; i < DEST.length; i++) if (DEST[i].page === page) return DEST[i];
    return null;
  }

  /* Une demande qui est en réalité une question : elle finit par « ? » ou
     commence par un mot interrogatif. On le repère pour proposer de basculer
     vers l'onglet des réponses. */
  var DEBUTS_Q = /^(combien|quel|quelle|quels|quelles|comment|est-?ce que|peut-?on|peut on|faut-?il|faut il|que faire|quand|pourquoi|qui|a quelle|a quel)\b/;
  function estQuestion(texte) {
    var t = norm(texte).trim();
    if (!t) return false;
    return /\?\s*$/.test(texte.trim()) || DEBUTS_Q.test(t);
  }

  var CSS = '' +
    '.rr-carte{background:var(--surface,#fff);border:1px solid var(--filet,#dcdfe4);' +
    'border-radius:16px;padding:16px;margin:0 0 var(--e5,24px);box-shadow:0 1px 3px rgba(22,24,29,.06)}' +
    '.rr-onglets{display:flex;gap:10px;margin:0 0 14px}' +
    '.rr-onglet{flex:1 1 0;min-width:0;display:flex;align-items:center;justify-content:center;gap:8px;' +
    'border:0;border-radius:12px;padding:13px 10px;font:600 15px/1.1 inherit;cursor:pointer;' +
    'background:var(--accent-clair,#eef1f7);color:var(--texte-2,#5f6874);-webkit-appearance:none;appearance:none}' +
    '.rr-onglet.rr-actif{background:var(--accent,#1F3864);color:#fff}' +
    '.rr-tete{display:flex;align-items:center;gap:14px;margin:4px 2px 12px}' +
    '.rr-mic{flex:0 0 auto;width:56px;height:56px;min-height:0;box-sizing:border-box;padding:0;border:0;' +
    'border-radius:50%;background:#efeefc;color:#4f46e5;cursor:pointer;display:flex;' +
    'align-items:center;justify-content:center;-webkit-appearance:none;appearance:none}' +
    '.rr-mic svg{width:26px;height:26px}' +
    '.rr-mic.rr-indispo{opacity:.55}' +
    '.rr-mic.rr-on{background:#fde7e7;color:var(--rouge,#c0392b);animation:rr-pulse 1s ease-in-out infinite}' +
    '@keyframes rr-pulse{0%,100%{opacity:1}50%{opacity:.45}}' +
    '.rr-titre{font:700 17px/1.2 inherit;color:var(--texte,#16181d)}' +
    '.rr-sous{display:block;color:var(--texte-2,#5f6874);font-size:14px;margin-top:2px}' +
    '.rr-ligne{display:flex;gap:10px}' +
    '.rr-champ{flex:1 1 auto;min-width:0;border:1px solid var(--filet,#cfd6e0);border-radius:12px;' +
    'background:var(--fond-champ,#f7f8fa);color:var(--texte,#16181d);font:inherit;font-size:16px;padding:14px 15px;outline:0}' +
    '.rr-champ:focus{border-color:var(--accent,#1F3864);background:#fff}' +
    '.rr-ok{flex:0 0 auto;border:0;border-radius:12px;background:var(--accent,#1F3864);color:#fff;' +
    'font:700 16px inherit;padding:0 22px;min-height:50px;cursor:pointer;-webkit-appearance:none;appearance:none}' +
    '.rr-ecoute{margin:12px 2px 0;color:var(--rouge,#c0392b);font-size:15px;font-weight:600}' +
    '.rr-res{margin-top:14px;display:flex;flex-direction:column;gap:10px}' +
    '.rr-compris{color:var(--texte-2,#5f6874);font-size:14px}' +
    '.rr-compris b{color:var(--texte,#16181d)}' +
    '.rr-ouvrir{display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;' +
    'background:var(--accent,#1F3864);color:#fff;border-radius:14px;padding:16px;font:700 17px inherit}' +
    '.rr-pasca{color:var(--texte-2,#5f6874);font-size:14px;margin:4px 2px 0}' +
    '.rr-autres{display:flex;flex-direction:column;gap:8px}' +
    '.rr-item{display:flex;align-items:center;gap:12px;background:var(--surface,#fff);border:1px solid var(--filet,#dcdfe4);' +
    'border-radius:12px;padding:12px 14px;text-decoration:none;color:inherit}' +
    '.rr-nom{font-size:15px;font-weight:600}' +
    '.rr-ou{display:block;color:var(--texte-2,#5f6874);font-size:13px;margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.rr-fl{margin-left:auto;color:var(--texte-3,#7b838d);font-size:20px}' +
    '.rr-bascule{display:block;width:100%;text-align:left;border:1px dashed var(--filet,#cfd6e0);' +
    'background:var(--accent-clair,#eef1f7);color:var(--accent,#1F3864);border-radius:12px;' +
    'padding:12px 14px;font:600 14px inherit;cursor:pointer}' +
    '.rr-vide{color:var(--texte-2,#5f6874);font-size:15px;padding:6px 2px}' +
    '.rr-attente{background:var(--accent-clair,#eef1f7);border-radius:12px;padding:14px;color:var(--texte-2,#5f6874);font-size:14px}';

  var MIC_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/><path d="M8 21h8"/></svg>';
  var STOP_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';

  function ech(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var MODES = {
    action: { titre: "Que voulez-vous faire ?", sous: "Dites ou écrivez ce que vous voulez faire",
      exemple: "Ex. : je veux déclarer un incident", micSous: "Touchez le micro et dites ce que vous voulez faire" },
    question: { titre: "Posez votre question", sous: "Une question sur la réglementation transport",
      exemple: "Ex. : combien de temps je peux conduire par jour ?", micSous: "Touchez le micro et posez votre question" }
  };

  function construire(hote) {
    if (!document.getElementById("rr-style")) {
      var st = document.createElement("style");
      st.id = "rr-style";
      st.textContent = CSS;
      document.head.appendChild(st);
    }

    var mode = "action";
    hote.innerHTML =
      '<div class="rr-carte">' +
      '<div class="rr-onglets">' +
      '<button type="button" class="rr-onglet rr-actif" data-mode="action">🧭 Faire une action</button>' +
      '<button type="button" class="rr-onglet" data-mode="question">❓ Poser une question</button>' +
      '</div>' +
      '<div class="rr-tete">' +
      '<button type="button" class="rr-mic" aria-label="Dicter">' + MIC_SVG + '</button>' +
      '<div><span class="rr-titre"></span><span class="rr-sous"></span></div>' +
      '</div>' +
      '<div class="rr-ligne">' +
      '<input class="rr-champ" type="text" inputmode="search" autocomplete="off" aria-label="Votre demande">' +
      '<button type="button" class="rr-ok">OK</button>' +
      '</div>' +
      '<div class="rr-ecoute" hidden>Je vous écoute...</div>' +
      '<div class="rr-res"></div>' +
      '</div>';

    var onglets = hote.querySelectorAll(".rr-onglet");
    var titreEl = hote.querySelector(".rr-titre");
    var sousEl = hote.querySelector(".rr-sous");
    var champ = hote.querySelector(".rr-champ");
    var ok = hote.querySelector(".rr-ok");
    var res = hote.querySelector(".rr-res");
    var ecoute = hote.querySelector(".rr-ecoute");
    var mic = hote.querySelector(".rr-mic");
    var ligne = hote.querySelector(".rr-ligne");

    function aller(page) { window.location.href = page; }

    function majTete() {
      var m = MODES[mode];
      titreEl.textContent = m.titre;
      sousEl.textContent = m.sous;
      champ.setAttribute("placeholder", m.exemple);
      /* Sans base de réponses, l'onglet question n'a ni champ ni micro : on
         n'écrit pas une question qui ne recevra pas de réponse ici. */
      var sansChamp = mode === "question" && !BASE_REPONSES;
      ligne.style.display = sansChamp ? "none" : "";
      mic.style.display = sansChamp ? "none" : "";
      if (sansChamp) sousEl.textContent = "Une question de droit du travail";
    }

    /* MODE ACTION : « J'ai compris », le bouton qui ouvre, puis les autres. */
    function rendreAction() {
      res.textContent = "";
      var texte = champ.value.trim();
      if (!texte) return;
      var manque = sansEcran(texte);
      if (manque) { pasDEcran(manque); return; }
      var liste = retenir(classer(texte));

      if (liste.length) {
        var best = liste[0].d;
        var compris = document.createElement("div");
        compris.className = "rr-compris";
        compris.innerHTML = "✓ J'ai compris : <b></b>";
        compris.querySelector("b").textContent = best.nom;
        res.appendChild(compris);

        var bouton = document.createElement("a");
        bouton.className = "rr-ouvrir";
        bouton.href = best.page;
        bouton.innerHTML = "Ouvrir <span>›</span>";
        res.appendChild(bouton);

        var autres = liste.slice(1, 4);
        if (autres.length) {
          var pasca = document.createElement("div");
          pasca.className = "rr-pasca";
          pasca.textContent = "Pas ça ?";
          res.appendChild(pasca);
          res.appendChild(blocAutres(autres.map(function (o) { return o.d; })));
        }
      } else {
        var v = document.createElement("div");
        v.className = "rr-vide";
        v.textContent = "Je n'ai pas compris, vous vouliez peut-être :";
        res.appendChild(v);
        var sugg = PLUS_UTILISES.map(parPage).filter(Boolean);
        res.appendChild(blocAutres(sugg));
      }

      if (BASE_REPONSES && estQuestion(texte)) {
        var bascule = document.createElement("button");
        bascule.type = "button";
        bascule.className = "rr-bascule";
        bascule.textContent = "❓ C'est une question ? Voir la réponse";
        bascule.addEventListener("click", function () { basculer("question"); });
        res.appendChild(bascule);
      }
    }

    function blocAutres(dests) {
      var box = document.createElement("div");
      box.className = "rr-autres";
      dests.forEach(function (d) {
        var a = document.createElement("a");
        a.className = "rr-item";
        a.href = d.page;
        a.innerHTML = '<span><span class="rr-nom"></span><span class="rr-ou"></span></span><span class="rr-fl">›</span>';
        a.querySelector(".rr-nom").textContent = d.nom;
        /* Le sous-titre qui redit le nom ne s'affiche pas : « Forfait en
           jours » se lisait deux fois sur la même ligne (27 novembre 2026). */
        var ou = a.querySelector(".rr-ou");
        if (d.ou && norm(d.nom).indexOf(norm(d.ou).trim()) < 0) ou.textContent = d.ou;
        else ou.parentNode.removeChild(ou);
        box.appendChild(a);
      });
      return box;
    }

    /* Ce que l'application ne fait pas encore se dit franchement, avec la
       seule suite possible : poser la question au cabinet. */
    function pasDEcran(sujet) {
      var v = document.createElement("div");
      v.className = "rr-vide";
      v.textContent = "L'application n'a pas encore d'écran pour " + sujet + ". Vous pouvez poser la question au cabinet :";
      res.appendChild(v);
      res.appendChild(blocAutres([parPage("questions.html")]));
    }

    /* MODE QUESTION : tant que la base de réponses n'existe pas, l'onglet ne
       promet rien qu'il ne tient pas. Il renvoie, dès qu'on l'ouvre, à la
       page des questions au cabinet. */
    function rendreQuestion() {
      res.textContent = "";
      if (BASE_REPONSES) return;
      var a = document.createElement("div");
      a.className = "rr-vide";
      a.textContent = "Les réponses ne s'affichent pas encore ici. Posez votre question au cabinet :";
      res.appendChild(a);
      res.appendChild(blocAutres([parPage("questions.html")]));
    }

    function rendre() {
      if (mode === "action") rendreAction();
      else rendreQuestion();
    }

    function basculer(m) {
      mode = m;
      for (var i = 0; i < onglets.length; i++) {
        onglets[i].classList.toggle("rr-actif", onglets[i].getAttribute("data-mode") === m);
      }
      majTete();
      rendre();
      if (ligne.style.display !== "none") champ.focus();
    }

    for (var i = 0; i < onglets.length; i++) {
      onglets[i].addEventListener("click", function () { basculer(this.getAttribute("data-mode")); });
    }

    /* L'affichage se met à jour pendant la frappe, après un court répit, et à
       la validation (OK ou Entrée). */
    var minut = null;
    champ.addEventListener("input", function () {
      if (minut) window.clearTimeout(minut);
      minut = window.setTimeout(rendre, 450);
    });
    champ.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); if (minut) window.clearTimeout(minut); rendre(); }
    });
    ok.addEventListener("click", function () { if (minut) window.clearTimeout(minut); rendre(); champ.focus(); });

    /* LE MICRO. Dictée en français, le texte s'écrit en direct. Il s'arrête
       au bout de dix secondes, ou à un second appui. Si le navigateur ne gère
       pas la reconnaissance vocale, ou si le micro est refusé, on met le
       curseur dans le champ et on invite à dicter par le clavier. */
    /* CHROME, FIREFOX OU EDGE SUR IPHONE NE DICTENT PAS. Relevé le
     24 novembre 2026 : « la commande vocale ne fonctionne pas sur Chrome ».
     Sur iPhone, seul Safari donne la reconnaissance vocale aux pages ; les
     autres navigateurs annoncent l'outil, mais il ne démarre jamais, sans un
     message (bogue WebKit 239816). On les reconnaît à leur nom, et le micro
     renvoie alors au micro du clavier. Et partout ailleurs, une écoute qui
     n'a pas démarré au bout de huit secondes est abandonnée avec le même
     message, plutôt que de laisser croire qu'elle écoute. */
    var IOS_AUTRE = /(CriOS|FxiOS|EdgiOS|OPiOS|GSA)\//.test(navigator.userAgent || "");
    var SR = IOS_AUTRE ? null : (window.SpeechRecognition || window.webkitSpeechRecognition);
    var reco = null, enEcoute = false, minuterie = null, guet = null, entendu = false, erreur = false;

    function finEcoute() {
      enEcoute = false;
      mic.classList.remove("rr-on");
      mic.innerHTML = MIC_SVG;
      ecoute.hidden = true;
      if (minuterie) { window.clearTimeout(minuterie); minuterie = null; }
      if (guet) { window.clearTimeout(guet); guet = null; }
    }
    function message(txt) {
      res.textContent = "";
      var v = document.createElement("div");
      v.className = "rr-vide";
      v.textContent = txt;
      res.appendChild(v);
    }
    function dicterAuClavier() {
      champ.focus();
      message(IOS_AUTRE
        ? "Sur iPhone, seul Safari sait dicter ici. Touchez le micro de votre clavier pour dicter, ou ouvrez l'application dans Safari."
        : "Touchez le micro de votre clavier pour dicter, ou écrivez votre demande.");
    }

    if (!SR) {
      if (!IOS_AUTRE) mic.classList.add("rr-indispo");
      mic.addEventListener("click", dicterAuClavier);
    } else {
      mic.addEventListener("click", function () {
        if (enEcoute) { try { reco.stop(); } catch (e) {} return; }
        try {
          entendu = false; erreur = false;
          reco = new SR();
          reco.lang = "fr-FR";
          reco.interimResults = true;
          reco.maxAlternatives = 1;
          reco.onstart = function () {
            if (guet) { window.clearTimeout(guet); guet = null; }
            enEcoute = true;
            mic.classList.add("rr-on");
            mic.innerHTML = STOP_SVG;
            ecoute.hidden = false;
            minuterie = window.setTimeout(function () { try { reco.stop(); } catch (e) {} }, 10000);
          };
          reco.onresult = function (e) {
            var t = "";
            for (var k = 0; k < e.results.length; k++) t += e.results[k][0].transcript;
            if (t) { entendu = true; champ.value = t; rendre(); }
          };
          reco.onerror = function (ev) {
            finEcoute();
            var c = ev && ev.error;
            erreur = true;
            if (c !== "aborted" && window.MicroChamp && window.MicroChamp.raison) { champ.focus(); message(window.MicroChamp.raison(c)); return; }
            if (c === "not-allowed" || c === "service-not-allowed") message("Le micro n'est pas autorisé. Autorisez-le, ou écrivez votre demande.");
            else if (c === "no-speech") message("Je n'ai rien entendu. Réessayez, ou écrivez votre demande.");
            else if (c === "audio-capture") message("Aucun micro détecté. Écrivez votre demande.");
            else dicterAuClavier();
          };
          reco.onend = function () {
            /* Une écoute finie sans un mot compris le dit, au lieu de se taire. */
            var vide = enEcoute && !entendu && !erreur;
            finEcoute(); champ.focus();
            if (vide && window.MicroChamp && window.MicroChamp.raison) message(window.MicroChamp.raison("rien"));
          };
          reco.start();
          guet = window.setTimeout(function () {
            guet = null;
            if (enEcoute) return;
            try { reco.abort(); } catch (e) {}
            finEcoute(); dicterAuClavier();
          }, 8000);
        } catch (e) { finEcoute(); dicterAuClavier(); }
      });
    }

    majTete();
  }

  function demarrer() {
    var hote = document.getElementById("recherche-rapide");
    if (hote) construire(hote);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", demarrer);
  } else {
    demarrer();
  }
})();
