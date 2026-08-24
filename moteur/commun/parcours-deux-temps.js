/* Le parcours du client, en deux temps.

   L'audit dit où en est l'entreprise. Ce module dit ce qu'elle en fait, et
   dans quel ordre. L'ordre n'est pas un détail de présentation : il a été
   arrêté explicitement, et il commande la logique.

   PREMIER TEMPS — ce qu'elle n'a pas fait.
   On liste les manquements, du plus grave au moins grave ; pour chacun on
   donne l'acte à accomplir, le modèle et la procédure ; puis on vérifie la
   correction. Le temps se termine quand tout ce qui manquait est validé.

   SECOND TEMPS — ce qu'elle dit avoir fait.
   Et seulement alors. Les contrôles que l'audit a rendus « conformes » ne le
   sont que sur la parole du client : ils sont ici marqués « déclaré », repris
   un par un avec la grille du texte, et validés — ou refusés, auquel cas ils
   retournent au premier temps comme manquements.

   La règle qui tient tout : UN « OUI » N'EST PAS UNE PREUVE. Rien ne passe de
   « déclaré » à « en règle » sans être passé par le second temps. C'est
   pourquoi ce module renomme l'état « conforme » plutôt que de le recopier :
   le mot « conforme » ne doit pas apparaître avant sa vérification. */

const DECLARE = "déclaré — à vérifier";
const REGLE = "en règle — vérifié";

/* Les quatre degrés de gravité, dans l'ordre où le guide les présente. Ils
   sont communs à tous les modules : un délit d'entrave se traite avant une
   contravention, quel que soit le module qui l'a constaté. */
const DEGRES = {
  1: "Sanction pénale encourue",
  2: "Pénalité financière encourue",
  3: "Irrégularité opposable — l'accord ou la décision peut tomber",
  4: "Régularisation rapide",
};

/* Ce qu'un état de contrôle devient dans le parcours.
   « conforme » ne devient jamais « en règle » ici : il devient « déclaré ». */
function etatParcours(etat) {
  if (etat === "conforme") return DECLARE;
  return etat;
}

/* Le premier temps : ce qui manque.

   Sont retenus les contrôles « non conforme » — le texte n'est pas respecté —
   et « risque à vérifier » — l'application ne tranche pas, mais quelque chose
   est à faire. Les « donnée manquante » ne sont pas des manquements : ce sont
   des questions sans réponse, et elles retournent au questionnaire. */
function premierTemps(C, R, verdicts, faits) {
  const points = [];
  for (const c of C) {
    const v = verdicts[c.id];
    if (!v) continue;
    if (v.etat !== "non conforme" && v.etat !== "risque à vérifier") continue;
    const r = R[c.id];
    if (!r) continue;                       /* rien à régulariser : mesuré ailleurs */
    points.push({
      id: c.id,
      rubrique: c.rubrique,
      objet: c.objet,
      fondement: c.fondement || [],
      etat: v.etat,
      constat: v.motif,
      gravite: r.gravite,
      degre: DEGRES[r.gravite],
      quoiFaire: r.quoiFaire,
      risque: r.risque,
      delai: r.delai,
      document: r.document || null,
      etapes: r.etapes,
      verifs: r.verifs,
      fait: !!(faits || {})[c.id],
    });
  }
  points.sort((a, b) => a.gravite - b.gravite || a.id.localeCompare(b.id));
  return points;
}

/* Le second temps : ce que le client dit avoir.

   Un contrôle « conforme » l'est parce que le client a déclaré la pièce, la
   date ou l'acte. Le second temps le reprend et demande de le montrer. Un
   contrôle sans grille de vérification ne peut pas être vérifié : il reste
   « déclaré », et le dit — plutôt que de passer pour vérifié. */
