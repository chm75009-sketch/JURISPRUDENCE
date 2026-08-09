# Jurisprudence — recherche Judilibre

Application **autonome** de recherche jurisprudentielle dans la base ouverte des
décisions de justice (Cour de cassation, cours d'appel, tribunaux judiciaires,
tribunaux de commerce), via l'[API publique Judilibre](https://www.courdecassation.fr/acces-rapide-judilibre)
de la Cour de cassation.

Une seule page web (`index.html`), sans serveur, sans dépendance : les requêtes
partent directement de votre navigateur vers l'API officielle.

**Application en ligne : <https://chm75009-sketch.github.io/JURISPRUDENCE/>**
(attention, `JURISPRUDENCE` en majuscules).

## Fonctionnalités

### Recherche
- **Recherche en texte intégral** : tous les mots (ET), au moins un mot (OU) ou
  expression exacte ; tri par pertinence ou par date.
- **Mots à exclure** : écarte localement les décisions dont les extraits,
  sommaires ou matières contiennent un terme indésirable (ex. chercher
  « harcèlement moral » en excluant « harcèlement sexuel »). L'API ne sachant
  pas exclure un mot, ce tri est fait par l'application sur les données reçues ;
  une **vérification approfondie** optionnelle contrôle aussi le texte intégral
  des décisions de la page affichée (consomme davantage de quota).
- **Recherche par zone de la décision** : toute la décision, ou seulement les
  motivations, le dispositif, les moyens, l'exposé du litige, ou le
  sommaire/titrage officiels.
- **Bibliothèque de recherches** : des modèles prêts à l'emploi qui remplissent
  le formulaire avec les formules consacrées de la jurisprudence (régime de la
  preuve du harcèlement moral avant/après 2016, appréciation globale « pris
  dans leur ensemble », harcèlement moral institutionnel, obligation de
  sécurité, droit à la preuve, nullité du licenciement…).
- **Filtres** : juridictions (Cass. / cours d'appel / tribunaux judiciaires /
  tribunaux de commerce), chambres de la Cour de cassation, période, solution
  (cassation, rejet…), niveau de publication (Bulletin, Rapport annuel,
  Lettres de chambre, Communiqué).
- **Recherches récentes** : les 12 dernières recherches sont mémorisées dans le
  navigateur et rejouables en un clic.
- **Lien partageable** : copie une adresse qui rouvre la recherche pré-remplie
  chez un collaborateur (le lien ne contient jamais la clé API — chacun utilise
  la sienne).

### Résultats
- Extraits surlignés, numéro de pourvoi, ECLI, solution, matières (titrage),
  lien vers la fiche officielle sur courdecassation.fr.
- **Texte intégral** de chaque décision (avec sommaire officiel s'il existe),
  sans quitter la page, avec surlignage des termes recherchés.
- **Copier la citation** : un clic copie la référence au format des écritures
  (« Cass. soc., 25 novembre 2015, n° 14-24.444, publié au bulletin ») suivie
  du lien officiel.
- **Export massif** en CSV (Excel) ou JSON : jusqu'à 10 000 décisions par
  recherche, avec barre de progression. Colonnes : date, juridiction, chambre,
  numéro, ECLI, solution, publication, matières, citation prête à l'emploi,
  sommaire officiel, extraits pertinents, lien. Les mots à exclure s'appliquent
  aussi à l'export. Le fichier est déposé dans le dossier **Téléchargements**
  du navigateur.

## Mise en route

### 1. Obtenir une clé API (gratuite)

1. Créez un compte sur [piste.gouv.fr](https://piste.gouv.fr).
2. Créez une **application** en environnement **PRODUCTION**.
3. Modifiez l'application et, dans « Sélectionner les API », cochez
   **JUDILIBRE** (acceptez les CGU), puis appliquez les modifications.
4. Sur la fiche de l'application, section « API Keys », copiez la clé.

### 2. Ouvrir l'application

- **En ligne (recommandé)** : <https://chm75009-sketch.github.io/JURISPRUDENCE/>
- **Ou en local** : téléchargez `index.html` et ouvrez-le dans votre navigateur.

### 3. Première utilisation

Collez votre clé API dans le panneau « Votre clé API Judilibre » puis
« Enregistrer et tester ». La clé est conservée **uniquement dans votre
navigateur** (stockage local) : elle n'est jamais publiée sur GitHub ni envoyée
ailleurs qu'à l'API officielle. Chacun de vos collaborateurs utilise sa propre
clé sur son propre poste.

## Limites utiles à connaître

- L'API limite chaque recherche aux **10 000 premiers résultats** : au-delà,
  affinez avec les dates (l'application vous le signale).
- Les quotas PISTE s'appliquent (l'export ménage l'API avec une pause entre
  les pages).
- Les **mots à exclure** sont appliqués par l'application sur les données
  reçues (extraits, sommaires, matières) : sans la « vérification
  approfondie », une décision dont seul le texte intégral contient le mot
  exclu peut passer au travers.
- Les décisions sont **pseudonymisées** (noms des parties masqués) — open data
  oblige.
- Couverture : Cour de cassation (fonds complet), cours d'appel (progressif,
  surtout depuis 2016-2020), tribunaux judiciaires et de commerce (en cours de
  versement).

## Données

Décisions : © Cour de cassation, base Judilibre (open data).
API servie par la plateforme d'État [PISTE](https://piste.gouv.fr).
