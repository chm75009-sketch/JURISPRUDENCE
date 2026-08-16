/* L'audit du comité social et économique, à partir de la fiche du client.
   Même chaîne que l'audit du licenciement économique : le moteur calcule, la
   grille énonce, les contrôles constatent, ce fichier met en forme. */
const fs = require("fs");
const M = require("./moteur-cse.js");
const O = require("./outils.js");
const GRILLE = require("./grille-cse.js");
const { C: CONTROLES, ETATS, DETECTION, COHERENCE } = require("./controles-cse.js");
const ACT = require("./actions-cse.js");
const T = JSON.parse(fs.readFileSync(__dirname + "/textes_cse.json", "utf8"));
/* Le manifeste porte les compteurs mesurés à la publication — dont le nombre de
   règles qu'aucun dossier d'épreuve n'a jamais déclenchées, publié au rapport. */
const MAN = JSON.parse(fs.readFileSync(__dirname + "/manifeste-cse.json", "utf8"));

const MOIS = ["", "janvier", "février", "mars", "avril", "mai", "juin", "juillet",
  "août", "septembre", "octobre", "novembre", "décembre"];
const dateFr = s => { if (!s) return "—"; const [a, m, j] = s.split("-");
  return `${+j}${+j === 1 ? "er" : ""} ${MOIS[+m]} ${a}`; };
const net = s => String(s || "").replace(/\s+/g, " ").trim();
const artFr = n => n.replace(/^([LRD])(\d+)-/, "$1. $2-");

