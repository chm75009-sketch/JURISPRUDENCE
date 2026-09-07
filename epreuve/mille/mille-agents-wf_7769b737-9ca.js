export const meta = {
  name: 'mille-agents',
  description: 'Mille agents sur l application Jurisprudence : eprouver chaque ecran et chaque document sur telephone, relire chaque article a la source, corriger fichier par fichier, re-eprouver',
  phases: [
    { title: 'Éprouver', detail: '140 écrans sur téléphone, 342 documents produits, 328 articles relus à la source' },
    { title: 'Corriger', detail: 'un agent par fichier, 50 fichiers' },
    { title: 'Ré-éprouver', detail: 'les 140 écrans, après corrections' },
  ],
}

const A = args

const REGLES = "Tu travailles dans /home/user/JURISPRUDENCE. Lis d'abord /home/user/JURISPRUDENCE/CLAUDE.md EN ENTIER et respecte-le mot pour mot. Ce que l'utilisatrice, avocate, demande et a redemandé un milliard de fois (ses mots) : lisibilité, simplicité, facilité, pratique, concret. Les documents déjà faits, préparés, fournis ; pas de théorie, pas de cours, pas de texte à lire avant d'agir ; et tout doit se lire sur un téléphone. Elle a montré une capture de son téléphone où un document sortait en texte à chasse fixe avec des colonnes vides qui partaient à la ligne, et a écrit : « C'est quoi cette merde ? ». L'architecture, qui ne se discute pas : fiche client, deux boutons, un module, une question fermée « Avez-vous... » posée en premier, « non » qui ouvre le document lui-même, éditable, au nom de l'entreprise, en zéro clic ; « oui » qui ouvre le dépôt et le diagnostic du document existant. Le contrôle sur tout écran : l'utilisateur y agit-il, ou y lit-il ? S'il y lit, l'écran est à refaire. Règles absolues : jamais de tiret cadratin ni demi-cadratin, nulle part, y compris dans le code et ses commentaires, le trait d'union du clavier seulement ; ton humain ; rien d'affirmé en droit sans lecture à la source dans cette session, avec l'identifiant LEGIARTI ; jamais soffice pour vérifier un .docx (CLAUDE.md dit pourquoi) ; ne commite pas, ne pousse pas ; ne modifie aucun fichier hors de ta tâche. Ta réponse finale est une donnée pour un programme, pas un message : remplis le schéma demandé avec des faits précis, jamais des avis généraux."

const OUTILS = "Outils. Le serveur : curl -s -o /dev/null -w \"%{http_code}\" http://127.0.0.1:8765/index.html ; s'il ne répond pas 200, lance-le : setsid nohup python3 -m http.server 8765 --directory /home/user/JURISPRUDENCE/docs >/dev/null 2>&1 < /dev/null & puis attends 2 secondes. Playwright : écris un script .mjs avec import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs' ; chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }) ; téléphone : browser.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:3, isMobile:true, hasTouch:true, acceptDownloads:true }) ; grand écran : viewport 1280 x 900. La fiche d'entreprise : après un premier page.goto('http://127.0.0.1:8765/index.html'), page.evaluate(() => localStorage.setItem('profil-entreprise', JSON.stringify(FICHE))), puis goto de la page à éprouver avec waitUntil:'networkidle'. Captures : page.screenshot({path, fullPage:true}), puis ouvre l'image avec l'outil Read et regarde-la vraiment. Téléchargements : const [d] = await Promise.all([page.waitForEvent('download'), bouton.click()]); await d.saveAs(chemin). Les erreurs : page.on('pageerror'), page.on('console') pour le type error, page.on('response') pour status >= 400. python-docx et openpyxl sont installés pour rouvrir les fichiers."

const CONSTATS = {
  type: 'object',
  properties: {
    constats: { type: 'array', items: { type: 'object', properties: {
      fichier: { type: 'string' },
      ligne: { type: 'integer' },
      gravite: { type: 'string', enum: ['bloquant', 'illisible', 'mineur', 'ok'] },
      constat: { type: 'string' },
      correction: { type: 'string' },
    }, required: ['fichier', 'gravite', 'constat', 'correction'] } },
    resume: { type: 'string' },
  },
  required: ['constats', 'resume'],
}

