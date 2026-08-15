# Les moteurs d'audit

Deux domaines, une même chaîne : le moteur calcule, la grille énonce ce que la
loi exige, les contrôles constatent si la situation décrite y satisfait, les cas
contradictoires vérifient que les contrôles contrôlent quelque chose, et le
document met en forme. Aucune phrase de droit n'est écrite ailleurs que dans la
grille, et aucune règle n'est écrite sur un article qui n'a pas été lu à la
source : le chargement de la grille échoue si un article cité manque.

## Ce que contient chaque module

| | `economique/` | `cse/` |
|---|---|---|
| Domaine | Licenciement pour motif économique, article L. 1233-3 | Comité social et économique, deuxième partie, livre III |
| Articles lus sur Légifrance | 200 | 368 |
| Règles | 232 | 40 |
| Contrôles | 48 dont 6 de détection | 35 dont 3 de détection |
| Cas de contrôle | 44 cas contradictoires | 45 cas moteur + 55 cas contradictoires |
| Corpus de jurisprudence | 474 arrêts publiés dépouillés | 163 arrêts publiés classés sur 11 rubriques |

## Comment l'exécuter

```
cd moteur/economique
node tests.js                  # les cas de référence du moteur
node tests-contradictoires.js  # 44 dossiers construits pour mettre les contrôles en défaut
node publier.js                # manifeste, registre d'exécution, empreintes concordantes
node lancer-audit.js fiche-complete.json
node ../commun/audit.js ./_audit_items.js Audit "Titre"     # le PDF, pagination mesurée
python3 ../commun/word_py.py _audit_items.json Audit.docx "Titre"
```

```
cd moteur/cse
node tests-cse.js              # 45 cas sur les seuils, délais, budgets et la parité
node tests-controles-cse.js    # 55 cas × 35 contrôles = 1925 verdicts
node audit-cse.js fiche-cse.json
node questionnaire-cse.js      # le questionnaire vierge, et son contrôle de non-divergence
node cse_recueil.js            # le recueil de jurisprudence classé
```

## Les règles que la chaîne s'impose

- **Cinq états, jamais un de plus** : conforme, non conforme, risque à vérifier,
  donnée manquante, sans objet. Une donnée non renseignée ne produit jamais
  « conforme » ; une déclaration que rien ne justifie non plus.
- **Les contrôles de détection ne concluent jamais à la conformité.** Un test
  le vérifie sur la source, à chaque exécution.
- **Le questionnaire ne peut pas diverger des contrôles** : la colonne
  « contrôle attendu » est déduite du code des contrôles, y compris pour les
  champs lus indirectement à travers le moteur.
- **Ce que la base ne sait pas faire est écrit, non comblé.** Le calcul de
  parité de l'article L. 2314-30 s'arrête et le dit lorsque l'arrondi
  arithmétique des deux sexes ne retombe pas sur le nombre de candidats : le
  texte ne règle pas ce cas et aucun arrêt publié du corpus ne le tranche.

## Génération des documents

Les `.docx` sont produits par `commun/word_py.py`, avec `python-docx`, jamais
par la bibliothèque JavaScript `docx` : Word refuse les fichiers qu'elle écrit.
Les PDF sont produits par `commun/audit.js`, dont la pagination est mesurée —
chaque titre est localisé en rendant le document tronqué juste après lui et en
comptant les pages. Les numéros annoncés au sommaire sont donc exacts.

## Secrets

Aucune clé n'est écrite dans le code. La clé Judilibre est lue dans un fichier
`.jk` local, hors dépôt. Le secret client PISTE ne vit que dans les variables
d'environnement Netlify.
