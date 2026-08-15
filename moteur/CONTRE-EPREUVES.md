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
