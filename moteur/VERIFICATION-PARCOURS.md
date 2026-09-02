# Vérification des quinze parcours — état au 1er septembre 2026

Demandée après la commission des marchés, prescrite à un comité de
soixante-quatorze salariés alors que ses seuils portent sur les comptes du
comité. La question était : le volet « non » est-il complet, efficace et sans
faute ? Ce fichier tient le compte, au fur et à mesure, de ce qui a été
vérifié et de ce qui a été trouvé.

Le contrôle se fait en chargeant `docs/parcours.js` hors navigateur et en
comparant, étape par étape, la condition d'affichage (`si`) aux seuils que
l'étape cite dans son propre texte (`quoi`, `risque`).

## Ce qui est vérifié

**Les documents référencés existent tous.** Les 63 `docProduit` des 152 étapes
renvoient à un générateur enregistré : aucun bouton ne mène à un vide.
140 générateurs chargés depuis les onze fichiers `documents-*.js`.

## Ce qui manque — cinq parcours ne produisent aucun document

Répondre « non » y mène à des étapes qui expliquent, sans rien donner à
signer. C'est la contradiction directe du volet « non » :

| parcours | étapes | documents au 1er septembre | documents au 2 septembre |
|---|---|---|---|
| registre du personnel | 8 | 0 | 1 |
| entretiens professionnels | 9 | 0 | 2 |
| embauche | 10 | 0 | 3 |
| congés payés | 9 | 0 | 2 |
| fin de contrat | 9 | 0 | 2 |

**Aucun parcours n'est plus sans document.** Les quinze en produisent
soixante-treize, tous rattachés à un générateur existant.

Deux autres sont presque vides : `affichages` (1 document pour 10 étapes) et
`index` (1 pour 9).

Trois documents ont été écrits le 1er septembre 2026, dans `docs/documents-rh.js`
(famille RH), articles relus à la source ce jour : le **registre unique du
personnel** avec ses deux parties et ses treize indications complémentaires
(L. 1221-13, D. 1221-23 à D. 1221-25), le **certificat de travail** limité aux
deux seules mentions que le décret autorise (L. 1234-19, D. 1234-6 — ses 3° et
4° sont abrogés), et le **reçu pour solde de tout compte** en double exemplaire
avec la mention du double et le délai de dénonciation de six mois (L. 1234-20,
D. 1234-7). Restent sans document : l'embauche, les entretiens professionnels
et les congés payés.

## Ce qui est fautif — étapes prescrivant un acte non dû

Vingt-deux étapes citent un seuil sans porter la condition correspondante.
Dix-huit sont légitimes : ce sont les étapes dont l'objet EST de vérifier le
seuil (« Déterminer le régime », « Vérifier la périodicité », « La commission
santé-sécurité est-elle obligatoire ? »), ou dont l'obligation ne dépend pas
de l'effectif — l'entretien professionnel est dû dans toute entreprise, le
seuil de cinquante ne commande que l'abondement correctif.

Restent quatre étapes du parcours d'installation du comité, à trancher :

- `i6` — « Désigner les membres de la commission santé, sécurité et conditions
  de travail ». Acte prescrit sans condition, alors que la commission n'est
  obligatoire qu'à partir de trois cents salariés, dans les établissements des
  articles L. 4521-1 et suivants, ou sur décision de l'inspecteur du travail.
- `i7` — « Constituer les autres commissions ». Étape d'orientation vers le
  parcours des commissions ; prescrit à un comité de dix-huit salariés la
  constitution de commissions dont aucune n'est due.
- `i11` — « Ouvrir les budgets ». La subvention de fonctionnement de 0,20 %
  n'est due qu'à partir de cinquante salariés. **À vérifier à la source
  (L. 2315-61) avant de conclure.**
- `i15` — « Engager les formations ». La formation santé-sécurité est due à
  tout élu quel que soit l'effectif ; seule la formation économique suppose
  cinquante salariés. L'étape reste donc due, mais son texte mêle les deux.

Trois d'entre elles ont été corrigées le 1er septembre 2026, articles relus à
la source : `i6` ne s'affiche qu'à trois cents salariés ou sur réponse à la
question ajoutée (L. 2315-36, L. 2315-37), `i7` qu'à trois cents ou en présence
d'un accord (L. 2315-45), `i11` qu'à cinquante (L. 2315-61, 1°). `i15` est
laissée en l'état : la formation santé-sécurité y est due à tout élu quel que
soit l'effectif, seule la formation économique suppose cinquante salariés, et
l'étape reste donc due — c'est son texte qui mêle les deux.

## Sept clients simulés — ce qu'ils voient

Sept profils passés dans les quinze parcours, avec le compte des étapes
visibles pour chacun : 8, 12, 18, 49, 74, 320 et 1 200 salariés.

**Aucun parcours n'est filtré à l'entrée.** Les quinze cartes sont proposées à
tout le monde. Un artisan de huit salariés se voit offrir « Installer le CSE »,
« Tenir une réunion du CSE », « Constituer les commissions du CSE »,
« Constituer la base de données » et « Publier l'index de l'égalité » — aucune
de ces obligations n'existe chez lui : le comité se met en place à onze
(L. 2311-2), les attributions récurrentes dont relève la base ne s'exercent
qu'à cinquante (L. 2312-1, L. 2312-2), et l'index n'est publié que dans les
entreprises d'au moins cinquante salariés (L. 1142-8).

**Onze parcours sur quinze rendent exactement le même nombre d'étapes à huit
salariés et à mille deux cents.** Seuls `ri`, `duerp`, `nao` et `commissions`
varient avec l'effectif.

**Le règlement intérieur est inversé.** Sous cinquante salariés, l'étape « i1 —
Vérifier que vous êtes concerné, et depuis quand » est masquée, et l'employeur
tombe directement sur « i2 — Écrire le règlement intérieur ». C'est le seul
endroit où il fallait dire que le règlement n'est pas obligatoire (L. 1311-2),
et c'est le seul endroit où l'application se tait. Le raccourci ouvert le
31 août 2026 — « non » ouvre aussitôt le document — aggrave le défaut : un
employeur de trente salariés se voit rédiger un règlement qu'il ne doit pas.

**Le parcours d'installation du comité ne varie jamais** : dix-sept étapes de
huit à mille deux cents salariés. L'étape `i11` prescrit d'ouvrir la
subvention de fonctionnement, due de cinquante à moins de deux mille salariés
(L. 2315-61, 1°, lu à la source le 1er septembre 2026) ; `i6` prescrit de
désigner la commission santé-sécurité, obligatoire à trois cents ; `i7`
renvoie à des commissions dues à trois cents et mille.

**Les moteurs d'audit, eux, connaissent ces seuils.** Le module BDESE répond
« sans objet » sous cinquante salariés en citant L. 2312-1 et L. 2312-2. Ce ne
sont donc pas les seuils qui manquent au dépôt : ce sont les parcours qui
ignorent ce que les moteurs savent déjà.

## Corrigé

- `commissions/c10`, la commission des marchés — condition ajoutée le
  1er septembre 2026, avec la question qui la commande. Les trois critères de
  D. 2315-29 portent sur les comptes du comité, non sur l'effectif de
  l'entreprise (L. 2315-44-1, lu à la source le 1er septembre 2026).
