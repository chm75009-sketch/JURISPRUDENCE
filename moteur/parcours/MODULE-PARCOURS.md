# Module « parcours guidés »

Une couche opératoire au-dessus des audits. L'audit dit ce qui ne va pas ; le
parcours dit **quoi faire**, dans quel ordre, pour quand, et avec quel document.

Page : `docs/parcours.html` + `docs/parcours.js`.
Ce module ne contient pas de moteur : il n'y a rien à calculer qu'une date et une
visibilité, et cela tient dans la page. Ce qu'il contient, c'est **la preuve des
textes** — la seule chose qui ne doit jamais être écrite de mémoire.

## Les sept parcours

| clé | parcours | étapes | audit de contrôle |
|---|---|---|---|
| `sanction` | Sanctionner un salarié | 9 | `audit-discipline.html` |
| `nao` | Conduire les négociations obligatoires | 10 | `audit-nao.html` |
| `commissions` | Constituer les commissions du CSE | 14 | `audit-cse.html` |
| `reunion` | Tenir une réunion du CSE | 9 | `audit-cse.html` |
| `installation` | Installer le CSE : la première réunion | 17 | `audit-cse.html` |
| `ri` | Établir ou mettre à jour le règlement intérieur | 11 | `audit-discipline.html` |
| `duerp` | Mettre à jour le DUERP | 10 | `audit-sst.html` |

Chaque parcours porte quatre choses : un **préalable** cochable (« êtes-vous
prêt ? ») dont ce qui reste décoché est repris nommément ; des **données du
dossier** — les seules dates dont les délais dépendent ; des **étapes** ordonnées
avec fondement, jurisprudence, échéance calculée et document à produire ; un
**état** enregistré dans `localStorage` sous la clé `parcours-etat`.

## Les textes

`capturer-textes-parcours.js` → `textes-parcours.json` (**120 articles
confirmés**, 0 non confirmé) et `textes-parcours-non-confirmes.json`.
`verifier-textes-parcours.js` → `verification-textes-parcours.json` relit tout.

Règles appliquées, telles que CLAUDE.md les pose :

* filtre par **nom du code** (`"Code du travail"`), jamais un `LEGITEXT` — un
  `LEGITEXT` désactive le filtre et la recherche par pertinence sert alors des
  homonymes d'autres codes ;
* **deux lectures espacées concordantes** au minimum, quatre essais au plus ;
* **critère de contenu** : un texte lu qui ne porte pas le fragment attendu n'est
  pas une autre version de l'article, c'est un autre article — il ne conclut
  rien ;
* un article non confirmé **n'entre pas** au référentiel et n'est jamais cité.

