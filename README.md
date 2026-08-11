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
- **Export CSV** (Excel, accents corrects au double-clic grâce au BOM UTF-8) et
  **export HTML** : fichier autonome, lisible partout, imprimable en PDF, avec
  une barre de filtrage embarquée qui fonctionne hors ligne.
- **Copier le lien** : rouvre la recherche chez un confrère. Le lien ne contient
  jamais la clé API.

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
