# Contre-audit du module comité social et économique

Contre-audit indépendant conduit le 15 août 2026 sur le module `cse`, dans sa version publiée
au commit `ad783ed`. Huit constats, chacun reproduit par une exécution directe des contrôles.
Le module avait une particularité qui a permis d'aller plus loin que sur l'économique : il
embarque les 368 articles qu'il applique, de sorte que chaque règle a pu être confrontée non
au souvenir du texte, mais au texte lui-même.

| | |
|---|---|
| Objet | module `cse` |
| Version auditée | `ad783ed` — 35 contrôles, 40 règles, 368 articles, 163 arrêts |
| Constats | 8 |
| Propriétés tenues | 9 |
| Réserves de l'auditeur | 5 |

Ce document porte sur le moteur d'audit, non sur le fonctionnement d'un comité réel. Il ne
constitue pas une consultation juridique.

---

## 0. État de traitement

Les huit constats ont été traités au commit `1ee8352`. Six sont fondés et corrigés ; deux ne
le sont pas, et la vérification qui les écarte est reproduite ci-dessous. Cette section
n'appartient pas au contre-audit : elle est ajoutée pour que le document reste lisible une
fois les correctifs appliqués.

| Constat | Traitement |
|---|---|
| C-01 effectif déclaré jamais confronté aux relevés | `coherenceEffectif()` au moteur ; `CSE-CTL-COH-01` et `CSE-CTL-COH-02`, bloquants ; neuf contrôles assis sur l'effectif dégradés en réserve |
| C-02 chronologies inversées acceptées | `moteur/commun/dates.js` — `ecart()` refuse un écart négatif ou calculé sur une date inexistante ; appelé par les deux moteurs |
| C-03 L. 2314-33 tronqué | **réfuté** — le dépôt porte la version en vigueur ; identifiant de version reproduit au rapport, `verifier-textes.js` rejoue la lecture à la source |
| C-04 garde-fou de non-divergence aveugle et non bloquant | inspection du code réunie à une sonde d'exécution, dans les deux sens, avec échec de la génération |
| C-05 alinéa 4 de L. 2314-30 indexé sur les candidats | indexé sur les sièges à pourvoir, désormais collectés ; à défaut, la base dit que l'issue en dépend |
| C-06 néant non déclarable | auxiliaire `neant()` : champ présent et vide vaut réponse, sur neuf contrôles |
| C-07 aucune validation des entrées | `valider-cse.js` et `CSE-CTL-REC-01`, bloquant |
| C-08 64 entrées de corpus vides, garde-fou trop faible | **réfuté pour le garde-fou** — il teste la présence du texte ; le compte est publié au manifeste et mesuré par un cas de contrôle |

La chaîne au commit `1ee8352` compte **40 règles et 38 contrôles**, dont 3 de détection,
éprouvés par 59 cas moteur et 63 cas contradictoires — 2 394 verdicts.

---

## 1. La découverte de méthode : L. 2314-30 est indéterminé sur 734 configurations

Avant les constats, un résultat qui n'est pas un défaut. En énumérant les listes de 2 à 12
candidats pour toutes les répartitions de collèges jusqu'à 120 inscrits — 78 320 configurations
— **734 d'entre elles sont arithmétiquement indéterminées** : l'arrondi prescrit par le texte
ne retombe pas sur le nombre de candidats à désigner.

Le cas le plus simple tient en une ligne. Un collège de 4 inscrits, 1 femme et 3 hommes, pour
une liste de 2 candidats : la proportion donne 0,50 femme et 1,50 homme, l'arrondi de
l'alinéa 3 porte l'une comme l'autre à l'entier supérieur, soit 1 femme et 2 hommes — trois
candidats pour une liste qui en comporte deux.

**Le moteur ne tranche pas, et c'est la bonne réponse.** Il rend `conflit: true`,
`candidatsFemmes: null`, et écrit que le texte ne règle pas ce cas. Aucun arrêt publié du
corpus ne le tranche non plus. Le constat C-05 ci-dessous porte sur un point voisin mais
distinct : celui que le texte règle expressément, et que le moteur réglait mal.

