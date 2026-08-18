# Module « négociation obligatoire en entreprise » (NAO)

Audit de conformité des négociations obligatoires — articles L. 2242-1 et
suivants du code du travail. Côté employeur : ce qui est dû, tous les combien,
comment le conduire loyalement, comment le conclure, et ce que coûte un
manquement.

## La règle qui commande tout : l'accord de méthode d'abord

Une seule question ouvre le module : **y a-t-il un accord de méthode
(L. 2242-10) ?**

- **Non** — le régime supplétif de L. 2242-13 s'applique : rémunération chaque
  année, égalité professionnelle chaque année, gestion des emplois et des
  parcours tous les trois ans à partir de trois cents salariés, salariés
  expérimentés tous les trois ans à partir de trois cents salariés
  (L. 2242-2-1).
- **Oui** — ce sont ses périodicités qui comptent (au plus quatre ans par
  thème), à condition qu'il soit joint, que sa durée n'excède pas quatre ans et
  qu'il porte les cinq mentions de L. 2242-11. Un accord non conforme ne fait
  pas écran : le supplétif reprend.
- Le régime n'est **indéterminé** que si la question n'a pas de réponse ou si
  l'accord annoncé n'est pas joint. Un silence n'est pas un « non ».

En amont : **sans section syndicale d'organisation représentative, rien n'est
dû** (L. 2242-1). Le module le dit et s'arrête — c'est un « sans objet »
documenté, pas un feu vert.

## Ce que le module ne fait pas

La loi oblige à **négocier**, pas à conclure. Aucun contrôle ne rend « non
conforme » au motif qu'aucun accord n'a été signé. L'échec loyal se formalise
par un procès-verbal de désaccord, déposé (L. 2242-5, R. 2242-1) — c'est cela
qui se contrôle. Et le contrôle d'exposition aux sanctions (NAO-CTL-PEN-01) ne
rend **jamais** « conforme » : les pénalités de L. 2242-7 (salaires — jusqu'à
10 % puis 100 % des exonérations de cotisations) et L. 2242-8 (égalité — 1 %
des rémunérations) sont fixées par l'administration selon les efforts
constatés ; un blanc-seing serait faux.

## Les seize contrôles

Régime (2) · périodicités des quatre thèmes (4) · demande syndicale — huit et
quinze jours (1) · loyauté — première réunion, conditions de dépôt d'un accord
salaires, décisions unilatérales pendant négociation (3) · issue et dépôts (1) ·
égalité — plan d'action supplétif, couverture et index (2) · contenu des
négociations rémunération et égalité (2, en risque jamais en non-conformité) ·
exposition aux sanctions (1, jamais conforme).

Cinq états : conforme, non conforme, risque à vérifier, donnée manquante, sans
objet. Une donnée non renseignée ne produit jamais « conforme ».

## Les textes

25 articles lus au relais Légifrance, chacun avec son identifiant `LEGIARTI…`
(`textes-nao.json`). La capture a rencontré l'homonyme prévu par la règle du
dépôt : `R. 2242-1` servi depuis le code des collectivités territoriales
(testaments en faveur des communes), puis depuis un autre code encore, avant
deux lectures concordantes de l'article du code du travail
(`LEGIARTI000036222825`). Le vérificateur (`verifier-textes-nao.js`) classe
désormais ces homonymes à part : ils ne concluent ni à la concordance ni à
l'écart.

## La chaîne de publication

`node publier-nao.js` : tests contradictoires (14 dossiers, tout contrôle
capable de dire « non » l'a dit au moins une fois), non-divergence
questionnaire/contrôles dans les deux sens, propositions vérifiées dans les
deux sens, manifeste avec compteurs mesurés, empaquetage navigateur
(`docs/moteur-nao.js`, page `docs/audit-nao.html`). La publication échoue si un
maillon échoue, si une fiche vide produit une conformité, ou si l'exposition
conclut « conforme ».

## Ce qui reste ouvert

- **Les pénalités ne sont pas chiffrées** : le module dit l'exposition et ses
  plafonds, jamais un montant — l'administration le fixe selon les efforts
  constatés.
- **Le contenu des accords signés n'est pas audité** : le module vérifie que
  les thèmes légaux ont été mis sur la table, pas ce qui en est sorti.
- **La BDESE nourrit la négociation** (L. 2242-17 renvoie à L. 2312-36) : le
  lien avec le module BDESE est documentaire, pas encore croisé dans les
  contrôles.