const ARTICLE = {
  type: 'object',
  properties: {
    numero: { type: 'string' }, id_attendu: { type: 'string' }, code: { type: 'string' },
    concordant: { type: 'boolean' }, id_relais: { type: 'string' }, lectures: { type: 'integer' },
    citation: { type: 'string' }, ecart: { type: 'string' },
    fichier: { type: 'string' }, ligne: { type: 'integer' },
  },
  required: ['numero', 'id_attendu', 'concordant', 'id_relais', 'lectures', 'ecart', 'fichier'],
}

const FIX = {
  type: 'object',
  properties: {
    fichier: { type: 'string' },
    patch: { type: 'boolean' },
    corriges: { type: 'array', items: { type: 'string' } },
    non_corriges: { type: 'array', items: { type: 'string' } },
    verification: { type: 'string' },
  },
  required: ['fichier', 'patch', 'corriges', 'non_corriges', 'verification'],
}

function promptEcran(e, i, passe) {
  const dossier = A.scratch + '/ecran-' + i + (passe === 2 ? '-b' : '')
  return REGLES + '\n\n' + OUTILS + '\n\nTA TÂCHE (' + (passe === 2 ? 'seconde passe, après corrections' : 'première passe') +
    ") : éprouver l'écran docs/" + e.page + " avec la fiche d'entreprise " + JSON.stringify(e.fiche) + '.\n' +
    'Tes fichiers vont dans ' + dossier + '/ (crée le dossier).\n' +
    "1. Téléphone d'abord (390 x 844, isMobile), puis grand écran (1280 x 900). Ouvre la page avec la fiche écrite dans le stockage local. Attends le réseau au calme. Prends une capture pleine page et REGARDE-LA avec l'outil Read. Écris ce que tu vois.\n" +
    '2. Réponds, pour cet écran, à chaque contrôle, avec des faits :\n' +
    "   a) Que voit-on en premier ? Combien de lignes de texte avant le premier bouton d'action ? (l'utilisateur y agit-il, ou y lit-il ?)\n" +
    "   b) S'il y a une question fermée « Avez-vous... », est-elle la première chose à l'écran ? Clique « Non » : un document s'ouvre-t-il tout de suite, au nom de l'entreprise, sans autre clic ? Recharge, clique « Oui » : un dépôt de fichier apparaît-il ? Si la question n'existe pas alors que la page est un audit-*.html, c'est un constat bloquant.\n" +
    "   c) Chaque bouton de téléchargement : clique, récupère le fichier, rouvre-le (python-docx pour .docx, openpyxl pour .xlsx, lecture texte pour .csv ; jamais soffice). Porte-t-il le nom de l'entreprise ?\n" +
    "   d) Téléphone : débordement horizontal (scrollWidth > innerWidth), tailles de police inférieures à 15 px dans le corps (mesure avec getComputedStyle sur les éléments de texte visibles), cibles tactiles de moins de 44 px de haut (boutons, liens de barre, cases), barres de plus de deux lignes de boutons avant le contenu, tableau ou colonnes rendus en caractères dans un textarea ou un pre (cherche des lignes de crochets « [    ] » alignés, des traits ─ ═ │, des colonnes d'espaces).\n" +
    '   e) Console : erreurs JavaScript, requêtes en échec (status >= 400).\n' +
    "   f) Tirets cadratins visibles à l'écran (caractères U+2014 ou U+2013 dans document.body.innerText) : compte-les.\n" +
    "   g) Le droit avant l'action : un exposé, un rappel de texte, un cours est-il affiché AVANT le document ou le bouton d'action ? Les renvois aux articles sont-ils repliés sous l'action ?\n" +
    "3. Rends des constats précis, un par défaut : fichier (docs/" + e.page + " ou le .js responsable si tu l'identifies), gravité (bloquant = on n'arrive pas au document ; illisible = on y arrive mais on ne peut pas s'en servir sur téléphone ; mineur ; ok = rien à signaler sur ce contrôle), le constat en une phrase factuelle (ce qui s'est passé, pas un avis), la correction en une phrase concrète. Pas de constat vague."
}

