# Les moteurs d'audit

Cinq domaines, une même chaîne : le moteur calcule, la grille énonce ce que la
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
| Règles | 236 | 40 |
| Contrôles | 68 dont 8 de cohérence et 8 de détection | 38 dont 2 de cohérence et 3 de détection |
| Cas de contrôle | 73 cas contradictoires | 59 cas moteur + 63 cas contradictoires |
| Corpus de jurisprudence | 474 arrêts publiés dépouillés | 163 arrêts publiés classés sur 11 rubriques |
| Contre-audit versé au dépôt | `economique/CONTRE-AUDIT-MOTEUR-ECONOMIQUE.md` | `cse/CONTRE-AUDIT-MODULE-CSE.md` |

Trois modules ont rejoint la même chaîne, chacun avec son dossier et son
`MODULE-….md` :

- **`pse/`** — le plan de sauvegarde de l'emploi (L. 1233-61 à L. 1233-63) :
  21 contrôles, 22 articles relus, découpage de L. 1233-62 mesuré. Le calibrage
  du plan se calcule et ne se conclut jamais.
- **`bdese/`** — la base de données économiques, sociales et environnementales
  (L. 2312-18 et suivants) : 17 contrôles, 32 articles, couverture des décrets
  R. 2312-8 et R. 2312-9 mesurée à 100 %. Le régime tient en une question :
  accord ou pas.
- **`nao/`** — la négociation obligatoire (L. 2242-1 et suivants) :
  17 contrôles, 25 articles, quatre thèmes et leurs périodicités, exposition
  aux pénalités jamais « blanchie ». Publication : `node publier-nao.js`.

## Comment l'exécuter

```
cd moteur/economique
node tests.js                  # les cas de référence du moteur
node tests-contradictoires.js  # 73 dossiers construits pour mettre les contrôles en défaut
node publier.js                # manifeste, registre d'exécution, empreintes concordantes
node lancer-audit.js fiche-complete.json
node ../commun/audit.js ./_audit_items.js Audit "Titre"     # le PDF, pagination mesurée
python3 ../commun/word_py.py _audit_items.json Audit.docx "Titre"
```

```
cd moteur/cse
node publier-cse.js            # toute la chaîne, puis le manifeste
node tests-cse.js              # 59 cas sur les seuils, délais, budgets et la parité
node tests-controles-cse.js    # 63 cas × 38 contrôles = 2394 verdicts
node audit-cse.js fiche-cse.json
node questionnaire-cse.js      # le questionnaire vierge, et son contrôle de non-divergence
node verifier-textes.js        # relit les 368 articles à la source — demande le réseau
node cse_recueil.js            # le recueil de jurisprudence classé
```

## Les règles que la chaîne s'impose

- **Cinq états, jamais un de plus** : conforme, non conforme, risque à vérifier,
  donnée manquante, sans objet. Une donnée non renseignée ne produit jamais
  « conforme » ; une déclaration que rien ne justifie non plus.
- **Les contrôles de détection ne concluent jamais à la conformité.** Un test
  le vérifie sur la source, à chaque exécution.
- **Le questionnaire ne peut pas diverger des contrôles, dans les deux sens.**
  Tout contrôle doit être alimenté par une donnée demandée, et tout champ qu'un
  contrôle lit doit être demandé — sinon il conclurait sur une donnée que
  personne ne peut renseigner. La colonne « contrôle attendu » est déduite du
  code des contrôles, y compris pour les champs lus indirectement à travers le
  moteur, et la déduction réunit deux mesures indépendantes : l'inspection du
  code, et une sonde qui observe l'exécution — un `Proxy` sur la fiche, qui voit
  les écritures `f["nom"]` et `const {nom} = f` que l'inspection manque. Un écart
  dans l'un ou l'autre sens fait échouer la génération.
- **Une chronologie impossible n'est pas un délai tenu.** Un écart de dates
  négatif, ou calculé sur une date qui n'existe pas, ne produit jamais de
  verdict de conformité : `commun/dates.js` refuse de le rendre.
- **L'article reproduit porte son identifiant de version.** Un article peut être
  modifié sans changer de numéro ; `cse/verifier-textes.js` rejoue la lecture à
  la source et signale tout écart, de version comme de contenu. Relecture du
  15 août 2026 : les 368 articles du dépôt sont ceux de la source, aucun écart.
  Le relais rendant parfois un article homonyme d'une autre partie du code, une
  divergence n'est retenue que si plusieurs lectures espacées la confirment et
  s'accordent entre elles.
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
