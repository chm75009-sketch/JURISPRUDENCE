# Jurisprudence — recherche Judilibre

Application **autonome** de recherche jurisprudentielle dans la base ouverte des
décisions de justice (Cour de cassation, cours d'appel, tribunaux judiciaires),
via l'[API publique Judilibre](https://www.courdecassation.fr/acces-rapide-judilibre)
de la Cour de cassation.

Une seule page web (`index.html`), sans serveur, sans dépendance : les requêtes
partent directement de votre navigateur vers l'API officielle.

## Fonctionnalités

- **Recherche en texte intégral** : tous les mots (ET), au moins un mot (OU) ou
  expression exacte ; tri par pertinence ou par date.
- **Filtres** : juridictions (Cass. / cours d'appel / tribunaux judiciaires),
  chambres de la Cour de cassation, période, solution (cassation, rejet…),
  décisions publiées au Bulletin.
- **Résultats** : extraits surlignés, numéro de pourvoi, ECLI, solution,
  lien vers la fiche officielle sur courdecassation.fr.
- **Texte intégral** de chaque décision (avec sommaire officiel s'il existe),
  sans quitter la page.
- **Export massif** en CSV (Excel) ou JSON : jusqu'à 10 000 décisions par
  recherche, avec barre de progression.

## Mise en route

### 1. Obtenir une clé API (gratuite)

1. Créez un compte sur [piste.gouv.fr](https://piste.gouv.fr).
2. Créez une **application** en environnement **PRODUCTION**.
3. Modifiez l'application et, dans « Sélectionner les API », cochez
   **JUDILIBRE** (acceptez les CGU), puis appliquez les modifications.
4. Sur la fiche de l'application, section « API Keys », copiez la clé.

### 2. Ouvrir l'application

- **En ligne (recommandé)** : activez GitHub Pages sur ce dépôt
  (*Settings → Pages → Branch: `main`, dossier `/ (root)` → Save*), puis ouvrez
  l'adresse fournie (`https://<votre-compte>.github.io/jurisprudence/`).
- **Ou en local** : téléchargez `index.html` et ouvrez-le dans votre navigateur.

### 3. Première utilisation

Collez votre clé API dans le panneau « Votre clé API Judilibre » puis
« Enregistrer et tester ». La clé est conservée **uniquement dans votre
navigateur** (stockage local) : elle n'est jamais publiée sur GitHub ni envoyée
ailleurs qu'à l'API officielle. Chacun de vos collaborateurs utilise sa propre
clé sur son propre poste.

## Limites utiles à connaître

- L'API limite chaque recherche aux **10 000 premiers résultats** : au-delà,
  affinez avec les dates (l'application vous le signale).
- Les quotas PISTE s'appliquent (l'export ménage l'API avec une pause entre
  les pages).
- Les décisions sont **pseudonymisées** (noms des parties masqués) — open data
  oblige.
- Couverture : Cour de cassation (fonds complet), cours d'appel (progressif,
  surtout depuis 2016-2020), tribunaux judiciaires (en cours de versement).

## Données

Décisions : © Cour de cassation, base Judilibre (open data).
API servie par la plateforme d'État [PISTE](https://piste.gouv.fr).
