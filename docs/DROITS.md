# Équipe, droits et journal — le contrat

Ce document décrit le dispositif de gestion d'équipe de l'application : ce qu'il
garantit, ce qu'il ne garantit pas, le schéma de ses données, l'interface du
fournisseur, et la marche à suivre le jour où l'on branchera un serveur.

Il est le contrat. Le code de `docs/droits.js` s'y conforme ; les pages ne
connaissent que les deux fonctions publiques ci-dessous.

---

## 1. Ce que ce dispositif est, et ce qu'il n'est pas

**Les droits sont organisationnels, non sécuritaires.** Tant que l'application
fonctionne sans serveur, tout vit dans le navigateur du poste : les utilisateurs,
les droits, le journal, la session. Quiconque a accès au poste peut les
contourner — la console du navigateur suffit à réécrire `equipe-utilisateurs` ou
à appeler `Droits.brancher` avec un fournisseur complaisant.

Ce dispositif sert donc à **répartir le travail dans une équipe de bonne foi** :
savoir qui a lancé quel audit, ouvrir un module à telle personne et pas à telle
autre, retrouver qui a produit quel document et quand. Il ne sert pas à protéger
des données contre quelqu'un qui voudrait y accéder.

Cette phrase est affichée en clair, en tête de la page `equipe.html` et sur
l'écran de connexion. Elle n'est pas une précaution de style.

**Les codes d'accès ne sont pas stockés en clair.** Chaque utilisateur porte un
sel de 16 octets tiré au hasard ; ce qui est enregistré est
`SHA-256(sel + ":" + code)`, en hexadécimal. Cela protège de la **lecture
accidentelle** — un collègue qui ouvre le stockage local ne lit pas les codes de
l'équipe, et un code réutilisé ailleurs n'est pas révélé. Cela ne protège **pas
d'un utilisateur déterminé** : le condensat est sur le poste, sans étirement de
clé ; il peut être attaqué hors ligne par dictionnaire, ou simplement remplacé.

Le condensat est calculé par une implémentation SHA-256 en JavaScript pur, et non
par `crypto.subtle`, pour une raison précise : l'API Web Crypto n'existe qu'en
contexte sécurisé (https ou localhost), et l'application s'ouvre aussi depuis un
fichier local. Un condensat qui changerait selon le mode d'ouverture rendrait les
codes invérifiables d'un jour à l'autre. L'implémentation rend exactement ce que
rend `crypto.subtle.digest("SHA-256", …)` — vérifié sur les vecteurs d'essai.

**Mode ouvert.** Tant qu'aucun utilisateur n'a été créé, l'application se
comporte exactement comme avant : pas d'écran de connexion, tous les droits
accordés, aucun journal. L'équipe est une fonction que l'on ajoute, pas un péage
que l'on subit.

**Code perdu.** Il n'y a pas de récupération : il n'y a personne pour la faire.
Un administrateur qui a perdu son code efface l'équipe depuis la console du
navigateur, sur la page de l'application :

```js
localStorage.removeItem("equipe-utilisateurs");
localStorage.removeItem("equipe-session");
// le journal, lui, se conserve : localStorage.removeItem("equipe-journal") l'efface aussi
```

L'application repasse alors en mode ouvert, et le premier administrateur se
recrée. C'est une conséquence directe du point 1 : ce qui n'est pas sécuritaire
n'est pas non plus irréversible.

---

## 2. Le point unique d'autorisation

Toute l'application demande le droit au même endroit et enregistre au même
endroit. **Aucune page n'écrit de vérification de droit à la main, aucune page ne
lit les clés de stockage de l'équipe.**

```js
Droits.peut(module, action)          // -> true | false, sans attendre
Journal.acte(module, action, detail) // -> Promise
```

`Droits.peut` répond immédiatement, en trois cas :

| situation | réponse |
|---|---|
| aucun utilisateur n'existe (mode ouvert) | `true` |
| des utilisateurs existent, personne n'est connecté | `false` |
| un administrateur est connecté | `true` |
| un utilisateur ordinaire est connecté | la case cochée fait foi |

