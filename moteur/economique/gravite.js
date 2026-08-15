/* La gravité n'est pas l'état. Un écart peut être certain et sans portée ;
   un autre, seulement probable, peut interdire de notifier.
   « Bloquant » ne signifie pas « grave » : il signifie qu'un texte s'oppose à la
   poursuite de la procédure tant que le point n'est pas corrigé. */
const B="bloquant", CR="critique", IM="important", IN="information";
const GRAVITE = {
 /* la loi interdit de notifier tant que le point n'est pas réglé */
 "CTL-PSE-04":B, "CTL-PRT-01":B, "CTL-CSE-05":B, "CTL-REC-08":B, "CTL-CSE-01":B,
 "CTL-CSE-08":B, "CTL-CSE-07":B, "CTL-PSE-07":B, "CTL-CSE-02":B, "CTL-PSE-06":B,
 "CTL-CSE-04":B, "CTL-REC-12":B, "CTL-SEU-01":B, "CTL-SEU-02":B, "CTL-SEU-03":B,
 /* l'écart fragilise la cause ou la procédure sans l'interdire */
 "CTL-REC-07":CR, "CTL-REC-03":CR, "CTL-REC-06":CR, "CTL-REC-10":CR, "CTL-EMP-02":CR,
 "CTL-PCE-02":CR, "CTL-EFF-01":CR, "CTL-ECO-01":CR, "CTL-ECO-02":CR, "CTL-PSE-01":CR,
 "CTL-CCN-01":CR, "CTL-REC-05":CR, "CTL-REC-02":CR, "CTL-ORD-02":CR, "CTL-REP-01":CR,
 "CTL-COH-01":CR, "CTL-COH-02":CR, "CTL-COH-03":CR,
 /* une pièce ou une vérification manque avant de décider */
 "CTL-REC-01":IM, "CTL-REC-04":IM, "CTL-REC-09":IM, "CTL-REC-11":IM, "CTL-EMP-01":IM,
 "CTL-CSE-03":IM, "CTL-CSE-04":IM, "CTL-CSE-06":IM, "CTL-CSE-10":IM, "CTL-PSE-02":IM,
 "CTL-PSE-03":IM, "CTL-PSE-05":IM, "CTL-PCE-01":IM, "CTL-PCE-03":IM, "CTL-PCE-04":IM,
 "CTL-EFF-02":IM, "CTL-CCN-02":IM, "CTL-CCN-03":IM, "CTL-ECO-04":IM,
 /* point à documenter, hors du champ automatisable */
 "CTL-COE-01":IN, "CTL-USA-01":IN, "CTL-CTX-01":IN, "CTL-IND-01":IN,
 "CTL-ECO-03":IN, "CTL-CSE-09":IN, "CTL-FRA-01":IN,
};
const DEF=[[B,"La procédure ne doit pas être poursuivie avant correction : un texte s'y oppose."],
 [CR,"Risque élevé de contestation ou d'irrégularité, sans interdiction expresse de poursuivre."],
 [IM,"Une pièce ou une vérification manque avant de décider."],
 [IN,"Point à documenter ou à surveiller, hors du champ automatisable."]];
const de = id => GRAVITE[id] || IM;
const RANG={[B]:0,[CR]:1,[IM]:2,[IN]:3};

/* Statut normalisé : cinq valeurs, une seule possible, dans cet ordre de priorité.
   Un dirigeant qui ne lit que cette ligne doit savoir s'il peut notifier. */