Deux homonymes historiques du dépôt ont été redressés au passage. Au jour de la
capture, `moteur/nao/textes-nao.json` servait encore `L. 2242-1` depuis le code
général des collectivités territoriales (`LEGIARTI000006390466`, « Le conseil
municipal statue sur l'acceptation des dons et legs ») et `L. 2242-10` depuis un
autre code. Sous le filtre par nom du code, les deux rendent l'article du code du
travail : `LEGIARTI000043893962` (« Dans les entreprises où sont constituées une
ou plusieurs sections syndicales… ») et `LEGIARTI000035627827`. Ce sont les
versions citées par les parcours ; le module NAO a été recapturé en parallèle et
porte désormais les mêmes. `docs/agenda.html` note en tête n'avoir pas pu
confirmer `L. 2242-1` en sept lectures ; le filtre par nom du code l'a confirmé
en deux.

`L. 2315-40` a été retiré de la liste : le relais répond « trouvé : faux » à deux
lectures espacées. Aucune étape ne s'y appuie.

### Seconde capture — le parcours d'installation (22 août 2026)

`capturer-textes-installation.js` → `textes-installation.json` (**75 articles
confirmés**, 0 non confirmé) et `textes-installation-non-confirmes.json`.
Quarante-six de ces articles sont nouveaux ; les vingt-neuf autres étaient déjà au
référentiel et ont été redemandés — **aucun écart d'identifiant de version**.

Une précaution s'ajoute au protocole : le relais renvoie un drapeau `elargi`
lorsqu'il a dû **relâcher le filtre par nom du code** pour trouver quelque chose.
Une lecture élargie est désormais écartée comme une réponse `relaxed` de
Judilibre — c'est exactement le mécanisme par lequel les homonymes entrent.

Numéros cherchés et **non retenus**, consignés dans le fichier des non confirmés :

* `R. 2323-38` — l'article du comité d'entreprise qui imposait aux membres du
  comité sortant de *rendre compte de leur gestion au nouveau comité et de
  remettre aux nouveaux membres tous documents concernant l'administration et
  l'activité du comité*. Le relais répond « trouvé : faux » sous le filtre
  « Code du travail » à la date du jour : **il n'est plus en vigueur**. Aucun
  article lu ce jour ne reprend cette obligation pour le comité social et
  économique ;
* `D. 2315-24`, `D. 2315-25`, `D. 2315-28`, `D. 2315-30` à `D. 2315-32` — ces
  numéros n'existent pas à la date lue.

### Ce que le code dit de la transition entre deux comités — et ce qu'il n'en dit pas

C'est le point le plus attendu du parcours d'installation, et c'est celui où il
faut le plus se retenir d'écrire.

**Ce qui est écrit et lu à la source :**

* `L. 2315-23` — le comité est **doté de la personnalité civile** et gère son
  patrimoine. Le renouvellement des mandats change les personnes, non la personne
  morale : il n'y a ni dissolution ni transfert de patrimoine ;
* `L. 2315-64` et `L. 2315-65` — obligations comptables, présentation simplifiée
  en dessous des seuils de `D. 2315-33`, livre chronologique en dessous du seuil
  de ressources ;
* `L. 2315-68` — les comptes annuels sont **arrêtés selon les modalités prévues
  par le règlement intérieur du comité**, par des membres élus désignés par lui et
  en son sein, puis approuvés en séance plénière consacrée à ce seul sujet, avec
  procès-verbal spécifique ;
* `L. 2315-69`, `L. 2315-70`, `L. 2315-71`, `L. 2315-72` — rapport de gestion,
  rapport du trésorier sur les conventions passées avec un membre, communication
  trois jours au moins avant la séance, information des salariés ;
* `L. 2315-75` — **conservation dix ans** des comptes et de leurs pièces
  justificatives, à compter de la clôture de l'exercice ;
* `R. 2312-52` — la **dévolution des biens** n'est organisée qu'en cas de
  *cessation définitive de l'activité de l'entreprise* ; les biens ne peuvent
  alors être répartis ni entre les salariés ni entre les membres du comité.

**Ce qui n'est pas écrit :** aucun article du code du travail lu au relais le
22 août 2026 n'organise la remise-reprise entre le comité sortant et le comité
entrant — ni la forme, ni le délai, ni l'inventaire, ni le sort des contrats et
engagements en cours, ni celui du règlement intérieur du comité précédent, ni
celui des accords conclus avec le comité sortant. L'étape `i10` du parcours le
dit expressément, et renvoie au **règlement intérieur du comité** (`L. 2315-24`),
seul instrument que le code désigne pour régler ce que la loi laisse ouvert. Le
modèle `remise-reprise` porte le même avertissement en tête du document.

## La jurisprudence

`jurisprudence-parcours.json` — **21 arrêts de la chambre sociale**, lus à la
source par l'API Judilibre le 21 août 2026. Aucune réponse portant `relaxed:
true` n'a été retenue. Le texte conservé est le sommaire publié ; pour les deux
arrêts qui n'en portent pas (n° 24-16.408 et n° 25-12.560), ce sont les motifs
lus dans le texte intégral, recopiés sous le champ `motifs`.

Rattachements principaux :

* commissions — Soc. 27 nov. 2019 n° 19-14.224 (désignation à la majorité des
  présents, sans résolution préalable) ; Soc. 26 févr. 2025 n° 24-12.295 (siège
  du troisième collège, ordre public) ; Soc. 11 févr. 2026 n° 24-16.408
  (L. 2315-39 d'ordre public, pas de désignation proportionnelle) ; Soc. 28 mai
  2026 n° 24-22.914 (pas de remplacement hors L. 2314-33) ; Soc. 13 mai 2026
  n° 25-12.560 (L. 2315-38 d'ordre public : ni consultatif ni expertise) ;
  Soc. 18 mars 2026 n° 23-22.270 (expertise décidée par le comité, le cas échéant
  sur proposition des commissions) ;
* sanction — Soc. 18 janv. 2011 n° 09-43.079 ; Soc. 15 janv. 2013 n° 11-28.109 ;
  Soc. 3 mars 2015 n° 13-23.348 ; Soc. 15 juin 2010 n° 08-45.243 ; Soc. 4 déc.
  2012 n° 11-27.508 ; Soc. 17 janv. 1995 n° 91-43.815 ; Soc. 8 sept. 2021
  n° 19-15.039 ; Soc. 20 mars 2024 n° 22-17.292 ;
* règlement intérieur — Soc. 21 sept. 2022 n° 21-10.718 ; Soc. 23 oct. 2024
  n° 22-19.726 ; Soc. 23 juin 2021 n° 19-15.737 ; Soc. 17 oct. 2018
  n° 17-16.465 ;
* NAO — Soc. 15 avr. 2026 n° 24-15.653 ;
* DUERP — Soc. 25 nov. 2015 n° 14-24.444 ;
* réunion — Soc. 15 janv. 2013 n° 11-28.324.

`jurisprudence-installation.json` — **3 arrêts supplémentaires**, lus à la source
le 22 août 2026 par `capturer-jurisprudence-installation.js`, recherche **par
numéro de pourvoi**, aucune réponse `relaxed` retenue :

* **Soc. 10 juill. 1991, n° 88-20.411**, publié au Bulletin — le chef
  d'établissement, membre du comité, participe à la désignation du secrétaire, ce
  vote ne constituant pas la consultation des élus en tant que délégation du
  personnel. *Arrêt rendu sur les articles L. 433-1 et L. 434-2, textes du comité
  d'entreprise ; la citation le précise.*
* **Soc. 8 juill. 2026, n° 25-10.126**, publié au Bulletin — il résulte des
  articles L. 2315-64, L. 2315-68, L. 2315-69 et L. 2315-71 que **tous les membres
  du comité ont un égal accès aux archives et aux documents administratifs et
  comptables** du comité. C'est le seul appui jurisprudentiel actuel de l'étape de
  transition.
* **Soc. 1er juin 2010, n° 09-12.758**, publié au Bulletin — sur l'article
  R. 2323-38 : la reddition de comptes du comité sortant et la remise des
  documents ont été édictées **au profit du comité lui-même**, pour assurer la
  continuité de son fonctionnement, et non au profit de chacun de ses membres.
  *Cité pour la raison d'être de la reddition, non comme fondement actuel :
  R. 2323-38 n'est plus en vigueur.*

## L'adaptation au profil

Le profil vit dans `localStorage` sous la clé partagée `profil-entreprise` — la
même que lisent `docs/documents.html`, `docs/audit-social.html` et
`docs/assistant.js`. Jusqu'ici **personne ne l'écrivait** : cette page est la
première à le remplir, et elle y tient à jour `denomination` comme `entreprise`,
les deux noms que les consommateurs existants attendent.

L'affichage conditionnel reprend la mécanique de `docs/audit-form.js` : une étape
ou un item du préalable porte `si(P, D)` qui rend `true` (visible), `false`
(masqué — la question n'a indiscutablement plus d'objet), ou `null` (indéterminé,
donc **visible** : on ne devine pas). La condition reprend la garde de l'article,
jamais une supposition — 300 pour les commissions formation, logement et égalité,
1 000 pour la commission économique, 50 pour le règlement intérieur et le
programme annuel de prévention, 11 pour la mise à jour annuelle du document
unique.

## Le conventionnel

Jamais affirmé. Là où une convention peut ajouter une étape, le parcours affiche
un encart nommant la convention saisie au profil et renvoyant l'utilisateur à son
texte. L'application ne lit aucune convention collective, et ne prétend pas le
faire.

## Les documents

Chaque étape qui produit un écrit renvoie à `documents.html?modele=<clé>&pre=<JSON
encodé>`. La page de documents ouvre le modèle et verse les valeurs **dans les
seuls champs que le modèle déclare**, et **seulement là où le brouillon est
vide** : ce que l'utilisateur a saisi l'emporte toujours.

Cinq modèles ont été ajoutés à `docs/documents.html` pour ces parcours, au
standard du dépôt (structure intégrale, exemple fictif chiffré marqué
« [exemple] », liste des champs à personnaliser) : `mise-en-demeure`, `alerte`
(danger grave et imminent, atteinte aux droits des personnes, alerte économique),
`cr-commission`, `designation-commission`, `resolution-expert`.

Six autres l'ont été le 22 août 2026 pour le parcours d'installation, au même
standard : `convocation-installation`, `odj-installation`, `pv-installation`
(résolutions rédigées, numérotées dans l'ordre où elles sont rendues),
`ri-comite`, `demande-documentation-eco`, `remise-reprise`. L'étape `i6`
réutilise `designation-commission`, déjà en place.

Deux d'entre eux portent un avertissement, parce qu'il le faut :

* `convocation-installation` — `L. 2315-29` veut un ordre du jour établi par le
  président **et** le secrétaire ; à l'installation il n'y a pas encore de
  secrétaire. Le document dit dans son corps que l'établissement par le seul
  président est une nécessité et non une règle légale, et qu'elle cesse dès la
  réunion suivante ;
* `remise-reprise` — aucun texte lu n'organise cette remise (voir plus haut).
  Le modèle l'écrit en tête.

**Un défaut préexistant, constaté et non corrigé ici :** huit des dix-sept modèles
antérieurs — `convocation`, `pv-cse`, `accord-methode`, `pv-desaccord`,
`note-rh`, `reclamation`, `signalement-harcelement`, `enquete-interne` —
n'appellent ni `exemple()` ni `aPersonnaliser()`, et `convocation-sanction`
n'appelle pas `exemple()`. Ils ne sont donc pas au standard que le dépôt s'est
donné depuis. Les onze autres, dont les six de l'installation, le sont.
