# Contre-audit du moteur économique

Contre-audit indépendant conduit le 15 août 2026 sur la version `3f23e80` du moteur
`economique`. Dix-neuf constats, chacun reproduit par une exécution directe des contrôles sur
les deux fiches d'épreuve versées au dépôt — `fiche-nordhavn.json` et `fiche-sologne.json`.

| | |
|---|---|
| Objet | moteur `economique` |
| Version auditée | `3f23e80` — 52 contrôles, 233 règles |
| Dossiers d'épreuve | 2 construits, 6 angles d'attaque |
| Constats | 19 |

Ce document porte sur le moteur d'audit, non sur un dossier de licenciement réel. Il ne
constitue pas une consultation juridique.

---

## 0. État de traitement

Les dix-neuf constats ont été traités entre les commits `9c225be` et `344e42f`. Cette section
n'appartient pas au contre-audit : elle est ajoutée par l'équipe pour que le document reste
lisible une fois les correctifs appliqués.

| Constat | Traitement | Commit |
|---|---|---|
| F-01 seuil de dix sur trente jours | `comptes30j()` dans le moteur ; contrôles `CTL-SEU-01`, `CTL-SEU-02`, `CTL-SEU-03` ; règle `SEU-01` | `9c225be` |
| F-02 refus d'autorisation compté comme autorisation | `CTL-PRT-01` réécrit : sens, date, mention non interprétable | `bcce8db` |
| F-03 poste disponible et supprimé | `CTL-COH-01` | `bcce8db` |
| F-04 poste unique proposé à plusieurs salariés | `CTL-COH-02` | `bcce8db` |
| F-05 critères d'ordre neutralisés à zéro | `CTL-COH-03` | `bcce8db` |
| F-06 périmètre cru sur son étiquette | `CTL-ECO-02` puis `CTL-PCE-03` | `bcce8db`, `344e42f` |
| F-07 cessation d'activité sans contrôle | `CTL-ECO-05`, `CTL-ECO-06` | `124d22f` |
| F-08 procédure collective sans contrôle | `CTL-PCO-01`, `CTL-PCO-02`, `CTL-PCO-03` | `1055e89` |
| F-09 transfert d'entité sans contrôle | `CTL-TRF-01` | `1a3e582` |
| F-10 flux intragroupe jamais vérifiés | `CTL-FRA-01` recalcule l'égalité | `1a3e582` |
| F-11 trois fériés mobiles absents | algorithme de Butcher, onze fériés, drapeau Alsace-Moselle | `56e97e7` |
| F-12 ordre des réunions non trié | tri à l'entrée de `CTL-CSE-04` | `56e97e7` |
| F-13 droit dans le temps contredit | `perimetre()` daté, `si` d'`ECO-1-02` daté, `CTL-TMP-01` | `124d22f` |
| F-14 jour de l'expiration | règle `AVI-01` — l'arbitrage est écrit, non déduit d'un opérateur | `1055e89` |
| F-15 entretien préalable là où la loi en dispense | `entretienDu()`, règle `ENT-01`, `CTL-ENT-01` | `1a3e582` |
| F-16 aucune validation des entrées | `valider.js`, `CTL-VAL-01` | `56e97e7` |
| F-17 impossible de déclarer un néant | auxiliaire `neant()` : champ présent et vide vaut réponse | `bcce8db` |
| F-18 garde-fou aveugle à une notation | `sonde.js` — Proxy sur la fiche, réuni avec l'inspection du code | `11cf196` |
| F-19 couverture non mesurée | compteur `reglesJamaisDeclenchees` publié au manifeste | `11cf196` |

**Un point reste contesté.** F-01 compte les refus de modification dans le total des trente
jours. L'article L. 1233-25, relu à la source, exige qu'*au moins dix salariés* aient refusé :
ces refus déclenchent alors le régime collectif par eux-mêmes, ils ne s'additionnent pas aux
autres licenciements. Le moteur les traite en déclencheur autonome. Les faire entrer dans le
total supposerait de savoir s'ils sont déjà comptés dans `nbLicenciements`, faute de quoi ils
seraient comptés deux fois.

La chaîne au commit `344e42f` compte **236 règles et 68 contrôles**, dont 8 de cohérence et
8 de détection, éprouvés par 73 cas contradictoires.

