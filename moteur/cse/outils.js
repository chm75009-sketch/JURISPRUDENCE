/* La fabrique d'éléments est commune aux deux modules : elle vit dans
   moteur/commun. Ce fichier n'est qu'un renvoi, pour que chaque module puisse
   s'exécuter depuis son propre répertoire sans dupliquer le code. */
module.exports = require("../commun/outils.js");
