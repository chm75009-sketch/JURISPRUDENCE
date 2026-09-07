# Épreuve de bout en bout - dix fiches d'entreprise

Chromium piloté, `docs/` servi en local. L'arborescence a été figée avant
l'épreuve parce qu'elle changeait sous d'autres mains pendant les premiers
passages : instantané pris le 7 septembre 2026 à 15 h 24 UTC, commit `9eb277e`.

Les dix fiches, toutes remplies à l'écran (dénomination, effectif, secteur,
convention choisie dans la liste IDCC) :

3 LE PETIT BISTROT SARL (1979) · 9 FORMACTION CONSEIL SAS (1516) ·
11 AUBERGE DES TILLEULS SARL (1979) · 15 BATI RENOV SAS (1596) ·
20 TRANSPORTS MERCIER SARL (0016) · 35 CENTRE FORMATION ALPHA (1516) ·
49 DISTRIGROS SAS (0573) · 50 MECANIQUE VERNET SAS (3248) ·
120 HOTELS DU LITTORAL SA (1979) · 300 INGENIERIE ATLANTIQUE SA (1486).

Les fichiers descendus ont tous été rouverts : 60 fichiers, 10 par module
producteur, aucun vide.

Les sept `controler-*.html` étaient en cours d'écriture par d'autres agents
pendant l'épreuve ; ils ne sont donc pas éprouvés pour eux-mêmes. Seul est
noté ce qui s'est passé quand un module y mène.

---

## 1 · Ce qui empêche d'aller au bout

**Fiches 3, 9, 11, 15, 20, 35, 49, 50, 120, 300**
Écran : `audit.html` - licenciement pour motif économique
Clic : ouverture du module depuis « Attaquer cet audit »
Ce qui s'est passé : aucune question fermée à l'écran. Le module ne commence
par aucune question « Avez-vous… », il n'y a donc rien à répondre « non ».

**Fiches 3, 9, 11, 15, 20, 35, 49, 50, 120, 300**
Écran : `audit-pse.html` - plan de sauvegarde de l'emploi
Clic : répondre « non » à la première question posée, « L'entreprise
appartient-elle à un groupe ? »
Ce qui s'est passé : rien. Aucun document n'apparaît, aucun bouton de l'écran
n'en ouvre un ; l'écran reste un questionnaire de 29 questions.

**Fiches 3, 9, 11, 15, 20, 35, 49, 50, 120, 300**
Écran : `audit-social.html` - le tour complet
Clic : répondre « non » à la première question posée, « Ce niveau d'effectif
est-il atteint depuis au moins douze mois consécutifs ? »
Ce qui s'est passé : rien. Aucun document n'apparaît, aucun bouton de l'écran
n'en ouvre un ; l'écran reste un questionnaire de 17 questions (fiches 3 et 9)
ou 19 questions (les huit autres).

**Fiches 3, 9, 11, 15, 20, 35, 49, 50, 120**
Écran : `audit-sst.html` - santé, sécurité et conditions de travail
Clic : répondre « non » à « Une commission santé, sécurité et conditions de
travail existe-t-elle ? »
Ce qui s'est passé : rien. La question est posée à tous les effectifs, mais la
réponse « non » ne mène nulle part en dessous de 300 salariés ; l'écran reste
un questionnaire de 22 questions. À 300 salariés (fiche 300), la même réponse
ouvre bien le document.

---

## 2 · Ce qui produit un fichier incomplet

