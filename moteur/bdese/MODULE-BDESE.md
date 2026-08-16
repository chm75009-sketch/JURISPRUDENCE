# Module « base de données économiques, sociales et environnementales »

Quatrième module du dépôt. Il a sa page (`docs/audit-bdese.html`), son moteur,
son questionnaire, son manifeste et sa chaîne de publication.

## Le périmètre, dans les termes validés

> Le module local **prépare, structure, documente et audite** la BDESE. Il ne
> fournit pas une base collaborative accessible simultanément à plusieurs
> catégories d'utilisateurs.

Cette formulation figure telle quelle dans le manifeste, dans la page et dans
chaque rapport. **L'application n'est pas la base** : la mise à disposition
reste un acte de l'employeur, qui se prouve par le support lui-même, ses traces
d'accès et l'information donnée aux bénéficiaires. Un contrôle dédié
(`BDESE-CTL-PRV-01`) réunit ces éléments et rend « risque à vérifier » — il ne
rend jamais « conforme », et la publication échoue s'il le fait un jour.

## L'état de publication — développement, et non catalogue exhaustif

Deux états, qui ne se confondent pas :

| État | Signification |
|---|---|
| **Développement** *(état actuel)* | Couverture mesurée à 96,2 % et 96,6 %, reliquat identifié et suivi. Le catalogue réglementaire **n'est pas exhaustif**, et le module ne doit pas être présenté comme vérifiant l'intégralité du décret. |
| Réglementaire publiée | 100 % du texte consommé, ou reliquat explicitement validé par un juriste et rattaché à une règle. |

L'état est **calculé** par la chaîne de publication, écrit au manifeste
(`etatPublication`, `catalogueReglementaire.exhaustif`), affiché dans la page et
repris en tête de chaque rapport. La transparence sur les 96 % est nécessaire ;
elle ne suffit pas à autoriser une présentation qui laisserait croire le
catalogue complet.

## La règle qui commande tout : le régime d'abord

Le régime supplétif du décret **ne s'applique pas « faute d'avoir trouvé »** : il
s'applique en l'absence d'accord, ce qui est un fait à établir. Tant que la
recherche d'accord n'est pas déclarée conduite, ou tant qu'un accord déclaré
n'est pas versé, le module répond **« régime indéterminé »** et n'audite aucun
contenu.

Auditer un contenu sans savoir quel texte le commande produirait des
non-conformités inventées — un accord peut légalement organiser la base
autrement, sous la seule réserve du plancher. La chaîne de publication mesure
cette règle : `contenuAuditeSurRegimeIndetermine` doit rester à zéro.

**L'absence d'accord se prouve, elle ne se déclare pas.** Une recherche déclarée
« faite » est une affirmation ; ce qui l'établit est une **déclaration datée et
signée**, disant qui a conduit la recherche et à quelle date. À défaut, le régime
reste indéterminé — le supplétif reposerait sinon sur la seule parole de celui
qui l'invoque, ce que ce module refuse partout ailleurs.

Quatre régimes : accord d'entreprise (L. 2312-21, al. 1er), accord de branche
(dernier alinéa, en deçà de trois cents salariés et à défaut d'accord
d'entreprise), supplétif du décret (R. 2312-8 ou R. 2312-9 selon le seuil de
trois cents), et **indéterminé**.

## Les deux listes de dix, nommées distinctement

- **Le plancher de l'accord** — L. 2312-21, alinéa 3 : les dix thèmes que la base
  comporte « au moins ». Aucun accord ne descend en dessous. Il scinde
  l'investissement social et l'investissement matériel et immatériel, et les
  fonds propres de l'endettement.
- **Les dix thèmes de la consultation** — L. 2312-36. Ce ne sont pas les mêmes
  dix, et le rapport le dit à l'endroit où la confusion se produit.

Deux thèmes du décret ne figurent pas au plancher — la sous-traitance, que le
décret nomme « partenariats », et les transferts intragroupe : **un accord peut
donc les supprimer**, et l'application le dit plutôt que de les réclamer.

### La correspondance loi / décret est déclarée et vérifiée

La loi et le décret ne nomment pas les mêmes choses de la même façon. Le
plancher énumère « l'investissement social » et « l'investissement matériel et
immatériel » ; le décret réunit les deux sous une rubrique « Investissements »
et les distingue en sections. Une comparaison de libellés mot à mot produisait
**cinq faux manquements sur un dossier complet** — c'est arrivé à la première
écriture, et c'est ce que `plancher-bdese.js` corrige.

La table de correspondance est **vérifiée au chargement** : chaque intitulé cité
comme équivalent doit exister dans le découpage du décret, sinon le module
refuse de se charger. La filiation rubrique / section est lue dans le découpage,
non écrite à la main : déclarer « Investissements » couvre les deux thèmes que
cette rubrique contient.

## Les délais, et les trois pièges

| Piège | Ce que le module fait |
|---|---|
| **Le seuil de la BDESE confondu avec celui du comité** | Le comité se met en place à onze ; les attributions récurrentes s'exercent à cinquante (L. 2312-2). Les deux seuils sont distincts et le rapport le dit. |
| **La seconde phrase de L. 2312-2** | Si, à l'expiration des douze mois, le mandat restant à courir est inférieur à un an, le délai court à compter du renouvellement. Sans la date de renouvellement, le module **n'annonce aucune date** plutôt qu'une date fausse. |
| **L'accord BDESE confondu avec l'accord de consultation** | La périodicité et les délais des consultations relèvent de **L. 2312-19**, pas de L. 2312-21. Ce sont deux accords distincts, demandés séparément. |

