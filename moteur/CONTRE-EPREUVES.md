# Contre-épreuves externes

Deux suites écrites depuis une session d'audit indépendante, à partir des
contre-audits du 15 août 2026. Elles n'ont qu'une raison d'être : **échouer tant
qu'un constat n'est pas corrigé, passer ensuite.**

```
cd moteur/economique && node tests-externes.js       # 20 épreuves, 19 rouges
cd moteur/cse        && node tests-externes-cse.js   # 18 épreuves, 13 rouges
```

Chaque épreuve porte la référence du constat (`F-01`… pour l'économique,
`C-01`… pour le CSE) et énonce le **comportement attendu**, jamais celui
observé. Le détail affiché en cas d'échec est la mesure réelle, reproductible.

Les épreuves marquées `tenu` passent aujourd'hui : elles verrouillent des
propriétés déjà acquises — exactitude du tableau de R. 2314-1 contre le texte
moissonné, remise à zéro du seuil des douze mois, refus d'une alternance
irrégulière à proportion exacte, signalement de l'arrondi indéterminé de
L. 2314-30. Une correction qui les ferait tomber serait une régression.

Rien d'autre n'a été modifié dans le dépôt : ces deux fichiers s'ajoutent, ils
ne remplacent rien.

Rapports détaillés :
- moteur économique — https://claude.ai/code/artifact/d60ad8b8-b86d-45d6-9141-5e971dc46722
- module CSE — https://claude.ai/code/artifact/8df141cb-5341-4448-8ae7-fba5537ea678

## Deuxième série — 16 août 2026

Trois constats nouveaux, un instrument nouveau, une contre-épreuve retirée.

**F-19 — deux règles se contredisent dans le même rapport.** Sur le dossier
Sologne, la grille tire simultanément `SOC-08` (« Plan de sauvegarde de
l'emploi : non dû ») et `PRO-01` (« Régime recalculé sur 10 licenciements :
10 licenciements ou plus, entreprise d'au moins 50 salariés »). Le moteur
connaît la bonne règle, l'énonce, et laisse la conclusion contraire à côté
d'elle. Il manque une préséance entre règles concurrentes.

**C-09 — des contrôles lisent des champs que nul ne peut renseigner.**
`CSE-CTL-EXP-01` lit `expertise.partEmployeur` ; les dossiers déclarent
`expertise.employeur`. Sur un dossier où la part est renseignée à 100 %,
l'application répond « Part employeur non renseignée » : elle impute au client
une omission qui n'en est pas une. Deux autres chemins sont dans le même cas :
`expertise.dateDepart` et `consultation.expertisesCentraleEtEtablissement`.

**C-10 — mesure d'ensemble.** Six manquements sont plantés dans le dossier
Lorraine, tous vérifiables par recoupement de champs versés. L'application en
relève un. La contre-épreuve n'impose aucun contrôle particulier : elle fixe le
résultat attendu de l'ensemble, au moins quatre.

**Instrument — `commun/sonde-chemins.js`.** Enveloppe le dossier dans un `Proxy`
et enregistre les chemins réellement lus à l'exécution, puis les confronte à ce
que les dossiers fournissent. C'est ainsi que C-09 a été trouvé : la déduction
par expression régulière ne pouvait pas le voir.

    node moteur/commun/sonde-chemins.js cse
    node moteur/commun/sonde-chemins.js economique

**Correction d'une erreur de l'auteur.** La contre-épreuve F-01 visait
`regimeEco` prise isolément et concluait que le moteur ignorait la règle des
trente jours. C'était mal viser : `trenteJours` et `PRO-01` l'appliquent
correctement. Une seconde contre-épreuve, qui exigeait que huit licenciements
plus deux refus de modification fassent dix, a été retirée : l'article
L. 1233-25 ouvre le régime collectif « lorsqu'au moins dix salariés ont refusé »,
et le seuil de dix refus comme déclencheur autonome — ce que fait le moteur —
est la lecture littérale. Une contre-épreuve ne doit pas imposer au moteur une
lecture incertaine du texte.

**Propriétés vérifiées et désormais verrouillées.** Les deux moteurs sont
déterministes : deux exécutions du même dossier rendent des verdicts
identiques, et aucun contrôle ne recourt à l'horloge ni au hasard.
