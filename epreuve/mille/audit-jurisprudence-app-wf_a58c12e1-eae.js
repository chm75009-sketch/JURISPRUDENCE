export const meta = {
  name: 'audit-jurisprudence-app',
  description: "Audit complet de l'application JURISPRUDENCE par zones, avec vérification adversariale des constats",
  phases: [
    { title: 'Revue', detail: '12 zones de l\'application examinées en parallèle' },
    { title: 'Vérification', detail: 'chaque constat soumis à trois sceptiques indépendants' },
  ],
}

const FINDINGS_SCHEMA = {
  type: "object",
  properties: {
    area: { type: "string" },
    findings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          file: { type: "string" },
          line: { type: "number" },
          summary: { type: "string" },
          failure_scenario: { type: "string" },
          severity: { type: "string", enum: ["bloquant", "majeur", "mineur"] },
        },
        required: ["file", "summary", "failure_scenario", "severity"],
      },
    },
  },
  required: ["area", "findings"],
}

const VERDICT_SCHEMA = {
  type: "object",
  properties: {
    refuted: { type: "boolean" },
    reason: { type: "string" },
  },
  required: ["refuted", "reason"],
}

const CONTEXTE = `Application : JURISPRUDENCE, une PWA statique (dossier docs/ servi par GitHub Pages)
pour une avocate en droit social. Sept modules d'audit (social, bdese, cse, discipline, nao,
pse, sst), chacun avec : un questionnaire d'orientation (moteur/<module>/questionnaire-*.js),
un référentiel d'obligations (moteur/<module>/referentiel-*.js), une page d'audit
(docs/audit-<module>.html) suivant un parcours en six étapes (fiche, questionnaire, rapport,
guide de régularisation, régularisation, vérification), et des générateurs de documents
(docs/documents-<module>*.js).

Principe architectural central, le "deux temps" : l'orientation pose des questions rapides,
déclaratives, à plat ; la vérification, plus tard, revient en détail avec preuves, mais
seulement sur ce que l'orientation a déjà jugé applicable. Les bugs réels déjà trouvés cette
session dans cette famille : une question posée sur un CSE alors que son existence même
n'avait pas été confirmée ; une case à cocher "nombre d'établissements" redemandée après un
"non" à la question précédente ; un mot ambigu ("le comité") sans préciser CSE ou CSSCT ; des
listes de liens statiques dans l'accueil qui ne tenaient pas compte du profil de l'entreprise ;
un champ de saisie (convention collective) qui semblait verrouillé après un premier choix,
parce que la liste se refiltrait sur le texte déjà choisi et ne retrouvait donc plus qu'elle-même ;
un service worker en cache d'abord au lieu de réseau d'abord, qui servait une page vieille de
plusieurs minutes après chaque déploiement.

Le profil d'entreprise ("fiche", clé localStorage "profil-entreprise", champs définis dans
docs/profil.js) est saisi UNE SEULE FOIS et ne doit plus jamais être redemandé : effectif,
secteur, convention collective, groupe, établissements distincts, etc. Chaque module doit lire
ce profil pour adapter ses questions — jamais reposer une question dont la réponse est déjà
dans la fiche, et jamais poser une question sans rapport avec ce que la fiche ou une réponse
précédente a déjà établi (ex: poser une question sur les comptes du CSE avant d'avoir confirmé
que le CSE existe).

Tu es un des douze agents chargés de trouver, dans un périmètre précis, exactement ce type de
défaut : logique conditionnelle manquante ou fausse, question redondante ou sans objet,
verrou d'interface, erreur d'affichage, incohérence entre ce que la fiche dit et ce qu'un
module demande, texte trompeur ou ambigu pour une utilisatrice non technicienne, référence à
un article de droit du travail non vérifiable ou mal citée. Ne rapporte QUE ce que tu as
vérifié en lisant le code réel — jamais une supposition. Pour chaque défaut, cite le fichier,
la ligne si possible, et un scénario concret et rejouable (quelle réponse produit quel résultat
faux). N'apporte AUCUNE modification au code : ton rôle est d'examiner et de rapporter, pas de
corriger. Si tu ne trouves rien de solide dans ton périmètre, renvoie une liste vide — n'invente
rien pour avoir quelque chose à dire.`

