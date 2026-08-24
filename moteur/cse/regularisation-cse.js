/* Ce qu'il faut faire quand un contrôle du comité social et économique ne passe
   pas.

   Le module d'audit dit ce qui manque ; ce fichier dit comment y remédier. Un
   contrôle sans entrée ici fait échouer la publication — l'oubli se voit, il ne
   se devine pas. Une entrée peut valoir « null » : c'est le cas des contrôles
   qui ne constatent rien à corriger, et ce null doit être écrit.

   Chaque entrée porte :
     gravite    1 le plus grave, 4 le moins — c'est l'ordre du guide
     quoiFaire  une phrase, à l'infinitif : l'acte à accomplir
     risque     ce que coûte l'inaction, chiffré et fondé
     delai      le temps qu'il faut y consacrer, en clair
     document   le modèle à produire, ou null
     etapes     la procédure, dans l'ordre, jusqu'à la validation
     verifs     la grille du second temps : ce qu'on redemande à qui déclare
                l'obligation en place, et ce qui est attendu en réponse

   Deux règles ont commandé l'écriture des procédures.

   La première est celle des trois étages, que ce module applique déjà dans ses
   contrôles : une obligation d'ordre public, une obligation renvoyée à un
   accord, une obligation supplétive due seulement à défaut d'accord. L'ordre
   n'est pas indifférent — L. 2313-4 ne s'applique qu'« en l'absence d'accord »,
   L. 2312-22 qu'« en l'absence d'accord prévu à l'article L. 2312-19 »,
   L. 2315-46 et L. 2315-49 qu'« en l'absence d'accord prévu à l'article
   L. 2315-45 », L. 2315-44 qu'« en l'absence d'accord prévu aux articles
   L. 2315-41 et L. 2315-42 ». Toute procédure qui touche à l'un de ces sujets
   commence donc par chercher l'accord, et n'applique le supplétif qu'ensuite.

   La seconde tient à ce module en particulier : il vit de délais et de
   procès-verbaux. Une étape commandée par un délai dit le délai ET son point de
   départ — quatre-vingt-dix jours à compter de la diffusion de l'information au
   personnel, dix jours à compter de l'acte contesté, quinze jours à compter de
   l'établissement du procès-verbal de carence. Les vérifications, elles, ne
   demandent jamais « est-ce conforme ? » mais des dates et des pièces.

   Les articles cités ont été lus à la source ; leur texte intégral et leur
   identifiant de version sont dans textes_cse.json, et la chaîne de publication
   confronte les deux. Aucun article, aucun montant, aucun délai qui ne s'y
   trouve n'est cité ici. */

const { C } = require("./controles-cse.js");

/* Les quatre degrés, nommés une fois pour toutes. */
const GRAVITES = {
  1: "Sanction pénale encourue",
  2: "Pénalité financière encourue",
  3: "Irrégularité opposable — l'accord ou la décision peut tomber",
  4: "Régularisation rapide",
};