---

## 2. Les huit constats

### C-01 — bloquant — l'effectif déclaré n'était confronté à rien

**Textes** : L. 2311-2, L. 2312-2, L. 2312-34, L. 2315-28, L. 2315-36.

Tout le régime du comité — nombre de réunions, commission santé et sécurité, budgets,
attributions — se calcule sur un seul nombre, `effectif`, que l'employeur déclare. Les relevés
mensuels ne servaient qu'au seuil de onze salariés.

Dossier d'épreuve : effectif déclaré **299**, quatorze relevés mensuels compris entre **312 et
317**, tous versés au dossier. Résultat avant correction : six réunions annuelles validées au
lieu de douze, et l'absence de commission santé et sécurité déclarée régulière. La
contradiction était dans le dossier lui-même, et aucun contrôle ne la lisait.

**Correctif.** `coherenceEffectif()` confronte l'effectif déclaré à l'intervalle des relevés et
recherche les seuils que les relevés franchissent sans que l'effectif déclaré les franchisse.
Deux contrôles bloquants en tirent les conséquences. Surtout, les neuf contrôles assis sur
l'effectif ne peuvent plus prononcer « conforme » — ni « sans objet », qui était ici le plus
trompeur des deux : « commission non obligatoire en deçà de trois cents salariés », écrit sur
un dossier dont les quatorze relevés dépassent trois cents.

Les seuils ne se franchissent pas de la même manière selon le chapitre. L. 2311-2, L. 2312-2 et
L. 2312-34 posent chacun leur règle des douze mois consécutifs ; les chapitres du fonctionnement
— réunion mensuelle de L. 2315-28, commission de L. 2315-36 — n'en posent aucune. Le moteur dit
ce que chaque texte prévoit et ne complète pas le silence des autres.

### C-02 — bloquant — les chronologies inversées passaient pour des délais tenus

**Textes** : L. 2314-4, R. 2312-6, R. 2315-49.

Un contrôle soustrayait deux dates, obtenait un nombre négatif, constatait qu'il n'excédait pas
le délai légal et prononçait la conformité. Le rapport imprimait : « **-115 jours** entre
l'information du personnel et le premier tour », « avis rendu **-58 jours** après la remise des
informations ».

Un écart négatif ne signifie jamais que le délai est tenu : il signifie que les deux dates sont
dans le mauvais ordre, donc que l'une d'elles est fausse.

**Correctif.** `moteur/commun/dates.js` : `ecart()` ne rend un nombre de jours que si les deux
dates existent et se suivent ; sinon elle dit pourquoi, et l'appelant ne peut pas conclure.
Quatre contrôles du module comité l'appellent. La vérification a montré que le module
économique était exposé au même défaut sur la fenêtre de garantie de l'AGS — une notification
antérieure au jugement de liquidation y était déclarée « dans la fenêtre de quinze jours ». Il
est corrigé par le même utilitaire.

### C-03 — réfuté — L. 2314-33 n'est pas tronqué

**Constat de l'auditeur** : l'article du corpus s'arrête à 334 caractères ; il y manque la
limite de trois mandats successifs et ses deux exceptions.

**Vérification.** Le texte a été relu à la source, à quatre dates :

| Date de la version demandée | Identifiant | Longueur |
|---|---|---|
| 1er janvier 2024 | `LEGIARTI000036761951` | 1 189 caractères |
| 1er octobre 2025 | `LEGIARTI000036761951` | 1 189 caractères |
| 1er novembre 2025 | `LEGIARTI000052437191` | 334 caractères |
| 15 août 2026 | `LEGIARTI000052437191` | 334 caractères |

La limite de trois mandats successifs a cessé d'être en vigueur entre le 1er octobre et le
1er novembre 2025. Le dépôt porte la version applicable à la date d'audit. Le reproche procède
d'une version périmée.

