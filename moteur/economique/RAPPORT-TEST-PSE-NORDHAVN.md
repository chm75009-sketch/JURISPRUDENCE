# Test de solidité du moteur « économique » — dossier NORDHAVN

Audit adverse du moteur `moteur/economique`, conduit le 15 août 2026 sur la branche
`claude/github-pages-verification-cdzo92`. Un dossier a été construit pour mettre
les contrôles en défaut, puis passé dans la chaîne réelle :

```
node lancer-audit.js fiche-nordhavn.json
```

La fiche est jointe : `fiche-nordhavn.json`. Elle est au format exact du
questionnaire produit par `questionnaire.js`.

---

## 1. Le cas de test

Filiale française d'un groupe international, choisie pour faire jouer
**trois périmètres différents pour trois questions différentes** — c'est le
point où la plupart des outils se trompent.

| | |
|---|---|
| Groupe | NORDHAVN INDUSTRIES SE, 15 400 salariés, siège aux Pays-Bas |
| Sociétés | 2 françaises (E-DRIVE 240, SERVICES FRANCE 410) et 4 étrangères (Pologne, Maroc, Vietnam, Allemagne) |
| Société auditée | NORDHAVN MOBILITÉ FRANCE SAS, 3 500 salariés, 4 établissements |
| Projet | fermeture du site de Rennes, réorganisation de Sochaux et Vélizy — 1 025 suppressions, 890 licenciements |
| Cause invoquée | 1° difficultés économiques |
| Résultats | secteur France −38 M€ en 2025 · groupe consolidé +412 M€ · dividendes 180 M€ |

Pièges volontairement introduits : trois trimestres de baisse seulement (quatre
requis au-delà de 300 salariés) ; 79 M€ de redevances et management fees versés
à la mère depuis 2023, sans lesquels le secteur France serait bénéficiaire de
41 M€ ; accord de plan signé à 47 % des suffrages ; notification à
l'administration antérieure à la première réunion ; notification des
licenciements antérieure à la décision d'homologation ; deux catégories
professionnelles d'un seul salarié, chacune occupée par un élu ; périmètre des
critères d'ordre ramené à l'établissement ; offres de reclassement au Maroc à
380 € par mois ; intérimaires et CDD sur des postes déclarés supprimés ;
co-emploi, transfert d'entité et contentieux en cours.

---

## 2. Résultat brut

| État | Nombre |
|---|---|
| Conforme au vu des pièces | **0** |
| Non conforme | 11 |
| Risque à vérifier | 22 |
| Donnée manquante | 11 |
| Sans objet | 2 |

287 éléments produits, mention « revue professionnelle obligatoire » portée.
Aucune conformité prononcée sur un dossier de cette nature : le comportement
attendu est respecté.

---

## 3. Ce que le moteur a correctement détecté

**Blocages** — notification à l'administration antérieure à la première réunion ;
notification des licenciements prévue avant la décision administrative ; deux
salariés protégés sans autorisation ; une seule offre personnalisée pour 890
licenciements ; comité central non réuni alors qu'il existe quatre
établissements ; projet de plan postérieur à la convocation ; accord signé à
47 % des suffrages quand 50 % sont requis.

**Démonstration économique** — « Effectif 3500 — tranche 300 salariés et plus :
4 trimestre(s) consécutif(s) requis. Constatés : 3. Le seuil n'est PAS atteint »,
avec le détail trimestre par trimestre. Le périmètre déclaré (entreprise) est
signalé comme insuffisant au regard du secteur d'activité du groupe.

**Les trois périmètres sont bien distingués** — c'est le point fort de la base :

- cause économique : secteur d'activité du groupe **limité au territoire
  national**, avec exclusion nominative des quatre sociétés étrangères ;
- reclassement : `CTL-REC-02` filtre `!s.etranger` et n'exige que les sociétés
  françaises — les deux omises sont nommées ;
- moyens du plan : `CTL-PSE-02` réclame les comptes du groupe, sans limitation
  territoriale.

**Autres détections justes** — congé de reclassement retenu et CSP écarté avec
motivation ; périmètre des critères d'ordre ramené à l'établissement déclaré
illicite en l'absence d'accord ; 88 intérimaires et 12 CDD sur des postes
supprimés ; écart entre 1 025 suppressions et 890 licenciements ; revitalisation ;
transfert ; co-emploi, usages et contentieux relayés en détection.

