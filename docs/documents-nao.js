/* Les documents que l'application PRODUIT — module « négociation annuelle
   obligatoire ».

   POURQUOI CE FICHIER EXISTE

   Le module d'audit dit ce qui manque ; les fiches de régularisation disent quoi
   faire. Ni l'un ni l'autre ne fait le travail : un employeur à qui l'on
   explique en cinq étapes qu'il doit « convoquer toutes les organisations
   syndicales représentatives » n'a toujours pas de convocation. Il a une
   consigne, et devant lui une page blanche.

   Ce fichier écrit la pièce : la convocation des organisations syndicales avec
   son ordre du jour, le calendrier des réunions, la note d'information remise en
   début de négociation et la liste des informations dues, le procès-verbal de
   première réunion, le procès-verbal de désaccord consignant en leur dernier
   état les propositions respectives des parties et les mesures que l'employeur
   entend appliquer unilatéralement, la trame de l'accord et son plan, le
   courrier de dépôt et son bordereau de pièces, le plan d'action égalité et la
   publication des écarts de rémunération. Le tout au nom de l'entreprise, avec
   ses dates, et accompagné de ses courriers de transmission.

   LE CONTENU DES TEXTES DESCEND DANS LE DOCUMENT. C'est tout l'intérêt. Un
   ordre du jour qui se bornerait à écrire « voir l'article L. 2242-17 »
   rendrait à l'employeur exactement le problème qu'il a. Les huit thèmes y sont
   donc déployés, dans les termes du texte capté, avec sa version.

   TROIS RÈGLES, TENUES PARTOUT

   1. Rien qui n'ait été lu à la source. Les articles cités ici figurent tous
      dans moteur/nao/textes-nao.json avec leur identifiant de version — la
      table T ci-dessous EST ce fichier, recopié sans retouche —, ou dans le
      fondement du contrôle auquel le document répond (c'est le cas des arrêts
      de la Cour de cassation, lus dans Judilibre par controles-nao.js).
      Les articles seulement RENVOYÉS par un texte lu — L. 2231-6 et D. 2231-2
      pour le dépôt, L. 1142-8 et L. 1142-9 pour les indicateurs d'écarts,
      L. 2312-36 pour les données de la base, L. 241-13 du code de la sécurité
      sociale pour les exonérations — sont NOMMÉS, jamais reproduits ni
      paraphrasés : le module ne les a pas lus, et il le dit à l'endroit même où
      le lecteur pourrait croire qu'il les connaît.

   2. Aucune peine annoncée qui ne soit portée par un texte capté, ET qui vise
      l'obligation en cause. Le corpus porte trois sanctions, et pas une de
      plus :
        · L. 2243-1 — un an d'emprisonnement et 3 750 € d'amende, pour les
          obligations « prévues à l'article L. 2242-1 » ;
        · L. 2243-2 — la même peine, pour les obligations « prévues aux
          articles L. 2242-1 et L. 2242-20 » ;
        · L. 2242-7 — la pénalité salaires, qui ne vise que « l'obligation de
          négociation sur les salaires effectifs mentionnée au 1° de l'article
          L. 2242-1 » ;
        · L. 2242-8 — la pénalité de 1 %, qui ne vise que l'égalité
          professionnelle et les publications qui s'y rattachent.
      Aucun de ces textes ne nomme L. 2242-2-1 : le document de la négociation
      sur les salariés expérimentés n'annonce donc AUCUNE peine, et dit
      pourquoi. Aucun ne nomme L. 2242-4 ni L. 2242-5 : les documents du retrait
      d'une décision unilatérale et du procès-verbal de désaccord disent ce qui
      se joue réellement — une interdiction violée, une négociation qui n'a pas
      pris fin, une période qui n'est pas couverte.

   3. Les faits et les chiffres ne s'inventent jamais. Aucun document n'écrit la
      masse salariale, les rémunérations, les propositions patronales ou
      syndicales. Tout cela sort entre crochets, avec l'indication de la source
      où l'employeur ira le chercher — déclaration sociale nominative, base de
      données économiques et sociales, registre unique du personnel. Une
      proposition patronale devinée serait pire qu'absente : elle engagerait
      l'employeur sur ce qu'il n'a pas voulu.                                */