**Ce que le constat révèle malgré tout.** Il a fallu quatre requêtes datées pour l'établir,
parce que rien, dans le dépôt, ne disait de quelle version il s'agissait. Deux conséquences,
appliquées : l'identifiant de version est reproduit à côté de chaque article dans le rapport —
un article peut être modifié sans changer de numéro, et c'est l'identifiant, non le numéro, qui
dit laquelle des versions successives a été lue ; et `verifier-textes.js` rejoue la lecture des
368 articles à la source et signale tout écart, de version comme de contenu.

### C-04 — bloquant — le garde-fou de non-divergence ne regardait que dans un sens

Le garde-fou vérifiait que chaque contrôle est atteint par au moins une donnée du questionnaire.
Il ne vérifiait pas la réciproque : qu'aucun contrôle ne lit un champ que personne ne peut
renseigner. Et il n'échouait jamais — il imprimait une ligne dans une annexe.

L'auditeur a montré qu'il était en outre aveugle à deux écritures parfaitement valables :
`f["champFantome"]` et `const {autreFantome} = f`.

**Correctif.** L'inspection du code est réunie à une sonde d'exécution — un `Proxy` sur la fiche
qui enregistre chaque accès, quelle que soit la notation — et les deux sens font échouer la
génération. Une garantie qui se contente d'imprimer un avertissement ne garantit rien.

**Ce que le garde-fou corrigé a trouvé immédiatement** : `collegeVide` et `moisAvantTerme`, lus
par `M.electionsPartielles` et demandés par personne. Or L. 2314-10 en fait deux critères
déterminants — un collège qui n'est plus représenté impose des élections partielles, et
l'événement survenant moins de six mois avant le terme des mandats en dispense. Le contrôle
concluait « non dues » sur des données que nul ne pouvait fournir. Les deux questions sont
désormais posées.

### C-05 — critique — l'alinéa 4 de L. 2314-30 était indexé sur les candidats

**Texte** : « En cas de nombre impair de **sièges à pourvoir** et de stricte égalité entre les
femmes et les hommes inscrits sur les listes électorales, la liste comprend indifféremment un
homme ou une femme supplémentaire. »

Le moteur ouvrait cet alinéa sur le nombre de **candidats**. La distinction n'est pas
théorique : une liste incomplète comporte moins de candidats que le collège n'a de sièges.
L'alinéa était donc ouvert dans des cas qu'il ne couvre pas, et fermé dans des cas qu'il couvre.
Le contrôle `CSE-CTL-ELE-05` ne collectait même pas la donnée.

**Correctif.** Le nombre de sièges à pourvoir est collecté par liste et distinct du nombre de
candidats. Trois issues, et non plus une : l'alinéa s'applique si les sièges sont en nombre
impair ; il ne s'applique pas s'ils sont en nombre pair, et le conflit d'arrondi est signalé ;
et lorsque le nombre de sièges n'est pas renseigné, la base écrit que l'issue en dépend au lieu
de le remplacer par le nombre de candidats.

### C-06 — important — le néant n'était pas déclarable

« Aucune organisation syndicale invitée » et « la question n'a pas été renseignée » sont deux
situations opposées, et la base les confondait en « donnée manquante ». Un employeur qui déclare
expressément n'avoir rien fait obtenait une invitation à compléter, là où il devait obtenir le
constat correspondant.

**Correctif.** L'auxiliaire `neant()` — champ présent et valeur vide — sur neuf contrôles. Une
liste vide d'organisations invitées produit désormais une non-conformité ; un néant déclaré de
contentieux produit un « sans objet », non une donnée manquante.

### C-07 — important — aucune validation des entrées

Le module économique avait la sienne ; celui-ci n'en avait aucune. Une date d'élections au
**30 février** était acceptée sans broncher — `new Date` la décale au 1er ou au 2 mars — et le
contrôle du renouvellement prononçait une conformité sur un jour qui n'existe pas. Un effectif
de 299,5, une masse salariale négative, un nombre de titulaires décimal passaient de même.

**Correctif.** `valider-cse.js` : formats, dénombrements, montants, pourcentages, cohérences
internes de chronologie et de dénombrement. Le contrôle `CSE-CTL-REC-01` en rend compte en tête
du rapport et bloque. Ce qui n'est pas lisible n'est ni conforme ni non conforme.

