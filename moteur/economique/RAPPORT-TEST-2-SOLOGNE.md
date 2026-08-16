# Test nº 2 — le faux conforme · dossier SOLOGNE

Audit adverse du moteur `moteur/economique` au commit `3f23e80`, conduit le
15 août 2026. Fiche jointe : `fiche-sologne.json`, rejouable par
`node lancer-audit.js fiche-sologne.json`.

## Ce que ce test cherche, et pourquoi il diffère du premier

NORDHAVN empilait les manquements grossiers : le moteur les a vus, et c'était
attendu — un dossier dont tout manque produit naturellement des « donnée
manquante » et des « non conforme ».

Le mode de défaillance qui compte pour un moteur d'audit est l'inverse : le
**faux conforme**. SOLOGNE est donc construit pour être formellement
irréprochable — chaque champ renseigné, chaque pièce versée, datée, versionnée,
lue, aucune donnée absente — et juridiquement indéfendable. Les manquements ne
vivent que dans les **relations entre champs**. Toutes les valeurs sont
dérivables de la fiche, et chaque hypothèse porte une note dans la donnée
elle-même.

Entreprise de **50 salariés** exactement, **9 licenciements** déclarés, **1**
déjà prononcé dans les trente jours, **2** salariés dont le licenciement est
envisagé après refus d'une modification pour motif économique. Groupe de 1 200
salariés, une société sœur française du même secteur, bénéficiaire.

## Résultat

| État | Nombre |
|---|---|
| **Conforme** | **24** |
| Sans objet | 16 |
| Risque à vérifier | 6 |
| Donnée manquante | 4 |
| **Non conforme** | **2** |

Deux non-conformités sur cinquante-deux contrôles, pour un dossier qui ne
survivrait pas à une audience. Les deux relevées sont justes — une pièce
postérieure à la notification, et quatre salariés sans offre — mais elles ne
touchent pas ce qui rend ce dossier irrégulier.

---

## 1. La faute mère : le seuil de dix n'est pas recalculé

`moteur.js`, `regimeEco` :

```js
function regimeEco(f) {
  const n = f.nbLicenciements, e = f.effectif;
```

Seul `nbLicenciements` est lu. `licenciementsRecents30j` et `refusModification`
sont collectés par le questionnaire, qui annonce pour le premier : *« Recalcule
le régime sur le total des trente jours »*. Ce recalcul n'existe pas.

Vérifié directement :

```
9 licenciements + 1 déjà prononcé dans les 30 jours → PETIT_COLLECTIF | PSE : false
8 licenciements + 2 refus de modification          → PETIT_COLLECTIF
10 licenciements                                    → GRAND_COLLECTIF | PSE : true
```

Le total réel est ici de **12** sur trente jours : neuf licenciements envisagés,
un déjà prononcé, et deux refus de modification — un refus de modification pour
motif économique suivi de licenciement est lui-même un licenciement économique
au sens de L. 1233-3, et se compte donc dans le total. *(À ne pas confondre avec
L. 1233-25, qui vise le cas distinct où les refus atteignent dix à eux seuls.)*

**Effet mesuré : neuf contrôles neutralisés et trois réponses fausses.**

| Contrôle | Ce que le moteur répond | Ce qu'il devrait répondre |
|---|---|---|
| CTL-PSE-01 à 07 | « Aucun plan n'est dû » ×7 | plan de sauvegarde de l'emploi obligatoire |
| CTL-CSE-02 | « Régime sans intervalle imposé » | quinze jours au moins entre les deux réunions |
| CTL-CSE-09 | « Hors du régime où l'expertise est usuelle » | expertise possible, avec effet sur le calendrier |
| CTL-CSE-01 | « 2 réunions tenues, le régime en exige 1 » | le régime en exige deux |
| CTL-CSE-03 | réclame les sept renseignements de **L. 1233-10** | ceux de **L. 1233-31**, plus le plan |
| CTL-CSE-04 | délai d'avis « un mois » | deux mois |

Un employeur qui fractionne — neuf aujourd'hui, un la semaine passée, deux par
refus de modification — sort de la procédure du grand licenciement collectif
dans l'outil, alors que le fractionnement est précisément ce que la règle des
trente jours interdit.

**Correctif**

