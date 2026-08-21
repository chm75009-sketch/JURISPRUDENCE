# Module « parcours guidés »

Une couche opératoire au-dessus des audits. L'audit dit ce qui ne va pas ; le
parcours dit **quoi faire**, dans quel ordre, pour quand, et avec quel document.

Page : `docs/parcours.html` + `docs/parcours.js`.
Ce module ne contient pas de moteur : il n'y a rien à calculer qu'une date et une
visibilité, et cela tient dans la page. Ce qu'il contient, c'est **la preuve des
textes** — la seule chose qui ne doit jamais être écrite de mémoire.

## Les six parcours

| clé | parcours | étapes | audit de contrôle |
|---|---|---|---|
| `sanction` | Sanctionner un salarié | 9 | `audit-discipline.html` |
| `nao` | Conduire les négociations obligatoires | 10 | `audit-nao.html` |
| `commissions` | Constituer les commissions du CSE | 14 | `audit-cse.html` |
| `reunion` | Tenir une réunion du CSE | 9 | `audit-cse.html` |
| `ri` | Établir ou mettre à jour le règlement intérieur | 11 | `audit-discipline.html` |
| `duerp` | Mettre à jour le DUERP | 10 | `audit-sst.html` |

Chaque parcours porte quatre choses : un **préalable** cochable (« êtes-vous
prêt ? ») dont ce qui reste décoché est repris nommément ; des **données du
dossier** — les seules dates dont les délais dépendent ; des **étapes** ordonnées
avec fondement, jurisprudence, échéance calculée et document à produire ; un
**état** enregistré dans `localStorage` sous la clé `parcours-etat`.

## Les textes

`capturer-textes-parcours.js` → `textes-parcours.json` (**120 articles
confirmés**, 0 non confirmé) et `textes-parcours-non-confirmes.json`.
`verifier-textes-parcours.js` → `verification-textes-parcours.json` relit tout.

Règles appliquées, telles que CLAUDE.md les pose :

* filtre par **nom du code** (`"Code du travail"`), jamais un `LEGITEXT` — un
  `LEGITEXT` désactive le filtre et la recherche par pertinence sert alors des
  homonymes d'autres codes ;
* **deux lectures espacées concordantes** au minimum, quatre essais au plus ;
* **critère de contenu** : un texte lu qui ne porte pas le fragment attendu n'est
  pas une autre version de l'article, c'est un autre article — il ne conclut
  rien ;
* un article non confirmé **n'entre pas** au référentiel et n'est jamais cité.