---

## 4. Les sept anomalies, par ordre de gravité

### 4.1 — `CTL-CSE-04` conclut « conforme » quand l'avis n'a pas été rendu

**Gravité : haute.** C'est un faux conforme, produit en suivant la documentation.

Le questionnaire demande, pour `dateAvisCSE` : *« Date de l'avis rendu, ou
mention "avis non rendu" »*. Or `controles.js:158` teste seulement que le champ
n'est pas vide :

```js
if (!vide(f.dateAvisCSE)) return { etat: CONF, motif: `Avis rendu le ${f.dateAvisCSE}.` };
```

Vérifié sur la fiche jointe :

```
état brut du contrôle : {"etat":"conforme","motif":"Avis rendu le avis non rendu."}
champ laissé vide      : {"etat":"risque à vérifier","motif":"Aucun avis rendu. À l'expiration du délai — quatre mois…"}
```

L'utilisateur qui **suit l'instruction** obtient « conforme » ; celui qui laisse
la case vide obtient le bon résultat. La branche correcte, `controles.js:160`,
est inatteignable. Effet juridique : le contrôle décisif — la notification
intervient-elle après l'expiration du délai de quatre mois ? — n'est jamais
exécuté, dans la situation même où il est indispensable.

**Correctif proposé**

```js
const estDate = s => /^\d{4}-\d{2}-\d{2}$/.test(String(s || ""));

c("CTL-CSE-04", "Procédure", "L'avis a-t-il été rendu, ou le délai est-il expiré ?",
  ["L. 1233-8", "L. 1233-30, II"],
  f => { const r = M.regimeEco(f);
    if (!r.consultationCSE) return { etat: SO, motif: "Consultation non due." };
    if (estDate(f.dateAvisCSE)) return { etat: CONF, motif: `Avis rendu le ${f.dateAvisCSE}.` };
    if (!vide(f.dateAvisCSE) && !estDate(f.dateAvisCSE) && !/non rendu/i.test(f.dateAvisCSE))
      return { etat: MANQ, motif: `Valeur non interprétable : « ${f.dateAvisCSE} ». Attendu : une date ou la mention « avis non rendu ».` };
    if (vide(f.datesReunionsCSE)) return { etat: MANQ, motif: "Ni avis, ni dates de réunion." };
    // avis non rendu : le délai court à compter de la première réunion
    const depart = f.datesReunionsCSE[0];
    const expiration = M.ajouteMois(depart, r.delaiAvis === "quatre mois" ? 4 : r.delaiAvis === "trois mois" ? 3 : 2);
    if (f.dateNotification && f.dateNotification < expiration)
      return { etat: NC, motif: `Aucun avis rendu. Le délai de ${r.delaiAvis} court depuis le ${depart} et expire le ${expiration} : la notification prévue le ${f.dateNotification} est prématurée.` };
    return { etat: RISQ, motif: `Aucun avis rendu. Le délai de ${r.delaiAvis}, courant depuis le ${depart}, expire le ${expiration} ; le comité est alors réputé consulté. Cette date doit être établie avant toute notification.` };
  });
```

`ajouteMois` reste à ajouter dans `moteur.js`, à côté d'`ajouteJours`. Le point
de départ retenu ici est la première réunion ; si vous préférez la mise à
disposition des informations, `dateInfoCSE` est déjà collectée — le choix mérite
d'être écrit dans la grille, car il est discuté.

**Cas contradictoire à ajouter** : dossier `dateAvisCSE: "avis non rendu"` avec
notification antérieure à l'expiration → doit sortir `non conforme`.

### 4.2 — Les offres de reclassement à l'étranger sont comptées comme valables

**Gravité : haute.** C'est l'asymétrie la plus exploitable de la chaîne.

`CTL-REC-02` filtre correctement les sociétés étrangères pour le périmètre de
recherche, mais **aucun contrôle ne filtre `offresFaites`**. Dans la fiche
jointe, l'offre « Technicien de maintenance, NORDHAVN MAROC SARL, Tanger,
380 €/mois » est traitée comme une offre ordinaire : seules ses mentions
manquantes sont relevées. Un employeur peut donc nourrir son obligation de
reclassement avec des postes que la loi ne reconnaît plus depuis l'ordonnance
du 22 septembre 2017.