---

## 1. Ce qui a été mesuré

Deux dossiers ont été construits contre le moteur, selon deux stratégies opposées, puis quatre
séries de sondages ont visé les mécanismes plutôt que les règles.

**NORDHAVN** empile les manquements grossiers — filiale française de 3 500 salariés d'un groupe
de 15 400, 890 licenciements, quatre sociétés étrangères, co-emploi, transfert, fermeture de
site. Le moteur les voit : c'était le résultat attendu, et il est bon.

**SOLOGNE** fait l'inverse, et c'est le test qui compte. Cinquante salariés exactement, tous les
champs renseignés, les neuf pièces versées, datées, versionnées et lues, aucune donnée absente —
et un dossier qui ne survivrait pas à une audience. Les manquements ne vivent que dans les
relations entre champs.

| Mesure sur `3f23e80` | |
|---|---|
| Conformités prononcées sur SOLOGNE | 24 |
| Non-conformités relevées sur le même dossier | 2 |
| Contrôles écartés en « sans objet » | 16 |
| … dont écartés par une seule erreur de seuil | 9 |
| Champs demandés que nul contrôle ne lit | 8 |
| Règles sur 233 jamais exécutées | 18 |

---

## 2. Cinq mécanismes, pas dix-neuf accidents

Corriger dix-neuf symptômes laisse le vingtième apparaître. Chaque constat relève de l'un de ces
cinq mécanismes, et chacun appelle un remède de structure.

### A — Le contrôle lit la présence, la loi vise la substance · 5 constats

Un champ rempli vaut satisfaction. « Autorisation : refus de l'inspecteur du travail » est une
autorisation ; un poste proposé à cinq salariés est cinq offres ; un critère d'ordre à zéro pour
tous est un critère pris en compte.

**Remède** — décomposer les champs dont le sens est porté par du texte libre, et ne jamais
conclure sur une chaîne non typée.

### B — La règle est écrite, le contrôle manque · 4 constats

La cessation d'activité, la procédure collective et le transfert d'entité sont énoncés avec
justesse dans la grille — et rien ne les fait vivre. Deux causes sur quatre et un régime entier
reposent sur des règles que le moteur affiche sans jamais les opposer au dossier.

**Remède** — un compteur de règles jamais exécutées, publié à chaque exécution.

### C — Le calcul ignore une donnée pourtant collectée · 2 constats

Le questionnaire demande, l'employeur répond, le moteur n'écoute pas. Huit champs sont dans ce
cas, dont les deux qui commandent le seuil de dix licenciements.

**Remède** — la vérification symétrique de celle qui existe déjà : un champ demandé et lu par
aucun contrôle doit faire échouer la génération.

### D — Le temps est mal compté · 4 constats

Trois fériés mobiles absents, un tableau de dates jamais trié, et le droit d'aujourd'hui appliqué
à des faits d'hier alors que le moteur sait dire quelle version s'applique.

**Remède** — une seule fonction de calendrier, datée, à laquelle tout renvoie.

### E — Les garanties reposent sur la discipline, non sur la mesure · 4 constats

Le garde-fou de non-divergence déduit les champs lus en cherchant `f.nom` dans le code source.
Une lecture écrite `f["nom"]` lui échappe entièrement.

**Remède** — observer les accès à l'exécution plutôt que les deviner par expression régulière.

---

## 3. Les constats

### F-01 · Bloquant · L. 1233-8, L. 1233-3
**Le seuil de dix licenciements n'est pas recalculé sur trente jours.**

`regimeEco` ne lit que `nbLicenciements`. Les deux autres champs qui composent le total — les
licenciements déjà prononcés dans la fenêtre et ceux consécutifs à un refus de modification —
sont collectés, et ignorés.

```
9 licenciements + 1 dans les 30 jours  →  PETIT_COLLECTIF   pse : false
10 licenciements                       →  GRAND_COLLECTIF   pse : true
```

Sur SOLOGNE, le total réel est de douze. Le moteur retient un petit collectif : **neuf contrôles
basculent en « sans objet »** — les sept du plan de sauvegarde, l'intervalle entre réunions,
l'expertise — et **trois répondent faux** : une réunion exigée au lieu de deux, les
renseignements de L. 1233-10 au lieu de L. 1233-31, un délai d'avis d'un mois au lieu de deux.

