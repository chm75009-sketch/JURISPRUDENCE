# FUSION — porter Juris Expert dans JURISPRUDENCE

Document de travail du 23 août 2026. Il sert à lancer le portage **sans
rouvrir les deux dépôts**.

- **A** = `/home/user/JURISPRUDENCE`, dépôt `chm75009-sketch/JURISPRUDENCE`,
  branche `main`, commit de relevé `e93dd20`. C'est **l'application qui
  accueille**.
- **B** = `/home/user/juriste-expert-`, dépôt `chm75009-sketch/juriste-expert-`,
  état publié `origin/main`, commit de relevé **`b7e3ca9`** (« Dixieme parcours :
  organiser la prevention et la securite au poste »). C'est **l'application à
  absorber**. Elle n'a pas été modifiée : lecture seule, arbre propre.

## 0. Ce qui a été vérifié, et ce qui ne l'a pas été

**Vérifié, fichier ouvert** : l'arborescence complète des deux dépôts ; la
fonction `goPage` de B et la liste de ses identifiants de page ; la table
`JX_ONENTER` ; les données `AUS_OBLIG`, `PARCOURS`, `AUS_PARC`, `DOCS`,
`CHECKLIST`, `DISC_DOCS_MAP`, `FAQ_DATA`, `FAQ_EXTRA`, `PSE_JURIS`,
`JX_CHANGELOG` ; le contrôle d'accès de B (`verifierCode`, `accueilShowLock`,
`jxEstAdmin`, `sectorGuard`, `adminSecPrompt`) ; son bloc Supabase ; son
`sw.js`, son `netlify.toml`, son `version.json`, son `.gitignore` ; ses
pages autonomes ; `tests/integrite.py` et la liste de ses tests Playwright ;
le sous-site `avocat-aj/`. Côté A : `docs/sw.js`, `netlify.toml`,
`moteur/social/referentiel-social.js` (90 obligations comptées),
`textes-social.json` (172 articles), `controles-social.js` (les cinq
verdicts), `plan-social.js`, `publier-social.js`, `docs/parcours.js`
(15 parcours), `docs/documents.html` (23 modèles), `docs/droits.js`,
`docs/profil.js`, `docs/idcc.js`, `docs/audit-form.js`, `docs/assistant.js`,
`docs/juris-expert.js`, et les trois documents d'harmonisation.

**NON vérifié** — à ne pas présenter comme acquis :

- Les **tests de B n'ont pas été exécutés** (ni Playwright, ni `integrite.py`).
  Leur état de succès sur `b7e3ca9` est inconnu.
- Le **contenu juridique de B n'a pas été recoupé** avec le relais Légifrance,
  sauf pour ce que `CORRESPONDANCE.md` avait déjà recoupé le 23 août.
- Les **tailles de code par module de B sont approximatives** : elles sont
  mesurées d'une déclaration de fonction à la suivante, ce qui attribue au
  module les données littérales posées entre ses fonctions. Ordre de grandeur,
  pas comptabilité.
- L'**adresse de publication réelle de B** n'a pas été testée. Le dépôt porte
  un `netlify.toml` sans nom de site ; `docs/juris-expert.js` de A affirme
  avoir vérifié en 200 les pages GitHub Pages sur
  `https://chm75009-sketch.github.io/JURISTE-EXPERT-/` le 22 août.
- Le **schéma Supabase de B** n'est connu que par `supabase-cm-leads.sql`
  (table `cm_leads`). Les tables de synchronisation de l'Espace RH
  (entreprise, personnel, conducteurs, véhicules) sont **appelées par le code
  mais leur schéma n'est pas dans le dépôt**.
- Je n'ai pas ouvert les 1 106 fonctions de `index.html` une à une.

**Fait notable, vérifié** : les deux patches de `harmonisation/`
(`juris-expert.patch`, `juris-expert-complements.patch`) **ne s'appliquent
plus** sur `b7e3ca9` — `git apply --check` échoue sur `index.html`, `sw.js` et
`version.json`. Ils visaient `47240ad`. Ils sont donc, en l'état, **caducs** :
utiles comme spécification, inutilisables comme patch.

**Second fait vérifié** : `CORRESPONDANCE.md` est en partie **périmé**. Il
décrit B à `47240ad` avec 145 items et 6 parcours. À `b7e3ca9`, B porte
**147 items** `AUS_OBLIG` (les deux nouveaux sont `atcpam` — déclaration de
l'accident du travail à la caisse — et `amianterep` — repérage amiante avant
travaux) et **10 parcours** (les quatre nouveaux : `embauche`, `licperso`,
`tempstravail`, `prevention`). L'énoncé « `AUS_OBLIG` ≈ 152 items » de la
commande correspond à l'état **après** application du patch de compléments,
qui n'a jamais été poussé.

---

# 1. Inventaire exhaustif de B

## 1.1 Les pages internes de `index.html`

`index.html` fait **3 980 769 octets** (33 351 lignes). Il n'y a **pas de table
de routage déclarative** : `goPage(id)` (ligne 7456) masque toutes les `.page`
et active `#pg-<id>`, avec repli sur `home` si la page n'existe pas. Une
seconde table, `JX_ONENTER` (ligne 7376), associe 18 pages à leur fonction de
remplissage ; les autres pages portent leur contenu en HTML statique.

**48 identifiants de page** sont atteignables par `goPage` (relevé exhaustif
par balayage de tous les `goPage('…')` et de tous les `id="pg-…"` ; les deux
listes concordent). Deux conteneurs ne sont pas des pages : `pg-inscription`
(écran d'accueil public / vitrine, 8,7 Ko) et `pg-app` (le cadre applicatif,
3,1 Ko).

Colonne « HTML » = taille du bloc `<div id="pg-…">` dans la page. Colonne
« JS » = préfixe des fonctions du module et son empreinte approximative
(code + données littérales voisines).

### Accueil et pilotage

| id | Intitulé affiché | Produit | Demande | HTML | JS | Dépendances |
|---|---|---|---|---|---|---|
| `home` | Que voulez-vous faire ? | Tuiles de navigation par familles, bandeau d'effectif, bandeau d'audit social, alertes | rien (lit le profil) | 28,1 Ko | `fam*` ≈ 23 Ko + `accueil*` ≈ 14 Ko | `famRender`, `jxHomeAlertes`, `ausEtat`, `AUS_OBLIG` |
| `tableau-bord` | Tableau de bord conducteurs | Alertes de validité (permis, CQC/FCO, visite médicale, ADR, tachygraphe) | fiches conducteurs de l'Espace RH | 3,4 Ko | dans `rh*` | Espace RH ; **transport uniquement** |
| `parc` | Parc & contraventions | Échéancier véhicules ; désignation du conducteur sous 45 j (L. 121-6 c. route) ; registres Word | véhicules, contraventions | 5,4 Ko | `genRegistreVehicules`, `genRegistreConducteurs` | **transport uniquement** |
| `nouveautes` | Nouveautés & mises à jour | Affiche `JX_CHANGELOG` | rien | 1,3 Ko | — | `JX_CHANGELOG` (**234 Ko de données**) |
| `rgpd` | Charte de confidentialité (RGPD) | Page d'information | rien | 7,7 Ko | — | — |
| `faq` | FAQ salariés | Recherche/filtre dans 1 194 questions-réponses | mot-clé, thème | 1,9 Ko | — | `FAQ_DATA` 168 Ko + `FAQ_EXTRA` **591 Ko** |
| `juris` | Base jurisprudentielle sociale | Liste filtrable d'arrêts, filtres secteur et « favorable au salarié » | mot-clé, secteur | 1,5 Ko | `jur*` (6 fn) | `JURIS_ALL`, `JUR_SECTEURS`, `PSE_JURIS` ; **décisions marquées « réf. à vérifier »** |
| `parametrage` | Paramétrage entreprise | Fiche entreprise (raison sociale, SIRET, adresse, dirigeant, activité, organismes) | saisie complète | 6,9 Ko | `chargerParametres` | stockage local |
| `admin` | Administration | Génération et registre des codes clients ; choix du secteur qui pilote toute l'application | code admin | 22,2 Ko | `cg*` ≈ 10 Ko, `adminSec*` | `jxEstAdmin`, Supabase (registre) |
| `personnel` | Espace RH — Personnel | Registre unique du personnel, fiches individuelles, alertes d'échéances, import CSV/XLSX | code confidentiel, registre | 1,4 Ko | `rx*` ≈ 88 Ko + `rh*` ≈ 54 Ko | **chiffrement AES-GCM/PBKDF2 via `crypto.subtle`**, `vendor/xlsx`, Supabase |

### Audit et diagnostic

