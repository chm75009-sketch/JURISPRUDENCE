/* Un verdict ne se prononce pas sur une donnée qui ne peut pas exister.

   Chaque module valide déjà ses entrées et le dit dans un contrôle dédié. Cela
   ne suffisait pas : le contrôle de recevabilité criait, et les trente-sept
   autres continuaient de conclure. Une notification datée du 30 février
   produisait encore deux conformités ; un effectif de -50, puis de 299,6,
   produisaient encore des verdicts. Le rapport contenait donc, dans la même
   page, l'affirmation que la donnée est impossible et des conclusions tirées
   d'elle.

   La règle appliquée ici est plus simple que les exceptions qu'il faudrait
   écrire sans elle : un contrôle qui a lu un champ illisible n'a rien constaté.
   Son verdict devient « donnée manquante » — la donnée n'est pas absente, elle
   est inexploitable, ce qui revient au même pour la conclusion — et le motif
   dit lequel des champs lus est en cause. Le contrôle de recevabilité, lui,
   garde son « non conforme » : c'est lui qui porte l'anomalie, et il bloque.

   Comment savoir ce qu'un contrôle a lu, sans le deviner ? En l'observant. La
   fiche est enveloppée dans un Proxy le temps de l'exécution, et l'on relève
   les champs réellement touchés — f.nom, f["nom"] et la déstructuration
   comprises. Aucune liste tenue à la main, donc rien qui puisse dériver. */

const MANQ = "donnée manquante", CONF = "conforme", RISQ = "risque à vérifier", SO = "sans objet";
const CONCLUSIFS = new Set([CONF, "non conforme"]);

/* Remplacer la fonction d'un contrôle sans la rendre illisible.

   Le registre et le questionnaire déduisent les champs lus en inspectant le
   texte de la fonction. Une enveloppe qui masque ce texte casserait la
   garantie de non-divergence — la première tentative l'a fait, et trois
   contre-épreuves l'ont dit aussitôt. L'enveloppe rend donc, quand on
   l'imprime, le texte de la fonction qu'elle enveloppe. */
function remplacer(ctl, fn) {
  const brut = ctl.verdict;
  const source = typeof brut.toString === "function" ? brut.toString() : String(brut);
  Object.defineProperty(fn, "toString", { value: () => source, writable: true, configurable: true });
  ctl.brut = ctl.brut || brut;
  ctl.verdict = fn;
  return brut;
}

/* Le champ de premier niveau : « consultation.dateAvis » est lu à travers
   « consultation », qui est le nom que la sonde voit passer. */
const racine = champ => String(champ).split(".")[0];

function envelopper(controles, valider, exemptes) {
  const hors = new Set(exemptes || []);
  for (const ctl of controles) {
    if (hors.has(ctl.id)) continue;
    const brut = remplacer(ctl, function (f) {
      /* Seules les anomalies de lisibilité font taire un contrôle. Une
         contradiction entre deux valeurs bien formées ne l'empêche pas de
         conclure : elle est précisément ce qu'il a pour objet de constater. */
      const anomalies = (() => { try { return (valider(f) || [])
        .filter(a => (a.nature || "lisibilité") === "lisibilité"); } catch (e) { return []; } })();
      if (!anomalies.length) return brut(f);
      const lus = new Set();
      const p = new Proxy(f, {
        get(c, k) { if (typeof k === "string") lus.add(k); return c[k]; },
        has(c, k) { if (typeof k === "string") lus.add(k); return k in c; },
        getOwnPropertyDescriptor(c, k) {
          if (typeof k === "string") lus.add(k);
          return Reflect.getOwnPropertyDescriptor(c, k);
        },
      });
      const v = brut(p);
      if (!v || !CONCLUSIFS.has(v.etat)) return v;
      const touchees = anomalies.filter(a => lus.has(racine(a.champ)));
      if (touchees.length)
        return { etat: MANQ, illisible: true,
          motif: `Ce contrôle a lu ${touchees.length > 1 ? "des données inexploitables" : "une donnée inexploitable"} : `
            + touchees.map(a => `${a.champ} = « ${a.valeur} » — ${a.motif}`).join(" ; ")
            + ". Aucune conclusion n'en est tirée, dans aucun sens. Corrigez la saisie et relancez l'audit ; le constat qu'aurait rendu ce contrôle est sans valeur tant que la donnée n'existe pas." };
      /* Le contrôle n'a lu aucune des données fautives : son constat tient par
         lui-même. Il ne peut pas pour autant valoir conformité — le document
         se lit d'un bloc, et une page qui affirme qu'une donnée est impossible
         ne peut pas en présenter une autre comme acquise. Le manquement
         constaté, lui, reste constaté : une non-conformité n'est pas effacée
         par une erreur de saisie ailleurs dans le dossier. */
      if (v.etat !== CONF) return v;
      return { etat: RISQ, dossierDouteux: true,
        motif: `${v.motif} Ce constat ne dépend d'aucune des ${anomalies.length} donnée(s) impossible(s) que porte le dossier, mais il ne peut pas être tenu pour acquis tant qu'elles n'ont pas été corrigées : un dossier dont une partie des valeurs ne peut pas exister ne se lit pas par morceaux.` };
    });
  }
  return controles;
}

