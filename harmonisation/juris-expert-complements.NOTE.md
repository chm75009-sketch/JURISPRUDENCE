# Le second patch pour JURIS EXPERT — ce que JURISPRUDENCE couvrait et lui non

`juris-expert-complements.patch`, dans ce même dossier, s'applique sur le dépôt
`chm75009-sketch/juriste-expert-`, branche `main`, commit **`47240ad`**
(« Cinq parcours guides de plus… »). Vérifié : `git apply --check` passe.

**Il n'a pas été commité ni poussé** : une autre session travaille sur ce dépôt.
L'arbre de travail a été rendu propre (`git status --porcelain` vide,
`git ls-files | grep -ci CONCLUSIONS` = **0**).

Il est **indépendant** du premier patch (`juris-expert.patch`), qui pose le
renvoi vers JURISPRUDENCE et l'échange de fiche entreprise. Les deux se
complètent et ne se recouvrent que sur quatre lignes — voir « Les deux patches
ensemble », plus bas.

```sh
cd /chemin/vers/juriste-expert-
git checkout main && git pull --rebase
git apply /chemin/vers/juris-expert-complements.patch
```

---

## Ce qu'il change — trois fichiers, rien de retiré

| Fichier | Change |
|---|---|
| `index.html` | +384 lignes, aucune suppression |
| `sw.js` | `CACHE` : `jem-v193` → `jem-v194` |
| `version.json` | `v2026-08-21.210` → `v2026-08-23.211` |

`JX_BUILD` et une entrée de tête de `JX_CHANGELOG` sont mis à jour dans
`index.html`, comme l'exige le dépôt.

---

## 1. Six parcours guidés de plus — douze en tout

Ils viennent des douze parcours de JURISPRUDENCE : ce sont exactement les six
que Juris Expert ne portait pas. Rien n'est retouché aux six existants ;
`PARCOURS` reçoit six clés de plus, et `parcListe()` — qui énumère
`Object.keys(PARCOURS)` — les affiche sans un mot de code en plus. C'est la
règle du dépôt : un ajout se pose par classe, pas cas par cas.

| Clé | Titre | Seuil |
|---|---|---|
| `commissions` | Constituer les commissions du comité | 300 (`L.2315-36`, `L.2315-45`) |
| `affichages` | Mettre en place les affichages et informations obligatoires | aucun |
| `registre` | Tenir le registre unique du personnel | aucun |
| `bdese` | Constituer la base de données économiques, sociales et environnementales | 50 (`L.2312-18`) |
| `index` | Calculer et publier l'index de l'égalité professionnelle | 50 (`L.1142-8`) |
| `entretiens` | Organiser les entretiens de parcours professionnel | aucun |

Chacun porte la structure du dépôt sans y déroger : `titre`, `sous`, `seuil`
facultatif, `pre` (le « êtes-vous prêt ? », six à huit éléments nommés, chacun
typé `doc`, `info` ou `piece`), `dates` (les seules à saisir), `etapes` avec
`src` (l'article en clair), `note`, `min` (le seuil propre à l'étape), `ech`
(fonction des dates du dossier) et `doc` vers un générateur **existant**.

**Aucune étape ne renvoie à un générateur qui n'existe pas.** Les boutons
`doc` pointent uniquement vers des types que `ausDoc` sert déjà —
`commissions`, `formelus`, `pvbureau`, `affichages`, `incendie`, `decompte`,
`aviscc`, `entretien`. Les parcours `registre`, `bdese` et le début de `index`
n'en portent pas : Juris Expert n'a pas encore de générateur pour eux, et un
bouton qui ouvrirait un document vide serait pire que pas de bouton. C'est le
seul manque volontaire de ce patch, et il se comble le jour où ces générateurs
existent.

### Ce que ces parcours disent et qui ne se trouvait nulle part dans l'application

* **Commissions** — le seuil de la commission santé-sécurité s'apprécie AUSSI
  par établissement (`L.2315-36`) ; sa composition est d'ordre public
  (`L.2315-39`) ; ni l'expertise ni les attributions consultatives ne se
  délèguent (`L.2315-38`) ; et **la commission des marchés ne suit pas
  l'effectif de l'entreprise mais les comptes du comité** (`L.2315-44-1`,
  `D.2315-29`) — un comité de sept mille salariés dont les comptes restent sous
  les seuils ne la doit pas.