`Droits.peutAdmin(action)` répond de même pour les gestes qui portent sur
l'équipe elle-même.

### Les modules

`recherche`, `audit-social`, `audit-economique`, `audit-cse`, `audit-pse`,
`audit-bdese`, `audit-nao`, `audit-sst`, `audit-discipline`, `parcours`,
`documents`, `agenda`, `profil`, `assistant`, `equipe`.

L'identifiant d'un module ne change jamais : il est inscrit dans les droits
enregistrés et dans le journal. Le libellé, lui, peut être réécrit sans
conséquence.

### Les actions

| action | ce qu'elle ouvre |
|---|---|
| `consulter` | ouvrir le module et lire ce qui s'y trouve |
| `saisir` | répondre aux questionnaires, enregistrer, modifier la fiche client |
| `produire` | engendrer un courrier, un rapport, un modèle |
| `exporter` | imprimer, enregistrer un fichier, copier hors de l'application |

### Les droits d'administration

`creerUtilisateur`, `supprimerUtilisateur`, `changerCode`, `accorderDroits`.

---

## 3. Comment le refus se traduit à l'écran

Les pages n'ont pas été retouchées : c'est `droits.js` qui applique le refus, et
lui seul. Trois applications générales, à l'ouverture de chaque page :

- **`consulter` refusé** — la page entière est remplacée par un écran de refus
  nommé (« ce module ne vous est pas ouvert »), avec un bouton pour changer
  d'utilisateur. Le refus est journalisé.
- **`saisir` refusé** — tous les champs et boutons de la page passent en lecture
  seule, et un bandeau le dit en toutes lettres. Un observateur de mutations
  regèle les champs ajoutés après coup.
- **`exporter` refusé** — `window.print` est remplacé, le raccourci d'impression
  intercepté, et tout clic sur une ancre porteuse de `download` interrompu.

**Ce qui n'est pas encore intercepté, et il faut le dire :** `produire` n'a pas
de signature générique dans les pages actuelles. Un document s'y saisit puis s'y
imprime — les deux gestes sont couverts par `saisir` et `exporter`. Le jour où
une page sera retouchée par ailleurs, il suffira de poser sur le bouton qui
engendre :

```html
<button data-droit="produire" data-droit-module="documents">Engendrer</button>
```

`droits.js` intercepte déjà cet attribut, en capture, et journalise le geste ou
le refuse. C'est le seul point d'accroche que les pages auront jamais à écrire —
et il reste déclaratif : pas une ligne de logique de droit dans une page.

### Le journal se remplit sans toucher aux pages

Les actes ordinaires sont déduits des écritures dans le stockage local :
`droits.js` enveloppe `Storage.prototype.setItem` une seule fois et rattache
chaque clé connue à un module et à une action.

| clé écrite | module | action |
|---|---|---|
| `profil-entreprise` | `profil` | saisir |
| `audit-*-brouillon` | l'audit correspondant | saisir |
| `audit-social-historique` | `audit-social` | produire |
| `documents-brouillon` | `documents` | produire |
| `parcours-etat` | `parcours` | saisir |
| `agenda-brouillon` | `agenda` | saisir |

Deux écritures de la même clé à moins de quinze secondes ne comptent que pour
une : sans cela, un questionnaire rempli produirait deux cents lignes.

---

## 4. Le schéma des données

Trois clés dans le stockage local. `schema: 1`.

### `equipe-utilisateurs`

```json
{
  "schema": 1,
  "utilisateurs": [
    {
      "id": "u-l8x3k2-9a1c4d2e7f30",
      "schema": 1,
      "nom": "Léa Chikhaoui",
      "fonction": "Juriste",
      "photo": "data:image/jpeg;base64,…",
      "sel": "3f9a…",
      "condensat": "b21c…",
      "admin": true,
      "droits": {
        "audit-cse": { "consulter": true, "saisir": true, "produire": false, "exporter": false }
      },
      "droitsAdmin": {
        "creerUtilisateur": true, "supprimerUtilisateur": true,
        "changerCode": true, "accorderDroits": true
      },
      "cree": "2026-08-23T09:12:44.201Z",
      "creePar": "u-…"
    }
  ]
}
```