/* ------------------------------------------------------------ le silence

   Un contrôle qui se déclare « sans objet » ferme la question : il affirme que
   l'exigence ne s'applique pas. Or beaucoup se fermaient sur rien — « l'entreprise
   n'appartient à aucun groupe », « aucune élection en cours », « l'entreprise ne
   comporte pas plusieurs établissements distincts » — alors que la fiche ne
   disait rien du groupe, des élections ni des établissements. Sur un dossier
   entièrement vide, quarante-quatre contrôles des deux modules affirmaient ainsi
   des faits que personne n'avait déclarés.

   C'est la règle du dépôt appliquée à un état de plus : une donnée non
   renseignée ne produit jamais « conforme », et elle ne doit pas davantage
   produire « sans objet ». Le silence n'est pas une réponse — ni dans un sens,
   ni dans l'autre.

   La mesure est la même que pour la recevabilité : on observe l'exécution. Si le
   contrôle a conclu « sans objet » sans qu'aucun des champs qu'il a lus ne soit
   déclaré sur la fiche, sa conclusion ne repose sur rien et devient « donnée
   manquante ». S'il a lu ne serait-ce qu'un champ renseigné — un effectif de
   vingt, qui écarte une obligation due à cinquante — le « sans objet » tient. */
function surSilence(controles, exemptes) {
  const hors = new Set(exemptes || []);
  for (const ctl of controles) {
    if (hors.has(ctl.id)) continue;
    const brut = remplacer(ctl, function (f) {
      const lus = new Set();
      const p = new Proxy(f, {
        get(c, k) { if (typeof k === "string") lus.add(k); return c[k]; },
        has(c, k) { if (typeof k === "string") lus.add(k); return k in c; },
        getOwnPropertyDescriptor(c, k) {
          if (typeof k === "string") lus.add(k);
          return Reflect.getOwnPropertyDescriptor(c, k);
        },
      });
      const v = brut(p);
      if (!v || v.etat !== SO) return v;
      const declares = [...lus].filter(k =>
        Object.prototype.hasOwnProperty.call(f, k) && f[k] !== undefined);
      if (declares.length) return v;
      const attendus = [...lus].filter(k => !/^(then|constructor|toJSON|inspect|Symbol)/.test(k));
      return { etat: MANQ, surSilence: true,
        motif: `Ce contrôle s'écarterait de lui-même — « ${v.motif} » — mais aucune des données sur lesquelles il se fonde n'est renseignée${attendus.length ? " : " + attendus.join(", ") : ""}. Le silence n'est pas une réponse : renseignez-les, ou déclarez expressément qu'il n'y a rien à déclarer.` };
    });
  }
  return controles;
}

module.exports = { envelopper, surSilence, remplacer, racine };