function promptDoc(d, i) {
  const dossier = A.scratch + '/doc-' + i
  return REGLES + '\n\n' + OUTILS + '\n\nTA TÂCHE : éprouver le document produit par le générateur « ' + d.gen + ' » de DocumentsProduits, pour la fiche ' + JSON.stringify(d.fiche) + '.\n' +
    'Tes fichiers vont dans ' + dossier + '/ (crée le dossier).\n' +
    "1. Trouve le fichier qui l'enregistre : grep -n 'ajouter(\"" + d.gen + "\"' /home/user/JURISPRUDENCE/docs/documents-*.js. Lis le générateur en entier (sa fonction produire, et tableur si elle existe).\n" +
    "2. Produis-le dans le navigateur : ouvre http://127.0.0.1:8765/parcours.html avec la fiche dans le stockage local, puis ajoute dans l'ordre, avec page.addScriptTag({url}), documents-produits.js, bdese-grille.js, puis chacun des docs/documents-*.js (liste-les avec ls), en attendant chaque chargement. Puis page.evaluate : const g = DocumentsProduits.pour('" + d.gen + "'); const ctx = {profil: JSON.parse(localStorage.getItem('profil-entreprise')), fiche:{}, donnees:{}, aujourdhui:new Date()}; return {nom:g.nom, texte:g.produire(ctx), tableur: g.tableur ? g.tableur(ctx) : null}. Enregistre le texte dans ton dossier.\n" +
    '3. Juge le texte produit, avec des faits et des numéros de ligne :\n' +
    "   a) Est-ce un document prêt à l'emploi (en-tête au nom de l'entreprise, corps, date, signature) ou une explication ? Combien de lignes avant que le document lui-même commence ?\n" +
    '   b) Tableaux dessinés en caractères : lignes de crochets alignés « [    ] », traits ─ ═ │ ┌ └, colonnes d\'espaces. Compte-les et cite-en une. Un tableau doit être une fonction tableur, jamais du texte.\n' +
    '   c) Crochets [À RENSEIGNER] qui pourraient être remplis depuis la fiche (dénomination, effectif, secteur, convention) : lesquels ?\n' +
    "   d) Articles cités : chacun porte-t-il son identifiant de version LEGIARTI dans le code du générateur ? Liste ceux qui n'en ont pas. N'appelle PAS le relais Légifrance : d'autres agents s'en chargent.\n" +
    '   e) Tirets cadratins (U+2014, U+2013) dans le texte produit : compte.\n' +
    "   f) Lignes de plus de 90 caractères, qui partiront à la ligne sur un téléphone : compte.\n" +
    "   g) Le contenu est-il juste pour cet effectif (seuils que le code lui-même écrit : 11, 50, 250, 300, 1000 salariés) ? Ne l'affirme qu'à partir du code lu : tu ne cites aucune règle de mémoire.\n" +
    '4. Rends des constats précis : fichier = le documents-*.js concerné, ligne = celle du générateur, gravité, constat factuel, correction concrète.'
}

function promptArt(a) {
  const num = a.numero.replace(/\. ?/, '')
  return REGLES + "\n\nTA TÂCHE : relire à la source l'article " + a.numero + ', cité dans docs/' + a.fichier + ' ligne ' + a.ligne + " avec l'identifiant de version " + a.id + '.\n' +
    "1. Lis la ligne et les dix lignes autour dans /home/user/JURISPRUDENCE/docs/" + a.fichier + " pour savoir de quel code il s'agit (code du travail sauf mention contraire : sécurité sociale, etc.) et ce que l'application lui fait dire.\n" +
    '2. Interroge le relais : curl -s -X POST "https://jurisprudence-recherche.netlify.app/.netlify/functions/legifrance" -H "content-type: application/json" -d \'{"action":"article","numero":"' + num + '","code":"Code du travail","date":"' + A.date + '"}\' (remplace le nom du code si le contexte dit un autre code ; le champ code attend le NOM du code, jamais un LEGITEXT). Deux lectures espacées d\'au moins 8 secondes, trois si elles diffèrent. Une réponse 502 se réessaie après 15 secondes. Une réponse portant elargi: true est écartée. Si deux lectures stables rendent deux articles différents portant le même numéro, c\'est le contenu qui tranche : retiens celui qui parle de ce que la ligne lui fait dire.\n' +
    "3. Compare : l'identifiant rendu est-il " + a.id + " ? Le texte rendu dit-il bien ce que la ligne de l'application lui fait dire ? Cite la phrase du texte rendu qui le confirme, ou celle qui le contredit.\n" +
    "4. Réponds : concordant (identifiant identique ET contenu conforme à l'usage), l'identifiant rendu, le nombre de lectures, la citation, et l'écart en une phrase précise s'il y en a un (identifiant différent, article abrogé, contenu qui ne dit pas cela ; sinon écris « aucun »). Ne modifie aucun fichier."
}