```js
/* Le seuil se compte sur trente jours, licenciements déjà prononcés et
   licenciements consécutifs à un refus de modification compris. */
function volumeTrenteJours(f) {
  return (f.nbLicenciements || 0)
       + (f.licenciementsRecents30j || 0)
       + (f.refusModification || 0);
}

function regimeEco(f) {
  const n = volumeTrenteJours(f), e = f.effectif;
  …
}
```

Le même `n` commande les tranches du délai d'avis (moins de 100, 100 à 249,
250 et plus) : elles portent sur le nombre de licenciements envisagés, non sur
le seul champ déclaré.

**Reste à couvrir** : L. 1233-26 — plus de dix licenciements sur trois mois
consécutifs sans jamais atteindre dix sur trente jours soumet tout nouveau
licenciement des trois mois suivants à la procédure des grands licenciements.
Il y faut un champ `licenciements3mois`.

**Cas contradictoires à ajouter** : 9 + 1 → doit produire un régime de grand
licenciement collectif ; 8 + 0 + 2 refus → idem ; 9 + 0 + 0 → petit collectif.

---

## 2. Les faux conformes de fond

Chacun de ces contrôles vérifie la **présence ou la forme** d'une donnée là où
la loi porte sur son **contenu**. Tous sortent « conforme ».

### 2.1 — `CTL-PRT-01` : un refus d'autorisation vaut autorisation

> « Les 2 salariés protégés disposent d'une autorisation. »

La fiche porte :

```json
{"nom":"R02","mandat":"membre du CSE","autorisation":"2026-05-12 — refus de l'inspecteur du travail"}
{"nom":"M01","mandat":"délégué syndical","autorisation":"2026-06-08"}
```

La première est un **refus**. La seconde est **postérieure de vingt-trois jours
à la notification** du 16 mai. Le contrôle teste qu'une chaîne est présente, ni
son sens ni sa date. C'est la conformité la plus grave du lot : licencier un
salarié protégé malgré un refus d'autorisation est un délit, et le licenciement
est nul.

**Correctif** — décomposer le champ en `sens` (accord / refus / en attente) et
`date`, et vérifier les deux :

```js
const K = { accord:"accord", refus:"refus", attente:"en attente" };
f.salariesProteges.forEach(s => { … });
// refus            → non conforme, mention du délit
// date > notification → non conforme
// sens absent      → donnée manquante, jamais conforme
```

### 2.2 — `CTL-REC-07` : un poste à la fois disponible et supprimé

> « Tout poste disponible a été proposé, ou son exclusion est motivée. »

`postesDisponibles` contient « Régleur commande numérique » chez la société
auditée, quand `postesSupprimes` porte le même intitulé, de 14 à 8. Les deux
listes ne sont jamais croisées. Proposer au reclassement un poste qu'on déclare
supprimer ruine la démonstration de suppression.

```js
const supprimes = new Set((f.postesSupprimes||[]).map(p => p.intitule));
const contradictoires = (f.postesDisponibles||[])
  .filter(p => p.societe === f.entreprise && supprimes.has(p.intitule));
```

### 2.3 — `CTL-REC-03` : un poste unique proposé à cinq salariés

> « Toutes les offres comportent les mentions exigées… »

Exact. Mais les cinq premières offres sont **le même poste** — même intitulé,
même employeur, même lieu, même rémunération, même classification. Cinq
salariés se disputent une place, et l'outil compte cinq offres régulières.
`CTL-REC-08` compte bien cinq destinataires pour neuf licenciements, mais
personne ne compte les **postes**.

```js
const parPoste = {};
f.offresFaites.forEach(o => {
  const cle = [o.intitule, o.employeur, o.lieu].join("|");
  (parPoste[cle] = parPoste[cle] || []).push(o.salarie);
});
// un poste proposé à plusieurs salariés → risque à vérifier, avec les critères
// de départage exigés par l'article D. 1233-2-1 en cas de liste
```

### 2.4 — `CTL-ORD-02` : trois critères sur quatre neutralisés à zéro

> « 3 catégories professionnelles, toutes de plus d'un salarié. »

Le contrôle que vous avez ajouté après le test nº 1 fait son travail. Mais dans
toutes les catégories, `charges`, `anciennetePoints` et `social` valent **zéro
pour tous les salariés** : seules les qualités professionnelles départagent.
Les quatre critères de L. 1233-5 doivent tous être pris en compte ; ils sont ici
formellement présents et matériellement annulés.

