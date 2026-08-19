# Consignes de travail

## Réponses — règle générale

**Répondre court.** Le résultat, pas la démarche. Pas de détail sur la méthode,
les vérifications ou les corrections tant que l'utilisateur ne le demande pas.
S'il pose une question fermée, répondre par oui ou non, puis se taire.
Le détail est disponible sur demande — il n'est jamais fourni d'office.

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
  -d '{"action":"article","numero":"L1233-3","code":"Code du travail","date":"AAAA-MM-JJ"}'
```

**Le champ `code` attend le NOM du code (« Code du travail »), pas un identifiant
`LEGITEXT`** — découverte du 19 août 2026 (captures SST et social) : un `LEGITEXT`
désactive le filtre, et la recherche par pertinence sert alors des homonymes
d'autres codes. C'est la cause première des homonymes historiques du dépôt.
Le relais ne sert que le code du travail : ne pas citer d'article d'un autre code
sans l'avoir vérifié autrement.

### Le relais n'est pas fiable sous charge — mesuré le 15 août 2026

Interrogé 368 fois d'affilée, il rend des 502, et — plus insidieux — il rend
parfois **un article homonyme d'une autre partie du code**. `R2312-9` a ainsi été
rendu tantôt comme le tableau de la base de données économiques et sociales
(31 803 caractères), tantôt comme un renvoi de 53 caractères à l'article
R. 2112-8. Une première passe a signalé dix écarts de version : réinterrogés au
calme, les dix articles rendaient exactement la version du dépôt.

Conséquence pratique : **une seule lecture ne prouve rien**, ni la concordance ni
l'écart. Relire deux ou trois fois, espacer les requêtes, et ne conclure que sur
des lectures concordantes. `moteur/cse/verifier-textes.js` applique cette règle.

#### Quand les deux lectures sont stables, elles désignent deux articles réels

Cas mesuré le 16 août 2026 sur `R2312-13` et `R2312-14` : cinq lectures espacées
rendent trois fois l'un et deux fois l'autre, sans qu'aucune ne soit une panne.
Le relais sert en réalité **deux articles distincts portant le même numéro**,
l'un de la section de la base de données économiques et sociales
(`LEGIARTI000036411588`, `…590`), l'autre d'une autre partie du code
(`LEGIARTI000037729185`, `…183`, qui renvoie aux articles R. 2112-16 et
R. 2112-18). Relire davantage ne tranche donc rien.

Le seul critère sûr est **le contenu** : l'article cherché parle de ce qu'on
cherche. Pour la base de données, retenir la version qui mentionne « base de
données » ou renvoie à un article `L. 2312-…`. Les identifiants de la famille
`LEGIARTI0000377291…` se sont révélés être les homonymes dans les trois cas
rencontrés, mais c'est une observation, pas une règle : c'est le texte qui
décide.

### Toujours noter l'identifiant de version, pas seulement le numéro

Un article peut être modifié sans changer de numéro. `LEGIARTI…` dit laquelle des
versions successives a été lue ; le numéro ne le dit pas. Un contre-audit externe
a reproché au dépôt d'avoir tronqué `L2314-33` : il lisait la version
`LEGIARTI000036761951`, en vigueur jusqu'en octobre 2025, quand le dépôt portait
`LEGIARTI000052437191`, celle de la date d'audit. Sans identifiant, ce genre de
reproche coûte quatre requêtes datées à écarter.

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