function audit(f) {
  const A = O(); const { sur, t1, trait, h1, h2, h3, p, note, puce, enc, tab } = A;
  const retenues = GRILLE.filter(r => { try { return r.si(f); } catch (e) { return false; } });

  sur("Audit — comité social et économique · deuxième partie, livre III du code du travail");
  t1(f.entreprise || "Audit de situation");
  sur(`${retenues.length} règles applicables sur ${GRILLE.length} de la base · ${CONTROLES.length} contrôles exécutés`);
  trait();

  const V = CONTROLES.map(x => ({ ...x, v: (() => { try { return x.verdict(f); }
    catch (e) { return { etat: ETATS.MANQ, motif: "Contrôle non exécutable." }; } })() }));
  const sn = ACT.statutNormalise(V, f);
  const affiche = sn.statut === "CONFORME AU VU DES PIÈCES" && sn.pro.length
    ? "REVUE PROFESSIONNELLE OBLIGATOIRE" : sn.statut;
  const COULEUR = { "BLOQUÉ": "rouge", "RISQUE ÉLEVÉ": "orange", "À COMPLÉTER": "orange",
    "REVUE PROFESSIONNELLE OBLIGATOIRE": "gris", "CONFORME AU VU DES PIÈCES": "vert" };
  A.D.push({ k: "bandeau", couleur: COULEUR[affiche] || "gris", t: affiche, sous: sn.action });

  const nc = V.filter(x => x.v.etat === ETATS.NC);
  const bl = nc.filter(x => ACT.gr(x.id) === ACT.B);
  const rq = V.filter(x => x.v.etat === ETATS.RISQ);
  const mq = V.filter(x => x.v.etat === ETATS.MANQ);
  const ok = V.filter(x => x.v.etat === ETATS.CONF);
  const so = V.filter(x => x.v.etat === ETATS.SO);
  const aFaire = [...nc, ...mq, ...rq].sort((a, b) =>
      ACT.rangQuand(ACT.de(a.id).quand) - ACT.rangQuand(ACT.de(b.id).quand)
   || ACT.RANG[ACT.gr(a.id)] - ACT.RANG[ACT.gr(b.id)]);
  const susp = mq.concat(rq).filter(x => ACT.gr(x.id) === ACT.B);
  const exam = V.filter(x => DETECTION.has(x.id) && x.v.etat !== ETATS.SO);

  const poids = { [ACT.B]: 4, [ACT.CR]: 3, [ACT.IM]: 2, [ACT.IN]: 1 };
  const parSujet = {};
  [...nc, ...mq, ...rq].forEach(x => { const s = x.rubrique || "Divers";
    (parSujet[s] = parSujet[s] || { n: 0, poids: 0 }).n++; parSujet[s].poids += poids[ACT.gr(x.id)] || 1; });
  const prio = Object.entries(parSujet).sort((a, b) => b[1].poids - a[1].poids).slice(0, 3);
  const decision = bl.length
    ? "Ne poursuivez aucune étape avant correction des points bloquants."
    : (nc.length ? "Vous pouvez poursuivre, mais le fonctionnement du comité est exposé : traitez les non-conformités d'abord."
    : ((mq.length || rq.length) ? "Ne franchissez pas les étapes irréversibles — dépôt des listes, scrutin, recueil de l'avis — avant d'avoir produit les pièces demandées."
    : "Aucune correction n'est requise au vu des pièces versées."));
  p(sn.motif);
  tab(["Question", "Réponse"], [
   ["Où en sommes-nous ?", affiche],
   ["Pouvons-nous avancer ?", decision],
   ["Pourquoi", `${nc.length} non-conformité(s), ${mq.length} donnée(s) manquante(s), ${rq.length} risque(s) à vérifier, ${ok.length} point(s) démontré(s) sur ${V.length} contrôles.`],
   ["Les trois priorités", prio.length ? prio.map((e, i) => `${i + 1}. ${e[0]} (${e[1].n} point(s))`).join(" · ") : "aucune"],
   ["Action suivante", bl.length ? "Corriger les points du 1, puis relancer l'audit." : "Produire les pièces listées au 2, puis relancer l'audit."],
   ["Limite", sn.pro.length ? "Revue professionnelle obligatoire : le dossier comporte " + sn.pro.join(", ") + "."
     : "L'audit ne porte que sur les points que la base sait contrôler ; il ne vaut pas validation juridique."]]);
  note("Cette page se suffit à elle-même : elle peut être imprimée seule et remise à la direction ou au comité. Le détail commence à la page suivante.");
  A.D.push({ k: "saut" });

  h2("1 · Ce qu'il ne faut pas faire aujourd'hui");
  p("Trois situations différentes, à ne pas confondre : l'écart constaté, le point non vérifiable faute d'information, et le sujet qui appelle un examen extérieur.");
  h3("Écart constaté");
  if (bl.length) { p("Un texte s'oppose à la poursuite tant que ces points ne sont pas corrigés.");
    bl.forEach(x => A.D.push({ k: "interdit", id: x.id, ton: "certain", t: ACT.interdit(x.id, x.v.etat), pourquoi: x.v.motif })); }
  else if (nc.length) p(`Aucun texte n'interdit formellement de poursuivre. ${nc.length} non-conformité(s) exposent cependant le fonctionnement du comité : voir le point 2.`);
  else p("Aucun écart n'a été constaté sur les contrôles exécutés.");
  h3("Point non vérifié");
  if (susp.length) { p("Ces points portent sur des exigences dont le manquement interdirait de poursuivre. La donnée n'ayant pas été fournie, l'application ne constate ni le respect, ni le manquement.");
    susp.forEach(x => A.D.push({ k: "interdit", id: x.id, ton: "reserve", t: ACT.interdit(x.id, x.v.etat), pourquoi: x.v.motif })); }
  else p("Aucune exigence essentielle ne reste non vérifiée.");
  h3("Sujet hors du champ de l'application");
  if (exam.length) { p("Sur ces sujets, l'application détecte une situation et s'arrête là : elle ne conclut jamais à la conformité.");
    exam.forEach(x => A.D.push({ k: "interdit", id: x.id, ton: "examen", t: "À faire examiner avant toute décision : " + x.objet, pourquoi: x.v.motif })); }
  else p("Aucun sujet de ce type n'est signalé dans votre dossier.");

  h2("2 · Ce qu'il faut faire, dans l'ordre");
  if (aFaire.length) {
    p("Chaque ligne est un geste à accomplir, groupé par étape. L'étiquette de droite dit la portée du manquement ; « bloquant » signifie qu'un texte s'oppose à la poursuite si l'exigence n'est pas satisfaite.");
    let n = 0;
    for (const q of ACT.ORDRE) {
      const l = aFaire.filter(x => ACT.de(x.id).quand === q);
      if (!l.length) continue;
      A.D.push({ k: "etape", t: q, compte: l.length + (l.length > 1 ? " actions" : " action") });
      l.forEach(x => A.D.push({ k: "acte", n: ++n, t: ACT.de(x.id).faire, pourquoi: x.v.motif,
        priorite: ACT.gr(x.id), etat: x.v.etat, id: x.id }));
    }
  } else p("Aucune action n'est requise au vu des pièces versées.");

  h2("3 · Ce qui est en ordre");
  if (ok.length) { p("Points satisfaits au vu des pièces versées.");
    ok.forEach(x => A.D.push({ k: "acquis", t: x.objet.replace(/\s*\?$/, ""), base: x.v.motif })); }
  else p("Aucun contrôle ne ressort conforme : le dossier n'est pas encore assez documenté.");
  if (so.length) note(`${so.length} contrôle(s) sont sans objet dans votre configuration : ${so.map(x => x.id).join(", ")}.`);

  h2("4 · Deux lectures de ce même résultat");
  enc("Pour la direction",
   `Ce qu'il vous reste à faire : ${aFaire.length} action(s), dont ${aFaire.filter(x => ACT.gr(x.id) === ACT.B).length} sur des exigences bloquantes. `
   + (bl.length ? `${bl.length} écart(s) constaté(s) doivent être corrigés avant tout acte suivant. `
      : (susp.length ? `Aucun écart constaté, mais ${susp.length} exigence(s) essentielle(s) restent non vérifiées. ` : "Aucun écart ni point essentiel non vérifié. "))
   + "Le défaut de consultation obligatoire constitue un trouble manifestement illicite, et l'entrave au fonctionnement régulier du comité est punie de 7 500 euros d'amende.");
  enc("Pour le comité",
   "Ce que le dossier ne permet pas encore d'apprécier : "
   + (prio.length ? prio.map(e => e[0].toLowerCase()).join(", ") + ". " : "rien de significatif. ")
   + `${mq.length} information(s) manquent au dossier. `
   + "Le comité dispose d'un délai d'examen suffisant et d'informations précises et écrites ; s'il estime ne pas en disposer, il peut saisir le président du tribunal judiciaire (L. 2312-15). Il est en outre recevable à invoquer par voie d'exception, sans condition de délai, l'illégalité d'une clause d'accord collectif qui violerait ses prérogatives.");

  h2("5 · Ce que veut dire le résultat annoncé");
  tab(["Résultat", "Ce qu'il veut dire", "Ce que vous devez en faire"], [
   ["BLOQUÉ", "Un texte s'oppose à la poursuite.", "Corriger les points du 1 avant tout acte suivant."],
   ["RISQUE ÉLEVÉ", "Rien n'interdit de poursuivre, mais un ou plusieurs points exposent à l'annulation ou à la sanction.", "Traiter les points du 2 avant de décider."],
   ["À COMPLÉTER", "Le dossier n'est pas assez renseigné pour conclure.", "Produire les pièces du 2, puis relancer l'audit."],
   ["CONFORME AU VU DES PIÈCES", "Aucun écart sur les points contrôlés, compte tenu des pièces versées.", "Ce n'est pas une validation juridique."],
   ["REVUE PROFESSIONNELLE OBLIGATOIRE", "La situation comporte un élément que l'application ne sait pas trancher seule.", "Faire relire le dossier par un professionnel."]]);

  /* ---------------- détail ---------------- */
  h1("Verdict — état du dossier");
  p("Détail du résultat de la première page. Chaque ligne est un contrôle : non pas ce que la loi exige, mais si ce que vous avez décrit y satisfait.");
  const cpt = {}; V.forEach(x => cpt[x.v.etat] = (cpt[x.v.etat] || 0) + 1);
  tab(["État", "Nombre", "Ce que cela signifie"], [
   [ETATS.NC, String(cpt[ETATS.NC] || 0), "Le dossier contredit une exigence légale."],
   [ETATS.RISQ, String(cpt[ETATS.RISQ] || 0), "L'exigence est peut-être satisfaite, mais rien ne l'établit."],
   [ETATS.MANQ, String(cpt[ETATS.MANQ] || 0), "La donnée n'a pas été fournie : aucune conclusion n'est tirée."],
   [ETATS.CONF, String(cpt[ETATS.CONF] || 0), "L'exigence est satisfaite au vu des pièces déclarées."],
   [ETATS.SO, String(cpt[ETATS.SO] || 0), "Le contrôle ne s'applique pas à cette configuration."]]);
  for (const e of [ETATS.NC, ETATS.RISQ, ETATS.MANQ, ETATS.CONF, ETATS.SO]) {
    const l = V.filter(x => x.v.etat === e);
    if (!l.length) continue;
    h3(e.charAt(0).toUpperCase() + e.slice(1));
    l.sort((a, b) => ACT.RANG[ACT.gr(a.id)] - ACT.RANG[ACT.gr(b.id)]);
    tab(["Contrôle", "Priorité", "Objet", "Constat", "Fondement"],
      l.map(x => [x.id + (DETECTION.has(x.id) ? " (détection)" : ""), ACT.gr(x.id), x.objet, x.v.motif,
        (x.fondement || []).join(" · ") || "—"]));
  }
  h3("Ce que signifie la colonne « priorité »");
  tab(["Priorité", "Signification"], ACT.DEF);

  h1("1 · Ce que la loi exige, appliqué à votre situation");
  for (const r of retenues) {
    h3(`${r.id} — ${r.question}`);
    p(r.alors(f));
    note("Fondement : " + r.fondement.map(artFr).join(", ") + " du code du travail.");
    if (r.juris.length) note("Jurisprudence : " + r.juris.map(j =>
      `Cass. ${j.ch.replace("Chambre ", "ch. ")} ${dateFr(j.date)}, n° ${j.num}`).join(" · ") + ".");
    if (r.erreurs && r.erreurs.length) r.erreurs.forEach(e => puce("Erreur à éviter : " + e));
    if (r.pieces && r.pieces.length) note("Pièces : " + r.pieces.join(" · ") + ".");
  }

  h1("2 · Les textes applicables");
  p("Texte intégral des articles retenus, dans leur version en vigueur au 15 août 2026, tels qu'ils ont été lus sur Légifrance. Chaque article porte l'identifiant de la version reproduite : un article peut être modifié sans changer de numéro, et c'est cet identifiant, non le numéro, qui dit laquelle des versions successives a été lue.");
  const arts = [...new Set(retenues.flatMap(r => r.fondement))].sort();
  for (const a of arts) { const v = T[a];
    if (!v || !v.texte) { h3(artFr(a)); note("Article non lu à la source : il n'est pas reproduit."); continue; }
    h3(artFr(a)); p(net(v.texte)); note(`Version reproduite : ${v.id}.`); }

  h1("3 · La jurisprudence applicable");
  p("Sommaires publiés de la Cour de cassation, tels qu'elle les a écrits.");
  const vus = new Set();
  for (const r of retenues) for (const j of r.juris) {
    if (vus.has(j.num + j.date)) continue; vus.add(j.num + j.date);
    h3(`Cass. ${j.ch.replace("Chambre ", "ch. ")} ${dateFr(j.date)}, n° ${j.num} — ${j.sol}`);
    p(j.sommaire || "(sans sommaire publié)");
    if (j.rapport) note("Publié au Rapport annuel de la Cour.");
  }

  h1("4 · Ce que cet audit ne couvre pas");
  puce("Le contentieux du délit d'entrave : aucun arrêt publié du corpus ne s'y rattache, la base signale le texte et s'arrête là.");
  puce("Le calcul de la masse salariale brute au-delà de la définition légale de l'assiette : la base ne lit pas les déclarations sociales.");
  puce("Les stipulations des accords collectifs applicables au comité : la base demande s'ils existent, elle ne les lit pas.");
  puce("Le comité de groupe et le comité d'entreprise européen.");
  puce("Le contentieux administratif de l'autorisation de licenciement des salariés protégés.");
  enc("Le refus est une réponse",
   "Une question que la base ne couvre pas est signalée comme telle, et non traitée par analogie : c'est la condition pour que le reste soit exact.");

  h1("Annexe · Traçabilité du résultat");
  tab(["Traçabilité", "Valeur"], [
   ["Date de génération", new Date().toISOString().slice(0, 10)],
   ["Date de contrôle des sources", "15 août 2026 — articles relus sur Légifrance à cette date"],
   ["Articles lus à la source", String(Object.values(T).filter(v => v && v.texte).length)],
   ["Articles demandés sans réponse de la source", `${Object.values(T).filter(v => !v || !v.texte).length} — aucune règle ne peut s'y fonder : le chargement de la grille échoue si une règle cite un article dont le texte est absent`],
   ["Vérification des versions", "node verifier-textes.js — rejoue la lecture de chaque article et signale tout écart d'identifiant ou de contenu"],
   ["Règles de la base", `${GRILLE.length} dont ${retenues.length} applicables`],
   ["Contrôles exécutés", `${CONTROLES.length} dont ${DETECTION.size} de détection`],
   ["Corpus de jurisprudence", "163 arrêts publiés, du 24 janvier 2018 au 8 juillet 2026"],
   ["Accords collectifs versés", f.accordsCse && f.accordsCse.length ? `${f.accordsCse.length} déclaré(s), non lus par la base` : "non renseignés"]]);

  /* --- Ce que l'audit n'a pas exercé. ---
     Symétrique de l'annexe du module économique, et pour la même raison : un
     rapport qui ne publie que ce qu'il a vérifié laisse croire qu'il a tout
     vérifié. Les chiffres sont ceux du manifeste, produits par l'exécution. */
  h3("Ce que cet audit n'a pas exercé");
  p("Les lignes qui précèdent disent sur quoi le résultat repose. Celles-ci disent ce qu'il ne couvre pas — non par omission, mais parce que c'est mesuré et publié. Un audit qui ne dit pas où s'arrête sa propre couverture n'est pas opposable.");
  const _c = (MAN && MAN.compteurs) || {};
  tab(["Mesure", "Valeur", "Ce que cela veut dire"], [
   ["Règles de la base non applicables à votre situation",
    `${GRILLE.length - retenues.length} sur ${GRILLE.length}`,
    "Leur condition d'application n'est pas remplie par votre dossier. Elles n'ont donc rien dit, ni dans un sens ni dans l'autre."],
   ["Règles qu'aucun dossier d'épreuve n'a jamais déclenchées",
    _c.reglesJamaisDeclenchees !== undefined ? String(_c.reglesJamaisDeclenchees) : "—",
    "Elles sont écrites sur des articles lus à la source, mais aucune fiche d'épreuve du dépôt ne les a encore exercées : elles n'ont jamais été mises à l'épreuve. C'est la mesure exacte de la couverture réelle, et elle est publiée plutôt que tue."],
   ["Contrôles restés sans objet sur votre dossier", `${so.length} sur ${V.length}`,
    "Le contrôle ne s'applique pas à votre configuration. « Sans objet » n'est pas « conforme »."],
   ["Contrôles n'ayant pas pu conclure faute de données", `${mq.length} sur ${V.length}`,
    "La donnée n'a pas été fournie. Aucune conclusion n'en a été tirée, dans aucun sens."],
   ["Contrôles de détection", String(DETECTION.size),
    "Ils signalent une situation et s'arrêtent là : ils ne concluent jamais à la conformité, parce que le sujet excède ce qu'une base peut trancher."],
   ["Contrôles de cohérence", String(COHERENCE.size),
    "Ils ne vérifient pas une donnée mais la relation entre deux — ici, l'effectif déclaré confronté aux relevés mensuels du même dossier. C'est là que se cachent les conformités fausses."],
   ["Articles demandés à la source restés sans réponse",
    _c.articlesSansReponse !== undefined ? String(_c.articlesSansReponse) : "—",
    "Aucune règle ne peut s'y fonder : le chargement de la grille échoue si une règle cite un article dont le texte est absent."],
   ["Dossiers construits pour mettre les contrôles en défaut",
    _c.casContradictoires !== undefined ? String(_c.casContradictoires) : "—",
    "Chaque contrôle susceptible de constater une non-conformité doit la constater au moins une fois sur ces dossiers, sans quoi la publication échoue."]]);
  enc("Ce que la loi elle-même ne tranche pas",
   "La règle de composition des listes de l'article L. 2314-30 est arithmétiquement contradictoire dans un peu moins d'un cas sur cent : l'arrondi prescrit ne retombe pas sur le nombre de candidats à désigner. Le texte ne règle pas ce cas et aucun arrêt publié du corpus ne le tranche. L'application s'arrête et l'écrit, au lieu de choisir — le refus figure alors dans le corps du rapport, à l'endroit de la question.");
  return A.D;
}
module.exports = audit;
if (require.main === module) {
  const f = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
  const items = audit(f);
  fs.writeFileSync("_cse_audit.js", "module.exports=" + JSON.stringify(items) + ";");
  fs.writeFileSync("_cse_audit.json", JSON.stringify(items));
  console.log("items :", items.length);
}