Un employeur qui fractionne sort du régime du grand licenciement collectif dans l'outil, alors que
le fractionnement est précisément ce que la règle des trente jours interdit.

**Remède** — compter le volume sur trente jours dans une fonction unique, et lui faire commander
aussi les tranches du délai d'avis. Prévoir le champ manquant pour la règle des trois mois de
L. 1233-26.

### F-02 · Bloquant · L. 2411-1, L. 1233-4
**Un refus d'autorisation est compté comme une autorisation.**

`CTL-PRT-01` vérifie qu'une chaîne est présente dans le champ, ni son sens ni sa date. La fiche
portait deux salariés protégés : l'un avec « 2026-05-12 — refus de l'inspecteur du travail »,
l'autre avec une autorisation datée du 8 juin, soit vingt-trois jours après la notification.

```
CTL-PRT-01  →  conforme
« Les 2 salariés protégés disposent d'une autorisation. »
```

Licencier un salarié protégé malgré un refus est un délit, et le licenciement est nul. C'est la
conformité la plus grave du lot.

**Remède** — décomposer en `sens` — accord, refus, en attente — et `date`, refuser toute
conclusion sur un sens absent, et comparer la date à la notification.

### F-03 · Critique · L. 1233-4
**Un poste est déclaré simultanément disponible et supprimé.**

« Régleur commande numérique » figure dans les postes disponibles de la société auditée et dans
ses postes supprimés, de quatorze à huit. Les deux listes ne sont jamais croisées, et
`CTL-REC-07` conclut que tout poste disponible a été proposé. Proposer au reclassement un poste
dont on démontre par ailleurs la suppression ruine la démonstration de suppression elle-même.

**Remède** — croiser les intitulés des deux listes pour l'entreprise auditée : trois lignes.

### F-04 · Critique · L. 1233-4, D. 1233-2-1
**Un poste unique proposé à cinq salariés compte pour cinq offres.**

Les cinq premières offres de SOLOGNE sont le même poste : même intitulé, même employeur, même
lieu, même rémunération, même classification. Les six mentions obligatoires sont réunies pour
chacune, et `CTL-REC-03` les valide toutes. `CTL-REC-08` compte bien cinq destinataires pour neuf
licenciements. Personne ne compte les postes.

**Remède** — grouper les offres par poste ; au-delà d'un destinataire, exiger les critères de
départage.

### F-05 · Critique · L. 1233-5
**Trois critères d'ordre sur quatre neutralisés à zéro.**

Dans toutes les catégories, les charges de famille, l'ancienneté et la situation sociale valent
zéro pour tous les salariés : seules les qualités professionnelles départagent. Les quatre
critères sont formellement présents et matériellement annulés. Le contrôle ajouté après le
premier audit vérifie que les catégories comptent plus d'un salarié, mais aucun ne regarde si le
barème départage réellement.

**Remède** — signaler tout critère dont la valeur est identique pour l'ensemble des salariés :
un critère qui ne varie pas ne départage rien.

### F-06 · Important · L. 1233-3
**Le périmètre est cru sur son étiquette.**

`CTL-ECO-02` et `CTL-PCE-03` lisent la mention « secteur » portée sur les trimestres et sur la
pièce. La fiche déclare pourtant, par ailleurs, une société sœur française du même secteur,
bénéficiaire, qu'aucun agrégat ne contient. Le contrôle ne peut pas ouvrir le document, et nul ne
le lui demande. Il peut en revanche opposer les déclarations entre elles.

**Remède** — quand le périmètre déclaré est le secteur et que des sociétés françaises de même
activité existent, exiger qu'elles soient nommément couvertes.

### F-07 · Bloquant · L. 1233-3, 4°
**La cessation d'activité n'a aucun contrôle.**

Les causes 1, 2 et 3 ont chacune le leur. Sur un dossier de cause 4, les trois répondent « sans
objet » et rien ne prend le relais. Symptôme révélateur : `cessationComplete` est demandé par le
questionnaire et lu par une seule règle d'affichage. C'est la cause de toutes les fermetures de
site, et le cas décisif — cessation déclarée totale alors que le groupe poursuit la même activité
— n'est pas examiné.

