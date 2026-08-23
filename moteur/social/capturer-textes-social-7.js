/* Septième passe : les huit articles que la cinquième passe avait refusés, et
   pourquoi elle avait eu tort de les refuser.

   Le refus ne venait pas du relais. Les huit ont été rendus SIX FOIS SUR SIX
   avec le même identifiant de version et le même texte : des lectures
   parfaitement stables. C'est le critère de contenu de la cinquième passe qui
   était faux — il cherchait une formule que l'article n'emploie pas :

     L3132-2   cherchait « trente-cinq heures » ; le texte dit vingt-quatre
               heures de repos hebdomadaire AUXQUELLES S'AJOUTENT les heures
               de repos quotidien. Les trente-cinq heures sont une addition,
               pas une citation — et c'est ainsi que l'audit voisin l'écrit.
     L3121-38  cherchait « contrepartie obligatoire en repos » ; le texte dit
               « contrepartie obligatoire sous forme de repos ».
     L3121-64  cherchait « forfait annuel » ; le texte dit « conventions
               individuelles de forfait en heures ou en jours sur l'année ».
     D3171-8   cherchait « hebdomadaire » ; l'article parle de l'atelier, du
               service ou de l'équipe travaillant hors horaire collectif.
     L1222-4   cherchait « dispositif de collecte » ; le texte dit qu'aucune
               information ne peut être « collectée par un dispositif » non
               porté préalablement à la connaissance du salarié.
     L1234-19  cherchait « certificat de travail » ; le texte dit « un
               certificat dont le contenu est déterminé par voie
               réglementaire ».
     L1132-4   cherchait « nulle » ; le texte dit « est nul ».
     L1132-3-3 cherchait « signalé » ET « témoigné » ; le texte dit
               « ayant témoigné » et « relaté ».

   Rien n'est assoupli : la règle des deux lectures concordantes s'applique à
   l'identique. Seul le fragment attendu est corrigé — sur ce que l'article
   écrit, et non sur ce qu'on croyait qu'il écrivait.

   Usage : node capturer-textes-social-7.js [AAAA-MM-JJ]                     */
const { capturer } = require("./capture-social.js");

capturer({
  "L3132-2":   ["vingt-quatre heures consécutives"],
  "L3121-38":  ["contrepartie obligatoire sous forme de repos"],
  "L3121-64":  ["conventions individuelles de forfait"],
  "D3171-8":   ["horaire collectif"],
  "L1222-4":   ["collectée par un dispositif"],
  "L1234-19":  ["expiration du contrat de travail", "certificat"],
  "L1132-4":   ["méconnaissance"],
  "L1132-3-3": ["témoigné"],
}, "septième passe");
