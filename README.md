# Jurisprudence — recherche Judilibre

Recherche jurisprudentielle dans la base ouverte des décisions de justice
(Cour de cassation, cours d'appel, tribunaux judiciaires et de commerce), via
l'[API publique Judilibre](https://www.courdecassation.fr/acces-rapide-judilibre).

**Application en ligne : <https://jurisprudence-recherche.netlify.app>**

Seconde adresse, sans le relais Légifrance :
<https://chm75009-sketch.github.io/JURISPRUDENCE/>

## Le principe : fidélité

**Aucune décision n'est affichée qui ne corresponde à la demande.**

Ce n'est pas une intention, c'est une règle appuyée sur une mesure. L'API a été
éprouvée en récupérant le **texte intégral** des décisions renvoyées et en y
cherchant mot à mot ce qui avait été demandé :

| Situation | Décisions vérifiées | Écarts |
|---|---|---|
| L'API ne signale pas d'élargissement | 49 | **0** |
| L'API signale un élargissement (`relaxed`) | 10 | **10** |

Hors élargissement, l'API est fidèle — y compris sur les flexions : « vice
caché » ne ramène jamais « vices cachés ». L'élargissement est donc **l'unique
source d'écart**, et l'API le déclare elle-même.

Conséquence, appliquée sans exception : lorsque l'API élargit — c'est-à-dire
lorsqu'elle remplace silencieusement la demande par « au moins un mot » faute de
correspondance — **l'application n'affiche rien**. Elle annonce « aucune
décision ne correspond », explique ce qui s'est passé, et laisse le choix : voir
malgré tout les résultats élargis (signalés comme hors demande), ou relancer
explicitement en « au moins un mot ». Les exports, eux, ne contiennent jamais de
résultats élargis.

Quand des décisions sont affichées, un bandeau vert rappelle ce qu'elles ont
toutes en commun : « Toutes ces décisions contiennent l'expression exacte
« … » ».

## Écran de départ

Cinq réglages, rien d'autre : ce que vous cherchez, comment interpréter les mots
(expression exacte / tous les mots / au moins un mot), les juridictions, les
dates. Le reste est replié sous « Affiner ».

**Aucun réglage ne peut agir en restant invisible** — c'est le second parti pris.
Le titre de la section repliée porte le nombre de réglages actifs, et chacun est
rappelé au-dessus des résultats, retirable d'un clic.

## Affiner

- **Modèles de recherche** : 67 recherches prêtes à l'emploi, bâties sur les
  formules consacrées de la jurisprudence, couvrant le civil, le commercial, le
  pénal, le travail et la procédure. Classées alphabétiquement et filtrables.
  Chaque formulation a été vérifiée contre l'API.
- **Mots à exclure** : écarte les décisions dont les extraits, sommaires ou
  matières contiennent un terme indésirable.
- **Chercher dans** : toute la décision, motivations, dispositif, moyens, exposé
  du litige, ou sommaire et titrage. Chaque valeur a été validée contre l'API.
- **Une juridiction en particulier** : les 351 juridictions du fond de la base
  (36 cours d'appel, 174 tribunaux judiciaires, 141 tribunaux de commerce), avec
  filtrage. Choisir une juridiction coche automatiquement la case de son type.
- **Chambres** de la Cour de cassation, **publication** (Bulletin, Rapport
  annuel, Lettres de chambre, Communiqué), **tri**.

## Résultats

- Citation, date, numéro de pourvoi, solution, matières, ECLI.
- **Sommaire officiel** quand il existe — le résumé rédigé par la Cour.
- Extraits surlignés.

**Rien n'est amputé.** Une fiche restitue tout ce que l'API renvoie sur la
décision : le sommaire officiel en entier, tous les extraits, toutes les
matières. Aucun seuil d'affichage — un seuil est une décision prise à la place
du lecteur, qui n'a aucun moyen de savoir ce qu'on lui a retiré. Le nombre de
décisions par page (10, 20 ou 50) est lui aussi un choix, offert à côté de la
pagination.
- **Texte intégral** sans quitter la page, vos termes surlignés.
- **Copier la citation** au format des écritures
  (« Cass. soc., 25 novembre 2015, n° 14-24.444, publié au bulletin »).
- **Copie de la décision en PDF et en Word**, depuis la fenêtre du texte
  intégral. Le PDF passe par l'impression du navigateur — seul moyen fiable et
  sans dépendance d'obtenir un PDF fidèle — déclenchée depuis un cadre masqué
  pour éviter les blocages de fenêtres surgissantes. Le Word est un **vrai
  `.docx`** : archive ZIP et XML Office écrits par l'application, non un HTML
  renommé. Titre, sous-titre, sommaire officiel, texte intégral et mention de
  source y figurent, et le fichier est relu sans erreur par une implémentation
  Word indépendante.
- **Export CSV** (Excel, accents corrects au double-clic grâce au BOM UTF-8) et
  **export HTML** : fichier autonome, lisible partout, imprimable en PDF, avec
  une barre de filtrage embarquée qui fonctionne hors ligne.
- **Copier le lien** : rouvre la recherche chez un confrère. Le lien ne contient
  jamais la clé API.

## Trouver les bons mots-clés

On cherche « faux CV » et l'on ne trouve rien, parce que les juges n'écrivent
pas « faux CV » : ils écrivent « fausses déclarations », « fausse
qualification », « manœuvres dolosives ». Personne ne peut deviner ces
formules, et un assistant qui les inventerait ne vaudrait pas mieux que le
hasard.

Le bouton **« Trouver les bons mots-clés »** applique donc la règle qui
gouverne le reste de l'application : ne rien affirmer qui ne soit mesuré.

1. La recherche est lancée sur les mots de l'utilisateur en « tous les mots »
   — jamais « au moins un mot » d'emblée, qui ramasse n'importe quoi dès qu'un
   terme est ambigu : sur « faux CV », il ramenait la taxe différentielle sur
   les véhicules, « CV » y valant cheval fiscal.
2. Les sommaires et extraits des cinquante décisions renvoyées sont lus, et
   l'on en extrait les expressions de deux à cinq mots qui y reviennent.
3. **Chacune est ensuite comptée** en expression exacte sur la base entière.
4. Le classement se fait par **spécificité**, non par abondance : ce qui est
   fréquent dans l'échantillon et rare dans la base caractérise le sujet.
   « base légale » revient dans 14 901 décisions et n'apprend rien ; « entrave
   au fonctionnement régulier » n'en compte que 40 et désigne la recherche.

Ce qui est proposé n'est donc pas une suggestion : c'est un relevé chiffré,
vérifiable d'un clic. Les expressions que l'API ne trouve pas telles quelles
sont écartées et signalées — les proposer reviendrait à promettre des résultats
inexistants.

**Ses limites, qui sont celles de la méthode.** Le relevé vaut ce que vaut
l'échantillon : sur un sujet abondamment jugé, il est excellent ; sur un sujet
rare ou formulé de façon ambiguë, il reste bruité. Les matières dominantes des
décisions lues sont affichées à côté, comme second angle d'attaque.

## Conventions collectives

Le texte officiel des **conventions collectives nationales**, tel qu'il est
publié — fonds KALI de Légifrance, la même API et le même abonnement que les
codes.

Une convention se désigne par son **numéro IDCC** (16 pour les transports
routiers, 1486 pour les bureaux d'études) ou se cherche par son intitulé.
L'application affiche alors la liste de ses textes — texte de base, annexes,
avenants — chacun avec sa date et son état juridique. Un texte s'ouvre
entièrement, se filtre par mot-clé (« coefficient », « classification »), et
**s'exporte en PDF et en Word** : c'est ce qui permet de le verser aux débats,
proprement daté et référencé.

Les tableaux — grilles de coefficients notamment — sont conservés tels que la
DILA les publie. Le HTML reçu est inséré après avoir été débarrassé de tout ce
qui peut s'exécuter : la source est officielle, ce n'est pas une raison pour lui
accorder les droits d'un script de la page.

### Chercher dans le texte d'une convention

Un champ interroge le **contenu** de la convention ouverte, et non ses seuls
intitulés : « coefficient 200 », « période d'essai », « prime d'ancienneté »
ramènent les textes qui les contiennent, avec les extraits, sans parcourir les
huit cents articles. La recherche est bornée à la convention choisie par son
numéro IDCC.

### Le pont avec la jurisprudence

Une décision qui applique un texte conventionnel le cite le plus souvent mot
pour mot. Deux passerelles en découlent :

- **« Décisions citant cette convention »** cherche dans Judilibre le nom sous
  lequel les juges la désignent — 3 447 décisions pour les transports routiers,
  2 169 pour les bureaux d'études, 745 pour la métallurgie.
- **« Décisions citant cet article »**, sur chaque article ouvert, cherche une
  **phrase caractéristique** de son texte — assez longue pour lui être propre,
  assez courte pour que l'expression exacte aboutisse. Chercher par le numéro
  d'article serait illusoire : « article 5 » existe dans les sept cents
  conventions du fonds. Sur la définition du groupe 6 des cadres du transport
  routier, la passerelle rend 4 décisions.

Rien n'est deviné : l'expression envoyée à Judilibre est celle que l'on a sous
les yeux, et la recherche s'y lance en expression exacte.

Comme pour les articles de code, cet écran suppose le **relais** (adresse
Netlify) : l'authentification OAuth de Légifrance est impossible depuis un
navigateur.

## Articles de code cliquables

Les articles cités dans le texte d'une décision — « article L. 1154-1 du code du
travail », « articles 455 et 458 du code de procédure civile », « article
L. 1235-3, alinéa 2, du code du travail » — sont détectés et cliquables.

- **Avec le relais Légifrance** (adresse Netlify) : le texte de l'article
  s'affiche dans la page, **dans sa version applicable à la date de la
  décision**. Lire un arrêt de 2012 montre la rédaction de 2012.
- **Sans relais** : le clic ouvre la fiche sur legifrance.gouv.fr.

### Pourquoi un relais côté serveur

- L'API Légifrance exige un jeton **OAuth2** (`www-authenticate: Bearer`).
- Le serveur `oauth.piste.gouv.fr` répond **403, sans en-tête CORS**, à toute
  demande de jeton portant un en-tête `Origin` — que tout navigateur ajoute.
  La même requête *sans* `Origin` reçoit une réponse normale (400
  `invalid_client`). Le refus précède toute vérification : aucun identifiant
  valide ne peut aboutir depuis une page web.
- L'API Légifrance elle-même **accepte** les appels de navigateur : seul le
  point d'authentification bloque.

`netlify/functions/legifrance.mjs` fait ce travail côté serveur. Les identifiants
PISTE y sont fournis en variables d'environnement (`PISTE_CLIENT_ID`,
`PISTE_CLIENT_SECRET`) : ils ne figurent jamais dans le code publié et ne sont
jamais transmis au navigateur.

## Installation sur l'appareil

L'application s'installe comme un logiciel : icône dédiée, plein écran,
consultation hors connexion une fois ouverte au moins une fois. Le service
worker suit une stratégie « réseau d'abord, cache en secours » — jamais de
version périmée tant qu'il y a du réseau, et aucun résultat de recherche mis en
cache.

- **Ordinateur** (Chrome, Edge) : icône d'installation dans la barre d'adresse,
  ou menu ⋮ → « Installer Jurisprudence… ».
- **iPhone** (Safari obligatoirement) : Partager → « Sur l'écran d'accueil ».

Le nom d'hôte et **le numéro de version** figurent en tête : installée en plein
écran, l'application n'a pas de barre d'adresse, et rien n'indiquerait sinon ce
que l'on utilise.

**Les mises à jour se signalent d'elles-mêmes.** Une application installée ne se
recharge jamais seule : sans avertissement, on peut rester des jours sur une
version dépassée sans le savoir — ce qui rend incompréhensible tout défaut déjà
corrigé. Dès qu'une nouvelle version prend la main, un bandeau apparaît avec un
bouton « Recharger maintenant ».

## Mise en route

1. Créez un compte sur [piste.gouv.fr](https://piste.gouv.fr).
2. Créez une **application** en environnement **PRODUCTION**.
3. Souscrivez l'API **JUDILIBRE** (« Sélectionner les API », acceptez les CGU).
4. Copiez l'« API Key » et collez-la dans l'application.

La clé reste dans votre navigateur (stockage local) et n'est envoyée qu'à l'API
officielle. Chaque collaborateur utilise la sienne, sur son poste.

## Limites

- L'API s'arrête aux **10 000 premiers résultats** : au-delà, affinez par dates.
- Les quotas PISTE s'appliquent.
- Les **mots à exclure** portent sur ce que la recherche renvoie (extraits,
  sommaires, matières) : une décision dont seul le texte intégral contient le
  mot exclu peut passer au travers. L'application ne prétend pas le contraire.
- Les décisions sont **pseudonymisées** (open data).
- Couverture : Cour de cassation (fonds complet), cours d'appel (dense depuis
  2022), tribunaux judiciaires et de commerce (versement en cours). Le
  contentieux pénal de fond et les conseils de prud'hommes ne figurent pas dans
  la base.
- Les articles cliquables ne couvrent que les **codes** : une loi non codifiée,
  un décret ou une convention collective ne sont pas résolus.

## Données

Décisions : © Cour de cassation, base Judilibre (open data).
Textes : © DILA, [Légifrance](https://www.legifrance.gouv.fr) (open data).
API servies par la plateforme d'État [PISTE](https://piste.gouv.fr).