```js
const criteres = ["charges","anciennetePoints","social","qualites"];
const tous = f.categories.flatMap(c => c.salaries || []);
const inertes = criteres.filter(k => tous.every(s => (s[k] || 0) === 0));
// inertes.length ? non conforme, en les nommant : un critère dont la valeur est
// identique pour tous ne départage rien
```

### 2.5 — `CTL-ECO-02` et `CTL-PCE-03` : l'étiquette tient lieu de contenu

> « Les données produites portent sur le secteur d'activité du groupe. »
> « Les comptes du groupe couvrent le périmètre "secteur d'activité du groupe". »

Les deux contrôles lisent la mention `perimetre: "secteur"` portée sur les
trimestres et sur la pièce. Or la fiche déclare par ailleurs une société sœur
française du **même secteur**, SOLOGNE OUTILLAGE, dont `autresElements` indique
qu'elle dégage +1 780 k€ — et aucun agrégat ne la contient. L'étiquette dit
« secteur », le contenu est celui de la seule filiale.

Le contrôle ne peut pas ouvrir le PDF, et ce n'est pas ce qu'on lui demande. Il
peut en revanche opposer les déclarations entre elles :

```js
// sociétés françaises dont l'activité recoupe celle de l'entreprise auditée
const secteurFr = (f.societes||[]).filter(s => !s.etranger && memeSecteur(s, f));
// si le périmètre déclaré est « secteur » et que ces sociétés existent, exiger
// que la pièce le dise et que les agrégats les couvrent → risque à vérifier
```

Un champ `societesDuSecteur` renseigné par l'employeur rendrait la vérification
directe plutôt qu'inférée.

---

## 3. Une fiche ne peut pas déclarer un néant

Mes quatre « donnée manquante » viennent toutes de **déclarations de vide** :

| Champ | Valeur déclarée | Verdict |
|---|---|---|
| `precaires` | `[]` | donnée manquante |
| `salariesSuspendus` | `[]` | donnée manquante |
| `usagesEtEngagements` | `""` | donnée manquante |
| `contentieuxEnCours` | `""` | donnée manquante |

« Il n'y a aucun contrat précaire » et « je n'ai pas répondu » reçoivent la même
réponse. C'est prudent, et cohérent avec votre principe — mais l'employeur n'a
alors **aucun moyen** de sortir de la réserve, quoi qu'il fasse. Il faut une
valeur `"néant"` explicite, distincte du vide, qui puisse produire une
conformité déclarative assortie de son niveau de preuve.

---

## 4. Ce que le test n'a pas pu exercer

Deux bornes que j'avais posées sont restées **masquées par la faute nº 1** :

- notification fixée au **jour exact** de l'expiration du délai d'avis — le
  moteur ayant retenu un délai d'un mois au lieu de deux, la comparaison de
  bord n'a jamais eu lieu ;
- quinze jours **pile** entre les deux réunions — `CTL-CSE-02` est sorti « sans
  objet ».

Elles méritent d'être rejouées une fois le recalcul du seuil corrigé : l'égalité
stricte est le cas où les comparaisons `<` et `<=` se distinguent.

---

## 5. Récapitulatif

| # | Anomalie | Portée | Effort |
|---|---|---|---|
| 1 | Seuil de dix non recalculé sur trente jours | 9 contrôles neutralisés, 3 réponses fausses | faible |
| 2.1 | Refus d'autorisation compté comme autorisation | nullité et délit non détectés | faible |
| 2.2 | Poste à la fois disponible et supprimé | non détecté | très faible |
| 2.3 | Un poste unique proposé à plusieurs salariés | non détecté | faible |
| 2.4 | Critères d'ordre à zéro pour tous | non détecté | très faible |
| 2.5 | Périmètre cru sur l'étiquette | non détecté | moyen |
| 3 | Impossible de déclarer un néant | réserve inextinguible | faible |
| 4 | Bornes non exercées | à rejouer après le nº 1 | — |

Le point 1 conditionne tous les autres : tant qu'il tient, un dossier peut
sortir du régime du grand licenciement collectif en déclarant neuf licenciements
au lieu de douze. Les points 2.1 à 2.4 se traitent en quelques dizaines de
lignes chacun.

L'architecture n'est toujours pas en cause. Ce qu'ils ont en commun est autre
chose : ce sont tous des contrôles qui lisent **un champ** là où la règle porte
sur **la relation entre deux champs**. C'est peut-être la catégorie à ajouter au
registre — des contrôles de cohérence, distincts des contrôles de conformité et
des contrôles de détection.
