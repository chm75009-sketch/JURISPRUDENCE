# Reprendre le travail des mille agents

Ce dossier est versé toutes les dix minutes par `epreuve/sauvegarde.sh` tant que
la session tourne. Il contient ce qu'il faut pour reprendre si la session
s'arrête avant la fin.

- `journal/wf_*.jsonl` : le journal du flux, une ligne par agent terminé, avec
  sa valeur de retour (les constats d'un écran, le verdict sur un article, la
  liste des corrections d'un fichier). C'est la pièce maîtresse : les constats
  y sont, même si la phase de correction n'a pas commencé.
- `mille-agents-*.js` : le script du flux, et `args.json` ses mille unités de
  travail (28 pages, 5 fiches, 171 générateurs, 328 articles, 50 fichiers).
- `constats/` : les fichiers texte écrits par chaque agent dans son dossier
  (textes produits, mesures).
- `patches/` : les propositions de correction sur les fichiers qu'un autre
  agent tenait au moment de la phase de correction, à appliquer à la main.

Pour reprendre dans une nouvelle session : lire le journal, regrouper les
constats par fichier, puis relancer la phase de correction fichier par fichier
avec le même texte de consigne que dans le script (fonction `promptFix`).