La photo est recadrée en carré, réduite à 256 pixels de côté, encodée en JPEG et
plafonnée à environ 180 Ko une fois en base64 (la qualité baisse par paliers
jusqu'à tenir ; au-delà, la photo est refusée avec un message).

### `equipe-session`

```json
{ "utilisateur": "u-…", "depuis": "2026-08-23T09:14:02.884Z", "schema": 1 }
```

### `equipe-journal`

```json
{
  "schema": 1,
  "entrees": [
    {
      "id": "j-l8x3k9-1b2c3d4e5f60",
      "horodatage": "2026-08-23T09:14:02.884Z",
      "type": "connexion",
      "utilisateur": "u-…",
      "nom": "Léa Chikhaoui",
      "module": "audit-cse",
      "action": "consulter",
      "detail": "Ouverture de Audit — comité social et économique",
      "page": "audit-cse.html"
    }
  ]
}
```

`type` vaut `connexion`, `deconnexion`, `acte`, `refus` ou `administration`. Le
journal est plafonné à 4 000 entrées ; au-delà, les plus anciennes tombent. Si
l'écriture échoue faute de place, la moitié la plus ancienne est sacrifiée une
fois, puis l'on renonce en silence : un journal saturé ne doit jamais empêcher de
travailler.

Le nom de l'utilisateur est recopié dans chaque entrée. C'est délibéré : une
entrée doit rester lisible après la suppression de son auteur.

---

## 5. L'interface du fournisseur

Le fournisseur est l'unique porte entre `droits.js` et l'endroit où les données
vivent. **Toutes ses méthodes rendent une promesse**, y compris celles qui, dans
le fournisseur local, répondent instantanément : le jour où elles passeront par
le réseau, rien ne changera pour l'appelant.

```
fournisseur = {
  nom: "local" | "distant" | …,

  // facultatif — photographie SYNCHRONE de l'état
  instantane() -> { utilisateurs: [Utilisateur], session: Session|null }

  // utilisateurs
  listerUtilisateurs()          -> Promise<[Utilisateur]>
  creerUtilisateur(utilisateur) -> Promise<Utilisateur>
  modifierUtilisateur(id, patch)-> Promise<Utilisateur>
  supprimerUtilisateur(id)      -> Promise<void>

  // session
  sessionCourante()             -> Promise<Session|null>
  ouvrirSession(session)        -> Promise<Session>
  fermerSession()               -> Promise<void>

  // journal
  journaliser(entree)           -> Promise<Entree>
  lireJournal()                 -> Promise<[Entree]>
  purgerJournal()               -> Promise<void>
}
```

`instantane()` est la **seule méthode facultative**. Le fournisseur local la
propose, parce qu'il lit un stockage synchrone : c'est elle qui permet à
`Droits.peut` de répondre dès la lecture du script. Un fournisseur distant ne la
proposera pas ; le noyau s'en passe alors, `Droits.peut` répond `false` jusqu'à
l'hydratation, et la page reste masquée par le verrou de démarrage pendant ce
temps. Les pages qui ont besoin de l'état avant d'agir utilisent
`Droits.quandPret(fn)` ou `Droits.pret()` (une promesse).

**Le fournisseur ne décide de rien.** Il range et il rend. Les règles — qui peut
quoi, qui peut créer, on ne supprime pas le dernier administrateur — sont dans le
noyau, et y restent quel que soit le fournisseur. C'est ce qui rend la bascule
possible sans réécriture ; c'est aussi ce qui fait qu'un fournisseur distant
devra **rejouer ces règles côté serveur** (voir §7).

---

## 6. L'interface publique, pour les pages

```js
// autorisation — le point unique
Droits.peut(module, action)         Droits.peutAdmin(action)

// état
Droits.utilisateur()   // { id, nom, fonction, photo, admin, droits, droitsAdmin, depuis } | null
Droits.modeOuvert()    // true tant qu'aucun utilisateur n'existe
Droits.pret()          // Promise résolue après hydratation
Droits.quandPret(fn)   Droits.rafraichir()   Droits.surChangement(fn) -> désabonner()

// administration (chaque appel vérifie lui-même le droit)
Droits.listerUtilisateurs()   Droits.creer(champs)    Droits.modifier(id, patch)
Droits.changerCode(id, code)  Droits.supprimer(id)
Droits.connecter(id, code)    Droits.deconnecter()    Droits.ecranConnexion()
Droits.photo(fichier)         // -> Promise<dataURL> recadrée et réduite

// vocabulaire
Droits.MODULES  Droits.ACTIONS  Droits.ACTIONS_ADMIN  Droits.SCHEMA
Droits.droitsVides()  Droits.droitsComplets()  Droits.nomModule(id)

// bascule
Droits.fournisseur()   Droits.brancher(f)   Droits.FournisseurLocal

// journal
Journal.acte(module, action, detail)   Journal.refus(...)   Journal.administration(action, detail)
Journal.lire({ utilisateur, module, type, du, au, texte }) -> Promise<[Entree]>
Journal.csv(entrees)   Journal.purger()
```

---

## 7. Le jour de la bascule sur un serveur

Rien à changer dans les pages. Voici ce qu'il y aura à faire, dans l'ordre.

1. **Écrire le fournisseur distant.** Un objet qui implémente les onze méthodes
   du §5 contre une fonction Netlify ou Supabase. Il n'implémente pas
   `instantane()`. Exemple de forme :

   ```js
   function FournisseurDistant(base) {
     function appel(chemin, corps) {
       return fetch(base + chemin, {
         method: corps ? "POST" : "GET",
         headers: { "content-type": "application/json" },
         credentials: "include",
         body: corps ? JSON.stringify(corps) : undefined
       }).then(function (r) {
         if (!r.ok) throw new Error("Le serveur a refusé : " + r.status);
         return r.json();
       });
     }
     return {
       nom: "distant",
       listerUtilisateurs: function () { return appel("/utilisateurs"); },
       creerUtilisateur: function (u) { return appel("/utilisateurs", u); },
       // … les neuf autres
     };
   }
   ```

2. **Le brancher, sur une seule ligne**, avant toute autre chose :

   ```js
   Droits.brancher(FournisseurDistant("/.netlify/functions/equipe"));
   ```

   `brancher` relance l'hydratation et rend la promesse à attendre.

3. **Déplacer l'authentification côté serveur.** Aujourd'hui `Droits.connecter`
   compare un condensat local. Avec un serveur, `ouvrirSession` devient un appel
   qui envoie l'identifiant et le code et reçoit un cookie de session ; le
   condensat et le sel ne descendent plus jamais dans le navigateur. C'est le
   seul point du noyau à retoucher : quelques lignes de `connecter`.

4. **Rejouer les règles côté serveur.** C'est le point qui fait passer les droits
   d'organisationnels à sécuritaires, et il ne se contourne pas : chaque route du
   serveur doit revérifier ce que `Droits.peut` vérifie dans le navigateur. Le
   contrôle côté navigateur reste utile — il évite les gestes inutiles et il
   explique le refus — mais il cesse d'être le contrôle.

5. **Migrer les données existantes.** Le schéma du §4 est celui à téléverser tel
   quel : `schema: 1`, mêmes noms de champs. Les condensats locaux peuvent être
   repris (même algorithme), ou invalidés en demandant à chacun un nouveau code —
   c'est plus propre, parce que les condensats locaux n'ont pas d'étirement de
   clé.

6. **Retirer la phrase d'honnêteté de `equipe.html`** — mais alors seulement, et
   pas avant que le point 4 soit fait. Tant que le serveur ne revérifie pas, la
   phrase reste vraie.

7. **Ce qui ne bougera pas** : les identifiants de module, les identifiants
   d'action, la forme des entrées de journal, l'interface publique du §6, et le
   fait qu'aucune page ne contienne de vérification de droit.