const STATUTS = ["BLOQUÉ","REVUE PROFESSIONNELLE OBLIGATOIRE","À COMPLÉTER","RISQUE ÉLEVÉ","CONFORME AU VU DES PIÈCES"];
function statutNormalise(verdicts, f, regimePse) {
  const nc = verdicts.filter(v => v.v.etat === "non conforme");
  const bloq = nc.filter(v => de(v.id) === B);
  const risq = verdicts.filter(v => v.v.etat === "risque à vérifier");
  const manq = verdicts.filter(v => v.v.etat === "donnée manquante");
  const conf = verdicts.filter(v => v.v.etat === "conforme");
  const crit = risq.filter(v => de(v.id) === CR);
  /* les situations qui appellent un examen extérieur, quel que soit le reste */
  const pro = [];
  if (regimePse) pro.push("un plan de sauvegarde de l'emploi");
  if (f.groupe) pro.push("un groupe de sociétés");
  if ((f.salariesProteges || []).length) pro.push("un ou plusieurs salariés protégés");
  if (f.transfertEnvisage) pro.push("un transfert d'entité");
  if (f.procedureCollective) pro.push("une procédure collective");
  if (f.coEmploi) pro.push("une situation possible de co-emploi");
  if (f.contentieuxEnCours && !/aucun|non|néant/i.test(String(f.contentieuxEnCours))) pro.push("un contentieux en cours");

  if (bloq.length) return { statut: "BLOQUÉ", pro,
    motif: `${bloq.length} non-conformité(s) bloquante(s) : ${bloq.map(v => v.id).join(", ")}. Un texte s'oppose à la poursuite de la procédure tant qu'elles ne sont pas corrigées.`,
    action: "Corriger ces points avant tout acte suivant. Les contrôles conformes ne les neutralisent pas." };
  if (nc.length) return { statut: "RISQUE ÉLEVÉ", pro,
    motif: `${nc.length} non-conformité(s) sans caractère bloquant : ${nc.map(v => v.id).join(", ")}.`,
    action: "Aucune n'interdit formellement de poursuivre ; chacune expose la procédure à contestation." };
  if (!conf.length || manq.length >= risq.length + conf.length) return { statut: "À COMPLÉTER", pro,
    motif: `${manq.length} donnée(s) manquante(s) et ${risq.length} risque(s) à vérifier. Le dossier n'est pas assez renseigné pour qu'un écart puisse être caractérisé.`,
    action: "Produire les pièces demandées, puis relancer l'audit. L'absence de non-conformité ne vaut pas conformité." };
  if (crit.length) return { statut: "RISQUE ÉLEVÉ", pro,
    motif: `${crit.length} risque(s) de gravité critique, déclarés mais non démontrés : ${crit.map(v => v.id).join(", ")}.`,
    action: "Verser les pièces correspondantes avant de décider." };
  if (risq.length) return { statut: "À COMPLÉTER", pro,
    motif: `${risq.length} risque(s) à vérifier, aucune non-conformité.`,
    action: "Verser les pièces manquantes pour lever les réserves." };
  return { statut: "CONFORME AU VU DES PIÈCES", pro,
    motif: `Aucun écart sur les ${verdicts.length} contrôles exécutés, au vu des pièces lues.`,
    action: "Cela ne vaut pas validation juridique de la procédure." };
}

/* Le statut opérationnel : une seule phrase, tirée des états et des gravités. */
function statut(verdicts){
  const nc=verdicts.filter(v=>v.v.etat==="non conforme");
  const bloquants=nc.filter(v=>de(v.id)===B);
  const risq=verdicts.filter(v=>v.v.etat==="risque à vérifier");
  const manq=verdicts.filter(v=>v.v.etat==="donnée manquante");
  const conf=verdicts.filter(v=>v.v.etat==="conforme");
  if(bloquants.length)
    return {titre:`PROCÉDURE À NE PAS POURSUIVRE EN L'ÉTAT — ${bloquants.length} non-conformité(s) bloquante(s)`,
      detail:`${bloquants.map(v=>v.id).join(", ")}. La présence de ${conf.length} contrôle(s) conforme(s) ne neutralise pas ces écarts.`};
  if(nc.length)
    return {titre:`CORRECTIONS REQUISES AVANT NOTIFICATION — ${nc.length} non-conformité(s)`,
      detail:`${nc.map(v=>v.id).join(", ")}. Aucune n'interdit formellement de poursuivre, mais chacune expose la procédure.`};
  if(!conf.length || manq.length>=risq.length+conf.length)
    return {titre:`IMPOSSIBLE DE CONCLURE — ${manq.length} donnée(s) manquante(s) et ${risq.length} risque(s) à vérifier`,
      detail:`Le dossier n'est pas assez renseigné pour qu'un écart puisse être caractérisé. L'absence de non-conformité ne vaut pas conformité.`};
  if(risq.length)
    return {titre:`AUCUNE NON-CONFORMITÉ DÉTECTÉE — ${risq.length} risque(s) à vérifier`,
      detail:`Aucun contrôle automatisé n'est contredit. Les risques portent sur des points déclarés mais non démontrés.`};
  return {titre:"AUCUN ÉCART DÉTECTÉ SUR LES CONTRÔLES AUTOMATISÉS",
    detail:"Dans la limite des contrôles exécutés et des pièces lues. Cela ne vaut pas validation juridique de la procédure."};
}
module.exports={GRAVITE,DEF,de,RANG,statut,statutNormalise,STATUTS,B,CR,IM,IN};