const ZONES = [
  {
    key: "accueil",
    prompt: `${CONTEXTE}\n\nTon périmètre : l'écran d'accueil et la fiche entreprise —
docs/index.html, docs/auditer.html, docs/gerer.html, docs/profil.js, docs/idcc.js.
Ces fichiers viennent d'être largement modifiés dans cette session (écran 1 = fiche seule,
écran 2 = deux boutons Auditer/Gérer, liste d'audits à la carte annotée par la fiche, correctif
du champ convention collective qui semblait verrouillé, rechargement automatique après mise à
jour du service worker). Cherche ce qui a pu être manqué ou mal recollé dans ces changements
récents : incohérence entre les trois pages, condition de seuil fausse ou dupliquée, valeur du
profil mal lue ou mal écrite, champ qui redemande une information déjà connue, bouton ou lien
mort, texte qui ne correspond plus à l'état réel de l'écran.`,
  },
  {
    key: "sw-manifest",
    prompt: `${CONTEXTE}\n\nTon périmètre : docs/sw.js et docs/manifest.json — le service worker
et le manifeste PWA. Vérifie : la stratégie réseau-d'abord est bien appliquée à toutes les
requêtes GET same-origin y compris les navigations ; la liste ESSENTIELS est cohérente avec les
fichiers qui existent réellement dans docs/ (repère tout fichier listé qui n'existe pas, et tout
fichier important qui manquerait à la liste — en particulier auditer.html et gerer.html,
récemment créés) ; le mécanisme controllerchange -> reload ajouté récemment aux trois pages
d'accueil (index.html, auditer.html, gerer.html) est cohérent et ne peut pas boucler ; les
autres pages qui enregistrent le service worker (par exemple recherche.html) ne sont pas en
contradiction avec ce nouveau mécanisme.`,
  },
  {
    key: "social",
    prompt: `${CONTEXTE}\n\nTon périmètre : le module SOCIAL — moteur/social/questionnaire-social.js,
moteur/social/referentiel-social.js, moteur/social/modeles-social.js si présent,
docs/audit-social.html, et les générateurs docs/documents-*.js qu'il appelle. Vérifie
particulièrement la garantie de non-divergence (chaque champ posé est lu quelque part, chaque
champ lu est posé quelque part), la logique conditionnelle autour du CSE (comiteInstalle) et de
ses commissions/CSSCT, et les six étapes du parcours client dans audit-social.html. Exécute si
possible les tests existants (node moteur/social/tests-*.js ou l'équivalent que tu trouves) et
rapporte s'ils sont verts.`,
  },
  {
    key: "bdese",
    prompt: `${CONTEXTE}\n\nTon périmètre : le module BDESE — moteur/bdese/ en entier
(referentiel, questionnaire, modeles, audit-bdese-client.js), docs/audit-bdese.html,
docs/bdese.html (l'outil de tenue de la base), docs/documents-bdese.js. Vérifie la cohérence
du seuil de 50 salariés lu depuis la fiche, les six millésimes, les dix thèmes, et si des tests
existent (node moteur/bdese/tests-*.js), exécute-les et rapporte le résultat.`,
  },
  {
    key: "cse",
    prompt: `${CONTEXTE}\n\nTon périmètre : le module CSE — moteur/cse/ en entier, docs/audit-cse.html,
docs/documents-cse.js, docs/documents-cse-2.js, docs/documents-cse-3.js. Vérifie particulièrement
la logique groupe / établissements distincts (le profil porte des champs "groupe" et
"etablissementsDistincts" — vérifie qu'ils sont bien exploités ici et pas seulement affichés sur
auditer.html), le seuil de 11 salariés, et exécute les tests existants
(moteur/cse/tests-externes-cse.js notamment) pour rapporter s'ils sont verts.`,
  },
  {
    key: "discipline",
    prompt: `${CONTEXTE}\n\nTon périmètre : le module DISCIPLINE — moteur/discipline/ en entier,
docs/audit-discipline.html, docs/documents-discipline.js, docs/documents-discipline-2.js.
Vérifie le seuil de 50 salariés pour le règlement intérieur, la logique de délai de
prescription/procédure, et exécute les tests existants s'il y en a.`,
  },
  {
    key: "nao",
    prompt: `${CONTEXTE}\n\nTon périmètre : le module NAO (négociations obligatoires) —
moteur/nao/ en entier, docs/audit-nao.html, docs/documents-nao.js. Vérifie la condition
d'applicabilité (section syndicale constituée, indépendante de l'effectif), la logique des
délais de convocation/première réunion, et exécute les tests existants s'il y en a.`,
  },
  {
    key: "pse",
    prompt: `${CONTEXTE}\n\nTon périmètre : le module PSE — moteur/pse/ en entier,
docs/audit-pse.html, docs/documents-pse.js. Vérifie le seuil de 50 salariés et la condition des
dix licenciements sur trente jours, et exécute node moteur/pse/tests-pse.js pour rapporter le
résultat exact (combien passent, combien échouent).`,
  },
  {
    key: "sst",
    prompt: `${CONTEXTE}\n\nTon périmètre : le module SST (santé-sécurité) — moteur/sst/ en entier,
docs/audit-sst.html, docs/documents-sst.js, docs/documents-sst-2.js, docs/duerp.html (le
document unique, outil séparé de l'audit mais qui doit rester cohérent avec lui). Vérifie le
seuil de 300 salariés pour la commission santé-sécurité, la cohérence entre duerp.html et le
référentiel SST, et exécute les tests existants s'il y en a.`,
  },
  {
    key: "documents-registre",
    prompt: `${CONTEXTE}\n\nTon périmètre : le générateur transverse de documents —
docs/documents.html, docs/documents-produits.js, docs/juris-expert.js — et docs/registre.html
(le registre unique du personnel). Vérifie que les liens et ancres utilisés ailleurs
(par exemple gerer.html qui pointe vers documents.html#cse, #discipline, #nao) correspondent
bien à des sections qui existent réellement dans documents.html ; que le nombre de modèles
annoncé ("23 modèles" dans gerer.html) correspond au nombre réel de modèles disponibles ;
et la cohérence des six mentions obligatoires du registre avec les articles cités.`,
  },
  {
    key: "parcours-outils",
    prompt: `${CONTEXTE}\n\nTon périmètre : docs/parcours.html et docs/parcours.js (les quinze
parcours guidés), docs/egalite.html (plan d'action égalité professionnelle), docs/agenda.html.
Vérifie que le nombre de parcours annoncé ("15 parcours" dans gerer.html) correspond au nombre
réel défini dans parcours.js ; que les ancres utilisées ailleurs (gerer.html pointe vers
parcours.html#installer-cse, #sanction, #nao) existent réellement ; que l'agenda construit
bien ses échéances depuis les audits comme l'affirme sa description sur gerer.html, et pas
depuis des données statiques.`,
  },
  {
    key: "recherche-droits",
    prompt: `${CONTEXTE}\n\nTon périmètre : docs/recherche.html (recherche Judilibre et textes)
et docs/equipe.html + docs/droits.js (gestion d'équipe et journal). Vérifie particulièrement,
pour recherche.html, le respect de deux règles impératives documentées dans CLAUDE.md à la
racine du dépôt : toute réponse Judilibre portant "relaxed: true" doit être écartée ; et le
relais Légifrance doit être appelé avec le NOM du code ("Code du travail"), jamais un
identifiant LEGITEXT. Vérifie que le code respecte bien ces deux règles à chaque endroit où il
appelle ces API. Pour droits.js, vérifie que le journal des actes et les permissions sont
cohérents et qu'aucune page ne s'ouvre sans passer par ce module comme l'affirme un commentaire
de sw.js.`,
  },
]

