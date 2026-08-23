/* Cinquième passe de capture : les matières que le référentiel social ignorait
   et que l'audit de JURIS EXPERT couvre — durée du travail et repos, temps
   partiel, congés payés, paie, embauche et information du salarié, contrat à
   durée déterminée, fin de contrat, égalité et non-discrimination, formation,
   santé au travail non traitée par le module SST, section syndicale.

   Mêmes règles que les passes précédentes, sans exception :
     — filtre par le NOM du code (« Code du travail »), jamais un LEGITEXT ;
     — DEUX lectures concordantes, espacées, avant toute conclusion ;
     — critère de CONTENU : l'article rendu doit parler de ce qu'on cherche,
       faute de quoi c'est un homonyme et il est écarté ;
     — l'identifiant de version (LEGIARTI) est consigné avec le texte.
   Ce qui ne se confirme pas n'entre pas : il est consigné dans
   textes-social-non-confirmes.json, et l'obligation qui voulait le citer se
   replie sur une formulation prudente.

   Les autres dépôts de textes déjà vérifiés du dépôt (module économique, CSE,
   SST, discipline, NAO, BDESE) servent de contre-lecture : un identifiant de
   version différent est signalé, jamais corrigé en silence.

   Usage : node capturer-textes-social-5.js [AAAA-MM-JJ]
   Le moteur de capture est commun aux passes : capture-social.js.

   HUIT FRAGMENTS DE CETTE TABLE ÉTAIENT FAUX à la première exécution — ils
   cherchaient une formule voisine de celle qu'emploie l'article. Ils ont été
   corrigés ici, sur le texte lu, et les huit articles rattrapés par la
   septième passe. Le relais n'y était pour rien : les huit lectures étaient
   stables, six fois sur six, avec le même identifiant de version.          */
const { capturer } = require("./capture-social.js");

/* numéro → fragments attendus dans le texte (critère de contenu). */
const ARTICLES = {
  /* ── durée du travail et repos ─────────────────────────────────────── */
  "L3121-18": ["dix heures"],
  "L3121-20": ["quarante-huit heures"],
  "L3121-22": ["quarante-quatre heures"],
  "L3121-16": ["vingt minutes"],
  "L3131-1":  ["onze heures"],
  "L3132-1":  ["plus de six jours"],
  "L3132-2":  ["vingt-quatre heures consécutives"],
  "L3121-30": ["contingent annuel"],
  "L3121-33": ["contingent annuel"],
  "D3121-24": ["deux cent vingt heures"],
  "L3121-38": ["contrepartie obligatoire sous forme de repos"],
  "L3121-64": ["conventions individuelles de forfait"],
  "L3121-65": ["charge de travail"],
  "L3121-60": ["charge de travail"],
  "D3171-8":  ["horaire collectif"],
  "D3171-16": ["à la disposition"],
  /* ── temps partiel ─────────────────────────────────────────────────── */
  "L3123-6":  ["temps partiel", "écrit"],
  "L3123-8":  ["heures complémentaires"],
  "L3123-7":  ["durée minimale"],
  "L3123-27": ["vingt-quatre heures"],
  "L3123-3":  ["priorité"],
  /* ── congés payés ──────────────────────────────────────────────────── */
  "L3141-3":  ["deux jours et demi"],
  "L3141-13": ["1er mai"],
  "L3141-15": ["ordre des départs"],
  "L3141-16": ["ordre des départs"],
  "D3141-5":  ["deux mois"],
  "D3141-6":  ["ordre des départs"],
  "L3133-7":  ["journée de solidarité"],
  "L3133-8":  ["sept heures"],
  /* ── paie ──────────────────────────────────────────────────────────── */
  "L3242-1":  ["acompte"],
  /* ── embauche et information du salarié ────────────────────────────── */
  "L1221-10": ["déclaration"],
  "L1221-11": ["déclaration"],
  "L1221-5-1": ["information"],
  "R1221-34": ["information"],
  "R1221-35": ["information"],
  "L1221-19": ["période d'essai"],
  "L1221-21": ["renouvel"],
  "L1221-25": ["délai de prévenance"],
  "L1221-26": ["quarante-huit heures"],
  "L1221-8":  ["méthodes et"],
  "L1221-9":  ["candidat"],
  "L1222-4":  ["collectée par un dispositif"],
  /* ── contrat à durée déterminée ────────────────────────────────────── */
  "L1242-12": ["écrit"],
  "L1242-2":  ["remplacement"],
  "L1242-13": ["deux jours ouvrables"],
  "L1244-3":  ["délai de carence"],
  "L1244-3-1": ["délai de carence"],
  "L1243-8":  ["10 %"],
  /* ── fin du contrat ────────────────────────────────────────────────── */
  "L1234-19": ["expiration du contrat de travail", "certificat"],
  "D1234-6":  ["certificat de travail"],
  "L1234-20": ["solde de tout compte"],
  "R1234-9":  ["attestation"],
  "L1232-2":  ["entretien préalable"],
  "L1232-4":  ["assist"],
  "L1232-6":  ["lettre recommandée"],
  "L1235-2":  ["motifs"],
  "R1232-13": ["quinze jours"],
  "L1237-11": ["rupture conventionnelle"],
  "L1237-13": ["rétractation"],
  "L1237-14": ["homologation"],
  "L1226-2":  ["inapte"],
  "L1226-4":  ["un mois"],
  /* ── égalité, non-discrimination, handicap, alerte ─────────────────── */
  "L3221-2":  ["valeur égale"],
  "L1132-1":  ["origine"],
  "L1132-4":  ["méconnaissance"],
  "L1142-2-1": ["agissement sexiste"],
  "L5213-6":  ["mesures appropriées"],
  "L5213-6-1": ["handicap"],
  "L1131-2":  ["discrimination"],
  "L1132-3-3": ["témoigné"],
  /* ── formation ─────────────────────────────────────────────────────── */
  "L6131-1":  ["contribution"],
  "L6323-13": ["abondement"],
  /* ── santé au travail non traitée par le module SST ────────────────── */
  "L4141-1":  ["information"],
  "L4154-2":  ["formation renforcée"],
  "R4224-14": ["premiers secours"],
  "R4224-15": ["secours"],
  "R4224-16": ["secours"],
  "R4227-29": ["incendie"],
  "R4121-5":  ["douze heures"],
  "R4624-33": ["accident du travail"],
  "R4624-31": ["reprise"],
  "L4624-2-2": ["mi-carrière"],
  "L4624-6":  ["écrit"],
  "R4624-46": ["fiche d'entreprise"],
  "R4624-47": ["fiche d'entreprise"],
  "L4644-1":  ["compétent"],
  "R4323-95": ["protection individuelle"],
  "R4512-6":  ["plan de prévention"],
  "R4515-4":  ["protocole de sécurité"],
  "L3122-1":  ["travail de nuit"],
  "L3122-2":  ["travail de nuit"],
  "L4153-8":  ["dix-huit ans"],
  /* ── section syndicale ─────────────────────────────────────────────── */
  "L2142-3":  ["affichage"],
  "L2142-4":  ["publications et tracts"],
  "L2142-8":  ["local"],
  "L2411-3":  ["délégué syndical"],
  /* ── partage de la valeur et déconnexion ───────────────────────────── */
  "L3346-1":  ["bénéfice"],
  "L2242-17": ["déconnexion"],
};

capturer(ARTICLES, "cinquième passe");
