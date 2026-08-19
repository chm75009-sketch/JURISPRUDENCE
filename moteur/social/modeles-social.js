/* Les modèles adaptés du plan d'action — étage 3.

   Pour chaque obligation en défaut, le plan ne renvoie pas à une trame
   générique : il produit un document de départ PRÉ-REMPLI avec les données du
   questionnaire — dénomination, effectif, secteur, convention, seuils — que
   le client imprime, copie et adapte. Un champ que le questionnaire ne
   connaît pas reste un blanc apparent « ______ » : le modèle ne devine rien.

   Ces modèles sont des trames de travail, pas des actes finis : chacun le dit
   en tête. Aucune phrase n'y affirme un texte non lu — les items dont la
   source n'a pas été confirmée au relais gardent des formulations prudentes,
   comme dans le référentiel.                                                */

const B = "______";
const q = v => (v !== undefined && v !== null && String(v).trim() !== "" ? String(v).trim() : B);
const eff = p => (p.effectif !== undefined && p.effectif !== null && String(p.effectif).trim() !== "" ? String(p.effectif).trim() : B);

const h = x => ({ t: "h", x });
const par = x => ({ t: "p", x });
const puce = x => ({ t: "puce", x });
const champ = x => ({ t: "champ", x });

const entete = (p, objet) => [
  par(`${q(p.entreprise)} — effectif déclaré : ${eff(p)} salarié(s)` +
    (q(p.secteur) !== B ? ` — secteur : ${q(p.secteur)}` : "") +
    (q(p.conventionCollective) !== B ? ` — convention : ${q(p.conventionCollective)}` : "")),
  par(`Objet : ${objet}. Établi le ${q(p.dateAudit)}. Trame de travail pré-remplie par l'audit social — à adapter et à faire relire avant usage.`),
];

