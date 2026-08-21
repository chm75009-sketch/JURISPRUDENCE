# Module « santé, sécurité et conditions de travail » (SST)

Audit de conformité, côté employeur : ce qui est dû, à partir de quel
effectif, et ce que coûte un manquement. Trois terrains : le document unique
d'évaluation des risques (L. 4121-1 et suivants, R. 4121-1 et suivants), la
commission santé, sécurité et conditions de travail (L. 2315-36 et suivants),
et le harcèlement — prévention, information, référents, réaction (L. 1152-*,
L. 1153-*, L. 2314-1).

## La règle qui commande tout : le document unique est dû sans seuil

L'évaluation des risques et sa transcription valent pour **tout employeur**
(L. 4121-3, R. 4121-1). L'effectif ne commande que des modalités, chacune lue
à la source :

- **11 salariés** — mise à jour au moins annuelle du document unique
  (R. 4121-2, 1° ; en dessous, elle peut être moins fréquente sous réserve
  d'un niveau équivalent de protection, L. 4121-3, dernier alinéa) ;
- **50 salariés** — programme annuel de prévention (L. 4121-3-1, III, 1°),
  présenté au comité (L. 2312-27, 2°) ; en dessous, liste d'actions consignée
  dans le document unique (III, 2°) ;
- **250 salariés** — référent employeur harcèlement sexuel (L. 1153-5-1) ;
- **300 salariés** — commission santé, sécurité et conditions de travail
  (L. 2315-36), également due dans un établissement distinct de trois cents
  salariés, dans les établissements à hauts risques (L. 4521-1 et suivants)
  quel que soit l'effectif, ou sur décision de l'inspecteur (L. 2315-37).

La mise à jour événementielle — aménagement important, information nouvelle —
est due **quel que soit l'effectif** (R. 4121-2, 2° et 3°).

## Ce que le module ne fait pas

La **suffisance** des mesures de prévention s'apprécie au fond, pas sur une
case cochée : quand des mesures existent, les contrôles HAR-04 et HAR-05
rendent « risque à vérifier », jamais « conforme » — la valeur probante d'une
enquête interne relève de l'appréciation souveraine des juges du fond (Soc.,
18 juin 2025, n° 23-19.022, publié). Et le contrôle d'exposition
(SST-CTL-PEN-01) ne rend **jamais** « conforme » : contravention de cinquième
classe pour le document unique absent ou périmé (R. 4741-1), amende de
10 000 € par travailleur concerné pour les règles techniques qu'énumère
L. 4741-1, un an et 3 750 € pour les discriminations consécutives à un
harcèlement (L. 1155-2).

## Les vingt contrôles

Document unique (8) : existence, inventaire par unité de travail, mise à jour
annuelle, mise à jour événementielle, suites (programme ou liste), conservation
et affichage, consultation du comité, transmission au service de prévention ·
CSSCT (6) : création, composition, modalités, limites de la délégation,
formation des élus, remplacement des membres en cours de mandat ·
Harcèlement (5) : référent employeur, référent du comité,
information obligatoire, prévention organisée, réaction au signalement ·
Exposition (1, jamais conforme).

Cinq états : conforme, non conforme, risque à vérifier, donnée manquante, sans
objet. Une donnée non renseignée ne produit jamais « conforme ».

## Les textes

33 articles avec leur identifiant `LEGIARTI…` (`textes-sst.json`) : 19 capturés
au relais Légifrance en lectures doubles concordantes avec critère de contenu,
et 14 repris de `moteur/cse/textes_cse.json` (CSSCT, référent du comité,
formation, L. 2312-27, et depuis le 21 août 2026 L. 2314-11, L. 2314-33 et
L. 2315-32, que les contrôles de composition et de remplacement citent), déjà
vérifiés à la source par le module CSE. Relecture complète du 21 août 2026 :
33 concordants, 0 écart (`verifier-textes-sst.js`).

La capture a mesuré un piège nouveau : le filtre `NOM_CODE` du relais attend le
**nom** du code (« Code du travail »), pas l'identifiant `LEGITEXT…`. Avec
l'identifiant, le filtre ne retient rien, le relais élargit, et la pertinence
sert l'homonyme d'un AUTRE code — systématiquement : L. 4121-1 rendu depuis le
code général de la propriété des personnes publiques, L. 1152-1 depuis le code
de la santé publique. Le critère de contenu (l'article parle de ce qu'on
cherche) a détecté les dix-neuf homonymes ; aucun n'a été codé.

## La chaîne de publication

`node publier-sst.js` : tests contradictoires (25 dossiers — tout contrôle a
dit « non » au moins une fois, exposition comprise), non-divergence
questionnaire/contrôles dans les deux sens, propositions vérifiées dans les
deux sens, manifeste avec compteurs mesurés, empaquetage navigateur
(`docs/moteur-sst.js`, page `docs/audit-sst.html`). La publication échoue si un
maillon échoue, si une fiche vide produit une conformité, ou si l'exposition
conclut « conforme ».

## Ce qui reste ouvert

- **Le dépôt dématérialisé du document unique** (L. 4121-3-1, V, B) est écrit
  dans la loi avec ses dates, mais son portail suppose des agréments dont
  l'état ne se lit pas dans les articles : le module cite l'obligation de
  conservation et de mise à disposition, il ne contrôle pas le dépôt sur le
  portail.
- **Le contenu du programme annuel n'est pas audité** : le module vérifie
  qu'il existe et qu'il est présenté au comité, pas la qualité de ses mesures.
- **La faute inexcusable** (sécurité sociale) n'est pas citée : son texte
  relève d'un code que le relais de l'application ne sert pas — on ne cite pas
  ce qu'on n'a pas lu.

## La jurisprudence rattachée aux contrôles

Les contrôles de la commission citent, dans leurs motifs et dans leur
fondement, les décisions lues à la source dans Judilibre le 21 août 2026
(réponse non relaxée, aucune requête relâchée retenue) :

| Décision | Ce qu'elle dit | Contrôle |
|---|---|---|
| Soc., 27 nov. 2019, n° 19-14.224 (publié) | la désignation des membres de la CSSCT, que sa mise en place soit obligatoire ou conventionnelle, résulte d'un vote à la majorité des voix des membres présents, sans résolution préalable fixant les modalités de l'élection | `SST-CTL-CSS-02` |
| Soc., 26 févr. 2025, n° 24-12.295 (publié) | L. 2315-39 étant d'ordre public, là où un troisième collège est institué, un siège au moins revient à un élu de ce collège | `SST-CTL-CSS-02` |
| Soc., 11 févr. 2026, n° 24-16.408 | rappelle le caractère d'ordre public de L. 2315-39 ; un accord ne peut pas s'entendre comme imposant une désignation proportionnelle au résultat électoral | `SST-CTL-CSS-02` |
| Soc., 13 mai 2026, n° 25-12.560 | L. 2315-38 est d'ordre public : ni les attributions consultatives ni le recours à l'expert ne se délèguent à la commission | `SST-CTL-CSS-04` |
| Soc., 18 mars 2026, n° 23-22.270 (publié) | le comité peut décider d'une expertise, le cas échéant sur proposition des commissions constituées en son sein (L. 1233-34) | `SST-CTL-CSS-04` |
| Soc., 28 mai 2026, n° 24-22.914 (publié) | sauf fin anticipée de mandat au sens de L. 2314-33, le comité ne peut pas remplacer les membres d'une CSSCT avant le terme du mandat des élus | `SST-CTL-CSS-06` |

Aucune n'est invoquée au-delà de ce qu'elle dit : le sommaire publié, quand il
existe, fixe la limite.
