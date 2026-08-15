#!/bin/bash
# PDF par le moteur d'impression, Word par python-docx — jamais l'inverse.
set -e
node audit.js "$1" "$2" "$3" | grep PDF
python3 word_py.py "${1%.js}.json" "$2.docx" "$3"