function promptFix(f, constats) {
  const n = constats.length
  const coupe = n > 80 ? ' ; seuls les 80 premiers sont reproduits, les autres portent sur les mêmes défauts' : ''
  const liste = n ? JSON.stringify(constats.slice(0, 80)) : 'aucun constat remonté'
  return REGLES + '\n\n' + OUTILS + '\n\nTA TÂCHE : corriger docs/' + f + ', et lui seul. Tu ne modifies aucun autre fichier.\n' +
    'Les constats des agents qui l\'ont éprouvé (' + n + ' constats' + coupe + ') : ' + liste + '\n' +
    (n ? '' : "Aucun constat n'a été remonté sur ce fichier : fais quand même la passe. Lis-le en entier, ouvre-le sur téléphone si c'est une page, et cherche toi-même ce que les contrôles suivants relèveraient.\n") +
    "AVANT D'ÉCRIRE : si le fichier " + A.locks + '/' + f + " existe, un autre agent tient ce fichier en ce moment. Dans ce cas, n'écris PAS dans docs/" + f + ' : écris ta proposition complète, passage avant / passage après pour chaque correction, dans ' + A.patches + '/' + f + '.md, et réponds patch:true.\n' +
    'Sinon, lis docs/' + f + " EN ENTIER, puis corrige chaque constat qui tient à ce fichier, dans l'esprit de CLAUDE.md : le document d'abord, jamais un cours ; lisible sur téléphone ; un tableau se rend en table HTML ou se télécharge, jamais en caractères ; les renvois au droit repliés sous l'action ; aucun tiret cadratin ; les crochets qui peuvent se remplir depuis la fiche se remplissent. " +
    'Si ' + f + " est une page HTML, rouvre-la dans Chromium en 390 x 844 et en 1280 x 900 après tes corrections, sans erreur de console, sans requête en échec, sans débordement horizontal, et regarde la capture avec l'outil Read. Si c'est un documents-*.js, produis au moins deux documents du fichier dans le navigateur (parcours.html avec la fiche, addScriptTag dans l'ordre documents-produits.js, bdese-grille.js, puis les documents-*.js, puis DocumentsProduits.pour(id).produire(ctx)) et vérifie que rien ne lève d'erreur. Si c'est parcours.js, rouvre parcours.html?p=ri&faire=1 et p=bdese&faire=1. " +
    "Si un constat demande une règle de droit que tu n'as pas relue à la source dans cette session, relis-la au relais (deux lectures espacées, LEGIARTI noté) avant d'écrire, ou laisse le constat en non corrigé avec la raison. Ne touche pas à docs/style.css. Ne commite pas.\n" +
    'Réponds : la liste des constats corrigés (une ligne chacun), ceux non corrigés avec la raison, et ce que tu as vérifié.'
}

phase('Éprouver')
const ecrans = []
A.pages.forEach(p => A.fiches.forEach(f => ecrans.push({ page: p, fiche: f })))
const docs = []
A.generateurs.forEach(g => [A.fiches[0], A.fiches[3]].forEach(f => docs.push({ gen: g, fiche: f })))
const arts = A.articles.map(a => ({ numero: a[0], id: a[1], fichier: a[2], ligne: a[3] }))
log('Éprouver : ' + ecrans.length + ' écrans, ' + docs.length + ' documents, ' + arts.length + ' articles. Total prévu de la journée : ' + (ecrans.length * 2 + docs.length + arts.length + A.fichiers.length) + ' agents.')