(function (global) {
  "use strict";

  var DP = global.DocumentsProduits;
  if (!DP || typeof DP.ajouter !== "function") return;

  var O = DP.outils;
  var cro = O.cro, leJour = O.leJour, dans = O.dans, entete = O.entete;

  var TRAIT = "────────────────────────────────────────────────────────────────────────";
  var GROS  = "════════════════════════════════════════════════════════════════════════";

  /* ══════════════════════════════════════════════════════════════════════
     LES TEXTES, TELS QUE LE MODULE LES A CAPTÉS

     Recopie de moteur/nao/textes-nao.json — le corpus capté par
     capturer-textes-nao.js et confronté par verifier-textes-nao.js. Chaque
     entrée porte l'identifiant de la VERSION lue : un article peut être modifié
     sans changer de numéro, et le numéro seul ne dit pas laquelle des versions
     successives a été citée.

     Aucune de ces phrases n'est réécrite. Tout ce que les documents citent
     entre guillemets sort d'ici, par citer() ou par morceau(), et rien
     d'autre ne se cite entre guillemets dans ce fichier.
     ══════════════════════════════════════════════════════════════════════ */

  var T = {
    "L2242-1": { num: "L. 2242-1", version: "LEGIARTI000043893962",
      texte: "Dans les entreprises où sont constituées une ou plusieurs sections syndicales d'organisations représentatives, l'employeur engage au moins une fois tous les quatre ans : 1° Une négociation sur la rémunération, notamment les salaires effectifs, le temps de travail et le partage de la valeur ajoutée dans l'entreprise ; 2° Une négociation sur l'égalité professionnelle entre les femmes et les hommes, portant notamment sur les mesures visant à supprimer les écarts de rémunération, et la qualité de vie et des conditions de travail." },
    "L2242-2": { num: "L. 2242-2", version: "LEGIARTI000036262221",
      texte: "Dans les entreprises et les groupes d'entreprises au sens de l'article L. 2331-1 d'au moins trois cents salariés, ainsi que dans les entreprises et groupes d'entreprises de dimension communautaire au sens des articles L. 2341-1 et L. 2341-2 comportant au moins un établissement ou une entreprise d'au moins cent cinquante salariés en France l'employeur engage, au moins une fois tous les quatre ans, en plus des négociations mentionnées à l'article L. 2242-1 , une négociation sur la gestion des emplois et des parcours professionnels." },
    "L2242-2-1": { num: "L. 2242-2-1", version: "LEGIARTI000052432470",
      texte: "Lorsqu'une ou plusieurs sections syndicales d'organisations représentatives sont constituées dans les entreprises et les groupes d'entreprises, au sens de l' article L. 2331-1 , d'au moins trois cents salariés, l'employeur engage, au moins une fois tous les quatre ans, en plus des négociations mentionnées à l' article L. 2242-1 , une négociation sur l'emploi, le travail et l'amélioration des conditions de travail des salariés expérimentés, en considération de leur âge." },
    "L2242-3": { num: "L. 2242-3", version: "LEGIARTI000037389684",
      texte: "En l'absence d'accord relatif à l'égalité professionnelle entre les femmes et les hommes à l'issue de la négociation mentionnée au 2° de l'article L. 2242-1 , l'employeur établit un plan d'action annuel destiné à assurer l'égalité professionnelle entre les femmes et les hommes. Après avoir évalué les objectifs fixés et les mesures prises au cours de l'année écoulée, ce plan d'action, fondé sur des critères clairs, précis et opérationnels, détermine les objectifs de progression prévus pour l'année à venir, définit les actions qualitatives et quantitatives permettant de les atteindre et évalue leur coût. Ce plan d'action est déposé auprès de l'autorité administrative. En l'absence d'accord prévoyant les mesures visant à supprimer les écarts de rémunération entre les femmes et les hommes, la négociation sur les salaires effectifs prévue au 1° de l'article L. 2242-1 porte également sur la programmation de mesures permettant de supprimer les écarts de rémunération et les différences de déroulement de carrière entre les femmes et les hommes." },
    "L2242-4": { num: "L. 2242-4", version: "LEGIARTI000052437071",
      texte: "Tant que la négociation mentionnée aux articles L. 2242-1 , L. 2242-2 et L. 2242-2-1 est en cours, l'employeur ne peut, dans les matières traitées, arrêter de décisions unilatérales concernant la collectivité des salariés, sauf si l'urgence le justifie." },
    "L2242-5": { num: "L. 2242-5", version: "LEGIARTI000035627862",
      texte: "Si, au terme de la négociation, aucun accord n'a été conclu, il est établi un procès-verbal de désaccord dans lequel sont consignées, en leur dernier état, les propositions respectives des parties et les mesures que l'employeur entend appliquer unilatéralement. Ce procès-verbal donne lieu à dépôt, à l'initiative de la partie la plus diligente, dans des conditions prévues par voie réglementaire." },
    "L2242-6": { num: "L. 2242-6", version: "LEGIARTI000035627858",
      texte: "Les accords collectifs d'entreprise sur les salaires effectifs ne peuvent être déposés auprès de l'autorité administrative, dans les conditions prévues à l'article L. 2231-6 , qu'accompagnés d'un procès-verbal d'ouverture des négociations portant sur les écarts de rémunération entre les femmes et les hommes, consignant les propositions respectives des parties. Le procès-verbal atteste que l'employeur a engagé sérieusement et loyalement les négociations. L'engagement sérieux et loyal des négociations implique que, dans les entreprises où sont constituées une ou plusieurs sections syndicales d'organisations représentatives, l'employeur ait convoqué à la négociation les organisations syndicales représentatives dans l'entreprise et fixé le lieu et le calendrier des réunions. L'employeur doit également leur avoir communiqué les informations nécessaires pour leur permettre de négocier en toute connaissance de cause et avoir répondu de manière motivée aux éventuelles propositions des organisations syndicales." },
    "L2242-7": { num: "L. 2242-7", version: "LEGIARTI000035627851",
      texte: "Dans les entreprises où sont constituées une ou plusieurs sections syndicales d'organisations représentatives, l'employeur qui n'a pas rempli l'obligation de négociation sur les salaires effectifs mentionnée au 1° de l'article L. 2242-1 est soumis à une pénalité. Si aucun manquement relatif à cette obligation n'a été constaté lors d'un précédent contrôle au cours des six années civiles précédentes, la pénalité est plafonnée à un montant équivalent à 10 % des exonérations de cotisations sociales mentionnées à l'article L. 241-13 du code de la sécurité sociale au titre des rémunérations versées chaque année où le manquement est constaté, sur une période ne pouvant excéder trois années consécutives à compter de l'année précédant le contrôle. Si au moins un manquement relatif à cette obligation a été constaté lors d'un précédent contrôle au cours des six années civiles précédentes, la pénalité est plafonnée à un montant équivalent à 100 % des exonérations de cotisations sociales mentionnées au même article L. 241-13 au titre des rémunérations versées chaque année où le manquement est constaté, sur une période ne pouvant excéder trois années consécutives comprenant l'année du contrôle. Dans le cas où la périodicité de la négociation sur les salaires effectifs a été portée à une durée supérieure à un an en application de l'article L. 2242-11 du présent code, le premier alinéa n'est pas applicable pendant la durée fixée par l'accord. Au terme de cette durée, il est fait application du premier alinéa du présent article. Lorsque l'autorité administrative compétente constate le manquement mentionné au premier alinéa, elle fixe le montant de la pénalité en tenant compte notamment des efforts constatés pour ouvrir les négociations, de la situation économique et financière de l'entreprise, de la gravité du manquement et des circonstances ayant conduit au manquement, dans des conditions fixées par décret. La pénalité est recouvrée dans les conditions prévues à la section 1 du chapitre VII du titre III du livre Ier du code de la sécurité sociale. Le produit de la pénalité est affecté au régime général de sécurité sociale, selon les mêmes modalités que celles retenues pour l'imputation de la réduction mentionnée à l'article L. 241-13 du même code." },
    "L2242-8": { num: "L. 2242-8", version: "LEGIARTI000051289082",
      texte: "Les entreprises d'au moins cinquante salariés sont soumises à une pénalité à la charge de l'employeur en l'absence d'accord relatif à l'égalité professionnelle entre les femmes et les hommes à l'issue de la négociation mentionnée au 2° de l'article L. 2242-1 ou, à défaut d'accord, par un plan d'action mentionné à l'article L. 2242-3 . Les modalités de suivi de la réalisation des objectifs et des mesures de l'accord et du plan d'action sont fixées par décret. Dans les entreprises d'au moins 300 salariés, ce défaut d'accord est attesté par un procès-verbal de désaccord. La pénalité prévue au premier alinéa du présent article peut également être appliquée, dans des conditions déterminées par décret, en l'absence de publication des informations prévues à l'article L. 1142-8 ou en l'absence de mesures définies dans les conditions prévues à l'article L. 1142-9 . Le montant de la pénalité prévue au premier alinéa du présent article est fixé au maximum à 1 % des rémunérations et gains au sens du premier alinéa de l'article L. 242-1 du code de la sécurité sociale et du premier alinéa de l'article L. 741-10 du code rural et de la pêche maritime versés aux travailleurs salariés ou assimilés au cours des périodes au titre desquelles l'entreprise ne respecte pas l'une des obligations mentionnées aux premier et deuxième alinéas du présent article. Le montant est fixé par l'autorité administrative, dans des conditions prévues par décret en Conseil d'Etat, en fonction des efforts constatés dans l'entreprise en matière d'égalité professionnelle et salariale entre les femmes et les hommes ainsi que des motifs de sa défaillance quant au respect des obligations fixées aux mêmes premier et deuxième alinéas. Le produit de cette pénalité est affecté à la branche mentionnée au 3° de l'article L. 200-2 du code de la sécurité sociale." },
    "L2242-9": { num: "L. 2242-9", version: "LEGIARTI000035627834",
      texte: "L'autorité administrative se prononce sur toute demande d'appréciation de la conformité d'un accord ou d'un plan d'action aux dispositions de l'article L. 2242-8 formulée par un employeur. Le silence gardé par l'autorité administrative, à l'issue d'un délai fixé par décret en Conseil d'Etat, vaut rejet de cette demande. La demande mentionnée au premier alinéa n'est pas recevable dès lors que les services chargés de l'application de la législation du travail ont engagé un contrôle sur le respect des dispositions de l'article L. 2242-8. Ces services informent l'employeur par tout moyen lorsque ce contrôle est engagé. Lorsque l'entreprise est couverte par l'accord relatif à l'égalité professionnelle à l'issue de la négociation mentionnée au 2° de l'article L. 2242-1 , la réponse établissant la conformité lie l'autorité administrative pour l'application de la pénalité prévue à l'article L. 2242-8 pendant la période comprise entre la date de réception de la réponse par l'employeur et le terme de la périodicité de renégociation sur le thème de l'égalité professionnelle résultant de l'application de l'article L. 2242-11 ou de l'article L. 2242-12 ou, à défaut, du 2° de l'article L. 2242-13 . Lorsque l'entreprise est couverte par un plan d'action en application des dispositions de l'article L. 2242-3 , la réponse établissant la conformité lie l'autorité administrative pour l'application de la pénalité prévue à l'article L. 2242-8 pendant la période comprise entre la date de réception de la réponse par l'employeur et le terme de la première année suivant le dépôt du plan d'action." },
    "L2242-10": { num: "L. 2242-10", version: "LEGIARTI000035627827",
      texte: "Dans les entreprises mentionnées à l'article L. 2242-1 , peut être engagée, à l'initiative de l'employeur ou à la demande d'une organisation syndicale de salariés représentative, une négociation précisant le calendrier, la périodicité, les thèmes et les modalités de négociation dans le groupe, l'entreprise ou l'établissement." },
    "L2242-11": { num: "L. 2242-11", version: "LEGIARTI000052437060",
      texte: "L'accord conclu à l'issue de la négociation mentionnée à l'article L. 2242-10 précise : 1° Les thèmes des négociations et leur périodicité, de telle sorte qu'au moins tous les quatre ans soient négociés les thèmes mentionnés aux 1° et 2° de l'article L. 2242-1 et aux articles L. 2242-2 et L. 2242-2-1 ; 2° Le contenu de chacun des thèmes ; 3° Le calendrier et les lieux des réunions ; 4° Les informations que l'employeur remet aux négociateurs sur les thèmes prévus par la négociation qui s'engage et la date de cette remise ; 5° Les modalités selon lesquelles sont suivis les engagements souscrits par les parties. La durée de l'accord ne peut excéder quatre ans." },
    "L2242-12": { num: "L. 2242-12", version: "LEGIARTI000052437050",
      texte: "Un accord conclu dans l'un des domaines énumérés aux 1° et 2° de l'article L. 2242-1 et aux articles L. 2242-2 et L. 2242-2-1 peut fixer la périodicité de sa renégociation, dans la limite de quatre ans." },
    "L2242-13": { num: "L. 2242-13", version: "LEGIARTI000052437044",
      texte: "A défaut d'accord prévu à l'article L. 2242-11 ou en cas de non-respect de ses stipulations, l'employeur engage, dans les entreprises mentionnées à ce même article : 1° Chaque année, une négociation sur la rémunération, le temps de travail et le partage de la valeur ajoutée dans l'entreprise, dans les conditions prévues à la sous-section 2 de la présente section ; 2° Chaque année, une négociation sur l'égalité professionnelle entre les femmes et les hommes et la qualité de vie et des conditions de travail, dans les conditions prévues à la sous-section 3 de la présente section ; 3° Tous les trois ans, dans les entreprises d'au moins trois cents salariés mentionnées à l'article L. 2242-2 , une négociation sur la gestion des emplois et des parcours professionnels, dans les conditions prévues à la sous-section 4 de la présente section. 4° Tous les trois ans, dans les entreprises d'au moins trois cents salariés mentionnées à l' article L. 2242-2-1 , une négociation sur l'emploi, le travail et l'amélioration des conditions de travail des salariés expérimentés, en considération de leur âge, dans les conditions prévues à la sous-section 5 de la présente section. A défaut d'une initiative de l'employeur depuis plus de douze mois, pour chacune des deux négociations annuelles, et depuis plus de trente-six mois, pour la négociation triennale, suivant la précédente négociation, cette négociation s'engage obligatoirement à la demande d'une organisation syndicale représentative. La demande de négociation formulée par l'organisation syndicale est transmise dans les huit jours par l'employeur aux autres organisations représentatives. Dans les quinze jours qui suivent la demande formulée par une organisation syndicale, l'employeur convoque les parties à la négociation." },
    "L2242-14": { num: "L. 2242-14", version: "LEGIARTI000035627802",
      texte: "Lors de la première réunion sont précisés : 1° Le lieu et le calendrier de la ou des réunions ; 2° Les informations que l'employeur remettra aux délégués syndicaux et aux salariés composant la délégation sur les thèmes prévus par la négociation qui s'engage et la date de cette remise." },
    "L2242-15": { num: "L. 2242-15", version: "LEGIARTI000038837123",
      texte: "La négociation annuelle sur la rémunération, le temps de travail et le partage de la valeur ajoutée dans l'entreprise porte sur : 1° Les salaires effectifs ; 2° La durée effective et l'organisation du temps de travail, notamment la mise en place du travail à temps partiel. Dans ce cadre, la négociation peut également porter sur la réduction du temps de travail ; 3° L'intéressement, la participation et l'épargne salariale, à défaut d'accord d'intéressement, d'accord de participation, de plan d'épargne d'entreprise, de plan d'épargne pour la mise à la retraite collectif ou d'accord de branche comportant un ou plusieurs de ces dispositifs. S'il y a lieu, la négociation porte également sur l'affectation d'une partie des sommes collectées dans le cadre du plan d'épargne pour la retraite collectif mentionné à l'article L. 3334-1 du présent code ou du plan d'épargne retraite d'entreprise collectif mentionné à l' article L. 224-14 du code monétaire et financier et sur l'acquisition de parts de fonds investis dans les entreprises solidaires mentionnés à l'article L. 3334-13 du présent code ou à l' article L. 224-3 du code monétaire et financier . La même obligation incombe aux groupements d'employeurs ; 4° Le suivi de la mise en œuvre des mesures visant à supprimer les écarts de rémunération et les différences de déroulement de carrière entre les femmes et les hommes." },
    "L2242-16": { num: "L. 2242-16", version: "LEGIARTI000035627789",
      texte: "La négociation prévue à l'article L. 2242-15 donne lieu à une information par l'employeur sur les mises à disposition de salariés auprès des organisations syndicales ou des associations d'employeurs mentionnées à l'article L. 2231-1 . Dans les entreprises qui ne sont pas soumises à cette obligation annuelle de négocier, l'employeur communique aux salariés qui en font la demande une information sur les mises à disposition de salariés auprès des organisations syndicales ou des associations d'employeurs mentionnées à l'article L. 2231-1." },
    "L2242-17": { num: "L. 2242-17", version: "LEGIARTI000043893940",
      texte: "La négociation annuelle sur l'égalité professionnelle entre les femmes et les hommes et la qualité de vie et des conditions de travail porte sur : 1° L'articulation entre la vie personnelle et la vie professionnelle pour les salariés ; 2° Les objectifs et les mesures permettant d'atteindre l'égalité professionnelle entre les femmes et les hommes, notamment en matière de suppression des écarts de rémunération, d'accès à l'emploi, de formation professionnelle, de déroulement de carrière et de promotion professionnelle, de conditions de travail et d'emploi, en particulier pour les salariés à temps partiel, et de mixité des emplois. Cette négociation s'appuie sur les données mentionnées au 2° de l'article L. 2312-36 . Cette négociation porte également sur l'application de l'article L. 241-3-1 du code de la sécurité sociale et sur les conditions dans lesquelles l'employeur peut prendre en charge tout ou partie du supplément de cotisations ; 3° Les mesures permettant de lutter contre toute discrimination en matière de recrutement, d'emploi et d'accès à la formation professionnelle, en favorisant notamment les conditions d'accès aux critères définis aux II et III de l'article L. 6315-1 ; 4° Les mesures relatives à l'insertion professionnelle et au maintien dans l'emploi des travailleurs handicapés, notamment les conditions d'accès à l'emploi, à la formation et à la promotion professionnelles, les conditions de travail et d'emploi et les actions de sensibilisation de l'ensemble du personnel au handicap ; 5° Les modalités de définition d'un régime de prévoyance et, dans des conditions au moins aussi favorables que celles prévues à l'article L. 911-7 du code de la sécurité sociale, d'un régime de remboursements complémentaires de frais occasionnés par une maladie, une maternité ou un accident, à défaut de couverture par un accord de branche ou un accord d'entreprise. Dans les entreprises de travaux forestiers mentionnées au 3° de l'article L. 722-1 du code rural et de la pêche maritime, la négociation définie au premier alinéa du présent 5° porte sur l'accès aux garanties collectives mentionnées à l'article L. 911-2 du code de la sécurité sociale ; 6° L'exercice du droit d'expression directe et collective des salariés prévu au chapitre Ier du titre VIII du présent livre, notamment au moyen des outils numériques disponibles dans l'entreprise ; 7° Les modalités du plein exercice par le salarié de son droit à la déconnexion et la mise en place par l'entreprise de dispositifs de régulation de l'utilisation des outils numériques, en vue d'assurer le respect des temps de repos et de congé ainsi que de la vie personnelle et familiale. A défaut d'accord, l'employeur élabore une charte, après avis du comité social et économique. Cette charte définit ces modalités de l'exercice du droit à la déconnexion et prévoit en outre la mise en œuvre, à destination des salariés et du personnel d'encadrement et de direction, d'actions de formation et de sensibilisation à un usage raisonnable des outils numériques. 8° Dans les entreprises mentionnées à l'article L. 2143-3 du présent code et dont cinquante salariés au moins sont employés sur un même site, les mesures visant à améliorer la mobilité des salariés entre leur lieu de résidence habituelle et leur lieu de travail, notamment en réduisant le coût de la mobilité, en incitant à l'usage des modes de transport vertueux ainsi que par la prise en charge des frais mentionnés aux articles L. 3261-3 et L. 3261-3-1 ." },
    "L2242-18": { num: "L. 2242-18", version: "LEGIARTI000035627777",
      texte: "La négociation sur l'insertion professionnelle et le maintien dans l'emploi des travailleurs handicapés se déroule sur la base d'un rapport établi par l'employeur présentant la situation par rapport à l'obligation d'emploi des travailleurs handicapés prévue par les articles L. 5212-1 et suivants ." },
    "L2242-19": { num: "L. 2242-19", version: "LEGIARTI000036262303",
      texte: "La négociation prévue à l'article L. 2242-17 peut également porter sur la prévention des effets de l'exposition aux facteurs de risques professionnels prévue à l'article L. 4161-1. L'accord conclu sur ce thème dans le cadre du présent article vaut conclusion de l'accord mentionné à l'article L. 4163-3 , sous réserve du respect des autres dispositions prévues au chapitre III du titre VI du livre Ier de la quatrième partie du présent code." },
    "L2242-20": { num: "L. 2242-20", version: "LEGIARTI000043975202",
      texte: "Dans les entreprises et les groupes d'entreprises au sens de l'article L. 2331-1 d'au moins trois cents salariés, ainsi que dans les entreprises et groupes d'entreprises de dimension communautaire au sens des articles L. 2341-1 et L. 2341-2 comportant au moins un établissement ou une entreprise d'au moins cent cinquante salariés en France, l'employeur engage tous les trois ans, notamment sur le fondement des orientations stratégiques de l'entreprise et de leurs conséquences mentionnées à l'article L. 2323-10 , une négociation sur la gestion des emplois et des parcours professionnels et sur la mixité des métiers portant sur : 1° La mise en place d'un dispositif de gestion prévisionnelle des emplois et des compétences, notamment pour répondre aux enjeux de la transition écologique, ainsi que sur les mesures d'accompagnement susceptibles de lui être associées, en particulier en matière de formation, d'abondement du compte personnel de formation, de validation des acquis de l'expérience, de bilan de compétences ainsi que d'accompagnement de la mobilité professionnelle et géographique des salariés autres que celles prévues dans le cadre de l'article L. 2254-2 ; 2° Le cas échéant, les conditions de la mobilité professionnelle ou géographique interne à l'entreprise prévue à l'article L. 2254-2, qui doivent, en cas d'accord, faire l'objet d'un chapitre spécifique ; 3° Les grandes orientations à trois ans de la formation professionnelle dans l'entreprise et les objectifs du plan de développement des compétences, en particulier les catégories de salariés et d'emplois auxquels ce dernier est consacré en priorité, les compétences et qualifications à acquérir pendant la période de validité de l'accord ainsi que les critères et modalités d'abondement par l'employeur du compte personnel de formation ; 4° Les perspectives de recours par l'employeur aux différents contrats de travail, au travail à temps partiel et aux stages, ainsi que les moyens mis en œuvre pour diminuer le recours aux emplois précaires dans l'entreprise au profit des contrats à durée indéterminée ; 5° Les conditions dans lesquelles les entreprises sous-traitantes sont informées des orientations stratégiques de l'entreprise ayant un effet sur leurs métiers, l'emploi et les compétences ; 6° Le déroulement de carrière des salariés exerçant des responsabilités syndicales et l'exercice de leurs fonctions. Un bilan est réalisé à l'échéance de l'accord." },
    "L2242-21": { num: "L. 2242-21", version: "LEGIARTI000052437031",
      texte: "La négociation prévue à l'article L. 2242-20 peut également porter : 1° Sur les matières mentionnées aux articles L. 1233-21 et L. 1233-22 selon les modalités prévues à ces mêmes articles ; 2° Sur la qualification des catégories d'emplois menacés par les évolutions économiques ou technologiques ; 3° Sur les modalités de l'association des entreprises sous-traitantes au dispositif de gestion prévisionnelle des emplois et des compétences de l'entreprise ; 4° Sur les conditions dans lesquelles l'entreprise participe aux actions de gestion prévisionnelle des emplois et des compétences mises en œuvre à l'échelle des territoires où elle est implantée ; 5° Sur la mise en place de congés de mobilités dans les conditions prévues par les articles L. 1237-18 et suivants ; 6° Sur la formation et l'insertion durable des jeunes dans l'emploi, les perspectives de développement de l'alternance, ainsi que les modalités d'accueil des alternants et des stagiaires ; 7° Sur les modalités d'organisation des périodes de reconversion externe, prévues à l' article L. 6324-9 . L'accord conclu sur ce thème dans le cadre du présent article vaut conclusion de l'accord mentionné à l'article L. 6324-9." },
    "L2243-1": { num: "L. 2243-1", version: "LEGIARTI000031086617",
      texte: "Le fait de se soustraire aux obligations prévues à l'article L. 2242-1 , relatives à la convocation des parties à la négociation et à l'obligation périodique de négocier, est puni d'un emprisonnement d'un an et d'une amende de 3 750 euros." },
    "L2243-2": { num: "L. 2243-2", version: "LEGIARTI000031086604",
      texte: "Le fait de se soustraire aux obligations prévues aux articles L. 2242-1 et L. 2242-20 est puni d'un emprisonnement d'un an et d'une amende de 3 750 euros." },
    "R2242-1": { num: "R. 2242-1", version: "LEGIARTI000036222825",
      texte: "Lorsqu'aucun accord n'a été conclu au terme de la négociation obligatoire en entreprise, le procès-verbal de désaccord établi est déposé dans les conditions prévues à l'article D. 2231-2 ." },
  };

  /* ══════════════════════════════════════════════════════════════════════
     LES OUTILS
     ══════════════════════════════════════════════════════════════════════ */

  function P(ctx) { return (ctx && ctx.profil) || {}; }
  function F(ctx) { return (ctx && ctx.fiche) || {}; }

  function nomDe(ctx) {
    var p = P(ctx), f = F(ctx);
    return cro(p.denomination || p.entreprise || f.entreprise, "DÉNOMINATION SOCIALE");
  }
  function villeDe(ctx) { return cro(P(ctx).ville, "lieu"); }
  function adresseDe(ctx) { return cro(P(ctx).adresse, "adresse du siège"); }
  function signataire(ctx) { return cro(P(ctx).responsable, "Nom et qualité du signataire"); }
  function conventionDe(ctx) {
    return cro(P(ctx).conventionCollective || F(ctx).conventionCollective,
      "convention collective applicable");
  }

  function aujourd(ctx) {
    return ctx && ctx.aujourdhui instanceof Date && !isNaN(ctx.aujourdhui)
      ? ctx.aujourdhui : new Date();
  }

  /* L'effectif, quelle que soit la façon dont il a été saisi : le formulaire
     rend des chaînes, le profil un nombre. Un effectif illisible n'est pas un
     effectif — il vaut « inconnu », et le document le dit plutôt que d'en
     deviner un. */
  function effectifDe(ctx) {
    var v = P(ctx).effectif;
    if (v === undefined || v === null || v === "") v = F(ctx).effectif;
    if (typeof v === "number") return isFinite(v) ? v : null;
    var s = String(v == null ? "" : v).replace(/[^0-9]/g, "");
    return s === "" ? null : parseInt(s, 10);
  }

  /* Le seuil de trois cents salariés de L. 2242-2 et L. 2242-2-1 : entreprise,
     groupe au sens de L. 2331-1, ou dimension communautaire avec au moins cent
     cinquante salariés en France. C'est la lecture de moteur-nao.js, reprise
     ici sans y rien ajouter. */
  function seuil300(ctx) {
    var f = F(ctx), n = effectifDe(ctx);
    var g = estOui(f.groupe) ? nombre(f.effectifGroupe) : null;
    var com = estOui(f.dimensionCommunautaire) && nombre(f.effectifFrance) !== null &&
      nombre(f.effectifFrance) >= 150;
    if (n === null && g === null && vide(f.dimensionCommunautaire))
      return { connu: false, atteint: null, effectif: null, groupe: g };
    return { connu: true, effectif: n, groupe: g,
      atteint: (n !== null && n >= 300) || (g !== null && g >= 300) || com };
  }
  function nombre(v) {
    if (typeof v === "number") return isFinite(v) ? v : null;
    var s = String(v == null ? "" : v).replace(/[^0-9]/g, "");
    return s === "" ? null : parseInt(s, 10);
  }

  /* La fiche NAO porte les négociations imbriquées sous « negos ». Le
     formulaire de la page d'audit les rend en JSON, le dossier d'exemple en
     objet : les deux formes se lisent ici, et une forme illisible vaut objet
     vide plutôt qu'exception. */
  function negoDe(ctx, cle) {
    var n = (F(ctx).negos || {})[cle];
    if (typeof n === "string") {
      try { n = JSON.parse(n); } catch (e) { n = null; }
    }
    return (n && typeof n === "object") ? n : {};
  }
  function bloc(ctx, cle) {
    var b = F(ctx)[cle];
    if (typeof b === "string") { try { b = JSON.parse(b); } catch (e) { b = null; } }
    return (b && typeof b === "object") ? b : {};
  }

  function estOui(v) { return v === true || v === "oui"; }
  function estNon(v) { return v === false || v === "non"; }
  function vide(v) {
    return v === undefined || v === null || v === "" ||
      (Array.isArray(v) && !v.length) || (typeof v === "string" && !v.trim());
  }
  function etat(v, oui, non) {
    if (estOui(v)) return oui;
    if (estNon(v)) return non;
    return "non renseigné — à vérifier sur les pièces";
  }
  function liste(v) {
    if (Array.isArray(v)) return v.map(function (x) { return String(x); }).filter(Boolean);
    if (vide(v)) return [];
    return String(v).split(/\n|;|,/).map(function (x) { return x.trim(); }).filter(Boolean);
  }

  /* Une date du dossier, écrite en toutes lettres — ou son crochet. */
  function estISO(v) {
    return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) &&
      !isNaN(new Date(v + "T12:00:00Z").getTime());
  }
  function dateDe(iso) {
    if (!estISO(iso)) return null;
    var p = iso.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function jour(iso, quoi) {
    var d = dateDe(iso);
    return d ? leJour(d) : "[" + (quoi || "date") + "]";
  }
  /* Le même quantième, n mois plus tard : la façon dont moteur-nao.js compte
     les douze mois et les trente-six mois de L. 2242-13. */
  function moisApres(iso, n) {
    var d = dateDe(iso);
    if (!d) return null;
    var t = d.getFullYear() * 12 + d.getMonth() + n;
    var an = Math.floor(t / 12), mo = t - an * 12;
    var dernier = new Date(an, mo + 1, 0).getDate();
    return new Date(an, mo, Math.min(d.getDate(), dernier));
  }
  /* Une date du dossier décalée de n jours, ou null si la date manque. */
  function joursApres(iso, n) {
    var d = dateDe(iso);
    return d ? dans(d, n) : null;
  }

  /* Un texte long, coupé pour tenir dans la largeur du document. Les articles
     du code font parfois trois mille caractères : les laisser sur une seule
     ligne rendrait le document illisible dans un traitement de texte. */
  function plier(t, largeur) {
    var bruts = String(t == null ? "" : t).split(/\s+/).filter(Boolean);
    /* « L. 2242-1 » ne se coupe pas en fin de ligne, ni « n° 24-15.653 » : un
       numéro d'article ou de pourvoi coupé en deux ne se retrouve plus dans une
       recherche, et se relit mal. Les deux morceaux voyagent donc ensemble. */
    var mots = [];
    for (var q = 0; q < bruts.length; q++) {
      if (/^([LRD]\.|n°|art\.)$/.test(bruts[q]) && q + 1 < bruts.length) {
        mots.push(bruts[q] + " " + bruts[q + 1]); q++;
      } else mots.push(bruts[q]);
    }
    var out = [], ligne = "";
    for (var i = 0; i < mots.length; i++) {
      if (ligne === "") { ligne = mots[i]; continue; }
      if ((ligne + " " + mots[i]).length > largeur) { out.push(ligne); ligne = mots[i]; }
      else ligne += " " + mots[i];
    }
    if (ligne !== "") out.push(ligne);
    if (!out.length) out.push("");
    return out;
  }
  function pousserPlie(L, t, largeur, prefixe, retrait) {
    var lignes = plier(t, largeur);
    L.push((prefixe || "") + lignes[0]);
    for (var i = 1; i < lignes.length; i++) L.push((retrait || "") + lignes[i]);
  }

  /* ══════════════════════════════════════════════════════════════════════
     CITER — la seule porte par laquelle un texte entre dans un document

     Rien ne se cite entre guillemets qui ne sorte de la table T. citer() rend
     l'article entier ; morceau() rend un fragment EXACT, découpé entre deux
     repères présents dans le texte capté — jamais reformulé. Si le repère n'y
     est pas, morceau() rend une chaîne vide et le document se passe de la
     citation plutôt que d'en inventer une.
     ══════════════════════════════════════════════════════════════════════ */

  function num(cle) { return (T[cle] || {}).num || cle; }
  function version(cle) { return (T[cle] || {}).version || "[version non captée]"; }
  function texteDe(cle) { return (T[cle] || {}).texte || ""; }

  function citer(L, cle, intro) {
    var t = texteDe(cle);
    if (intro) L.push(intro);
    if (!t) {
      L.push("[L'article " + num(cle) + " n'est pas dans le corpus capté par ce module :");
      L.push("son contenu n'est donc ni reproduit ni résumé ici.]");
      L.push("");
      return L;
    }
    pousserPlie(L, "« " + t + " »", 70, "  ", "  ");
    L.push("  (" + num(cle) + ", version " + version(cle) + ")");
    L.push("");
    return L;
  }

  /* Un fragment exact du texte capté, entre deux repères qui s'y trouvent. Le
     fragment commence au repère « depuis » et s'arrête AVANT « jusqu » ; sans
     « jusqu », il court jusqu'à la fin. */
  function morceau(cle, depuis, jusqu) {
    var t = texteDe(cle);
    if (!t) return "";
    var a = depuis ? t.indexOf(depuis) : 0;
    if (a < 0) return "";
    var b = jusqu ? t.indexOf(jusqu, a + 1) : -1;
    return (b < 0 ? t.slice(a) : t.slice(a, b)).trim();
  }
  function citerMorceau(L, cle, depuis, jusqu, prefixe) {
    var m = morceau(cle, depuis, jusqu);
    if (!m) return L;
    pousserPlie(L, "« " + m + " »", 70, prefixe || "  ", prefixe || "  ");
    L.push((prefixe || "  ") + "(" + num(cle) + ", version " + version(cle) + ")");
    L.push("");
    return L;
  }

  /* ══════════════════════════════════════════════════════════════════════
     LES DÉCISIONS

     Lues dans Judilibre le 21 août 2026, réponse non relaxée, et versées au
     fondement des contrôles NAO-CTL-UNI-01, NAO-CTL-ISS-01, NAO-CTL-REG-02 et
     NAO-CTL-PEN-01. Elles sont citées pour ce qu'elles disent, et rien de plus.
     ══════════════════════════════════════════════════════════════════════ */

  var ARRETS = {
    finDesNegociations: {
      ref: "Soc., 15 avril 2026, n° 24-15.653, publié",
      dit: "Il résulte des articles L. 2242-1, L. 2242-4 et L. 2242-5 du code du " +
           "travail que les négociations obligatoires ne peuvent être considérées " +
           "comme ayant pris fin avant l'établissement d'un procès-verbal de désaccord.",
    },
    niveauxParAccord: {
      ref: "Soc., 3 avril 2024, n° 22-15.784, publié",
      dit: "Il résulte de l'article L. 2242-1 du code du travail […] et de l'article " +
           "L. 2242-10 du même code qu'un accord collectif négocié et signé aux " +
           "conditions de droit commun peut définir, dans les entreprises comportant " +
           "des établissements distincts, les niveaux auxquels la négociation " +
           "obligatoire visée à l'article L. 2242-1 du code du travail est conduite.",
    },
    representativite: {
      ref: "Soc., 11 septembre 2024, n° 23-14.333, publié",
      dit: "Il résulte des articles L. 2242-2, L. 2242-20 du code du travail et " +
           "L. 2312-22 du même code […] que l'obligation de négociation sur la " +
           "gestion des emplois et des parcours professionnels est subordonnée à " +
           "l'existence d'une ou plusieurs organisations syndicales représentatives " +
           "au niveau de l'entreprise.",
    },
    engagerNonConclure: {
      ref: "2e Civ., 7 novembre 2019, n° 18-21.499, publié",
      dit: "L'employeur est seulement tenu, pour bénéficier de la réduction des " +
           "cotisations à sa charge sur les bas salaires prévue par l'article " +
           "L. 241-13, III, du code de la sécurité sociale, d'engager la négociation " +
           "annuelle obligatoire prévue par l'article L. 2242-8, 1°, du code du " +
           "travail, et non de parvenir à la conclusion d'un accord.",
    },
  };

  function citerArret(L, a, prefixe) {
    var p = prefixe || "  ";
    L.push(p + a.ref + " :");
    pousserPlie(L, "« " + a.dit + " »", 70, p, p);
    L.push("");
    return L;
  }

  /* ══════════════════════════════════════════════════════════════════════
     LES BLOCS COMMUNS
     ══════════════════════════════════════════════════════════════════════ */

  /* Le mode d'emploi, en tête de chaque document. */
  function modeDEmploi(L, quoi) {
    L.push("COMMENT SE SERVIR DE CE DOCUMENT");
    L.push("");
    L.push("Ce que vous lisez est " + quoi + ", rédigé au nom de votre entreprise.");
    L.push("Ce qui est entre crochets vous appartient : ce sont vos chiffres, vos");
    L.push("dates, vos propositions. L'application ne les connaît pas et ne les");
    L.push("inventera pas — un document qui devinerait votre proposition salariale");
    L.push("vous engagerait sur ce que vous n'avez pas voulu. Remplacez chaque");
    L.push("crochet, ou supprimez la ligne si elle ne vous concerne pas.");
    L.push("");
    L.push("Chaque partie porte l'article qui la commande, avec la version lue à la");
    L.push("source. Gardez ces mentions : ce sont elles qui vous permettront de");
    L.push("montrer, devant les organisations syndicales comme devant le juge, d'où");
    L.push("vient ce que vous avez écrit.");
    L.push("");
    L.push(TRAIT);
    L.push("");
    return L;
  }

  /* À qui la convocation s'adresse. Une seule organisation oubliée vicie la
     négociation : L. 2242-6 range la convocation de TOUTES les organisations
     représentatives dans l'engagement sérieux et loyal. */
  function destinataires(L) {
    L.push("À QUI CE COURRIER S'ADRESSE — À TOUTES, SANS EXCEPTION");
    L.push("");
    citerMorceau(L, "L2242-6", "L'engagement sérieux et loyal", "L'employeur doit également");
    L.push("  · [Organisation syndicale représentative n° 1 — nom, délégué syndical]");
    L.push("  · [Organisation syndicale représentative n° 2 — nom, délégué syndical]");
    L.push("  · [Organisation syndicale représentative n° 3 — nom, délégué syndical]");
    L.push("  · [Ajouter autant de lignes que d'organisations représentatives]");
    L.push("");
    L.push("La liste se dresse à partir des désignations de délégués syndicaux");
    L.push("reçues et des résultats du premier tour des dernières élections");
    L.push("professionnelles. Une organisation représentative non convoquée suffit à");
    L.push("faire tomber l'engagement sérieux et loyal de la négociation.");
    L.push("");
    return L;
  }

  /* L'en-tête d'un courrier aux organisations syndicales. */
  function courrierOS(ctx, objet, corps, options) {
    var opt = options || {};
    var L = [GROS, "COURRIER — " + objet.toUpperCase(), GROS, ""];
    if (opt.avant) opt.avant.forEach(function (x) { L.push(x); });
    if (opt.avant) L.push("");
    L.push(nomDe(ctx));
    L.push(adresseDe(ctx));
    L.push("");
    L.push(opt.a || "Aux organisations syndicales représentatives dans l'entreprise");
    L.push(opt.a2 || "— à l'attention de chaque délégué syndical");
    L.push("");
    L.push(villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
    L.push("");
    L.push(opt.envoi || "Remise en main propre contre décharge, ou lettre recommandée avec");
    if (!opt.envoi) L.push("demande d'avis de réception — la preuve de la date compte autant que l'envoi");
    L.push("");
    L.push("Objet : " + objet);
    L.push("");
    L.push(opt.appel || "Mesdames, Messieurs,");
    L.push("");
    (corps || []).forEach(function (x) { L.push(x); });
    L.push("");
    L.push(opt.formule || "Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
    if (!opt.formule) L.push("considération distinguée.");
    L.push("");
    L.push(signataire(ctx));
    L.push("");
    if (opt.pj && opt.pj.length) {
      L.push("Pièces jointes :");
      opt.pj.forEach(function (x) { L.push("  · " + x); });
      L.push("");
    }
    return L;
  }

  /* Le bordereau : ce qui part, et ce qui reste au dossier. */
  function bordereau(L, titre, pieces) {
    L.push("════ " + titre.toUpperCase() + " ════");
    L.push("");
    for (var i = 0; i < pieces.length; i++)
      pousserPlie(L, pieces[i], 66, "  " + (i + 1) + ". ", "     ");
    L.push("");
    L.push("Une pièce déclarée et non versée ne prouve rien. Le récépissé de dépôt,");
    L.push("lui, prouve le dépôt — le procès-verbal seul ne le prouve pas.");
    L.push("");
    return L;
  }

  /* Le calendrier, calculé. Chaque document en porte un : une obligation sans
     date se remet au lendemain. */
  function calendrier(ctx, lignes) {
    var L = [GROS, "VOTRE CALENDRIER", GROS, ""];
    L.push("Compté depuis aujourd'hui, " + leJour(aujourd(ctx)) + ".");
    L.push("");
    (lignes || []).forEach(function (x) { L.push(x); });
    L.push("");
    return L;
  }
  function ech(ctx, jours, quoi) {
    return "  · " + leJour(dans(aujourd(ctx), jours)) + " — " + quoi;
  }
  function suite(texte) { return "    " + texte; }

  /* ══════════════════════════════════════════════════════════════════════
     L'EXPOSITION — ce qui est encouru, et rien de plus

     Chaque bloc ci-dessous ne s'emploie que dans le document dont l'obligation
     est visée par le texte qu'il cite. C'est la deuxième règle du fichier, et
     elle se tient ici plutôt que dans quinze rédactions séparées.
     ══════════════════════════════════════════════════════════════════════ */

  /* L. 2243-1 : la peine vise les obligations « prévues à l'article
     L. 2242-1 » — la rémunération et l'égalité, et elles seules. */
  function expositionL22431(L) {
    L.push("════ CE QUI EST ENCOURU ════");
    L.push("");
    citer(L, "L2243-1");
    L.push("Le texte vise les obligations prévues à l'article L. 2242-1 : la");
    L.push("négociation sur la rémunération (1°) et la négociation sur l'égalité");
    L.push("professionnelle (2°). Deux comportements y tombent — se soustraire à la");
    L.push("convocation des parties, et se soustraire à l'obligation périodique de");
    L.push("négocier.");
    L.push("");
    return L;
  }

  /* L. 2243-2 : la peine vise les obligations « prévues aux articles L. 2242-1
     et L. 2242-20 » — la gestion des emplois et des parcours en fait partie. */
  function expositionL22432(L) {
    L.push("════ CE QUI EST ENCOURU ════");
    L.push("");
    citer(L, "L2243-2");
    L.push("Le texte nomme l'article L. 2242-20 : c'est l'article qui porte la");
    L.push("négociation sur la gestion des emplois et des parcours professionnels.");
    L.push("Cette négociation-là est donc couverte par la peine.");
    L.push("");
    return L;
  }

  /* L. 2242-7 : la pénalité salaires, et seulement les salaires effectifs. */
  function expositionL22427(L) {
    L.push("════ LA PÉNALITÉ SALAIRES, ET SON PLAFOND ════");
    L.push("");
    citer(L, "L2242-7");
    L.push("Trois choses à retenir, qui sont dans le texte et non ailleurs :");
    L.push("");
    L.push("  · la pénalité ne vise QUE l'obligation de négociation sur les salaires");
    L.push("    effectifs du 1° de L. 2242-1 ;");
    L.push("  · le plafond passe de 10 % à 100 % des exonérations si un manquement a");
    L.push("    déjà été constaté lors d'un contrôle au cours des six années civiles");
    L.push("    précédentes ;");
    L.push("  · le montant est fixé par l'autorité administrative en tenant compte");
    L.push("    notamment des efforts constatés pour ouvrir les négociations. Une");
    L.push("    ouverture, même tardive, se voit donc dans le montant : c'est une");
    L.push("    exposition, pas un chiffrage.");
    L.push("");
    L.push("L'article L. 241-13 du code de la sécurité sociale, auquel L. 2242-7");
    L.push("renvoie pour l'assiette, n'a PAS été lu à la source par ce module : il est");
    L.push("nommé, non reproduit. Le montant de vos exonérations se lit sur vos");
    L.push("déclarations sociales nominatives.");
    L.push("");
    return L;
  }

  /* L. 2242-8 : la pénalité égalité, à partir de cinquante salariés. */
  function expositionL22428(L, ctx) {
    var n = effectifDe(ctx);
    L.push("════ LA PÉNALITÉ ÉGALITÉ, ET CE QU'ELLE VISE ════");
    L.push("");
    citer(L, "L2242-8");
    L.push("Elle vise les entreprises d'au moins cinquante salariés" +
      (n === null ? " — votre effectif n'est pas"
                  : (n >= 50 ? ", ce qui est le cas :" : ", ce qui n'est pas le cas :")));
    if (n === null) L.push("renseigné, vérifiez-le avant de conclure quoi que ce soit.");
    else L.push("l'entreprise en compte " + n + ".");
    L.push("");
    L.push("Quatre manquements y conduisent, et le texte les nomme : l'absence");
    L.push("d'accord d'égalité professionnelle, l'absence de plan d'action à défaut");
    L.push("d'accord, l'absence de publication des informations prévues à l'article");
    L.push("L. 1142-8, et l'absence de mesures définies dans les conditions prévues à");
    L.push("l'article L. 1142-9.");
    L.push("");
    L.push("Les articles L. 1142-8 et L. 1142-9 ne sont PAS dans le corpus lu par ce");
    L.push("module : ils sont nommés parce que L. 2242-8 les nomme, mais ni leur");
    L.push("contenu, ni le calendrier de publication, ni le seuil de résultat qui");
    L.push("déclenche les mesures de correction ne sont écrits ici. Vérifiez-les à la");
    L.push("source avant d'agir.");
    L.push("");
    return L;
  }

  /* Le pied : d'où vient ce qui est écrit, et ce que le document ne dit pas. */
  function pied(articles, notes) {
    var L = ["", TRAIT, ""];
    pousserPlie(L, "Fondement : " + articles + ".", 70, "", "");
    L.push("Ces textes ont été lus à la source et sont conservés avec leur identifiant");
    L.push("de version dans moteur/nao/textes-nao.json. Les arrêts cités ont été lus");
    L.push("dans la base Judilibre de la Cour de cassation, réponse non relaxée.");
    if (notes && notes.length) { L.push(""); notes.forEach(function (n) { L.push(n); }); }
    L.push("");
    L.push("CE QUE CE DOCUMENT N'EST PAS. Il prépare et rédige ; il ne négocie pas à");
    L.push("votre place, et il ne conclut pas. Aucun texte n'oblige à conclure :");
    L.push("l'obligation est d'engager la négociation, sérieusement et loyalement");
    L.push("(L. 2242-6), et de constater l'échec par un procès-verbal de désaccord");
    L.push("(L. 2242-5).");
    L.push("");
    L.push("Aucune peine n'est annoncée dans ce document qui ne soit portée par un");
    L.push("texte lu à la source ET qui vise l'obligation dont il s'agit. Là où le");
    L.push("corpus ne porte aucune peine, le document dit ce qui se joue réellement");
    L.push("plutôt que d'agiter une amende qui n'existe pas.");
    L.push("");
    L.push("Ce document ne vaut pas consultation. Votre convention collective, vos");
    L.push("accords d'entreprise et l'accord de méthode de L. 2242-11 s'il en existe");
    L.push("un peuvent ajouter des exigences que l'application ne lit pas. Ne laissez");
    L.push("aucun crochet dans le texte que vous signez, remettez ou déposez.");
    return L;
  }

  /* ══════════════════════════════════════════════════════════════════════
     LES GÉNÉRATEURS
     ══════════════════════════════════════════════════════════════════════ */

  /* ══════════════════════════════════════════════════════════════════════
     NAO-CTL-REG-02 — LE CALENDRIER QUI S'IMPOSE

     Fondement du contrôle : L. 2242-10, L. 2242-11, L. 2242-13, et
     Soc., 3 avril 2024, n° 22-15.784. Les quatre sont dans le corpus ou dans
     le fondement, et le document ne cite rien d'autre.

     Tant que le calendrier n'est pas identifié, aucun retard ne se mesure :
     c'est pourquoi ce document vient avant les quatre convocations.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("NAO-CTL-REG-02", {
    nom: "Le calendrier des négociations — l'accord de méthode, ou le constat du régime supplétif",
    detail: "L'accord de L. 2242-11 avec ses cinq mentions et son plan, le " +
            "courrier d'ouverture de la négociation de L. 2242-10, le constat " +
            "écrit du régime supplétif de L. 2242-13, le dépôt et le calendrier.",
    produire: function (ctx) {
      var acc = bloc(ctx, "accordMethode"), s = seuil300(ctx);
      var L = entete(ctx, "Le calendrier des négociations obligatoires",
        "articles L. 2242-10 à L. 2242-13 du code du travail");

      modeDEmploi(L, "la pièce qui arrête le calendrier de vos négociations obligatoires");

      L.push("POURQUOI CETTE PIÈCE VIENT AVANT LES CONVOCATIONS");
      L.push("");
      L.push("Tant que le calendrier applicable n'est pas identifié, aucun retard ne se");
      L.push("mesure : l'entreprise ne sait pas quand elle est en règle, et elle ne peut");
      L.push("opposer aucune périodicité aménagée à une organisation syndicale qui");
      L.push("demande l'ouverture d'une négociation. Deux régimes existent, et ils ne se");
      L.push("mélangent jamais — l'accord de méthode, ou le régime supplétif.");
      L.push("");

      L.push("════ CE QUE VOTRE DOSSIER DÉCLARE ════");
      L.push("");
      L.push("  · accord fixant le calendrier et la périodicité : " +
        etat(acc.existe, "OUI", "non — le régime supplétif de L. 2242-13 s'applique"));
      L.push("  · accord joint au dossier : " +
        etat(acc.verse, "OUI", "non — sans son texte, le calendrier exigible reste inconnu"));
      L.push("  · durée déclarée : " + (vide(acc.dureeAns) ? "[non renseignée]" : acc.dureeAns + " an(s)"));
      var mentions = liste(acc.mentions);
      L.push("  · mentions déclarées : " + (mentions.length ? mentions.join(", ") : "[aucune renseignée]"));
      L.push("  · effectif : " + (s.effectif === null ? "[non renseigné]" : s.effectif + " salariés") +
        (s.groupe !== null ? " — groupe : " + s.groupe + " salariés" : ""));
      L.push("  · seuil de trois cents salariés : " + (s.connu
        ? (s.atteint ? "ATTEINT — les deux négociations triennales sont dues"
                     : "non atteint — seules les deux négociations annuelles sont dues")
        : "[non apprécié faute d'effectif]"));
      L.push("");

      L.push("════ LA PREMIÈRE VOIE — L'ACCORD DE MÉTHODE ════");
      L.push("");
      citer(L, "L2242-10", "Ce que la négociation de méthode peut porter :");
      citer(L, "L2242-11", "Ce que l'accord qui en sort doit préciser — cinq mentions, et une durée :");
      L.push("Chacune des cinq mentions est une condition, non une option : un accord");
      L.push("qui n'en porte que quatre ne fait pas écran, et le régime supplétif de");
      L.push("L. 2242-13 reprend sa place.");
      L.push("");
      citer(L, "L2242-12", "Une autre voie, plus étroite — l'accord de fond qui fixe sa propre renégociation :");
      L.push("Et ce que l'accord peut faire de plus, que l'on ignore souvent :");
      L.push("");
      citerArret(L, ARRETS.niveauxParAccord);
      L.push("  Si votre entreprise comporte des établissements distincts, l'accord peut");
      L.push("  donc identifier les périmètres de négociation et les sujets de chacun.");
      L.push("  [Établissements distincts : " + cro(P(ctx).etablissementsDistincts,
        "nombre et liste — à compléter") + "]");
      L.push("");

      L.push("════ LA SECONDE VOIE — LE RÉGIME SUPPLÉTIF ════");
      L.push("");
      citer(L, "L2242-13", "À défaut d'accord, ou en cas de non-respect de ses stipulations :");
      L.push("Deux points que ce texte règle et qu'on lui demande rarement :");
      L.push("");
      L.push("  1. Le non-respect des stipulations de l'accord produit le même effet que");
      L.push("     son absence. Un accord de méthode qu'on ne suit pas ne protège de");
      L.push("     rien.");
      L.push("  2. Le dernier alinéa donne à toute organisation syndicale représentative");
      L.push("     le pouvoir d'imposer l'ouverture — après douze mois pour les deux");
      L.push("     négociations annuelles, trente-six pour les triennales. Le document");
      L.push("     du point NAO-CTL-DEM-01 traite les deux délais qui suivent.");
      L.push("");

      L = L.concat(courrierOS(ctx,
        "ouverture d'une négociation sur le calendrier, la périodicité et les thèmes des négociations obligatoires",
        ["L'article L. 2242-10 du code du travail permet d'engager, dans les",
         "entreprises mentionnées à l'article L. 2242-1, une négociation précisant le",
         "calendrier, la périodicité, les thèmes et les modalités de négociation dans",
         "le groupe, l'entreprise ou l'établissement.",
         "",
         "Je vous invite à ouvrir cette négociation et vous convoque à une première",
         "réunion le [DATE — voir le calendrier joint], à [LIEU].",
         "",
         "L'accord qui en résultera devra préciser les cinq points que l'article",
         "L. 2242-11 énumère : les thèmes et leur périodicité, de telle sorte qu'au",
         "moins tous les quatre ans soient négociés les thèmes des 1° et 2° de",
         "L. 2242-1 et ceux des articles L. 2242-2 et L. 2242-2-1 ; le contenu de",
         "chacun de ces thèmes ; le calendrier et les lieux des réunions ; les",
         "informations que je remettrai aux négociateurs et la date de cette remise ;",
         "les modalités de suivi des engagements souscrits par les parties.",
         "",
         "La durée de cet accord ne pourra pas excéder quatre ans.",
         "",
         "À défaut d'accord, le calendrier applicable restera celui de l'article",
         "L. 2242-13, dont vous trouverez le texte en annexe."],
        { pj: ["projet d'ordre du jour et calendrier prévisionnel",
               "texte des articles L. 2242-10 à L. 2242-13"] }));

      L.push(GROS);
      L.push("TRAME — ACCORD SUR LE CALENDRIER ET LA PÉRIODICITÉ DES NÉGOCIATIONS");
      L.push(GROS);
      L.push("");
      L.push("Entre " + nomDe(ctx) + ", " + adresseDe(ctx) + ",");
      L.push("représentée par " + signataire(ctx) + ",");
      L.push("");
      L.push("et les organisations syndicales représentatives dans l'entreprise :");
      L.push("  · [Organisation 1, représentée par son délégué syndical .............]");
      L.push("  · [Organisation 2, représentée par son délégué syndical .............]");
      L.push("  · [Organisation 3, représentée par son délégué syndical .............]");
      L.push("");
      L.push("PRÉAMBULE");
      L.push("Le présent accord est conclu à l'issue de la négociation prévue à");
      L.push("l'article L. 2242-10 du code du travail. Il précise, conformément à");
      L.push("l'article L. 2242-11, les thèmes des négociations et leur périodicité, le");
      L.push("contenu de chacun, le calendrier et les lieux des réunions, les");
      L.push("informations remises aux négociateurs et la date de cette remise, ainsi");
      L.push("que les modalités de suivi des engagements souscrits.");
      L.push("");
      L.push("ARTICLE 1 — CHAMP D'APPLICATION ET NIVEAUX DE NÉGOCIATION");
      L.push("Le présent accord s'applique à [l'entreprise / le groupe / les");
      L.push("établissements distincts suivants : ...............................].");
      L.push("[Le cas échéant, identifier les périmètres de négociation et les sujets");
      L.push("traités à chacun : la Cour de cassation a jugé qu'un accord de droit");
      L.push("commun peut définir les niveaux auxquels la négociation obligatoire est");
      L.push("conduite — " + ARRETS.niveauxParAccord.ref + ".]");
      L.push("");
      L.push("ARTICLE 2 — LES THÈMES ET LEUR PÉRIODICITÉ (L. 2242-11, 1°)");
      L.push("");
      L.push("  thème                                    │ périodicité │ prochaine");
      L.push("  ─────────────────────────────────────────┼─────────────┼───────────");
      L.push("  Rémunération, temps de travail et        │ [.... ans]  │ [........]");
      L.push("  partage de la valeur ajoutée (L. 2242-1, │             │");
      L.push("  1°)                                      │             │");
      L.push("  Égalité professionnelle femmes-hommes et │ [.... ans]  │ [........]");
      L.push("  qualité de vie et des conditions de      │             │");
      L.push("  travail (L. 2242-1, 2°)                  │             │");
      if (!s.connu || s.atteint) {
        L.push("  Gestion des emplois et des parcours      │ [.... ans]  │ [........]");
        L.push("  professionnels (L. 2242-2)               │             │");
        L.push("  Emploi et conditions de travail des      │ [.... ans]  │ [........]");
        L.push("  salariés expérimentés (L. 2242-2-1)      │             │");
      }
      L.push("");
      L.push("Aucune de ces périodicités ne peut excéder quatre ans : L. 2242-11, 1°,");
      L.push("impose qu'au moins tous les quatre ans chacun de ces thèmes soit négocié.");
      if (s.connu && !s.atteint) {
        L.push("");
        L.push("Les deux négociations triennales de L. 2242-2 et L. 2242-2-1 ne figurent");
        L.push("pas au tableau : l'effectif de " + s.effectif + " salariés n'atteint pas le seuil de");
        L.push("trois cents que ces deux articles posent. Vérifiez-le à chaque exercice —");
        L.push("le seuil s'apprécie aussi au niveau du groupe au sens de L. 2331-1.");
      }
      L.push("");
      L.push("ARTICLE 3 — LE CONTENU DE CHACUN DES THÈMES (L. 2242-11, 2°)");
      L.push("[Pour chaque thème du tableau, écrire ce qu'il recouvre. Le contenu légal");
      L.push("de la négociation sur la rémunération est celui de L. 2242-15, celui de la");
      L.push("négociation sur l'égalité celui de L. 2242-17, celui de la négociation sur");
      L.push("la gestion des emplois celui de L. 2242-20 : les documents des points");
      L.push("NAO-CTL-CON-01 et NAO-CTL-CON-02 les déploient thème par thème.]");
      L.push("");
      L.push("ARTICLE 4 — LE CALENDRIER ET LES LIEUX DES RÉUNIONS (L. 2242-11, 3°)");
      L.push("[Dates et lieux, négociation par négociation. Un calendrier qui se borne à");
      L.push("annoncer « au premier trimestre » ne remplit pas la mention.]");
      L.push("");
      L.push("ARTICLE 5 — LES INFORMATIONS REMISES ET LA DATE DE LEUR REMISE");
      L.push("(L. 2242-11, 4°)");
      L.push("[Lister, thème par thème, les informations que l'employeur remettra aux");
      L.push("négociateurs, et la date de remise. Cette mention se double de celle de");
      L.push("L. 2242-14, due lors de la première réunion de chaque négociation.]");
      L.push("");
      L.push("ARTICLE 6 — LE SUIVI DES ENGAGEMENTS (L. 2242-11, 5°)");
      L.push("[Commission de suivi, périodicité de ses réunions, indicateurs. Le texte");
      L.push("exige les modalités : les nommer suffit, mais il faut les nommer.]");
      L.push("");
      L.push("ARTICLE 7 — DURÉE");
      L.push("Le présent accord est conclu pour une durée de [.... ans], qui ne peut");
      L.push("excéder quatre ans (L. 2242-11, dernier alinéa). Il prend effet le");
      L.push("[DATE] et cesse de produire effet le [DATE].");
      L.push("");
      L.push("ARTICLE 8 — RÉVISION ET DÉNONCIATION");
      L.push("[Rédiger vos clauses. Les règles générales de révision et de dénonciation");
      L.push("des accords collectifs n'ont pas été lues à la source par ce module : il");
      L.push("ne les reproduit pas et ne les résume pas.]");
      L.push("");
      L.push("ARTICLE 9 — DÉPÔT ET PUBLICITÉ");
      L.push("Le présent accord sera déposé par la partie la plus diligente. Les");
      L.push("conditions du dépôt relèvent de l'article L. 2231-6, que L. 2242-6 nomme,");
      L.push("et de l'article D. 2231-2, que R. 2242-1 nomme : ces deux articles n'ont");
      L.push("PAS été lus à la source par ce module. Vérifiez-y les formalités avant de");
      L.push("déposer — support, nombre d'exemplaires, pièces à joindre.");
      L.push("");
      L.push("Fait à " + villeDe(ctx) + ", le [DATE], en [nombre] exemplaires.");
      L.push("");
      L.push("[Signatures de l'employeur et des organisations syndicales]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("À DÉFAUT D'ACCORD — LE CONSTAT DU RÉGIME SUPPLÉTIF");
      L.push(GROS);
      L.push("");
      L.push("Ce constat est une pièce à part entière : c'est lui qui datera tous les");
      L.push("retards, et il vaut mieux l'écrire que de le déduire après coup.");
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push("");
      L.push("CONSTAT DU CALENDRIER APPLICABLE — " + leJour(aujourd(ctx)));
      L.push("");
      L.push("1. Recherche d'un accord conclu à l'issue de la négociation de");
      L.push("   L. 2242-10 : [AUCUN / ACCORD DU .............., versé au dossier].");
      L.push("");
      L.push("2. Si un accord existe, vérification de ses conditions : cinq mentions de");
      L.push("   L. 2242-11 présentes [OUI / NON] ; durée n'excédant pas quatre ans");
      L.push("   [OUI / NON] ; aucune périodicité supérieure à quatre ans [OUI / NON] ;");
      L.push("   stipulations effectivement respectées [OUI / NON].");
      L.push("");
      L.push("3. En conséquence, le calendrier applicable est :");
      L.push("");
      L.push("   [ ] celui de l'accord du .............. ;");
      L.push("   [ ] celui de l'article L. 2242-13 — soit :");
      L.push("       · chaque année, la négociation sur la rémunération, le temps de");
      L.push("         travail et le partage de la valeur ajoutée (1°) ;");
      L.push("       · chaque année, la négociation sur l'égalité professionnelle entre");
      L.push("         les femmes et les hommes et la qualité de vie et des conditions");
      L.push("         de travail (2°) ;");
      L.push("       · tous les trois ans, dans les entreprises d'au moins trois cents");
      L.push("         salariés mentionnées à L. 2242-2, la négociation sur la gestion");
      L.push("         des emplois et des parcours professionnels (3°) ;");
      L.push("       · tous les trois ans, dans les entreprises d'au moins trois cents");
      L.push("         salariés mentionnées à L. 2242-2-1, la négociation sur l'emploi,");
      L.push("         le travail et l'amélioration des conditions de travail des");
      L.push("         salariés expérimentés (4°).");
      L.push("");
      L.push("Fait à " + villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous signez le constat et ouvrez le dossier du calendrier."),
        ech(ctx, 8, "la recherche est close : accord de L. 2242-11 versé, ou constat"),
        suite("écrit qu'il n'en existe aucun."),
        ech(ctx, 15, "si vous ouvrez la négociation de L. 2242-10, première réunion"),
        suite("— le courrier ci-dessus part au moins quinze jours avant."),
        ech(ctx, 90, "l'accord de méthode est conclu, ou le régime supplétif est"),
        suite("définitivement acté. Au-delà, le calendrier ne s'improvise plus."),
        ech(ctx, 91, "vous relancez l'audit avec le régime établi : les quatre"),
        suite("contrôles de périodicité ne concluent rien avant ce jour."),
      ]));

      return L.concat(pied("L. 2242-10, L. 2242-11, L. 2242-12, L. 2242-13 ; " +
        ARRETS.niveauxParAccord.ref,
        ["Les articles L. 2231-6 et D. 2231-2, relatifs au dépôt, sont nommés parce",
         "que L. 2242-6 et R. 2242-1 les nomment : ils n'ont pas été lus à la source",
         "par ce module et ne sont donc ni reproduits ni résumés."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     NAO-CTL-PER-01 — LA NÉGOCIATION SUR LA RÉMUNÉRATION

     Fondement du contrôle : L. 2242-1, 1° et L. 2242-13. Le contenu vient de
     L. 2242-15, l'exposition de L. 2243-1 et L. 2242-7 — les deux seuls textes
     captés qui visent cette obligation-là.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("NAO-CTL-PER-01", {
    nom: "La négociation sur la rémunération — convocation, ordre du jour, calendrier et informations",
    detail: "La convocation de toutes les organisations syndicales " +
            "représentatives, l'ordre du jour tiré de L. 2242-15, le calendrier " +
            "des réunions, la note d'information et la liste des informations dues.",
    produire: function (ctx) {
      var n = negoDe(ctx, "remuneration");
      var L = entete(ctx, "Négociation sur la rémunération, le temps de travail et le partage de la valeur ajoutée",
        "articles L. 2242-1, 1°, L. 2242-13, 1° et L. 2242-15 du code du travail");

      modeDEmploi(L, "la convocation à la négociation sur la rémunération, avec son ordre du jour");

      L.push("════ CE QUE VOTRE DOSSIER DÉCLARE ════");
      L.push("");
      L.push("  · dernière négociation engagée le : " +
        (vide(n.dateEngagement) ? "[AUCUNE DATE RENSEIGNÉE]" : jour(n.dateEngagement, "date")));
      L.push("  · issue déclarée : " + (vide(n.issue) ? "[non renseignée]" : n.issue));
      L.push("  · dépôt : " + etat(n.depot, "OUI", "non"));
      var d12 = moisApres(n.dateEngagement, 12);
      if (d12) {
        L.push("");
        L.push("  → Douze mois après cette date, soit le " + leJour(d12) + ", toute");
        L.push("    organisation syndicale représentative peut imposer l'ouverture de la");
        L.push("    négociation suivante (L. 2242-13, dernier alinéa). Convoquez avant.");
      }
      L.push("");

      L.push("════ L'OBLIGATION, DANS SES TERMES ════");
      L.push("");
      citer(L, "L2242-1", "Ce que l'employeur engage :");
      citer(L, "L2242-13", "À quel rythme, à défaut d'accord de méthode :");

      L = L.concat(expositionL22431([]));
      L = L.concat(expositionL22427([]));

      destinataires(L);

      L = L.concat(courrierOS(ctx,
        "convocation à la négociation sur la rémunération, le temps de travail et le partage de la valeur ajoutée",
        ["En application des articles L. 2242-1, 1°, et L. 2242-13, 1°, du code du",
         "travail, j'engage la négociation sur la rémunération, le temps de travail et",
         "le partage de la valeur ajoutée dans l'entreprise.",
         "",
         "Je vous convoque à la première réunion de cette négociation :",
         "",
         "  · date : " + leJour(dans(aujourd(ctx), 21)) + " [à confirmer ou à modifier]",
         "  · heure : [........]",
         "  · lieu : [........]",
         "",
         "L'ordre du jour de cette première réunion figure ci-après. Conformément à",
         "l'article L. 2242-14, y seront précisés le lieu et le calendrier des",
         "réunions, ainsi que les informations que je remettrai aux délégués syndicaux",
         "et aux salariés composant la délégation, et la date de cette remise.",
         "",
         "Vous voudrez bien me faire connaître la composition de votre délégation.",
         "",
         "Je vous rappelle que vos propositions recevront une réponse motivée :",
         "l'article L. 2242-6 range cette réponse dans l'engagement sérieux et loyal",
         "des négociations."],
        { pj: ["ordre du jour de la négociation",
               "calendrier prévisionnel des réunions",
               "liste des informations qui seront remises et date de leur remise"] }));

      L.push(GROS);
      L.push("ORDRE DU JOUR — LES QUATRE THÈMES DE L'ARTICLE L. 2242-15");
      L.push(GROS);
      L.push("");
      L.push("Le contenu de cette négociation n'est pas laissé au choix : l'article");
      L.push("L. 2242-15 l'énumère. Un thème laissé hors de la table se constate sur le");
      L.push("procès-verbal.");
      L.push("");
      citer(L, "L2242-15");
      L.push(TRAIT);
      L.push("");
      L.push("POINT 1 — LES SALAIRES EFFECTIFS (L. 2242-15, 1°)");
      L.push("  Les salaires effectifs, et non les minima conventionnels : ce sont les");
      L.push("  rémunérations réellement versées.");
      L.push("  [Données à verser : masse salariale de l'exercice — source : déclaration");
      L.push("  sociale nominative ; salaire de base minimum, moyen et médian par sexe et");
      L.push("  par catégorie professionnelle — source : base de données économiques,");
      L.push("  sociales et environnementales ; évolution des rémunérations sur les trois");
      L.push("  derniers exercices.]");
      L.push("  [Proposition de l'employeur : ................................]");
      L.push("  [Propositions des organisations syndicales : ..................]");
      L.push("");
      L.push("POINT 2 — LA DURÉE EFFECTIVE ET L'ORGANISATION DU TEMPS DE TRAVAIL");
      L.push("(L. 2242-15, 2°)");
      L.push("  Le texte vise notamment la mise en place du travail à temps partiel, et");
      L.push("  ajoute que la négociation peut également porter sur la réduction du temps");
      L.push("  de travail.");
      L.push("  [Données à verser : durée collective pratiquée, heures supplémentaires de");
      L.push("  l'exercice, nombre et qualification des salariés à temps partiel,");
      L.push("  horaires pratiqués — source : registre unique du personnel, décompte du");
      L.push("  temps de travail, base de données.]");
      L.push("");
      L.push("POINT 3 — L'INTÉRESSEMENT, LA PARTICIPATION ET L'ÉPARGNE SALARIALE");
      L.push("(L. 2242-15, 3°)");
      L.push("  Ce point n'est dû qu'À DÉFAUT d'accord d'intéressement, d'accord de");
      L.push("  participation, de plan d'épargne d'entreprise, de plan d'épargne pour la");
      L.push("  mise à la retraite collectif, ou d'accord de branche comportant un ou");
      L.push("  plusieurs de ces dispositifs. Vérifiez d'abord ce que vous avez déjà.");
      L.push("  [Dispositifs en vigueur dans l'entreprise : ...................]");
      L.push("  [S'il y a lieu, la négociation porte également sur l'affectation d'une");
      L.push("  partie des sommes collectées dans le cadre du plan d'épargne pour la");
      L.push("  retraite collectif ou du plan d'épargne retraite d'entreprise collectif,");
      L.push("  et sur l'acquisition de parts de fonds investis dans les entreprises");
      L.push("  solidaires.]");
      L.push("");
      L.push("POINT 4 — LE SUIVI DES MESURES DE SUPPRESSION DES ÉCARTS DE RÉMUNÉRATION");
      L.push("ENTRE LES FEMMES ET LES HOMMES (L. 2242-15, 4°)");
      L.push("  C'est un thème DISTINCT des salaires effectifs, et c'est celui qu'on");
      L.push("  oublie. Il porte sur le suivi de la mise en œuvre des mesures visant à");
      L.push("  supprimer les écarts de rémunération ET les différences de déroulement de");
      L.push("  carrière entre les femmes et les hommes.");
      L.push("  [Mesures en vigueur, et état de leur mise en œuvre : ...........]");
      L.push("");
      citer(L, "L2242-3", "Et si aucun accord ne prévoit ces mesures, cette négociation en porte la programmation :");
      L.push("Le dernier alinéa de L. 2242-3 est net : en l'absence d'accord prévoyant");
      L.push("les mesures visant à supprimer les écarts, la négociation sur les salaires");
      L.push("effectifs porte AUSSI sur la programmation de ces mesures. Le point 4");
      L.push("ci-dessus devient alors un point de fond, et non un simple suivi.");
      L.push("");
      L.push("POINT 5 — L'INFORMATION SUR LES MISES À DISPOSITION DE SALARIÉS");
      L.push("");
      citer(L, "L2242-16");
      L.push("  [Mises à disposition de salariés auprès d'organisations syndicales ou");
      L.push("  d'associations d'employeurs au cours de l'exercice : ..........]");
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push(GROS);
      L.push("CALENDRIER PRÉVISIONNEL DES RÉUNIONS");
      L.push(GROS);
      L.push("");
      L.push("Ce calendrier est à arrêter avec les organisations syndicales lors de la");
      L.push("première réunion : L. 2242-14 impose qu'il y soit précisé. Les dates");
      L.push("ci-dessous sont une proposition de départ, comptée depuis aujourd'hui.");
      L.push("");
      L.push("  · " + leJour(dans(aujourd(ctx), 21)) + " — première réunion : ouverture, fixation du lieu et");
      L.push("    du calendrier, liste des informations et date de leur remise");
      L.push("    (L. 2242-14) ; recueil des demandes des organisations syndicales.");
      L.push("  · " + leJour(dans(aujourd(ctx), 14)) + " — remise des informations, une semaine avant la");
      L.push("    première réunion. [Date à annoncer et à tenir : une date annoncée et");
      L.push("    non tenue vaut manquement à la loyauté.]");
      L.push("  · " + leJour(dans(aujourd(ctx), 42)) + " — deuxième réunion : examen des propositions et");
      L.push("    réponses motivées de l'employeur.");
      L.push("  · " + leJour(dans(aujourd(ctx), 63)) + " — troisième réunion : dernières propositions des");
      L.push("    parties.");
      L.push("  · " + leJour(dans(aujourd(ctx), 77)) + " — réunion de clôture : signature de l'accord, ou");
      L.push("    établissement du procès-verbal de désaccord (L. 2242-5).");
      L.push("  · [Ajouter autant de réunions que nécessaire : le nombre n'est pas fixé");
      L.push("    par la loi, mais une négociation d'une seule réunion se défend mal.]");
      L.push("");

      L.push(GROS);
      L.push("NOTE D'INFORMATION REMISE EN DÉBUT DE NÉGOCIATION");
      L.push(GROS);
      L.push("");
      L.push("L'article L. 2242-6 range la communication des informations nécessaires");
      L.push("dans l'engagement sérieux et loyal :");
      L.push("");
      citerMorceau(L, "L2242-6", "L'employeur doit également leur avoir communiqué", null);
      L.push("LISTE DES INFORMATIONS REMISES (L. 2242-14, 2°)");
      L.push("");
      L.push("  1. [Effectifs par sexe, par catégorie professionnelle et par type de");
      L.push("     contrat — source : registre unique du personnel]");
      L.push("  2. [Masse salariale de l'exercice et des deux exercices précédents —");
      L.push("     source : déclaration sociale nominative]");
      L.push("  3. [Salaire de base minimum, moyen et médian par sexe et par catégorie");
      L.push("     professionnelle — source : base de données économiques, sociales et");
      L.push("     environnementales]");
      L.push("  4. [Évolution des rémunérations par catégorie et par sexe]");
      L.push("  5. [Durée collective du travail, heures supplémentaires, temps partiel]");
      L.push("  6. [Dispositifs d'épargne salariale en vigueur, et sommes distribuées]");
      L.push("  7. [État de la mise en œuvre des mesures de suppression des écarts de");
      L.push("     rémunération femmes-hommes]");
      L.push("  8. [Situation économique de l'entreprise : chiffre d'affaires, résultat");
      L.push("     — source : comptes annuels]");
      L.push("");
      L.push("  Date de remise annoncée : [DATE]. Elle se tient.");
      L.push("  Modalité de remise : [remise en main propre contre décharge / mise à");
      L.push("  disposition dans la base de données, avec information datée].");
      L.push("");
      L.push("AUCUN CHIFFRE N'EST ÉCRIT CI-DESSUS, ET C'EST VOULU. L'application ne");
      L.push("connaît ni votre masse salariale ni vos rémunérations : elle vous dit où");
      L.push("les prendre, pas ce qu'elles valent.");
      L.push("");

      L.push(GROS);
      L.push("LES DEUX ISSUES, ET RIEN D'AUTRE");
      L.push(GROS);
      L.push("");
      L.push("Aucun texte n'oblige à conclure :");
      L.push("");
      citerArret(L, ARRETS.engagerNonConclure);
      L.push("Mais l'échec doit être constaté :");
      L.push("");
      citer(L, "L2242-5");
      L.push("Si la négociation aboutit, l'accord se dépose — et s'il porte sur les");
      L.push("salaires effectifs, il ne peut l'être qu'accompagné du procès-verbal");
      L.push("d'ouverture des négociations sur les écarts de rémunération entre les");
      L.push("femmes et les hommes (L. 2242-6). Le document du point NAO-CTL-LOY-02");
      L.push("rédige ce procès-verbal ; celui du point NAO-CTL-ISS-01 rédige le");
      L.push("procès-verbal de désaccord.");
      L.push("");

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous dressez la liste des organisations représentatives et"),
        suite("préparez les informations à remettre."),
        ech(ctx, 6, "les convocations partent, avec l'ordre du jour et le calendrier."),
        ech(ctx, 14, "les informations sont remises à la date annoncée."),
        ech(ctx, 21, "première réunion : L. 2242-14 y est rempli, et le procès-verbal"),
        suite("le constate (document du point NAO-CTL-LOY-01)."),
        ech(ctx, 42, "deuxième réunion : chaque proposition syndicale reçoit une"),
        suite("réponse motivée, par écrit."),
        ech(ctx, 77, "clôture : accord signé, ou procès-verbal de désaccord établi."),
        ech(ctx, 92, "dépôt de l'accord ou du procès-verbal, et récépissé au dossier."),
      ]));

      return L.concat(pied("L. 2242-1, L. 2242-3, L. 2242-5, L. 2242-6, L. 2242-13, " +
        "L. 2242-14, L. 2242-15, L. 2242-16, L. 2242-7, L. 2243-1 ; " +
        ARRETS.engagerNonConclure.ref,
        ["L'article L. 241-13 du code de la sécurité sociale, auquel L. 2242-7",
         "renvoie, et l'article L. 2231-6, auquel L. 2242-6 renvoie, n'ont pas été lus",
         "à la source par ce module : ils sont nommés, non reproduits."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     NAO-CTL-PER-02 — LA NÉGOCIATION SUR L'ÉGALITÉ PROFESSIONNELLE

     Fondement : L. 2242-1, 2° et L. 2242-13. Le contenu vient de L. 2242-17,
     que le corpus porte en entier — huit points, alors que le questionnaire
     n'en suit que six. Les huit sont déployés ici : c'est le texte qui décide,
     pas la grille de saisie.

     L'exposition : L. 2243-1 (qui nomme L. 2242-1) et L. 2242-8 (qui vise
     l'égalité). Les deux sont captés et visent bien cette obligation.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("NAO-CTL-PER-02", {
    nom: "La négociation sur l'égalité professionnelle — convocation, ordre du jour et données de la base",
    detail: "La convocation de toutes les organisations représentatives, les " +
            "huit points de L. 2242-17, le rapport handicap de L. 2242-18, le " +
            "calendrier, les informations dues et les deux issues possibles.",
    produire: function (ctx) {
      var n = negoDe(ctx, "egalite");
      var L = entete(ctx, "Négociation sur l'égalité professionnelle entre les femmes et les hommes et la qualité de vie et des conditions de travail",
        "articles L. 2242-1, 2°, L. 2242-13, 2° et L. 2242-17 du code du travail");

      modeDEmploi(L, "la convocation à la négociation sur l'égalité professionnelle, avec son ordre du jour");

      L.push("════ CE QUE VOTRE DOSSIER DÉCLARE ════");
      L.push("");
      L.push("  · dernière négociation engagée le : " +
        (vide(n.dateEngagement) ? "[AUCUNE DATE RENSEIGNÉE]" : jour(n.dateEngagement, "date")));
      L.push("  · issue déclarée : " + (vide(n.issue) ? "[non renseignée]" : n.issue));
      L.push("  · plan d'action à défaut d'accord : " +
        etat((n.planAction || {}).existe, "OUI", "non"));
      L.push("  · appui sur les données de la base : " + etat(n.appuiBDESE, "OUI", "non"));
      var d12 = moisApres(n.dateEngagement, 12);
      if (d12) {
        L.push("");
        L.push("  → Douze mois après cette date, soit le " + leJour(d12) + ", toute");
        L.push("    organisation syndicale représentative peut imposer l'ouverture de la");
        L.push("    négociation suivante (L. 2242-13, dernier alinéa).");
      }
      L.push("");

      L.push("════ L'OBLIGATION, DANS SES TERMES ════");
      L.push("");
      citerMorceau(L, "L2242-1", "2° Une négociation sur l'égalité", null);
      citerMorceau(L, "L2242-13", "2° Chaque année, une négociation sur l'égalité", "3° Tous les trois ans");

      L = L.concat(expositionL22431([]));
      L = L.concat(expositionL22428([], ctx));

      destinataires(L);

      L = L.concat(courrierOS(ctx,
        "convocation à la négociation sur l'égalité professionnelle entre les femmes et les hommes et la qualité de vie et des conditions de travail",
        ["En application des articles L. 2242-1, 2°, et L. 2242-13, 2°, du code du",
         "travail, j'engage la négociation sur l'égalité professionnelle entre les",
         "femmes et les hommes et la qualité de vie et des conditions de travail.",
         "",
         "Je vous convoque à la première réunion de cette négociation :",
         "",
         "  · date : " + leJour(dans(aujourd(ctx), 21)) + " [à confirmer ou à modifier]",
         "  · heure : [........]",
         "  · lieu : [........]",
         "",
         "L'ordre du jour reprend les huit points que l'article L. 2242-17 énumère. Il",
         "figure ci-après.",
         "",
         "Conformément au 2° de ce même article, cette négociation s'appuiera sur les",
         "données mentionnées au 2° de l'article L. 2312-36 — celles de la base de",
         "données économiques, sociales et environnementales. L'extraction",
         "correspondante vous sera remise le [DATE], avant la première réunion.",
         "",
         "Conformément à l'article L. 2242-18, la négociation sur l'insertion",
         "professionnelle et le maintien dans l'emploi des travailleurs handicapés se",
         "déroulera sur la base du rapport que j'établirai et qui vous sera remis en",
         "même temps."],
        { pj: ["ordre du jour — les huit points de L. 2242-17",
               "calendrier prévisionnel des réunions",
               "extraction de la base de données (données du 2° de L. 2312-36)",
               "rapport sur la situation au regard de l'obligation d'emploi des travailleurs handicapés (L. 2242-18)"] }));

      L.push(GROS);
      L.push("ORDRE DU JOUR — LES HUIT POINTS DE L'ARTICLE L. 2242-17");
      L.push(GROS);
      L.push("");
      L.push("Le contenu de cette négociation est énuméré par le texte. Il compte HUIT");
      L.push("points, et non six : le droit d'expression directe et collective (6°) et");
      L.push("la mobilité domicile-travail (8°) s'oublient régulièrement.");
      L.push("");
      citer(L, "L2242-17");
      L.push(TRAIT);
      L.push("");
      L.push("POINT 1 — L'ARTICULATION ENTRE LA VIE PERSONNELLE ET LA VIE");
      L.push("PROFESSIONNELLE (1°)");
      L.push("  [Organisation du temps de travail, congés familiaux, télétravail,");
      L.push("  réunions tardives, parentalité. Propositions : ................]");
      L.push("");
      L.push("POINT 2 — LES OBJECTIFS ET LES MESURES D'ÉGALITÉ PROFESSIONNELLE (2°)");
      L.push("  Le texte les détaille : suppression des écarts de rémunération, accès à");
      L.push("  l'emploi, formation professionnelle, déroulement de carrière et");
      L.push("  promotion professionnelle, conditions de travail et d'emploi — en");
      L.push("  particulier pour les salariés à temps partiel — et mixité des emplois.");
      L.push("");
      citerMorceau(L, "L2242-17", "Cette négociation s'appuie sur les données", "Cette négociation porte également", "  ");
      L.push("  L'article L. 2312-36, auquel ce 2° renvoie, N'A PAS été lu à la source");
      L.push("  par ce module : il est nommé, non reproduit. Le module « base de données");
      L.push("  (BDESE) » de cette application le lit et l'audite pour lui-même.");
      L.push("");
      L.push("  Ce 2° porte aussi sur l'application de l'article L. 241-3-1 du code de la");
      L.push("  sécurité sociale et sur les conditions dans lesquelles l'employeur peut");
      L.push("  prendre en charge tout ou partie du supplément de cotisations. Cet");
      L.push("  article du code de la sécurité sociale n'a pas non plus été lu à la");
      L.push("  source : vérifiez-le avant d'en discuter les termes.");
      L.push("");
      L.push("  [Données à verser : effectifs par sexe et par catégorie, rémunérations");
      L.push("  comparées, promotions, embauches, formation — source : base de données");
      L.push("  économiques, sociales et environnementales.]");
      L.push("");
      L.push("POINT 3 — LA LUTTE CONTRE LES DISCRIMINATIONS (3°)");
      L.push("  En matière de recrutement, d'emploi et d'accès à la formation");
      L.push("  professionnelle, en favorisant notamment les conditions d'accès aux");
      L.push("  critères définis aux II et III de l'article L. 6315-1. Cet article n'a");
      L.push("  pas été lu à la source par ce module : il est nommé, non reproduit.");
      L.push("  [Mesures envisagées : .........................................]");
      L.push("");
      L.push("POINT 4 — L'INSERTION ET LE MAINTIEN DANS L'EMPLOI DES TRAVAILLEURS");
      L.push("HANDICAPÉS (4°)");
      L.push("  Conditions d'accès à l'emploi, à la formation et à la promotion");
      L.push("  professionnelles, conditions de travail et d'emploi, actions de");
      L.push("  sensibilisation de l'ensemble du personnel au handicap.");
      L.push("");
      citer(L, "L2242-18", "  Et ce point se négocie sur une base écrite :");
      L.push("  [Rapport à établir : effectif d'assujettissement, bénéficiaires employés,");
      L.push("  état de l'obligation d'emploi — source : déclaration sociale nominative.");
      L.push("  Les articles L. 5212-1 et suivants, auxquels L. 2242-18 renvoie, n'ont");
      L.push("  pas été lus à la source par ce module.]");
      L.push("");
      L.push("POINT 5 — PRÉVOYANCE ET REMBOURSEMENTS COMPLÉMENTAIRES (5°)");
      L.push("  Ce point n'est dû qu'À DÉFAUT de couverture par un accord de branche ou");
      L.push("  un accord d'entreprise. Vérifiez d'abord ce qui couvre déjà vos salariés.");
      L.push("  [Couverture en vigueur : ......................................]");
      L.push("  [Entreprises de travaux forestiers : le texte prévoit une négociation");
      L.push("  portant sur l'accès aux garanties collectives mentionnées à l'article");
      L.push("  L. 911-2 du code de la sécurité sociale — article non lu par ce module.]");
      L.push("");
      L.push("POINT 6 — LE DROIT D'EXPRESSION DIRECTE ET COLLECTIVE DES SALARIÉS (6°)");
      L.push("  Notamment au moyen des outils numériques disponibles dans l'entreprise.");
      L.push("  C'est un point à part entière, et il s'oublie.");
      L.push("  [Modalités existantes, modalités proposées : ...................]");
      L.push("");
      L.push("POINT 7 — LE DROIT À LA DÉCONNEXION (7°)");
      L.push("  Les modalités du plein exercice par le salarié de son droit à la");
      L.push("  déconnexion et la mise en place de dispositifs de régulation de");
      L.push("  l'utilisation des outils numériques, en vue d'assurer le respect des");
      L.push("  temps de repos et de congé ainsi que de la vie personnelle et familiale.");
      L.push("");
      L.push("  À DÉFAUT D'ACCORD SUR CE POINT, LE TEXTE IMPOSE UNE CHARTE. Elle");
      L.push("  s'élabore après avis du comité social et économique, et elle prévoit en");
      L.push("  outre des actions de formation et de sensibilisation à un usage");
      L.push("  raisonnable des outils numériques, à destination des salariés comme du");
      L.push("  personnel d'encadrement et de direction. Un désaccord sur ce point ne");
      L.push("  clôt donc pas le sujet : il ouvre une obligation nouvelle.");
      L.push("");
      L.push("POINT 8 — LA MOBILITÉ ENTRE LE DOMICILE ET LE LIEU DE TRAVAIL (8°)");
      L.push("  Ce point ne concerne que les entreprises mentionnées à l'article");
      L.push("  L. 2143-3 dont cinquante salariés au moins sont employés SUR UN MÊME");
      L.push("  SITE. Le texte vise la réduction du coût de la mobilité, l'incitation à");
      L.push("  l'usage des modes de transport vertueux et la prise en charge des frais");
      L.push("  mentionnés aux articles L. 3261-3 et L. 3261-3-1. Ces trois articles");
      L.push("  n'ont pas été lus à la source par ce module : ils sont nommés seulement.");
      L.push("  [Sites de l'entreprise et effectif de chacun : ..................]");
      L.push("");
      L.push("POINT 9 — [FACULTATIF] LA PRÉVENTION DE L'EXPOSITION AUX FACTEURS DE");
      L.push("RISQUES PROFESSIONNELS");
      L.push("");
      citer(L, "L2242-19");
      L.push("  Ce point est une FACULTÉ, non une obligation : le texte dit « peut");
      L.push("  également porter ». Supprimez-le si vous ne l'ouvrez pas. Notez");
      L.push("  toutefois l'effet que le texte y attache : l'accord conclu sur ce thème");
      L.push("  vaut conclusion de l'accord mentionné à l'article L. 4163-3, sous réserve");
      L.push("  du respect des autres dispositions du chapitre en cause — articles non");
      L.push("  lus à la source par ce module.");
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push(GROS);
      L.push("CALENDRIER PRÉVISIONNEL DES RÉUNIONS");
      L.push(GROS);
      L.push("");
      L.push("À arrêter avec les organisations syndicales lors de la première réunion");
      L.push("(L. 2242-14). Proposition de départ, comptée depuis aujourd'hui :");
      L.push("");
      L.push("  · " + leJour(dans(aujourd(ctx), 14)) + " — remise de l'extraction de la base et du rapport");
      L.push("    handicap de L. 2242-18.");
      L.push("  · " + leJour(dans(aujourd(ctx), 21)) + " — première réunion : ouverture, L. 2242-14, examen");
      L.push("    du diagnostic comparé femmes-hommes.");
      L.push("  · " + leJour(dans(aujourd(ctx), 42)) + " — deuxième réunion : points 1 à 4.");
      L.push("  · " + leJour(dans(aujourd(ctx), 63)) + " — troisième réunion : points 5 à 8.");
      L.push("  · " + leJour(dans(aujourd(ctx), 84)) + " — clôture : accord signé, ou procès-verbal de");
      L.push("    désaccord (L. 2242-5) — et alors plan d'action de L. 2242-3.");
      L.push("");

      L.push(GROS);
      L.push("LES DEUX ISSUES — ET CE QUE LE DÉSACCORD DÉCLENCHE ICI");
      L.push(GROS);
      L.push("");
      L.push("Cette négociation-ci n'a pas deux issues mais trois états, et c'est ce qui");
      L.push("la distingue de toutes les autres :");
      L.push("");
      L.push("  1. Un accord est conclu : il se dépose, et l'entreprise est couverte.");
      L.push("  2. Aucun accord n'est conclu : un procès-verbal de désaccord est établi");
      L.push("     (L. 2242-5) ET un plan d'action annuel devient obligatoire.");
      L.push("  3. Ni accord ni plan d'action : l'entreprise d'au moins cinquante");
      L.push("     salariés tombe sous la pénalité de L. 2242-8.");
      L.push("");
      citer(L, "L2242-3", "Le plan d'action, dans les termes du texte :");
      L.push("Le document du point NAO-CTL-EGA-01 rédige ce plan d'action.");
      L.push("");
      L.push("Et une précision du texte de la pénalité, qui vaut d'être lue deux fois :");
      L.push("");
      citerMorceau(L, "L2242-8", "Dans les entreprises d'au moins 300 salariés", "La pénalité prévue");
      L.push("Dans une entreprise d'au moins trois cents salariés, le procès-verbal de");
      L.push("désaccord n'est donc pas une pièce de classement : c'est LUI qui atteste");
      L.push("le défaut d'accord, et sans lui l'entreprise ne peut pas établir sa");
      L.push("situation devant l'administration.");
      L.push("");

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous demandez au service qui tient la base l'extraction des"),
        suite("données du 2° de L. 2312-36, et vous ouvrez le rapport handicap."),
        ech(ctx, 6, "les convocations partent, avec l'ordre du jour à huit points."),
        ech(ctx, 14, "remise de l'extraction et du rapport, à la date annoncée."),
        ech(ctx, 21, "première réunion : L. 2242-14 est rempli et constaté au"),
        suite("procès-verbal."),
        ech(ctx, 84, "clôture : accord, ou procès-verbal de désaccord."),
        ech(ctx, 99, "dépôt de l'accord ou du procès-verbal, récépissé au dossier."),
        ech(ctx, 114, "à défaut d'accord, le plan d'action annuel de L. 2242-3 est"),
        suite("établi ET déposé. Un plan non déposé ne couvre pas l'entreprise."),
      ]));

      return L.concat(pied("L. 2242-1, L. 2242-3, L. 2242-5, L. 2242-8, L. 2242-13, " +
        "L. 2242-14, L. 2242-17, L. 2242-18, L. 2242-19, L. 2243-1",
        ["Les articles L. 2312-36, L. 6315-1, L. 5212-1 et suivants, L. 2143-3,",
         "L. 3261-3, L. 3261-3-1, L. 4163-3, L. 1142-8 et L. 1142-9 du code du travail,",
         "ainsi que les articles L. 241-3-1, L. 911-2 et L. 911-7 du code de la sécurité",
         "sociale, sont NOMMÉS parce que les textes lus les nomment. Aucun d'eux n'a été",
         "lu à la source par ce module : leur contenu n'est ni reproduit ni résumé."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     NAO-CTL-PER-03 — LA NÉGOCIATION SUR LA GESTION DES EMPLOIS

     Fondement : L. 2242-2 et L. 2242-13. Le contenu vient de L. 2242-20, les
     thèmes facultatifs de L. 2242-21.

     L'exposition : L. 2243-2, et lui seul. Ce texte nomme « les articles
     L. 2242-1 et L. 2242-20 » — L. 2242-20 est précisément l'article qui porte
     cette négociation. L. 2242-7 et L. 2242-8 ne la visent PAS : la première ne
     vise que les salaires effectifs, la seconde que l'égalité. Elles ne sont
     donc pas annoncées ici, contrairement à ce que suggère la fiche de
     régularisation.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("NAO-CTL-PER-03", {
    nom: "La négociation sur la gestion des emplois et des parcours professionnels",
    detail: "La vérification du seuil de trois cents salariés, la convocation, " +
            "les six points de L. 2242-20, les sept thèmes facultatifs de " +
            "L. 2242-21, le calendrier triennal et le bilan de fin d'accord.",
    produire: function (ctx) {
      var n = negoDe(ctx, "gepp"), s = seuil300(ctx);
      var L = entete(ctx, "Négociation sur la gestion des emplois et des parcours professionnels",
        "articles L. 2242-2, L. 2242-13, 3° et L. 2242-20 du code du travail");

      modeDEmploi(L, "la convocation à la négociation triennale sur la gestion des emplois");

      L.push("════ D'ABORD LE SEUIL : CETTE NÉGOCIATION VOUS EST-ELLE DUE ? ════");
      L.push("");
      citer(L, "L2242-2");
      L.push("Trois voies mènent au seuil, et le texte les donne : l'entreprise, le");
      L.push("groupe d'entreprises au sens de l'article L. 2331-1, et l'entreprise ou le");
      L.push("groupe de dimension communautaire au sens des articles L. 2341-1 et");
      L.push("L. 2341-2 comportant au moins un établissement ou une entreprise d'au");
      L.push("moins cent cinquante salariés en France. Ces trois articles sont nommés");
      L.push("par le texte lu ; ils n'ont pas été lus eux-mêmes par ce module.");
      L.push("");
      L.push("  · effectif de l'entreprise : " +
        (s.effectif === null ? "[NON RENSEIGNÉ]" : s.effectif + " salariés"));
      L.push("  · effectif du groupe : " +
        (s.groupe === null ? "[non renseigné, ou pas de groupe]" : s.groupe + " salariés"));
      L.push("  · dimension communautaire : " +
        etat(F(ctx).dimensionCommunautaire, "OUI", "non"));
      L.push("");
      if (s.connu && !s.atteint) {
        L.push("  → EN L'ÉTAT DU DOSSIER, LE SEUIL N'EST PAS ATTEINT et cette négociation");
        L.push("    n'est pas due. Ce document reste utile à deux titres : le seuil se");
        L.push("    vérifie à chaque exercice, et rien n'interdit de négocier ce thème");
        L.push("    volontairement.");
      } else if (s.connu) {
        L.push("  → LE SEUIL EST ATTEINT : la négociation est due, tous les trois ans à");
        L.push("    défaut d'accord de méthode (L. 2242-13, 3°).");
      } else {
        L.push("  → LE SEUIL NE PEUT PAS ÊTRE APPRÉCIÉ faute d'effectif renseigné.");
        L.push("    Établissez-le avant de conclure quoi que ce soit : l'application ne");
        L.push("    devine pas un effectif.");
      }
      L.push("");
      L.push("Et une condition que le seuil ne remplace pas :");
      L.push("");
      citerArret(L, ARRETS.representativite);
      L.push("  La représentativité s'apprécie AU NIVEAU DE L'ENTREPRISE. Une");
      L.push("  désignation limitée à un seul établissement ne suffit pas à faire naître");
      L.push("  l'obligation.");
      L.push("");

      L.push("════ CE QUE VOTRE DOSSIER DÉCLARE ════");
      L.push("");
      L.push("  · dernière négociation engagée le : " +
        (vide(n.dateEngagement) ? "[AUCUNE DATE RENSEIGNÉE]" : jour(n.dateEngagement, "date")));
      L.push("  · issue déclarée : " + (vide(n.issue) ? "[non renseignée]" : n.issue));
      L.push("  · dépôt : " + etat(n.depot, "OUI", "non"));
      var d36 = moisApres(n.dateEngagement, 36);
      if (d36) {
        L.push("");
        L.push("  → Trente-six mois après cette date, soit le " + leJour(d36) + ", toute");
        L.push("    organisation syndicale représentative peut imposer l'ouverture de la");
        L.push("    négociation suivante (L. 2242-13, dernier alinéa).");
      }
      L.push("");

      L = L.concat(expositionL22432([]));
      L.push("Deux peines existent dans le corpus lu par ce module, et une seule");
      L.push("s'applique ici. L. 2243-1 ne nomme que L. 2242-1 : il ne couvre pas cette");
      L.push("négociation. La pénalité salaires de L. 2242-7 ne vise que les salaires");
      L.push("effectifs, et la pénalité de 1 % de L. 2242-8 ne vise que l'égalité");
      L.push("professionnelle : ni l'une ni l'autre ne s'applique à la gestion des");
      L.push("emplois. Ce document ne les annonce donc pas.");
      L.push("");

      destinataires(L);

      L = L.concat(courrierOS(ctx,
        "convocation à la négociation sur la gestion des emplois et des parcours professionnels",
        ["En application des articles L. 2242-2 et L. 2242-13, 3°, du code du travail,",
         "j'engage la négociation sur la gestion des emplois et des parcours",
         "professionnels et sur la mixité des métiers.",
         "",
         "Je vous convoque à la première réunion de cette négociation :",
         "",
         "  · date : " + leJour(dans(aujourd(ctx), 28)) + " [à confirmer ou à modifier]",
         "  · heure : [........]",
         "  · lieu : [........]",
         "",
         "L'article L. 2242-20 précise que cette négociation est engagée notamment sur",
         "le fondement des orientations stratégiques de l'entreprise et de leurs",
         "conséquences. Les éléments correspondants vous seront remis le [DATE], avant",
         "la première réunion.",
         "",
         "L'ordre du jour reprend les six points que ce même article énumère, ainsi",
         "que les thèmes facultatifs de l'article L. 2242-21 que je vous propose",
         "d'ajouter. Il figure ci-après.",
         "",
         "Cette négociation porte sur des engagements pluriannuels : je vous propose",
         "un calendrier de [nombre] réunions, joint au présent courrier."],
        { pj: ["ordre du jour — les six points de L. 2242-20",
               "calendrier prévisionnel des réunions",
               "orientations stratégiques de l'entreprise et leurs conséquences",
               "éléments d'emploi : pyramide des âges, métiers, contrats"] }));

      L.push(GROS);
      L.push("ORDRE DU JOUR — LES SIX POINTS DE L'ARTICLE L. 2242-20");
      L.push(GROS);
      L.push("");
      citer(L, "L2242-20");
      L.push(TRAIT);
      L.push("");
      L.push("POINT 1 — LE DISPOSITIF DE GESTION PRÉVISIONNELLE DES EMPLOIS ET DES");
      L.push("COMPÉTENCES (1°)");
      L.push("  Le texte vise notamment les enjeux de la transition écologique, et les");
      L.push("  mesures d'accompagnement susceptibles d'y être associées : formation,");
      L.push("  abondement du compte personnel de formation, validation des acquis de");
      L.push("  l'expérience, bilan de compétences, accompagnement de la mobilité");
      L.push("  professionnelle et géographique.");
      L.push("  [Données à verser : pyramide des âges, métiers en tension, projets de");
      L.push("  mutation technologique — source : registre unique du personnel, base de");
      L.push("  données économiques, sociales et environnementales.]");
      L.push("");
      L.push("POINT 2 — LES CONDITIONS DE LA MOBILITÉ INTERNE (2°)");
      L.push("  Le cas échéant, les conditions de la mobilité professionnelle ou");
      L.push("  géographique interne à l'entreprise prévue à l'article L. 2254-2. Le");
      L.push("  texte impose une forme : en cas d'accord, ces conditions font l'objet");
      L.push("  d'un CHAPITRE SPÉCIFIQUE. L'article L. 2254-2 lui-même n'a pas été lu à");
      L.push("  la source par ce module : il est nommé, non reproduit.");
      L.push("");
      L.push("POINT 3 — LES GRANDES ORIENTATIONS À TROIS ANS DE LA FORMATION (3°)");
      L.push("  Et les objectifs du plan de développement des compétences : catégories");
      L.push("  de salariés et d'emplois auxquels il est consacré en priorité,");
      L.push("  compétences et qualifications à acquérir pendant la période de validité");
      L.push("  de l'accord, critères et modalités d'abondement du compte personnel de");
      L.push("  formation par l'employeur.");
      L.push("");
      L.push("POINT 4 — LES PERSPECTIVES DE RECOURS AUX DIFFÉRENTS CONTRATS (4°)");
      L.push("  Contrats de travail, travail à temps partiel, stages — et les moyens mis");
      L.push("  en œuvre pour DIMINUER le recours aux emplois précaires au profit des");
      L.push("  contrats à durée indéterminée. C'est le texte qui emploie ce mot.");
      L.push("  [Répartition des contrats sur les trois derniers exercices : ....]");
      L.push("");
      L.push("POINT 5 — L'INFORMATION DES ENTREPRISES SOUS-TRAITANTES (5°)");
      L.push("  Les conditions dans lesquelles elles sont informées des orientations");
      L.push("  stratégiques de l'entreprise ayant un effet sur leurs métiers, l'emploi");
      L.push("  et les compétences.");
      L.push("");
      L.push("POINT 6 — LE DÉROULEMENT DE CARRIÈRE DES SALARIÉS EXERÇANT DES");
      L.push("RESPONSABILITÉS SYNDICALES (6°)");
      L.push("  Et l'exercice de leurs fonctions. Ce point est dans la liste légale : il");
      L.push("  ne se traite pas « en marge ».");
      L.push("");
      L.push("POINT 7 — LE BILAN DE FIN D'ACCORD");
      L.push("  Le dernier alinéa de L. 2242-20 est bref et impératif : un bilan est");
      L.push("  réalisé à l'échéance de l'accord. Prévoyez-le dans l'accord lui-même,");
      L.push("  avec sa date et son auteur, plutôt que de le découvrir au terme.");
      L.push("");
      L.push(TRAIT);
      L.push("");
      L.push("════ LES THÈMES FACULTATIFS DE L'ARTICLE L. 2242-21 ════");
      L.push("");
      L.push("Le texte dit « peut également porter » : ces sept thèmes sont une faculté,");
      L.push("et non une obligation. Deux d'entre eux produisent toutefois un effet");
      L.push("juridique propre, et méritent d'être connus avant d'être écartés.");
      L.push("");
      citer(L, "L2242-21");
      L.push("  À retenir : l'accord conclu sur le thème du 7° — les périodes de");
      L.push("  reconversion externe — vaut conclusion de l'accord mentionné à l'article");
      L.push("  L. 6324-9. Et le 1° renvoie aux matières des articles L. 1233-21 et");
      L.push("  L. 1233-22, selon les modalités prévues à ces mêmes articles. Ces trois");
      L.push("  articles n'ont pas été lus à la source par ce module : ils sont nommés,");
      L.push("  non reproduits. Le module « licenciement économique » de cette");
      L.push("  application traite des articles L. 1233-21 et L. 1233-22.");
      L.push("");
      L.push("  Thèmes retenus pour cette négociation : [cocher]");
      L.push("    [ ] 1° matières des articles L. 1233-21 et L. 1233-22");
      L.push("    [ ] 2° qualification des catégories d'emplois menacés");
      L.push("    [ ] 3° association des entreprises sous-traitantes au dispositif");
      L.push("    [ ] 4° participation aux actions de gestion prévisionnelle des");
      L.push("        emplois et des compétences à l'échelle des territoires");
      L.push("    [ ] 5° mise en place de congés de mobilité");
      L.push("    [ ] 6° formation et insertion durable des jeunes, alternance");
      L.push("    [ ] 7° périodes de reconversion externe");
      L.push("");

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous vérifiez le seuil de trois cents salariés — entreprise,"),
        suite("groupe, dimension communautaire — et la représentativité au"),
        suite("niveau de l'entreprise."),
        ech(ctx, 10, "les convocations partent, avec l'ordre du jour."),
        ech(ctx, 21, "remise des orientations stratégiques et des données d'emploi."),
        ech(ctx, 28, "première réunion : L. 2242-14 y est rempli."),
        ech(ctx, 90, "réunions de fond : les six points, un par un."),
        ech(ctx, 150, "clôture : accord, ou procès-verbal de désaccord (L. 2242-5)."),
        ech(ctx, 165, "dépôt, et récépissé au dossier."),
        "  · Puis, tous les trois ans : la périodicité de L. 2242-13, 3°, court à",
        suite("compter de l'engagement de cette négociation, et non de sa clôture."),
      ]));

      return L.concat(pied("L. 2242-2, L. 2242-5, L. 2242-13, L. 2242-14, L. 2242-20, " +
        "L. 2242-21, L. 2243-2 ; " + ARRETS.representativite.ref,
        ["Les articles L. 2331-1, L. 2341-1, L. 2341-2, L. 2254-2, L. 1233-21,",
         "L. 1233-22, L. 6324-9, L. 1237-18 et suivants et L. 2323-10 sont NOMMÉS parce",
         "que les textes lus les nomment : aucun n'a été lu à la source par ce module.",
         "",
         "Ce document n'annonce ni la pénalité de L. 2242-7 ni celle de L. 2242-8 :",
         "aucune des deux ne vise cette négociation. Seul L. 2243-2 la couvre, parce",
         "qu'il nomme l'article L. 2242-20."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     NAO-CTL-PER-04 — LA NÉGOCIATION SUR LES SALARIÉS EXPÉRIMENTÉS

     Fondement : L. 2242-2-1 et L. 2242-13, 4°.

     AUCUNE PEINE N'EST ANNONCÉE DANS CE DOCUMENT, et c'est une lecture, pas un
     oubli. L. 2243-1 nomme L. 2242-1 ; L. 2243-2 nomme L. 2242-1 et L. 2242-20.
     Ni l'un ni l'autre ne nomme L. 2242-2-1. L. 2242-7 ne vise que les salaires
     effectifs, L. 2242-8 que l'égalité professionnelle. Le corpus capté ne
     porte donc AUCUNE sanction visant cette négociation-ci. La fiche de
     régularisation annonce « un an d'emprisonnement et 3 750 € d'amende, la
     pénalité de L. 2242-7 pouvant s'y ajouter » : aucun texte lu ne la porte,
     et le document dit ce qui se joue réellement à la place.

     MANQUE DANS LE CORPUS : L. 2242-2-1 pose l'obligation mais n'énumère aucun
     contenu — il n'existe pas, pour cette négociation, d'article de contenu
     comparable à L. 2242-15, L. 2242-17 ou L. 2242-20. L'ordre du jour est
     donc construit sur les seuls termes de L. 2242-2-1, et le document le dit.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("NAO-CTL-PER-04", {
    nom: "La négociation sur l'emploi et les conditions de travail des salariés expérimentés",
    detail: "La vérification du seuil, la convocation, un ordre du jour bâti sur " +
            "les seuls termes de L. 2242-2-1, le calendrier triennal — et ce qui " +
            "se joue réellement, faute de texte pénal visant cette négociation.",
    produire: function (ctx) {
      var n = negoDe(ctx, "experimentes"), s = seuil300(ctx);
      var L = entete(ctx, "Négociation sur l'emploi, le travail et l'amélioration des conditions de travail des salariés expérimentés",
        "articles L. 2242-2-1 et L. 2242-13, 4° du code du travail");

      modeDEmploi(L, "la convocation à la négociation triennale sur les salariés expérimentés");

      L.push("════ L'OBLIGATION, DANS SES TERMES — ET SON SEUIL ════");
      L.push("");
      citer(L, "L2242-2-1");
      L.push("Deux conditions, et le texte les pose l'une à côté de l'autre : des");
      L.push("sections syndicales d'organisations représentatives sont constituées, ET");
      L.push("l'entreprise ou le groupe au sens de l'article L. 2331-1 compte au moins");
      L.push("trois cents salariés.");
      L.push("");
      L.push("  · effectif de l'entreprise : " +
        (s.effectif === null ? "[NON RENSEIGNÉ]" : s.effectif + " salariés"));
      L.push("  · effectif du groupe : " +
        (s.groupe === null ? "[non renseigné, ou pas de groupe]" : s.groupe + " salariés"));
      L.push("  · sections syndicales représentatives : " +
        etat(F(ctx).sectionsSyndicales, "OUI", "non — rien n'est dû"));
      L.push("");
      if (s.connu && !s.atteint)
        L.push("  → En l'état du dossier, le seuil n'est pas atteint : cette négociation");
      else if (s.connu)
        L.push("  → Le seuil est atteint : la négociation est due, tous les trois ans à");
      else
        L.push("  → Le seuil ne peut pas être apprécié faute d'effectif renseigné :");
      if (s.connu && !s.atteint) L.push("    n'est pas due. Le seuil se revérifie à chaque exercice.");
      else if (s.connu) L.push("    défaut d'accord de méthode (L. 2242-13, 4°).");
      else L.push("    établissez-le avant de conclure.");
      L.push("");
      citerMorceau(L, "L2242-13", "4° Tous les trois ans", "A défaut d'une initiative");

      L.push("════ CE QUE VOTRE DOSSIER DÉCLARE ════");
      L.push("");
      L.push("  · dernière négociation engagée le : " +
        (vide(n.dateEngagement) ? "[AUCUNE DATE RENSEIGNÉE]" : jour(n.dateEngagement, "date")));
      L.push("  · issue déclarée : " + (vide(n.issue) ? "[non renseignée]" : n.issue));
      var d36 = moisApres(n.dateEngagement, 36);
      if (d36) {
        L.push("");
        L.push("  → Trente-six mois après cette date, soit le " + leJour(d36) + ", toute");
        L.push("    organisation syndicale représentative peut imposer l'ouverture de la");
        L.push("    négociation suivante (L. 2242-13, dernier alinéa).");
      }
      L.push("");

      L.push("════ CE QUI SE JOUE — ET CE QUI NE SE JOUE PAS ════");
      L.push("");
      L.push("AUCUNE PEINE N'EST ANNONCÉE ICI, et ce n'est pas un oubli. Le corpus lu");
      L.push("par ce module porte quatre textes de sanction, et pas un ne vise cette");
      L.push("négociation :");
      L.push("");
      L.push("  · L. 2243-1 ne nomme que l'article L. 2242-1 ;");
      L.push("  · L. 2243-2 ne nomme que les articles L. 2242-1 et L. 2242-20 ;");
      L.push("  · L. 2242-7 ne vise que l'obligation de négociation sur les salaires");
      L.push("    effectifs du 1° de L. 2242-1 ;");
      L.push("  · L. 2242-8 ne vise que l'égalité professionnelle et les publications");
      L.push("    qui s'y rattachent.");
      L.push("");
      L.push("Aucun ne nomme l'article L. 2242-2-1. Une application qui vous annoncerait");
      L.push("ici une amende vous ferait négocier sous une menace inexistante — et vous");
      L.push("découvririez le vide au premier contrôle.");
      L.push("");
      L.push("Ce qui se joue réellement, en revanche, se lit dans les textes captés :");
      L.push("");
      L.push("  1. L'OBLIGATION EXISTE. L. 2242-2-1 dit « l'employeur engage ». Ne pas");
      L.push("     l'avoir engagée est un manquement, constatable par l'inspection du");
      L.push("     travail comme par le juge.");
      L.push("  2. UNE ORGANISATION SYNDICALE PEUT VOUS L'IMPOSER. Passé trente-six");
      L.push("     mois depuis la précédente, la négociation s'engage obligatoirement à");
      L.push("     sa demande, et deux délais courts s'ouvrent alors — huit jours pour");
      L.push("     transmettre, quinze pour convoquer (L. 2242-13, dernier alinéa).");
      L.push("  3. VOTRE LIBERTÉ DE DÉCIDER EST SUSPENDUE PENDANT LA NÉGOCIATION.");
      L.push("     L. 2242-4 vise expressément les négociations des articles L. 2242-1,");
      L.push("     L. 2242-2 ET L. 2242-2-1 :");
      L.push("");
      citer(L, "L2242-4", null);
      L.push("  4. ET ELLE NE REPREND PAS QUAND VOUS LE DÉCIDEZ :");
      L.push("");
      citerArret(L, ARRETS.finDesNegociations);

      destinataires(L);

      L = L.concat(courrierOS(ctx,
        "convocation à la négociation sur l'emploi, le travail et l'amélioration des conditions de travail des salariés expérimentés",
        ["En application des articles L. 2242-2-1 et L. 2242-13, 4°, du code du",
         "travail, j'engage la négociation sur l'emploi, le travail et l'amélioration",
         "des conditions de travail des salariés expérimentés, en considération de",
         "leur âge.",
         "",
         "Je vous convoque à la première réunion de cette négociation :",
         "",
         "  · date : " + leJour(dans(aujourd(ctx), 28)) + " [à confirmer ou à modifier]",
         "  · heure : [........]",
         "  · lieu : [........]",
         "",
         "Les éléments de situation vous seront remis le [DATE], avant la première",
         "réunion, conformément à ce que l'article L. 2242-14 impose de préciser dès",
         "l'ouverture.",
         "",
         "Je vous précise que l'ordre du jour joint est bâti sur les seuls termes de",
         "l'article L. 2242-2-1 : à la différence des négociations sur la rémunération",
         "et sur l'égalité professionnelle, la loi n'énumère pas ici de contenu",
         "obligatoire. Vos propositions d'ajout sont donc attendues, et elles seront",
         "portées à l'ordre du jour."],
        { pj: ["ordre du jour proposé",
               "calendrier prévisionnel des réunions",
               "éléments de situation des salariés expérimentés"] }));

      L.push(GROS);
      L.push("ORDRE DU JOUR PROPOSÉ");
      L.push(GROS);
      L.push("");
      L.push("AVERTISSEMENT, ET IL COMPTE. L'article L. 2242-2-1 pose l'obligation mais");
      L.push("n'énumère AUCUN contenu : il n'existe pas, pour cette négociation, d'article");
      L.push("de contenu comparable à L. 2242-15 pour la rémunération, L. 2242-17 pour");
      L.push("l'égalité ou L. 2242-20 pour la gestion des emplois. L'ordre du jour");
      L.push("ci-dessous n'est donc pas tiré d'une liste légale — il est construit sur");
      L.push("les trois objets que le texte nomme lui-même : l'emploi, le travail, et");
      L.push("l'amélioration des conditions de travail des salariés expérimentés, en");
      L.push("considération de leur âge. Ajoutez, retirez, réorganisez : rien ici n'est");
      L.push("imposé par un texte, et le document ne prétend pas le contraire.");
      L.push("");
      L.push("POINT 1 — L'EMPLOI DES SALARIÉS EXPÉRIMENTÉS");
      L.push("  [Effectifs par tranche d'âge, recrutements et départs par tranche d'âge,");
      L.push("  ancienneté moyenne — source : registre unique du personnel, déclaration");
      L.push("  sociale nominative.]");
      L.push("  [Objectifs de recrutement et de maintien dans l'emploi : ........]");
      L.push("");
      L.push("POINT 2 — LE TRAVAIL");
      L.push("  [Postes occupés, accès à la formation et à la promotion, transmission des");
      L.push("  savoirs et tutorat, évolution des qualifications.]");
      L.push("");
      L.push("POINT 3 — L'AMÉLIORATION DES CONDITIONS DE TRAVAIL");
      L.push("  [Aménagement des postes, horaires, charge de travail, aménagements de fin");
      L.push("  de carrière, temps partiel de fin de carrière, retraite progressive.");
      L.push("  Source des données de pénibilité : document unique d'évaluation des");
      L.push("  risques — le module « santé, sécurité et conditions de travail » de cette");
      L.push("  application l'audite pour lui-même.]");
      L.push("");
      L.push("POINT 4 — LA CONSIDÉRATION DE L'ÂGE");
      L.push("  Le texte ajoute « en considération de leur âge » : la négociation");
      L.push("  suppose donc de définir, avec les organisations syndicales, à partir de");
      L.push("  quel âge ou de quelle ancienneté un salarié est regardé comme");
      L.push("  expérimenté dans l'entreprise. [Définition retenue : ...........]");
      L.push("");
      L.push("POINT 5 — LES PROPOSITIONS DES ORGANISATIONS SYNDICALES");
      L.push("  [À porter à l'ordre du jour dès leur réception, et à traiter par une");
      L.push("  réponse motivée : L. 2242-6 range cette réponse dans l'engagement");
      L.push("  sérieux et loyal des négociations.]");
      L.push("");

      L.push(GROS);
      L.push("CALENDRIER PRÉVISIONNEL DES RÉUNIONS");
      L.push(GROS);
      L.push("");
      L.push("  · " + leJour(dans(aujourd(ctx), 21)) + " — remise des éléments de situation.");
      L.push("  · " + leJour(dans(aujourd(ctx), 28)) + " — première réunion : ouverture, L. 2242-14, définition");
      L.push("    du périmètre des salariés expérimentés.");
      L.push("  · " + leJour(dans(aujourd(ctx), 56)) + " — deuxième réunion : emploi et travail.");
      L.push("  · " + leJour(dans(aujourd(ctx), 84)) + " — troisième réunion : conditions de travail et fins de");
      L.push("    carrière.");
      L.push("  · " + leJour(dans(aujourd(ctx), 112)) + " — clôture : accord, ou procès-verbal de désaccord.");
      L.push("");

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous vérifiez le seuil de trois cents salariés et la présence"),
        suite("de sections syndicales représentatives : les deux conditions sont"),
        suite("cumulatives dans le texte."),
        ech(ctx, 10, "les convocations partent."),
        ech(ctx, 21, "remise des éléments de situation, à la date annoncée."),
        ech(ctx, 28, "première réunion."),
        ech(ctx, 112, "clôture : accord, ou procès-verbal de désaccord (L. 2242-5)."),
        ech(ctx, 127, "dépôt, et récépissé au dossier."),
        "  · Puis, tous les trois ans (L. 2242-13, 4°), à compter de l'engagement.",
      ]));

      return L.concat(pied("L. 2242-2-1, L. 2242-4, L. 2242-5, L. 2242-6, L. 2242-13, " +
        "L. 2242-14 ; " + ARRETS.finDesNegociations.ref,
        ["L'article L. 2331-1, auquel L. 2242-2-1 renvoie pour la notion de groupe,",
         "est nommé et non reproduit : il n'a pas été lu à la source par ce module.",
         "",
         "AUCUNE PEINE N'EST ANNONCÉE dans ce document : aucun des textes de sanction",
         "captés — L. 2242-7, L. 2242-8, L. 2243-1, L. 2243-2 — ne nomme l'article",
         "L. 2242-2-1. Ce qui est encouru est l'irrégularité elle-même, l'ouverture",
         "imposée par une organisation syndicale, et l'interdiction de décider",
         "unilatéralement dans les matières traitées (L. 2242-4).",
         "",
         "L'ordre du jour proposé n'est tiré d'aucune liste légale : L. 2242-2-1",
         "n'énumère pas de contenu. Il est construit sur les termes mêmes du texte."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     NAO-CTL-DEM-01 — LA DEMANDE SYNDICALE D'OUVERTURE

     Fondement : L. 2242-13, dernier alinéa. Deux délais, comptés en jours
     depuis la demande — huit pour transmettre, quinze pour convoquer. Quand la
     date de la demande figure au dossier, les deux échéances sont calculées à
     partir d'elle ; sinon, elles le sont depuis aujourd'hui, et le document
     le dit.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("NAO-CTL-DEM-01", {
    nom: "La demande syndicale d'ouverture — transmission sous huit jours, convocation sous quinze",
    detail: "L'accusé de réception daté, la transmission de la demande aux " +
            "autres organisations représentatives, la convocation des parties, " +
            "et les deux échéances calculées depuis la date de la demande.",
    produire: function (ctx) {
      var d = bloc(ctx, "demandeSyndicale");
      var ref = dateDe(d.date);
      var base = ref || aujourd(ctx);
      var huit = ref ? joursApres(d.date, 8) : dans(aujourd(ctx), 8);
      var quinze = ref ? joursApres(d.date, 15) : dans(aujourd(ctx), 15);
      var L = entete(ctx, "Demande syndicale d'ouverture d'une négociation — les deux actes et leurs délais",
        "article L. 2242-13, dernier alinéa, du code du travail");

      modeDEmploi(L, "le traitement d'une demande syndicale d'ouverture de négociation");

      L.push("════ LE TEXTE, ET LES DEUX DÉLAIS QU'IL POSE ════");
      L.push("");
      citerMorceau(L, "L2242-13", "A défaut d'une initiative de l'employeur", null);
      L.push("Trois règles en trois phrases :");
      L.push("");
      L.push("  1. LE POUVOIR D'IMPOSER. Passé douze mois depuis la précédente pour");
      L.push("     chacune des deux négociations annuelles, trente-six mois pour la");
      L.push("     négociation triennale, la négociation s'engage OBLIGATOIREMENT à la");
      L.push("     demande d'une organisation syndicale représentative. L'employeur n'a");
      L.push("     pas à en apprécier l'opportunité.");
      L.push("  2. HUIT JOURS POUR TRANSMETTRE. La demande est transmise par");
      L.push("     l'employeur aux AUTRES organisations représentatives — toutes, y");
      L.push("     compris celles qui n'ont rien demandé.");
      L.push("  3. QUINZE JOURS POUR CONVOQUER. Dans les quinze jours qui suivent la");
      L.push("     demande, l'employeur convoque les parties à la négociation.");
      L.push("");
      L.push("Les deux délais courent de la MÊME date — celle de la demande — et non");
      L.push("l'un après l'autre. Le second n'attend pas le premier.");
      L.push("");

      L.push("════ VOS TROIS DATES ════");
      L.push("");
      L.push("  · demande reçue le : " + (ref ? leJour(ref) : "[DATE DE RÉCEPTION — à établir]"));
      L.push("  · transmission aux autres organisations le : " +
        (vide(d.dateTransmissionAutresOS) ? "[NON RENSEIGNÉE]" : jour(d.dateTransmissionAutresOS, "date")));
      L.push("  · convocation des parties le : " +
        (vide(d.dateConvocation) ? "[NON RENSEIGNÉE]" : jour(d.dateConvocation, "date")));
      L.push("");
      if (!ref) {
        L.push("  LA DATE DE LA DEMANDE N'EST PAS AU DOSSIER. Les échéances ci-dessous");
        L.push("  sont donc comptées depuis aujourd'hui, à titre indicatif. Datez la");
        L.push("  réception avant toute chose : c'est d'elle que courent les deux");
        L.push("  délais, et une demande non datée se prouve mal.");
        L.push("");
      }
      L.push("  → transmission aux autres organisations, au plus tard le : " + leJour(huit));
      L.push("  → convocation des parties, au plus tard le : " + leJour(quinze));
      L.push("");
      L.push("Ces deux dates sont des TERMES, pas des objectifs. Un jour de retard se");
      L.push("compte, et se constate sur la preuve d'envoi.");
      L.push("");

      L = L.concat(expositionL22431([]));
      L.push("Le texte pénal nomme expressément « la convocation des parties à la");
      L.push("négociation » parmi les obligations dont la soustraction est punie. Il");
      L.push("vise les obligations prévues à l'article L. 2242-1 : la convocation");
      L.push("faisant suite à une demande syndicale ouvre précisément l'une de ces");
      L.push("négociations. Lisez le texte tel qu'il est écrit ci-dessus avant d'en");
      L.push("tirer une conclusion sur votre situation.");
      L.push("");

      L.push(GROS);
      L.push("ACTE 0 — L'ACCUSÉ DE RÉCEPTION DE LA DEMANDE");
      L.push(GROS);
      L.push("");
      L.push("Il ne vous est imposé par aucun texte lu. Il est pourtant la pièce qui");
      L.push("fixe la date d'où tout se compte — et cette date, c'est vous qui aurez à");
      L.push("l'établir si elle est contestée.");
      L.push("");
      L = L.concat(courrierOS(ctx,
        "accusé de réception de votre demande d'ouverture de négociation",
        ["J'accuse réception de votre demande d'ouverture d'une négociation portant",
         "sur [THÈME DE LA NÉGOCIATION DEMANDÉE], que vous m'avez adressée et que",
         "j'ai reçue le " + (ref ? leJour(ref) : "[DATE]") + ".",
         "",
         "Conformément au dernier alinéa de l'article L. 2242-13 du code du travail,",
         "je transmets cette demande aux autres organisations syndicales",
         "représentatives dans les huit jours, soit au plus tard le " + leJour(huit) + ", et",
         "je convoque les parties à la négociation dans les quinze jours de votre",
         "demande, soit au plus tard le " + leJour(quinze) + "."],
        { a: "À [ORGANISATION SYNDICALE DEMANDERESSE]",
          a2: "— à l'attention de son délégué syndical",
          pj: [] }));

      L.push(GROS);
      L.push("ACTE 1 — LA TRANSMISSION AUX AUTRES ORGANISATIONS (HUIT JOURS)");
      L.push(GROS);
      L.push("");
      L.push("À adresser à TOUTES les autres organisations syndicales représentatives,");
      L.push("au plus tard le " + leJour(huit) + ". Celle qui a demandé l'ouverture n'a");
      L.push("pas à recevoir sa propre demande, mais rien n'interdit de la mettre en");
      L.push("copie — et cela vaut preuve supplémentaire.");
      L.push("");
      L = L.concat(courrierOS(ctx,
        "transmission d'une demande syndicale d'ouverture de négociation",
        ["Une organisation syndicale représentative dans l'entreprise m'a adressé, le",
         (ref ? leJour(ref) : "[DATE]") + ", une demande d'ouverture d'une négociation portant sur",
         "[THÈME DE LA NÉGOCIATION DEMANDÉE].",
         "",
         "Conformément au dernier alinéa de l'article L. 2242-13 du code du travail,",
         "aux termes duquel la demande de négociation formulée par l'organisation",
         "syndicale est transmise dans les huit jours par l'employeur aux autres",
         "organisations représentatives, je vous en transmets copie ci-jointe.",
         "",
         "Les parties seront convoquées à la négociation dans les quinze jours de",
         "cette demande, soit au plus tard le " + leJour(quinze) + ". La convocation, avec",
         "son ordre du jour, vous parviendra séparément."],
        { pj: ["copie de la demande reçue, datée"] }));

      L.push(GROS);
      L.push("ACTE 2 — LA CONVOCATION DES PARTIES (QUINZE JOURS)");
      L.push(GROS);
      L.push("");
      L.push("À adresser à TOUTES les organisations représentatives — la demanderesse");
      L.push("comprise —, au plus tard le " + leJour(quinze) + ".");
      L.push("");
      destinataires(L);
      L = L.concat(courrierOS(ctx,
        "convocation à la négociation demandée par une organisation syndicale",
        ["Faisant suite à la demande d'ouverture de négociation reçue le " +
           (ref ? leJour(ref) : "[DATE]") + ",",
         "et conformément au dernier alinéa de l'article L. 2242-13 du code du",
         "travail, je convoque les parties à la négociation portant sur [THÈME].",
         "",
         "  · date de la première réunion : [DATE — à fixer sans attendre]",
         "  · heure : [........]",
         "  · lieu : [........]",
         "",
         "Conformément à l'article L. 2242-14, seront précisés lors de cette première",
         "réunion le lieu et le calendrier de la ou des réunions, ainsi que les",
         "informations que je remettrai aux délégués syndicaux et aux salariés",
         "composant la délégation sur les thèmes prévus par la négociation qui",
         "s'engage, et la date de cette remise.",
         "",
         "Vous voudrez bien me faire connaître la composition de votre délégation."],
        { pj: ["ordre du jour de la première réunion",
               "projet de calendrier des réunions"] }));

      bordereau(L, "les pièces à conserver — ce sont elles qui prouvent les délais", [
        "La demande syndicale elle-même, avec sa date de réception établie (courrier recommandé, décharge, ou courriel horodaté).",
        "L'accusé de réception adressé à l'organisation demanderesse.",
        "Les courriers de transmission aux autres organisations, avec leur preuve d'envoi datée.",
        "La liste des organisations représentatives destinataires, à la date de la transmission.",
        "Les convocations des parties, avec leur preuve d'envoi datée.",
        "Le procès-verbal de la première réunion, portant les mentions de L. 2242-14.",
      ]);

      L = L.concat(calendrier(ctx, [
        "  · " + leJour(base) + " — la demande est reçue. C'est le jour zéro : les deux",
        suite("délais courent de cette date, et non de la date à laquelle vous"),
        suite("l'avez ouverte ou traitée."),
        "  · " + leJour(dans(base, 1)) + " — accusé de réception adressé à l'organisation",
        suite("demanderesse, et date de réception établie par écrit."),
        "  · " + leJour(dans(base, 3)) + " — la liste des organisations représentatives est",
        suite("arrêtée : c'est elle qui détermine les destinataires."),
        "  · " + leJour(huit) + " — TERME DU PREMIER DÉLAI : la demande est transmise aux",
        suite("autres organisations représentatives. Huit jours, pas neuf."),
        "  · " + leJour(quinze) + " — TERME DU SECOND DÉLAI : les parties sont convoquées.",
        suite("Quinze jours, pas seize."),
        "  · La première réunion peut se tenir après le quinzième jour : c'est la",
        suite("CONVOCATION qui doit être faite dans les quinze jours, non la"),
        suite("réunion elle-même. Mais elle ne se repousse pas indéfiniment."),
      ]));

      return L.concat(pied("L. 2242-13, dernier alinéa ; L. 2242-14 ; L. 2243-1",
        ["Les deux délais sont ceux du texte : huit jours pour la transmission,",
         "quinze pour la convocation. Le texte ne dit pas s'il s'agit de jours",
         "ouvrables ou calendaires ; ce document ne le dit pas non plus, et compte en",
         "jours calendaires — la lecture la plus stricte pour l'employeur, donc la plus",
         "sûre. Ne pariez pas sur l'autre."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     NAO-CTL-LOY-01 — LE PROCÈS-VERBAL DE PREMIÈRE RÉUNION

     Fondement : L. 2242-14. Ce que le contrôle appelle « les quatre mentions »
     tient dans les deux numéros du texte : le lieu et le calendrier (1°), les
     informations et la date de leur remise (2°).

     AUCUNE PEINE N'EST ANNONCÉE : aucun texte capté n'attache de sanction à
     L. 2242-14. Ce qui se joue est ailleurs, et il est lu — L. 2242-6 range le
     lieu, le calendrier et les informations dans l'engagement sérieux et loyal,
     dont l'attestation conditionne le dépôt d'un accord sur les salaires.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("NAO-CTL-LOY-01", {
    nom: "Le procès-verbal de première réunion — lieu, calendrier, informations et date de remise",
    detail: "Le procès-verbal portant les mentions de L. 2242-14, la liste des " +
            "informations remises, le bordereau de remise daté et le courrier de " +
            "notification aux organisations syndicales.",
    produire: function (ctx) {
      var r = bloc(ctx, "premiereReunion");
      var L = entete(ctx, "Procès-verbal de première réunion de négociation",
        "article L. 2242-14 du code du travail");

      modeDEmploi(L, "le procès-verbal de la première réunion, et le bordereau de remise des informations");

      L.push("════ LE TEXTE, EN ENTIER — IL EST COURT ════");
      L.push("");
      citer(L, "L2242-14");
      L.push("Quatre éléments, en deux numéros : le lieu, le calendrier, les");
      L.push("informations, la date de leur remise. Aucun n'est facultatif, et aucun ne");
      L.push("se déduit : ils SONT PRÉCISÉS lors de la première réunion, et le");
      L.push("procès-verbal en est la trace.");
      L.push("");

      L.push("════ CE QUE VOTRE DOSSIER DÉCLARE ════");
      L.push("");
      L.push("  · date de la première réunion : " +
        (vide(r.date) ? "[NON RENSEIGNÉE]" : jour(r.date, "date")));
      L.push("  · lieu et calendrier fixés : " + etat(r.lieuCalendrierFixes, "OUI", "NON"));
      L.push("  · informations remises : " + etat(r.informationsRemises, "OUI", "NON"));
      L.push("  · date de remise des informations : " +
        (vide(r.dateRemiseInformations) ? "[NON RENSEIGNÉE]" : jour(r.dateRemiseInformations, "date")));
      L.push("");
      L.push("Une mention manquante ne se rattrape pas par une déclaration : elle se");
      L.push("rattrape par une réunion de cadrage, où le point est arrêté");
      L.push("CONTRADICTOIREMENT avec les organisations syndicales, et par un");
      L.push("procès-verbal qui le constate. Le courrier de convocation à cette réunion");
      L.push("figure plus bas.");
      L.push("");

      L.push("════ CE QUI SE JOUE, ET CE QUI NE SE JOUE PAS ════");
      L.push("");
      L.push("Aucun texte capté par ce module n'attache de sanction pénale ni de");
      L.push("pénalité financière au seul manquement à L. 2242-14. Ce document");
      L.push("n'annonce donc ni amende ni pénalité. Ce qui se joue réellement est");
      L.push("ailleurs, et il est écrit :");
      L.push("");
      citerMorceau(L, "L2242-6", "L'engagement sérieux et loyal", null);
      L.push("Le lieu, le calendrier et les informations nécessaires sont donc DANS la");
      L.push("définition de l'engagement sérieux et loyal. Or c'est cet engagement que");
      L.push("le procès-verbal d'ouverture doit attester pour qu'un accord sur les");
      L.push("salaires effectifs puisse être déposé (L. 2242-6, premier alinéa). Une");
      L.push("première réunion bâclée se paie donc au dépôt, plusieurs mois plus tard,");
      L.push("quand plus rien ne peut être rattrapé.");
      L.push("");

      L.push(GROS);
      L.push("PROCÈS-VERBAL DE PREMIÈRE RÉUNION");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push(adresseDe(ctx));
      L.push("");
      L.push("NÉGOCIATION : [rémunération, temps de travail et partage de la valeur");
      L.push("ajoutée (L. 2242-1, 1°) / égalité professionnelle et qualité de vie et des");
      L.push("conditions de travail (L. 2242-1, 2°) / gestion des emplois et des");
      L.push("parcours professionnels (L. 2242-2) / salariés expérimentés (L. 2242-2-1)]");
      L.push("");
      L.push("PREMIÈRE RÉUNION DU " +
        (vide(r.date) ? "[DATE]" : jour(r.date, "date").toUpperCase()));
      L.push("");
      L.push("PRÉSENTS");
      L.push("  Pour l'employeur : " + signataire(ctx));
      L.push("    [et : ............................................]");
      L.push("  Pour les organisations syndicales représentatives :");
      L.push("    · [Organisation 1 — délégué syndical, et salariés composant la");
      L.push("      délégation : ....................................]");
      L.push("    · [Organisation 2 — ..............................]");
      L.push("    · [Organisation 3 — ..............................]");
      L.push("  Absents ou excusés : [..............................]");
      L.push("");
      L.push("  [Joindre la feuille d'émargement signée. Une présence contestée sur un");
      L.push("  procès-verbal sans émargement se conteste facilement.]");
      L.push("");
      L.push("ARTICLE 1 — LE LIEU DES RÉUNIONS (L. 2242-14, 1°)");
      L.push("");
      L.push("Les réunions de la présente négociation se tiendront à [LIEU PRÉCIS —");
      L.push("adresse, salle]. [Le cas échéant : les réunions pourront se tenir en");
      L.push("visioconférence dans les conditions convenues entre les parties, à");
      L.push("préciser ici.]");
      L.push("");
      L.push("ARTICLE 2 — LE CALENDRIER DES RÉUNIONS (L. 2242-14, 1°)");
      L.push("");
      L.push("  n° │ date            │ heure  │ objet de la réunion");
      L.push("  ───┼─────────────────┼────────┼──────────────────────────────────────");
      L.push("   1 │ " + (vide(r.date) ? "[..............]" : jour(r.date, "date")) +
        (vide(r.date) ? "" : new Array(Math.max(1, 17 - jour(r.date, "date").length)).join(" ")) +
        "│ [....] │ ouverture, cadrage");
      L.push("   2 │ [..............] │ [....] │ [..............................]");
      L.push("   3 │ [..............] │ [....] │ [..............................]");
      L.push("   4 │ [..............] │ [....] │ [..............................]");
      L.push("   5 │ [..............] │ [....] │ clôture : accord ou désaccord");
      L.push("");
      L.push("Un calendrier qui se borne à annoncer « des réunions se tiendront au");
      L.push("premier semestre » ne précise rien : le texte veut des dates.");
      L.push("");
      L.push("ARTICLE 3 — LES INFORMATIONS REMISES (L. 2242-14, 2°)");
      L.push("");
      L.push("L'employeur remettra aux délégués syndicaux et aux salariés composant la");
      L.push("délégation les informations suivantes, sur les thèmes prévus par la");
      L.push("négociation qui s'engage :");
      L.push("");
      L.push("  1. [.....................................................]");
      L.push("  2. [.....................................................]");
      L.push("  3. [.....................................................]");
      L.push("  4. [.....................................................]");
      L.push("  5. [.....................................................]");
      L.push("  6. [.....................................................]");
      L.push("");
      L.push("[La liste des informations propres à chaque négociation figure dans le");
      L.push("document du point correspondant : NAO-CTL-PER-01 pour la rémunération,");
      L.push("NAO-CTL-PER-02 pour l'égalité, NAO-CTL-PER-03 pour la gestion des");
      L.push("emplois, NAO-CTL-PER-04 pour les salariés expérimentés. Reportez-la ici.]");
      L.push("");
      L.push("ARTICLE 4 — LA DATE DE REMISE DE CES INFORMATIONS (L. 2242-14, 2°)");
      L.push("");
      L.push("Ces informations seront remises le " +
        (vide(r.dateRemiseInformations) ? "[DATE]" : jour(r.dateRemiseInformations, "date")) + ", selon les modalités");
      L.push("suivantes : [remise en main propre contre décharge / envoi recommandé /");
      L.push("mise à disposition dans la base de données économiques, sociales et");
      L.push("environnementales avec information datée des bénéficiaires].");
      L.push("");
      L.push("CETTE DATE SE TIENT. Une date annoncée puis manquée est pire que pas de");
      L.push("date du tout : elle est écrite, elle est datée, et elle établit le");
      L.push("manquement toute seule.");
      L.push("");
      L.push("ARTICLE 5 — DEMANDES ET OBSERVATIONS DES ORGANISATIONS SYNDICALES");
      L.push("");
      L.push("  · [Organisation 1 : ..................................]");
      L.push("  · [Organisation 2 : ..................................]");
      L.push("");
      L.push("[Chacune de ces demandes recevra une réponse motivée : L. 2242-6 en fait");
      L.push("une composante de l'engagement sérieux et loyal.]");
      L.push("");
      L.push("Fait à " + villeDe(ctx) + ", le " +
        (vide(r.date) ? leJour(aujourd(ctx)) : jour(r.date, "date")));
      L.push("");
      L.push("[Signatures — l'employeur et, s'ils l'acceptent, les représentants des");
      L.push("organisations syndicales. Une signature refusée se mentionne ; elle");
      L.push("n'empêche pas le procès-verbal d'exister.]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("BORDEREAU DE REMISE DES INFORMATIONS");
      L.push(GROS);
      L.push("");
      L.push("À faire signer le jour de la remise. C'est cette feuille, et non le");
      L.push("procès-verbal, qui prouvera que la date annoncée a été tenue.");
      L.push("");
      L.push(nomDe(ctx));
      L.push("");
      L.push("Informations remises le " +
        (vide(r.dateRemiseInformations) ? "[DATE]" : jour(r.dateRemiseInformations, "date")) +
        ", en application de l'article L. 2242-14, 2°,");
      L.push("du code du travail, dans le cadre de la négociation sur [THÈME].");
      L.push("");
      L.push("  document remis                          │ nb pages │ signature");
      L.push("  ────────────────────────────────────────┼──────────┼────────────");
      for (var i = 0; i < 6; i++)
        L.push("  [....................................] │ [......] │ [.........]");
      L.push("");
      L.push("  Destinataire : [organisation syndicale, nom et qualité du signataire]");
      L.push("  Date et signature : [.................................]");
      L.push("");
      L.push("");

      L = L.concat(courrierOS(ctx,
        "notification du procès-verbal de première réunion et remise des informations",
        ["Vous trouverez ci-joint le procès-verbal de la première réunion de la",
         "négociation sur [THÈME], tenue le " +
           (vide(r.date) ? "[DATE]" : jour(r.date, "date")) + ".",
         "",
         "Ce procès-verbal précise, conformément à l'article L. 2242-14 du code du",
         "travail, le lieu et le calendrier de la ou des réunions, ainsi que les",
         "informations que je remettrai aux délégués syndicaux et aux salariés",
         "composant la délégation, et la date de cette remise.",
         "",
         "Ces informations vous seront remises le " +
           (vide(r.dateRemiseInformations) ? "[DATE]" : jour(r.dateRemiseInformations, "date")) +
           ", contre décharge.",
         "",
         "Toute observation sur ce procès-verbal peut m'être adressée avant la",
         "prochaine réunion ; elle y sera examinée et consignée."],
        { pj: ["procès-verbal de première réunion",
               "calendrier des réunions",
               "liste des informations qui seront remises"] }));

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous relisez le procès-verbal existant : porte-t-il les quatre"),
        suite("éléments ? Une seule absence suffit à ouvrir le sujet."),
        ech(ctx, 7, "s'il en manque un, convocation d'une réunion de cadrage — le"),
        suite("calendrier et la liste des informations se fixent"),
        suite("contradictoirement, jamais par décision unilatérale."),
        ech(ctx, 21, "réunion de cadrage : les quatre éléments sont arrêtés et"),
        suite("consignés."),
        ech(ctx, 23, "le procès-verbal est notifié à toutes les organisations"),
        suite("convoquées."),
        ech(ctx, 30, "remise des informations à la date annoncée, contre décharge."),
      ]));

      return L.concat(pied("L. 2242-6, L. 2242-14",
        ["Aucune peine n'est annoncée dans ce document : aucun texte capté par ce",
         "module n'attache de sanction pénale ni de pénalité financière au",
         "manquement à l'article L. 2242-14 pris isolément. Ce qui est encouru est",
         "l'impossibilité d'attester l'engagement sérieux et loyal au sens de",
         "L. 2242-6 — et, s'agissant d'un accord sur les salaires effectifs,",
         "l'impossibilité de le déposer."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     NAO-CTL-LOY-02 — LE PROCÈS-VERBAL D'OUVERTURE DES NÉGOCIATIONS SUR LES
     ÉCARTS DE RÉMUNÉRATION

     Fondement : L. 2242-6. C'est la pièce sans laquelle un accord sur les
     salaires effectifs ne peut pas être déposé. Le texte est capté en entier,
     et il porte les quatre composantes de l'engagement sérieux et loyal.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("NAO-CTL-LOY-02", {
    nom: "Le procès-verbal d'ouverture des négociations sur les écarts de rémunération femmes-hommes",
    detail: "La pièce qui conditionne le dépôt d'un accord sur les salaires " +
            "effectifs : les propositions respectives des parties, l'attestation " +
            "des quatre composantes de l'engagement loyal, les réponses motivées " +
            "et le courrier de dépôt avec son bordereau.",
    produire: function (ctx) {
      var n = negoDe(ctx, "remuneration");
      var L = entete(ctx, "Procès-verbal d'ouverture des négociations sur les écarts de rémunération entre les femmes et les hommes",
        "article L. 2242-6 du code du travail");

      modeDEmploi(L, "le procès-verbal sans lequel un accord sur les salaires effectifs ne peut pas être déposé");

      L.push("════ POURQUOI CETTE PIÈCE, ET NON UNE AUTRE ════");
      L.push("");
      citer(L, "L2242-6");
      L.push("Lisez la première phrase deux fois : les accords sur les salaires");
      L.push("effectifs NE PEUVENT ÊTRE DÉPOSÉS QU'ACCOMPAGNÉS de ce procès-verbal. Ce");
      L.push("n'est pas une formalité de classement, c'est une condition du dépôt. Et");
      L.push("sans dépôt, l'accord n'est pas opposable et la période n'est pas");
      L.push("couverte au regard de la pénalité de L. 2242-7.");
      L.push("");
      L.push("Le texte dit aussi ce que ce procès-verbal doit contenir et attester :");
      L.push("");
      L.push("  · il CONSIGNE les propositions respectives des parties ;");
      L.push("  · il ATTESTE que l'employeur a engagé sérieusement et loyalement les");
      L.push("    négociations.");
      L.push("");
      L.push("Et il définit cet engagement par quatre composantes, qui sont autant de");
      L.push("cases à cocher — et à prouver :");
      L.push("");
      L.push("  1. avoir convoqué à la négociation les organisations syndicales");
      L.push("     représentatives dans l'entreprise ;");
      L.push("  2. avoir fixé le lieu et le calendrier des réunions ;");
      L.push("  3. leur avoir communiqué les informations nécessaires pour leur");
      L.push("     permettre de négocier en toute connaissance de cause ;");
      L.push("  4. avoir répondu de manière motivée aux éventuelles propositions des");
      L.push("     organisations syndicales.");
      L.push("");

      L.push("════ CE QUE VOTRE DOSSIER DÉCLARE ════");
      L.push("");
      L.push("  · issue de la négociation sur la rémunération : " +
        (vide(n.issue) ? "[non renseignée]" : n.issue));
      L.push("  · procès-verbal d'ouverture sur les écarts : " +
        etat(n.pvOuvertureEcarts, "OUI", "NON — l'accord ne peut pas être déposé en l'état"));
      L.push("  · réponses motivées aux propositions syndicales : " +
        etat(F(ctx).reponsesMotivees, "OUI", "NON — la quatrième composante manque"));
      L.push("  · dépôt : " + etat(n.depot, "OUI", "non"));
      L.push("");

      L.push(GROS);
      L.push("PROCÈS-VERBAL D'OUVERTURE DES NÉGOCIATIONS PORTANT SUR LES ÉCARTS DE");
      L.push("RÉMUNÉRATION ENTRE LES FEMMES ET LES HOMMES");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push(adresseDe(ctx));
      L.push("");
      L.push("Établi en application de l'article L. 2242-6 du code du travail, pour");
      L.push("accompagner le dépôt de l'accord d'entreprise sur les salaires effectifs");
      L.push("conclu le [DATE DE L'ACCORD].");
      L.push("");
      L.push("ARTICLE 1 — LES PARTIES ET LES RÉUNIONS");
      L.push("");
      L.push("Organisations syndicales représentatives convoquées :");
      L.push("  · [Organisation 1 — convoquée le ......... par .............]");
      L.push("  · [Organisation 2 — convoquée le ......... par .............]");
      L.push("  · [Organisation 3 — convoquée le ......... par .............]");
      L.push("");
      L.push("TOUTES les organisations représentatives figurent-elles ci-dessus ? Le");
      L.push("texte exige la convocation des organisations syndicales représentatives");
      L.push("dans l'entreprise — au pluriel, et sans réserve. Une seule oubliée fait");
      L.push("tomber l'attestation.");
      L.push("");
      L.push("Réunions tenues :");
      L.push("  · [date] à [lieu] — [objet]");
      L.push("  · [date] à [lieu] — [objet]");
      L.push("  · [date] à [lieu] — [objet]");
      L.push("");
      L.push("ARTICLE 2 — LES PROPOSITIONS RESPECTIVES DES PARTIES SUR LES ÉCARTS DE");
      L.push("RÉMUNÉRATION ENTRE LES FEMMES ET LES HOMMES");
      L.push("");
      L.push("C'est le cœur de la pièce. Le texte dit « consignant les propositions");
      L.push("respectives des parties » : les DEUX côtés, et pas seulement le vôtre.");
      L.push("");
      L.push("2.1. Diagnostic présenté par l'employeur");
      L.push("  [Écarts constatés par catégorie professionnelle, par niveau de");
      L.push("  classification et par tranche d'âge — source : base de données");
      L.push("  économiques, sociales et environnementales, déclaration sociale");
      L.push("  nominative. Aucun chiffre n'est écrit ici par l'application : elle ne");
      L.push("  connaît pas vos rémunérations et ne les inventera pas.]");
      L.push("");
      L.push("2.2. Propositions de l'employeur");
      L.push("  · [Proposition 1 : ..................................]");
      L.push("  · [Proposition 2 : ..................................]");
      L.push("  · [Proposition 3 : ..................................]");
      L.push("");
      L.push("2.3. Propositions de chaque organisation syndicale");
      L.push("  · [Organisation 1 — propositions : ..................]");
      L.push("  · [Organisation 2 — propositions : ..................]");
      L.push("  · [Organisation 3 — propositions : ..................]");
      L.push("  · [Organisation n'ayant pas formulé de proposition : le mentionner");
      L.push("    plutôt que de laisser un blanc.]");
      L.push("");
      L.push("ARTICLE 3 — LES RÉPONSES MOTIVÉES DE L'EMPLOYEUR");
      L.push("");
      L.push("Une réponse motivée n'est pas un refus : c'est un refus, ou une");
      L.push("acceptation, ACCOMPAGNÉ DE SES RAISONS. Un « non » sans motif ne remplit");
      L.push("pas la quatrième composante de L. 2242-6.");
      L.push("");
      L.push("  proposition syndicale        │ réponse │ motifs de la réponse");
      L.push("  ─────────────────────────────┼─────────┼───────────────────────────");
      for (var k = 0; k < 5; k++)
        L.push("  [.........................] │ [.....] │ [.......................]");
      L.push("");
      L.push("  Date de chaque réponse écrite : [..........................]");
      L.push("");
      L.push("ARTICLE 4 — ATTESTATION DE L'ENGAGEMENT SÉRIEUX ET LOYAL");
      L.push("");
      L.push("Le soussigné atteste que les négociations ont été engagées sérieusement");
      L.push("et loyalement, au sens de l'article L. 2242-6 du code du travail :");
      L.push("");
      L.push("  [ ] toutes les organisations syndicales représentatives dans");
      L.push("      l'entreprise ont été convoquées à la négociation ;");
      L.push("  [ ] le lieu et le calendrier des réunions ont été fixés ;");
      L.push("  [ ] les informations nécessaires pour permettre de négocier en toute");
      L.push("      connaissance de cause ont été communiquées, le [DATE] ;");
      L.push("  [ ] les propositions des organisations syndicales ont reçu une réponse");
      L.push("      motivée.");
      L.push("");
      L.push("Ne cochez que ce qui est vrai et prouvable. Une attestation cochée à la");
      L.push("légère est une pièce que vous avez signée, et elle vous sera opposée.");
      L.push("");
      L.push("Fait à " + villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("[Signatures des organisations syndicales, si elles l'acceptent. Le texte");
      L.push("ne l'exige pas : il exige que le procès-verbal atteste. Un refus de");
      L.push("signature se mentionne.]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("COURRIER — RÉPONSE MOTIVÉE À UNE PROPOSITION SYNDICALE");
      L.push(GROS);
      L.push("");
      L.push("À adresser pour CHAQUE proposition restée sans réponse. Un silence se");
      L.push("constate, et il se constate sur votre propre dossier.");
      L.push("");
      L = L.concat(courrierOS(ctx,
        "réponse à vos propositions dans la négociation sur la rémunération",
        ["Vous avez formulé, lors de la réunion du [DATE], les propositions",
         "suivantes : [RAPPELER CHAQUE PROPOSITION, dans ses termes].",
         "",
         "Je vous en donne acte et vous réponds, proposition par proposition :",
         "",
         "  · [Proposition 1] : [acceptée / acceptée partiellement / non retenue].",
         "    Motifs : [....................................................]",
         "",
         "  · [Proposition 2] : [acceptée / acceptée partiellement / non retenue].",
         "    Motifs : [....................................................]",
         "",
         "Ces réponses seront consignées au procès-verbal d'ouverture des",
         "négociations portant sur les écarts de rémunération entre les femmes et les",
         "hommes, que l'article L. 2242-6 du code du travail impose de joindre au",
         "dépôt de l'accord sur les salaires effectifs."],
        { pj: [] }));

      L.push(GROS);
      L.push("COURRIER — DÉPÔT DE L'ACCORD SUR LES SALAIRES EFFECTIFS");
      L.push(GROS);
      L.push("");
      L.push("ATTENTION AUX MODALITÉS. L'article L. 2242-6 renvoie, pour les conditions");
      L.push("du dépôt, à l'article L. 2231-6, qui N'A PAS été lu à la source par ce");
      L.push("module : le support du dépôt, le nombre d'exemplaires et les pièces à");
      L.push("joindre ne sont donc pas décrits ici. Vérifiez-les avant d'envoyer. Ce");
      L.push("que ce document garantit, c'est que la pièce que L. 2242-6 exige");
      L.push("d'accompagner le dépôt existe et est complète.");
      L.push("");
      L.push(nomDe(ctx));
      L.push(adresseDe(ctx));
      L.push("");
      L.push("À l'autorité administrative compétente");
      L.push("[service de dépôt des accords collectifs — coordonnées à vérifier]");
      L.push("");
      L.push(villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Objet : dépôt de l'accord d'entreprise sur les salaires effectifs");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Je procède au dépôt de l'accord d'entreprise sur les salaires effectifs");
      L.push("conclu le [DATE] au sein de " + nomDe(ctx) + ".");
      L.push("");
      L.push("Conformément à l'article L. 2242-6 du code du travail, aux termes duquel");
      L.push("les accords collectifs d'entreprise sur les salaires effectifs ne peuvent");
      L.push("être déposés qu'accompagnés d'un procès-verbal d'ouverture des");
      L.push("négociations portant sur les écarts de rémunération entre les femmes et");
      L.push("les hommes, consignant les propositions respectives des parties, ce");
      L.push("procès-verbal est joint au présent dépôt.");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      bordereau(L, "bordereau des pièces du dépôt", [
        "L'accord d'entreprise sur les salaires effectifs, signé et daté, en autant d'exemplaires que les modalités de dépôt en exigent.",
        "Le procès-verbal d'ouverture des négociations portant sur les écarts de rémunération entre les femmes et les hommes (L. 2242-6) — pièce sans laquelle le dépôt ne peut pas être reçu.",
        "Les convocations de toutes les organisations syndicales représentatives, avec leur preuve d'envoi.",
        "Le procès-verbal de première réunion portant le lieu et le calendrier (L. 2242-14).",
        "Le bordereau de remise des informations, daté et signé.",
        "Les réponses motivées aux propositions syndicales, datées.",
        "[Le cas échéant, les autres pièces exigées par les modalités de dépôt — à vérifier à l'article L. 2231-6, non lu par ce module.]",
      ]);

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous relevez chaque proposition syndicale restée sans réponse."),
        ech(ctx, 7, "chaque réponse motivée est écrite, datée et adressée."),
        ech(ctx, 10, "le procès-verbal d'ouverture est rédigé : propositions des deux"),
        suite("côtés consignées, quatre composantes attestées."),
        ech(ctx, 14, "le procès-verbal est communiqué aux organisations syndicales,"),
        suite("qui peuvent le signer ou refuser — le refus se mentionne."),
        ech(ctx, 21, "dépôt de l'accord ACCOMPAGNÉ du procès-verbal."),
        ech(ctx, 35, "le récépissé est au dossier. C'est lui qui prouve le dépôt, et"),
        suite("non l'accord lui-même."),
      ]));

      return L.concat(pied("L. 2242-6, L. 2242-14, L. 2242-15, L. 2242-7",
        ["L'article L. 2231-6, auquel L. 2242-6 renvoie pour les conditions du dépôt,",
         "n'a PAS été lu à la source par ce module : il est nommé, et les modalités",
         "matérielles du dépôt ne sont ni décrites ni supposées ici."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     NAO-CTL-UNI-01 — LE RETRAIT D'UNE DÉCISION UNILATÉRALE

     Fondement : L. 2242-4, L. 2242-5 et Soc., 15 avril 2026, n° 24-15.653.

     AUCUNE PEINE N'EST ANNONCÉE : aucun des quatre textes de sanction captés
     ne nomme L. 2242-4. La fiche de régularisation classe ce point en gravité 2
     — « pénalité financière encourue » — et évoque l'entrave : le corpus lu ne
     porte ni l'une ni l'autre pour cette interdiction. Ce document dit à la
     place ce qui se joue, et qui est lu : une interdiction, une réserve
     d'urgence qui se démontre, et une négociation qui n'a pas pris fin.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("NAO-CTL-UNI-01", {
    nom: "Le retrait d'une décision unilatérale prise pendant la négociation",
    detail: "Le relevé des décisions arrêtées depuis l'ouverture, l'examen de " +
            "l'urgence, la note de retrait ou de suspension, l'information des " +
            "organisations syndicales et la réouverture du point en séance.",
    produire: function (ctx) {
      var d = bloc(ctx, "decisionUnilaterale");
      var L = entete(ctx, "Retrait d'une décision unilatérale prise dans une matière en cours de négociation",
        "article L. 2242-4 du code du travail");

      modeDEmploi(L, "la note de retrait d'une décision unilatérale et l'information des organisations syndicales");

      L.push("════ L'INTERDICTION, DANS SES TERMES ════");
      L.push("");
      citer(L, "L2242-4");
      L.push("Quatre éléments, et chacun compte :");
      L.push("");
      L.push("  1. « TANT QUE LA NÉGOCIATION EST EN COURS » — c'est une interdiction à");
      L.push("     durée déterminée, mais c'est la fin de la négociation qui en fixe le");
      L.push("     terme, et cette fin ne se décrète pas (voir plus bas).");
      L.push("  2. « DANS LES MATIÈRES TRAITÉES » — l'interdiction ne gèle pas");
      L.push("     l'entreprise entière : elle porte sur les matières de la négociation");
      L.push("     en cours. Encore faut-il les avoir délimitées.");
      L.push("  3. « CONCERNANT LA COLLECTIVITÉ DES SALARIÉS » — une mesure");
      L.push("     individuelle n'est pas visée par ce texte.");
      L.push("  4. « SAUF SI L'URGENCE LE JUSTIFIE » — une réserve, et une seule. Elle");
      L.push("     se démontre par des faits ; elle ne se déclare pas.");
      L.push("");
      L.push("Le texte vise les négociations des articles L. 2242-1, L. 2242-2 ET");
      L.push("L. 2242-2-1 : les quatre négociations obligatoires, sans exception.");
      L.push("");

      L.push("════ ET LA NÉGOCIATION NE FINIT PAS QUAND VOUS LE DÉCIDEZ ════");
      L.push("");
      citerArret(L, ARRETS.finDesNegociations);
      L.push("C'est le point qui piège : une dernière réunion tenue, une annonce de");
      L.push("clôture, un délai de réflexion écoulé — rien de tout cela ne met fin aux");
      L.push("négociations. Tant que le procès-verbal de désaccord n'est pas établi,");
      L.push("elles sont en cours, et l'interdiction de L. 2242-4 tient. Dans l'affaire");
      L.push("jugée, le procès-verbal avait été établi le 16 avril quand le syndicat");
      L.push("avait accepté la dernière proposition le 12 : à cette date, les");
      L.push("négociations étaient toujours en cours.");
      L.push("");
      citer(L, "L2242-5", "Et voici ce qui, seul, y met fin :");

      L.push("════ CE QUI SE JOUE, ET CE QUI NE SE JOUE PAS ════");
      L.push("");
      L.push("AUCUNE PEINE N'EST ANNONCÉE DANS CE DOCUMENT. Les quatre textes de");
      L.push("sanction captés par ce module — L. 2242-7, L. 2242-8, L. 2243-1 et");
      L.push("L. 2243-2 — visent l'obligation de négocier, la convocation des parties,");
      L.push("les salaires effectifs et l'égalité professionnelle. Aucun ne nomme");
      L.push("l'article L. 2242-4, et aucun ne vise l'interdiction de décider");
      L.push("unilatéralement.");
      L.push("");
      L.push("Ce qui se joue réellement, en revanche, tient en trois lignes :");
      L.push("");
      L.push("  · la décision a été prise en violation d'une interdiction légale — sa");
      L.push("    validité est contestable, et c'est devant le juge que cela se règle ;");
      L.push("  · l'urgence, seule réserve admise, doit être établie par des faits");
      L.push("    documentés à la date de la décision, et non reconstruits après coup ;");
      L.push("  · le manquement se verse au débat sur la loyauté de la négociation");
      L.push("    (L. 2242-6) : décider seul ce que l'on prétend négocier est le");
      L.push("    contraire d'une négociation loyale.");
      L.push("");

      L.push("════ CE QUE VOTRE DOSSIER DÉCLARE ════");
      L.push("");
      L.push("  · décision unilatérale arrêtée pendant une négociation : " +
        etat(d.prise, "OUI", "non"));
      L.push("  · matière concernée : " + (vide(d.matiere) ? "[non renseignée]" : d.matiere));
      L.push("  · urgence invoquée : " + etat(d.urgence, "OUI — elle doit être démontrée", "non"));
      L.push("");

      L.push(GROS);
      L.push("ÉTAPE 1 — LE RELEVÉ DES DÉCISIONS");
      L.push(GROS);
      L.push("");
      L.push("Toutes les décisions arrêtées depuis l'ouverture de chaque négociation en");
      L.push("cours, sans trier d'avance : c'est le rapprochement avec les matières");
      L.push("négociées qui trie, pas l'intuition.");
      L.push("");
      L.push("  date  │ décision              │ matière   │ dans le champ │ urgence");
      L.push("        │                       │           │ négocié ?     │ établie ?");
      L.push("  ──────┼───────────────────────┼───────────┼───────────────┼──────────");
      for (var i = 0; i < 6; i++)
        L.push("  [...] │ [...................] │ [.......] │ [OUI / non]   │ [OUI/non]");
      L.push("");
      L.push("  Négociations en cours à ce jour, et matières qu'elles traitent :");
      L.push("  · [Négociation ................ — ouverte le ......... — matières :");
      L.push("    ..............................................................]");
      L.push("  · [Négociation ................ — ouverte le ......... — matières :");
      L.push("    ..............................................................]");
      L.push("");
      L.push("  Pour chacune : le procès-verbal de désaccord a-t-il été établi ?");
      L.push("  [OUI, le ......... / NON — la négociation est donc toujours en cours]");
      L.push("");

      L.push(GROS);
      L.push("ÉTAPE 2 — L'EXAMEN DE L'URGENCE, DÉCISION PAR DÉCISION");
      L.push(GROS);
      L.push("");
      L.push("L'urgence est la seule réserve que le texte admette. Elle s'apprécie au");
      L.push("fond et à la date de la décision. Les questions ci-dessous ne sont pas");
      L.push("dans le texte : elles servent à voir si les faits y sont.");
      L.push("");
      L.push("  · Quel fait a rendu la décision impossible à différer ?");
      L.push("    [.........................................................]");
      L.push("  · À quelle date ce fait est-il apparu, et par quelle pièce se");
      L.push("    prouve-t-il ? [...........................................]");
      L.push("  · Pourquoi la prochaine réunion de négociation était-elle trop");
      L.push("    tardive ? [...............................................]");
      L.push("  · La décision a-t-elle été limitée à ce que l'urgence commandait, ou");
      L.push("    va-t-elle au-delà ? [.....................................]");
      L.push("  · Les organisations syndicales en ont-elles été informées");
      L.push("    immédiatement ? [.........................................]");
      L.push("");
      L.push("Si l'une de ces réponses est vide, l'urgence n'est pas documentée. Une");
      L.push("urgence affirmée et non documentée ne vaut pas mieux qu'une urgence");
      L.push("absente — sauf qu'elle a été écrite.");
      L.push("");

      L.push(GROS);
      L.push("ÉTAPE 3 — LA NOTE DE RETRAIT OU DE SUSPENSION");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push(adresseDe(ctx));
      L.push("");
      L.push("NOTE DE RETRAIT D'UNE DÉCISION UNILATÉRALE — " + leJour(aujourd(ctx)));
      L.push("");
      L.push("ARTICLE 1 — LA DÉCISION EN CAUSE");
      L.push("Décision du [DATE], portant sur [OBJET], applicable à [PÉRIMÈTRE].");
      L.push("Matière concernée : " + (vide(d.matiere) ? "[MATIÈRE]" : d.matiere) + ".");
      L.push("");
      L.push("ARTICLE 2 — LA NÉGOCIATION EN COURS");
      L.push("Négociation sur [THÈME], ouverte le [DATE], portant notamment sur cette");
      L.push("matière. Aucun procès-verbal de désaccord n'a été établi à ce jour : la");
      L.push("négociation est donc en cours au sens de l'article L. 2242-4.");
      L.push("");
      L.push("ARTICLE 3 — LE CONSTAT");
      L.push("L'article L. 2242-4 du code du travail interdit à l'employeur, tant que la");
      L.push("négociation est en cours, d'arrêter dans les matières traitées des");
      L.push("décisions unilatérales concernant la collectivité des salariés, sauf si");
      L.push("l'urgence le justifie. L'urgence n'étant pas [établie / invoquée] pour");
      L.push("cette décision, celle-ci ne pouvait pas être arrêtée.");
      L.push("");
      L.push("ARTICLE 4 — LA DÉCISION PRISE CE JOUR");
      L.push("  [ ] La décision du [DATE] est RETIRÉE, avec effet au [DATE].");
      L.push("  [ ] La décision du [DATE] est SUSPENDUE jusqu'au terme de la");
      L.push("      négociation, constaté par accord ou par procès-verbal de désaccord.");
      L.push("");
      L.push("  [Traiter le sort des situations constituées entre la décision et son");
      L.push("  retrait : ce point n'est réglé par aucun texte lu par ce module, et il");
      L.push("  ne se règle pas d'une formule. Faites-le examiner.]");
      L.push("");
      L.push("ARTICLE 5 — LA SUITE");
      L.push("Le point est réinscrit à l'ordre du jour de la réunion du [DATE] et sera");
      L.push("traité dans le cadre de la négociation. Le procès-verbal de cette réunion");
      L.push("mentionnera le retrait.");
      L.push("");
      L.push("Fait à " + villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L = L.concat(courrierOS(ctx,
        "retrait d'une décision unilatérale et réinscription du point à la négociation",
        ["Je vous informe que la décision du [DATE] portant sur [OBJET] est",
         "[retirée / suspendue] à compter du [DATE].",
         "",
         "Cette décision touchait à une matière traitée par la négociation sur",
         "[THÈME], ouverte le [DATE] et toujours en cours : aucun procès-verbal de",
         "désaccord n'a été établi à ce jour.",
         "",
         "L'article L. 2242-4 du code du travail dispose que, tant que la négociation",
         "mentionnée aux articles L. 2242-1, L. 2242-2 et L. 2242-2-1 est en cours,",
         "l'employeur ne peut, dans les matières traitées, arrêter de décisions",
         "unilatérales concernant la collectivité des salariés, sauf si l'urgence le",
         "justifie.",
         "",
         "Le point est réinscrit à l'ordre du jour de la réunion du [DATE]. Vos",
         "propositions sur ce point seront examinées et recevront une réponse",
         "motivée."],
        { pj: ["note de retrait", "ordre du jour de la prochaine réunion"] }));

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous dressez le relevé des décisions arrêtées depuis l'ouverture"),
        suite("de chaque négociation en cours, et la liste des matières traitées."),
        ech(ctx, 2, "pour chacune, l'urgence est documentée — ou elle ne l'est pas."),
        ech(ctx, 5, "la note de retrait ou de suspension est signée. Le retrait est"),
        suite("immédiat : c'est la décision elle-même qu'il faut reprendre."),
        ech(ctx, 6, "les organisations syndicales sont informées par écrit."),
        ech(ctx, 20, "le point est réinscrit à l'ordre du jour et traité en séance ;"),
        suite("le procès-verbal mentionne le retrait."),
        "  · Et jusqu'au procès-verbal de désaccord : aucune nouvelle décision",
        suite("unilatérale dans les matières traitées. La négociation ne prend pas"),
        suite("fin avant lui."),
      ]));

      return L.concat(pied("L. 2242-4, L. 2242-5, L. 2242-6 ; " +
        ARRETS.finDesNegociations.ref,
        ["Aucune peine n'est annoncée dans ce document : aucun des textes de sanction",
         "captés par ce module — L. 2242-7, L. 2242-8, L. 2243-1, L. 2243-2 — ne vise",
         "l'article L. 2242-4. Ce qui est encouru est la contestation de la décision",
         "elle-même et le grief de déloyauté, non une amende."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     NAO-CTL-ISS-01 — LE PROCÈS-VERBAL DE DÉSACCORD

     Fondement : L. 2242-5, R. 2242-1, et les arrêts Soc., 15 avril 2026 et
     2e Civ., 7 novembre 2019.

     Le corpus n'attache aucune peine à L. 2242-5 pris pour lui-même. Mais il
     porte une conséquence directe, et elle est lue : le troisième alinéa de
     L. 2242-8 fait du procès-verbal de désaccord la pièce qui ATTESTE le défaut
     d'accord dans les entreprises d'au moins trois cents salariés. Sans lui,
     l'entreprise ne peut pas établir sa situation au regard de la pénalité.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("NAO-CTL-ISS-01", {
    nom: "Le procès-verbal de désaccord — propositions en leur dernier état et mesures unilatérales",
    detail: "Le procès-verbal que L. 2242-5 impose, avec les deux mentions qu'il " +
            "exige, le courrier de dépôt, le bordereau des pièces et le tableau " +
            "de l'issue de chacune des quatre négociations.",
    produire: function (ctx) {
      var negos = [
        ["remuneration", "Rémunération, temps de travail et partage de la valeur ajoutée", "L. 2242-1, 1°"],
        ["egalite", "Égalité professionnelle et qualité de vie et des conditions de travail", "L. 2242-1, 2°"],
        ["gepp", "Gestion des emplois et des parcours professionnels", "L. 2242-2"],
        ["experimentes", "Emploi et conditions de travail des salariés expérimentés", "L. 2242-2-1"],
      ];
      var s = seuil300(ctx);
      var L = entete(ctx, "Procès-verbal de désaccord, et son dépôt",
        "articles L. 2242-5 et R. 2242-1 du code du travail");

      modeDEmploi(L, "le procès-verbal de désaccord et le courrier qui le dépose");

      L.push("════ CE QUE LE TEXTE EXIGE — DEUX MENTIONS, PAS UNE ════");
      L.push("");
      citer(L, "L2242-5");
      L.push("Un procès-verbal de désaccord n'est pas un constat d'échec. Le texte lui");
      L.push("impose DEUX contenus, et l'oubli du second est le plus fréquent :");
      L.push("");
      L.push("  1. LES PROPOSITIONS RESPECTIVES DES PARTIES, EN LEUR DERNIER ÉTAT.");
      L.push("     Celles de l'employeur ET celles de chaque organisation syndicale,");
      L.push("     telles qu'elles se présentaient à la fin — non au début, et non");
      L.push("     résumées en « les parties n'ont pu se mettre d'accord ».");
      L.push("  2. LES MESURES QUE L'EMPLOYEUR ENTEND APPLIQUER UNILATÉRALEMENT.");
      L.push("     C'est ce qui fonde ensuite leur opposabilité : des mesures");
      L.push("     appliquées sans figurer au procès-verbal se défendent mal.");
      L.push("");
      L.push("Et le dépôt n'est pas facultatif :");
      L.push("");
      citer(L, "R2242-1");
      L.push("L'article D. 2231-2, auquel R. 2242-1 renvoie, N'A PAS été lu à la source");
      L.push("par ce module : les modalités matérielles du dépôt — support, destinataire");
      L.push("précis, pièces jointes — ne sont donc ni décrites ni supposées ici.");
      L.push("Vérifiez-les avant d'envoyer.");
      L.push("");
      L.push("« À l'initiative de la partie la plus diligente » : l'employeur ne peut");
      L.push("pas attendre que les organisations syndicales s'en chargent. S'il attend,");
      L.push("il est celui qui n'a pas déposé.");
      L.push("");

      L.push("════ LA NÉGOCIATION NE FINIT PAS AVANT CE PROCÈS-VERBAL ════");
      L.push("");
      citerArret(L, ARRETS.finDesNegociations);
      L.push("Conséquence pratique, et elle est lourde : tant que le procès-verbal");
      L.push("n'est pas établi, l'interdiction de l'article L. 2242-4 tient — pas de");
      L.push("décision unilatérale dans les matières traitées, sauf urgence justifiée.");
      L.push("Le document du point NAO-CTL-UNI-01 traite cette question.");
      L.push("");
      L.push("Mais l'obligation reste d'engager, non de conclure :");
      L.push("");
      citerArret(L, ARRETS.engagerNonConclure);

      L.push("════ ET UNE CONSÉQUENCE DIRECTE, POUR L'ÉGALITÉ ════");
      L.push("");
      citerMorceau(L, "L2242-8", "Dans les entreprises d'au moins 300 salariés", "La pénalité prévue");
      L.push("Dans une entreprise d'au moins trois cents salariés, le procès-verbal de");
      L.push("désaccord sur l'égalité professionnelle est donc la pièce qui ATTESTE le");
      L.push("défaut d'accord. Sans lui, l'entreprise ne peut pas établir sa situation");
      L.push("devant l'administration au regard de la pénalité de L. 2242-8.");
      if (s.connu)
        L.push("Votre effectif déclaré est de " + (s.effectif === null ? "[non renseigné]" : s.effectif + " salariés") + ".");
      L.push("");

      L.push("════ L'ISSUE DE CHACUNE DE VOS NÉGOCIATIONS ════");
      L.push("");
      L.push("  négociation                              │ issue        │ dépôt");
      L.push("  ─────────────────────────────────────────┼──────────────┼────────────");
      for (var i = 0; i < negos.length; i++) {
        var n = negoDe(ctx, negos[i][0]);
        var titre = negos[i][1];
        var court = titre.length > 38 ? titre.slice(0, 38) : titre;
        while (court.length < 38) court += " ";
        var iss = vide(n.issue) ? "[non rens.]" : String(n.issue);
        while (iss.length < 12) iss += " ";
        L.push("  " + court + " │ " + iss.slice(0, 12) + " │ " +
          (estOui(n.depot) ? "OUI" : estNon(n.depot) ? "NON" : "[non rens.]"));
      }
      L.push("");
      L.push("Une négociation « en cours » n'appelle pas de procès-verbal de désaccord :");
      L.push("elle appelle des réunions. Une négociation terminée sans accord et sans");
      L.push("procès-verbal déposé n'est, elle, ni terminée ni couverte.");
      L.push("");

      L.push(GROS);
      L.push("PROCÈS-VERBAL DE DÉSACCORD");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push(adresseDe(ctx));
      L.push("");
      L.push("NÉGOCIATION : [rémunération (L. 2242-1, 1°) / égalité professionnelle");
      L.push("(L. 2242-1, 2°) / gestion des emplois (L. 2242-2) / salariés expérimentés");
      L.push("(L. 2242-2-1)] — un procès-verbal par négociation, jamais un pour tout.");
      L.push("");
      L.push("ARTICLE 1 — LE DÉROULEMENT DE LA NÉGOCIATION");
      L.push("");
      L.push("Organisations syndicales représentatives convoquées :");
      L.push("  · [Organisation 1 — convoquée le .........]");
      L.push("  · [Organisation 2 — convoquée le .........]");
      L.push("  · [Organisation 3 — convoquée le .........]");
      L.push("");
      L.push("Réunions tenues :");
      L.push("  · [date] — [objet] — [présents]");
      L.push("  · [date] — [objet] — [présents]");
      L.push("  · [date] — [objet] — [présents]");
      L.push("");
      L.push("Informations remises aux négociateurs le [DATE], contre décharge");
      L.push("(L. 2242-14, 2°).");
      L.push("");
      L.push("ARTICLE 2 — LES PROPOSITIONS DE L'EMPLOYEUR, EN LEUR DERNIER ÉTAT");
      L.push("");
      L.push("Telles qu'elles se présentaient à l'issue de la réunion du [DATE] :");
      L.push("");
      L.push("  · [Proposition 1 : ...............................................]");
      L.push("  · [Proposition 2 : ...............................................]");
      L.push("  · [Proposition 3 : ...............................................]");
      L.push("");
      L.push("[AUCUN CHIFFRE N'EST ÉCRIT ICI PAR L'APPLICATION. Vos propositions sont");
      L.push("les vôtres : une proposition devinée vous engagerait sur ce que vous");
      L.push("n'avez pas voulu.]");
      L.push("");
      L.push("ARTICLE 3 — LES PROPOSITIONS DES ORGANISATIONS SYNDICALES, EN LEUR");
      L.push("DERNIER ÉTAT");
      L.push("");
      L.push("  [Organisation 1]");
      L.push("    · [.............................................................]");
      L.push("    · [.............................................................]");
      L.push("");
      L.push("  [Organisation 2]");
      L.push("    · [.............................................................]");
      L.push("    · [.............................................................]");
      L.push("");
      L.push("  [Organisation n'ayant pas formulé de proposition : le mentionner");
      L.push("  expressément plutôt que de laisser un blanc.]");
      L.push("");
      L.push("Ces propositions sont reproduites telles qu'elles ont été formulées. Une");
      L.push("organisation qui ne se reconnaîtrait pas dans leur rédaction peut le");
      L.push("faire consigner : ses observations sont annexées au présent procès-verbal.");
      L.push("");
      L.push("ARTICLE 4 — LES RÉPONSES MOTIVÉES DE L'EMPLOYEUR");
      L.push("");
      L.push("  · [Proposition syndicale — réponse et motifs : ....................]");
      L.push("  · [Proposition syndicale — réponse et motifs : ....................]");
      L.push("");
      L.push("[L'article L. 2242-6 range la réponse motivée dans l'engagement sérieux et");
      L.push("loyal des négociations : la faire figurer ici la date et la prouve.]");
      L.push("");
      L.push("ARTICLE 5 — LES MESURES QUE L'EMPLOYEUR ENTEND APPLIQUER");
      L.push("UNILATÉRALEMENT");
      L.push("");
      L.push("C'est la mention que L. 2242-5 exige et qu'on oublie. Elle n'est pas une");
      L.push("menace : elle est ce qui rendra ces mesures opposables.");
      L.push("");
      L.push("  mesure                          │ champ      │ date d'application");
      L.push("  ────────────────────────────────┼────────────┼────────────────────");
      for (var k = 0; k < 5; k++)
        L.push("  [............................] │ [........] │ [................]");
      L.push("");
      L.push("  [Si l'employeur n'entend appliquer aucune mesure unilatérale, l'écrire :");
      L.push("  « L'employeur n'entend appliquer aucune mesure unilatérale à l'issue de");
      L.push("  la présente négociation. » Un silence sur ce point laisse penser que la");
      L.push("  mention a été oubliée.]");
      L.push("");
      L.push("ARTICLE 6 — LE DÉSACCORD");
      L.push("");
      L.push("Au terme de la négociation, aucun accord n'a été conclu. Le présent");
      L.push("procès-verbal est établi en application de l'article L. 2242-5 du code du");
      L.push("travail. Il sera déposé dans les conditions prévues à l'article D. 2231-2,");
      L.push("conformément à l'article R. 2242-1.");
      L.push("");
      L.push("Fait à " + villeDe(ctx) + ", le " + leJour(aujourd(ctx)) + ", en [nombre] exemplaires.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("[Signatures des organisations syndicales présentes, si elles l'acceptent.");
      L.push("Un refus de signature se mentionne et n'empêche pas le procès-verbal");
      L.push("d'exister ni d'être déposé.]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("COURRIER — DÉPÔT DU PROCÈS-VERBAL DE DÉSACCORD");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx));
      L.push(adresseDe(ctx));
      L.push("");
      L.push("À l'autorité administrative compétente");
      L.push("[service de dépôt des accords collectifs — coordonnées à vérifier]");
      L.push("");
      L.push(villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Objet : dépôt d'un procès-verbal de désaccord (L. 2242-5, R. 2242-1)");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("La négociation obligatoire sur [THÈME], engagée le [DATE] au sein de");
      L.push(nomDe(ctx) + ", s'est achevée le [DATE] sans qu'un accord ait été conclu.");
      L.push("");
      L.push("Conformément à l'article L. 2242-5 du code du travail, un procès-verbal de");
      L.push("désaccord a été établi, dans lequel sont consignées, en leur dernier état,");
      L.push("les propositions respectives des parties et les mesures que j'entends");
      L.push("appliquer unilatéralement.");
      L.push("");
      L.push("En application de l'article R. 2242-1, je procède à son dépôt dans les");
      L.push("conditions prévues à l'article D. 2231-2.");
      L.push("");
      L.push("Je vous serais reconnaissant de bien vouloir m'en délivrer récépissé.");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      bordereau(L, "bordereau des pièces", [
        "Le procès-verbal de désaccord, daté et signé.",
        "Les convocations de toutes les organisations syndicales représentatives, avec leur preuve d'envoi.",
        "Les procès-verbaux ou relevés de chaque réunion, et les feuilles d'émargement.",
        "Le procès-verbal de première réunion portant les mentions de L. 2242-14.",
        "Le bordereau de remise des informations, daté et signé.",
        "Les réponses motivées aux propositions syndicales.",
        "Les observations éventuelles des organisations syndicales sur la rédaction du procès-verbal, annexées.",
        "[Le cas échéant, les pièces exigées par les modalités de dépôt de D. 2231-2 — article non lu par ce module.]",
        "LE RÉCÉPISSÉ DE DÉPÔT, dès sa réception : c'est lui, et non le procès-verbal, qui prouve que le dépôt a eu lieu.",
      ]);

      L = L.concat(courrierOS(ctx,
        "communication du procès-verbal de désaccord et de son dépôt",
        ["Vous trouverez ci-joint le procès-verbal de désaccord établi à l'issue de la",
         "négociation sur [THÈME], en application de l'article L. 2242-5 du code du",
         "travail.",
         "",
         "Il consigne, en leur dernier état, les propositions respectives des parties",
         "ainsi que les mesures que j'entends appliquer unilatéralement.",
         "",
         "Si la rédaction de vos propositions vous paraît inexacte, faites-le-moi",
         "savoir : vos observations seront annexées au procès-verbal.",
         "",
         "Ce procès-verbal sera déposé conformément à l'article R. 2242-1 du code du",
         "travail. Copie du récépissé vous sera adressée."],
        { pj: ["procès-verbal de désaccord"] }));

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "dernière réunion : les propositions des deux côtés sont relevées"),
        suite("en leur dernier état, séance tenante. Reconstituées trois semaines"),
        suite("plus tard, elles seront contestées."),
        ech(ctx, 7, "le procès-verbal est rédigé, avec ses DEUX mentions."),
        ech(ctx, 10, "il est communiqué aux organisations syndicales, qui peuvent le"),
        suite("signer, refuser de le signer, ou faire annexer leurs observations."),
        ech(ctx, 15, "DÉPÔT (L. 2242-5, R. 2242-1). Tant qu'il n'est pas établi, la"),
        suite("négociation est en cours et L. 2242-4 vous lie."),
        ech(ctx, 30, "le récépissé est au dossier."),
      ]));

      return L.concat(pied("L. 2242-4, L. 2242-5, L. 2242-6, L. 2242-8, L. 2242-14, " +
        "R. 2242-1 ; " + ARRETS.finDesNegociations.ref + " ; " + ARRETS.engagerNonConclure.ref,
        ["L'article D. 2231-2, auquel R. 2242-1 renvoie pour les conditions du dépôt,",
         "n'a PAS été lu à la source par ce module : il est nommé, et les modalités",
         "matérielles du dépôt ne sont ni décrites ni supposées ici.",
         "",
         "Aucune peine n'est annoncée pour le seul défaut de procès-verbal : aucun",
         "texte capté n'en attache à L. 2242-5. Ce qui est encouru est écrit ci-dessus",
         "— une négociation qui n'a pas pris fin, des mesures unilatérales fragiles, et",
         "pour l'égalité professionnelle dans les entreprises d'au moins trois cents",
         "salariés, l'impossibilité d'attester le défaut d'accord (L. 2242-8)."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     NAO-CTL-EGA-01 — LE PLAN D'ACTION ÉGALITÉ

     Fondement : L. 2242-3. Le texte est capté en entier et il donne le plan du
     document : évaluation de l'année écoulée d'abord, puis objectifs de
     progression, puis actions qualitatives et quantitatives, puis coût, puis
     dépôt. Cet ordre est celui du texte, et il n'est pas indifférent :
     l'évaluation est un préalable exprès.

     L. 2242-9, capté lui aussi, ouvre une porte que peu d'employeurs
     connaissent : demander à l'administration d'apprécier la conformité du
     plan, et lier son appréciation pour un an.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("NAO-CTL-EGA-01", {
    nom: "Le plan d'action annuel pour l'égalité professionnelle, et son dépôt",
    detail: "Le plan que L. 2242-3 impose à défaut d'accord : bilan de l'année " +
            "écoulée, objectifs de progression, actions chiffrées, coût, dépôt — " +
            "et la demande d'appréciation de conformité de L. 2242-9.",
    produire: function (ctx) {
      var n = negoDe(ctx, "egalite"), p = n.planAction || {};
      if (typeof p === "string") { try { p = JSON.parse(p); } catch (e) { p = {}; } }
      var an = aujourd(ctx).getFullYear();
      var L = entete(ctx, "Plan d'action annuel pour l'égalité professionnelle entre les femmes et les hommes",
        "article L. 2242-3 du code du travail");

      modeDEmploi(L, "le plan d'action annuel que la loi impose à défaut d'accord sur l'égalité professionnelle");

      L.push("════ QUAND CE PLAN EST DÛ, ET CE QU'IL DOIT PORTER ════");
      L.push("");
      citer(L, "L2242-3");
      L.push("Le texte est dense ; il se déplie en cinq obligations, dans cet ordre :");
      L.push("");
      L.push("  1. LE PLAN N'EST DÛ QU'EN L'ABSENCE D'ACCORD à l'issue de la");
      L.push("     négociation du 2° de L. 2242-1. Avec un accord, il n'a pas d'objet.");
      L.push("  2. L'ÉVALUATION DE L'ANNÉE ÉCOULÉE EST UN PRÉALABLE EXPRÈS : « après");
      L.push("     avoir évalué les objectifs fixés et les mesures prises au cours de");
      L.push("     l'année écoulée ». Un plan qui commence par l'année à venir saute");
      L.push("     une étape que le texte impose.");
      L.push("  3. LE PLAN EST FONDÉ SUR DES CRITÈRES CLAIRS, PRÉCIS ET OPÉRATIONNELS.");
      L.push("  4. IL DÉTERMINE LES OBJECTIFS DE PROGRESSION de l'année à venir,");
      L.push("     DÉFINIT les actions qualitatives et quantitatives permettant de les");
      L.push("     atteindre, et ÉVALUE LEUR COÛT. Trois verbes, trois obligations : un");
      L.push("     plan sans chiffrage du coût est incomplet au regard du texte.");
      L.push("  5. IL EST DÉPOSÉ auprès de l'autorité administrative. Un plan établi et");
      L.push("     non déposé ne remplit pas le texte.");
      L.push("");
      L.push("Et le dernier alinéa ajoute une obligation qui ne concerne pas ce plan");
      L.push("mais l'autre négociation : en l'absence d'accord prévoyant les mesures");
      L.push("visant à supprimer les écarts de rémunération, la négociation sur les");
      L.push("salaires effectifs porte également sur la programmation de ces mesures.");
      L.push("Le document du point NAO-CTL-PER-01 le reprend à son ordre du jour.");
      L.push("");

      L.push("════ CE QUE VOTRE DOSSIER DÉCLARE ════");
      L.push("");
      L.push("  · issue de la négociation égalité : " +
        (vide(n.issue) ? "[non renseignée]" : n.issue));
      L.push("  · plan d'action établi : " + etat(p.existe, "OUI", "NON"));
      L.push("  · plan d'action déposé : " + etat(p.depot, "OUI", "NON — le texte l'impose"));
      L.push("");
      if (n.issue === "accord") {
        L.push("  → Un accord est déclaré : le plan d'action de L. 2242-3 n'a pas d'objet");
        L.push("    tant que cet accord est en vigueur. Ce document vous sert alors de");
        L.push("    grille de relecture — et de modèle pour le jour où l'accord");
        L.push("    viendra à échéance sans être renouvelé.");
        L.push("");
      }

      L = L.concat(expositionL22428([], ctx));

      L.push(GROS);
      L.push("PLAN D'ACTION ANNUEL POUR L'ÉGALITÉ PROFESSIONNELLE ENTRE LES FEMMES");
      L.push("ET LES HOMMES");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push(adresseDe(ctx));
      L.push("Convention collective applicable : " + conventionDe(ctx));
      L.push("");
      L.push("Établi le " + leJour(aujourd(ctx)) + " en application de l'article L. 2242-3 du");
      L.push("code du travail, à défaut d'accord relatif à l'égalité professionnelle à");
      L.push("l'issue de la négociation mentionnée au 2° de l'article L. 2242-1.");
      L.push("");
      L.push("Période couverte : année " + (an + 1) + " [ou exercice à préciser].");
      L.push("");
      L.push("PARTIE I — L'ÉVALUATION DE L'ANNÉE ÉCOULÉE (le préalable exprès du texte)");
      L.push("");
      L.push("I.1. Les objectifs qui avaient été fixés pour " + an);
      L.push("");
      L.push("  objectif fixé                    │ indicateur │ cible │ atteint ?");
      L.push("  ─────────────────────────────────┼────────────┼───────┼───────────");
      for (var i = 0; i < 5; i++)
        L.push("  [.............................] │ [........] │ [...] │ [........]");
      L.push("");
      L.push("I.2. Les mesures qui avaient été prises");
      L.push("");
      L.push("  · [Mesure — mise en œuvre : oui / partiellement / non — commentaire]");
      L.push("  · [Mesure — mise en œuvre : oui / partiellement / non — commentaire]");
      L.push("  · [Mesure — mise en œuvre : oui / partiellement / non — commentaire]");
      L.push("");
      L.push("I.3. Les actions prévues et NON réalisées, et leurs explications");
      L.push("");
      L.push("  · [Action non réalisée — explication : ..........................]");
      L.push("  · [Action non réalisée — explication : ..........................]");
      L.push("");
      L.push("  [Ne sautez pas ce point. Une action annoncée l'an dernier et disparue");
      L.push("  cette année sans explication se remarque, et se retourne.]");
      L.push("");
      L.push("PARTIE II — LE DIAGNOSTIC, SUR DES CRITÈRES CLAIRS, PRÉCIS ET");
      L.push("OPÉRATIONNELS");
      L.push("");
      L.push("[Toutes les données ci-dessous sortent de la base de données économiques,");
      L.push("sociales et environnementales, de la déclaration sociale nominative et du");
      L.push("registre unique du personnel. L'application ne les connaît pas et ne les");
      L.push("invente pas : elle vous dit où les prendre.]");
      L.push("");
      L.push("  domaine                    │ femmes  │ hommes  │ écart │ source");
      L.push("  ───────────────────────────┼─────────┼─────────┼───────┼──────────");
      L.push("  Effectifs par catégorie    │ [.....] │ [.....] │ [...] │ [......]");
      L.push("  Embauches de l'exercice    │ [.....] │ [.....] │ [...] │ [......]");
      L.push("  Rémunération effective     │ [.....] │ [.....] │ [...] │ [......]");
      L.push("  Promotions                 │ [.....] │ [.....] │ [...] │ [......]");
      L.push("  Formation                  │ [.....] │ [.....] │ [...] │ [......]");
      L.push("  Temps partiel              │ [.....] │ [.....] │ [...] │ [......]");
      L.push("  Départs                    │ [.....] │ [.....] │ [...] │ [......]");
      L.push("");
      L.push("PARTIE III — LES OBJECTIFS DE PROGRESSION POUR L'ANNÉE À VENIR");
      L.push("");
      L.push("  objectif                         │ indicateur │ cible │ échéance");
      L.push("  ─────────────────────────────────┼────────────┼───────┼──────────");
      for (var j = 0; j < 5; j++)
        L.push("  [.............................] │ [........] │ [...] │ [......]");
      L.push("");
      L.push("  [Un objectif sans indicateur n'est pas opérationnel au sens du texte :");
      L.push("  personne, l'an prochain, ne pourra dire s'il a été atteint.]");
      L.push("");
      L.push("PARTIE IV — LES ACTIONS QUALITATIVES ET QUANTITATIVES, ET LEUR COÛT");
      L.push("");
      L.push("Le texte exige les trois : les actions, leur nature qualitative ou");
      L.push("quantitative, et l'évaluation de leur coût.");
      L.push("");
      L.push("  action                     │ objectif  │ pilote  │ échéance │ coût");
      L.push("  ───────────────────────────┼───────────┼─────────┼──────────┼───────");
      for (var m = 0; m < 7; m++)
        L.push("  [.......................] │ [.......] │ [.....] │ [......] │ [....]");
      L.push("");
      L.push("  COÛT TOTAL ESTIMÉ DU PLAN : [........] euros.");
      L.push("");
      L.push("  [Le coût s'évalue action par action, et il se totalise. Un plan qui");
      L.push("  annonce des actions sans chiffrage ne remplit pas le troisième verbe de");
      L.push("  L. 2242-3 — « évalue leur coût ».]");
      L.push("");
      L.push("PARTIE V — LE SUIVI");
      L.push("");
      L.push("[Modalités de suivi de la réalisation des objectifs et des mesures. Le");
      L.push("deuxième alinéa de L. 2242-8 renvoie leur fixation à un décret, qui n'a");
      L.push("pas été lu à la source par ce module : vérifiez-le avant d'arrêter vos");
      L.push("modalités. Prévoyez au minimum qui suit, à quelle fréquence, et sur quels");
      L.push("indicateurs.]");
      L.push("");
      L.push("PARTIE VI — LA PUBLICITÉ ET LE DÉPÔT");
      L.push("");
      L.push("Le présent plan est déposé auprès de l'autorité administrative,");
      L.push("conformément à l'article L. 2242-3.");
      L.push("");
      L.push("[Modalités de diffusion interne : à préciser. Le texte lu n'en impose");
      L.push("aucune ; le silence de la loi n'est pas une raison de ne rien faire.]");
      L.push("");
      L.push("Fait à " + villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("COURRIER — DÉPÔT DU PLAN D'ACTION");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx));
      L.push(adresseDe(ctx));
      L.push("");
      L.push("À l'autorité administrative compétente");
      L.push("[service compétent — coordonnées à vérifier]");
      L.push("");
      L.push(villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Objet : dépôt du plan d'action annuel pour l'égalité professionnelle");
      L.push("entre les femmes et les hommes (L. 2242-3)");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("La négociation sur l'égalité professionnelle entre les femmes et les");
      L.push("hommes et la qualité de vie et des conditions de travail, engagée le");
      L.push("[DATE] au sein de " + nomDe(ctx) + ", s'est achevée sans qu'un accord ait");
      L.push("été conclu.");
      L.push("");
      L.push("Conformément à l'article L. 2242-3 du code du travail, j'ai établi un plan");
      L.push("d'action annuel destiné à assurer l'égalité professionnelle entre les");
      L.push("femmes et les hommes. Après évaluation des objectifs fixés et des mesures");
      L.push("prises au cours de l'année écoulée, ce plan détermine les objectifs de");
      L.push("progression prévus pour l'année à venir, définit les actions qualitatives");
      L.push("et quantitatives permettant de les atteindre et évalue leur coût.");
      L.push("");
      L.push("Je procède à son dépôt et vous serais reconnaissant de bien vouloir m'en");
      L.push("délivrer récépissé.");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièces jointes : plan d'action annuel · [procès-verbal de désaccord, s'il");
      L.push("en a été établi un]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("LA PORTE QUE PEU D'EMPLOYEURS CONNAISSENT — L'ARTICLE L. 2242-9");
      L.push(GROS);
      L.push("");
      citer(L, "L2242-9");
      L.push("Ce que ce texte permet, et ce qu'il coûte :");
      L.push("");
      L.push("  · VOUS POUVEZ DEMANDER à l'autorité administrative d'apprécier la");
      L.push("    conformité de votre plan aux dispositions de L. 2242-8.");
      L.push("  · SI ELLE RÉPOND QUE LE PLAN EST CONFORME, cette réponse LA LIE pour");
      L.push("    l'application de la pénalité — pour un plan d'action, pendant la");
      L.push("    période comprise entre la date de réception de la réponse et le terme");
      L.push("    de la première année suivant le dépôt du plan.");
      L.push("  · LE SILENCE VAUT REJET, à l'issue d'un délai fixé par décret en Conseil");
      L.push("    d'État. Ce décret n'a pas été lu à la source par ce module : le délai");
      L.push("    n'est donc pas écrit ici.");
      L.push("  · LA DEMANDE N'EST PLUS RECEVABLE dès lors qu'un contrôle a été engagé.");
      L.push("    Demandez AVANT, pas pendant : c'est tout l'intérêt du dispositif.");
      L.push("");
      L = L.concat(courrierOS(ctx,
        "demande d'appréciation de la conformité du plan d'action à l'article L. 2242-8",
        ["En application de l'article L. 2242-9 du code du travail, aux termes duquel",
         "l'autorité administrative se prononce sur toute demande d'appréciation de la",
         "conformité d'un accord ou d'un plan d'action aux dispositions de l'article",
         "L. 2242-8 formulée par un employeur, je sollicite l'appréciation de la",
         "conformité du plan d'action annuel pour l'égalité professionnelle de",
         nomDe(ctx) + ", déposé le [DATE].",
         "",
         "Ce plan, ci-joint, évalue les objectifs fixés et les mesures prises au cours",
         "de l'année écoulée, détermine les objectifs de progression de l'année à",
         "venir, définit les actions qualitatives et quantitatives permettant de les",
         "atteindre et évalue leur coût.",
         "",
         "Je vous précise qu'aucun contrôle sur le respect des dispositions de",
         "l'article L. 2242-8 n'a été engagé à ma connaissance."],
        { a: "À l'autorité administrative compétente",
          a2: "[service compétent — coordonnées à vérifier]",
          appel: "Madame, Monsieur,",
          envoi: "Lettre recommandée avec demande d'avis de réception",
          formule: "Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération distinguée.",
          pj: ["plan d'action annuel déposé le [DATE]", "récépissé de dépôt"] }));

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous ouvrez l'évaluation de l'année écoulée : objectifs fixés,"),
        suite("mesures prises, actions non réalisées et leurs explications."),
        ech(ctx, 10, "le diagnostic chiffré est réuni — base de données, déclaration"),
        suite("sociale nominative, registre unique du personnel."),
        ech(ctx, 20, "les objectifs de progression sont arrêtés, avec leurs"),
        suite("indicateurs. Un objectif sans indicateur ne se suit pas."),
        ech(ctx, 27, "chaque action reçoit son pilote, son échéance et son coût."),
        ech(ctx, 30, "le plan est signé."),
        ech(ctx, 35, "DÉPÔT auprès de l'autorité administrative (L. 2242-3). Un plan"),
        suite("non déposé ne couvre pas l'entreprise."),
        ech(ctx, 45, "le récépissé est au dossier, et la demande d'appréciation de"),
        suite("conformité de L. 2242-9 peut partir — avant tout contrôle."),
        ech(ctx, 365, "le plan est annuel : l'évaluation de cette année-ci sera le"),
        suite("préalable du plan suivant. Ouvrez le suivi dès maintenant."),
      ]));

      return L.concat(pied("L. 2242-1, L. 2242-3, L. 2242-8, L. 2242-9, L. 2242-17",
        ["Les articles L. 1142-8 et L. 1142-9, nommés par L. 2242-8, et les décrets",
         "auxquels L. 2242-8 et L. 2242-9 renvoient, n'ont PAS été lus à la source par",
         "ce module : ni les indicateurs, ni les délais, ni les modalités de suivi ne",
         "sont décrits ici. Ils sont nommés, et il faut les vérifier."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     NAO-CTL-EGA-02 — LA COUVERTURE ET LA PUBLICATION DES ÉCARTS

     Fondement : L. 2242-8. Ce texte est capté ; L. 1142-8 et L. 1142-9, qu'il
     nomme, NE LE SONT PAS.

     Conséquence tenue dans tout le document : l'index est NOMMÉ, jamais
     décrit. Ni ses indicateurs, ni sa date de publication, ni le seuil de
     résultat qui déclenche les mesures de correction ne sont écrits — la fiche
     de régularisation évoque « au plus tard le 1er mars » et un « seuil
     réglementaire », mais aucun texte lu ne les porte.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("NAO-CTL-EGA-02", {
    nom: "La couverture égalité et la publication des écarts de rémunération",
    detail: "Le constat de couverture — accord ou plan d'action —, la note de " +
            "publication des informations de L. 1142-8, l'information du comité " +
            "social et économique et le suivi des mesures de correction.",
    produire: function (ctx) {
      var n = negoDe(ctx, "egalite"), p = n.planAction || {};
      if (typeof p === "string") { try { p = JSON.parse(p); } catch (e) { p = {}; } }
      var eff = effectifDe(ctx);
      var index = F(ctx).indexEgalitePublie;
      var couvert = n.issue === "accord" || estOui(p.existe);
      var L = entete(ctx, "Couverture égalité professionnelle et publication des écarts de rémunération",
        "article L. 2242-8 du code du travail");

      modeDEmploi(L, "le constat de couverture et la note de publication des écarts de rémunération");

      L = L.concat(expositionL22428([], ctx));

      L.push("════ CE QUE VOTRE DOSSIER DÉCLARE ════");
      L.push("");
      L.push("  · effectif : " + (eff === null ? "[NON RENSEIGNÉ]" : eff + " salariés"));
      L.push("  · issue de la négociation égalité : " +
        (vide(n.issue) ? "[non renseignée]" : n.issue));
      L.push("  · plan d'action établi : " + etat(p.existe, "OUI", "non"));
      L.push("  · couverture par un accord ou un plan : " +
        (couvert ? "ACQUISE en l'état des déclarations" : "NON ÉTABLIE"));
      L.push("  · informations de L. 1142-8 publiées : " + etat(index, "OUI", "NON"));
      L.push("");
      if (eff !== null && eff < 50) {
        L.push("  → Effectif de " + eff + " salariés : la pénalité de L. 2242-8 vise les");
        L.push("    entreprises d'au moins cinquante salariés. Elle n'est pas encourue en");
        L.push("    l'état — mais l'obligation de négocier, elle, ne dépend pas de");
        L.push("    l'effectif : elle naît des sections syndicales (L. 2242-1).");
        L.push("");
      }
      if (!couvert) {
        L.push("  → LA COUVERTURE N'EST PAS ÉTABLIE. C'est le premier manquement que");
        L.push("    L. 2242-8 vise, et il se répare d'une seule façon : un accord, ou un");
        L.push("    plan d'action. Le document du point NAO-CTL-EGA-01 rédige le plan.");
        L.push("");
      }
      if (estNon(index)) {
        L.push("  → LES INFORMATIONS DE L. 1142-8 NE SONT PAS PUBLIÉES. Le quatrième");
        L.push("    alinéa de L. 2242-8 permet d'appliquer la pénalité à ce SEUL titre :");
        L.push("    une entreprise couverte par un accord parfait mais qui ne publie pas");
        L.push("    reste exposée.");
        L.push("");
      }

      L.push("════ CE QUE CE DOCUMENT NE VOUS DIRA PAS, ET POURQUOI ════");
      L.push("");
      L.push("L'article L. 1142-8 est NOMMÉ par L. 2242-8, mais il n'a pas été lu à la");
      L.push("source par ce module. Il en va de même de L. 1142-9, qui porte les mesures");
      L.push("de correction. En conséquence, et délibérément, ce document N'ÉCRIT PAS :");
      L.push("");
      L.push("  · quels indicateurs composent la publication ;");
      L.push("  · comment ils se calculent ;");
      L.push("  · à quelle date au plus tard la publication doit intervenir ;");
      L.push("  · quel niveau de résultat déclenche les mesures de correction ;");
      L.push("  · dans quel délai ces mesures doivent produire effet.");
      L.push("");
      L.push("Une application qui vous donnerait ces cinq réponses de mémoire vous");
      L.push("ferait publier sur des règles qu'elle n'a pas vérifiées. Allez les lire à");
      L.push("la source — ce sont cinq questions, et elles ont des réponses écrites.");
      L.push("");
      L.push("Ce que ce document fait, en revanche : il monte la pièce qui prouve que");
      L.push("vous avez publié, et quand.");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — LE CONSTAT DE COUVERTURE");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push(adresseDe(ctx));
      L.push("");
      L.push("CONSTAT DE COUVERTURE AU REGARD DE L'ARTICLE L. 2242-8 — " +
        leJour(aujourd(ctx)));
      L.push("");
      L.push("Effectif de l'entreprise : " +
        (eff === null ? "[.......]" : eff) + " salariés, établi par [relevé d'effectif");
      L.push("mensuel / déclarations sociales nominatives de la période].");
      L.push("");
      L.push("L'entreprise est couverte par :");
      L.push("");
      L.push("  [ ] un accord relatif à l'égalité professionnelle entre les femmes et");
      L.push("      les hommes, conclu le .............., déposé le ..............,");
      L.push("      en vigueur jusqu'au .............. ;");
      L.push("");
      L.push("  [ ] à défaut d'accord, un plan d'action annuel établi en application de");
      L.push("      l'article L. 2242-3, établi le .............. et déposé auprès de");
      L.push("      l'autorité administrative le .............. ;");
      L.push("");
      L.push("  [ ] AUCUN DES DEUX — situation à régulariser sans délai : c'est le");
      L.push("      premier manquement que L. 2242-8 vise.");
      L.push("");
      L.push("Dans une entreprise d'au moins trois cents salariés, le défaut d'accord");
      L.push("est attesté par un procès-verbal de désaccord (L. 2242-8, troisième");
      L.push("alinéa) : [procès-verbal établi le .............., déposé le ...........].");
      L.push("");
      L.push("Publication des informations prévues à l'article L. 1142-8 :");
      L.push("  [ ] effectuée le .............., sur [adresse du site internet /");
      L.push("      autre modalité : ..............................] ;");
      L.push("  [ ] non effectuée — le quatrième alinéa de L. 2242-8 permet d'appliquer");
      L.push("      la pénalité à ce seul titre.");
      L.push("");
      L.push("Mesures définies dans les conditions prévues à l'article L. 1142-9, si");
      L.push("elles sont dues : [définies le .............. / sans objet / non");
      L.push("définies]. Ce module n'a pas lu L. 1142-9 : c'est à la source qu'il faut");
      L.push("vérifier si elles vous sont dues, et lesquelles.");
      L.push("");
      L.push("Fait à " + villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — LA NOTE DE PUBLICATION ET SA PREUVE");
      L.push(GROS);
      L.push("");
      L.push("Publier ne suffit pas : il faut pouvoir établir QUOI a été publié, OÙ, et");
      L.push("À QUELLE DATE. Cette note est la pièce qui l'établit.");
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push("");
      L.push("PUBLICATION DES INFORMATIONS PRÉVUES À L'ARTICLE L. 1142-8 DU CODE DU");
      L.push("TRAVAIL");
      L.push("");
      L.push("  · Période de référence retenue : [..........................]");
      L.push("  · Date de publication : [..........................]");
      L.push("  · Support : [adresse exacte de la page du site internet de l'entreprise");
      L.push("    / à défaut de site, modalité retenue pour porter le résultat à la");
      L.push("    connaissance des salariés : ..............................]");
      L.push("  · Contenu publié : [reprendre exactement ce qui a été mis en ligne. Ce");
      L.push("    module n'ayant pas lu L. 1142-8, il ne préjuge ni du nombre");
      L.push("    d'indicateurs, ni de leur intitulé, ni de leur mode de calcul.]");
      L.push("  · Preuve conservée : [capture d'écran datée / constat / attestation du");
      L.push("    prestataire du site — et son horodatage.]");
      L.push("  · Déclaration à l'administration : [effectuée le .............., par");
      L.push("    ..............................]");
      L.push("  · Information du comité social et économique : [le .............. —");
      L.push("    joindre l'extrait du procès-verbal de la réunion.]");
      L.push("");
      L.push("Si le résultat appelle des mesures au titre de l'article L. 1142-9 :");
      L.push("  · [mesures définies, calendrier, et modalités de leur suivi]");
      L.push("  · [Vérifiez à la source ce que L. 1142-9 exige : ce module ne l'a pas");
      L.push("    lu, et une mesure inventée ne vaut pas mieux qu'une mesure absente.]");
      L.push("");
      L.push("Fait à " + villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L = L.concat(courrierOS(ctx,
        "publication des informations relatives aux écarts de rémunération entre les femmes et les hommes",
        ["Je vous informe que les informations prévues à l'article L. 1142-8 du code",
         "du travail ont été publiées le [DATE], sur [support].",
         "",
         "Le résultat obtenu et le détail de sa composition figurent en pièce jointe.",
         "",
         "[Le cas échéant :] Ce résultat appelle la définition de mesures dans les",
         "conditions prévues à l'article L. 1142-9. Ces mesures vous seront soumises",
         "lors de la réunion du [DATE], et la négociation sur l'égalité",
         "professionnelle en traitera au titre du 2° de l'article L. 2242-17 —",
         "suppression des écarts de rémunération.",
         "",
         "Je vous rappelle que l'entreprise est couverte par [l'accord d'égalité",
         "professionnelle du .......... / le plan d'action annuel déposé le ..........].",
         "",
         "Copie de la présente est adressée aux membres du comité social et",
         "économique."],
        { pj: ["détail des informations publiées",
               "preuve de publication, datée"] }));

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous établissez le constat de couverture : accord, plan"),
        suite("d'action, ou ni l'un ni l'autre. Ce constat se signe."),
        ech(ctx, 3, "si la couverture manque, la négociation ou le plan d'action"),
        suite("s'ouvre immédiatement (documents NAO-CTL-PER-02 et NAO-CTL-EGA-01)."),
        ech(ctx, 7, "vous allez lire à la source les articles L. 1142-8 et L. 1142-9 :"),
        suite("indicateurs, mode de calcul, date limite de publication, seuil de"),
        suite("résultat. Ce module ne les a pas lus et ne les invente pas."),
        ech(ctx, 30, "calcul des indicateurs sur la période de référence retenue."),
        ech(ctx, 40, "publication, et preuve horodatée versée au dossier."),
        ech(ctx, 45, "déclaration à l'administration et information du comité social"),
        suite("et économique — l'extrait de procès-verbal fait la preuve."),
        ech(ctx, 60, "si des mesures de correction sont dues, elles sont définies et"),
        suite("calendrées : leur absence est un manquement distinct."),
      ]));

      return L.concat(pied("L. 2242-1, L. 2242-3, L. 2242-8, L. 2242-9, L. 2242-17",
        ["Les articles L. 1142-8 et L. 1142-9 sont NOMMÉS parce que L. 2242-8 les",
         "nomme. Ils n'ont PAS été lus à la source par ce module : ni les indicateurs,",
         "ni leur calcul, ni la date limite de publication, ni le seuil de résultat qui",
         "déclenche les mesures de correction ne figurent dans ce document. Toute",
         "affirmation sur ces cinq points doit être vérifiée à la source."])).join("\n");
    },
  });

})(typeof window !== "undefined" ? window : this);