**Correctif proposé** — nouveau contrôle, et exclusion en amont dans `CTL-REC-08`
(offres personnalisées) et `CTL-REC-07` (postes omis) :

```js
c("CTL-REC-12", "Reclassement", "Les offres relèvent-elles du territoire national ?",
  ["L. 1233-4"],
  f => { if (vide(f.offresFaites)) return { etat: MANQ, motif: "Aucune offre renseignée." };
    const etrangeres = new Set((f.societes || []).filter(s => s.etranger).map(s => s.nom));
    const hors = f.offresFaites.filter(o => etrangeres.has(o.employeur));
    return hors.length
      ? { etat: NC, motif: `${hors.length} offre(s) émanent d'une société non établie sur le territoire national : ${[...new Set(hors.map(o => o.employeur))].join(", ")}. Depuis le 22 septembre 2017, l'obligation de reclassement est limitée au territoire national : ces offres ne la satisfont pas et ne peuvent être décomptées.` }
      : { etat: CONF, motif: "Toutes les offres émanent de sociétés établies sur le territoire national." };
  });
```

**Cas contradictoire** : dossier où la seule offre émane d'une société étrangère
→ `non conforme`, et `CTL-REC-08` doit alors compter zéro destinataire.

### 4.3 — L'obligation de rechercher un repreneur est absente

**Gravité : haute** pour les dossiers de fermeture.

Zéro occurrence de « repreneur » dans le rapport produit. L'entreprise compte
3 500 salariés et ferme un établissement : les articles L. 1233-57-9 et suivants
imposent la recherche d'un repreneur, l'information du comité et ouvrent une
saisine du tribunal administratif. La grille connaît la pièce « mandat de
recherche de repreneur », mais elle est accrochée à la cessation d'activité
(cause 4) ; ici la cause est 1, et rien ne se déclenche.

**Correctif** — le déclencheur doit être la **fermeture d'un établissement**,
indépendamment de la cause invoquée. Deux champs à ajouter au questionnaire
(`fermetureEtablissement`, `rechercheRepreneur`), et :

```js
c("CTL-REP-01", "Fermeture de site", "La recherche d'un repreneur a-t-elle été engagée ?",
  ["L. 1233-57-9", "L. 1233-57-10", "L. 1233-57-14"],
  f => { if (f.effectif < 1000) return { etat: SO, motif: "L'obligation ne vise que les entreprises d'au moins mille salariés." };
    if (vide(f.fermetureEtablissement)) return { etat: MANQ, motif: "La fermeture d'un établissement n'est pas renseignée." };
    if (f.fermetureEtablissement !== true) return { etat: SO, motif: "Aucune fermeture d'établissement déclarée." };
    return vide(f.rechercheRepreneur)
      ? { etat: NC, motif: "Fermeture d'un établissement dans une entreprise d'au moins mille salariés : la recherche d'un repreneur doit être engagée dès l'information du comité, et celui-ci informé de son déroulement." }
      : { etat: RISQ, motif: "Recherche déclarée : le mandat, le journal des candidats et les motifs d'écartement doivent être versés." };
  });
```

### 4.4 — L'artificialisation des difficultés n'est pas détectée

**Gravité : haute** dans les dossiers de groupe international — c'est le premier
moyen de contestation.

La fiche indique explicitement, dans `autresElements`, que 79 M€ de redevances
et de management fees versés à la mère néerlandaise depuis 2023 transforment un
résultat de +41 M€ en −38 M€, alors que le groupe dégage 412 M€ et distribue
180 M€. Aucun contrôle ne s'en saisit. Or la fraude fait tomber la limitation du
périmètre au territoire national : c'est exactement le point sur lequel le
dossier se gagne ou se perd.

Le champ `autresElements` est du texte libre — il ne faut évidemment pas
l'analyser. Il faut **poser la question** :

```
fluxIntragroupe        Redevances, management fees et prix de transfert versés
                       aux sociétés du groupe, par exercice          tableau
resultatHorsFlux       Résultat d'exploitation reconstitué hors ces flux  tableau
resultatGroupe         Résultat consolidé du groupe et dividendes versés  tableau
```

