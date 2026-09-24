# -*- coding: utf-8 -*-
"""Le livre en regard : page de gauche le texte, page de droite le document.

Chaque entrée : le chapitre, le titre de la page, le corps (un paragraphe qui
commence par "> " est une citation détachée), puis le document du vis-à-vis.
fac = fichier du dossier fac/ ; None = page de réserve, avec la référence de
la pièce à insérer.
"""

SPREADS = [

{"ch": "INTRODUCTION", "titre": "Un mythe à Béja",
 "t": [
  "Le stade de football de Béja porte son nom. On l'écrit Boujemaa Lokmiti, ou Kmiti, selon les graphies. C'est le point de départ de ce livre, et c'est aussi son énigme.",
  "Dans les centaines d'articles de la presse française dépouillés pour ce travail, entre 1930 et 1950, ce nom de famille n'apparaît qu'une seule fois, sous une forme déformée, dans un bulletin de la Fédération de juillet 1936. Partout ailleurs, pendant douze ans, il n'est que Boudjemaa, parfois Boudjema, parfois Boudjéma, et souvent seulement « le Nord-Africain ».",
  "Un homme dont une ville a donné le nom à son stade, et dont les journaux du pays où il a joué toute sa carrière n'ont jamais imprimé le nom de famille : c'est de cet écart que ce livre est né.",
  "La photographie de la page suivante est la plus ancienne image connue de son club. Elle a été prise à l'occasion du match du 8 février 1931, en Coupe de l'Afrique du Nord, à Bône : Bône 2, U.S. Béja 0. Sa légende ne nomme personne. Impossible, donc, de dire lequel de ces onze hommes est Martinelli I, lequel est Martinelli II, et si Boudjemaa y figure. Une photographie légendée est recherchée.",
 ],
 "fac": "USBeja-1931-planche.jpg",
 "leg": "L'équipe de l'Union Sportive Béjaoise.",
 "src": "L'Afrique du Nord illustrée, 28 février 1931, page 7. Cliché Photo-Sultan, Béja. Gallica, Bibliothèque nationale de France."},

{"ch": "INTRODUCTION", "titre": "Ce que l'auteur apportera",
 "t": [
  "Trois parties de cette introduction ne peuvent pas s'écrire ailleurs que dans la mémoire de l'auteur, et elles restent donc ouvertes à ce stade du manuscrit.",
  "La première est sa vie à Béja et les matchs qu'il allait voir enfant, avec les noms des joueurs de ces années-là. Aucune archive ne les donne : il faut que cela vienne de lui.",
  "La deuxième est Mounir Ben Sakhria, l'ami, le président, celui à qui ce livre est dédié. Le dossier de recherche ne contient rien sur lui, ni date, ni fonction précise, ni récit.",
  "La troisième est le tournoi Boudjemaa, avec entre autres le Club Sportif Sfaxien et Hamadi Agrebi. Il n'existe à ce jour dans le dossier ni règlement, ni palmarès, ni date de fondation, ni coupure de presse sur ce tournoi.",
  "En regard, le derby de Béja tel que le racontait la presse de Tunis dans les années trente. C'est le football que voyaient les enfants de la ville, et celui d'où il est sorti.",
 ],
 "fac": "PetitMatin-1934-derby-Beja.jpg",
 "leg": "Le derby de Béja.",
 "src": "Le Petit Matin, Tunis, 1934. Gallica, Bibliothèque nationale de France."},

{"ch": "1. LA NAISSANCE", "titre": "Le jour, le lieu",
 "t": [
  "Mohamed Boudjemaa est né le 13 août 1914 à Béja, et plus précisément à Henchir El Hania.",
  "C'est la formule retenue pour ce livre. Voici ce qui la fonde.",
  "La date et le lieu viennent de son acte de décès, dressé à Colmar le 30 mai 1947, registre des décès de l'année 1947, acte numéro 464. C'est le seul document d'état civil qu'on ait sur lui.",
  "> Le vingt-neuf mai mil neuf cent quarante-sept, vingt-trois heures trente minutes, est décédé, 39, Avenue de la Liberté, Ben Mohamed Ben Brahim Ben El Djilani BOUDJEMAA, domicilié à Colmar, 2, Place de la Cathédrale, né à Henchi-el-Henaia, Tunisie, le treize août mil neuf cent quatorze, footballeur professionnel, fils de père et mère dont les noms, prénoms, professions et le domicile ne sont pas connus du déclarant, célibataire.",
  "La notice de l'Association Sportive de Saint-Étienne écrit le même lieu autrement : « né le 13 août 1914 à Henchir El Hania ». Les deux graphies sont la même chose, transcrite deux fois d'oreille par deux administrations différentes.",
 ],
 "fac": None,
 "leg": "Acte de décès numéro 464, mairie de Colmar, registre de l'année 1947.",
 "src": "Photocopie certifiée conforme le 29 novembre 2012. Pièce du dossier de l'auteur, « Documents transmis par OGC Nice »."},

{"ch": "1. LA NAISSANCE", "titre": "Béja ou Henchir El Hania",
 "t": [
  "Le Petit Parisien du 27 avril 1939 écrit simplement : « Mohammed, un de plus, est né à Béja, en Tunisie ». Ce n'est pas une contradiction.",
  "Un henchir est un domaine agricole, une ferme et ses terres, pas un village. Personne, hors d'un registre, ne dit qu'il est né dans un henchir : on donne la ville dont il dépend, et ici c'est Béja. Ce n'est même pas un hameau comme El Menchar, qui, lui, a un nom sur les cartes. Les journaux qui écrivent Béja ne se trompent donc pas, ils abrègent, comme abrège tout le monde.",
  "Le lieu précis est celui que porte l'acte de décès, et il faut continuer à le chercher là où il est : dans la campagne autour de Béja.",
  "L'article qui figure en regard est de Claude Thuillard. C'est le seul portrait de lui qu'un grand quotidien français ait publié de son vivant, avec sa photographie. On y lit la phrase qui dit le mieux ce qu'il représentait chez lui : « Quelle joie alors à Béja et en Tunisie aussi ! »",
 ],
 "fac": "PetitParisien-1939-article.jpg",
 "leg": "Le portrait de Claude Thuillard.",
 "src": "Le Petit Parisien, 27 avril 1939, page 6, colonnes 4 et 5. Gallica, ark:/12148/bpt6k6836529."},

{"ch": "1. LA NAISSANCE", "titre": "Le récit d'une recherche qui n'a pas abouti",
 "t": [
  "Il faut dire comment on a cherché, parce que le résultat est un manque et qu'un manque se démontre.",
  "La « Nomenclature et répartition des tribus de Tunisie », publiée en 1900 par le Secrétariat général du Gouvernement tunisien, donne pour le contrôle civil de Béja, caïdat de Béja, cheikhat d'El Menchar, fraction des Oulad Bellil, la liste des lieux de résidence ou de campement. El Henaïa y figure, entre Ez Zendala et Q'çar Sād. La même mention revient pour les cheikhats d'Azra et d'Arab Madjour. Le nom existe donc bien, en 1900, dans la campagne de Béja, et dans trois cheikhats à la fois.",
  "Les Archives de l'Institut Pasteur de Tunis publiaient chaque année la liste des localités d'origine des personnes mordues et traitées. Trois années portent El Henaïa dans le contrôle de Béja : 1923, un cas ; 1925, deux cas ; 1926, trois cas. Ce sont, à ce jour, les seules attestations d'El Henaïa comme lieu où des gens vivaient, dans les années mêmes où il y est né et y a grandi.",
  "Le « Vocabulaire arabe-français des principaux termes de géographie » de 1882 donne : « Henia, el henaya : coude de rivière. » C'est une description de terrain, pas un nom propre unique, et cela explique qu'on le retrouve un peu partout.",
 ],
 "fac": None,
 "leg": "Carte de Tunisie au 1/50 000, feuille Béja numéro 18.",
 "src": "Deuxième édition Army Map Service, Geographical Section General Staff numéro 4225, War Office, 1942, d'après une carte française de 1936. Perry-Castañeda Map Collection, université du Texas."},

{"ch": "1. LA NAISSANCE", "titre": "Ce que les cartes ne portent pas",
 "t": [
  "La feuille Béja de la carte au 1/50 000 a été dépouillée carré par carré, seize carrés lus un par un. El Henaïa n'y figure pas.",
  "Y figurent en revanche plusieurs noms de la liste de 1900 : le douar Oulad Bellil au nord-est de Béja, entre l'Oued Bezdine et le Djebel Hadeb ; le douar El Faouar et Aïn Chalou à côté ; Bordj Mrhaoui à la sortie est de la ville ; El Houfia à six kilomètres à l'est ; et Menchar, chef-lieu de cheikhat, à une douzaine de kilomètres à l'est, avec son bureau télégraphique. L'explication est simple : les topographes ont porté les douars bâtis et laissé de côté les lieux de campement.",
  "Quatre homonymes ont été écartés : le Henchir El Hania de Kalaâ Kebira, dans le Sahel ; le Henchir Henaya d'Oued Ellil, cheikhat de La Manouba ; El Hania d'Ouled Haffouz, dans le gouvernorat de Sidi Bouzid ; et Hennaya près de Tlemcen, en Algérie.",
  "Les listes officielles des prisonniers de guerre français, cent fascicules de 1940 et 1941, ont été dépouillées : il n'y figure pas. On y trouve en revanche « Hania (Tun.) » comme lieu de naissance de plusieurs tirailleurs tunisiens nés entre 1912 et 1917, ce qui prouve que la graphie était administrative et courante.",
  "Trois sources trancheraient, et les trois sont en Tunisie : son acte de naissance à Béja, le registre foncier, et les listes de bureaux de vote de l'ISIE, qui descendent au niveau du douar.",
 ],
 "fac": "USBeja-1931-texte.jpg",
 "leg": "La légende et les compositions du match de Bône.",
 "src": "L'Afrique du Nord illustrée, 28 février 1931, page 7. Gallica, Bibliothèque nationale de France."},

{"ch": "1. LA NAISSANCE", "titre": "L'Union Sportive Béjaoise, et Martinelli",
 "t": [
  "Son club formateur est l'Union Sportive Béjaoise. La fiche de l'OGC Nice le dit sans ambiguïté. La notice de Saint-Étienne donne ensuite l'ordre complet de ses clubs, et c'est la seule source qui le donne : U.S. Béjaoise, E.S. Tunis, Club Africain, Sfax, Club Tunisien, O.G.C. Nice, A.S. Saint-Étienne, U.S. Béjaoise, Colmar, Nice, Espérance Tunis, Colmar.",
  "La composition de l'U.S.B. publiée le 28 février 1931 donne Martinelli II demi et Martinelli I capitaine, avant. Celle du 30 juillet 1932, pour le match de Souk-Ahras, donne la même répartition, avec Boudjemaa dans la ligne d'avants, à côté de Martinelli I. C'est le même homme qui mène l'attaque, et le jeune Boudjemaa joue à ses côtés.",
  "Ce qui reste à trouver sur lui : son prénom, et son départ pour les Amériques.",
  "En regard, les juniors de l'U.S. Béja dans Le Petit Matin de Tunis. C'est l'équipe d'où il sort, photographiée deux ou trois ans avant qu'on imprime son nom pour la première fois.",
 ],
 "fac": "PetitMatin-1931-USBeja-juniors.jpg",
 "leg": "Les juniors de l'Union Sportive Béjaoise.",
 "src": "Le Petit Matin, Tunis, 1931. Gallica, Bibliothèque nationale de France."},

{"ch": "1. LA NAISSANCE", "titre": "Souk-Ahras, 30 juillet 1932",
 "t": [
  "C'est la première trace de Boudjemaa sur un terrain. Il a dix-sept ans.",
  "Le compte rendu de Rapid C.M. Souk-Ahras contre U.S. Béja, publié par le Souk-Ahras républicain du 30 juillet 1932, le donne dans la ligne d'avants béjaoise, à côté de Martinelli I.",
  "Rien, avant cette date, ne porte son nom. Rien dans la presse de Tunis, rien dans celle d'Algérie, rien dans les hebdomadaires sportifs. Ce jour de juillet 1932 est le premier jour de sa vie publique, et il a lieu non pas chez lui, mais de l'autre côté de la frontière, dans une ville de l'est algérien.",
  "Le fac-similé est donné en deux pages, parce que l'article court sur deux colonnes de longueur inégale. La seconde page suit.",
 ],
 "fac": "SoukAhras-1932-p1.jpg",
 "leg": "Rapid C.M. Souk-Ahras contre U.S. Béja, première partie.",
 "src": "Le Souk-Ahras républicain, 30 juillet 1932. Gallica, Bibliothèque nationale de France."},

{"ch": "1. LA NAISSANCE", "titre": "Souk-Ahras, la suite du compte rendu",
 "t": [
  "La seconde partie du même compte rendu.",
  "Il faut noter ici ce qui manque, et le noter une fois pour toutes : entre juillet 1932 et novembre 1935, c'est-à-dire entre ses dix-sept et ses vingt et un ans, la presse française ne le nomme pas. Trois ans et demi de sa vie sportive ne sont documentés par aucune source consultée.",
  "La notice de Saint-Étienne place dans cet intervalle l'Espérance Sportive de Tunis, le Club Africain, Sfax et le Club Tunisien, sans aucune date. C'est le premier des grands trous de cette biographie, et il se comblera, s'il se comble, dans les archives tunisiennes.",
  "Une seule chose est sûre pour cette période : il a joué en Tunisie, il y a été assez remarqué pour qu'un gardien de but niçois, Raoul Chaisaz, le ramène avec lui à la fin de 1935 et l'emploie dans son entreprise.",
 ],
 "fac": "SoukAhras-1932-p2.jpg",
 "leg": "Rapid C.M. Souk-Ahras contre U.S. Béja, seconde partie.",
 "src": "Le Souk-Ahras républicain, 30 juillet 1932. Gallica, Bibliothèque nationale de France."},

{"ch": "1. LA NAISSANCE", "titre": "Deux clubs, et non pas un",
 "t": [
  "L'Union Sportive Béjaoise et l'Olympique de Béja ont longtemps été confondus, y compris dans ce travail. Ils ne sont pas le même club.",
  "La preuve tient en une page : celle des résultats du football tunisien du 24 octobre 1949, qui porte les deux noms le même jour et dans la même compétition, l'U.S. Béja en Coupe de Tunisie contre l'U.S.T., et l'Olympique contre l'A.S.F., dans un compte rendu qui parle des « Tricolores béjaois ».",
  "Une réserve doit être faite, et elle est sérieuse : la reconnaissance de caractères de cette page mêle les colonnes et disloque l'ordre des mots, au point qu'aucune phrase entière n'en est reproductible telle quelle. Les deux noms de clubs sont lisibles et la démonstration tient, mais les citations exactes demandent la lecture de l'image.",
  "En regard, la coupure de L'Avenir de Souk-Ahras de 1934 sur l'Olympique de Béja : c'est l'autre club, celui qui n'est pas le sien.",
 ],
 "fac": "AvenirSoukAhras-1934-OBeja.jpg",
 "leg": "L'Olympique de Béja.",
 "src": "L'Avenir de Souk-Ahras, 1934. Gallica, Bibliothèque nationale de France."},


{"ch": "2. SOLLICITÉ EN FRANCE, VICTIME DE SON TALENT", "titre": "Les deux contrats",
 "t": [
  "Le 2 juillet 1936, il signe un contrat et une licence de joueur professionnel à l'Olympique Gymnaste Club de Nice, où il jouait comme amateur depuis novembre 1935. Le 4 juillet, il signe une licence professionnelle à l'Association Sportive de Saint-Étienne, à Tunis même.",
  "La pièce qui fixe tout est la liste des demandes de licences de joueurs professionnels parvenues à la Fédération française de football association, publiée le 15 juillet 1936. Elle porte les deux, Nice et Saint-Étienne, dans la même colonne, et sous deux noms qui ne sont pas tout à fait le même :",
  "> O.G.C. Nice. - Boudjemaa Mohamed (Français).   A.S. Saint-Etienne. - Boudjemaa Ben Mohamed el Memiti (Français).",
  "Il faut se représenter ce que cela veut dire. Ce jour-là, la Fédération a imprimé deux fois le même homme, à deux lignes de distance, sous deux identités légèrement différentes, et personne ne l'a remarqué. Tout ce qui va suivre, la plainte, les commissions, la suspension, l'argent à rendre, tient dans ces deux lignes.",
 ],
 "fac": "Football-1936-deux-licences.jpg",
 "leg": "La liste des demandes de licences de joueurs professionnels.",
 "src": "Football, 15 juillet 1936. Gallica, Bibliothèque nationale de France."},

{"ch": "2. SOLLICITÉ EN FRANCE, VICTIME DE SON TALENT", "titre": "« El Memiti »",
 "t": [
  "La même liste a été reprise par Le Forez sportif, l'hebdomadaire sportif de la région stéphanoise, dans son numéro du 22 juillet 1936, page 3, sous l'annonce : « Voici la deuxième liste des demandes de licences de joueurs professionnels français et étrangers parvenues à la F.F.F.A. ». Les deux lignes s'y suivent, l'une sous l'autre.",
  "Cette ligne-là mérite qu'on s'y arrête, parce que c'est la seule fois, dans tout ce dépouillement, que la presse française imprime autre chose que « Boudjemaa ».",
  "« El Memiti » : à la loupe, c'est bien un M majuscule, le même que celui de Mohamed sur la même ligne. Mais le stade de Béja s'appelle stade Boujemaa Kmiti, un K de plomb mal venu se lit très facilement en M, et « Memiti » n'a d'existence nulle part ailleurs. C'est donc probablement Kmiti. Je ne l'affirme pas : il faudrait l'acte de naissance ou un document tunisien pour le dire.",
  "C'est, en tout état de cause, la seule apparition de son nom de famille dans douze ans de presse française.",
 ],
 "fac": "fac-forez-1936.jpg",
 "leg": "« A.S. Saint-Etienne. - Boudjemaa Ben Mohamed el Memiti (Français). »",
 "src": "Le Forez sportif, 22 juillet 1936, page 3. Gallica, ark:/12148/bpt6k6681845h."},

{"ch": "2. SOLLICITÉ EN FRANCE, VICTIME DE SON TALENT", "titre": "Le récit vu de Nice",
 "t": [
  "L'Éclaireur du Soir, Nice, 1er août 1936, sous la signature d'Émile Laurence, titre : « La justice et le droit ont eu raison dans l'affaire Boudjemaa. Mais l'O.G.C.N. fera les frais de l'affaire ».",
  "> Le brun inter à l'esprit fantasque, dont on connaît les qualités de footballer, avait au premier jour de juillet signé un contrat et une licence de joueur professionnel à l'O.G.C.N. où il opérait comme amateur l'an dernier. Faisant droit à un devoir légitime, les dirigeants du grand Club niçois avaient autorisé leur inter, comme tous leurs autres pros d'ailleurs, à partir en vacances durant une vingtaine de jours.",
  "> C'est durant cette période et après de déloyales manoeuvres que l'A.S. Saint-Etienne fit signer une licence professionnelle à Boudjemaa, à Tunis même, ayant envoyé un émissaire sur place qui sut, par des moyens que l'on condamne dans tous les milieux sportifs, persuader Mohamed de la nécessité qu'il y avait pour lui à quitter le Club qui l'avait sorti et façonné.",
  "L'émissaire est nommé ailleurs : M. Marey, secrétaire de l'A.S. Saint-Étienne, venu le chercher jusqu'à Béja. La notice du club dira plus tard, du même homme, qu'il est allé le chercher « dans les souks de Sousse ».",
 ],
 "fac": None,
 "leg": "« La justice et le droit ont eu raison dans l'affaire Boudjemaa ».",
 "src": "L'Éclaireur du Soir, Nice, 1er août 1936, signé Émile Laurence. Pièce du dossier de l'auteur, fichier « affaire Boudjemaa EC Soir 1-8-1936.jpg »."},

{"ch": "2. SOLLICITÉ EN FRANCE, VICTIME DE SON TALENT", "titre": "La suspension, en deux temps",
 "t": [
  "Trois mois, le 31 juillet 1936. La Commission centrale des statuts et règlements juge l'affaire à Paris, sur le dossier, sans entendre de délégué niçois. L'Éclaireur du Soir du 1er août : « Boudjemaa a été suspendu pour trois mois ferme, à dater du 30 août. Il ne pourra, de ce fait, rejouer que le 1er décembre 1936 et à l'O.G.C.N. bien entendu. »",
  "L'appel de Saint-Étienne rejeté, le 12 septembre 1936. L'Éclaireur de Nice du 13 septembre, sous le titre « Boudjemaa demeure qualifié à l'O.G.C. Nice » :",
  "> Après un habile plaidoyer du président des « rouge et noir », la Commission a dit qu'il n'y avait pas lieu à révision de la première décision et a définitivement classé l'affaire. Aussi, en dépit de ce que certains peuvent penser, Boudjemaa ne pourra rejouer le 1er décembre que sous les couleurs de l'O.G.C. Nice. Et son contrat de joueur professionnel le lie à jamais au club de notre ville.",
  "Six mois, le 5 octobre 1936. Le Conseil fédéral, saisi sur appel de Saint-Étienne, double la peine.",
 ],
 "fac": None,
 "leg": "« Boudjemaa demeure qualifié à l'O.G.C. Nice », puis « L'affaire du joueur Boudjema ».",
 "src": "L'Éclaireur de Nice, 13 septembre et 6 octobre 1936. Pièces du dossier de l'auteur, fichiers « affaire Boudjemaa (qualifie EC 13 09 1936).jpg » et « affaire Boudjemaa EC 06 10 1936.jpg »."},

{"ch": "2. SOLLICITÉ EN FRANCE, VICTIME DE SON TALENT", "titre": "Jugé sans être là",
 "t": [
  "L'Éclaireur de Nice du 6 octobre 1936, « de nos services parisiens », signé Raoul Sabatié, raconte la séance du Conseil fédéral.",
  "> A neuf heures, après avoir avalé un repas express, nous étions introduits, Niçois et Stéphanois, en présence du Conseil fédéral. M. Rivet présidait les débats. Depuis le geste qui mit Boudjema en possession d'une petite fortune, jusqu'à l'examen des pièces douteuses par le professeur Leccat, de l'Institut policier de Lyon, tout cela, habilement présenté et remarquablement soutenu, ne tenait pas très bien debout.",
  "Et le président de la Fédération, Jules Rimet, tranche en une phrase :",
  "> Messieurs, vous vous invectivez pour un garçon peu scrupuleux qui a touché, à trois jours d'intervalle, l'argent des deux côtés. Il n'est guère défendable.",
  "Personne, dans cette salle, ne l'a entendu lui. Il n'y était pas. Il était à Béja. L'Intransigeant du 15 septembre 1936 : Boudjemaa « ne voulait plus revenir sur la Côte d'Azur. Il est actuellement à Beja ».",
 ],
 "fac": "fac-intransigeant-1936.jpg",
 "leg": "« L'affaire Boudjemaa », par Mario Brun.",
 "src": "L'Intransigeant, 30 octobre 1936, page 6. Gallica, ark:/12148/bpt6k7952781."},

{"ch": "2. SOLLICITÉ EN FRANCE, VICTIME DE SON TALENT", "titre": "Ce qu'il en coûte, et la lettre en arabe",
 "t": [
  "L'Est Républicain du samedi 31 octobre 1936, page 5, donne la sanction complète : six mois de suspension, seule la licence de Nice retenue, et la restitution à Saint-Étienne des frais avancés, 10 700 francs.",
  "Deux ans et demi plus tard, l'affaire n'est toujours pas éteinte. Le Petit Journal du 8 janvier 1939 : la commission règle son transfert de Saint-Étienne à Colmar et lui fait rembourser sa dette envers Saint-Étienne, 4 500 francs, à raison de 500 francs par mois.",
  "Une réserve de date : Mario Brun, dans L'Intransigeant du 30 octobre 1936, date la confrontation des deux clubs du 18 août. Le procès-verbal officiel publié par Football la date du 13 août. Les deux ne peuvent pas être justes ; je n'ai pas tranché.",
  "Une note sur l'écrit, enfin. Plusieurs pièces répètent qu'il était illettré. La même affaire montre pourtant qu'il écrivait : sa lettre à la Fédération était écrite en arabe, et c'est même l'un des points du dossier, « l'arabe n'étant pas déchiffrable pour tout le monde », écrit L'Intransigeant. Un homme qui écrit sa défense dans sa langue n'est pas un illettré : il est un homme dont on ne lit pas la langue. La copie de cette lettre n'a pas été retrouvée.",
 ],
 "fac": "fac-nordsports-1936.jpg",
 "leg": "« Boudjemaa, ce doux agneau ».",
 "src": "Nord-sports, 27 août 1936, page 2, rubrique « Échos, tuyaux ». Gallica, ark:/12148/bpt6k8661871v."},

{"ch": "3. LE RACISME ET L'ESPRIT COLONIALISTE", "titre": "Le bled, les dattes, le mirage",
 "t": [
  "Ce chapitre rassemble les phrases de la presse française qui disent le regard porté sur lui. Elles sont données telles qu'elles ont été imprimées, avec leur date et leur page. Il n'y a rien à ajouter à la plupart d'entre elles.",
  "L'Intransigeant du 30 octobre 1936, Mario Brun : « on alla le tirer de son bled » ; « l'arabe n'étant pas déchiffrable pour tout le monde » ; « le petit footballeur tunisien » ; « Mettez-vous à la place du type qui, en plein bled, se voit offrir une petite fortune » ; et, pour finir l'article : « Quant à Mohamed, dans son bled, il en a pour six mois à empaqueter des dattes... Il avait cru au mirage... »",
  "L'Éclaireur de Nice du 6 octobre 1936, Raoul Sabatié, dernière phrase de l'article : « Dans six mois, Boudjema, qui doit manger des dattes dans le bled tunisien, jouera à Nice ! »",
  "C'est un correspondant parisien qui écrit cela, dans le journal de la ville dont il porte les couleurs, et c'est la phrase sur laquelle il a choisi de finir.",
 ],
 "fac": "fac-alsacien-1938.jpg",
 "leg": "« Laloué versucht den Araber zu stoppen, aber umsonst » : Laloué essaie d'arrêter l'Arabe, mais en vain.",
 "src": "Le Sport alsacien, 14 novembre 1938, page 3. Gallica, ark:/12148/bpt6k3148996d."},

{"ch": "3. LE RACISME ET L'ESPRIT COLONIALISTE", "titre": "L'enfant, l'animal, l'illettré",
 "t": [
  "Nord-sports, 27 août 1936, page 2 :",
  "> A en croire un confrère stéphanois, Boudjemaa, ce doux agneau, a été victime d'une machination terrible de la part de ses dirigeants de l'O.G.C. Nice. La vérité est tout autre, nous écrit-on de Nice. Il a même encaissé, contre reçu, sa mensualité de juillet, mensualité due au titre de joueur professionnel. Et Mohamed, illettré, peut-être, mais qui compte fort bien, lorsqu'il s'agit... d'argent, nie tout cela.",
  "Nord-sports, 10 septembre 1936 : « Mohamed va être recherché. Il reviendra à Nice, tout penaud, honteux comme... un renard qu'une poule aurait pris. »",
  "L'Éclaireur du Soir, 1er août 1936 : « un joueur illettré, trompé par des grossiers marchandages et des raisonnements simplistes ». La phrase est écrite pour le défendre. Elle le défend comme on défend un mineur.",
  "Le nom remplacé par l'origine, enfin. Le Sport alsacien du 14 novembre 1938 appelle « l'Arabe », au milieu d'un compte rendu où tous les autres joueurs sont nommés. Paris-soir du 30 mars 1937 : « Les nationaux comme Boudjema et Brusseaux ne feraient pas mal en division nationale. Encore des Nord-Africains, souligne Couard, réduit au rôle de spectateur. »",
 ],
 "fac": None,
 "leg": "« Boudjema de l'O. G. C. de Nice jouera à Saint-Etienne. Nous apprenons que le brillant inter-gauche de l'O.G.C. de Nice, l'Algérien Boudjema... »",
 "src": "Le Mémorial, Saint-Étienne, 14 juillet 1936, page 5, ark:/12148/bpt6k4880497m. La Bibliothèque nationale de France refuse la reproduction en image de ce titre ; le texte seul est reproductible."},

{"ch": "3. LE RACISME ET L'ESPRIT COLONIALISTE", "titre": "Le système qui l'a fait venir",
 "t": [
  "David Hansen, dans « La professionnalisation d'un club de football : l'OGC Nice (1932-1950) », Recherches régionales numéro 215, 2018, travaille sur les procès-verbaux du club conservés aux Archives départementales des Alpes-Maritimes. Boudjemaa y figure deux fois, dans le tableau des joueurs venus de l'étranger : « 1935/1936 Boudjemaa Mohammed, Tunisie française » et « 1936/1937 Boudjemaa Mohammed, Tunisie française ».",
  "L'étude décrit surtout le système. Le prospecteur : « Le dénommé Charles Elkabbach est présenté dans la presse sportive nationale comme l'homme qui a africanisé l'OM et le football français. Négociant en laines à Oran, cet homme a su dénicher et exporter en France de nombreux joueurs africains. » Et la phrase qu'on lui prête : « l'Algérie et le Maroc n'ont pas encore tout donné. Il y a beaucoup de trésors jalousement surveillés chez nous. Et la race des perles noires n'est pas morte. »",
  "Dénicher, exporter, importer, des trésors, une race : c'est le vocabulaire de la marchandise appliqué à des hommes, et il est imprimé dans la presse sportive nationale, pas dans un écrit privé.",
  "Il faut rappeler le cadre juridique. Le Code de l'indigénat n'est officiellement abrogé que par l'ordonnance du 7 mars 1944. Boudjemaa a joué, signé, été suspendu et jugé sous ce régime. Et il faut rappeler le retournement de 1946 : la Fédération interdit pendant deux ans tout nouveau transfert de footballeurs venus d'Afrique du Nord. Il rentre à Colmar en septembre 1945 ; en janvier 1946, on lui refuse sa licence amateur.",
 ],
 "fac": "LAuto-1936-mal-du-pays.jpg",
 "leg": "« Le mal du pays ».",
 "src": "L'Auto, 1936. Gallica, Bibliothèque nationale de France."},

{"ch": "4. LE MATCH AMICAL À MARSEILLE", "titre": "1er décembre 1935, Marseille 2 Nice 0",
 "t": [
  "C'est son troisième match sous le maillot niçois, et le premier hors de Nice. Il arrive de Béja depuis un mois.",
  "Le Petit Marseillais du 2 décembre 1935 relève deux fois son nom : « Boudjema fait de superbes ouvertures » ; « Boudjema et Béraudo font un très grand labeur ». Il est remplacé à la reprise.",
  "C'est peu de chose, deux lignes dans un compte rendu de match amical, mais il faut mesurer ce que cela représente : un mois plus tôt, personne en France ne connaissait son nom, et il vient de jouer devant le public de l'Olympique de Marseille.",
  "Il n'est pas encore qualifié. Il ne le sera qu'une semaine plus tard, le 8 décembre, contre Le Havre, pour son premier match officiel, et ce jour-là L'Auto écrira son nom « Boudjena », ce qui est la meilleure preuve qu'on ne le connaissait toujours pas.",
 ],
 "fac": "PetitMarseillais-1935-Nice-OM.jpg",
 "leg": "Olympique de Marseille contre O.G.C. Nice.",
 "src": "Le Petit Marseillais, 2 décembre 1935. Gallica, Bibliothèque nationale de France."},


{"ch": "5. LES SAISONS EN FRANCE", "titre": "L'arrivée à Nice, novembre 1935",
 "t": [
  "L'Auto-vélo du 2 novembre 1935, page 5 : « On signale aussi du nouveau à l'OGC de Nice. Les Aiglons niçois viennent d'accueillir dans leurs rangs deux recrues sur lesquelles ils comptent pour faire de meilleurs résultats. Ce sont : l'Espagnol Goyes et le Tunisien Boudjema. »",
  "Son premier match sous le maillot niçois est un amical contre Roma, le 27 octobre 1935, perdu 1 à 0. Il joue toute la partie. La date vient de l'OGC Nice lui-même, par M. Michel Oreggia, dans un courriel du 10 janvier 2021. On lit parfois la date du 21 octobre : elle est fausse. L'Éclaireur du 28 octobre : « Un bel essai de Boudjemaa est bien sauvé par le goal Zucca. »",
  "Le 11 novembre 1935, Nice 4 Antibes 2. L'Éclaireur du 12 novembre, page 8 : « Mis en évidence par Boudjema, dont on espère la qualification prochaine, il fut précieux à ce poste. Boudjema se montra sous un jour excellent. Son shoot du gauche est inquiétant, mais hier il tripota la balle heureusement et doit être crédité d'un bon match. »",
  "Une note de vie quotidienne, qui n'est dans aucun compte rendu : Raoul Chaisaz, le gardien de Nice, l'a ramené de Tunisie et employé dans son entreprise.",
 ],
 "fac": "ForezSportif-1935-arrivee-Nice.jpg",
 "leg": "L'arrivée à Nice.",
 "src": "Le Forez sportif, 1935. Gallica, Bibliothèque nationale de France."},

{"ch": "5. LES SAISONS EN FRANCE", "titre": "1935-1936, la première saison",
 "t": [
  "31 janvier 1936, Dunkerque 3 Nice 2. Le Grand Écho du Nord : « Boudjema est partout et se dépense avec un égal bonheur en défense comme en attaque. »",
  "1er mars 1936, Nice 2 Amiens 0. Le Grand Écho du Nord : « Boudjemaa se permit le luxe de dribbler trois hommes et de marquer d'un tir en biais du gauche. »",
  "21 mars 1936, avant Roubaix : « L'avant-centre Boudjema est très dangereux et possède un déboulé foudroyant. »",
  "21 mai 1936. Le Petit Provençal du 22 mai, page 9, une ligne qu'on ne trouve nulle part ailleurs : « Boudjema, très courageux, malgré sa blessure à la tête, marque un joli but et Nice tient par 2 à 1. » Il joue et il marque la tête blessée.",
  "24 mai 1936, C.A. Paris 0 Nice 1. L'Auto-vélo du 25 mai : « Les Niçois possèdent en Boudjemaa un bien beau joueur, doublé d'un botteur émérite. Dommage que, même avec le sourire, il ait une tendance marquée à jouer l'homme. »",
  "Entre-temps, le 30 avril, il est reparti : « L'Olympique Gymnaste Club de Nice sera privé des services de son excellent avant-centre Boudjema qui est parti sous les drapeaux en Tunisie. »",
 ],
 "fac": "LAuto-1936-sous-les-drapeaux.jpg",
 "leg": "« parti sous les drapeaux en Tunisie ».",
 "src": "L'Auto, 30 avril 1936, page 5. Gallica, Bibliothèque nationale de France."},

{"ch": "5. LES SAISONS EN FRANCE", "titre": "1936-1937, la meilleure saison",
 "t": [
  "Suspendu jusqu'à la fin de janvier, il ne rejoue qu'en 1937. Sa rentrée a lieu le 17 janvier à Marseille, Nice 0 Strasbourg 0 en Coupe de France. L'Intransigeant du 20 janvier : « Boudjemaa a fait sa rentrée, à Marseille, contre Strasbourg, et Nice s'en est bien trouvé. »",
  "24 janvier 1937, Nice 3 Montpellier 1 : il marque le deuxième but. 31 janvier, Dunkerque 3 Nice 2 : il égalise à la 45e minute. La Croix du Nord : « Boudjemaa, le meilleur homme sur le terrain avec Hillier. »",
  "7 mars 1937, Nice 3 Nancy 1. L'Auto-vélo du 8 mars, page 7 : « Boudjemaa place un shot du droit qui rentre au coin des filets, et c'est le troisième but. » Et, dans le même numéro, page 8, sous le titre « Boudjemaa a été demandé par un club écossais » : « le président d'un club écossais a assisté aujourd'hui au match OGC Nice contre FC Nancy et, impressionné par le jeu de Boudjemaa, a offert, séance tenante, 5 000 livres pour le transfert de ce joueur ».",
  "30 mars 1937, Nice 1 Racing Club de Paris 0, amical à Saint-Ouen, Zamora dans les buts niçois contre Hiden. Paris-Midi écrit la veille que ses coéquipiers le tiennent pour l'un des meilleurs joueurs français.",
  "En juin 1937, il renouvelle son contrat à Nice, aux côtés de Samitier. Deux mois plus tard, il est vendu.",
 ],
 "fac": None,
 "leg": "« Boudjemaa a été demandé par un club écossais ».",
 "src": "L'Auto-vélo, 8 mars 1937, page 8. Gallica, Bibliothèque nationale de France. Fac-similé à refabriquer à partir de liste.json."},

{"ch": "5. LES SAISONS EN FRANCE", "titre": "1937-1938, Saint-Étienne et la maladie",
 "t": [
  "Nice le vend à Saint-Étienne pour 50 000 francs en août 1937. Le Mémorial du 21 août : « Une bonne nouvelle. Boudjemaa a signé hier à l'A.S.S.E. »",
  "Il joue le 5 septembre à Alès, marque à la 16e minute, puis le 19 septembre contre Bordeaux avec une furonculose, au point que son coéquipier le gardien Favier en admirera le courage. Il entre ensuite en clinique à Saint-Étienne.",
  "De décembre 1937 à mai 1938, il se repose à Béja. La presse mulhousienne suit l'affaire mois par mois. L'Express de Mulhouse du 5 janvier 1938 : « Le Stéphanois Boudjemaa est actuellement en convalescence à Tunis, dans sa famille. » C'est la seule mention de sa famille dans tout le dépouillement.",
  "L'Express de Mulhouse du 23 février 1938 : « Le Nord-Africain Boudjemaa, qui coûte très cher à l'A.S. Saint-Étienne, est toujours en Tunisie. Son état ne s'est pas amélioré et on se demande s'il pourra jouer cette saison. »",
  "C'est dans cette période que Pierre Marey est allé le chercher, selon la notice du club, « dans les souks de Sousse ». La suite de cette saison est au chapitre 7 : elle est décisive, et elle finit en première division.",
 ],
 "fac": None,
 "leg": "« Une bonne nouvelle. Boudjemaa a signé hier à l'A.S.S.E. »",
 "src": "Le Mémorial, Saint-Étienne, 21 août 1937, ark:/12148/bpt6k48808955. La Bibliothèque nationale de France refuse la reproduction en image de ce titre."},

{"ch": "5. LES SAISONS EN FRANCE", "titre": "Colmar, 2 juillet 1938",
 "t": [
  "Les Colmarer neueste Nachrichten, le quotidien de Colmar, annoncent sa venue dans leur chronique d'intersaison, page 6. C'est le premier des quatre articles que ce journal lui consacrera en propre.",
  "> Dans le camp des professionnels du S. R. C., on enregistre une recrue de plus. Il s'agit de l'intérieur Mohamed Boudjemaa, repris de l'A. S. Saint-Etienne. Le joueur est précédé d'une bonne réputation : c'est un grand battant, et il a une frappe saine. Né en Afrique du Nord, il est aujourd'hui dans sa vingt-troisième année, mesure 1,71 m et pèse 72 kg. Boudjemaa avait été repris la saison dernière par Saint-Etienne à l'O. G. C. pour la bagatelle de 50 000 francs. À Colmar, on est persuadé d'avoir fait une bonne pioche avec ce joueur.",
  "Deux choses à relever. La date : son arrivée à Colmar est annoncée dès le 2 juillet 1938, soit cinq semaines avant le 10 août qui fera annuler le match contre Lens. Et l'âge : « dans sa vingt-troisième année » veut dire vingt-deux ans révolus, alors qu'avec une naissance le 13 août 1914 il en avait vingt-trois ce jour-là. Le journal se trompe d'un an au moins.",
  "C'est aussi le seul document qui donne sa taille et son poids à cette date : 1,71 m et 72 kg. La notice de Saint-Étienne dira plus tard 1 m 75 et 75 kg.",
 ],
 "fac": "fac-colmar-1938-presentation.jpg",
 "leg": "« Es handelt sich um den Innenstürmer Mohamed Boudjemaa ».",
 "src": "Colmarer neueste Nachrichten, 2 juillet 1938, année 18 numéro 180, page 6, chronique « Karenz-Plaudereien hier und anderswo ». Gallica, ark:/12148/bpt6k31592102."},

{"ch": "5. LES SAISONS EN FRANCE", "titre": "L'équipe des Sports Réunis",
 "t": [
  "C'est la seule photographie d'équipe où il est nommé. Le Miroir des sports du 25 octobre 1938 présente les trente-neuf équipes professionnelles du football français ; celle de Colmar est page 7.",
  "La légende imprimée : « S. R. Colmar. De g. à dr., 1er rang : Othman, Villacampa, Tellechea, Zopp, BOUDJÉMAA, Belko. 2e rang, debout : Gougain, Demuth, Logez, Wozniak, Delacourt, Jan, Lowy (entraîneur). »",
  "Il est donc au premier rang, accroupi, cinquième en partant de la gauche. La convention des rangs a été vérifiée sur la photographie voisine du Toulouse F.C., dont la légende compte cinq noms au premier rang pour cinq joueurs accroupis, et sept au second pour sept joueurs debout, entraîneur compris.",
  "Une chose à noter : l'entraîneur de Colmar est Lowy, qui était déjà son entraîneur à l'O.G.C. Nice en 1936. Deux ans après, dans une autre ville, c'est le même homme qui le fait jouer.",
  "Sa saison commence bien. Le 1er septembre 1938 à Rennes, il marque le premier but de toute la saison du championnat de France, à 15 h 15, à la onzième minute.",
 ],
 "fac": "SRColmar-1938-planche.jpg",
 "leg": "S. R. Colmar. Premier rang, cinquième en partant de la gauche.",
 "src": "Le Miroir des sports, 25 octobre 1938, page 7. Gallica, ark:/12148/bpt6k97963516."},

{"ch": "5. LES SAISONS EN FRANCE", "titre": "Le derby du 11 novembre 1938",
 "t": [
  "Colmar 5, Mulhouse 1, le jour de l'Armistice, au Stade Joseph Lehmann. C'est son plus grand match en Alsace. Il marque deux buts.",
  "> Collet se distingue du poing, et Boudjemaa place à la 15e minute un tir en biais que Bohrer laisse filer. 2 à 0.",
  "> L'attaque du F. C. M. n'obtient rien de comptable hormis des corners ; Boudjemaa, lui, voit de nouveau la voie libre et tire dans le coin du but, là où Bohrer n'est pas. 4 à 0 après 28 minutes. Le jeu devient alors encore plus dur. Delacourt et Boudjemaa en font les frais.",
  "Le match tourne mal : « Mais c'est alors que commença la série d'accidents. La première victime fut le Colmarien Delacourt. Puis ce fut le tour de Boudjemaa, qu'on secoua très vigoureusement. Les incidents atteignirent leur sommet quelques minutes après la reprise, quand Boudjemaa prit sa revanche sur Szego. »",
  "Le titre de l'article dit tout : « Zu hart umkämpftes Derby », un derby disputé trop durement.",
 ],
 "fac": "fac-colmar-1938-derby.jpg",
 "leg": "« Ein Rekordspiel mit 5934 Zuschauern und 38.600 Fr. an Einnahmen. Zu hart umkämpftes Derby. S. R. Colmar Pro - F. C. Mulhouse Pro 5:1 ».",
 "src": "Colmarer neueste Nachrichten, 12 novembre 1938, page 5. Gallica, ark:/12148/bpt6k31593194."},

{"ch": "5. LES SAISONS EN FRANCE", "titre": "La réclamation, et les vrais chiffres",
 "t": [
  "Dans les échos d'après-match, le même journal écrit ceci, qu'aucune autre source ne donne :",
  "> Le F. C. M. a déposé une réclamation parce que l'arbitre n'a pas expulsé le joueur Boudjemaa. Il n'y aura rien à en tirer, car dans ces affaires-là seul l'arbitre décide.",
  "Et il donne les chiffres du match : « Sur toute la ligne les records ont été battus. 5 934 spectateurs, 38 600 francs de recettes, contre 5 123 spectateurs et 28 195 francs la saison dernière. »",
  "Une correction s'impose ici, et elle vient du quotidien local au lendemain du match. Le Sport alsacien du 14 novembre donne « plus de 6 000 » spectateurs et 40 000 francs, avec un ancien record de 5 023 et 28 595 francs. Ce sont les chiffres du Sport alsacien qui sont faux.",
  "La même page raconte un détail que personne d'autre n'a gardé : « Une élégante Alsacienne, Mlle Gspann, remit avant le match au capitaine colmarien, Oscar Tellechea, un beau bouquet, parce que ce derby tombait le jour de l'Armistice. »",
 ],
 "fac": "fac-colmar-1938-protest.jpg",
 "leg": "« F. C. M. hat Protest eingelegt, weil der Schiedsrichter den Spieler Boudjemaa nicht des Terrains verwiesen hat. »",
 "src": "Colmarer neueste Nachrichten, 12 novembre 1938, page 5, « Was sonst noch zu sagen wäre ». Gallica, ark:/12148/bpt6k31593194."},

{"ch": "5. LES SAISONS EN FRANCE", "titre": "Lens, le Red Star, et la faute d'un jour",
 "t": [
  "18 décembre 1938, trente-deuxième de finale de la Coupe de France, à Colmar : Colmar, deuxième division, bat nettement Lens, membre de la division nationale, 3 à 1. Le Miroir des sports du 20 décembre : « Boudjemaa, excellent footballeur, opérant de volée, shooteur dangereux, fut très souvent en évidence. »",
  "Puis Colmar est disqualifié. Sa licence avait été déposée un jour trop tard, le règlement de la Coupe exigeant une licence avant le 10 août. Il ne devait pas jouer. Le bureau fédéral confirme sur appel le 2 janvier 1939, après que les deux clubs eurent plaidé. Lens avait prévenu Colmar avant le match.",
  "25 décembre 1938, amical à Saint-Ouen, Red Star 2 Colmar 2 : il marque les deux buts. La Dépêche du 26 décembre : « Quant à Défossé, il se laissa surprendre par un shoot de Boudjemaa, botté des trente mètres » ; et surtout : « Quant à Boudjemaa, il est le cerveau de la quintette offensive. Il possède un shoot magnifique, bon dribbleur aussi ; toute la ligne d'attaque semble ne jouer que pour lui et chercher à lui procurer des occasions de scorer. »",
  "Le 8 janvier 1939, la commission lui fait rembourser 4 500 francs à Saint-Étienne, à raison de 500 francs par mois.",
 ],
 "fac": "PetitParisien-1939-portrait-planche.jpg",
 "leg": "Son portrait en pied, avec la légende du journal.",
 "src": "Le Petit Parisien, 27 avril 1939, page 6. Gallica, ark:/12148/bpt6k6836529."},

{"ch": "5. LES SAISONS EN FRANCE", "titre": "Mai 1939, on se l'arrache",
 "t": [
  "Le 12 mars 1939, L'Echo de Sélestat le décrit comme « Halbinvalide », à demi invalide, et il marque deux fois quand même. Le lendemain, le journal de Guebwiller parle de « seiner alten Verletzung », son ancienne blessure. Le 26 mars, Le Sport alsacien : « Boudjemaa ist immer noch zu sehr durch seine Verletzung gehandicapt ».",
  "Blessé ou non, il est convoité. Les Colmarer neueste Nachrichten du 6 mai 1939, page 8, sous le titre « Schon Transferte ! », déjà des transferts :",
  "> Le R. S. O. Paris lorgne le joueur colmarien Boudjemaa, celui-là même qui, on s'en souvient, a marqué deux buts en obus contre le club parisien et qui devrait être pour cette raison « muté par sanction » à Paris. Mais le S. R. C. voudra-t-il céder ce joueur, et cela se fera-t-il pour une somme à six chiffres ?",
  "Il est aussi contacté par le F.C. Sète, le F.C. Metz et l'A.S. Saint-Étienne.",
 ],
 "fac": "fac-colmar-1939-transferts.jpg",
 "leg": "« R. S. O. Paris gelüstet es nach dem Colmarer Spieler Boudjemaa ».",
 "src": "Colmarer neueste Nachrichten, 6 mai 1939, année 19 numéro 125, page 8. Gallica, ark:/12148/bpt6k3159468z."},


{"ch": "5. LES SAISONS EN FRANCE", "titre": "« Le Tunisien »",
 "t": [
  "Une semaine plus tard, le 13 mai 1939, le même journal revient sur lui dans ses nouvelles en bref, et cette fois il tranche une question qui traîne depuis 1936 :",
  "> Boudjemaa est en ce moment très coté. Car, à ce qu'on dit, outre le R. S. O. Paris, plusieurs clubs de division I se disputent le Tunisien.",
  "« Den Tunesier ». C'est la première fois, dans tout le dépouillement, qu'un journal le désigne par son pays et sans se tromper. Le Mémorial de Saint-Étienne l'avait appelé « l'Algérien » le jour même où son club le signait, en juillet 1936. Paris-soir écrivait « encore des Nord-Africains ». Le Sport alsacien écrivait « l'Arabe ».",
  "Il aura fallu trois ans et demi de carrière française, et un journal de province écrit en allemand, pour qu'on écrive simplement d'où il vient.",
 ],
 "fac": "fac-colmar-1939-kurze.jpg",
 "leg": "« Neues in Kürze. Boudjemaa steht zur Zeit hoch im Kurs. Denn wie verlautet, bewerben sich ausser R. S. O. Paris auch noch mehrere Division I-Vereine um den Tunesier. »",
 "src": "Colmarer neueste Nachrichten, 13 mai 1939, année 19 numéro 132, page 8. Gallica, ark:/12148/bpt6k3159474p."},

{"ch": "5. LES SAISONS EN FRANCE", "titre": "Son portrait de fin de saison",
 "t": [
  "C'est la pièce la plus importante des 382 numéros du quotidien de Colmar. Le 3 juin 1939, le journal passe en revue chaque professionnel colmarien, un paragraphe par joueur. Voici le sien, en entier :",
  "> BOUDJEMAA, un joueur au sang chaud, qui, comme constructeur du jeu, se jette encore trop dans les duels. Dans le premier tiers du championnat, son excès de zèle lui a fait manquer de fair-play, mais il s'est ensuite débarrassé de ce défaut comme d'un ballast inutile. On conseillerait au Tunisien un penchant plus marqué pour les attaques combinées, plutôt que pour des actions individuelles qui coûtent du temps et des forces. Sa frappe est extrêmement dure, mais pas toujours assez précise. A dû s'arrêter quelques semaines pour blessure.",
  "Le même jour, le même journal écrit que le club ne le vendra pas : « Les professionnels de la première équipe du S. R. C. ne seront pas cédés par la direction du club, à ce qu'on dit. Il s'agit en premier lieu de Wozniok, Demuth, Delacourt, Gabrillargues, Othman, Zopp, Tellechea, Boudjemaa, Emonoz. » Ce soir du 31 juillet 1939 le confirme : il reste à Colmar.",
  "Le 19 août 1939, les Colmarer neueste Nachrichten publient la composition du premier match de la saison : il en fait partie. C'est la dernière fois que le quotidien de Colmar imprime son nom. Deux semaines plus tard, la guerre.",
 ],
 "fac": "fac-colmar-1939-portrait.jpg",
 "leg": "« BOUDJEMAA, ein heissblütiger Spieler ».",
 "src": "Colmarer neueste Nachrichten, 3 juin 1939, année 19 numéro 155, page 15. Gallica, ark:/12148/bpt6k3159490s."},

{"ch": "6. LA GUERRE", "titre": "Sète, puis la Tunisie",
 "t": [
  "L'Auto-vélo des 30 novembre et 6 décembre 1940, puis du 8 janvier 1941 : il est pressenti au F.C. Sète et s'y prépare. Le 5 février 1941, le même journal le dit en France, en zone non occupée. Son passage à Sète court de novembre 1940 à 1941.",
  "Le 7 mai 1941, Tunisie contre France, 2 à 7, 2 à 3 à la mi-temps. L'Auto-vélo salue les actions de « Djema Djema », qu'il appelle la « vedette locale ». C'est la seule fois où la presse française le désigne comme la vedette de son propre pays.",
  "Une semaine plus tard, le 14 mai, un journaliste du même journal s'amuse à composer une équipe d'Afrique du Nord : il en fait partie. Le 15 mai, à propos de Bhir Othman qui vient de signer aux Girondins : il a joué avec Boudjemaa et Draoua à l'Espérance Sportive de Tunis.",
  "L'Effort du 7 juillet 1941 le place dans la division d'honneur tunisienne, sous cette désignation : « Boudjemaa (Tunisien) ancien joueur professionnel de Colmar ». Son club, cette année-là, est l'Union sportive béjaoise : il est rentré jouer là où il avait commencé.",
 ],
 "fac": None,
 "leg": "Tunisie contre France : « Djema Djema », la « vedette locale ».",
 "src": "L'Auto-vélo, 7 mai 1941. Gallica, Bibliothèque nationale de France. Fac-similé à refabriquer à partir de liste.json."},

{"ch": "6. LA GUERRE", "titre": "La captivité",
 "t": [
  "La phrase qui règle la question est dans Ce soir du 28 juin 1945 :",
  "> Boudjema, l'ex-ailier gauche de Sète, rentré de captivité, a été transféré à Nice.",
  "Il a donc été fait prisonnier. Où et quand, on ne le sait pas. Il ne figure pas dans les cent fascicules des listes officielles des prisonniers de guerre français de 1940 et 1941, qui ont été dépouillées pour ce livre.",
  "Cette phrase pose une autre question à laquelle je n'ai pas répondu : elle le dit transféré à Nice en 1945, et il rejoint Colmar le 20 septembre de la même année.",
  "Il est aussi le seul passage, dans toute la documentation rassemblée, qui touche à sa vie en dehors du football entre 1941 et 1945. Quatre années de sa vie tiennent dans quatre mots : « rentré de captivité ».",
 ],
 "fac": None,
 "leg": "« Boudjema, l'ex-ailier gauche de Sète, rentré de captivité, a été transféré à Nice. »",
 "src": "Ce soir, 28 juin 1945. Gallica, Bibliothèque nationale de France. Fac-similé à refabriquer à partir de liste.json."},

{"ch": "7. SAINT-ÉTIENNE, DIVISION 1", "titre": "Ses débuts sous le maillot vert",
 "t": [
  "Alès 3, Association Sportive de Saint-Étienne 2, le 5 septembre 1937, mi-temps 1 à 2. C'est la première ligne de sa notice dans l'ouvrage du club, notice numéro 54 : « BOUDJEMAA BEN MOHAMED BEN EL DJILANI (1914-1947). Attaquant. Tunisien. Alès - ASSE 3-2 (1-2), le 5 septembre 1937 (37-38). » Il marque à la 16e minute.",
  "Trois jours plus tard, le 8 septembre, Saint-Étienne bat l'équipe nationale A de Suisse 2 à 0. L'Ouest-Éclair du 10 septembre : « Boudjemaa reste un danger constant. »",
  "L'Auto-vélo du 16 septembre 1937 donne la phrase qui a fait sa réputation : « Il courait, driblait, shootait, c'était un diable déchaîné. »",
  "Puis vient le 19 septembre contre Bordeaux, la furonculose, la clinique, et sept mois d'absence. Il ne reviendra que le 8 mai 1938, et la saison tiendra dans ces trois dernières semaines.",
 ],
 "fac": None,
 "leg": "Notice numéro 54 du répertoire des joueurs de l'A.S. Saint-Étienne.",
 "src": "Pièce du dossier de l'auteur, fichier « ASSE.jpg », d'après l'ouvrage de Jean Vieillard."},

{"ch": "7. SAINT-ÉTIENNE, DIVISION 1", "titre": "« L'homme qui donna le moral à l'équipe »",
 "t": [
  "Le Mémorial du 23 mai 1938, au lendemain de Saint-Étienne 4 Toulouse 1 :",
  "> Boudjemaa, l'homme qui donne le moral à l'équipe. Une fois de plus, c'est le puissant et actif Boudjemaa qui sut donner de l'ardeur et du moral qui font les vainqueurs. En effet, le puissant inter débuta rapidement, comme à son habitude, bouscula demis et arrières, affola la défense toulousaine et marqua d'un de ses shoots violents dont il a le secret, un but superbe cinq minutes après le coup d'envoi.",
  "C'est le plus beau titre qu'un journal lui ait donné. Il faut ajouter que la fiche officielle du club ne lui attribue pas ce but du 22 mai contre Toulouse. Le journal de la ville, lui, le lui attribue et le décrit. La fiche est à corriger.",
  "Quinze jours plus tôt, le 8 mai, le même journal avait titré : « Renforcée par Boudjemaa l'A.S. St-Étienne battra-t-elle Dunkerque ? » et écrit : « Présenter Boudjemaa est certainement superflu. Il suffit à son égard de rappeler que sous les couleurs de l'O.G.C. Nice il se montra un des meilleurs spécialistes opérant en France au poste d'inter-gauche. »",
 ],
 "fac": None,
 "leg": "« Boudjemaa, l'homme qui donne le moral à l'équipe ».",
 "src": "Le Mémorial, Saint-Étienne, 23 mai 1938, page 6, ark:/12148/bpt6k4881169k. La Bibliothèque nationale de France refuse la reproduction en image de ce titre ; le texte seul est reproductible."},

{"ch": "7. SAINT-ÉTIENNE, DIVISION 1", "titre": "Le 29 mai 1938 : la montée",
 "t": [
  "Saint-Étienne 7, Tourcoing 3. Il marque aux 20e et 57e minutes, et il rate un penalty. Le club monte en première division.",
  "Sa saison entière tient en sept matchs et cinq buts : Alès le 5 septembre 1937, un but ; Bordeaux le 19 septembre ; puis, après sept mois d'absence, Dunkerque le 8 mai 1938, un but à la 30e minute ; Alès le 15 mai, un but à la 7e ; Toulouse le 22 mai, un but à la 5e ; un match le 26 mai ; et Tourcoing le 29 mai, deux buts.",
  "Un écart de comptage doit être signalé : Yvan Beck, d'après les travaux de Jean Vieillard, parle de cinq derniers matchs et quatre buts, la fiche du club de sept matchs et cinq buts sur la saison. Les deux sont compatibles si l'on compte à part les deux matchs de septembre 1937.",
  "Il ne jouera jamais en première division avec eux. Le Mémorial du 23 juin 1938 : « le climat stéphanois ne lui vaut rien et il se déciderait à gagner des contrées plus favorisées : Antibes et Marseille l'accueilleraient. Mais ces marchés se feront-ils ? » Le même journal, le 2 juillet : « on a vendu Boudjemaa aux S.R. de Colmar ».",
  "Deux fois, le même homme, Pierre Marey, avait traversé la Méditerranée pour aller le chercher : à Béja en juillet 1936, dans les souks de Sousse au printemps 1938.",
 ],
 "fac": "Boudjemaa-Colmar-1938-portrait.jpg",
 "leg": "Son visage, détaché de la photographie d'équipe de Colmar.",
 "src": "Le Miroir des sports, 25 octobre 1938, page 7, détail. Gallica, ark:/12148/bpt6k97963516."},

{"ch": "5. LES SAISONS EN FRANCE", "titre": "Colmar, 1946 : les seules images hors du terrain",
 "t": [
  "Il revient au S.R. Colmar le 20 septembre 1945. C'est Lehmann, le président du club, qui vient le chercher en personne. En janvier 1946, il reçoit un avis défavorable à sa demande de licence amateur : c'est l'année où la Fédération interdit pendant deux ans tout nouveau transfert de joueurs venus d'Afrique du Nord.",
  "Le 8 octobre 1946, l'hebdomadaire But publie, page 9, une série de photographies prises au camp d'entraînement, sous le titre « C'est avec bonne humeur qu'on prépare la victoire à Colmar ».",
  "Ce sont les seules images connues de lui ailleurs que sur un terrain de football. On l'y voit à table, on l'y voit jouer au volley-ball, et on l'y voit, hache levée, sous une légende que le journal a trouvée drôle : « Boudjema bourreau ! »",
  "Les trois photographies se suivent sur les pages qui viennent.",
 ],
 "fac": "But-1946-restaurant.jpg",
 "leg": "À table, au camp d'entraînement de Colmar.",
 "src": "But, 8 octobre 1946, page 9. Gallica, Bibliothèque nationale de France."},

{"ch": "5. LES SAISONS EN FRANCE", "titre": "« Boudjema bourreau ! »",
 "t": [
  "La légende est du journal. C'est lui qui lève la hache.",
  "Il faut la lire pour ce qu'elle est : une plaisanterie de rédaction, en 1946, sur un homme dont on n'imprimait jamais le nom de famille et qu'on appelait, selon les jours, l'Arabe, l'Algérien ou le Nord-Africain. Elle n'a rien de méchant dans l'intention. Elle dit tout du ton.",
  "Il lui reste sept mois à vivre.",
  "La saison 1946-1947 laisse peu de traces. Le 22 septembre 1946, C.A. Paris 1 Colmar 1 : il est remplacé en seconde mi-temps. Le 3 novembre, Colmar 1 Alès 1 : il « se voit applaudir plusieurs fois pour de belles actions personnelles ». Le 1er décembre, Paris-Presse écrit : « Laffont, un nouveau, prendra la place de Boudjemaa non encore acclimaté. » Le 5 janvier 1947, en Coupe de France contre Busigny, il est parmi les meilleurs du match. Le 16 février 1947, Colmar 1 Angers 0 : aucune trace de lui. C'est le dernier match connu de sa carrière.",
 ],
 "fac": "But-1946-bourreau.jpg",
 "leg": "« Boudjema bourreau ! »",
 "src": "But, 8 octobre 1946, page 9. Gallica, Bibliothèque nationale de France."},

{"ch": "8. LA MORT", "titre": "L'acte",
 "t": [
  "Mairie de Colmar, registre des décès de l'année 1947, acte numéro 464. Il meurt le 29 mai 1947 à vingt-trois heures trente, au 39 avenue de la Liberté, qui est l'adresse de l'hôpital Pasteur de Colmar. Il habitait 2 place de la Cathédrale, à un quart d'heure de marche.",
  "> Dressé le trente mai mil neuf cent quarante-sept, quinze heures, sur la déclaration de Edouard Fischer, quarante-six ans, directeur sportif, domicilié à Colmar, 21, rue des Tirailleurs, qui, lecture faite, a signé avec Nous, Eugène Hussmann, Adjoint au Maire de Colmar, Médaillé de la Résistance Française, Officier de l'État-civil par délégation.",
  "Trois choses sont à retenir. Il meurt à l'hôpital, tard dans la nuit, alors qu'il a un domicile en ville. C'est le directeur sportif de son club qui vient déclarer le décès, et non un parent. Et l'acte porte que les noms de son père et de sa mère « ne sont pas connus du déclarant ».",
  "Il est mort à trente-deux ans, célibataire, loin des siens, et personne à Colmar ne savait le nom de ses parents.",
 ],
 "fac": "But-1946-volley.jpg",
 "leg": "Au volley-ball. Sept mois avant sa mort.",
 "src": "But, 8 octobre 1946, page 9. Gallica, Bibliothèque nationale de France."},

{"ch": "8. LA MORT", "titre": "La maladie, et le jour",
 "t": [
  "L'Équipe du samedi 31 mai 1947, sous la signature de Haenggi :",
  "> Boudjemaa est mort. COLMAR. Boudjemaa avait contracté voici quelques mois une pleurésie. Le Nord-Africain, malgré tous les soins prodigués, s'est éteint hier à l'hôpital Pasteur de Colmar. Les Sports Réunis perdent un bon joueur et un excellent camarade. Haenggi.",
  "Le signataire est probablement Charles Haenggi, journaliste et écrivain, 1880-1965, rédacteur à l'Elsässer Kurier puis aux Dernières Nouvelles de Colmar.",
  "France-Soir du 1er juin 1947 : « Le Nord-Africain Boudjemaa qui opérait au S.R. Colmar est décédé d'une pleurésie contractée il y a quelques mois. » Deux journaux d'Afrique du Nord l'annoncent aussi : L'Écho d'Alger du 1er juin, page 4, et L'Écho du Maroc du 5 juin, page 4.",
  "Sur le jour, il y a un écart. L'acte d'état civil dit le 29 mai à 23 h 30. Trois des cinq faire-part de presse écrivent « vendredi », c'est-à-dire le 30 mai. L'écart s'explique sans doute par l'heure : mort à vingt-trois heures trente, déclaré le lendemain. Ce livre retient le 29 mai 1947, parce que c'est ce que porte le seul acte d'état civil.",
 ],
 "fac": "fac-equipe-1947.jpg",
 "leg": "« Boudjemaa est mort ».",
 "src": "L'Équipe, 31 mai 1947, page 4. Gallica, ark:/12148/bd6t51001286."},

{"ch": "8. LA MORT", "titre": "Le silence des journaux de sa ville",
 "t": [
  "C'est un fait qu'il faut écrire, parce qu'il en dit autant que les faire-part.",
  "Les deux quotidiens alsaciens de l'époque ont été dépouillés numéro par numéro pour la période de sa mort : L'Alsace, quotidien du Haut-Rhin libéré, cinquante-deux numéros du 20 mai au 20 juillet 1947 ; Les Dernières Nouvelles d'Alsace, soixante-deux numéros du 25 mai au 30 juin 1947. Ni l'un ni l'autre ne le nomme une seule fois.",
  "L'annonce de sa mort est venue de Paris, de L'Équipe et de France-Soir, et d'Alger et de Rabat. Dans la ville où il mourait, les journaux n'en ont rien dit.",
  "On ne sait pas où il est enterré. On ne sait pas si quelqu'un de sa famille a été prévenu. On ne sait rien de sa vie privée : aucun des documents dépouillés, français, allemands ou tunisiens, ne mentionne une femme, une fiancée, un enfant. L'acte de décès le dit célibataire, et c'est tout ce qu'on a.",
  "Le stade de Béja porte son nom.",
 ],
 "fac": "USBeja-1931-planche.jpg",
 "leg": "L'équipe d'où il est parti, seize ans plus tôt.",
 "src": "L'Afrique du Nord illustrée, 28 février 1931, page 7. Cliché Photo-Sultan, Béja."},

]