S'y ajoute L. 2312-34 : le seuil de trois cents est réputé franchi après douze
mois consécutifs de dépassement, et l'employeur dispose ensuite d'**un an** pour
se conformer complètement — dont le contenu de R. 2312-9.

## Les grandes tendances — R. 2312-10

Les informations portent sur l'année en cours, les deux précédentes et les trois
suivantes. Ces dernières se présentent en données chiffrées **ou, à défaut, sous
forme de grandes tendances**. Un contrôle qui exigerait six colonnes chiffrées
produirait des non-conformités fausses : le module admet les tendances.

Ce que l'article ajoute et qu'on oublie : l'employeur doit **indiquer, en les
motivant**, les informations qui ne peuvent recevoir ni chiffres ni tendances.
Le contrôle le réclame et rend « risque à vérifier » à défaut.

## Ce qu'il contrôle — 17 contrôles

| Rubrique | Contrôles | Fondement |
|---|---|---|
| Régime applicable | 2 | L. 2312-21 |
| Dates d'exigibilité | 2 | L. 2312-2, L. 2312-34 |
| Contenu | 4 | L. 2312-21 al. 3, R. 2312-8, R. 2312-9, R. 2312-10 |
| Mise à disposition | 3 | L. 2312-18, R. 2312-5, R. 2312-7 |
| Consultations | 3 | L. 2312-19, R. 2312-5, R. 2312-6 |
| Établissements distincts | 1 | L. 2312-21 2°, L. 2316-1 |
| Cohérence | 1 | L. 2312-21 |
| Preuve | 1 | L. 2312-18 |

## Les deux livrables préalables, produits

1. **Le manifeste réglementaire** — les 32 articles retenus, chacun avec son
   identifiant `LEGIARTI…`, sa longueur et le résultat de sa relecture. Il est
   écrit dans `manifeste-bdese.json`, section `manifesteReglementaire`.
2. **Les cas d'épreuve du moteur de régime** — `cas-regime.js` : 13 cas de
   régime (dont **7 où le module doit répondre « indéterminé »** plutôt que
   retomber sur le supplétif), 5 cas de dates et 4 cas de délais.

## Les textes, relus à la source

Relecture au relais Légifrance, deux lectures espacées par article. La synthèse
est écrite de manière à ne pas pouvoir être mal lue :

> **28 articles reconfirmés par le relais sur 32 ; 4 articles non reconfirmés au
> moment de la relecture ; 0 divergence constatée ; version du dépôt conservée et
> identifiable par son identifiant LEGIARTI.**

« Zéro écart » n'est pas « cent pour cent des articles reconfirmés par la
source » : un relais muet, ou qui ne sert que l'homonyme, ne permet de conclure
ni à la concordance ni à la divergence.

Le relais sert des **homonymes** — des articles réels portant le même numéro
dans une autre partie du code — et deux critères les écartent :

- le contenu : pour la base, la bonne version parle de « base de données » ou
  renvoie à un article L. 2312-… ;
- le livre : interrogé sur L. 2312-2, le relais rend **quatre fois de suite** un
  article définissant « le cycle de vie de l'équipement » pour l'application de
  L. 2112-3. Quatre lectures stables et concordantes entre elles : relire
  davantage ne tranche rien. On le reconnaît à ce qu'il renvoie à des articles
  d'un livre que l'article attendu ne cite jamais.

Le second critère a dû être mesuré pour être trouvé. Il est écrit dans
`verifier-textes-bdese.js`, avec le cas qui l'a révélé.

## Chaîne de publication

```
node publier-bdese.js
```

Elle rejoue le découpage du décret, la vérification de la correspondance
plancher / décret, les cas d'épreuve du moteur de régime, les dossiers
contradictoires, la non-divergence du questionnaire dans les deux sens et la
vérification des propositions ; puis elle écrit le manifeste et empaquette
`docs/moteur-bdese.js`.

Elle échoue si un contrôle capable de constater une non-conformité ne l'a jamais
constatée, si un dossier vide produit un « conforme » ou un « sans objet », si un
contenu est audité sur un régime indéterminé, ou si le contrôle de preuve conclut
à la conformité.

## Ce qui reste ouvert

- **L'architecture d'accès** : local pour l'instant. La question d'un lot serveur
  partagé — accès simultané employeur / élus / expert, traçabilité des
  consultations — est reportée, non tranchée. Aucun écrit ne doit promettre un
  accès partagé tant qu'elle ne l'est pas.
- ~~Ce qui prouve « absence d'accord vérifiée »~~ — **tranché** : une déclaration
  datée et signée est désormais exigée, et le régime reste indéterminé à défaut.
- **Le comité central et les établissements** : le niveau de mise en place est
  contrôlé, et R. 2312-6 II est cité. La consultation à double niveau n'est pas
  modélisée plus avant.
- **La couverture du découpage** reste à 96,2 % et 96,6 %. Le critère de sortie de
  100 % est **bloquant pour l'état « réglementaire publiée »** : tant qu'il n'est
  pas atteint, le manifeste porte l'état « développement », et la page comme le
  rapport le disent.
- **Le comité central et les établissements distincts** : point fonctionnel à
  approfondir avant de revendiquer une couverture complète des consultations
  complexes. Le niveau de mise en place est contrôlé et R. 2312-6, II est cité ;
  la consultation à double niveau n'est pas modélisée plus avant.
