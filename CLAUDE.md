# Consignes de travail

## Documents Word — règle impérative

**Générer tous les .docx avec `python-docx`, jamais avec la bibliothèque JavaScript `docx`.**

Motif : les fichiers produits par `docx` (JS) sont refusés par Microsoft Word —
« Impossible d'ouvrir le fichier Office Open XML. Des problèmes ont été décelés
dans son contenu. » Le problème est récurrent et coûte un temps considérable à
chaque fois. `python-docx` écrit un format plus conservateur, que Word accepte.

Le générateur de référence est `word_py.py` dans le répertoire de travail : il
lit une liste d'éléments en JSON (`sur`, `t1`, `trait`, `h1`, `h2`, `h3`, `p`,
`note`, `puce`, `enc`, `table`, `piece`, `doc`, `sign`, `schema`) et produit le
.docx. Réutiliser ce script plutôt que d'en réécrire un.

### Ne pas se fier à LibreOffice pour vérifier un .docx

`soffice --convert-to` **refuse tout .docx dans cet environnement**, y compris un
fichier d'une seule ligne écrit par `python-docx`. Son verdict ne prouve donc
rien. Vérifier plutôt avec `python-docx` en lecture (`docx.Document(f)`), le test
d'archive `zipfile`, et la validité XML — puis demander confirmation à
l'utilisateur, seul à disposer de Word.

## Vérification des textes

Ne rien affirmer qui n'ait été lu à la source. Les articles du code du travail se
vérifient via le relais Légifrance de l'application :

```
curl -s -X POST "https://jurisprudence-recherche.netlify.app/.netlify/functions/legifrance" \
  -H "content-type: application/json" \
  -d '{"action":"article","numero":"L1233-3","code":"LEGITEXT000006072050","date":"AAAA-MM-JJ"}'
```

Le relais ne sert que le code du travail : l'identifiant du code de commerce
essayé (`LEGITEXT000005634379`) renvoie des articles d'autres codes. Ne pas citer
d'article du code de commerce sans l'avoir vérifié autrement.

## Jurisprudence — API Judilibre

Clé lue dans le fichier local `.jk` du répertoire de travail, jamais écrite dans
le code ni dans le dépôt. Module d'accès : `jl.py`.

Règle absolue : **toute requête dont la réponse porte `relaxed: true` est
écartée**. C'est la seule source d'infidélité de l'API — une requête relaxée
ramène des décisions sans rapport avec la recherche.

## Sécurité

- Ne jamais mettre de clé API en dur dans le code. Chaque utilisateur saisit la
  sienne au premier lancement ; elle reste dans son navigateur (localStorage).
- Le secret client PISTE ne vit que dans les variables d'environnement Netlify
  (`PISTE_CLIENT_ID`, `PISTE_CLIENT_SECRET`). Ne jamais le demander ni l'afficher.