const [rEcrans, rDocs, rArts] = await parallel([
  () => parallel(ecrans.map((e, i) => () => agent(promptEcran(e, i, 1), { label: 'écran ' + e.page + ' · ' + e.fiche.effectif, phase: 'Éprouver', schema: CONSTATS, agentType: 'general-purpose' }))),
  () => parallel(docs.map((d, i) => () => agent(promptDoc(d, i), { label: 'document ' + d.gen + ' · ' + d.fiche.effectif, phase: 'Éprouver', schema: CONSTATS, agentType: 'general-purpose' }))),
  () => parallel(arts.map((a) => () => agent(promptArt(a), { label: 'article ' + a.numero, phase: 'Éprouver', schema: ARTICLE, agentType: 'general-purpose' }))),
])

const parFichier = {}
function ajoute(c) {
  const f = String(c.fichier || '').replace(/^docs\//, '').replace(/^\/.*\/docs\//, '')
  if (!f || c.gravite === 'ok') return
  ;(parFichier[f] = parFichier[f] || []).push(c)
}
;(rEcrans || []).filter(Boolean).forEach(r => (r.constats || []).forEach(ajoute))
;(rDocs || []).filter(Boolean).forEach(r => (r.constats || []).forEach(ajoute))
const discordants = (rArts || []).filter(Boolean).filter(a => !a.concordant)
discordants.forEach(a => ajoute({ fichier: a.fichier, ligne: a.ligne, gravite: 'bloquant',
  constat: 'Article ' + a.numero + ' : le relais rend ' + a.id_relais + ' au lieu de ' + a.id_attendu + '. ' + a.ecart,
  correction: "Relire l'article à la source (deux lectures), corriger l'identifiant ou le texte de l'application, ou retirer la citation." }))

const avant = { bloquant: 0, illisible: 0, mineur: 0 }
Object.keys(parFichier).forEach(f => parFichier[f].forEach(c => { if (avant[c.gravite] !== undefined) avant[c.gravite]++ }))
log('Constats avant correction : ' + avant.bloquant + ' bloquants, ' + avant.illisible + ' illisibles, ' + avant.mineur + ' mineurs, sur ' + Object.keys(parFichier).length + ' fichiers. Articles discordants : ' + discordants.length + ' sur ' + arts.length + '.')
const horsListe = Object.keys(parFichier).filter(f => A.fichiers.indexOf(f) < 0)
if (horsListe.length) log('Fichiers avec constats mais sans agent correcteur (à traiter à la main) : ' + horsListe.join(', '))

phase('Corriger')
const rFix = await parallel(A.fichiers.map(f => () => agent(promptFix(f, parFichier[f] || []), { label: 'corriger ' + f, phase: 'Corriger', schema: FIX, agentType: 'general-purpose' })))
const patches = (rFix || []).filter(Boolean).filter(r => r.patch).map(r => r.fichier)
log('Corrigé : ' + (rFix || []).filter(Boolean).filter(r => !r.patch).length + ' fichiers en place, ' + patches.length + ' en proposition (fichiers tenus par un autre agent) : ' + patches.join(', '))

phase('Ré-éprouver')
const rEcrans2 = await parallel(ecrans.map((e, i) => () => agent(promptEcran(e, i, 2), { label: 'écran ' + e.page + ' · ' + e.fiche.effectif + ' (2)', phase: 'Ré-éprouver', schema: CONSTATS, agentType: 'general-purpose' })))
const apres = { bloquant: 0, illisible: 0, mineur: 0 }
const restes = {}
;(rEcrans2 || []).filter(Boolean).forEach(r => (r.constats || []).forEach(c => {
  if (apres[c.gravite] !== undefined) apres[c.gravite]++
  if (c.gravite !== 'ok') { const f = String(c.fichier || '').replace(/^docs\//, ''); (restes[f] = restes[f] || []).push(c) }
}))
log('Après correction : ' + apres.bloquant + ' bloquants, ' + apres.illisible + ' illisibles, ' + apres.mineur + ' mineurs.')

return {
  agents: ecrans.length * 2 + docs.length + arts.length + A.fichiers.length,
  avant: avant, apres: apres,
  articlesDiscordants: discordants,
  corrections: (rFix || []).filter(Boolean),
  horsListe: horsListe,
  restes: restes,
  constatsAvant: parFichier,
}