Deux homonymes historiques du dépôt ont été redressés au passage. Au jour de la
capture, `moteur/nao/textes-nao.json` servait encore `L. 2242-1` depuis le code
général des collectivités territoriales (`LEGIARTI000006390466`, « Le conseil
municipal statue sur l'acceptation des dons et legs ») et `L. 2242-10` depuis un
autre code. Sous le filtre par nom du code, les deux rendent l'article du code du
travail : `LEGIARTI000043893962` (« Dans les entreprises où sont constituées une
ou plusieurs sections syndicales… ») et `LEGIARTI000035627827`. Ce sont les
versions citées par les parcours ; le module NAO a été recapturé en parallèle et
porte désormais les mêmes. `docs/agenda.html` note en tête n'avoir pas pu
confirmer `L. 2242-1` en sept lectures ; le filtre par nom du code l'a confirmé
en deux.

`L. 2315-40` a été retiré de la liste : le relais répond « trouvé : faux » à deux
lectures espacées. Aucune étape ne s'y appuie.

## La jurisprudence

`jurisprudence-parcours.json` — **21 arrêts de la chambre sociale**, lus à la
source par l'API Judilibre le 21 août 2026. Aucune réponse portant `relaxed:
true` n'a été retenue. Le texte conservé est le sommaire publié ; pour les deux
arrêts qui n'en portent pas (n° 24-16.408 et n° 25-12.560), ce sont les motifs
lus dans le texte intégral, recopiés sous le champ `motifs`.

Rattachements principaux :

* commissions — Soc. 27 nov. 2019 n° 19-14.224 (désignation à la majorité des
  présents, sans résolution préalable) ; Soc. 26 févr. 2025 n° 24-12.295 (siège
  du troisième collège, ordre public) ; Soc. 11 févr. 2026 n° 24-16.408
  (L. 2315-39 d'ordre public, pas de désignation proportionnelle) ; Soc. 28 mai
  2026 n° 24-22.914 (pas de remplacement hors L. 2314-33) ; Soc. 13 mai 2026
  n° 25-12.560 (L. 2315-38 d'ordre public : ni consultatif ni expertise) ;
  Soc. 18 mars 2026 n° 23-22.270 (expertise décidée par le comité, le cas échéant
  sur proposition des commissions) ;
* sanction — Soc. 18 janv. 2011 n° 09-43.079 ; Soc. 15 janv. 2013 n° 11-28.109 ;
  Soc. 3 mars 2015 n° 13-23.348 ; Soc. 15 juin 2010 n° 08-45.243 ; Soc. 4 déc.
  2012 n° 11-27.508 ; Soc. 17 janv. 1995 n° 91-43.815 ; Soc. 8 sept. 2021
  n° 19-15.039 ; Soc. 20 mars 2024 n° 22-17.292 ;
* règlement intérieur — Soc. 21 sept. 2022 n° 21-10.718 ; Soc. 23 oct. 2024
  n° 22-19.726 ; Soc. 23 juin 2021 n° 19-15.737 ; Soc. 17 oct. 2018
  n° 17-16.465 ;
* NAO — Soc. 15 avr. 2026 n° 24-15.653 ;
* DUERP — Soc. 25 nov. 2015 n° 14-24.444 ;
* réunion — Soc. 15 janv. 2013 n° 11-28.324.

## L'adaptation au profil

Le profil vit dans `localStorage` sous la clé partagée `profil-entreprise` — la
même que lisent `docs/documents.html`, `docs/audit-social.html` et
`docs/assistant.js`. Jusqu'ici **personne ne l'écrivait** : cette page est la
première à le remplir, et elle y tient à jour `denomination` comme `entreprise`,
les deux noms que les consommateurs existants attendent.

L'affichage conditionnel reprend la mécanique de `docs/audit-form.js` : une étape
ou un item du préalable porte `si(P, D)` qui rend `true` (visible), `false`
(masqué — la question n'a indiscutablement plus d'objet), ou `null` (indéterminé,
donc **visible** : on ne devine pas). La condition reprend la garde de l'article,
jamais une supposition — 300 pour les commissions formation, logement et égalité,
1 000 pour la commission économique, 50 pour le règlement intérieur et le
programme annuel de prévention, 11 pour la mise à jour annuelle du document
unique.

## Le conventionnel

Jamais affirmé. Là où une convention peut ajouter une étape, le parcours affiche
un encart nommant la convention saisie au profil et renvoyant l'utilisateur à son
texte. L'application ne lit aucune convention collective, et ne prétend pas le
faire.

## Les documents

Chaque étape qui produit un écrit renvoie à `documents.html?modele=<clé>&pre=<JSON
encodé>`. La page de documents ouvre le modèle et verse les valeurs **dans les
seuls champs que le modèle déclare**, et **seulement là où le brouillon est
vide** : ce que l'utilisateur a saisi l'emporte toujours.

Cinq modèles ont été ajoutés à `docs/documents.html` pour ces parcours, au
standard du dépôt (structure intégrale, exemple fictif chiffré marqué
« [exemple] », liste des champs à personnaliser) : `mise-en-demeure`, `alerte`
(danger grave et imminent, atteinte aux droits des personnes, alerte économique),
`cr-commission`, `designation-commission`, `resolution-expert`.
