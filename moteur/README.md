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
| Articles lus sur Légifrance | 200 | 374 |
| Règles | 236 | 40 |
| Contrôles | 68 dont 8 de cohérence et 8 de détection | 47 dont 2 de cohérence et 3 de détection |
| Cas de contrôle | 73 cas contradictoires | 59 cas moteur + 92 cas contradictoires |
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
  Le dépôt de textes a été recapturé le 21 août 2026 avec le filtre par NOM du
  code : quatre articles étaient des homonymes d'autres codes — L. 2242-1 rendu
  depuis le code général des collectivités territoriales, L. 2242-6, L. 2242-7
  et L. 2242-10 depuis le code des transports.
- **`sst/`** — la santé, la sécurité et les conditions de travail (L. 4121-1
  et suivants, L. 2315-36 et suivants, L. 1152-1 et suivants) : 20 contrôles,
  33 articles dont 14 repris du module CSE, quatre seuils lus à la source
  (11, 50, 250, 300), exposition jamais « blanchie ». La capture a mesuré que
  le filtre de code du relais attend le NOM du code, pas l'identifiant
  `LEGITEXT…` — sans lui, le relais sert l'homonyme d'un autre code.
  Publication : `node publier-sst.js`.
- **`discipline/`** — la discipline et le règlement intérieur (L. 1311-2,
  L. 1321-1 à L. 1321-6, L. 1322-1 à L. 1322-3, L. 1331-1 à L. 1333-3 et leurs
  articles réglementaires) : 25 contrôles, 29 articles dont 8 repris du module
  social, relus à la source sans écart. Premier module côté relations
  individuelles. Le point central est la **garantie de fond** conventionnelle ou
  de règlement intérieur (Soc., 8 septembre 2021, n° 19-15.039 ; Soc.,
  3 mai 2011, n° 10-14.104 ; Soc., 22 septembre 2021, n° 18-22.204 ; Soc.,
  20 mars 2024, n° 22-17.292) : non suivie, elle rend une non-conformité
  motivée ; suivie tardivement ou imparfaitement, un « risque à vérifier » avec
  le critère du juge. L'entretien préalable se décide sur l'INCIDENCE de la
  sanction, pas sur son étiquette. La capture a mesuré que R. 1321-3, R. 1321-5,
  L. 1322-1 et R. 1332-3 ne prononcent pas les mots qu'on attend d'eux : le
  critère de contenu porte sur le renvoi qu'ils font, jamais sur une lecture
  unique. Publication : `node publier-discipline.js`.
  Depuis le 3 septembre 2026, le module porte aussi la **branche « oui »** :
  `controle-ri.js` prend le règlement intérieur déjà en vigueur, le confronte à
  quinze points — huit matières imposées, deux formalités, cinq familles
  prohibées —, rend les passages pour qu'ils soient lus et assemble une version
  corrigée. Le repérage est lexical, et le module refuse pour cette raison tout
  état « conforme » : absent, à vérifier, à contrôler. L'écran est
  `docs/controler-ri.html`, où le `.docx` est lu dans le navigateur.
- **`social/`** — l'audit social chapeau : le référentiel des obligations de
  l'employeur (33 obligations en huit catégories, 34 articles lus au relais en
  lectures doubles concordantes avec critère de contenu), l'assujettissement
  par profil (effectif, ancienneté des seuils, secteur, convention, groupe,
  établissements), le contrôle de l'existant aux cinq états — cocher sans
  détail vérifiable rend « risque à vérifier », jamais « conforme » — et le
  plan d'action du manquant, priorisé, avec modèles pré-remplis des données du
  questionnaire. Douze items renvoient aux modules détaillés (CSE, BDESE, NAO,
  PSE, économique, SST) et n'y concluent jamais « conforme » ; les obligations
  conventionnelles ou hors code du travail sont signalées « à vérifier »,
  jamais affirmées. Publication : `node publier-social.js`.

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
node tests-controles-cse.js    # 92 cas × 47 contrôles = 4324 verdicts
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

## Les commissions du comité, et la règle de lecture des trois étages

Ajouté au module CSE le 21 août 2026, et posé en tête des pages d'audit du
comité, de la NAO, de la santé-sécurité et du panorama social : le droit d'un
domaine se lit à trois étages — ordre public, champ de la négociation,
dispositions supplétives — et la différence tient aux mots de l'article.

- `L. 2315-36` dit « une commission santé, sécurité et conditions de travail
  **est créée** » : aucun accord ne la supprime. Sa composition (`L. 2315-39`)
  et les limites de sa délégation (`L. 2315-38`) sont d'ordre public.
- `L. 2315-49`, `L. 2315-50`, `L. 2315-56` et `L. 2315-46` disent « **en
  l'absence d'accord prévu à l'article L. 2315-45** » : les commissions
  formation, logement, égalité professionnelle (300 salariés) et économique
  (1 000 salariés) ne s'imposent qu'à défaut d'accord.
- Même partage côté NAO : l'accord de méthode (`L. 2242-10`, `L. 2242-11`)
  contre le supplétif de `L. 2242-13`, qui reprend « à défaut d'accord **ou en
  cas de non-respect de ses stipulations** ».

Les contrôles du module CSE suivent ce partage : `CSE-CTL-SST-01` à `-07` pour
la commission santé-sécurité (mise en place, collège réservé, désignation par
résolution, remplacement en cours de mandat, limites de la délégation, source
des modalités, durée de la formation) et `CSE-CTL-COM-01` à `-03` pour les
commissions supplétives, la commission économique et la commission des marchés.
`CSE-CTL-EXP-04` vérifie que la décision de recourir à l'expert est bien celle
du comité.

Les décisions citées dans leurs motifs ont été lues à la source dans Judilibre
le 21 août 2026 (réponse non relaxée) :

| Décision | Contrôles |
|---|---|
| Soc., 27 nov. 2019, n° 19-14.224 (publié) — désignation par vote à la majorité des membres présents, sans résolution préalable | `CSE-CTL-SST-03`, `SST-CTL-CSS-02` |
| Soc., 26 févr. 2025, n° 24-12.295 (publié) — L. 2315-39 d'ordre public, un siège au troisième collège là où il existe | `CSE-CTL-SST-02`, `SST-CTL-CSS-02` |
| Soc., 11 févr. 2026, n° 24-16.408 — rappel du caractère d'ordre public de L. 2315-39 | `CSE-CTL-SST-03`, `SST-CTL-CSS-02` |
| Soc., 28 mai 2026, n° 24-22.914 (publié) — pas de remplacement avant le terme du mandat, hors L. 2314-33 | `CSE-CTL-SST-04`, `SST-CTL-CSS-06` |
| Soc., 13 mai 2026, n° 25-12.560 — L. 2315-38 d'ordre public : ni l'avis ni l'expert ne se délèguent | `CSE-CTL-SST-05`, `CSE-CTL-EXP-04`, `SST-CTL-CSS-04` |
| Soc., 18 mars 2026, n° 23-22.270 (publié) — le comité décide l'expertise, le cas échéant sur proposition de ses commissions (L. 1233-34) | `CSE-CTL-EXP-03`, `CSE-CTL-EXP-04`, `SST-CTL-CSS-04` |

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
