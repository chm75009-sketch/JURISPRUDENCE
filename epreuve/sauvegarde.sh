#!/bin/bash
# Sauvegarde automatique, toutes les dix minutes, de tout ce que les agents
# produisent : les fichiers de l'application en cours de correction, les
# constats des mille agents (journal du flux et fichiers texte de leurs
# dossiers), et le script du flux lui-même, pour pouvoir reprendre.
#
# Pourquoi : demande du 7 septembre 2026, « en cas de défaut de forfait, le
# travail fait et entamé doit être conservé et utilisable ». Le conteneur est
# éphémère ; seul ce qui est poussé sur la branche survit.

DEPOT=/home/user/JURISPRUDENCE
SCRATCH=/tmp/claude-0/-home-user-JURISPRUDENCE/4906ca9a-cefd-5b6b-bc85-5b1671a87815/scratchpad
FLUX=/root/.claude/projects/-home-user-JURISPRUDENCE/4906ca9a-cefd-5b6b-bc85-5b1671a87815/subagents/workflows
SCRIPTS=/root/.claude/projects/-home-user-JURISPRUDENCE/4906ca9a-cefd-5b6b-bc85-5b1671a87815/workflows/scripts
BRANCHE=claude/github-pages-verification-cdzo92
CIBLE=$DEPOT/epreuve/mille

cd "$DEPOT" || exit 1
mkdir -p "$CIBLE/journal" "$CIBLE/constats" "$CIBLE/patches"

while true; do
  # Les journaux du flux : la valeur de retour de chaque agent y est écrite.
  for d in "$FLUX"/wf_*; do
    [ -d "$d" ] || continue
    n=$(basename "$d")
    [ -f "$d/journal.jsonl" ] && cp -f "$d/journal.jsonl" "$CIBLE/journal/$n.jsonl"
  done
  # Le script du flux, pour reprendre avec les mêmes unités de travail.
  cp -f "$SCRIPTS"/*.js "$CIBLE/" 2>/dev/null
  cp -f "$SCRATCH/args.json" "$CIBLE/args.json" 2>/dev/null
  # Les fichiers texte des agents (constats, textes produits), sans les images
  # ni les fichiers Word et Excel, trop lourds pour être versés à chaque tour.
  if [ -d "$SCRATCH/mille" ]; then
    rsync -a --prune-empty-dirs \
      --include='*/' --include='*.json' --include='*.txt' --include='*.md' --include='*.csv' \
      --exclude='*' "$SCRATCH/mille/" "$CIBLE/constats/" 2>/dev/null
  fi
  [ -d "$SCRATCH/patches" ] && rsync -a "$SCRATCH/patches/" "$CIBLE/patches/" 2>/dev/null
  cp -f "$SCRATCH/epreuve-bout-en-bout.md" "$DEPOT/epreuve/" 2>/dev/null

  git add -A docs epreuve CLAUDE.md >/dev/null 2>&1
  if ! git diff --cached --quiet; then
    git commit -q -m "Sauvegarde automatique du travail des agents, $(date -u +'%Y-%m-%d %H:%M UTC')

Versé par epreuve/sauvegarde.sh toutes les dix minutes : les fichiers de
l'application dans l'état où les agents les laissent, les constats des mille
agents et le journal du flux. Un fichier peut être en cours d'écriture au
moment de la sauvegarde : le commit suivant le complète.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01W7PhJuMSGZnRCFdp57Hd2M"
    for essai in 1 2 3 4 5; do
      git push -u origin "$BRANCHE" >/dev/null 2>&1 && break
      sleep $((2 ** essai))
    done
  fi
  sleep 600
done
