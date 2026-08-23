/* Huitième passe : les quatre articles refusés par la sixième, et la même
   cause qu'à la septième — le fragment attendu, non le relais.

   Les quatre ont été rendus six fois sur six avec le même identifiant et le
   même texte. Le critère cherchait une formule voisine de celle qu'emploie
   l'article :

     R4228-10  cherchait « cabinets d'aisances » ; le texte écrit « un cabinet
               d'aisance et un urinoir pour vingt hommes ».
     R4228-19  cherchait « restauration » ; le texte pose l'interdiction de
               « prendre leur repas dans les locaux affectés au travail ».
     R4412-38  cherchait « notice » ; c'est R. 4412-39 qui porte la notice de
               poste — R. 4412-38 porte l'information des travailleurs et du
               comité. Les deux sont demandés, chacun sur son propre contenu.
     R4153-40  cherchait « dix-huit ans » ; le texte renvoie à l'article
               L. 4111-1 et vise le responsable de l'établissement.

   Usage : node capturer-textes-social-8.js [AAAA-MM-JJ]                     */
const { capturer } = require("./capture-social.js");

capturer({
  "R4228-10": ["cabinet d'aisance"],
  "R4228-19": ["prendre leur repas"],
  "R4412-38": ["reçoivent des informations"],
  "R4412-39": ["notice"],
  "R4153-40": ["4111-1"],
}, "huitième passe");