**Remède** — un contrôle vérifiant le caractère total et définitif, et opposant la poursuite
d'activité par une société française du groupe.

### F-08 · Critique · L. 1233-58
**La procédure collective n'est contrôlée par personne.**

La règle `PCO-01` énonce parfaitement le régime — plan mis en œuvre par l'administrateur ou le
liquidateur, consultation selon le seuil applicable. L'inspection du code de chacun des
cinquante-deux contrôles le confirme : **aucun ne lit `procedureCollective`**. Un dossier en
redressement ou en liquidation est donc audité comme un dossier ordinaire, alors que les délais
sont raccourcis et que les ordonnances du juge-commissaire s'intercalent.

**Remède** — conditionner le régime de procédure à `procedureCollective` avant tout autre calcul
de délai.

### F-09 · Important · L. 1224-1
**Le transfert d'entité n'est contrôlé par personne.**

Même configuration : `TRF-01` énonce que les contrats subsistent et que le licenciement prononcé
à cette occasion se heurte au texte ; aucun contrôle ne lit `transfertEnvisage`.

**Remède** — un contrôle de détection suffit, à condition qu'il porte la mention de revue
professionnelle obligatoire.

### F-10 · Important · L. 1233-3
**Les flux intragroupe sont demandés, jamais vérifiés.**

Le contrôle de détection ajouté après le premier audit compare le résultat déclaré au résultat
reconstitué, mais ne lit jamais les montants de flux. Il ne peut donc pas vérifier que la
reconstitution est arithmétiquement cohérente avec ce qui est déclaré. C'est exactement le
contrôle qui a été fait à la main sur les chiffres du premier dossier — et qui a démasqué des
montants inventés. La machine peut le faire.

**Remède** — pour chaque exercice, vérifier que le résultat d'exploitation augmenté du total des
flux égale le résultat reconstitué ; sinon, la reconstitution est déclarative.

### F-11 · Critique · L. 1233-11, L. 1233-15
**Trois jours fériés mobiles manquent au calendrier.**

La table des fériés ne contient que les huit fêtes à date fixe. Le lundi de Pâques, l'Ascension
et le lundi de Pentecôte en sont absents — les trois seuls fériés mobiles, et tous tombent entre
mars et juin, en pleine saison de ces procédures.

```
+5 jours ouvrables depuis le 1er avril 2026  →  7 avril
attendu : 8 avril — le lundi de Pâques, 6 avril, a été compté
```

Le délai de cinq jours ouvrables entre la convocation et l'entretien est calculé un jour trop
court : une convocation irrégulière sort conforme.

**Remède** — calculer Pâques par l'algorithme de Butcher et en dériver les trois dates. Prévoir
l'Alsace-Moselle, qui ajoute le Vendredi saint et le 26 décembre.

### F-12 · Critique · L. 1233-30, II
**L'ordre des réunions n'est pas contrôlé, et il déplace l'expiration.**

`CTL-CSE-04` prend le premier élément du tableau des réunions comme première réunion, sans le
trier. En listant les dates à l'envers, le délai court depuis la seconde.

```
réunions [16 mars, 31 mars]  →  expiration le 16 mai
réunions [31 mars, 16 mars]  →  expiration le 31 mai
```

Quinze jours gagnés en changeant l'ordre de deux lignes. Les contrôles voisins, eux, trient
correctement : le défaut est isolé.

**Remède** — trier les dates à l'entrée du moteur, une fois, pour tous les contrôles.

### F-13 · Critique · L. 1233-3, ordonnance du 22 septembre 2017
**Le droit dans le temps est diagnostiqué, puis contredit.**

Le moteur identifie correctement les trois versions successives de l'article et annonce, pour une
notification de 2015 : « version avant le 1er décembre 2016, sans définition ni indicateur ».
Puis il applique le droit d'aujourd'hui.

```
notification 2015-06-01, groupe avec une sœur italienne
périmètre retenu : « … établies sur le territoire national »
exclusions : ["ITALIE"]
```

La limitation territoriale date de l'ordonnance du 22 septembre 2017 et n'existait pas ; le seuil
trimestriel chiffré, du 1er décembre 2016. L'outil sait quelle version s'applique et applique
l'autre.