phase('Revue')
const revues = (await parallel(ZONES.map(z => () =>
  agent(z.prompt, { label: `revue:${z.key}`, phase: 'Revue', schema: FINDINGS_SCHEMA })
))).filter(Boolean)

const toutesConstats = revues.flatMap(r => (r.findings || []).map(f => ({ ...f, area: r.area })))
log(`Revue terminée : ${toutesConstats.length} constat(s) remonté(s) sur ${revues.length}/12 zones. Vérification adversariale en cours.`)

phase('Vérification')
const verifies = await parallel(toutesConstats.map(f => () =>
  parallel([1, 2, 3].map(() => () =>
    agent(
      `Voici un constat de bug rapporté sur l'application JURISPRUDENCE, fichier ${f.file}` +
      (f.line ? `, ligne ${f.line}` : '') + ` :\n"${f.summary}"\nScénario d'échec allégué : ${f.failure_scenario}\n\n` +
      `Relis toi-même le fichier réel à cet endroit (et son contexte d'appel si nécessaire) et juge si ` +
      `ce constat est réel et rejouable tel que décrit, ou s'il est faux, exagéré, déjà inapplicable, ` +
      `ou basé sur une mauvaise lecture du code. Par défaut, si tu as un doute réel, réfute ` +
      `(refuted=true) plutôt que de laisser passer un faux positif. Justifie en une phrase, avec la ` +
      `ligne exacte si tu la trouves différente de celle alléguée.`,
      { phase: 'Vérification', schema: VERDICT_SCHEMA }
    )
  )).then(vs => {
    const votes = vs.filter(Boolean)
    const refutations = votes.filter(v => v.refuted).length
    return { ...f, survit: votes.length > 0 && refutations < 2, votes }
  })
))

const confirmes = verifies.filter(v => v.survit)
const ecartes = verifies.filter(v => !v.survit)
log(`Vérification terminée : ${confirmes.length} constat(s) confirmé(s), ${ecartes.length} écarté(s) comme faux positifs ou déjà sans objet.`)

return { zonesExaminees: revues.map(r => r.area), totalConstatsBruts: toutesConstats.length, confirmes, ecartes }