### C-08 — partiellement réfuté — 64 entrées de corpus sans texte

**Constat exact** : 64 des 432 entrées de `textes_cse.json` sont vides — ce sont des articles
demandés à la source qui n'ont rien renvoyé. **Constat inexact** : le garde-fou de chargement
testerait la présence de la clé et non celle du texte.

**Vérification.** La fonction `texte()` de `grille-cse.js` s'écrit
`if (!v || !v.texte) throw` : une règle citant l'un des 64 articles fait échouer le chargement
de la grille, donc toute la chaîne. Aucune règle n'en cite, et ce n'est pas une question de
discipline d'écriture — c'est vérifié à chaque exécution.

**Ce qui a tout de même été fait.** Le nombre d'articles demandés sans réponse est publié au
manifeste et reproduit dans l'annexe de traçabilité du rapport, plutôt que tu ; et un cas de
contrôle mesure explicitement qu'aucune règle ne s'y fonde, au lieu de s'en remettre au fait que
le chargement aurait échoué.

---

## 3. Les neuf propriétés tenues

L'auditeur a tenté de mettre ces neuf points en défaut et n'y est pas parvenu. Ils sont
reproduits ici parce qu'un contre-audit qui ne dit que ce qui casse ne dit pas où l'on en est.

1. **Le tableau de R. 2314-1** : les 54 lignes sont exactes, y compris la colonne redondante du
   produit titulaires × heures, que le texte annonce et que le moteur recalcule.
2. **Le calcul de parité** est correct, y compris l'alternance — et elle est *contrôlée*, non
   seulement calculée : le dossier truqué déposant F·F·F·H·H avec une proportion exacte a été
   refusé.
3. **Le seuil de douze mois** se réinitialise à la première interruption.
4. **Les délais de consultation** — un mois, deux mois avec expert, trois mois avec expertises
   centrale et d'établissement — sont exacts et leur point de départ est le bon.
5. **Les élections partielles** : les deux cas d'ouverture et l'exception des six mois.
6. **Les budgets** : les deux taux, leur seuil de bascule, et l'assiette.
7. **La commission santé et sécurité** à trois cents salariés, avec la réserve du pouvoir de
   l'inspecteur du travail.
8. **Aucune règle ne se fonde sur un article vide.**
9. **Déterminisme et indifférence à l'ordre** : deux exécutions sur la même fiche rendent le
   même résultat, et l'ordre des clés de la fiche est sans effet.

---

## 4. Les cinq réserves de l'auditeur

Points sur lesquels le contre-audit s'est arrêté sans conclure, et leur état.

| Réserve | État |
|---|---|
| La 54ᵉ ligne du tableau R. 2314-1, sans borne supérieure | vérifiée : `tranche()` la sélectionne pour tout effectif au-delà, un cas de contrôle le mesure à 12 000 salariés |
| Un contrôle lu à travers un auxiliaire, non directement | c'est le cas de `piece(f, …)` ; la sonde d'exécution introduite par C-04 le voit désormais |
| Un nom de champ tronqué : `masseSalarialeN1` | non tronqué — il désigne la masse salariale de l'exercice précédent, et le questionnaire le dit |
| Deux fonctions appelées avec de mauvais arguments | vérifié : les appels sont conformes aux signatures ; l'auditeur lisait `listeParitaire({sieges})` comme un argument mort, il devient déterminant avec C-05 |
| Un inventaire de champs sans valeur probante | remplacé par la mesure : le manifeste publie le nombre de règles qu'aucune fiche du dépôt ne déclenche, tombé à zéro avec la seconde fiche d'épreuve |

---

## 5. Comment rejouer

```
cd moteur/cse
node publier-cse.js        # toute la chaîne, puis le manifeste
node verifier-textes.js    # relit les 368 articles à la source — demande le réseau
```

La publication échoue si un cas échoue, si un contrôle conclut à la conformité sur une fiche
vide, si un contrôle de détection conclut à la conformité, si une branche « non conforme » n'est
atteinte par aucun cas contradictoire, ou si le questionnaire et les contrôles divergent dans
l'un ou l'autre sens.