**Remède** — passer la date de notification au calcul du périmètre, et conditionner les règles
issues de 2016 et 2017 à leur entrée en vigueur.

### F-14 · Arbitrage · L. 1233-30, II
**Le jour de l'expiration est traité comme le lendemain.**

Une notification la veille de l'expiration sort non conforme ; le jour même et le lendemain
sortent tous deux en risque à vérifier. C'est défendable — mais le délai expire à la fin de ce
jour-là, et notifier le matin même peut s'analyser en notification prématurée.

**Remède** — ce n'est pas un correctif mais une décision : elle doit être écrite dans la grille
plutôt que de résulter d'un opérateur de comparaison.

### F-15 · Important · L. 1233-38
**L'entretien préalable est calculé là où la loi en dispense.**

Sur douze licenciements dans une entreprise de deux cents salariés dotée d'un comité, le moteur
déroule le calendrier individuel — convocation cinq jours ouvrables avant, notification au plus
tôt sept jours ouvrables après. L'article L. 1233-38 dispense l'employeur des entretiens
préalables dans cette configuration. La règle n'est pas fausse : elle est inapposée. Elle impose
un calendrier individuel dans un régime où la notification est commandée par l'avis du comité et
la décision administrative.

**Remède** — conditionner la règle au régime, et annoncer la dispense plutôt qu'un délai.

### F-16 · Important · intégrité
**Aucune validation des entrées.**

Une date impossible, un effectif négatif, un nombre de licenciements décimal, une date au format
français : rien ne plante — la robustesse est réelle — mais rien n'est signalé, et le moteur rend
des verdicts, dont des conformités, sur des données qui ne peuvent pas exister.

```
dateNotification : "2026-02-30"   →  0 exception, 1 conformité
effectif : -50                    →  0 exception, verdicts rendus
```

**Remède** — un contrôle de recevabilité en tête de chaîne : toute valeur non interprétable
produit « donnée manquante », jamais un verdict.

### F-17 · Important · méthode
**Une fiche ne peut pas déclarer un néant.**

Un tableau vide et une absence de réponse reçoivent le même verdict. « Il n'y a aucun contrat
précaire » et « je n'ai pas répondu » sont indiscernables, et l'employeur n'a aucun moyen de
sortir de la réserve, quoi qu'il fasse.

**Remède** — une valeur « néant » explicite, distincte du vide, produisant une conformité
déclarative assortie de son niveau de preuve.

### F-18 · Bloquant · garantie
**Le garde-fou de non-divergence est aveugle à une notation.**

Le registre déduit les champs lus par un contrôle en cherchant `f.nom` dans son code source. Un
contrôle sonde a été ajouté, lisant le même champ en notation crochets.

```
contrôle chargé et exécuté      : oui
entrées vues par le registre    : []
génération du questionnaire     : code de sortie 0
```

La génération devait échouer : un contrôle lit un champ que personne ne peut renseigner, et rien
ne le signale. La déstructuration est logée à la même enseigne. Ce n'est pas une faute présente
dans le code : c'est une garantie annoncée comme mécanique qui ne tient que par la discipline
d'écriture.

**Remède** — observer les accès à l'exécution — une fiche enveloppée dans un `Proxy` enregistre
ce qui est réellement lu — au lieu de le deviner par expression régulière.

### F-19 · Important · couverture
**La couverture réelle n'est pas mesurée.**

Dix-huit règles sur deux cent trente-trois ne se déclenchent sur aucun des quatre dossiers
existants. Ce n'est pas un défaut en soi — elles attendent des causes et des situations qu'aucune
fiche ne décrit. C'est la mesure exacte de ce qui n'a jamais été exécuté. Et c'est précisément là
que se trouvaient la cessation d'activité et la procédure collective : les deux plus gros trous de
cet audit étaient déjà visibles dans ce chiffre.

**Remède** — publier ce compteur à chaque exécution, au même titre que l'empreinte. Une règle
jamais atteinte par le corpus est une promesse non tenue.

---

## 4. Ce qui tient

Un audit qui ne relève que des fautes ne dit pas où est la valeur. Ces propriétés ont été
attaquées et n'ont pas cédé.

- **L'arithmétique des indemnités est exacte à toutes les bornes.** Rien avant huit mois, due à
  huit mois pile, un quart de mois par année jusqu'à dix ans, un tiers au-delà. Le salaire de
  référence retient le plus favorable des deux modes de calcul.