| id | Intitulé | Produit | Demande | HTML | JS | Dépendances |
|---|---|---|---|---|---|---|
| `auditsoc` | Audit social | Audit à 3 réponses (je l'ai / je ne l'ai pas / je ne sais pas), puis contrôle de l'existant, rapport général, rapport de régularisation, plan d'action | effectif, DS, réponses | 0,6 Ko (rendu JS) | `aus*` ≈ 332 Ko | `AUS_OBLIG` (73 Ko, **147 items**), `AUS_PARC` (116 Ko) |
| `audit` | Contrôle-minute | Score de conformité + plan d'action priorisé ; 27 à 41 questions selon le secteur | secteur, réponses | 17,9 Ko | dans `jx*` | jumeau de `controle-minute.html` |
| `diag` | Analyse & conformité d'un document | Analyse d'un document déposé (texte, PDF, DOCX, image OCR) : mentions manquantes, délais, clauses nulles ; 18 types reconnus | document déposé | 7,4 Ko | `diag*` ≈ 213 Ko | `DOCS` 138 Ko, `CHECKLIST` 90 Ko, `DIAG_VAGUE` ; **pdf.js et tesseract.js par CDN** |
| `parcours` | Parcours de la relation de travail | Fil chronologique embauche → rupture, étapes 1 à 26, renvoi vers l'outil de chaque étape | salarié sélectionné, secteur | 50,8 Ko | — | fiches salariés |
| `parcguide` | Parcours guidé | Les 10 parcours : préalables (« êtes-vous prêt ? »), étapes datées, document par étape, avancement | selon le parcours | 0,5 Ko (rendu JS) | `parc*` ≈ 126 Ko | `PARCOURS` (97 Ko, **10 parcours**) |

### Embauche, contrat, paie, temps

| id | Intitulé | Produit | Demande | HTML | JS |
|---|---|---|---|---|---|
| `embauche` | J'embauche un salarié | Assistant guidé : contrat, DPAE, coût réel, checklist, fiche de poste, promesse d'embauche | salarié, poste, contrat | 0,8 Ko | `genContrat*`, `genDPAE`, `genChecklistEmbauche*`, `genFichePoste*` (dans `gen*` ≈ 256 Ko) |
| `contrat` | Embauche et contrats | CDI / CDD / saisonnier, classification, période d'essai, contrat imprimable | type, coefficient, durée | 19,6 Ko | `applyContratSector`, `CONTRAT_TR_OPTS` |
| `cdd` | CDD & précarité | Fiche : cas de recours, mentions obligatoires, 10 %, requalification | — (fiche) | 7,6 Ko | statique |
| `remuneration` | Rémunération | Simulateur mensuel, minima conventionnels, GAR, prime d'ancienneté, frais, bulletin type | coefficient, heures, frais | 17,5 Ko | `ccn16Grilles`, `ccn16GrilleL`, `genBulletinType*` |
| `temps` | Temps de conduite & repos | Calculatrice conduite/repos/amplitude, fiche hebdo | conduite, repos, amplitude | 18,7 Ko | `genFicheHebdo` ; **transport uniquement** (D. 3312-45/47, CE 561/2006) |
| `temps2` | Temps de travail & forfaits | Fiche : heures sup., forfait-jours, spécificités sectorielles | — (fiche) | 6,6 Ko | statique |
| `absences` | Absences & congés | Maladie, AT/MP, maternité, CP, absence injustifiée ; courriers (attestation IJSS, contre-visite, mise en demeure, reprise, reprise AT) | nature, dates | 4,9 Ko | `genDocAbsence` (5 documents) |
| `statut` | Statut conventionnel par secteur | Fiche experte : essai, préavis, indemnités, maladie, primes, congés + jurisprudence, 9 conventions | secteur | 2,0 Ko | `SECTEURS_STATUT` ≈ 39 Ko |
| `calc` | Calculateurs d'indemnités | Licenciement, barème Macron, CP, préavis, précarité, rupture conventionnelle, retraite | ancienneté, salaire | 5,6 Ko | `calc*` ≈ 82 Ko |
| `ri` | Règlement intérieur transport | Trame de RI : alcool, tachygraphe, géolocalisation, discipline | questionnaire préalable | 4,4 Ko | `genRI`, `genRIBatiment`, `genRITertiaire`, `genProcedureRI` |

### Discipline et rupture

| id | Intitulé | Produit | Demande | HTML | JS |
|---|---|---|---|---|---|
| `disciplinaire` | Discipline & sanctions | Qualification de la faute, prescription, procédure, calcul des indemnités, **12 documents** (avertissement, blâme, convocation, mise à pied, rétrogradation, licenciement faute simple/grave, inaptitude, reclassement, certificat, solde de tout compte) | secteur, faits, dates | 8,6 Ko | `genDocDisc`, `discDocsForSanction`, `DISC_DOCS_MAP` **206 Ko**, `JURISPRUDENCE_DISCIPLINE` 25 Ko |
| `licenc` | Procédure de licenciement | Fiche + échéancier motif personnel | dates | 9,4 Ko | statique |
| `rupture` | Je veux rompre un contrat | Assistant guidé : rupture conventionnelle, CDD avant terme, économique, retraite, démission | motif, dates | 0,8 Ko | rendu JS |
| `rupconv` | Rupture conventionnelle | Calendrier daté, indemnité spécifique, TéléRC, invitation + trame de convention | dates, salaire | 5,5 Ko | statique + générateur |
| `inapt` | Inaptitude & reclassement | Procédure, consultation CSE, reclassement, indemnités selon l'origine | origine, avis | 7,0 Ko | statique |
| `pse` | Plan de sauvegarde de l'emploi | Procédure pas-à-pas 0→7 (diagnostic, motif éco., voie d'élaboration, consultation CSE, contenu, DREETS, notification, contentieux), calendrier, indemnités, checklist ; **les quatre motifs de L. 1233-3** avec décisions validantes et censures | effectif, secteur, dates | 26,9 Ko | `pse*` ≈ 129 Ko, `PSE_JURIS` 62 Ko, `SECTEURS_PSE` 18 Ko |

### Harcèlement, égalité

| id | Intitulé | Produit | HTML | JS |
|---|---|---|---|---|
| `harcele` | Harcèlement & discrimination | Prévention, preuve aménagée, nullité, jurisprudence | 21,1 Ko | `ega*` ≈ 21 Ko |
| `harcprev` | Prévention du harcèlement | Le dossier de preuve qui exonère l'employeur ; programme de prévention | 0,8 Ko | `hp*` ≈ 65 Ko, `HP_COURS` 27 Ko, `HP_JURIS_OUVERT` |
| `harcmoral` | Harcèlement moral — la qualification | Question par question, ce que la Cour retient et écarte, arrêt par arrêt ; chronologie des faits à éditer | 2,2 Ko | `hm*` ≈ 33 Ko |

### Comité social et économique — treize pages

