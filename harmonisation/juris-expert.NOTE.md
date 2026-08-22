# Le patch pour JURIS EXPERT — ce qu'il fait, et pourquoi il n'a pas été poussé

`juris-expert.patch`, dans ce même dossier, s'applique sur le dépôt
`chm75009-sketch/juriste-expert-`, branche `main`, commit **`47240ad`**
(« Cinq parcours guides de plus… »). Vérifié : `git apply --check` passe.

**Il n'a pas été commité ni poussé** : une autre session travaillait sur ce
dépôt au même moment, et écraser son travail aurait coûté plus cher que
d'attendre. L'arbre de travail a été rendu propre (`git status` vide,
`git ls-files | grep -ci CONCLUSIONS` = **0**).

Pour l'appliquer :

```sh
cd /chemin/vers/juriste-expert-
git checkout main && git pull --rebase
git apply /chemin/vers/juris-expert.patch
```

Si `main` a avancé, le seul point de friction possible est l'insertion dans
`goPage` et l'entrée de tête de `JX_CHANGELOG` — les deux se replacent à la
main en une minute.

---

## Ce que le patch change — quatre fichiers, rien de retiré

| Fichier | Change |
|---|---|
| `index.html` | +356 lignes, aucune suppression |
| `sw.js` | `CACHE` : `jem-v193` → `jem-v194` |
| `version.json` | `v2026-08-21.210` → `v2026-08-22.211` |
| `PROFIL-PARTAGE.md` | nouveau — le schéma d'échange, documenté |

### 1. Le renvoi vers JURISPRUDENCE, sur dix-huit pages

Une table (`JXP`), une fonction (`jxpRenvoi`), **un** appel dans `goPage`.
Pas dix-huit pages retouchées à la main : c'est la règle du dépôt — un défaut
se corrige par classe, et un ajout se pose de même.

Le renvoi est posé **en fin de page** (`pg.appendChild`) : il ne déplace aucun
titre, aucune barre, aucun bouton. C'est ce qui explique que
`presentation.test.js`, qui mesure des pixels sur un écran de téléphone,
reste vert.

Les dix-huit pages et leur cible :

| Page de Juris Expert | Audit de JURISPRUDENCE | Parcours guidé |
|---|---|---|
| `ri` | discipline et règlement intérieur | Établir ou mettre à jour le règlement intérieur |
| `disciplinaire` | discipline et règlement intérieur | Sanctionner un salarié |
| `personnel` | social (41 obligations) | Tenir le registre unique du personnel |
| `embauche` | social | Tenir le registre unique du personnel |
| `auditsoc` | social | — |
| `audit` (contrôle-minute) | social | — |
| `harcele`, `harcprev` | social | Affichages et informations obligatoires |
| `cse` (élections) | comité social et économique | — |
| `cseinst` | comité | Installer le CSE : la première réunion |
| `csereu`, `csercl` | comité | Tenir une réunion du CSE |
| `csebud`, `csefonc`, `csediag` | comité | — |
| `csecns` | base de données (BDESE) | Constituer la base de données |
| `nego` | négociation obligatoire (NAO) | Conduire les négociations obligatoires |
| `pse` | plan de sauvegarde de l'emploi | — |

Les adresses ont été **vérifiées** (réponse 200 sur chacune), pas devinées.
Base : `https://chm75009-sketch.github.io/JURISPRUDENCE/docs/`. Le segment
`/docs/` compte : c'est là que JURISPRUDENCE publie. Le site Netlify de
JURISPRUDENCE, lui, sert encore une version du 11 août et rend 404 sur les
pages profondes — il n'est donc pas cité.

Une page absente de la table ne porte **aucun** renvoi. C'est voulu : on ne
renvoie que là où l'obligation est réellement auditée.

### 2. Les liens « #/module » sont lus

JURISPRUDENCE renvoie ici vers `…/index.html#/ri`, `#/cseinst`, `#/nego`.
L'application ne lisait aucun fragment d'adresse : ces liens ouvraient
l'accueil. `jxpFragment()` le lit désormais **une fois, au chargement**, et
seulement vers une page qui existe.

Le contrôle d'accès n'est pas contourné : le fragment passe par `goPage`
comme n'importe quelle navigation. Sans abonnement, l'écran de code s'affiche
comme avant. Vérifié.

Le fragment n'est **jamais écrit** : la navigation de l'application reste ce
qu'elle était, et une ouverture sans fragment se comporte exactement comme
avant.

### 3. La fiche entreprise s'emporte — format « profil-entreprise » v1

Page **Paramétrage entreprise** : deux boutons, un fichier `.json`. Ni
serveur, ni compte, ni synchronisation. Le schéma est dans
`PROFIL-PARTAGE.md`, identique des deux côtés.

**Ce qui n'est pas déduit — c'est le cœur du sujet :**

