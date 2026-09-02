# Le prompt d'architecture — énoncé du 1er septembre 2026

Texte remis tel quel, sans une correction. Il dit ce que l'application doit
être, et c'est à lui qu'il faut revenir quand un écran se met à parler au lieu
d'agir.

---

Rôle : Tu es un Product Manager et architecte logiciel expert en SIRH et droit du travail français.

Objectif : Concevoir l'architecture et le parcours utilisateur (UX/Workflow) complets d'une application web métier pour dirigeants et RH. Le système ne doit comporter aucune théorie juridique abstraite : chaque action utilisateur génère directement des documents exploitables, calcule des délais stricts ou guide des démarches officielles.

---

## 1. Écran initial : La Fiche Entreprise (Point d'entrée obligatoire)

L'utilisateur renseigne uniquement les données fondamentales qui pilotent tout le moteur juridique :
- Effectif exact (gestion des seuils légaux : 11, 20, 50+ salariés).
- Convention Collective Nationale (CCN) via code IDCC ou secteur/code NAF.

---

## 2. Écran principal : Le Tableau de bord

Une fois la fiche validée, l'interface affiche uniquement 2 boutons d'action :
- Bouton A : AUDIT & CONFORMITÉ
- Bouton B : GESTION RH DU QUOTIDIEN

---

## 3. Parcours complet du Bouton A : AUDIT & CONFORMITÉ

L'écran affiche la liste des modules d'audit (Règlement intérieur, CSE / Élections, DUERP, Affichages obligatoires, BDESE, Égalité pro, etc.).

L'utilisateur choisit une thématique (ex. Règlement intérieur ou Mise en place du CSE). Le système pose la question d'entrée : « Avez-vous ce document / ce process en place ? »

### Cas 1 : L'utilisateur clique sur « OUI » (Audit de validité)

1. Dépôt ou Contrôle : L'utilisateur dépose son document (scan/PDF) ou répond à un questionnaire de conformité ciblée.
2. Diagnostic automatique : L'outil vérifie la présence des mentions obligatoires et traque les clauses illicites, obsolètes ou manquantes au regard des dernières réformes.
3. Mise en conformité : Si le document est non conforme, l'application génère immédiatement un avenant modificatif ou une version révisée conforme, avec la procédure légale de mise à jour.

### Cas 2 : L'utilisateur clique sur « NON » (Module création & déploiement pas-à-pas)

1. Questions rapides de personnalisation : Formulaire court (3 à 4 questions) pour ajuster les spécificités d'entreprise (horaires, sécurité, informatique...).
2. Génération du document principal : Création du document complet, sécurisé et pré-rempli (ex. Règlement intérieur adapté au secteur).
3. Génération du Pack Administratif complet : Création instantanée de l'ensemble des courriers officiels pré-remplis nécessaires au déploiement (courrier de consultation du CSE s'il existe, courriers d'envoi officiel à l'Inspection du travail / DREETS, lettre de dépôt au greffe du Conseil de prud'hommes, note d'information pour affichage interne).
4. Feuille de route chronologique (Rétroplanning interactif) : Affichage pas-à-pas des étapes avec calcul automatique des dates et délais légaux (ex. respect du délai d'un mois entre affichage/dépôts et entrée en vigueur).

---

## 4. Parcours complet du Bouton B : GESTION RH DU QUOTIDIEN

Ce volet gère l'ensemble des actes courants de la vie du salarié via des assistants guidés :

- Embauche & Contrats :
  * Génération de contrats sur-mesure (CDI, CDD avec vérification stricte du motif légal de recours).
  * Application automatique des règles de la Convention Collective : classification, coefficient, minima salariaux obligatoires, durée légale de la période d'essai.
- Procédures disciplinaires & Licenciements :
  * Sécurisation absolue des délais légaux : contrôle de prescription des faits fautifs (délai de 2 mois), respect du délai de convocation à l'entretien préalable (5 jours ouvrables pleins), calcul des délais de notification.
  * Génération des formulaires et courriers adaptés : avertissement, convocation à entretien préalable, trame d'entretien, lettre de notification de licenciement (motif personnel, faute grave, inaptitude, motif économique).
- Gestion des Instances (CSE) :
  * Calendrier et rappels automatiques des réunions obligatoires selon l'effectif.
  * Modèles d'ordres du jour pré-remplis, trames de procès-verbaux et suivi de la BDESE (dès 50 salariés).
- Vie du contrat et santé/sécurité :
  * Trames pour les entretiens professionnels et annuels obligatoires.
  * Gestion du temps de travail (conventions de forfait jours, suivi des congés et RTT).
  * Procédure complète en cas d'inaptitude médicale (recherche de reclassement, consultation du CSE, notification).

---

## Consigne d'exécution

Confirme ta bonne compréhension de l'ensemble de cette architecture en me présentant :
1. La structure de navigation globale.
2. Le déroulé complet (Questions posées -> Document principal généré -> Pack administratif -> Rétroplanning pas-à-pas) d'un cas concret lors d'un clic sur « NON » dans l'Audit (ex. Mise en place des élections du CSE pour une entreprise de 18 salariés).

---

## Où en est le dépôt au regard de ce texte

**Fait.** La fiche d'entreprise commande les seuils. La question d'entrée est
posée dans les modules discipline, santé-sécurité, comité et — depuis le
2 septembre 2026 — base de données. Le « non » ouvre le document lui-même.
Les parcours produisent 66 documents, avec leurs courriers et leur
rétroplanning.

**Pas fait.** Le cas 1 : déposer son document et s'entendre dire quelle clause
est illicite. Rien n'existe, aucune page ne reçoit de fichier.

**Partiel.** Le bouton B : `docs/gerer.html` existe, de l'embauche à la
rupture, mais trois parcours ne produisent encore aucun document — embauche,
entretiens professionnels, congés payés.
