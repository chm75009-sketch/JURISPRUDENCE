/* Les parcours guidés — moteur de la page docs/parcours.html.

   Un parcours, c'est trois choses et rien d'autre :
     — un PRÉALABLE : la liste de ce qu'il faut avoir réuni avant de commencer,
       cochable, et dont ce qui reste décoché est repris nommément ;
     — des ÉTAPES ordonnées, chacune fondée sur un article lu à la source
       (numéro ET identifiant de version), datée quand les dates du dossier le
       permettent, et reliée au modèle de document qui la matérialise ;
     — un ÉTAT, écrit dans le stockage local du poste, qui répond à la seule
       question qui compte à la réouverture : j'en suis où.

   RÈGLE TENUE ICI : rien n'est affirmé qui n'ait été lu. Les 166 articles cités
   viennent de moteur/parcours/textes-parcours.json — capture du 21 août 2026,
   120 articles — et de moteur/parcours/textes-installation.json — capture du
   22 août 2026, 75 articles dont 46 nouveaux, les 29 autres redemandés sans un
   seul écart d'identifiant de version. Chacun a été lu deux fois au moins,
   requêtes espacées, filtre par NOM du code et critère de contenu ; une lecture
   « élargie » — filtre relâché par le relais — est écartée comme une réponse
   relaxée de Judilibre. Les 24 arrêts viennent de
   moteur/parcours/jurisprudence-parcours.json et de
   moteur/parcours/jurisprudence-installation.json — API Judilibre, recherche
   par numéro de pourvoi, aucune réponse relaxée retenue.
   Le conventionnel n'est JAMAIS affirmé : il est signalé.

   CE QUI N'A PAS ÉTÉ TROUVÉ, ET QUI N'EST DONC PAS AFFIRMÉ : aucun article du
   code du travail lu au relais n'organise la remise-reprise entre un comité
   social et économique sortant et le comité entrant. L'article R. 2323-38, qui
   l'imposait au comité d'entreprise, répond « trouvé : faux ». Le parcours
   d'installation le dit à l'étape i10 et renvoie au règlement intérieur du
   comité (art. L. 2315-24) plutôt que d'inventer une règle.  */
"use strict";
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var AUJOURDHUI = new Date().toISOString().slice(0, 10);

  function e(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function refArt(n) { return n.replace(/^([LRD])(\d)/, "$1. $2"); }
  function dateFr(iso) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
    return new Date(iso + "T12:00:00").toLocaleDateString("fr-FR",
      { day: "numeric", month: "long", year: "numeric" });
  }
  function joursEntre(a, b) {
    if (!a || !b) return null;
    return Math.round((new Date(b + "T12:00:00") - new Date(a + "T12:00:00")) / 86400000);
  }
  function jours(iso, n) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(iso || ""))) return null;
    var d = new Date(iso + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }
  /* Le même quantième, n mois plus tard : la règle de comptage que R. 1332-3
     énonce pour le délai d'un mois de L. 1332-2 — à défaut de quantième
     identique, le dernier jour du mois. */
  function moisApres(iso, n) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(iso || ""))) return null;
    var m = iso.split("-").map(Number),
        an = m[0] + Math.floor((m[1] - 1 + n) / 12),
        mo = ((m[1] - 1 + n) % 12) + 1,
        dernier = new Date(Date.UTC(an, mo, 0)).getUTCDate(),
        j = Math.min(m[2], dernier);
    return an + "-" + String(mo).padStart(2, "0") + "-" + String(j).padStart(2, "0");
  }
  /* Les jours ouvrables : tous les jours sauf le dimanche. Cette page ne tient
     pas le calendrier des jours fériés — elle le dit là où le résultat est
     serré, plutôt que de faire croire à une précision qu'elle n'a pas. */
  function joursOuvrablesApres(iso, n) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(iso || ""))) return null;
    var d = new Date(iso + "T12:00:00Z"), c = 0;
    while (c < n) { d.setUTCDate(d.getUTCDate() + 1); if (d.getUTCDay() !== 0) c++; }
    return d.toISOString().slice(0, 10);
  }


  var TEXTES = {
    "L1331-1": { id: "LEGIARTI000006901445", quoi: "constitue une sanction toute mesure, autre que les observations verbales, prise à la suite d'un agissement considéré comme fautif, qu'elle affecte ou non immédiatement la présence, la fonction, la carrière ou la rémunération" },
    "L1331-2": { id: "LEGIARTI000006901446", quoi: "les amendes et autres sanctions pécuniaires sont interdites ; toute stipulation contraire est réputée non écrite" },
    "L1332-1": { id: "LEGIARTI000006901447", quoi: "aucune sanction sans que le salarié soit informé, dans le même temps et par écrit, des griefs retenus contre lui" },
    "L1332-2": { id: "LEGIARTI000025560074", quoi: "convocation en précisant l'objet, sauf avertissement sans incidence ; assistance par une personne du personnel ; motif indiqué et explications recueillies ; la sanction ne peut intervenir moins de deux jours ouvrables ni plus d'un mois après le jour fixé pour l'entretien ; elle est motivée et notifiée" },
    "L1332-3": { id: "LEGIARTI000006901449", quoi: "mise à pied conservatoire : aucune sanction définitive sans que la procédure de L. 1332-2 ait été observée" },
    "L1332-4": { id: "LEGIARTI000006901450", quoi: "aucun fait fautif ne peut donner lieu à lui seul à l'engagement de poursuites disciplinaires au-delà de deux mois à compter du jour où l'employeur en a eu connaissance, à moins que ce fait ait donné lieu dans le même délai à des poursuites pénales" },
    "L1332-5": { id: "LEGIARTI000006901451", quoi: "aucune sanction antérieure de plus de trois ans à l'engagement des poursuites ne peut être invoquée à l'appui d'une nouvelle sanction" },
    "R1332-1": { id: "LEGIARTI000018536889", quoi: "la lettre de convocation indique l'objet de l'entretien, précise la date, l'heure et le lieu, rappelle le droit d'être assisté par une personne du personnel, et est remise contre récépissé ou adressée par lettre recommandée dans le délai de deux mois de L. 1332-4" },
    "R1332-2": { id: "LEGIARTI000018536887", quoi: "la sanction fait l'objet d'une décision écrite et motivée, notifiée contre récépissé ou par lettre recommandée dans le délai d'un mois de L. 1332-2" },
    "R1332-3": { id: "LEGIARTI000018536885", quoi: "le délai d'un mois expire à vingt-quatre heures le jour du mois suivant portant le même quantième que le jour fixé pour l'entretien ; à défaut de quantième identique, le dernier jour du mois ; prorogation au premier jour ouvrable si le terme tombe un samedi, un dimanche ou un jour férié ou chômé" },
    "L1333-1": { id: "LEGIARTI000006901453", quoi: "le conseil de prud'hommes apprécie la régularité de la procédure suivie et si les faits sont de nature à justifier une sanction ; le doute profite au salarié" },
    "L1333-2": { id: "LEGIARTI000006901454", quoi: "le conseil de prud'hommes peut annuler une sanction irrégulière en la forme, injustifiée ou disproportionnée à la faute commise" },
    "L1311-2": { id: "LEGIARTI000038610176", quoi: "l'établissement d'un règlement intérieur est obligatoire dans les entreprises ou établissements employant au moins cinquante salariés" },
    "L1321-1": { id: "LEGIARTI000006901432", quoi: "l'employeur y fixe exclusivement les mesures de santé et de sécurité, les conditions de participation au rétablissement de conditions protectrices, et les règles générales et permanentes de discipline, notamment la nature et l'échelle des sanctions" },
    "L1321-2": { id: "LEGIARTI000045391757", quoi: "le règlement intérieur rappelle les droits de la défense des articles L. 1332-1 à L. 1332-3 ou de la convention collective, les dispositions sur les harcèlements et les agissements sexistes, et l'existence du dispositif de protection des lanceurs d'alerte" },
    "L1321-2-1": { id: "LEGIARTI000033001625", quoi: "il peut inscrire le principe de neutralité et restreindre la manifestation des convictions si ces restrictions sont justifiées et proportionnées" },
    "L1321-3": { id: "LEGIARTI000033975667", quoi: "il ne peut contenir de dispositions contraires aux lois, règlements, conventions et accords, ni de restrictions non justifiées ou disproportionnées, ni de dispositions discriminatoires" },
    "L1321-4": { id: "LEGIARTI000054140230", quoi: "il ne peut être introduit qu'après avis du comité social et économique ; il indique sa date d'entrée en vigueur, postérieure d'un mois à l'accomplissement des formalités de publicité ; il est communiqué à l'inspecteur du travail avec l'avis du comité ; mêmes règles en cas de modification ou de retrait" },
    "L1321-5": { id: "LEGIARTI000035653093", quoi: "les notes de service et tout document portant des obligations générales et permanentes dans les matières de L. 1321-1 et L. 1321-2 sont considérés comme des adjonctions au règlement intérieur et soumis aux mêmes règles ; lorsque l'urgence le justifie, les obligations de santé et de sécurité peuvent recevoir application immédiate, à charge de les communiquer aussitôt au secrétaire du comité et à l'inspection du travail" },
    "L1321-6": { id: "LEGIARTI000006901439", quoi: "le règlement intérieur est rédigé en français ; il peut être accompagné de traductions" },
    "L1322-1": { id: "LEGIARTI000006901440", quoi: "l'inspecteur du travail peut à tout moment exiger le retrait ou la modification des dispositions contraires aux articles L. 1321-1 à L. 1321-3 et L. 1321-6" },
    "L1322-2": { id: "LEGIARTI000035653123", quoi: "la décision de l'inspecteur du travail est motivée, notifiée à l'employeur et communiquée pour information aux membres du comité social et économique" },
    "L1322-3": { id: "LEGIARTI000035653120", quoi: "la décision de l'inspecteur du travail peut faire l'objet d'un recours hiérarchique" },
    "R1321-1": { id: "LEGIARTI000033292501", quoi: "le règlement intérieur est porté par tout moyen à la connaissance des personnes ayant accès aux lieux de travail ou aux locaux où se fait l'embauche" },
    "R1321-2": { id: "LEGIARTI000018536915", quoi: "le règlement intérieur est déposé au greffe du conseil de prud'hommes du ressort de l'entreprise ou de l'établissement" },
    "R1321-3": { id: "LEGIARTI000018536913", quoi: "le délai d'un mois de L. 1321-4 court à compter de la dernière en date des formalités de publicité et de dépôt de R. 1321-1 et R. 1321-2" },
    "R1321-4": { id: "LEGIARTI000018536911", quoi: "le texte du règlement intérieur est transmis à l'inspecteur du travail en deux exemplaires" },
    "R1321-5": { id: "LEGIARTI000041455669", quoi: "l'obligation de L. 1311-2 s'applique au terme d'un délai de douze mois à compter de la date à laquelle le seuil de cinquante salariés a été atteint pendant douze mois consécutifs" },
    "L2312-5": { id: "LEGIARTI000043893930", quoi: "la délégation du personnel présente à l'employeur les réclamations individuelles ou collectives" },
    "L2312-8": { id: "LEGIARTI000043975196", quoi: "le comité assure une expression collective des salariés et est informé et consulté sur les questions intéressant l'organisation, la gestion et la marche générale de l'entreprise" },
    "L2312-14": { id: "LEGIARTI000036262404", quoi: "les décisions de l'employeur sont précédées de la consultation du comité" },
    "L2312-15": { id: "LEGIARTI000038791194", quoi: "le comité émet des avis et des vœux ; il dispose d'un délai d'examen suffisant et d'informations précises et écrites ; l'employeur rend compte, en la motivant, de la suite donnée" },
    "L2312-16": { id: "LEGIARTI000035609780", quoi: "l'accord ou, à défaut, un décret fixe les délais dans lesquels les avis sont rendus ; à l'expiration, le comité est réputé consulté et avoir rendu un avis négatif" },
    "L2312-22": { id: "LEGIARTI000043975191", quoi: "à défaut d'accord, le comité est consulté chaque année sur les orientations stratégiques, la situation économique et financière, la politique sociale" },
    "R2312-6": { id: "LEGIARTI000036411558", quoi: "à défaut d'accord, le comité est réputé consulté et avoir rendu un avis négatif à l'expiration d'un mois ; deux mois en cas d'expertise ; trois mois en cas d'expertises au niveau central et d'établissement" },
    "L2315-22": { id: "LEGIARTI000035624430", quoi: "note écrite deux jours ouvrables avant la réunion ; réponse écrite motivée au plus tard dans les six jours ouvrables suivant la réunion ; transcription au registre" },
    "L2315-27": { id: "LEGIARTI000036761943", quoi: "au moins quatre réunions par an portent, en tout ou partie, sur la santé, la sécurité et les conditions de travail" },
    "L2315-28": { id: "LEGIARTI000035624857", quoi: "à défaut d'accord, réunion au moins mensuelle à partir de trois cents salariés, au moins tous les deux mois en dessous ; seconde réunion à la demande de la majorité des membres" },
    "L2315-29": { id: "LEGIARTI000035624861", quoi: "l'ordre du jour est établi par le président et le secrétaire ; les consultations rendues obligatoires par un texte ou un accord y sont inscrites de plein droit par l'un ou l'autre" },
    "L2315-30": { id: "LEGIARTI000035624863", quoi: "l'ordre du jour est communiqué par le président aux membres, à l'agent de contrôle de l'inspection du travail et à l'agent des services de prévention, trois jours au moins avant la réunion" },
    "L2315-31": { id: "LEGIARTI000035624865", quoi: "lorsque le comité se réunit à la demande de la majorité de ses membres, les questions jointes à la demande sont inscrites à l'ordre du jour" },
    "L2315-32": { id: "LEGIARTI000035624869", quoi: "les résolutions du comité sont prises à la majorité des membres présents" },
    "L2315-34": { id: "LEGIARTI000036262447", quoi: "les délibérations sont consignées dans un procès-verbal établi par le secrétaire dans un délai fixé par accord ou, à défaut, par décret ; transmis à l'employeur, qui fait connaître sa décision motivée à la réunion suivante" },
    "L2315-35": { id: "LEGIARTI000035624877", quoi: "le procès-verbal peut, après adoption, être affiché ou diffusé par le secrétaire" },
    "D2315-26": { id: "LEGIARTI000036433681", quoi: "à défaut d'accord, le procès-verbal est établi et transmis à l'employeur dans les quinze jours suivant la réunion (trois jours dans la consultation de L. 1233-30, un jour en redressement ou liquidation)" },
    "L2315-36": { id: "LEGIARTI000035626455", quoi: "une commission santé, sécurité et conditions de travail est créée dans les entreprises et les établissements distincts d'au moins trois cents salariés, et dans les établissements de L. 4521-1" },
    "L2315-37": { id: "LEGIARTI000036262445", quoi: "en deçà de trois cents salariés, l'inspecteur du travail peut imposer la création d'une commission santé, sécurité et conditions de travail" },
    "L2315-38": { id: "LEGIARTI000035626459", quoi: "la commission se voit confier, par délégation du comité, tout ou partie des attributions relatives à la santé, à la sécurité et aux conditions de travail, à l'exception du recours à un expert et des attributions consultatives du comité" },
    "L2315-39": { id: "LEGIARTI000036262434", quoi: "la commission est présidée par l'employeur ; au minimum trois membres représentants du personnel, dont au moins un du second collège ou, le cas échéant, du troisième ; désignés par le comité parmi ses membres, par une résolution adoptée selon L. 2315-32, pour une durée qui prend fin avec le mandat des élus" },
    "L2315-41": { id: "LEGIARTI000035626467", quoi: "l'accord d'entreprise de L. 2313-2 fixe les modalités de mise en place : nombre de membres, missions déléguées, fonctionnement et heures de délégation, formation, moyens, formation spécifique" },
    "L2315-42": { id: "LEGIARTI000035626469", quoi: "en l'absence de délégué syndical, un accord entre l'employeur et le comité, adopté à la majorité des titulaires, fixe ces mêmes modalités" },
    "L2315-43": { id: "LEGIARTI000035626471", quoi: "en dehors des cas de L. 2315-36 et L. 2315-37, l'accord peut fixer le nombre et le périmètre des commissions et définir les mêmes modalités" },
    "L2315-44": { id: "LEGIARTI000036262426", quoi: "à défaut d'accord, le règlement intérieur du comité définit ces modalités ; à défaut de l'accord de L. 2315-43, l'employeur peut fixer le nombre et le périmètre des commissions" },
    "L2315-44-1": { id: "LEGIARTI000036760263", quoi: "une commission des marchés est créée au sein du comité qui dépasse, pour au moins deux des trois critères du II de L. 2315-64, des seuils fixés par décret" },
    "L2315-44-2": { id: "LEGIARTI000036760270", quoi: "au-delà d'un seuil fixé par décret, le comité détermine, sur proposition de la commission, les critères de choix des fournisseurs et la procédure d'achat ; la commission choisit les fournisseurs et rend compte au moins une fois par an au comité" },
    "L2315-44-3": { id: "LEGIARTI000036760281", quoi: "les membres de la commission des marchés sont désignés parmi les membres titulaires ; le règlement intérieur du comité fixe le fonctionnement, le nombre de membres, les modalités de désignation et la durée du mandat" },
    "L2315-45": { id: "LEGIARTI000036262551", quoi: "un accord d'entreprise conclu dans les conditions du premier alinéa de L. 2232-12 peut prévoir des commissions supplémentaires ; les rapports des commissions sont soumis à la délibération du comité" },
    "L2315-46": { id: "LEGIARTI000035626485", quoi: "à défaut d'accord de L. 2315-45, une commission économique est créée dans les entreprises d'au moins mille salariés" },
    "L2315-47": { id: "LEGIARTI000035626487", quoi: "la commission économique est présidée par l'employeur ; au maximum cinq membres représentants du personnel, dont au moins un de la catégorie des cadres, désignés par le comité parmi ses membres" },
    "L2315-48": { id: "LEGIARTI000035626489", quoi: "la commission économique se réunit au moins deux fois par an ; elle peut demander à entendre tout cadre supérieur ou dirigeant après accord de l'employeur" },
    "L2315-49": { id: "LEGIARTI000035626493", quoi: "à défaut d'accord de L. 2315-45, une commission de la formation est constituée dans les entreprises d'au moins trois cents salariés" },
    "L2315-50": { id: "LEGIARTI000035626497", quoi: "à défaut d'accord de L. 2315-45, une commission d'information et d'aide au logement est créée dans les entreprises d'au moins trois cents salariés" },
    "L2315-51": { id: "LEGIARTI000035626499", quoi: "la commission logement recherche les offres de logement correspondant aux besoins et informe les salariés sur l'accès à la propriété ou à la location" },
    "L2315-52": { id: "LEGIARTI000035626501", quoi: "la commission logement aide les salariés au titre de la participation des employeurs à l'effort de construction" },
    "L2315-53": { id: "LEGIARTI000035626503", quoi: "la commission logement peut s'adjoindre, avec l'accord de l'employeur et à titre consultatif, des conseillers" },
    "L2315-56": { id: "LEGIARTI000036262545", quoi: "à défaut d'accord de L. 2315-45, une commission de l'égalité professionnelle est créée dans les entreprises d'au moins trois cents salariés" },
    "D2315-29": { id: "LEGIARTI000037538198", quoi: "seuils de la commission des marchés : cinquante salariés à la clôture d'un exercice, montant de ressources annuelles et total du bilan de R. 612-1 du code de commerce ; le seuil de L. 2315-44-2 est fixé à 30 000 euros" },
    "L2315-18": { id: "LEGIARTI000043894249", quoi: "formation santé, sécurité et conditions de travail : cinq jours au moins lors du premier mandat ; en cas de renouvellement, trois jours pour chaque élu et cinq jours pour les membres de la commission dans les entreprises d'au moins trois cents salariés ; financement à la charge de l'employeur" },
    "L2314-33": { id: "LEGIARTI000052437191", quoi: "les membres de la délégation du personnel sont élus pour quatre ans ; l'article énumère les cas de fin anticipée du mandat" },
    "L2315-78": { id: "LEGIARTI000036262525", quoi: "le comité peut, le cas échéant sur proposition des commissions constituées en son sein, décider de recourir à un expert-comptable ou à un expert habilité" },
    "L2315-79": { id: "LEGIARTI000035628315", quoi: "un accord détermine le nombre d'expertises dans le cadre des consultations récurrentes sur une ou plusieurs années" },
    "L2315-80": { id: "LEGIARTI000036761908", quoi: "prise en charge des frais d'expertise : par l'employeur dans les cas énumérés ; 20 % par le comité sur son budget de fonctionnement et 80 % par l'employeur pour la consultation de L. 2315-87 et les consultations ponctuelles ; par l'employeur si le budget de fonctionnement est insuffisant" },
    "L2315-81": { id: "LEGIARTI000036262523", quoi: "par dérogation, le comité peut faire appel à tout type d'expertise rémunérée par ses soins pour la préparation de ses travaux" },
    "L2315-87": { id: "LEGIARTI000036262509", quoi: "le comité peut décider de recourir à un expert-comptable en vue de la consultation sur les orientations stratégiques" },
    "L2315-88": { id: "LEGIARTI000036262505", quoi: "le comité peut décider de recourir à un expert-comptable en vue de la consultation sur la situation économique et financière" },
    "L2315-94": { id: "LEGIARTI000043975185", quoi: "le comité peut faire appel à un expert habilité en cas de risque grave identifié et actuel, en cas d'introduction de nouvelles technologies ou de projet important, et, à partir de trois cents salariés, pour préparer la négociation sur l'égalité professionnelle" },
    "R2315-45": { id: "LEGIARTI000036434273", quoi: "l'expert demande à l'employeur, au plus tard dans les trois jours de sa désignation, les informations complémentaires nécessaires ; l'employeur répond dans les cinq jours" },
    "R2315-46": { id: "LEGIARTI000036434275", quoi: "l'expert notifie à l'employeur le coût prévisionnel, l'étendue et la durée de l'expertise dans un délai de dix jours à compter de sa désignation" },
    "L4131-1": { id: "LEGIARTI000006903155", quoi: "le travailleur alerte immédiatement l'employeur de toute situation de travail dont il a un motif raisonnable de penser qu'elle présente un danger grave et imminent" },
    "L4131-2": { id: "LEGIARTI000035653297", quoi: "le représentant du personnel au comité qui constate une cause de danger grave et imminent en alerte immédiatement l'employeur selon la procédure de L. 4132-2" },
    "L4132-2": { id: "LEGIARTI000035653288", quoi: "le représentant consigne son avis par écrit ; l'employeur procède immédiatement à une enquête avec lui et prend les dispositions nécessaires pour y remédier" },
    "D4132-1": { id: "LEGIARTI000036484010", quoi: "l'avis est consigné sur un registre spécial coté et authentifié, daté et signé, indiquant les postes concernés, la nature et la cause du danger, le nom des travailleurs exposés" },
    "L2312-59": { id: "LEGIARTI000038791189", quoi: "atteinte aux droits des personnes, à leur santé physique et mentale ou aux libertés individuelles : le membre de la délégation du personnel saisit immédiatement l'employeur, qui procède sans délai à une enquête avec lui et prend les dispositions nécessaires" },
    "L2312-60": { id: "LEGIARTI000035610989", quoi: "un membre de la délégation du personnel exerce les droits d'alerte en situation de danger grave et imminent et en matière de santé publique et d'environnement" },
    "L2312-63": { id: "LEGIARTI000035610999", quoi: "droit d'alerte économique : faits de nature à affecter de manière préoccupante la situation économique ; demande d'explications inscrite de droit à l'ordre du jour de la prochaine séance ; à défaut de réponse suffisante, rapport transmis à l'employeur et au commissaire aux comptes" },
    "L2312-64": { id: "LEGIARTI000035611001", quoi: "le comité ou la commission économique peut se faire assister, une fois par exercice, de l'expert-comptable de L. 2315-92, convoquer le commissaire aux comptes et s'adjoindre deux salariés avec voix consultative" },
    "L2312-65": { id: "LEGIARTI000035611003", quoi: "le rapport conclut en émettant un avis sur l'opportunité de saisir l'organe d'administration ou de surveillance ; le comité en décide à la majorité des membres présents" },
    "L2242-1": { id: "LEGIARTI000043893962", quoi: "dans les entreprises où sont constituées une ou plusieurs sections syndicales d'organisations représentatives, l'employeur engage au moins une fois tous les quatre ans une négociation sur la rémunération et une négociation sur l'égalité professionnelle et la qualité de vie et des conditions de travail" },
    "L2242-2": { id: "LEGIARTI000036262221", quoi: "à partir de trois cents salariés, négociation sur la gestion des emplois et des parcours professionnels" },
    "L2242-2-1": { id: "LEGIARTI000052432470", quoi: "à partir de trois cents salariés, négociation sur l'emploi, le travail et l'amélioration des conditions de travail des salariés expérimentés" },
    "L2242-3": { id: "LEGIARTI000037389684", quoi: "en l'absence d'accord sur l'égalité professionnelle, l'employeur établit un plan d'action annuel" },
    "L2242-4": { id: "LEGIARTI000052437071", quoi: "tant que la négociation est en cours, l'employeur ne peut, dans les matières traitées, arrêter de décisions unilatérales concernant la collectivité des salariés, sauf urgence" },
    "L2242-5": { id: "LEGIARTI000035627862", quoi: "à défaut d'accord au terme de la négociation, procès-verbal de désaccord consignant, en leur dernier état, les propositions respectives des parties et les mesures que l'employeur entend appliquer unilatéralement ; dépôt à l'initiative de la partie la plus diligente" },
    "L2242-8": { id: "LEGIARTI000051289082", quoi: "pénalité à la charge de l'employeur, à partir de cinquante salariés, en l'absence d'accord ou de plan d'action relatif à l'égalité professionnelle" },
    "L2242-10": { id: "LEGIARTI000035627827", quoi: "une négociation précisant le calendrier, la périodicité, les thèmes et les modalités de négociation peut être engagée à l'initiative de l'employeur ou à la demande d'une organisation syndicale représentative" },
    "L2242-11": { id: "LEGIARTI000052437060", quoi: "l'accord de méthode précise les thèmes et leur périodicité (au moins tous les quatre ans pour les thèmes de L. 2242-1, L. 2242-2 et L. 2242-2-1), le contenu de chaque thème, le calendrier et les lieux des réunions, les informations remises et la date de leur remise, les modalités de suivi ; sa durée ne peut excéder quatre ans" },
    "L2242-12": { id: "LEGIARTI000052437050", quoi: "un accord conclu dans l'un de ces domaines peut fixer la périodicité de sa renégociation" },
    "L2242-13": { id: "LEGIARTI000052437044", quoi: "à défaut d'accord de méthode ou en cas de non-respect de ses stipulations : chaque année, négociation sur la rémunération et négociation sur l'égalité professionnelle ; tous les trois ans, à partir de trois cents salariés, gestion des emplois et salariés expérimentés ; à défaut d'initiative de l'employeur depuis plus de douze mois (trente-six pour la triennale), la négociation s'engage à la demande d'une organisation syndicale représentative" },
    "L2242-14": { id: "LEGIARTI000035627802", quoi: "lors de la première réunion sont précisés le lieu et le calendrier des réunions, les informations que l'employeur remettra aux négociateurs et la date de cette remise" },
    "L2242-15": { id: "LEGIARTI000038837123", quoi: "la négociation annuelle sur la rémunération porte notamment sur les salaires effectifs, la durée effective et l'organisation du temps de travail, l'intéressement, la participation et l'épargne salariale" },
    "L2242-16": { id: "LEGIARTI000035627789", quoi: "cette négociation donne lieu à une information de l'employeur sur les mises à disposition de salariés" },
    "L2242-17": { id: "LEGIARTI000043893940", quoi: "la négociation annuelle sur l'égalité professionnelle et la qualité de vie et des conditions de travail porte notamment sur l'articulation des temps, les objectifs et mesures de suppression des écarts de rémunération, le droit à la déconnexion" },
    "R2242-1": { id: "LEGIARTI000036222825", quoi: "le procès-verbal de désaccord est déposé dans les conditions prévues à l'article D. 2231-2" },
    "D2231-2": { id: "LEGIARTI000036920600", quoi: "conditions de dépôt des conventions et accords" },
    "D2231-4": { id: "LEGIARTI000036920597", quoi: "les accords de groupe, d'entreprise, d'établissement et interentreprises, avec les pièces accompagnant le dépôt, sont déposés sur la plateforme de téléprocédure du ministère du travail" },
    "L2232-12": { id: "LEGIARTI000035652760", quoi: "la validité d'un accord d'entreprise est subordonnée à sa signature par l'employeur et par une ou plusieurs organisations représentatives ayant recueilli plus de 50 % des suffrages exprimés en faveur d'organisations représentatives au premier tour des dernières élections des titulaires au comité, quel que soit le nombre de votants ; à défaut, l'accord signé par des organisations ayant recueilli plus de 30 % de ces suffrages peut être soumis à l'approbation des salariés" },
    "L2243-1": { id: "LEGIARTI000031086617", quoi: "le fait de se soustraire aux obligations de convocation des parties et de négociation périodique est puni d'une amende" },
    "L2243-2": { id: "LEGIARTI000031086604", quoi: "le fait de se soustraire aux obligations des articles L. 2242-1 et L. 2242-20 est puni d'un emprisonnement d'un an et d'une amende de 3 750 euros" },
    "L1142-8": { id: "LEGIARTI000044605453", quoi: "à partir de cinquante salariés, l'employeur publie chaque année les indicateurs relatifs aux écarts de rémunération entre les femmes et les hommes et aux actions mises en œuvre pour les supprimer" },
    "L4121-1": { id: "LEGIARTI000035640828", quoi: "l'employeur prend les mesures nécessaires pour assurer la sécurité et protéger la santé physique et mentale des travailleurs : actions de prévention, d'information et de formation, organisation et moyens adaptés" },
    "L4121-2": { id: "LEGIARTI000033019913", quoi: "principes généraux de prévention : éviter les risques, évaluer ceux qui ne peuvent l'être, combattre à la source, adapter le travail à l'homme, planifier la prévention en y intégrant les risques liés au harcèlement et aux agissements sexistes" },
    "L4121-3": { id: "LEGIARTI000043893923", quoi: "l'employeur évalue les risques pour la santé et la sécurité des travailleurs, y compris dans le choix des procédés, des équipements et de l'aménagement des lieux de travail" },
    "L4121-3-1": { id: "LEGIARTI000043893919", quoi: "le document unique répertorie l'ensemble des risques et assure la traçabilité collective des expositions ; les résultats de l'évaluation débouchent, à partir de cinquante salariés, sur un programme annuel de prévention (liste détaillée des mesures, conditions d'exécution, indicateurs, coût, ressources, calendrier) et, en deçà, sur une liste d'actions consignée dans le document unique" },
    "R4121-1": { id: "LEGIARTI000023795562", quoi: "l'employeur transcrit et met à jour dans un document unique les résultats de l'évaluation ; celle-ci comporte un inventaire des risques identifiés dans chaque unité de travail, y compris ceux liés aux ambiances thermiques" },
    "R4121-2": { id: "LEGIARTI000045386446", quoi: "mise à jour au moins chaque année dans les entreprises d'au moins onze salariés, lors de toute décision d'aménagement important, et lorsqu'une information supplémentaire intéressant l'évaluation d'un risque est portée à la connaissance de l'employeur" },
    "R4121-3": { id: "LEGIARTI000045386448", quoi: "dans les établissements dotés d'un comité, le document unique est utilisé pour l'établissement du rapport annuel du 1° de L. 2312-27" },
    "R4121-4": { id: "LEGIARTI000045386451", quoi: "le document unique et ses versions antérieures sont tenus, pendant quarante ans, à la disposition des travailleurs et anciens travailleurs, des élus, du service de prévention et de santé au travail, de l'inspection du travail et des organismes de prévention" },
    "L2312-27": { id: "LEGIARTI000043893927", quoi: "dans le cadre de la consultation sur la politique sociale, l'employeur présente au comité le rapport annuel sur la santé, la sécurité et les conditions de travail et le programme annuel de prévention ; le comité peut proposer un ordre de priorité et des mesures supplémentaires" },
    "L4741-1": { id: "LEGIARTI000032376248", quoi: "amende de 10 000 euros pour l'employeur qui méconnaît par sa faute personnelle les dispositions énumérées, appliquée autant de fois qu'il y a de travailleurs concernés" },
    "R4741-1": { id: "LEGIARTI000018527390", quoi: "le fait de ne pas transcrire ou de ne pas mettre à jour les résultats de l'évaluation des risques dans les conditions de R. 4121-1 et R. 4121-2 est puni de l'amende prévue pour les contraventions de la cinquième classe" },

    /* ---------------------------------------------------------------- */
    /* Parcours « Installer le CSE : la première réunion ».              */
    /* Quarante-six articles ajoutés le 22 août 2026 : capture           */
    /* moteur/parcours/capturer-textes-installation.js, deux lectures    */
    /* espacées concordantes chacune, filtre par NOM du code et critère  */
    /* de contenu. Une lecture « élargie » — filtre relâché par le       */
    /* relais — est écartée comme une réponse relaxée de Judilibre.      */
    /* Les vingt-neuf autres articles du parcours étaient déjà au        */
    /* référentiel : la capture les a redemandés, sans un seul écart     */
    /* d'identifiant de version.                                        */
    /* ---------------------------------------------------------------- */
    "L2312-57": { id: "LEGIARTI000035610702", quoi: "à défaut d'accord, un mois après chaque élection du comité, l'employeur lui communique une documentation économique et financière précisant la forme juridique de l'entreprise et son organisation, les perspectives économiques, le cas échéant la position de l'entreprise au sein du groupe, et, compte tenu des informations dont il dispose, la répartition du capital entre les actionnaires détenant plus de 10 % du capital et la position de l'entreprise dans la branche" },
    "L2315-23": { id: "LEGIARTI000035624835", quoi: "le comité est doté de la personnalité civile et gère son patrimoine ; il est présidé par l'employeur ou son représentant, assisté éventuellement de trois collaborateurs qui ont voix consultative ; le comité désigne, parmi ses membres titulaires, un secrétaire et un trésorier" },
    "L2315-24": { id: "LEGIARTI000036761946", quoi: "le comité détermine, dans un règlement intérieur, les modalités de son fonctionnement et celles de ses rapports avec les salariés ; sauf accord de l'employeur, ce règlement ne peut comporter de clauses lui imposant des obligations ne résultant pas de dispositions légales — cet accord constitue un engagement unilatéral de l'employeur, dénonçable à l'issue d'un délai raisonnable et après information des membres" },
    "L2314-1":  { id: "LEGIARTI000037389707", quoi: "le comité comprend l'employeur et une délégation du personnel comportant un nombre égal de titulaires et de suppléants, déterminé par décret selon l'effectif ; le suppléant assiste aux réunions en l'absence du titulaire ; un référent en matière de lutte contre le harcèlement sexuel et les agissements sexistes est désigné par le comité parmi ses membres, par une résolution adoptée selon les modalités de L. 2315-32, pour une durée qui prend fin avec celle du mandat des élus" },
    "R2314-1":  { id: "LEGIARTI000036481896", quoi: "à défaut de stipulations d'accord, le nombre de membres de la délégation du personnel et le nombre mensuel d'heures de délégation sont fixés par le tableau de cet article, selon l'effectif de l'entreprise ou de chaque établissement distinct ; ce nombre d'heures peut être augmenté en cas de circonstances exceptionnelles" },
    "L2315-7":  { id: "LEGIARTI000035651243", quoi: "l'employeur laisse le temps nécessaire à l'exercice de leurs fonctions à chacun des membres titulaires et, à partir de cinq cent un salariés, aux représentants syndicaux au comité ; le nombre d'heures fixé par décret ne peut être inférieur à dix heures par mois en dessous de cinquante salariés et à seize heures dans les autres entreprises" },
    "L2315-9":  { id: "LEGIARTI000035651237", quoi: "un décret en Conseil d'État détermine les conditions dans lesquelles les titulaires peuvent, chaque mois, répartir entre eux et avec les suppléants le crédit d'heures de délégation dont ils disposent" },
    "L2315-11": { id: "LEGIARTI000036262458", quoi: "est payé comme temps de travail effectif, et non déduit des heures de délégation, le temps passé à la recherche de mesures préventives en situation d'urgence et de gravité, aux réunions du comité et de ses commissions dans la limite d'une durée globale, et aux enquêtes menées après un accident du travail grave ou des incidents révélant un risque grave" },
    "L2315-14": { id: "LEGIARTI000035621169", quoi: "les élus et les représentants syndicaux peuvent, durant les heures de délégation, se déplacer hors de l'entreprise, et circuler librement dans l'entreprise pour y prendre tous contacts nécessaires" },
    "L2315-15": { id: "LEGIARTI000035621173", quoi: "les membres de la délégation du personnel peuvent faire afficher les renseignements qu'ils ont pour rôle de porter à la connaissance du personnel, sur les emplacements destinés aux communications syndicales et aux portes d'entrée des lieux de travail" },
    "L2315-25": { id: "LEGIARTI000035624843", quoi: "l'employeur met à la disposition du comité un local aménagé et le matériel nécessaire à l'exercice de ses fonctions" },
    "L2315-26": { id: "LEGIARTI000035624845", quoi: "le comité peut organiser, dans le local mis à sa disposition, des réunions d'information internes au personnel, et inviter des personnalités extérieures ; ces réunions ont lieu en dehors du temps de travail des participants" },
    "L2315-3":  { id: "LEGIARTI000035651256", quoi: "les membres de la délégation du personnel sont tenus au secret professionnel pour toutes les questions relatives aux procédés de fabrication ; eux et les représentants syndicaux sont tenus à une obligation de discrétion à l'égard des informations revêtant un caractère confidentiel et présentées comme telles par l'employeur" },
    "L2315-4":  { id: "LEGIARTI000035651253", quoi: "le recours à la visioconférence peut être autorisé par accord entre l'employeur et les membres élus ; en l'absence d'accord, il est limité à trois réunions par année civile" },
    "L2312-72": { id: "LEGIARTI000035611295", quoi: "dans les sociétés, deux membres de la délégation du personnel — l'un des cadres, techniciens et agents de maîtrise, l'autre des employés et ouvriers — assistent avec voix consultative à toutes les séances du conseil d'administration ou de surveillance ; la délégation est portée à quatre membres là où trois collèges électoraux sont constitués" },
    "L2312-73": { id: "LEGIARTI000035611297", quoi: "ces membres ont droit aux mêmes documents que ceux adressés aux membres du conseil ; ils peuvent lui soumettre les vœux du comité, sur lesquels il donne un avis motivé" },
    "L2312-75": { id: "LEGIARTI000035611301", quoi: "dans les sociétés anonymes et en commandite par actions dont le conseil comprend déjà au moins un administrateur ou membre élu ou désigné par les salariés, la représentation du comité auprès du conseil est assurée par un seul membre titulaire du comité, désigné par lui" },
    "L2312-76": { id: "LEGIARTI000035611303", quoi: "dans les sociétés par actions simplifiées, les statuts précisent l'organe social auprès duquel les membres de la délégation du personnel exercent ces droits" },
    "L2315-61": { id: "LEGIARTI000036761916", quoi: "l'employeur verse au comité une subvention de fonctionnement annuelle de 0,20 % de la masse salariale brute de cinquante à moins de deux mille salariés, et de 0,22 % à partir de deux mille ; elle s'ajoute à la contribution aux activités sociales et culturelles ; le comité peut, par délibération, en consacrer une partie à la formation des délégués syndicaux et des représentants de proximité, ou en transférer une part de l'excédent annuel aux activités sociales et culturelles" },
    "L2315-62": { id: "LEGIARTI000035627344", quoi: "dans les entreprises à plusieurs comités d'établissement, le budget de fonctionnement du comité central est déterminé par accord entre le comité central et les comités d'établissement ; à défaut, par décret en Conseil d'État" },
    "L2312-81": { id: "LEGIARTI000036761976", quoi: "la contribution versée chaque année par l'employeur pour financer les institutions sociales du comité est fixée par accord d'entreprise ; à défaut d'accord, le rapport de cette contribution à la masse salariale brute ne peut être inférieur au même rapport existant pour l'année précédente" },
    "L2312-82": { id: "LEGIARTI000035611321", quoi: "dans les entreprises à plusieurs comités d'établissement, le montant global de la contribution est déterminé au niveau de l'entreprise ; sa répartition entre les comités d'établissement est fixée par accord au prorata des effectifs ou de la masse salariale, ou des deux ; à défaut d'accord, au prorata de la masse salariale de chaque établissement" },
    "L2312-83": { id: "LEGIARTI000036761969", quoi: "la masse salariale brute est constituée de l'ensemble des gains et rémunérations soumis à cotisations de sécurité sociale, à l'exception des indemnités versées à l'occasion de la rupture du contrat à durée indéterminée" },
    "L2312-84": { id: "LEGIARTI000035611325", quoi: "en cas de reliquat budgétaire, les membres de la délégation du personnel peuvent décider, par délibération, de transférer tout ou partie de l'excédent annuel du budget des activités sociales et culturelles au budget de fonctionnement ou à des associations, dans les conditions et limites fixées par décret" },
    "R2312-49": { id: "LEGIARTI000036413334", quoi: "les ressources du comité en matière d'activités sociales et culturelles : sommes versées par l'employeur pour les institutions sociales qui ne sont pas légalement à sa charge, remboursement obligatoire des primes d'assurance de responsabilité civile du comité, cotisations facultatives des salariés, subventions publiques ou syndicales, dons et legs, recettes des manifestations, revenus des biens du comité" },
    "R2312-51": { id: "LEGIARTI000036413338", quoi: "le transfert de l'excédent annuel du budget des activités sociales et culturelles vers le budget de fonctionnement ou vers des associations est possible dans la limite de 10 % de cet excédent ; la somme et ses modalités d'utilisation sont inscrites dans les comptes annuels et dans le rapport de gestion" },
    "R2312-52": { id: "LEGIARTI000036413340", quoi: "en cas de cessation définitive de l'activité de l'entreprise, le comité décide de l'affectation des biens dont il dispose ; la liquidation est opérée par ses soins sous la surveillance de l'administration du travail ; la dévolution du solde se fait au crédit d'un autre comité ou d'institutions sociales d'intérêt général — les biens ne peuvent être répartis entre les salariés ou entre les membres du comité" },
    "L2312-18": { id: "LEGIARTI000052437125", quoi: "une base de données économiques, sociales et environnementales rassemble l'ensemble des informations nécessaires aux consultations et informations récurrentes que l'employeur met à disposition du comité" },
    "L2312-21": { id: "LEGIARTI000043975329", quoi: "un accord d'entreprise ou, en l'absence de délégué syndical, un accord entre l'employeur et le comité adopté à la majorité des titulaires définit l'organisation, l'architecture, le contenu de la base de données et ses modalités de fonctionnement, notamment les droits d'accès" },
    "L2312-36": { id: "LEGIARTI000048533625", quoi: "en l'absence d'accord, la base de données rassemble les informations énumérées par cet article et est accessible en permanence aux membres de la délégation du personnel du comité, à ceux du comité central et aux délégués syndicaux" },
    "L2315-16": { id: "LEGIARTI000035621179", quoi: "le temps consacré aux formations du chapitre est pris sur le temps de travail et rémunéré comme tel ; il n'est pas déduit des heures de délégation" },
    "L2315-17": { id: "LEGIARTI000054140233", quoi: "les formations sont dispensées par un organisme enregistré auprès de l'autorité administrative ou par un organisme de L. 2145-5 ; elles sont renouvelées lorsque les représentants ont exercé leur mandat pendant quatre ans, consécutifs ou non" },
    "L2315-63": { id: "LEGIARTI000043975219", quoi: "dans les entreprises d'au moins cinquante salariés, les membres titulaires élus pour la première fois bénéficient, dans les conditions et limites de L. 2145-11, d'un stage de formation économique d'une durée maximale de cinq jours ; le financement est pris en charge par le comité, et la formation s'impute sur la durée du congé de formation économique, sociale, environnementale et syndicale" },
    "L2145-11": { id: "LEGIARTI000043975272", quoi: "le congé de formation économique, sociale et environnementale et de formation syndicale est de droit, sauf si l'employeur estime, après avis conforme du comité, que l'absence aurait des conséquences préjudiciables à la production et à la bonne marche de l'entreprise ; le refus est motivé et peut être contesté devant le bureau de jugement du conseil de prud'hommes" },
    "L2315-64": { id: "LEGIARTI000035627352", quoi: "le comité est soumis aux obligations comptables de l'article L. 123-12 du code de commerce ; ses comptes annuels sont établis selon un règlement de l'Autorité des normes comptables ; en dessous de deux des trois seuils fixés par décret, il peut adopter une présentation simplifiée" },
    "L2315-65": { id: "LEGIARTI000035627354", quoi: "le comité dont les ressources annuelles n'excèdent pas un seuil fixé par décret peut tenir un livre retraçant chronologiquement les montants et l'origine des dépenses et des recettes, et établir une fois par an un état de synthèse simplifié sur son patrimoine et ses engagements en cours" },
    "L2315-68": { id: "LEGIARTI000035627360", quoi: "les comptes annuels du comité sont arrêtés, selon des modalités prévues par son règlement intérieur, par des membres élus désignés par lui et en son sein ; ils sont approuvés par les membres élus réunis en séance plénière ; cette réunion porte sur ce seul sujet et fait l'objet d'un procès-verbal spécifique" },
    "L2315-69": { id: "LEGIARTI000036262535", quoi: "le comité établit, selon des modalités prévues par son règlement intérieur, un rapport présentant des informations qualitatives sur ses activités et sur sa gestion financière, présenté aux élus lors de la séance plénière d'approbation des comptes" },
    "L2315-70": { id: "LEGIARTI000035627364", quoi: "le trésorier ou, le cas échéant, le commissaire aux comptes présente un rapport sur les conventions passées, directement ou indirectement, entre le comité et l'un de ses membres ; il est présenté lors de la séance plénière d'approbation des comptes" },
    "L2315-71": { id: "LEGIARTI000036262527", quoi: "au plus tard trois jours avant la séance plénière d'approbation, les membres chargés d'arrêter les comptes les communiquent aux membres du comité, accompagnés du rapport de gestion" },
    "L2315-72": { id: "LEGIARTI000035627368", quoi: "le comité porte à la connaissance des salariés de l'entreprise, par tout moyen, ses comptes annuels accompagnés du rapport de gestion" },
    "L2315-73": { id: "LEGIARTI000048539746", quoi: "au-delà de deux des trois seuils fixés par décret, le comité nomme au moins un commissaire aux comptes et un suppléant, distincts de ceux de l'entreprise ; le coût de la certification est pris en charge par le comité sur sa subvention de fonctionnement" },
    "L2315-75": { id: "LEGIARTI000035627374", quoi: "les comptes annuels et les pièces justificatives qui s'y rapportent sont conservés pendant dix ans à compter de la clôture de l'exercice auquel ils se rapportent" },
    "L2315-76": { id: "LEGIARTI000035627376", quoi: "le comité dont les ressources excèdent le seuil de L. 2315-65 sans dépasser deux des trois seuils de L. 2315-64 confie la mission de présentation de ses comptes annuels à un expert-comptable, à ses frais sur sa subvention de fonctionnement" },
    "D2315-33": { id: "LEGIARTI000036433847", quoi: "les seuils de la présentation simplifiée : cinquante salariés à la clôture d'un exercice, et les montants de ressources annuelles et de total de bilan de l'article R. 612-1 du code de commerce" },
    "D2315-27": { id: "LEGIARTI000036433683", quoi: "l'employeur ou la délégation du personnel peuvent décider du recours à l'enregistrement ou à la sténographie des séances ; l'employeur ne peut s'y opposer, sauf délibérations portant sur des informations confidentielles ; la personne extérieure appelée à sténographier est tenue à la même obligation de discrétion" },

    /* --- les cinq parcours de régularisation ajoutés le 22 août 2026 :
       affichages obligatoires, registre unique du personnel, base de données,
       index de l'égalité professionnelle, entretiens de parcours
       professionnel. Vingt-huit articles capturés au relais Légifrance ce
       jour-là, chacun en deux lectures espacées concordantes, filtre par NOM
       du code et critère de contenu contre les homonymes ; les dix-neuf déjà
       présents au dépôt ont été redemandés sans un seul écart d'identifiant de
       version. Capture et journal :
         moteur/parcours/capturer-textes-regularisation.js
         moteur/parcours/textes-regularisation.json            (32 confirmés)
         moteur/parcours/textes-regularisation-non-confirmes.json
       NON CONFIRMÉ, ET DONC JAMAIS CITÉ : D. 1221-26 — le relais ne rend
       aucun texte à cinq lectures espacées sous le filtre « Code du travail ».
       Aucune étape ne s'y appuie. --- */
    "L1142-6": { id: "LEGIARTI000029144893", quoi: "dans les lieux de travail ainsi que dans les locaux ou à la porte des locaux où se fait l'embauche, les personnes sont informées par tout moyen du texte des articles 225-1 à 225-4 du code pénal" },
    "R3221-2": { id: "LEGIARTI000033292519", quoi: "les dispositions des articles L. 3221-1 à L. 3221-7 et leurs textes d'application sont portées, par tout moyen, à la connaissance des personnes ayant accès aux lieux de travail ainsi qu'aux candidats à l'embauche" },
    "D4711-1": { id: "LEGIARTI000018527636", quoi: "l'employeur affiche, dans des locaux normalement accessibles aux travailleurs, l'adresse et le numéro d'appel du médecin du travail ou du service de santé au travail, des services de secours d'urgence, et de l'inspection du travail avec le nom de l'inspecteur compétent" },
    "L4711-5": { id: "LEGIARTI000006903389", quoi: "lorsque les informations des articles L. 4711-1 et L. 4711-2 doivent figurer dans des registres distincts, l'employeur est autorisé à les réunir dans un registre unique dès lors que cette mesure facilite leur conservation et leur consultation" },
    "R4227-37": { id: "LEGIARTI000024769379", quoi: "dans les établissements de l'article R. 4227-34, une consigne de sécurité incendie est établie et affichée de manière très apparente, dans chaque local dont l'effectif dépasse cinq personnes ou dans chaque dégagement desservant un groupe de locaux" },
    "L3171-1": { id: "LEGIARTI000033021067", quoi: "l'employeur affiche les heures auxquelles commence et finit le travail ainsi que les heures et la durée des repos ; en cas d'organisation sur une période de référence, l'affichage comprend la répartition de la durée du travail" },
    "R2262-1": { id: "LEGIARTI000048288541", quoi: "à défaut d'autres modalités prévues par un accord de l'article L. 2262-5, l'employeur informe le salarié des conventions et accords applicables, tient un exemplaire à jour à la disposition des salariés sur le lieu de travail, et le met à disposition sur l'intranet lorsqu'il en existe un" },
    "L1152-4": { id: "LEGIARTI000029144897", quoi: "l'employeur prend toutes dispositions nécessaires en vue de prévenir les agissements de harcèlement moral ; les personnes sont informées par tout moyen du texte de l'article 222-33-2 du code pénal" },
    "L1153-5": { id: "LEGIARTI000037389712", quoi: "l'employeur prend toutes dispositions nécessaires en vue de prévenir les faits de harcèlement sexuel, d'y mettre un terme et de les sanctionner ; dans les lieux de travail et les locaux d'embauche, les personnes sont informées par tout moyen du texte de l'article 222-33 du code pénal et des actions contentieuses ouvertes" },
    "L2142-3": { id: "LEGIARTI000035652705", quoi: "l'affichage des communications syndicales s'effectue librement sur des panneaux réservés à cet usage, distincts de ceux affectés aux communications du comité ; un exemplaire est transmis à l'employeur simultanément à l'affichage" },
    "L1221-13": { id: "LEGIARTI000033971569", quoi: "un registre unique du personnel est tenu dans tout établissement où sont employés des salariés ; les noms et prénoms de tous les salariés y sont inscrits dans l'ordre des embauches, au moment de l'embauche et de façon indélébile ; les stagiaires et volontaires en service civique sont inscrits dans l'ordre d'arrivée, dans une partie spécifique du registre" },
    "L1221-15": { id: "LEGIARTI000035653242", quoi: "le registre unique du personnel est tenu à la disposition du comité social et économique et des fonctionnaires et agents chargés de veiller à l'application du code du travail et du code de la sécurité sociale" },
    "D1221-23": { id: "LEGIARTI000018537878", quoi: "les indications complémentaires portées pour chaque salarié : nationalité, date de naissance, sexe, emploi, qualification, dates d'entrée et de sortie, date de l'autorisation d'embauche ou de licenciement lorsqu'elle est requise, titre autorisant l'activité salariée pour les travailleurs étrangers, et les mentions « contrat à durée déterminée », « salarié temporaire », « mis à disposition par un groupement d'employeurs », « salarié à temps partiel », « apprenti » ou « contrat de professionnalisation »" },
    "D1221-24": { id: "LEGIARTI000036483477", quoi: "une copie des titres autorisant l'exercice d'une activité salariée des travailleurs étrangers est annexée au registre et rendue accessible aux membres de la délégation du personnel du comité et aux agents de contrôle, dans l'établissement ou sur chaque chantier où ces travailleurs sont employés" },
    "D1221-25": { id: "LEGIARTI000029825324", quoi: "les mentions relatives à des événements postérieurs à l'embauche du salarié ou à l'arrivée du stagiaire sont portées sur le registre au moment où ceux-ci surviennent" },
    "D1221-27": { id: "LEGIARTI000036483458", quoi: "lorsque l'employeur recourt à un support de substitution, les exigences des articles D. 8113-2 et D. 8113-3 sont applicables et il adresse à l'inspection du travail l'avis du comité prévu à l'article L. 2315-5" },
    "R2312-8": { id: "LEGIARTI000049905537", quoi: "à défaut d'accord, contenu de la base de données dans les entreprises de moins de trois cents salariés : les rubriques et sous-rubriques y sont énumérées thème par thème" },
    "R2312-9": { id: "LEGIARTI000049905524", quoi: "à défaut d'accord, contenu de la base de données dans les entreprises d'au moins trois cents salariés : les rubriques et sous-rubriques y sont énumérées thème par thème, sous forme de tableau" },
    "L1142-9": { id: "LEGIARTI000044605442", quoi: "lorsque les résultats se situent en deçà du niveau défini par décret, la négociation sur l'égalité professionnelle porte aussi sur les mesures de correction et, le cas échéant, sur la programmation de mesures financières de rattrapage salarial ; à défaut d'accord, ces mesures sont arrêtées par décision de l'employeur après consultation du comité, déposée auprès de l'autorité administrative, et publiées à l'extérieur comme au sein de l'entreprise" },
    "L1142-10": { id: "LEGIARTI000051289090", quoi: "en deçà du niveau défini par décret, l'entreprise dispose d'un délai de trois ans pour se mettre en conformité ; à l'expiration de ce délai, une pénalité financière d'un maximum de 1 % des rémunérations peut être appliquée par l'autorité administrative, un délai supplémentaire d'un an pouvant être accordé au vu des efforts constatés" },
    "L1142-11": { id: "LEGIARTI000045951643", quoi: "dans les entreprises qui, pour le troisième exercice consécutif, emploient au moins mille salariés, l'employeur publie chaque année les écarts éventuels de représentation entre les femmes et les hommes parmi les cadres dirigeants et les membres des instances dirigeantes ; la proportion de chaque sexe ne peut y être inférieure à 30 %" },
    "D1142-2": { id: "LEGIARTI000038026011", quoi: "pour les entreprises de plus de deux cent cinquante salariés, les cinq indicateurs : écart de rémunération, écart de taux d'augmentations individuelles hors promotions, écart de taux de promotions, pourcentage de salariées augmentées au retour de congé de maternité, et nombre de salariés du sexe sous-représenté parmi les dix plus hautes rémunérations" },
    "D1142-3": { id: "LEGIARTI000038026019", quoi: "le niveau de résultat obtenu au regard des indicateurs est déterminé selon les modalités fixées aux annexes I et II du chapitre" },
    "D1142-4": { id: "LEGIARTI000045250060", quoi: "le niveau de résultat et les résultats de chaque indicateur sont publiés annuellement, au plus tard le 1er mars de l'année en cours au titre de l'année précédente, de manière visible et lisible sur le site internet de l'entreprise lorsqu'il en existe un — à défaut, portés à la connaissance des salariés par tout moyen — et restent consultables jusqu'à la publication de l'année suivante" },
    "D1142-5": { id: "LEGIARTI000045250047", quoi: "les indicateurs et le niveau de résultat sont mis à la disposition du comité social et économique selon la même périodicité, dans les conditions du deuxième alinéa de l'article L. 2312-18, présentés par catégorie socio-professionnelle ou niveau hiérarchique et accompagnés des précisions utiles à leur compréhension ; l'ensemble est télédéclaré aux services du ministre chargé du travail" },
    "D1142-6": { id: "LEGIARTI000045250040", quoi: "les mesures de correction et la programmation de rattrapage salarial doivent être mises en œuvre dès lors que le niveau de résultat est inférieur à soixante-quinze points ; elles sont publiées sur le site internet de l'entreprise sur la même page que le résultat, dès le dépôt de l'accord ou de la décision unilatérale, et restent consultables jusqu'à l'obtention d'un résultat au moins égal à soixante-quinze points" },
    "L6315-1": { id: "LEGIARTI000053279288", quoi: "à l'embauche, le salarié est informé qu'il bénéficie d'un entretien de parcours professionnel au cours de la première année ; tout salarié en bénéficie ensuite tous les quatre ans ; l'entretien ne porte pas sur l'évaluation du travail, se déroule pendant le temps de travail, donne lieu à un document dont une copie est remise au salarié, et est proposé systématiquement au retour des congés et absences longues énumérés ; tous les huit ans, il fait un état des lieux récapitulatif du parcours" },
    "L6321-1": { id: "LEGIARTI000052437104", quoi: "l'employeur assure l'adaptation des salariés à leur poste de travail et veille au maintien de leur capacité à occuper un emploi, au regard notamment de l'évolution des emplois, des technologies et des organisations" },
    /* ── embauche, contrat et information du salarié — capture du 23 août 2026,
       deux lectures concordantes espacées, filtre par NOM du code ── */
    "L1221-10": { id: "LEGIARTI000006900849", quoi: "l'embauche d'un salarié ne peut intervenir qu'après déclaration nominative accomplie par l'employeur auprès des organismes de protection sociale désignés à cet effet ; la déclaration est accomplie dans tous les lieux de travail où sont employés des salariés" },
    "L1221-11": { id: "LEGIARTI000006900850", quoi: "le non-respect de l'obligation de déclaration préalable à l'embauche, constaté par les agents mentionnés à l'article L. 8271-7, entraîne une pénalité dont le montant est égal à trois cents fois le taux horaire du minimum garanti de l'article L. 3231-12" },
    "L1221-5-1": { id: "LEGIARTI000047285930", quoi: "l'employeur remet au salarié un ou plusieurs documents écrits contenant les informations principales relatives à la relation de travail ; le salarié qui ne les a pas reçues ne peut saisir le juge qu'après avoir mis l'employeur en demeure de les communiquer ou de les compléter" },
    "R1221-34": { id: "LEGIARTI000048288642", quoi: "les documents de l'article L. 1221-5-1 comportent au moins : l'identité des parties, le ou les lieux de travail et l'adresse de l'employeur si elle est distincte, l'intitulé du poste et les fonctions, la date d'embauche, la date de fin ou la durée prévue pour un contrat à durée déterminée, l'identité de l'entreprise utilisatrice pour un salarié temporaire, la durée et les conditions de la période d'essai, le droit à la formation, la durée du congé payé ou ses modalités de calcul, et les autres rubriques qu'il énumère" },
    "R1221-35": { id: "LEGIARTI000048288640", quoi: "les informations des 7° à 12° et 14° de R. 1221-34 peuvent prendre la forme d'un renvoi aux dispositions applicables ; celles des 1° à 5°, 7° et 11° et 12° sont communiquées au plus tard le septième jour calendaire à compter de la date d'embauche, les autres au plus tard un mois après cette date" },
    "L1221-19": { id: "LEGIARTI000019071113", quoi: "le contrat à durée indéterminée peut comporter une période d'essai dont la durée maximale est de deux mois pour les ouvriers et employés, trois mois pour les agents de maîtrise et techniciens, quatre mois pour les cadres" },
    "L1221-21": { id: "LEGIARTI000019071109", quoi: "la période d'essai peut être renouvelée une fois si un accord de branche étendu le prévoit et en fixe les conditions et durées ; renouvellement compris, elle ne peut dépasser quatre mois pour les ouvriers et employés, six mois pour les agents de maîtrise et techniciens, huit mois pour les cadres" },
    "L1221-25": { id: "LEGIARTI000029144958", quoi: "lorsque l'employeur met fin à l'essai, le salarié est prévenu dans un délai qui ne peut être inférieur à vingt-quatre heures en deçà de huit jours de présence, quarante-huit heures entre huit jours et un mois, deux semaines après un mois, un mois après trois mois ; l'essai ne peut être prolongé du fait du délai, et son inexécution ouvre droit à une indemnité compensatrice sauf faute grave" },
    "L1221-26": { id: "LEGIARTI000019071093", quoi: "lorsque le salarié met fin à la période d'essai, il respecte un délai de prévenance de quarante-huit heures, ramené à vingt-quatre heures si sa durée de présence dans l'entreprise est inférieure à huit jours" },
    "L1221-8": { id: "LEGIARTI000006900847", quoi: "le candidat à un emploi est expressément informé, préalablement à leur mise en œuvre, des méthodes et techniques d'aide au recrutement utilisées à son égard ; les résultats obtenus sont confidentiels et ces méthodes doivent être pertinentes au regard de la finalité poursuivie" },
    "L1221-9": { id: "LEGIARTI000006900848", quoi: "aucune information concernant personnellement un candidat à un emploi ne peut être collectée par un dispositif qui n'a pas été porté préalablement à sa connaissance" },
    "L1222-4": { id: "LEGIARTI000006900861", quoi: "aucune information concernant personnellement un salarié ne peut être collectée par un dispositif qui n'a pas été porté préalablement à sa connaissance" },
    "L1242-2": { id: "LEGIARTI000037312980", quoi: "un contrat à durée déterminée ne peut être conclu que pour l'exécution d'une tâche précise et temporaire, et seulement dans les cas énumérés : remplacement d'un salarié absent, passé provisoirement à temps partiel, dont le contrat est suspendu, parti définitivement avant suppression du poste après consultation du comité, ou attendu en contrat à durée indéterminée ; accroissement temporaire d'activité ; emplois à caractère saisonnier ou d'usage ; remplacement d'un chef d'entreprise ou d'exploitation" },
    "L1242-12": { id: "LEGIARTI000006901206", quoi: "le contrat à durée déterminée est établi par écrit et comporte la définition précise de son motif ; à défaut, il est réputé conclu pour une durée indéterminée. Il comporte notamment le nom et la qualification de la personne remplacée, la date du terme et le cas échéant une clause de renouvellement, la durée minimale à défaut de terme précis, la désignation du poste, l'intitulé de la convention collective applicable, la durée de la période d'essai et le montant de la rémunération" },
    "L1242-13": { id: "LEGIARTI000006901207", quoi: "le contrat de travail est transmis au salarié, au plus tard, dans les deux jours ouvrables suivant l'embauche" },
    "L1244-3": { id: "LEGIARTI000035644007", quoi: "à l'expiration d'un contrat à durée déterminée, il ne peut être recouru, pour pourvoir le poste du salarié dont le contrat a pris fin, ni à un contrat à durée déterminée ni à un contrat temporaire avant l'expiration d'un délai de carence calculé en fonction de la durée du contrat, renouvellements inclus ; les jours pris en compte sont les jours d'ouverture de l'entreprise ou de l'établissement" },
    "L1244-3-1": { id: "LEGIARTI000035639421", quoi: "à défaut de stipulation dans la convention ou l'accord de branche, le délai de carence est égal au tiers de la durée du contrat venu à expiration si celui-ci, renouvellements inclus, est de quatorze jours ou plus, et à la moitié de cette durée s'il est inférieur à quatorze jours" },
    "L1243-8": { id: "LEGIARTI000006901219", quoi: "lorsque les relations contractuelles ne se poursuivent pas par un contrat à durée indéterminée, le salarié a droit à une indemnité de fin de contrat égale à 10 % de la rémunération totale brute versée ; elle s'ajoute à cette rémunération, est versée à l'issue du contrat en même temps que le dernier salaire et figure sur le bulletin correspondant" },
    "L4141-1": { id: "LEGIARTI000027326445", quoi: "l'employeur organise et dispense une information des travailleurs sur les risques pour la santé et la sécurité et les mesures prises pour y remédier, ainsi que sur les risques que les produits ou procédés peuvent faire peser sur la santé publique ou l'environnement" },
    "L4141-2": { id: "LEGIARTI000006903166", quoi: "l'employeur organise une formation pratique et appropriée à la sécurité au bénéfice des travailleurs qu'il embauche, de ceux qui changent de poste ou de technique, des salariés temporaires, et à la demande du médecin du travail de ceux qui reprennent après un arrêt d'au moins vingt et un jours" },
    "R4624-10": { id: "LEGIARTI000033769085", quoi: "tout travailleur bénéficie d'une visite d'information et de prévention réalisée par l'un des professionnels de santé mentionnés au premier alinéa de l'article L. 4624-1, dans un délai qui n'excède pas trois mois à compter de la prise effective du poste de travail" },
    /* ── congés payés et journée de solidarité ── */
    "L3141-3": { id: "LEGIARTI000033020826", quoi: "le salarié a droit à un congé de deux jours et demi ouvrables par mois de travail effectif chez le même employeur ; la durée totale du congé exigible ne peut excéder trente jours ouvrables" },
    "L3141-13": { id: "LEGIARTI000033020772", quoi: "les congés sont pris dans une période qui comprend dans tous les cas la période du 1er mai au 31 octobre de chaque année" },
    "L3141-15": { id: "LEGIARTI000033020765", quoi: "un accord d'entreprise ou d'établissement ou, à défaut, une convention ou un accord de branche fixe la période de prise des congés, l'ordre des départs pendant cette période, et les délais que doit respecter l'employeur s'il entend modifier l'ordre et les dates de départs" },
    "L3141-16": { id: "LEGIARTI000035652687", quoi: "à défaut de stipulation conventionnelle, l'employeur définit après avis, le cas échéant, du comité social et économique la période de prise des congés et l'ordre des départs, en tenant compte de la situation de famille des bénéficiaires, de la durée de leurs services chez l'employeur et de leur activité éventuelle chez un ou plusieurs autres employeurs, et il ne peut, sauf circonstances exceptionnelles, modifier l'ordre et les dates de départ moins d'un mois avant la date prévue" },
    "D3141-5": { id: "LEGIARTI000033515945", quoi: "la période de prise des congés payés est portée par l'employeur à la connaissance des salariés au moins deux mois avant l'ouverture de cette période" },
    "D3141-6": { id: "LEGIARTI000033515942", quoi: "l'ordre des départs en congé est communiqué, par tout moyen, à chaque salarié un mois avant son départ" },
    "L3133-7": { id: "LEGIARTI000033020869", quoi: "la journée de solidarité, instituée en vue d'assurer le financement des actions en faveur de l'autonomie des personnes âgées ou handicapées, prend la forme d'une journée supplémentaire de travail non rémunérée pour les salariés et d'une contribution pour les employeurs" },
    "L3133-8": { id: "LEGIARTI000033020862", quoi: "le travail accompli, dans la limite de sept heures, durant la journée de solidarité ne donne pas lieu à rémunération pour les salariés mensualisés ; pour les salariés en forfait annuel en jours, dans la limite de la valeur d'une journée de travail ; pour les salariés à temps partiel, la limite de sept heures est réduite proportionnellement à la durée contractuelle" },
    /* ── fin du contrat ── */
    "L1234-19": { id: "LEGIARTI000006901138", quoi: "à l'expiration du contrat de travail, l'employeur délivre au salarié un certificat dont le contenu est déterminé par voie réglementaire" },
    "D1234-6": { id: "LEGIARTI000029544357", quoi: "le certificat de travail contient EXCLUSIVEMENT la date d'entrée du salarié et celle de sa sortie, et la nature de l'emploi ou des emplois successivement occupés avec les périodes pendant lesquelles ces emplois ont été tenus ; les deux autres mentions que l'article portait sont abrogées" },
    "L1234-20": { id: "LEGIARTI000019071122", quoi: "le solde de tout compte, établi par l'employeur et dont le salarié lui donne reçu, fait l'inventaire des sommes versées lors de la rupture ; le reçu peut être dénoncé dans les six mois qui suivent sa signature, délai au-delà duquel il devient libératoire pour l'employeur pour les sommes qui y sont mentionnées" },
    "R1234-9": { id: "LEGIARTI000049816309", quoi: "l'employeur délivre au salarié, au moment de l'expiration ou de la rupture du contrat, les attestations et justifications lui permettant d'exercer ses droits aux prestations de l'article L. 5421-2, et les transmet sans délai à l'opérateur France Travail ; les employeurs d'au moins onze salariés effectuent cette transmission par voie électronique, sauf impossibilité pour une cause qui leur est étrangère" },
    "L1226-2": { id: "LEGIARTI000035653236", quoi: "lorsque le salarié victime d'une maladie ou d'un accident non professionnel est déclaré inapte à reprendre l'emploi qu'il occupait, l'employeur lui propose un autre emploi approprié à ses capacités, au sein de l'entreprise ou des entreprises du groupe situées sur le territoire national et dont l'organisation, les activités ou le lieu d'exploitation assurent la permutation de tout ou partie du personnel" },
    "L1226-4": { id: "LEGIARTI000025560071", quoi: "lorsque, à l'issue d'un délai d'un mois à compter de la date de l'examen médical de reprise, le salarié déclaré inapte n'est ni reclassé ni licencié, l'employeur lui verse dès l'expiration de ce délai le salaire correspondant à l'emploi qu'il occupait avant la suspension de son contrat ; en cas de licenciement, le préavis n'est pas exécuté mais il est pris en compte pour le calcul de l'indemnité" },
    "L1237-11": { id: "LEGIARTI000019071187", quoi: "l'employeur et le salarié peuvent convenir en commun des conditions de la rupture du contrat qui les lie ; la rupture conventionnelle, exclusive du licenciement ou de la démission, ne peut être imposée par l'une ou l'autre des parties et résulte d'une convention signée par elles, soumise aux dispositions destinées à garantir la liberté du consentement" },
    "L1237-13": { id: "LEGIARTI000019071182", quoi: "la convention de rupture définit les conditions de celle-ci, notamment le montant de l'indemnité spécifique qui ne peut être inférieur à celui de l'indemnité de l'article L. 1234-9 ; elle fixe la date de rupture, qui ne peut intervenir avant le lendemain du jour de l'homologation ; chaque partie dispose, à compter de la signature, de quinze jours calendaires pour se rétracter, par lettre adressée par tout moyen attestant de sa date de réception" },
    "L1237-14": { id: "LEGIARTI000019071180", quoi: "à l'issue du délai de rétractation, la partie la plus diligente adresse une demande d'homologation à l'autorité administrative avec un exemplaire de la convention ; l'autorité dispose de quinze jours ouvrables d'instruction à compter de la réception ; à défaut de notification dans ce délai, l'homologation est réputée acquise ; la validité de la convention est subordonnée à son homologation" },
    "L2411-3": { id: "LEGIARTI000006902294", quoi: "le licenciement d'un délégué syndical ne peut intervenir qu'après autorisation de l'inspecteur du travail ; l'autorisation est également requise pour l'ancien délégué syndical durant les douze mois suivant la cessation de ses fonctions s'il les a exercées au moins un an, et lorsque la lettre de désignation a été reçue par l'employeur avant la convocation à l'entretien préalable" },
  };


  /* ------------------------------------------------------------------ */
  /* La jurisprudence. Vingt-quatre arrêts de la chambre sociale lus à  */
  /* la source par l'API Judilibre — vingt et un le 21 août 2026, trois  */
  /* le 22 août 2026 pour le parcours d'installation ; aucune réponse    */
  /* relaxée n'a été retenue. Le texte cité est le sommaire publié — ou, */
  /* pour les deux arrêts qui n'en portent pas, les motifs lus dans      */
  /* l'arrêt. Identifiants et sommaires intégraux :                      */
  /* moteur/parcours/jurisprudence-parcours.json                        */
  /* moteur/parcours/jurisprudence-installation.json                    */
  /* ------------------------------------------------------------------ */
  var JURIS = {
    "19-14.224": { d: "Soc. 27 novembre 2019, n° 19-14.224", p: "publié au Bulletin",
      t: "La désignation des membres d'une commission santé, sécurité et conditions de travail, que sa mise en place soit obligatoire ou conventionnelle, résulte d'un vote des membres du comité à la majorité des voix des membres présents lors du vote, sans qu'il soit besoin d'une résolution préalable fixant les modalités de l'élection." },
    "24-12.295": { d: "Soc. 26 février 2025, n° 24-12.295", p: "publié au Bulletin",
      t: "Les dispositions de l'article L. 2315-39 sont d'ordre public : là où est institué un troisième collège électoral en application de l'article L. 2314-11, un siège au moins à la commission santé, sécurité et conditions de travail doit être attribué à un élu représentant le troisième collège." },
    "24-16.408": { d: "Soc. 11 février 2026, n° 24-16.408", p: "arrêt sans sommaire publié — motifs lus dans le texte intégral",
      t: "L'article L. 2315-39 est d'ordre public. La désignation des membres de la commission, obligatoire ou conventionnelle, résulte d'un vote à la majorité des voix des membres présents ; une clause d'accord attribuant un siège à chaque organisation syndicale « par ordre de représentativité » ne peut être interprétée comme imposant une désignation proportionnelle au résultat électoral." },
    "24-22.914": { d: "Soc. 28 mai 2026, n° 24-22.914", p: "publié au Bulletin",
      t: "Sauf dans les cas de fin anticipée de mandat énumérés à l'article L. 2314-33, le comité ne peut procéder au remplacement des membres d'une commission santé, sécurité et conditions de travail initialement désignés avant le terme du mandat des membres élus du comité." },
    "25-12.560": { d: "Soc. 13 mai 2026, n° 25-12.560", p: "arrêt sans sommaire publié — motifs lus dans le texte intégral",
      t: "L'article L. 2315-38 est d'ordre public : la commission reçoit par délégation tout ou partie des attributions du comité relatives à la santé, à la sécurité et aux conditions de travail, à l'exception du recours à un expert et des attributions consultatives du comité." },
    "23-22.270": { d: "Soc. 18 mars 2026, n° 23-22.270", p: "publié au Bulletin",
      t: "Aux termes de l'article L. 1233-34, le comité peut, le cas échéant sur proposition des commissions constituées en son sein, décider de recourir à une expertise lors de la première réunion prévue à l'article L. 1233-30 ; selon l'article L. 2315-94, 2°, il peut faire appel à un expert habilité en cas de projet important modifiant les conditions de travail." },
    "09-43.079": { d: "Soc. 18 janvier 2011, n° 09-43.079", p: "publié au Bulletin",
      t: "Les poursuites disciplinaires se trouvent engagées à la date à laquelle le salarié concerné est convoqué à un entretien préalable à une sanction disciplinaire." },
    "11-28.109": { d: "Soc. 15 janvier 2013, n° 11-28.109", p: "publié au Bulletin",
      t: "La notification par l'employeur, après l'engagement de la procédure disciplinaire, d'une proposition de modification du contrat de travail interrompt le délai de deux mois de l'article L. 1332-4, qui court depuis la convocation à l'entretien préalable ; le refus de cette proposition interrompt à nouveau ce délai." },
    "13-23.348": { d: "Soc. 3 mars 2015, n° 13-23.348", p: "publié au Bulletin",
      t: "La signature par les parties d'une rupture conventionnelle ne constitue pas un acte interruptif de la prescription prévue par l'article L. 1332-4." },
    "08-45.243": { d: "Soc. 15 juin 2010, n° 08-45.243", p: "publié au Bulletin",
      t: "Le délai de deux mois de l'article L. 1332-4, pour des faits fautifs ayant donné lieu dans ce même délai à des poursuites pénales, est interrompu, lorsque l'employeur n'est pas partie à la procédure pénale, jusqu'au jour où il établit avoir eu connaissance de l'issue définitive de cette procédure." },
    "11-27.508": { d: "Soc. 4 décembre 2012, n° 11-27.508", p: "publié au Bulletin",
      t: "Il résulte des articles L. 1332-3 et L. 1332-4 que, lorsque les faits reprochés donnent lieu à des poursuites pénales, l'employeur peut, sans engager immédiatement une procédure de licenciement, prendre une mesure de mise à pied conservatoire si les faits le justifient." },
    "91-43.815": { d: "Soc. 17 janvier 1995, n° 91-43.815", p: "publié au Bulletin",
      t: "La seule référence à l'entretien préalable faite dans la lettre de notification d'une sanction ne satisfait pas à l'exigence d'information écrite des griefs retenus (texte alors codifié à l'article L. 122-41, aujourd'hui L. 1332-1)." },
    "19-15.039": { d: "Soc. 8 septembre 2021, n° 19-15.039", p: "publié au Bulletin",
      t: "La consultation d'un organisme chargé, en vertu d'une disposition conventionnelle ou d'un règlement intérieur, de donner son avis constitue une garantie de fond. L'irrégularité commise dans le déroulement de la procédure disciplinaire prévue par une convention ou un règlement intérieur est assimilée à la violation d'une garantie de fond lorsqu'elle a privé le salarié des droits de sa défense ou qu'elle est susceptible d'avoir exercé une influence sur la décision finale." },
    "22-17.292": { d: "Soc. 20 mars 2024, n° 22-17.292", p: "publié au Bulletin",
      t: "Le caractère tardif d'une demande d'avis prévue par le règlement intérieur avant le prononcé d'une sanction constitue une irrégularité dans le déroulement de la procédure disciplinaire ; il appartient au juge de rechercher si elle a privé le salarié de la possibilité d'assurer utilement sa défense ou est susceptible d'avoir exercé une influence sur la décision finale de sanctionner." },
    "21-10.718": { d: "Soc. 21 septembre 2022, n° 21-10.718", p: "publié au Bulletin et au Rapport",
      t: "Un syndicat est recevable à demander en référé la suspension du règlement intérieur en raison du défaut d'accomplissement des formalités substantielles tenant à la consultation des institutions représentatives du personnel, en l'absence desquelles le règlement intérieur ne peut être introduit. Il n'est en revanche pas recevable à en demander au fond la nullité ou l'inopposabilité à tous les salariés." },
    "22-19.726": { d: "Soc. 23 octobre 2024, n° 22-19.726", p: "publié au Bulletin",
      t: "Même solution pour l'ensemble des formalités substantielles prévues par l'article L. 1321-4 : la suspension en référé est ouverte au syndicat, la nullité au fond ne l'est pas." },
    "19-15.737": { d: "Soc. 23 juin 2021, n° 19-15.737", p: "publié au Bulletin",
      t: "Lorsque les modifications apportées au règlement intérieur initial, qui avait été soumis à consultation, résultent uniquement des injonctions de l'inspection du travail auxquelles l'employeur ne peut que se conformer, il n'y a pas lieu à nouvelle consultation." },
    "17-16.465": { d: "Soc. 17 octobre 2018, n° 17-16.465", p: "publié au Bulletin",
      t: "Le règlement intérieur constitue un acte réglementaire de droit privé : il n'est pas transféré avec les contrats de travail lors d'un transfert d'entreprise, et l'entreprise nouvelle doit élaborer le sien. L'application par la société nouvelle du règlement intérieur de la précédente en matière disciplinaire constitue un trouble manifestement illicite. (L'arrêt vise l'article R. 1321-5 dans sa rédaction d'alors ; ce texte a depuis été réécrit — version lue ce jour : LEGIARTI000041455669.)" },
    "24-15.653": { d: "Soc. 15 avril 2026, n° 24-15.653", p: "publié au Bulletin",
      t: "Il résulte des articles L. 2242-1, L. 2242-4 et L. 2242-5 que les négociations obligatoires ne peuvent être considérées comme ayant pris fin avant l'établissement d'un procès-verbal de désaccord." },
    "14-24.444": { d: "Soc. 25 novembre 2015, n° 14-24.444", p: "publié au Bulletin",
      t: "Ne méconnaît pas l'obligation légale de prendre les mesures nécessaires pour assurer la sécurité et protéger la santé physique et mentale des travailleurs l'employeur qui justifie avoir pris toutes les mesures prévues par les articles L. 4121-1 et L. 4121-2." },
    "11-28.324": { d: "Soc. 15 janvier 2013, n° 11-28.324", p: "publié au Bulletin",
      t: "Le pouvoir de convoquer inclut nécessairement le pouvoir de fixer la date de la réunion, sauf accord entre la majorité des élus et l'employeur ; le règlement intérieur de l'instance ne peut inclure de dispositions concernant une mesure relevant des prérogatives de l'employeur, sauf pour celui-ci à répondre d'un éventuel abus. (Arrêt rendu sur les articles L. 2325-14 et L. 2325-2, applicables au comité d'entreprise avant l'ordonnance du 22 septembre 2017.)" },

    /* --- parcours « Installer le CSE » : trois arrêts lus à la source par
       l'API Judilibre le 22 août 2026, recherchés par numéro de pourvoi,
       aucune réponse relaxée retenue. Identifiants et sommaires intégraux :
       moteur/parcours/jurisprudence-installation.json --- */
    "88-20.411": { d: "Soc. 10 juillet 1991, n° 88-20.411", p: "publié au Bulletin",
      t: "En application de l'article L. 433-1 du code du travail, le chef d'établissement est membre du comité d'établissement et doit, à ce titre et conformément à l'article L. 434-2 du même code, participer à la désignation du secrétaire du comité, ce vote ne constituant pas la consultation des membres élus du comité en tant que délégation du personnel. (Arrêt rendu sur les articles L. 433-1 et L. 434-2, textes du comité d'entreprise antérieurs à l'ordonnance du 22 septembre 2017 ; la composition du comité et la désignation du secrétaire relèvent aujourd'hui des articles L. 2314-1 et L. 2315-23.)" },
    "25-10.126": { d: "Soc. 8 juillet 2026, n° 25-10.126", p: "publié au Bulletin",
      t: "Il résulte des articles L. 2315-64, L. 2315-68, L. 2315-69 et L. 2315-71 du code du travail que tous les membres du comité social et économique ont un égal accès aux archives et aux documents administratifs et comptables dudit comité." },
    "09-12.758": { d: "Soc. 1er juin 2010, n° 09-12.758", p: "publié au Bulletin — texte de fondement abrogé depuis",
      t: "Selon l'article R. 2323-38 du code du travail, les membres du comité sortant rendent compte de leur gestion au nouveau comité et remettent aux nouveaux membres tous documents concernant l'administration et l'activité du comité. Cette obligation de remise à l'occasion de la reddition des comptes a été édictée au profit du comité lui-même, pour assurer la continuité de son fonctionnement, et non au profit de chacun de ses membres : la demande du président du comité, non mandaté par celui-ci pour agir en justice, est irrecevable. (ATTENTION : l'article R. 2323-38, propre au comité d'entreprise, n'est plus en vigueur — interrogé au relais Légifrance le 22 août 2026 sous le filtre « Code du travail », il répond « trouvé : faux ». Aucun article lu ce jour ne reprend cette obligation pour le comité social et économique. L'arrêt est cité pour la raison d'être de la reddition de comptes, non comme un fondement actuel.)" },
  };

  /* ------------------------------------------------------------------ */
  /* Le profil d'entreprise. Il est partagé : la même clé de stockage    */
  /* « profil-entreprise » est lue par documents.html et audit-social,   */
  /* et l'assistant la joint à son contexte. Cette page est la première  */
  /* qui l'écrit — jusqu'ici, personne ne la remplissait.                */
  /* ------------------------------------------------------------------ */
  var CLE_PROFIL = (window.Profil && window.Profil.CLE) || "profil-entreprise";
  var SECTEURS = (window.Profil && window.Profil.SECTEURS) ||
    ["transport et logistique", "industrie", "bâtiment et travaux publics",
      "commerce", "services"];

  /* La FICHE CLIENT — dénomination, SIRET, adresse, responsable, courriel,
     téléphone, effectif, secteur, convention, groupe, établissements — vit
     dans docs/profil.js, qui est la source unique de la clé partagée. Cette
     page y ajoute les seules questions qui lui sont propres : ce qui ouvre ou
     masque une étape de parcours. Si profil.js n'est pas chargé (page servie
     seule), la liste minimale d'origine reste en place : rien ne casse. */
  var CHAMPS_FICHE = (window.Profil && window.Profil.IDENTITE) || [
    { c: "denomination", nom: "Dénomination de l'entreprise", t: "text" },
    { c: "effectif", nom: "Effectif de l'entreprise", t: "number",
      aide: "Il commande à lui seul une bonne part des étapes : 11, 50, 300, 1 000 sont des seuils du code du travail. Laissé vide, aucune étape n'est masquée — cette page ne devine pas." },
    { c: "secteur", nom: "Secteur d'activité", t: "select", options: SECTEURS, autre: true },
    { c: "conventionCollective", nom: "Convention collective applicable", t: "idcc",
      aide: "Elle n'est jamais lue par l'application : elle sert à nommer le texte que vous devrez vérifier vous-même là où le conventionnel peut ajouter une étape." },
    { c: "groupe", nom: "L'entreprise appartient-elle à un groupe ?", t: "oui-non" },
    { c: "etablissementsDistincts", nom: "Plusieurs établissements distincts ?", t: "oui-non" },
  ];

  var CHAMPS_PARCOURS = [
    { c: "cseExiste", nom: "Un comité social et économique est-il en place ?", t: "oui-non" },
    { c: "sectionsSyndicales", nom: "Une ou plusieurs sections syndicales d'organisations représentatives ?", t: "oui-non",
      aide: "C'est la condition d'assujettissement à la négociation obligatoire (art. L. 2242-1)." },
    { c: "reglementInterieur", nom: "Un règlement intérieur est-il en vigueur ?", t: "oui-non" },
    { c: "ressourcesAnnuelles", nom: "Ressources annuelles du comité (euros)", t: "number",
      aide: "Sert au seuil de la commission des marchés (art. L. 2315-44-1 et D. 2315-29). Facultatif." },
    { c: "totalBilan", nom: "Total du bilan du comité (euros)", t: "number",
      aide: "Second critère de la commission des marchés. Facultatif." },
  ];

  /* Le profil complet de la page : la fiche client, puis ce qui lui est
     propre. Un champ déclaré des deux côtés n'est rendu qu'une fois. */
  var CHAMPS_PROFIL = CHAMPS_FICHE.concat(CHAMPS_PARCOURS.filter(function (ch) {
    return !CHAMPS_FICHE.some(function (x) { return x.c === ch.c; });
  }));


  /* ------------------------------------------------------------------ */
  /* L'affichage conditionnel — même mécanique que audit-form.js :       */
  /* une étape ou un item du préalable porte `si(P, D)` qui rend         */
  /*   true  → visible                                                  */
  /*   false → masqué : la question n'a indiscutablement plus d'objet    */
  /*   null  → indéterminé, donc VISIBLE : on ne devine pas.             */
  /* La condition reprend la garde de l'article, jamais une supposition. */
  /* ------------------------------------------------------------------ */
  function nb(v) {
    var n = parseInt(String(v == null ? "" : v).replace(/[^0-9-]/g, ""), 10);
    return isNaN(n) ? null : n;
  }
  function seuil(P, n) { var x = nb(P.effectif); return x === null ? null : x >= n; }
  function sousSeuil(P, n) { var x = nb(P.effectif); return x === null ? null : x < n; }

  /* Le renvoi au conventionnel : jamais une affirmation, toujours un    */
  /* renvoi nommé au texte que l'utilisateur devra ouvrir lui-même.      */
  function conv(P, quoi) {
    var n = String(P.conventionCollective || "").trim();
    return "À vérifier dans la convention collective " +
      (n ? "« " + n + " »" : "applicable (renseignez-la dans le profil ci-dessus)") +
      " : " + quoi + ". L'application ne lit aucune convention — elle signale l'endroit où " +
      "la vôtre peut ajouter une obligation, elle n'affirme pas ce qu'elle contient. " +
      "L'assistant intégré peut vous aider à la dépouiller.";
  }

  /* ------------------------------------------------------------------ */
  /* LES QUINZE PARCOURS                                                 */
  /* ------------------------------------------------------------------ */
  var PARCOURS = [

  /* ================================================================== */
  /* 1. SANCTIONNER UN SALARIÉ                                          */
  /* ================================================================== */
  {
    cle: "sanction",
    nom: "Sanctionner un salarié",
    resume: "De la connaissance des faits à la notification motivée : prescription de deux mois, procédure du règlement intérieur ou de la convention, convocation, entretien, plancher de deux jours ouvrables, plafond d'un mois.",
    audit: { href: "audit-discipline.html", nom: "l'audit discipline et règlement intérieur" },
    jx: "discipline",
    donnees: [
      { c: "salarie", nom: "Salarié concerné (nom, fonction)", t: "text" },
      { c: "nature", nom: "Sanction envisagée", t: "select",
        options: ["avertissement", "blâme", "mise à pied disciplinaire", "rétrogradation",
          "mutation disciplinaire", "autre sanction"],
        aide: "L'entretien préalable n'est pas exigé pour un avertissement — ni pour une sanction de même nature sans incidence, immédiate ou non, sur la présence, la fonction, la carrière ou la rémunération (art. L. 1332-2)." },
      { c: "incidence", nom: "Cette sanction a-t-elle une incidence sur la présence, la fonction, la carrière ou la rémunération ?", t: "oui-non",
        aide: "C'est cette incidence, et non le nom donné à la mesure, qui commande la convocation (art. L. 1332-2)." },
      { c: "dateConnaissance", nom: "Date à laquelle l'employeur a eu connaissance des faits", t: "date",
        aide: "Point de départ du délai de deux mois de l'article L. 1332-4." },
      { c: "poursuitesPenales", nom: "Les faits ont-ils donné lieu à des poursuites pénales dans le même délai ?", t: "oui-non" },
      { c: "misePiedConservatoire", nom: "Une mise à pied conservatoire a-t-elle été prononcée ?", t: "oui-non" },
      { c: "dateMisePied", nom: "Date de la mise à pied conservatoire", t: "date",
        si: function (P, D) { return D.misePiedConservatoire === "oui" ? true : (D.misePiedConservatoire === "non" ? false : null); } },
      { c: "dateConvocation", nom: "Date d'envoi de la convocation à l'entretien", t: "date" },
      { c: "dateEntretien", nom: "Date de l'entretien préalable", t: "date" },
      { c: "dateNotification", nom: "Date de notification de la sanction", t: "date" },
      { c: "salarieProtege", nom: "Le salarié est-il protégé (élu, délégué syndical, conseiller) ?", t: "oui-non" },
    ],
    prealable: [
      { id: "faits", g: "information", nom: "Le récit daté et circonstancié des faits",
        aide: "Qui, quoi, quand, où. La notification devra porter les griefs par écrit (art. L. 1332-1) : ce qui n'est pas écrit à ce stade ne sera pas écrit à la fin." },
      { id: "connaissance", g: "information", nom: "La date exacte à laquelle l'employeur en a eu connaissance",
        aide: "Elle ouvre le délai de deux mois de l'article L. 1332-4, et elle seule." },
      { id: "preuves", g: "pièce", nom: "Les pièces qui établissent les faits",
        aide: "Courriels, constats, attestations, relevés, comptes rendus. En cas de litige, le doute profite au salarié (art. L. 1333-1)." },
      { id: "dossier", g: "information", nom: "Le dossier du salarié : ancienneté, fonction, sanctions des trois dernières années",
        aide: "Une sanction antérieure de plus de trois ans à l'engagement des poursuites ne peut être invoquée (art. L. 1332-5)." },
      { id: "ri", g: "document", nom: "Le règlement intérieur en vigueur et son échelle des sanctions",
        aide: "La nature et l'échelle des sanctions y figurent (art. L. 1321-1) : une sanction qu'il ne prévoit pas est une sanction à discuter.",
        si: function (P) { var r = P.reglementInterieur; return r === "non" ? (seuil(P, 50) === false ? false : null) : true; } },
      { id: "ccn", g: "document", nom: "La convention collective applicable, à l'article « discipline »",
        aide: "Conseil de discipline, commission paritaire, avis préalable, délai propre : c'est là que se jouent les garanties de fond." },
      { id: "protege", g: "information", nom: "Savoir si le salarié est protégé",
        aide: "Le statut protecteur ajoute des exigences que ce parcours ne couvre pas ; vérifiez-les avant d'engager la procédure." },
      { id: "modeles", g: "document", nom: "Les trames de convocation et de notification",
        aide: "Elles sont dans le générateur de documents, et les étapes ci-dessous y renvoient pré-remplies." },
      { id: "misepied", g: "information", nom: "La justification et la date de la mise à pied conservatoire",
        aide: "Elle suspend le contrat sans préjuger de la sanction : aucune sanction définitive ne peut être prise sans que la procédure de l'article L. 1332-2 ait été observée (art. L. 1332-3).",
        si: function (P, D) { return D.misePiedConservatoire === "oui" ? true : (D.misePiedConservatoire === "non" ? false : null); } },
    ],
    etapes: [
      { id: "s1", nom: "Dater la connaissance des faits et vérifier la prescription",
        risque: "Aucun fait fautif ne peut donner lieu à lui seul à l'engagement de poursuites disciplinaires au-delà d'un délai de deux mois à compter du jour où l'employeur en a eu connaissance (L. 1332-4). Le délai est de prescription : passé le terme, le fait ne peut plus fonder une sanction, quelle que soit sa gravité, et le conseil de prud'hommes peut annuler la sanction irrégulière en la forme (L. 1333-2). R. 1332-1 impose d'ailleurs que la lettre de convocation soit remise ou adressée dans ce même délai de deux mois.",
        conseil: "Le point de départ est le jour où l'employeur a eu connaissance des faits, non celui où ils se sont produits ni celui où l'enquête interne s'est achevée : datez-le par la pièce qui l'établit — signalement, constat, rapport reçu — et classez cette pièce avant toute autre. L'erreur courante consiste à laisser courir une enquête au-delà du terme, croyant gagner en solidité ce que l'on perd en recevabilité. Écrivez la date sur une note de dossier le jour même : reconstituée trois mois plus tard, elle ne se prouve plus.",
        quoi: "Écrivez la date, et ce qui la prouve. Au-delà de deux mois à compter du jour où l'employeur a eu connaissance des faits, un fait fautif ne peut plus, à lui seul, donner lieu à l'engagement de poursuites disciplinaires.",
        fond: ["L1332-4"], juris: ["09-43.079", "13-23.348"],
        quand: function (D) {
          if (!D.dateConnaissance) return null;
          var t = moisApres(D.dateConnaissance, 2);
          return { iso: t, libelle: "Poursuites à engager au plus tard le " + dateFr(t),
            note: "Deux mois de quantième à quantième depuis le " + dateFr(D.dateConnaissance) +
              ". L'article R. 1332-3 énonce cette règle de comptage pour le délai d'un mois de l'article L. 1332-2 ; l'article L. 1332-4, lui, dit « deux mois » sans en préciser le décompte." };
        } },
      { id: "s2", nom: "Le cas échéant, tenir compte des poursuites pénales",
        risque: "La réserve du texte est étroite : elle suppose que les faits aient donné lieu, dans le même délai de deux mois, à l'exercice de poursuites pénales (L. 1332-4). Des poursuites exercées après le terme ne rouvrent rien, et la sanction fondée sur des faits prescrits reste annulable (L. 1333-2).",
        conseil: "Datez l'acte qui exerce les poursuites, et non le jour où vous en avez été informé : c'est cet acte qui doit tomber dans les deux mois. Conservez au dossier la pièce qui l'établit, car c'est vous qui invoquerez la réserve et donc vous qui devrez la démontrer. Une plainte déposée sans suite ne dispense pas d'agir : mieux vaut engager la procédure disciplinaire en parallèle que de miser sur la réserve.",
        quoi: "Lorsque les faits ont donné lieu, dans le même délai, à l'exercice de poursuites pénales, l'article L. 1332-4 réserve expressément ce cas.",
        fond: ["L1332-4"], juris: ["08-45.243", "11-27.508"],
        si: function (P, D) { return D.poursuitesPenales === "oui" ? true : (D.poursuitesPenales === "non" ? false : null); } },
      { id: "s3", nom: "Vérifier la procédure préalable du règlement intérieur et de la convention",
        docProduit: "DIS-CTL-SAN-12",
        risque: "C'est le manquement le plus coûteux de la procédure, parce qu'il ne se répare pas. La consultation d'un organisme chargé, en vertu d'une disposition conventionnelle ou du règlement intérieur, de donner son avis sur un licenciement envisagé constitue une garantie de fond, et l'irrégularité commise dans le déroulement de la procédure disciplinaire ainsi prévue est assimilée à la violation d'une garantie de fond lorsqu'elle a privé le salarié des droits de sa défense ou qu'elle est susceptible d'avoir exercé une influence sur la décision finale (Soc., 8 septembre 2021, n° 19-15.039). Le caractère tardif de la demande d'avis est lui-même une irrégularité de la procédure disciplinaire (Soc., 20 mars 2024, n° 22-17.292). Pour une sanction autre que le licenciement, le conseil de prud'hommes apprécie si la sanction irrégulière en la forme doit être annulée (L. 1333-2).",
        conseil: "Ouvrez la convention collective et le règlement intérieur avant de rédiger la convocation, et non après : c'est le calendrier conventionnel qui commande, et une saisine tardive vicie la procédure aussi sûrement qu'une saisine omise. Relevez par écrit la stipulation applicable, le délai qu'elle fixe et la composition de l'organisme, puis conservez la date de saisine, l'avis rendu et la trace de sa communication. Les délais conventionnels ne suspendent pas le mois qui suit l'entretien : construisez le calendrier à rebours depuis la date limite de notification.",
        quoi: "Avant toute convocation, ouvrez le règlement intérieur et la convention collective : conseil de discipline, commission paritaire, avis préalable, délai propre. C'est le point qui décide le plus souvent du sort d'un litige — et il ne se rattrape pas.",
        fond: ["L1321-1", "L1321-2"], juris: ["19-15.039", "22-17.292"],
        conv: "l'existence d'une procédure disciplinaire conventionnelle — organisme à consulter, forme et délai de la saisine, composition" },
      { id: "s4", nom: "Notifier la mise à pied conservatoire",
        champDate: "dateMisePied",
        docProduit: "DIS-CTL-SAN-11",
        risque: "Aucune sanction définitive relative aux faits ayant motivé une mise à pied conservatoire ne peut être prise sans que la procédure de l'article L. 1332-2 ait été respectée (L. 1332-3). La sanction prononcée sans convocation ni entretien est irrégulière en la forme et peut être annulée (L. 1333-2) ; et la mise à pied qui n'est suivie d'aucune procédure risque d'être regardée comme une sanction, avec la retenue de salaire qui l'accompagne.",
        conseil: "Qualifiez la mesure dans l'écrit qui la notifie — conservatoire, prise dans l'attente de la décision, et non à titre de sanction — puis engagez la procédure le jour même. Une mise à pied conservatoire est une mesure d'attente : plus elle se prolonge, plus elle ressemble à la sanction qu'elle prétend précéder. Notez ses dates de début et de fin, car c'est sur elles que se calculera la régularisation de paie si la mesure finalement retenue est moindre.",
        quoi: "La mise à pied conservatoire est une mesure d'attente, pas une sanction : elle n'épuise pas le pouvoir disciplinaire, mais aucune sanction définitive ne peut être prise sans que la procédure de l'article L. 1332-2 ait été observée.",
        fond: ["L1332-3"], juris: ["11-27.508"],
        si: function (P, D) { return D.misePiedConservatoire === "oui" ? true : (D.misePiedConservatoire === "non" ? false : null); },
        doc: { modele: "convocation-sanction", nom: "Convocation à entretien préalable",
          pre: function (P, D) { return { entreprise: P.denomination, salarie: D.salarie,
            dateConnaissance: D.dateConnaissance, dateEnvoi: D.dateConvocation,
            misePied: ["Une mise à pied conservatoire à effet immédiat est prononcée dans l'attente de la décision"] }; } } },
      { id: "s5", nom: "Convoquer le salarié à l'entretien préalable",
        docProduit: "DIS-CTL-SAN-08",
        risque: "La lettre de convocation indique l'objet de l'entretien, précise sa date, son heure et son lieu, rappelle que le salarié peut se faire assister par une personne de son choix appartenant au personnel de l'entreprise, et est remise contre récépissé ou adressée par lettre recommandée dans le délai de deux mois fixé à l'article L. 1332-4 (R. 1332-1). Une convocation privée de la mention d'assistance prive le salarié de sa défense avant même l'entretien, et la sanction qui suit est irrégulière en la forme (L. 1333-2).",
        conseil: "Vérifiez la lettre mention par mention, à froid, avant l'envoi : les exigences sont brèves, et c'est celle de l'assistance qui tombe le plus souvent. Écrivez l'objet en clair plutôt que de le noyer dans une formule vague. Deux voies de remise seulement sont ouvertes, le récépissé et la lettre recommandée : le courriel, la remise en main propre sans signature ou l'affichage ne prouvent rien, et c'est la date de cette remise qui doit tomber dans les deux mois.",
        jx: "discipline",
        quoi: "La lettre indique l'objet de l'entretien, précise la date, l'heure et le lieu, et rappelle que le salarié peut se faire assister par une personne de son choix appartenant au personnel. Elle est remise contre récépissé ou adressée par lettre recommandée.",
        fond: ["L1332-2", "R1332-1"], juris: ["09-43.079", "11-28.109"],
        /* L'entretien n'est pas exigé pour un avertissement sans incidence :
           c'est la garde même de l'article L. 1332-2. */
        si: function (P, D) {
          if (D.incidence === "oui") return true;
          if (D.incidence === "non" && (D.nature === "avertissement" || D.nature === "blâme")) return false;
          return null;
        },
        quand: function (D) {
          if (!D.dateConnaissance) return null;
          var t = moisApres(D.dateConnaissance, 2);
          return { iso: t, libelle: "Convocation à adresser au plus tard le " + dateFr(t),
            note: "L'article R. 1332-1 impose que la lettre soit remise ou adressée « dans le délai de deux mois fixé à l'article L. 1332-4 »." };
        },
        doc: { modele: "convocation-sanction", nom: "Convocation à entretien préalable",
          pre: function (P, D) { return { entreprise: P.denomination, salarie: D.salarie,
            dateEnvoi: D.dateConvocation, dateEntretien: D.dateEntretien,
            dateConnaissance: D.dateConnaissance }; } } },
      { id: "s6", nom: "Tenir l'entretien : indiquer le motif, recueillir les explications",
        docProduit: "DIS-CTL-SAN-07",
        risque: "Au cours de l'entretien, l'employeur indique le motif de la sanction envisagée et recueille les explications du salarié, qui peut se faire assister par une personne de son choix appartenant au personnel de l'entreprise (L. 1332-2). La sanction prise sans l'entretien dû est irrégulière en la forme et peut être annulée (L. 1333-2). L'exception que le texte réserve à l'avertissement tombe lorsque le règlement intérieur ou la convention collective subordonnent le licenciement à l'existence de sanctions antérieures : l'entretien devient alors une garantie de fond (Soc., 3 mai 2011, n° 10-14.104 ; Soc., 22 septembre 2021, n° 18-22.204).",
        conseil: "Rédigez un compte rendu daté le jour même, portant le motif indiqué, les explications données et le nom de la personne qui a assisté le salarié — ou la mention qu'il y a renoncé. C'est l'employeur qui devra fournir au juge les éléments retenus pour prendre la sanction, et le souvenir d'un entretien n'en est pas un. Faites signer ce compte rendu par les personnes présentes lorsque c'est possible ; à défaut, adressez-le au salarié, sa contestation éventuelle valant elle-même trace de ce qui a été dit.",
        quoi: "Au cours de l'entretien, l'employeur indique le motif de la sanction envisagée et recueille les explications du salarié. Le salarié peut se faire assister par une personne de son choix appartenant au personnel de l'entreprise. Notez ce qui a été dit : c'est ce qui nourrira la motivation.",
        fond: ["L1332-2"],
        si: function (P, D) {
          if (D.incidence === "oui") return true;
          if (D.incidence === "non" && (D.nature === "avertissement" || D.nature === "blâme")) return false;
          return null;
        },
        quand: function (D) {
          if (!D.dateEntretien) return null;
          return { iso: D.dateEntretien, libelle: "Entretien fixé au " + dateFr(D.dateEntretien) };
        } },
      { id: "s7", nom: "Notifier la sanction, écrite et motivée",
        champDate: "dateNotification",
        docProduit: "DIS-CTL-SAN-10",
        risque: "Aucune sanction ne peut être prise sans que le salarié soit informé, dans le même temps et par écrit, des griefs retenus contre lui (L. 1332-1) ; la décision fait l'objet d'un écrit motivé, notifié contre récépissé ou par lettre recommandée (L. 1332-2 ; R. 1332-2). Elle ne peut intervenir moins de deux jours ouvrables ni plus d'un mois après le jour fixé pour l'entretien, ce mois expirant selon la computation de l'article R. 1332-3. Hors de ces bornes, ou faute de motivation, la sanction est irrégulière en la forme et peut être annulée (L. 1333-2) ; et si la mesure notifiée est une amende ou une sanction pécuniaire, elle est interdite et réputée non écrite (L. 1331-2), le fait de l'infliger étant puni d'une amende de 3 750 euros (L. 1334-1).",
        conseil: "Calculez les deux bornes dès la fin de l'entretien et inscrivez-les au dossier : même quantième le mois suivant à vingt-quatre heures, à défaut le dernier jour du mois suivant, avec prorogation au premier jour ouvrable si ce terme tombe un samedi, un dimanche ou un jour férié — vérifiez ce calendrier à la main. Motivez en énonçant les faits, datés et circonstanciés : renvoyer à l'entretien préalable n'informe de rien, et une formule générale ne se discute pas. Si le mois est écoulé, ne notifiez pas : le cas se traite comme un abandon de la sanction, non comme un rattrapage.",
        jx: "discipline",
        quoi: "La décision est écrite et motivée : elle porte les griefs, datés et circonstanciés. Elle est notifiée contre récépissé ou par lettre recommandée. Renvoyer à l'entretien préalable ne suffit pas à informer le salarié des griefs.",
        fond: ["L1332-1", "L1332-2", "R1332-2", "R1332-3", "L1331-2"], juris: ["91-43.815"],
        quand: function (D) {
          if (!D.dateEntretien) return null;
          var plancher = joursOuvrablesApres(D.dateEntretien, 2), plafond = moisApres(D.dateEntretien, 1);
          return { iso: plafond,
            libelle: "Entre le " + dateFr(plancher) + " et le " + dateFr(plafond),
            note: "L'article L. 1332-2 interdit la sanction moins de deux jours ouvrables et plus d'un mois après le jour fixé pour l'entretien. Le plancher est compté hors dimanches ; cette page ne tient pas le calendrier des jours fériés, vérifiez-le si la date est serrée. Le plafond suit la règle de quantième de l'article R. 1332-3, prorogée au premier jour ouvrable si le terme tombe un samedi, un dimanche ou un jour férié ou chômé." };
        },
        doc: { modele: "avertissement", nom: "Notification d'avertissement motivée",
          pre: function (P, D) { return { entreprise: P.denomination, salarie: D.salarie,
            dateEntretien: D.dateEntretien, dateNotification: D.dateNotification,
            dateConnaissance: D.dateConnaissance }; } } },
      { id: "s8", nom: "Notifier la mise à pied disciplinaire",
        docProduit: "DIS-CTL-SAN-10",
        risque: "La mise à pied disciplinaire est une sanction au sens de l'article L. 1331-1 : elle suppose la procédure de l'article L. 1332-2 et une décision écrite et motivée, notifiée contre récépissé ou par lettre recommandée dans le délai d'un mois (R. 1332-2). Une mise à pied dont le règlement intérieur ne précise pas la durée maximale, ou qui excède cette durée, est irrégulière et le conseil de prud'hommes peut l'annuler (L. 1333-2). La retenue opérée sur les jours excédentaires n'est alors plus la conséquence d'une suspension du contrat : elle tombe sous l'interdiction des sanctions pécuniaires (L. 1331-2), dont la méconnaissance est punie d'une amende de 3 750 euros (L. 1334-1).",
        conseil: "Relevez deux nombres avant de rédiger : la durée maximale que porte le règlement intérieur dans sa version en vigueur à la date de la sanction, et la durée que vous prononcez. Portez les dates de début et de fin dans la lettre elle-même, et non un simple nombre de jours : c'est de ces dates que se déduira la retenue de paie, et une imprécision se paie en jours rendus. Si le règlement ne fixe aucune durée maximale, la question se règle au niveau du règlement, pas dans la lettre de notification.",
        jx: "discipline",
        quoi: "La mise à pied disciplinaire suspend le contrat et la rémunération : sa durée doit être bornée par le règlement intérieur, et ses dates de début et de fin précisées.",
        fond: ["L1331-1", "L1332-2", "R1332-2"],
        si: function (P, D) { return D.nature === "mise à pied disciplinaire" ? true : (D.nature ? false : null); },
        doc: { modele: "mise-a-pied", nom: "Notification de mise à pied disciplinaire",
          pre: function (P, D) { return { entreprise: P.denomination, salarie: D.salarie,
            dateEntretien: D.dateEntretien, dateNotification: D.dateNotification }; } } },
      { id: "s9", nom: "Classer la sanction et en tenir le compte",
        risque: "Aucune sanction antérieure de plus de trois ans à l'engagement des poursuites disciplinaires ne peut être invoquée à l'appui d'une nouvelle sanction (L. 1332-5) : la mesure qui ne tient que par un passé disciplinaire prescrit perd son appui. En cas de litige, le conseil de prud'hommes apprécie la régularité de la procédure suivie et si les faits reprochés sont de nature à justifier une sanction ; l'employeur lui fournit les éléments retenus, et si un doute subsiste il profite au salarié (L. 1333-1). Le juge peut annuler la sanction irrégulière en la forme, injustifiée ou disproportionnée à la faute commise (L. 1333-2).",
        conseil: "Tenez un relevé daté des sanctions par salarié, portant la date de notification de chacune : c'est elle, et non la date des faits, qui commande le décompte des trois ans. Purgez les dossiers individuels des mentions devenues inutilisables, faute de quoi elles reparaîtront dans une lettre de notification et l'affaibliront. Classez sous une même cote la convocation, la preuve de remise, le compte rendu d'entretien et la notification : c'est ce dossier, et non l'une de ces pièces prise isolément, qui se produira devant le juge.",
        quoi: "Datez et classez : trois ans plus tard, cette sanction ne pourra plus être invoquée à l'appui d'une nouvelle. Le juge, s'il est saisi, apprécie la régularité de la procédure, le caractère fautif des faits et la proportionnalité de la mesure.",
        fond: ["L1332-5", "L1333-1", "L1333-2"],
        quand: function (D) {
          if (!D.dateNotification) return null;
          var t = moisApres(D.dateNotification, 36);
          return { iso: null, libelle: "Ne pourra plus être invoquée après le " + dateFr(t),
            note: "Trois ans à compter de l'engagement des poursuites (art. L. 1332-5) ; la date affichée part de la notification, à ajuster si les poursuites ont été engagées plus tôt." };
        } },
    ]
  },

  /* ================================================================== */
  /* 2. CONDUIRE LES NÉGOCIATIONS OBLIGATOIRES                          */
  /* ================================================================== */
  {
    cle: "nao",
    suite: { cle: "index", pourquoi: "L'index de l'égalité professionnelle se publie chaque année et nourrit la négociation sur l'égalité : les deux se tiennent." },
    nom: "Conduire les négociations obligatoires (NAO)",
    resume: "De l'ouverture au dépôt : régime applicable — accord de méthode ou supplétif —, convocation de la première réunion, informations remises, loyauté, issue (accord ou procès-verbal de désaccord), dépôt.",
    audit: { href: "audit-nao.html", nom: "l'audit de la négociation obligatoire" },
    jx: "nego",
    donnees: [
      { c: "theme", nom: "Thème de la négociation engagée", t: "select",
        options: ["rémunération, temps de travail et partage de la valeur ajoutée",
          "égalité professionnelle et qualité de vie et des conditions de travail",
          "gestion des emplois et des parcours professionnels",
          "emploi et conditions de travail des salariés expérimentés"] },
      { c: "accordMethode", nom: "Un accord de méthode (art. L. 2242-11) est-il en vigueur ?", t: "oui-non" },
      { c: "dateFinAccordMethode", nom: "Date de fin de l'accord de méthode", t: "date",
        si: function (P, D) { return D.accordMethode === "oui" ? true : (D.accordMethode === "non" ? false : null); },
        aide: "Sa durée ne peut excéder quatre ans (art. L. 2242-11)." },
      { c: "datePrecedenteNego", nom: "Date de la précédente négociation sur ce thème", t: "date",
        aide: "Sert à situer l'échéance : chaque année pour la rémunération et l'égalité, tous les trois ans pour les deux autres thèmes, à défaut d'accord de méthode (art. L. 2242-13)." },
      { c: "datePremiereReunion", nom: "Date de la première réunion", t: "date" },
      { c: "dateRemiseInfos", nom: "Date de remise des informations aux négociateurs", t: "date" },
      { c: "issue", nom: "Issue de la négociation", t: "select",
        options: ["négociation en cours", "accord conclu", "désaccord constaté"] },
      { c: "dateIssue", nom: "Date de signature de l'accord ou du procès-verbal de désaccord", t: "date" },
      { c: "dateDepot", nom: "Date de dépôt", t: "date" },
    ],
    prealable: [
      { id: "osr", g: "information", nom: "La liste des organisations syndicales représentatives et de leurs délégués",
        aide: "L'obligation ne pèse que là où sont constituées une ou plusieurs sections syndicales d'organisations représentatives (art. L. 2242-1)." },
      { id: "accordm", g: "document", nom: "L'accord de méthode, s'il en existe un, et sa date de fin",
        aide: "Il fixe les thèmes, leur périodicité, le contenu, le calendrier, les informations remises et leur date, et les modalités de suivi (art. L. 2242-11)." },
      { id: "precedents", g: "document", nom: "Les accords et procès-verbaux des négociations précédentes",
        aide: "Ils datent le point de départ de la périodicité et fixent l'état des propositions." },
      { id: "infos", g: "document", nom: "Les informations à remettre aux négociateurs",
        aide: "Leur nature et leur date de remise sont précisées lors de la première réunion, à défaut d'accord de méthode (art. L. 2242-14)." },
      { id: "bdese", g: "document", nom: "La base de données économiques, sociales et environnementales à jour",
        aide: "C'est d'elle que sortent, en pratique, les informations chiffrées de la négociation." },
      { id: "index", g: "information", nom: "L'index d'égalité professionnelle publié",
        aide: "Publication annuelle des indicateurs d'écarts de rémunération à partir de cinquante salariés (art. L. 1142-8).",
        si: function (P) { return seuil(P, 50); } },
      { id: "ccnnao", g: "document", nom: "La convention collective, au titre « négociation collective »",
        aide: "Elle peut ajouter des thèmes, une périodicité ou une procédure propres." },
      { id: "calendrier", g: "information", nom: "Un calendrier de réunions et les lieux",
        aide: "Ils sont précisés lors de la première réunion (art. L. 2242-14)." },
    ],
    etapes: [
      { id: "n1", nom: "Vérifier l'assujettissement",
        risque: "La négociation obligatoire s'impose dans les entreprises où sont constituées une ou plusieurs sections syndicales d'organisations représentatives (L. 2242-1). Se croire hors du champ à tort n'excuse rien : le fait de se soustraire aux obligations de convocation des parties et de négociation périodique est puni d'un an d'emprisonnement et de 3 750 € d'amende (L. 2243-1).",
        conseil: "Écrivez, avec sa date, la liste des organisations représentatives et de leurs délégués syndicaux, en la tirant des résultats du premier tour et des désignations notifiées. Une désignation reçue en cours d'année ouvre l'obligation : datez-la, car c'est de là que partiront tous les délais. Reprenez cette liste avant chaque cycle plutôt que de recopier celle de l'an passé — une seule organisation oubliée suffit à vicier la négociation.",
        quoi: "La négociation obligatoire ne s'impose que dans les entreprises où sont constituées une ou plusieurs sections syndicales d'organisations représentatives.",
        fond: ["L2242-1"],
        si: function (P) { return P.sectionsSyndicales === "non" ? true : null; } },
      { id: "n2", nom: "Déterminer le régime : accord de méthode, ou supplétif",
        docProduit: "NAO-CTL-REG-02",
        risque: "Sans calendrier identifié, aucun retard ne se mesure, et l'employeur ne peut opposer aucune périodicité aménagée à une organisation syndicale qui demande l'ouverture d'une négociation. L'accord de méthode ne peut ni porter la périodicité au-delà de quatre ans ni durer plus de quatre ans (L. 2242-11, L. 2242-12) ; hors de ces bornes, la stipulation ne tient pas. Son non-respect fait retomber l'entreprise dans le régime supplétif de L. 2242-13, comme s'il n'existait pas.",
        conseil: "Consignez par écrit le régime retenu et sa source — l'accord daté et déposé, ou la mention expresse du régime supplétif : c'est ce document qui datera tous les retards. Si un accord existe, relisez ses stipulations chaque année et vérifiez qu'elles sont tenues, car un accord non respecté ne protège plus. Vérifiez enfin sa date d'expiration : un accord de méthode arrivé à terme sans être renouvelé fait basculer l'entreprise dans le régime annuel sans que rien ne le signale.",
        quoi: "Un accord peut fixer le calendrier, la périodicité, les thèmes et les modalités de négociation. À défaut d'un tel accord — ou en cas de non-respect de ses stipulations —, le régime supplétif s'applique : chaque année la rémunération et l'égalité professionnelle, tous les trois ans la gestion des emplois et les salariés expérimentés dans les entreprises d'au moins trois cents salariés.",
        fond: ["L2242-10", "L2242-11", "L2242-13", "L2242-12"],
        quand: function (D) {
          if (D.accordMethode !== "oui" || !D.dateFinAccordMethode) return null;
          return { iso: D.dateFinAccordMethode,
            libelle: "L'accord de méthode prend fin le " + dateFr(D.dateFinAccordMethode),
            note: "Sa durée ne peut excéder quatre ans (art. L. 2242-11) ; passée cette date, le régime supplétif de l'article L. 2242-13 reprend." };
        },
        doc: { modele: "accord-methode", nom: "Accord de méthode sur les négociations obligatoires",
          pre: function (P, D) { return { entreprise: P.denomination }; } } },
      { id: "n3", nom: "Vérifier les thèmes dus et leur échéance",
        risque: "À défaut d'accord de méthode, la négociation sur la rémunération et celle sur l'égalité professionnelle sont annuelles, et les négociations sur la gestion des emplois et sur les salariés expérimentés triennales à partir de trois cents salariés (L. 2242-13). Se soustraire à l'obligation périodique de négocier est puni d'un an d'emprisonnement et de 3 750 € d'amende (L. 2243-1, L. 2243-2). S'y ajoutent les pénalités financières : jusqu'à 10 % des exonérations de cotisations pour les salaires effectifs — 100 % si un manquement a déjà été constaté au cours des six années civiles précédentes (L. 2242-7) — et jusqu'à 1 % des rémunérations pour l'égalité professionnelle (L. 2242-8).",
        conseil: "Tenez un tableau à une seule entrée : par thème, la date de la dernière initiative de l'employeur, et l'échéance qui en découle. Ce sont douze mois — trente-six pour la triennale — depuis la précédente négociation, et le point de départ est l'initiative, non l'accord ni le procès-verbal. Passé ce délai, une organisation syndicale peut imposer l'ouverture, et les délais de huit et quinze jours qui suivent sa demande se comptent en jours, pas en semaines.",
        quoi: "Rémunération et égalité professionnelle sont dues chaque année à défaut d'accord de méthode ; la gestion des emplois et les salariés expérimentés tous les trois ans à partir de trois cents salariés. À défaut d'initiative de l'employeur depuis plus de douze mois — trente-six pour la triennale —, la négociation s'engage obligatoirement à la demande d'une organisation syndicale représentative.",
        fond: ["L2242-1", "L2242-2", "L2242-2-1", "L2242-13", "L2242-15", "L2242-17"],
        conv: "l'existence de thèmes ou de périodicités propres à la branche",
        quand: function (D, P) {
          if (!D.datePrecedenteNego) return null;
          var triennal = D.theme === "gestion des emplois et des parcours professionnels" ||
            D.theme === "emploi et conditions de travail des salariés expérimentés";
          var t = moisApres(D.datePrecedenteNego, triennal ? 36 : 12);
          return { iso: t,
            libelle: "Prochaine négociation à engager avant le " + dateFr(t),
            note: triennal
              ? "Périodicité triennale du régime supplétif (art. L. 2242-13, 3° et 4°), pour les entreprises d'au moins trois cents salariés."
              : "Périodicité annuelle du régime supplétif (art. L. 2242-13, 1° et 2°). Un accord de méthode peut porter la périodicité jusqu'à quatre ans (art. L. 2242-11)." };
        } },
      { id: "n4", nom: "Convoquer et tenir la première réunion",
        champDate: "datePremiereReunion",
        docProduit: "NAO-CTL-LOY-01",
        risque: "Lors de la première réunion sont précisés le lieu et le calendrier des réunions, les informations que l'employeur remettra aux négociateurs et la date de cette remise (L. 2242-14). Sans ces mentions, l'engagement sérieux et loyal des négociations n'est pas établi : un accord sur les salaires effectifs ne peut alors pas être valablement déposé (L. 2242-6), et une décision unilatérale prise dans le champ négocié devient contestable.",
        conseil: "Faites de ce procès-verbal un document à quatre rubriques et vérifiez qu'aucune ne reste vide avant de le diffuser. Notifiez-le à toutes les organisations convoquées, y compris celles qui ne sont pas venues. Ne promettez que des informations que vous pourrez remettre à la date annoncée : une date fixée et non tenue vaut manquement, et se lit sur le procès-verbal que vous aurez vous-même établi.",
        jx: "nego",
        quoi: "Lors de la première réunion sont précisés le lieu et le calendrier des réunions, les informations que l'employeur remettra aux négociateurs, et la date de cette remise.",
        fond: ["L2242-14"],
        quand: function (D) {
          if (!D.datePremiereReunion) return null;
          return { iso: D.datePremiereReunion, libelle: "Première réunion le " + dateFr(D.datePremiereReunion) };
        } },
      { id: "n5", nom: "Remettre les informations annoncées",
        champDate: "dateRemiseInfos",
        docProduit: "NAO-CTL-LOY-01",
        risque: "L'engagement sérieux et loyal des négociations implique que l'employeur ait communiqué aux organisations syndicales les informations nécessaires pour leur permettre de négocier en toute connaissance de cause, et qu'il ait répondu de manière motivée à leurs propositions (L. 2242-6). À défaut, le procès-verbal d'ouverture ne peut pas attester cet engagement, et l'accord sur les salaires effectifs ne peut pas être déposé auprès de l'autorité administrative.",
        conseil: "Remettez les informations contre décharge, ou par un envoi qui date, et faites consigner la remise au procès-verbal : c'est la date, plus que le contenu, qui se conteste ensuite. Remettez la même chose à toutes les organisations, et en même temps. Répondez par écrit à chaque proposition syndicale, même pour la refuser : un silence se constate, une réponse motivée se discute.",
        jx: "nego",
        quoi: "Les informations promises à la première réunion doivent l'être à la date annoncée : c'est de leur remise que se juge la loyauté de la négociation.",
        fond: ["L2242-14", "L2242-11"],
        quand: function (D) {
          if (!D.dateRemiseInfos) return null;
          return { iso: D.dateRemiseInfos, libelle: "Remise annoncée le " + dateFr(D.dateRemiseInfos) };
        },
        doc: { modele: "note-rh", nom: "Note d'information",
          pre: function (P, D) { return { entreprise: P.denomination,
            objet: "Informations remises aux négociateurs — " + (D.theme || "négociation obligatoire") }; } } },
      { id: "n6", nom: "Négocier — et ne rien décider unilatéralement dans les matières traitées",
        docProduit: "NAO-CTL-UNI-01",
        risque: "Tant que la négociation est en cours, l'employeur ne peut, dans les matières traitées, arrêter de décisions unilatérales concernant la collectivité des salariés, sauf si l'urgence le justifie (L. 2242-4). La décision prise en méconnaissance de ce texte est annulable, et le manquement nourrit le grief de négociation déloyale.",
        conseil: "Avant toute décision collective en cours de cycle, posez-vous la seule question utile : la matière est-elle inscrite à la négociation en cours ? Si oui, attendez, ou passez le point en négociation et faites-le figurer au procès-verbal. L'urgence se démontre par des faits datés, elle ne se déclare pas dans un attendu : réservez-la aux situations où le report cause un dommage certain, et écrivez lesquelles.",
        quoi: "Tant que la négociation est en cours, l'employeur ne peut, dans les matières traitées, arrêter de décisions unilatérales concernant la collectivité des salariés, sauf si l'urgence le justifie.",
        fond: ["L2242-4"], juris: ["24-15.653"] },
      { id: "n7", nom: "Conclure : accord, ou procès-verbal de désaccord",
        champDate: "dateIssue",
        docProduit: "NAO-CTL-ISS-01",
        risque: "La validité de l'accord suppose la signature de l'employeur et d'organisations représentatives ayant recueilli plus de 50 % des suffrages exprimés en faveur d'organisations représentatives au premier tour des dernières élections des titulaires au comité ; entre 30 et 50 %, il faut passer par l'approbation des salariés (L. 2232-12). Un accord signé sans atteindre ces seuils n'est pas valable. À défaut d'accord, le procès-verbal de désaccord doit consigner, en leur dernier état, les propositions respectives des parties et les mesures que l'employeur entend appliquer unilatéralement (L. 2242-5) : un procès-verbal qui se borne à constater l'échec est incomplet, et c'est cette mention qui fonde ensuite l'opposabilité des mesures unilatérales.",
        conseil: "Refaites le calcul des suffrages avant de faire signer, à partir du procès-verbal des dernières élections, et gardez la feuille de calcul avec l'accord. Rédigez le procès-verbal de désaccord au fil des réunions plutôt qu'à la fin : les dernières propositions de chacun s'y perdent autrement. Faites-le signer ou, à tout le moins, notifiez-le à toutes les organisations, et conservez la preuve de l'envoi.",
        jx: "nego",
        quoi: "Si un accord est conclu, sa validité suppose la signature de l'employeur et d'organisations représentatives ayant recueilli plus de 50 % des suffrages exprimés en faveur d'organisations représentatives au premier tour des dernières élections des titulaires au comité ; à défaut, l'accord signé au-delà de 30 % de ces suffrages peut être soumis à l'approbation des salariés. À défaut d'accord, le procès-verbal de désaccord consigne, en leur dernier état, les propositions respectives des parties et les mesures que l'employeur entend appliquer unilatéralement.",
        fond: ["L2242-5", "L2232-12"], juris: ["24-15.653"],
        quand: function (D) {
          if (!D.dateIssue) return null;
          return { iso: D.dateIssue, libelle: "Issue datée du " + dateFr(D.dateIssue) };
        },
        doc: { modele: "pv-desaccord", nom: "Procès-verbal de désaccord",
          pre: function (P, D) { return { entreprise: P.denomination, theme: D.theme,
            reunions: D.datePremiereReunion || "", dateEtablissement: D.dateIssue }; } } },
      { id: "n8", nom: "Déposer",
        champDate: "dateDepot",
        docProduit: "NAO-CTL-ISS-01",
        risque: "Le procès-verbal de désaccord donne lieu à dépôt, à l'initiative de la partie la plus diligente (L. 2242-5, R. 2242-1), sur la plateforme de téléprocédure du ministère du travail (D. 2231-4), un exemplaire étant remis au greffe du conseil de prud'hommes du lieu de conclusion (D. 2231-2). Sans dépôt, l'issue ne produit pas ses effets et la période n'est pas couverte au regard des pénalités de L. 2242-7 et L. 2242-8.",
        conseil: "N'attendez pas que les organisations syndicales s'en chargent : la partie la plus diligente, en pratique, c'est l'employeur. Déposez dans la foulée de la signature ou de l'établissement du procès-verbal, et conservez le récépissé — c'est lui, et non le document déposé, qui prouve le dépôt. Vérifiez que les pièces accompagnant le dépôt sont complètes : un dossier incomplet revient, et la date de dépôt recule d'autant.",
        quoi: "L'accord comme le procès-verbal de désaccord sont déposés sur la plateforme de téléprocédure du ministère du travail, avec les pièces qui accompagnent le dépôt. Le procès-verbal de désaccord est déposé à l'initiative de la partie la plus diligente.",
        fond: ["L2242-5", "R2242-1", "D2231-2", "D2231-4"],
        quand: function (D) {
          if (!D.dateIssue) return null;
          return { iso: D.dateDepot || null,
            libelle: D.dateDepot ? "Déposé le " + dateFr(D.dateDepot) : "Dépôt à faire, depuis l'issue du " + dateFr(D.dateIssue),
            note: "Le dépôt est la formalité qui rend l'accord opposable ; sans lui, le travail de la négociation reste sans effet." };
        } },
      { id: "n9", nom: "Publier l'index d'égalité professionnelle",
        docProduit: "NAO-CTL-EGA-02",
        risque: "À partir de cinquante salariés, l'employeur publie chaque année les indicateurs relatifs aux écarts de rémunération entre les femmes et les hommes et aux actions mises en œuvre pour les supprimer (L. 1142-8). La pénalité de L. 2242-8 — fixée au maximum à 1 % des rémunérations et gains versés au titre des périodes de manquement — peut être appliquée en l'absence de publication de ces informations comme en l'absence des mesures de correction de L. 1142-9.",
        conseil: "Traitez la publication comme une échéance de calendrier et non comme une suite de la négociation : elle tombe au 1er mars, que la négociation soit close ou non. Conservez une capture datée de la page publiée et l'accusé de télédéclaration, seuls à établir que l'échéance a été tenue. Le parcours consacré à l'index déroule le calcul, la publication et les mesures de correction.",
        quoi: "À partir de cinquante salariés, l'employeur publie chaque année les indicateurs relatifs aux écarts de rémunération entre les femmes et les hommes et aux actions mises en œuvre pour les supprimer.",
        fond: ["L1142-8"],
        si: function (P) { return seuil(P, 50); } },
      { id: "n10", nom: "Mesurer ce que coûte l'absence de négociation",
        risque: "L'absence d'accord relatif à l'égalité professionnelle ou, à défaut, de plan d'action expose l'entreprise d'au moins cinquante salariés à une pénalité fixée au maximum à 1 % des rémunérations et gains versés au titre des périodes non couvertes (L. 2242-8) ; à partir de trois cents salariés, ce défaut d'accord doit être attesté par un procès-verbal de désaccord. Le défaut de négociation sur les salaires effectifs expose à la pénalité de L. 2242-7, plafonnée à 10 % des exonérations de cotisations, et à 100 % si un manquement a déjà été constaté au cours des six années civiles précédentes. Se soustraire aux obligations de convocation des parties et de négociation périodique est en outre puni d'un an d'emprisonnement et de 3 750 € d'amende (L. 2243-1, L. 2243-2).",
        conseil: "Faites l'inventaire par période et non par thème : pour chaque année, dites si elle est couverte par un accord ou par un plan d'action déposé, car c'est ainsi que la pénalité se calcule. Rassemblez d'avance ce qui atténue — convocations envoyées, réunions tenues, propositions faites, informations remises —, l'autorité administrative tenant compte des efforts constatés et des motifs de la défaillance. Notez enfin que la pénalité appliquée sur le fondement de L. 1142-10 exclut celle de L. 2242-8 : les deux ne se cumulent pas.",
        quoi: "À partir de cinquante salariés, l'absence d'accord ou de plan d'action relatif à l'égalité professionnelle est sanctionnée par une pénalité. Se soustraire aux obligations de convocation et de négociation périodique est en outre pénalement réprimé.",
        fond: ["L2242-3", "L2242-8", "L2243-1", "L2243-2"],
        si: function (P) { return seuil(P, 50); } },
    ]
  },


  /* ================================================================== */
  /* 3. CONSTITUER LES COMMISSIONS DU COMITÉ                            */
  /* ================================================================== */
  {
    cle: "commissions",
    nom: "Constituer les commissions du CSE",
    resume: "L'accord d'abord, le régime supplétif ensuite : seuils de 300 et de 1 000, commission santé-sécurité obligatoire, désignations par résolution, formation des élus, première réunion et compte rendu au comité.",
    audit: { href: "audit-cse.html", nom: "l'audit du comité social et économique" },
    donnees: [
      { c: "accordCommissions", nom: "Un accord fixe-t-il les modalités de mise en place des commissions ?", t: "oui-non",
        aide: "Accord d'entreprise de l'article L. 2313-2, ou — en l'absence de délégué syndical — accord entre l'employeur et le comité adopté à la majorité des titulaires (art. L. 2315-41 et L. 2315-42)." },
      { c: "riComite", nom: "Le règlement intérieur du comité définit-il ces modalités ?", t: "oui-non",
        si: function (P, D) { return D.accordCommissions === "non" ? true : (D.accordCommissions === "oui" ? false : null); },
        aide: "À défaut d'accord, c'est lui qui les définit (art. L. 2315-44)." },
      { c: "troisiemeCollege", nom: "Un troisième collège électoral est-il institué ?", t: "oui-non",
        aide: "Il commande l'attribution d'un siège à la commission santé, sécurité et conditions de travail (art. L. 2315-39)." },
      { c: "seuilsMarches", nom: "Les comptes du comité dépassent-ils deux des trois seuils de la commission des marchés ?", t: "oui-non",
        aide: "Cinquante salariés employés PAR LE COMITÉ à la clôture d'un exercice, le montant de ressources annuelles et le total du bilan de l'article R. 612-1 du code de commerce (art. L. 2315-44-1 et D. 2315-29). Ces trois critères portent sur les comptes du comité, jamais sur l'effectif de l'entreprise : un comité qui n'emploie personne et dont le budget se compte en dizaines de milliers d'euros n'en franchit aucun. Répondez « non » si vous êtes dans ce cas — l'étape correspondante disparaîtra." },
      { c: "dateReunionDesignation", nom: "Date de la réunion de désignation", t: "date" },
      { c: "dateFinMandats", nom: "Date de fin du mandat des élus", t: "date",
        aide: "La durée du mandat des membres de la commission prend fin avec celle du mandat des élus du comité (art. L. 2315-39)." },
      { c: "datePremierMandat", nom: "Date de début du premier mandat des élus (pour la formation)", t: "date" },
      { c: "dateFormation", nom: "Date de la formation santé, sécurité et conditions de travail", t: "date" },
      { c: "datePremiereReunionCom", nom: "Date de la première réunion de la commission", t: "date" },
    ],
    prealable: [
      { id: "pv", g: "document", nom: "Le procès-verbal des élections et la composition du comité",
        aide: "Titulaires, suppléants, collèges : la désignation se fait parmi les membres du comité." },
      { id: "acc", g: "document", nom: "L'accord de mise en place du CSE et, le cas échéant, l'accord sur les commissions",
        aide: "L'accord prime : il fixe le nombre de membres, les missions déléguées, le fonctionnement, les heures de délégation, la formation et les moyens (art. L. 2315-41)." },
      { id: "ric", g: "document", nom: "Le règlement intérieur du comité",
        aide: "À défaut d'accord, c'est lui qui définit ces modalités (art. L. 2315-44) ; il fixe aussi le fonctionnement de la commission des marchés (art. L. 2315-44-3)." },
      { id: "eff", g: "information", nom: "L'effectif de l'entreprise et de chaque établissement distinct",
        aide: "300 déclenche la commission santé-sécurité, la formation, le logement et l'égalité professionnelle ; 1 000 la commission économique." },
      { id: "seveso", g: "information", nom: "Savoir si un établissement relève des articles L. 4521-1 et suivants",
        aide: "Dans ces établissements, la commission santé, sécurité et conditions de travail est créée quel que soit l'effectif (art. L. 2315-36, 3°)." },
      { id: "candidats", g: "information", nom: "Les candidatures aux sièges de chaque commission",
        aide: "La désignation résulte d'un vote du comité à la majorité des membres présents." },
      { id: "budget", g: "information", nom: "Les comptes du comité : ressources annuelles et total du bilan",
        aide: "Deux des trois critères de l'article D. 2315-29 déclenchent la commission des marchés." },
      { id: "ccncom", g: "document", nom: "La convention collective, au titre des institutions représentatives",
        aide: "Elle peut prévoir des commissions supplémentaires ou des moyens propres." },
    ],
    etapes: [
      { id: "c1", nom: "Choisir la voie : l'accord d'abord, le règlement intérieur du comité ensuite",
        docProduit: "CSE-CTL-SST-06",
        risque: "L'ordre des sources n'est pas indifférent : l'accord d'entreprise défini à l'article L. 2313-2 fixe les modalités de mise en place de la commission (L. 2315-41), en l'absence de délégué syndical un accord entre l'employeur et le comité adopté à la majorité des membres titulaires élus y pourvoit (L. 2315-42), et le règlement intérieur du comité ne les définit qu'en l'absence des accords prévus à ces deux articles (L. 2315-44). Une commission dépourvue de règles écrites n'a ni missions ni moyens établis, et l'étendue de la délégation qu'elle exerce ne peut pas être vérifiée.",
        conseil: "Commencez par établir, par écrit et à une date certaine, s'il existe un délégué syndical et si une négociation a été ouverte : c'est ce constat qui autorise à passer à l'étage suivant, et son absence est le reproche le plus facile à formuler. Reprenez ensuite, point par point, les six modalités à définir — nombre de membres, missions déléguées et leurs modalités d'exercice, fonctionnement et heures de délégation, formation, moyens alloués, formation spécifique aux risques particuliers — en indiquant pour chacune la clause qui la porte. Une commission qui fonctionne sans texte fonctionne tant que personne ne le conteste.",
        quoi: "L'accord d'entreprise fixe les modalités de mise en place : nombre de membres, missions déléguées et leurs modalités d'exercice, fonctionnement et heures de délégation, formation, moyens. En l'absence de délégué syndical, un accord entre l'employeur et le comité, adopté à la majorité des titulaires, y pourvoit. À défaut d'accord, le règlement intérieur du comité définit ces mêmes modalités ; l'employeur peut alors fixer le nombre et le périmètre des commissions.",
        fond: ["L2315-41", "L2315-42", "L2315-43", "L2315-44"] },
      { id: "c2", nom: "La commission santé, sécurité et conditions de travail est-elle obligatoire ?",
        risque: "Une commission santé, sécurité et conditions de travail est créée au sein du comité dans les entreprises d'au moins trois cents salariés, dans les établissements distincts d'au moins trois cents salariés et dans les établissements mentionnés aux articles L. 4521-1 et suivants (L. 2315-36) ; en deçà, l'inspecteur du travail peut en imposer la création lorsque cette mesure est nécessaire, notamment en raison de la nature des activités, de l'agencement ou de l'équipement des locaux (L. 2315-37). Ne pas la constituer là où elle est due expose l'employeur à l'amende de 7 500 euros que l'article L. 2317-1 attache à l'entrave au fonctionnement régulier du comité.",
        conseil: "Le seuil se constate sur douze mois consécutifs et sur des relevés mensuels, non sur une déclaration d'effectif : sortez les états de paie et datez le franchissement avant de vous demander si la commission est due. Vérifiez ensuite le seuil au niveau de l'entreprise puis, séparément, au niveau de chaque établissement distinct : une même entreprise peut devoir plusieurs commissions, et c'est l'oubli courant. Conservez la décision de l'inspecteur du travail lorsqu'il y en a une, ainsi que sa date : c'est elle qui fixe l'obligation et son point de départ.",
        quoi: "Elle est créée dans les entreprises et les établissements distincts d'au moins trois cents salariés, et dans les établissements des articles L. 4521-1 et suivants. En deçà, l'inspecteur du travail peut l'imposer ; et rien n'interdit de la créer par accord.",
        fond: ["L2315-36", "L2315-37", "L2315-43"] },
      { id: "c3", nom: "Fixer la composition de la commission santé-sécurité",
        docProduit: "CSE-CTL-SST-01",
        risque: "La commission est présidée par l'employeur ou son représentant et comprend au minimum trois membres représentants du personnel, dont au moins un représentant du second collège ou, le cas échéant, du troisième collège prévu à l'article L. 2314-11 (L. 2315-39). Ces dispositions sont d'ordre public : lorsqu'un troisième collège est institué, un siège au moins doit être attribué à un élu le représentant, l'arrêt qui n'y voyait qu'une alternative entre le second et le troisième collège ayant été cassé (Soc., 26 février 2025, n° 24-12.295). Une composition irrégulière expose la désignation à l'annulation.",
        conseil: "Avant le vote, dressez la liste des élus avec, en regard de chaque nom, le collège dans lequel il a été élu : c'est cette colonne, et non l'intitulé du poste occupé, qui décide. Comptez les collaborateurs dont le président entend se faire assister, car ensemble ils ne peuvent pas être en nombre supérieur à celui des représentants du personnel titulaires ; arrêtez cette liste avant la réunion plutôt que dans la salle. Portez au procès-verbal la composition retenue avec le collège de chacun : c'est la pièce qui répondra à la contestation.",
        quoi: "Présidence par l'employeur ou son représentant ; au minimum trois membres représentants du personnel, dont au moins un du second collège ou, le cas échéant, du troisième collège. L'employeur peut se faire assister de collaborateurs, sans dépasser le nombre des représentants du personnel titulaires.",
        fond: ["L2315-39"], juris: ["24-12.295", "24-16.408"] },
      { id: "c4", nom: "Désigner les membres par une résolution du comité",
        champDate: "dateReunionDesignation",
        docProduit: "CSE-CTL-SST-03",
        risque: "La désignation des membres de la commission, que sa mise en place soit obligatoire ou conventionnelle, résulte d'un vote des membres du comité à la majorité des voix des membres présents, sans qu'il soit besoin d'une résolution préalable fixant les modalités de l'élection (Soc., 27 novembre 2019, n° 19-14.224), par application des articles L. 2315-39 et L. 2315-32 ; une désignation opérée autrement est irrégulière. Le mandat des membres prend fin avec celui des membres élus du comité (L. 2315-39), et sauf dans les cas de fin anticipée énumérés à l'article L. 2314-33 — décès, démission, rupture du contrat de travail, perte des conditions requises pour être éligible — le comité ne peut pas remplacer les membres initialement désignés avant ce terme, aucun accord d'entreprise ne pouvant y déroger (Soc., 28 mai 2026, n° 24-22.914).",
        conseil: "Inscrivez la désignation à l'ordre du jour et faites-la figurer au procès-verbal avec le décompte des voix rapporté au nombre de membres présents : une désignation « par consensus », sans décompte, ne se démontre pas. Notez au procès-verbal qui a pris part au vote. Et retenez qu'un remplacement en cours de mandat suppose une cause écrite et vérifiable : la prise de nouvelles fonctions, l'indisponibilité ou un changement d'équilibre syndical n'en sont pas.",
        quoi: "Les membres sont désignés par le comité parmi ses membres, par une résolution adoptée selon les modalités de l'article L. 2315-32 — donc à la majorité des membres présents —, pour une durée qui prend fin avec celle du mandat des élus. Une résolution préalable fixant les modalités de l'élection n'est pas nécessaire.",
        fond: ["L2315-39", "L2315-32", "L2314-33"], juris: ["19-14.224", "24-16.408", "24-22.914"],
        quand: function (D) {
          if (!D.dateReunionDesignation) return null;
          return { iso: D.dateReunionDesignation,
            libelle: "Désignation en réunion du " + dateFr(D.dateReunionDesignation),
            note: D.dateFinMandats ? "Le mandat des membres désignés prend fin avec celui des élus, le " + dateFr(D.dateFinMandats) + "." : "" };
        },
        doc: { modele: "designation-commission", nom: "Délibération de désignation des membres",
          pre: function (P, D) { return { entreprise: P.denomination,
            commission: "commission santé, sécurité et conditions de travail",
            dateReunion: D.dateReunionDesignation, dateFinMandat: D.dateFinMandats,
            troisiemeCollege: D.troisiemeCollege === "oui"
              ? ["Un troisième collège est institué : un siège au moins revient à un élu le représentant"] : [] }; } } },
      { id: "c5", nom: "Délimiter les attributions déléguées — et ce qui ne se délègue pas",
        docProduit: "CSE-CTL-SST-05",
        risque: "La commission se voit confier, par délégation du comité, tout ou partie des attributions relatives à la santé, à la sécurité et aux conditions de travail, à l'exception du recours à un expert et des attributions consultatives du comité (L. 2315-38), disposition d'ordre public (Soc., 13 mai 2026, n° 25-12.560). Un avis rendu par la seule commission, ou une expertise qu'elle aurait décidée, est irrégulier, et l'accord qui l'aurait prévu ne peut pas y suppléer.",
        conseil: "Écrivez la délégation en deux colonnes : ce qui est confié, et ce qui reste au comité. Relisez l'accord ou le règlement intérieur du comité sous cet angle, car les clauses qui débordent sont rarement explicites — elles se glissent dans un « la commission est consultée sur… ». Reprenez, s'il y en a, les avis rendus et les expertises décidées par la seule commission : ils se refont au comité, et mieux vaut le faire avant qu'un tiers ne le relève.",
        quoi: "La commission reçoit, par délégation du comité, tout ou partie des attributions relatives à la santé, à la sécurité et aux conditions de travail. Deux choses ne se délèguent pas : le recours à un expert et les attributions consultatives du comité.",
        fond: ["L2315-38", "L2315-41"], juris: ["25-12.560"] },
      { id: "c6", nom: "Constituer la commission économique",
        docProduit: "CSE-CTL-COM-02",
        risque: "En l'absence d'accord prévu à l'article L. 2315-45, dans les entreprises d'au moins mille salariés, une commission économique est créée au sein du comité ou du comité central et chargée notamment d'étudier les documents économiques et financiers qu'il recueille (L. 2315-46). Elle comprend au maximum cinq membres représentants du personnel, dont au moins un représentant de la catégorie des cadres, désignés par le comité parmi ses membres (L. 2315-47), et se réunit au moins deux fois par an (L. 2315-48). Une commission constituée sans cadre, ou au-delà de cinq membres, est irrégulièrement composée ; et le comité qui ne la constitue pas se prive de l'organe que la loi charge de cet examen.",
        conseil: "Vérifiez d'abord qu'aucun accord n'organise autrement les commissions : le régime supplétif ne joue qu'à défaut, et l'appliquer par-dessus un accord existant crée une commission de trop. Arrêtez le calendrier des deux réunions annuelles dès la constitution et portez-le au procès-verbal ; une commission qui ne se réunit jamais laisse une trace plus embarrassante que son absence. L'audition d'un cadre supérieur ou d'un dirigeant suppose l'accord de l'employeur : demandez-le par écrit et à l'avance.",
        quoi: "À défaut d'accord prévoyant des commissions supplémentaires, une commission économique est créée dans les entreprises d'au moins mille salariés. Elle est présidée par l'employeur, comprend au maximum cinq membres représentants du personnel dont au moins un cadre, et se réunit au moins deux fois par an.",
        fond: ["L2315-45", "L2315-46", "L2315-47", "L2315-48"],
        si: function (P) { return seuil(P, 1000); },
        doc: { modele: "designation-commission", nom: "Délibération de désignation des membres",
          pre: function (P, D) { return { entreprise: P.denomination, commission: "commission économique",
            dateReunion: D.dateReunionDesignation, dateFinMandat: D.dateFinMandats }; } } },
      { id: "c7", nom: "Constituer la commission de la formation",
        docProduit: "CSE-CTL-COM-01",
        risque: "En l'absence d'accord prévu à l'article L. 2315-45, dans les entreprises d'au moins trois cents salariés, le comité constitue une commission de la formation, chargée de préparer ses délibérations prévues aux 1° et 3° de l'article L. 2312-17 dans les domaines qui relèvent de sa compétence, d'étudier les moyens de favoriser l'expression des salariés en matière de formation et les problèmes spécifiques concernant l'emploi et le travail des jeunes et des travailleurs handicapés (L. 2315-49). Sa non-constitution prive ces délibérations de la préparation que la loi organise, et la consultation qui suit peut être discutée à ce titre.",
        conseil: "Rattachez la constitution au calendrier de la consultation sur la politique sociale : une commission créée après que le comité a délibéré n'aura rien préparé. Fixez dès la résolution ce que la commission remettra et à quelle date, antérieure à la réunion du comité. Et vérifiez le seuil de trois cents salariés sur douze mois consécutifs de relevés, non sur l'effectif du jour.",
        quoi: "À défaut d'accord de l'article L. 2315-45, dans les entreprises d'au moins trois cents salariés, le comité constitue une commission de la formation, chargée de préparer ses délibérations, d'étudier les moyens de favoriser l'expression des salariés en matière de formation et les problèmes d'emploi des jeunes et des travailleurs handicapés.",
        fond: ["L2315-45", "L2315-49"],
        si: function (P) { return seuil(P, 300); } },
      { id: "c8", nom: "Constituer la commission d'information et d'aide au logement",
        docProduit: "CSE-CTL-COM-01",
        risque: "En l'absence d'accord prévu à l'article L. 2315-45, dans les entreprises d'au moins trois cents salariés, une commission d'information et d'aide au logement est créée au sein du comité (L. 2315-50) ; elle recherche les possibilités d'offre de logements en liaison avec les organismes habilités à collecter la participation des employeurs à l'effort de construction, informe les salariés sur leurs conditions d'accès à la propriété ou à la location et les assiste dans leurs démarches (L. 2315-51). Elle propose en outre, dans chaque entreprise, des critères de classement des salariés candidats, que le comité examine pour avis (L. 2315-52). Faute de commission, ces propositions n'existent pas et l'attribution se fait hors du cadre que le texte organise.",
        conseil: "Les entreprises de moins de trois cents salariés peuvent se grouper entre elles pour former cette commission : c'est la voie à examiner lorsque le seuil est proche, plutôt que d'attendre de le franchir. Écrivez les critères de classement avant la première demande, et non à son occasion : c'est le classement improvisé qui se conteste. Conservez, pour chaque salarié assisté, la trace des démarches accomplies — c'est la seule preuve du travail de cette commission.",
        quoi: "À défaut d'accord de l'article L. 2315-45, dans les entreprises d'au moins trois cents salariés. Elle recherche les offres de logement, informe les salariés sur l'accès à la propriété ou à la location et les assiste dans leurs démarches ; les entreprises de moins de trois cents salariés peuvent se grouper pour la former.",
        fond: ["L2315-45", "L2315-50", "L2315-51", "L2315-52", "L2315-53"],
        si: function (P) { return seuil(P, 300); } },
      { id: "c9", nom: "Constituer la commission de l'égalité professionnelle",
        docProduit: "CSE-CTL-COM-01",
        risque: "En l'absence d'accord prévu à l'article L. 2315-45, dans les entreprises d'au moins trois cents salariés, une commission de l'égalité professionnelle est créée au sein du comité et chargée notamment de préparer ses délibérations prévues au 3° de l'article L. 2312-17, dans les domaines qui relèvent de sa compétence (L. 2315-56). Sa non-constitution prive de préparation la consultation sur la politique sociale, dans un domaine où l'insuffisance des informations est le premier terrain de discussion.",
        conseil: "Faites coïncider les travaux de la commission avec la mise à disposition des indicateurs dans la base de données : elle ne peut préparer qu'à partir de chiffres, et elle les demandera. Distinguez son rôle de celui de la négociation obligatoire : la commission prépare une délibération du comité, elle ne négocie pas, et confondre les deux fait perdre les deux. Datez la remise de son rapport au comité et faites-la figurer à l'ordre du jour.",
        quoi: "À défaut d'accord de l'article L. 2315-45, dans les entreprises d'au moins trois cents salariés. Elle prépare notamment les délibérations du comité sur la politique sociale dans les domaines qui relèvent de sa compétence.",
        fond: ["L2315-45", "L2315-56"],
        si: function (P) { return seuil(P, 300); } },
      { id: "c10", nom: "Constituer la commission des marchés",
        docProduit: "CSE-CTL-COM-03",
        risque: "Une commission des marchés est créée au sein du comité qui dépasse, pour au moins deux des trois critères, les seuils de l'article D. 2315-29 : cinquante salariés à la clôture d'un exercice, le montant de ressources annuelles et le montant du total du bilan prévus à l'article R. 612-1 du code de commerce (L. 2315-44-1). Ses membres sont désignés parmi les membres titulaires, et le règlement intérieur du comité fixe son fonctionnement, le nombre de ses membres, les modalités de leur désignation et la durée de leur mandat (L. 2315-44-3). Au-delà du seuil de 30 000 euros fixé par le même article D. 2315-29, le comité détermine, sur proposition de la commission, les critères de choix des fournisseurs et la procédure d'achat, la commission choisissant les fournisseurs et rendant compte de ses choix au moins une fois par an (L. 2315-44-2) : faute de commission, ces critères ne sont pas arrêtés et le compte rendu annuel n'a pas lieu.",
        conseil: "Le critère porte sur les comptes du comité, non sur l'effectif de l'entreprise : c'est à la clôture de chaque exercice, comptes en main, que le dépassement se constate, et l'obligation peut naître d'une année sur l'autre. Tenez un registre des marchés portant, pour chacun, le montant, la date, le fournisseur retenu et le critère appliqué. Le seuil de 30 000 euros se regarde marché par marché : le fractionnement d'un achat en plusieurs commandes est l'irrégularité qui se lit le mieux dans les comptes.",
        quoi: "Elle est créée au sein du comité qui dépasse, pour au moins deux des trois critères, les seuils du décret : cinquante salariés à la clôture d'un exercice, le montant de ressources annuelles et le total du bilan de l'article R. 612-1 du code de commerce. Ses membres sont désignés parmi les titulaires ; le règlement intérieur du comité fixe son fonctionnement. Au-delà de 30 000 euros, le comité détermine, sur proposition de la commission, les critères de choix des fournisseurs et la procédure d'achat ; la commission choisit les fournisseurs et rend compte au moins une fois par an.",
        fond: ["L2315-44-1", "L2315-44-2", "L2315-44-3", "D2315-29"],
        /* Les trois critères sont ceux des COMPTES DU COMITÉ (L. 2315-64, II),
           non l'effectif de l'entreprise : l'étape ne peut donc pas se déduire
           du profil, elle se demande. Défaut signalé le 1er septembre 2026 —
           elle s'affichait à un comité de 74 salariés, seule étape du parcours
           dépourvue de condition quand les commissions économique (1 000),
           formation, logement et égalité (300) en portaient une.

           Tant que la question n'a pas de réponse, l'étape reste masquée —
           contrairement aux autres conditions du fichier, qui affichent dans
           le doute. La raison tient au texte : la commission est créée « au
           sein du comité QUI DÉPASSE » les seuils, elle n'existe donc pas tant
           que le dépassement n'est pas constaté, et il ne se constate que
           comptes en main. La question, elle, reste posée en tête du parcours :
           rien n'est retiré en silence. */
        si: function (P, D) { return D.seuilsMarches === "oui"; },
        doc: { modele: "designation-commission", nom: "Délibération de désignation des membres",
          pre: function (P, D) { return { entreprise: P.denomination, commission: "commission des marchés",
            dateReunion: D.dateReunionDesignation, dateFinMandat: D.dateFinMandats }; } } },
      { id: "c11", nom: "Créer, s'il y a lieu, les commissions supplémentaires",
        risque: "Les commissions supplémentaires ne peuvent être créées que par un accord d'entreprise conclu dans les conditions prévues au premier alinéa de l'article L. 2232-12 (L. 2315-45), c'est-à-dire signé par l'employeur et par des organisations syndicales représentatives ayant recueilli plus de 50 % des suffrages exprimés en faveur d'organisations représentatives au premier tour des dernières élections des titulaires au comité. À défaut, l'accord signé au-delà de 30 % de ces suffrages ne vaut que s'il est approuvé par les salariés à la majorité des suffrages exprimés ; faute d'approbation, il est réputé non écrit (L. 2232-12), et les commissions qu'il institue n'ont alors pas de base.",
        conseil: "Vérifiez le pourcentage avant de signer, sur le procès-verbal des dernières élections et non de mémoire : c'est un calcul, il se pose par écrit et se joint à l'accord. Prévoyez dans l'accord ce que chaque commission remettra et à quelle échéance, faute de quoi elle vivra sans produire. Les experts et techniciens que l'employeur peut adjoindre avec voix consultative sont tenus au secret professionnel et à l'obligation de discrétion : rappelez-le-leur par écrit à leur entrée en fonction.",
        quoi: "Un accord d'entreprise conclu dans les conditions du premier alinéa de l'article L. 2232-12 peut prévoir des commissions supplémentaires pour l'examen de problèmes particuliers. Leurs rapports sont soumis à la délibération du comité.",
        fond: ["L2315-45", "L2232-12"],
        conv: "l'existence de commissions conventionnelles et des moyens qui leur sont attachés" },
      { id: "c12", nom: "Former les élus",
        champDate: "dateFormation",
        docProduit: "SST-CTL-CSS-05",
        risque: "Les membres de la délégation du personnel du comité et le référent en matière de lutte contre le harcèlement sexuel et les agissements sexistes bénéficient de la formation nécessaire à l'exercice de leurs missions en matière de santé, de sécurité et de conditions de travail : cinq jours au minimum lors du premier mandat et, en cas de renouvellement, trois jours pour chaque membre quelle que soit la taille de l'entreprise, cinq jours pour les membres de la commission santé, sécurité et conditions de travail dans les entreprises d'au moins trois cents salariés (L. 2315-18). Le financement est pris en charge par l'employeur, et le temps consacré à la formation est pris sur le temps de travail, rémunéré comme tel, et n'est pas déduit des heures de délégation (L. 2315-16). Un élu non formé exerce des missions pour lesquelles la loi le veut préparé, et les jours dus restent dus.",
        conseil: "Distinguez dès le départ les deux formations et leurs financements : celle de santé, sécurité et conditions de travail est à la charge de l'employeur, le stage de formation économique est financé par le comité. Recensez les bénéficiaires en séparant premiers mandats et renouvellements, car la durée n'est pas la même, et programmez les sessions au début du mandat plutôt qu'à sa fin. Recueillez les attestations de présence nominatives et datées : elles seules établissent que la formation a été dispensée.",
        quoi: "Les membres de la délégation du personnel et le référent harcèlement bénéficient de la formation nécessaire en matière de santé, de sécurité et de conditions de travail : cinq jours au moins lors du premier mandat ; en cas de renouvellement, trois jours pour chaque élu et cinq jours pour les membres de la commission santé-sécurité dans les entreprises d'au moins trois cents salariés. Le financement est à la charge de l'employeur.",
        fond: ["L2315-18"],
        quand: function (D) {
          if (!D.datePremierMandat) return null;
          return { iso: D.dateFormation || null,
            libelle: D.dateFormation ? "Formation dispensée le " + dateFr(D.dateFormation)
              : "Formation à organiser — mandat ouvert le " + dateFr(D.datePremierMandat),
            note: "Le code ne fixe pas de date butoir : il fixe une durée minimale et met le financement à la charge de l'employeur. Une formation repoussée reste une formation due." };
        } },
      { id: "c13", nom: "Tenir la première réunion et rendre compte au comité",
        champDate: "datePremiereReunionCom",
        risque: "Une commission travaille pour le comité : les rapports des commissions sont soumis à la délibération du comité (L. 2315-45), la commission des marchés rend compte de ses choix au moins une fois par an selon les modalités déterminées par le règlement intérieur du comité (L. 2315-44-2), et la commission économique se réunit au moins deux fois par an (L. 2315-48). Une commission qui ne rend pas compte laisse la délibération du comité sans la préparation que la loi organise, et ses travaux, faute d'écrit, ne se démontrent pas.",
        conseil: "Établissez un compte rendu de chaque réunion, daté et signé, même bref : c'est la pièce qui fait exister le travail de la commission, et rien ne la remplace. Faites inscrire la présentation du rapport à l'ordre du jour du comité, sans quoi il restera dans un dossier. Fixez à la première réunion le rythme et les échéances de l'année et tenez-vous-y : c'est la régularité qui se contrôle, non l'intensité.",
        quoi: "Une commission travaille pour le comité : ses rapports sont soumis à la délibération du comité, et la commission des marchés lui rend compte de ses choix au moins une fois par an. Établissez un compte rendu de chaque réunion : c'est la pièce qui fait exister le travail de la commission.",
        fond: ["L2315-45", "L2315-44-2", "L2315-48"],
        quand: function (D) {
          if (!D.datePremiereReunionCom) return null;
          return { iso: D.datePremiereReunionCom, libelle: "Première réunion le " + dateFr(D.datePremiereReunionCom) };
        },
        doc: { modele: "cr-commission", nom: "Compte rendu de réunion de commission",
          pre: function (P, D) { return { entreprise: P.denomination,
            commission: "commission santé, sécurité et conditions de travail",
            dateReunion: D.datePremiereReunionCom }; } } },
      { id: "c14", nom: "L'expertise reste au comité",
        docProduit: "CSE-CTL-EXP-04",
        risque: "Le comité peut, le cas échéant sur proposition des commissions constituées en son sein, décider de recourir à un expert-comptable ou à un expert habilité (L. 2315-78 ; L. 2315-94), mais le recours à l'expert est expressément exclu des attributions délégables à la commission santé, sécurité et conditions de travail (L. 2315-38), disposition d'ordre public (Soc., 13 mai 2026, n° 25-12.560). Une expertise décidée par la commission, ou attribuée à l'employeur, est irrégulière. La répartition du coût suit ensuite le cas de recours, l'article L. 2315-80 distinguant la prise en charge par l'employeur, le partage à 20 % et 80 %, et la prise en charge par l'employeur en cas d'insuffisance du budget de fonctionnement.",
        conseil: "Faites figurer au procès-verbal deux actes distincts : la proposition de la commission, s'il y en a une, et la délibération du comité qui décide. C'est cette délibération et sa date qui ouvrent le délai de dix jours dont l'employeur dispose pour contester, et l'imprécision profite à celui qui conteste. Qualifiez le cas de recours avant de délibérer, car c'est lui qui commande la répartition du coût : lorsque l'employeur a dû suppléer l'insuffisance du budget de fonctionnement, le comité se trouve privé, trois années durant, de la faculté d'en transférer l'excédent aux activités sociales et culturelles.",
        quoi: "Le comité peut, le cas échéant sur proposition des commissions constituées en son sein, décider de recourir à un expert-comptable ou à un expert habilité. La décision, elle, appartient au comité : elle se prend par résolution en réunion, et ne se délègue pas à la commission.",
        fond: ["L2315-78", "L2315-38", "L2315-94", "L2315-80"], juris: ["23-22.270", "25-12.560"],
        doc: { modele: "resolution-expert", nom: "Résolution de recours à l'expert",
          pre: function (P, D) { return { entreprise: P.denomination }; } } },
    ]
  },

  /* ================================================================== */
  /* 4. TENIR UNE RÉUNION DU COMITÉ                                     */
  /* ================================================================== */
  {
    cle: "reunion",
    suite: { cle: "commissions", pourquoi: "Les commissions du comité — santé-sécurité en tête — se constituent une fois le comité en marche." },
    nom: "Tenir une réunion du CSE",
    resume: "Périodicité, ordre du jour établi conjointement, communication trois jours au moins avant, informations et délais d'avis, réclamations, procès-verbal, diffusion et suites.",
    audit: { href: "audit-cse.html", nom: "l'audit du comité social et économique" },
    jx: "cse-reunion",
    donnees: [
      { c: "dateReunion", nom: "Date de la réunion", t: "date" },
      { c: "heure", nom: "Heure", t: "time" },
      { c: "lieu", nom: "Lieu (et lien de visioconférence, le cas échéant)", t: "text" },
      { c: "president", nom: "Président du comité (nom, qualité)", t: "text" },
      { c: "secretaire", nom: "Secrétaire du comité (nom)", t: "text" },
      { c: "accordPeriodicite", nom: "Un accord fixe-t-il la périodicité des réunions ?", t: "oui-non" },
      { c: "dateOrdreDuJour", nom: "Date d'envoi de l'ordre du jour", t: "date" },
      { c: "consultation", nom: "Une consultation est-elle inscrite ?", t: "select",
        options: ["aucune", "orientations stratégiques", "situation économique et financière",
          "politique sociale, conditions de travail et emploi", "consultation ponctuelle"] },
      { c: "expertise", nom: "Une expertise est-elle en cours sur cette consultation ?", t: "oui-non" },
      { c: "dateDebutConsultation", nom: "Date de communication des informations de la consultation", t: "date",
        si: function (P, D) { return D.consultation && D.consultation !== "aucune" ? true : (D.consultation === "aucune" ? false : null); } },
      { c: "reclamations", nom: "Des réclamations ont-elles été remises ?", t: "oui-non" },
      { c: "dateNoteReclamations", nom: "Date de remise de la note écrite de réclamations", t: "date",
        si: function (P, D) { return D.reclamations === "oui" ? true : (D.reclamations === "non" ? false : null); } },
      { c: "datePV", nom: "Date d'établissement du procès-verbal", t: "date" },
      { c: "procedureL1233_30", nom: "La réunion relève-t-elle de la consultation de l'article L. 1233-30 (licenciement collectif) ?", t: "oui-non" },
    ],
    prealable: [
      { id: "odj", g: "information", nom: "Les points à inscrire, arrêtés avec le secrétaire",
        aide: "L'ordre du jour est établi par le président ET le secrétaire : un ordre du jour établi par le seul président n'est pas un ordre du jour (art. L. 2315-29)." },
      { id: "consult", g: "information", nom: "Les consultations obligatoires en cours ou dues",
        aide: "Elles sont inscrites de plein droit à l'ordre du jour par le président ou le secrétaire (art. L. 2315-29)." },
      { id: "infos2", g: "document", nom: "Les informations précises et écrites nécessaires à l'avis",
        aide: "Le comité dispose d'un délai d'examen suffisant et d'informations précises et écrites (art. L. 2312-15)." },
      { id: "pvprec", g: "document", nom: "Le procès-verbal de la précédente réunion",
        aide: "L'employeur fait connaître sa décision motivée sur les propositions à la réunion suivant la transmission (art. L. 2315-34)." },
      { id: "liste", g: "information", nom: "La liste des destinataires de l'ordre du jour",
        aide: "Membres du comité, agent de contrôle de l'inspection du travail, agent des services de prévention des organismes de sécurité sociale (art. L. 2315-30)." },
      { id: "notes", g: "pièce", nom: "La note écrite de réclamations, si elle a été remise",
        aide: "Deux jours ouvrables avant la réunion ; la réponse écrite motivée est due dans les six jours ouvrables suivants (art. L. 2315-22).",
        si: function (P, D) { return D.reclamations === "oui" ? true : (D.reclamations === "non" ? false : null); } },
      { id: "accper", g: "document", nom: "L'accord sur la périodicité des réunions et les délais d'avis, s'il existe",
        aide: "Il l'emporte sur le supplétif (art. L. 2315-28 et L. 2312-16)." },
    ],
    etapes: [
      { id: "r1", nom: "Vérifier la périodicité",
        docProduit: "CSE-CTL-CON-05",
        risque: "À défaut d'accord, le comité se réunit au moins une fois par mois dans les entreprises d'au moins trois cents salariés et au moins une fois tous les deux mois en deçà, une seconde réunion pouvant être tenue à la demande de la majorité de ses membres (L. 2315-28) ; au moins quatre réunions annuelles portent, en tout ou partie, sur ses attributions en matière de santé, de sécurité et de conditions de travail (L. 2315-27). Le fait d'apporter une entrave au fonctionnement régulier du comité est puni d'une amende de 7 500 euros (L. 2317-1). L'article L. 2315-27 prévoit en outre que, lorsque l'employeur est défaillant et à la demande d'au moins la moitié des membres, le comité peut être convoqué par l'agent de contrôle de l'inspection du travail et siéger sous sa présidence.",
        conseil: "Arrêtez le calendrier de l'année entière dès la première réunion et diffusez-le : les réunions manquées se rattrapent mal, et l'oubli se lit sur une simple liste de dates. Marquez sur ce calendrier les quatre réunions consacrées à la santé et à la sécurité, communiquez-le à l'inspection du travail, au médecin du travail et à l'agent des services de prévention, puis confirmez-leur par écrit la tenue de chacune quinze jours au moins à l'avance — c'est cette confirmation qui s'oublie. Une seconde réunion demandée par la majorité des membres se convoque, elle ne se discute pas.",
        quoi: "À défaut d'accord, le comité se réunit au moins une fois par mois à partir de trois cents salariés, au moins une fois tous les deux mois en dessous. Il peut tenir une seconde réunion à la demande de la majorité de ses membres. Et au moins quatre réunions par an portent, en tout ou partie, sur la santé, la sécurité et les conditions de travail.",
        fond: ["L2315-28", "L2315-27", "L2315-31"],
        conv: "une périodicité de réunions, des délais d'avis ou des réunions supplémentaires propres à la branche",
        quand: function (D, P) {
          if (!D.dateReunion) return null;
          var trois = seuil(P, 300);
          if (trois === null) return { iso: D.dateReunion, libelle: "Réunion du " + dateFr(D.dateReunion),
            note: "Renseignez l'effectif dans le profil pour connaître la périodicité supplétive." };
          var t = moisApres(D.dateReunion, trois ? 1 : 2);
          return { iso: null, libelle: "Réunion du " + dateFr(D.dateReunion) + " — la suivante avant le " + dateFr(t),
            note: trois ? "Au moins une réunion par mois à partir de trois cents salariés, à défaut d'accord (art. L. 2315-28)."
                        : "Au moins une réunion tous les deux mois en dessous de trois cents salariés, à défaut d'accord (art. L. 2315-28)." };
        } },
      { id: "r2", nom: "Établir l'ordre du jour conjointement",
        docProduit: "CSE-CTL-CON-05",
        risque: "L'ordre du jour de chaque réunion est établi par le président et le secrétaire ; seules les consultations rendues obligatoires par une disposition législative ou réglementaire ou par un accord collectif y sont inscrites de plein droit par l'un ou par l'autre (L. 2315-29). Lorsque le comité se réunit à la demande de la majorité de ses membres, les questions jointes à la demande de convocation sont inscrites à l'ordre du jour (L. 2315-31). Un ordre du jour arrêté unilatéralement en dehors de ces cas expose l'employeur à la qualification d'entrave au fonctionnement régulier du comité, punie d'une amende de 7 500 euros (L. 2317-1), qu'il appartient au juge de retenir ou d'écarter.",
        conseil: "Conservez la trace de l'échange avec le secrétaire — projet adressé, réponse, arbitrage : c'est l'absence de trace, plus que le désaccord, qui fait présumer l'ordre du jour unilatéral. Distinguez dans le document, par une mention explicite, les points inscrits de plein droit de ceux qui sont convenus ; la distinction se lit alors sans explication. Prévoyez un délai interne d'une semaine pour cet échange, faute de quoi le délai de communication de trois jours sera manqué.",
        jx: "cse-reunion",
        quoi: "L'ordre du jour de chaque réunion est établi par le président et le secrétaire. Les consultations rendues obligatoires par un texte ou par un accord collectif y sont inscrites de plein droit par l'un ou par l'autre. Lorsque la réunion se tient à la demande de la majorité des membres, les questions jointes à la demande y sont inscrites.",
        fond: ["L2315-29", "L2315-31"], juris: ["11-28.324"] },
      { id: "r3", nom: "Communiquer l'ordre du jour trois jours au moins avant",
        champDate: "dateOrdreDuJour",
        docProduit: "CSE-CTL-CON-05",
        risque: "L'ordre du jour est communiqué par le président aux membres du comité, à l'agent de contrôle de l'inspection du travail et à l'agent des services de prévention des organismes de sécurité sociale trois jours au moins avant la réunion (L. 2315-30). Une communication tardive, ou faite aux seuls élus, prive les destinataires du temps que le texte leur reconnaît et expose l'employeur à la qualification d'entrave au fonctionnement régulier du comité, punie d'une amende de 7 500 euros (L. 2317-1), qu'il appartient au juge de retenir ou d'écarter.",
        conseil: "Envoyez le même document, le même jour, aux trois destinataires : ce sont l'inspection du travail et l'agent des services de prévention que l'on omet. Choisissez un mode d'envoi qui date et conservez l'accusé, car trois jours ne se prouvent pas autrement. Joignez les documents nécessaires plutôt que de les annoncer : un point inscrit sans pièce se reporte, et le report coûte une réunion.",
        jx: "cse-reunion",
        quoi: "L'ordre du jour est communiqué par le président aux membres du comité, à l'agent de contrôle de l'inspection du travail et à l'agent des services de prévention des organismes de sécurité sociale, trois jours au moins avant la réunion.",
        fond: ["L2315-30"],
        quand: function (D) {
          if (!D.dateReunion) return null;
          var t = jours(D.dateReunion, -3);
          return { iso: t, libelle: "Envoi au plus tard le " + dateFr(t),
            note: D.dateOrdreDuJour
              ? ("Envoi renseigné au " + dateFr(D.dateOrdreDuJour) + " — soit " +
                 joursEntre(D.dateOrdreDuJour, D.dateReunion) + " jour(s) avant la réunion.")
              : "Trois jours au moins avant la réunion (art. L. 2315-30)." };
        },
        doc: { modele: "convocation", nom: "Convocation et ordre du jour",
          pre: function (P, D) { return { entreprise: P.denomination, effectif: P.effectif,
            president: D.president, secretaire: D.secretaire, dateReunion: D.dateReunion,
            heure: D.heure, lieu: D.lieu, dateEnvoi: D.dateOrdreDuJour }; } } },
      { id: "r4", nom: "Remettre les informations nécessaires à l'avis",
        champDate: "dateDebutConsultation",
        docProduit: "CSE-CTL-CON-03",
        risque: "Le comité dispose d'un délai d'examen suffisant, d'informations précises et écrites transmises ou mises à disposition par l'employeur, et de la réponse motivée de l'employeur à ses propres observations (L. 2312-15). S'il estime ne pas disposer d'éléments suffisants, il peut saisir le président du tribunal judiciaire statuant selon la procédure accélérée au fond pour qu'il ordonne la communication des éléments manquants, et le juge peut, en cas de difficultés particulières d'accès aux informations, décider la prolongation du délai. Les décisions de l'employeur étant précédées de la consultation du comité (L. 2312-14), la décision prise au terme d'une consultation privée d'informations suffisantes n'a pas été régulièrement précédée de celle-ci.",
        conseil: "Datez la remise, ou l'information de la mise à disposition dans la base de données, par un bordereau : c'est de cette date que court le délai, et c'est la première chose que l'on vous demandera. Remettez un écrit, même bref, plutôt qu'une présentation en séance ; un diaporama projeté n'est pas une information écrite transmise. Répondez par écrit aux observations avant que l'avis ne soit rendu, et non après : la réponse motivée fait partie de ce dont le comité doit disposer pour se prononcer.",
        quoi: "Le comité émet des avis et des vœux ; il dispose à cette fin d'un délai d'examen suffisant et d'informations précises et écrites transmises ou mises à disposition par l'employeur, ainsi que de la réponse motivée de l'employeur à ses observations.",
        fond: ["L2312-15", "L2312-14", "L2312-8"],
        si: function (P, D) { return D.consultation && D.consultation !== "aucune" ? true : (D.consultation === "aucune" ? false : null); } },
      { id: "r5", nom: "Tenir le délai d'avis",
        docProduit: "CSE-CTL-CON-02",
        risque: "À l'expiration du délai, le comité est réputé avoir été consulté et avoir rendu un avis négatif (L. 2312-16). À défaut d'accord, ce délai est d'un mois, porté à deux mois en cas d'intervention d'un expert et à trois mois en cas d'intervention d'une ou plusieurs expertises dans une consultation se déroulant à la fois au niveau du comité central et d'un ou plusieurs comités d'établissement (R. 2312-6, I). Un avis recueilli après cette date ne rétablit pas la consultation : l'avis négatif est déjà acquis, et la décision prise ensuite repose sur une consultation irrégulière.",
        conseil: "Inscrivez au dossier, dès la remise des informations, la date d'expiration calculée : c'est elle qui commande le calendrier des réunions, et non l'inverse. Lorsque les deux niveaux sont consultés, prévoyez que l'avis de chaque comité d'établissement soit rendu et transmis au comité central au plus tard sept jours avant l'échéance de celui-ci : ce décalage de sept jours est le plus souvent manqué. Datez la désignation de l'expert, car c'est elle, et non l'annonce d'une demande d'expertise, qui produit l'allongement du délai.",
        quoi: "L'accord ou, à défaut, le décret fixe les délais dans lesquels les avis sont rendus. À défaut d'accord : un mois ; deux mois en cas d'expertise ; trois mois en cas d'expertises menées à la fois au niveau central et au niveau des établissements. À l'expiration, le comité est réputé consulté et avoir rendu un avis négatif.",
        fond: ["L2312-16", "R2312-6"],
        si: function (P, D) { return D.consultation && D.consultation !== "aucune" ? true : (D.consultation === "aucune" ? false : null); },
        quand: function (D, P) {
          if (!D.dateDebutConsultation) return null;
          if (D.accordPeriodicite === "oui")
            return { iso: null, libelle: "Délai fixé par votre accord",
              note: "L'accord de l'article L. 2312-16 l'emporte sur le supplétif : reportez-vous à sa stipulation." };
          var mois = D.expertise === "oui" ? 2 : 1;
          var t = moisApres(D.dateDebutConsultation, mois);
          return { iso: t, libelle: "Avis réputé rendu le " + dateFr(t),
            note: (mois === 2 ? "Deux mois en cas d'intervention d'un expert" : "Un mois à défaut d'accord") +
              " (art. R. 2312-6). Le délai est porté à trois mois en cas d'expertises menées à la fois au niveau du comité central et d'un ou plusieurs comités d'établissement." };
        } },
      { id: "r6", nom: "Traiter les réclamations",
        risque: "La délégation du personnel présente à l'employeur les réclamations individuelles ou collectives relatives aux salaires, à l'application du code du travail et des autres dispositions légales ainsi que des conventions et accords applicables dans l'entreprise (L. 2312-5). Sauf circonstances exceptionnelles, ses membres remettent à l'employeur une note écrite exposant l'objet des demandes deux jours ouvrables avant la date à laquelle ils doivent être reçus, et l'employeur répond par écrit au plus tard dans les six jours ouvrables suivant la réunion ; les demandes et les réponses motivées sont transcrites sur un registre spécial ou annexées à celui-ci, tenu à la disposition des salariés pendant un jour ouvrable par quinzaine et en dehors de leur temps de travail, ainsi qu'à celle de l'agent de contrôle de l'inspection du travail (L. 2315-22). Ne pas recevoir la délégation, ne pas répondre par écrit ou ne pas tenir ce registre expose l'employeur à la qualification d'entrave au fonctionnement régulier du comité, punie d'une amende de 7 500 euros (L. 2317-1), qu'il appartient au juge de retenir ou d'écarter.",
        conseil: "Tenez le registre spécial dès la première réclamation plutôt que de le reconstituer : il se contrôle sur place, et son absence se constate en un instant. Répondez par écrit et point par point, en reprenant la numérotation de la note remise ; une réponse d'ensemble laisse subsister autant de réclamations que de points non traités. Comptez les six jours en jours ouvrables à partir de la réunion, et fixez dans l'entreprise le jour ouvrable par quinzaine pendant lequel le registre est consultable.",
        quoi: "La délégation du personnel présente à l'employeur les réclamations individuelles ou collectives. Sauf circonstances exceptionnelles, elle remet une note écrite deux jours ouvrables avant la réunion ; l'employeur répond par écrit, de façon motivée, au plus tard dans les six jours ouvrables suivant la réunion.",
        fond: ["L2312-5", "L2315-22"],
        si: function (P, D) { return D.reclamations === "oui" ? true : (D.reclamations === "non" ? false : null); },
        quand: function (D) {
          if (!D.dateReunion) return null;
          var t = joursOuvrablesApres(D.dateReunion, 6);
          return { iso: t, libelle: "Réponse écrite motivée au plus tard le " + dateFr(t),
            note: "Six jours ouvrables suivant la réunion (art. L. 2315-22). Le compte est fait hors dimanches ; cette page ne tient pas le calendrier des jours fériés." };
        },
        doc: { modele: "reclamation", nom: "Réponse écrite à une réclamation",
          pre: function (P, D) { return { entreprise: P.denomination, dateReunion: D.dateReunion }; } } },
      { id: "r7", nom: "Établir le procès-verbal",
        champDate: "datePV",
        risque: "Les délibérations du comité sont consignées dans un procès-verbal établi par le secrétaire dans un délai et selon des modalités définis par accord ou, à défaut, par décret (L. 2315-34). À défaut d'accord, le procès-verbal est établi et transmis à l'employeur dans les quinze jours suivant la réunion ou, si une nouvelle réunion est prévue dans ce délai, avant celle-ci ; ce délai est de trois jours dans le cadre de la consultation prévue à l'article L. 1233-30, et d'un jour lorsque l'entreprise est en redressement ou en liquidation judiciaire (D. 2315-26). À défaut d'accord, le procès-verbal contient au moins le résumé des délibérations du comité et la décision motivée de l'employeur sur les propositions faites lors de la précédente réunion : sans lui, la réunion n'a pas de trace opposable et la décision motivée n'est pas consignée.",
        conseil: "Le procès-verbal incombe au secrétaire, mais c'est le calendrier de l'employeur qu'il commande : rappelez l'échéance dès la fin de la réunion, en la datant. Ne laissez pas passer une réunion suivante sans le procès-verbal de la précédente, car le délai se raccourcit d'office dans ce cas. En procédure collective, ou dans une consultation sur un projet de licenciement collectif, le délai se compte en jours et non en semaines : faites prendre les notes pendant la séance plutôt qu'après.",
        jx: "cse-reunion",
        quoi: "Les délibérations sont consignées dans un procès-verbal établi par le secrétaire, dans un délai fixé par accord ou, à défaut, par décret : quinze jours suivant la réunion — trois jours dans la consultation de l'article L. 1233-30, un jour lorsque l'entreprise est en redressement ou en liquidation judiciaire. Si une nouvelle réunion est prévue dans ce délai, le procès-verbal est établi avant elle.",
        fond: ["L2315-34", "D2315-26"],
        quand: function (D) {
          if (!D.dateReunion) return null;
          var n = D.procedureL1233_30 === "oui" ? 3 : 15;
          var t = jours(D.dateReunion, n);
          return { iso: t, libelle: "Procès-verbal à établir au plus tard le " + dateFr(t),
            note: n === 3 ? "Trois jours dans le cadre de la consultation de l'article L. 1233-30 (art. D. 2315-26) ; un jour en redressement ou liquidation judiciaire."
                          : "Quinze jours à défaut d'accord (art. D. 2315-26) ; ou avant la réunion suivante si elle intervient plus tôt." };
        },
        doc: { modele: "pv-cse", nom: "Procès-verbal de réunion",
          pre: function (P, D) { return { entreprise: P.denomination, dateReunion: D.dateReunion,
            lieu: D.lieu, president: D.president, secretaire: D.secretaire }; } } },
      { id: "r8", nom: "Diffuser le procès-verbal après adoption",
        risque: "Le procès-verbal ne peut être affiché ou diffusé dans l'entreprise qu'après avoir été adopté, par le secrétaire du comité et selon des modalités précisées par le règlement intérieur du comité (L. 2315-35). Une diffusion antérieure à l'adoption, ou opérée par un autre que le secrétaire, sort de ce que le texte permet : ce qui circule alors n'est pas le procès-verbal du comité mais un projet, et il n'engage pas le comité.",
        conseil: "Faites voter l'adoption au début de la réunion suivante et portez cette adoption au procès-verbal de celle-ci : sans mention d'adoption, la diffusion se conteste. Écrivez dans le règlement intérieur du comité les modalités de l'affichage — support, emplacement, durée, version diffusée — puisque c'est à lui que le texte renvoie. Diffusez la version adoptée et non le projet corrigé après coup, et conservez les deux.",
        quoi: "Le procès-verbal peut, après avoir été adopté, être affiché ou diffusé dans l'entreprise par le secrétaire.",
        fond: ["L2315-35"] },
      { id: "r9", nom: "Répondre aux propositions, et motiver",
        docProduit: "CSE-CTL-CON-03",
        risque: "Le procès-verbal transmis, l'employeur fait connaître, lors de la réunion du comité suivant cette transmission, sa décision motivée sur les propositions qui lui ont été soumises (L. 2315-34), et il rend compte, en la motivant, de la suite donnée aux avis et vœux du comité (L. 2312-15). À défaut d'accord, cette décision motivée sur les propositions faites lors de la précédente réunion doit d'ailleurs figurer dans le procès-verbal lui-même (D. 2315-26). Le silence, ou la réponse non motivée, expose l'employeur à la qualification d'entrave au fonctionnement régulier du comité, punie d'une amende de 7 500 euros (L. 2317-1), qu'il appartient au juge de retenir ou d'écarter.",
        conseil: "Tenez un tableau de suivi des propositions, avis et vœux : intitulé, date de la réunion, réponse apportée, date de la réponse. Répondez proposition par proposition en motivant chacune ; une réponse d'ensemble, fût-elle circonstanciée, laisse sans réponse celles qu'elle ne nomme pas. La réponse se donne à la réunion suivante et se consigne au procès-verbal de celle-ci : l'annoncer oralement sans la faire consigner revient à ne pas l'avoir donnée.",
        quoi: "Le procès-verbal transmis, l'employeur fait connaître sa décision motivée sur les propositions qui lui ont été soumises lors de la réunion suivante. Il rend compte, en la motivant, de la suite donnée aux avis et vœux du comité.",
        fond: ["L2315-34", "L2312-15"] },
    ]
  },


  /* ================================================================== */
  /* 5. ÉTABLIR OU METTRE À JOUR LE RÈGLEMENT INTÉRIEUR                 */
  /* ================================================================== */
  {
    cle: "ri",
    suite: { cle: "duerp", pourquoi: "Le règlement intérieur porte les mesures d'application de la réglementation santé et sécurité (L. 1321-1, 1°) ; le document unique porte l'évaluation des risques dont ces mesures découlent. Le second se fait après le premier, et l'avis d'accès au document s'affiche au même endroit." },
    nom: "Établir ou mettre à jour le règlement intérieur",
    resume: "Contenu obligatoire et contenu interdit, avis du comité, dépôt au greffe, communication à l'inspection du travail en deux exemplaires, publicité, entrée en vigueur différée d'un mois.",
    audit: { href: "audit-discipline.html", nom: "l'audit discipline et règlement intérieur" },
    jx: "ri",
    donnees: [
      { c: "operation", nom: "S'agit-il d'un premier règlement ou d'une modification ?", t: "select",
        options: ["premier règlement intérieur", "modification", "retrait de clauses"] },
      { c: "origineModification", nom: "Origine de la modification", t: "select",
        options: ["initiative de l'employeur", "injonction de l'inspection du travail"],
        si: function (P, D) { return D.operation === "modification" || D.operation === "retrait de clauses" ? true : (D.operation ? false : null); } },
      { c: "dateFranchissementSeuil", nom: "Date à laquelle le seuil de cinquante salariés a été atteint", t: "date",
        si: function (P) { return seuil(P, 50); },
        aide: "L'obligation s'applique au terme d'un délai de douze mois à compter de la date à laquelle le seuil a été atteint pendant douze mois consécutifs (art. R. 1321-5)." },
      { c: "dateAvisCSE", nom: "Date de l'avis du comité social et économique", t: "date",
        si: function (P) { return P.cseExiste === "non" ? false : true; } },
      { c: "dateDepotGreffe", nom: "Date de dépôt au greffe du conseil de prud'hommes", t: "date" },
      { c: "datePublicite", nom: "Date des mesures de publicité", t: "date" },
      { c: "dateCommunicationInspection", nom: "Date de communication à l'inspecteur du travail", t: "date" },
      { c: "dateEntreeVigueur", nom: "Date d'entrée en vigueur indiquée par le règlement", t: "date" },
    ],
    prealable: [
      { id: "projet", g: "document", nom: "Le projet de règlement intérieur, ou le projet de modification",
        aide: "Le règlement intérieur fixe exclusivement les matières de l'article L. 1321-1 : santé et sécurité, participation au rétablissement de conditions protectrices, règles générales et permanentes de discipline avec la nature et l'échelle des sanctions." },
      { id: "rappels", g: "information", nom: "Les rappels imposés : droits de la défense, harcèlements et agissements sexistes, lanceurs d'alerte",
        aide: "Article L. 1321-2. Leur absence est un manquement de contenu, pas une simple maladresse de rédaction." },
      { id: "echelle", g: "information", nom: "L'échelle des sanctions et la durée maximale de la mise à pied",
        aide: "Une sanction que le règlement ne prévoit pas est une sanction à discuter ; une mise à pied dont la durée n'est pas bornée l'est aussi." },
      { id: "ccnri", g: "document", nom: "La convention collective, au titre « discipline » et « règlement intérieur »",
        aide: "Les droits de la défense peuvent y être définis (art. L. 1321-2, 1°), et elle peut ajouter une procédure disciplinaire." },
      { id: "cseri", g: "information", nom: "La date de la réunion du comité qui rendra l'avis",
        aide: "Le règlement ne peut être introduit qu'après avis du comité (art. L. 1321-4).",
        si: function (P) { return P.cseExiste === "non" ? false : true; } },
      { id: "greffe", g: "information", nom: "Les coordonnées du greffe du conseil de prud'hommes du ressort",
        aide: "C'est là que le règlement est déposé (art. R. 1321-2)." },
      { id: "inspection", g: "information", nom: "Les coordonnées de l'inspection du travail compétente",
        aide: "Le texte lui est transmis en deux exemplaires, accompagné de l'avis du comité (art. L. 1321-4 et R. 1321-4)." },
    ],
    etapes: [
      { id: "i1", nom: "Vérifier que vous êtes concerné, et depuis quand",
        conseil: "Datez le franchissement du seuil à partir des effectifs mois par mois, pas de mémoire : c'est cette date qui fixe l'échéance des douze mois. Gardez le tableau qui l'établit — c'est la première pièce que l'inspection demandera.",
        quoi: "L'établissement d'un règlement intérieur est obligatoire dans les entreprises ou établissements employant au moins cinquante salariés. L'obligation s'applique au terme d'un délai de douze mois à compter de la date à laquelle le seuil a été atteint pendant douze mois consécutifs.",
        fond: ["L1311-2", "R1321-5"], juris: ["17-16.465"],
        risque: "Le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur est puni de l'amende prévue pour les contraventions de la quatrième classe (R. 1323-1) — L. 1311-2, qui pose l'obligation même, ouvre cette énumération. Et sans règlement, aucune échelle de sanctions n'existe : chez l'employeur tenu d'en établir un, une sanction autre que le licenciement ne peut être prononcée que si le règlement la prévoit.",
        quand: function (D, P) {
          if (!D.dateFranchissementSeuil) return null;
          var t = moisApres(D.dateFranchissementSeuil, 12);
          return { iso: t, libelle: "Règlement intérieur dû à compter du " + dateFr(t),
            note: "Douze mois à compter de la date à laquelle le seuil de cinquante salariés a été atteint (art. R. 1321-5)." };
        },
        si: function (P) { return seuil(P, 50); } },
      { id: "i2", nom: "Écrire le règlement intérieur",
        docProduit: "DIS-CTL-RI-01",
        conseil: "Écrivez d'abord les trois matières, les rappels ensuite : un règlement qui commence par la discipline oublie presque toujours la santé-sécurité. Relisez-le une dernière fois en vous demandant, pour chaque phrase, de quelle matière elle relève — celles qui ne relèvent d'aucune n'ont rien à y faire.",
        jx: "ri",
        quoi: "L'employeur y fixe exclusivement trois matières : les mesures d'application de la réglementation santé et sécurité, les conditions de participation des salariés au rétablissement de conditions protectrices, et les règles générales et permanentes de discipline, notamment la nature et l'échelle des sanctions. Le règlement rappelle en outre les droits de la défense, les dispositions sur les harcèlements et les agissements sexistes, et l'existence du dispositif de protection des lanceurs d'alerte. Il est rédigé en français.",
        fond: ["L1321-1", "L1321-2", "L1321-6"],
        risque: "Un règlement qui laisse de côté une matière obligatoire ou omet un rappel imposé méconnaît L. 1321-1 ou L. 1321-2, tous deux dans l'énumération de R. 1323-1 (amende des contraventions de la quatrième classe) ; l'inspecteur du travail peut à tout moment en exiger la modification (L. 1322-1).",
        conv: "les droits de la défense qu'elle définit — l'article L. 1321-2, 1°, renvoie expressément à la convention collective applicable — et toute procédure disciplinaire conventionnelle à reprendre dans le règlement",
        doc: { modele: "echelle-sanctions", nom: "Échelle des sanctions du règlement intérieur",
          pre: function (P, D) { return { entreprise: P.denomination, effectif: P.effectif,
            dateEntreeVigueur: D.dateEntreeVigueur, dateFormalites: D.datePublicite }; } } },
      { id: "i3", nom: "Écarter le contenu interdit",
        docProduit: "DIS-CTL-RI-05",
        conseil: "Passez en revue chaque restriction en vous posant deux questions dans cet ordre : quelle tâche la justifie, et pourquoi rien de moins strict ne suffirait. Une clause qui ne survit pas à ces deux questions écrites ne survivra pas davantage devant l'inspecteur.",
        quoi: "Le règlement ne peut contenir de dispositions contraires aux lois, règlements, conventions et accords collectifs, ni de restrictions aux droits des personnes et aux libertés qui ne seraient pas justifiées ni proportionnées, ni de dispositions discriminatoires. Une clause de neutralité n'est possible que si elle est justifiée et proportionnée.",
        fond: ["L1321-3", "L1321-2-1", "L1331-2"],
        risque: "L'inspecteur du travail peut exiger le retrait ou la modification d'une clause prohibée (L. 1322-1), et une sanction prise sur son fondement est une sanction sans support, que le conseil de prud'hommes peut annuler. Une amende ou sanction pécuniaire est réputée non écrite et expose à l'amende de 3 750 euros de L. 1334-1." },
      { id: "i4", nom: "Soumettre à l'avis du comité social et économique",
        champDate: "dateAvisCSE",
        docProduit: "DIS-CTL-RI-06",
        conseil: "Transmettez le projet aux élus assez tôt pour qu'ils l'aient lu, et faites porter au procès-verbal la mention de l'avis rendu, avec sa date. C'est ce procès-verbal, pas le règlement, qui prouvera plus tard que la formalité a été accomplie — et il accompagnera l'envoi à l'inspection.",
        quoi: "Le règlement intérieur ne peut être introduit qu'après avoir été soumis à l'avis du comité. C'est une formalité substantielle : son défaut ouvre au syndicat la voie du référé en suspension.",
        fond: ["L1321-4"], juris: ["21-10.718", "22-19.726"],
        risque: "Introduit sans l'avis du comité, le règlement l'a été en méconnaissance de L. 1321-4 : amende des contraventions de la quatrième classe (R. 1323-1), suspension en référé ouverte au syndicat, et la consultation omise expose à la qualification d'entrave — 7 500 euros d'amende (L. 2317-1).",
        si: function (P) { return P.cseExiste === "non" ? false : true; },
        quand: function (D) {
          if (!D.dateAvisCSE) return null;
          return { iso: D.dateAvisCSE, libelle: "Avis rendu le " + dateFr(D.dateAvisCSE) };
        },
        doc: { modele: "convocation", nom: "Convocation et ordre du jour du comité",
          pre: function (P, D) { return { entreprise: P.denomination, effectif: P.effectif,
            dateReunion: D.dateAvisCSE,
            points: "Avis du comité sur le projet de règlement intérieur (art. L. 1321-4)" }; } } },
      { id: "i5", nom: "Reconsulter — ou non — en cas de modification",
        docProduit: "DIS-CTL-RI-11",
        conseil: "Une modification se traite comme un premier règlement : reprenez le circuit entier plutôt que de corriger le texte affiché. La seule dispense — les injonctions de l'inspection auxquelles on ne peut que se conformer — se garde par écrit, avec la décision qui la fonde.",
        quoi: "Les mêmes règles s'appliquent en cas de modification ou de retrait de clauses. Une exception : lorsque les modifications résultent uniquement des injonctions de l'inspection du travail auxquelles l'employeur ne peut que se conformer, il n'y a pas lieu à nouvelle consultation.",
        fond: ["L1321-4", "L1322-1"], juris: ["19-15.737"],
        risque: "Une modification introduite sans ces formalités n'a pas été régulièrement introduite : mêmes sanctions que pour le règlement lui-même (R. 1323-1), et l'amende d'entrave de L. 2317-1 si le comité a été contourné.",
        si: function (P, D) { return D.operation === "modification" || D.operation === "retrait de clauses" ? true : (D.operation ? false : null); } },
      { id: "i6", nom: "Déposer au greffe du conseil de prud'hommes",
        champDate: "dateDepotGreffe",
        docProduit: "DIS-CTL-RI-08",
        conseil: "Déposez au greffe du ressort de l'établissement concerné, pas du siège quand ils diffèrent, et conservez le récépissé daté. Sans cette date, l'entrée en vigueur ne se calcule pas.",
        jx: "ri",
        quoi: "Le règlement intérieur est déposé au greffe du conseil de prud'hommes du ressort de l'entreprise ou de l'établissement.",
        fond: ["R1321-2"],
        risque: "Tant que le dépôt n'est pas fait, le délai d'un mois de R. 1321-3 n'a pas commencé de courir et la date d'entrée en vigueur inscrite au règlement ne vaut pas ; R. 1321-2 et R. 1321-3 sont dans l'énumération de R. 1323-1 (amende des contraventions de la quatrième classe).",
        quand: function (D) {
          if (!D.dateDepotGreffe) return null;
          return { iso: D.dateDepotGreffe, libelle: "Déposé le " + dateFr(D.dateDepotGreffe) };
        } },
      { id: "i7", nom: "Communiquer à l'inspecteur du travail, en deux exemplaires, avec l'avis du comité",
        champDate: "dateCommunicationInspection",
        docProduit: "DIS-CTL-RI-09",
        conseil: "Envoyez les deux exemplaires accompagnés de l'avis du comité et gardez la preuve d'envoi. Faites-le le jour même de la publicité : le texte veut que les deux aient lieu en même temps, et deux dates différentes se remarquent.",
        quoi: "En même temps qu'il fait l'objet des mesures de publicité, le règlement intérieur, accompagné de l'avis du comité, est communiqué à l'inspecteur du travail. Le texte lui est transmis en deux exemplaires.",
        fond: ["L1321-4", "R1321-4"],
        risque: "Cette carence se répare par un envoi et ne prive pas le salarié de se prévaloir du règlement, mais elle ouvre la voie à l'exigence de retrait ou de modification de L. 1322-1 sur un texte que l'inspection n'a jamais vu — et, au pénal, L. 1321-4 et R. 1321-4 sont dans l'énumération de R. 1323-1.",
        quand: function (D) {
          if (!D.dateCommunicationInspection) return null;
          return { iso: D.dateCommunicationInspection,
            libelle: "Communiqué le " + dateFr(D.dateCommunicationInspection),
            note: D.datePublicite && D.dateCommunicationInspection !== D.datePublicite
              ? "L'article L. 1321-4 veut que la communication ait lieu « en même temps » que les mesures de publicité, datées ici au " + dateFr(D.datePublicite) + "." : "" };
        } },
      { id: "i8", nom: "Assurer la publicité",
        champDate: "datePublicite",
        docProduit: "DIS-CTL-RI-07",
        conseil: "Affichez à un endroit accessible sans demander la permission à personne, et photographiez l'affichage daté. Les locaux d'embauche comptent autant que les lieux de travail — c'est celui-là qu'on oublie.",
        quoi: "Le règlement intérieur est porté, par tout moyen, à la connaissance des personnes ayant accès aux lieux de travail ou aux locaux où se fait l'embauche.",
        fond: ["R1321-1"],
        risque: "Sans publicité, le délai d'un mois ne court pas et le règlement n'est pas opposable à ceux qui ne pouvaient le connaître ; R. 1321-1 est dans l'énumération de R. 1323-1 (amende des contraventions de la quatrième classe).",
        quand: function (D) {
          if (!D.datePublicite) return null;
          return { iso: D.datePublicite, libelle: "Publicité accomplie le " + dateFr(D.datePublicite) };
        } },
      { id: "i9", nom: "Fixer l'entrée en vigueur — postérieure d'un mois",
        docProduit: "DIS-CTL-RI-07",
        conseil: "Calculez la date à partir de la dernière des deux formalités, jamais de la première, et inscrivez-la dans le règlement une fois les deux accomplies. Un règlement imprimé avec sa date d'entrée en vigueur avant le dépôt oblige à tout réimprimer.",
        quoi: "Le règlement indique la date de son entrée en vigueur. Cette date doit être postérieure d'un mois à l'accomplissement des formalités de publicité ; le délai court à compter de la dernière en date des formalités de publicité et de dépôt.",
        fond: ["L1321-4", "R1321-3"],
        risque: "Une entrée en vigueur anticipée prive de support toute sanction prise dans l'intervalle sur le fondement du règlement — et L. 1321-4 comme R. 1321-3 sont dans l'énumération de R. 1323-1.",
        quand: function (D) {
          var f = [D.datePublicite, D.dateDepotGreffe].filter(Boolean).sort();
          if (!f.length) return null;
          var derniere = f[f.length - 1], t = moisApres(derniere, 1);
          return { iso: null,
            libelle: "Entrée en vigueur au plus tôt le " + dateFr(t),
            note: "Un mois après la dernière en date des formalités de publicité et de dépôt, ici le " + dateFr(derniere) +
              " (art. L. 1321-4 et R. 1321-3)." +
              (D.dateEntreeVigueur
                ? (D.dateEntreeVigueur < t
                   ? " ⚠ La date indiquée par le règlement, le " + dateFr(D.dateEntreeVigueur) + ", est antérieure à ce terme."
                   : " La date indiquée par le règlement, le " + dateFr(D.dateEntreeVigueur) + ", est postérieure à ce terme.")
                : "") };
        } },
      { id: "i10", nom: "Soumettre les notes de service aux mêmes règles",
        docProduit: "DIS-CTL-RI-11",
        conseil: "Tenez la liste des notes de service en vigueur et vérifiez une fois l'an lesquelles ajoutent des obligations générales et permanentes : ce sont celles-là qui suivent le circuit du règlement. Pour une note d'urgence en santé-sécurité, l'envoi simultané au secrétaire du comité et à l'inspection se fait le jour même.",
        quoi: "Les notes de service et tout autre document comportant des obligations générales et permanentes dans les matières des articles L. 1321-1 et L. 1321-2 sont considérés comme des adjonctions au règlement intérieur et soumis aux mêmes règles : avis du comité, dépôt, communication, publicité, entrée en vigueur différée. Une seule exception : lorsque l'urgence le justifie, les obligations de santé et de sécurité reçoivent application immédiate — à charge de les communiquer aussitôt et simultanément au secrétaire du comité et à l'inspection du travail.",
        fond: ["L1321-5"],
        risque: "Une note de service prise à la place du règlement n'échappe pas à la règle en changeant de nom : adjonction irrégulièrement introduite (R. 1323-1), et amende d'entrave de 7 500 euros (L. 2317-1) si l'avis du comité a été omis." },
      { id: "i11", nom: "Répondre à une demande de l'inspection du travail",
        docProduit: "DIS-CTL-RI-12",
        conseil: "Répondez par écrit, dans le délai que la décision indique, en disant ce qui a été retiré ou modifié. Si vous contestez, le recours hiérarchique est la seule voie : le silence ne conserve aucun droit et laisse la clause en l'état.",
        quoi: "L'inspecteur du travail peut à tout moment exiger le retrait ou la modification des dispositions contraires aux articles L. 1321-1 à L. 1321-3 et L. 1321-6. Sa décision est motivée, notifiée à l'employeur et communiquée pour information aux membres du comité ; elle peut faire l'objet d'un recours hiérarchique.",
        fond: ["L1322-1", "L1322-2", "L1322-3"],
        risque: "Ne rien faire n'est pas une voie de recours : la décision restée sans effet laisse en vigueur une disposition dont l'irrégularité est actée par écrit, et l'énumération de R. 1323-1 court jusqu'à L. 1322-4.",
        doc: { modele: "note-rh", nom: "Note d'information",
          pre: function (P, D) { return { entreprise: P.denomination,
            objet: "Suite donnée à la demande de l'inspection du travail sur le règlement intérieur" }; } } },
    ]
  },

  /* ================================================================== */
  /* 6. METTRE À JOUR LE DOCUMENT UNIQUE (DUERP)                        */
  /* ================================================================== */
  {
    cle: "duerp",
    suite: { cle: "affichages", pourquoi: "L'avis indiquant les modalités d'accès au document unique fait partie des affichages obligatoires : le tableau se met à jour d'un seul geste." },
    nom: "Mettre à jour le DUERP",
    resume: "Inventaire par unité de travail, transcription, mise à jour annuelle et événementielle, suites — programme annuel à partir de cinquante salariés, liste d'actions en deçà —, présentation au comité, conservation quarante ans.",
    audit: { href: "audit-sst.html", nom: "l'audit santé-sécurité (SST)" },
    donnees: [
      { c: "dateDerniereMaj", nom: "Date de la dernière mise à jour du document unique", t: "date" },
      { c: "unitesTravail", nom: "Nombre d'unités de travail inventoriées", t: "number",
        aide: "L'évaluation comporte un inventaire des risques identifiés dans chaque unité de travail (art. R. 4121-1)." },
      { c: "evenement", nom: "Une décision d'aménagement important ou une information nouvelle est-elle survenue ?", t: "oui-non",
        aide: "Elle déclenche une mise à jour, indépendamment de la périodicité annuelle (art. R. 4121-2, 2° et 3°)." },
      { c: "dateEvenement", nom: "Date de cet événement", t: "date",
        si: function (P, D) { return D.evenement === "oui" ? true : (D.evenement === "non" ? false : null); } },
      { c: "dateReunionCSE", nom: "Date de la réunion du comité où le document est présenté", t: "date",
        si: function (P) { return P.cseExiste === "non" ? false : true; } },
      { c: "spst", nom: "Le document a-t-il été mis à disposition du service de prévention et de santé au travail ?", t: "oui-non" },
    ],
    prealable: [
      { id: "unites", g: "information", nom: "La liste des unités de travail",
        aide: "Poste, atelier, service, métier, site : l'inventaire se fait unité par unité (art. R. 4121-1). Un document unique sans découpage n'est pas un document unique." },
      { id: "risques", g: "information", nom: "Les risques identifiés dans chaque unité, y compris les ambiances thermiques",
        aide: "L'article R. 4121-1 les cite expressément." },
      { id: "psycho", g: "information", nom: "Les risques liés au harcèlement moral, au harcèlement sexuel et aux agissements sexistes",
        aide: "La planification de la prévention les intègre (art. L. 4121-2, 7°)." },
      { id: "atmp", g: "pièce", nom: "Les accidents du travail et maladies professionnelles de l'année écoulée",
        aide: "Ils nourrissent l'évaluation et le rapport annuel." },
      { id: "versions", g: "document", nom: "Les versions antérieures du document unique",
        aide: "Elles sont conservées quarante ans et tenues à disposition (art. R. 4121-4)." },
      { id: "programme", g: "document", nom: "Le programme annuel de prévention de l'année écoulée",
        aide: "Il est dû à partir de cinquante salariés (art. L. 4121-3-1, III, 1°) ; les mesures non prises doivent être motivées en annexe du rapport annuel (art. L. 2312-27).",
        si: function (P) { return seuil(P, 50); } },
      { id: "actions", g: "document", nom: "La liste des actions de prévention consignée au document unique",
        aide: "C'est la forme que prennent les suites de l'évaluation en dessous de cinquante salariés (art. L. 4121-3-1, III, 2°).",
        si: function (P) { return sousSeuil(P, 50); } },
      { id: "ccnsst", g: "document", nom: "La convention collective, au titre « santé et sécurité »",
        aide: "Elle peut ajouter des obligations de prévention ou des moyens propres à la branche." },
    ],
    etapes: [
      { id: "d1", nom: "Évaluer les risques, unité de travail par unité de travail",
        docProduit: "SST-CTL-DUE-02",
        conseil: "Découpez d'abord, évaluez ensuite : une liste de risques sans unité de travail se réécrira entièrement. Faites participer ceux qui tiennent les postes — l'évaluation faite au bureau se voit, et se conteste.",
        quoi: "L'employeur, compte tenu de la nature des activités, évalue les risques pour la santé et la sécurité des travailleurs, y compris dans le choix des procédés, des équipements et de l'aménagement des lieux de travail. L'évaluation comporte un inventaire des risques identifiés dans chaque unité de travail, y compris ceux liés aux ambiances thermiques.",
        fond: ["L4121-3", "R4121-1"],
        risque: "Le document unique est dû par tout employeur, sans seuil d'effectif ; ne pas transcrire les résultats de l'évaluation dans les conditions de R. 4121-1 est puni de l'amende prévue pour les contraventions de la cinquième classe, la récidive étant réprimée conformément au code pénal (R. 4741-1).",
        conv: "les obligations de prévention, les listes de risques ou les moyens propres à la branche, que certaines conventions détaillent unité de travail par unité de travail" },
      { id: "d2", nom: "Transcrire dans le document unique",
        docProduit: "SST-CTL-DUE-01",
        conseil: "Un tableau suffit : unité, risque, exposition, mesures existantes, action retenue. Datez et signez chaque version, et ne l'écrasez jamais — c'est la version antérieure qui prouve, plus tard, ce qui était connu à l'époque.",
        quoi: "L'employeur transcrit et met à jour dans un document unique les résultats de l'évaluation. Le document répertorie l'ensemble des risques professionnels auxquels sont exposés les travailleurs et assure la traçabilité collective de ces expositions.",
        fond: ["L4121-3-1", "R4121-1"],
        risque: "Un inventaire non transcrit n'existe pas pour le contrôle : même amende de la cinquième classe (R. 4741-1), et la traçabilité collective des expositions que L. 4121-3-1 impose n'est pas assurée." },
      { id: "d3", nom: "Mettre à jour : la périodicité annuelle",
        docProduit: "SST-CTL-DUE-03",
        conseil: "Inscrivez la revue annuelle à l'agenda plutôt que d'attendre l'échéance : la mise à jour se prépare, elle ne s'improvise pas. Une revue qui ne change rien se consigne aussi — elle prouve que la question a été posée.",
        quoi: "La mise à jour est réalisée au moins chaque année dans les entreprises d'au moins onze salariés.",
        fond: ["R4121-2"],
        risque: "Ne pas mettre à jour dans les conditions de R. 4121-2 est puni comme le défaut de transcription : amende des contraventions de la cinquième classe (R. 4741-1).",
        si: function (P) { return seuil(P, 11); },
        quand: function (D) {
          if (!D.dateDerniereMaj) return null;
          var t = moisApres(D.dateDerniereMaj, 12);
          return { iso: t, libelle: "Prochaine mise à jour au plus tard le " + dateFr(t),
            note: "Un an après la dernière mise à jour, datée du " + dateFr(D.dateDerniereMaj) + " (art. R. 4121-2, 1°)." };
        } },
      { id: "d4", nom: "Mettre à jour : l'événement",
        docProduit: "SST-CTL-DUE-04",
        conseil: "Traitez l'événement dans les jours qui suivent, pas à la revue annuelle suivante : c'est le décalage entre la date de l'aménagement et celle de la mise à jour qui se reproche. Un accident, une alerte d'un salarié ou une machine nouvelle sont chacun un événement.",
        quoi: "La mise à jour est également réalisée lors de toute décision d'aménagement important modifiant les conditions de santé et de sécurité ou les conditions de travail, et lorsqu'une information supplémentaire intéressant l'évaluation d'un risque est portée à la connaissance de l'employeur.",
        fond: ["R4121-2"],
        risque: "Un document non mis à jour après l'événement décrit une entreprise qui n'existe plus : même amende (R. 4741-1), et l'évaluation périmée fragilise toutes les mesures de prévention qui s'appuient sur elle.",
        si: function (P, D) { return D.evenement === "oui" ? true : (D.evenement === "non" ? false : null); },
        quand: function (D) {
          if (!D.dateEvenement) return null;
          return { iso: D.dateEvenement,
            libelle: "Événement du " + dateFr(D.dateEvenement) + " — mise à jour due",
            note: "L'article R. 4121-2 ne fixe pas de délai chiffré : la mise à jour est due à raison de l'événement lui-même. Elle est d'autant plus exposée qu'elle tarde." };
        } },
      { id: "d5", nom: "Établir le programme annuel de prévention",
        docProduit: "SST-CTL-DUE-05",
        conseil: "Chaque mesure porte un responsable, une échéance, un coût et l'indicateur qui dira si elle a produit son effet. Un programme sans indicateur ne se contrôle pas l'année suivante, et c'est l'année suivante qu'on vous le demandera.",
        quoi: "À partir de cinquante salariés, les résultats de l'évaluation débouchent sur un programme annuel de prévention des risques professionnels et d'amélioration des conditions de travail : liste détaillée des mesures de l'année à venir, conditions d'exécution, indicateurs de résultat et estimation du coût de chacune, ressources mobilisables, calendrier de mise en œuvre.",
        fond: ["L4121-3-1"],
        risque: "Sans programme annuel, les résultats de l'évaluation restent sans suite, en méconnaissance de L. 4121-3-1, III, 1° — et les mesures prévues puis non prises doivent être motivées en annexe du rapport annuel présenté au comité (L. 2312-27).",
        si: function (P) { return seuil(P, 50); } },
      { id: "d6", nom: "Consigner la liste des actions de prévention",
        docProduit: "SST-CTL-DUE-05",
        conseil: "La liste se consigne dans le document unique lui-même, pas dans un fichier à part : c'est là qu'on la cherchera. Une action par risque prioritaire suffit ; mieux vaut trois actions faites que douze annoncées.",
        quoi: "En dessous de cinquante salariés, les résultats de l'évaluation débouchent sur la définition d'actions de prévention des risques et de protection des salariés, dont la liste est consignée dans le document unique et ses mises à jour.",
        fond: ["L4121-3-1"],
        risque: "La liste d'actions consignée au document unique est la forme que L. 4121-3-1, III, 2°, donne aux suites de l'évaluation en dessous de cinquante salariés : son absence laisse l'évaluation sans suite, et le document incomplet.",
        si: function (P) { return sousSeuil(P, 50); } },
      { id: "d7", nom: "Présenter au comité le rapport et le programme annuels",
        champDate: "dateReunionCSE",
        docProduit: "SST-CTL-DUE-07",
        conseil: "Inscrivez le point à l'ordre du jour avec le rapport et le programme joints à la convocation, et faites porter l'avis au procès-verbal. Les mesures annoncées l'an dernier et non prises se motivent en annexe : préparez ces motifs avant la réunion, pas pendant.",
        quoi: "Dans le cadre de la consultation sur la politique sociale, l'employeur présente au comité le rapport annuel écrit faisant le bilan de la santé, de la sécurité et des conditions de travail, et le programme annuel de prévention. Le document unique sert à établir ce rapport. Les mesures prévues et non prises doivent être motivées en annexe.",
        fond: ["L2312-27", "R4121-3"],
        risque: "La consultation omise expose à la qualification d'entrave au fonctionnement régulier du comité — 7 500 euros d'amende (L. 2317-1) — et le programme adopté sans avis est contestable.",
        si: function (P) { return P.cseExiste === "non" ? false : true; },
        quand: function (D) {
          if (!D.dateReunionCSE) return null;
          return { iso: D.dateReunionCSE, libelle: "Présentation en réunion du " + dateFr(D.dateReunionCSE) };
        },
        doc: { modele: "convocation", nom: "Convocation et ordre du jour du comité",
          pre: function (P, D) { return { entreprise: P.denomination, effectif: P.effectif,
            dateReunion: D.dateReunionCSE,
            points: "Rapport annuel santé, sécurité et conditions de travail\nProgramme annuel de prévention des risques professionnels",
            pointSSCT: ["La réunion porte, en tout ou partie, sur la santé, la sécurité et les conditions de travail"] }; } } },
      { id: "d8", nom: "Conserver quarante ans et tenir à disposition",
        docProduit: "SST-CTL-DUE-06",
        conseil: "Archivez chaque version en PDF daté, hors du poste de travail de celui qui la rédige. Quarante ans dépassent la durée de vie de tout logiciel : un format lisible et une sauvegarde ailleurs valent mieux qu'un outil sophistiqué.",
        quoi: "Le document unique et ses versions antérieures sont tenus, pendant quarante ans à compter de leur élaboration, à la disposition des travailleurs et anciens travailleurs, des élus, du service de prévention et de santé au travail, de l'inspection du travail et des organismes de prévention.",
        fond: ["R4121-4"],
        risque: "Sans les versions successives, la traçabilité collective des expositions est perdue : l'employeur ne peut répondre ni à la demande d'un ancien salarié ni à celle d'un agent de contrôle (L. 4121-3-1, V ; R. 4121-4)." },
      { id: "d8b", nom: "Transmettre le document au service de prévention et de santé au travail",
        docProduit: "SST-CTL-DUE-08",
        conseil: "La transmission se fait à chaque mise à jour, pas une fois pour toutes : ajoutez-la à la liste de contrôle de la revue annuelle, au même titre que la consultation du comité. Un courriel daté au service, avec le document en pièce jointe et l'accusé de réception conservé, suffit à l'établir.",
        quoi: "Le document unique d'évaluation des risques professionnels est transmis par l'employeur, à chaque mise à jour, au service de prévention et de santé au travail auquel il adhère. La transmission est due de plein droit, sans que le service ait à la demander.",
        fond: ["L4121-3-1"],
        risque: "Le service de prévention et de santé au travail est l'une des contributions que L. 4121-3 appelle à l'évaluation des risques : privé du document, il ne peut ni l'éclairer ni exercer le suivi qu'il doit aux salariés exposés. Le VI de L. 4121-3-1 pose l'obligation sans l'assortir d'une peine propre ; la carence se constate en revanche au premier contrôle, et affaiblit l'employeur qui prétend avoir pris toutes les mesures nécessaires.",
        quand: function (D) {
          if (!D.dateDerniereMaj) return null;
          return { iso: null, libelle: "Due à la mise à jour du " + dateFr(D.dateDerniereMaj),
            note: "La transmission suit chaque mise à jour : celle-ci en appelait une." };
        } },
      { id: "d9", nom: "Mettre en œuvre les mesures de prévention",
        docProduit: "SST-CTL-DUE-01",
        conseil: "Le document ne protège personne s'il reste dans un tiroir : ce qui vous défendra, c'est la trace des mesures effectivement prises — bons de commande, comptes rendus, attestations de formation. Classez-les avec le document, pas ailleurs.",
        quoi: "L'évaluation n'est pas une fin : l'employeur prend les mesures nécessaires pour assurer la sécurité et protéger la santé physique et mentale des travailleurs, sur le fondement des principes généraux de prévention — éviter les risques, évaluer ceux qui ne peuvent l'être, les combattre à la source, adapter le travail à l'homme, planifier la prévention en y intégrant les risques liés au harcèlement et aux agissements sexistes.",
        fond: ["L4121-1", "L4121-2"], juris: ["14-24.444"],
        risque: "En cas d'accident ou de maladie, seul l'employeur qui justifie avoir pris toutes les mesures prévues par L. 4121-1 et L. 4121-2 ne méconnaît pas son obligation de sécurité — c'est la décision citée ci-dessous ; le document unique tenu et suivi est la première de ces justifications." },
      { id: "d10", nom: "Mesurer ce que coûte l'absence",
        conseil: "Le coût du rattrapage est toujours inférieur à celui du contrôle : si le document manque, écrivez-en une première version imparfaite plutôt que d'attendre la version parfaite. Un document daté d'aujourd'hui vaut mieux qu'un document absent depuis trois ans.",
        quoi: "Ne pas transcrire ou ne pas mettre à jour les résultats de l'évaluation est puni de l'amende prévue pour les contraventions de la cinquième classe ; l'article L. 4741-1 punit d'une amende de 10 000 euros, appliquée autant de fois qu'il y a de travailleurs concernés, la méconnaissance par faute personnelle des dispositions qu'il énumère.",
        fond: ["R4741-1", "L4741-1"] },
    ]
  },

  /* ================================================================== */
  /* 7. INSTALLER LE CSE : LA PREMIÈRE RÉUNION                          */
  /*                                                                    */
  /* Ce parcours est celui de la réunion qui suit les élections — à ne  */
  /* pas confondre avec « Tenir une réunion du CSE », qui est celui de  */
  /* la réunion ordinaire. Deux points méritent d'être signalés, parce  */
  /* qu'ils touchent aux limites de ce que le code dit :                */
  /*                                                                    */
  /* — la CONVOCATION de cette première réunion. L'article L. 2315-29   */
  /*   veut un ordre du jour établi par le président ET le secrétaire.  */
  /*   À l'installation, il n'y a pas encore de secrétaire : le code ne */
  /*   règle pas le cas. L'étape le dit, et ne présente pas comme une   */
  /*   règle légale ce qui n'est qu'une nécessité pratique.             */
  /*                                                                    */
  /* — la TRANSITION entre le comité sortant et le comité entrant. Les  */
  /*   textes ont été cherchés au relais : le comité a la personnalité  */
  /*   civile et gère son patrimoine (L. 2315-23) ; la dévolution des   */
  /*   biens n'est organisée qu'en cas de CESSATION DÉFINITIVE de       */
  /*   l'activité de l'entreprise (R. 2312-52) ; les comptes s'arrêtent */
  /*   et s'approuvent selon L. 2315-68 à L. 2315-72 et se conservent   */
  /*   dix ans (L. 2315-75). AUCUN article lu le 22 août 2026 n'organise*/
  /*   de remise-reprise entre l'ancien et le nouveau comité. L'article */
  /*   R. 2323-38, qui l'imposait au comité d'entreprise, répond au     */
  /*   relais « trouvé : faux » — il n'est plus en vigueur. L'étape est */
  /*   donc formulée en question ouverte, à régler par le règlement     */
  /*   intérieur du comité, et le dit expressément.                     */
  /* ================================================================== */
  {
    cle: "installation",
    suite: { cle: "reunion", pourquoi: "Le comité installé, ce sont les réunions ordinaires qui commencent — convocation, ordre du jour conjoint, procès-verbal." },
    nom: "Installer le CSE : la première réunion",
    resume: "La réunion qui suit les élections : convocation par le seul président, bureau élu parmi les titulaires, référent harcèlement, commissions, règlement intérieur du comité, budgets et moyens, transition avec le comité sortant, et la documentation économique et financière due un mois après l'élection.",
    audit: { href: "audit-cse.html", nom: "l'audit du comité social et économique" },
    jx: "cse-installation",
    donnees: [
      { c: "dateElections", nom: "Date de proclamation des résultats des élections", t: "date",
        aide: "C'est d'elle que court le délai d'un mois de l'article L. 2312-57 — la documentation économique et financière — et c'est d'elle que se compte la durée de quatre ans des mandats (art. L. 2314-33)." },
      { c: "dateInstallation", nom: "Date de la réunion d'installation", t: "date" },
      { c: "heure", nom: "Heure", t: "time" },
      { c: "lieu", nom: "Lieu (et lien de visioconférence, le cas échéant)", t: "text",
        aide: "En l'absence d'accord, le recours à la visioconférence est limité à trois réunions par année civile (art. L. 2315-4)." },
      { c: "president", nom: "Président du comité (nom, qualité)", t: "text",
        aide: "L'employeur ou son représentant, assisté éventuellement de trois collaborateurs qui ont voix consultative (art. L. 2315-23)." },
      { c: "dateEnvoiConvocation", nom: "Date d'envoi de la convocation et de l'ordre du jour", t: "date" },
      { c: "nbTitulaires", nom: "Nombre de titulaires élus", t: "number",
        aide: "Le nombre est fixé par l'accord ou, à défaut, par le tableau de l'article R. 2314-1, selon l'effectif." },
      { c: "troisiemeCollege", nom: "Un troisième collège électoral est-il institué ?", t: "oui-non",
        aide: "Il commande un siège à la commission santé, sécurité et conditions de travail (art. L. 2315-39) et porte à quatre la délégation au conseil d'administration ou de surveillance (art. L. 2312-72)." },
      { c: "premierMandat", nom: "Des titulaires sont-ils élus pour la première fois ?", t: "oui-non",
        aide: "Ils ont droit au stage de formation économique de cinq jours au plus (art. L. 2315-63) et à cinq jours de formation santé-sécurité (art. L. 2315-18)." },
      { c: "forme", nom: "Forme de l'entreprise", t: "select",
        options: ["société anonyme ou société en commandite par actions",
          "société par actions simplifiée", "autre société",
          "l'entreprise n'est pas une société"],
        aide: "Elle commande la représentation du comité au conseil d'administration ou de surveillance (art. L. 2312-72 à L. 2312-76)." },
      { c: "administrateurSalarie", nom: "Le conseil comprend-il déjà un administrateur ou un membre élu ou désigné par les salariés ?", t: "oui-non",
        si: function (P, D) { return D.forme === "société anonyme ou société en commandite par actions" ? true
          : (D.forme && D.forme !== "société anonyme ou société en commandite par actions" ? false : null); },
        aide: "Dans ce cas, la représentation du comité auprès du conseil est assurée par un seul membre titulaire (art. L. 2312-75)." },
      { c: "comitePrecedent", nom: "Un comité était-il en place avant ces élections ?", t: "oui-non" },
      { c: "dateFinMandatPrecedent", nom: "Date de fin du mandat des élus sortants", t: "date",
        si: function (P, D) { return D.comitePrecedent === "oui" ? true : (D.comitePrecedent === "non" ? false : null); } },
      { c: "dateClotureExercice", nom: "Date de clôture du dernier exercice du comité", t: "date",
        si: function (P, D) { return D.comitePrecedent === "oui" ? true : (D.comitePrecedent === "non" ? false : null); },
        aide: "Les comptes annuels et leurs pièces justificatives se conservent dix ans à compter de cette date (art. L. 2315-75)." },
      { c: "accordCse", nom: "Un accord fixe-t-il le fonctionnement du comité (commissions, délais, périodicité) ?", t: "oui-non" },
      { c: "accordBdese", nom: "Un accord définit-il la base de données économiques, sociales et environnementales ?", t: "oui-non",
        aide: "Accord d'entreprise ou, en l'absence de délégué syndical, accord entre l'employeur et le comité adopté à la majorité des titulaires (art. L. 2312-21)." },
      { c: "dateDocEco", nom: "Date de communication de la documentation économique et financière", t: "date",
        aide: "Due à défaut d'accord, un mois après chaque élection (art. L. 2312-57)." },
      { c: "dateRI", nom: "Date d'adoption du règlement intérieur du comité", t: "date" },
      { c: "datePV", nom: "Date d'établissement du procès-verbal d'installation", t: "date" },
    ],
    prealable: [
      { id: "pvelec", g: "document", nom: "Les procès-verbaux des élections, des deux tours",
        aide: "Ils nomment les titulaires et les suppléants, collège par collège : le bureau, le référent et les commissions se désignent parmi les membres du comité (art. L. 2315-23, L. 2314-1, L. 2315-39)." },
      { id: "protocole", g: "document", nom: "Le protocole d'accord préélectoral",
        aide: "Il porte la composition des collèges — dont l'existence, ou non, d'un troisième collège." },
      { id: "effin", g: "information", nom: "L'effectif de l'entreprise et de chaque établissement distinct",
        aide: "Il commande le nombre d'élus et les heures de délégation (art. R. 2314-1), la commission santé-sécurité (300, art. L. 2315-36), la commission économique (1 000, art. L. 2315-46), et le taux de la subvention de fonctionnement (2 000, art. L. 2315-61)." },
      { id: "accords", g: "document", nom: "Les accords applicables au comité",
        aide: "Accord de mise en place et périmètre des établissements distincts, accord sur les commissions (art. L. 2315-41 et L. 2315-42), accord sur la base de données (art. L. 2312-21), accord sur les délais de consultation, accord sur la visioconférence (art. L. 2315-4)." },
      { id: "masse", g: "information", nom: "La masse salariale brute de l'entreprise",
        aide: "Assiette des deux budgets : 0,20 % ou 0,22 % pour le fonctionnement (art. L. 2315-61), et le rapport de l'année précédente pour les activités sociales et culturelles à défaut d'accord (art. L. 2312-81). Sa définition est à l'article L. 2312-83." },
      { id: "docsortant", g: "document", nom: "Les documents du comité sortant : comptes annuels arrêtés et approuvés, rapport de gestion, rapport sur les conventions",
        aide: "Articles L. 2315-64 à L. 2315-72. Ils se conservent dix ans avec leurs pièces justificatives (art. L. 2315-75). Tous les membres du comité y ont un égal accès (Soc. 8 juillet 2026, n° 25-10.126).",
        si: function (P, D) { return D.comitePrecedent === "oui" ? true : (D.comitePrecedent === "non" ? false : null); } },
      { id: "tresorerie", g: "pièce", nom: "L'état de la trésorerie, des engagements et des contrats en cours du comité",
        aide: "Comptes bancaires et mandataires, prestataires, assurances, subventions engagées, personnel employé par le comité, biens meubles et immeubles. Aucun texte lu n'organise leur remise : c'est au règlement intérieur du comité de le faire (art. L. 2315-24).",
        si: function (P, D) { return D.comitePrecedent === "oui" ? true : (D.comitePrecedent === "non" ? false : null); } },
      { id: "risortant", g: "document", nom: "Le règlement intérieur du comité précédent",
        aide: "Il n'est pas reconduit de plein droit par l'effet des élections : le comité nouvellement élu détermine son règlement intérieur (art. L. 2315-24). Le reprendre suppose une résolution qui l'adopte.",
        si: function (P, D) { return D.comitePrecedent === "oui" ? true : (D.comitePrecedent === "non" ? false : null); } },
      { id: "candid", g: "information", nom: "Les candidatures au secrétariat, à la trésorerie, au référent harcèlement et aux commissions",
        aide: "Le secrétaire et le trésorier se désignent parmi les membres titulaires (art. L. 2315-23) ; le référent harcèlement parmi les membres du comité (art. L. 2314-1)." },
      { id: "local", g: "information", nom: "Le local aménagé et le matériel mis à disposition",
        aide: "L'employeur met à la disposition du comité un local aménagé et le matériel nécessaire (art. L. 2315-25)." },
      { id: "ccninst", g: "document", nom: "La convention collective, au titre des institutions représentatives",
        aide: "Elle peut ajouter des moyens, des commissions ou une périodicité propres." },
    ],
    etapes: [
      { id: "i1", nom: "Convoquer la première réunion — le président seul, faute de secrétaire",
        champDate: "dateEnvoiConvocation",
        risque: "L'ordre du jour est communiqué par le président aux membres du comité, à l'agent de contrôle de l'inspection du travail et à l'agent des services de prévention des organismes de sécurité sociale, trois jours au moins avant la réunion (L. 2315-30). Une convocation tardive, ou dont les deux destinataires extérieurs sont omis, prive les élus du délai d'examen que le texte leur réserve et fragilise les résolutions de la séance. Le fait d'apporter une entrave au fonctionnement régulier du comité est puni d'une amende de 7 500 € (L. 2317-1).",
        conseil: "Envoyez par un moyen qui laisse une trace datée — lettre recommandée ou courriel avec accusé — et conservez la preuve d'envoi aussi soigneusement que le document lui-même. Comptez les trois jours à rebours depuis la date de réunion, et convoquez titulaires et suppléants. Écrivez dans la convocation que l'ordre du jour est arrêté par le seul président, faute de secrétaire encore élu : le dire évite qu'on y voie un précédent pour les réunions suivantes.",
        jx: "cse-installation",
        quoi: "L'ordre du jour de chaque réunion est établi par le président et le secrétaire (art. L. 2315-29). À l'installation, il n'y a pas encore de secrétaire : aucun texte lu ne règle ce cas. En pratique, la convocation et l'ordre du jour de cette seule réunion sont établis par le président — c'est une nécessité, pas une règle légale, et il vaut mieux le dire dans la convocation que le laisser croire. Le délai de communication, lui, s'applique : l'ordre du jour est communiqué par le président aux membres du comité, à l'agent de contrôle de l'inspection du travail et à l'agent des services de prévention des organismes de sécurité sociale, trois jours au moins avant la réunion.",
        fond: ["L2315-29", "L2315-30", "L2315-23"],
        quand: function (D) {
          if (!D.dateInstallation) return null;
          var t = jours(D.dateInstallation, -3);
          return { iso: t, libelle: "Envoi au plus tard le " + dateFr(t),
            note: D.dateEnvoiConvocation
              ? ("Envoi renseigné au " + dateFr(D.dateEnvoiConvocation) + " — soit " +
                 joursEntre(D.dateEnvoiConvocation, D.dateInstallation) + " jour(s) avant la réunion.")
              : "Trois jours au moins avant la réunion (art. L. 2315-30)." };
        },
        doc: { modele: "convocation-installation", nom: "Convocation à la réunion d'installation",
          pre: function (P, D) { return { entreprise: P.denomination, effectif: P.effectif,
            president: D.president, dateReunion: D.dateInstallation, heure: D.heure, lieu: D.lieu,
            dateEnvoi: D.dateEnvoiConvocation, dateElections: D.dateElections }; } } },

      { id: "i2", nom: "Arrêter l'ordre du jour de l'installation, point par point",
        risque: "Une désignation qui ne figure pas à l'ordre du jour n'est pas préparée et se renvoie en pratique à la réunion suivante. Le comité reste alors sans secrétaire ni trésorier — donc sans auteur pour le procès-verbal (L. 2315-34) et sans co-auteur pour l'ordre du jour suivant (L. 2315-29) — et sans le référent harcèlement dont L. 2314-1 impose la désignation. Le report se paie en semaines, et il affecte tout ce qui en dépend.",
        conseil: "Rédigez l'ordre du jour comme une liste d'actes à accomplir, un point par désignation, et non sous un intitulé général du type « installation du comité ». Prévoyez plus large que nécessaire : un point inscrit et non traité ne coûte rien, un point omis coûte une réunion. Préparez à l'avance ce que chaque point appelle — modèles de résolution, projet de règlement intérieur, tableau des heures — pour que la séance décide au lieu de découvrir.",
        quoi: "Une réunion d'installation qui n'aurait pas prévu ses désignations les renvoie toutes à la réunion suivante. L'ordre du jour type : constatation de la composition du comité et de la personnalité civile ; élection du secrétaire et du trésorier ; désignation du référent harcèlement ; désignation des membres de la commission santé, sécurité et conditions de travail et des autres commissions ; désignation, s'il y a lieu, des représentants au conseil d'administration ou de surveillance ; adoption du règlement intérieur du comité ; ouverture des budgets et des comptes bancaires ; moyens — heures, local, matériel, affichage, visioconférence ; accès à la base de données ; formations ; transition avec le comité sortant ; calendrier des réunions ; documentation économique et financière due un mois après l'élection.",
        fond: ["L2315-29", "L2315-23", "L2315-24", "L2314-1", "L2315-39", "L2312-57"],
        doc: { modele: "odj-installation", nom: "Ordre du jour de la réunion d'installation",
          pre: function (P, D) { return { entreprise: P.denomination,
            president: D.president, dateReunion: D.dateInstallation, heure: D.heure, lieu: D.lieu,
            options: [].concat(
              D.comitePrecedent === "oui" ? ["Transition avec le comité sortant : reddition de gestion, remise des documents et des archives"] : [],
              D.forme && D.forme !== "l'entreprise n'est pas une société" ? ["Désignation des représentants au conseil d'administration ou de surveillance"] : []
            ) }; } } },

      { id: "i3", nom: "Constater la composition du comité et sa personnalité civile",
        risque: "Sans constatation écrite de la composition — élus par collège, titulaires et suppléants —, la majorité des membres présents que L. 2315-32 exige pour toute résolution ne peut pas être vérifiée, et l'ensemble des désignations de la séance devient contestable. Les mandats étant ouverts pour quatre ans (L. 2314-33), c'est aussi de cette constatation que se compte l'échéance du renouvellement.",
        conseil: "Annexez au procès-verbal celui des élections et la liste nominative des élus par collège, et faites émarger une feuille de présence à l'ouverture puis à chaque reprise de séance. Notez la date exacte de proclamation des résultats : c'est elle, et non celle de la première réunion, qui fait courir les quatre ans du mandat et le mois de l'article L. 2312-57.",
        quoi: "Le comité comprend l'employeur et une délégation du personnel comportant un nombre égal de titulaires et de suppléants ; le suppléant assiste aux réunions en l'absence du titulaire. Le comité est doté de la personnalité civile et gère son patrimoine : il peut ouvrir un compte, contracter, ester en justice. Il est présidé par l'employeur ou son représentant, assisté éventuellement de trois collaborateurs qui ont voix consultative. Les mandats sont ouverts pour quatre ans.",
        fond: ["L2314-1", "R2314-1", "L2315-23", "L2314-33"],
        quand: function (D) {
          if (!D.dateElections) return null;
          var fin = moisApres(D.dateElections, 48);
          return { iso: null, libelle: "Mandats ouverts le " + dateFr(D.dateElections) +
            " — terme des quatre ans le " + dateFr(fin),
            note: "Les membres de la délégation du personnel sont élus pour quatre ans (art. L. 2314-33) ; " +
              "un accord de branche, de groupe ou d'entreprise peut fixer une durée plus courte, entre deux et quatre ans." };
        } },

      { id: "i4", nom: "Élire le secrétaire et le trésorier parmi les titulaires",
        risque: "Le comité désigne, parmi ses membres titulaires, un secrétaire et un trésorier (L. 2315-23) : ce n'est pas une faculté. Sans secrétaire, l'ordre du jour ne peut plus être établi conjointement (L. 2315-29) et le procès-verbal n'a plus d'auteur (L. 2315-34) ; le comité cesse de fonctionner régulièrement. Une résolution adoptée à une majorité autre que celle des membres présents (L. 2315-32) est irrégulière.",
        conseil: "Votez les deux postes séparément et consignez, pour chacun, le nom du candidat, le nombre de votants et le décompte des voix pour, contre et abstentions ; un procès-verbal qui n'énonce que « élu à l'unanimité » ne prouve pas la majorité. Prévoyez dès la même séance un secrétaire adjoint ou une règle de suppléance : l'absence du secrétaire bloque autrement l'ordre du jour de la réunion suivante.",
        quoi: "Le comité désigne, parmi ses membres titulaires, un secrétaire et un trésorier. La résolution se prend à la majorité des membres présents. Le président du comité — l'employeur ou son représentant — est membre du comité : il participe à ce vote, qui ne constitue pas la consultation des élus en tant que délégation du personnel.",
        fond: ["L2315-23", "L2315-32"], juris: ["88-20.411"],
        quand: function (D) {
          if (!D.dateInstallation) return null;
          return { iso: D.dateInstallation, libelle: "Élection du bureau en réunion du " + dateFr(D.dateInstallation),
            note: "Sans secrétaire, l'ordre du jour des réunions suivantes ne peut pas être établi conjointement (art. L. 2315-29), et le procès-verbal n'a personne pour l'établir (art. L. 2315-34)." };
        },
        doc: { modele: "pv-installation", nom: "Procès-verbal d'installation avec les résolutions",
          pre: function (P, D) { return { entreprise: P.denomination, dateReunion: D.dateInstallation,
            lieu: D.lieu, president: D.president, dateElections: D.dateElections,
            nbTitulaires: D.nbTitulaires,
            resolutions: [].concat(
              ["Élection du secrétaire", "Élection du trésorier", "Désignation du référent harcèlement"],
              D.troisiemeCollege === "oui" ? ["Désignation des membres de la CSSCT — siège du troisième collège"] : [],
              D.comitePrecedent === "oui" ? ["Transition avec le comité sortant"] : []
            ) }; } } },

      { id: "i5", nom: "Désigner le référent harcèlement du comité",
        docProduit: "SST-CTL-HAR-02",
        risque: "La désignation du référent n'est pas laissée à l'appréciation du comité : L. 2314-1 impose qu'il soit désigné parmi ses membres, par une résolution adoptée selon les modalités de L. 2315-32, pour une durée qui prend fin avec celle du mandat des élus. Une désignation opérée autrement — par acclamation, par le seul président, ou pour une durée différente — est irrégulière et peut être annulée. Le référent bénéficie de la formation santé, sécurité et conditions de travail (L. 2315-18) : ne pas le désigner prive aussi l'entreprise de ce relais.",
        conseil: "Faites figurer au procès-verbal le nom du désigné, sa qualité de membre du comité, la durée du mandat et le décompte des voix, puis portez ce nom à la connaissance des salariés par les affichages : un référent que personne ne sait nommer ne sert à rien. Inscrivez sa formation au même calendrier que celle des élus plutôt que d'attendre le premier signalement. Réglez enfin, dès l'installation, où les signalements arrivent, à qui, et sous quelle forme ils se consignent.",
        quoi: "Un référent en matière de lutte contre le harcèlement sexuel et les agissements sexistes est désigné par le comité parmi ses membres, sous la forme d'une résolution adoptée à la majorité des membres présents, pour une durée qui prend fin avec celle du mandat des élus. Il bénéficie, comme les élus, de la formation santé, sécurité et conditions de travail.",
        fond: ["L2314-1", "L2315-32", "L2315-18"],
        quand: function (D) {
          if (!D.dateInstallation) return null;
          return { iso: D.dateInstallation, libelle: "Désignation en réunion du " + dateFr(D.dateInstallation) };
        } },

      { id: "i6", nom: "Désigner les membres de la commission santé, sécurité et conditions de travail",
        docProduit: "CSE-CTL-SST-01",
        risque: "La commission est créée dans les entreprises et les établissements distincts d'au moins trois cents salariés ; ne pas la constituer là où elle est due caractérise l'entrave au fonctionnement régulier du comité, punie d'une amende de 7 500 € (L. 2317-1). Sa composition est d'ordre public : au minimum trois représentants du personnel, dont au moins un du second collège ou, le cas échéant, du troisième (L. 2315-39), un siège au moins devant revenir au troisième collège lorsqu'il est institué (Soc., 26 février 2025, n° 24-12.295, publié). La désignation résulte d'un vote à la majorité des membres présents (L. 2315-32), sans résolution préalable fixant les modalités de l'élection (Soc., 27 novembre 2019, n° 19-14.224, publié) : opérée autrement, elle est annulable.",
        conseil: "Vérifiez le nombre de collèges avant de composer la commission, et non après : c'est de là que vient l'irrégularité la plus fréquente. Consignez au procès-verbal le collège d'appartenance de chaque désigné, et pas seulement son nom. Retenez que les désignés le sont pour la durée du mandat : hors les cas de fin anticipée de mandat, le comité ne peut pas les remplacer en cours de route.",
        quoi: "La commission est présidée par l'employeur ou son représentant et comprend au minimum trois membres représentants du personnel, dont au moins un du second collège ou, le cas échéant, du troisième. Ses membres sont désignés par le comité parmi ses membres, par une résolution adoptée à la majorité des membres présents, pour une durée qui prend fin avec celle du mandat des élus. Elle est obligatoire dans les entreprises et établissements distincts d'au moins trois cents salariés et dans les établissements des articles L. 4521-1 et suivants ; en deçà, l'inspecteur du travail peut l'imposer, et rien n'interdit de la créer par accord.",
        fond: ["L2315-36", "L2315-37", "L2315-38", "L2315-39", "L2315-32"],
        juris: ["19-14.224", "24-12.295", "24-22.914"],
        quand: function (D) {
          if (!D.dateInstallation) return null;
          return { iso: D.dateInstallation, libelle: "Désignation en réunion du " + dateFr(D.dateInstallation),
            note: "Sauf dans les cas de fin anticipée de mandat de l'article L. 2314-33, les membres désignés ne peuvent pas être remplacés avant le terme du mandat des élus." };
        },
        doc: { modele: "designation-commission", nom: "Délibération de désignation des membres",
          pre: function (P, D) { return { entreprise: P.denomination,
            commission: "commission santé, sécurité et conditions de travail",
            dateReunion: D.dateInstallation, president: D.president,
            source: D.accordCse === "oui" ? "accord d'entreprise (art. L. 2315-41)"
                                          : "règlement intérieur du comité, à défaut d'accord (art. L. 2315-44)",
            dateFinMandat: D.dateElections ? moisApres(D.dateElections, 48) : "",
            troisiemeCollege: D.troisiemeCollege === "oui"
              ? ["Un troisième collège est institué : un siège au moins revient à un élu le représentant"] : [] }; } } },

      { id: "i7", nom: "Constituer les autres commissions",
        risque: "À défaut d'accord de l'article L. 2315-45, la commission économique est créée à partir de mille salariés (L. 2315-46) et les commissions de la formation, d'information et d'aide au logement et de l'égalité professionnelle à partir de trois cents (L. 2315-49, L. 2315-50, L. 2315-56). Ces commissions préparent des délibérations du comité : leur absence prive ces délibérations de leur préparation. La commission des marchés, elle, se déclenche sur les seuils des comptes du comité et non sur l'effectif de l'entreprise (L. 2315-44-1, D. 2315-29).",
        conseil: "Recherchez l'accord avant de constituer quoi que ce soit : les commissions supplétives ne sont dues qu'à défaut d'accord, et constituer par le règlement intérieur ce qu'un accord organise déjà crée deux régimes concurrents. Datez le franchissement des seuils sur les états d'effectif plutôt que sur une impression. Confiez au trésorier la surveillance des seuils de la commission des marchés : ils se lisent dans les comptes du comité, pas dans ceux de l'entreprise.",
        quoi: "L'accord d'entreprise fixe les modalités de mise en place des commissions ; en l'absence de délégué syndical, un accord entre l'employeur et le comité adopté à la majorité des titulaires y pourvoit ; à défaut d'accord, le règlement intérieur du comité les définit. À défaut d'accord de l'article L. 2315-45 : commission économique à partir de mille salariés, commissions de la formation, du logement et de l'égalité professionnelle à partir de trois cents. La commission des marchés se crée au-delà de deux des trois seuils du décret. Le parcours « Constituer les commissions du CSE » déroule chacune d'elles.",
        fond: ["L2315-41", "L2315-42", "L2315-44", "L2315-45", "L2315-46", "L2315-47",
          "L2315-49", "L2315-50", "L2315-56", "L2315-44-1", "L2315-44-3", "D2315-29"],
        conv: "des commissions conventionnelles supplémentaires et les moyens qui leur sont attachés" },

      { id: "i8", nom: "Désigner les représentants au conseil d'administration ou de surveillance",
        risque: "La désignation appartient au comité ; à défaut, la représentation prévue par L. 2312-72 n'existe pas, et le comité perd le droit d'assister aux séances du conseil avec voix consultative, de recevoir les mêmes documents que ses membres et de lui soumettre ses vœux, sur lesquels le conseil doit donner un avis motivé (L. 2312-73). Se tromper de configuration — nombre de représentants, catégories, conseil comprenant déjà un administrateur élu ou désigné par les salariés (L. 2312-75), société par actions simplifiée dont les statuts désignent l'organe compétent (L. 2312-76) — expose la désignation à contestation.",
        conseil: "Ouvrez les statuts avant de désigner : la forme sociale commande le nombre de sièges, les catégories et parfois l'organe compétent. Vérifiez si un administrateur élu ou désigné par les salariés siège déjà, car la représentation se ramène alors à un seul titulaire. Notifiez la désignation par écrit à la société et demandez le calendrier des séances et l'envoi systématique des documents : un représentant désigné mais jamais convoqué n'est pas représenté.",
        quoi: "Dans les sociétés, deux membres de la délégation du personnel — l'un des cadres, techniciens et agents de maîtrise, l'autre des employés et ouvriers — assistent avec voix consultative à toutes les séances du conseil ; là où trois collèges électoraux sont constitués, la délégation est portée à quatre membres. Ils ont droit aux mêmes documents que les membres du conseil et peuvent lui soumettre les vœux du comité, sur lesquels il donne un avis motivé. Dans les sociétés anonymes et en commandite par actions dont le conseil comprend déjà un administrateur élu ou désigné par les salariés, la représentation est assurée par un seul membre titulaire désigné par le comité. Dans les sociétés par actions simplifiées, ce sont les statuts qui désignent l'organe social concerné.",
        fond: ["L2312-72", "L2312-73", "L2312-75", "L2312-76", "L2315-32"],
        si: function (P, D) {
          if (D.forme === "l'entreprise n'est pas une société") return false;
          return D.forme ? true : null;
        },
        quand: function (D) {
          if (!D.dateInstallation) return null;
          var un = D.administrateurSalarie === "oui";
          return { iso: D.dateInstallation, libelle: "Désignation en réunion du " + dateFr(D.dateInstallation),
            note: un
              ? "Le conseil comprenant déjà un administrateur ou un membre élu ou désigné par les salariés, la représentation du comité est assurée par un seul membre titulaire (art. L. 2312-75)."
              : (D.troisiemeCollege === "oui"
                ? "Trois collèges étant institués, la délégation au conseil est portée à quatre membres (art. L. 2312-72)."
                : "Deux membres, l'un des cadres, techniciens et agents de maîtrise, l'autre des employés et ouvriers (art. L. 2312-72).") };
        } },

      { id: "i9", nom: "Adopter le règlement intérieur du comité",
        champDate: "dateRI",
        risque: "Sans règlement intérieur, tout ce que la loi laisse ouvert reste sans règle et se rediscute à chaque séance : rôle du bureau, convocation, votes, procès-verbaux, modalités d'arrêté des comptes (L. 2315-68) et, à défaut d'accord, modalités des commissions (L. 2315-44). Une clause imposant à l'employeur des obligations ne résultant pas de dispositions légales ne lui est opposable qu'avec son accord ; et cet accord constitue un engagement unilatéral qu'il peut dénoncer à l'issue d'un délai raisonnable, après en avoir informé les élus (L. 2315-24).",
        conseil: "Partez d'un projet écrit joint à la convocation plutôt que d'une rédaction en séance, et faites voter article par article les points qui suscitent un débat. Repérez les clauses qui pèsent sur l'employeur — moyens supplémentaires, délais, prises en charge de frais — et faites-lui dire au procès-verbal s'il les accepte : sans cette mention, l'engagement ne se prouve pas. Datez le texte adopté et conservez chaque version : c'est un document qui se modifie souvent.",
        jx: "cse-installation",
        quoi: "Le comité détermine, dans un règlement intérieur, les modalités de son fonctionnement et celles de ses rapports avec les salariés. C'est lui qui règle ce que la loi laisse ouvert : rôle du bureau, convocation et déroulement des séances, votes, procès-verbaux, commissions à défaut d'accord, modalités d'arrêté des comptes et de leur rapport, accès aux archives. Une limite : sauf accord de l'employeur, il ne peut comporter de clauses lui imposant des obligations ne résultant pas de dispositions légales — et cet accord constitue un engagement unilatéral, qu'il peut dénoncer à l'issue d'un délai raisonnable après avoir informé les élus.",
        fond: ["L2315-24", "L2315-32", "L2315-44", "L2315-68", "L2315-69"],
        juris: ["11-28.324"],
        quand: function (D) {
          if (!D.dateRI) return null;
          return { iso: D.dateRI, libelle: "Règlement intérieur adopté le " + dateFr(D.dateRI),
            note: "Le code ne fixe pas de délai. Mais le règlement intérieur commande les modalités d'arrêté des comptes (art. L. 2315-68) et le contenu du rapport de gestion (art. L. 2315-69) : l'adopter tard, c'est arrêter le premier exercice sans règle." };
        },
        doc: { modele: "ri-comite", nom: "Règlement intérieur du comité",
          pre: function (P, D) { return { entreprise: P.denomination, effectif: P.effectif,
            dateAdoption: D.dateRI, dateReunion: D.dateInstallation }; } } },

      { id: "i10", nom: "Régler la transition avec le comité sortant — ce que le code dit, et ce qu'il ne dit pas",
        risque: "La personnalité civile du comité survit au renouvellement (L. 2315-23) : contrats, dettes, salariés et engagements du comité sortant demeurent ceux du comité, et les nouveaux élus en héritent sans inventaire s'ils n'en font pas un. Les comptes annuels et les pièces justificatives se conservent dix ans (L. 2315-75). La dévolution des biens n'est ouverte qu'en cas de cessation définitive de l'activité de l'entreprise, et les biens ne peuvent jamais être répartis entre les salariés ou entre les membres du comité (R. 2312-52) : un partage ou une clôture de comptes opérés à l'occasion du seul renouvellement seraient irréguliers.",
        conseil: "Faites l'inventaire avant de changer les mandataires bancaires, et non après : une fois les accès perdus, la reconstitution prend des mois. Listez au procès-verbal les comptes et leurs signataires, les contrats en cours et leurs échéances, les salariés employés par le comité, les assurances, les archives et les pièces justificatives, puis faites signer la remise par le trésorier sortant et le trésorier entrant. Aucun texte lu n'organise cette remise-reprise : c'est au règlement intérieur du comité (L. 2315-24) de le faire, et le faire une fois évite de le refaire à chaque renouvellement.",
        quoi: "Ce point est le moins écrit du parcours, et il vaut mieux le savoir. CE QUI EST ÉCRIT : le comité est doté de la personnalité civile et gère son patrimoine (art. L. 2315-23) — le renouvellement des mandats change les personnes, non la personne morale ; les comptes annuels sont arrêtés selon les modalités du règlement intérieur par des membres élus désignés par le comité, approuvés en séance plénière consacrée à ce seul sujet et faisant l'objet d'un procès-verbal spécifique (art. L. 2315-68), accompagnés du rapport de gestion (art. L. 2315-69) et du rapport du trésorier sur les conventions passées avec un membre (art. L. 2315-70), communiqués trois jours au moins avant (art. L. 2315-71) puis portés à la connaissance des salariés (art. L. 2315-72) ; les comptes et leurs pièces justificatives se conservent dix ans (art. L. 2315-75) ; la dévolution des biens n'est organisée qu'en cas de cessation définitive de l'activité de l'entreprise, et les biens ne peuvent jamais être répartis entre les salariés ou entre les membres du comité (art. R. 2312-52). CE QUI N'EST PAS ÉCRIT : aucun article du code du travail lu au relais le 22 août 2026 n'organise de remise-reprise entre le comité sortant et le comité entrant. L'article R. 2323-38, qui imposait aux membres du comité d'entreprise sortant de rendre compte de leur gestion au nouveau comité et de lui remettre tous les documents, n'est plus en vigueur. À vérifier, donc, et à régler par le règlement intérieur du comité (art. L. 2315-24) : inventaire des biens, comptes bancaires et mandataires, contrats et engagements en cours, salariés employés par le comité, assurances, archives et pièces justificatives, sort du règlement intérieur précédent et des accords conclus avec le comité sortant.",
        fond: ["L2315-23", "L2315-64", "L2315-65", "L2315-68", "L2315-69", "L2315-70",
          "L2315-71", "L2315-72", "L2315-75", "R2312-52", "L2315-24"],
        juris: ["25-10.126", "09-12.758"],
        si: function (P, D) { return D.comitePrecedent === "oui" ? true : (D.comitePrecedent === "non" ? false : null); },
        quand: function (D) {
          if (!D.dateClotureExercice) return null;
          var dix = moisApres(D.dateClotureExercice, 120);
          return { iso: null, libelle: "Comptes et pièces justificatives à conserver jusqu'au " + dateFr(dix),
            note: "Dix ans à compter de la clôture de l'exercice auquel ils se rapportent (art. L. 2315-75). " +
              "Cette échéance-là est écrite ; la remise elle-même ne l'est pas." };
        },
        doc: { modele: "remise-reprise", nom: "Procès-verbal de remise-reprise entre comités",
          pre: function (P, D) { return { entreprise: P.denomination, dateReunion: D.dateInstallation,
            dateElections: D.dateElections, dateFinMandatPrecedent: D.dateFinMandatPrecedent,
            dateCloture: D.dateClotureExercice }; } } },

      { id: "i11", nom: "Ouvrir les budgets : subvention de fonctionnement et contribution aux activités sociales",
        risque: "La subvention de fonctionnement est due à hauteur de 0,20 % de la masse salariale brute de cinquante à moins de deux mille salariés, et de 0,22 % à partir de deux mille (L. 2315-61) : le complément non versé reste dû. La contribution aux activités sociales et culturelles est fixée par accord d'entreprise ; à défaut, son rapport à la masse salariale brute ne peut être inférieur à celui de l'année précédente (L. 2312-81). L'insuffisance se mesure donc en rapport et non en montant : une masse salariale qui progresse plus vite que la contribution suffit à la caractériser.",
        conseil: "Arrêtez d'emblée l'assiette avec l'employeur, par écrit : la masse salariale brute est celle de L. 2312-83, à l'exception des indemnités versées à l'occasion de la rupture d'un contrat à durée indéterminée, et c'est là que naissent la plupart des désaccords. Demandez le détail du calcul et non le seul montant, puis rapprochez-le des déclarations sociales. Ouvrez deux comptes bancaires distincts dès la première réunion : les deux budgets ne se mélangent pas, et tout transfert d'excédent suppose une délibération.",
        jx: "cse-budgets",
        quoi: "Deux budgets, deux régimes. La subvention de fonctionnement est due par l'employeur, à hauteur de 0,20 % de la masse salariale brute de cinquante à moins de deux mille salariés, et de 0,22 % à partir de deux mille. La contribution aux activités sociales et culturelles est fixée par accord d'entreprise ; à défaut, son rapport à la masse salariale brute ne peut être inférieur à celui de l'année précédente. La masse salariale brute est définie à l'article L. 2312-83. L'excédent annuel de l'un peut être transféré à l'autre par délibération, dans la limite de 10 % pour l'excédent des activités sociales et culturelles.",
        fond: ["L2315-61", "L2315-62", "L2312-81", "L2312-82", "L2312-83", "L2312-84",
          "R2312-49", "R2312-51", "L2315-64", "L2315-65", "D2315-33", "L2315-73", "L2315-76"],
        quand: function (D, P) {
          var x = nb(P.effectif);
          if (x === null) return null;
          return { iso: null,
            libelle: "Subvention de fonctionnement : " + (x >= 2000 ? "0,22 %" : "0,20 %") + " de la masse salariale brute",
            note: x >= 2000
              ? "Taux de 0,22 % à partir de deux mille salariés (art. L. 2315-61, 2°)."
              : (x >= 50 ? "Taux de 0,20 % de cinquante à moins de deux mille salariés (art. L. 2315-61, 1°)."
                         : "L'article L. 2315-61 fixe le taux pour les entreprises de cinquante salariés et plus ; effectif renseigné : " + x + ".") };
        } },

      { id: "i12", nom: "Arrêter les moyens : heures, local, déplacements, affichage, visioconférence",
        docProduit: "CSE-CTL-MOY-01",
        risque: "L'employeur laisse aux titulaires le temps nécessaire à l'exercice de leurs fonctions (L. 2315-7) et met à disposition un local aménagé et le matériel nécessaire (L. 2315-25) ; le temps passé aux réunions du comité et de ses commissions, aux enquêtes après accident grave et à la recherche de mesures préventives en situation d'urgence est payé comme temps de travail effectif et n'est pas déduit du crédit d'heures (L. 2315-11). Le temps de délégation est de plein droit temps de travail payé à l'échéance normale, l'employeur qui en conteste l'utilisation devant saisir le juge après paiement (L. 2315-10). Refuser le local, les heures, la libre circulation ou l'affichage caractérise l'entrave au fonctionnement régulier du comité, punie de 7 500 € d'amende (L. 2317-1).",
        conseil: "Faites arrêter les moyens par écrit à l'installation — local, clé, mobilier, poste informatique, accès à une imprimante, panneaux d'affichage — plutôt que de les négocier au coup par coup ensuite. Tenez un registre des heures de délégation par élu, en le distinguant du temps de réunion qui ne s'impute pas dessus, et informez du départ en délégation sans en demander l'autorisation. En l'absence d'accord, tenez le décompte des visioconférences : elles sont limitées à trois par année civile, et ce décompte se perd vite.",
        quoi: "L'employeur laisse aux titulaires le temps nécessaire à l'exercice de leurs fonctions ; à défaut de stipulations d'accord, le nombre mensuel d'heures est celui du tableau de l'article R. 2314-1, augmentable en cas de circonstances exceptionnelles, et les titulaires peuvent le répartir entre eux et avec les suppléants. Le temps passé aux réunions du comité et de ses commissions, aux enquêtes après accident grave et à la recherche de mesures préventives en situation d'urgence est payé comme temps de travail effectif et n'est pas déduit du crédit d'heures. Les élus circulent librement dans l'entreprise et peuvent se déplacer au-dehors durant leurs heures de délégation, et faire afficher les renseignements qu'ils ont pour rôle de porter à la connaissance du personnel. L'employeur met à disposition un local aménagé et le matériel nécessaire ; le comité peut y organiser des réunions d'information, en dehors du temps de travail. En l'absence d'accord, la visioconférence est limitée à trois réunions par année civile.",
        fond: ["L2315-7", "R2314-1", "L2315-9", "L2315-11", "L2315-14", "L2315-15",
          "L2315-25", "L2315-26", "L2315-4", "L2315-3"],
        conv: "des heures de délégation, des moyens ou des facilités supérieurs à ceux du code" },

      { id: "i13", nom: "Ouvrir l'accès à la base de données économiques, sociales et environnementales",
        docProduit: "BDESE-CTL-MAD-01",
        risque: "La base rassemble l'ensemble des informations nécessaires aux consultations et informations récurrentes, et sa mise à disposition actualisée vaut communication des rapports et informations au comité (L. 2312-18) ; à défaut d'accord, elle contient les informations de L. 2312-36 et est accessible en permanence aux élus, aux membres du comité central et aux délégués syndicaux. Sans base, ou avec une base incomplète, les consultations récurrentes reposent sur des informations que le comité peut soutenir n'avoir pas reçues, et le défaut d'information caractérise l'entrave au fonctionnement régulier, punie de 7 500 € d'amende (L. 2317-1).",
        conseil: "Demandez les accès nominatifs dès l'installation et vérifiez-les vous-même : un droit d'accès annoncé et jamais ouvert est le manquement le plus courant, et il se constate par une copie d'écran datée. Faites préciser où se trouve chaque rubrique et à quelle date elle a été mise à jour, la mise à disposition ne valant communication que si elle est effective. Notez que les indicateurs de l'index de l'égalité y figurent : c'est le même document qui sert à deux obligations.",
        quoi: "La base de données rassemble l'ensemble des informations nécessaires aux consultations et informations récurrentes. Un accord d'entreprise — ou, en l'absence de délégué syndical, un accord entre l'employeur et le comité adopté à la majorité des titulaires — définit son organisation, son architecture, son contenu et ses modalités de fonctionnement, notamment les droits d'accès. À défaut d'accord, elle rassemble les informations énumérées à l'article L. 2312-36 et est accessible en permanence aux membres de la délégation du personnel du comité, à ceux du comité central et aux délégués syndicaux.",
        fond: ["L2312-18", "L2312-21", "L2312-36"],
        quand: function (D) {
          if (!D.accordBdese) return null;
          return { iso: null,
            libelle: D.accordBdese === "oui" ? "Droits d'accès fixés par votre accord" : "Régime supplétif de l'article L. 2312-36",
            note: D.accordBdese === "oui"
              ? "L'accord de l'article L. 2312-21 définit les droits d'accès : reportez-vous à sa stipulation."
              : "À défaut d'accord, la base est accessible en permanence aux élus et aux délégués syndicaux (art. L. 2312-36)." };
        } },

      { id: "i14", nom: "Obtenir la documentation économique et financière — un mois après l'élection",
        champDate: "dateDocEco",
        risque: "À défaut d'accord, la documentation économique et financière est due un mois après chaque élection du comité, sans que celui-ci ait à la demander (L. 2312-57). Ne pas la communiquer prive le comité d'une information que la loi lui reconnaît d'office et caractérise l'entrave à son fonctionnement régulier, punie d'une amende de 7 500 € (L. 2317-1).",
        conseil: "Inscrivez la date d'échéance au calendrier dès la proclamation des résultats : le mois se compte depuis l'élection, non depuis la première réunion. Vérifiez les quatre rubriques une à une — forme juridique et organisation, perspectives économiques, position dans le groupe, répartition du capital au-delà de 10 % et position dans la branche — plutôt que d'accepter un document général déjà en circulation. Si elle n'arrive pas, écrivez et datez la demande : c'est cette lettre qui établira le retard.",
        quoi: "À défaut d'accord, un mois après chaque élection du comité, l'employeur lui communique une documentation économique et financière précisant : la forme juridique de l'entreprise et son organisation ; les perspectives économiques telles qu'elles peuvent être envisagées ; le cas échéant, la position de l'entreprise au sein du groupe ; et, compte tenu des informations dont l'employeur dispose, la répartition du capital entre les actionnaires détenant plus de 10 % du capital et la position de l'entreprise dans sa branche d'activité. Cette obligation ne se demande pas : elle est due d'office, et elle est datée.",
        fond: ["L2312-57"],
        quand: function (D) {
          if (!D.dateElections) return null;
          var t = moisApres(D.dateElections, 1);
          return { iso: t, libelle: "Documentation due au plus tard le " + dateFr(t),
            note: D.dateDocEco
              ? ("Communication renseignée au " + dateFr(D.dateDocEco) + " — soit " +
                 joursEntre(D.dateElections, D.dateDocEco) + " jour(s) après l'élection.")
              : "Un mois après chaque élection du comité, à défaut d'accord (art. L. 2312-57)." };
        },
        doc: { modele: "demande-documentation-eco", nom: "Demande de communication de la documentation économique et financière",
          pre: function (P, D) { return { entreprise: P.denomination,
            dateElections: D.dateElections, president: D.president,
            dateEcheance: D.dateElections ? moisApres(D.dateElections, 1) : "" }; } } },

      { id: "i15", nom: "Engager les formations : santé-sécurité et formation économique",
        docProduit: "CSE-CTL-MOY-04",
        risque: "La formation santé, sécurité et conditions de travail est d'une durée minimale de cinq jours lors du premier mandat, et son financement est pris en charge par l'employeur (L. 2315-18) ; le temps de formation est pris sur le temps de travail, rémunéré comme tel, et n'est pas déduit des heures de délégation (L. 2315-16). Le stage de formation économique, d'une durée maximale de cinq jours, bénéficie aux titulaires élus pour la première fois dans les entreprises d'au moins cinquante salariés et est financé par le comité (L. 2315-63) ; il s'impute sur le congé de formation économique, sociale, environnementale et syndicale, congé de droit sauf refus motivé de l'employeur après avis conforme du comité, refus directement contestable devant le bureau de jugement du conseil de prud'hommes (L. 2145-11).",
        conseil: "Ne confondez pas les deux formations, ni surtout leurs financements : c'est là que les factures se retrouvent au mauvais budget, et le comité ne se fait pas rembourser facilement. Choisissez un organisme relevant de L. 2315-17 et conservez la convention, la convocation, l'attestation de présence et la facture. Programmez la formation santé-sécurité dans les premières semaines du mandat : elle conditionne le travail de la commission, et les sessions se remplissent.",
        quoi: "Deux formations distinctes, deux financements distincts. La formation santé, sécurité et conditions de travail est d'une durée minimale de cinq jours lors du premier mandat, de trois jours par élu en cas de renouvellement — de cinq jours pour les membres de la commission santé-sécurité à partir de trois cents salariés — et son financement est à la charge de l'employeur ; le référent harcèlement en bénéficie aussi. Le stage de formation économique, d'une durée maximale de cinq jours, bénéficie aux titulaires élus pour la première fois dans les entreprises d'au moins cinquante salariés ; il est financé par le comité et s'impute sur le congé de formation économique, sociale, environnementale et syndicale. Dans les deux cas, le temps de formation est pris sur le temps de travail, rémunéré comme tel, et n'est pas déduit des heures de délégation.",
        fond: ["L2315-18", "L2315-63", "L2145-11", "L2315-16", "L2315-17"],
        quand: function (D) {
          if (!D.dateElections) return null;
          return { iso: null,
            libelle: D.premierMandat === "oui"
              ? "Premier mandat : cinq jours de formation santé-sécurité et jusqu'à cinq jours de formation économique"
              : "Formations à programmer",
            note: "Le code ne fixe pas de date butoir : il fixe des durées minimales et répartit le financement. " +
              "Une formation repoussée reste une formation due. Les formations sont renouvelées lorsque les " +
              "représentants ont exercé leur mandat pendant quatre ans, consécutifs ou non (art. L. 2315-17)." };
        } },

      { id: "i16", nom: "Fixer le calendrier des réunions ordinaires",
        docProduit: "CSE-CTL-CON-05",
        risque: "À défaut d'accord, le comité se réunit au moins une fois par mois à partir de trois cents salariés et au moins une fois tous les deux mois en deçà (L. 2315-28), et au moins quatre réunions par an portent, en tout ou partie, sur la santé, la sécurité et les conditions de travail (L. 2315-27). Le fait d'apporter une entrave au fonctionnement régulier du comité est puni d'une amende de 7 500 € (L. 2317-1).",
        conseil: "Arrêtez en séance les douze — ou six — dates de l'année et faites-les figurer au procès-verbal : un calendrier voté se tient, un calendrier annoncé se décale. Marquez d'avance les quatre réunions consacrées à la santé et à la sécurité, et répartissez-les sur l'année plutôt que de les grouper à la fin. Placez chaque date assez tôt pour que les trois jours de communication de l'ordre du jour puissent être tenus sans exception.",
        quoi: "À défaut d'accord, le comité se réunit au moins une fois par mois à partir de trois cents salariés, au moins une fois tous les deux mois en dessous. Au moins quatre réunions par an portent, en tout ou partie, sur la santé, la sécurité et les conditions de travail. À partir de la réunion suivante, l'ordre du jour est établi conjointement par le président et le secrétaire, et communiqué trois jours au moins avant. Le parcours « Tenir une réunion du CSE » déroule la réunion ordinaire.",
        fond: ["L2315-28", "L2315-27", "L2315-29", "L2315-30"],
        conv: "une périodicité de réunions ou des réunions supplémentaires propres à la branche",
        quand: function (D, P) {
          if (!D.dateInstallation) return null;
          var trois = seuil(P, 300);
          if (trois === null) return { iso: null, libelle: "Installation le " + dateFr(D.dateInstallation),
            note: "Renseignez l'effectif dans le profil pour connaître la périodicité supplétive (art. L. 2315-28)." };
          var t = moisApres(D.dateInstallation, trois ? 1 : 2);
          return { iso: null, libelle: "Prochaine réunion ordinaire avant le " + dateFr(t),
            note: trois ? "Au moins une réunion par mois à partir de trois cents salariés, à défaut d'accord (art. L. 2315-28)."
                        : "Au moins une réunion tous les deux mois en dessous de trois cents salariés, à défaut d'accord (art. L. 2315-28)." };
        } },

      { id: "i17", nom: "Établir et diffuser le procès-verbal d'installation",
        champDate: "datePV",
        risque: "À défaut d'accord, le procès-verbal est établi et transmis à l'employeur par le secrétaire dans les quinze jours suivant la réunion ou, si une nouvelle réunion est prévue dans ce délai, avant celle-ci (L. 2315-34, D. 2315-26). Sans procès-verbal, les désignations opérées ne se prouvent pas — devant la banque, l'inspection du travail ou le juge — et l'employeur n'est pas mis en mesure de faire connaître, à la réunion suivante, sa décision motivée sur les propositions qui lui ont été soumises.",
        conseil: "Rédigez-le pendant que la séance est fraîche et faites-le adopter à la réunion suivante avant tout affichage : la diffusion suppose l'adoption (L. 2315-35). Reprenez, pour chaque désignation, le nom, la fonction et le décompte des voix, et annexez la feuille de présence. Si l'enregistrement ou la sténographie sont retenus, décidez-le avant la séance et non pendant.",
        quoi: "Les délibérations sont consignées dans un procès-verbal établi par le secrétaire — celui que la réunion vient d'élire — dans un délai fixé par accord ou, à défaut, dans les quinze jours suivant la réunion, ou avant la réunion suivante si elle intervient plus tôt. Il peut, après adoption, être affiché ou diffusé dans l'entreprise par le secrétaire. L'employeur ou la délégation du personnel peuvent décider du recours à l'enregistrement ou à la sténographie des séances.",
        fond: ["L2315-34", "L2315-35", "D2315-26", "D2315-27"],
        quand: function (D) {
          if (!D.dateInstallation) return null;
          var t = jours(D.dateInstallation, 15);
          return { iso: t, libelle: "Procès-verbal à établir au plus tard le " + dateFr(t),
            note: D.datePV
              ? ("Établissement renseigné au " + dateFr(D.datePV) + ".")
              : "Quinze jours à défaut d'accord (art. D. 2315-26) ; ou avant la réunion suivante si elle intervient plus tôt." };
        },
        doc: { modele: "pv-installation", nom: "Procès-verbal d'installation avec les résolutions",
          pre: function (P, D) { return { entreprise: P.denomination, dateReunion: D.dateInstallation,
            lieu: D.lieu, president: D.president, dateElections: D.dateElections,
            nbTitulaires: D.nbTitulaires }; } } },
    ]
  },

  /* ================================================================== */
  /* 8. METTRE EN PLACE LES AFFICHAGES ET INFORMATIONS OBLIGATOIRES     */
  /* ================================================================== */
  /* Un affichage ne coûte rien et se contrôle en dix minutes : c'est le
     premier chapitre du procès-verbal d'un agent de contrôle. Ce parcours
     ne dit rien de plus que ce que les articles lus disent — et il dit
     quand un texte parle d'« affichage » (L. 3171-1, R. 4227-37, D. 4711-1)
     et quand il parle d'« information par tout moyen » (L. 1142-6,
     L. 1152-4, L. 1153-5, R. 3221-2) : les deux ne s'accomplissent pas de
     la même façon, et l'un ne vaut pas l'autre. */
  {
    cle: "affichages",
    suite: { cle: "registre", pourquoi: "Même série de formalités tenues à la disposition de l'inspection du travail : après le tableau d'affichage, le registre unique du personnel." },
    nom: "Mettre en place les affichages et informations obligatoires",
    resume: "Ce qui s'affiche et ce qui s'informe « par tout moyen » : égalité et non-discrimination, égalité de rémunération, harcèlements, coordonnées des secours et des services, horaires collectifs, consigne incendie, convention collective, panneaux syndicaux — puis le relevé daté qui prouve que c'est fait.",
    audit: { href: "audit-social.html", nom: "l'audit social (contrôle de l'existant)" },
    donnees: [
      { c: "dateReleve", nom: "Date du relevé des affichages", t: "date",
        aide: "C'est la date que portera le constat : sans elle, rien ne prouve que l'affichage était en place ce jour-là." },
      { c: "lieux", nom: "Lieux de travail et locaux d'embauche concernés", t: "text",
        aide: "Chaque site, chaque atelier, chaque local d'embauche : l'information est due là où les personnes se trouvent." },
      { c: "supportInformation", nom: "Support retenu pour l'information « par tout moyen »", t: "select",
        options: ["affichage papier", "intranet", "livret remis à l'embauche", "courriel nominatif", "plusieurs supports"],
        aide: "Les textes qui disent « par tout moyen » n'imposent pas l'affichage : ils imposent que l'information atteigne les personnes, et que vous puissiez le prouver." },
      { c: "matieresInflammables", nom: "Des matières inflammables sont-elles manipulées, ou l'effectif d'un local dépasse-t-il cinq personnes ?", t: "oui-non",
        aide: "C'est ce qui déclenche la consigne de sécurité incendie de l'article R. 4227-37." },
      { c: "horaireCollectif", nom: "Les salariés suivent-ils tous un horaire collectif uniforme ?", t: "oui-non",
        aide: "Si oui, l'horaire s'affiche (art. L. 3171-1). Sinon, le décompte est individuel et ce parcours renvoie à l'audit social." },
      { c: "sectionSyndicale", nom: "Une section syndicale est-elle constituée ?", t: "oui-non" },
    ],
    prealable: [
      { id: "textes", g: "document", nom: "Le texte des articles 225-1 à 225-4 et 222-33, 222-33-2 du code pénal",
        aide: "Ce sont les textes que la loi impose de porter à la connaissance des personnes — pas un résumé, le texte." },
      { id: "coordonnees", g: "information", nom: "Les coordonnées à jour : médecin du travail ou service de prévention, secours d'urgence, inspection du travail et nom de l'inspecteur",
        aide: "L'article D. 4711-1 impose l'adresse ET le numéro d'appel, et le nom de l'inspecteur compétent." },
      { id: "referents", g: "information", nom: "Les référents harcèlement désignés (celui du comité, et celui de l'employeur à partir de 250 salariés)",
        aide: "Leurs coordonnées accompagnent l'information sur le harcèlement sexuel." },
      { id: "ccn", g: "document", nom: "Un exemplaire à jour de la convention collective et de ses avenants",
        aide: "L'article R. 2262-1 impose de le tenir à la disposition des salariés sur le lieu de travail, et de le mettre sur l'intranet lorsqu'il en existe un." },
      { id: "horaires", g: "information", nom: "Les heures de début et de fin du travail et la durée des repos",
        aide: "C'est l'objet même de l'affichage de l'article L. 3171-1.",
        si: function (P, D) { return D.horaireCollectif === "non" ? false : true; } },
      { id: "panneaux", g: "pièce", nom: "Les panneaux : ceux du comité, et ceux — distincts — des sections syndicales",
        aide: "L'article L. 2142-3 exige que les panneaux syndicaux soient distincts de ceux du comité.",
        si: function (P, D) { return D.sectionSyndicale === "non" ? false : true; } },
      { id: "appareil", g: "pièce", nom: "De quoi photographier ou horodater chaque affichage",
        aide: "Une photographie datée est la seule preuve simple qu'un affichage était en place. Sans elle, « je l'ai affiché » ne vaut rien devant un agent de contrôle." },
    ],
    etapes: [
      { id: "a1", nom: "Informer sur l'égalité de traitement et la non-discrimination",
        risque: "Aucune contravention n'a été trouvée qui sanctionne spécifiquement le défaut de cette information : l'article L. 1146-1, qui punit d'un an d'emprisonnement et de 3 750 euros la méconnaissance de l'égalité professionnelle, vise les articles L. 1142-1 et L. 1142-2, non l'article L. 1142-6. La conséquence est civile, et elle est réelle : le manquement d'information est retenu contre l'employeur dans les contentieux de discrimination, où il prive la défense de son premier appui.",
        conseil: "Reproduisez les articles dans leur rédaction en vigueur, sans les résumer ni les commenter, et datez le support. L'oubli le plus fréquent porte sur le local d'embauche, souvent distinct du lieu de travail : siège, agence de recrutement, accueil. Photographiez chaque emplacement et rangez le cliché daté au dossier des affichages.",
        quoi: "Dans les lieux de travail ainsi que dans les locaux ou à la porte des locaux où se fait l'embauche, portez par tout moyen à la connaissance des personnes le texte des articles 225-1 à 225-4 du code pénal. Le texte, pas un résumé : c'est ce que l'article impose.",
        fond: ["L1142-6"],
        doc: { modele: "note-rh", nom: "Note d'information aux salariés",
          pre: function (P, D) { return { entreprise: P.denomination, objet: "Information sur la non-discrimination — articles 225-1 à 225-4 du code pénal", date: D.dateReleve }; } } },
      { id: "a2", nom: "Informer sur l'égalité de rémunération entre les femmes et les hommes",
        risque: "L'article R. 3222-3 punit de l'amende prévue pour les contraventions de la troisième classe le fait de ne pas communiquer, dans les conditions de l'article R. 3221-2, les articles relatifs à l'égalité de rémunération entre les femmes et les hommes. À distinguer de l'article R. 3222-1, qui frappe d'une contravention de la cinquième classe, appliquée autant de fois qu'il y a de travailleurs rémunérés dans des conditions illégales, la méconnaissance des règles de fond des articles L. 3221-2 à L. 3221-6.",
        conseil: "Le support doit atteindre deux publics distincts : les personnes qui accèdent aux lieux de travail, et les candidats à l'embauche. Reprenez donc l'information dans le dossier de candidature ou l'accusé de réception, et pas seulement au panneau. Datez la mise à jour à chaque modification des textes.",
        quoi: "Les dispositions des articles L. 3221-1 à L. 3221-7 et leurs textes d'application sont portées, par tout moyen, à la connaissance des personnes ayant accès aux lieux de travail ainsi qu'aux candidats à l'embauche. Les candidats aussi : c'est le point que l'on oublie.",
        fond: ["R3221-2"],
        doc: { modele: "note-rh", nom: "Note d'information aux salariés",
          pre: function (P, D) { return { entreprise: P.denomination, objet: "Information sur l'égalité de rémunération — articles L. 3221-1 à L. 3221-7", date: D.dateReleve }; } } },
      { id: "a3", nom: "Informer sur les harcèlements moral et sexuel et les agissements sexistes",
        docProduit: "SST-CTL-HAR-03",
        risque: "Aucun texte lu ne réprime spécifiquement le défaut de cette information ; l'article L. 1155-2 punit d'un an d'emprisonnement et de 3 750 euros les discriminations commises à la suite d'un harcèlement, ce qui est autre chose. Le manquement pèse en revanche lourdement dans tout contentieux de harcèlement : c'est la prévention documentée qui conditionne l'exonération de la responsabilité de l'employeur.",
        conseil: "Le support ne se limite pas au texte pénal : pour le harcèlement sexuel, il porte aussi les actions contentieuses ouvertes et les coordonnées des autorités, services et référents. Ce sont ces coordonnées qui périment — inspection, médecin du travail, référents désignés. Fixez une revue annuelle et une revue à chaque changement de référent : une information périmée ne vaut pas information.",
        jx: "harcelement",
        quoi: "Le texte de l'article 222-33-2 du code pénal pour le harcèlement moral ; le texte de l'article 222-33 et les actions contentieuses civiles et pénales ouvertes pour le harcèlement sexuel, dans les lieux de travail comme dans les locaux d'embauche. L'information s'accompagne des coordonnées utiles — médecin du travail, inspection du travail, Défenseur des droits, référents.",
        fond: ["L1152-4", "L1153-5"],
        doc: { modele: "signalement-harcelement", nom: "Procédure de signalement harcèlement",
          pre: function (P, D) { return { entreprise: P.denomination, date: D.dateReleve }; } } },
      { id: "a4", nom: "Afficher les coordonnées du médecin du travail, des secours et de l'inspection du travail",
        risque: "L'article R. 4741-3 punit de l'amende prévue pour les contraventions de la quatrième classe la méconnaissance des articles D. 4711-1 à D. 4711-3 relatifs aux documents et affichages obligatoires ; l'amende est appliquée autant de fois qu'il y a de personnes employées dans des conditions susceptibles d'être sanctionnées. C'est l'affichage le moins coûteux à mettre en place, et l'un des plus chers à omettre.",
        conseil: "Celui-là s'affiche vraiment — il n'est pas dû « par tout moyen » : prévoyez un support physique dans un local normalement accessible. Le nom de l'inspecteur compétent change au gré des affectations : c'est la mention qui se périme la première. Rapprochez l'affiche du service de prévention et de santé au travail une fois l'an, et datez la vérification.",
        quoi: "Celui-là s'affiche, et dans des locaux normalement accessibles aux travailleurs : adresse et numéro d'appel du médecin du travail ou du service compétent, des services de secours d'urgence, de l'inspection du travail — avec le nom de l'inspecteur compétent.",
        fond: ["D4711-1"] },
      { id: "a5", nom: "Établir et afficher la consigne de sécurité incendie",
        risque: "L'article L. 4741-1 punit d'une amende de 10 000 euros, appliquée autant de fois qu'il y a de travailleurs concernés, la méconnaissance par faute personnelle des dispositions du titre II du livre II de la quatrième partie, dont relève l'article R. 4227-37. En amont, l'inspection du travail peut mettre en demeure ; en aval, la carence engage la responsabilité de l'employeur si un incendie survient.",
        conseil: "L'affichage ne suffit pas : la consigne se démontre par les essais et exercices périodiques, qui se datent et se consignent. Désignez les personnes chargées de l'évacuation par leur fonction plutôt que par leur nom, pour que la consigne survive aux départs. Vérifiez que chaque local concerné en porte un exemplaire, et non le seul hall d'entrée.",
        quoi: "La consigne est établie et affichée « de manière très apparente » : dans chaque local dont l'effectif dépasse cinq personnes, et dans chaque local ou dégagement desservant un groupe de locaux dans les autres cas.",
        fond: ["R4227-37"],
        si: function (P, D) { return D.matieresInflammables === "non" ? false : true; } },
      { id: "a6", nom: "Afficher l'horaire collectif et les repos",
        risque: "L'article R. 3173-2 punit de l'amende prévue pour les contraventions de la quatrième classe la méconnaissance des deux premiers alinéas de l'article L. 3171-1, l'amende étant appliquée autant de fois qu'il y a de personnes employées dans des conditions susceptibles d'être sanctionnées. En litige sur les heures supplémentaires, l'absence d'affichage se retourne en outre contre l'employeur, à qui il revient de justifier des horaires pratiqués.",
        conseil: "Affichez l'horaire daté et signé, et conservez un exemplaire daté à chaque changement : c'est la série des versions successives qui prouve l'horaire d'une période passée. Pour les salariés qui ne suivent pas l'horaire collectif — horaires individualisés, équipes successives, forfaits, itinérants — l'affichage ne suffit pas : c'est un décompte individuel qu'il faut tenir.",
        quoi: "L'employeur affiche les heures auxquelles commence et finit le travail ainsi que les heures et la durée des repos. Lorsque la durée du travail est organisée sur une période de référence, l'affichage comprend la répartition de la durée du travail dans ce cadre.",
        fond: ["L3171-1"],
        si: function (P, D) { return D.horaireCollectif === "non" ? false : true; } },
      { id: "a7", nom: "Informer sur la convention collective et tenir un exemplaire à disposition",
        risque: "Les contraventions des articles R. 2263-1 et R. 2263-2 visent les articles R. 2262-3 et R. 2262-4, non l'article R. 2262-1 : aucune peine n'a été trouvée pour ce seul manquement. La conséquence est civile et joue à sens unique — le défaut d'information ne dispense pas l'employeur d'appliquer la convention, dont les avantages restent dus aux salariés.",
        conseil: "Deux obligations distinctes se confondent souvent : informer chaque salarié des textes applicables, et tenir un exemplaire à jour à sa disposition sur le lieu de travail. Un lien intranet vers un texte non consolidé ne remplit ni l'une ni l'autre. Datez la version mise à disposition et suivez les avenants : c'est la mise à jour, plus que la mise en place, qui fait défaut.",
        quoi: "À défaut d'autres modalités prévues par un accord, l'employeur informe le salarié des conventions et accords applicables, tient un exemplaire à jour à la disposition des salariés sur le lieu de travail, et le met à disposition sur l'intranet lorsqu'il en existe un.",
        fond: ["R2262-1"],
        conv: "les modalités d'information que votre convention prévoit elle-même — l'article R. 2262-1 ne joue qu'« à défaut d'autres modalités prévues par une convention ou un accord »",
        doc: { modele: "note-rh", nom: "Avis d'information sur la convention collective",
          pre: function (P, D) { return { entreprise: P.denomination,
            objet: "Convention collective applicable : " + (P.conventionCollective || "à renseigner dans la fiche client") + " — modalités de consultation",
            date: D.dateReleve }; } } },
      { id: "a8", nom: "Mettre à disposition les panneaux syndicaux, distincts de ceux du comité",
        risque: "L'article L. 2146-1 punit d'un emprisonnement d'un an et d'une amende de 3 750 euros l'entrave à l'exercice du droit syndical défini par les articles L. 2141-4, L. 2141-9 et L. 2141-11 à L. 2143-22, au nombre desquels figure l'article L. 2142-3. Refuser les panneaux, les confondre avec ceux du comité ou soumettre l'affichage syndical à une autorisation préalable entre dans ce champ.",
        conseil: "Deux supports, deux emplacements, une signalétique qui ne prête pas à confusion avec ceux du comité. L'employeur reçoit un exemplaire des communications simultanément à l'affichage : il le reçoit, il ne l'autorise pas — ne répondez jamais par un visa. Formalisez par accord les modalités de mise à disposition, datez-le, et conservez-le avec la liste des sections destinataires.",
        quoi: "L'affichage des communications syndicales s'effectue librement sur des panneaux réservés à cet usage, distincts de ceux affectés aux communications du comité. Un exemplaire des communications est transmis à l'employeur simultanément à l'affichage ; les modalités de mise à disposition se fixent par accord avec l'employeur.",
        fond: ["L2142-3"],
        si: function (P, D) { return D.sectionSyndicale === "non" ? false : true; } },
      { id: "a9", nom: "Réunir les registres de santé-sécurité en un registre unique, si vous le souhaitez",
        risque: "Réunir les registres est une faculté : ne pas l'exercer n'expose à rien. C'est l'obligation sous-jacente qui est sanctionnée — l'article R. 4741-3 punit de l'amende prévue pour les contraventions de la quatrième classe la méconnaissance des articles L. 4711-1 à L. 4711-5, appliquée autant de fois qu'il y a de personnes employées dans des conditions susceptibles d'être sanctionnées.",
        conseil: "N'exercez la faculté que si elle simplifie réellement la consultation : un registre unique mal indexé se produit plus mal qu'une série de classeurs séparés. Si vous réunissez, tenez un sommaire daté renvoyant à chaque catégorie de vérification, et conservez les rapports d'origine. Ce sont les rapports, non le registre, que l'agent de contrôle demande.",
        quoi: "Lorsqu'il est prévu que les informations des articles L. 4711-1 et L. 4711-2 figurent dans des registres distincts, l'employeur est autorisé à les réunir dans un registre unique dès lors que cette mesure facilite leur conservation et leur consultation. C'est une faculté, pas une obligation.",
        fond: ["L4711-5"] },
      { id: "a10", nom: "VALIDATION — dresser le relevé daté des affichages et informations",
        risque: "Aucun texte n'impose ce relevé : ce qu'on risque à ne pas le tenir est probatoire. Au contrôle, l'employeur ne peut établir que chaque information a bien été portée à la connaissance des intéressés, et les contraventions attachées à chacune des étapes précédentes — R. 4741-3 pour les affichages de sécurité, R. 3173-2 pour l'horaire collectif, R. 3222-3 pour l'égalité de rémunération — se constatent alors sans qu'il ait rien à leur opposer.",
        conseil: "Faites la tournée site par site, et non depuis un bureau : les affichages manquent là où l'on ne passe pas — réserves, ateliers, agences, chantiers. Photographiez, horodatez, nommez chaque cliché du lieu et de la date. Pour ce qui est dû « par tout moyen », la preuve du support vaut la photographie : accusé de diffusion, capture d'intranet, émargement du livret d'accueil. Refaites la tournée à date fixe une fois l'an.",
        quoi: "Parcourez chaque lieu de travail et chaque local d'embauche, photographiez chaque affichage, datez le relevé, et conservez-le. Pour ce qui est dû « par tout moyen », conservez la preuve du support : accusé de diffusion, capture de l'intranet, émargement du livret. Ce relevé est la pièce que vous produirez au contrôle de l'existant de l'audit social — et le parcours n'est terminé que lorsqu'il existe.",
        fond: ["L1142-6", "R3221-2", "D4711-1", "L1152-4", "L1153-5"],
        quand: function (D) {
          if (!D.dateReleve) return null;
          var t = jours(D.dateReleve, 365);
          return { iso: t, libelle: "Relevé à refaire au plus tard le " + dateFr(t),
            note: "Aucun texte n'impose de refaire le relevé chaque année : c'est une prudence de gestion. Les coordonnées de l'article D. 4711-1 changent (inspecteur, service de prévention), et un affichage décroché ne se voit que lorsqu'on le regarde." };
        },
        doc: { modele: "note-rh", nom: "Relevé des affichages — note de constat",
          pre: function (P, D) { return { entreprise: P.denomination,
            objet: "Relevé des affichages et informations obligatoires" + (D.lieux ? " — " + D.lieux : ""),
            date: D.dateReleve }; } } },
    ]
  },

  /* ================================================================== */
  /* 9. TENIR LE REGISTRE UNIQUE DU PERSONNEL                          */
  /* ================================================================== */
  {
    cle: "registre",
    suite: { cle: "embauche", pourquoi: "Le registre s'alimente à chaque embauche : le parcours d'embauche enchaîne les formalités qui l'accompagnent." },
    nom: "Tenir le registre unique du personnel",
    resume: "Un registre par établissement, dans l'ordre des embauches et de façon indélébile : les treize mentions de l'article D. 1221-23, la partie spécifique aux stagiaires et volontaires, la copie des titres de travail des salariés étrangers, la mise à jour au fil des événements, et la mise à disposition du comité et des agents de contrôle.",
    audit: { href: "audit-social.html", nom: "l'audit social (contrôle de l'existant)" },
    jx: "registre",
    donnees: [
      { c: "etablissement", nom: "Établissement concerné", t: "text",
        aide: "Le registre est tenu dans TOUT établissement où sont employés des salariés (art. L. 1221-13) : un registre par établissement, pas un pour l'entreprise." },
      { c: "dateOuverture", nom: "Date d'ouverture ou de reprise du registre", t: "date" },
      { c: "support", nom: "Support du registre", t: "select",
        options: ["papier relié", "support de substitution informatique"],
        aide: "Un support de substitution appelle les exigences des articles D. 8113-2 et D. 8113-3, et l'avis du comité adressé à l'inspection du travail (art. D. 1221-27)." },
      { c: "stagiaires", nom: "L'établissement accueille-t-il des stagiaires ou des volontaires en service civique ?", t: "oui-non" },
      { c: "etrangers", nom: "L'établissement emploie-t-il des travailleurs étrangers soumis à titre de travail ?", t: "oui-non" },
      { c: "interimaires", nom: "L'établissement recourt-il à des salariés temporaires ou à un groupement d'employeurs ?", t: "oui-non" },
      { c: "dateAvisCSE", nom: "Date de l'avis du comité sur le support de substitution", t: "date",
        si: function (P, D) { return D.support === "support de substitution informatique" ? true : (D.support ? false : null); } },
    ],
    prealable: [
      { id: "liste", g: "information", nom: "La liste de tous les salariés, dans l'ordre chronologique des embauches",
        aide: "L'ordre des embauches n'est pas décoratif : c'est ce que l'article L. 1221-13 impose, et c'est ce qu'un agent de contrôle vérifie d'abord." },
      { id: "mentions", g: "information", nom: "Pour chacun : nationalité, date de naissance, sexe, emploi, qualification, dates d'entrée et de sortie",
        aide: "Les six premières des treize indications complémentaires de l'article D. 1221-23." },
      { id: "titres", g: "pièce", nom: "La copie des titres autorisant l'activité salariée des travailleurs étrangers",
        aide: "Elle est annexée au registre et rendue accessible aux élus et aux agents de contrôle (art. D. 1221-24).",
        si: function (P, D) { return D.etrangers === "non" ? false : true; } },
      { id: "autorisations", g: "pièce", nom: "Les dates des autorisations d'embauche ou de licenciement, lorsqu'une autorisation est requise",
        aide: "Septième indication de l'article D. 1221-23 : à défaut d'autorisation, la date de la demande." },
      { id: "avis", g: "document", nom: "L'avis du comité social et économique sur le support de substitution",
        aide: "L'article D. 1221-27 impose de l'adresser à l'inspection du travail.",
        si: function (P, D) { return D.support === "support de substitution informatique" ? true : (D.support ? false : null); } },
    ],
    etapes: [
      { id: "r1", nom: "Ouvrir un registre par établissement",
        champDate: "dateOuverture",
        risque: "L'article R. 1227-7 punit de l'amende prévue pour les contraventions de la quatrième classe la méconnaissance de l'article L. 1221-13 relatif au registre unique du personnel ; l'amende est appliquée autant de fois qu'il y a de personnes employées dans des conditions susceptibles d'être sanctionnées. L'absence de registre dans un établissement n'est donc pas une infraction, mais autant d'infractions qu'il y compte de salariés.",
        conseil: "Ouvrez un registre par établissement, quand bien même la paie serait centralisée : ce qui se demande au contrôle, c'est le registre du site visité, sur-le-champ. Si vous tenez une base centrale, préparez l'extraction par établissement et vérifiez qu'elle s'imprime sur place. Nommez, dans chaque établissement, la personne qui en répond.",
        jx: "registre",
        quoi: "Un registre unique du personnel est tenu dans tout établissement où sont employés des salariés. Si l'entreprise compte plusieurs établissements, elle compte autant de registres — la centralisation ne dispense pas de la tenue sur place.",
        fond: ["L1221-13"],
        quand: function (D) {
          if (!D.dateOuverture) return null;
          return { iso: D.dateOuverture, libelle: "Registre ouvert le " + dateFr(D.dateOuverture) };
        } },
      { id: "r2", nom: "Inscrire les noms et prénoms dans l'ordre des embauches, de façon indélébile",
        risque: "Même exposition qu'à l'étape précédente : l'article R. 1227-7 sanctionne la méconnaissance de l'article L. 1221-13 de l'amende prévue pour les contraventions de la quatrième classe, appliquée autant de fois qu'il y a de personnes employées dans des conditions susceptibles d'être sanctionnées. Un registre renseigné en fin de mois est, pour les embauches de ce mois, un registre non tenu.",
        conseil: "Inscrivez à l'entrée du salarié, non à la signature du contrat ni au premier bulletin : c'est le seul moment qui ne se rattrape pas. L'exigence d'indélébilité interdit le crayon et, sur support numérique, l'écrasement silencieux — conservez l'historique des modifications. Un intérimaire ou un salarié d'un jour s'inscrit comme les autres : c'est l'omission la plus fréquente.",
        quoi: "Les mentions sont portées sur le registre au moment de l'embauche et de façon indélébile. « Au moment de l'embauche » : pas à la fin du mois, pas quand le contrat est signé — au moment où le salarié entre.",
        fond: ["L1221-13"] },
      { id: "r3", nom: "Ouvrir la partie spécifique aux stagiaires et aux volontaires en service civique",
        risque: "L'article L. 1221-13 range cette partie spécifique parmi les mentions du registre, et l'article R. 1227-7 en punit la méconnaissance de l'amende prévue pour les contraventions de la quatrième classe, appliquée autant de fois qu'il y a de personnes employées dans des conditions susceptibles d'être sanctionnées.",
        conseil: "Une partie distincte, pas une colonne supplémentaire : mêler stagiaires et salariés dans la même suite fait douter de l'une et de l'autre. L'ordre est celui de l'arrivée, non celui de la signature des conventions. Rapprochez cette partie des conventions conclues avec les établissements d'enseignement une fois par trimestre : c'est là que se voient les accueils oubliés.",
        quoi: "Les nom et prénoms des stagiaires et des personnes volontaires en service civique accueillis dans l'établissement sont inscrits dans l'ordre d'arrivée, dans une partie spécifique du registre — distincte de celle des salariés.",
        fond: ["L1221-13"],
        si: function (P, D) { return D.stagiaires === "non" ? false : true; } },
      { id: "r4", nom: "Porter les treize indications complémentaires",
        risque: "L'article R. 1227-7 vise expressément les articles D. 1221-23 à R. 1221-26 relatifs au registre unique du personnel et punit leur méconnaissance de l'amende prévue pour les contraventions de la quatrième classe, appliquée autant de fois qu'il y a de personnes employées dans des conditions susceptibles d'être sanctionnées. Une mention manquante expose donc au même titre qu'un registre absent.",
        conseil: "Construisez le registre à partir de la liste des treize indications, non à partir de ce que produit le logiciel de paie. Les mentions de nature de contrat — « contrat à durée déterminée », « salarié temporaire », « mis à disposition par un groupement d'employeurs », « salarié à temps partiel », « apprenti » — sont celles qui manquent le plus souvent, faute d'être des données de paie. Reprenez les libellés du texte tels quels, sans les abréger.",
        jx: "registre",
        quoi: "Nationalité ; date de naissance ; sexe ; emploi ; qualification ; dates d'entrée et de sortie ; date de l'autorisation d'embauche ou de licenciement lorsqu'elle est requise, ou à défaut de la demande ; titre valant autorisation de travail pour les travailleurs étrangers ; et les mentions « contrat à durée déterminée », « salarié temporaire » avec le nom et l'adresse de l'entreprise de travail temporaire, « mis à disposition par un groupement d'employeurs » avec sa dénomination et son adresse, « salarié à temps partiel », « apprenti » ou « contrat de professionnalisation ».",
        fond: ["D1221-23"] },
      { id: "r5", nom: "Annexer la copie des titres de travail des salariés étrangers",
        risque: "Même article de sanction : l'article R. 1227-7 punit de l'amende prévue pour les contraventions de la quatrième classe la méconnaissance des articles D. 1221-23 à R. 1221-26, appliquée autant de fois qu'il y a de personnes employées dans des conditions susceptibles d'être sanctionnées. L'exposition dépasse ici le registre — l'emploi d'un travailleur étranger sans titre relève d'un autre régime, plus lourd, qui n'a pas été lu pour ce parcours.",
        conseil: "Annexez la copie ; ne vous contentez pas d'un numéro reporté dans une colonne. Sur chantier ou sur un lieu de travail distinct, la copie doit être consultable là où les travailleurs sont employés : prévoyez le jeu de copies qui voyage avec l'équipe. Tenez un échéancier des dates de fin de validité — un titre expiré non renouvelé est le point de contrôle le plus immédiat.",
        quoi: "Elle est annexée au registre et rendue accessible aux membres de la délégation du personnel du comité et aux agents de contrôle. Elle est tenue à leur disposition soit dans l'établissement, soit sur chaque chantier ou lieu de travail distinct où ces travailleurs sont employés.",
        fond: ["D1221-24"],
        si: function (P, D) { return D.etrangers === "non" ? false : true; } },
      { id: "r6", nom: "Mettre à jour au moment où l'événement survient",
        risque: "L'article R. 1227-7 punit de l'amende prévue pour les contraventions de la quatrième classe la méconnaissance des articles D. 1221-23 à R. 1221-26, appliquée autant de fois qu'il y a de personnes employées dans des conditions susceptibles d'être sanctionnées. Une sortie inscrite trois mois plus tard est, pendant trois mois, une mention manquante.",
        conseil: "Accrochez la mise à jour à l'événement qui la déclenche, non à une revue périodique : dernier jour travaillé, changement de qualification, passage à temps partiel, obtention d'un titre. Le point de fuite est la sortie, que la paie enregistre plus tard que le départ réel. Faites du registre une étape de la procédure de départ, avant la remise des documents de fin de contrat.",
        quoi: "Les mentions relatives à des événements postérieurs à l'embauche du salarié, ou à l'arrivée du stagiaire, sont portées sur le registre au moment où ceux-ci surviennent. Une sortie inscrite trois mois plus tard est une sortie non inscrite.",
        fond: ["D1221-25"] },
      { id: "r7", nom: "Régulariser le support de substitution informatique",
        champDate: "dateAvisCSE",
        risque: "L'énumération de l'article R. 1227-7 s'arrête à l'article R. 1221-26 : aucune contravention n'y sanctionne expressément l'article D. 1221-27. Mais un support de substitution qui ne satisfait pas aux exigences des articles D. 8113-2 et D. 8113-3 ne tient pas lieu de registre, et c'est alors l'obligation de l'article L. 1221-13 elle-même qui est méconnue — avec la contravention de quatrième classe, par personne employée, que l'article R. 1227-7 y attache.",
        conseil: "Prenez les deux formalités dans l'ordre : l'avis du comité d'abord, son envoi à l'inspection du travail ensuite, chacun daté et conservé. Vérifiez que le support se lit et s'imprime sans manipulation particulière et que rien ne s'y altère : un tableur partagé, modifiable et sans historique, ne remplit pas la condition. Conservez-le aussi longtemps que le registre papier auquel il se substitue.",
        quoi: "Lorsque l'employeur recourt à un support de substitution, les exigences des articles D. 8113-2 et D. 8113-3 sont applicables, et il adresse à l'inspection du travail l'avis du comité social et économique prévu à l'article L. 2315-5.",
        fond: ["D1221-27"],
        si: function (P, D) { return D.support === "support de substitution informatique" ? true : (D.support ? false : null); },
        quand: function (D) {
          if (!D.dateAvisCSE) return null;
          return { iso: D.dateAvisCSE, libelle: "Avis du comité recueilli le " + dateFr(D.dateAvisCSE),
            note: "L'article D. 1221-27 impose d'adresser cet avis à l'inspection du travail ; il ne fixe pas de délai." };
        } },
      { id: "r8", nom: "VALIDATION — tenir le registre à la disposition du comité et des agents de contrôle",
        risque: "L'article R. 1227-7 cite expressément l'article L. 1221-15 et punit sa méconnaissance de l'amende prévue pour les contraventions de la quatrième classe, appliquée autant de fois qu'il y a de personnes employées dans des conditions susceptibles d'être sanctionnées. Un registre tenu mais introuvable, ou inaccessible aux élus, n'est pas un registre tenu à disposition.",
        conseil: "Écrivez aux élus où le registre se consulte, sous quel délai et auprès de qui, et gardez la trace de cet envoi : c'est cette lettre, plus que le registre, qui prouve la mise à disposition. Ne subordonnez la consultation ni à un motif ni à un rendez-vous préalable. Refaites l'information à chaque renouvellement du comité et à chaque changement de lieu.",
        quoi: "Le registre est tenu à la disposition du comité social et économique et des fonctionnaires et agents chargés de veiller à l'application du code du travail et du code de la sécurité sociale. Datez cette mise à disposition, dites où le registre se consulte, et informez-en les élus par écrit : le parcours n'est terminé que lorsque le registre est consultable et que quelqu'un le sait.",
        fond: ["L1221-15"],
        doc: { modele: "note-rh", nom: "Note aux élus — mise à disposition du registre",
          pre: function (P, D) { return { entreprise: P.denomination,
            objet: "Registre unique du personnel" + (D.etablissement ? " — établissement " + D.etablissement : "") + " : lieu et modalités de consultation",
            date: D.dateOuverture }; } } },
    ]
  },

  /* ================================================================== */
  /* 10. CONSTITUER LA BASE DE DONNÉES (BDESE)                         */
  /* ================================================================== */
  {
    cle: "bdese",
    suite: { cle: "nao", pourquoi: "La négociation sur l'égalité professionnelle s'appuie sur les données de la base : la base d'abord, la négociation ensuite." },
    nom: "Constituer la base de données (BDESE)",
    resume: "L'accord d'abord, le régime supplétif ensuite : ce que l'accord de l'article L. 2312-21 peut définir, ce que la base doit contenir à défaut d'accord selon l'effectif (R. 2312-8 sous trois cents, R. 2312-9 au-delà), l'accès permanent des élus et des délégués syndicaux, et la mise à disposition qui vaut communication.",
    audit: { href: "audit-bdese.html", nom: "le module d'audit de la base (BDESE)" },
    donnees: [
      { c: "accordBdese", nom: "Un accord définit-il l'organisation, l'architecture, le contenu et le fonctionnement de la base ?", t: "oui-non",
        aide: "Accord d'entreprise de l'article L. 2232-12 ou, en l'absence de délégué syndical, accord entre l'employeur et le comité adopté à la majorité des titulaires (art. L. 2312-21)." },
      { c: "accordBranche", nom: "À défaut, un accord de branche définit-il la base ?", t: "oui-non",
        aide: "L'article L. 2312-21 ne l'ouvre qu'aux entreprises de moins de trois cents salariés.",
        si: function (P, D) { return D.accordBdese === "oui" ? false : true; } },
      { c: "support", nom: "Support de la base", t: "select",
        options: ["informatique", "papier"],
        aide: "L'article L. 2312-36 impose l'accès permanent : un support papier rend cet accès difficile à assurer, sans être interdit." },
      { c: "dateMiseADisposition", nom: "Date de mise à disposition (ou de dernière actualisation)", t: "date" },
      { c: "etablissementsDistincts", nom: "L'entreprise comporte-t-elle des établissements distincts ?", t: "oui-non",
        aide: "L'accord fixe alors le niveau de mise en place de la base (art. L. 2312-21)." },
    ],
    prealable: [
      { id: "accord", g: "document", nom: "L'accord qui définit la base, s'il existe",
        aide: "C'est lui qui commande : le régime supplétif de l'article L. 2312-36 ne s'applique qu'« en l'absence d'accord prévu à l'article L. 2312-21 »." },
      { id: "rubriques", g: "information", nom: "Les données des deux années précédentes, de l'année en cours, et les perspectives sur les trois années suivantes",
        aide: "C'est la profondeur temporelle que l'article L. 2312-36 impose au régime supplétif." },
      { id: "index", g: "information", nom: "Les indicateurs de l'index de l'égalité et les informations sur leur méthodologie",
        aide: "L'article L. 2312-18 les range expressément dans la base, avec les écarts de représentation parmi les cadres dirigeants et les instances dirigeantes." },
      { id: "formations", g: "information", nom: "Le bilan des actions de formation entreprises à l'issue des entretiens de parcours professionnel",
        aide: "L'article L. 2312-18 l'inscrit également dans la base, aux côtés des périodes de reconversion de l'article L. 6324-1." },
      { id: "acces", g: "information", nom: "La liste des élus et des délégués syndicaux à qui l'accès est dû",
        aide: "Membres de la délégation du personnel du comité, du comité central, et délégués syndicaux (art. L. 2312-36)." },
    ],
    etapes: [
      { id: "b1", nom: "Déterminer le régime : accord, accord de branche, ou supplétif",
        docProduit: "BDESE-CTL-REG-01",
        risque: "Tant que le texte applicable n'est pas identifié, la grille due est inconnue : l'article L. 2312-21 laisse l'accord définir l'organisation, l'architecture et le contenu de la base, et le décret ne s'applique qu'à son défaut. Les deux grilles ne se recouvrent pas, et l'erreur de texte se paie en rubriques manquantes, que le comité oppose ensuite à la régularité des consultations. Le dernier alinéa du même article ne permet à un accord de branche de suppléer qu'à défaut d'accord d'entreprise, et dans les entreprises de moins de trois cents salariés.",
        conseil: "Commencez par produire la pièce, non par la décrire : l'accord signé, avec sa date et son dépôt, ou le constat écrit qu'il n'en existe aucun. Un dossier qui déclare un accord sans le verser, ou qui invoque le régime supplétif tout en produisant un accord, se contredit lui-même. Datez la réponse et rangez-la en tête du dossier de la base : tout le reste s'y rapporte.",
        quoi: "Un accord d'entreprise — ou, en l'absence de délégué syndical, un accord entre l'employeur et le comité adopté à la majorité des titulaires — définit l'organisation, l'architecture et le contenu de la base, ainsi que ses modalités de fonctionnement : droits d'accès, niveau de mise en place dans les entreprises à établissements distincts, support, modalités de consultation et d'utilisation. À défaut, un accord de branche peut le faire dans les entreprises de moins de trois cents salariés.",
        fond: ["L2312-21"] },
      { id: "b2", nom: "Vérifier les dix thèmes que la base comporte au moins",
        docProduit: "BDESE-CTL-CNT-01",
        risque: "Le troisième alinéa de l'article L. 2312-21 dit que la base « comporte au moins » ces thèmes : ce plancher s'impose à tout accord, et la stipulation qui en retire un est, sur ce point, sans effet. Une base amputée ne rassemble pas l'ensemble des informations nécessaires aux consultations récurrentes que l'article L. 2312-18 lui fait porter : la consultation qui s'en réclame peut être jugée irrégulière.",
        conseil: "Vérifiez thème par thème, en cochant, et non en lisant le sommaire de l'accord : c'est le contenu réellement versé qui compte, pas l'intitulé de la rubrique. Le thème environnemental est le plus récemment ajouté et le plus souvent vide. Notez, pour chaque thème, la date de la dernière alimentation — un thème présent mais figé se voit au premier coup d'œil.",
        quoi: "Même sous accord, la base comporte au moins : l'investissement social, l'investissement matériel et immatériel, l'égalité professionnelle entre les femmes et les hommes, les fonds propres, l'endettement, l'ensemble des éléments de rémunération des salariés et dirigeants, les activités sociales et culturelles, la rémunération des financeurs, les flux financiers à destination de l'entreprise, et les conséquences environnementales de l'activité.",
        fond: ["L2312-21"] },
      { id: "b3", nom: "À défaut d'accord, reprendre le contenu supplétif propre à l'effectif",
        docProduit: "BDESE-CTL-CNT-02",
        risque: "En l'absence d'accord, c'est le décret qui fixe le contenu, et les rubriques qu'il énumère sont dues. Une rubrique absente prive le comité d'une information que l'article L. 2312-18 range parmi celles nécessaires à ses consultations récurrentes : la consultation peut être jugée irrégulière et l'avis n'être pas valablement rendu. Les informations portent en outre sur les deux années précédentes et l'année en cours, avec des perspectives sur les trois suivantes — une base qui ne présente qu'un exercice ne les porte pas.",
        conseil: "Choisissez la grille sur l'effectif avant d'écrire une ligne : sous trois cents salariés et au-delà, les deux listes diffèrent, et l'on ne rattrape pas aisément une base montée sur la mauvaise. Lorsqu'une information ne peut être chiffrée, écrivez-le et dites pourquoi, dans la rubrique elle-même : une case vide sans explication ne se distingue pas d'une information manquante. Faites l'inventaire dans le module d'audit, rubrique par rubrique, plutôt qu'à la lecture.",
        quoi: "En l'absence d'accord, la base rassemble les informations que l'article L. 2312-36 énumère, sur les deux années précédentes et l'année en cours, avec des perspectives sur les trois années suivantes. Le détail des rubriques est fixé par l'article R. 2312-8 sous trois cents salariés, et par l'article R. 2312-9 au-delà. Le module d'audit dédié en donne la liste exacte, rubrique par rubrique.",
        fond: ["L2312-36", "R2312-8", "R2312-9"] },
      { id: "b4", nom: "Y verser les indicateurs de l'égalité et le bilan des formations",
        risque: "L'article L. 2312-18 range ces éléments parmi ceux que la base comporte « en particulier » : leur absence est une lacune de la base elle-même, et non un simple oubli documentaire. Elle fragilise la consultation sur la politique sociale, qui s'en nourrit, et prive le comité de la méthodologie sans laquelle les indicateurs d'égalité ne se discutent pas. L'exposition propre à la publication de ces indicateurs se mesure, elle, dans le parcours consacré à l'index.",
        conseil: "Ces éléments viennent d'ailleurs — l'index de l'égalité, les entretiens de parcours — et arrivent donc en retard : calez leur date de versement sur le calendrier de leur production, non sur celui de la base. Versez la méthodologie autant que le résultat : c'est elle que le comité interroge. Datez chaque dépôt.",
        quoi: "La base comporte en particulier l'ensemble des indicateurs relatifs à l'égalité professionnelle — dont les écarts de rémunération et de répartition parmi les cadres dirigeants et les membres des instances dirigeantes —, les informations sur la méthodologie et le contenu des indicateurs de l'article L. 1142-8, et un bilan de la mise en œuvre des actions de formation entreprises à l'issue des entretiens de parcours professionnel.",
        fond: ["L2312-18", "L1142-8", "L6315-1"] },
      { id: "b5", nom: "Ouvrir l'accès permanent aux élus et aux délégués syndicaux",
        docProduit: "BDESE-CTL-MAD-01",
        risque: "Le dernier alinéa de l'article L. 2312-36 rend la base accessible en permanence aux membres de la délégation du personnel du comité, à ceux du comité central et aux délégués syndicaux ; un accord peut organiser les droits d'accès, il ne peut pas les supprimer. Une base qu'une catégorie de bénéficiaires n'atteint pas n'est pas mise à sa disposition, et la consultation qui s'en réclame est contestable. Le refus d'accès peut en outre s'analyser en entrave au fonctionnement régulier du comité, que l'article L. 2317-1 punit d'une amende de 7 500 euros.",
        conseil: "Ouvrez un compte nominatif à chaque bénéficiaire — les suppléants et les délégués syndicaux sont ceux qu'on oublie — et tenez la liste des accès ouverts avec leurs dates. « En permanence » exclut l'envoi sur demande, la clé remise le jour de la réunion et le mot de passe partagé. Revoyez la liste à chaque renouvellement de mandat et à chaque désignation syndicale.",
        quoi: "La base est accessible en permanence aux membres de la délégation du personnel du comité, à ceux du comité central d'entreprise et aux délégués syndicaux. « En permanence » : pas sur demande, pas pendant les réunions.",
        fond: ["L2312-36"] },
      { id: "b6", nom: "Notifier la mise à disposition — elle vaut communication",
        champDate: "dateMiseADisposition",
        docProduit: "BDESE-CTL-MAD-03",
        risque: "L'article R. 2312-5 fait courir le délai de consultation de la communication des informations par l'employeur, ou de l'information par l'employeur de leur mise à disposition dans la base. Sans cette information, le délai ne court pas : le comité ne peut être réputé consulté, et l'avis que l'article R. 2312-6 attache au terme du délai — réputé rendu, et négatif, à l'expiration d'un mois à défaut d'accord — ne se produit jamais. La consultation reste ouverte, et la décision prise après elle est exposée.",
        conseil: "Envoyez un écrit daté qui dit ce qui a été versé, où, et pour quelle consultation : c'est cet écrit qui fait courir le délai, non le dépôt lui-même. Un courriel nominatif avec accusé vaut mieux qu'une notification automatique de plateforme, qui se perd. Rangez-le avec la capture du contenu versé ce jour-là : l'un sans l'autre ne prouve rien.",
        quoi: "Les éléments d'information transmis de manière récurrente au comité sont mis à sa disposition dans la base, et cette mise à disposition actualisée vaut communication des rapports et informations au comité, dans les conditions et limites fixées par décret en Conseil d'État. Datez-la : c'est de cette date que se compte le délai d'examen du comité.",
        fond: ["L2312-18"],
        quand: function (D) {
          if (!D.dateMiseADisposition) return null;
          return { iso: D.dateMiseADisposition,
            libelle: "Mise à disposition actualisée le " + dateFr(D.dateMiseADisposition),
            note: "C'est la date qui vaut communication au comité (art. L. 2312-18). Les délais dans lesquels l'avis est rendu s'auditent dans le module BDESE." };
        },
        doc: { modele: "note-rh", nom: "Note aux élus — mise à disposition de la base",
          pre: function (P, D) { return { entreprise: P.denomination,
            objet: "Base de données économiques, sociales et environnementales : accès et actualisation",
            date: D.dateMiseADisposition }; } } },
      { id: "b7", nom: "VALIDATION — auditer la base rubrique par rubrique dans le module dédié",
        risque: "L'article L. 2312-18 met la base à disposition, et c'est un acte de l'employeur : le module prépare, structure et audite le contenu, il n'est pas la base et il n'atteste pas la mise à disposition. Sans dossier de preuve, l'employeur qui affirme avoir mis la base à disposition ne peut pas le démontrer, ni se prévaloir de la règle du même article selon laquelle la mise à disposition actualisée vaut communication des rapports et informations au comité.",
        conseil: "Passez l'audit avant la réunion, jamais après : son intérêt est de faire apparaître les rubriques manquantes quand il est encore temps de les combler. Conservez le verdict daté, rubrique par rubrique, avec la version de la base qu'il a examinée. Refaites-le à chaque campagne annuelle — c'est la comparaison de deux verdicts qui montre si la base progresse ou se dégrade.",
        quoi: "Le chapeau dit que la base est due et comment elle se constitue ; il ne dit pas si la vôtre est complète. Ouvrez le module d'audit de la base : il confronte votre contenu au plancher applicable, rubrique par rubrique, et rend un verdict par rubrique. Le parcours n'est terminé que lorsque cet audit a été passé.",
        fond: ["L2312-36", "R2312-8", "R2312-9"] },
    ]
  },

  /* ================================================================== */
  /* 11. CALCULER ET PUBLIER L'INDEX DE L'ÉGALITÉ PROFESSIONNELLE      */
  /* ================================================================== */
  {
    cle: "index",
    nom: "Calculer et publier l'index de l'égalité professionnelle",
    resume: "Les cinq indicateurs, le niveau de résultat, la publication au plus tard le 1er mars sur le site de l'entreprise, la mise à disposition du comité, la télédéclaration — et, sous soixante-quinze points, les mesures de correction publiées et le délai de trois ans avant pénalité.",
    audit: { href: "audit-nao.html", nom: "le module d'audit des négociations (NAO)" },
    donnees: [
      { c: "anneeReference", nom: "Année de référence (l'année dont on publie les résultats)", t: "text",
        aide: "La publication se fait au titre de l'année précédente (art. D. 1142-4)." },
      { c: "datePublication", nom: "Date de publication du niveau de résultat", t: "date",
        aide: "Au plus tard le 1er mars de l'année en cours (art. D. 1142-4)." },
      { c: "siteInternet", nom: "L'entreprise dispose-t-elle d'un site internet ?", t: "oui-non",
        aide: "S'il en existe un, la publication s'y fait de manière visible et lisible. À défaut, les résultats sont portés à la connaissance des salariés par tout moyen (art. D. 1142-4)." },
      { c: "niveauResultat", nom: "Niveau de résultat obtenu (sur 100 points)", t: "number",
        aide: "Sous soixante-quinze points, les mesures de correction de l'article L. 1142-9 doivent être mises en œuvre (art. D. 1142-6)." },
      { c: "dateDepotMesures", nom: "Date de dépôt de l'accord ou de la décision portant les mesures de correction", t: "date",
        si: function (P, D) { var n = nb(D.niveauResultat); return n === null ? null : (n < 75); } },
      { c: "millesalaries", nom: "L'entreprise emploie-t-elle au moins mille salariés pour le troisième exercice consécutif ?", t: "oui-non",
        aide: "C'est le seuil de la publication des écarts de représentation parmi les cadres dirigeants et les instances dirigeantes (art. L. 1142-11)." },
    ],
    prealable: [
      { id: "paie", g: "information", nom: "Les données de rémunération par sexe, par tranche d'âge et par catégorie de postes équivalents",
        aide: "C'est l'assiette du premier indicateur de l'article D. 1142-2." },
      { id: "augmentations", g: "information", nom: "Les taux d'augmentations individuelles hors promotions, et les taux de promotions, par sexe",
        aide: "Deuxième et troisième indicateurs de l'article D. 1142-2." },
      { id: "maternite", g: "information", nom: "Les retours de congé de maternité de la période, et les augmentations intervenues pendant le congé",
        aide: "Quatrième indicateur : le pourcentage de salariées augmentées dans l'année de leur retour, si des augmentations sont intervenues pendant le congé." },
      { id: "dixplus", g: "information", nom: "Les dix plus hautes rémunérations de l'entreprise et leur répartition par sexe",
        aide: "Cinquième indicateur : le nombre de salariés du sexe sous-représenté parmi ces dix." },
      { id: "annexes", g: "document", nom: "Les annexes I et II du chapitre, qui fixent les modalités de calcul",
        aide: "Les articles D. 1142-2 et D. 1142-3 y renvoient expressément : les indicateurs et le niveau de résultat se calculent selon ces annexes, non selon une méthode maison." },
      { id: "ues", g: "information", nom: "Le périmètre : entreprise, ou unité économique et sociale",
        aide: "En cas de comité constitué au niveau d'une UES reconnue par accord ou par décision de justice, les indicateurs sont calculés au niveau de l'UES (art. D. 1142-2)." },
    ],
    etapes: [
      { id: "x1", nom: "Vérifier l'assujettissement et le périmètre de calcul",
        risque: "L'obligation vise les entreprises d'au moins cinquante salariés (L. 1142-8). L'absence de publication des informations qu'il prévoit peut donner lieu à la pénalité de L. 2242-8, fixée au maximum à 1 % des rémunérations et gains, au sens du premier alinéa de l'article L. 242-1 du code de la sécurité sociale, versés au titre des périodes de manquement.",
        conseil: "Arrêtez et écrivez la période de référence retenue, puis gardez-la d'une année sur l'autre : en changer rend les résultats incomparables et nourrit les contestations. Fixez le périmètre — l'entreprise, et non l'établissement — avant tout calcul, et consignez la règle appliquée. Extrayez les données de paie une seule fois, sur un fichier daté et conservé : c'est ce fichier qu'il faudra reproduire si l'administration demande le détail.",
        quoi: "L'obligation vise les entreprises d'au moins cinquante salariés : l'employeur publie chaque année l'ensemble des indicateurs relatifs aux écarts de rémunération entre les femmes et les hommes et aux actions mises en œuvre pour les supprimer, selon des modalités et une méthodologie définies par décret.",
        fond: ["L1142-8"] },
      { id: "x2", nom: "Calculer les cinq indicateurs",
        risque: "Les cinq indicateurs et leurs modalités de calcul sont fixés par D. 1142-2 et l'annexe I. Un indicateur mal calculé fausse le niveau de résultat de D. 1142-3, dont dépendent l'obligation de mesures de correction sous soixante-quinze points (D. 1142-6) et l'exposition à la pénalité de L. 1142-10. Lorsqu'un indicateur ne peut pas être calculé, l'information du comité doit en expliquer les raisons (D. 1142-5) : le passer sous silence n'est pas une option.",
        conseil: "Documentez le calcul autant que le résultat : catégories retenues, tranches d'âge, postes tenus pour équivalents, salariés écartés et pourquoi. Faites refaire le calcul par une seconde personne sur le même fichier avant toute publication — les erreurs viennent presque toujours du périmètre des effectifs, non de la formule. Conservez le fichier source et la note de méthode sur plusieurs exercices : c'est ce qui permet d'expliquer une variation d'une année sur l'autre.",
        quoi: "Écart de rémunération, calculé à partir de la moyenne des rémunérations des femmes comparée à celle des hommes par tranche d'âge et par catégorie de postes équivalents ; écart de taux d'augmentations individuelles hors promotions ; écart de taux de promotions ; pourcentage de salariées augmentées dans l'année de leur retour de congé de maternité ; nombre de salariés du sexe sous-représenté parmi les dix plus hautes rémunérations. Les modalités de calcul sont celles de l'annexe I.",
        fond: ["D1142-2"] },
      { id: "x3", nom: "Déterminer le niveau de résultat",
        risque: "Le niveau de résultat est déterminé selon les modalités des annexes I et II (D. 1142-3). C'est lui, et non chaque indicateur pris isolément, qui déclenche l'obligation de mesures de correction en deçà de soixante-quinze points (D. 1142-6) et l'exposition à la pénalité de L. 1142-10 à l'expiration du délai de trois ans.",
        conseil: "Calculez le niveau global avant de commenter les indicateurs : un mauvais indicateur dans un total satisfaisant n'appelle pas les mêmes suites qu'un total en deçà du seuil. Mesurez la marge qui vous sépare de soixante-quinze points et repérez de quel indicateur elle dépend : c'est là que l'action de l'année suivante doit porter. Consignez le total et le détail dans un même document daté.",
        quoi: "Le niveau de résultat obtenu au regard des indicateurs est déterminé selon les modalités fixées aux annexes I et II du chapitre. C'est ce niveau — et non chaque indicateur pris isolément — qui commande la suite.",
        fond: ["D1142-3"] },
      { id: "x4", nom: "Publier au plus tard le 1er mars",
        champDate: "datePublication",
        risque: "Le niveau de résultat et les résultats de chaque indicateur sont publiés au plus tard le 1er mars de l'année en cours au titre de l'année précédente, de manière visible et lisible sur le site internet de l'entreprise lorsqu'il en existe un, et y restent consultables au moins jusqu'à la publication de l'année suivante ; à défaut de site, ils sont portés à la connaissance des salariés par tout moyen (D. 1142-4). La pénalité de L. 2242-8, plafonnée à 1 % des rémunérations et gains, peut être appliquée en l'absence de publication.",
        conseil: "Publiez sur une page accessible sans identification et atteignable depuis la page d'accueil : « visible et lisible » se juge à la facilité avec laquelle un salarié la trouve, non à l'existence d'une adresse. Datez la mise en ligne et faites-en une capture d'écran le jour même. Laissez la page en place jusqu'à la publication suivante plutôt que de l'écraser : le texte impose qu'elle reste consultable.",
        quoi: "Le niveau de résultat et les résultats de chaque indicateur sont publiés annuellement, au plus tard le 1er mars de l'année en cours au titre de l'année précédente, de manière visible et lisible sur le site internet de l'entreprise lorsqu'il en existe un. Ils y restent consultables au moins jusqu'à la publication de l'année suivante. À défaut de site internet, ils sont portés à la connaissance des salariés par tout moyen.",
        fond: ["D1142-4"],
        quand: function (D) {
          if (!D.anneeReference || !/^\d{4}$/.test(String(D.anneeReference).trim())) return null;
          var t = (Number(D.anneeReference) + 1) + "-03-01";
          return { iso: t, libelle: "Publication due au plus tard le " + dateFr(t),
            note: "L'article D. 1142-4 fixe cette échéance au 1er mars de l'année en cours, au titre de l'année précédente." };
        },
        doc: { modele: "note-rh", nom: "Note de publication de l'index",
          pre: function (P, D) { return { entreprise: P.denomination,
            objet: "Index de l'égalité professionnelle — résultats " + (D.anneeReference || "") +
              (D.niveauResultat ? " : " + D.niveauResultat + " points sur 100" : ""),
            date: D.datePublication }; } } },
      { id: "x5", nom: "Mettre les indicateurs à la disposition du comité et télédéclarer",
        risque: "Les indicateurs et le niveau de résultat sont mis à la disposition du comité selon la même périodicité, dans les conditions du deuxième alinéa de L. 2312-18, présentés par catégorie socio-professionnelle, niveau ou coefficient hiérarchique et accompagnés des précisions utiles à leur compréhension ; lorsqu'un indicateur n'a pas pu être calculé, l'information du comité en explique les raisons. L'ensemble est transmis aux services du ministre chargé du travail par télédéclaration (D. 1142-5). Le défaut de mise à disposition prive le comité d'une information légalement due, et laisse la télédéclaration inaccomplie.",
        conseil: "Déposez les indicateurs dans la base de données et inscrivez le point à l'ordre du jour d'une réunion : le dépôt seul ne se prouve pas, le procès-verbal si. Joignez la note de méthode et, si un indicateur manque, l'explication de son impossibilité de calcul — c'est une exigence expresse, pas une politesse. Télédéclarez le même jour et conservez l'accusé avec le procès-verbal.",
        quoi: "Les indicateurs et le niveau de résultat sont mis à la disposition du comité social et économique, selon la même périodicité, dans les conditions du deuxième alinéa de l'article L. 2312-18 — c'est-à-dire dans la base de données. Les résultats sont présentés par catégorie socio-professionnelle, niveau ou coefficient hiérarchique, accompagnés des précisions utiles à leur compréhension. Lorsqu'un indicateur n'a pas pu être calculé, l'information du comité en explique les raisons. L'ensemble est télédéclaré aux services du ministre chargé du travail.",
        fond: ["D1142-5", "L2312-18"] },
      { id: "x6", nom: "Sous soixante-quinze points : arrêter et publier les mesures de correction",
        champDate: "dateDepotMesures",
        risque: "Les mesures de correction et, le cas échéant, la programmation de mesures financières de rattrapage salarial doivent être mises en œuvre dès lors que le niveau de résultat est inférieur à soixante-quinze points (L. 1142-9, D. 1142-6) ; à défaut d'accord, elles sont arrêtées par décision de l'employeur après consultation du comité et déposées auprès de l'autorité administrative, qui peut présenter des observations. La pénalité de L. 2242-8, plafonnée à 1 % des rémunérations et gains, peut être appliquée en l'absence de mesures définies dans ces conditions.",
        conseil: "Traitez les mesures dans la négociation sur l'égalité professionnelle avant d'en faire une décision unilatérale : l'ordre compte, la décision ne venant qu'à défaut d'accord. Consultez le comité, conservez le procès-verbal, déposez, et gardez le récépissé. Publiez les mesures sur la même page que le résultat et laissez-les-y jusqu'à ce que l'entreprise atteigne soixante-quinze points : elles s'en retirent trop tôt, et c'est le manquement le plus facile à constater de l'extérieur.",
        quoi: "Les mesures de correction et, le cas échéant, la programmation de mesures financières de rattrapage salarial doivent être mises en œuvre dès lors que le niveau de résultat est inférieur à soixante-quinze points. La négociation sur l'égalité professionnelle porte alors aussi sur ces mesures ; à défaut d'accord, elles sont arrêtées par décision de l'employeur après consultation du comité, et déposées auprès de l'autorité administrative. Elles sont publiées sur le site de l'entreprise, sur la même page que le résultat, dès le dépôt de l'accord ou de la décision, et y restent jusqu'à l'obtention d'un résultat au moins égal à soixante-quinze points.",
        fond: ["L1142-9", "D1142-6"],
        si: function (P, D) { var n = nb(D.niveauResultat); return n === null ? null : (n < 75); },
        quand: function (D) {
          if (!D.dateDepotMesures) return null;
          return { iso: D.dateDepotMesures, libelle: "Mesures déposées le " + dateFr(D.dateDepotMesures),
            note: "La publication des mesures est due dès lors que l'accord ou la décision unilatérale est déposé (art. D. 1142-6)." };
        },
        doc: { modele: "note-rh", nom: "Note de publication des mesures de correction",
          pre: function (P, D) { return { entreprise: P.denomination,
            objet: "Index de l'égalité professionnelle — mesures de correction et rattrapage salarial",
            date: D.dateDepotMesures }; } } },
      { id: "x7", nom: "Mesurer le délai de trois ans et l'exposition à la pénalité",
        risque: "En deçà du niveau défini par décret, l'entreprise dispose de trois ans pour se mettre en conformité ; à l'expiration de ce délai, si les résultats sont toujours en deçà, l'employeur peut se voir appliquer une pénalité financière fixée au maximum à 1 % des rémunérations et gains, au sens du premier alinéa de l'article L. 242-1 du code de la sécurité sociale, versés au cours de l'année civile précédant l'expiration du délai (L. 1142-10). Le montant est fixé par l'autorité administrative, et un délai supplémentaire d'un an peut être accordé au vu des efforts constatés et des motifs de la défaillance. Lorsque cette pénalité est appliquée, celle de L. 2242-8 ne l'est pas.",
        conseil: "Datez le point de départ des trois ans dès la première année en deçà du seuil et portez l'échéance au calendrier : elle arrive sans avertissement. Constituez au fil de l'eau le dossier des efforts — accords, mesures de rattrapage, budgets engagés, résultats intermédiaires —, puisque c'est sur lui que se décideront le montant et l'éventuel délai supplémentaire. Ne comptez pas sur une remontée mécanique la dernière année : les mesures salariales produisent leur effet sur l'exercice suivant.",
        quoi: "En deçà du niveau défini par décret, l'entreprise dispose d'un délai de trois ans pour se mettre en conformité. À l'expiration de ce délai, si les résultats sont toujours en deçà, l'employeur peut se voir appliquer une pénalité financière fixée au maximum à 1 % des rémunérations, par décision de l'autorité administrative. Un délai supplémentaire d'un an peut être accordé au vu des efforts constatés et des motifs de la défaillance.",
        fond: ["L1142-10"],
        si: function (P, D) { var n = nb(D.niveauResultat); return n === null ? null : (n < 75); },
        quand: function (D) {
          if (!D.datePublication) return null;
          var t = moisApres(D.datePublication, 36);
          return { iso: t, libelle: "Mise en conformité attendue avant le " + dateFr(t),
            note: "Trois ans comptés depuis la publication renseignée. L'article L. 1142-10 fixe le délai sans en préciser le point de départ exact : cette date est un repère de gestion, non une échéance dont le texte garantirait le calcul." };
        } },
      { id: "x8", nom: "À partir de mille salariés : publier les écarts de représentation",
        risque: "Dans les entreprises qui, pour le troisième exercice consécutif, emploient au moins mille salariés, l'employeur publie chaque année les écarts éventuels de représentation entre les femmes et les hommes parmi les cadres dirigeants et les membres des instances dirigeantes, la proportion de chaque sexe ne pouvant être inférieure à 30 % (L. 1142-11). Lorsque l'entreprise ne s'y conforme pas, la négociation sur l'égalité professionnelle porte également sur les mesures adéquates et pertinentes de correction ; à défaut d'accord, elles sont arrêtées par décision de l'employeur après consultation du comité et déposées auprès de l'autorité administrative, qui peut présenter des observations, lesquelles sont présentées à l'organe chargé de l'administration ou de la surveillance ainsi qu'au comité (L. 1142-13).",
        conseil: "Vérifiez d'abord la condition des trois exercices consécutifs : c'est elle qui déclenche l'obligation, et elle se constate sur les états d'effectif, non sur une impression de taille. Arrêtez par écrit, nom par nom, la liste des cadres dirigeants et celle des membres des instances dirigeantes avant de calculer : c'est le périmètre qui se discute, pas le pourcentage. Publiez ces écarts en même temps que l'index et sur la même page, pour n'avoir qu'une échéance à tenir.",
        quoi: "Dans les entreprises qui, pour le troisième exercice consécutif, emploient au moins mille salariés, l'employeur publie chaque année les écarts éventuels de représentation entre les femmes et les hommes parmi les cadres dirigeants d'une part, et les membres des instances dirigeantes d'autre part. La proportion de personnes de chaque sexe au sein de chacun de ces ensembles ne peut être inférieure à 30 %.",
        fond: ["L1142-11"],
        si: function (P, D) { return D.millesalaries === "non" ? false : (D.millesalaries === "oui" ? true : null); } },
      { id: "x9", nom: "VALIDATION — conserver la preuve de la publication et de la télédéclaration",
        docProduit: "NAO-CTL-EGA-02",
        risque: "L'obligation ne se prouve pas par son accomplissement mais par sa trace : sans capture datée de la page de publication (D. 1142-4) ni accusé de télédéclaration (D. 1142-5), l'employeur n'est pas en mesure d'établir devant l'administration qu'il a publié dans le délai, et s'expose à la pénalité de L. 2242-8 encourue en l'absence de publication.",
        conseil: "Constituez un dossier par exercice, portant l'année en clair, et n'y rangez que trois pièces : la capture datée de la page, l'accusé de télédéclaration, le procès-verbal de la réunion où les indicateurs ont été mis à la disposition du comité. Placez à côté, dans un sous-dossier séparé, le fichier source et la note de méthode. Conservez chaque exercice au moins aussi longtemps que court le délai de trois ans de mise en conformité, qui peut porter sur des années antérieures.",
        quoi: "Conservez la capture datée de la page de publication, l'accusé de télédéclaration, et le procès-verbal de la réunion où les indicateurs ont été mis à la disposition du comité. Le module d'audit des négociations mesure ensuite l'exposition à la pénalité sur l'égalité. Le parcours n'est terminé que lorsque ces trois preuves existent.",
        fond: ["D1142-4", "D1142-5"] },
    ]
  },

  /* ================================================================== */
  /* 12. ORGANISER LES ENTRETIENS DE PARCOURS PROFESSIONNEL            */
  /* ================================================================== */
  /* L'article L. 6315-1 a été réécrit : il ne parle plus d'« entretien
     professionnel » mais d'« entretien de parcours professionnel ». La
     version lue le 22 août 2026 est LEGIARTI000053279288 — c'est elle, et
     son vocabulaire, que ce parcours suit. */
  {
    cle: "entretiens",
    suite: { cle: "conges", pourquoi: "Les entretiens tenus, reste ce qui se compte chaque année : l'ordre et les dates des congés payés, et l'information qui les rend opposables." },
    nom: "Organiser les entretiens de parcours professionnel",
    resume: "L'information à l'embauche, l'entretien de la première année puis tous les quatre ans, les cinq sujets qu'il couvre, ce qu'il ne peut pas être (une évaluation du travail), les retours d'absences longues, le document remis au salarié, l'état des lieux des huit ans et son abondement du compte personnel de formation.",
    audit: { href: "audit-social.html", nom: "l'audit social (contrôle de l'existant)" },
    donnees: [
      { c: "salarie", nom: "Salarié concerné (ou campagne : « tous les salariés »)", t: "text" },
      { c: "dateEmbauche", nom: "Date d'embauche", t: "date",
        aide: "L'entretien de la première année et le cycle des quatre ans s'y ancrent." },
      { c: "dateDernierEntretien", nom: "Date du dernier entretien de parcours professionnel", t: "date" },
      { c: "retourAbsence", nom: "Le salarié reprend-il son activité à l'issue d'un congé ou d'une absence longue ?", t: "oui-non",
        aide: "Congés de maternité ou d'adoption, congé supplémentaire de naissance, congé parental, congé de proche aidant, congé sabbatique, mobilité volontaire sécurisée, temps partiel de l'article L. 1225-47, arrêt longue maladie, ou fin de mandat syndical." },
      { c: "dateReprise", nom: "Date de reprise d'activité", t: "date",
        si: function (P, D) { return D.retourAbsence === "oui" ? true : (D.retourAbsence === "non" ? false : null); } },
      { c: "accordPeriodicite", nom: "Un accord fixe-t-il une périodicité différente des entretiens ?", t: "oui-non",
        aide: "L'article L. 6315-1, III, l'autorise sans que la périodicité puisse excéder quatre ans." },
      { c: "visiteMiCarriere", nom: "Une visite médicale de mi-carrière a-t-elle eu lieu ?", t: "oui-non",
        aide: "L'entretien est alors organisé dans un délai de deux mois à compter de cette visite (art. L. 6315-1, IV)." },
      { c: "dateVisiteMiCarriere", nom: "Date de la visite de mi-carrière", t: "date",
        si: function (P, D) { return D.visiteMiCarriere === "oui" ? true : (D.visiteMiCarriere === "non" ? false : null); } },
    ],
    prealable: [
      { id: "historique", g: "information", nom: "L'historique des entretiens du salarié sur les huit dernières années",
        aide: "L'état des lieux récapitulatif vérifie que le salarié a bien bénéficié des entretiens prévus au cours de ces huit ans." },
      { id: "formations", g: "information", nom: "Les actions de formation suivies, les certifications acquises, les progressions salariales ou professionnelles",
        aide: "Ce sont les trois points que l'état des lieux des huit ans apprécie." },
      { id: "trame", g: "document", nom: "La trame de l'entretien, couvrant les cinq sujets de l'article L. 6315-1, I",
        aide: "Compétences et qualifications mobilisées et leur évolution possible ; situation et parcours au regard des évolutions des métiers ; besoins de formation ; souhaits d'évolution ; activation du compte personnel de formation, abondements et conseil en évolution professionnelle." },
      { id: "conducteur", g: "information", nom: "Qui conduit l'entretien : un supérieur hiérarchique ou un représentant de la direction",
        aide: "L'article L. 6315-1 le précise, et impose que l'entretien se déroule pendant le temps de travail." },
      { id: "ccn", g: "document", nom: "L'accord de branche ou d'entreprise, s'il en existe un sur le sujet",
        aide: "Il peut définir un cadre et des critères d'abondement du compte personnel de formation, d'autres modalités d'appréciation du parcours, et une périodicité différente — sans excéder quatre ans." },
    ],
    etapes: [
      { id: "e1", nom: "Informer le salarié à l'embauche",
        risque: "L'information due à l'embauche ne porte pas de sanction propre, mais elle ouvre le cycle : un premier entretien qui n'a pas eu lieu dans l'année compte parmi les entretiens non tenus lors de l'état des lieux des huit ans, et concourt, dans les entreprises d'au moins cinquante salariés, à l'abondement correctif de l'article L. 6323-13. En dehors même de tout licenciement, un salarié jamais reçu ni formé obtient des dommages-intérêts pour manquement à l'obligation de formation.",
        conseil: "Faites porter la mention dans le contrat lui-même ou dans le document d'information remis à l'entrée, et conservez l'exemplaire daté et contresigné : une phrase dite en réunion d'accueil ne se prouve pas. Ouvrez le même jour la fiche de parcours du salarié, avec deux échéances écrites — le premier entretien dans l'année, puis l'échéance des quatre ans. L'erreur courante est de renvoyer cette information à la première campagne collective : elle est due salarié par salarié, à l'embauche.",
        quoi: "À l'occasion de son embauche, le salarié est informé qu'il bénéficie d'un entretien de parcours professionnel avec son employeur au cours de la première année suivant son embauche. Cette information est due à l'embauche — elle se prouve, donc elle s'écrit.",
        fond: ["L6315-1"],
        quand: function (D) {
          if (!D.dateEmbauche) return null;
          var t = moisApres(D.dateEmbauche, 12);
          return { iso: t, libelle: "Premier entretien à tenir avant le " + dateFr(t),
            note: "L'article L. 6315-1, I, situe le premier entretien « au cours de la première année suivant son embauche »." };
        },
        doc: { modele: "note-rh", nom: "Note d'information à l'embauche",
          pre: function (P, D) { return { entreprise: P.denomination,
            objet: "Entretien de parcours professionnel : information du salarié " + (D.salarie || ""),
            date: D.dateEmbauche }; } } },
      { id: "e2", nom: "Tenir l'entretien de la première année, puis tous les quatre ans",
        risque: "Dans les entreprises d'au moins cinquante salariés, un salarié qui, sur huit ans, n'a bénéficié ni des entretiens prévus ni d'au moins une formation autre que celle de l'article L. 6321-2 voit son compte personnel de formation abondé dans les conditions de l'article L. 6323-13, l'entreprise versant une somme dont le montant, fixé par décret en Conseil d'État, ne peut excéder six fois le montant annuel mentionné à l'article L. 6323-11. La carence fragilise en outre tout licenciement fondé sur l'insuffisance professionnelle, l'employeur n'ayant pas mis le salarié en mesure de progresser.",
        conseil: "Tenez un tableau unique, salarié par salarié, portant la date du dernier entretien et celle du prochain — c'est le seul instrument qui rende la carence visible avant qu'elle ne soit constatée. Vérifiez d'abord si un accord d'entreprise ou de branche fixe une périodicité propre, avant de raisonner sur quatre ans. Rattrapez en priorité les salariés les plus anciens et ceux dont le cycle de huit ans arrive à échéance : ce sont eux qui déclenchent le versement.",
        quoi: "Tout salarié restant employé dans la même entreprise bénéficie d'un entretien de parcours professionnel tous les quatre ans. Un accord collectif d'entreprise ou, à défaut, de branche peut prévoir une périodicité différente, sans qu'elle excède quatre ans.",
        fond: ["L6315-1"],
        conv: "la périodicité que votre accord de branche ou d'entreprise fixe, et les critères collectifs d'abondement du compte personnel de formation qu'il peut définir (art. L. 6315-1, III)",
        quand: function (D) {
          if (!D.dateDernierEntretien) return null;
          var t = moisApres(D.dateDernierEntretien, 48);
          return { iso: t, libelle: "Entretien suivant dû avant le " + dateFr(t),
            note: "Quatre ans depuis le " + dateFr(D.dateDernierEntretien) + ". Un accord peut retenir une périodicité plus courte, jamais plus longue." };
        } },
      { id: "e3", nom: "Couvrir les cinq sujets — et ne pas évaluer le travail",
        risque: "Un entretien qui glisse vers l'appréciation du travail s'expose à ne pas être tenu pour l'entretien de parcours professionnel de l'article L. 6315-1, lequel dispose expressément qu'il ne porte pas sur cette évaluation. Il ne compte alors pas dans le cycle, et l'état des lieux des huit ans constatera l'absence, avec les conséquences propres aux entreprises d'au moins cinquante salariés.",
        conseil: "Séparez les deux rendez-vous : dates différentes, trames différentes, et si possible des documents qui ne se ressemblent pas. Construisez la trame sur les cinq rubriques du texte, dans leur ordre, et laissez à chacune une case remplie de la main de l'intéressé — c'est ce qui distingue, à la lecture, un entretien de parcours d'un entretien annuel déguisé. L'erreur la plus fréquente est la trame unique, où les objectifs de l'année voisinent avec les souhaits d'évolution.",
        quoi: "L'entretien est consacré aux compétences et qualifications mobilisées et à leur évolution possible ; à la situation et au parcours professionnels au regard des évolutions des métiers ; aux besoins de formation ; aux souhaits d'évolution — l'entretien pouvant ouvrir la voie à une reconversion, à un projet de transition, à un bilan de compétences ou à une validation des acquis ; et à l'activation du compte personnel de formation, aux abondements que l'employeur peut financer et au conseil en évolution professionnelle. L'entretien de parcours professionnel NE PORTE PAS sur l'évaluation du travail du salarié : c'est le texte qui le dit.",
        fond: ["L6315-1"] },
      { id: "e4", nom: "Proposer l'entretien au retour d'une absence longue",
        risque: "L'entretien est proposé systématiquement au retour des absences énumérées par l'article L. 6315-1 lorsque le salarié n'en a bénéficié d'aucun dans les douze mois précédant sa reprise. Une proposition omise est un entretien non tenu, qui pèse dans l'état des lieux des huit ans et, dans les entreprises d'au moins cinquante salariés, dans l'abondement correctif de l'article L. 6323-13. Un retour de congé maternité, parental ou de longue maladie mal accompagné se plaide ensuite mal.",
        conseil: "Branchez le déclencheur sur la paie, non sur la mémoire du service : toute reprise après une absence longue fait naître une proposition écrite. Proposez, ne convoquez pas — c'est une proposition que le texte exige, et c'est la proposition qu'il faut pouvoir produire, y compris lorsque le salarié la décline. Datez le courriel ou le courrier et classez-le dans le dossier du salarié, avec la réponse.",
        quoi: "L'entretien est proposé systématiquement au salarié qui reprend son activité à l'issue des congés de maternité et d'adoption, d'un congé supplémentaire de naissance, d'un congé parental d'éducation, d'un congé de proche aidant, d'un congé sabbatique, d'une période de mobilité volontaire sécurisée, d'une période d'activité à temps partiel de l'article L. 1225-47, d'un arrêt longue maladie ou d'un mandat syndical — s'il n'a bénéficié d'aucun entretien au cours des douze mois précédant sa reprise. À l'initiative du salarié, il peut avoir lieu avant la reprise de poste.",
        fond: ["L6315-1"],
        si: function (P, D) { return D.retourAbsence === "non" ? false : true; },
        quand: function (D) {
          if (!D.dateReprise) return null;
          return { iso: D.dateReprise, libelle: "Reprise d'activité le " + dateFr(D.dateReprise),
            note: "L'article L. 6315-1 ne fixe pas de délai chiffré après la reprise : il impose que l'entretien soit « proposé systématiquement ». Proposez-le par écrit, et datez la proposition." };
        } },
      { id: "e5", nom: "Articuler l'entretien avec la visite médicale de mi-carrière",
        risque: "L'entretien est organisé dans un délai de deux mois à compter de la visite médicale de mi-carrière ; passé ce délai, il ne satisfait plus à ce que prévoit l'article L. 6315-1 en son IV. Le même texte interdit à l'employeur d'avoir accès aux données de santé du salarié : seules les mesures proposées par le médecin du travail sont évoquées. Un employeur qui s'en écarte s'expose dans tout contentieux ultérieur touchant l'état de santé du salarié.",
        conseil: "Demandez au service de prévention et de santé au travail la seule information dont vous avez besoin, la date de la visite, et faites-en partir une alerte à deux mois. N'ouvrez jamais l'entretien en demandant ce qu'a dit le médecin : partez des mesures écrites qui vous ont été notifiées, et de rien d'autre. Le document de fin d'entretien récapitule ces points sous forme de bilan — écrivez-le en séance, il sera relu.",
        quoi: "L'entretien est organisé dans un délai de deux mois à compter de la visite médicale de mi-carrière prévue à l'article L. 4624-2-2. L'employeur ne peut pas avoir accès aux données de santé du salarié ; les mesures proposées par le médecin du travail sont évoquées au cours de l'entretien. Y sont abordés, s'il y a lieu, l'adaptation ou l'aménagement des missions et du poste, la prévention de l'usure professionnelle, les besoins de formation et les souhaits de mobilité ou de reconversion.",
        fond: ["L6315-1"],
        si: function (P, D) { return D.visiteMiCarriere === "non" ? false : (D.visiteMiCarriere === "oui" ? true : null); },
        quand: function (D) {
          if (!D.dateVisiteMiCarriere) return null;
          var t = moisApres(D.dateVisiteMiCarriere, 2);
          return { iso: t, libelle: "Entretien à tenir avant le " + dateFr(t),
            note: "Deux mois depuis la visite de mi-carrière (art. L. 6315-1, IV)." };
        } },
      { id: "e6", nom: "Rédiger le document et en remettre copie au salarié",
        risque: "Sans le document dont copie est remise au salarié, l'entretien n'est pas prouvé, et la charge de cette preuve pèse sur l'employeur. Un entretien tenu mais non formalisé est donc traité comme un entretien qui n'a pas eu lieu : il ne compte pas dans le cycle des huit ans et concourt, dans les entreprises d'au moins cinquante salariés, à l'abondement correctif de l'article L. 6323-13.",
        conseil: "Rédigez et signez le document à la fin de la séance, pas le lendemain : un compte rendu différé n'est jamais écrit. Remettez la copie contre émargement ou par courriel horodaté, et gardez l'original signé dans le dossier individuel — ce sont deux gestes distincts, et c'est le second qui manque le plus souvent. Conservez ces documents au moins la durée du cycle de huit ans, puisqu'ils devront être produits lors de l'état des lieux.",
        quoi: "L'entretien donne lieu à la rédaction d'un document dont une copie est remise au salarié. Sans ce document, l'entretien n'est pas prouvé — et un entretien non prouvé est un entretien qui n'a pas eu lieu.",
        fond: ["L6315-1"],
        doc: { modele: "note-rh", nom: "Compte rendu d'entretien de parcours professionnel",
          pre: function (P, D) { return { entreprise: P.denomination,
            objet: "Entretien de parcours professionnel — " + (D.salarie || "salarié à renseigner"),
            date: D.dateDernierEntretien }; } } },
      { id: "e7", nom: "Faire l'état des lieux récapitulatif des huit ans",
        risque: "L'état des lieux récapitulatif des huit ans est lui-même un entretien dû, qui donne lieu à un document dont copie est remise au salarié. Son omission prive l'employeur du seul acte qui vérifie que les entretiens ont été tenus et apprécie la formation suivie, les certifications acquises et la progression salariale ou professionnelle : dans les entreprises d'au moins cinquante salariés, c'est ce constat qui déclenche l'abondement de l'article L. 6323-13.",
        conseil: "Faites l'état des lieux sur pièces : les documents des entretiens précédents, les attestations de formation, l'historique de rémunération et de classification, réunis avant la séance. Le premier état des lieux après l'embauche peut être fait sept ans après le premier entretien — retenez cette date, elle évite de découvrir la carence à huit ans, quand elle n'est plus rattrapable. Écrivez ce que vous avez vérifié, y compris lorsque le constat est défavorable : un état des lieux complaisant ne protège de rien.",
        quoi: "Tous les huit ans, l'entretien fait un état des lieux récapitulatif du parcours professionnel du salarié — le premier après l'embauche pouvant être réalisé sept ans après le premier entretien. Cet état des lieux, qui donne lieu à un document dont copie est remise au salarié, vérifie que le salarié a bénéficié des entretiens prévus, et apprécie s'il a suivi au moins une action de formation, acquis des éléments de certification par la formation ou par validation des acquis, et bénéficié d'une progression salariale ou professionnelle.",
        fond: ["L6315-1"],
        quand: function (D) {
          if (!D.dateEmbauche) return null;
          var t = moisApres(D.dateEmbauche, 96);
          return { iso: t, libelle: "État des lieux des huit ans dû avant le " + dateFr(t),
            note: "Huit ans depuis l'embauche du " + dateFr(D.dateEmbauche) + ". La durée s'apprécie par référence à l'ancienneté du salarié dans l'entreprise." };
        } },
      { id: "e8", nom: "À partir de cinquante salariés : vérifier l'abondement du compte personnel de formation",
        risque: "Dans les entreprises d'au moins cinquante salariés, l'abondement est inscrit au compte du salarié et l'entreprise verse une somme dont le montant, fixé par décret en Conseil d'État, ne peut excéder six fois le montant annuel mentionné à l'article L. 6323-11. À l'occasion des contrôles menés par les agents de l'article L. 6361-5, l'entreprise qui n'a pas versé ou a versé insuffisamment est mise en demeure de régler l'insuffisance constatée dans la procédure contradictoire de l'article L. 6362-10 ; à défaut, elle verse au Trésor public un montant équivalent à cette insuffisance majoré de cent pour cent, recouvré selon les règles applicables aux taxes sur le chiffre d'affaires.",
        conseil: "Faites établir l'effectif et le franchissement du seuil de cinquante salariés selon les modalités de l'article L. 130-1 du code de la sécurité sociale avant de conclure que vous n'êtes pas concerné : le seuil se calcule, il ne s'estime pas. Si la carence est constatée, provisionnez et versez spontanément plutôt que d'attendre le contrôle — la mise en demeure non suivie d'effet double la note. Le salarié est informé du versement : prévoyez la lettre en même temps que l'écriture comptable.",
        quoi: "Dans les entreprises d'au moins cinquante salariés, lorsque au cours de ces huit années le salarié n'a pas bénéficié des entretiens prévus ET d'au moins une formation autre que celle de l'article L. 6321-2, son compte personnel de formation est abondé dans les conditions de l'article L. 6323-13. L'effectif et le franchissement du seuil s'apprécient selon l'article L. 130-1 du code de la sécurité sociale.",
        fond: ["L6315-1"],
        si: function (P) { return seuil(P, 50); } },
      { id: "e9", nom: "VALIDATION — rattacher les entretiens à l'obligation d'adaptation, et archiver",
        risque: "L'obligation d'adaptation au poste et de maintien de la capacité à occuper un emploi de l'article L. 6321-1 pèse sur l'employeur même sans demande des salariés : des salariés jamais formés obtiennent des dommages-intérêts pour manquement à cette obligation, indépendamment de toute rupture. Le bilan des actions entreprises à l'issue des entretiens entre par ailleurs dans la base de données de l'article L. 2312-18 ; une base incomplète fragilise les consultations récurrentes qu'elle sert à préparer.",
        conseil: "Clôturez la campagne par un état chiffré : nombre d'entretiens dus, tenus, documents remis, demandes de formation recueillies et suites données à chacune. Portez ce bilan à la base de données à la même date que l'archivage, et gardez la preuve de la mise à disposition. Nommez le responsable du contrôle et faites-lui signer l'état : sans nom au bas de la page, la campagne suivante repartira des mêmes trous.",
        quoi: "L'employeur assure l'adaptation des salariés à leur poste de travail et veille au maintien de leur capacité à occuper un emploi : les besoins de formation relevés en entretien nourrissent cette obligation, et le bilan des actions entreprises à l'issue des entretiens entre dans la base de données. Archivez les documents remis, datez la campagne, et portez le bilan à la base. Le parcours n'est terminé que lorsque ce bilan existe.",
        fond: ["L6321-1", "L2312-18"] },
    ]
  },

  /* ================================================================== */
  /* 13. EMBAUCHER : LES FORMALITÉS OBLIGATOIRES                        */
  /* ================================================================== */
  {
    cle: "embauche",
    suite: { cle: "entretiens", pourquoi: "Le salarié embauché entre aussitôt dans le cycle des entretiens : la visite d'information et de prévention, puis l'entretien professionnel tous les deux ans." },
    nom: "Embaucher : les formalités obligatoires",
    resume: "De la déclaration préalable à la visite d'information et de prévention : ce qui se fait AVANT l'entrée, ce qui se remet au salarié et dans quels délais, ce que le contrat à durée déterminée exige de plus, et les deux formalités de sécurité que l'urgence fait le plus souvent oublier.",
    audit: { href: "audit-social.html", nom: "l'audit social (contrôle de l'existant)" },
    jx: "embauche",
    donnees: [
      { c: "salarieEmbauche", nom: "Salarié embauché (nom, emploi)", t: "text" },
      { c: "typeContrat", nom: "Type de contrat", t: "select",
        options: ["contrat à durée indéterminée", "contrat à durée déterminée", "contrat d'apprentissage ou de professionnalisation", "autre"],
        aide: "Le contrat à durée déterminée ajoute l'écrit à peine de requalification, le délai de transmission de deux jours ouvrables, le délai de carence et l'indemnité de fin de contrat." },
      { c: "categorie", nom: "Catégorie professionnelle", t: "select",
        options: ["ouvrier ou employé", "agent de maîtrise ou technicien", "cadre", "autre"],
        aide: "Elle commande la durée maximale de la période d'essai (art. L. 1221-19)." },
      { c: "dateEmbauche", nom: "Date d'entrée effective", t: "date",
        aide: "Elle est le point de départ des délais d'information (art. R. 1221-35) et de la visite d'information et de prévention (art. R. 4624-10)." },
      { c: "dateDPAE", nom: "Date de la déclaration préalable à l'embauche", t: "date",
        aide: "Elle doit précéder l'entrée : l'article L. 1221-10 le dit sans réserve." },
      { c: "essai", nom: "Le contrat comporte-t-il une période d'essai ?", t: "oui-non" },
      { c: "posteARisques", nom: "Le poste figure-t-il sur la liste des postes présentant des risques particuliers ?", t: "oui-non",
        aide: "Si oui, et si le salarié est en contrat court ou stagiaire, la formation renforcée à la sécurité est due (art. L. 4154-2, audité dans l'audit social)." },
      { c: "dispositifsCollecte", nom: "Des dispositifs de collecte d'informations sont-ils en place (badgeage, géolocalisation, vidéo) ?", t: "oui-non",
        aide: "Ils doivent avoir été portés à la connaissance du salarié préalablement (art. L. 1222-4) — et du candidat pendant le recrutement (art. L. 1221-9)." },
    ],
    prealable: [
      { id: "identite", g: "information", nom: "L'identité complète du salarié et, s'il est étranger, le titre l'autorisant à exercer une activité salariée",
        aide: "Le titre se copie et s'annexe au registre unique du personnel (art. D. 1221-24)." },
      { id: "poste", g: "information", nom: "L'intitulé du poste, les fonctions, la classification et la rémunération",
        aide: "Ce sont des rubriques du document d'information de l'article R. 1221-34." },
      { id: "ccn", g: "document", nom: "La convention collective applicable, pour la classification, les minima et la durée d'essai",
        aide: "L'application ne lit aucune convention : elle signale l'endroit où la vôtre peut ajouter une règle." },
      { id: "trame", g: "document", nom: "La trame de contrat de travail à jour des rubriques de l'article R. 1221-34" },
      { id: "spst", g: "information", nom: "Les coordonnées du service de prévention et de santé au travail auquel l'entreprise adhère" },
      { id: "duerp", g: "document", nom: "Le document unique, pour l'information sur les risques du poste",
        aide: "L'information de l'article L. 4141-1 se tire du document unique : sans lui, elle n'a pas de contenu." },
      { id: "motif", g: "information", nom: "Le motif précis du recours, si le contrat est à durée déterminée",
        aide: "« Surcroît d'activité » sans autre précision ne suffit pas : l'article L. 1242-12 exige la définition PRÉCISE du motif.",
        si: function (P, D) { return D.typeContrat === "contrat à durée déterminée" ? true : (D.typeContrat ? false : null); } },
      { id: "carence", g: "information", nom: "La date de fin du dernier contrat conclu sur le même poste, pour calculer le délai de carence",
        aide: "Le délai se calcule sur la durée du contrat précédent, renouvellements inclus (art. L. 1244-3 et, à défaut d'accord, L. 1244-3-1).",
        si: function (P, D) { return D.typeContrat === "contrat à durée déterminée" ? true : (D.typeContrat ? false : null); } },
    ],
    etapes: [
      { id: "b1", nom: "Déclarer AVANT l'entrée",
        champDate: "dateDPAE",
        risque: "Le non-respect de l'obligation de déclaration préalable à l'embauche, constaté par les agents de l'article L. 8271-7, entraîne une pénalité dont le montant est égal à trois cents fois le taux horaire du minimum garanti de l'article L. 3231-12 (L. 1221-11). Se soustraire intentionnellement à cette formalité est en outre réputé travail dissimulé par dissimulation d'emploi salarié au sens de l'article L. 8221-5, et la méconnaissance des interdictions de l'article L. 8221-1 est punie de trois ans d'emprisonnement et de 45 000 euros d'amende (L. 8224-1). S'y ajoutent les conséquences sociales et prud'homales du travail dissimulé, dont l'indemnité forfaitaire.",
        conseil: "Instituez un point de contrôle unique avant chaque entrée : pas d'accusé de déclaration, pas de badge, pas de poste. Archivez les accusés dans un dossier unique, nominatif, rapprochable ligne à ligne du registre unique du personnel — c'est ce rapprochement que demande un contrôle, et il se prépare une fois pour toutes. Le remplacement urgent est la circonstance qui fait sauter l'ordre des opérations : traitez-le comme le cas nominal, la déclaration se fait en quelques minutes.",
        jx: "embauche",
        quoi: "L'embauche d'un salarié ne peut intervenir qu'après déclaration nominative accomplie auprès des organismes de protection sociale désignés à cet effet. La déclaration est accomplie dans tous les lieux de travail où sont employés des salariés. L'ordre des mots compte : d'abord la déclaration, ensuite l'entrée — un remplacement urgent ne renverse pas cet ordre.",
        fond: ["L1221-10", "L1221-11"],
        quand: function (D) {
          if (!D.dateDPAE) return null;
          var lib = "Déclaration accomplie le " + dateFr(D.dateDPAE);
          if (D.dateEmbauche) {
            var j = joursEntre(D.dateDPAE, D.dateEmbauche);
            if (j !== null && j < 0) return { iso: D.dateDPAE, libelle: lib,
              note: "ATTENTION : la déclaration est postérieure à l'entrée du salarié. L'article L. 1221-10 exige l'inverse. Traitez ce point avec votre conseil avant toute autre chose." };
            return { iso: D.dateDPAE, libelle: lib, note: "Entrée le " + dateFr(D.dateEmbauche) + " : la déclaration la précède bien." };
          }
          return { iso: D.dateDPAE, libelle: lib };
        } },
      { id: "b2", nom: "Établir le contrat, et l'écrire quand la loi l'exige",
        risque: "Le contrat à durée déterminée non écrit, ou dont le motif n'est pas précisément défini, est réputé conclu pour une durée indéterminée, l'article L. 1245-1 rattachant expressément cette sanction au premier alinéa de l'article L. 1242-12. Lorsque le conseil de prud'hommes fait droit à la demande de requalification, il accorde au salarié une indemnité à la charge de l'employeur qui ne peut être inférieure à un mois de salaire (L. 1245-2), sans préjudice des règles de rupture du contrat à durée indéterminée. Conclure un contrat qui a pour objet ou pour effet de pourvoir durablement un emploi lié à l'activité normale et permanente de l'entreprise est puni d'une amende de 3 750 euros, portée en cas de récidive à 7 500 euros et à six mois d'emprisonnement (L. 1248-1).",
        conseil: "Le contrat se signe avant la prise de poste, jamais après : un contrat régularisé le surlendemain n'est pas un contrat écrit, c'est un contrat reconstitué. Écrivez le motif en une phrase de fait, avec le nom et la qualification de la personne remplacée ou l'événement précis qui justifie le recours — les formules générales sont ce qui se retourne le plus sûrement contre l'employeur. Faites relire chaque contrat par une seconde personne avant signature, en vérifiant que le motif écrit correspond à la situation réelle du service.",
        jx: "embauche",
        quoi: "Le contrat à durée déterminée est établi par écrit et comporte la définition précise de son motif ; à défaut, il est réputé conclu pour une durée indéterminée. Il porte notamment le nom et la qualification de la personne remplacée, la date du terme ou la durée minimale, la désignation du poste, l'intitulé de la convention collective, la durée de la période d'essai et le montant de la rémunération. Le recours n'est ouvert que dans les cas énumérés par l'article L. 1242-2, et pour une tâche précise et temporaire.",
        fond: ["L1242-12", "L1242-2"],
        si: function (P, D) { return D.typeContrat === "contrat à durée déterminée" ? true : (D.typeContrat ? false : null); } },
      { id: "b3", nom: "Transmettre le contrat à durée déterminée dans les deux jours ouvrables",
        risque: "La méconnaissance de l'obligation de transmission dans le délai fixé par l'article L. 1242-13 ne saurait, à elle seule, entraîner la requalification en contrat à durée indéterminée ; elle ouvre en revanche droit, pour le salarié, à une indemnité à la charge de l'employeur, qui ne peut être supérieure à un mois de salaire (L. 1245-1).",
        conseil: "Transmettez le jour de l'embauche, et non au dernier jour du délai : deux jours ouvrables se consomment vite en fin de semaine ou avant un jour férié. Datez la remise — récépissé signé, courriel horodaté, envoi recommandé — et classez la preuve avec le contrat, pas ailleurs. C'est une formalité tenue en fait dans la quasi-totalité des dossiers et prouvée dans presque aucun : c'est la preuve, ici, qui manque.",
        quoi: "Le contrat de travail est transmis au salarié, au plus tard, dans les deux jours ouvrables suivant l'embauche. Datez la transmission et conservez-en la preuve : c'est un délai court, souvent tenu en fait et jamais prouvé.",
        fond: ["L1242-13"],
        si: function (P, D) { return D.typeContrat === "contrat à durée déterminée" ? true : (D.typeContrat ? false : null); },
        quand: function (D) {
          if (!D.dateEmbauche) return null;
          var t = joursOuvrablesApres(D.dateEmbauche, 2);
          return { iso: t, libelle: "Transmission au plus tard le " + dateFr(t),
            note: "Deux jours OUVRABLES (art. L. 1242-13) : cette page ne tient pas le calendrier des jours fériés — recalez la date si l'un d'eux tombe dans l'intervalle." };
        } },
      { id: "b4", nom: "Vérifier le délai de carence si le poste vient d'être occupé en contrat court",
        risque: "Le fait de méconnaître les stipulations conventionnelles prises en application de l'article L. 1244-3 ou, lorsqu'elles sont applicables, les dispositions de l'article L. 1244-3-1, relatives à la succession de contrats sur un même poste, est puni d'une amende de 3 750 euros ; la récidive est punie d'une amende de 7 500 euros et d'un emprisonnement de six mois (L. 1248-11). L'article L. 1245-1 répute en outre à durée indéterminée le contrat conclu en méconnaissance de l'article L. 1244-3-1 et de ces stipulations conventionnelles, la requalification ouvrant l'indemnité d'au moins un mois de salaire de l'article L. 1245-2.",
        conseil: "Tenez le calendrier par poste, non par salarié : c'est le poste que le délai protège, et deux personnes différentes sur le même poste ne rompent pas la chaîne. Comptez en jours d'ouverture de l'entreprise, en partant de la date de fin du contrat précédent renouvellements inclus, et notez le calcul par écrit à côté du contrat suivant. Cherchez d'abord la convention ou l'accord de branche étendu, qui peut fixer ses propres modalités ; les cas où le délai ne s'applique pas sont limitativement énumérés — ne les supposez jamais.",
        quoi: "À l'expiration d'un contrat à durée déterminée, il ne peut être recouru, pour pourvoir le poste du salarié dont le contrat a pris fin, ni à un contrat à durée déterminée ni à un contrat temporaire avant l'expiration d'un délai de carence, calculé en fonction de la durée du contrat renouvellements inclus. À défaut de stipulation conventionnelle, ce délai est du tiers de la durée du contrat expiré s'il était de quatorze jours ou plus, de la moitié s'il était plus court. Les jours pris en compte sont les jours d'ouverture de l'entreprise.",
        fond: ["L1244-3", "L1244-3-1"],
        si: function (P, D) { return D.typeContrat === "contrat à durée déterminée" ? true : (D.typeContrat ? false : null); },
        conv: "un délai de carence propre, ou des cas dans lesquels il ne s'applique pas" },
      { id: "b5", nom: "Écrire la clause d'essai à la bonne durée",
        risque: "Une durée d'essai excédant les maxima de l'article L. 1221-19 est privée d'effet, et la rupture intervenue au-delà de la durée régulière s'analyse en licenciement sans cause réelle et sérieuse. Le renouvellement pratiqué sans accord de branche étendu qui le prévoie et en fixe les conditions et les durées est dans la même situation.",
        conseil: "Corrigez le contrat type plutôt que les contrats un à un : la clause excessive vient presque toujours d'une trame ancienne recopiée. Vérifiez la catégorie réelle du salarié — ouvrier, employé, agent de maîtrise, technicien, cadre — avant d'écrire la durée : c'est le classement erroné qui produit l'essai irrégulier, plus souvent que l'ignorance du maximum. Le renouvellement se stipule au contrat et se fait accepter par écrit pendant l'essai, jamais à son terme.",
        quoi: "La période d'essai du contrat à durée indéterminée ne peut excéder deux mois pour les ouvriers et employés, trois mois pour les agents de maîtrise et techniciens, quatre mois pour les cadres. Elle ne peut être renouvelée qu'une fois, si un accord de branche étendu le prévoit et en fixe les conditions et durées ; renouvellement compris, elle ne peut dépasser quatre, six et huit mois selon la même échelle. Une durée excessive est privée d'effet : la rupture intervenue au-delà s'analyse en licenciement.",
        fond: ["L1221-19", "L1221-21"],
        si: function (P, D) { return D.essai === "non" ? false : true; },
        quand: function (D) {
          if (!D.dateEmbauche || !D.categorie) return null;
          var m = D.categorie === "cadre" ? 4 : (D.categorie === "agent de maîtrise ou technicien" ? 3 : (D.categorie === "ouvrier ou employé" ? 2 : null));
          if (m === null) return null;
          var t = moisApres(D.dateEmbauche, m);
          return { iso: t, libelle: "Terme maximal de l'essai initial : " + dateFr(t),
            note: "Maximum légal pour cette catégorie (art. L. 1221-19). Votre convention collective peut prévoir une durée plus courte : c'est elle qui s'applique alors." };
        },
        conv: "une durée d'essai plus courte, ou les conditions du renouvellement" },
      { id: "b6", nom: "Remettre les informations sur la relation de travail, dans les délais de chaque rubrique",
        risque: "Le salarié qui n'a pas reçu les informations principales relatives à la relation de travail met l'employeur en demeure de les lui communiquer ou de compléter les documents remis, puis peut saisir le juge (L. 1221-5-1). Une remise partielle ne vaut pas remise : les rubriques énumérées par l'article R. 1221-34 sont dues selon les délais distincts de l'article R. 1221-35, et la charge de la preuve de la remise pèse sur l'employeur.",
        conseil: "Confrontez votre contrat type à l'énumération de R. 1221-34 rubrique par rubrique, en cochant : un contrat complet peut suffire, mais il faut l'avoir vérifié une fois. Tenez les deux échéances séparément — sept jours calendaires pour le premier bloc, un mois pour le reste — plutôt que de tout remettre au dernier jour du mois. Faites accuser réception de la remise et datez-la : c'est le seul point sur lequel l'employeur sera interrogé.",
        quoi: "L'employeur remet au salarié un ou plusieurs documents écrits contenant les informations principales relatives à la relation de travail. L'article R. 1221-34 en énumère le contenu ; l'article R. 1221-35 fixe les délais : les rubriques 1° à 5°, 7°, 11° et 12° au plus tard le septième jour calendaire à compter de l'embauche, les autres au plus tard un mois après. Certaines rubriques peuvent prendre la forme d'un renvoi aux dispositions applicables.",
        fond: ["L1221-5-1", "R1221-34", "R1221-35"],
        quand: function (D) {
          if (!D.dateEmbauche) return null;
          var t7 = jours(D.dateEmbauche, 7), t30 = moisApres(D.dateEmbauche, 1);
          return { iso: t7, libelle: "Premier lot d'informations au plus tard le " + dateFr(t7),
            note: "Le reste au plus tard le " + dateFr(t30) + " (art. R. 1221-35). Faites accuser réception : la charge de la preuve pèse sur l'employeur." };
        } },
      { id: "b7", nom: "Inscrire au registre unique du personnel, au moment de l'embauche",
        risque: "Est puni de l'amende prévue pour les contraventions de la quatrième classe le fait de méconnaître les dispositions des articles L. 1221-13 et D. 1221-23 à R. 1221-26 relatives au registre unique du personnel ; cette amende est appliquée autant de fois qu'il y a de personnes employées dans des conditions susceptibles d'être sanctionnées (R. 1227-7).",
        conseil: "Inscrivez au moment de l'embauche, de façon indélébile et dans l'ordre des embauches : un registre reconstitué en fin de mois se voit, et il se voit d'autant mieux qu'il est propre. Les stagiaires et les volontaires en service civique s'inscrivent dans une partie spécifique, par ordre d'arrivée — c'est l'oubli le plus fréquent. Reprenez l'énumération de D. 1221-23 comme colonnes du registre, une fois pour toutes, plutôt que de la retrouver à chaque entrée.",
        jx: "registre",
        quoi: "Les noms et prénoms de tous les salariés sont inscrits dans l'ordre des embauches, au moment de l'embauche et de façon indélébile, avec les indications complémentaires de l'article D. 1221-23. « Au moment de l'embauche » : pas à la fin du mois.",
        fond: ["L1221-13", "D1221-23"] },
      { id: "b8", nom: "Informer sur les risques et former à la sécurité",
        risque: "L'article L. 4741-1 punit d'une amende de 10 000 euros le fait pour l'employeur ou son délégataire de méconnaître par sa faute personnelle les dispositions du titre IV du livre Ier de la quatrième partie, dont relèvent l'information sur les risques et la formation à la sécurité ; l'amende est appliquée autant de fois qu'il y a de travailleurs de l'entreprise concernés, et la récidive est punie d'un an d'emprisonnement et de 30 000 euros. En cas d'accident d'un salarié non formé, la faute inexcusable se plaide contre l'employeur.",
        conseil: "Bâtissez un parcours d'accueil sécurité par poste — risques du poste, circulation, conduite à tenir en cas d'accident — et déroulez-le avant la première prise de poste, pas dans la semaine qui suit. Datez, faites émarger, conservez : une formation non prouvée n'existe pas au contentieux, et la feuille d'émargement est la première pièce que l'on vous demandera. Traitez à part les postes à risques particuliers, les contrats courts et les stagiaires, qui appellent une formation renforcée.",
        quoi: "L'employeur organise et dispense une information des travailleurs sur les risques pour la santé et la sécurité et les mesures prises pour y remédier (art. L. 4141-1), et organise une formation pratique et appropriée à la sécurité au bénéfice des travailleurs qu'il embauche (art. L. 4141-2). Les deux se font à l'entrée, et se tracent par émargement. Sur un poste à risques particuliers, un salarié en contrat court ou un stagiaire bénéficie en outre d'une formation renforcée.",
        fond: ["L4141-1", "L4141-2"] },
      { id: "b9", nom: "Informer des dispositifs de collecte en place",
        risque: "Aucune information concernant personnellement un candidat puis un salarié ne peut être collectée par un dispositif qui n'a pas été porté préalablement à sa connaissance (L. 1221-9 et L. 1222-4). Une preuve obtenue par un dispositif non annoncé est écartée, et la mesure qu'elle fondait tombe avec elle. Le sujet croise la réglementation sur les données personnelles, qui relève d'autres textes.",
        conseil: "Recensez les dispositifs réellement en place — badgeage, géolocalisation, vidéo, outils de suivi de l'activité, messagerie — et vérifiez pour chacun l'existence d'une preuve datée de l'information des salariés et, le cas échéant, de la consultation du comité. Annoncez avant d'installer, pas après : l'information préalable ne se rattrape pas rétroactivement sur les données déjà collectées. Pour les candidats, une phrase dans l'annonce et dans la convocation à l'entretien suffit à établir l'information sur les méthodes employées.",
        quoi: "Aucune information concernant personnellement un candidat, puis un salarié, ne peut être collectée par un dispositif qui n'a pas été porté préalablement à sa connaissance. Badgeage, géolocalisation, vidéosurveillance, outils de suivi de l'activité : chacun s'annonce, par écrit, avant d'être opposable. Le candidat, lui, est expressément informé des méthodes et techniques d'aide au recrutement employées.",
        fond: ["L1221-8", "L1221-9", "L1222-4"],
        si: function (P, D) { return D.dispositifsCollecte === "non" ? false : true; } },
      { id: "b10", nom: "VALIDATION — demander la visite d'information et de prévention, et clore le dossier",
        risque: "Tout travailleur bénéficie d'une visite d'information et de prévention dans un délai qui n'excède pas trois mois à compter de la prise effective du poste (R. 4624-10). Un salarié qui n'a pas été vu par la médecine du travail, puis déclaré inapte ou accidenté, se retourne contre l'employeur : le manquement au suivi médical est systématiquement retenu, et il pèse dans l'appréciation de la faute inexcusable.",
        conseil: "Déclenchez la demande au service de prévention le jour même de l'entrée, en même temps que la déclaration préalable, et classez l'accusé : c'est la formalité que l'urgence fait le plus souvent oublier et l'une des plus simples à prouver. Rapprochez périodiquement le registre du personnel de l'état des visites détenu par le service — l'écart se voit en une lecture. Signalez sans attendre les postes à risques particuliers, qui appellent un examen avant affectation et non une visite dans les trois mois.",
        quoi: "Tout travailleur bénéficie d'une visite d'information et de prévention dans un délai qui n'excède pas trois mois à compter de la prise effective du poste. La demande au service de prévention et de santé au travail se fait dès l'entrée : c'est la formalité que l'urgence fait le plus souvent oublier, et l'une des plus simples à prouver. Datez la demande, classez l'accusé, et le dossier d'embauche est complet.",
        fond: ["R4624-10"],
        quand: function (D) {
          if (!D.dateEmbauche) return null;
          var t = moisApres(D.dateEmbauche, 3);
          return { iso: t, libelle: "Visite d'information et de prévention au plus tard le " + dateFr(t),
            note: "Trois mois à compter de la prise effective du poste (art. R. 4624-10). Un suivi individuel renforcé obéit à d'autres règles : voyez l'audit social." };
        },
        doc: { modele: "note-rh", nom: "Demande de visite au service de prévention et de santé au travail",
          pre: function (P, D) { return { entreprise: P.denomination,
            objet: "Demande de visite d'information et de prévention" + (D.salarieEmbauche ? " — " + D.salarieEmbauche : ""),
            date: D.dateEmbauche }; } } },
    ]
  },

  /* ================================================================== */
  /* 14. ORGANISER LES CONGÉS PAYÉS                                     */
  /* ================================================================== */
  {
    cle: "conges",
    suite: { cle: "findecontrat", pourquoi: "Les congés acquis et non pris se retrouvent au solde de tout compte : le parcours de fin de contrat reprend le décompte là où celui-ci le laisse." },
    nom: "Organiser les congés payés",
    resume: "Quatre échéances et un compteur : la période de prise, annoncée deux mois avant son ouverture ; l'ordre des départs, défini sur des critères et communiqué un mois avant chaque départ ; l'interdiction de modifier à moins d'un mois ; et la journée de solidarité, dont les modalités se fixent au lieu de se subir.",
    audit: { href: "audit-social.html", nom: "l'audit social (contrôle de l'existant)" },
    donnees: [
      { c: "accordConges", nom: "Un accord d'entreprise ou de branche fixe-t-il la période de prise et l'ordre des départs ?", t: "oui-non",
        aide: "L'article L. 3141-15 lui donne la main ; l'article L. 3141-16 ne s'applique qu'à défaut." },
      { c: "debutPeriode", nom: "Date d'ouverture de la période de prise retenue", t: "date",
        aide: "La période doit comprendre, dans tous les cas, celle du 1er mai au 31 octobre (art. L. 3141-13)." },
      { c: "dateAvisCSEConges", nom: "Date de l'avis du comité social et économique sur la période et l'ordre", t: "date",
        aide: "L'avis n'est requis, à défaut d'accord, que s'il existe un comité (art. L. 3141-16).",
        si: function (P, D) { return D.accordConges === "oui" ? false : true; } },
      { c: "dateInfoPeriode", nom: "Date à laquelle la période a été portée à la connaissance des salariés", t: "date" },
      { c: "premierDepart", nom: "Date du premier départ prévu", t: "date",
        aide: "Elle sert à mesurer le délai d'un mois de communication de l'ordre des départs (art. D. 3141-6)." },
      { c: "solidarite", nom: "Les modalités de la journée de solidarité sont-elles fixées ?", t: "oui-non" },
      { c: "tempsPartielConges", nom: "L'entreprise emploie-t-elle des salariés à temps partiel ?", t: "oui-non",
        aide: "La limite de sept heures de la journée de solidarité est réduite proportionnellement à leur durée contractuelle (art. L. 3133-8)." },
    ],
    prealable: [
      { id: "compteurs", g: "information", nom: "Les compteurs de congés acquis et pris, salarié par salarié",
        aide: "Deux jours et demi ouvrables par mois de travail effectif, trente jours ouvrables au plus (art. L. 3141-3)." },
      { id: "accord", g: "document", nom: "L'accord d'entreprise ou de branche fixant la période et l'ordre, s'il en existe un",
        si: function (P, D) { return D.accordConges === "non" ? false : true; } },
      { id: "ccnconges", g: "document", nom: "La convention collective, au titre « congés »",
        aide: "Elle peut ajouter des jours, fixer une autre période, ou d'autres critères d'ordre. L'application ne la lit pas." },
      { id: "contraintes", g: "information", nom: "Les contraintes d'activité de l'année (saisonnalité, fermeture, chantiers)" },
      { id: "situations", g: "information", nom: "Les situations de famille et anciennetés utiles aux critères de l'ordre des départs",
        aide: "Ce sont les critères que l'article L. 3141-16 nomme, à défaut de stipulation conventionnelle." },
    ],
    etapes: [
      { id: "c1", nom: "Vérifier les compteurs d'acquisition",
        risque: "Le fait de méconnaître les dispositions des articles L. 3141-1 à L. 3141-33 relatives aux congés payés, ainsi que celles des décrets pris pour leur application, est puni de l'amende prévue pour les contraventions de la cinquième classe, prononcée autant de fois qu'il y a de salariés concernés par l'infraction (R. 3143-1). Un compteur absent ou faux se solde par ailleurs en rappels d'indemnité de congés payés sur la période non prescrite, majorés des congés dus sur ces rappels.",
        conseil: "Ouvrez un compteur par salarié — acquis, pris, solde, période de rattachement — et portez-le au bulletin de paie : sans lui, ni l'acquisition ni la prise ne se prouvent, et le doute profite au salarié. Faites vérifier séparément, par votre conseil et sur les textes en vigueur, le traitement des périodes d'arrêt de travail : c'est le point le plus lourd financièrement et il ne se tranche pas dans un tableur. Comparez enfin avec la convention collective, qui peut être plus favorable.",
        quoi: "Le salarié a droit à un congé de deux jours et demi ouvrables par mois de travail effectif chez le même employeur, la durée totale exigible ne pouvant excéder trente jours ouvrables. Le compteur se tient salarié par salarié et se porte au bulletin. Le traitement des périodes d'arrêt de travail au regard de l'acquisition n'est pas tranché ici : faites-le vérifier par votre conseil sur les textes en vigueur.",
        fond: ["L3141-3"],
        conv: "des jours supplémentaires, une autre période de référence, ou des règles propres aux absences" },
      { id: "c2", nom: "Fixer la période de prise — par l'accord d'abord",
        risque: "La méconnaissance des articles L. 3141-15 et L. 3141-16, relatifs à la fixation de la période de prise et de l'ordre des départs, entre dans le champ de l'amende de cinquième classe de l'article R. 3143-1, prononcée autant de fois qu'il y a de salariés concernés. Faute de période régulièrement fixée, l'employeur n'a aucune date à opposer au salarié, et les refus qu'il oppose se contestent.",
        conseil: "Cherchez l'accord d'entreprise ou d'établissement d'abord, l'accord de branche ensuite, et ne décidez unilatéralement qu'après avoir constaté par écrit qu'il n'existe ni l'un ni l'autre — l'ordre des sources est aussi l'ordre des vérifications. Lorsque vous décidez, recueillez l'avis du comité social et économique s'il en existe un et conservez le procès-verbal : c'est la pièce qui manque le jour du litige. Datez la décision et gardez-la avec la note diffusée.",
        quoi: "Un accord d'entreprise ou d'établissement ou, à défaut, une convention ou un accord de branche fixe la période de prise des congés, l'ordre des départs pendant cette période, et les délais que doit respecter l'employeur s'il entend modifier l'ordre et les dates. Cherchez l'accord avant de décider : à défaut seulement, l'employeur définit lui-même, après avis du comité social et économique s'il en existe un.",
        fond: ["L3141-15", "L3141-16"] },
      { id: "c3", nom: "Vérifier que la période comprend le 1er mai au 31 octobre",
        risque: "La période retenue doit en tout état de cause comprendre celle du 1er mai au 31 octobre ; une période plus étroite méconnaît l'article L. 3141-13 et entre dans le champ de l'amende de cinquième classe de l'article R. 3143-1, prononcée autant de fois qu'il y a de salariés concernés. L'employeur qui n'a pas mis le salarié en mesure de prendre ses congés lui en doit l'indemnité.",
        conseil: "Écrivez la période dans la note de service et vérifiez matériellement qu'elle englobe les six mois du plancher, bornes comprises : l'erreur vient presque toujours d'une période calquée sur l'exercice comptable. Si l'activité impose une fermeture hors de cette fenêtre, cela ne rétrécit pas la période de prise — cela s'ajoute. Gardez la note et la preuve de sa diffusion avec la décision qui a fixé la période.",
        quoi: "Les congés sont pris dans une période qui comprend dans tous les cas la période du 1er mai au 31 octobre de chaque année. C'est un plancher : la période retenue peut être plus large, jamais plus étroite.",
        fond: ["L3141-13"],
        quand: function (D) {
          if (!D.debutPeriode) return null;
          return { iso: D.debutPeriode, libelle: "Période de prise ouverte le " + dateFr(D.debutPeriode),
            note: "Vérifiez qu'elle englobe le 1er mai — 31 octobre de l'année considérée (art. L. 3141-13)." };
        } },
      { id: "c4", nom: "Annoncer la période deux mois avant son ouverture",
        champDate: "dateInfoPeriode",
        risque: "La période de prise est portée à la connaissance des salariés au moins deux mois avant son ouverture (D. 3141-5) ; l'article R. 3143-1 étend l'amende de cinquième classe aux décrets pris pour l'application des articles relatifs aux congés payés, prononcée autant de fois qu'il y a de salariés concernés. Surtout, l'employeur qui n'a pas mis le salarié en mesure de prendre ses congés lui en doit l'indemnité, et il ne peut lui opposer la perte de jours qu'il ne l'a pas mis en mesure de poser.",
        conseil: "Comptez les deux mois à rebours de l'ouverture de la période et inscrivez la date d'envoi au calendrier de l'année précédente : c'est un délai facile à tenir et rarement prouvé. Doublez l'affichage d'un écrit individuel — courriel horodaté, note remise contre émargement, mention au bulletin — et conservez la preuve avec la décision. L'affichage seul se conteste : personne ne peut dire à quelle date le panneau a été rempli.",
        quoi: "La période de prise des congés payés est portée par l'employeur à la connaissance des salariés au moins deux mois avant l'ouverture de cette période. Affichez, envoyez, datez : c'est un délai que l'on tient facilement et que l'on prouve rarement.",
        fond: ["D3141-5"],
        quand: function (D) {
          if (!D.debutPeriode) return null;
          var t = moisApres(D.debutPeriode, -2);
          var note = "Deux mois avant l'ouverture (art. D. 3141-5).";
          if (D.dateInfoPeriode) {
            var j = joursEntre(D.dateInfoPeriode, D.debutPeriode);
            note += j !== null && j < 60
              ? " ATTENTION : l'information a été donnée le " + dateFr(D.dateInfoPeriode) + ", soit " + j + " jours avant l'ouverture — le délai n'est pas tenu."
              : " Information donnée le " + dateFr(D.dateInfoPeriode) + " : le délai est tenu.";
          }
          return { iso: t, libelle: "Information des salariés au plus tard le " + dateFr(t), note: note };
        },
        doc: { modele: "note-rh", nom: "Note d'information — période de prise des congés",
          pre: function (P, D) { return { entreprise: P.denomination,
            objet: "Période de prise des congés payés", date: D.dateInfoPeriode || D.debutPeriode }; } } },
      { id: "c5", nom: "Définir l'ordre des départs sur les critères de la loi",
        champDate: "dateAvisCSEConges",
        risque: "À défaut de stipulation conventionnelle, l'ordre des départs se définit après avis du comité social et économique le cas échéant, en tenant compte des critères énumérés par l'article L. 3141-16 : situation de famille, durée des services chez l'employeur, activité éventuelle chez d'autres employeurs. Un ordre arrêté sans ces critères entre dans le champ de l'amende de cinquième classe de l'article R. 3143-1 et se conteste, le refus non motivé se réglant en dommages-intérêts.",
        conseil: "Écrivez la grille avant d'arbitrer, et non pour justifier après coup les arbitrages déjà rendus : c'est l'ordre des opérations qui rend la décision défendable. Faites remonter la situation de famille par déclaration du salarié plutôt que par le fichier du personnel, qui est souvent périmé. Conservez, pour chaque demande refusée, la ligne de motif rattachée à l'un des critères — une phrase suffit, l'absence de phrase ne suffit jamais.",
        quoi: "À défaut de stipulation conventionnelle, l'employeur définit l'ordre des départs après avis, le cas échéant, du comité social et économique, en tenant compte de la situation de famille des bénéficiaires — notamment les possibilités de congé du conjoint ou du partenaire, et la présence au foyer d'un enfant ou d'un adulte handicapé ou d'une personne âgée en perte d'autonomie —, de la durée des services chez l'employeur, et de leur activité éventuelle chez un ou plusieurs autres employeurs.",
        fond: ["L3141-16"],
        si: function (P, D) { return D.accordConges === "oui" ? false : true; },
        quand: function (D) {
          if (!D.dateAvisCSEConges) return null;
          return { iso: D.dateAvisCSEConges, libelle: "Avis du comité recueilli le " + dateFr(D.dateAvisCSEConges) };
        } },
      { id: "c6", nom: "Communiquer l'ordre des départs un mois avant chaque départ",
        risque: "L'ordre des départs est communiqué à chaque salarié un mois avant son départ (D. 3141-6) ; l'article R. 3143-1 étend l'amende de cinquième classe aux décrets pris pour l'application des dispositions relatives aux congés payés, prononcée autant de fois qu'il y a de salariés concernés.",
        conseil: "« Par tout moyen » n'affranchit pas de la preuve : choisissez un moyen daté et systématique — courriel individuel ou mention sur le bulletin — plutôt que l'affichage seul. Communiquez service par service en une fois, à une date arrêtée d'avance, et gardez la liste des destinataires. Le délai d'un mois se compte départ par départ, non à partir de la publication du tableau général : un départ ajouté tardivement doit être communiqué à sa propre échéance.",
        quoi: "L'ordre des départs en congé est communiqué, par tout moyen, à chaque salarié un mois avant son départ. « Par tout moyen » n'affranchit pas de la preuve : gardez trace de l'envoi ou de l'affichage.",
        fond: ["D3141-6"],
        quand: function (D) {
          if (!D.premierDepart) return null;
          var t = moisApres(D.premierDepart, -1);
          return { iso: t, libelle: "Communication au plus tard le " + dateFr(t),
            note: "Un mois avant le départ du " + dateFr(D.premierDepart) + " (art. D. 3141-6)." };
        } },
      { id: "c7", nom: "Ne plus modifier à moins d'un mois, sauf circonstances exceptionnelles",
        risque: "Sauf circonstances exceptionnelles, l'ordre et les dates de départ ne peuvent être modifiés moins d'un mois avant la date de départ prévue (L. 3141-16), disposition dont la méconnaissance entre dans le champ de l'amende de cinquième classe de l'article R. 3143-1. Une modification tardive ou un refus non motivé se traduisent en dommages-intérêts, et le salarié qui avait engagé des frais en obtient le remboursement.",
        conseil: "Écrivez la procédure interne avant d'en avoir besoin : qui décide, quelle circonstance est invoquée, sous quelle forme le salarié en est informé et sous quel délai. Nommez la circonstance dans l'écrit adressé au salarié — une modification non motivée est indéfendable, quelle qu'ait été la réalité de la contrainte. Réservez la décision à un niveau hiérarchique unique : c'est la modification décidée par un chef de service pressé qui coûte, presque toujours.",
        quoi: "Sauf circonstances exceptionnelles, l'ordre et les dates de départ ne peuvent être modifiés dans le délai d'un mois avant la date prévue. Écrivez la procédure interne : qui décide, quelle circonstance est invoquée, et comment le salarié en est informé — une modification tardive non motivée se paie en dommages-intérêts.",
        fond: ["L3141-16"] },
      { id: "c8", nom: "Fixer les modalités de la journée de solidarité",
        risque: "Le travail accompli au titre de la journée de solidarité ne donne pas lieu à rémunération dans la limite de sept heures, ramenée à la valeur d'une journée pour les salariés en forfait annuel en jours et réduite proportionnellement pour les salariés à temps partiel (L. 3133-8). Au-delà de cette limite, les heures sont des heures de travail à rémunérer, et donnent lieu à rappels de salaire ; l'absence de modalités régulièrement fixées fragilise en outre toute retenue opérée.",
        conseil: "Fixez les modalités par accord, à défaut par décision de l'employeur après consultation du comité, et informez les salariés par écrit en précisant la date ou le mode d'accomplissement retenu — la journée de solidarité ne s'improvise pas en cours d'année. Faites calculer le prorata des temps partiels avant la paie, salarié par salarié : c'est l'erreur la plus fréquente et la plus visible sur le bulletin. Archivez la décision, l'avis du comité et la note diffusée ensemble.",
        quoi: "La journée de solidarité prend la forme d'une journée supplémentaire de travail non rémunérée pour les salariés et d'une contribution pour les employeurs. Le travail accompli, dans la limite de sept heures, ne donne pas lieu à rémunération ; pour les salariés en forfait annuel en jours, dans la limite de la valeur d'une journée ; pour les salariés à temps partiel, la limite de sept heures est réduite proportionnellement à la durée contractuelle. Au-delà de la limite, les heures sont des heures de travail à rémunérer.",
        fond: ["L3133-7", "L3133-8"],
        si: function (P, D) { return D.solidarite === "oui" ? true : (D.solidarite === "non" ? true : null); },
        conv: "les modalités d'accomplissement de la journée de solidarité" },
      { id: "c9", nom: "VALIDATION — mettre le paramétrage de paie en accord avec les décisions prises",
        risque: "Un compteur faux ou une retenue mal calculée se rattrapent en rappels sur toute la période non prescrite, majorés des congés payés afférents. La méconnaissance des dispositions relatives aux congés payés et de leurs décrets d'application demeure par ailleurs punie de l'amende de cinquième classe de l'article R. 3143-1, prononcée autant de fois qu'il y a de salariés concernés.",
        conseil: "Faites le contrôle sur bulletins réels, par sondage sur au moins un temps partiel, un forfait jours et un temps plein : le paramétrage se vérifie sur des cas, pas sur des règles. Datez le contrôle, nommez celui qui l'a fait, et faites-lui signer l'état — un contrôle anonyme ne se refait pas l'année suivante. Archivez au même endroit la décision, l'avis du comité s'il y en a eu un, la note diffusée et la preuve de sa diffusion : c'est ce dossier unique que l'on vous demandera.",
        quoi: "Compteurs portés au bulletin, prorata de la journée de solidarité pour les temps partiels, retenues correctement calculées : le parcours n'est terminé que lorsque la paie applique ce qui a été décidé. Datez le contrôle, nommez le responsable, et archivez la décision, l'avis du comité s'il y en a eu un, la note diffusée et la preuve de sa diffusion.",
        fond: ["L3141-3", "L3133-8"],
        doc: { modele: "note-rh", nom: "Note de contrôle du paramétrage des congés",
          pre: function (P, D) { return { entreprise: P.denomination,
            objet: "Congés payés et journée de solidarité — contrôle du paramétrage",
            date: D.debutPeriode }; } } },
    ]
  },

  /* ================================================================== */
  /* 15. ÉTABLIR LES DOCUMENTS DE FIN DE CONTRAT                        */
  /* ================================================================== */
  {
    cle: "findecontrat",
    nom: "Établir les documents de fin de contrat",
    resume: "Ce qui se remet au dernier jour, et rien d'autre : le certificat de travail aux mentions exclusives de l'article D. 1234-6, le reçu pour solde de tout compte en double exemplaire, l'attestation destinée à l'assurance chômage. Plus les deux chemins particuliers : la rupture conventionnelle et l'inaptitude.",
    audit: { href: "audit-social.html", nom: "l'audit social (contrôle de l'existant)" },
    jx: "discipline",
    donnees: [
      { c: "salarieSortie", nom: "Salarié concerné (nom, emploi)", t: "text" },
      { c: "motifSortie", nom: "Cause de la fin du contrat", t: "select",
        options: ["démission", "licenciement", "rupture conventionnelle individuelle", "fin de contrat à durée déterminée",
          "rupture de période d'essai", "inaptitude", "départ ou mise à la retraite", "autre"],
        aide: "Le certificat, le reçu et l'attestation sont dus quelle que soit la cause. Les deux chemins particuliers ci-dessous ne s'ouvrent que pour la rupture conventionnelle et l'inaptitude." },
      { c: "dateSortie", nom: "Date d'expiration du contrat", t: "date" },
      { c: "protege", nom: "Le salarié est-il ou a-t-il été titulaire d'un mandat représentatif ?", t: "oui-non",
        aide: "Si oui, l'autorisation de l'inspection du travail peut être requise AVANT toute rupture, y compris conventionnelle (art. L. 2411-3 pour le délégué syndical ; les autres mandats obéissent à leurs propres textes, audités dans le module comité)." },
      { c: "dateSignatureRC", nom: "Date de signature de la convention de rupture", t: "date",
        si: function (P, D) { return D.motifSortie === "rupture conventionnelle individuelle" ? true : (D.motifSortie ? false : null); } },
      { c: "dateExamenReprise", nom: "Date de l'examen médical de reprise ayant constaté l'inaptitude", t: "date",
        si: function (P, D) { return D.motifSortie === "inaptitude" ? true : (D.motifSortie ? false : null); } },
    ],
    prealable: [
      { id: "solde", g: "information", nom: "Le détail chiffré des sommes dues : salaire, congés, préavis, indemnités",
        aide: "Le reçu pour solde de tout compte fait l'inventaire des sommes versées : un reçu global sans inventaire ne remplit pas sa fonction." },
      { id: "dates", g: "information", nom: "Les dates d'entrée et de sortie, et la nature des emplois successivement occupés",
        aide: "Ce sont EXACTEMENT les mentions du certificat de travail (art. D. 1234-6) — et les seules." },
      { id: "ccnsortie", g: "document", nom: "La convention collective, au titre « rupture du contrat »",
        aide: "Préavis, indemnités et procédures conventionnels peuvent être plus favorables : l'application ne les lit pas." },
      { id: "mandats", g: "information", nom: "La liste à jour des mandats en cours, des anciens mandats encore protégés et des candidatures",
        aide: "Elle se consulte AVANT toute rupture, quelle qu'en soit la forme." },
      { id: "portabilite", g: "document", nom: "Les documents d'information sur la portabilité des couvertures santé et prévoyance",
        aide: "Ces dispositifs relèvent d'autres codes que le code du travail : l'application ne les vérifie pas, elle rappelle seulement de ne pas les oublier." },
    ],
    etapes: [
      { id: "f1", nom: "Vérifier la liste des salariés protégés AVANT toute rupture",
        risque: "Le licenciement d'un délégué syndical ne peut intervenir qu'après autorisation de l'inspecteur du travail (L. 2411-3) ; rompre le contrat d'un délégué syndical ou d'un ancien délégué syndical en méconnaissance de la procédure d'autorisation administrative est puni d'un an d'emprisonnement et de 3 750 euros d'amende (L. 2431-1). Les mêmes peines répriment la rupture du contrat d'un membre élu de la délégation du personnel au comité social et économique, d'un candidat, d'un ancien élu ou d'un salarié ayant demandé l'organisation d'élections, ainsi que le licenciement d'un représentant syndical au comité (L. 2432-1). La rupture prononcée sans autorisation est nulle, et ouvre la réintégration.",
        conseil: "Établissez la liste des salariés protégés avant d'ouvrir le dossier, pas au moment de notifier, et faites-la vérifier par une seconde personne : les protections courent après la fin du mandat et couvrent les candidats, ce que les fichiers du personnel ignorent presque toujours. Datez la réception des lettres de désignation syndicale et classez-les à part — c'est cette date, comparée à celle de la convocation à l'entretien préalable, qui décide. Au moindre doute, arrêtez la procédure et saisissez l'inspection : une autorisation demandée à tort ne coûte rien, une rupture prononcée sans elle coûte tout.",
        quoi: "Le licenciement d'un délégué syndical ne peut intervenir qu'après autorisation de l'inspecteur du travail ; l'autorisation vaut aussi pour l'ancien délégué syndical durant les douze mois suivant la cessation de ses fonctions s'il les a exercées au moins un an, et lorsque la lettre de désignation a été reçue avant la convocation à l'entretien préalable. Les autres mandats obéissent à leurs propres textes : l'audit du comité les traite. Une rupture prononcée sans autorisation est nulle.",
        fond: ["L2411-3"],
        si: function (P, D) { return D.protege === "non" ? false : true; } },
      { id: "f2", nom: "Rupture conventionnelle : entretiens, indemnité, rétractation",
        champDate: "dateSignatureRC",
        risque: "La convention fixe le montant de l'indemnité spécifique, qui ne peut être inférieur à celui de l'indemnité légale de licenciement, et la date de rupture, qui ne peut intervenir avant le lendemain du jour de l'homologation ; chaque partie dispose de quinze jours calendaires à compter de la signature pour se rétracter (L. 1237-13). Une indemnité insuffisante, un délai non tenu ou un consentement vicié font requalifier la rupture en licenciement sans cause réelle et sérieuse, la rupture conventionnelle ne pouvant être imposée par l'une ou l'autre des parties (L. 1237-11).",
        conseil: "Tenez un calendrier écrit dès la première rencontre : date des entretiens, date de signature, terme des quinze jours calendaires, date d'envoi de la demande, date de rupture. Remettez au salarié son exemplaire signé le jour même et faites-en accuser réception — sans cette remise, le délai de rétractation est jugé n'avoir pas couru. Calculez l'indemnité en comparant l'indemnité légale et, le cas échéant, l'indemnité conventionnelle, et gardez la feuille de calcul dans le dossier.",
        quoi: "L'employeur et le salarié peuvent convenir en commun des conditions de la rupture ; elle ne peut être imposée par l'une ou l'autre des parties et résulte d'une convention signée par elles. La convention fixe le montant de l'indemnité spécifique, qui ne peut être inférieur à celui de l'indemnité légale de licenciement, et la date de rupture, qui ne peut intervenir avant le lendemain du jour de l'homologation. Chaque partie dispose de quinze jours calendaires à compter de la signature pour se rétracter.",
        fond: ["L1237-11", "L1237-13"],
        si: function (P, D) { return D.motifSortie === "rupture conventionnelle individuelle" ? true : (D.motifSortie ? false : null); },
        quand: function (D) {
          if (!D.dateSignatureRC) return null;
          var t = jours(D.dateSignatureRC, 15);
          return { iso: t, libelle: "Fin du délai de rétractation le " + dateFr(t),
            note: "Quinze jours CALENDAIRES à compter de la signature (art. L. 1237-13). La demande d'homologation ne peut partir avant." };
        },
        conv: "une indemnité conventionnelle plus favorable que l'indemnité légale" },
      { id: "f3", nom: "Rupture conventionnelle : demander l'homologation",
        risque: "La validité de la convention est subordonnée à son homologation ; l'autorité administrative dispose d'un délai d'instruction de quinze jours ouvrables à compter de la réception de la demande, et à défaut de notification dans ce délai l'homologation est réputée acquise (L. 1237-14). Sans homologation, la convention ne produit pas d'effet et la rupture reste sans cause. Tout litige relève du conseil de prud'hommes, le recours devant être formé, à peine d'irrecevabilité, dans les douze mois de la date d'homologation.",
        conseil: "N'envoyez la demande qu'à l'issue du délai de rétractation, jamais la veille : une demande partie trop tôt vicie la procédure entière et oblige à tout recommencer. Conservez la preuve de la date de réception par l'autorité, qui fait courir les quinze jours ouvrables, et non la seule date d'envoi. Si l'homologation est réputée acquise faute de réponse, écrivez-le au dossier avec le calcul du délai : c'est cette note qui tiendra lieu de décision le jour où on vous la demandera.",
        quoi: "À l'issue du délai de rétractation, la partie la plus diligente adresse une demande d'homologation à l'autorité administrative, avec un exemplaire de la convention. L'autorité dispose de quinze jours ouvrables d'instruction à compter de la réception ; à défaut de notification dans ce délai, l'homologation est réputée acquise. La validité de la convention est subordonnée à son homologation.",
        fond: ["L1237-14"],
        si: function (P, D) { return D.motifSortie === "rupture conventionnelle individuelle" ? true : (D.motifSortie ? false : null); },
        quand: function (D) {
          if (!D.dateSignatureRC) return null;
          var t = jours(D.dateSignatureRC, 16);
          return { iso: t, libelle: "Demande d'homologation à adresser à partir du " + dateFr(t),
            note: "Le lendemain de la fin du délai de rétractation. Comptez ensuite quinze jours OUVRABLES d'instruction (art. L. 1237-14)." };
        } },
      { id: "f4", nom: "Inaptitude : rechercher le reclassement et documenter la recherche",
        risque: "L'employeur ne peut rompre le contrat que s'il justifie de son impossibilité de proposer un emploi dans les conditions de l'article L. 1226-2, du refus par le salarié de l'emploi proposé, ou de la mention expresse dans l'avis du médecin du travail que tout maintien dans un emploi serait gravement préjudiciable à sa santé ou que son état fait obstacle à tout reclassement ; lorsqu'il lui est impossible de proposer un emploi, il fait connaître par écrit les motifs qui s'y opposent (L. 1226-2-1). Une recherche non documentée prive le licenciement de cause réelle et sérieuse ; l'omission de la consultation du comité social et économique sur les propositions se répare en dommages-intérêts.",
        conseil: "Tenez un registre daté des postes examinés, des sociétés du groupe interrogées et des réponses reçues, y compris négatives — une recherche non tracée équivaut à une recherche non faite. Écrivez au médecin du travail pour lui soumettre les pistes envisagées et conservez sa réponse : l'échange écrit est la meilleure pièce du dossier. Consultez le comité sur les propositions et gardez le procès-verbal, puis adressez au salarié la lettre motivée d'impossibilité avant toute notification.",
        quoi: "Lorsque le salarié victime d'une maladie ou d'un accident non professionnel est déclaré inapte à reprendre l'emploi qu'il occupait, l'employeur lui propose un autre emploi approprié à ses capacités, au sein de l'entreprise ou des entreprises du groupe situées sur le territoire national et dont l'organisation, les activités ou le lieu d'exploitation assurent la permutation de tout ou partie du personnel. Une recherche non tracée équivaut à une recherche non faite : tenez le registre des postes examinés et des réponses reçues.",
        fond: ["L1226-2"],
        si: function (P, D) { return D.motifSortie === "inaptitude" ? true : (D.motifSortie ? false : null); } },
      { id: "f5", nom: "Inaptitude : reprendre le paiement du salaire au terme d'un mois",
        risque: "Lorsque, à l'issue d'un délai d'un mois à compter de la date de l'examen médical de reprise, le salarié déclaré inapte n'est ni reclassé ni licencié, l'employeur lui verse dès l'expiration de ce délai le salaire correspondant à l'emploi qu'il occupait avant la suspension de son contrat (L. 1226-4). La reprise est automatique : elle ne suppose ni demande du salarié ni mise en demeure, et se rattrape en rappels de salaire sans faute à établir.",
        conseil: "Posez l'alerte le jour de la réception de l'avis d'inaptitude, avec l'échéance du mois calculée à partir de la date de l'examen médical de reprise — c'est cette date, non celle de l'avis reçu, qui fait courir le délai. Prévenez la paie à la même minute que le service des ressources humaines : le retard vient presque toujours de ce que la paie apprend l'échéance après coup. Si le dossier de reclassement n'est pas prêt à l'échéance, reprenez le salaire et poursuivez la recherche : le versement n'interrompt rien.",
        quoi: "Lorsque, à l'issue d'un délai d'un mois à compter de la date de l'examen médical de reprise, le salarié déclaré inapte n'est ni reclassé ni licencié, l'employeur lui verse dès l'expiration de ce délai le salaire correspondant à l'emploi qu'il occupait avant la suspension de son contrat. La reprise est automatique : elle ne suppose ni demande ni mise en demeure.",
        fond: ["L1226-4"],
        si: function (P, D) { return D.motifSortie === "inaptitude" ? true : (D.motifSortie ? false : null); },
        quand: function (D) {
          if (!D.dateExamenReprise) return null;
          var t = moisApres(D.dateExamenReprise, 1);
          return { iso: t, libelle: "Reprise du paiement du salaire au " + dateFr(t),
            note: "Un mois à compter de l'examen médical de reprise (art. L. 1226-4). Posez l'alerte en paie dès la réception de l'avis." };
        } },
      { id: "f6", nom: "Établir le certificat de travail — et rien de plus que ses mentions",
        risque: "Le fait de ne pas délivrer au salarié un certificat de travail, en méconnaissance de l'article L. 1234-19, est puni de l'amende prévue pour les contraventions de la quatrième classe (R. 1238-3). Le certificat contient exclusivement la date d'entrée et celle de sortie et la nature des emplois successivement occupés avec les périodes correspondantes (D. 1234-6) ; une mention étrangère à cette liste, en particulier défavorable, sort le certificat de son cadre et ouvre une réparation.",
        conseil: "Établissez un modèle unique de certificat, sans en-tête commerciale bavarde ni appréciation, et interdisez toute variante rédigée au cas par cas — c'est la bonne volonté du rédacteur qui produit les mentions de trop. Vérifiez les dates contre le registre unique du personnel et non contre la mémoire du service. Le certificat est dû à l'expiration du contrat quelle qu'en soit la cause, y compris après une rupture conflictuelle : le retenir en attendant une restitution de matériel est le réflexe le plus coûteux.",
        quoi: "À l'expiration du contrat de travail, l'employeur délivre au salarié un certificat dont le contenu est déterminé par voie réglementaire. L'article D. 1234-6, dans sa version lue à la source, énonce que le certificat contient EXCLUSIVEMENT la date d'entrée et celle de sortie, et la nature de l'emploi ou des emplois successivement occupés avec les périodes correspondantes. Les deux autres mentions qu'il portait autrefois sont abrogées : n'ajoutez rien.",
        fond: ["L1234-19", "D1234-6"],
        quand: function (D) {
          if (!D.dateSortie) return null;
          return { iso: D.dateSortie, libelle: "Certificat délivré le " + dateFr(D.dateSortie),
            note: "À l'expiration du contrat : le certificat ne s'envoie pas la semaine suivante." };
        } },
      { id: "f7", nom: "Établir le reçu pour solde de tout compte, en double exemplaire",
        risque: "Le reçu pour solde de tout compte peut être dénoncé dans les six mois qui suivent sa signature, délai au-delà duquel il devient libératoire pour l'employeur pour les seules sommes qui y sont mentionnées (L. 1234-20). Un reçu qui n'inventorie pas les sommes versées, ou dont la mention n'est pas conforme, ne produit pas l'effet libératoire attendu : ce qui n'y figure pas n'est jamais couvert.",
        conseil: "Détaillez ligne à ligne — salaire, indemnité compensatrice de congés payés, indemnité de rupture, primes, remboursements — plutôt que de porter un montant global : c'est le détail, et lui seul, qui produit l'effet libératoire. Établissez deux exemplaires, faites-en signer un et remettez l'autre au salarié le jour du départ, avec la mention de cette remise. Ne faites jamais signer un reçu avant le versement effectif ni avant le terme du contrat.",
        quoi: "Le solde de tout compte, établi par l'employeur et dont le salarié lui donne reçu, fait l'inventaire des sommes versées lors de la rupture. Le reçu peut être dénoncé dans les six mois qui suivent sa signature, délai au-delà duquel il devient libératoire pour l'employeur — pour les seules sommes qui y sont mentionnées. C'est pourquoi l'inventaire compte : ce qui n'y figure pas n'est pas couvert.",
        fond: ["L1234-20"] },
      { id: "f8", nom: "Délivrer et transmettre l'attestation destinée à l'assurance chômage",
        risque: "Le fait de méconnaître les dispositions des articles R. 1234-9 à R. 1234-12, relatives à l'attestation d'assurance chômage, est puni de l'amende prévue pour les contraventions de la cinquième classe (R. 1238-7). Le défaut de délivrance ou de transmission retarde l'indemnisation du salarié et se répare en dommages-intérêts, sans qu'il ait à démontrer un préjudice particulier.",
        conseil: "Délivrez au salarié et transmettez à France Travail dans le même geste : ce sont deux obligations distinctes, et c'est la seconde qui s'oublie. Les employeurs d'au moins onze salariés transmettent par voie électronique — conservez l'accusé de dépôt, qui est la seule preuve exploitable. Contrôlez le rejet éventuel du fichier dans les jours qui suivent : une transmission rejetée et non reprise équivaut à une absence de transmission, et personne ne s'en aperçoit avant l'appel du salarié.",
        quoi: "L'employeur délivre au salarié, au moment de l'expiration ou de la rupture du contrat, les attestations et justifications lui permettant d'exercer ses droits aux prestations, et les transmet sans délai à l'opérateur France Travail. Les employeurs d'au moins onze salariés effectuent cette transmission par voie électronique, sauf impossibilité pour une cause qui leur est étrangère.",
        fond: ["R1234-9"],
        quand: function (D) {
          if (!D.dateSortie) return null;
          return { iso: D.dateSortie, libelle: "Attestation délivrée et transmise le " + dateFr(D.dateSortie),
            note: "« Sans délai » pour la transmission : un envoi différé retarde l'indemnisation du salarié et se répare." };
        } },
      { id: "f9", nom: "VALIDATION — clore le dossier de sortie et en garder la trace",
        risque: "Les manquements se cumulent : amende de quatrième classe pour le certificat de travail non délivré (R. 1238-3), amende de cinquième classe pour l'attestation destinée à l'assurance chômage (R. 1238-7), dommages-intérêts pour la remise tardive ou incomplète, et perte de l'effet libératoire du reçu pour solde de tout compte. Un départ mal clos se répare longtemps après, quand les pièces ne sont plus rassemblables.",
        conseil: "Constituez une liasse type et une liste de contrôle unique — certificat, reçu en double exemplaire, attestation délivrée et transmise, information sur la portabilité des couvertures — et n'autorisez aucun départ sans elle. Nommez le responsable du contrôle de sortie et faites-lui signer la liste, avec la date : sans nom au bas de la page, personne n'a vérifié. Reprenez les sorties des derniers mois pour repérer les pièces manquantes tant qu'elles peuvent encore être établies.",
        quoi: "Liasse remise et datée, accusé de transmission de l'attestation classé, exemplaires du reçu conservés, information sur la portabilité des couvertures donnée. Nommez le responsable du contrôle de sortie et gardez la liste signée : le parcours n'est terminé que lorsque quelqu'un a vérifié, et signé, que rien ne manque.",
        fond: ["L1234-19", "L1234-20", "R1234-9"],
        doc: { modele: "note-rh", nom: "Liste de contrôle de sortie",
          pre: function (P, D) { return { entreprise: P.denomination,
            objet: "Documents de fin de contrat" + (D.salarieSortie ? " — " + D.salarieSortie : ""),
            date: D.dateSortie }; } } },
    ]
  },

  ];


  /* ================================================================== */
  /* L'ÉTAT — écrit sur le poste, jamais ailleurs.                      */
  /* ================================================================== */
  var CLE_ETAT = "parcours-etat";
  var ETAT = { v: 1, parcours: {} };
  try {
    var lu = JSON.parse(localStorage.getItem(CLE_ETAT) || "null");
    if (lu && typeof lu === "object" && lu.parcours) ETAT = lu;
  } catch (_) {}
  function enregistrer() {
    try { localStorage.setItem(CLE_ETAT, JSON.stringify(ETAT)); } catch (_) {}
  }
  function etatDe(cle) {
    if (!ETAT.parcours[cle]) ETAT.parcours[cle] = { prealable: {}, donnees: {}, etapes: {} };
    var p = ETAT.parcours[cle];
    if (!p.prealable) p.prealable = {};
    if (!p.donnees) p.donnees = {};
    if (!p.etapes) p.etapes = {};
    return p;
  }

  var PROFIL = {};
  function lireProfil() {
    try {
      var p = JSON.parse(localStorage.getItem(CLE_PROFIL) || "null");
      if (!p || typeof p !== "object") return {};
      /* On accepte les noms qu'emploient les autres pages : documents.html lit
         « denomination », audit-social lit « entreprise » ou « nom ». */
      if (!p.denomination) p.denomination = p.denominationSociale || p.entreprise || p.nom || "";
      if (!p.conventionCollective) p.conventionCollective = p.convention || p.idcc || "";
      if (!p.secteur) p.secteur = p.activite || "";
      return p;
    } catch (_) { return {}; }
  }
  function ecrireProfil() {
    try {
      var ancien = lireProfil();
      for (var k in PROFIL) ancien[k] = PROFIL[k];
      /* « entreprise » est le nom que lisent audit-social.html et le
         générateur de documents : on le tient à jour à côté de
         « denomination », pour que le profil serve partout. */
      ancien.entreprise = PROFIL.denomination || "";
      localStorage.setItem(CLE_PROFIL, JSON.stringify(ancien));
    } catch (_) {}
  }

  /* ================================================================== */
  /* LE FORMULAIRE DE PROFIL                                            */
  /* ================================================================== */
  function champHtml(ch, valeur, prefixe) {
    var id = prefixe + "-" + ch.c.replace(/\./g, "_");
    var aide = ch.aide ? '<p class="aide-champ">' + e(ch.aide) + "</p>" : "";
    var interieur;
    /* Une réponse fermée porte QUATRE valeurs : oui, non, en cours, autre.
       « oui » et « non » concluent. « en cours » et « autre » ne concluent
       jamais : les conditions d'affichage des étapes ne les tiennent ni pour
       un oui ni pour un non — elles rendent alors « indéterminé », donc
       VISIBLE. Une régularisation commencée n'est pas une régularisation
       faite, et l'application ne masque rien sur une réponse nuancée. */
    if (ch.t === "oui-non") {
      var VAL4 = (window.Profil && window.Profil.VALEURS) || ["oui", "non", "en cours", "autre"];
      var vLibre = valeur && VAL4.indexOf(String(valeur)) < 0;
      var vChoisi = vLibre ? "autre" : String(valeur == null ? "" : valeur);
      interieur = '<select id="' + id + '" data-champ="' + e(ch.c) + '"><option value=""></option>' +
        VAL4.map(function (o) {
          return '<option value="' + o + '"' + (vChoisi === o ? " selected" : "") + ">" + o + "</option>";
        }).join("") + "</select>" +
        '<input type="text" id="' + id + '-libre" data-libre="' + e(ch.c) + '" placeholder="précisez" ' +
        'style="margin-top:6px' + (vLibre ? "" : ";display:none") + '" value="' +
        (vLibre ? e(valeur) : "") + '">';
    } else if (ch.t === "select") {
      var connu = (ch.options || []).indexOf(String(valeur)) >= 0;
      interieur = '<select id="' + id + '" data-champ="' + e(ch.c) + '"><option value=""></option>' +
        (ch.options || []).map(function (o) {
          return '<option' + (valeur === o ? " selected" : "") + ">" + e(o) + "</option>";
        }).join("") +
        (ch.autre ? '<option value="__autre"' + (valeur && !connu ? " selected" : "") + ">— autre —</option>" : "") +
        "</select>" +
        (ch.autre ? '<input type="text" id="' + id + '-libre" data-libre="' + e(ch.c) + '" ' +
          'placeholder="précisez" style="margin-top:6px' + (valeur && !connu ? "" : ";display:none") +
          '" value="' + (connu ? "" : e(valeur || "")) + '">' : "");
    } else if (ch.t === "idcc") {
      interieur = '<input id="' + id + '" data-champ="' + e(ch.c) + '" type="text" value="' + e(valeur || "") +
        '" placeholder="numéro IDCC ou intitulé — la liste s\'ouvre à la saisie" autocomplete="off">';
    } else {
      interieur = '<input id="' + id + '" data-champ="' + e(ch.c) + '" type="' + ch.t + '"' +
        (ch.t === "number" ? ' min="0" step="1"' : "") + ' value="' + e(valeur || "") + '">';
    }
    return '<label' + (ch.pleine ? ' class="pleine"' : "") + '><span class="nom">' + e(ch.nom) +
      "</span>" + interieur + aide + "</label>";
  }

  function construireProfil() {
    PROFIL = lireProfil();
    var f = $("form-profil");
    f.innerHTML = "<fieldset><legend>Le profil qui ouvre les parcours</legend>" +
      '<div class="grille">' +
      CHAMPS_PROFIL.map(function (ch) { return champHtml(ch, PROFIL[ch.c], "pr"); }).join("") +
      "</div></fieldset>";

    /* Les saisies libres : le « — autre — » du secteur comme le « autre » des
       réponses fermées alimentent la même valeur — rien ne change pour les
       consommateurs du profil, qui lisent une chaîne. */
    brancherLibres(f, "pr", CHAMPS_PROFIL, majProfil);
    var cc = $("pr-conventionCollective");
    if (cc && window.IDCC && window.IDCC.attacher) window.IDCC.attacher(cc);

    f.addEventListener("input", majProfil);
    f.addEventListener("change", majProfil);
  }

  /* Un menu qui ouvre une saisie libre : « — autre — » des listes, « autre »
     des réponses fermées. Le champ libre est vidé dès qu'on le referme, pour
     qu'une valeur abandonnée ne survive pas à son menu. */
  function brancherLibres(racine, prefixe, champs, apres) {
    champs.forEach(function (ch) {
      var id = prefixe + "-" + String(ch.c).replace(/\./g, "_");
      var sel = racine.querySelector("#" + id.replace(/([^\w-])/g, "\\$1"));
      var libre = racine.querySelector("#" + (id + "-libre").replace(/([^\w-])/g, "\\$1"));
      if (!sel || !libre) return;
      sel.addEventListener("change", function () {
        var ouvert = sel.value === "__autre" || sel.value === "autre";
        libre.style.display = ouvert ? "" : "none";
        if (!ouvert) libre.value = "";
        apres();
      });
      libre.addEventListener("input", apres);
    });
  }
  /* Lire un champ rendu par champHtml : le menu, ou la saisie libre. */
  function valeurChamp(ch, prefixe) {
    var id = prefixe + "-" + String(ch.c).replace(/\./g, "_");
    var el = $(id);
    if (!el) return undefined;
    var v = el.value;
    if ((ch.autre && v === "__autre") || (ch.t === "oui-non" && v === "autre")) {
      var l = $(id + "-libre");
      v = l ? l.value.trim() : "";
    }
    return v;
  }

  function majProfil() {
    CHAMPS_PROFIL.forEach(function (ch) {
      var v = valeurChamp(ch, "pr");
      if (v === undefined) return;
      PROFIL[ch.c] = v;
    });
    ecrireProfil();
    if (ACTIF) rendre();
    majCartes();
  }

  /* ================================================================== */
  /* VISIBILITÉ ET ÉCHÉANCES                                            */
  /* ================================================================== */
  /* `si` rend true (visible), false (masqué), null ou undefined
     (indéterminé — donc visible : l'application ne devine pas). */
  function visible(o, D) {
    if (typeof o.si !== "function") return true;
    var r = o.si(PROFIL, D || {});
    return r === false ? false : true;
  }
  /* Les dates qu'une ÉTAPE consigne ne se demandent pas d'avance.

     Défaut signalé le 31 août 2026 : pour un premier règlement intérieur, la
     page réclamait d'entrée la date du dépôt au greffe, celle des mesures de
     publicité et celle de la communication à l'inspection du travail — trois
     dates d'actes qui n'ont pas encore eu lieu, et qui n'auront lieu qu'aux
     étapes 6, 7 et 8 du parcours qu'on vient d'ouvrir. Demander la date d'une
     chose à faire avant de l'avoir faite est une question sans objet.

     Ces dates se saisissent désormais là où elles se produisent : sur la case
     « étape franchie » de l'étape concernée, qui les reverse au dossier pour
     que les délais se calculent comme avant. Une date d'ENTRÉE — le
     franchissement du seuil, la date d'entrée en vigueur que le règlement
     porte — reste demandée d'avance : elle commande, elle ne consigne pas. */
  function champsConsignes(p) {
    var m = {};
    (p.etapes || []).forEach(function (s) { if (s.champDate) m[s.champDate] = s.id; });
    return m;
  }
  /* Report des dates consignées vers le dossier, et retour : une étape déjà
     datée dans le dossier retrouve sa date à la réouverture. */
  function reverserDates(p, st, D) {
    (p.etapes || []).forEach(function (s) {
      if (!s.champDate) return;
      var e = st.etapes[s.id];
      if (e && e.le) D[s.champDate] = e.le;
      else if (D[s.champDate]) { st.etapes[s.id] = st.etapes[s.id] || {}; st.etapes[s.id].le = D[s.champDate]; }
      else if (D[s.champDate] !== undefined) D[s.champDate] = "";
    });
  }
  function donneesVisibles(p, D) {
    var consignes = champsConsignes(p);
    return p.donnees.filter(function (c) { return !consignes[c.c] && visible(c, D); });
  }
  /* Une donnée masquée est VIDÉE — c'est la règle du dépôt (audit-form.js) :
     un champ sans objet doit être traité comme une donnée absente, jamais comme
     une donnée fantôme qui continuerait à faire courir un délai. */
  function viderMasquees(p, D) {
    p.donnees.forEach(function (c) {
      if (!visible(c, D) && D[c.c]) D[c.c] = "";
    });
  }
  function prealableVisible(p, D) {
    return p.prealable.filter(function (i) { return visible(i, D); });
  }
  function etapesVisibles(p, D) {
    return p.etapes.filter(function (s) { return visible(s, D); });
  }

  /* Une étape est « en retard » quand son échéance est passée et qu'elle
     n'est pas cochée. Une étape sans échéance calculable n'est jamais en
     retard : on ne reproche pas une date qu'on n'a pas. */
  function etatEtape(etape, D, ent) {
    var faite = !!(ent && ent.fait);
    var ech = null;
    if (typeof etape.quand === "function") {
      try { ech = etape.quand(D, PROFIL); } catch (_) { ech = null; }
    }
    var retard = false, proche = false;
    if (!faite && ech && ech.iso) {
      var j = joursEntre(AUJOURDHUI, ech.iso);
      if (j !== null && j < 0) retard = true;
      else if (j !== null && j <= 7) proche = true;
    }
    return { faite: faite, retard: retard, proche: proche, ech: ech };
  }

  /* ================================================================== */
  /* LE LIEN VERS LE DOCUMENT PRÉ-REMPLI                                */
  /* ================================================================== */
  /* documents.html accepte « ?modele=<clé>&pre=<JSON encodé> » : il ouvre
     le modèle et y verse les valeurs. On n'y met que ce que le profil et
     les dates du dossier donnent — jamais une valeur inventée. */
  function lienDoc(doc, D) {
    var v = {};
    try { v = doc.pre ? doc.pre(PROFIL, D) : {}; } catch (_) { v = {}; }
    var propre = {};
    for (var k in v) {
      if (v[k] === undefined || v[k] === null || v[k] === "") continue;
      if (Array.isArray(v[k]) && !v[k].length) continue;
      propre[k] = v[k];
    }
    return "documents.html?modele=" + encodeURIComponent(doc.modele) +
      "&pre=" + encodeURIComponent(JSON.stringify(propre));
  }

  /* ================================================================== */
  /* LE RENVOI VERS JURIS EXPERT                                        */
  /* ================================================================== */
  /* Le partage entre les deux applications de la juriste : celle-ci
     diagnostique et fonde — quelles obligations, quels articles, quelle
     jurisprudence, quelles étapes — et Juris Expert produit le document
     final, complet et prêt à imprimer. Une étape qui appelle une pièce que
     Juris Expert fabrique porte donc `jx: "<clé>"`, et le lien s'affiche à
     côté du modèle interne, jamais à sa place : le modèle montre la
     structure et l'article, l'outil donne la feuille à signer.

     La table des outils vit dans docs/juris-expert.js. Si elle n'est pas
     chargée, rien ne s'affiche et rien ne casse — aucune étape ne dépend de
     ce renvoi. */
  function jxDispo(cle) {
    return !!(cle && window.JurisExpert && window.JurisExpert.existe(cle));
  }
  function lienJX(cle, libelle) {
    return jxDispo(cle) ? window.JurisExpert.ancre(cle, libelle) : "";
  }

  /* ================================================================== */
  /* LE RENDU                                                            */
  /* ================================================================== */
  var ACTIF = null;

  function construireCartes() {
    $("cartes").innerHTML = PARCOURS.map(function (p) {
      return '<button type="button" class="carte" id="carte-' + p.cle + '" role="tab">' +
        "<b>" + e(p.nom) + '</b><span class="res">' + e(p.resume) + "</span>" +
        '<span class="avance" id="avance-' + p.cle + '"></span></button>';
    }).join("");
    PARCOURS.forEach(function (p) {
      $("carte-" + p.cle).addEventListener("click", function () { choisir(p); });
    });
    majCartes();
  }

  function compter(p) {
    var st = etatDe(p.cle), D = st.donnees;
    var etapes = etapesVisibles(p, D);
    var faites = 0, retards = 0;
    etapes.forEach(function (s) {
      var x = etatEtape(s, D, st.etapes[s.id]);
      if (x.faite) faites++;
      if (x.retard) retards++;
    });
    var items = prealableVisible(p, D);
    var coches = items.filter(function (i) { return st.prealable[i.id]; }).length;
    return { total: etapes.length, faites: faites, retards: retards,
      items: items.length, coches: coches };
  }

  function majCartes() {
    PARCOURS.forEach(function (p) {
      var c = compter(p), el = $("avance-" + p.cle);
      if (!el) return;
      var cl = "avance";
      var txt;
      if (!c.faites && !c.coches) txt = "non commencé";
      else if (c.faites === c.total && c.total) { txt = "terminé — " + c.total + " étapes"; cl += " fini"; }
      else txt = c.faites + " / " + c.total + " étapes";
      if (c.retards) { txt += " · " + c.retards + " en retard"; cl = "avance retard"; }
      el.className = cl;
      el.textContent = txt;
    });
  }

  function choisir(p) {
    ACTIF = p;
    [].slice.call(document.querySelectorAll(".carte")).forEach(function (b) {
      b.classList.toggle("actif", b.id === "carte-" + p.cle);
    });
    rendre();
    $("outils").style.display = "flex";
    $("recap").style.display = "none";
    /* Un parcours choisi, on est là pour la procédure : la présentation, la
       fiche client et les quinze vignettes se replient derrière une barre
       d'une ligne, et l'écran s'ouvre sur les étapes. Deux boutons les
       rouvrent — changer de parcours, modifier la fiche. */
    replier(p);
    $("zone-etapes").scrollIntoView({ block: "start" });
  }

  function replier(p) {
    $("bloc-intro").hidden = true;
    if ($("chapo")) $("chapo").hidden = true;
    $("barre-parcours").hidden = false;
    $("bp-nom").textContent = p.nom;
    var bits = [];
    if (PROFIL.denomination) bits.push(PROFIL.denomination);
    var eff = PROFIL.effectif != null ? parseInt(PROFIL.effectif, 10) : null;
    if (eff != null && !isNaN(eff)) bits.push(eff + " salarié" + (eff > 1 ? "s" : ""));
    if (PROFIL.secteur) bits.push(PROFIL.secteur);
    $("bp-ent").textContent = bits.join(" · ");
  }
  function deplier(ancre) {
    $("bloc-intro").hidden = false;
    if ($("chapo")) $("chapo").hidden = false;
    $("barre-parcours").hidden = true;
    var c = $(ancre);
    if (c) c.scrollIntoView({ block: "start" });
  }

  function rendre() {
    var p = ACTIF; if (!p) return;
    var st = etatDe(p.cle), D = st.donnees;
    reverserDates(p, st, D);
    viderMasquees(p, D);

    /* --- le préalable --- */
    var items = prealableVisible(p, D);
    $("zone-prealable").innerHTML = '<h2 class="titre-zone">Ce qu\'il faut avoir réuni — ' + e(p.nom) + "</h2>" +
      '<p class="aide">Ce qu\'il faut avoir réuni avant d\'engager la procédure. Cochez ce que vous ' +
      'avez ; ce qui reste décoché est repris ci-dessous, nommément.</p>' +
      '<div class="prealable">' +
      items.map(function (i) {
        var g = i.g === "pièce" ? "piece" : (i.g === "document" ? "doc" : "");
        return '<label class="item"><input type="checkbox" data-prea="' + e(i.id) + '"' +
          (st.prealable[i.id] ? " checked" : "") + '><span class="txt">' +
          '<span class="genre ' + g + '">' + e(i.g) + "</span><b>" + e(i.nom) + "</b>" +
          (i.aide ? '<p class="aide-champ">' + e(i.aide) + "</p>" : "") + "</span></label>";
      }).join("") + "</div><div id=\"bloc-manque\"></div>";
    /* Cocher une case ne reconstruit PAS la liste : elle serait détachée du
       document sous les doigts de l'utilisateur, et le focus perdu. Seuls les
       blocs qui dépendent de la coche sont refaits. */
    [].slice.call($("zone-prealable").querySelectorAll("[data-prea]")).forEach(function (x) {
      x.addEventListener("change", function () {
        st.prealable[x.getAttribute("data-prea")] = x.checked;
        enregistrer(); majEtats(); majCartes();
      });
    });

    /* --- les dates du dossier --- */
    var champs = donneesVisibles(p, D);
    $("zone-dates").innerHTML = '<h2 class="titre-zone">Les dates du dossier</h2>' +
      '<p class="aide">Quelques données seulement — celles dont les délais dépendent. Les échéances se ' +
      'recalculent à chaque saisie ; une date dépassée est signalée en rouge.</p>' +
      '<form id="form-donnees" autocomplete="off"><fieldset><legend>' + e(p.nom) + "</legend>" +
      '<div class="grille">' +
      champs.map(function (c) { return champHtml(c, D[c.c], "dn"); }).join("") +
      "</div></fieldset></form>";
    var fd = $("form-donnees");
    function majDonnees() {
      champs.forEach(function (c) {
        var v = valeurChamp(c, "dn");
        if (v !== undefined) D[c.c] = v;
      });
      enregistrer(); rendre(); majCartes();
    }
    /* Une donnée peut masquer des étapes et changer des délais : là, le rendu
       complet s'impose. Sur un champ texte, on attend qu'il perde le focus —
       reconstruire à chaque frappe le lui ferait perdre. */
    fd.addEventListener("change", majDonnees);
    /* La saisie libre d'un « autre » ne déclenche pas « change » à chaque
       frappe : on la branche comme sur le profil, mais sans rendu complet —
       il ferait perdre le focus. */
    champs.forEach(function (c) {
      if (c.t !== "oui-non" && !c.autre) return;
      var l = $("dn-" + String(c.c).replace(/\./g, "_") + "-libre");
      var s = $("dn-" + String(c.c).replace(/\./g, "_"));
      if (!l || !s) return;
      s.addEventListener("change", function () {
        var ouvert = s.value === "__autre" || s.value === "autre";
        l.style.display = ouvert ? "" : "none";
        if (!ouvert) l.value = "";
      });
      l.addEventListener("blur", majDonnees);
    });

    /* --- la progression --- */
    $("zone-progression").innerHTML = '<h2 class="titre-zone">Où vous en êtes</h2>' +
      '<div class="progression" id="bloc-progression"></div>';

    /* --- les étapes --- */
    var etapes = etapesVisibles(p, D);
    /* L'ENCHAÎNEMENT. Répondre « non » à l'audit veut dire « on le fait
       ensemble » : la page ne déroule donc pas onze étapes à plat, elle en
       met UNE en avant — la première qui reste à faire — et replie les
       autres. On coche, l'étape suivante s'ouvre d'elle-même, et ainsi
       jusqu'à la dernière, où la situation est régularisée. Une étape repliée
       n'est pas cachée : son titre reste, et un clic l'ouvre — on doit
       pouvoir lire la suite avant d'y arriver, ou revenir sur ce qui est
       fait. */
    var iCourante = -1;
    etapes.forEach(function (s, k) {
      if (iCourante < 0 && !etatEtape(s, D, st.etapes[s.id]).faite) iCourante = k;
    });
    var toutFait = iCourante < 0 && etapes.length > 0;
    var n = 0;
    $("zone-etapes").innerHTML = '<h2 class="titre-zone">La procédure, étape par étape</h2>' +
      '<p class="aide">Dans l\'ordre. Chaque étape porte l\'article qui la fonde — numéro <i>et</i> ' +
      'identifiant de version —, la jurisprudence lorsqu\'elle l\'éclaire, le délai calculé depuis vos ' +
      'dates, et le document à produire.</p>' +
      etapes.map(function (s) {
        n++;
        var x = etatEtape(s, D, st.etapes[s.id]);
        var ech = "";
        if (x.ech) {
          var ce = "echeance" + (x.retard ? " retard" : (x.proche ? " proche" : ""));
          ech = '<div class="' + ce + '">' + e(x.ech.libelle) +
            (x.retard ? " — échéance dépassée" : (x.proche ? " — échéance proche" : "")) + "</div>" +
            (x.ech.note ? '<p class="aide-champ" style="margin:-4px 0 9px">' + e(x.ech.note) + "</p>" : "");
        }
        var fond = (s.fond || []).length
          ? '<p class="fondement"><b>Fondement</b> — code du travail, ' +
            s.fond.map(function (a) {
              return "art. " + refArt(a) + ' <span class="ident">' + TEXTES[a].id + "</span> : " + e(TEXTES[a].quoi);
            }).join(" ; ") + ".</p>"
          : "";
        var juris = (s.juris || []).map(function (j) {
          return '<div class="juris"><b>' + e(JURIS[j].d) + "</b> <i>(" + e(JURIS[j].p) + ")</i><br>" +
            e(JURIS[j].t) + "</div>";
        }).join("");
        var cv = s.conv ? '<div class="conv">' + e(conv(PROFIL, s.conv)) + "</div>" : "";
        /* Ce qu'on risque à ne pas franchir l'étape — la peine quand un texte
           en prévoit une, la conséquence civile sinon. Jamais inventé : une
           étape sans sanction connue n'affiche rien. */
        var rq = s.risque
          ? '<div class="risque"><b>Ce qu\'on risque à ne pas le faire</b>' + e(s.risque) + "</div>"
          : "";
        /* Le conseil de pratique : ce qui se fait, se date et se garde. Ce
           n'est pas du droit — c'est ce qui fait qu'on peut le prouver. */
        var cs = s.conseil
          ? '<div class="conseil"><b>En pratique</b>' + e(s.conseil) + "</div>"
          : "";
        /* UN SEUL BOUTON PAR ÉTAPE. Le modèle d'abord ; une fois qu'on l'a
           ouvert, « C'est fait » — qui coche, date du jour et ouvre la
           suivante. Le lien vers le générateur de documents et celui vers
           Juris Expert descendent dans le repli : ce sont des chemins de
           côté, pas l'action de l'étape. Demande du 31 août 2026 : des
           boutons simples, un seul à la fois, un seul écran. */
        var vu = !!(st.etapes[s.id] || {}).vu;
        var doc = s.doc ? '<a class="doc" href="' + e(lienDoc(s.doc, D)) + '">Produire : ' +
          e(s.doc.nom) + " →</a>" : "";
        /* Le courrier type que l'application sait écrire elle-même — lettre de
           dépôt au greffe, transmission à l'inspecteur du travail, attestation
           de publicité, avenant, ordre du jour. Les générateurs pèsent lourd :
           ils ne sont chargés qu'au clic (voir produireCourrier). */
        var unique = (s.docProduit && !vu && !x.faite)
          ? '<button type="button" class="agir" data-courrier="' + e(s.docProduit) +
            '">' + e(s.action || "Le modèle, à compléter") + " →</button>"
          : '<button type="button" class="agir" data-fait="' + e(s.id) + '">' +
            (x.faite ? "Revenir sur cette étape" : "C'est fait →") + "</button>";
        /* Le document final, quand c'est Juris Expert qui l'imprime. */
        var jx = lienJX(s.jx, jxDispo(s.jx)
          ? "Document final : " + window.JurisExpert.nom(s.jx) + " (Juris Expert)"
          : "");
        var rang = n - 1;
        var classe = rang === iCourante ? " courante" : (rang < iCourante || toutFait ? " close faite-repliee" : " close");
        return '<div class="etape' + classe + '" data-bloc="' + e(s.id) + '" data-rang="' + rang +
          '" id="etape-' + p.cle + "-" + s.id + '">' +
          '<div class="etape-tete"><span class="etape-num">' + n + "</span>" +
          '<span class="etape-titre">' + e(s.nom) + "</span>" +
          /* Sur l'étape courante, « à faire maintenant » remplace le badge
             d'état : les deux côte à côte disaient deux fois la même chose. */
          (rang === iCourante ? '<span class="maintenant">à faire maintenant</span>'
                              : '<span class="etat"></span>') + "</div>" +
          /* L'ACTION D'ABORD. On ouvre une étape pour la faire, pas pour lire
             ce qui la fonde : le modèle à compléter, la case à cocher et la
             date viennent en tête ; le texte, l'article, la jurisprudence, la
             sanction et le conseil viennent après, pour qui veut savoir
             pourquoi. Défaut vu le 31 août 2026 : « Faire le règlement
             intérieur » ouvrait sur un paragraphe de droit, le bouton du
             modèle enterré sous la jurisprudence. */
          '<div class="etape-corps">' + ech +
          '<div class="actions">' + unique + "</div>" +
          (x.faite
            ? '<p class="fait-le">Faite le <input class="date-fait" type="date" data-etape-date="' +
              e(s.id) + '" value="' + e((st.etapes[s.id] || {}).le || "") +
              '" aria-label="Date de réalisation"></p>'
            : "") +
          /* LE VERRE D'EAU, PAS LE COURS SUR L'EAU. Ce qui fonde l'étape —
             le texte, l'article et son identifiant de version, l'arrêt, la
             sanction encourue, le conseil de pratique — ne disparaît pas :
             il se replie. Qui veut savoir pourquoi ouvre la ligne ; qui veut
             faire, fait. Reproche du 31 août 2026, et il était juste. */
          '<details class="pourquoi"><summary>Pourquoi, et ce qu\'on risque</summary>' +
          "<p>" + e(s.quoi) + "</p>" + fond + juris + cv + rq + cs +
          (doc || jx ? '<div class="actions">' + doc + jx + "</div>" : "") +
          "</details></div></div>";
      }).join("") +
      /* LA VALIDATION TOTALE. La dernière étape franchie, la procédure est
         allée à son terme : la page le dit, et propose le récapitulatif
         imprimable — c'est la pièce qui établira, le jour venu, que la
         régularisation a été conduite, étape par étape et date par date. */
      (toutFait
        ? '<div class="fini"><b>Situation régularisée — ' + e(p.nom) + "</b>" +
          "<p>Les " + etapes.length + " étapes de cette procédure sont franchies. Le récapitulatif " +
          "imprimable reprend chacune d'elles, sa date et son fondement : gardez-le au dossier." +
          (p.audit ? " L'audit correspondant peut maintenant être repris — il contrôlera sur pièces " +
            "ce que vous venez de déclarer." : "") + "</p>" +
          '<div class="fini-actions"><button type="button" id="fini-recap">Le récapitulatif à imprimer</button>' +
          (p.audit ? '<a href="' + e(p.audit.href) + '?revoir=1">Reprendre ' + e(p.audit.nom) + " →</a>" : "") +
          (p.suite && SUITE(p.suite.cle)
            ? '<a href="parcours.html?p=' + e(p.suite.cle) + '">Enchaîner sur « ' +
              e(SUITE(p.suite.cle).nom) + " » →</a>" : "") +
          "</div></div>"
        : "");
    var btnFini = $("zone-etapes").querySelector("#fini-recap");
    if (btnFini) btnFini.addEventListener("click", function () { recap(); });
    [].slice.call($("zone-etapes").querySelectorAll("[data-fait]")).forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-fait");
        if (!st.etapes[id]) st.etapes[id] = {};
        st.etapes[id].fait = !st.etapes[id].fait;
        if (st.etapes[id].fait && !st.etapes[id].le) st.etapes[id].le = AUJOURDHUI;
        reverserDates(p, st, D);
        enregistrer(); rendre(); majCartes();
        /* L'étape franchie déclenche la suivante : elle s'ouvre, et on y va. */
        var suivante = $("zone-etapes").querySelector(".etape.courante");
        if (suivante) suivante.scrollIntoView({ behavior: "smooth", block: "start" });
        else { var fin = $("zone-etapes").querySelector(".fini"); if (fin) fin.scrollIntoView({ behavior: "smooth", block: "start" }); }
        return;
      });
    });
    /* Un clic sur le bandeau ouvre ou referme l'étape : rien n'est verrouillé,
       on peut lire la suite avant d'y arriver et rouvrir ce qui est fait. */
    [].slice.call($("zone-etapes").querySelectorAll(".etape-tete")).forEach(function (t) {
      t.addEventListener("click", function (ev) {
        if (ev.target.closest("a,button,input,label")) return;
        t.parentNode.classList.toggle("close");
      });
    });
    [].slice.call($("zone-etapes").querySelectorAll("[data-courrier]")).forEach(function (x) {
      x.addEventListener("click", function () {
        /* Le modèle ouvert, l'étape a été engagée : à la fermeture, le bouton
           devient « C'est fait ». On ne demande pas deux fois la même chose. */
        var bloc = x.closest(".etape");
        var ide = bloc && bloc.getAttribute("data-bloc");
        if (ide) { st.etapes[ide] = st.etapes[ide] || {}; st.etapes[ide].vu = true; enregistrer(); }
        produireCourrier(x.getAttribute("data-courrier"), x);
      });
    });
    [].slice.call($("zone-etapes").querySelectorAll("[data-etape-date]")).forEach(function (x) {
      x.addEventListener("change", function () {
        var id = x.getAttribute("data-etape-date");
        if (!st.etapes[id]) st.etapes[id] = {};
        st.etapes[id].le = x.value;
        /* Une étape qui consigne une date du dossier la reverse : c'est la
           même date, saisie là où elle se produit. Les échéances des étapes
           suivantes se recalculent aussitôt. */
        reverserDates(p, st, D);
        enregistrer(); rendre(); majCartes();
        return;
      });
    });

    majEtats();
  }

  /* Le rafraîchissement léger : ce qui dépend d'une coche, et rien d'autre.
     Les listes et les champs restent en place — une case qu'on coche ne doit
     pas disparaître du document sous le doigt qui la coche. */
  function majEtats() {
    var p = ACTIF; if (!p) return;
    var st = etatDe(p.cle), D = st.donnees;

    var items = prealableVisible(p, D);
    var manquants = items.filter(function (i) { return !st.prealable[i.id]; });
    var bm = $("bloc-manque");
    if (bm) bm.innerHTML = manquants.length
      ? '<div class="manque"><b>Ce qui manque — ' + manquants.length + " élément(s) sur " + items.length + " :</b><ul>" +
        manquants.map(function (i) { return "<li>" + e(i.nom) + " <i>(" + e(i.g) + ")</i></li>"; }).join("") +
        "</ul></div>"
      : '<div class="pret">Tout est réuni : la procédure peut être engagée.</div>';

    etapesVisibles(p, D).forEach(function (s) {
      var bloc = $("zone-etapes").querySelector('[data-bloc="' + s.id + '"]');
      if (!bloc) return;
      var x = etatEtape(s, D, st.etapes[s.id]);
      /* Réécrire la classe entière effaçait l'enchaînement posé au rendu —
         l'étape courante, celles qui sont repliées, celle qu'un clic vient
         d'ouvrir. On ne touche donc qu'aux deux classes d'état. */
      bloc.classList.toggle("faite", !!x.faite);
      bloc.classList.toggle("retard", !!x.retard);
      var badge = bloc.querySelector(".etat");
      if (badge) {
        badge.className = "etat" + (x.faite ? " faite" : (x.retard ? " retard" : ""));
        badge.textContent = x.faite ? "faite" : (x.retard ? "en retard" : "à faire");
      }
    });

    var c = compter(p);
    var pct = c.total ? Math.round(100 * c.faites / c.total) : 0;
    var bp = $("bloc-progression");
    if (bp) bp.innerHTML = '<div class="compte"><b>' + c.faites + " étape(s) franchie(s) sur " +
      c.total + "</b> — " + pct + " %" +
      (c.retards ? ' · <span class="r">' + c.retards + " en retard</span>" : "") +
      (c.items ? " · préalable : " + c.coches + " / " + c.items : "") + "</div>" +
      '<div class="barre-fond"><div class="barre-part" style="width:' + pct + '%"></div></div>';

    /* Ce qui accompagne la procédure sans en faire partie — où l'avancement
       est gardé, où s'imprime le document final, et le parcours qui vient
       après — est écrit SOUS les étapes, pas au-dessus : on ouvre cette page
       pour la procédure, on lit le reste quand on l'a parcourue. */
    var zs = $("zone-suite");
    if (zs) zs.innerHTML =
      '<div class="compte">L\'avancement est enregistré sur ce poste : vous le retrouverez à la ' +
      'réouverture de la page.' + (p.audit ? ' Pour contrôler l\'existant, ouvrez <a href="' +
      e(p.audit.href) + '?revoir=1">' + e(p.audit.nom) + "</a>." : "") + "</div>" +
      (jxDispo(p.jx)
        ? '<div class="renvoi-jx">Les documents finaux de ce parcours — ' +
          e(window.JurisExpert.quoi(p.jx)) + ' — se génèrent, complets et prêts à imprimer, dans ' +
          '<a class="jx" href="' + e(window.JurisExpert.lien(p.jx)) + '" target="_blank" ' +
          'rel="noopener">Juris Expert — ' + e(window.JurisExpert.nom(p.jx)) + "</a>.</div>"
        : "") +
      (p.cle === "installation" && jxDispo("elections")
        ? '<div class="renvoi-jx">Ce parcours commence <b>après</b> la proclamation des résultats. ' +
          "Les élections elles-mêmes — " + e(window.JurisExpert.quoi("elections")) + " — se " +
          'conduisent dans <a class="jx" href="' + e(window.JurisExpert.lien("elections")) +
          '" target="_blank" rel="noopener">Juris Expert — ' +
          e(window.JurisExpert.nom("elections")) + "</a>.</div>"
        : "") +
      (p.suite && SUITE(p.suite.cle)
        ? '<div class="suite' + (c.total && c.faites >= c.total ? " prete" : "") + '">' +
          "<b>" + (c.total && c.faites >= c.total
            ? "Ce parcours est terminé — la suite : « " + e(SUITE(p.suite.cle).nom) + " »"
            : "Ensuite : « " + e(SUITE(p.suite.cle).nom) + " »") + "</b>" +
          "<p>" + e(p.suite.pourquoi) + "</p>" +
          '<a href="parcours.html?p=' + e(p.suite.cle) + '">Ouvrir « ' +
          e(SUITE(p.suite.cle).nom) + " » →</a></div>"
        : "");
  }

  function SUITE(cle) {
    return PARCOURS.filter(function (x) { return x.cle === cle; })[0] || null;
  }

  /* ================================================================== */
  /* LE COURRIER TYPE                                                   */
  /*                                                                    */
  /* L'application sait écrire, pour chacun de ses contrôles, le        */
  /* document qui le régularise : la lettre de dépôt au greffe, celle   */
  /* de transmission à l'inspecteur du travail en deux exemplaires,     */
  /* l'attestation de publicité, l'avenant, l'ordre du jour du comité.  */
  /* Ces générateurs vivent dans docs/documents-*.js et pèsent ensemble */
  /* près d'un mégaoctet : la page ne les charge qu'au premier clic, et */
  /* seulement ceux du module concerné. Un téléphone qui consulte un    */
  /* parcours ne télécharge rien tant qu'il ne demande pas de courrier. */
  /* ================================================================== */
  var FICHIERS = {
    DIS: ["documents-produits.js", "documents-discipline.js", "documents-discipline-2.js"],
    SST: ["documents-produits.js", "documents-sst.js", "documents-sst-2.js"],
    CSE: ["documents-produits.js", "documents-cse.js", "documents-cse-2.js", "documents-cse-3.js"],
    BDESE: ["documents-produits.js", "documents-bdese.js"],
    NAO: ["documents-produits.js", "documents-nao.js"],
    PSE: ["documents-produits.js", "documents-pse.js"],
  };
  var charges = {};
  function charger(liste, quand) {
    var reste = liste.filter(function (f) { return !charges[f]; });
    if (!reste.length) return quand();
    var n = reste.length, echec = false;
    reste.forEach(function (f) {
      var sc = document.createElement("script");
      sc.src = f;
      sc.onload = function () { charges[f] = true; if (!--n && !echec) quand(); };
      sc.onerror = function () { echec = true; quand(new Error(f)); };
      document.head.appendChild(sc);
    });
  }
  /* CE QUI EST À VOUS. Le courrier produit n'est pas une pièce à lire : c'est
     un projet à compléter, à couper, à enrichir de vos clauses. Ce que
     l'utilisateur en fait est conservé sur son poste, par parcours et par
     document, et lui revient tel quel à la réouverture. « Revenir au modèle »
     rétablit le texte d'origine — le sien est alors effacé, et il en est
     averti avant. */
  var COURRIER = null;
  var CLE_COURRIERS = "parcours-courriers";
  function tousCourriers() {
    try { return JSON.parse(localStorage.getItem(CLE_COURRIERS) || "{}") || {}; } catch (_) { return {}; }
  }
  function cleCourrier(id) { return (ACTIF ? ACTIF.cle : "?") + "/" + id; }
  function lireCourrier(id) {
    var c = tousCourriers()[cleCourrier(id)];
    return c && typeof c.texte === "string" ? c.texte : null;
  }
  function dateCourrier(id) {
    var c = tousCourriers()[cleCourrier(id)];
    return c ? c.le : "";
  }
  function ecrireCourrier(id, texte) {
    var t = tousCourriers();
    if (texte == null) delete t[cleCourrier(id)];
    else t[cleCourrier(id)] = { texte: texte, le: AUJOURDHUI };
    try { localStorage.setItem(CLE_COURRIERS, JSON.stringify(t)); } catch (_) {}
  }
  function etatCourrier(txt) { var e = $("dt-etat"); if (e) e.textContent = txt || ""; }

  function produireCourrier(id, bouton) {
    var famille = String(id).split("-")[0];
    var liste = FICHIERS[famille];
    if (!liste) return;
    var libelle = bouton ? bouton.textContent : "";
    if (bouton) { bouton.disabled = true; bouton.textContent = "Un instant…"; }
    charger(liste, function (err) {
      if (bouton) { bouton.disabled = false; bouton.textContent = libelle; }
      if (err || !window.DocumentsProduits) {
        message("Le générateur de ce courrier n'a pas pu être chargé. Réessayez une fois la page rechargée.");
        return;
      }
      var gen = DocumentsProduits.pour(id);
      if (!gen) { message("Aucun courrier type n'est écrit pour ce point."); return; }
      /* Le générateur attend la fiche d'audit ; ici nous n'avons que le profil
         et les dates du parcours. Ce qui manque sort entre crochets dans le
         texte produit — visible, jamais inventé : c'est la règle des
         générateurs eux-mêmes. */
      var st = ACTIF ? etatDe(ACTIF.cle) : { donnees: {} };
      COURRIER = { id: id, nom: gen.nom,
        modele: gen.produire({ profil: PROFIL, fiche: st.donnees || {}, aujourdhui: new Date() }) };
      $("dt-titre").textContent = gen.nom;
      /* La version de l'utilisateur prime sur le modèle : un courrier qu'on a
         complété la semaine dernière se rouvre tel qu'on l'a laissé. */
      var mien = lireCourrier(id);
      $("dt-corps").value = mien != null ? mien : COURRIER.modele;
      etatCourrier(mien != null ? "Votre version, modifiée le " + (dateFr(dateCourrier(id)) || "—") + "." : "");
      var d = $("dlg-courrier");
      if (d.showModal) d.showModal(); else d.setAttribute("open", "open");
    });
  }

  /* ================================================================== */
  /* LE RÉCAPITULATIF IMPRIMABLE                                        */
  /* ================================================================== */
  function recap() {
    var p = ACTIF; if (!p) return;
    var st = etatDe(p.cle), D = st.donnees;
    var items = prealableVisible(p, D), etapes = etapesVisibles(p, D);
    var manquants = items.filter(function (i) { return !st.prealable[i.id]; });
    var c = compter(p);
    var articles = {}, n = 0;

    var lignes = etapes.map(function (s) {
      n++;
      var x = etatEtape(s, D, st.etapes[s.id]);
      (s.fond || []).forEach(function (a) { articles[a] = true; });
      var etat = x.faite ? "faite le " + (dateFr((st.etapes[s.id] || {}).le) || "—")
        : (x.retard ? '<span class="en-retard">en retard</span>' : "à faire");
      return "<tr><td>" + n + "</td><td>" + e(s.nom) + "<br><span style='font-size:12px;color:#666'>" +
        (s.fond || []).map(refArt).join(" · ") + "</span></td><td>" +
        (x.ech ? e(x.ech.libelle) : "—") + "</td><td>" + etat + "</td></tr>";
    }).join("");

    var donnees = donneesVisibles(p, D).filter(function (ch) { return D[ch.c]; })
      .map(function (ch) {
        var v = D[ch.c];
        if (ch.t === "date") v = dateFr(v);
        return "<tr><th>" + e(ch.nom) + "</th><td>" + e(v) + "</td></tr>";
      }).join("");

    $("feuille-recap").innerHTML =
      '<h2 class="titre-doc">' + e(p.nom) + "</h2>" +
      '<p class="sous-titre">Récapitulatif du parcours — ' +
      e(PROFIL.denomination || "entreprise non renseignée") + " — édité le " + dateFr(AUJOURDHUI) + "</p>" +
      "<h3>Où en est le dossier</h3>" +
      "<p><b>" + c.faites + " étape(s) franchie(s) sur " + c.total + "</b>" +
      (c.retards ? ' — <span class="en-retard">' + c.retards + " étape(s) en retard</span>" : "") +
      ". Préalable : " + c.coches + " élément(s) réuni(s) sur " + items.length + ".</p>" +
      (manquants.length
        ? "<h3>Ce qui manque encore</h3><ul>" +
          manquants.map(function (i) { return "<li>" + e(i.nom) + " (" + e(i.g) + ")</li>"; }).join("") + "</ul>"
        : "<h3>Le préalable est réuni</h3><p>Tous les éléments listés ont été cochés.</p>") +
      (donnees ? "<h3>Les données du dossier</h3><table>" + donnees + "</table>" : "") +
      "<h3>Les étapes</h3>" +
      "<table><tr><th>N°</th><th>Étape et fondement</th><th>Échéance</th><th>État</th></tr>" +
      lignes + "</table>" +
      '<div class="pied-textes"><b>Textes cités, lus à la source — code du travail :</b> ' +
      Object.keys(articles).map(function (a) {
        return "art. " + refArt(a) + ' <span class="ident">' + TEXTES[a].id + "</span>";
      }).join(" · ") +
      ". Lectures des 21 et 22 août 2026 au relais Légifrance, deux lectures espacées concordantes " +
      "chacune, filtre par nom du code et critère de contenu contre les homonymes. " +
      "Ce récapitulatif est produit par l'application Jurisprudence à partir des seules données saisies " +
      "sur ce poste ; il ne constitue pas une consultation juridique et ne se substitue ni au conseil " +
      "d'un avocat, ni à la décision de l'administration ou du juge. L'application ne lit aucune " +
      "convention collective : ce que la vôtre impose en plus de la loi reste à vérifier.</div>";

    $("recap").style.display = "block";
    $("recap").scrollIntoView({ behavior: "smooth", block: "start" });
    message("Récapitulatif produit ci-dessous. « Imprimer / PDF » n'imprime que cette feuille.");
  }

  function message(txt) {
    var m = $("message");
    if (!txt) { m.style.display = "none"; m.textContent = ""; return; }
    m.textContent = txt; m.style.display = "block";
  }

  /* ================================================================== */
  /* MISE EN ROUTE                                                       */
  /* ================================================================== */
  construireProfil();
  construireCartes();

  $("btn-recap").addEventListener("click", recap);
  $("btn-imprimer").addEventListener("click", function () {
    if ($("recap").style.display !== "block") recap();
    window.print();
  });
  $("btn-vider").addEventListener("click", function () {
    if (!ACTIF) return;
    delete ETAT.parcours[ACTIF.cle];
    enregistrer();
    rendre(); majCartes();
    $("recap").style.display = "none";
    message("Ce parcours a été réinitialisé. Les autres parcours et le profil sont intacts.");
  });
  /* La saisie est enregistrée au fil de la frappe — pas de bouton
     « enregistrer » à oublier. */
  $("dt-corps").addEventListener("input", function () {
    if (!COURRIER) return;
    var t = $("dt-corps").value;
    if (t === COURRIER.modele) { ecrireCourrier(COURRIER.id, null); etatCourrier(""); return; }
    ecrireCourrier(COURRIER.id, t);
    etatCourrier("Vos modifications sont enregistrées sur ce poste.");
  });
  $("dt-modele").addEventListener("click", function () {
    if (!COURRIER) return;
    if ($("dt-corps").value !== COURRIER.modele &&
        !confirm("Revenir au modèle effacera ce que vous avez écrit dans ce courrier. Continuer ?")) return;
    $("dt-corps").value = COURRIER.modele;
    ecrireCourrier(COURRIER.id, null);
    etatCourrier("Texte d'origine rétabli.");
  });
  $("dt-fermer").addEventListener("click", function () { $("dlg-courrier").close(); });
  /* Le modèle refermé, l'étape se redessine : son bouton dit maintenant
     « C'est fait ». */
  $("dlg-courrier").addEventListener("close", function () { if (ACTIF) rendre(); });
  $("dt-imprimer").addEventListener("click", function () {
    /* Sans cette classe, l'impression sortirait le récapitulatif du parcours,
       que la feuille de style d'impression est seule à laisser passer. */
    document.body.classList.add("print-courrier");
    window.print();
    document.body.classList.remove("print-courrier");
  });
  $("dt-copier").addEventListener("click", function () {
    if (navigator.clipboard) navigator.clipboard.writeText($("dt-corps").value);
    etatCourrier("Copié.");
  });
  $("bp-changer").addEventListener("click", function () { deplier("cartes"); });
  $("bp-fiche").addEventListener("click", function () { deplier("zone-profil"); });
  $("btn-retour").addEventListener("click", function () {
    if (history.length > 1 && document.referrer &&
        new URL(document.referrer, location.href).origin === location.origin) history.back();
    else location.href = "./";
  });

  /* « parcours.html?p=sanction » ouvre directement un parcours : c'est le
     lien que posent l'agenda et les pages d'audit. */
  var demande = new URLSearchParams(location.search).get("p");
  var vise = PARCOURS.filter(function (p) { return p.cle === demande; })[0];
  if (vise) choisir(vise);

  /* « &faire=1 » — on vient de l'audit, où l'on a répondu que la pièce
     n'existe pas. On n'ouvre pas la procédure pour la lire : le document se
     produit tout de suite, et l'on est dedans. C'est la première étape non
     franchie qui porte un modèle qui décide — les étapes de vérification qui
     la précèdent n'en portent pas, elles ne retiennent donc personne. */
  if (vise && new URLSearchParams(location.search).get("faire")) {
    var st0 = etatDe(vise.cle);
    var aFaire = etapesVisibles(vise, st0.donnees).filter(function (s) {
      return s.docProduit && !etatEtape(s, st0.donnees, st0.etapes[s.id]).faite;
    })[0];
    if (aFaire) {
      st0.etapes[aFaire.id] = st0.etapes[aFaire.id] || {};
      st0.etapes[aFaire.id].vu = true;
      enregistrer();
      produireCourrier(aFaire.docProduit, null);
    }
  }

  if ("serviceWorker" in navigator)
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js"); });
})();

