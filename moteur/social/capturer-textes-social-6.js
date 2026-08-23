/* Sixième passe : le reste du crible « santé au travail » venu de l'audit de
   JURIS EXPERT — locaux et sanitaires, travail sur écran, agents chimiques,
   annexe du document unique, document annuel adressé au service de santé,
   moyens de secours et de lutte contre l'incendie, protection individuelle,
   jeunes travailleurs.

   Mêmes règles, sans exception : filtre par le NOM du code, deux lectures
   concordantes espacées, critère de contenu contre les homonymes, identifiant
   de version consigné. Ce qui ne se confirme pas n'entre pas.

   Le moteur de capture est celui de la cinquième passe, réutilisé tel quel.

   Usage : node capturer-textes-social-6.js [AAAA-MM-JJ]                     */
const { capturer } = require("./capture-social.js");

capturer({
  "R4228-10": ["cabinets d'aisances"],
  "R4228-19": ["restauration"],
  "R4542-16": ["écran"],
  "R4412-38": ["notice"],
  "R4121-1-1": ["4161-1"],
  "D4622-22": ["service de prévention et de santé au travail"],
  "R4227-4":  ["dégagement"],
  "R4323-91": ["protection individuelle"],
  "R4153-40": ["dix-huit ans"],
  "L4153-9":  ["dix-huit ans"],
  "R4624-29": ["reprise"],
}, "sixième passe");
