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

## Les dix-sept contrôles

Régime (2) · périodicités des quatre thèmes (4) · demande syndicale — huit et
quinze jours (1) · loyauté — première réunion, conditions de dépôt d'un accord
salaires, décisions unilatérales pendant négociation (3) · issue et dépôts (1) ·
égalité — plan d'action supplétif, couverture et index (2) · contenu des
négociations rémunération et égalité (2, en risque jamais en non-conformité) ·
appui de la négociation égalité sur la BDESE (1) ·
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

**Recapture du 21 août 2026 — quatre articles étaient des homonymes.** La
capture initiale passait au relais l'identifiant `LEGITEXT000006072050` au lieu
du NOM du code. L'identifiant désactive le filtre : la recherche se fait alors
par pertinence, et le relais sert l'article d'un autre code portant le même
numéro. Le dépôt portait ainsi, sous des numéros du code du travail, quatre
articles étrangers :

| Numéro | Ce que le dépôt portait | Le bon article, relu le 21 août 2026 |
|---|---|---|
| `L. 2242-1` | « Le conseil municipal statue sur l'acceptation des dons et legs faits à la commune » (code général des collectivités territoriales, `LEGIARTI000006390466`) | l'obligation quadriennale de négocier, `LEGIARTI000043893962` |
| `L. 2242-6` | le voyage habituel sans titre de transport (code des transports, `LEGIARTI000032285967`) | les conditions de dépôt d'un accord salaires et l'engagement sérieux et loyal, `LEGIARTI000035627858` |
| `L. 2242-7` | l'outrage à un agent d'exploitant de transport (code des transports, `LEGIARTI000030902077`) | la pénalité salaires, `LEGIARTI000035627851` |
| `L. 2242-10` | la diffusion de messages signalant la présence de contrôleurs (code des transports, `LEGIARTI000032284434`) | la négociation ouvrant l'accord de méthode, `LEGIARTI000035627827` |

Les contrôles, eux, énonçaient la bonne règle : c'est le dépôt de textes qui
était faux, non le raisonnement. `capturer-textes-nao.js` et
`verifier-textes-nao.js` passent désormais « Code du travail », et la relecture
du 21 août 2026 rend **25 articles, 25 concordants, 0 écart**.

## La chaîne de publication

`node publier-nao.js` : tests contradictoires (15 dossiers, tout contrôle
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
- ~~La BDESE nourrit la négociation~~ — **croisé** : le contrôle
  NAO-CTL-CON-03 vérifie que la négociation égalité s'est appuyée sur les
  données de la base (L. 2242-17, 2°), et renvoie au module BDESE.

## La jurisprudence rattachée aux contrôles

Décisions lues à la source dans Judilibre le 21 août 2026, réponse non relaxée,
citées pour ce qu'elles disent et rien de plus :

| Décision | Ce qu'elle dit | Contrôles |
|---|---|---|
| Soc., 15 avr. 2026, n° 24-15.653 (publié) | « les négociations obligatoires ne peuvent être considérées comme ayant pris fin avant l'établissement d'un procès-verbal de désaccord » (L. 2242-1, L. 2242-4, L. 2242-5) | `NAO-CTL-UNI-01`, `NAO-CTL-ISS-01` |
| Soc., 3 avr. 2024, n° 22-15.784 (publié) | un accord de droit commun peut définir, dans les entreprises à établissements distincts, les niveaux auxquels la négociation obligatoire est conduite (L. 2242-1, L. 2242-10) | `NAO-CTL-REG-02` |
| Soc., 11 sept. 2024, n° 23-14.333 (publié) | l'obligation de négocier sur la gestion des emplois et des parcours professionnels suppose une ou plusieurs organisations représentatives **au niveau de l'entreprise** | `NAO-CTL-REG-01` |
| 2e Civ., 7 nov. 2019, n° 18-21.499 (publié) | l'employeur est seulement tenu d'engager la négociation annuelle sur les salaires, non de parvenir à un accord, pour bénéficier de la réduction de cotisations de L. 241-13, III, du code de la sécurité sociale | `NAO-CTL-ISS-01`, `NAO-CTL-PEN-01` |

La première décision est celle qui change le plus de choses en pratique : elle
soude l'interdiction des décisions unilatérales (L. 2242-4) au procès-verbal de
désaccord (L. 2242-5). Tant que le procès-verbal n'est pas établi, la
négociation est en cours — et l'employeur ne peut pas décider seul dans les
matières traitées.