* **Affichages** — le code dit tantôt « afficher » (`D.4711-1`, `R.4227-37`,
  `L.3171-1`), tantôt « informer par tout moyen » (`L.1142-6`, `R.3221-2`,
  `L.1152-4`, `L.1153-5`). Le parcours ne confond pas les deux. Les panneaux
  syndicaux sont **distincts** de ceux du comité (`L.2142-3`).
* **Registre** — un registre par établissement (`L.1221-13`), la partie
  spécifique aux stagiaires, la copie des titres accessible **sur chaque
  chantier** (`D.1221-24`), la mise à jour **au moment où l'événement survient**
  (`D.1221-25`), et l'avis du comité à adresser à l'inspection pour un support
  de substitution (`D.1221-27`).
* **Base de données** — l'accord d'abord (`L.2312-21`), le supplétif ensuite,
  et deux contenus supplétifs distincts selon l'effectif (`R.2312-8` sous trois
  cents, `R.2312-9` au-delà) ; l'accès **permanent** des élus et des délégués
  syndicaux (`L.2312-36`) ; la mise à disposition qui **vaut communication** et
  fait courir le délai d'examen.
* **Index** — les cinq indicateurs de `D.1142-2`, le niveau de résultat de
  `D.1142-3`, la publication au 1er mars de `D.1142-4`, la mise à disposition
  du comité de `D.1142-5`, les mesures de correction **sous soixante-quinze
  points** de `D.1142-6`, le délai de **trois ans** et la pénalité d'un maximum
  de **1 %** des rémunérations de `L.1142-10`, et la publication distincte des
  écarts de représentation à mille salariés (`L.1142-11`).
* **Entretiens** — la version en vigueur de `L.6315-1` lue à la source : un
  entretien dans l'année qui suit l'embauche, puis tous les quatre ans au plus,
  et l'état des lieux récapitulatif **tous les huit ans**. L'entretien ne porte
  **pas** sur l'évaluation du travail : c'est le défaut le plus fréquent des
  trames en circulation. Et l'abondement correctif de `L.6323-13` suppose que
  les DEUX conditions manquent, pas une seule.

---

## 2. Sept obligations de plus à l'audit social — 152 en tout

`AUS_OBLIG` passe de 145 à 152. Ce sont les sept obligations que le référentiel
de JURISPRUDENCE portait et que celui-ci ne portait pas.

| `id` | Intitulé | Source |
|---|---|---|
| `groupecomite` | Comité de groupe | `L.2331-1` |
| `fumer` | Signalisation de l'interdiction de fumer et de vapoter | code de la santé publique — **à vérifier** |
| `egacouv` | Couverture égalité : accord **ou** plan d'action déposé | `L.2242-1, 2°` · `R.2242-2` |
| `psemodule` | Licenciement économique et plan de sauvegarde de l'emploi | page dédiée `pse` |
| `livret` | Livret d'épargne salariale remis à l'embauche | `L.3341-6` |
| `prevcadres` | Prévoyance des cadres | conventionnel — **à vérifier** |
| `ccnrevue` | Revue de conformité à la convention collective | conventionnel — **à vérifier** |

**Ce qui n'a pas été relu à la source le dit en toutes lettres.** Trois de ces
sept items — `fumer`, `prevcadres`, `ccnrevue` — reposent sur des textes que le
relais de JURISPRUDENCE ne sert pas : il ne sert que le code du travail. Leur
champ `src` porte la mention « HORS du code du travail : À VÉRIFIER, rien n'est
affirmé ici », et leur `sanc` reste prudent. Aucun montant, aucun taux, aucun
délai n'y est avancé.

`egacouv` mérite une ligne à part : c'est une **obligation de couverture**, et
elle ne suppose pas de délégué syndical. L'item ne porte donc pas `ds`. Sans
délégué syndical, l'accord est impossible — mais le plan d'action unilatéral
reste dû, et c'est écrit dans la dernière ligne de ses `verif`.

---

## 3. Ce que le patch NE fait PAS

* **Il ne touche à aucun des 145 items existants**, ni aux six parcours
  existants. Pas une ligne retirée.
* **Il n'ajoute aucun générateur de document.** Les six parcours réutilisent
  ceux qui existent, ou n'en proposent pas.
