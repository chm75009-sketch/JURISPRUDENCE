# Le profil d'entreprise partagé — format d'échange « profil-entreprise », version 1

Deux applications, un seul client, les mêmes questions. **JURISPRUDENCE**
diagnostique et fonde : quelles obligations pèsent sur l'entreprise, quels
articles les portent, quelle jurisprudence les éclaire, dans quel ordre on les
régularise. **JURIS EXPERT** produit : le contrat, le règlement intérieur, le
registre du personnel, les documents des élections professionnelles, les
accords et procès-verbaux de la négociation.

Les deux demandaient la dénomination, le SIRET, l'adresse, l'effectif, le
secteur et la convention collective. Deux fois. Ce document fixe le format qui
met fin au doublon.

## Le principe

**Un fichier, pas un serveur.** Aucune synchronisation, aucun compte, aucune
requête. Le profil descend d'un côté sous la forme d'un fichier `.json` et
remonte de l'autre. Les données restent sur le poste du client, à sa main : il
voit le fichier, il le déplace, il le supprime.

C'est délibéré. Le SIRET, le courriel et le téléphone d'un client sont des
données personnelles ; un serveur commun aurait exigé un traitement, un
responsable et une durée de conservation. Un fichier n'exige rien.

## Le schéma

```json
{
  "format": "profil-entreprise",
  "version": 1,
  "emisPar": "JURISPRUDENCE — audits et parcours",
  "emisLe": "2026-08-22T19:40:12.000Z",
  "entreprise": {
    "denomination": "SARL EXEMPLE",
    "siret": "12345678900012",
    "adresse": "3 rue de la Paix, 75002 Paris",
    "responsable": "Mme Dupont, gérante",
    "courriel": "contact@exemple.fr",
    "telephone": "0123456789",
    "effectif": "62",
    "secteur": "transport et logistique",
    "conventionCollective": "0016 — transports routiers",
    "groupe": "non",
    "etablissementsDistincts": "oui",
    "nbEtablissements": "3"
  }
}
```

### L'enveloppe

| Clé | Type | Obligatoire | Ce qu'elle dit |
|---|---|---|---|
| `format` | chaîne | oui | Vaut toujours `"profil-entreprise"`. Un fichier qui ne le porte pas est refusé. |
| `version` | entier | oui | Vaut `1`. Une version inconnue est **refusée**, jamais interprétée au jugé. |
| `emisPar` | chaîne | non | Le nom de l'application émettrice. Affiché à l'import, sans conséquence. |
| `emisLe` | chaîne | non | Date d'émission, ISO 8601. Informative. |
| `entreprise` | objet | oui | Les douze champs ci-dessous. |

### Les douze champs de l'entreprise

| Clé | Type | Valeurs | Ce qu'elle commande |
|---|---|---|---|
| `denomination` | chaîne | libre | En-tête de tous les rapports, courriers et modèles. |
| `siret` | chaîne | 14 chiffres | Identifie l'établissement. N'est envoyé nulle part. |
| `adresse` | chaîne | libre | En-tête des courriers (convocations, notifications, dépôts). |
| `responsable` | chaîne | libre | Nom et qualité de la personne qui signe. |
| `courriel` | chaîne | courriel | Coordonnée portée sur les documents produits. |
| `telephone` | chaîne | libre | Idem. |
| `effectif` | chaîne numérique | entier ≥ 0 | **Ouvre ou ferme la plupart des obligations** : 11, 20, 50, 250, 300, 1 000 sont des seuils du code du travail. Vide, rien n'est conclu. |
| `secteur` | chaîne | libre, ou l'un de : `transport et logistique`, `industrie`, `bâtiment et travaux publics`, `commerce`, `services` | Oriente la convention et le contenu des modèles. |
| `conventionCollective` | chaîne | libre (IDCC ou intitulé) | Signale où le conventionnel peut ajouter une obligation. |
| `groupe` | chaîne fermée | `oui`, `non`, `en cours`, ou texte libre | Déclenche le comité de groupe. |
| `etablissementsDistincts` | chaîne fermée | idem | Comités d'établissement, comité central, registres par établissement. |
| `nbEtablissements` | chaîne numérique | entier ≥ 0 | Facultatif. |

### Les réponses fermées

