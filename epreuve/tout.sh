#!/bin/bash
# TOUTES LES ÉPREUVES, DANS L'ORDRE, D'UNE SEULE COMMANDE.
#
# Dix-sept contrôles vivent dans ce dossier, et il fallait se souvenir de
# chacun avant de publier. Celui-ci les enchaîne : les six qui tournent sans
# navigateur d'abord, parce qu'ils sont instantanés et qu'ils attrapent le
# plus ; les onze balayages ensuite, qui ouvrent Chromium et prennent leur
# temps. Écrit le 28 septembre 2026.
#
#   bash epreuve/tout.sh            toutes les épreuves
#   bash epreuve/tout.sh rapide     seulement celles qui n'ouvrent pas le
#                                   navigateur
#
# Le serveur local est lancé s'il ne l'est pas déjà : les balayages lisent
# docs/ par http://127.0.0.1:8133, comme un navigateur le ferait.

cd "$(dirname "$0")/.." || exit 1
NODE=${NODE:-/opt/node22/bin/node}
RAPIDE=${1:-}
RATES=0

titre() { printf '\n== %s\n' "$1"; }
passe() {
  titre "$1"
  shift
  if "$@"; then :; else RATES=$((RATES + 1)); fi
}

titre "Le serveur local"
if curl -s -o /dev/null http://127.0.0.1:8133/index.html; then
  echo "déjà là"
else
  (cd docs && setsid nohup python3 -m http.server 8133 >/dev/null 2>&1 &)
  sleep 2
  curl -s -o /dev/null http://127.0.0.1:8133/index.html && echo "lancé" || echo "ne répond pas"
fi

# ---- sans navigateur -------------------------------------------------------
passe "La version, le manifeste et le cache" $NODE epreuve/verifier-version.mjs
passe "Les fichiers servis et le cache hors connexion" $NODE epreuve/verifier-cache.mjs
passe "Les tirets cadratins" $NODE epreuve/verifier-tirets.mjs
passe "Les marques d'outil dans les 224 générateurs" $NODE epreuve/verifier-marques.mjs
passe "L'arithmétique de l'index de l'égalité" $NODE epreuve/verifier-index-egalite.mjs
titre "Les générateurs, mesure de référence"
$NODE epreuve/tester-generateurs.mjs docs/documents-*.js 2>&1 | tail -1

if [ "$RAPIDE" = "rapide" ]; then
  printf '\n== Bilan\n%s épreuve(s) en échec.\n' "$RATES"
  exit $((RATES > 0))
fi

# ---- avec navigateur -------------------------------------------------------
passe "Les 41 pages, à 390 et à 1280 points" $NODE epreuve/balayer-pages.mjs
passe "Les écrans du comité, sous les quatre réponses" $NODE epreuve/verifier-comite.mjs
passe "Les écrans de contrôle, pièce déposée" $NODE epreuve/balayer-controles.mjs
passe "Les parcours guidés, remplis" $NODE epreuve/balayer-parcours.mjs
passe "Sans comité, le dépôt et l'exemple de la sanction" $NODE epreuve/verifier-sans-comite.mjs
passe "Le rappel de l'entreprise, une fois par page" $NODE epreuve/verifier-entete.mjs
passe "Les onze affiches, produites et relues" $NODE epreuve/verifier-affiches.mjs
passe "Les fichiers Word des parcours" $NODE epreuve/verifier-docx-parcours.mjs
passe "Les documents du quotidien" $NODE epreuve/balayer-gerer.mjs
passe "Les fichiers Word, rouverts avec python-docx" $NODE epreuve/verifier-docx.mjs
passe "Les classeurs, rouverts avec openpyxl" $NODE epreuve/verifier-xlsx.mjs

printf '\n== Bilan\n%s épreuve(s) en échec.\n' "$RATES"
exit $((RATES > 0))