* **Il ne touche pas au renvoi vers JURISPRUDENCE** : c'est l'objet du premier
  patch, `juris-expert.patch`.
* **Il n'ajoute aucun identifiant HTML ni aucune fonction** — d'où un rapport
  `tests/integrite.py` strictement identique à celui d'avant, aux numéros de
  ligne près.

---

## Les deux patches ensemble

Ils ne se recouvrent que sur **quatre lignes de publication** :
`JX_BUILD`, l'entrée de tête de `JX_CHANGELOG`, `version.json` et le `CACHE` de
`sw.js`. Appliqués l'un après l'autre, le second bute sur ces quatre-là.

Deux façons de faire, au choix :

```sh
# a) le plus simple : laisser git recoller
git apply --3way juris-expert.patch
git apply --3way juris-expert-complements.patch
```

```sh
# b) à la main : appliquer les deux avec --reject, puis reprendre les
#    quatre lignes de publication et garder la version la plus haute
git apply --reject juris-expert.patch
git apply --reject juris-expert-complements.patch
# → JX_BUILD et version.json : v2026-08-23.212 ; sw.js : jem-v195 ;
#   les deux entrées de JX_CHANGELOG se gardent, la plus récente en tête.
```

Aucun autre point de friction : le premier patch touche `goPage`, la page
Paramétrage et la fin de `index.html` ; le second touche `AUS_OBLIG` et
`PARCOURS`, qui sont ailleurs.

---

## Les tests, sur l'arbre patché

* **`tests/*.test.js` — les 28 suites Playwright : aucun `ECHEC`.**
  (`accueil`, `auditsoc`, `avocat`, `budgets`, `cdd`, `cloisonnement`, `cse`,
  `cseinst`, `docsortie`, `dossier`, `eco`, `egalite`, `etat`, `familles`,
  `fiche`, `garde`, `harcelement`, `idcc16`, `navigateur`, `nego`, `parcours`,
  `presentation`, `report`, `retour`, `secteur-fuite`, `secteur`, `seuils`,
  `sieges`.) `navigateur.test.js` rend « Erreurs JavaScript sur toute la
  session : 0 ».

* **`tests/integrite.py` : rapport identique à celui d'avant le patch**, aux
  numéros de ligne et à la taille du fichier près. Mêmes fonctions déclarées
  deux fois (aucune de plus), mêmes appels non définis, **aucun `goPage` vers
  une page inexistante** (50 pages déclarées, 48 cibles), **689 ids présents /
  351 interrogés — aucun id manquant**, mêmes deux SMIC en dur, aucune
  injection détectée, mêmes deux écritures `localStorage` en `catch` vide.

  Comme la première fois, le script lit `/home/user/JURISTE-EXPERT-/index.html`,
  chemin absolu en majuscules qui n'existe pas dans cet environnement : il a été
  exécuté via un lien symbolique temporaire, retiré ensuite. **Ce chemin en dur
  mériterait toujours d'être remplacé par un chemin relatif au fichier de
  test** — c'est un changement du dépôt B, et il n'a pas été fait ici.

* **Vérifications fonctionnelles**, en 390×844 et en 1280×900, sur un profil de
  mille salariés :
  * douze parcours dans `PARCOURS`, 152 obligations dans `AUS_OBLIG` ;
  * les sept nouveaux identifiants d'obligation présents, aucun doublon ;
  * les six nouveaux parcours s'ouvrent sur leur « êtes-vous prêt ? », comptent
    nommément ce qui manque, et rendent un contenu substantiel ;
  * **zéro `pageerror`** sur l'ensemble.

* `git ls-files | grep -ci CONCLUSIONS` = **0**.

---

## D'où viennent les articles cités

Tous les articles cités dans les six parcours et les sept obligations sont
**lus à la source** dans le dépôt JURISPRUDENCE, avec leur identifiant de
version `LEGIARTI`, par le relais Légifrance filtré **par le NOM du code**
(« Code du travail »), deux lectures concordantes espacées au minimum, et le
critère de contenu contre les homonymes. Ils vivent dans
`moteur/social/textes-social.json`, `moteur/parcours/textes-parcours.json` et
`moteur/parcours/textes-installation.json` de ce dépôt-ci.

Ce qui n'a pas été lu n'est pas cité : c'est signalé, en toutes lettres, à
l'endroit où il aurait dû l'être.
