# Module « plan de sauvegarde de l'emploi »

Troisième module du dépôt, distinct du module économique et du module comité.
Il a sa page, son moteur, son questionnaire et son manifeste.

## Pourquoi un module à part

Le module économique vérifie qu'un licenciement **peut être prononcé** ; celui-ci
vérifie qu'un plan **tient devant l'administration**. Les deux questions n'ont ni
le même interlocuteur, ni le même calendrier, ni la même sanction : l'une se
juge devant le conseil de prud'hommes, l'autre devant le juge administratif.

Le module travaille néanmoins **sur la même fiche**. La page reprend
automatiquement du brouillon de l'audit économique l'effectif, le groupe, le
nombre de licenciements, la date de notification et les pièces : personne ne
ressaisit deux fois le même effectif. Ces données restent demandées et
modifiables — un module qui suppose une saisie faite ailleurs conclut sur ce
qu'il n'a pas lu.

## Ce qu'il contrôle — 18 contrôles

| Rubrique | Contrôles | Fondement |
|---|---|---|
| Contenu du plan | 3 | L. 1233-61, L. 1233-62 |
| Chiffrage | 2 | L. 1233-57-3, L. 1233-62 |
| Calibrage | 3 | L. 1233-57-3 |
| Accompagnement individuel | 3 | L. 1233-66, L. 1233-71, L. 1233-72 |
| Voie et instruction | 4 | L. 1233-24-1, L. 1233-39, L. 1233-57-3, L. 1233-57-4 |
| Suivi | 1 | L. 1233-63 |
| Priorité de réembauche | 1 | L. 1233-45 |
| Cohérence | 1 | L. 1233-62 |

## Ce qu'il ne peut pas dire, et ne dit pas

**Aucun texte ne fixe le montant d'un plan.** L'article L. 1233-57-3 confie à
l'autorité administrative — puis au juge administratif — l'appréciation de la
proportionnalité des mesures aux moyens de l'entreprise, de l'unité économique
et sociale et du groupe.

Les trois contrôles de calibrage calculent donc des rapports (coût par salarié
licencié, part du plan dans le résultat consolidé du groupe), les affichent, et
rendent « risque à vérifier ». **Aucun ne rend « conforme » sur le montant**, et
la chaîne de publication échoue si l'un d'eux le fait un jour : c'est la mesure
`calibrageConcluantConforme` du manifeste, qui doit rester à zéro.

## Le contenu du plan est extrait, non recopié

`mesures.js` découpe l'énumération de l'article L. 1233-62 depuis son texte —
**sept rubriques**, couverture du découpage **98,1 %**, version lue
`LEGIARTI000036261725`. Le module économique en tenait cinq, écrites à la main :
il manquait le 1° bis (reprise d'activité), le 3° (reclassement externe et
bassin d'emploi) et le 6° (réduction du temps de travail et des heures
supplémentaires).

L'article énonce « des mesures **telles que** » : la liste n'est pas limitative.
Une rubrique sans mesure ne produit donc pas « non conforme » mais « risque à
vérifier » — l'administration apprécie le plan au regard de ces rubriques, et
une rubrique écartée doit l'être en connaissance de cause.

## Recouvrement avec le module économique

Huit contrôles du module économique portent déjà sur le plan (CTL-PSE-01 à 07 et
CTL-PRT-01). Ils sont conservés : ils font partie de la chaîne procédurale que
ce module-là vérifie — un plan est-il dû, la voie est-elle arrêtée, la
notification suit-elle la décision. Le module PSE les reprend et va au-delà :
contenu rubrique par rubrique, chiffrage ligne par ligne, calibrage, congé de
reclassement, contrat de sécurisation professionnelle, délais d'instruction,
suivi, priorité de réembauche.

Le recouvrement est assumé et documenté ici plutôt que résolu par une
suppression : retirer ces contrôles du module économique amputerait son rapport
de ce que l'utilisateur y cherche — savoir, sans quitter la page, qu'un plan est
dû.

## Chaîne de publication

```
node publier-pse.js
```

Elle rejoue le découpage, les dossiers contradictoires, la non-divergence du
questionnaire dans les deux sens, la vérification des propositions, écrit le
manifeste et empaquette `docs/moteur-pse.js`. Elle échoue si un contrôle capable
de constater une non-conformité ne l'a jamais constatée, si un dossier vide
produit un « conforme » ou un « sans objet », ou si un contrôle de calibrage
conclut à la conformité.
