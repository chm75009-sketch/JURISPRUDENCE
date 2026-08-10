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
- **Filtres locaux** que l'API ne sait pas faire, appliqués par l'application
  sur les données reçues :
  - **Mots à exclure** — écarte les décisions dont les extraits, sommaires ou
    matières contiennent un terme indésirable (ex. chercher « harcèlement
    moral » en excluant « harcèlement sexuel »). Une **vérification
    approfondie** optionnelle contrôle aussi le texte intégral des décisions de
    la page affichée (consomme davantage de quota).
  - **Mots exigés** — impose un terme absent de la requête principale, toujours
    vérifié dans le **texte intégral** de chaque décision affichée (l'absence
    d'un mot dans un extrait ne prouvant rien). Une requête par décision : ne
    s'applique donc qu'à la page affichée, pas à l'export.
  - **Matière** — ne garde que les décisions dont le titrage officiel contient
    un libellé donné (ex. « contrat de travail »).
- **Regroupement des résultats** par matière, juridiction et chambre, année ou
  solution — réorganise l'affichage sans relancer de requête.
- **Analyse des résultats** : parcourt un échantillon (jusqu'à 500 décisions) et
  affiche la répartition par matière, juridiction, année et solution, avec
  pourcentages. Un clic sur une matière la passe en filtre.
- **Recherche par zone de la décision** : toute la décision, ou seulement les
  motivations, le dispositif, les moyens, l'exposé du litige, ou le
  sommaire/titrage officiels.
- **Angles d'analyse (génériques)** : des transformations applicables à
  n'importe quelle notion tapée dans les mots-clés — arrêts de principe,
  régime de la preuve, définition et critères, jurisprudence récente,
  cassations uniquement, panorama complet. Les angles se **combinent** :
  chacun part des critères affichés à l'écran.
- **Exemples thématiques** : des recherches complètes prêtes à l'emploi qui
  illustrent la méthode sur un sujet (régime de la preuve du harcèlement moral
  avant/après 2016, appréciation globale « pris dans leur ensemble »,
  harcèlement moral institutionnel, obligation de sécurité, droit à la preuve,
  nullité du licenciement…).
- **Guide de méthode intégré** (panneau dépliant « Méthode ») : comment
  formuler une recherche efficace quel que soit le sujet.
- **Filtres** : juridictions (Cass. / cours d'appel / tribunaux judiciaires /
  tribunaux de commerce), chambres de la Cour de cassation, période, solution
  (cassation, rejet…), niveau de publication (Bulletin, Rapport annuel,
  Lettres de chambre, Communiqué).
- **Recherches récentes** : les 12 dernières recherches sont mémorisées dans le
  navigateur et rejouables en un clic.
- **Lien partageable** : copie une adresse qui rouvre la recherche pré-remplie
  chez un collaborateur (le lien ne contient jamais la clé API — chacun utilise
  la sienne).

### Articles de code cliquables

Les articles cités dans le texte d'une décision — « article L. 1154-1 du code du
travail », « articles 455 et 458 du code de procédure civile », « article
L. 1235-3, alinéa 2, du code du travail » — sont détectés et rendus
**cliquables**, sans aucune configuration. Un clic ouvre l'article sur le site
officiel **Légifrance**. Une citation visant plusieurs articles propose le choix.

#### Pourquoi le texte de l'article ne s'affiche pas dans la page

L'API Légifrance permettrait d'afficher l'article **dans sa version applicable à
la date de la décision**, sans quitter la page. Cette voie est aujourd'hui
**fermée à une application de navigateur** :

- l'API Légifrance exige un jeton **OAuth2** (`www-authenticate: Bearer`) ;
- le serveur `oauth.piste.gouv.fr` répond **403 Forbidden, sans en-tête CORS**, à
  toute demande de jeton portant un en-tête `Origin` — que tout navigateur
  ajoute systématiquement. La même requête *sans* `Origin` reçoit une réponse
  normale (400 `invalid_client`). Le refus est donc antérieur à toute
  vérification : aucun identifiant valide ne peut aboutir depuis une page web.

À noter : l'API Légifrance elle-même **accepte** les appels de navigateur (elle
renvoie les en-têtes CORS attendus) — seul le point d'authentification bloque.

Le code de l'intégration OAuth est conservé (panneau « Textes officiels ») : il
fonctionnera tel quel si PISTE lève cette restriction, ou derrière un relais
côté serveur qui détiendrait les identifiants. Il recale le nom du code cité sur
la nomenclature officielle (70 codes) et, si l'article n'y est pas trouvé,
relance la recherche sur l'ensemble des codes en le signalant.

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

- **Élargissement automatique** : quand une recherche (expression exacte ou
  ET) ne donne aucun résultat, l'API Judilibre la relance silencieusement en
  mode « au moins un mot ». L'application le détecte (champ `relaxed` de la
  réponse) et l'affiche en toutes lettres, à l'écran comme à l'export.
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

- Les **articles cliquables** ne couvrent que les **codes** : une citation
  visant une loi non codifiée, un décret ou une convention collective n'est pas
  résolue.
- Le texte des articles n'est **pas affiché dans la page** : le portail PISTE
  refuse l'authentification Légifrance aux navigateurs (voir ci-dessus).

## Données

Décisions : © Cour de cassation, base Judilibre (open data).
Textes : © DILA, [Légifrance](https://www.legifrance.gouv.fr) (open data).
API servies par la plateforme d'État [PISTE](https://piste.gouv.fr).
