/* Le calcul des écarts de dates est commun aux deux modules : il vit dans
   moteur/commun. Ce fichier n'est qu'un renvoi, pour que chaque module puisse
   s'exécuter depuis son propre répertoire sans dupliquer le code. */
module.exports = require("../commun/dates.js");