const R = {

  /* ---------------- Recevabilité et cohérence des données ---------------- */

  "CSE-CTL-REC-01": {
    gravite: 4,
    quoiFaire: "Corriger les données du dossier que l'application a jugées impossibles ou mal formées, puis relancer l'audit.",
    risque: "Un contrôle qui lit une date inexistante, un dénombrement fractionnaire ou une chronologie inversée conclut sur une valeur qui n'existe pas. Ce qu'il rend alors — conforme comme non conforme — ne vaut rien, et tout l'audit repose dessus.",
    delai: "Quelques minutes : ce sont des saisies, non des actes juridiques.",
    document: null,
    etapes: [
      "Reprendre la liste des anomalies rendue par le contrôle : chacune nomme le champ, la valeur saisie et ce qui la rend impossible.",
      "Corriger à la source, sur la pièce d'origine — état d'effectif, information du personnel, convocation, procès-verbal, récépissé — et non de mémoire : une valeur rectifiée au jugé remplace une erreur par une autre.",
      "Vérifier l'ordre des dates entre elles : information du personnel avant premier tour, remise des informations avant avis, acte contesté avant saisine du juge. Une chronologie inversée n'est pas un délai tenu, et l'application refuse de la lire comme tel.",
      "Relancer l'audit : tant qu'une donnée reste illisible, les contrôles qui la lisent ne prononcent rien, ni dans un sens ni dans l'autre.",
    ],
    verifs: [
      { cle: "rec01Champs", question: "Quels champs ont été corrigés, et sur quelle pièce chaque valeur a-t-elle été relue ?", attendu: "La liste des champs et, pour chacun, la pièce d'origine." },
      { cle: "rec01Chrono", question: "Les dates du dossier se suivent-elles dans l'ordre où les actes ont eu lieu ?", attendu: "Les dates, de la plus ancienne à la plus récente." },
    ],
  },

  "CSE-CTL-COH-01": {
    gravite: 4,
    quoiFaire: "Rétablir l'effectif de l'entreprise sur les états mensuels, en appliquant les modalités de calcul de l'article L. 1111-2.",
    risque: "Tout le régime du comité — nombre de sièges, crédit d'heures, périodicité des réunions, commissions, budgets — se calcule sur l'effectif, dont L. 2311-2 renvoie le calcul à L. 1111-2. Un effectif qu'aucun mois du dossier ne corrobore fait tomber, avec lui, toutes les conformités qui en découlent.",
    delai: "Une journée si les états d'effectif existent ; une à deux semaines s'il faut les reconstituer.",
    document: "État récapitulatif des effectifs mensuels des douze derniers mois",
    etapes: [
      "Reprendre les relevés mensuels et le nombre déclaré, et établir lequel des deux est faux : ce sont les relevés qui font foi, l'effectif déclaré n'en est qu'une synthèse.",
      "Recalculer chaque mois selon L. 1111-2 : les salariés en contrat à durée indéterminée à temps plein et les travailleurs à domicile comptent intégralement ; les contrats à durée déterminée, le travail intermittent, les salariés mis à disposition présents dans les locaux depuis au moins un an et les salariés temporaires comptent à due proportion de leur temps de présence au cours des douze mois précédents ; les salariés à temps partiel comptent en divisant la somme des horaires inscrits à leurs contrats par la durée légale ou conventionnelle du travail.",
      "Écarter du décompte les salariés en contrat à durée déterminée et les salariés mis à disposition, salariés temporaires compris, qui remplacent un salarié absent ou dont le contrat est suspendu (L. 1111-2, 2°).",
      "Reporter le résultat mois par mois, dater l'état et le signer : c'est cette pièce, et non une déclaration, qui établira désormais l'effectif.",
      "Relancer l'audit avec l'effectif rectifié : les contrôles assis sur l'effectif ne peuvent conclure qu'une fois la contradiction levée.",
    ],
    verifs: [
      { cle: "coh01Etats", question: "Quels états d'effectif mensuels sont versés, et pour quels mois ?", attendu: "Les relevés, datés, mois par mois." },
      { cle: "coh01Methode", question: "Comment les contrats à durée déterminée, les salariés temporaires et le temps partiel ont-ils été comptés ?", attendu: "Le détail du calcul de L. 1111-2, catégorie par catégorie." },
      { cle: "coh01Remplacants", question: "Les remplaçants de salariés absents ou dont le contrat est suspendu ont-ils été exclus du décompte ?", attendu: "La liste des exclusions et leur motif." },
    ],
  },

  "CSE-CTL-COH-02": {
    gravite: 3,
    quoiFaire: "Reprendre le régime appliqué au comité sur l'effectif réel, lorsque les relevés mensuels franchissent un seuil que l'effectif déclaré ne franchit pas.",
    risque: "Un seuil franchi ouvre des obligations que le dossier ignore : attributions récurrentes d'information et de consultation à cinquante salariés (L. 2312-2), obligations d'information et de consultation attachées à trois cents salariés (L. 2312-34), commission santé, sécurité et conditions de travail (L. 2315-36), commissions supplétives de la formation, du logement et de l'égalité professionnelle (L. 2315-49, L. 2315-50, L. 2315-56). Elles sont dues depuis le franchissement, non depuis sa découverte.",
    delai: "Deux à quatre semaines : c'est le régime entier qu'il faut reprendre.",
    document: "Note de franchissement de seuil et calendrier de mise en conformité",
    etapes: [
      "Établir la date de franchissement : le seuil de onze salariés suppose douze mois consécutifs (L. 2311-2), et le seuil de trois cents salariés est réputé franchi lorsque l'effectif de l'entreprise dépasse ce seuil pendant douze mois consécutifs (L. 2312-34).",
      "Compter ensuite le délai que la loi laisse pour s'y conformer : lorsque l'effectif atteint au moins cinquante salariés pendant douze mois consécutifs, le comité exerce l'ensemble des attributions récurrentes à l'expiration d'un délai de douze mois à compter de la date à laquelle ce seuil a été atteint pendant douze mois consécutifs (L. 2312-2) ; à trois cents salariés, l'employeur dispose d'un an à compter du franchissement pour se conformer complètement aux obligations d'information et de consultation qui en découlent (L. 2312-34).",
      "Dresser la liste des obligations que le seuil ouvre et de celles que le dossier a ignorées, chacune datée : c'est cette liste qui commande l'ordre des corrections.",
      "Rectifier l'effectif au dossier et relancer l'audit : les contrôles qui changent d'état sont alors traités pour eux-mêmes.",
    ],
    verifs: [
      { cle: "coh02Franchi", question: "À quelle date le seuil a-t-il été franchi, et sur quels douze mois consécutifs ?", attendu: "La date et la série des douze relevés qui l'établit." },
      { cle: "coh02Delai", question: "Quel délai de mise en conformité court depuis ce franchissement, et jusqu'à quelle date ?", attendu: "Le délai de L. 2312-2 ou de L. 2312-34, avec sa date d'expiration." },
      { cle: "coh02Obligations", question: "Quelles obligations attachées au seuil ne sont pas encore satisfaites ?", attendu: "La liste, obligation par obligation, avec la date à laquelle chacune est due." },
    ],
  },

  /* ---------------- Mise en place ---------------- */

  "CSE-CTL-MEP-01": {
    gravite: 4,
    quoiFaire: "Verser les états d'effectif qui établissent que le seuil de onze salariés a été atteint pendant douze mois consécutifs.",
    risque: "La mise en place du comité n'est obligatoire que si l'effectif d'au moins onze salariés est atteint pendant douze mois consécutifs (L. 2311-2). Sans les états, ni l'obligation ni son point de départ ne sont démontrables — et c'est du franchissement du seuil que part l'information du personnel prévue à L. 2314-4.",
    delai: "Quelques jours : les états existent en paie, il s'agit de les extraire et de les dater.",
    document: "États d'effectif mensuels établissant le franchissement du seuil de onze salariés",
    etapes: [
      "Extraire les effectifs mois par mois sur une période plus large que douze mois : c'est ce qui permet de voir où commence la série de douze mois consécutifs, et non de la supposer.",
      "Calculer chaque mois selon les modalités de L. 1111-2, auxquelles L. 2311-2 renvoie expressément.",
      "Identifier le douzième mois consécutif à onze salariés ou plus : c'est la date de franchissement, et elle doit figurer sur l'état.",
      "Verser l'état daté au dossier : c'est de ce franchissement que court l'obligation d'informer le personnel de l'organisation des élections (L. 2314-4).",
    ],
    verifs: [
      { cle: "mep01Serie", question: "Sur quelle série de douze mois consécutifs le seuil de onze salariés est-il atteint ?", attendu: "Les douze mois, du premier au dernier, avec l'effectif de chacun." },
      { cle: "mep01Piece", question: "Les états d'effectif sont-ils versés et datés ?", attendu: "Les états eux-mêmes ; une déclaration d'effectif ne les remplace pas." },
    ],
  },

  "CSE-CTL-MEP-02": {
    gravite: 1,
    quoiFaire: "Mettre en place le comité social et économique ou, si le processus électoral n'a produit aucun élu, établir et transmettre le procès-verbal de carence.",
    risque: "Le fait d'apporter une entrave à la constitution d'un comité social et économique, notamment par la méconnaissance des dispositions des articles L. 2314-1 à L. 2314-9, est puni d'un an d'emprisonnement et de 7 500 € d'amende (L. 2317-1).",
    delai: "Trois à quatre mois entre l'information du personnel et la proclamation des résultats ; quinze jours pour la transmission du procès-verbal de carence, à compter de son établissement.",
    document: "Information du personnel sur l'organisation des élections, ou procès-verbal de carence",
    etapes: [
      "Informer le personnel de l'organisation des élections par tout moyen permettant de conférer date certaine à cette information ; le document diffusé précise la date envisagée pour le premier tour (L. 2314-4).",
      "Tenir le premier tour au plus tard le quatre-vingt-dixième jour suivant la diffusion (L. 2314-4) : le délai court de la diffusion, non de la décision d'organiser le scrutin.",
      "Inviter les organisations syndicales à négocier le protocole d'accord préélectoral ; l'invitation doit parvenir au plus tard quinze jours avant la date de la première réunion de négociation (L. 2314-5).",
      "Si le comité n'a pas été mis en place ou renouvelé à l'issue du scrutin, établir le procès-verbal de carence (L. 2314-9).",
      "Porter le procès-verbal de carence à la connaissance des salariés par tout moyen permettant de donner date certaine, et le transmettre dans les quinze jours, par tout moyen permettant de conférer date certaine, à l'agent de contrôle de l'inspection du travail (L. 2314-9) : c'est lui qui en communique copie aux organisations syndicales du département.",
      "Retenir la suite : la demande d'un salarié ou d'une organisation syndicale ne peut intervenir qu'à l'issue d'un délai de six mois après l'établissement du procès-verbal de carence, et l'employeur engage alors la procédure de L. 2314-5 dans le mois suivant la réception de cette demande (L. 2314-8).",
    ],
    verifs: [
      { cle: "mep02Existence", question: "Un comité est-il en place, et à quelle date les résultats ont-ils été proclamés ?", attendu: "La date de proclamation et le procès-verbal des élections." },
      { cle: "mep02Carence", question: "À défaut, le procès-verbal de carence est-il établi, et à quelle date ?", attendu: "Le procès-verbal daté." },
      { cle: "mep02Transmission", question: "À quelle date le procès-verbal de carence a-t-il été transmis à l'inspection du travail ?", attendu: "La date — au plus quinze jours après son établissement — et la preuve d'envoi conférant date certaine." },
    ],
  },

  "CSE-CTL-MEP-03": {
    gravite: 1,
    quoiFaire: "Engager le renouvellement du comité dont le mandat est arrivé à son terme.",
    risque: "Les membres de la délégation du personnel sont élus pour quatre ans (L. 2314-33), et l'employeur informe le personnel tous les quatre ans de l'organisation des élections (L. 2314-4). Le fait d'apporter une entrave à la constitution du comité, notamment par la méconnaissance des articles L. 2314-1 à L. 2314-9, est puni d'un an d'emprisonnement et de 7 500 € d'amende (L. 2317-1).",
    delai: "Quatre-vingt-dix jours au moins entre la diffusion de l'information au personnel et le premier tour : l'information doit donc partir plus de trois mois avant le terme des mandats.",
    document: "Information du personnel sur l'organisation des élections — renouvellement",
    etapes: [
      "Dater le terme des mandats en cours : quatre ans à compter de l'élection (L. 2314-33), ou la durée fixée par accord de branche, de groupe ou d'entreprise, comprise entre deux et quatre ans (L. 2314-34).",
      "Remonter de quatre-vingt-dix jours depuis la date envisagée pour le premier tour : c'est le délai maximal entre la diffusion de l'information au personnel et ce premier tour (L. 2314-4).",
      "Diffuser l'information par tout moyen permettant de conférer date certaine, en y précisant la date envisagée pour le premier tour (L. 2314-4).",
      "Inviter les organisations syndicales deux mois avant l'expiration du mandat des délégués en exercice, comme L. 2314-5 l'impose en cas de renouvellement, et faire en sorte que l'invitation parvienne au plus tard quinze jours avant la première réunion de négociation.",
      "Tenir le premier tour dans la quinzaine précédant l'expiration du mandat (L. 2314-5), pour qu'aucune période ne reste sans institution.",
    ],
    verifs: [
      { cle: "mep03Terme", question: "À quelle date le mandat en cours vient-il à terme, et sur quel fondement — durée légale ou accord ?", attendu: "La date et, s'il existe un accord, sa référence et la durée qu'il fixe." },
      { cle: "mep03Information", question: "À quelle date le personnel a-t-il été informé de l'organisation des élections, et par quel moyen conférant date certaine ?", attendu: "La date et la preuve de diffusion." },
      { cle: "mep03Invitation", question: "À quelle date les organisations syndicales ont-elles été invitées à négocier le protocole ?", attendu: "La date — deux mois avant l'expiration des mandats — et les preuves d'envoi." },
    ],
  },

  "CSE-CTL-MEP-04": {
    gravite: 3,
    quoiFaire: "Ramener la durée conventionnelle du mandat dans la fourchette de deux à quatre ans, ou revenir à la durée légale.",
    risque: "Un accord de branche, de groupe ou d'entreprise ne peut fixer la durée du mandat qu'entre deux et quatre ans (L. 2314-34). Hors de ces bornes, la stipulation ne tient pas et c'est la durée de quatre ans de L. 2314-33 qui s'applique : un renouvellement calé sur une durée illicite est en retard sans que rien ne le signale.",
    delai: "Le temps d'un avenant : deux à trois mois de négociation.",
    document: "Avenant fixant la durée du mandat des représentants du personnel au comité",
    etapes: [
      "Relire la stipulation en cause et vérifier l'instrument : seul un accord de branche, un accord de groupe ou un accord d'entreprise peut déroger à la durée légale (L. 2314-34). Une décision unilatérale ou le règlement intérieur du comité ne le peuvent pas.",
      "Vérifier la borne : la durée fixée doit être comprise entre deux et quatre ans (L. 2314-34).",
      "Négocier l'avenant qui ramène la durée dans ces bornes, ou constater par écrit que la durée de quatre ans de L. 2314-33 s'applique.",
      "Recalculer, sur la durée retenue, la date de terme des mandats en cours et celle à laquelle l'information du personnel devra être diffusée (L. 2314-4).",
    ],
    verifs: [
      { cle: "mep04Source", question: "Quel instrument fixe la durée du mandat — accord de branche, de groupe ou d'entreprise ?", attendu: "L'accord, daté et déposé." },
      { cle: "mep04Duree", question: "Quelle durée fixe-t-il, en années ?", attendu: "La durée ; hors de la fourchette de deux à quatre ans, elle ne tient pas." },
      { cle: "mep04Terme", question: "Quelle date de terme des mandats en cours cette durée donne-t-elle ?", attendu: "La date, calculée depuis la proclamation des résultats." },
    ],
  },

  /* ---------------- Périmètre ---------------- */

  "CSE-CTL-PER-01": {
    gravite: 3,
    quoiFaire: "Fonder le découpage en établissements distincts sur un accord d'entreprise, et ne recourir à la décision unilatérale qu'à défaut d'accord.",
    risque: "L'accord d'entreprise conclu dans les conditions du premier alinéa de L. 2232-12 détermine le nombre et le périmètre des établissements distincts (L. 2313-2) ; l'employeur ne les fixe qu'en l'absence d'un tel accord (L. 2313-4). Un découpage irrégulier vicie le périmètre des élections, et donc les élections elles-mêmes.",
    delai: "Trois à six mois pour négocier ; quelques jours pour verser un accord existant.",
    document: "Accord d'entreprise déterminant le nombre et le périmètre des établissements distincts",
    etapes: [
      "Rechercher l'accord d'abord : l'ordre des sources n'est pas indifférent, puisque L. 2313-4 ne joue qu'« en l'absence d'accord conclu dans les conditions mentionnées aux articles L. 2313-2 et L. 2313-3 ».",
      "S'il existe, le verser au dossier avec la preuve de son dépôt, et vérifier que le périmètre qu'il fixe est celui sur lequel les élections ont été organisées.",
      "S'il n'existe pas, ouvrir la négociation ; à défaut d'accord seulement, la décision de l'employeur fixe le nombre et le périmètre des établissements distincts compte tenu de l'autonomie de gestion du responsable de l'établissement, notamment en matière de gestion du personnel (L. 2313-4) — autonomie qui doit être documentée, ce que le contrôle CSE-CTL-PER-02 reprend pour lui-même.",
      "Notifier la source retenue aux organisations syndicales et au comité, et la porter au dossier avec sa date.",
    ],
    verifs: [
      { cle: "per01Source", question: "Sur quoi repose le découpage — accord d'entreprise, décision unilatérale de l'employeur ou décision administrative ?", attendu: "L'acte lui-même, daté." },
      { cle: "per01Accord", question: "Si c'est un accord, est-il versé et déposé ?", attendu: "L'accord et son récépissé de dépôt." },
      { cle: "per01Perimetre", question: "Le périmètre retenu est-il celui sur lequel les dernières élections ont été organisées ?", attendu: "Le rapprochement du découpage et des procès-verbaux d'élection." },
    ],
  },

  "CSE-CTL-PER-02": {
    gravite: 3,
    quoiFaire: "Documenter l'autonomie de gestion des responsables d'établissement, notamment en matière de gestion du personnel.",
    risque: "Lorsque le découpage est fixé par l'employeur, l'autonomie de gestion du responsable d'établissement est le seul critère que le texte retient (L. 2313-4). Sans pièce, elle n'est pas établie, et le périmètre — donc les élections tenues sur ce périmètre — reste contestable.",
    delai: "Deux à trois semaines : les pièces existent, il faut les réunir.",
    document: "Recueil des délégations de pouvoir des responsables d'établissement",
    etapes: [
      "Réunir, pour chaque établissement, la délégation de pouvoir écrite de son responsable : c'est la pièce qui dit l'étendue réelle de son autonomie.",
      "Vérifier qu'elle porte sur la gestion du personnel, que L. 2313-4 cite expressément : embauche, discipline, organisation et durée du travail.",
      "Compléter par les éléments de fait qui la corroborent — organigramme, budget propre, signature des contrats de travail, sanctions effectivement prononcées : le juge se prononce au regard de l'ensemble des circonstances de fait, non sur une affirmation.",
      "Verser l'ensemble au dossier, établissement par établissement, et le dater.",
    ],
    verifs: [
      { cle: "per02Delegations", question: "Une délégation de pouvoir écrite existe-t-elle pour chaque responsable d'établissement ?", attendu: "Les délégations, une par établissement, datées et signées." },
      { cle: "per02Personnel", question: "Portent-elles sur la gestion du personnel ?", attendu: "Les clauses correspondantes, citées." },
      { cle: "per02Faits", question: "Quelles pièces de fait corroborent cette autonomie ?", attendu: "Organigramme, budget, contrats signés, sanctions prononcées." },
    ],
  },

  "CSE-CTL-PER-03": {
    gravite: 3,
    quoiFaire: "Verser l'accord d'entreprise qui institue les représentants de proximité, ou mettre fin à un dispositif qui n'a pas de base conventionnelle.",
    risque: "Les représentants de proximité ne peuvent être mis en place que par l'accord d'entreprise défini à l'article L. 2313-2 (L. 2313-7). Sans accord, ni leur désignation, ni leurs attributions, ni leurs heures de délégation n'ont de fondement.",
    delai: "Trois à six mois si l'accord est à négocier ; quelques jours pour verser un accord existant.",
    document: "Accord d'entreprise instituant les représentants de proximité",
    etapes: [
      "Rechercher l'accord d'entreprise défini à L. 2313-2 : c'est le seul instrument que L. 2313-7 admet.",
      "Vérifier qu'il définit les quatre points que le texte énumère : le nombre de représentants de proximité, leurs attributions — notamment en matière de santé, de sécurité et de conditions de travail —, les modalités de leur désignation et leurs modalités de fonctionnement, notamment le nombre d'heures de délégation dont ils bénéficient (L. 2313-7, 1° à 4°).",
      "Vérifier qu'ils sont membres du comité ou désignés par lui, et que leur mandat prend fin avec celui des membres élus du comité (L. 2313-7, dernier alinéa).",
      "Vérifier l'articulation des heures : lorsque les membres du comité sont également représentants de proximité, le temps nécessaire à l'exercice de leurs fonctions défini par l'accord de L. 2313-7 peut rester inchangé par rapport à celui dont ils disposent en vertu de l'accord prévu à L. 2314-7 ou, à défaut, du tableau de R. 2314-1.",
      "À défaut d'accord, ouvrir la négociation, ou constater par écrit qu'aucun représentant de proximité ne peut être maintenu.",
    ],
    verifs: [
      { cle: "per03Accord", question: "L'accord instituant les représentants de proximité est-il versé, et à quelle date a-t-il été conclu ?", attendu: "L'accord daté et déposé." },
      { cle: "per03Contenu", question: "Définit-il le nombre, les attributions, les modalités de désignation et les heures de délégation ?", attendu: "Les quatre mentions de L. 2313-7." },
      { cle: "per03Terme", question: "À quelle date le mandat des représentants de proximité prend-il fin ?", attendu: "La date du terme du mandat des membres élus du comité." },
    ],
  },

  /* ---------------- Élections ---------------- */

  "CSE-CTL-ELE-01": {
    gravite: 1,
    quoiFaire: "Inviter à négocier le protocole d'accord préélectoral toutes les organisations syndicales que l'article L. 2314-5 vise, et non les seules organisations représentatives.",
    risque: "Le fait d'apporter une entrave à la constitution du comité ou à la libre désignation de ses membres, notamment par la méconnaissance des dispositions des articles L. 2314-1 à L. 2314-9, est puni d'un an d'emprisonnement et de 7 500 € d'amende (L. 2317-1). L'omission d'une seule organisation entache le processus électoral.",
    delai: "L'invitation doit parvenir au plus tard quinze jours avant la date de la première réunion de négociation ; en cas de renouvellement, elle est effectuée deux mois avant l'expiration des mandats en cours.",
    document: "Invitation des organisations syndicales à négocier le protocole d'accord préélectoral",
    etapes: [
      "Dresser la liste des organisations à informer par tout moyen : celles qui satisfont aux critères de respect des valeurs républicaines et d'indépendance, légalement constituées depuis au moins deux ans, et dont le champ professionnel et géographique couvre l'entreprise ou l'établissement concernés (L. 2314-5, premier alinéa).",
      "Y ajouter celles qui doivent être invitées par courrier : les organisations reconnues représentatives dans l'entreprise ou l'établissement, celles ayant constitué une section syndicale, et les syndicats affiliés à une organisation syndicale représentative au niveau national et interprofessionnel (L. 2314-5, deuxième alinéa).",
      "Envoyer l'invitation de telle sorte qu'elle parvienne au plus tard quinze jours avant la date de la première réunion de négociation (L. 2314-5) ; en cas de renouvellement, l'envoi intervient deux mois avant l'expiration du mandat des délégués en exercice.",
      "Dans les entreprises dont l'effectif est compris entre onze et vingt salariés, n'inviter les organisations qu'à la condition qu'au moins un salarié se soit porté candidat dans un délai de trente jours à compter de l'information prévue à L. 2314-4 (L. 2314-5, dernier alinéa) ; ce salarié bénéficie de la protection à compter de la date à laquelle l'employeur a eu connaissance de l'imminence de sa candidature.",
      "Conserver les preuves d'envoi et de réception : c'est sur elles que se prouvera le respect du délai de quinze jours.",
    ],
    verifs: [
      { cle: "ele01Liste", question: "Quelles organisations ont été invitées, et par quel canal — courrier ou tout moyen ?", attendu: "La liste nominative et le canal retenu pour chacune." },
      { cle: "ele01Delai", question: "À quelle date l'invitation est-elle parvenue, et quelle était la date de la première réunion de négociation ?", attendu: "Les deux dates ; l'écart doit être d'au moins quinze jours." },
      { cle: "ele01Preuves", question: "Les preuves d'envoi et de réception sont-elles versées ?", attendu: "Les accusés de réception ou les preuves conférant date certaine." },
    ],
  },

  "CSE-CTL-ELE-02": {
    gravite: 1,
    quoiFaire: "Tenir le premier tour au plus tard le quatre-vingt-dixième jour suivant la diffusion de l'information du personnel, ou reprendre le processus par une nouvelle information.",
    risque: "Le document diffusé précise la date envisagée pour le premier tour, et celui-ci doit se tenir au plus tard le quatre-vingt-dixième jour suivant la diffusion (L. 2314-4). Le fait d'apporter une entrave à la constitution du comité, notamment par la méconnaissance des articles L. 2314-1 à L. 2314-9, est puni d'un an d'emprisonnement et de 7 500 € d'amende (L. 2317-1).",
    delai: "Quatre-vingt-dix jours à compter de la diffusion de l'information au personnel — pas un de plus.",
    document: "Information du personnel sur l'organisation des élections, portant la date envisagée du premier tour",
    etapes: [
      "Dater la diffusion de l'information au personnel : elle doit avoir été faite par tout moyen permettant de conférer date certaine (L. 2314-4), et c'est de cette date que court le délai.",
      "Compter quatre-vingt-dix jours à partir de cette diffusion : c'est la date limite du premier tour.",
      "Si cette date limite est encore à venir, arrêter le calendrier électoral en conséquence et le porter au protocole.",
      "Si elle est dépassée, reprendre le processus : diffuser une nouvelle information au personnel, portant la nouvelle date envisagée pour le premier tour, et recommencer le décompte à partir de cette diffusion.",
      "Conserver la preuve de diffusion : sans date certaine, le point de départ des quatre-vingt-dix jours est indémontrable, et le respect du délai avec lui.",
    ],
    verifs: [
      { cle: "ele02Diffusion", question: "À quelle date l'information du personnel a-t-elle été diffusée, et par quel moyen conférant date certaine ?", attendu: "La date et la preuve de diffusion." },
      { cle: "ele02Tour", question: "À quelle date le premier tour s'est-il tenu, ou est-il prévu ?", attendu: "La date ; l'écart avec la diffusion ne peut excéder quatre-vingt-dix jours." },
      { cle: "ele02Mention", question: "Le document diffusé précisait-il la date envisagée pour le premier tour ?", attendu: "Le document lui-même, portant cette mention." },
    ],
  },

  "CSE-CTL-ELE-03": {
    gravite: 3,
    quoiFaire: "Réunir sur le protocole préélectoral la double majorité de l'article L. 2314-6, ou tirer les conséquences de son invalidité.",
    risque: "La validité du protocole est subordonnée à sa signature par la majorité des organisations syndicales ayant participé à sa négociation, dont les organisations syndicales représentatives ayant recueilli la majorité des suffrages exprimés lors des dernières élections professionnelles ou, lorsque ces résultats ne sont pas disponibles, la majorité des organisations représentatives dans l'entreprise (L. 2314-6). Un protocole invalide ne purge rien : les stipulations qu'il porte — collèges, sièges, calendrier, modalités du scrutin — sont sans effet.",
    delai: "Une réunion supplémentaire de négociation ; le calendrier électoral s'en trouve décalé d'autant.",
    document: "Protocole d'accord préélectoral et feuille de signatures",
    etapes: [
      "Recenser les organisations qui ont participé à la négociation : c'est sur elles, et non sur l'ensemble des organisations invitées, que se compte la première majorité.",
      "Vérifier la première condition : la majorité en nombre des organisations ayant participé à la négociation a-t-elle signé ?",
      "Vérifier la seconde : parmi les signataires, les organisations représentatives ont-elles recueilli la majorité des suffrages exprimés aux dernières élections professionnelles — ou, à défaut de résultats disponibles, s'agit-il de la majorité des organisations représentatives dans l'entreprise (L. 2314-6) ?",
      "Si l'une des deux conditions manque, rouvrir la négociation ; à défaut d'accord valable, appliquer les règles légales — notamment la composition des collèges de L. 2314-11 et le tableau de R. 2314-1 — plutôt qu'un protocole dépourvu de validité.",
      "Annexer au protocole la feuille de signatures et le relevé des suffrages des dernières élections : ce sont les pièces qui établissent la double majorité.",
    ],
    verifs: [
      { cle: "ele03Participants", question: "Combien d'organisations ont participé à la négociation, et combien ont signé le protocole ?", attendu: "Les deux nombres et la feuille de signatures." },
      { cle: "ele03Suffrages", question: "Quelle part des suffrages exprimés aux dernières élections les organisations représentatives signataires représentent-elles ?", attendu: "Le pourcentage et le procès-verbal des dernières élections qui l'établit." },
      { cle: "ele03Consequence", question: "Si la double majorité n'est pas réunie, quelles règles ont été appliquées à la place du protocole ?", attendu: "Les règles légales retenues, collège par collège." },
    ],
  },

  "CSE-CTL-ELE-04": {
    gravite: 3,
    quoiFaire: "Faire figurer au protocole la proportion de femmes et d'hommes composant chaque collège électoral, et la porter à la connaissance des salariés.",
    risque: "L'accord de répartition des sièges et du personnel dans les collèges mentionne la proportion de femmes et d'hommes composant chaque collège électoral (L. 2314-13), et l'employeur porte cette proportion à la connaissance des salariés dès qu'un accord ou une décision est intervenu (L. 2314-31). Sans elle, les listes ne peuvent pas être composées selon L. 2314-30 — et leur irrégularité entraîne l'annulation de l'élection des élus du sexe surreprésenté (L. 2314-32).",
    delai: "Quelques jours, mais avant l'ouverture du dépôt des listes : après, les candidatures se composent à l'aveugle.",
    document: "Avenant au protocole portant la proportion de femmes et d'hommes par collège, et note d'information aux salariés",
    etapes: [
      "Établir, collège par collège, la part de femmes et d'hommes inscrits sur la liste électorale : c'est cette part, et non l'effectif global de l'entreprise, que L. 2314-30 prend pour référence.",
      "Porter la proportion au protocole, comme L. 2314-13 l'exige de l'accord conclu selon les conditions de L. 2314-6.",
      "La porter à la connaissance des salariés par tout moyen permettant de donner une date certaine à cette information, dès l'accord ou la décision intervenus (L. 2314-31).",
      "Diffuser cette information avant l'ouverture du dépôt des listes : les organisations syndicales en ont besoin pour composer des listes conformes.",
    ],
    verifs: [
      { cle: "ele04Protocole", question: "Le protocole mentionne-t-il la proportion de femmes et d'hommes composant chaque collège ?", attendu: "Le protocole, avec la mention, collège par collège." },
      { cle: "ele04Diffusion", question: "À quelle date la proportion a-t-elle été portée à la connaissance des salariés, et par quel moyen conférant date certaine ?", attendu: "La date et la preuve de diffusion." },
      { cle: "ele04Avant", question: "Cette diffusion est-elle antérieure à l'ouverture du dépôt des listes ?", attendu: "Les deux dates." },
    ],
  },

  "CSE-CTL-ELE-05": {
    gravite: 3,
    quoiFaire: "Faire rectifier, avant le scrutin, les listes dont la composition ne respecte pas la proportion de femmes et d'hommes ou l'alternance.",
    risque: "La constatation par le juge, après l'élection, du non-respect de la proportion entraîne l'annulation de l'élection d'un nombre d'élus du sexe surreprésenté égal au nombre de candidats en surnombre, en suivant l'ordre inverse de la liste ; le non-respect de l'alternance entraîne l'annulation de l'élection des élus dont le positionnement ne la respecte pas (L. 2314-32). Il n'y a pas de remplacement : les sièges restent vacants, sauf élections partielles.",
    delai: "Avant le scrutin. Après, seul le juge tranche, et il annule.",
    document: "Notification aux organisations syndicales de l'irrégularité de composition des listes",
    etapes: [
      "Reprendre, pour chaque collège, la part de femmes et d'hommes inscrits sur la liste électorale, telle que le protocole la porte (L. 2314-13, L. 2314-31).",
      "Appliquer cette part au nombre de candidats à désigner, puis l'arrondi que L. 2314-30 prescrit : à l'entier supérieur en cas de décimale supérieure ou égale à 5, à l'entier inférieur en cas de décimale strictement inférieure à 5.",
      "Vérifier l'alternance : les listes sont composées alternativement d'un candidat de chaque sexe jusqu'à épuisement des candidats de l'un des sexes (L. 2314-30, premier alinéa).",
      "Traiter les deux cas particuliers du texte : en cas de nombre impair de sièges à pourvoir et de stricte égalité entre les femmes et les hommes inscrits sur les listes électorales, la liste comprend indifféremment un homme ou une femme supplémentaire ; et lorsque l'application des règles conduirait à exclure totalement la représentation de l'un ou l'autre sexe, la liste peut comporter un candidat de ce sexe, qui ne peut être en première position.",
      "Notifier par écrit à l'organisation qui a déposé la liste l'écart constaté et lui demander de la rectifier avant le scrutin ; conserver la notification et la réponse.",
      "Appliquer la règle séparément à la liste des membres titulaires et à celle des membres suppléants (L. 2314-30, dernier alinéa).",
    ],
    verifs: [
      { cle: "ele05Parts", question: "Quelle part de femmes et d'hommes chaque collège compte-t-il sur la liste électorale ?", attendu: "Les parts, collège par collège, telles que le protocole les porte." },
      { cle: "ele05Composition", question: "Combien de femmes et d'hommes chaque liste déposée comporte-t-elle, pour combien de sièges à pourvoir ?", attendu: "Le décompte, liste par liste, et le nombre de sièges." },
      { cle: "ele05Alternance", question: "L'ordre de présentation de chaque liste respecte-t-il l'alternance ?", attendu: "L'ordre déposé, candidat par candidat." },
      { cle: "ele05Notification", question: "Si un écart a été constaté, à quelle date l'organisation a-t-elle été invitée par écrit à rectifier sa liste ?", attendu: "La notification datée et la liste rectifiée." },
    ],
  },

  "CSE-CTL-ELE-06": {
    gravite: 3,
    quoiFaire: "Fonder le recours au vote électronique sur un accord d'entreprise ou de groupe et, à défaut seulement, sur une décision de l'employeur, puis établir le cahier des charges.",
    risque: "L'élection peut avoir lieu par vote électronique si un accord d'entreprise ou, à défaut, l'employeur le décide (L. 2314-26) ; la possibilité en est ouverte par un accord d'entreprise ou de groupe, et à défaut d'accord seulement l'employeur peut décider de ce recours (R. 2314-5). Un scrutin électronique sans support régulier ni cahier des charges expose les opérations électorales à la contestation.",
    delai: "Deux à trois mois si l'accord est à négocier ; le cahier des charges doit être établi et mis à disposition avant le scrutin.",
    document: "Accord ou décision ouvrant le vote électronique, et cahier des charges",
    etapes: [
      "Rechercher l'accord d'abord : R. 2314-5 ouvre la possibilité par accord d'entreprise ou de groupe, et ne permet la décision de l'employeur qu'« à défaut d'accord ». La décision unilatérale ne se conçoit donc qu'après une négociation réellement engagée.",
      "Établir le cahier des charges dans le cadre de l'accord ou, à défaut, par l'employeur : il doit respecter les dispositions des articles R. 2314-6 et suivants (R. 2314-5).",
      "Tenir le cahier des charges à la disposition des salariés sur le lieu de travail, et le mettre sur l'intranet de l'entreprise lorsqu'il en existe un (R. 2314-5).",
      "Vérifier que le système retenu assure la confidentialité des données transmises, notamment de celles des fichiers constitués pour établir les listes électorales des collèges, ainsi que la sécurité de l'adressage des moyens d'authentification, de l'émargement, de l'enregistrement et du dépouillement des votes (R. 2314-6).",
      "Décider expressément si le vote à bulletin secret sous enveloppe reste ouvert : la mise en place du vote électronique ne l'interdit pas, si l'accord ou l'employeur ne l'exclut pas (R. 2314-5).",
    ],
    verifs: [
      { cle: "ele06Support", question: "Le recours au vote électronique repose-t-il sur un accord d'entreprise ou de groupe, ou sur une décision de l'employeur prise à défaut d'accord ?", attendu: "L'accord ou la décision, daté." },
      { cle: "ele06Cahier", question: "Le cahier des charges est-il établi, et où est-il tenu à la disposition des salariés ?", attendu: "Le cahier des charges et le lieu ou l'adresse intranet de mise à disposition." },
      { cle: "ele06Partiel", question: "Le recours vaut-il aussi pour les élections partielles se déroulant en cours de mandat ?", attendu: "La mention correspondante dans l'accord ou la décision." },
    ],
  },

  "CSE-CTL-ELE-07": {
    gravite: 1,
    quoiFaire: "Organiser les élections partielles pour pourvoir tous les sièges vacants dans les collèges intéressés.",
    risque: "Des élections partielles sont organisées à l'initiative de l'employeur si un collège électoral n'est plus représenté ou si le nombre des membres titulaires est réduit de moitié ou plus (L. 2314-10). Le fait d'apporter une entrave à la constitution du comité ou à la libre désignation de ses membres est puni d'un an d'emprisonnement et de 7 500 € d'amende (L. 2317-1).",
    delai: "Le processus électoral entier : compter jusqu'à quatre-vingt-dix jours entre la diffusion de l'information au personnel et le premier tour (L. 2314-4).",
    document: "Information du personnel sur l'organisation d'élections partielles",
    etapes: [
      "Vérifier que l'un des deux cas de L. 2314-10 est réuni : un collège électoral n'est plus représenté, ou le nombre des membres titulaires de la délégation du personnel est réduit de moitié ou plus.",
      "Vérifier l'exception, et la dater : les élections partielles ne sont pas dues si l'événement intervient moins de six mois avant le terme du mandat des membres de la délégation du personnel (L. 2314-10). Comparer la date de l'événement à celle du terme des mandats.",
      "Organiser le scrutin dans les conditions fixées à l'article L. 2314-29 — scrutin de liste à deux tours avec représentation proportionnelle à la plus forte moyenne —, sur la base des dispositions en vigueur lors de l'élection précédente (L. 2314-10).",
      "Pourvoir tous les sièges vacants dans les collèges intéressés, et non le seul siège dont la vacance a déclenché l'obligation.",
      "Retenir que les candidats sont élus pour la durée du mandat restant à courir (L. 2314-10) : le terme commun reste celui du mandat en cours.",
    ],
    verifs: [
      { cle: "ele07Cas", question: "Quel événement a ouvert l'obligation — collège non représenté, ou titulaires réduits de moitié ou plus — et à quelle date ?", attendu: "L'événement, sa date, et le décompte des titulaires avant et après." },
      { cle: "ele07Exception", question: "Cet événement est-il intervenu moins de six mois avant le terme des mandats ?", attendu: "La date de l'événement et celle du terme des mandats." },
      { cle: "ele07Scrutin", question: "À quelle date les élections partielles se sont-elles tenues, et quels sièges ont été pourvus ?", attendu: "La date, le procès-verbal, et la liste des sièges pourvus par collège." },
    ],
  },

  /* ---------------- Consultations ---------------- */

  "CSE-CTL-CON-01": {
    gravite: 1,
    quoiFaire: "Conduire les trois consultations récurrentes du comité : orientations stratégiques, situation économique et financière, politique sociale, conditions de travail et emploi.",
    risque: "Les décisions de l'employeur sont précédées de la consultation du comité (L. 2312-14), et à défaut d'accord les trois consultations de L. 2312-17 sont annuelles (L. 2312-22). Le fait d'apporter une entrave au fonctionnement régulier du comité est puni d'une amende de 7 500 € (L. 2317-1).",
    delai: "Un à trois mois par consultation, selon que la base de données est ou non à jour.",
    document: "Ordre du jour et convocation aux consultations récurrentes",
    etapes: [
      "Rechercher d'abord l'accord de L. 2312-19 : il peut définir le contenu, la périodicité et les modalités des consultations récurrentes, la liste et le contenu des informations nécessaires, les niveaux auxquels elles sont conduites et les délais dans lesquels les avis sont rendus. La périodicité qu'il prévoit ne peut être supérieure à trois ans.",
      "À défaut d'accord seulement, appliquer le régime supplétif de L. 2312-22 : les trois consultations sont annuelles ; celles portant sur les orientations stratégiques et sur la situation économique et financière sont conduites au niveau de l'entreprise, sauf si l'employeur en décide autrement ; celle portant sur la politique sociale est conduite à la fois au niveau central et au niveau des établissements lorsque sont prévues des mesures d'adaptation spécifiques à ces établissements.",
      "Mettre à disposition, dans la base de données économiques, sociales et environnementales, les informations nécessaires aux trois consultations (L. 2312-18, R. 2312-7) : le délai de consultation court de la communication de ces informations ou de l'information de leur mise à disposition (R. 2312-5).",
      "Inscrire la consultation à l'ordre du jour : les consultations rendues obligatoires par une disposition législative ou réglementaire ou par un accord collectif y sont inscrites de plein droit par le président ou le secrétaire (L. 2315-29), et l'ordre du jour est communiqué trois jours au moins avant la réunion (L. 2315-30).",
      "Informer le comité, au cours de ces consultations, des conséquences environnementales de l'activité de l'entreprise (L. 2312-17, L. 2312-22).",
      "Recueillir l'avis, le consigner au procès-verbal, et rendre compte en la motivant de la suite donnée aux avis et vœux du comité (L. 2312-15).",
    ],
    verifs: [
      { cle: "con01Accord", question: "Un accord de L. 2312-19 aménage-t-il la périodicité, le contenu ou le niveau des consultations récurrentes ?", attendu: "L'accord daté et déposé, ou la mention expresse du régime annuel supplétif de L. 2312-22." },
      { cle: "con01Dates", question: "À quelles dates chacune des trois consultations a-t-elle été conduite, et quel avis a été rendu ?", attendu: "Les trois dates et les trois avis, avec les procès-verbaux." },
      { cle: "con01Suite", question: "Quelle suite a été donnée aux avis, et comment a-t-elle été motivée ?", attendu: "La réponse motivée de l'employeur, datée." },
    ],
  },

  "CSE-CTL-CON-02": {
    gravite: 3,
    quoiFaire: "Faire courir le délai de consultation depuis la remise effective des informations, et recueillir l'avis avant son expiration.",
    risque: "À l'expiration du délai, le comité est réputé avoir été consulté et avoir rendu un avis négatif (R. 2312-6). Un avis recueilli après cette date ne rétablit pas la consultation : l'avis négatif est déjà acquis, et la décision prise ensuite repose sur une consultation irrégulière.",
    delai: "Un mois à compter de la remise des informations ; deux mois en cas d'intervention d'un expert ; trois mois en cas d'intervention d'une ou plusieurs expertises dans une consultation se déroulant à la fois au niveau du comité central et d'un ou plusieurs comités d'établissement (R. 2312-6).",
    document: "Bordereau de remise des informations au comité, daté",
    etapes: [
      "Dater la communication des informations, ou l'information de leur mise à disposition dans la base de données économiques, sociales et environnementales : c'est de cette date que court le délai (R. 2312-5), et non de la convocation ni de la réunion.",
      "Rechercher d'abord l'accord : L. 2312-19, 4°, permet à un accord de fixer les délais dans lesquels les avis du comité sont rendus, et R. 2312-6 ne joue qu'« à défaut d'accord ».",
      "À défaut d'accord, retenir un mois ; deux mois en cas d'intervention d'un expert ; trois mois en cas d'intervention d'une ou plusieurs expertises dans une consultation se déroulant à la fois au niveau du comité central et d'un ou plusieurs comités d'établissement (R. 2312-6, I).",
      "Lorsqu'il y a lieu de consulter à la fois le comité central et des comités d'établissement, faire rendre et transmettre l'avis de chaque comité d'établissement au comité central au plus tard sept jours avant la date à laquelle celui-ci est réputé avoir rendu un avis négatif ; à défaut, l'avis du comité d'établissement est réputé négatif (R. 2312-6, II).",
      "Recueillir l'avis avant l'expiration et le consigner au procès-verbal avec la date de remise des informations : ce sont ces deux dates, ensemble, qui établissent la régularité.",
    ],
    verifs: [
      { cle: "con02Remise", question: "À quelle date les informations ont-elles été remises au comité, ou leur mise à disposition dans la base de données lui a-t-elle été signalée ?", attendu: "La date et le bordereau ou l'accusé correspondant." },
      { cle: "con02Delai", question: "Quel délai s'appliquait, et sur quel fondement — accord de L. 2312-19, 4°, ou régime de R. 2312-6 ?", attendu: "Le délai en jours et sa source." },
      { cle: "con02Avis", question: "À quelle date l'avis a-t-il été rendu ?", attendu: "La date et le procès-verbal qui la porte." },
      { cle: "con02Expert", question: "Un expert est-il intervenu, et à quelle date a-t-il été désigné ?", attendu: "La désignation datée ; elle porte le délai à deux mois." },
    ],
  },

  "CSE-CTL-CON-03": {
    gravite: 3,
    quoiFaire: "Remettre au comité des informations précises et écrites, et lui apporter une réponse motivée à ses observations.",
    risque: "Le comité dispose d'un délai d'examen suffisant, d'informations précises et écrites transmises ou mises à disposition par l'employeur, et de la réponse motivée de l'employeur à ses propres observations (L. 2312-15). S'il estime ne pas disposer d'éléments suffisants, il peut saisir le président du tribunal judiciaire statuant selon la procédure accélérée au fond ; en cas de difficultés particulières d'accès aux informations, le juge peut décider la prolongation du délai.",
    delai: "Avant la réunion, et en tout état de cause avant l'expiration du délai de consultation.",
    document: "Note d'information au comité et réponse motivée à ses observations",
    etapes: [
      "Établir une note écrite sur le sujet soumis à consultation : le texte exige des informations précises et écrites (L. 2312-15).",
      "Les transmettre, ou les mettre à disposition dans la base de données économiques, sociales et environnementales — cette mise à disposition actualisée vaut communication des rapports et informations au comité (L. 2312-18).",
      "Dater la remise : c'est elle qui fait courir le délai de consultation (R. 2312-5), et elle seule.",
      "Répondre par écrit et de manière motivée aux observations du comité avant qu'il ne rende son avis : la réponse motivée fait partie de ce dont il doit disposer (L. 2312-15).",
      "Rendre compte, en la motivant, de la suite donnée aux avis et vœux du comité (L. 2312-15, dernier alinéa).",
    ],
    verifs: [
      { cle: "con03Note", question: "Quelle note écrite a été remise au comité, et à quelle date ?", attendu: "La note et son bordereau de remise daté." },
      { cle: "con03Observations", question: "Quelles observations le comité a-t-il formulées, et quelle réponse motivée leur a été apportée ?", attendu: "Les observations et la réponse écrite, datées." },
      { cle: "con03Suite", question: "Quelle suite a été donnée à l'avis, et comment a-t-elle été motivée ?", attendu: "La décision motivée, portée à la connaissance du comité." },
    ],
  },

  "CSE-CTL-CON-04": {
    gravite: 3,
    quoiFaire: "Consulter le niveau qui correspond au projet : le comité central, les comités d'établissement, ou les deux.",
    risque: "Le comité central est seul consulté sur les projets décidés au niveau de l'entreprise qui ne comportent pas de mesures d'adaptation spécifiques à un ou plusieurs établissements (L. 2316-1). Le comité d'établissement est consulté sur les mesures d'adaptation des décisions arrêtées au niveau de l'entreprise, spécifiques à l'établissement et relevant de la compétence de son chef (L. 2316-20). Consulter le mauvais niveau, c'est ne pas consulter.",
    delai: "Le temps d'une réunion supplémentaire par établissement concerné, à l'intérieur du délai de consultation en cours.",
    document: "Note de saisine précisant le niveau de consultation retenu",
    etapes: [
      "Qualifier le projet : comporte-t-il des mesures d'adaptation spécifiques à un ou plusieurs établissements, et ces mesures relèvent-elles de la compétence du chef d'établissement ?",
      "S'il n'en comporte pas, saisir le comité central, seul consulté ; son avis, accompagné des documents relatifs au projet, est ensuite transmis par tout moyen aux comités sociaux et économiques d'établissement (L. 2316-1, 1°).",
      "S'il en comporte, saisir également chaque comité d'établissement concerné, sur les mesures qui lui sont propres (L. 2316-20).",
      "Pour les mesures d'adaptation communes à plusieurs établissements des projets prévus au 4° du II de L. 2312-8, retenir que le comité central est seul consulté (L. 2316-1, 3°).",
      "Organiser le calendrier : lorsque les deux niveaux sont consultés, l'avis de chaque comité d'établissement est rendu et transmis au comité central au plus tard sept jours avant la date à laquelle celui-ci est réputé avoir rendu un avis négatif (R. 2312-6, II).",
    ],
    verifs: [
      { cle: "con04Mesures", question: "Le projet comporte-t-il des mesures d'adaptation spécifiques à un ou plusieurs établissements ?", attendu: "La description des mesures, établissement par établissement." },
      { cle: "con04Instances", question: "Quelles instances ont été consultées, et à quelles dates ?", attendu: "La liste des instances et les dates de leurs avis." },
      { cle: "con04Transmission", question: "Les avis des comités d'établissement ont-ils été transmis au comité central, et à quelle date ?", attendu: "Les avis et leur date de transmission — au plus tard sept jours avant l'échéance du comité central." },
    ],
  },

  "CSE-CTL-CON-05": {
    gravite: 1,
    quoiFaire: "Réunir le comité au moins autant de fois que l'accord ou la loi l'imposent.",
    risque: "À défaut d'accord, le comité se réunit au moins une fois par mois dans les entreprises d'au moins trois cents salariés, et au moins une fois tous les deux mois en deçà (L. 2315-28). Le fait d'apporter une entrave au fonctionnement régulier du comité est puni d'une amende de 7 500 € (L. 2317-1).",
    delai: "Immédiat : la première réunion de rattrapage se convoque sous quinzaine, l'ordre du jour devant être communiqué trois jours au moins à l'avance.",
    document: "Calendrier annuel des réunions du comité et convocations",
    etapes: [
      "Rechercher d'abord l'accord de L. 2312-19 : il peut fixer le nombre de réunions annuelles du comité prévues à L. 2315-27, lequel ne peut être inférieur à six (L. 2312-19, 2°).",
      "À défaut d'accord seulement, appliquer L. 2315-28 : au moins une réunion par mois à partir de trois cents salariés, au moins une réunion tous les deux mois en deçà.",
      "Établir le calendrier de l'année et le porter à la connaissance des membres ; le comité peut en outre tenir une seconde réunion à la demande de la majorité de ses membres (L. 2315-28), et les questions jointes à cette demande sont inscrites à l'ordre du jour (L. 2315-31).",
      "Convoquer : l'ordre du jour est établi par le président et le secrétaire (L. 2315-29), puis communiqué par le président aux membres du comité, à l'agent de contrôle de l'inspection du travail et à l'agent des services de prévention des organismes de sécurité sociale trois jours au moins avant la réunion (L. 2315-30).",
      "Faire établir le procès-verbal de chaque réunion : à défaut d'accord, le secrétaire l'établit dans un délai de quinze jours et le communique à l'employeur et aux membres du comité (L. 2315-34, R. 2315-25).",
    ],
    verifs: [
      { cle: "con05Source", question: "Le nombre de réunions résulte-t-il d'un accord de L. 2312-19, 2°, ou du régime supplétif de L. 2315-28 ?", attendu: "L'accord daté, ou la mention expresse du régime supplétif." },
      { cle: "con05Dates", question: "À quelles dates les réunions de l'année se sont-elles tenues ?", attendu: "La liste des dates, avec les convocations et les feuilles d'émargement." },
      { cle: "con05Pv", question: "Le procès-verbal de chaque réunion est-il établi et communiqué, et dans quel délai ?", attendu: "Les procès-verbaux datés ; à défaut d'accord, établis dans les quinze jours de la réunion." },
    ],
  },

  "CSE-CTL-CON-06": {
    gravite: 1,
    quoiFaire: "Tenir au moins quatre réunions annuelles portant, en tout ou partie, sur la santé, la sécurité et les conditions de travail.",
    risque: "Au moins quatre réunions du comité portent annuellement, en tout ou partie, sur ses attributions en matière de santé, sécurité et conditions de travail (L. 2315-27). Le fait d'apporter une entrave au fonctionnement régulier du comité est puni d'une amende de 7 500 € (L. 2317-1).",
    delai: "L'année de référence : les réunions manquantes se rattrapent avant sa clôture, et chaque réunion doit être confirmée par écrit quinze jours au moins avant sa tenue.",
    document: "Calendrier annuel des réunions consacrées à la santé, à la sécurité et aux conditions de travail",
    etapes: [
      "Compter les réunions de l'année qui ont porté, en tout ou partie, sur la santé, la sécurité et les conditions de travail : le texte n'exige pas quatre réunions exclusivement consacrées à ces sujets, mais quatre réunions qui les traitent (L. 2315-27).",
      "Arrêter le calendrier de ces réunions et en informer annuellement l'agent de contrôle de l'inspection du travail, le médecin du travail et l'agent des services de prévention des organismes de sécurité sociale (L. 2315-27, dernier alinéa).",
      "Leur confirmer par écrit la tenue de chaque réunion au moins quinze jours à l'avance (L. 2315-27) : ce délai se compte à rebours depuis la date de la réunion.",
      "Réunir en outre le comité à la suite de tout accident ayant entraîné ou ayant pu entraîner des conséquences graves, en cas d'événement grave lié à l'activité de l'entreprise ayant porté ou pu porter atteinte à la santé publique ou à l'environnement, ou à la demande motivée de deux de ses membres représentants du personnel sur les sujets relevant de la santé, de la sécurité ou des conditions de travail (L. 2315-27).",
      "Porter ces sujets à l'ordre du jour et le communiquer trois jours au moins avant la réunion (L. 2315-30).",
    ],
    verifs: [
      { cle: "con06Nombre", question: "Combien de réunions de l'année ont porté, en tout ou partie, sur la santé, la sécurité et les conditions de travail, et à quelles dates ?", attendu: "Les dates et les ordres du jour correspondants." },
      { cle: "con06Calendrier", question: "À quelle date le calendrier annuel a-t-il été communiqué à l'inspection du travail, au médecin du travail et à l'agent des services de prévention ?", attendu: "La date et la preuve d'envoi." },
      { cle: "con06Confirmation", question: "Chaque réunion leur a-t-elle été confirmée par écrit au moins quinze jours à l'avance ?", attendu: "Les confirmations datées, réunion par réunion." },
    ],
  },

  /* ---------------- Moyens ---------------- */

  "CSE-CTL-MOY-01": {
    gravite: 2,
    quoiFaire: "Porter le crédit d'heures de délégation au volume global qu'impose le tableau de l'article R. 2314-1.",
    risque: "Le protocole préélectoral ne peut modifier le nombre de sièges ou le volume des heures individuelles de délégation que si le volume global de ces heures, au sein de chaque collège, reste au moins égal à celui qui résulte des dispositions légales au regard de l'effectif (L. 2314-7). En deçà, les heures manquantes sont dues : le temps passé en délégation est de plein droit considéré comme temps de travail et payé à l'échéance normale (L. 2315-10).",
    delai: "Rétablissement immédiat du crédit ; rattrapage sur la paie du mois suivant.",
    document: "Note de rétablissement du crédit d'heures de délégation",
    etapes: [
      "Relever la tranche d'effectif dans le tableau de R. 2314-1 et en lire les trois colonnes : nombre de titulaires, nombre mensuel d'heures de délégation, total des heures.",
      "Rechercher ensuite l'accord : R. 2314-1 ne fixe le temps mensuel qu'« à défaut de stipulations » dans l'accord prévu à L. 2314-7, lequel peut modifier le nombre de sièges ou le volume des heures individuelles.",
      "Vérifier la contrepartie que L. 2314-7 exige : le volume global des heures, au sein de chaque collège, doit rester au moins égal à celui qui résulte des dispositions légales. Un protocole qui réduit ce volume global ne vaut pas.",
      "Rétablir le crédit à hauteur du volume dû, et régulariser sur la paie les heures non accordées (L. 2315-10).",
      "Retenir que ce nombre d'heures peut être augmenté en cas de circonstances exceptionnelles (R. 2314-1), et que le plancher de L. 2315-7 — dix heures par mois dans les entreprises de moins de cinquante salariés, seize dans les autres — ne peut jamais être franchi à la baisse.",
    ],
    verifs: [
      { cle: "moy01Tableau", question: "Quelle tranche d'effectif du tableau de R. 2314-1 s'applique, et quel total d'heures donne-t-elle ?", attendu: "La tranche, le nombre de titulaires, les heures par titulaire et le total." },
      { cle: "moy01Accord", question: "Un accord ou un protocole modifie-t-il le nombre de sièges ou le volume des heures individuelles ?", attendu: "L'accord ou le protocole, avec la clause en cause." },
      { cle: "moy01Global", question: "Le volume global des heures, collège par collège, est-il au moins égal à celui du tableau ?", attendu: "Le décompte par collège." },
    ],
  },

  "CSE-CTL-MOY-02": {
    gravite: 4,
    quoiFaire: "Établir la cause de l'écart entre le nombre de titulaires élus et le nombre prévu par le tableau réglementaire.",
    risque: "L'écart peut être régulier — un protocole modifiant le nombre de sièges dans les conditions de L. 2314-7 — ou révéler des sièges non pourvus. S'il manque la moitié des titulaires, ou si un collège n'est plus représenté, des élections partielles sont dues à l'initiative de l'employeur (L. 2314-10).",
    delai: "Quelques jours : il s'agit de rapprocher des pièces qui existent déjà.",
    document: "Note explicative de la composition de la délégation du personnel",
    etapes: [
      "Reprendre le tableau de R. 2314-1 pour la tranche d'effectif applicable et relever le nombre de titulaires prévu.",
      "Rapprocher le protocole préélectoral : s'il modifie le nombre de sièges, vérifier que le volume global des heures de délégation reste au moins égal, collège par collège, à celui qui résulte des dispositions légales (L. 2314-7).",
      "À défaut de stipulation du protocole, rapprocher le procès-verbal des élections : les sièges non pourvus faute de candidats s'y lisent, et non sur une déclaration.",
      "Si l'écart provient de vacances survenues en cours de mandat, vérifier si les conditions des élections partielles sont réunies (L. 2314-10) et, le cas échéant, les organiser.",
      "Consigner par écrit la cause retenue, avec la pièce qui l'établit.",
    ],
    verifs: [
      { cle: "moy02Prevu", question: "Combien de titulaires le tableau de R. 2314-1 prévoit-il pour l'effectif de l'entreprise ?", attendu: "Le nombre et la tranche d'effectif." },
      { cle: "moy02Cause", question: "D'où vient l'écart — protocole modifiant les sièges, sièges non pourvus, ou vacances en cours de mandat ?", attendu: "La cause et la pièce qui l'établit : protocole ou procès-verbal d'élection." },
      { cle: "moy02Partielles", question: "Si l'écart provient de vacances, un collège n'est-il plus représenté, ou les titulaires sont-ils réduits de moitié ou plus ?", attendu: "Le décompte par collège, à la date de la vacance." },
    ],
  },

  "CSE-CTL-MOY-03": {
    gravite: 2,
    quoiFaire: "Rembourser les heures de délégation retenues sur la paie et cesser toute retenue.",
    risque: "Le temps passé en délégation est de plein droit considéré comme temps de travail et payé à l'échéance normale ; l'employeur qui entend contester l'utilisation faite des heures saisit le juge judiciaire (L. 2315-10). La retenue préalable inverse cet ordre : les heures restent dues, quel que soit le sort de la contestation.",
    delai: "La paie du mois suivant.",
    document: "Bulletin de paie rectificatif et note aux représentants concernés",
    etapes: [
      "Recenser les retenues opérées, salarié par salarié et mois par mois, avec le nombre d'heures et le montant.",
      "Les rembourser sur la paie suivante : le paiement à l'échéance normale est de plein droit et ne se subordonne à aucune justification préalable de l'usage des heures.",
      "Si l'usage des heures reste contesté, saisir le juge judiciaire après paiement, comme L. 2315-10 l'impose.",
      "Vérifier que n'a pas été déduit du crédit ce qui ne doit pas l'être : le temps passé à la recherche de mesures préventives dans toute situation d'urgence et de gravité, aux réunions du comité et de ses commissions, et aux enquêtes menées après un accident du travail grave ou des incidents répétés ayant révélé un risque grave est payé comme temps de travail effectif et n'est pas déduit des heures de délégation (L. 2315-11).",
      "Vérifier de même que le temps consacré aux formations est pris sur le temps de travail, rémunéré comme tel, et non déduit des heures de délégation (L. 2315-16).",
    ],
    verifs: [
      { cle: "moy03Retenues", question: "Quelles retenues ont été opérées, sur quels bulletins de paie et pour combien d'heures ?", attendu: "Le détail, salarié par salarié et mois par mois." },
      { cle: "moy03Rembours", question: "À quelle date le remboursement a-t-il été porté sur la paie ?", attendu: "Le bulletin rectificatif daté." },
      { cle: "moy03Reunions", question: "Le temps passé aux réunions du comité et de ses commissions a-t-il été déduit du crédit d'heures ?", attendu: "Le décompte du crédit, réunion par réunion ; il ne doit pas l'être." },
    ],
  },

  "CSE-CTL-MOY-04": {
    gravite: 2,
    quoiFaire: "Faire dispenser à tous les membres de la délégation du personnel la formation en santé, sécurité et conditions de travail.",
    risque: "Les membres de la délégation du personnel et le référent prévu au dernier alinéa de L. 2314-1 bénéficient de la formation nécessaire à l'exercice de leurs missions en matière de santé, de sécurité et de conditions de travail ; elle est d'une durée minimale de cinq jours lors du premier mandat, et son financement est pris en charge par l'employeur (L. 2315-18).",
    delai: "Cinq jours de formation à programmer ; compter deux à trois mois pour l'organiser.",
    document: "Convocation en formation santé, sécurité et conditions de travail et attestations de présence",
    etapes: [
      "Recenser les membres de la délégation du personnel et le référent désigné en matière de lutte contre le harcèlement sexuel et les agissements sexistes (L. 2314-1), et distinguer les premiers mandats des renouvellements.",
      "Retenir la durée minimale applicable : cinq jours lors du premier mandat ; en cas de renouvellement, trois jours pour chaque membre quelle que soit la taille de l'entreprise, et cinq jours pour les membres de la commission santé, sécurité et conditions de travail dans les entreprises d'au moins trois cents salariés (L. 2315-18).",
      "Programmer la formation et convoquer : le temps consacré aux formations est pris sur le temps de travail, rémunéré comme tel, et n'est pas déduit des heures de délégation (L. 2315-16).",
      "Faire prendre en charge le financement par l'employeur (L. 2315-18, dernier alinéa).",
      "Ne pas confondre avec le stage de formation économique : d'une durée maximale de cinq jours, il est réservé aux membres titulaires élus pour la première fois dans les entreprises d'au moins cinquante salariés, et son financement est pris en charge par le comité (L. 2315-63).",
      "Recueillir les attestations de présence et les verser au dossier : elles seules établissent que la formation a été dispensée.",
    ],
    verifs: [
      { cle: "moy04Beneficiaires", question: "Quels membres ont suivi la formation santé, sécurité et conditions de travail, et lesquels ne l'ont pas suivie ?", attendu: "La liste nominative avec, pour chacun, la date de la formation." },
      { cle: "moy04Duree", question: "Combien de jours ont été dispensés à chacun, et s'agit-il d'un premier mandat ou d'un renouvellement ?", attendu: "Le nombre de jours et la qualité du mandat, membre par membre." },
      { cle: "moy04Attestations", question: "Les attestations de présence sont-elles versées ?", attendu: "Les attestations, datées et nominatives." },
      { cle: "moy04Economique", question: "Les membres titulaires élus pour la première fois ont-ils bénéficié du stage de formation économique ?", attendu: "Les dates du stage et sa prise en charge par le comité." },
    ],
  },

  /* ---------------- Commission santé, sécurité et conditions de travail ---------------- */

  "CSE-CTL-SST-01": {
    gravite: 1,
    quoiFaire: "Créer la commission santé, sécurité et conditions de travail au sein du comité.",
    risque: "Une commission santé, sécurité et conditions de travail est créée au sein du comité dans les entreprises d'au moins trois cents salariés, dans les établissements distincts d'au moins trois cents salariés, et dans les établissements que le 3° de L. 2315-36 vise. Le fait d'apporter une entrave au fonctionnement régulier du comité est puni d'une amende de 7 500 € (L. 2317-1).",
    delai: "Une réunion du comité pour la résolution de désignation ; deux à trois mois si les modalités sont à négocier.",
    document: "Résolution du comité désignant les membres de la commission santé, sécurité et conditions de travail",
    etapes: [
      "Vérifier le seuil : trois cents salariés dans l'entreprise ou dans l'établissement distinct (L. 2315-36, 1° et 2°), le seuil étant réputé franchi lorsque l'effectif le dépasse pendant douze mois consécutifs (L. 2312-34). Retenir en outre que, dans les entreprises et établissements de moins de trois cents salariés, l'inspecteur du travail peut imposer la création de la commission lorsque cette mesure est nécessaire, notamment en raison de la nature des activités, de l'agencement ou de l'équipement des locaux (L. 2315-37).",
      "Fixer les modalités avant de désigner, dans l'ordre des sources : l'accord d'entreprise défini à L. 2313-2 les fixe (L. 2315-41) ; en l'absence de délégué syndical, un accord entre l'employeur et le comité adopté à la majorité des membres titulaires élus (L. 2315-42) ; à défaut d'accord seulement, le règlement intérieur du comité (L. 2315-44).",
      "Désigner les membres par une résolution du comité adoptée à la majorité des membres présents, parmi les membres du comité, pour une durée qui prend fin avec celle du mandat des membres élus (L. 2315-39, L. 2315-32).",
      "Vérifier la composition : au minimum trois membres représentants du personnel, dont au moins un représentant du second collège ou, le cas échéant, du troisième collège prévu à L. 2314-11 (L. 2315-39). La commission est présidée par l'employeur ou son représentant.",
      "Consigner la résolution au procès-verbal de la réunion, avec le décompte des voix : c'est cette pièce qui établira la régularité de la désignation.",
    ],
    verifs: [
      { cle: "sst01Seuil", question: "L'entreprise ou l'établissement atteint-il trois cents salariés, et sur quelle série de douze mois consécutifs ?", attendu: "L'effectif et la date de franchissement du seuil." },
      { cle: "sst01Resolution", question: "À quelle date le comité a-t-il adopté la résolution de désignation ?", attendu: "La date et le procès-verbal portant le décompte des voix." },
      { cle: "sst01Composition", question: "Combien de représentants du personnel la commission compte-t-elle, et de quels collèges ?", attendu: "Le nombre et le collège d'élection de chaque membre." },
    ],
  },

  "CSE-CTL-SST-02": {
    gravite: 3,
    quoiFaire: "Attribuer à la commission au moins un siège à un élu représentant le second collège ou, si un troisième collège est institué, le troisième.",
    risque: "La commission comprend au minimum trois membres représentants du personnel, dont au moins un représentant du second collège, ou le cas échéant du troisième collège prévu à L. 2314-11 (L. 2315-39). Ces dispositions sont d'ordre public : lorsqu'un troisième collège est institué, un siège au moins doit être attribué à un élu le représentant, et l'arrêt qui voyait dans le texte une simple alternative entre le second et le troisième collège a été cassé (Soc., 26 février 2025, n° 24-12.295, publié). Une composition irrégulière expose la désignation à l'annulation.",
    delai: "Une réunion du comité : la désignation se reprend par une nouvelle résolution.",
    document: "Résolution rectificative de désignation des membres de la commission",
    etapes: [
      "Établir le nombre de collèges de l'entreprise : les ingénieurs, chefs de service et cadres administratifs, commerciaux ou techniques assimilés constituent un troisième collège lorsque leur nombre est au moins égal à vingt-cinq au moment de la constitution ou du renouvellement de l'instance, quel que soit l'effectif (L. 2314-11).",
      "Si un troisième collège est institué, réserver un siège au moins à un élu le représentant : la règle n'est pas une alternative (Soc., 26 février 2025, n° 24-12.295).",
      "S'il n'existe que deux collèges, vérifier qu'un siège au moins revient à un élu du second collège (L. 2315-39).",
      "Vérifier le minimum de trois membres représentants du personnel (L. 2315-39).",
      "Reprendre la désignation par une nouvelle résolution du comité adoptée à la majorité des membres présents (L. 2315-32), et la consigner au procès-verbal.",
    ],
    verifs: [
      { cle: "sst02Colleges", question: "Combien de collèges l'entreprise compte-t-elle, et combien de cadres au sens de L. 2314-11 comptait-elle au moment de la constitution ou du renouvellement de l'instance ?", attendu: "Le nombre de collèges et le décompte des cadres à cette date." },
      { cle: "sst02Sieges", question: "Quel collège chaque membre de la commission représente-t-il ?", attendu: "La liste des membres avec, pour chacun, son collège d'élection." },
      { cle: "sst02Pv", question: "Quelle résolution a désigné ces membres, et à quelle date ?", attendu: "Le procès-verbal portant la résolution et le décompte des voix." },
    ],
  },

  "CSE-CTL-SST-03": {
    gravite: 3,
    quoiFaire: "Faire désigner les membres de la commission par une résolution du comité adoptée à la majorité des membres présents.",
    risque: "La désignation des membres d'une commission santé, sécurité et conditions de travail, que sa mise en place soit obligatoire ou conventionnelle, résulte d'un vote des membres du comité à la majorité des voix des membres présents, sans qu'il soit besoin d'une résolution préalable fixant les modalités de l'élection (Soc., 27 novembre 2019, n° 19-14.224, publié), par application de L. 2315-39 et de L. 2315-32, alinéa 1. Une désignation opérée autrement est irrégulière.",
    delai: "Une réunion du comité ; l'ordre du jour doit être communiqué trois jours au moins avant.",
    document: "Procès-verbal de la réunion portant résolution de désignation",
    etapes: [
      "Inscrire la désignation à l'ordre du jour, établi par le président et le secrétaire (L. 2315-29) et communiqué trois jours au moins avant la réunion (L. 2315-30).",
      "Procéder au vote des membres du comité : les résolutions du comité sont prises à la majorité des membres présents, et le président ne participe pas au vote lorsqu'il consulte les membres élus du comité en tant que délégation du personnel (L. 2315-32).",
      "Désigner les membres parmi les membres du comité, pour une durée qui prend fin avec celle du mandat des membres élus (L. 2315-39).",
      "Écarter toute lecture d'une stipulation d'accord qui reviendrait à imposer une désignation proportionnelle au résultat électoral de chaque syndicat : une telle interprétation est contraire aux articles L. 2315-32 et L. 2315-39, dont les dispositions sont d'ordre public (Soc., 11 février 2026, n° 24-16.408).",
      "Consigner au procès-verbal le décompte des voix et le nom des membres désignés.",
    ],
    verifs: [
      { cle: "sst03Ordre", question: "La désignation figurait-elle à l'ordre du jour, et à quelle date celui-ci a-t-il été communiqué ?", attendu: "L'ordre du jour et sa date de communication — trois jours au moins avant la réunion." },
      { cle: "sst03Majorite", question: "Quelle règle de majorité a été appliquée au vote, et quel a été le décompte des voix ?", attendu: "Le décompte, rapporté au nombre de membres présents." },
      { cle: "sst03President", question: "Le président a-t-il pris part au vote ?", attendu: "La mention au procès-verbal ; il n'y participe pas." },
    ],
  },

  "CSE-CTL-SST-04": {
    gravite: 3,
    quoiFaire: "Revenir sur les remplacements de membres de la commission opérés hors des cas de fin anticipée de mandat.",
    risque: "Sauf dans les cas de fin anticipée de mandat énumérés à l'article L. 2314-33, le comité ne peut procéder au remplacement des membres d'une commission santé, sécurité et conditions de travail initialement désignés avant le terme du mandat des membres élus du comité (Soc., 28 mai 2026, n° 24-22.914, publié) ; aucun accord d'entreprise ne peut y déroger, L. 2315-39 étant d'ordre public.",
    delai: "Une réunion du comité pour rétablir la composition.",
    document: "Résolution du comité rétablissant la composition initiale de la commission",
    etapes: [
      "Reprendre chaque remplacement intervenu depuis la désignation initiale et en établir la cause, par écrit.",
      "Confronter cette cause aux fins anticipées de mandat de L. 2314-33 : le décès, la démission, la rupture du contrat de travail, la perte des conditions requises pour être éligible. Le changement de catégorie professionnelle n'en fait pas partie — l'élu conserve son mandat (L. 2314-33).",
      "Pour les remplacements dont la cause ne figure pas dans cette liste, rétablir la composition initiale par une résolution du comité adoptée à la majorité des membres présents (L. 2315-32).",
      "Écarter la stipulation d'accord qui autoriserait un remplacement en dehors de ces cas : L. 2315-39 est d'ordre public (Soc., 28 mai 2026, n° 24-22.914).",
      "Retenir que les mandats des membres de la commission prennent fin avec celui des membres élus du comité (L. 2315-39) : c'est ce terme commun qui commande, et lui seul.",
    ],
    verifs: [
      { cle: "sst04Liste", question: "Quels membres ont été remplacés depuis la désignation initiale, et à quelles dates ?", attendu: "La liste nominative et les dates, avec les procès-verbaux correspondants." },
      { cle: "sst04Cause", question: "Pour chaque remplacement, quelle cause a été retenue ?", attendu: "La cause, confrontée aux quatre fins anticipées de mandat de L. 2314-33." },
      { cle: "sst04Retablissement", question: "Pour les remplacements sans cause admise, la composition initiale a-t-elle été rétablie, et par quelle résolution ?", attendu: "La résolution datée et le procès-verbal qui la porte." },
    ],
  },

  "CSE-CTL-SST-05": {
    gravite: 3,
    quoiFaire: "Ramener la délégation consentie à la commission dans les limites de l'article L. 2315-38 : ni les attributions consultatives, ni le recours à l'expert.",
    risque: "La commission se voit confier, par délégation du comité, tout ou partie des attributions du comité relatives à la santé, à la sécurité et aux conditions de travail, à l'exception du recours à un expert prévu à la sous-section 10 et des attributions consultatives du comité (L. 2315-38). Ces dispositions sont d'ordre public (Soc., 13 mai 2026, n° 25-12.560) : un avis rendu par la seule commission, ou une expertise qu'elle aurait décidée, est irrégulier.",
    delai: "Le temps d'un avenant à l'accord ou d'une modification du règlement intérieur du comité : deux à trois mois.",
    document: "Avenant à l'accord ou au règlement intérieur délimitant la délégation consentie à la commission",
    etapes: [
      "Relire l'acte qui organise la commission — accord de L. 2315-41, accord avec le comité de L. 2315-42, ou règlement intérieur du comité de L. 2315-44 — et isoler les missions déléguées, que le 2° de L. 2315-41 impose de définir.",
      "Retirer de la délégation les attributions consultatives du comité : c'est le comité qui rend ses avis, et lui seul (L. 2315-38).",
      "Retirer de la délégation le recours à l'expert prévu à la sous-section 10 : la commission peut proposer une expertise, le comité seul la décide (L. 2315-38).",
      "Faire adopter l'avenant ou la modification du règlement intérieur, et notifier la nouvelle délimitation aux membres de la commission.",
      "Reprendre, le cas échéant, les avis rendus et les expertises décidées dans l'intervalle par la seule commission : ils doivent l'être par le comité.",
    ],
    verifs: [
      { cle: "sst05Acte", question: "Quel acte organise la commission, et quelles missions y sont déléguées ?", attendu: "L'accord ou le règlement intérieur, avec la clause de délégation citée." },
      { cle: "sst05Avis", question: "Le comité rend-il lui-même ses avis, ou la commission en a-t-elle rendu ?", attendu: "Les procès-verbaux des avis rendus, avec l'instance qui les a émis." },
      { cle: "sst05Expert", question: "Qui a décidé les recours à l'expert intervenus depuis la mise en place de la commission ?", attendu: "Les délibérations de recours, avec leur auteur." },
    ],
  },

  "CSE-CTL-SST-06": {
    gravite: 3,
    quoiFaire: "Faire fixer les modalités de la commission par un accord ou, à défaut d'accord seulement, par le règlement intérieur du comité.",
    risque: "L'accord d'entreprise défini à L. 2313-2 fixe les modalités de mise en place de la commission (L. 2315-41) ; en l'absence de délégué syndical, un accord entre l'employeur et le comité adopté à la majorité des membres titulaires élus (L. 2315-42) ; à défaut d'accord, le règlement intérieur du comité définit ces modalités (L. 2315-44). Une commission sans règles écrites n'a ni missions ni moyens établis, et l'étendue de la délégation qu'elle exerce ne peut pas être vérifiée.",
    delai: "Deux à trois mois pour négocier ; une réunion du comité pour compléter son règlement intérieur.",
    document: "Accord fixant les modalités de la commission, ou chapitre correspondant du règlement intérieur du comité",
    etapes: [
      "Rechercher d'abord l'accord d'entreprise défini à L. 2313-2 : c'est lui que L. 2315-41 désigne en premier.",
      "En l'absence de délégué syndical, envisager l'accord entre l'employeur et le comité, adopté à la majorité des membres titulaires élus de la délégation du personnel du comité (L. 2315-42).",
      "En dehors des cas prévus aux articles L. 2315-36 et L. 2315-37, retenir qu'un accord peut aussi fixer le nombre et le périmètre de mise en place des commissions et définir les mêmes modalités (L. 2315-43).",
      "À défaut d'accord seulement, faire définir ces modalités par le règlement intérieur du comité (L. 2315-44), que le comité détermine lui-même (L. 2315-24).",
      "Vérifier que les six points de L. 2315-41 sont couverts : le nombre de membres ; les missions déléguées et leurs modalités d'exercice ; les modalités de fonctionnement, notamment le nombre d'heures de délégation ; les modalités de formation conformément aux articles L. 2315-16 à L. 2315-18 ; le cas échéant les moyens alloués ; et le cas échéant la formation spécifique correspondant aux risques ou facteurs de risques particuliers en rapport avec l'activité de l'entreprise.",
    ],
    verifs: [
      { cle: "sst06Source", question: "Quel acte fixe les modalités de la commission — accord d'entreprise, accord avec le comité, ou règlement intérieur du comité ?", attendu: "L'acte lui-même, daté." },
      { cle: "sst06Recherche", question: "Si c'est le règlement intérieur, quelle recherche d'accord l'a précédé ?", attendu: "La trace de la négociation, ou le constat de l'absence de délégué syndical." },
      { cle: "sst06Points", question: "Les six points de L. 2315-41 sont-ils tous couverts ?", attendu: "Le renvoi, point par point, aux clauses de l'acte." },
    ],
  },

  "CSE-CTL-SST-07": {
    gravite: 2,
    quoiFaire: "Faire dispenser aux membres de la commission la formation en santé, sécurité et conditions de travail pour la durée minimale applicable.",
    risque: "La formation est d'une durée minimale de cinq jours lors du premier mandat ; en cas de renouvellement, de trois jours pour chaque membre de la délégation du personnel quelle que soit la taille de l'entreprise, et de cinq jours pour les membres de la commission dans les entreprises d'au moins trois cents salariés (L. 2315-18). L'accord qui organise la commission fixe les modalités de cette formation (L. 2315-41, 4°) mais ne peut pas descendre sous ce plancher ; le financement est pris en charge par l'employeur.",
    delai: "Trois à cinq jours de formation à programmer, dans les deux à trois mois.",
    document: "Convocation en formation des membres de la commission et attestations de présence",
    etapes: [
      "Établir, membre par membre, s'il s'agit d'un premier mandat ou d'un renouvellement : c'est cette qualité qui commande la durée.",
      "Retenir la durée : cinq jours lors du premier mandat ; au renouvellement, trois jours, portés à cinq pour les membres de la commission dans les entreprises d'au moins trois cents salariés (L. 2315-18, 1° et 2°).",
      "Vérifier ce que l'accord prévoit au titre du 4° de L. 2315-41 — les modalités de la formation, conformément aux articles L. 2315-16 à L. 2315-18 — et, le cas échéant, la formation spécifique correspondant aux risques ou facteurs de risques particuliers en rapport avec l'activité (L. 2315-41, 6°).",
      "Programmer les jours manquants : le temps consacré aux formations est pris sur le temps de travail, rémunéré comme tel, et n'est pas déduit des heures de délégation (L. 2315-16).",
      "Faire prendre en charge le financement par l'employeur (L. 2315-18, dernier alinéa) et recueillir les attestations de présence.",
    ],
    verifs: [
      { cle: "sst07Mandat", question: "Pour chaque membre de la commission, s'agit-il d'un premier mandat ou d'un renouvellement ?", attendu: "La qualité du mandat, membre par membre." },
      { cle: "sst07Jours", question: "Combien de jours de formation chacun a-t-il suivis, et à quelles dates ?", attendu: "Le nombre de jours et les dates, membre par membre." },
      { cle: "sst07Financement", question: "Les attestations de présence et les justificatifs de prise en charge par l'employeur sont-ils versés ?", attendu: "Les attestations et les factures acquittées par l'employeur." },
    ],
  },

  /* ---------------- Les commissions du comité ---------------- */

  "CSE-CTL-COM-01": {
    gravite: 3,
    quoiFaire: "Constituer, à défaut d'accord, les commissions de la formation, d'information et d'aide au logement et de l'égalité professionnelle.",
    risque: "En l'absence d'accord prévu à l'article L. 2315-45, dans les entreprises d'au moins trois cents salariés, le comité constitue une commission de la formation (L. 2315-49), une commission d'information et d'aide au logement est créée en son sein (L. 2315-50, missions à L. 2315-51) et une commission de l'égalité professionnelle également (L. 2315-56). Ces commissions préparent des délibérations du comité prévues à L. 2312-17 : leur absence prive ces délibérations de leur préparation.",
    delai: "Une réunion du comité pour constituer les trois commissions ; trois à six mois si un accord de L. 2315-45 lui est préféré.",
    document: "Résolution du comité constituant les commissions de la formation, du logement et de l'égalité professionnelle",
    etapes: [
      "Rechercher d'abord l'accord d'entreprise conclu dans les conditions prévues au premier alinéa de L. 2232-12, qui peut prévoir la création de commissions supplémentaires pour l'examen de problèmes particuliers (L. 2315-45) : c'est lui, et lui seul, qui écarte le régime supplétif.",
      "Vérifier le seuil de trois cents salariés, réputé franchi lorsque l'effectif de l'entreprise dépasse ce seuil pendant douze mois consécutifs (L. 2312-34).",
      "À défaut d'accord, constituer la commission de la formation (L. 2315-49), chargée de préparer les délibérations du comité prévues aux 1° et 3° de L. 2312-17 dans les domaines qui relèvent de sa compétence, d'étudier les moyens permettant de favoriser l'expression des salariés en matière de formation et de participer à leur information, et d'étudier les problèmes spécifiques concernant l'emploi et le travail des jeunes et des travailleurs handicapés.",
      "Créer la commission d'information et d'aide au logement (L. 2315-50), dont L. 2315-51 fixe les missions : rechercher les possibilités d'offre de logements correspondant aux besoins du personnel, en liaison avec les organismes habilités à collecter la participation des employeurs à l'effort de construction, informer les salariés sur leurs conditions d'accès à la propriété ou à la location et les assister dans leurs démarches.",
      "Créer la commission de l'égalité professionnelle (L. 2315-56), chargée notamment de préparer les délibérations du comité prévues au 3° de L. 2312-17.",
      "Consigner la constitution de chaque commission au procès-verbal ; les rapports des commissions sont soumis à la délibération du comité (L. 2315-45).",
    ],
    verifs: [
      { cle: "com01Accord", question: "Un accord de L. 2315-45 organise-t-il les commissions du comité ?", attendu: "L'accord daté et déposé, ou la mention expresse qu'il n'en existe pas." },
      { cle: "com01Constituees", question: "Quelles commissions sont effectivement constituées, et par quelle résolution ?", attendu: "La liste et les procès-verbaux de constitution, datés." },
      { cle: "com01Rapports", question: "Quelles délibérations du comité chacune a-t-elle préparées cette année ?", attendu: "Les rapports soumis à la délibération du comité, datés." },
    ],
  },

  "CSE-CTL-COM-02": {
    gravite: 3,
    quoiFaire: "Créer, à défaut d'accord, la commission économique et y désigner au moins un représentant de la catégorie des cadres.",
    risque: "En l'absence d'accord prévu à l'article L. 2315-45, dans les entreprises d'au moins mille salariés, une commission économique est créée au sein du comité ou du comité central (L. 2315-46). Elle comprend au maximum cinq membres représentants du personnel, dont au moins un représentant de la catégorie des cadres, désignés par le comité parmi ses membres (L. 2315-47).",
    delai: "Une réunion du comité.",
    document: "Résolution du comité créant la commission économique et désignant ses membres",
    etapes: [
      "Rechercher d'abord l'accord de L. 2315-45 : L. 2315-46 ne joue qu'« en l'absence d'accord prévu à l'article L. 2315-45 ».",
      "Vérifier le seuil de mille salariés et le niveau auquel la commission doit être créée : au sein du comité social et économique, ou du comité social et économique central (L. 2315-46).",
      "Désigner les membres par une résolution du comité, parmi ses membres : cinq au maximum, dont au moins un représentant de la catégorie des cadres (L. 2315-47). La commission est présidée par l'employeur ou son représentant.",
      "Fixer le calendrier : la commission se réunit au moins deux fois par an (L. 2315-48).",
      "Prévoir ses moyens d'instruction : elle est chargée notamment d'étudier les documents économiques et financiers recueillis par le comité et toute question que ce dernier lui soumet (L. 2315-46) ; elle peut demander à entendre tout cadre supérieur ou dirigeant de l'entreprise après accord de l'employeur, et se faire assister par l'expert-comptable qui assiste le comité et par les experts choisis par lui (L. 2315-48).",
    ],
    verifs: [
      { cle: "com02Accord", question: "Un accord de L. 2315-45 écarte-t-il la commission économique supplétive ?", attendu: "L'accord daté, ou la mention qu'il n'en existe pas." },
      { cle: "com02Membres", question: "Combien de membres la commission économique compte-t-elle, et combien représentent la catégorie des cadres ?", attendu: "Le nombre total — cinq au maximum — et le nombre de cadres, avec la résolution de désignation." },
      { cle: "com02Reunions", question: "À quelles dates la commission s'est-elle réunie cette année ?", attendu: "Les dates ; deux réunions au moins par an." },
    ],
  },

  "CSE-CTL-COM-03": {
    gravite: 4,
    quoiFaire: "Faire créer par le comité une commission des marchés en son sein.",
    risque: "Une commission des marchés est créée au sein du comité qui dépasse, pour au moins deux des trois critères mentionnés au II de L. 2315-64, des seuils fixés par décret (L. 2315-44-1) : le nombre de cinquante salariés à la clôture d'un exercice, le montant de ressources annuelles et le montant du total du bilan que D. 2315-29 retient. Le critère tient aux comptes du comité, non à l'effectif de l'entreprise.",
    delai: "Une réunion du comité, après l'arrêté de ses comptes.",
    document: "Résolution du comité créant la commission des marchés",
    etapes: [
      "Reprendre les comptes du comité à la clôture du dernier exercice : le comité est soumis aux obligations comptables et ses comptes annuels sont établis selon les modalités définies par un règlement de l'Autorité des normes comptables (L. 2315-64, I).",
      "Confronter les trois critères de D. 2315-29 : le nombre de cinquante salariés du comité à la clôture d'un exercice, le montant de ses ressources annuelles, et le montant du total de son bilan.",
      "Si au moins deux des trois seuils sont dépassés, faire adopter par le comité la résolution créant la commission des marchés (L. 2315-44-1), à la majorité des membres présents (L. 2315-32).",
      "Recontrôler à chaque clôture des comptes du comité : le dépassement se constate exercice par exercice, et l'obligation peut naître d'une année sur l'autre.",
    ],
    verifs: [
      { cle: "com03Comptes", question: "À la clôture du dernier exercice, quels sont le nombre de salariés du comité, ses ressources annuelles et le total de son bilan ?", attendu: "Les trois valeurs et les comptes annuels du comité qui les portent." },
      { cle: "com03Seuils", question: "Combien des trois critères de D. 2315-29 sont dépassés ?", attendu: "Le décompte, critère par critère." },
      { cle: "com03Resolution", question: "Si deux critères au moins sont dépassés, à quelle date le comité a-t-il créé la commission des marchés ?", attendu: "La résolution datée et le procès-verbal." },
    ],
  },

  /* ---------------- Budgets ---------------- */

  "CSE-CTL-BUD-01": {
    gravite: 2,
    quoiFaire: "Verser au comité le complément de subvention de fonctionnement nécessaire pour atteindre le taux légal.",
    risque: "La subvention de fonctionnement est d'un montant annuel équivalent à 0,20 % de la masse salariale brute dans les entreprises de cinquante à moins de deux mille salariés, et à 0,22 % dans les entreprises d'au moins deux mille salariés (L. 2315-61). Le complément non versé reste dû.",
    delai: "Le versement se régularise sur l'exercice ; compter un mois pour reconstituer l'assiette.",
    document: "Note de calcul de la subvention de fonctionnement et ordre de versement du complément",
    etapes: [
      "Reconstituer l'assiette : la masse salariale brute est constituée par l'ensemble des gains et rémunérations soumis à cotisations de sécurité sociale, à l'exception des indemnités versées à l'occasion de la rupture du contrat de travail à durée indéterminée (L. 2315-61).",
      "Appliquer le taux de la tranche : 0,20 % de cinquante à moins de deux mille salariés, 0,22 % à partir de deux mille salariés (L. 2315-61).",
      "Vérifier l'imputation : ce montant s'ajoute à la subvention destinée aux activités sociales et culturelles, sauf si l'employeur fait déjà bénéficier le comité d'une somme ou de moyens en personnel équivalents à 0,22 % de la masse salariale brute (L. 2315-61).",
      "Verser le complément et l'inscrire aux comptes annuels du comité, où la somme et ses modalités d'utilisation doivent figurer (L. 2315-61).",
    ],
    verifs: [
      { cle: "bud01Assiette", question: "Quelle masse salariale brute a servi d'assiette, et sur quel exercice ?", attendu: "Le montant et le détail de l'assiette au sens de L. 2315-61." },
      { cle: "bud01Taux", question: "Quel taux a été appliqué, et pour quelle tranche d'effectif ?", attendu: "0,20 % ou 0,22 %, avec l'effectif retenu." },
      { cle: "bud01Versement", question: "Quels montants ont été versés, à quelles dates, et quel complément reste dû ?", attendu: "Les versements datés et le solde." },
    ],
  },

  "CSE-CTL-BUD-02": {
    gravite: 2,
    quoiFaire: "Rétablir la contribution aux activités sociales et culturelles au moins au niveau du rapport de l'année précédente.",
    risque: "La contribution versée chaque année par l'employeur pour financer les institutions sociales du comité est fixée par accord d'entreprise ; à défaut d'accord, le rapport de cette contribution à la masse salariale brute ne peut être inférieur au même rapport existant pour l'année précédente (L. 2312-81). L'insuffisance se mesure en rapport et non en montant : une masse salariale qui progresse plus vite que la contribution suffit à la caractériser.",
    delai: "L'exercice en cours : le complément se verse avant la clôture.",
    document: "Note de calcul du rapport de la contribution aux activités sociales et ordre de versement",
    etapes: [
      "Rechercher d'abord l'accord d'entreprise : c'est lui qui fixe la contribution (L. 2312-81), et le plancher du rapport de l'année précédente ne joue qu'« à défaut d'accord ».",
      "À défaut d'accord, calculer le rapport de l'année précédente : contribution versée divisée par la masse salariale brute du même exercice.",
      "Calculer le rapport de l'exercice en cours sur la même base, pour que la comparaison porte sur des grandeurs homogènes.",
      "Verser le complément nécessaire pour que le rapport de l'exercice ne soit pas inférieur à celui de l'exercice précédent, et l'inscrire aux comptes du comité.",
      "Ne pas confondre ce budget avec celui de fonctionnement : le transfert d'excédent de l'un vers l'autre obéit à ses propres conditions (L. 2315-61, L. 2312-84).",
    ],
    verifs: [
      { cle: "bud02Accord", question: "Un accord d'entreprise fixe-t-il la contribution aux activités sociales et culturelles ?", attendu: "L'accord daté et déposé, ou la mention qu'il n'en existe pas." },
      { cle: "bud02Rapports", question: "Quels sont les rapports de la contribution à la masse salariale brute pour les deux derniers exercices ?", attendu: "Les deux rapports, avec les quatre montants qui les composent." },
      { cle: "bud02Complement", question: "Quel complément a été versé, et à quelle date ?", attendu: "L'ordre de versement daté et son inscription aux comptes du comité." },
    ],
  },

  "CSE-CTL-BUD-03": {
    gravite: 3,
    quoiFaire: "Supprimer la condition d'ancienneté qui commande l'accès aux activités sociales et culturelles.",
    risque: "Le comité assure, contrôle ou participe à la gestion de toutes les activités sociales et culturelles établies dans l'entreprise prioritairement au bénéfice des salariés, de leur famille et des stagiaires (L. 2312-78). Une condition d'ancienneté ferme l'accès à des bénéficiaires que le texte vise, et la décision qui l'institue peut être remise en cause.",
    delai: "Une réunion du comité : c'est lui qui gère les activités sociales et culturelles.",
    document: "Délibération du comité supprimant la condition d'ancienneté",
    etapes: [
      "Recenser les prestations dont l'accès est subordonné à une ancienneté, en reprenant la nomenclature de R. 2312-35 : institutions sociales de prévoyance et d'entraide, activités tendant à l'amélioration des conditions de bien-être, activités de loisirs et organisation sportive, institutions d'ordre professionnel ou éducatif attachées à l'entreprise, services sociaux, et service de santé au travail institué dans l'entreprise.",
      "Faire délibérer le comité sur la suppression de cette condition, à la majorité des membres présents (L. 2315-32) : la gestion de ces activités lui appartient (L. 2312-78).",
      "Vérifier que les stagiaires ne sont pas exclus : L. 2312-78 les vise expressément aux côtés des salariés et de leur famille.",
      "Informer les salariés du nouveau régime d'accès, et reprendre les demandes qui avaient été refusées sur le fondement de la condition supprimée.",
    ],
    verifs: [
      { cle: "bud03Prestations", question: "Quelles prestations étaient subordonnées à une condition d'ancienneté, et laquelle ?", attendu: "La liste des prestations et la durée d'ancienneté exigée." },
      { cle: "bud03Deliberation", question: "À quelle date le comité a-t-il délibéré sur la suppression de cette condition ?", attendu: "La délibération datée et le procès-verbal." },
      { cle: "bud03Stagiaires", question: "Les stagiaires ont-ils accès aux activités sociales et culturelles ?", attendu: "Le règlement d'accès, mentionnant expressément les stagiaires." },
    ],
  },

  /* ---------------- Expertises ---------------- */

  "CSE-CTL-EXP-01": {
    gravite: 2,
    quoiFaire: "Répartir le financement de l'expertise selon le cas de recours, comme l'article L. 2315-80 le prescrit.",
    risque: "Le financement dépend du cas de recours : à la charge de l'employeur pour les consultations mentionnées au 1° de L. 2315-80 ; par le comité sur son budget de fonctionnement à hauteur de 20 % et par l'employeur à hauteur de 80 % pour la consultation prévue à L. 2315-87 et les consultations ponctuelles ; à la charge de l'employeur lorsque le budget de fonctionnement est insuffisant pour couvrir le coût et n'a pas donné lieu à un transfert d'excédent annuel vers le budget des activités sociales et culturelles au cours des trois années précédentes (L. 2315-80, 3°).",
    delai: "À la facturation de l'expert : la répartition se corrige avant paiement.",
    document: "Note de répartition du financement de l'expertise",
    etapes: [
      "Qualifier le cas de recours : c'est lui, et non la nature du rapport rendu, qui commande la répartition (L. 2315-80).",
      "Appliquer la règle correspondante : prise en charge par l'employeur pour les cas du 1°, répartition à 20 % pour le comité et 80 % pour l'employeur pour ceux du 2°.",
      "Si le budget de fonctionnement du comité est insuffisant pour couvrir la part qui lui revient, vérifier la condition du 3° : l'absence de transfert d'excédent annuel vers le budget destiné aux activités sociales et culturelles au cours des trois années précédentes (L. 2315-80, 3°, et L. 2312-84).",
      "Retenir la conséquence attachée à ce cas : lorsque le financement est pris en charge par l'employeur en application du 3° de L. 2315-80, le comité ne peut pas décider de transférer d'excédents du budget de fonctionnement au financement des activités sociales et culturelles pendant les trois années suivantes (L. 2315-61).",
      "Corriger la répartition et régulariser les paiements déjà effectués.",
    ],
    verifs: [
      { cle: "exp01Cas", question: "Sur quel cas de recours l'expertise est-elle fondée ?", attendu: "Le cas, avec la délibération du comité qui le vise." },
      { cle: "exp01Part", question: "Quelle part chacun a-t-il supportée, et pour quel montant ?", attendu: "Les montants et les justificatifs de paiement." },
      { cle: "exp01Transferts", question: "Le comité a-t-il transféré un excédent du budget de fonctionnement vers les activités sociales et culturelles au cours des trois derniers exercices ?", attendu: "Les délibérations de transfert, ou leur absence, sur trois exercices." },
    ],
  },

  "CSE-CTL-EXP-02": {
    gravite: 3,
    quoiFaire: "Saisir le juge judiciaire dans le délai de dix jours si l'expertise doit être contestée, et tirer les conséquences d'un délai expiré.",
    risque: "L'employeur saisit le juge dans un délai de dix jours (R. 2315-49), et le point de départ varie selon l'objet contesté (L. 2315-86). Passé ce délai, la contestation n'est plus recevable et la délibération du comité s'impose.",
    delai: "Dix jours à compter de l'acte contesté : la délibération, la désignation de l'expert, ou la notification selon le cas.",
    document: "Assignation en contestation de l'expertise",
    etapes: [
      "Identifier ce qui est contesté : la nécessité de l'expertise se conteste à compter de la délibération du comité décidant le recours ; le choix de l'expert, à compter de sa désignation par le comité ; le coût prévisionnel, l'étendue ou la durée, à compter de la notification à l'employeur du cahier des charges et des informations que le 3° de L. 2315-86 mentionne ; le coût final, à compter de sa notification à l'employeur (L. 2315-86, 1° à 4°).",
      "Dater précisément l'acte de départ : c'est de lui que court le délai de dix jours (R. 2315-49), et non de la réunion où le sujet a été évoqué.",
      "Saisir le juge dans ce délai ; dans les cas 1° à 3°, il statue suivant la procédure accélérée au fond dans les dix jours suivant sa saisine, et sa décision n'est pas susceptible d'appel (L. 2315-86).",
      "Retenir l'effet suspensif : la saisine suspend l'exécution de la décision du comité, ainsi que les délais dans lesquels il est consulté en application de L. 2312-15, jusqu'à la notification du jugement (L. 2315-86).",
      "Si le délai est expiré, ne pas engager une contestation irrecevable : reprendre le calendrier de la consultation en tenant la délibération pour acquise.",
    ],
    verifs: [
      { cle: "exp02Objet", question: "Que conteste l'employeur — la nécessité de l'expertise, le choix de l'expert, le coût prévisionnel, l'étendue, la durée, ou le coût final ?", attendu: "L'objet, rattaché à l'un des quatre cas de L. 2315-86." },
      { cle: "exp02Depart", question: "Quelle est la date de l'acte qui fait courir le délai pour cet objet ?", attendu: "La date de la délibération, de la désignation ou de la notification, avec la pièce correspondante." },
      { cle: "exp02Saisine", question: "À quelle date le juge a-t-il été saisi ?", attendu: "La date de l'assignation ; l'écart avec l'acte de départ ne peut excéder dix jours." },
    ],
  },

  "CSE-CTL-EXP-03": {
    gravite: 3,
    quoiFaire: "Rattacher l'expertise au fondement qui la prévoit, ou renoncer à celle qui n'en a pas.",
    risque: "Le recours à l'expertise dans le cadre d'un licenciement collectif suppose, dans les entreprises d'au moins cinquante salariés, un projet concernant au moins dix salariés dans une même période de trente jours (L. 1233-34). Lorsque l'introduction de nouvelles technologies ou un projet important entraîne des licenciements économiques donnant lieu à un plan de sauvegarde de l'emploi, la faculté de recourir à une expertise portant sur l'incidence du projet sur les conditions de santé, de sécurité et de travail ne peut s'exercer que dans les conditions de L. 1233-34 : une délibération distincte fondée sur L. 2315-94, 2°, est nulle (Soc., 18 mars 2026, n° 23-22.270, publié).",
    delai: "Immédiat : la délibération se reprend à la réunion suivante.",
    document: "Délibération du comité rectifiant le fondement du recours à l'expertise",
    etapes: [
      "Établir le nombre de licenciements envisagés dans une même période de trente jours et l'effectif de l'entreprise : ce sont les deux conditions de L. 1233-34.",
      "Si le seuil de dix salariés sur trente jours n'est pas atteint, ne pas fonder l'expertise sur L. 1233-34 : rechercher un autre cas de recours, ou renoncer.",
      "Si un projet important ou l'introduction de nouvelles technologies entraîne des licenciements économiques donnant lieu à un plan de sauvegarde de l'emploi, décider l'expertise lors de la première réunion à laquelle L. 1233-34 subordonne ce recours, et non par une délibération distincte fondée sur L. 2315-94, 2° (Soc., 18 mars 2026, n° 23-22.270).",
      "Pour les autres cas, vérifier que le fondement invoqué existe : risque grave, identifié et actuel, constaté dans l'établissement ; introduction de nouvelles technologies ou projet important modifiant les conditions de santé et de sécurité ou les conditions de travail, prévus au 4° du II de L. 2312-8 ; préparation de la négociation sur l'égalité professionnelle dans les entreprises d'au moins trois cents salariés (L. 2315-94, 1° à 3°) ; ou désignation d'un expert-comptable dans l'un des cas énumérés au I de L. 2315-92.",
      "Reprendre la délibération en visant le fondement exact, et la consigner au procès-verbal.",
    ],
    verifs: [
      { cle: "exp03Nombre", question: "Combien de licenciements sont envisagés, et sur quelle période de trente jours ?", attendu: "Le nombre et les dates de la période." },
      { cle: "exp03Fondement", question: "Quel fondement la délibération du comité vise-t-elle ?", attendu: "La délibération et l'article qu'elle vise." },
      { cle: "exp03Pse", question: "Le projet donne-t-il lieu à un plan de sauvegarde de l'emploi, et à quelle date s'est tenue la première réunion à laquelle L. 1233-34 renvoie ?", attendu: "La réponse et la date de cette première réunion." },
    ],
  },

  "CSE-CTL-EXP-04": {
    gravite: 3,
    quoiFaire: "Faire prendre la décision de recourir à l'expertise par le comité lui-même.",
    risque: "Le recours à un expert prévu à la sous-section 10 est expressément exclu des attributions qui peuvent être déléguées à la commission santé, sécurité et conditions de travail, et L. 2315-38 est d'ordre public (Soc., 13 mai 2026, n° 25-12.560). Le comité décide, le cas échéant sur proposition des commissions constituées en son sein (L. 1233-34). Une décision prise par la commission, ou attribuée à l'employeur, est irrégulière.",
    delai: "Une réunion du comité.",
    document: "Délibération du comité décidant le recours à l'expertise",
    etapes: [
      "Établir qui a pris la décision et sur quelle pièce : la délibération du comité, un compte rendu de la commission, ou une décision de l'employeur.",
      "Si la décision émane de la commission santé, sécurité et conditions de travail, la reprendre : la commission peut proposer l'expertise, le comité seul la décide (L. 2315-38, L. 1233-34).",
      "Si elle est attribuée à l'employeur, la reprendre également : le recours à l'expert est une prérogative du comité, qui en délibère ; l'employeur, lui, peut la contester devant le juge dans les dix jours (L. 2315-86, R. 2315-49).",
      "Inscrire le point à l'ordre du jour et faire délibérer le comité à la majorité des membres présents, le président ne prenant pas part au vote lorsqu'il consulte les membres élus en tant que délégation du personnel (L. 2315-32).",
      "Consigner au procès-verbal la proposition éventuelle de la commission et la délibération du comité : c'est là ce que les commissions apportent à l'expertise, et la seule chose qu'elles y apportent.",
    ],
    verifs: [
      { cle: "exp04Auteur", question: "Qui a décidé le recours à l'expertise, et par quel acte ?", attendu: "L'acte lui-même : délibération du comité, compte rendu de commission ou décision de l'employeur." },
      { cle: "exp04Deliberation", question: "À quelle date le comité a-t-il délibéré, et quel a été le décompte des voix ?", attendu: "La date et le procès-verbal portant le décompte." },
      { cle: "exp04Proposition", question: "La commission a-t-elle proposé l'expertise, et cette proposition figure-t-elle au procès-verbal ?", attendu: "La mention de la proposition, distincte de la décision du comité." },
    ],
  },

  /* ---------------- À faire examiner ---------------- */

  "CSE-CTL-DET-01": {
    gravite: 3,
    quoiFaire: "Faire examiner les accords collectifs applicables au comité, et écarter toute clause qui le priverait d'une prérogative légale.",
    risque: "Un accord peut légalement aménager le contenu, la périodicité, les modalités et les niveaux des consultations récurrentes (L. 2312-19), mais non priver le comité d'une prérogative que la loi lui reconnaît. L'action en nullité de tout ou partie d'un accord doit, à peine d'irrecevabilité, être engagée dans un délai de deux mois à compter de la notification de l'accord aux organisations disposant d'une section syndicale ou, dans tous les autres cas, de sa publication (L. 2262-14) ; passé ce délai, l'illégalité peut encore être invoquée par voie d'exception.",
    delai: "Deux mois pour l'action en nullité, à compter de la notification ou de la publication de l'accord ; sans condition de délai pour l'exception d'illégalité.",
    document: "Note d'analyse des clauses de l'accord au regard des prérogatives légales du comité",
    etapes: [
      "Recenser les accords applicables au comité et relever, pour chacun, la date de notification aux organisations disposant d'une section syndicale et la date de publication : ce sont ces dates qui ouvrent le délai de deux mois (L. 2262-14, 1° et 2°).",
      "Confronter chaque clause aux textes d'ordre public que le module cite : la délégation consentie à la commission santé, sécurité et conditions de travail ne peut porter ni sur les attributions consultatives du comité, ni sur le recours à l'expert (L. 2315-38) ; la désignation des membres de cette commission obéit à L. 2315-39 et L. 2315-32.",
      "Vérifier, à l'inverse, ce qu'un accord peut légitimement faire : définir le contenu, la périodicité — au plus trois ans —, les modalités et les niveaux des consultations récurrentes, la liste et le contenu des informations nécessaires, le nombre de réunions annuelles qui ne peut être inférieur à six, et les délais dans lesquels les avis sont rendus (L. 2312-19).",
      "Faire relire l'accord par un professionnel : la base ne lit pas les stipulations, elle signale qu'elles existent.",
      "Selon le délai restant, engager l'action en nullité dans les deux mois de L. 2262-14, ou préparer l'exception d'illégalité, qui n'est enfermée dans aucun délai.",
    ],
    verifs: [
      { cle: "det01Accords", question: "Quels accords collectifs sont applicables au comité, et à quelles dates ont-ils été notifiés puis publiés ?", attendu: "La liste des accords avec, pour chacun, la date de notification et celle de publication." },
      { cle: "det01Clauses", question: "Quelles clauses touchent aux prérogatives du comité — consultations, délégation à la commission, désignation, expertise ?", attendu: "Les clauses citées, article par article de l'accord." },
      { cle: "det01Examen", question: "Qui a examiné ces clauses, et à quelle date ?", attendu: "La note d'analyse, datée et signée." },
    ],
  },

  /* Ce contrôle signale une situation, il ne constate aucun manquement de
     l'employeur : un contentieux pendant devant le juge n'est pas une
     irrégularité à régulariser, et le dépôt ne dispose d'aucun texte capté qui
     en commanderait le traitement. Le rapport le porte déjà au chapitre des
     sujets à faire examiner, avec la consigne de le soumettre au conseil avant
     toute décision ; il n'y a rien à écrire de plus ici sans l'inventer. */
  "CSE-CTL-DET-02": null,

  "CSE-CTL-DET-03": {
    gravite: 1,
    quoiFaire: "Faire cesser les faits signalés, accomplir l'acte omis et consigner les mesures prises.",
    risque: "Le fait d'apporter une entrave soit à la constitution d'un comité social et économique, d'un comité d'établissement ou d'un comité central, soit à la libre désignation de leurs membres, notamment par la méconnaissance des dispositions des articles L. 2314-1 à L. 2314-9, est puni d'un emprisonnement d'un an et d'une amende de 7 500 € ; le fait d'apporter une entrave à leur fonctionnement régulier est puni d'une amende de 7 500 € (L. 2317-1).",
    delai: "Immédiat pour faire cesser les faits ; le temps propre à l'acte omis pour la régularisation.",
    document: "Note de constat des faits signalés et des mesures prises",
    etapes: [
      "Recenser les faits signalés et les dater un par un : c'est la date qui dira s'ils se poursuivent ou s'ils sont épuisés.",
      "Distinguer ce que le texte distingue : l'entrave à la constitution ou à la libre désignation des membres d'une part, l'entrave au fonctionnement régulier d'autre part — les peines ne sont pas les mêmes (L. 2317-1).",
      "Faire cesser immédiatement ce qui peut l'être : rétablir les moyens retirés, convoquer la réunion non tenue, communiquer l'information non remise.",
      "Accomplir l'acte omis dans les formes qui lui sont propres et le consigner au procès-verbal du comité : c'est la régularisation qui compte, non la déclaration d'intention.",
      "Faire examiner les faits par un professionnel : l'entrave est une infraction pénale, et la base détecte sans qualifier.",
    ],
    verifs: [
      { cle: "det03Faits", question: "Quels faits ont été signalés, et à quelles dates sont-ils survenus ?", attendu: "La liste datée des faits." },
      { cle: "det03Cessation", question: "Quelles mesures ont été prises pour y mettre fin, et à quelle date ?", attendu: "Les mesures datées et les pièces qui les établissent." },
      { cle: "det03Acte", question: "L'acte omis a-t-il été accompli, et consigné au procès-verbal du comité ?", attendu: "L'acte et le procès-verbal qui le porte." },
    ],
  },
};