function secondTemps(C, R, verdicts, controles) {
  const points = [];
  for (const c of C) {
    const v = verdicts[c.id];
    if (!v || v.etat !== "conforme") continue;
    const r = R[c.id];
    const grille = (r && r.verifs) || [];
    const rep = (controles || {})[c.id] || {};
    points.push({
      id: c.id,
      rubrique: c.rubrique,
      objet: c.objet,
      fondement: c.fondement || [],
      etat: DECLARE,
      declare: v.motif,
      gravite: r ? r.gravite : 4,
      degre: r ? DEGRES[r.gravite] : DEGRES[4],
      verifs: grille,
      verifiable: grille.length > 0,
      reponses: rep,
    });
  }
  points.sort((a, b) => a.gravite - b.gravite || a.id.localeCompare(b.id));
  return points;
}

/* Le verdict du second temps, point par point.

   Trois issues, et une seule règle : cocher n'est pas prouver. Une grille
   dont une réponse manque ne se conclut pas ; une grille dont une réponse est
   « non » est refusée et le point retourne au premier temps. */
function verdictVerification(point) {
  if (!point.verifiable)
    return { issue: "non vérifiable", motif:
      "Aucune grille de vérification n'est écrite pour ce contrôle : il reste déclaré, et n'est pas tenu pour acquis." };
  const manquantes = [], refusees = [];
  for (const v of point.verifs) {
    const rep = point.reponses[v.cle];
    const val = rep && typeof rep === "object" ? rep.valeur : rep;
    if (val === undefined || val === null || String(val).trim() === "" ||
        val === "en cours" || val === "autre" || val === "je ne sais pas") {
      manquantes.push(v); continue;
    }
    if (val === "non" || val === false) refusees.push(v);
  }
  if (refusees.length)
    return { issue: "refusé", refusees, motif:
      "Ce que vous déclariez en place ne l'est pas : " +
      refusees.map(v => "« " + v.question + " » — attendu : " + v.attendu).join(" ; ") +
      ". Ce point retourne au premier temps." };
  if (manquantes.length)
    return { issue: "ne conclut pas", manquantes, motif:
      "La vérification n'est pas achevée : " +
      manquantes.map(v => "« " + v.question + " »").join(" ; ") +
      ". Une réponse « en cours », « autre » ou absente ne vaut ni oui ni non." };
  return { issue: "validé", motif:
    "Vérifié point par point : ce qui était déclaré est établi. Cette obligation passe de « déclaré » à « en règle »." };
}

/* Le parcours entier, tel qu'une page l'affiche.

   `faits` porte ce que le client déclare avoir corrigé au premier temps ;
   `controles` porte ses réponses à la grille du second. Les deux viennent de
   la page, jamais du moteur. */
function parcours(C, R, verdicts, etat) {
  const e = etat || {};
  const A = premierTemps(C, R, verdicts, e.faits);
  const B = secondTemps(C, R, verdicts, e.controles);
  const jugesB = B.map(p => ({ ...p, verdict: verdictVerification(p) }));

  const refuses = jugesB.filter(p => p.verdict.issue === "refusé");
  const valides = jugesB.filter(p => p.verdict.issue === "validé");
  const enAttente = jugesB.filter(p => p.verdict.issue !== "refusé" && p.verdict.issue !== "validé");

  const restantsA = A.filter(p => !p.fait);
  return {
    tempsA: {
      points: A,
      /* Un refus du second temps est un manquement de plus : il rejoint la
         liste du premier, et le compteur le dit. */
      refusesDuSecond: refuses,
      restants: restantsA.length + refuses.length,
      acheve: restantsA.length === 0,
    },
    tempsB: {
      points: jugesB,
      valides: valides.length,
      refuses: refuses.length,
      enAttente: enAttente.length,
      /* Le second temps ne s'ouvre qu'une fois le premier achevé : c'est
         l'ordre qui a été arrêté, et la page le fait respecter. */
      ouvert: restantsA.length === 0,
    },
    compteurs: {
      manquants: A.length,
      declares: B.length,
      enRegle: valides.length,
    },
    mots: { DECLARE, REGLE },
  };
}

module.exports = { parcours, premierTemps, secondTemps, verdictVerification,
                   etatParcours, DEGRES, DECLARE, REGLE };
