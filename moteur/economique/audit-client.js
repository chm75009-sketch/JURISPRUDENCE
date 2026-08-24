/* Génération de l'audit à partir de la fiche du client.
   Règle absolue : rien n'est écrit ici qui ne vienne de la grille ou du moteur.
   Ce fichier ne contient aucune affirmation juridique — il met en forme. */
const M = require("./moteur.js");
const GRILLE = require("./grille.js");
const O = require("./outils.js");
const { C: CONTROLES, ETATS, niveauDe } = require("./controles.js");
const PREUVE = require("./preuve.js");
const { DETECTION } = require("./registre.js");
const GR = require("./gravite.js");
const MAN = require("./manifeste.js");
const ACT = require("./actions.js");

const CAUSE = {1:"Difficultés économiques (1°)",2:"Mutations technologiques (2°)",
  3:"Réorganisation nécessaire à la sauvegarde de la compétitivité (3°)",4:"Cessation d'activité (4°)"};
const dateFr = s => { if(!s) return "—"; const [a,m,j]=s.split("-");
  const L=["","janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
  return `${+j}${+j===1?"er":""} ${L[+m]} ${a}`; };
const refArret = j => `Cass. ${j.ch} ${dateFr(j.date)}, n° ${j.num}`;

const vide2 = x => x === undefined || x === null || x === "" || (Array.isArray(x) && !x.length);
function audit(f) {
  const A = O(); const {sur,t1,trait,h1,h2,h3,p,note,puce,enc,tab} = A;
  const retenues = GRILLE.filter(r => { try { return r.si(f); } catch(e){ return false; } });
  const nonCouvertes = GRILLE.length - retenues.length;

  sur("Audit — licenciement pour motif économique · article L. 1233-3 du code du travail");
  t1(f.entreprise || "Audit de situation");
  sur(`${retenues.length} règles applicables sur ${GRILLE.length} de la base`);
  trait();
  /* --- 0. Statut et traçabilité, en première page --- */
  const _v0 = CONTROLES.map(x => ({ ...x, v: (() => { try { return x.verdict(f); }
    catch (e) { return { etat: ETATS.MANQ, motif: "Contrôle non exécutable." }; } })() }));
  const _sn = GR.statutNormalise(_v0, f, M.regimeEco(f).pse);
  const _st = GR.statut(_v0);
  /* Le statut normalisé : cinq valeurs possibles, une seule affichée. */
  /* La revue professionnelle ne masque jamais un blocage : elle s'y ajoute.
     Elle ne devient le statut que lorsque rien de plus grave n'est constaté. */
  const _affiche = _sn.statut === "CONFORME AU VU DES PIÈCES" && _sn.pro.length
    ? "REVUE PROFESSIONNELLE OBLIGATOIRE" : _sn.statut;
  const COULEUR = { "BLOQUÉ":"rouge", "RISQUE ÉLEVÉ":"orange", "À COMPLÉTER":"orange",
    "REVUE PROFESSIONNELLE OBLIGATOIRE":"gris", "CONFORME AU VU DES PIÈCES":"vert" };
  A.D.push({ k:"bandeau", couleur: COULEUR[_affiche] || "gris", t: _affiche, sous: _sn.action });

  /* --- Page de décision : que faire, dans quel ordre, avant quel acte. --- */
  const _nc  = _v0.filter(x => x.v.etat === ETATS.NC);
  const _bl  = _nc.filter(x => GR.de(x.id) === GR.B);
  const _rq  = _v0.filter(x => x.v.etat === ETATS.RISQ);
  const _mq  = _v0.filter(x => x.v.etat === ETATS.MANQ);
  const _ok  = _v0.filter(x => x.v.etat === ETATS.CONF);
  const _so  = _v0.filter(x => x.v.etat === ETATS.SO);
  /* Les priorités : les trois sujets qui portent le plus de points en attente,
     pondérés par la gravité. Rien n'est choisi à la main. */
  const _poids = { [GR.B]:4, [GR.CR]:3, [GR.IM]:2, [GR.IN]:1 };
  const _parSujet = {};
  [..._nc, ..._mq, ..._rq].forEach(x => {
    const s = x.rubrique || "Divers";
    (_parSujet[s] = _parSujet[s] || { n:0, poids:0 }).n++;
    _parSujet[s].poids += _poids[GR.de(x.id)] || 1;
  });
  const _prio = Object.entries(_parSujet).sort((a,b) => b[1].poids - a[1].poids).slice(0,3);
  const _decision = _bl.length
    ? "Ne poursuivez aucune étape de la procédure avant correction des points bloquants."
    : (_nc.length ? "Vous pouvez poursuivre, mais la procédure est exposée : traitez les non-conformités d'abord."
    : (_mq.length || _rq.length ? "Ne franchissez pas les étapes irréversibles — notification, saisine de l'administration — avant d'avoir produit les pièces demandées."
    : "Aucune correction n'est requise au vu des pièces versées."));
  p(`${_sn.motif}`);
  tab(["Question", "Réponse"], [
   ["Où en sommes-nous ?", _affiche],
   ["Pouvons-nous avancer ?", _decision],
   ["Pourquoi", `${_nc.length} non-conformité(s), ${_mq.length} donnée(s) manquante(s), ${_rq.length} risque(s) à vérifier, ${_ok.length} point(s) démontré(s) sur ${_v0.length} contrôles.`],
   ["Les trois priorités", _prio.length ? _prio.map((e,i) => `${i+1}. ${e[0]} (${e[1].n} point(s))`).join(" · ") : "aucune"],
   ["Action suivante", _bl.length ? "Corriger les points du 1, puis relancer l'audit." : "Produire les pièces listées au 2, puis relancer l'audit."],
   ["Limite", _sn.pro.length
     ? "Revue professionnelle obligatoire : le dossier comporte " + _sn.pro.join(", ") + "."
     : "L'audit ne porte que sur les points que la base sait contrôler ; il ne vaut pas validation juridique."]]);
  note("Cette page se suffit à elle-même : elle peut être imprimée seule et remise à la direction ou au comité. Le détail commence à la page suivante.");
  A.D.push({ k:"saut" });
  /* L'ordre est celui de la procédure, puis celui de la gravité : on lit la
     liste de haut en bas et on la traite dans cet ordre. */
  const _aFaire = [..._nc, ..._mq, ..._rq].sort((a,b) =>
      ACT.rangQuand(ACT.de(a.id).quand) - ACT.rangQuand(ACT.de(b.id).quand)
   || GR.RANG[GR.de(a.id)] - GR.RANG[GR.de(b.id)]);

  /* Une donnée manquante sur un point bloquant n'est pas une non-conformité :
     elle interdit seulement d'avancer tant qu'elle n'est pas fournie. */
  const _susp = _mq.concat(_rq).filter(x => GR.de(x.id) === GR.B);
  const _exam = _v0.filter(x => DETECTION.has(x.id) && x.v.etat !== ETATS.SO);
  h2("1 · Ce qu'il ne faut pas faire aujourd'hui");
  p("Trois situations différentes, à ne pas confondre : l'écart constaté, le point non vérifiable faute d'information, et le sujet qui appelle un examen extérieur à l'application.");
  h3("Écart constaté — la procédure est bloquée");
  if (_bl.length) {
    p("Un texte s'oppose à la poursuite de la procédure tant que ces points ne sont pas corrigés.");
    _bl.forEach(x => A.D.push({ k:"interdit", id:x.id, ton:"certain",
      t: ACT.interdit(x.id, x.v.etat), pourquoi: x.v.motif }));
  } else if (_nc.length) {
    p("Aucun texte n'interdit formellement de poursuivre. " + _nc.length
      + " non-conformité(s) exposent cependant la procédure à contestation : voir le point 2.");
  } else {
    p("Aucun écart n'a été constaté sur les contrôles exécutés.");
  }
  h3("Point non vérifié — à ne pas franchir tant que l'information manque");
  if (_susp.length) {
    p("Ces points portent sur des exigences dont le manquement interdirait de poursuivre. La donnée n'ayant pas été fournie, l'application ne constate ni le respect, ni le manquement : elle ne peut pas conclure. Ne franchissez pas l'étape correspondante avant de les avoir vérifiés.");
    _susp.forEach(x => A.D.push({ k:"interdit", id:x.id, ton:"reserve",
      t: ACT.interdit(x.id, x.v.etat), pourquoi: x.v.motif }));
  } else {
    p("Aucune exigence essentielle ne reste non vérifiée.");
  }
  h3("Sujet hors du champ de l'application — à faire examiner avant toute décision");
  if (_exam.length) {
    p("Sur ces sujets, l'application détecte une situation et s'arrête là : elle ne conclut jamais à la conformité. Ils appellent l'examen d'un professionnel.");
    _exam.forEach(x => A.D.push({ k:"interdit", id:x.id, ton:"examen",
      t: "À faire examiner avant toute décision : " + x.objet,
      pourquoi: x.v.motif }));
  } else {
    p("Aucun sujet de ce type n'est signalé dans votre dossier.");
  }

  h2("2 · Ce qu'il faut faire, dans l'ordre");
  if (_aFaire.length) {
    p("Chaque ligne est un geste à accomplir. Elles sont groupées par étape de la procédure : tant qu'une étape n'est pas soldée, l'acte qui lui donne son nom ne doit pas être accompli. L'étiquette de droite dit la portée du manquement ; « bloquant » signifie qu'un texte s'oppose à la poursuite si l'exigence n'est pas satisfaite.");
    let _n = 0;
    for (const q of ACT.ORDRE) {
      const l = _aFaire.filter(x => ACT.de(x.id).quand === q);
      if (!l.length) continue;
      A.D.push({ k:"etape", t:q, compte: l.length + (l.length > 1 ? " actions" : " action") });
      l.forEach(x => A.D.push({ k:"acte", n: ++_n, t: ACT.de(x.id).faire,
        pourquoi: x.v.motif, priorite: GR.de(x.id), etat: x.v.etat, id: x.id }));
    }
  } else {
    p("Aucune action n'est requise au vu des pièces versées et des contrôles exécutés.");
  }

  h2("3 · Ce qui est en ordre");
  if (_ok.length) {
    p("Points satisfaits au vu des pièces versées. Rien n'est à refaire ici — sauf si une pièce change.");
    _ok.forEach(x => A.D.push({ k:"acquis", t: x.objet.replace(/\s*\?$/, ""), base: x.v.motif }));
  } else {
    p("Aucun contrôle ne ressort conforme : le dossier n'est pas encore assez documenté pour qu'un point soit acquis.");
  }
  if (_so.length)
    note(_so.length + " contrôle(s) sont sans objet dans votre configuration — ils ne concernent pas ce dossier : " + _so.map(x => x.id).join(", ") + ".");

  h2("4 · Deux lectures de ce même résultat");
  p("Le dossier ne dit pas la même chose selon qui le lit. Les deux encadrés ci-dessous tirent du même résultat ce qui intéresse chacun.");
  enc("Pour la direction",
   "Ce qu'il vous reste à faire : " + (_aFaire.length ? _aFaire.length + " action(s), dont "
     + _aFaire.filter(x => GR.de(x.id) === GR.B).length + " sur des exigences bloquantes"
     : "aucune action") + ". "
   + (_bl.length ? "La procédure est bloquée : " + _bl.length + " écart(s) constaté(s) doivent être corrigés avant tout acte suivant. "
      : (_susp.length ? "Aucun écart n'est constaté, mais " + _susp.length + " exigence(s) essentielle(s) restent non vérifiées : les étapes irréversibles — notification, saisine de l'administration — ne doivent pas être franchies avant de les avoir documentées. "
      : "Aucun écart ni point essentiel non vérifié. "))
   + "Conséquence d'une pièce non produite : la règle correspondante ne pourra jamais sortir en « conforme », et l'employeur supporte la charge de la preuve devant le juge.");
  enc("Pour le comité social et économique",
   "Ce que le dossier ne permet pas encore d'apprécier : "
   + (_prio.length ? _prio.map(e => e[0].toLowerCase()).join(", ") + ". " : "rien de significatif. ")
   + (_mq.length ? _mq.length + " information(s) manquent au dossier, dont " + _mq.filter(x => GR.de(x.id) === GR.B).length + " sur des exigences essentielles. " : "")
   + "L'absence de non-conformité relevée par l'application ne vaut ni approbation du projet, ni avis éclairé : le comité dispose d'un délai d'examen suffisant et d'informations précises et écrites (L. 2312-15), et peut saisir le président du tribunal judiciaire s'il estime ne pas en disposer.");

  h2("5 · Où trouver quoi dans la suite du document");
  p("Vous n'avez pas à lire ce document en entier. Les trois points ci-dessus suffisent pour agir. Le reste répond à une question précise ; cherchez la vôtre dans la colonne de gauche.");
  tab(["Si vous voulez savoir…", "Allez à la partie"], [
   ["Ce que je dois faire maintenant, et dans quel ordre", "La page 1, puis les points 1 à 3"],
   ["Pourquoi l'application répond cela, point par point", "« Verdict — état du dossier »"],
   ["Ce que l'application a compris de mon entreprise et de mon projet", "« 1 · Qualification de la situation »"],
   ["Ce que la loi exige exactement dans mon cas", "« 2 · Ce que la loi exige »"],
   ["Le texte même des articles, pour le lire ou le citer", "« 2 bis · Les textes applicables »"],
   ["Ce que les tribunaux ont déjà jugé sur ces questions", "« 3 · La jurisprudence applicable »"],
   ["Quels documents je dois réunir, et ce que chacun démontre", "« 4 · Les pièces à produire »"],
   ["Ce qui fait perdre ce type de dossier devant le juge", "« 5 · Les erreurs à ne pas commettre »"],
   ["À quelle date faire chaque acte de la procédure", "« 6 · Calendrier calculé »"],
   ["Si mes textes sont à jour au jour d'aujourd'hui", "« Fraîcheur des sources »"],
   ["Ce que l'application ne sait pas traiter, et qu'il faut confier à un conseil", "« 7 · Ce que cet audit ne couvre pas »"],
   ["D'où viennent ces réponses et à quelle date elles ont été établies", "« Annexe · Traçabilité »"]]);
  h2("6 · Ce que veut dire le résultat annoncé");
  p("L'application ne rend que l'un de ces cinq résultats. Le vôtre est le premier de la liste qui corresponde à votre dossier — c'est celui qui figure en tête de ce document.");
  tab(["Résultat", "Ce qu'il veut dire", "Ce que vous devez en faire"], [
   ["BLOQUÉ", "Un texte s'oppose à la poursuite de la procédure.", "Corriger les points du 1 avant tout acte suivant. Ne pas notifier."],
   ["RISQUE ÉLEVÉ", "Rien n'interdit de poursuivre, mais un ou plusieurs points exposent la procédure à être annulée.", "Traiter les points du 2 avant de décider."],
   ["À COMPLÉTER", "Le dossier n'est pas assez renseigné pour que l'application puisse conclure.", "Produire les pièces du 2, puis relancer l'audit."],
   ["CONFORME AU VU DES PIÈCES", "Aucun écart sur les points contrôlés, compte tenu des pièces versées.", "Ce n'est pas une validation juridique : la réalité de la cause économique reste appréciée par le juge."],
   ["REVUE PROFESSIONNELLE OBLIGATOIRE", "Votre situation comporte un élément que l'application ne sait pas trancher seule.", "Faire relire le dossier par un avocat ou un juriste en droit social avant de décider."]]);
  enc("Nature de ce document",
   "Cet audit est une aide à la préparation de votre dossier. Il rassemble, pour votre situation, les textes applicables, la jurisprudence publiée, les pièces à réunir et les délais à respecter. Chaque affirmation porte son fondement : un article du code du travail, un arrêt publié, ou un calcul. Il ne remplace ni l'analyse de votre conseil, ni la décision qui vous appartient.");
  if (_sn.pro.length)
    enc("Revue professionnelle obligatoire",
     "Le dossier comporte " + _sn.pro.join(", ") + ". Quel que soit le résultat ci-dessus, l'application produit une liste de contrôle et ne conclut pas à la conformité d'ensemble : faites relire le dossier par un avocat ou un juriste en droit social avant toute décision.");
  if (!f.conventionJointe || !f.accordsJoints)
    enc("Réserve — normes conventionnelles non versées",
     "Le présent audit est établi sur la seule loi. "
     + (!f.conventionJointe ? "Votre convention collective n'a pas été jointe. " : "")
     + (!f.accordsJoints ? "Vos accords d'entreprise n'ont pas été joints. " : "")
     + "Or ces textes priment sur la loi pour les critères d'ordre des licenciements, les délais de notification, les délais de consultation du comité, l'indemnité de licenciement, le préavis et la priorité de réembauche. Joignez-les au questionnaire : les règles correspondantes seront recalculées.");

  /* --- 0 bis. Verdict --- */
  const verdicts = _v0;
  const cpt = {}; verdicts.forEach(x => cpt[x.v.etat] = (cpt[x.v.etat] || 0) + 1);
  const ordre = [ETATS.NC, ETATS.RISQ, ETATS.MANQ, ETATS.CONF, ETATS.SO];
  h1("Verdict — état du dossier");
  p("Cette partie est le détail du résultat de la première page. Chaque ligne est un contrôle : non pas ce que la loi exige, mais si ce que vous avez décrit y satisfait. Une déclaration non justifiée par une pièce ne vaut jamais « conforme ».");
  enc("Détail — " + _st.titre, _st.detail);
  tab(["État", "Nombre", "Ce que cela signifie"], [
   [ETATS.NC, String(cpt[ETATS.NC] || 0), "Le dossier contredit une exigence légale. À corriger avant toute notification."],
   [ETATS.RISQ, String(cpt[ETATS.RISQ] || 0), "L'exigence est peut-être satisfaite, mais rien au dossier ne l'établit."],
   [ETATS.MANQ, String(cpt[ETATS.MANQ] || 0), "La donnée n'a pas été fournie : aucune conclusion n'est tirée."],
   [ETATS.CONF, String(cpt[ETATS.CONF] || 0), "L'exigence est satisfaite au vu des pièces déclarées."],
   [ETATS.SO, String(cpt[ETATS.SO] || 0), "Le contrôle ne s'applique pas à cette configuration."]]);
  for (const e of ordre) {
    const l = verdicts.filter(x => x.v.etat === e);
    if (!l.length) continue;
    h3(e.charAt(0).toUpperCase() + e.slice(1));
    l.sort((a,b) => GR.RANG[GR.de(a.id)] - GR.RANG[GR.de(b.id)]);
    tab(["Contrôle", "Priorité", "Objet", "Constat", "Niveau de preuve", "Source", "Version", "Contrôlé le"],
      l.map(x => [x.id + (DETECTION.has(x.id) ? " (détection)" : ""), GR.de(x.id), x.objet, x.v.motif, niveauDe(x, f, x.v),
        (x.fondement || []).join(" · ") || "—",
        "en vigueur au 15 août 2026", f.dateAudit || "—"]));
  }
  /* Registre des pièces */
  h3("Registre des pièces");
  p("Chaque pièce porte son identifiant, sa date, sa version et les règles qu'elle alimente. Une règle dont la pièce est « à produire » ne pourra pas sortir en « conforme ».");
  tab(["N°", "Pièce", "Statut", "Date", "Version", "Règles alimentées"],
    PREUVE.registre(f).map(r => [r.id, r.piece, r.statut, r.date, r.version, r.regles.join(", ")]));
  /* Revue professionnelle */
  const declencheurs = [];
  if (M.regimeEco(f).pse) declencheurs.push("un plan de sauvegarde de l'emploi");
  if (f.groupe) declencheurs.push("un groupe de sociétés");
  if ((f.salariesProteges || []).length) declencheurs.push("un ou plusieurs salariés protégés");
  if (f.transfertEnvisage) declencheurs.push("un transfert d'entité");
  if (f.procedureCollective) declencheurs.push("une procédure collective");
  if (f.coEmploi) declencheurs.push("une situation possible de co-emploi");
  if (!vide2(f.contentieuxEnCours)) declencheurs.push("un contentieux en cours");
  if (f.accordsJoints) declencheurs.push("des accords collectifs à articuler avec la loi");
  if (declencheurs.length)
    enc("Revue professionnelle obligatoire",
     "Le dossier comporte " + declencheurs.join(", ") + ". Le résultat qui suit ne vaut pas validation juridique : il doit être revu par un avocat ou un juriste en droit social avant toute décision. L'application produit une liste de contrôle, elle ne conclut pas à la conformité d'ensemble.");
  enc("Les contrôles marqués « détection »",
   "Six contrôles ne concluent jamais à la conformité : co-emploi, usages et engagements unilatéraux, contentieux en cours, situations individuelles — arrêt, maternité, inaptitude —, menace sur la compétitivité et expertise du comité. Ils détectent une situation qui appelle un examen extérieur à la base et produisent obligatoirement l'état « risque à vérifier ». Lire « contrôlé » comme « juridiquement validé » serait un contresens.");
  h3("Ce que signifie la colonne « priorité »");
  tab(["Priorité", "Signification"], GR.DEF);
  enc("Ce que ce verdict n'est pas",
   "Il ne dit pas que le licenciement est justifié, ni qu'il ne le sera pas. Il dit si les exigences que la base sait contrôler sont satisfaites au vu des éléments fournis. La réalité de la cause économique, l'appréciation du périmètre et la loyauté de la recherche de reclassement relèvent du juge, qui apprécie souverainement les faits.");

  /* --- 1. Qualification --- */
  h1("1 · Qualification de la situation");
  const et = f.dateNotification ? M.etatTexte(f.dateNotification) : null;
  tab(["Élément","Retenu","Source"],[
   ["Entreprise",f.entreprise||"—","fiche client"],
   ["Effectif",String(f.effectif)+" salariés","fiche client"],
   ["Tranche pour le seuil trimestriel",M.trancheEffectif(f.effectif),"L. 1233-3, 1° a) à d)"],
   ["Appartenance à un groupe",f.groupe?"oui":"non","fiche client"],
   ["Cause invoquée",CAUSE[f.cause]||"non renseignée","L. 1233-3"],
   ["Nombre de licenciements envisagés sur 30 jours",String(f.nbLicenciements),"fiche client"],
   ["Date de notification envisagée",dateFr(f.dateNotification),"fiche client"],
   ["Version applicable de l'article",et?et.etat:"—","Légifrance"],
   ["Régime de procédure",M.regimeEco(f).libelle,"L. 1233-8 et suivants"],
   ["Dispositif d'accompagnement",M.accompagnement(f).type,M.accompagnement(f).texte]]);
  if (f.refusAPC) enc("Attention — qualification",
   "La fiche indique un licenciement consécutif au refus d'un accord de performance collective. Ce licenciement n'est pas économique : voir la règle SOC-11 ci-dessous. Les développements qui suivent sur les causes, les critères d'ordre et l'accompagnement ne s'appliquent pas.");

  /* --- 2. Ce que la loi exige --- */
  h1("2 · Ce que la loi exige, appliqué à votre situation");
  const redigees = retenues.filter(r => r.source !== "article");
  for (const r of redigees) {
    h3(`${r.id} — ${r.question}`);
    p(r.alors(f));
    const fond = typeof r.fondement === "function" ? r.fondement(f) : r.fondement;
    if (fond.length) note("Fondement : " + fond.join(" · "));
  }
  /* Les articles applicables sont listés, non recopiés : le texte intégral n'est
     donné que pour ceux dont un seuil de la situation commande l'application. */
  const arts = retenues.filter(r => r.source === "article");
  const cible = arts.filter(r => (r.conditionsLisibles || []).length);
  h1("2 bis · Les textes applicables à votre situation");
  p(`${arts.length} articles du code du travail s'appliquent à votre configuration, dont ${cible.length} en raison d'un seuil que votre situation atteint. Chacun a été relu sur Légifrance dans sa version en vigueur au 15 août 2026, et porte son lien.`);
  const parRub = {};
  arts.forEach(r => { (parRub[r.rubrique] = parRub[r.rubrique] || []).push(r); });
  for (const [rub, l] of Object.entries(parRub)) {
    h3(rub);
    tab(["Article", "Objet", "Arrêts", "Légifrance"],
      l.map(r => [r.article, r.question, r.juris.length ? String(r.juris.length) : "—", r.lienLegifrance]));
  }
  if (cible.length) {
    h3("Textes dont l'application tient à un seuil de votre situation");
    for (const r of cible) {
      p(`${r.article} — ${r.alors(f)}`);
      note("Condition retenue : " + r.conditionsLisibles.join(", ") + "  —  " + r.lienLegifrance);
    }
  }

  /* --- 3. Jurisprudence --- */
  h1("3 · La jurisprudence applicable");
  const vus = new Set(); const lignes = [];
  for (const r of retenues) for (const j of r.juris) {
    const k = j.num; if (vus.has(k)) continue; vus.add(k);
    lignes.push([refArret(j), j.portee || (j.sol || ""), j.apport || (j.sommaire ? String(j.sommaire).replace(/\s+/g," ").slice(0,220) + "…" : "—"), (j.lien || "") + (r.id ? " · " + r.id : "")]);
  }
  if (lignes.length) tab(["Arrêt","Portée","Ce qu'il apporte","Règle"], lignes);
  else note("Aucun arrêt de la base ne se rattache aux règles retenues.");
  enc("Comment lire la colonne « portée »",
   "« Toujours valable » : la réforme n'a pas touché la solution. « Consacré par la loi » : la solution figure aujourd'hui dans le texte. « Dépassé » : la solution ne peut plus être transposée en l'état, la mention indiquant sur quel point. « Méthode imposée » : l'arrêt fixe une manière de calculer, non une solution de fond.");

  /* --- 4. Pièces --- */
  h1("4 · Les pièces à produire");
  const pieces = [...new Set(retenues.flatMap(r => r.pieces))];
  tab(["N°","Pièce","Règle qui l'exige","Fait"],
    pieces.map((x,i)=>[String(i+1), x,
      retenues.filter(r=>r.pieces.includes(x)).map(r=>r.id).join(", "), "☐"]));

  /* --- 5. Erreurs --- */
  h1("5 · Les erreurs à ne pas commettre");
  const err = [...new Set(retenues.flatMap(r => r.erreurs))];
  tab(["Erreur","Règle","Fondement"],
    err.map(x=>{ const r = retenues.find(r=>r.erreurs.includes(x));
      const fd = typeof r.fondement === "function" ? r.fondement(f) : r.fondement;
      return [x, r.id, (fd[0] || (r.juris[0]?refArret(r.juris[0]):"—"))]; }));

  /* --- 6. Calendrier --- */
  if (f.dateEntretien) {
    h1("6 · Calendrier calculé");
    const c = M.calendrier(f);
    tab(["Étape","Date","Texte"],[
     ["Convocation à l'entretien préalable","au moins 5 jours ouvrables avant l'entretien","L. 1233-11"],
     ["Entretien préalable",dateFr(c.entretien),"L. 1233-11"],
     ["Notification au plus tôt",dateFr(c.notificationAuPlusTot),"L. 1233-15"],
     ["Délai appliqué",c.delaiApplique,"L. 1233-15"]]);
    if (f.dateNotification && f.dateNotification < c.notificationAuPlusTot)
      enc("Anomalie de calendrier",
        `La notification envisagée le ${dateFr(f.dateNotification)} est antérieure à la date la plus proche autorisée, le ${dateFr(c.notificationAuPlusTot)}.`);
    else if (f.dateNotification)
      note(`La notification envisagée le ${dateFr(f.dateNotification)} respecte le délai.`);
  }

  /* --- 6 bis. Accords d'entreprise et convention --- */
  h1("Normes conventionnelles à verser");
  const acc = f.accords || {};
  tab(["Instrument","Déclaré","Effet sur les règles","Texte"],[
   ["Convention collective (IDCC " + (f.idcc || "non renseigné") + ")", f.idcc ? "oui" : "NON RENSEIGNÉE",
    "Prime sur les critères d'ordre, les délais de notification et l'indemnité de licenciement", "L. 1233-5, L. 1233-39"],
   ["Accord de méthode", acc.methode ? "oui" : "non",
    "Peut fixer, par dérogation, les modalités d'information et de consultation du comité et le cadre de l'expertise", "L. 1233-21"],
   ["Accord portant plan de sauvegarde de l'emploi", acc.pse ? "oui" : "non",
    "Peut déterminer le contenu du plan, les modalités de consultation et de mise en œuvre des licenciements", "L. 1233-24-1"],
   ["Accord de performance collective", acc.apc ? "oui" : "non",
    "Le licenciement qui suit un refus n'est pas économique et suit la procédure du licenciement individuel", "L. 2254-2"],
   ["Accord de gestion des emplois et des parcours", acc.gepp ? "oui" : "non",
    "Peut documenter les efforts d'adaptation et de formation", "—"]]);
  if (!f.idcc || !f.accordsDeposes)
    enc("Alerte — normes conventionnelles non vérifiées",
     (!f.idcc ? "La convention collective n'est pas identifiée : indiquez son numéro IDCC pour que le texte à jour soit consulté dans la base KALI de Légifrance. " : "") +
     (!f.accordsDeposes ? "Aucun accord d'entreprise n'a été déposé. Les accords priment sur plusieurs règles légales ; tant qu'ils ne sont pas versés, l'audit applique la loi et cette réserve subsiste. Déposez le texte intégral de chaque accord applicable." : ""));

  /* --- 6 ter. Fraîcheur des sources --- */
  h1("Fraîcheur des sources");
  const v = f.veille || {};
  tab(["Contrôle","Résultat","Portée"],[
   ["Version des articles du code du travail",
    v.articles ? `${v.articles.inchanges} inchangés, ${(v.articles.modifies||[]).length} modifiés depuis la lecture` : "non exécuté",
    "Un article modifié depuis la constitution de la base rend fausse la règle qui s'y appuie"],
   ["Convention collective",
    v.convention && v.convention.trouvee ? v.convention.titre : (f.idcc ? "non récupérée" : "IDCC non renseigné"),
    "Récupérée dans la base KALI de Légifrance à partir de l'IDCC"],
   ["Dernier texte publié de la convention",
    v.convention && v.convention.dernier ? v.convention.dernier : "—",
    "À confronter aux avenants que vous appliquez réellement"],
   ["Décisions publiées depuis la clôture du corpus",
    v.decisions ? `${v.decisions.nombre} depuis le ${v.decisions.depuis}` : "non exécuté",
    "Elles ne sont pas encore intégrées aux règles"],
   ["Confirmation de l'employeur sur la convention",
    f.conventionAJour || "non renseignée",
    "L'application ne peut pas savoir si la version publiée est celle que vous appliquez"],
   ["Avenants ou accords postérieurs à la publication",
    f.avenantsRecents || "non renseigné",
    "Le décalage entre signature et publication se compte parfois en mois"],
   ["Usages et engagements unilatéraux",
    f.usagesEtEngagements || "non renseignés",
    "Ils ne figurent dans aucune base publique et priment s'ils sont plus favorables"]]);
  if (v.decisions && v.decisions.nombre)
    { h3("Décisions publiées depuis la clôture du corpus — à examiner");
      tab(["Date","Arrêt","Chambre","Ce qu'en dit le sommaire","Lien"],
        v.decisions.decisions.slice(0,15).map(d=>[d.date,d.num,d.ch,
          (d.sommaire||"—").replace(/\s+/g," ").slice(0,180)+"…",d.lien])); }
  if (v.articles && (v.articles.modifies||[]).length)
    enc("Alerte — texte modifié depuis la constitution de la base",
      "Les articles suivants ont changé de version : " + v.articles.modifies.map(m=>m[0]).join(", ") +
      ". Les règles qui s'y appuient doivent être relues avant d'être invoquées.");

  /* --- 7. Limites --- */
  h1("7 · Ce que cet audit ne couvre pas");
  p(`La base compte ${GRILLE.length} règles pour le licenciement économique. ${retenues.length} s'appliquent à votre situation ; ${nonCouvertes} ne s'appliquent pas, soit parce qu'elles visent une autre cause, soit parce que la fiche ne renseigne pas la donnée qu'elles supposent.`);
  const manque = [];
  if (!f.convention) manque.push("la convention collective applicable n'est pas renseignée — les critères d'ordre, les délais et l'indemnité conventionnels n'ont pas pu être vérifiés");
  if (f.cause==="1" && !Array.isArray(f.trimestres)) manque.push("les données trimestrielles ne sont pas renseignées — le seuil n'a pas pu être calculé");
  if (f.groupe && !Array.isArray(f.societes)) manque.push("les sociétés du groupe ne sont pas renseignées — le périmètre du secteur n'a pas pu être délimité");
  if (f.groupe && typeof f.effectifGroupe !== "number") manque.push("l'effectif total du groupe n'est pas renseigné — le seuil de mille salariés n'a pas pu être vérifié");
  if (!f.dateEntretien) manque.push("la date d'entretien préalable n'est pas renseignée — le calendrier n'a pas pu être calculé");
  if (!Array.isArray(f.salaries)) manque.push("l'ancienneté et la rémunération des salariés ne sont pas renseignées — ni le préavis, ni l'indemnité, ni l'exposition au barème n'ont pu être calculés");
  if (!Array.isArray(f.categories)) manque.push("les catégories professionnelles et leurs effectifs ne sont pas renseignés — l'ordre des licenciements n'a pas pu être appliqué");
  if (f.salariesProteges === undefined) manque.push("la présence de salariés protégés n'est pas renseignée — l'exigence d'autorisation administrative n'a pas pu être vérifiée");
  if (manque.length) { h3("Données manquantes"); manque.forEach(puce); }
  else note("Toutes les données nécessaires aux règles retenues ont été fournies.");
  h3("Données que la base ne sait pas encore exploiter");
  puce("Les accords d'entreprise autres que l'accord de performance collective — accord de méthode, accord portant plan de sauvegarde de l'emploi, accord de gestion des emplois.");
  puce("La liste des postes disponibles dans le groupe : la règle de reclassement énonce l'obligation, elle ne vérifie pas son exécution.");
  puce("Les salariés en arrêt, en congé maternité ou déclarés inaptes.");
  puce("Les contrats à durée déterminée, les intérimaires et les recrutements récents, qui fragilisent la démonstration de la suppression d'emploi.");
  puce("Les dates réelles de convocation, de réunion et d'avis du comité social et économique : le calendrier calculé ne porte que sur l'entretien et la notification.");
  h3("Hors du champ de la base");
  puce("Le co-emploi et l'imputation de la cause à la société mère.");
  puce("Le contentieux du plan de sauvegarde de l'emploi devant le juge administratif : la base signale la compétence, elle ne traite pas le recours.");
  puce("Le régime fiscal et social des indemnités.");
  puce("Les stipulations de la convention collective elle-même : la base demande si elles existent, elle ne les lit pas.");
  enc("Le refus est une réponse",
   "Ce qui précède n'est pas une réserve de style. Une question qui n'est pas couverte par la base doit être signalée comme telle, et non traitée par analogie : c'est la seule façon de garantir que ce qui est écrit ailleurs dans ce document est exact.");

  /* --- Annexe. Traçabilité : sur quoi le résultat repose. --- */
  h1("Annexe · Traçabilité du résultat");
  p("Ce tableau ne se lit qu'en cas de doute sur l'origine d'une affirmation. Il dit à quelle date les textes ont été relus, quelle version du moteur a produit ce document, et ce qui a été versé au dossier.");
  const _m = (() => { try { return MAN.construire(); } catch (e) { return null; } })();
  tab(["Traçabilité", "Valeur"], [
   ["Date de génération du rapport", new Date().toISOString().slice(0,10)],
   ["Date de contrôle des sources", "15 août 2026 — articles relus sur Légifrance à cette date"],
   ["Date du dossier employeur", dateFr(f.dateAudit)],
   ["Décisions publiées prises en compte", f.veille && f.veille.decisions ? `jusqu'au ${f.veille.decisions.depuis}, ${f.veille.decisions.nombre} postérieure(s) signalée(s)` : "corpus arrêté au 8 juillet 2026"],
   ["Empreinte du moteur", _m ? _m.empreinte : "—"],
   ["Règles de la base", `${GRILLE.length} dont ${retenues.length} applicables à votre situation`],
   ["Contrôles exécutés", _m ? `${_m.compteurs.controles} dont ${_m.compteurs.detection} de détection` : "—"],
   ["Convention collective", f.conventionJointe ? "versée" : (f.idcc ? `IDCC ${f.idcc} déclaré, texte non versé` : "non renseignée")],
   ["Accords d'entreprise", f.accordsJoints ? "versés" : "non versés"]]);

  /* --- Ce que l'audit n'a pas exercé. ---
     Cette section est un aveu, et c'est délibéré. Un rapport qui ne publie que
     ce qu'il a vérifié laisse croire qu'il a tout vérifié. Les chiffres
     ci-dessous sont mesurés à chaque publication, non écrits à la main : le
     nombre de règles qu'aucun dossier d'épreuve n'a jamais déclenchées est
     celui que produit la sonde d'exécution. */
  h3("Ce que cet audit n'a pas exercé");
  p("Les lignes qui précèdent disent sur quoi le résultat repose. Celles-ci disent ce qu'il ne couvre pas — non par omission, mais parce que c'est mesuré et publié. Un audit qui ne dit pas où s'arrête sa propre couverture n'est pas opposable.");
  const _c = _m ? _m.compteurs : {};
  tab(["Mesure", "Valeur", "Ce que cela veut dire"], [
   ["Règles de la base non applicables à votre situation",
    `${GRILLE.length - retenues.length} sur ${GRILLE.length}`,
    "Leur condition d'application n'est pas remplie par votre dossier. Elles n'ont donc rien dit, ni dans un sens ni dans l'autre."],
   ["Règles qu'aucun dossier d'épreuve n'a jamais déclenchées",
    _c.reglesJamaisDeclenchees !== undefined ? String(_c.reglesJamaisDeclenchees) : "—",
    "Elles sont écrites sur des articles lus à la source, mais aucune fiche d'épreuve du dépôt ne les a encore exercées : elles n'ont jamais été mises à l'épreuve. C'est la mesure exacte de la couverture réelle, et elle est publiée plutôt que tue."],
   ["Contrôles restés sans objet sur votre dossier",
    `${(cpt[ETATS.SO] || 0)} sur ${verdicts.length}`,
    "Le contrôle ne s'applique pas à votre configuration. « Sans objet » n'est pas « conforme »."],
   ["Contrôles n'ayant pas pu conclure faute de données",
    `${(cpt[ETATS.MANQ] || 0)} sur ${verdicts.length}`,
    "La donnée n'a pas été fournie. Aucune conclusion n'en a été tirée, dans aucun sens."],
   ["Contrôles de détection", _c.detection !== undefined ? String(_c.detection) : "—",
    "Ils signalent une situation et s'arrêtent là : ils ne concluent jamais à la conformité, parce que le sujet excède ce qu'une base peut trancher."],
   ["Contrôles de cohérence", _c.coherence !== undefined ? String(_c.coherence) : "—",
    "Ils ne vérifient pas une donnée mais la relation entre deux — c'est là que se cachent les conformités fausses, celles qu'un dossier obtient en se contredisant lui-même."],
   ["Dossiers construits pour mettre les contrôles en défaut",
    _c.casDeTest !== undefined ? String(_c.casDeTest) : "—",
    "Chaque contrôle susceptible de constater une non-conformité doit la constater au moins une fois sur ces dossiers, sans quoi la publication échoue."]]);
  enc("Ce que la loi elle-même ne tranche pas",
   "Lorsqu'un texte ne règle pas un cas et qu'aucun arrêt publié du corpus ne le tranche, l'application s'arrête et l'écrit, au lieu de choisir. Le refus figure alors dans le corps du rapport, à l'endroit de la question — jamais dissimulé dans une réserve générale.");
  return A.D;
}
module.exports = audit;

/* --- Le parcours en deux temps ---------------------------------------------

   Le rapport ci-dessus met en forme ce que les contrôles ont rendu ; il ne
   rend pas les verdicts eux-mêmes. La page en a besoin bruts pour dérouler le
   parcours : d'abord corriger ce qui manque, ensuite seulement vérifier ce qui
   n'est déclaré que par le client. Les deux fonctions qui suivent servent à
   cela, et rien d'autre — aucune règle de droit n'est introduite ici. */
const REG = require("./regularisation-eco.js");
const DT = require("../commun/parcours-deux-temps.js");

/* Les verdicts bruts, contrôle par contrôle. Un contrôle qui lève une
   exception ne fait pas tomber la page : il rend « donnée manquante », état
   dont aucune conclusion n'est tirée, dans aucun sens. */
function verdicts(f) {
  const v = {};
  for (const c of CONTROLES) {
    try { v[c.id] = c.verdict(f); }
    catch (e) { v[c.id] = { etat: ETATS.MANQ, motif: "Contrôle non exécutable : " + e.message }; }
  }
  return v;
}

/* `etat` porte ce que la page a recueilli : les corrections déclarées faites
   au premier temps, et les réponses à la grille du second. Les deux viennent
   de la page, jamais du moteur. */
function parcours(f, etat) {
  return DT.parcours(CONTROLES, REG.R, verdicts(f), etat);
}

module.exports.verdicts = verdicts;
module.exports.parcours = parcours;
module.exports.regularisation = REG.R;
module.exports.controles = CONTROLES;
module.exports.mots = { DECLARE: DT.DECLARE, REGLE: DT.REGLE, DEGRES: DT.DEGRES };