/* La règle du dépôt : l'oubli se voit. Tout contrôle doit avoir une entrée,
   fût-elle null, et toute entrée doit correspondre à un contrôle. On vérifie en
   outre que les clés de vérification sont uniques dans tout le fichier : la
   page recueille les réponses dans un seul objet, et deux clés identiques y
   feraient répondre un contrôle à la place d'un autre. */
const ECARTS = [];
for (const c of C)
  if (!Object.prototype.hasOwnProperty.call(R, c.id))
    ECARTS.push(`le contrôle ${c.id} n'a pas d'entrée de régularisation (fût-ce à null)`);
for (const id of Object.keys(R))
  if (!C.some(c => c.id === id))
    ECARTS.push(`l'entrée de régularisation ${id} ne correspond à aucun contrôle`);
const CLES = new Map();
for (const [id, r] of Object.entries(R)) {
  if (r === null) continue;
  for (const champ of ["gravite", "quoiFaire", "risque", "delai", "etapes", "verifs"])
    if (r[champ] === undefined || r[champ] === null || r[champ] === "")
      ECARTS.push(`${id} : le champ « ${champ} » manque`);
  if (!GRAVITES[r.gravite]) ECARTS.push(`${id} : gravité « ${r.gravite} » inconnue`);
  if (Array.isArray(r.etapes) && r.etapes.length < 2)
    ECARTS.push(`${id} : une procédure d'une seule étape n'accompagne personne`);
  if (Array.isArray(r.verifs)) {
    if (!r.verifs.length) ECARTS.push(`${id} : aucune vérification n'est écrite`);
    for (const v of r.verifs) {
      if (!v.cle || !v.question || !v.attendu)
        ECARTS.push(`${id} : une vérification est incomplète (clé, question, attendu)`);
      if (v.cle && CLES.has(v.cle))
        ECARTS.push(`${id} : la clé de vérification « ${v.cle} » sert déjà à ${CLES.get(v.cle)}`);
      if (v.cle) CLES.set(v.cle, id);
    }
  }
}

module.exports = { R, GRAVITES, ECARTS };

if (require.main === module) {
  const aRegulariser = Object.values(R).filter(x => x !== null).length;
  const verifs = Object.values(R).filter(x => x).reduce((n, x) => n + x.verifs.length, 0);
  console.log(`${C.length} contrôle(s) · ${aRegulariser} régularisation(s) · ${verifs} vérification(s)`);
  if (ECARTS.length) { ECARTS.forEach(e => console.log("ÉCART — " + e)); process.exit(1); }
  console.log("chaque contrôle a son issue, et chaque issue son contrôle");
}
