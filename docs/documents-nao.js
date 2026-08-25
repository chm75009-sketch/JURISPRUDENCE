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
    var mots = String(t == null ? "" : t).split(/\s+/).filter(Boolean);
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

      L = L.concat(expositionL22431(L2 = []));
      L = L.concat(expositionL22427([]));

      L = destinataires(L);

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

})(typeof window !== "undefined" ? window : this);