```js
c("CTL-FRA-01", "Groupe — détection", "Les difficultés peuvent-elles procéder de flux intragroupe ?",
  ["L. 1233-3"],
  f => { const local = (f.resultatExploitation || []).slice(-1)[0];
    const horsFlux = (f.resultatHorsFlux || []).slice(-1)[0];
    if (!local || !horsFlux) return { etat: MANQ, motif: "Le résultat reconstitué hors flux intragroupe n'est pas renseigné : l'inversion du signe ne peut pas être vérifiée." };
    return (local.valeur < 0 && horsFlux.valeur >= 0)
      ? { etat: RISQ, motif: `Résultat déclaré ${local.valeur}, résultat reconstitué hors flux intragroupe ${horsFlux.valeur} : les difficultés invoquées disparaissent une fois ces flux neutralisés. Ce contrôle ne conclut jamais à la conformité — l'appréciation d'une fraude relève d'un professionnel, et elle écarte la limitation du périmètre au territoire national.` }
      : { etat: SO, motif: "Le résultat reste négatif hors flux intragroupe." };
  });
```

À inscrire dans `DETECTION` et dans `A_PRO` : ce contrôle relaie une situation,
il ne prononce pas de conformité.

### 4.5 — Les catégories professionnelles taillées sur mesure passent

**Gravité : moyenne à haute.** « catégorie professionnelle » : zéro occurrence
dans le rapport.

Le dossier comporte deux catégories d'un seul salarié — « Responsable de secteur
maintenance Rennes — niveau 7 échelon B » et « Chargé de clientèle grands comptes
zone Ouest » — chacune occupée par un salarié protégé, toutes deux supprimées
intégralement. C'est le procédé classique pour neutraliser les critères d'ordre
et viser une personne. Rien ne le relève.

```js
c("CTL-ORD-02", "Ordre des licenciements", "Les catégories professionnelles sont-elles construites objectivement ?",
  ["L. 1233-5"],
  f => { if (vide(f.categories)) return { etat: MANQ, motif: "Les catégories professionnelles ne sont pas renseignées." };
    const proteges = new Set((f.salariesProteges || []).map(s => s.nom));
    const uniques = f.categories.filter(c => (c.effectif ?? (c.salaries || []).length) === 1);
    const ciblees = uniques.filter(c => (c.salaries || []).some(s => proteges.has(s.nom)));
    if (ciblees.length) return { etat: NC, motif: `${ciblees.length} catégorie(s) réduites à un seul salarié, occupé par un salarié protégé : ${ciblees.map(c => c.nom).join(" ; ")}. Une catégorie regroupe les fonctions de même nature supposant une formation professionnelle commune ; une catégorie d'une personne désigne cette personne au lieu de la classer.` };
    if (uniques.length) return { etat: RISQ, motif: `${uniques.length} catégorie(s) ne comptent qu'un salarié : ${uniques.map(c => c.nom).join(" ; ")}. Le rattachement à une catégorie plus large doit être justifié.` };
    return { etat: CONF, motif: `${f.categories.length} catégories, toutes de plus d'un salarié.` };
  });