* **L'effectif ne part que s'il est CALCULÉ** (`cseEffectif()`, depuis le
  registre du personnel). La fiche ne connaît sinon qu'une **tranche** :
  écrire `50` parce que la tranche commence à 50 serait inventer un chiffre
  que personne n'a saisi. Vérifié à l'essai : avec `E.effectif='50'` et aucun
  registre, le champ `effectif` est **absent** du fichier.
* **À l'import**, un effectif exact se range dans la tranche qui le contient.
  Ce n'est pas une déduction : c'est un classement plus large d'une donnée
  plus précise.
* **Le secteur ne s'importe pas.** Ici c'est un **code** qui commande tout
  l'affichage ; là-bas c'est un texte libre. Reconnaître « transport et
  logistique » comme le code `transport` serait une supposition. Le champ est
  lu, signalé au client (« non repris, pour ne rien supposer »), et laissé à
  son choix. À l'export, le secteur part sous son intitulé lisible — que
  JURISPRUDENCE accepte en saisie libre.
* **Le groupe n'est pas la même question.** Ici : « entreprise ou groupe d'au
  moins 1 000 salariés ». Là-bas : « appartient à un groupe ». Deux questions
  différentes ; rien ne passe de l'une à l'autre.
* **Ce qui n'est pas compris n'est pas perdu.** Les champs non repris sont
  conservés tels quels (`E.profilEchange`) et réémis à l'export suivant : un
  aller-retour ne dégrade rien.
* **Un vide n'écrase pas un plein** : l'écriture passe par `jxEntEcrire(E)`,
  qui fusionne — la garde existante du dépôt, réutilisée telle quelle.
* **Une version de format inconnue est refusée**, jamais interprétée au jugé.

### 4. Publication

`JX_BUILD`, `version.json`, le `CACHE` de `sw.js` et une entrée de
`JX_CHANGELOG` sont à jour, comme l'exige le dépôt.

---

## Les tests, sur l'arbre patché

* **`tests/*.test.js` — les 28 suites Playwright : rc = 0, zéro `ECHEC`.**
  (`accueil`, `auditsoc`, `avocat`, `budgets`, `cdd`, `cloisonnement`, `cse`,
  `cseinst`, `docsortie`, `dossier`, `eco`, `egalite`, `etat`, `familles`,
  `fiche`, `garde`, `harcelement`, `idcc16`, `navigateur`, `nego`, `parcours`,
  `presentation`, `report`, `retour`, `secteur-fuite`, `secteur`, `seuils`,
  `sieges`.)
* **`tests/integrite.py` : rapport identique à celui d'avant le patch**, à
  deux ids près (689 → 691 présents, 351 → 353 interrogés — les deux ids
  ajoutés à la page Paramétrage, tous deux interrogés). Aucune fonction
  déclarée deux fois de plus, aucune fonction appelée et non définie, aucun
  `goPage` vers une page inexistante.

  Détail : le script lit `/home/user/JURISTE-EXPERT-/index.html`, chemin
  absolu qui n'existe pas dans cet environnement (le dépôt y est cloné en
  minuscules) ; il a été exécuté via un lien symbolique temporaire, retiré
  ensuite. **Ce chemin en dur mériterait d'être remplacé par un chemin relatif
  au fichier de test** — mais c'est un changement du dépôt B, et il n'a pas
  été fait ici.

* **Vérifications fonctionnelles**, en 390×844 et en 1280×900 :
  * les 18 renvois se posent (18/18), une page hors table n'en porte aucun ;
  * `#/ri` ouvre le règlement intérieur, `#/cseinst` installe le comité, un
    fragment inconnu retombe sur l'accueil ;
  * export/import : format et version refusés quand ils ne conviennent pas,
    fusion sans écrasement, effectif omis tant qu'il n'est pas calculé.
  * zéro erreur de page (`pageerror`) sur l'ensemble.

* `git ls-files | grep -ci CONCLUSIONS` = **0**.

---

## Ce que le patch NE fait PAS, et qui reste à décider

**Le recouvrement des audits n'est pas traité.** Juris Expert a son propre
audit social (`AUS_OBLIG`, **145 items**) et ses propres parcours guidés ;
JURISPRUDENCE a son référentiel (**41 obligations**, chacune fondée sur des
articles lus au relais avec leur LEGIARTI) et ses **12** parcours. Selon le
partage arrêté — JURISPRUDENCE diagnostique, Juris Expert produit —, ces deux
modules de Juris Expert font doublon avec la fonction de l'autre application.

Les fusionner n'est pas un travail de patch : c'est un arbitrage. Les deux
listes ne se recouvrent pas exactement (145 contre 41), et les 145 items de
Juris Expert couvrent des matières que JURISPRUDENCE n'audite pas encore
(durée du travail, congés payés, CDD, rupture, égalité, RGPD). Le patch se
borne donc à poser, sur ces deux pages, le renvoi vers l'audit fondé — et
laisse la décision à l'utilisatrice.