- **Le barème de L. 1235-3 reproduit le tableau légal exactement**, palier de huit ans et saut
  d'un mois entier à quinze ans compris — les deux irrégularités qu'une reconstitution de mémoire
  manque toujours.
- **Les trois périmètres sont distingués** : secteur national pour la cause, groupe national pour
  le reclassement, groupe sans limite territoriale pour les moyens du plan. C'est la confusion la
  plus fréquente dans ce domaine.
- **Le rapport ne perd rien.** Les cinquante-deux contrôles figurent dans le document produit, les
  non-conformités y sont, et deux exécutions consécutives donnent un résultat rigoureusement
  identique.
- **L'ordre des données n'a aucune influence.** L'inversion de tous les tableaux d'un dossier
  laisse les cinquante-deux verdicts inchangés, et l'ajout d'une pièce n'en dégrade aucun.
- **Aucune entrée hostile ne provoque d'exception.** Dates impossibles, valeurs négatives, types
  inattendus : la chaîne encaisse tout sans jamais s'interrompre.

---

## 5. Ce qui ferait la différence

Trois propriétés que peu d'outils juridiques revendiquent, et qu'aucun ne démontre. Deux sont
déjà acquises ici ; la troisième est à portée.

**Une catégorie de contrôles qui n'existe pas encore.** Onze des dix-neuf constats ont un trait
commun : ce sont des règles portant sur la *relation entre deux champs*, confiées à des contrôles
qui n'en lisent qu'un. Le registre distingue aujourd'hui la conformité et la détection. Il lui
manque une troisième catégorie — la **cohérence** — avec ses propres cas contradictoires. Ce n'est
pas un raffinement : c'est la catégorie dans laquelle tombent les faux conformes, et donc celle qui
décide si l'outil peut être opposé à un contradicteur.

**Une couverture mesurée, non affirmée.** Tous les concurrents annoncent un nombre de règles.
Aucun n'annonce combien d'entre elles ont été exécutées au moins une fois. Publier « 233 règles,
215 exercées, 18 jamais atteintes » à chaque exécution est un argument qu'un acheteur averti ne
peut pas ignorer — et une discipline qui rend impossible l'accumulation de règles décoratives.

**Des garanties exécutées, non devinées.** La chaîne s'impose déjà quatre règles remarquables :
aucune phrase de droit hors de la grille, aucune règle sur un article non lu à la source, jamais
de conformité sur une déclaration seule, et un questionnaire déduit du code. Ces garanties sont sa
valeur défendable. Trois reposent sur une vérification réelle ; la quatrième repose sur une
expression régulière, et le constat F-18 montre ce qu'il en coûte.

---

## 6. Réserves de l'auditeur

Trois erreurs ont été commises au cours de cet audit. Elles figurent ici parce qu'un rapport qui
tait les siennes n'a pas qualité pour relever celles des autres.

**Un décompte faux, et faux dans le sens qui flatte.** Le premier rapport annonçait zéro
conformité sur le dossier NORDHAVN et en concluait que le comportement de la chaîne était
irréprochable. La mesure cherchait le libellé de documentation « conforme au vu des pièces » là où
le champ stocke `conforme`. La chaîne en prononçait neuf, dont une fausse. L'erreur a été signalée
par l'équipe, vérifiée par recomptage, et corrigée.

**Des montants inventés dans une fiche de test.** Les flux intragroupe de deux exercices avaient
été posés sans être dérivables de la fiche : une montée en charge que rien n'énonçait. Les valeurs
étaient internement cohérentes, ce qui est le pire cas — le contrôle croisé passait. La règle qui
s'impose désormais : toute valeur d'un cas de référence est dérivable de la fiche ou porte sa
mention d'hypothèse dans la donnée elle-même.

**Un écart annoncé à tort sur le barème.** La valeur à vingt-neuf ans avait été signalée comme
erronée sur la foi d'une table reconstituée de mémoire. Vérification faite, c'est le moteur qui a
raison : sa courbe reproduit le tableau légal, palier et saut compris.

---

Les huit constats du premier audit, corrigés par les commits `c52897d` et `5edcc18`, ne sont pas
repris ici.