```

**Cas contradictoires** : une catégorie d'un salarié protégé → `non conforme` ;
une catégorie d'un salarié non protégé → `risque à vérifier` ; catégories
normales → `conforme`.

### 4.6 — Le critère du co-emploi s'arrête à la moitié de la formule

**Gravité : moyenne.** Défaut de rédaction, non de logique.

`controles.js:229` énonce : *« Le co-emploi suppose une confusion d'intérêts,
d'activités et de direction »*. C'est la première moitié de la formule actuelle.
Depuis Cass. soc., 25 novembre 2020, n° 18-13.769, cette confusion doit se
manifester par une **immixtion permanente dans la gestion économique et sociale**
de la société employeuse, **conduisant à la perte totale d'autonomie d'action**
de celle-ci. C'est cette seconde moitié qui tranche les dossiers, et son absence
laisse croire à un critère plus facile à remplir qu'il ne l'est.

```js
motif: "Une immixtion de la société mère dans la gestion est signalée. Le co-emploi suppose une confusion d'intérêts, d'activités et de direction, se manifestant par une immixtion permanente dans la gestion économique et sociale de la société employeuse et conduisant à la perte totale de son autonomie d'action. Le critère est exigeant et la qualification est hors du champ de cette base : elle appelle un examen distinct."
```

Arrêt à rattacher dans la grille : `A("18-13.769","2020-11-25","soc.","toujours valable", …)`.

### 4.7 — Le point de départ du délai d'avis n'est jamais calculé

**Gravité : moyenne**, corollaire du 4.1.

Le rapport restitue correctement « Avis : quatre mois », mais aucune date
d'expiration n'est produite et aucune comparaison n'est faite avec la date de
notification. La section « calendrier calculé » traite le calendrier individuel
(entretien, notification) et non le calendrier collectif. Le correctif du 4.1
résout ce point ; il gagnerait à être aussi affiché dans le calendrier, sous
forme de ligne « expiration du délai de consultation ».

---

## 5. Champs à ajouter au questionnaire

| Champ | Libellé | Format | Contrôle servi |
|---|---|---|---|
| `fermetureEtablissement` | Le projet emporte-t-il la fermeture d'un établissement ? | oui / non | CTL-REP-01 |
| `rechercheRepreneur` | Recherche d'un repreneur : date d'engagement, mandataire, candidats et motifs d'écartement | texte | CTL-REP-01 |
| `fluxIntragroupe` | Redevances, management fees et prix de transfert versés aux sociétés du groupe, par exercice | tableau | CTL-FRA-01 |
| `resultatHorsFlux` | Résultat d'exploitation reconstitué hors ces flux | tableau | CTL-FRA-01 |
| `resultatGroupe` | Résultat consolidé du groupe et dividendes versés | tableau | CTL-FRA-01, CTL-PSE-02 |
| `perimetreOrdre` | Périmètre d'application des critères d'ordre | texte | CTL-EFF-02 *(existant, absent du questionnaire)* |
| `accordPerimetreOrdre` | Un accord fixe-t-il ce périmètre ? | oui / non | CTL-EFF-02 *(idem)* |
| `cseExistant` | Un comité est-il en place ? | oui / non | CTL-CSE-08 *(idem)* |
| `pvCarence` | Procès-verbal de carence | fichier | CTL-CSE-08 *(idem)* |
| `expertise` | Une expertise du comité a-t-elle été demandée ? | oui / non | CTL-CSE-09 *(idem)* |

Les cinq derniers sont lus par des contrôles existants mais **ne figurent pas
dans le questionnaire** : un utilisateur ne peut donc pas les renseigner, et les
contrôles correspondants sortent systématiquement en « donnée manquante ». Le
principe de non-divergence énoncé dans le README couvre le sens
questionnaire → contrôles ; il gagnerait à couvrir aussi le sens inverse.

**Vérification proposée**, à ajouter au contrôle de non-divergence : tout champ
lu par un contrôle et absent de `CHAMPS` doit faire échouer la génération, comme
le fait déjà un article cité mais non lu.

---

## 6. Récapitulatif

| # | Anomalie | Gravité | Effort |
|---|---|---|---|
| 4.1 | `CTL-CSE-04` conclut « conforme » sur « avis non rendu » | haute | faible |
| 4.2 | Offres à l'étranger comptées comme valables | haute | faible |
| 4.3 | Recherche d'un repreneur absente | haute | moyen |
| 4.4 | Artificialisation des difficultés non détectée | haute | moyen |
| 4.5 | Catégories professionnelles d'un seul salarié | moyenne-haute | faible |
| 4.6 | Critère du co-emploi incomplet | moyenne | très faible |
| 4.7 | Expiration du délai d'avis non calculée | moyenne | faible |
| 5 | Cinq champs lus mais absents du questionnaire | moyenne | faible |

Les points 4.1, 4.2, 4.5 et 4.6 se traitent en quelques dizaines de lignes et
couvrent l'essentiel du risque. Les points 4.3 et 4.4 demandent des champs
nouveaux, donc une reprise du questionnaire.

Rien de ce qui précède ne remet en cause l'architecture : la séparation
grille / moteur / contrôles / cas contradictoires a parfaitement tenu, et c'est
elle qui rend ces correctifs simples à écrire et vérifiables.
