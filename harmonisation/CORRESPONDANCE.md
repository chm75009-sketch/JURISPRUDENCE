# Les deux référentiels, item par item — JURISPRUDENCE (A) et Juris Expert (B)

Relevé du 23 août 2026. **A** = `moteur/social/referentiel-social.js` de ce
dépôt, **41 obligations** avant enrichissement ; **B** = `AUS_OBLIG` de
`index.html` du dépôt `juriste-expert-` (commit `47240ad`), **145 items**.

La comparaison ne se fait pas au nombre : A tient un *chapeau* dont les
matières détaillées partent dans huit modules dédiés (comité, base de données,
négociation, santé-sécurité, discipline, licenciement économique, plan de
sauvegarde de l'emploi). Un item de B peut donc être « couvert par A » sans
figurer dans les 41 obligations du chapeau. La table distingue les deux cas.

## 1. Le compte

| | items |
|---|---|
| Items de B couverts par une obligation du chapeau de A | **42** (↔ 34 des 41 obligations de A) |
| Items de B couverts par un module dédié de A, hors chapeau | **28** |
| Items de B sans équivalent nulle part dans A — **propres à B** | **75** |
| Obligations de A sans équivalent dans B — **propres à A** | **7** |
| Parcours guidés communs | **6** |
| Parcours propres à A | **6** |
| Parcours propres à B | **0** |

## 2. Référentiels — table de correspondance

### 2.1 Commun (obligation du chapeau de A ↔ item de B)

| Obligation de A | Item(s) de B |
|---|---|
| `SOC-INS-CSE` — CSE : mise en place et élections | `cse` |
| `SOC-INS-CSE-ETAB` — CSE central et d'établissement | `csecentral` |
| `SOC-INS-CSSCT` — commission santé-sécurité | `cssct` |
| `SOC-INS-COMMISSIONS` — formation, logement, égalité | `cformation`, `clogement`, `cegalite` |
| `SOC-INS-COMMISSION-ECO` — commission économique | `ceco` |
| `SOC-INS-COMMISSION-MARCHES` — commission des marchés | `cmarches` |
| `SOC-INS-FORMATION-ELUS` — formation santé-sécurité des élus | `formelus` |
| `SOC-INS-REUNIONS-SST` — quatre réunions annuelles | `reunionsst` |
| `SOC-INS-REF-HARCELEMENT` — référent employeur (250) | `ref250` |
| `SOC-DOC-RI` — règlement intérieur | `ri` |
| `SOC-DOC-DUERP` — document unique | `duerp`, `duerpaffich` |
| `SOC-DOC-BDESE` — base de données | `bdese`, `bdeseeg` |
| `SOC-DOC-INDEX` — index d'égalité | `index` |
| `SOC-DOC-OETH` — emploi des travailleurs handicapés | `oeth`, `oethdecl`, `oethcontrib` |
| `SOC-AFF-HARCELEMENT` — information harcèlements | `affich` |
| `SOC-AFF-EGALITE` — information discriminations | `affdiscrim` |
| `SOC-AFF-EGA-REMU` — égalité de rémunération (affichage) | `affegarem` |
| `SOC-AFF-COORDONNEES` — inspection, médecine, secours | `affichcoord` |
| `SOC-AFF-CONSIGNE-INCENDIE` — consigne incendie | `incendie` |
| `SOC-AFF-HORAIRES` — horaire collectif | `horaires` |
| `SOC-AFF-DECOMPTE` — décompte hors horaire collectif | `decompte`, `docduree` |
| `SOC-AFF-CONVENTION` — convention collective | `ccnaffich` |
| `SOC-REG-PERSONNEL` — registre unique du personnel | `registre` |
| `SOC-REG-SECURITE` — registre de sécurité | `verifs`, `conserv` |
| `SOC-REG-DGI` — registre des dangers graves | `dgi` |
| `SOC-NEG-NAO` — négociations obligatoires | `nao` |
| `SOC-SST-SPST` — service de prévention et de santé | `spst` |
| `SOC-SST-VIP` — visite d'information et de prévention | `vip` |
| `SOC-SST-POSTES-RISQUES` — suivi individuel renforcé | `sir` |
| `SOC-SST-FORMATION-SECU` — formation à la sécurité | `formsecu` |
| `SOC-FOR-ENTRETIENS` — entretiens de parcours | `entretien` |
| `SOC-FOR-ADAPTATION` — adaptation au poste | `adaptation` |
| `SOC-EPA-PARTICIPATION` — participation | `participation` |
| `SOC-EPA-SANTE` — complémentaire santé | `mutuelle` |

### 2.2 Couvert par A, mais dans un module dédié (hors chapeau)

| Item de B | Module de A qui le porte |
|---|---|
| `refcse` référent harcèlement du CSE | santé-sécurité (`L2314-1` lu) |
| `consult` trois consultations récurrentes | comité (`L2312-17`) |
| `budgets` budgets du comité | comité (`L2315-61`) |
| `docelec` documentation économique | comité (`L2312-57`) |
| `cselocal`, `csecircul`, `cseaffich` | comité (`L2315-25`, `L2315-14`, `L2315-15`) |
| `cseheures`, `csetemps` heures de délégation | comité (`L2315-9`, `L2315-11`, `R2315-5` à `R2315-7`) |
| `cseodj` ordre du jour | comité (`L2315-30`) |
| `csealerte`, `csealerteco` droits d'alerte | comité (`L2312-59`, `L2312-63`) |
| `csemarche`, `cseprealable`, `csedelai` consultations | comité (`L2312-8`, `L2312-14`, `L2312-15`) |
| `cseponct` consultations ponctuelles | comité (`L2312-37`) |
| `cseexpert` expertise | comité (`L2315-78`, `L2315-80`) |
| `csecomptes` comptes du comité | comité (`L2315-64` à `L2315-69`) |
| `proteges` élus protégés | comité (`L2411-1`, `L2411-5`) |
| `bilansocial` bilan social | comité (`L2312-28`, `L2312-30`) |
| `csergpd` traitements et contrôle de l'activité | comité (`L2312-38`) |
| `consultform` plan de développement des compétences | comité (`L2312-24`, `L2312-26`) |
| `rapportsst` rapport annuel santé-sécurité | santé-sécurité (`L2312-27`) |
| `secugen` neuf principes de prévention | santé-sécurité (`L4121-1`, `L4121-2`) |
| `duerpcse` consultation du CSE sur le DUERP | santé-sécurité (`L4121-3`) |
| `papripact` programme annuel de prévention | santé-sécurité (`L4121-3-1`) |
| `gepp` gestion des emplois et des parcours | négociation obligatoire (`L2242-2`) |
| `deconnexion` droit à la déconnexion | négociation obligatoire (`L2242-17`) |

### 2.3 Propre à A — ce que B ne couvre pas

| Obligation de A | Ce qu'elle porte |
|---|---|
| `SOC-INS-GROUPE` | comité de groupe (`L2331-1`) |
| `SOC-AFF-FUMER` | signalisation interdiction de fumer et de vapoter |
| `SOC-NEG-EGALITE` | couverture égalité : accord **ou** plan d'action unilatéral |
| `SOC-NEG-PSE` | licenciement collectif et plan de sauvegarde de l'emploi, **audité** |
| `SOC-EPA-LIVRET` | livret d'épargne salariale remis à l'embauche (`L3341-6`) |
| `SOC-EPA-PREVOYANCE-CADRES` | prévoyance des cadres (conventionnel, signalé jamais affirmé) |
| `SOC-CCN-OBLIGATIONS` | les autres obligations de la convention collective |

### 2.4 Propre à B — les 75 items absents de tout A

Regroupés par matière ; la dernière colonne dit ce qu'ils sont devenus dans A
après le présent travail.

| Matière | Items de B | Sort dans A |
|---|---|---|
| Embauche et information | `dpae`, `infoemb`, `infoetranger`, `essai`, `prevenance`, `recrutinfo`, `collectinfo` | intégrés |
| Contrat à durée déterminée | `cddecrit`, `cddtransmis`, `cddcarence`, `precarite` | intégrés |
| Durée du travail et repos | `maxjour`, `maxsem`, `pause`, `reposquot`, `reposhebdo`, `contingent`, `cor`, `forfaitjours` | intégrés |
| Temps partiel | `tpartiel`, `hcompl`, `dureemin`, `prioritetp` | intégrés |
| Congés et jours | `cpacq`, `cpperiode`, `cpdelais`, `cpordre`, `solidarite` | intégrés |
| Paie | `paiemens` | intégré |
| Fin de contrat | `certif`, `stc`, `attestft`, `convoclic`, `notiflic`, `precmotifs`, `rupconv`, `rupconvhomo`, `inaptreclas`, `inaptsalaire` | intégrés |
| Égalité, discrimination, handicap, alerte | `egarem`, `nondiscrim`, `sexisme`, `handamenag`, `refhandicap`, `formrecrut`, `alerteur` | intégrés |
| Formation (financement) | `contribform`, `abondcpf` | intégrés |
| Santé au travail non traitée par le module SST | `infosecu`, `formrenf`, `secours`, `extincteurs`, `atmortel`, `atcourt`, `reprise`, `micarriere`, `avismed`, `ficheent`, `coactivite`, `protocole`, `epi`, `prevent`, `nuit`, `mineurs`, `locaux`, `ecran`, `chimique` | intégrés |
| Section syndicale et salariés protégés | `synaffich`, `synlocal200`, `synlocal1000`, `protegeds` | intégrés |
| Partage de la valeur | `partagevaleur` | intégré |
| Annexe du DUERP, document annuel au service de santé | `duerpannexe`, `docspst` | intégrés |
| Hors code du travail | `rgpd` (règlement européen, article 30) | **non repris** : le relais ne sert que le code du travail — rien n'en est affirmé |

## 3. Parcours guidés

A en compte **12**, B **6**. Aucun parcours n'est propre à B.

| Sujet | A (`docs/parcours.js`) | B (`PARCOURS`) |
|---|---|---|
| Installer le comité après l'élection | `installation` | `cseinstall` |
| Règlement intérieur | `ri` | `ri` |
| Sanctionner un salarié | `sanction` | `discipline` |
| Tenir une réunion du comité | `reunion` | `reunioncse` |
| Document unique | `duerp` | `duerp` |
| Négociations obligatoires | `nao` | `nao` |
| Constituer les commissions du CSE | `commissions` | — |
| Affichages et informations obligatoires | `affichages` | — |
| Registre unique du personnel | `registre` | — |
| Constituer la base de données (BDESE) | `bdese` | — |
| Index de l'égalité professionnelle | `index` | — |
| Entretiens de parcours professionnel | `entretiens` | — |

Les six parcours communs ne disent pas la même chose : ceux de A fondent
chaque étape sur un article **lu à la source avec son identifiant de version**
et la relient à un modèle de document ; ceux de B portent le texte de l'article
en clair dans l'étape, et renvoient à un générateur de document.

## 4. Divergences relevées entre les deux dépôts

| Point | B écrit | Le texte lu | Retenu |
|---|---|---|---|
| Durée minimale du temps partiel | « à défaut d'accord, 24 heures par semaine (L.3123-27) » | `L3123-7` pose la durée minimale fixée par convention ou accord de branche étendu ; `L3123-27` la fixe à vingt-quatre heures **à défaut d'accord** | concordant — A reprend les deux articles, sans les confondre |
| Contingent d'heures supplémentaires | « à défaut d'accord, 220 heures (D.3121-24) » | `D3121-24` : deux cent vingt heures par salarié, à défaut de l'accord de `L3121-33` | concordant |
| Entretien professionnel | « L.6315-1 (version en vigueur : 1re année puis tous les 4 ans) » | `L6315-1` | concordant — A le portait déjà |
| Complémentaire santé | « L.911-7 code de la sécurité sociale — à vérifier » | hors du champ du relais | A ne l'affirme pas non plus : item signalé, jamais conclu conforme |
| Registre RGPD | « RGPD, art. 30 — hors code du travail » | hors du champ du relais | **non repris** dans A |

## 5. Ce qui a été fait le 23 août 2026

### 5.1 Côté A — quarante-neuf obligations et trois parcours de plus

Le référentiel social passe de **41 à 90 obligations**, la page des parcours de
**12 à 15**. Cinq catégories nouvelles apparaissent : *durée du travail et
repos*, *congés et jours*, *embauche et contrat*, *fin du contrat*, *égalité et
non-discrimination*.

**Quatre-vingt-dix articles ont été capturés** au relais Légifrance, filtre par
NOM du code, deux lectures concordantes espacées, critère de contenu contre les
homonymes — puis **relus une troisième et une quatrième fois** par
`verifier-textes-social.js` : **172 articles, 172 concordants, zéro écart, zéro
lecture sans conclusion**.

| Obligation ajoutée | Intitulé | Articles lus (LEGIARTI) |
|---|---|---|
| `SOC-DUR-MAXIMA` | Durées maximales de travail : quotidienne, hebdomadaire, et moyenne sur douze semaines | L. 3121-18 (LEGIARTI000033020428) · L. 3121-20 (LEGIARTI000033020414) · L. 3121-22 (LEGIARTI000033020402) |
| `SOC-DUR-PAUSE` | Temps de pause : vingt minutes consécutives dès six heures de travail quotidien | L. 3121-16 (LEGIARTI000033020444) |
| `SOC-DUR-REPOS` | Repos quotidien de onze heures et repos hebdomadaire | L. 3131-1 (LEGIARTI000033020918) · L. 3132-1 (LEGIARTI000006902580) · L. 3132-2 (LEGIARTI000006902581) |
| `SOC-DUR-CONTINGENT` | Contingent annuel d'heures supplémentaires et contrepartie obligatoire en repos | L. 3121-30 (LEGIARTI000033020367) · L. 3121-33 (LEGIARTI000038610166) · D. 3121-24 (LEGIARTI000033509251) · L. 3121-38 (LEGIARTI000038610163) |
| `SOC-DUR-FORFAIT` | Forfait annuel en jours : accord collectif, convention individuelle, décompte et suivi de la charge | L. 3121-64 (LEGIARTI000036262805) · L. 3121-65 (LEGIARTI000036262800) · L. 3121-60 (LEGIARTI000033003246) |
| `SOC-DUR-TPARTIEL` | Temps partiel : contrat écrit et ses mentions, durée minimale, heures complémentaires, priorité d'accès | L. 3123-6 (LEGIARTI000033020080) · L. 3123-7 (LEGIARTI000047453545) · L. 3123-27 (LEGIARTI000033019953) · L. 3123-8 (LEGIARTI000033020061) · L. 3123-3 (LEGIARTI000036262948) |
| `SOC-DUR-PAIE` | Mensualisation de la rémunération et acompte de quinzaine | L. 3242-1 (LEGIARTI000006902858) |
| `SOC-CON-ACQUISITION` | Acquisition des congés payés : deux jours et demi ouvrables par mois de travail | L. 3141-3 (LEGIARTI000033020826) |
| `SOC-CON-PERIODE` | Période de prise des congés payés et information des salariés | L. 3141-13 (LEGIARTI000033020772) · D. 3141-5 (LEGIARTI000033515945) |
| `SOC-CON-ORDRE` | Ordre des départs en congé : critères, communication et délai de modification | L. 3141-15 (LEGIARTI000033020765) · L. 3141-16 (LEGIARTI000035652687) · D. 3141-6 (LEGIARTI000033515942) |
| `SOC-CON-SOLIDARITE` | Journée de solidarité : modalités fixées et travail accompli dans la limite de sept heures | L. 3133-7 (LEGIARTI000033020869) · L. 3133-8 (LEGIARTI000033020862) |
| `SOC-EMB-DPAE` | Déclaration préalable à l'embauche (DPAE) | L. 1221-10 (LEGIARTI000006900849) · L. 1221-11 (LEGIARTI000006900850) |
| `SOC-EMB-INFORMATION` | Documents d'information sur la relation de travail remis au salarié | L. 1221-5-1 (LEGIARTI000047285930) · R. 1221-34 (LEGIARTI000048288642) · R. 1221-35 (LEGIARTI000048288640) |
| `SOC-EMB-ESSAI` | Période d'essai : durée, renouvellement et délai de prévenance | L. 1221-19 (LEGIARTI000019071113) · L. 1221-21 (LEGIARTI000019071109) · L. 1221-25 (LEGIARTI000029144958) · L. 1221-26 (LEGIARTI000019071093) |
| `SOC-EMB-RECRUTEMENT` | Information du candidat sur les méthodes de recrutement et du salarié sur les dispositifs de collecte | L. 1221-8 (LEGIARTI000006900847) · L. 1221-9 (LEGIARTI000006900848) · L. 1222-4 (LEGIARTI000006900861) |
| `SOC-EMB-CDD` | Contrat à durée déterminée : écrit et motif, transmission, délai de carence, indemnité de fin de contrat | L. 1242-12 (LEGIARTI000006901206) · L. 1242-2 (LEGIARTI000037312980) · L. 1242-13 (LEGIARTI000006901207) · L. 1244-3 (LEGIARTI000035644007) · L. 1244-3-1 (LEGIARTI000035639421) · L. 1243-8 (LEGIARTI000006901219) |
| `SOC-FIN-DOCUMENTS` | Documents de fin de contrat : certificat de travail, reçu pour solde de tout compte, attestation destinée à l'assurance chômage | L. 1234-19 (LEGIARTI000006901138) · D. 1234-6 (LEGIARTI000029544357) · L. 1234-20 (LEGIARTI000019071122) · R. 1234-9 (LEGIARTI000049816309) |
| `SOC-FIN-LICENCIEMENT` | Licenciement pour motif personnel : convocation, entretien, notification et précision des motifs | L. 1232-2 (LEGIARTI000006901000) · L. 1232-4 (LEGIARTI000006901002) · L. 1232-6 (LEGIARTI000036762096) · L. 1235-2 (LEGIARTI000036261950) · R. 1232-13 (LEGIARTI000036212577) |
| `SOC-FIN-RUPTURE-CONV` | Rupture conventionnelle individuelle : entretiens, indemnité, rétractation et homologation | L. 1237-11 (LEGIARTI000019071187) · L. 1237-13 (LEGIARTI000019071182) · L. 1237-14 (LEGIARTI000019071180) |
| `SOC-FIN-INAPTITUDE` | Inaptitude constatée par le médecin du travail : recherche de reclassement et reprise du paiement du salaire | L. 1226-2 (LEGIARTI000035653236) · L. 1226-4 (LEGIARTI000025560071) |
| `SOC-EGA-REMUNERATION` | Égalité de rémunération entre les femmes et les hommes pour un même travail ou un travail de valeur égale | L. 3221-2 (LEGIARTI000006902818) |
| `SOC-EGA-DISCRIMINATION` | Interdiction des discriminations dans les décisions de gestion du personnel | L. 1132-1 (LEGIARTI000045391841) · L. 1132-4 (LEGIARTI000045391813) |
| `SOC-EGA-SEXISME` | Interdiction des agissements sexistes | L. 1142-2-1 (LEGIARTI000031072447) |
| `SOC-EGA-HANDICAP` | Mesures appropriées pour l'accès à l'emploi et le maintien dans l'emploi des travailleurs handicapés | L. 5213-6 (LEGIARTI000048589854) |
| `SOC-EGA-REFERENT-HANDICAP` | Référent handicap chargé d'orienter, d'informer et d'accompagner (entreprise d'au moins deux cent cinquante salariés) | L. 5213-6-1 (LEGIARTI000043894133) |
| `SOC-EGA-RECRUTEURS` | Formation à la non-discrimination à l'embauche des personnes chargées du recrutement (entreprise d'au moins trois cents salariés) | L. 1131-2 (LEGIARTI000033957410) |
| `SOC-EGA-ALERTE` | Protection du salarié qui signale ou témoigne de faits constitutifs d'un délit ou d'un crime | L. 1132-3-3 (LEGIARTI000045391816) |
| `SOC-SST-INFO-RISQUES` | Information des travailleurs sur les risques pour leur santé et leur sécurité | L. 4141-1 (LEGIARTI000027326445) |
| `SOC-SST-FORMATION-RENFORCEE` | Formation renforcée à la sécurité des salariés en contrat court affectés à des postes à risques, et liste de ces postes | L. 4154-2 (LEGIARTI000035653199) |
| `SOC-SST-SECOURS` | Matériel de premiers secours, secouristes formés et protocole écrit des soins d'urgence | R. 4224-14 (LEGIARTI000018532205) · R. 4224-15 (LEGIARTI000018532203) · R. 4224-16 (LEGIARTI000043128580) |
| `SOC-SST-INCENDIE-MOYENS` | Moyens de lutte contre l'incendie : extincteurs, dégagements et vérification | R. 4227-29 (LEGIARTI000018532079) · R. 4227-4 (LEGIARTI000018532137) |
| `SOC-SST-ACCIDENT-GRAVE` | Information de l'inspection du travail en cas d'accident du travail mortel | R. 4121-5 (LEGIARTI000047665981) |
| `SOC-SST-SUIVI-CONTRAT` | Suivi médical au fil du contrat : visite de reprise, visite de mi-carrière, information du médecin, suites données aux avis | R. 4624-31 (LEGIARTI000054250639) · R. 4624-29 (LEGIARTI000045371016) · R. 4624-33 (LEGIARTI000045371018) · L. 4624-2-2 (LEGIARTI000054527125) · L. 4624-6 (LEGIARTI000033014760) |
| `SOC-SST-FICHE-ENTREPRISE` | Fiche d'entreprise établie par le service de prévention et de santé au travail, et document annuel qui lui est adressé | R. 4624-46 (LEGIARTI000045677119) · R. 4624-47 (LEGIARTI000045676758) · D. 4622-22 (LEGIARTI000045676988) |
| `SOC-SST-SALARIE-COMPETENT` | Salarié compétent désigné pour s'occuper des activités de protection et de prévention des risques | L. 4644-1 (LEGIARTI000043893856) |
| `SOC-SST-EPI` | Équipements de protection individuelle : fourniture gratuite, entretien et remplacement | R. 4323-95 (LEGIARTI000018531306) · R. 4323-91 (LEGIARTI000018531314) |
| `SOC-SST-EXTERIEURES` | Entreprises extérieures : plan de prévention, et protocole de sécurité des opérations de chargement ou de déchargement | R. 4512-6 (LEGIARTI000018529785) · R. 4515-4 (LEGIARTI000018529684) |
| `SOC-SST-NUIT` | Travail de nuit : recours exceptionnel, justifié, et suivi des travailleurs de nuit | L. 3122-1 (LEGIARTI000033020190) · L. 3122-2 (LEGIARTI000033020186) |
| `SOC-SST-JEUNES` | Jeunes travailleurs de moins de dix-huit ans : travaux interdits et procédure de dérogation | L. 4153-8 (LEGIARTI000006903187) · L. 4153-9 (LEGIARTI000006903188) · R. 4153-40 (LEGIARTI000033769318) |
| `SOC-SST-LOCAUX` | Locaux : sanitaires, vestiaires et restauration | R. 4228-10 (LEGIARTI000018531982) · R. 4228-19 (LEGIARTI000018531960) |
| `SOC-SST-ECRAN` | Travail sur écran de visualisation : information, formation et examen des yeux | R. 4542-16 (LEGIARTI000018528838) |
| `SOC-SST-CHIMIQUE` | Agents chimiques : fiches de données de sécurité et notice de poste | R. 4412-38 (LEGIARTI000036483735) · R. 4412-39 (LEGIARTI000018530861) |
| `SOC-SST-DUERP-ANNEXE` | Annexe du document unique : données collectives d'exposition et proportion de salariés exposés | R. 4121-1-1 (LEGIARTI000031818152) |
| `SOC-FOR-CONTRIBUTION` | Contribution au développement de la formation professionnelle et de l'alternance | L. 6131-1 (LEGIARTI000043709709) |
| `SOC-FOR-ABONDEMENT` | Abondement correctif du compte personnel de formation (entreprise d'au moins cinquante salariés) | L. 6323-13 (LEGIARTI000052437094) |
| `SOC-INS-SECTION-SYNDICALE` | Moyens de la section syndicale : affichage des communications, diffusion des tracts, local | L. 2142-3 (LEGIARTI000035652705) · L. 2142-4 (LEGIARTI000006901617) · L. 2142-8 (LEGIARTI000025578958) |
| `SOC-INS-PROTEGES` | Salariés protégés : autorisation de l'inspection du travail avant toute rupture | L. 2411-3 (LEGIARTI000006902294) |
| `SOC-NEG-DECONNEXION` | Droit à la déconnexion : accord, ou à défaut charte élaborée après avis du comité | L. 2242-17 (LEGIARTI000043893940) |
| `SOC-NEG-PARTAGE-VALEUR` | Négociation sur les conséquences d'une augmentation exceptionnelle du bénéfice | L. 3346-1 (LEGIARTI000048488858) |

Trois parcours guidés nouveaux, sur les matières les plus opératoires de cet
apport : `embauche` (Embaucher : les formalités obligatoires), `conges`
(Organiser les congés payés), `findecontrat` (Établir les documents de fin de
contrat). Trente-neuf articles de plus dans la table `TEXTES` de
`docs/parcours.js`, chacun avec son identifiant de version.

### 5.2 Côté B — un patch, jamais poussé

`juris-expert-complements.patch` ajoute à Juris Expert les **sept obligations**
et les **six parcours** que A portait et lui non — `AUS_OBLIG` passe de 145 à
152, `PARCOURS` de 6 à 12. Le détail est dans
`juris-expert-complements.NOTE.md`.

### 5.3 Ce qui n'est pas entré, et pourquoi

| Item de B | Décision |
|---|---|
| `rgpd` — registre des traitements (règlement européen, article 30) | **non repris** : hors du code du travail, le relais ne le sert pas, rien n'en est affirmé |
| `D1142-2` (indicateurs de l'index) | reste **non confirmé** dans `textes-social-non-confirmes.json` du module social : aucune obligation du référentiel ne le cite. Il est en revanche confirmé et cité par le module des parcours, avec son identifiant de version — les deux dépôts de textes sont distincts et le restent |