`groupe` et `etablissementsDistincts` prennent quatre valeurs :
`oui`, `non`, `en cours`, `autre`. **Seules `oui` et `non` concluent.**
`en cours` et `autre` sont remis aux moteurs comme une donnée absente : le
contrôle rend au mieux « à vérifier », jamais « conforme ». Une réponse hors
cadre peut aussi être un texte libre — elle ne conclut pas davantage.

Tous les champs sont transportés en **chaînes de caractères**, y compris
`effectif` et `nbEtablissements`. C'est le format de saisie des deux
applications ; convertir à l'écriture aurait introduit une divergence là où il
n'y en avait pas.

## Les règles d'import — celles qui comptent

1. **Rien n'est deviné.** Un champ absent du fichier reste absent. Il ne prend
   pas de valeur par défaut.
2. **Un vide n'écrase pas un plein.** Un champ présent mais vide est ignoré :
   importer un profil incomplet ne détruit pas ce qui était déjà saisi.
3. **L'import est une fusion**, pas un remplacement. Les champs que le fichier
   ne porte pas restent tels quels.
4. **Une version inconnue est refusée.** Le fichier n'est pas lu « au mieux » :
   il est rejeté avec un message qui dit pourquoi.
5. **Rien d'autre ne voyage.** Ni réponses d'audit, ni brouillons de documents,
   ni avancement de parcours, ni pièces. Le format ne transporte que
   l'identité de l'entreprise.

## Où c'est écrit

| Dépôt | Fichier | Ce qu'il fait |
|---|---|---|
| JURISPRUDENCE | `docs/profil.js` | `Profil.exporter()`, `Profil.telecharger()`, `Profil.importer(objet)`, `Profil.importerFichier(fichier, apres)`. Les deux boutons sont rendus par `Profil.rendre()` — la fiche client de `audit-social.html`. |
| JURIS EXPERT | `index.html` — page « Paramétrage entreprise » | `jxProfilExporter()`, `jxProfilTelecharger()`, `jxProfilImporter(objet)`, `jxProfilImporterFichier(input)`. Mêmes clés, même version. |

Les alias historiques de JURISPRUDENCE (`denominationSociale`, `entreprise`,
`nom`, `convention`, `idcc`, `activite`, `siege`) sont **lus** mais jamais
écrits dans le fichier d'échange : le format n'expose que les douze clés
ci-dessus.

## Faire évoluer le format

Un champ ajouté qui reste facultatif ne change pas la version : les deux côtés
ignorent ce qu'ils ne connaissent pas, et la règle 1 protège le reste. Un champ
renommé, supprimé, ou dont les valeurs changent de sens **change la version** —
et l'ancien lecteur refusera alors le nouveau fichier, ce qui est le
comportement voulu.

Toute évolution se répercute dans les deux dépôts, dans ce fichier et dans le
commentaire de tête de `docs/profil.js`.

## Ce que JURIS EXPERT ne transporte pas — et pourquoi

Le format est commun ; les deux fiches ne le sont pas. Trois champs restent
volontairement en arrière, parce que les remplir serait supposer.

**L'effectif** n'est exporté par JURIS EXPERT que lorsqu'il est **calculé** par
le registre du personnel. Sa fiche ne connaît sinon qu'une **tranche** — « 50 à
249 salariés ». Écrire `50` parce que la tranche commence à 50 serait inventer
un chiffre que personne n'a saisi. À l'inverse, un effectif exact venu d'ici se
range dans la tranche qui le contient : ce n'est pas une déduction, c'est un
classement plus large d'une donnée plus précise.

**Le secteur** ne s'importe pas dans JURIS EXPERT. Là-bas, un secteur est un
**code** (`transport`, `banque`, `batiment`…) qui commande tout l'affichage ;
ici, c'est un champ à menu avec saisie libre. Reconnaître « transport et
logistique » comme le code `transport` serait une supposition. Le champ est donc
lu, signalé au client, et laissé à son choix. L'export de Juris Expert, lui,
part sous l'intitulé lisible du secteur — que cette application accepte en
saisie libre.

**Le groupe n'est pas la même question des deux côtés.** Ici : « l'entreprise
appartient-elle à un groupe ? ». Là-bas : « entreprise ou groupe d'au moins
1 000 salariés ? ». Une réponse à l'une ne répond pas à l'autre. Rien ne passe
entre elles.

**Ce qui n'est pas repris n'est pas perdu.** Juris Expert conserve à l'identique
les champs qu'il ne sait pas lire et les réémet à l'export suivant : un
aller-retour ne dégrade rien.