**Fiches 3, 9, 11, 15, 20, 35, 49, 50, 120, 300**
Écran : `parcours.html?p=ri&faire=1`, document « Le règlement intérieur, et ses
trois courriers »
Clic : la barre du document, après le « non » de `audit-discipline.html`
Ce qui s'est passé : aucun bouton de téléchargement. Le règlement intérieur
(au nom de l'entreprise) ne s'emporte ni en Word ni en PDF ;
la barre ne propose que « Copier », « Imprimer », « Revenir au modèle » et
« Fermer ».

**Fiches 3, 9, 11, 15, 20, 35, 49, 50, 120, 300**
Écran : `parcours.html?p=installation&faire=1`, document « La désignation du
référent harcèlement par le comité social et économique »
Clic : la barre du document, après le « non » de `audit-cse.html`
Ce qui s'est passé : aucun bouton de téléchargement, mêmes quatre boutons.

**Fiches 3, 9, 11, 15, 20, 35, 49, 50, 120, 300**
Écran : `parcours.html?p=nao&faire=1`, document « Le calendrier des
négociations - l'accord de méthode, ou le calendrier unilatéral »
Clic : la barre du document, après le « non » de `audit-nao.html`
Ce qui s'est passé : aucun bouton de téléchargement, mêmes quatre boutons.

**Fiche 300**
Écran : `parcours.html?p=commissions&faire=1`, document « L'acte fixant les
modalités de la commission : accord de comité ou règlement intérieur »
Clic : la barre du document, après le « non » à la commission santé-sécurité
Ce qui s'est passé : aucun bouton de téléchargement, mêmes quatre boutons.

**Fiches 3, 9, 11, 15, 20, 35, 49, 50, 120, 300**
Écran : `audit-bdese.html`, écran du classeur ouvert par « non »
Clic : « Télécharger en CSV »
Ce qui s'est passé : le fichier descend et s'ouvre (23 053 octets, 80 417 pour
la fiche 300), mais il ne porte nulle part le nom de l'entreprise. Le classeur
`.xlsx` téléchargé depuis le même écran, lui, le porte.

---

## 3 · Le reste

**Fiches 3, 9, 11, 15, 20, 35, 49, 50, 120, 300**
Écran : `audit-social.html`
Clic : ouverture du module
Ce qui s'est passé : pas de question d'entrée « Avez-vous… ». Le module ouvre
sur « Ce niveau d'effectif est-il atteint depuis au moins douze mois
consécutifs ? », suivie de seize à dix-huit autres.

**Fiches 3, 9, 11, 15, 20, 35, 49, 50, 120, 300**
Écran : `audit-pse.html`
Clic : ouverture du module
Ce qui s'est passé : pas de question d'entrée « Avez-vous… ». Le module ouvre
sur « L'entreprise appartient-elle à un groupe ? », au milieu de 29 questions.

**Fiches 3, 9** (comité social et économique), **3, 9, 11, 15, 20, 35, 49**
(base de données, plan de sauvegarde)
Écran : `auditer.html`
Clic : choisir un module marqué « ne vous concerne pas » puis « Attaquer cet
audit »
Ce qui s'est passé : le module s'ouvre quand même et pose toutes ses questions,
alors que la ligne choisie vient d'écrire qu'il ne concerne pas cet effectif.

**Fiches 3, 9, 11, 15, 20, 35, 49, 50, 120, 300**
Écran : `audit-discipline.html`
Clic : répondre « oui » à « L'entreprise s'est-elle dotée d'un règlement
intérieur ? »
Ce qui s'est passé : aucun dépôt du document existant, aucun diagnostic.
L'écran passe de 3 à 27 questions sur le contenu du règlement. La page
`controler-ri.html`, qui prend le document lui-même, existe dans le dépôt mais
aucun lien de ce module n'y mène.

**Fiches 3, 9, 11, 15, 20, 35, 49, 50, 120, 300**
Écran : `audit-sst.html`
Clic : répondre « oui » à « Un document unique d'évaluation des risques
professionnels existe-t-il ? »
Ce qui s'est passé : aucun dépôt, aucun diagnostic ; l'écran passe de 15 à 22
questions. Même chose pour « Une commission santé-sécurité existe-t-elle ? » :
de 22 à 29 questions.

**Fiches 3, 9, 11, 15, 20, 35, 49, 50, 120, 300**
Écran : `audit-cse.html`
Clic : répondre « oui » à « Un comité social et économique est-il en place ? »
Ce qui s'est passé : aucun dépôt, aucun diagnostic ; l'écran passe de 54 à 55
questions (64 à 65 aux fiches 50 et 120, 69 à 70 à la fiche 300).

**Fiches 3, 9, 11, 15, 20, 35, 49, 50, 120, 300**
Écran : `audit-nao.html`
Clic : répondre « oui » à « Avez-vous engagé les négociations obligatoires de
la période en cours ? »
Ce qui s'est passé : aucun dépôt, aucun diagnostic ; le nombre de questions
visibles ne bouge pas (18, 19 ou 21 selon l'effectif).

**Fiches 3, 9, 11, 15, 20, 35, 49, 50, 120, 300**
Écran : `audit-pse.html`
Clic : répondre « oui » à « L'entreprise appartient-elle à un groupe ? »
Ce qui s'est passé : aucun dépôt, aucun diagnostic ; l'écran passe de 29 à 31
questions.

**Fiches 3, 9, 11, 15, 20, 35, 49, 50, 120, 300**
Écran : `audit-social.html`
Clic : répondre « oui » à la première question posée
Ce qui s'est passé : aucun dépôt, aucun diagnostic. Aux fiches 11 à 300, le
nombre de questions ne bouge pas (19 avant, 19 après). Aux fiches 3 et 9, où la
première question visible au retour est « Une section syndicale d'organisation
représentative est-elle constituée ? », l'écran passe de 17 à 18 questions.

**Fiches 3, 9, 11, 15, 20, 35, 49, 50, 120, 300**
Écran : `audit-bdese.html`
Clic : répondre « oui » à « Avez-vous une base de données économiques, sociales
et environnementales ? »
Ce qui s'est passé : mène à `controler-bdese.html`, qui s'affiche mais ne
propose aucun dépôt du document existant (aucun champ de fichier à l'écran).
Cette page était en cours d'écriture pendant l'épreuve.

---

## 4 · Après « non » : ce qui apparaît, et les clics jusqu'au document

Un même résultat sur les dix fiches, sauf mention contraire.

**`audit-discipline.html`** - « L'entreprise s'est-elle dotée d'un règlement
intérieur ? »
Après « non » : la page saute sur `parcours.html?p=ri&faire=1` et le règlement
intérieur s'ouvre par-dessus l'écran. Derrière lui, la page porte 3 ou 4
questions et 11 étapes numérotées.
Clics du « non » au document : **0**.

**`audit-cse.html`** - « Un comité social et économique est-il en place ? »
Après « non » : saut sur `parcours.html?p=installation&faire=1`, la désignation
du référent harcèlement s'ouvre par-dessus l'écran. Derrière : 15 ou 16
questions et 15 à 17 étapes numérotées.
Clics du « non » au document : **0**.

**`audit-sst.html`** - « Un document unique d'évaluation des risques
professionnels existe-t-il ? »
Après « non » : saut sur `parcours.html?p=duerp&faire=1`, l'inventaire des
risques s'ouvre par-dessus l'écran. Derrière : 5 questions et 9 ou 10 étapes
numérotées.
Clics du « non » au document : **0**.

**`audit-nao.html`** - « Avez-vous engagé les négociations obligatoires de la
période en cours ? »
Après « non » : saut sur `parcours.html?p=nao&faire=1`, le calendrier des
négociations s'ouvre par-dessus l'écran. Derrière : 5 questions et 8 à 10
étapes numérotées.
Clics du « non » au document : **0**.

**`audit-bdese.html`** - « Avez-vous une base de données économiques, sociales
et environnementales ? »
Après « non » : la question disparaît, le classeur s'affiche sur place avec ses
deux boutons de téléchargement. L'écran porte 4 champs à côté du classeur
(entreprise, effectif, année, accord), aucune étape numérotée.
Clics du « non » au document : **0**.

**`audit-sst.html`** - « Une commission santé, sécurité et conditions de travail
existe-t-elle ? »
Après « non » : rien ne change, l'écran reste le questionnaire (22 questions).
Clics du « non » au document : **aucun chemin** - fiches 3 à 120.
À la fiche 300 : saut sur `parcours.html?p=commissions&faire=1`, document ouvert
par-dessus un écran de 6 questions et 12 étapes ; **0** clic.

**`audit-social.html`** - « Ce niveau d'effectif est-il atteint depuis au moins
douze mois consécutifs ? »
Après « non » : rien ne change, l'écran reste le questionnaire (17 ou 19
questions).
Clics du « non » au document : **aucun chemin**.

**`audit-pse.html`** - « L'entreprise appartient-elle à un groupe ? »
Après « non » : rien ne change, l'écran reste le questionnaire (29 questions).
Clics du « non » au document : **aucun chemin**.

**`audit.html`**
Aucune question fermée n'est posée : il n'y a pas de « non » à donner.

---

## 5 · Gestion RH du quotidien

Aucun blocage relevé sur les dix fiches. `gerer.html` ouvre trois onglets -
Embaucher, Sanctionner, Licencier. Chacun affiche son document sans clic
supplémentaire, au nom de l'entreprise, et le bouton « Télécharger en Word »
rend un `.docx` qui s'ouvre : contrat à durée indéterminée (18 155 octets),
sanction (4 170 octets), licenciement (8 830 octets), les trois portant la
dénomination saisie sur la fiche.
