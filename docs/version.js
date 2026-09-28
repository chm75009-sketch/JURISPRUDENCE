/* Le numéro de version, affiché à l'accueil. Il doit dire la même chose que
   CACHE dans sw.js et que "version" dans manifest.json.

   TRENTE-DEUX MISES À JOUR ONT ÉTÉ PUBLIÉES SANS QUE CE NUMÉRO BOUGE.
   De la 12.46 à la 12.97, seul CACHE dans sw.js avait été incrémenté :
   l'accueil annonçait donc « Version 12.46, 26 septembre 2026 » à quelqu'un
   qui regardait la 12.97, et rien ne distinguait une mise à jour reçue d'une
   mise à jour manquée. Relevé le 28 septembre 2026 par la vérification.
   epreuve/verifier-version.mjs compare désormais les trois fichiers. */
window.VERSION_APP = "13.02";
window.VERSION_DATE = "28 septembre 2026";
