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

| parcours | étapes | documents |
|---|---|---|
| registre du personnel | 8 | 0 |
| entretiens professionnels | 9 | 0 |
| embauche | 10 | 0 |
| congés payés | 9 | 0 |
| fin de contrat | 9 | 0 |

Deux autres sont presque vides : `affichages` (1 document pour 10 étapes) et
`index` (1 pour 9).

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

Aucune de ces quatre n'est corrigée à cette heure : les articles n'ont pas
encore été relus à la source, et rien ne se corrige avant.

## Corrigé

- `commissions/c10`, la commission des marchés — condition ajoutée le
  1er septembre 2026, avec la question qui la commande. Les trois critères de
  D. 2315-29 portent sur les comptes du comité, non sur l'effectif de
  l'entreprise (L. 2315-44-1, lu à la source le 1er septembre 2026).