| id | Intitulé | Produit | HTML | JS |
|---|---|---|---|---|
| `csehub` | Mon espace CSE | Le point d'entrée unique : guide, reste à faire, agenda, classeur, base documentaire | 1,2 Ko | `hub*` ≈ 130 Ko |
| `socle` | Socle — effectif & seuils | Effectif calculé mois par mois, exclusions légales, seuils franchis et depuis quand | 1,7 Ko | `soc*` ≈ 58 Ko |
| `csediag` | CSE — Diagnostic | Obligation, échéances, feuille de route, article fondant chaque conclusion | 1,6 Ko | `csed*` ≈ 48 Ko |
| `moncse` | Mon CSE — composition | Sièges, élus, bureau, référent harcèlement, heures de délégation, fin des mandats ; PV de désignation | 1,5 Ko | `mc*` ≈ 22 Ko |
| `csecal` | Calendrier du CSE | Réunions dues, dates, alertes avant séance et avant ordre du jour | 1,5 Ko | `cal*` ≈ 25 Ko |
| `csereu` | Réunion du CSE | Convocation, ordre du jour conjoint, feuille de présence, votes, procès-verbal | 1,5 Ko | `reu*` ≈ 34 Ko |
| `csercl` | Réclamations | Note à 2 jours, réponse à 6, registre spécial ; régime selon la taille | 1,5 Ko | `rcl*` ≈ 25 Ko |
| `csecns` | Consultations récurrentes | Les trois consultations (L. 2312-17), périodicité, délais d'avis, BDESE | 1,5 Ko | `cns*` ≈ 26 Ko |
| `csebud` | Budgets du comité | 0,20 %/0,22 %, manque au centime, effet de cliquet des ASC, transferts, comptes | 1,8 Ko | `bud*` ≈ 28 Ko |
| `csedos` | Le dossier, étape par étape | Pièces envoyées avant / posées en séance / produites après ; bordereau à éditer | 1,6 Ko | `dos*` ≈ 31 Ko |
| `cse` | Élections CSE | Rétroplanning J−90 → J+15 et **17 documents** (note d'info, invitations OSR, PAP, convocations, bulletins, émargement, PV 1er et 2e tour, PV de carence, affichage des résultats…) | 32,7 Ko | `cses*`, `genDocElectionTEC` |
| `csefonc` | Fonctionnement du CSE | Référence complète : attributions, moyens, expertises, comptabilité, délit d'entrave | 21,5 Ko | `genCseFonc` |
| `cseinst` | Installer le comité | Après l'élection : première réunion, bureau, référent, règlement du comité, documentation ; trame de RI du comité | 0,6 Ko | `cseinst*` ≈ 18 Ko |

### Négociation

| id | Intitulé | Produit | HTML | JS |
|---|---|---|---|---|
| `nego` | Négociations obligatoires | NAO, égalité professionnelle, GEPP : qui, quand, comment ; accords (rémunération-temps-partage, égalité-QVCT, GEPP), plan d'action égalité, PV de désaccord, bordereau | 0,6 Ko | `nego*` ≈ 26 Ko |

## 1.2 Les pages autonomes de B

| Fichier | Taille | Intitulé | Produit | Demande | Dépendances |
|---|---|---|---|---|---|
| `elections-cse.html` | 58,0 Ko / 805 l. | Élections CSE — module autonome | Effectif, sièges, collèges, électeurs/éligibles, calendrier, documents (Word, impression) | effectif, registre | **aucune** — se dit autonome et hors ligne |
| `pse.html` | 47,2 Ko / 757 l. | Plan de sauvegarde de l'emploi (≈ 50 salariés) | Guide 0→7, calendrier, indemnités, checklist ; calibré organismes de formation IDCC 1516 | effectif, dates | aucune |
| `controle-minute.html` | 72,2 Ko / 915 l. | Contrôle-minute | Quiz de conformité, score gratuit, fiche payante (réponse exacte, article, sanction), DUER sur mesure en option | secteur, réponses, coordonnées | **Supabase `cm_leads`** (insertion du prospect) |
| `defense-cph.html` | 27,7 Ko / 307 l. | Conclusions en défense — CPH | Conclusions en défense de l'employeur (Word / impression) : chefs contestés, argumentaire sourcé, bordereau de pièces | RG, parties, chefs, pièces | aucune (« rien ne quitte votre appareil ») |
| `ferroviaire.html` | 34,7 Ko / 361 l. | Fret ferroviaire — droit social (IDCC 3217) | Module documentaire en 7 volets : branche, temps de travail, concurrence & transfert, Europe, relations sociales, dossiers individuels, conseil | — | aucune |
| `maquette-accueil.html` | 19,2 Ko / 247 l. | Maquette d'accueil | Vitrine commerciale (non branchée) | — | aucune |
| `acces-demo-mch-3719.html` | 1,5 Ko | Accès de démonstration | **Page morte volontairement** : l'ancien déverrouillage par URL a été retiré ; elle renvoie à l'accueil | — | — |
| `outils/offres.html` | 206,3 Ko / 3 164 l. | Recherche d'emploi & reclassement — espace admin | Offres réelles France Travail : compétences, salaires, entreprises qui recrutent | mots-clés, zone | **Cloudflare Worker** (`outils/france-travail-proxy.js`) + API France Travail |
| `test.html` + `test.js` | 386 Ko + **2,92 Mo** | — | **Résidus** : ancienne version de la vitrine et de son script, non référencés par `sw.js`, non chargés par `index.html`. Ne portent pas `AUS_OBLIG`. | — | — |

## 1.3 Le sous-site `avocat-aj/` — hors périmètre

Douze pages HTML + images + `sw.js` + `manifest.json` + `netlify.toml` +
`sitemap.xml` + `robots.txt` : le **site vitrine du cabinet CJ AVOCATS**
(Maître Adel JEDDI, Argenteuil), dont `avocat-aj/index.html` fait 118 Ko et
`maquette-3.html` 139 Ko. Son propre `README.md` dit qu'il est autonome, qu'il
ne lit rien de Juris Expert, qu'aucun lien de l'application n'y mène et que
chaque page porte `noindex`, « le jour venu, on le déplace tel quel dans son
propre dépôt ». **Ce n'est pas de l'application** : à ne pas fusionner.

## 1.4 Outils, données, tests, configuration de B

| Élément | Contenu |
|---|---|
| `vendor/xlsx.full.min.js` | 882 Ko — SheetJS, lecture/écriture des classeurs (import du registre du personnel) |
| `vendor/jszip.min.js` | 98 Ko — utilisé par l'extraction DOCX de l'analyse de documents |
| `outils/france-travail-proxy.js` | 9,9 Ko — Cloudflare Worker qui cache `FT_CLIENT_SECRET` ; points d'entrée `/health`, `/offres`, `/offre` |
| `outils/README-DEPLOIEMENT.md` | 5,4 Ko — déploiement du Worker |
| `exemples/` | Jeux d'essai : `PERSONNEL_FICTIF_2500` (csv+xlsx), `_BANQUE`, `_DIFFICILE`, `MODELE_REGISTRE_PERSONNEL.csv`, `MODELE_EFFECTIF_CSE.csv`, `BDESE_TRAME_VIERGE.xlsx`, `DOSSIER_CLIENT_A_FOURNIR.xlsx`, `PROGRAMMES_PREVENTION_HARCELEMENT.docx`, 2 captures, `LISEZ-MOI.md` |
| `MODULE_CSE_STRUCTURE.docx/.xlsx` | Documents de conception à la racine |
| `supabase-cm-leads.sql` | Table `cm_leads` + RLS : insertion anonyme, lecture/suppression réservées à `mch-cm-admin@juris-expert.app` |
| `tests/` | **28 fichiers Playwright** (6 507 lignes) + `integrite.py` (122 lignes) + `README.md` |
| `sw.js` | `CACHE = 'jem-v200'` ; cache d'abord pour la navigation ; `version.json` toujours réseau ; 5 pages annexes mises en cache |
| `netlify.toml` | Publication `.`, aucun build ; en-têtes de sécurité ; **CSP appliquée** listant Supabase, forminit, web3forms, francetravail, `*.workers.dev`, jsdelivr, cdnjs, tessdata |
| `version.json` | `{"build": "v2026-08-23.217"}` ; `JX_BUILD` en ligne 1129 doit correspondre |
| `manifest.json`, `icon-192/512.png` | PWA |

Les tests Playwright, par nom : `accueil`, `auditsoc`, `avocat`, `budgets`,
`cdd`, `cloisonnement`, `cse`, `cseinst`, `docsortie`, `dossier`, `eco`,
`egalite`, `etat`, `familles`, `fiche`, `garde`, `harcelement`, `idcc16`,
`navigateur`, `nego`, `parcours`, `presentation`, `report`, `retour`,
`secteur`, `secteur-fuite`, `seuils`, `sieges`.

## 1.5 Les données transverses de B, par taille

| Donnée | Taille | Ce qu'elle porte |
|---|---|---|
| `FAQ_EXTRA` | 591 Ko | Questions-réponses (avec `fondement`, `juris`, `theme`) |
| `JX_CHANGELOG` | 234 Ko | Historique des versions affiché dans `nouveautes` |
| `DISC_DOCS_MAP` | 206 Ko | Documents disciplinaires |
| `SOC_MAP` | 198 Ko | Familles de contrat par expression régulière + le module socle |
| `FAQ_DATA` | 168 Ko | Questions-réponses (l'accueil annonce **1 194** pour les deux tables réunies) |
| `DOCS` | 138 Ko | **18 types de documents analysables** : convocation, licenciement, sanction, contrat, cdd, rupconv, inaptitude, accordent, pap, ri, arretmaladie, accordbranche, clause, saisine, cse_convoc, cse_oj, cse_pv, pse |
| `AUS_PARC` | 116 Ko | Pont item d'audit → parcours + étape |
| `PARCOURS` | 97 Ko | **10 parcours guidés** |
| `CHECKLIST` | 90 Ko | Points de contrôle par type de document, avec article et expression régulière |
| `AUS_OBLIG` | 73 Ko | **147 obligations**, dont 93 avec un champ `src`, **0 identifiant LEGIARTI** |
| `PSE_JURIS` | 62 Ko | Jurisprudence PSE / motif économique |
| `SECTEURS_STATUT` | 39 Ko | Fiches conventionnelles, 9 secteurs |
| `JURISPRUDENCE_DISCIPLINE` | 25 Ko | Arrêts disciplinaires |
| `HP_COURS` | 27 Ko | Cours de prévention du harcèlement |

**Total : 48 pages internes + 9 pages autonomes (dont 2 résidus et
1 page morte) = 57 écrans**, plus le sous-site `avocat-aj/` (12 pages,
hors périmètre).

---

# 2. Inventaire de A

## 2.1 Les pages de `docs/`

| Fichier | Taille | Intitulé | Produit | Demande | Dépendances |
|---|---|---|---|---|---|
| `index.html` | 179 Ko | Jurisprudence — recherche Judilibre | Recherche d'arrêts, filtres, fiches de décision | requête, filtres | relais `judilibre`, `legifrance` ; `vocabulaire.json` (153 Ko) |
| `audit.html` | 18,7 Ko | Audit — licenciement pour motif économique | 5 verdicts, pièces, plan | fiche entreprise + dossier | `moteur-eco.js` (880 Ko) |
| `audit-cse.html` | 26,6 Ko | Audit — comité social et économique | idem | fiche CSE | `moteur-cse.js` (694 Ko) |
| `audit-pse.html` | 21,0 Ko | Audit — plan de sauvegarde de l'emploi | idem | fiche PSE | `moteur-pse.js` (138 Ko) |
| `audit-bdese.html` | 20,2 Ko | Audit — BDESE | idem | fiche BDESE | `moteur-bdese.js` (175 Ko) |
| `audit-nao.html` | 26,2 Ko | Audit — négociation obligatoire | idem | fiche NAO | `moteur-nao.js` (56 Ko) |
| `audit-sst.html` | 25,7 Ko | Audit — santé, sécurité, conditions de travail | idem | fiche SST | `moteur-sst.js` (76 Ko) |
| `audit-discipline.html` | 22,6 Ko | Audit — discipline et règlement intérieur | idem | fiche discipline | `moteur-discipline.js` (121 Ko) |
| `audit-social.html` | 78,4 Ko | Audit social — obligations de l'employeur | 5 étapes : profil, obligations applicables, vérification de l'existant, **guide de régularisation**, régularisation élément par élément ; rapport général et rapport de régularisation | profil + réponses | `moteur-social.js` (740 Ko) |
| `parcours.html` + `parcours.js` | 20,8 Ko + 324 Ko | Parcours guidés | **15 parcours** : préalables, étapes datées, article de chaque étape avec LEGIARTI, modèle correspondant | profil + données du parcours | `TEXTES` (articles vérifiés), `juris-expert.js` |
| `documents.html` | 250 Ko | Documents — relations collectives et discipline | **23 modèles** imprimables | profil + champs du modèle | autonome |
| `agenda.html` | 39,1 Ko | Agenda social | Échéancier des obligations collectives | brouillons d'audit, moteur NAO | brouillons locaux |
| `equipe.html` + `droits.js` | 30,9 Ko + 56,5 Ko | Équipe — droits et journal | Utilisateurs, droits par module, journal des actes | codes d'accès | `Droits.peut()`, `Journal.acte()`, `DROITS.md` |
| `guides.html` | 45,6 Ko | Guides | Mode d'emploi de l'application | — | — |
| `assistant.js` | 41,3 Ko | Assistant Claude (panneau sur toutes les pages) | Conversation avec contexte de page + 2 outils (Légifrance, Judilibre) | question | relais Netlify `assistant`, `legifrance`, `judilibre` |
| `profil.js` | 21,3 Ko | Fiche client — source unique du profil | Profil partagé (`profil-entreprise`) | identité, effectif, secteur, convention | stockage local |
| `idcc.js` + `idcc.json` | 6,9 Ko + 54 Ko | Sélecteur de convention collective | Liste filtrante IDCC (KALI/DILA) | — | — |
| `audit-form.js` | 98,5 Ko | Formulaire d'audit commun aux modules | Champs engendrés par le questionnaire du moteur | — | `window.__MOTEUR` |
| `audit-export.js` | 9,7 Ko | Export d'audit | — | — | — |
| `juris-expert.js` | 6,9 Ko | Pont vers Juris Expert | Liens vérifiés vers les outils de B | — | adresses en dur, vérifiées le 22 août |
| `sw.js` | 9,4 Ko | Service worker | `CACHE = "jurisprudence-5.5"` ; **réseau d'abord, cache en secours** ; API jamais mises en cache | — | — |
| 8 `manifest-audit-*.json` | ~0,7 Ko ch. | Manifestes PWA par audit | — | — | — |

## 2.2 Les modules de `moteur/`

Huit modules métier, tous sur le même patron : `textes-*.json` (articles lus au
relais avec LEGIARTI, deux lectures concordantes) + `moteur-*.js` +
`controles-*.js` (**cinq verdicts** : conforme, non conforme, risque à
vérifier, donnée manquante, sans objet) + `questionnaire-*.js` (non-divergence
dans les deux sens) + `propositions-*.js` + `tests-*.js` contradictoires +
`verifier-textes-*.js` + `publier-*.js` (échoue si un maillon échoue) →
empaquetage vers `docs/moteur-*.js`.

| Module | Cœur | Empaqueté |
|---|---|---|
| `economique` | Licenciement pour motif économique, L. 1233-3, grille, pièces, preuve, registre, dossiers de référence (Sologne, Nordhavn) | `moteur-eco.js` 880 Ko |
| `cse` | Comité : corpus, recueil, synthèses, grille, BDESE, R. 2314-1 | `moteur-cse.js` 694 Ko |
| `social` | **Référentiel de 90 obligations** (`referentiel-social.js`, 249 Ko), 172 articles LEGIARTI, plan d'action, modèles | `moteur-social.js` 740 Ko |
| `pse` | Plan de sauvegarde de l'emploi, mesures, corpus | `moteur-pse.js` 138 Ko |
| `bdese` | Base de données : régime, plancher, contenu, recevabilité | `moteur-bdese.js` 175 Ko |
| `nao` | Négociation obligatoire | `moteur-nao.js` 56 Ko |
| `sst` | Santé, sécurité, conditions de travail | `moteur-sst.js` 76 Ko |
| `discipline` | Discipline et règlement intérieur | `moteur-discipline.js` 121 Ko |
| `parcours` | Textes et jurisprudence des parcours, journal de régularisation | alimente `docs/parcours.js` |
| `commun` | `audit.js`, `dates.js`, `outils.js`, `recevabilite.js`, `propositions.js`, `empaqueter.js`, `epreuve-navigateur.js`, `word_py.py`, `produire.sh` | — |

## 2.3 Les fonctions Netlify de A

`netlify/functions/legifrance.mjs`, `judilibre.mjs`, `assistant.mjs`.
Publication : `publish = "docs"`, **aucune commande de build** (délibéré :
économiser les minutes du plan gratuit), `functions = "netlify/functions"`.

**Total A : 15 pages `docs/` + 8 modules moteur + 3 fonctions relais.**

---

# 3. La carte de destination

Principe directeur, déjà écrit dans `docs/juris-expert.js` et arrêté par
l'utilisatrice : **ce qui se constate reste dans A, ce qui s'imprime vient de
B**. La fusion ne l'annule pas, elle l'internalise : les générateurs de B
deviennent des pages de A, et cessent d'être des liens sortants.

Trois destinations possibles :

- **PA** — page autonome nouvelle sous `docs/` ;
- **RUB** — rubrique d'une page existante de A ;
- **MOT** — module `moteur/` à part entière (textes vérifiés, contrôles à
  5 verdicts, tests, chaîne `publier-*`).

## 3.1 Les élections professionnelles

| Écran de B | Destination | Pourquoi |
|---|---|---|
| `elections-cse.html` + page `cse` | **PA** `docs/elections.html` | Le seul module de B déjà autonome, sans dépendance, avec ses 17 documents. Il comble le trou explicite de A : `docs/juris-expert.js` dit « les élections professionnelles relèvent entièrement de Juris Expert ». Aucun moteur de A ne les traite. |
| `moncse` (composition, sièges, mandats) | **RUB** de `docs/elections.html` | Suite directe du scrutin ; s'appuie sur le même effectif. |

## 3.2 Le comité, une fois élu

Onze pages de B (`csehub`, `socle`, `csediag`, `csecal`, `csereu`, `csercl`,
`csecns`, `csebud`, `csedos`, `csefonc`, `cseinst`) recouvrent le module `cse`
de A, qui porte déjà ses textes vérifiés.

| Écran de B | Destination | Pourquoi |
|---|---|---|
| `csediag`, `socle`, `csecns`, `csebud`, `csefonc` | **RUB** de `docs/audit-cse.html` — apport de **surface**, pas de fond | Le fond est déjà dans `moteur/cse/` avec ses LEGIARTI. Ce qui manque à A, c'est l'ergonomie : l'effectif calculé mois par mois, le calcul du budget au centime, l'effet de cliquet. À reprendre comme **calculs**, pas comme textes. |
| `csecal`, `csereu`, `csercl`, `csedos`, `cseinst` | **RUB** de `docs/documents.html` (générateurs) + `docs/parcours.html` (déroulé) | A porte déjà les parcours `installation` et `reunion` et les modèles `convocation`, `pv-cse`, `convocation-installation`, `odj-installation`, `pv-installation`, `ri-comite`, `remise-reprise`. Ce qui manque : le calendrier engendré, la feuille de présence, le recompte des votes, le bordereau de pièces. |
| `csehub` (« Mon espace CSE ») | **PA** `docs/cse.html` — **à décider** (question 3) | C'est un *tableau de bord* : rien d'équivalent dans A, dont l'entrée est une liste de pages. Soit on le porte comme page d'accueil du CSE, soit on renonce et on garde l'entrée par audit. |

## 3.3 Les relations individuelles — le gros de l'apport

A est aujourd'hui **collectif** (comité, BDESE, NAO, PSE, économique) plus
discipline. B apporte tout l'individuel opératoire.

| Écran de B | Destination | Pourquoi |
|---|---|---|
| `embauche`, `contrat`, `cdd` | **MOT** `moteur/embauche/` + **PA** `docs/audit-embauche.html` | A porte déjà les obligations (`SOC-EMB-*`, 5 obligations, articles L. 1221-10/11, L. 1221-5-1, L. 1221-19 s., L. 1242-2 s. avec LEGIARTI) et le parcours `embauche`. Manque le **générateur** de contrat, de DPAE, de fiche de poste, de checklist. C'est un module au sens de A : textes déjà lus, contrôles à écrire. |
| `absences` | **MOT** `moteur/absences/` ou **RUB** de `audit-social.html` — **à décider** (question 4) | Maladie, AT/MP, maternité, CP, abandon de poste. A ne le traite nulle part. Les 5 courriers de B (attestation IJSS, contre-visite, mise en demeure, reprise, reprise AT) n'ont pas d'équivalent. |
| `licenc`, `rupconv`, `inapt`, `rupture` | **RUB** de `docs/audit-discipline.html` (procédure) + `docs/documents.html` (lettres) | A porte déjà `SOC-FIN-LICENCIEMENT`, `SOC-FIN-RUPTURE-CONV`, `SOC-FIN-INAPTITUDE`, `SOC-FIN-DOCUMENTS` avec leurs LEGIARTI, et le parcours `findecontrat`. Les 12 lettres de B les complètent exactement. |
| `disciplinaire` | **RUB** de `docs/audit-discipline.html` | Doublon franc — voir § 4.3. |
| `calc` (calculateurs d'indemnités) | **PA** `docs/calculs.html` | Aucun équivalent dans A. Barème Macron, indemnité légale, CP, préavis, précarité, retraite. Autonome, sans texte à vérifier au-delà de L. 1234-9 / R. 1234-2 / L. 1235-3. |
| `temps2` (droit commun) | **RUB** de `docs/audit-social.html` | A porte déjà `SOC-DUR-*` (7 obligations, L. 3121-18/20/22/16, L. 3131-1, L. 3132-1/2, contingent, forfait-jours, temps partiel), tous vérifiés. La page de B est une fiche de lecture : elle sert d'**habillage**, pas de source. |
| `statut` (9 conventions) | **RUB** de `docs/index.html` ou nouvelle **PA** — **à décider** (question 5) | **Point délicat** : A s'interdit d'affirmer quoi que ce soit sur une convention collective ; `docs/idcc.js` ne fait que nommer la convention. `SECTEURS_STATUT` de B affirme des essais, préavis, primes, minima par branche, **sans source vérifiable dans le dépôt**. |

## 3.4 Analyse et défense

| Écran de B | Destination | Pourquoi |
|---|---|---|
| `diag` (analyse d'un document) | **PA** `docs/analyse.html` | Fonction entièrement nouvelle pour A : on dépose un document, il est lu (PDF, DOCX, OCR) et confronté à une liste de contrôle par type. 18 types, `CHECKLIST` par article. Complète naturellement les audits : l'un constate ce qui manque, l'autre lit ce qui existe. |
| `defense-cph.html` | **PA** `docs/defense-cph.html` | Autonome, sans dépendance. Produit un document de procédure — c'est exactement la moitié « qui s'imprime ». |
| `juris` (base jurisprudentielle) | **RUB** de `docs/index.html` — **avec réserve** | A interroge **Judilibre en direct**, source officielle, et écarte toute réponse `relaxed`. La base figée de B porte des décisions marquées « réf. à vérifier ». Voir § 4.7. |
| `faq` (1 194 Q/R, 759 Ko) | **à décider** (question 6) | Rien d'équivalent dans A. Le volume est le problème, pas le principe. |

## 3.5 Prévention, harcèlement, santé

| Écran de B | Destination | Pourquoi |
|---|---|---|
| `harcmoral` (qualification, arrêt par arrêt) | **PA** `docs/harcelement.html` | Apport réel et original : chaque réponse rattachée à l'arrêt qui la fonde, plus la chronologie des faits à éditer. Aucun équivalent dans A. |
| `harcprev`, `harcele` | **RUB** de la même page + **RUB** de `docs/audit-sst.html` | A porte `SOC-AFF-HARCELEMENT`, `SOC-EGA-SEXISME`, `SOC-INS-REF-HARCELEMENT` ; le dossier de preuve exonératoire de B est le complément opératoire. |
| Le parcours `prevention` de B | **fondu** dans `moteur/sst/` + `docs/parcours.js` | Doublon — voir § 4.5. |

## 3.6 Ce qui relève d'un seul secteur

| Écran de B | Destination | Pourquoi |
|---|---|---|
| `temps` (conduite/repos), `remuneration` (IDCC 0016), `ri` (transport), `parc`, `tableau-bord` | **PA** unique `docs/transport.html`, ou abandon — **à décider** (question 7) | Ces cinq écrans sont **calibrés transport** : B lui-même pose un garde-fou (`TRANSPORT_ONLY`, bannière rouge « ne pas utiliser tel quel » hors transport). Ils reposent sur le code des transports et la CCN IDCC 0016 — **hors du champ du relais Légifrance de A**, qui ne sert que le code du travail. A ne pourra donc jamais les vérifier à sa propre règle. |
| `ferroviaire.html` (IDCC 3217) | même décision | Même raison, aggravée : convention de branche + droit européen. |
| `outils/offres.html` + Worker France Travail | **hors périmètre proposé** | Dépend d'un Cloudflare Worker externe et d'une API tierce. Ne produit ni constat ni document. |

## 3.7 Ce qui ne se porte pas — équivalent structurel absent

| Écran / dispositif de B | Ce qui manque dans A |
|---|---|
| **`personnel` (Espace RH)** | A n'a **aucun stockage de données nominatives de salariés**. B tient un registre chiffré (AES-GCM, clé dérivée PBKDF2 via `crypto.subtle`) avec import CSV/XLSX, fiches individuelles, alertes d'échéances, et synchronisation Supabase optionnelle. C'est un sous-système entier, pas un écran. **Décision requise** (question 1). |
| **`admin` + codes clients + Supabase** | A a `droits.js`, qui est **organisationnel et non sécuritaire** et l'écrit en clair. B a un contrôle d'accès par code haché, des codes clients algorithmiques, un verrouillage sectoriel, un compte administrateur, une table Supabase. Les deux modèles sont incompatibles en l'état. **Décision requise** (question 2). |
| **`parametrage`** | Recouvre `docs/profil.js` de A, en plus détaillé (organismes sociaux, gestionnaire de transport). Fusion des deux fiches à faire, pas de portage. |
| **`nouveautes` / `JX_CHANGELOG`** | A n'affiche pas d'historique de version. 234 Ko de données. Sans intérêt pour A : à laisser. |
| **`home` (tuiles par familles)** | A a une page d'accueil de recherche jurisprudentielle, pas un lanceur. Si l'on porte 15 écrans de plus, il en faudra un. |
| **`maquette-accueil.html`, `test.html`, `test.js`, `acces-demo-*.html`** | Résidus, maquettes, page morte : **ne rien porter**. |
| **`avocat-aj/`** | Site tiers : **ne rien porter**. |

---

# 4. Les doublons, un par un

## 4.1 Guide de régularisation

| | A | B |
|---|---|---|
| Où | `docs/audit-social.html` étapes 4 et 5 + `moteur/social/plan-social.js` | `ausDocPlan`, `ausDocRapport`, `AUS_PARC` |
| Priorisation | 3 niveaux motivés (exposition forte / pénalités constatées en contrôle / régularisations rapides) | tri par gravité |
| Renvoi au modèle | nomme le modèle de `documents.html` **quand il existe**, sinon écrit « modèle à établir » | renvoie à un générateur |
| Renvoi au parcours | 5 parcours de régularisation appelés depuis le guide | `AUS_PARC` : item → parcours + étape |
| Source | article lu avec LEGIARTI | article cité en clair, sans identifiant |

**Garder A**, et lui prendre `AUS_PARC` — la table item → parcours → **étape
précise** est plus fine que le renvoi de A vers un parcours entier. Charge :
faible, c'est une table de correspondance.

## 4.2 Vérification de l'existant

| | A | B |
|---|---|---|
| Verdicts | **cinq** : conforme, non conforme, risque à vérifier, donnée manquante, sans objet | **trois** : CONFORME, ÉCART, INDÉTERMINÉ |
| Règle « cocher n'est pas prouver » | explicite : « je l'ai » sans détail vérifiable rend *risque à vérifier*, jamais *conforme* | un CONFORME est prononcé dès que tous les points de contrôle sont à « oui » |
| Item renvoyé à un module dédié | **ne rend jamais conforme** | pas de règle |
| Item conventionnel / hors relais | **ne rend jamais conforme** | pas de règle |
| Profil vide | « donnée manquante » partout | l'effectif non renseigné affiche tout |
| Tests | tests contradictoires + `publier-social.js` **échoue** si une fiche vide produit une conformité | tests Playwright (`auditsoc.test.js`, 454 l.) |

**Garder A sans discussion.** Le dispositif de B est plus faible sur les deux
points qui comptent. Reprendre de B seulement les **questions de vérification**
(`verif`) des 75 items qui lui étaient propres — c'est déjà largement fait,
`CORRESPONDANCE.md` § 5.1 les dit intégrées.

## 4.3 Parcours embauche

| | A `embauche` | B `embauche` (parcours) + page `embauche` |
|---|---|---|
| Fondement | articles L. 1221-10, L. 1221-11, L. 1221-5-1, R. 1221-34/35, L. 1221-19/21/25/26, L. 1221-8/9, L. 1222-4 — **chacun avec son LEGIARTI**, quatre lectures concordantes | article cité en clair dans l'étape |
| Sortie | renvoie au modèle de `documents.html` | **produit** le contrat, la DPAE, la fiche de poste, la checklist, la promesse d'embauche |
| Préalables | oui, typés (document / information / pièce) | oui |

**Garder le parcours de A, prendre les générateurs de B.** C'est le cas d'école
du partage : A fonde, B imprime. Charge : moyenne (les générateurs de B sont
calibrés transport, il faut les rendre génériques — B a déjà commencé avec
`genContratGenerique`, `genContratBatiment`).

## 4.4 Temps de travail

| | A | B |
|---|---|---|
| Où | 7 obligations `SOC-DUR-*` + parcours `conges` | pages `temps` (transport), `temps2` (droit commun), parcours `tempstravail` |
| Fondement | L. 3121-16/18/20/22, L. 3131-1, L. 3132-1/2, L. 3121-30/33/38, D. 3121-24, L. 3121-60/64/65, L. 3123-3/6/7/8/27, L. 3242-1 — **tous LEGIARTI** | articles en clair ; `temps` repose sur le **code des transports** (D. 3312-45/47) et le règlement CE 561/2006, **hors du champ du relais** |
| Complétude | durées maximales, pause, repos, contingent, forfait-jours, temps partiel, mensualisation | idem pour `temps2`, plus la calculatrice conduite/repos |

**Garder A pour le fond, prendre de B la calculatrice et la fiche hebdo**,
mais uniquement si la question 7 (le transport) est tranchée par l'affirmative.
Le parcours `tempstravail` de B n'apporte rien que A n'ait : **écarter**.

## 4.5 Prévention et sécurité

| | A | B |
|---|---|---|
| Où | module `moteur/sst/` + `docs/audit-sst.html` + 20 obligations `SOC-SST-*` | parcours `prevention`, parcours `duerp`, pages `harcprev`, `harcele` |
| Fondement | L. 4121-1/2/3, L. 4121-3-1, L. 4141-1, L. 4154-2, R. 4224-14/15/16, R. 4227-4/29, R. 4121-5, R. 4624-29/31/33, L. 4624-2-2/6, R. 4624-46/47, D. 4622-22, L. 4644-1, R. 4323-91/95, R. 4512-6, R. 4515-4, L. 3122-1/2, L. 4153-8/9, R. 4153-40, R. 4228-10/19, R. 4542-16, R. 4412-38/39, R. 4121-1-1 — **tous LEGIARTI** | articles en clair |
| Sortie | audit à 5 verdicts + plan | parcours d'étapes + programme de prévention (`.docx` d'exemple fourni) |

**Garder A.** Le module SST de A est le plus fourni des deux (20 obligations
vérifiées contre une poignée de pages). De B, ne reprendre que le **parcours
`prevention` comme trame d'étapes** si l'utilisatrice le juge plus opératoire
que l'audit — et le fondre dans `docs/parcours.js`, réécrit sur les textes
de A. Charge : faible.

## 4.6 Motifs économiques — L. 1233-3

| | A | B |
|---|---|---|
| Où | module `moteur/economique/` (le plus gros de A : `moteur-eco.js` 880 Ko), `docs/audit.html`, dossiers de référence Sologne et Nordhavn, `CONTRE-AUDIT-MOTEUR-ECONOMIQUE.md` | page `pse` (26,9 Ko de HTML + `pse*` ≈ 129 Ko), `pse.html` autonome, `PSE_JURIS` 62 Ko |
| Jurisprudence | Judilibre en direct, `relaxed` écarté | base figée, « références à vérifier sur Légifrance », « base arrêtée à janvier 2026 » |
| Calibrage | générique, audité, avec contre-épreuves | `pse.html` explicitement « calibré pour une structure de type organisme de formation », IDCC 1516 |
| Module PSE | A a **en plus** un module `pse/` distinct et son audit | — |

**Garder A, franchement.** L'apport de B se limite à la **présentation** — les
quatre motifs mis côte à côte avec décisions validantes et censures, et le
déroulé 0→7 avec calendrier. À reprendre comme **habillage** de
`docs/audit.html` / `docs/audit-pse.html`, jamais comme source. La base
`PSE_JURIS` ne doit **pas** entrer dans A : elle contredit la règle Judilibre
du dépôt.

## 4.7 Référentiels : 90 (A) contre 147 (B)

Le compte brut est trompeur, `CORRESPONDANCE.md` l'établit et le travail du
23 août l'a réglé : A est passé de 41 à **90 obligations** en absorbant
49 items de B, **chacun avec ses articles capturés au relais** (172 articles,
172 concordants, zéro écart, quatre lectures).

État à ce jour :

| | A | B |
|---|---|---|
| Items | 90 obligations de chapeau + 8 modules détaillés | 147 items à plat |
| Articles avec LEGIARTI | **172, tous vérifiés deux à quatre fois** | **zéro** — `grep LEGIARTI` sur `AUS_OBLIG` rend 0 |
| Items sans source du tout | aucun (ceux dont l'article n'est pas lu portent une formulation prudente) | **54 items sur 147 sans champ `src`** |
| Verdicts | 5 | 3 |
| Chaîne de publication | échoue si un article cité n'est pas lu à la source | — |

**Garder A.** Reste à traiter, dans B, ce que le relevé du 23 août ne couvrait
pas encore :

- `atcpam` (déclaration de l'accident du travail à la caisse) et `amianterep`
  (repérage amiante avant travaux) : **deux items nouveaux de B, absents de A**.
  À capturer au relais puis à intégrer, ou à écarter s'ils sortent du code du
  travail (le repérage amiante relève pour partie du code de la santé publique).
- `rgpd` (registre des traitements, art. 30 du règlement européen) : déjà
  **écarté** par A, hors du champ du relais. Décision maintenue.
- Les 7 obligations propres à A (`SOC-INS-GROUPE`, `SOC-AFF-FUMER`,
  `SOC-NEG-EGALITE`, `SOC-NEG-PSE`, `SOC-EPA-LIVRET`,
  `SOC-EPA-PREVOYANCE-CADRES`, `SOC-CCN-OBLIGATIONS`) restent propres à A : le
  patch qui devait les porter dans B est caduc et **la fusion le rend inutile**.

## 4.8 Modèles de documents : 23 (A) contre ~60 générateurs (B)

A : 23 modèles dans `documents.html`, tous sur les **relations collectives et
la discipline** (convocation et PV de CSE, accords et PV de NAO, note RH,
réclamation, harcèlement, enquête interne, sanctions, commissions, expertise,
installation du comité, RI du comité, documentation économique,
remise-reprise).

B : les générateurs sont éclatés par module, sans catalogue unique. Relevé :

| Famille | Documents |
|---|---|
| `genDocElectionTEC` | 17 : note d'info (1er/2e tour), invitations OSR, PAP unilatéral, convocations (1er/2e), bulletins (1er/2e), émargement, calendrier, PV 1er tour, PV 2e tour, PV de carence total, PV d'absence OSR, affichage des résultats |
| `genDocDisc` | 12 : avertissement, blâme, convocation, mise à pied conservatoire, mise à pied disciplinaire, rétrogradation, licenciement faute simple, licenciement faute grave, inaptitude, reclassement, certificat de travail, solde de tout compte |
| `genDocAbsence` | 5 : attestation IJSS, contre-visite, mise en demeure abandon de poste, convocation visite de reprise, reprise AT |
| `genDocCSE` | 4 : note d'information, invitation OSR, PAP, PV de carence |
| Embauche / contrat | `genContrat` (+ Bâtiment, générique), `genDPAE`, `genFichePoste` (×3), `genChecklistEmbauche` (×3), `genBulletinType` (×3), promesse d'embauche, avenant, période d'essai |
| RI | `genRI`, `genRIBatiment`, `genRITertiaire`, `genProcedureRI` |
| Négociation | accord rémunération-temps-partage, accord égalité-QVCT, accord GEPP, plan d'action égalité, PV de désaccord, bordereau |
| Comité | trame de RI du comité, PV de désignation, lettre de désignation, bordereau de pièces |
| Registres | registre véhicules, registre conducteurs, fiche hebdo, fiche de vérification |
| Défense | `defense-cph.html` : conclusions en défense |

**Ne pas choisir : additionner.** Les deux ensembles ne se recouvrent presque
pas — A est collectif, B est individuel et électoral. Les seuls
chevauchements réels sont la **convocation CSE**, l'**ordre du jour**, le **PV
de CSE**, le **PAP**, le **RI du comité** et le **PV de désaccord NAO**. Pour
ces six : **garder ceux de A** (ils sont sur `documents.html`, page unique,
autonome, avec profil pré-rempli), et **reprendre de B les champs et les
mentions qui manquent**, sans changer de trame.

Charge : le portage des générateurs de B est le **plus gros lot** du plan.

---

# 5. Les points durs

## 5.1 La gestion d'accès de B — le point le plus dur

B a un **contrôle d'accès de vente**, A a une **répartition de travail**.

Ce que B fait (lu dans `verifierCode`, lignes 2307 s.) :
- quatre familles de codes hachés en SHA-256 : `_ADMIN_HASH`, `_CODE_HASH`,
  `_TEMP_HASH` (avec `_TEMP_EXPIRY`), `_SECTOR_CODES` (un code par secteur), et
  un cinquième chemin, `_validAlgoCode`, pour les **codes clients
  algorithmiques** engendrés par la page `admin` ;
- la session est marquée dans `sessionStorage` (`jte_ok`, `jte_admin`,
  `jte_sector`, `jte_code`, `jte_trial`) ;
- `goPage` refuse toute page hors de la liste gratuite
  (`audit`, `rgpd`, `mentions`, `cgu`, `nouveautes`, `personnel`) tant que
  `jte_ok !== '1'` ;
- le code d'accès **impose un secteur**, qui reconfigure toute l'application
  (`applyClientSector`, `sectorGuard`, `jxSecteurBlocs` sur `data-sec`) ;
- l'administrateur seul voit `admin`, le lien du cabinet et le registre des
  codes.

Ce que A fait : `Droits.peut(module, action)` et `Journal.acte(...)`, avec un
fournisseur local interchangeable, des codes salés-hachés, et une phrase
affichée en clair : « les droits sont organisationnels, non sécuritaires ».

**Ces deux modèles ne se superposent pas.** Le modèle de B est un modèle
d'abonnement (qui paie voit quoi) ; celui de A est un modèle d'équipe (qui
fait quoi). Trois issues, aucune gratuite :

1. abandonner le contrôle d'accès de B et n'emporter que les écrans → simple,
   mais fait disparaître le modèle commercial ;
2. porter le contrôle d'accès dans le fournisseur de `droits.js` → propre sur
   le papier (`Droits.brancher`), mais il faut rendre `Droits.peut` capable de
   dire « non » à une page entière, ce qu'il ne fait pas aujourd'hui ;
3. garder les deux, l'un devant l'autre → deux écrans de connexion.

C'est la **question 2**, et elle bloque le lot 0.

## 5.2 Le verrouillage sectoriel

Indissociable du point précédent, mais distinct. B fait dépendre du secteur :
le contenu affiché (`data-sec`), les grilles de classification
(`JX_GRILLES`, `CONTRAT_TR_OPTS`), les durées d'équivalence, les documents
(`SECTOR_DOC`), la jurisprudence, et une **bannière rouge d'avertissement**
(`sectorGuard`) sur les modules calibrés transport. A ne connaît le secteur que
comme un champ du profil et un numéro IDCC. Porter les écrans de B sans porter
ce mécanisme, c'est **servir du droit transport à une banque** — le défaut
exact que `sectorGuard` a été écrit pour couvrir.

## 5.3 Supabase et les données personnelles

Trois usages, de gravité croissante :

- `cm_leads` (prospects du Contrôle-minute) : schéma connu, RLS écrite,
  insertion anonyme, lecture réservée à un compte administrateur. Portable ou
  abandonnable sans conséquence technique.
- Le **registre des codes clients** : lu par la page `admin`, schéma **non
  présent dans le dépôt**.
- La **synchronisation de l'Espace RH** (entreprise, personnel, conducteurs,
  véhicules, RLS par compte) : schéma **non présent dans le dépôt**. Ce sont
  des **données nominatives de salariés**. Le `SB_ANON` est en clair dans
  `index.html` — c'est normal pour une clé anonyme, mais cela signifie que la
  sécurité repose **entièrement** sur les politiques RLS, qu'on ne peut pas
  relire ici.

A, aujourd'hui, n'envoie **rien** : `profil.js` le dit, `sw.js` le dit,
`DROITS.md` le dit. Faire entrer Supabase dans A change la nature du dépôt.

## 5.4 Le service worker et le cache

Les deux stratégies sont **opposées, et chacune pour une bonne raison** :

| | A | B |
|---|---|---|
| Stratégie navigation | **réseau d'abord**, cache en secours | **cache d'abord**, rafraîchissement en arrière-plan |
| Motif écrit | « une stratégie cache d'abord servirait une version périmée après chaque mise à jour » | « le réseau d'abord obligeait le téléphone à retélécharger index.html (880 Ko compressés) AVANT le moindre affichage » |
| Nom de cache | `jurisprudence-5.5` | `jem-v200` |
| Mise à jour forcée | par changement de nom de cache | `version.json` **toujours réseau**, comparé à `JX_BUILD`, mise à jour automatique |
| Robustesse install | — | `c.add()` un par un : une ressource manquante ne fait pas tomber le reste |

Le motif de B (le poids du fichier unique) **disparaît** si l'on éclate B en
pages : la stratégie de A redevient tenable. Mais il faut alors reprendre de B
deux choses qui sont meilleures : la **mise en cache une par une** et le
**`version.json` toujours réseau**. Et il faut ajouter au `ESSENTIELS` de A
chaque page portée — quinze entrées environ.

## 5.5 Les tests de B

- **`tests/integrite.py` porte un chemin absolu en dur** :
  `P='/home/user/JURISTE-EXPERT-/index.html'` (ligne 5), avec une casse qui ne
  correspond même pas au répertoire de travail actuel (`juriste-expert-`). Il
  est **inexécutable tel quel** ici. Et surtout il est écrit **pour un fichier
  unique** : il cherche les fonctions déclarées deux fois dans les blocs
  `<script>`, les fonctions appelées depuis un attribut `onclick` et non
  définies, les `goPage` vers une page inexistante. Aucune de ces trois
  vérifications n'a de sens une fois B éclaté en pages.
- Les **28 tests Playwright** (6 507 lignes) ouvrent l'application dans
  Chromium et naviguent par `goPage`. `retour.test.js` « ouvre et vérifie les
  42 pages » ; `presentation.test.js` **mesure des pixels sur un écran de
  téléphone**. Ils sont tous liés à la structure « une page, tout dedans ».
- **Aucun test de B n'a été exécuté ici.** Leur état est inconnu.

Conclusion : les tests de B **ne se portent pas**. Ce qui se porte, ce sont
leurs **intentions** — et plusieurs sont excellentes et absentes de A :
`cloisonnement` (un dossier client ne déborde pas sur un autre),
`secteur-fuite` (aucun contenu d'un secteur ne fuit dans un autre),
`report` (ce qui est saisi une fois n'est plus redemandé), `retour` (aucune
page sans retour), `seuils` (toutes les bornes d'effectif). À réécrire pour A.

## 5.6 Le volume et le style

- `index.html` de B : **3,98 Mo, 33 351 lignes, 1 106 fonctions**, tout dans
  un seul document, avec 2,3 Mo de données littérales. C'est copiable, ce n'est
  pas maintenable en l'état.
- **Deux chartes graphiques opposées** : B est sombre (fonds `#0b1722`,
  `#12203a`, or `#c9a84c`, emojis dans les titres, barre d'action collante) ;
  A est clair (`#fff`, bordeaux `#8b1e2d`, en-tête dégradé, sobre). Chaque
  écran porté doit être **rhabillé**, ou l'application aura deux visages.
- **Navigation opposée** : B navigue par `goPage` sans changer d'URL (aucune
  page de B n'a d'adresse propre — `docs/juris-expert.js` de A le note :
  les liens `#/<module>` retombent sur l'accueil). A navigue par fichiers
  `.html`. Porter un écran de B, c'est **lui donner une URL**, ce qui est un
  gain — mais casse tout lien interne écrit en `goPage('…')`.
- **Styles en ligne massifs** dans B (`style="…"` construits par
  concaténation de chaînes) : ils passeront tels quels, mais ne suivront pas la
  charte de A tant qu'ils ne sont pas réécrits.

## 5.7 Les dépendances externes

| Dépendance | Où | Sort proposé |
|---|---|---|
| `vendor/xlsx.full.min.js` (882 Ko) | import du registre du personnel | à copier tel quel dans `docs/vendor/` si l'Espace RH est porté |
| `vendor/jszip.min.js` (98 Ko) | extraction DOCX de l'analyse de documents | idem, requis par `diag` |
| **pdf.js par CDN** (`cdn.jsdelivr.net`, `cdnjs.cloudflare.com`) | analyse d'un document PDF | **à internaliser** dans `docs/vendor/` : A ne charge aucun script tiers aujourd'hui |
| **tesseract.js par CDN** + `tessdata.projectnaptha.com` | OCR des documents image | idem, et le fichier de données de langue est **lourd** — à décider s'il faut l'OCR |
| **SDK Supabase par CDN** | compte en ligne | dépend de la question 1 |
| **Cloudflare Worker France Travail** | `outils/offres.html` | hors périmètre proposé |
| **forminit.com / web3forms.com** (`WEB3_KEY` en clair dans `index.html`) | envoi des demandes d'abonnement | à abandonner : A a ses propres fonctions Netlify |

La `CSP` de B autorise tout cela. A **n'en a aucune** : son `netlify.toml` ne
pose qu'un seul en-tête, `X-Robots-Tag: noindex` sur `/.netlify/functions/*`.
Reprendre la CSP de B, réduite aux seules origines réellement conservées, est
un gain net.

## 5.8 Les patches d'harmonisation sont caducs

Vérifié : `git apply --check` échoue pour les deux patches sur `b7e3ca9`. Ils
visaient `47240ad`. Ils gardent leur valeur de **spécification** (leurs deux
NOTE décrivent exactement ce qui devait passer) et **aucune** valeur
d'application. La fusion les rend d'ailleurs sans objet : il n'y a plus lieu
d'enrichir B si B est absorbé.

---

# 6. Le plan de portage, en lots

Charge relative : **petit** ≈ une séance ; **moyen** ≈ deux à quatre ;
**lourd** ≈ au-delà, ou dépendant d'une décision.

### Lot 0 — Les décisions et le socle (bloquant)

**Contient** : réponses aux sept questions du § 7 ; choix du modèle d'accès ;
choix du sort de l'Espace RH ; création de `docs/vendor/` avec `xlsx` et
`jszip` copiés ; ajout d'une CSP dans `netlify.toml` de A ; reprise dans
`docs/sw.js` de A des deux bonnes idées de B (mise en cache une par une,
`version.json` toujours réseau).

**Vérifier avant de le dire fait** : `docs/sw.js` s'installe encore quand une
ressource de `ESSENTIELS` manque ; la CSP ne casse aucune page existante de A
(les 15 pages ouvertes une à une, console vide) ; aucune clé, aucun secret dans
ce qui est copié.

**Charge : moyen.**

### Lot 1 — Les élections professionnelles

**Contient** : `elections-cse.html` porté en `docs/elections.html` ; les
17 documents de `genDocElectionTEC` ; la page `moncse` en rubrique ;
rattachement au profil de `profil.js` ; entrée dans `sw.js` et dans la
navigation de A ; retrait du renvoi correspondant de `docs/juris-expert.js`.

**Pourquoi en premier** : c'est le seul module de B **déjà autonome**, sans
dépendance, et il comble un trou que A reconnaît par écrit.

**Vérifier** : le calcul des sièges et des collèges donne les mêmes résultats
qu'avant portage sur trois effectifs de bord (10/11, 24/25, 49/50) ; les
17 documents s'ouvrent et s'impriment ; la page fonctionne **hors connexion** ;
`docs/juris-expert.js` ne renvoie plus vers B pour les élections.

**Charge : moyen.**

### Lot 2 — Les générateurs de documents individuels

**Contient** : les 12 documents disciplinaires (`genDocDisc`), les 5 courriers
d'absence (`genDocAbsence`), le contrat + DPAE + fiche de poste + checklist
d'embauche, le solde de tout compte et le certificat de travail. Destination :
`docs/documents.html`, en nouvelles rubriques.

**Vérifier** : chaque document se pré-remplit depuis `profil.js` ; aucun
document ne cite un article que A n'a pas lu à la source (sinon la mention
prudente s'impose) ; les six modèles en doublon (§ 4.8) restent ceux de A,
enrichis et non remplacés ; `Journal.acte` enregistre la production.

**Charge : lourd** — c'est le plus gros lot du plan.

### Lot 3 — L'analyse d'un document

**Contient** : `diag` porté en `docs/analyse.html` ; `DOCS` (18 types),
`CHECKLIST`, `DIAG_VAGUE` ; extraction DOCX par `jszip` ; **pdf.js
internalisé** ; l'OCR seulement si la question 7 bis le veut.

**Vérifier** : chaque article cité par une ligne de `CHECKLIST` est présent
dans un `textes-*.json` de A avec son LEGIARTI, ou bien la ligne est reformulée
en « à vérifier » ; aucun appel réseau vers un CDN ; les 18 types reconnus sur
un jeu de documents d'essai.

**Charge : lourd.**

### Lot 4 — Harcèlement et prévention

**Contient** : `harcmoral` (qualification arrêt par arrêt) en
`docs/harcelement.html`, avec `harcprev` et `harcele` en rubriques ; la
chronologie des faits à éditer ; le parcours `prevention` de B fondu dans
`docs/parcours.js` sur les textes de A.

**Vérifier** : chaque arrêt cité est retrouvé dans Judilibre (règle du dépôt :
`relaxed` écarté) ou bien signalé « à vérifier » ; le parcours ne contredit
aucune obligation `SOC-SST-*` ; `publier-social.js` reste vert.

**Charge : moyen.**

### Lot 5 — Le comité, la surface qui manque

**Contient** : l'effectif mois par mois (`socle`), le calcul des budgets au
centime et l'effet de cliquet (`csebud`), le calendrier engendré (`csecal`), la
feuille de présence et le recompte des votes (`csereu`), le bordereau de pièces
(`csedos`), la note à deux jours et le registre spécial (`csercl`). Tous en
rubriques de `docs/audit-cse.html` et `docs/documents.html`.

**Vérifier** : chaque calcul est confronté à `moteur/cse/tests-cse.js` ; aucune
règle nouvelle n'entre sans son article LEGIARTI ; `publier-cse.js` reste vert ;
les bornes 10/11, 49/50, 299/300, 999/1000, **1999/2000/2001** (le seuil des
0,22 % se déclenche **à** 2 000) donnent le bon résultat des deux côtés.

**Charge : moyen.**

### Lot 6 — Calculs, défense, statut conventionnel

**Contient** : `calc` en `docs/calculs.html` ; `defense-cph.html` porté tel
quel ; `statut` selon la réponse à la question 5.

**Vérifier** : le barème Macron rendu par `calc` est confronté à la table de
L. 1235-3 lue au relais ; l'indemnité légale à R. 1234-2 ; aucune affirmation
conventionnelle sans la mention « selon la convention applicable : à vérifier ».

**Charge : moyen.**

### Lot 7 — Les deux référentiels, la dernière marche

**Contient** : capture au relais de `atcpam` et `amianterep` (ou décision
motivée de les écarter) ; mise à jour de `CORRESPONDANCE.md` sur l'état
`b7e3ca9` ; suppression des deux patches caducs de `harmonisation/` ou mention
en tête qu'ils sont périmés.

**Vérifier** : `verifier-textes-social.js` rend zéro écart ;
`publier-social.js` va au bout.

**Charge : petit.**

### Lot 8 — La navigation et l'accueil

**Contient** : une page d'accueil-lanceur pour A (elle en aura besoin avec une
trentaine d'écrans) ; ajout des pages portées à `ESSENTIELS` de `docs/sw.js` ;
mise à jour de `docs/guides.html` ; retrait de `docs/juris-expert.js` des
renvois devenus internes.

**Vérifier** : chaque page portée est accessible en deux clics depuis
l'accueil ; **aucune page sans retour** (le test `retour` de B, réécrit pour A) ;
installation PWA testée hors connexion.

**Charge : moyen.**

### Lot 9 — Les tests

**Contient** : réécriture pour A, sans reprendre le code de B, des intentions
de `cloisonnement`, `secteur-fuite`, `report`, `retour`, `seuils`. Extension de
`moteur/commun/epreuve-navigateur.js`.

**Vérifier** : les cinq épreuves passent ; elles **échouent** quand on
réintroduit volontairement le défaut qu'elles surveillent (sans quoi elles ne
prouvent rien).

**Charge : moyen.**

### Lot X — Sous condition de décision

- **Espace RH** (`personnel`, `rx*`, `rh*`, chiffrement, import XLSX, Supabase)
  — **lourd**, dépend de la question 1.
- **Contrôle d'accès et codes clients** (`admin`, `verifierCode`,
  `applyClientSector`, `sectorGuard`) — **lourd**, dépend de la question 2.
- **Transport** (`temps`, `remuneration`, `ri`, `parc`, `tableau-bord`) et
  **ferroviaire** — **lourd**, dépend de la question 7, et **A ne pourra jamais
  vérifier ces textes à sa propre règle** (hors code du travail).
- **FAQ** (759 Ko) — **moyen**, dépend de la question 6.
- **Contrôle-minute** (`audit` + `controle-minute.html` + `cm_leads`) —
  **moyen**, dépend de la question 2 (c'est le produit d'appel gratuit).
- **`outils/offres.html`** + Worker France Travail — **hors périmètre proposé**.
- **`avocat-aj/`** — **hors périmètre**, à déplacer dans son propre dépôt.

---

# 7. Ce qui doit être décidé avant de commencer

Sept questions fermées. Aucune ne peut être tranchée par déduction.

1. **L'Espace RH (registre nominatif des salariés, chiffré sur l'appareil,
   synchronisable) entre-t-il dans JURISPRUDENCE ?**
   → oui / non. *Si oui, l'application cesse d'être « rien ne quitte le
   poste » dès que la synchronisation est activée.*

2. **Le contrôle d'accès par code de Juris Expert (codes clients, code
   administrateur, verrouillage sectoriel, module gratuit d'appel) est-il
   conservé ?**
   → oui / non. *Si non, le modèle d'abonnement disparaît avec lui. Si oui, il
   faut le loger dans `droits.js`, qui ne sait pas aujourd'hui refuser une page
   entière.*

3. **Faut-il un tableau de bord « Mon espace CSE » (l'écran `csehub` de B), ou
   l'entrée par les audits suffit-elle ?**
   → tableau de bord / entrée par audit.

4. **Les absences et congés (maladie, AT/MP, maternité, abandon de poste)
   deviennent-ils un module `moteur/` à part entière, avec textes vérifiés et
   contrôles à cinq verdicts ?**
   → module / simple rubrique de l'audit social.

5. **JURISPRUDENCE peut-elle afficher des données conventionnelles chiffrées
   (essai, préavis, primes, minima des 9 branches de `SECTEURS_STATUT`) alors
   que le relais ne sert que le code du travail et qu'aucune de ces valeurs
   n'est vérifiable dans le dépôt ?**
   → oui, avec mention « à vérifier » / non, on n'affiche rien.

6. **La FAQ salariés (1 194 questions, 759 Ko) est-elle reprise ?**
   → oui / non.

7. **Les modules calibrés transport (conduite/repos, rémunération IDCC 0016,
   RI transport, parc, tableau de bord conducteurs) et le module ferroviaire
   IDCC 3217 sont-ils repris ?**
   → oui / non. *Ils reposent sur le code des transports et des conventions de
   branche : hors du champ du relais Légifrance, donc invérifiables à la règle
   du dépôt.*

**7 bis** (subordonnée à la question sur l'analyse de documents) : **l'OCR des
documents image est-il conservé ?** → oui / non. *Il impose d'internaliser
tesseract.js et son fichier de données de langue, qui est lourd.*