const MODELES = {

  "SOC-INS-CSE": p => ({
    titre: "Note de lancement du processus électoral (CSE)",
    lignes: [...entete(p, "organisation des élections du comité social et économique"),
      h("1. Constat"),
      par(`L'effectif de ${q(p.entreprise)} (${eff(p)} salariés) atteint le seuil de mise en place du comité social et économique depuis au moins douze mois consécutifs, à la date du ${q(p.dateAudit)}.`),
      h("2. Calendrier à arrêter"),
      puce(`Information du personnel de l'organisation des élections : le ${B}`),
      puce(`Invitation des organisations syndicales à négocier le protocole d'accord préélectoral : le ${B}`),
      puce(`Premier tour : le ${B} — second tour éventuel : le ${B}`),
      h("3. Responsable"),
      champ(`Pilote du processus : ${B} (direction / ressources humaines)`),
      par("En cas d'absence de candidature aux deux tours : établir le procès-verbal de carence et le transmettre. Puis dérouler l'audit complet dans le module « comité social et économique » de l'application.")],
  }),

  "SOC-INS-CSE-ETAB": p => ({
    titre: "Trame d'accord sur les établissements distincts",
    lignes: [...entete(p, "détermination du nombre et du périmètre des établissements distincts"),
      h("Article 1 — Nombre et périmètre"),
      par(`Les parties conviennent que ${q(p.entreprise)} comporte ${B} établissements distincts : ${B}.`),
      h("Article 2 — Représentation"),
      par(`Un comité social et économique est élu dans chacun d'eux ; un comité social et économique central est constitué au niveau de l'entreprise.`),
      h("Article 3 — Dépôt"),
      par("Le présent accord est déposé dans les conditions légales. L'audit détaillé de l'architecture se fait dans le module « comité social et économique ».")],
  }),

  "SOC-INS-CSSCT": p => ({
    titre: "Trame de délibération : création de la CSSCT",
    lignes: [...entete(p, "création de la commission santé, sécurité et conditions de travail"),
      par(`L'effectif de ${eff(p)} salariés impose la création d'une commission santé, sécurité et conditions de travail au sein du comité.`),
      puce(`Nombre de membres : ${B} (dont au moins un représentant du second collège)`),
      puce(`Missions déléguées par le comité : ${B}`),
      puce(`Moyens (heures, formation, réunions par an) : ${B}`),
      par("À fixer par accord d'entreprise ; à défaut, par le règlement intérieur du comité. Audit détaillé dans le module « comité social et économique ».")],
  }),

  "SOC-INS-COMMISSIONS": p => ({
    titre: "Aide-mémoire : commissions du comité à constituer",
    lignes: [...entete(p, "constitution des commissions du comité social et économique"),
      puce(`Commission de la formation : président ${B}, membres ${B}`),
      puce(`Commission d'information et d'aide au logement : ${B}`),
      puce(`Commission de l'égalité professionnelle : ${B}`),
      par("La liste exacte des commissions dues à l'effectif, et ce qu'un accord peut aménager, se vérifient dans le module « comité social et économique ».")],
  }),

  "SOC-INS-GROUPE": p => ({
    titre: "Courrier à l'entreprise dominante : constitution du comité de groupe",
    lignes: [...entete(p, "constitution du comité de groupe"),
      par(`À l'attention de la direction de ${B} (entreprise dominante).`),
      par(`${q(p.entreprise)} appartient au périmètre du groupe. Aucun comité de groupe n'est à notre connaissance constitué. Nous vous saisissons de la constitution de cette instance, ou de la confirmation motivée que le périmètre n'y entre pas.`),
      champ(`Signataire : ${B} — date : ${q(p.dateAudit)}`)],
  }),

  "SOC-INS-REF-HARCELEMENT": p => ({
    titre: "Note de désignation du référent harcèlement sexuel",
    lignes: [...entete(p, "désignation du référent chargé de la lutte contre le harcèlement sexuel et les agissements sexistes"),
      par(`L'effectif de ${q(p.entreprise)} (${eff(p)} salariés) atteint deux cent cinquante salariés : un référent est désigné.`),
      champ(`Référent désigné : ${B} — fonction : ${B} — coordonnées : ${B}`),
      par("Ses coordonnées sont diffusées à l'ensemble du personnel avec l'information sur le harcèlement (affichage, intranet, livret d'accueil). Le comité social et économique désigne par ailleurs son propre référent parmi ses membres.")],
  }),

  "SOC-DOC-RI": p => ({
    titre: "Squelette de règlement intérieur",
    lignes: [...entete(p, "établissement du règlement intérieur"),
      h("I. Santé et sécurité"),
      puce(`Consignes générales et particulières de sécurité applicables dans les locaux de ${q(p.entreprise)} : ${B}`),
      h("II. Discipline"),
      puce(`Échelle des sanctions : ${B}`),
      puce("Garanties de procédure et droits de la défense des salariés"),
      h("III. Rappels obligatoires"),
      puce("Dispositions relatives aux harcèlements moral et sexuel et aux agissements sexistes"),
      puce("Dispositions relatives à la protection des lanceurs d'alerte"),
      h("Formalités"),
      puce(`Avis du comité social et économique recueilli le ${B}`),
      puce(`Transmission à l'inspection du travail le ${B} — dépôt au greffe du conseil de prud'hommes le ${B}`),
      puce(`Publicité auprès des salariés le ${B} — entrée en vigueur : un mois après l'accomplissement des formalités`)],
  }),

  "SOC-DOC-DUERP": p => ({
    titre: "Structure type du document unique (DUERP)",
    lignes: [...entete(p, "établissement du document unique d'évaluation des risques professionnels"),
      h("1. Unités de travail"),
      par(`Découpage proposé pour un effectif de ${eff(p)} salarié(s)` + (q(p.secteur) !== B ? ` dans le secteur ${q(p.secteur)}` : "") + ` : ${B} (par site, atelier, service ou métier).`),
      h("2. Pour chaque unité"),
      puce(`Risques identifiés : ${B}`),
      puce(`Gravité / fréquence d'exposition : ${B}`),
      puce(`Mesures de prévention existantes : ${B}`),
      puce(`Actions à engager, responsable, échéance : ${B}`),
      h("3. Vie du document"),
      puce(`Date d'établissement : ${q(p.dateAudit)} — prochaine mise à jour : au plus tard un an après (à partir de onze salariés), et à chaque aménagement important`),
      puce(`Modalités d'accès portées à la connaissance des salariés, du comité et du service de prévention : ${B}`)],
  }),

  "SOC-DOC-BDESE": p => ({
    titre: "Ossature de la BDESE à constituer",
    lignes: [...entete(p, "constitution de la base de données économiques, sociales et environnementales"),
      par(`Support retenu : ${B} — droits d'accès des élus : ${B}`),
      par(`La liste exacte des rubriques dues à ${q(p.entreprise)} (effectif ${eff(p)}, régime avec ou sans accord) se génère dans le module « base de données (BDESE) » de l'application : ouvrez-le pour l'ossature complète, puis datez la mise à disposition.`)],
  }),

  "SOC-DOC-INDEX": p => ({
    titre: "Feuille de route : index de l'égalité professionnelle",
    lignes: [...entete(p, "calcul et publication de l'index de l'égalité professionnelle"),
      puce(`Période de référence retenue : ${B}`),
      puce(`Collecte des rémunérations par sexe, âge, catégorie : responsable ${B}`),
      puce(`Calcul des indicateurs et de la note globale : ${B} / 100`),
      puce(`Publication sur le site de l'entreprise et télédéclaration : le ${B}`),
      par("Si la note est sous les seuils réglementaires : définir mesures de correction et objectifs de progression. L'exposition à la pénalité se mesure dans le module NAO.")],
  }),

  "SOC-DOC-OETH": p => ({
    titre: "Check-list : obligation d'emploi des travailleurs handicapés",
    lignes: [...entete(p, "régularisation de l'obligation d'emploi des travailleurs handicapés"),
      puce(`Effectif d'assujettissement : ${eff(p)} salariés — bénéficiaires à employer : ${B} (proportion légale de l'effectif)`),
      puce(`Bénéficiaires présents dans l'effectif : ${B}`),
      puce(`Déclaration annuelle via la DSN : faite le ${B}`),
      puce(`Couverture de l'écart : recrutements ${B} · contribution ${B} · accord agréé ${B}`),
      par("Chiffrage de la contribution : à faire établir par l'expert paie — les textes de calcul n'ont pas été vérifiés par cette application.")],
  }),

  "SOC-AFF-HARCELEMENT": p => ({
    titre: "Affiche : information sur les harcèlements moral et sexuel",
    lignes: [...entete(p, "information obligatoire des salariés et des candidats"),
      h("Harcèlement moral — harcèlement sexuel et agissements sexistes"),
      par(`Dans l'entreprise ${q(p.entreprise)}, aucun salarié ne doit subir de tels agissements. Texte des articles applicables du code du travail et du code pénal : [reproduire les textes en vigueur].`),
      h("À qui s'adresser"),
      puce(`Référent harcèlement de l'entreprise (si l'effectif l'impose) : ${B}`),
      puce(`Référent du comité social et économique : ${B}`),
      puce(`Médecin du travail : ${B} — Inspection du travail : ${B}`),
      puce(`Défenseur des droits : ${B}`),
      par("Afficher ou diffuser par tout moyen dans les lieux de travail — et, pour le harcèlement sexuel, dans les lieux d'embauche. Dater la mise en place.")],
  }),

  "SOC-AFF-EGALITE": p => ({
    titre: "Affiche : interdiction des discriminations",
    lignes: [...entete(p, "information sur l'interdiction des discriminations (lieux de travail et locaux d'embauche)"),
      par("Texte à reproduire : articles 225-1 à 225-4 du code pénal, dans leur rédaction en vigueur (interdiction et sanction des discriminations)."),
      par(`Porté à la connaissance des personnes, par tout moyen, dans les lieux de travail et les locaux — ou à la porte des locaux — où se fait l'embauche de ${q(p.entreprise)}, le ${B} — responsable : ${B}.`)],
  }),

  "SOC-AFF-COORDONNEES": p => ({
    titre: "Affiche : coordonnées utiles (inspection, médecine du travail, secours)",
    lignes: [...entete(p, "affichage des coordonnées obligatoires"),
      puce(`Inspection du travail compétente : ${B} — nom de l'inspecteur : ${B} — téléphone : ${B}`),
      puce(`Médecin du travail / service de prévention et de santé au travail : ${B}`),
      puce(`Secours d'urgence : SAMU 15 · Pompiers 18 · Numéro d'urgence européen 112`),
      par(`Affiché dans les locaux normalement accessibles aux salariés de ${q(p.entreprise)}, le ${B}.`)],
  }),

  "SOC-AFF-CONSIGNE-INCENDIE": p => ({
    titre: "Consigne de sécurité incendie (trame)",
    lignes: [...entete(p, "établissement et affichage de la consigne de sécurité incendie"),
      puce(`Matériel d'extinction et de secours — emplacement : ${B}`),
      puce(`Personnes chargées de diriger l'évacuation : ${B}`),
      puce(`Point de rassemblement : ${B}`),
      puce(`Appel des secours : 18 ou 112 — personne chargée de l'appel : ${B}`),
      puce(`Essais et exercices : périodicité ${B} — consignés au registre de sécurité`),
      par("À afficher de manière très apparente dans chaque local concerné.")],
  }),

  "SOC-AFF-HORAIRES": p => ({
    titre: "Affiche : horaire collectif de travail",
    lignes: [...entete(p, "affichage de l'horaire collectif"),
      puce(`Du lundi au vendredi : de ${B} à ${B} et de ${B} à ${B}`),
      puce(`Repos hebdomadaire : ${B}`),
      par(`Horaire applicable au personnel de ${q(p.entreprise)} soumis à l'horaire collectif. Salariés hors horaire collectif : décompte individuel organisé par ${B}.`),
      champ(`Daté et signé : le ${B}, par ${B}`)],
  }),

  "SOC-AFF-CONVENTION": p => ({
    titre: "Avis : convention collective applicable",
    lignes: [...entete(p, "information des salariés sur les textes conventionnels"),
      par(`La convention collective applicable au personnel de ${q(p.entreprise)} est : ${q(p.conventionCollective)}.`),
      par(`Un exemplaire à jour est tenu à la disposition du personnel : ${B} (lieu ou adresse intranet).`),
      par(`La convention est également mentionnée sur le bulletin de paie. Avis communiqué le ${B}.`)],
  }),

  "SOC-AFF-FUMER": p => ({
    titre: "Signalisation : interdiction de fumer et de vapoter",
    lignes: [...entete(p, "signalisation dans les locaux"),
      par("Il est interdit de fumer dans les lieux de travail fermés et couverts. L'interdiction de vapoter s'applique dans les locaux concernés."),
      par("Vérifier les textes en vigueur du code de la santé publique (hors du champ du relais de cette application) et apposer la signalisation apparente à l'entrée des locaux."),
      champ(`Mise en place le ${B} — responsable : ${B}`)],
  }),

  "SOC-REG-PERSONNEL": p => ({
    titre: "Registre unique du personnel : colonnes à tenir",
    lignes: [...entete(p, "tenue du registre unique du personnel, par établissement"),
      puce("Nom, prénoms — nationalité — date de naissance — sexe"),
      puce("Emploi — qualification — dates d'entrée et de sortie"),
      puce("Nature du contrat (CDI, CDD, temps partiel, apprentissage, mise à disposition, stagiaire en annexe…)"),
      puce("Pour les salariés étrangers : type et numéro du titre valant autorisation de travail"),
      par(`Tenu dans l'ordre des embauches, à jour, à disposition de l'inspection du travail et des élus. Support retenu par ${q(p.entreprise)} : ${B}.`)],
  }),

  "SOC-REG-SECURITE": p => ({
    titre: "Sommaire du registre de sécurité",
    lignes: [...entete(p, "rassemblement des vérifications et contrôles santé-sécurité"),
      puce(`Installations électriques — dernière vérification : ${B}`),
      puce(`Moyens d'extinction et alarme — dernière vérification : ${B}`),
      puce(`Équipements de travail (levage, machines…) : ${B}`),
      puce(`Aération, aménagements : ${B}`),
      par("Conserver attestations, consignes, résultats et rapports ; programmer les vérifications manquantes avec des organismes agréés.")],
  }),

  "SOC-REG-DGI": p => ({
    titre: "Page de garde : registre des alertes danger grave et imminent",
    lignes: [...entete(p, "ouverture du registre spécial des alertes"),
      par(`Registre spécial des alertes en cas de danger grave et imminent — ${q(p.entreprise)}. Ouvert le ${B}, pages numérotées.`),
      par(`Chaque avis est daté, signé, et indique : les postes de travail concernés, la nature du danger et sa cause, le nom des travailleurs exposés.`),
      champ(`Lieu de consultation : ${B} — porté à la connaissance des membres du comité le ${B}`)],
  }),

  "SOC-NEG-NAO": p => ({
    titre: "Feuille de route : remise au calendrier des négociations obligatoires",
    lignes: [...entete(p, "engagement des négociations obligatoires"),
      puce(`Diagnostic dans le module NAO de l'application : régime (accord de méthode ou supplétif), thèmes dus, retards — fait le ${B}`),
      puce(`Convocation de la première réunion : le ${B} — lieu et calendrier des réunions fixés en séance`),
      puce(`Informations remises aux négociateurs : ${B} — date de remise : ${B}`),
      par("Une trame d'accord de méthode et de procès-verbal de désaccord existe dans le générateur de documents de l'application (documents.html)."),
      par(`Négociateurs pour ${q(p.entreprise)} : direction ${B} — délégués syndicaux ${B}`)],
  }),

  "SOC-NEG-EGALITE": p => ({
    titre: "Squelette de plan d'action égalité professionnelle",
    lignes: [...entete(p, "couverture égalité professionnelle (à défaut d'accord)"),
      puce(`Diagnostic comparé femmes-hommes (données BDESE) : ${B}`),
      puce(`Objectifs de progression pour l'année : ${B}`),
      puce(`Actions qualitatives et quantitatives : ${B}`),
      puce(`Coût évalué des actions : ${B}`),
      puce(`Dépôt auprès de l'autorité administrative : le ${B}`),
      par("Un accord négocié prime le plan unilatéral : la voie négociée s'audite dans le module NAO.")],
  }),

  "SOC-NEG-PSE": p => ({
    titre: "Avant tout licenciement économique : ordre de passage des modules",
    lignes: [...entete(p, "sécurisation d'un projet de licenciement économique"),
      puce("1. Qualifier le motif dans le module « licenciement économique » (audit.html)"),
      puce("2. Vérifier les seuils et le calibrage du plan dans le module « plan de sauvegarde » (audit-pse.html)"),
      puce("3. Dérouler la consultation du comité aux échéances calculées"),
      par(`Aucune convocation ni notification pour ${q(p.entreprise)} avant la fin de ces audits.`)],
  }),

  "SOC-SST-SPST": p => ({
    titre: "Courrier d'adhésion au service de prévention et de santé au travail",
    lignes: [...entete(p, "adhésion à un service de prévention et de santé au travail"),
      par(`À l'attention du service : ${B}.`),
      par(`${q(p.entreprise)} (${eff(p)} salarié(s)` + (q(p.secteur) !== B ? `, secteur ${q(p.secteur)}` : "") + `) sollicite son adhésion. Vous trouverez la liste du personnel et des postes en annexe ; nous vous demandons la programmation des visites d'information et de prévention en attente.`),
      champ(`Signataire : ${B} — date : ${q(p.dateAudit)}`)],
  }),

  "SOC-SST-VIP": p => ({
    titre: "Demande de programmation des visites en retard",
    lignes: [...entete(p, "mise à jour du suivi médical des salariés"),
      par(`Au service de prévention et de santé au travail de ${q(p.entreprise)} : merci de nous communiquer l'état des visites (information et prévention, suivi renforcé, périodiques) et de programmer les visites en retard listées ci-dessous.`),
      puce(`Salarié ${B} — poste ${B} — embauché le ${B} — visite due : ${B}`),
      puce(`Salarié ${B} — poste ${B} — embauché le ${B} — visite due : ${B}`),
      par("Mettre en place le déclenchement automatique de la demande de visite à chaque embauche.")],
  }),

  "SOC-SST-FORMATION-SECU": p => ({
    titre: "Fiche d'accueil sécurité au poste (trame)",
    lignes: [...entete(p, "formation pratique et appropriée à la sécurité"),
      puce(`Salarié : ${B} — poste : ${B} — date : ${B}`),
      puce(`Risques du poste présentés : ${B}`),
      puce("Circulation dans l'établissement, consignes d'évacuation, conduite en cas d'accident"),
      puce(`Formateur : ${B} — émargement du salarié : ${B}`),
      par("À dérouler à chaque embauche, affectation d'intérimaire et changement de poste ; à conserver.")],
  }),

  "SOC-FOR-ENTRETIENS": p => ({
    titre: "Trame d'entretien de parcours professionnel",
    lignes: [...entete(p, "entretien de parcours professionnel (année suivant l'embauche, puis tous les quatre ans au plus, et retours d'absence)"),
      puce(`Salarié : ${B} — date : ${B} — précédent entretien : ${B}`),
      puce(`Compétences et qualifications mobilisées dans l'emploi actuel, et leur évolution possible : ${B}`),
      puce(`Situation et parcours au regard des évolutions des métiers et des perspectives d'emploi : ${B}`),
      puce(`Besoins de formation (activité actuelle, évolution de l'emploi, projet personnel) : ${B}`),
      puce(`Souhaits d'évolution professionnelle (reconversion, transition, bilan de compétences, validation des acquis) : ${B}`),
      puce("Compte personnel de formation : activation, abondements possibles, conseil en évolution professionnelle"),
      par(`L'entretien ne porte pas sur l'évaluation du travail. Document écrit, copie remise au salarié. Tous les huit ans : état des lieux récapitulatif du parcours — dans les entreprises d'au moins cinquante salariés (${q(p.entreprise)} : effectif ${eff(p)}), une carence déclenche l'abondement correctif du compte formation.`)],
  }),

  "SOC-FOR-ADAPTATION": p => ({
    titre: "Squelette de plan de développement des compétences",
    lignes: [...entete(p, "adaptation au poste et maintien de l'employabilité"),
      puce(`Évolutions des métiers et outils identifiées` + (q(p.secteur) !== B ? ` (secteur ${q(p.secteur)})` : "") + ` : ${B}`),
      puce(`Besoins remontés des entretiens professionnels : ${B}`),
      puce(`Actions retenues, bénéficiaires, calendrier, budget : ${B}`),
      par("Consulter le comité s'il existe ; tracer les actions réalisées.")],
  }),

  "SOC-EPA-PARTICIPATION": p => ({
    titre: "Lettre de cadrage : mise en place de la participation",
    lignes: [...entete(p, "mise en place de la participation aux résultats"),
      par(`L'effectif de ${q(p.entreprise)} (${eff(p)} salariés) assujettit l'entreprise à la participation, à l'échéance que l'expert déterminera selon la durée de maintien au-dessus du seuil.`),
      puce(`Calcul de la réserve spéciale par l'expert-comptable : exercices ${B}`),
      puce(`Négociation de l'accord (formule, répartition, gestion) avec : ${B}`),
      puce(`Dépôt de l'accord : le ${B} — information des salariés : le ${B}`)],
  }),

  "SOC-EPA-SANTE": p => ({
    titre: "Trame de décision unilatérale : complémentaire santé collective",
    lignes: [...entete(p, "mise en place de la couverture santé d'entreprise"),
      par(`La direction de ${q(p.entreprise)} institue un régime collectif et obligatoire de remboursement de frais de santé au profit de l'ensemble du personnel, sous réserve des dispenses légales formalisées par écrit.`),
      puce(`Organisme assureur : ${B} — contrat responsable : ${B}`),
      puce(`Part patronale : ${B} % (au moins la moitié — à vérifier sur les textes du code de la sécurité sociale et la convention de branche, hors du champ du relais)`),
      puce(`Date d'effet : ${B} — remise d'une notice à chaque salarié : ${B}`)],
  }),

  "SOC-EPA-PREVOYANCE-CADRES": p => ({
    titre: "Check-list : prévoyance des cadres",
    lignes: [...entete(p, "couverture de prévoyance des cadres — obligation d'origine conventionnelle"),
      puce(`Population cadre de ${q(p.entreprise)} identifiée : ${B} salarié(s)`),
      puce(`Stipulations de la convention de branche vérifiées (assiette, taux, risques) : ${B} — selon la convention applicable : à vérifier`),
      puce(`Contrat souscrit auprès de : ${B} — cotisation patronale affectée en priorité au risque décès : ${B}`),
      puce(`Périodes passées vérifiées (aucune période découverte) : ${B}`),
      par("Le risque décès ne se rattrape pas : traiter sans délai.")],
  }),

  "SOC-CCN-OBLIGATIONS": p => ({
    titre: "Check-list de revue conventionnelle",
    lignes: [...entete(p, "revue de conformité à la convention collective"),
      par(`Convention déclarée : ${q(p.conventionCollective)} — texte à jour et avenants à se procurer (Légifrance, éditions de branche).`),
      puce(`Salaires réels confrontés aux minima : ${B}`),
      puce(`Primes conventionnelles (ancienneté, vacances…) versées : ${B}`),
      puce(`Classification appliquée conforme à la grille : ${B}`),
      puce(`Prévoyance et garanties de branche : ${B}`),
      par("Rien de précis n'est affirmé ici sur le contenu de la convention : le relais de l'application ne sert que le code du travail — la revue se fait sur le texte conventionnel.")],
  }),
};

module.exports = { MODELES };
