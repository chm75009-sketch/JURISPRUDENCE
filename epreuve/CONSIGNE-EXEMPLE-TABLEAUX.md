# Consigne du 9 septembre 2026 : exemple d'abord, vrais tableaux, liens du secteur

Demande de l'utilisatrice, mot pour mot : « Faire de vrais beaux tableaux et
commencer par un exemple en disant que c'est juste un exemple et le document
doit tenir compte des spécificités de l'entreprise et tu fais ça pour tous les
autres documents, et s'il y a un lien sur ou pour le secteur concerné
(fédération syndicale, service public, etc.) tu mets le lien avec la formule
d'usage. » Et, sur le document unique reçu en Word : « nul, trop léger et très
très mal présenté ».

## Ce que chaque générateur doit rendre, dans cet ordre

`produire(ctx)` rend toujours une chaîne de texte. Elle se compose ainsi :

1. **L'en-tête** existant (dénomination, adresse, SIRET, titre, fondement,
   « Établi le »). Ne pas le changer.
2. **L'exemple**, ouvert par la ligne exacte `DP.EXEMPLE` (la constante
   `DocumentsProduits.EXEMPLE`, qui commence par « EXEMPLE, À ADAPTER : … »).
   Puis le document ENTIÈREMENT REMPLI pour une entreprise fictive cohérente,
   du secteur `ctx.profil.secteur` (cinq valeurs : « transport et
   logistique », « industrie », « bâtiment et travaux publics », « commerce »,
   « services » ; sans secteur, prendre « services »). Noms, postes, dates,
   chiffres, unités de travail, tout est écrit, réaliste, cohérent avec
   `ctx.aujourdhui`. Aucun crochet dans l'exemple. Les tableaux ont de trois
   à six lignes remplies. Utiliser la dénomination du profil si elle existe,
   sinon un nom fictif (« EXEMPLE SARL »).
3. **Le document à compléter**, ouvert par un titre en capitales contenant
   « À COMPLÉTER » (par exemple `VOTRE DOCUMENT, À COMPLÉTER`). Même
   structure que l'exemple, avec les données connues du profil et de la fiche
   là où elles existent, des crochets `[...]` ailleurs, et des tableaux aux
   mêmes colonnes avec trois lignes vides (cellules vides).
4. **Les liens**, par `DP.liens(ctx, ["theme", ...])`, qui rend un tableau de
   lignes à concaténer (`L = L.concat(DP.liens(ctx, ["duerp", "sst"]))`).
   Thèmes disponibles : duerp, sst, cse, bdese, nao, pse, egalite, ri,
   discipline, registre, rh, convention. Choisir ceux du document. La
   fonction ajoute d'elle-même les liens du secteur et de la convention.
   Ne jamais écrire d'autre adresse web : seules celles de ce registre ont
   été vérifiées.
5. **Les règles**, ouvertes par le titre exact `LES RÈGLES` : le texte
   juridique déjà présent dans le générateur (articles cités entre
   guillemets, avec leur numéro), gardé tel quel. On peut couper les
   répétitions et le mode d'emploi devenu inutile ; on ne réécrit pas le
   droit, on n'ajoute aucun article ni aucune affirmation juridique nouvelle.
   Tout ce qui est « CE QUE LE DOSSIER DÉCLARE », « COMMENT SE SERVIR DE CE
   DOCUMENT », « LE TEXTE, EN ENTIER » va ici, pas avant l'exemple.

## Les tableaux

Un tableau s'écrit une ligne par rangée, cellules séparées par ` | `, la
première ligne étant l'en-tête. Exemple :

```
Unité de travail | Risque identifié | Exposition | Mesures existantes | Mesures à prendre | Échéance | Responsable
Quai de chargement | Chute de plain-pied | tous les jours, 6 salariés | sol antidérapant | marquage au sol | 30/11/2026 | chef de quai
```

Pas de ligne de tirets obligatoire (elle est tolérée). Pas d'espaces
d'alignement, pas de caractères de dessin de boîte, pas de `[........]`
pour figurer une colonne. Le module `feuille-doc.js` rend ces lignes en
tableau HTML à l'écran, en tableau Word bordé et en feuille Excel.

Tout tableau en texte à chasse fixe existant est converti à cette forme.

## Interdits et contraintes

- Jamais de tiret cadratin (—) ni demi-cadratin (–), ni dans le texte
  produit, ni dans les commentaires du fichier : virgule, deux-points,
  parenthèses ou trait d'union du clavier.
- JavaScript ES5, comme le reste du fichier (var, function, pas de
  gabarits `${}`), le fichier reste autonome et hors ligne.
- Ne pas renommer d'identifiant (`DP.ajouter("XXX-...")`), ne pas changer
  `nom`, `detail`, ni la signature de `produire` et `tableur`. Une fonction
  `tableur` existante reste ; on y retire seulement les tirets longs.
- Écrire comme on parle à quelqu'un, sans jargon de rapport.
- L'exemple montre la forme et le niveau de détail attendus ; il ne fait
  aucune affirmation de droit qui ne soit déjà dans les règles.

## L'épreuve, obligatoire avant de rendre

```
node epreuve/tester-generateurs.mjs docs/documents-x.js
```

Elle doit finir sur « aucune faute ». Elle vérifie l'ordre EXEMPLE, À
COMPLÉTER, LES RÈGLES, la présence d'un tableau, des liens, l'absence de
tirets longs, et qu'aucun générateur ne lève d'exception pour les cinq
secteurs et pour une fiche vide.

## L'avancement, session par session (un fichier par session, un seul agent)

Faits et publiés : docs/documents-sst.js (14 documents, le 9 septembre 2026),
le registre du personnel, l'affichage commun (feuille-doc.js).

En cours le 9 septembre : docs/documents-sst-2.js (5 documents).

À faire, dans cet ordre : documents-rh.js (11), documents-discipline.js (17),
documents-discipline-2.js (6), documents-bdese.js (17), documents-nao.js (15),
documents-pse.js (20), documents-eco-fond.js (20), documents-eco-procedure.js
(20), documents-eco-2.js (17), documents-eco-cse.js (13), puis gerer.html
(contrats et courriers intégrés).

NE PAS FAIRE : documents-cse.js, documents-cse-2.js, documents-cse-3.js.
Décision de l'utilisatrice du 9 septembre 2026 : « le CSE, ne le fait pas, on
l'a déjà dans Juriste expert et il est excellent. »
