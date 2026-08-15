/* Deuxième série : contrôler les pièces elles-mêmes, et les points de procédure
   que la première série laissait passer. Ces contrôles ne demandent pas si une
   pièce existe — ils demandent ce qu'elle dit, et si elle contredit le reste. */
const M = require("./moteur.js");
const PC = require("./pieces.js");
const CONF = "conforme", NC = "non conforme", RISQ = "risque à vérifier",
      MANQ = "donnée manquante", SO = "sans objet";
const vide = x => x === undefined || x === null || x === "" || (Array.isArray(x) && !x.length);
const C = [];
const c = (id, rubrique, objet, fondement, fn) => C.push({ id, rubrique, objet, fondement, verdict: fn });
const jours = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

/* ---------- LES PIÈCES ---------- */
c("CTL-PCE-01","Pièces","Les pièces versées portent-elles leurs métadonnées ?",[],
 f => { const l = PC.norm(f);
   if (!l.length) return { etat: MANQ, motif: "Aucune pièce n'est enregistrée." };
   const bin = l.filter(p => p._binaire);
   const inc = l.filter(p => !p._binaire && PC.manquants(p).length);
   if (bin.length) return { etat: RISQ, motif: `${bin.length} pièce(s) sont seulement cochées comme versées, sans nom de fichier, date, période couverte, auteur, version ni périmètre. Une case cochée n'établit ni la date, ni le périmètre, ni la complétude.` };
   if (inc.length) return { etat: RISQ, motif: inc.map(p => `${p.code} : manquent ${PC.manquants(p).join(", ")}`).join(" ; ") };
   return { etat: CONF, motif: `Les ${l.length} pièces portent leurs métadonnées complètes.` }; });

c("CTL-PCE-02","Pièces","Les pièces sont-elles antérieures à l'acte qu'elles justifient ?",[],
 f => { const l = PC.norm(f).filter(p => p.date);
   if (!l.length) return { etat: MANQ, motif: "Aucune pièce datée." };
   const ref = f.dateNotification;
   if (!ref) return { etat: MANQ, motif: "La date de notification n'est pas renseignée : l'antériorité ne peut pas être contrôlée." };
   const tard = l.filter(p => p.date > ref);
   return tard.length
     ? { etat: NC, motif: `${tard.length} pièce(s) sont postérieures à la notification du ${ref} : ${tard.map(p => p.code + " (" + p.date + ")").join(", ")}. Une pièce postérieure ne peut pas justifier un acte antérieur.` }
     : { etat: CONF, motif: `Les ${l.length} pièces datées sont antérieures à la notification.` }; });

c("CTL-PCE-03","Pièces","Le périmètre des pièces correspond-il au périmètre à démontrer ?",["L. 1233-3"],
 f => { if (!f.groupe) return { etat: SO, motif: "L'entreprise n'appartient à aucun groupe : le périmètre de l'entreprise suffit." };
   const eco = PC.get(f, "liasse"), grp = PC.get(f, "comptes-groupe");
   if (!eco && !grp) return { etat: MANQ, motif: "Aucune pièce comptable enregistrée." };
   if (grp && grp.perimetre && /groupe|secteur/i.test(grp.perimetre))
     return { etat: CONF, motif: `Les comptes du groupe couvrent le périmètre « ${grp.perimetre} ».` };
   return { etat: RISQ, motif: "Les pièces comptables enregistrées ne déclarent pas couvrir le secteur d'activité du groupe. La démonstration risque de porter sur la seule entreprise." }; });

c("CTL-PCE-04","Pièces","Les pièces ont-elles été lues, ou seulement déposées ?",[],
 f => { const l = PC.norm(f).filter(p => !p._binaire);
   if (!l.length) return { etat: MANQ, motif: "Aucune pièce documentée." };
   const nl = l.filter(p => p.lue !== true);
   return nl.length
     ? { etat: RISQ, motif: `${nl.length} pièce(s) déposées mais non lues : ${nl.map(p=>p.code).join(", ")}. Le dépôt n'est pas la lecture, et la lecture n'est pas la conformité.` }
     : { etat: CONF, motif: `Les ${l.length} pièces ont été lues et rapprochées des réponses.` }; });

/* ---------- RECLASSEMENT : les contrôles contradictoires ---------- */
c("CTL-REC-06","Reclassement","L'état des postes est-il antérieur à la notification ?",["L. 1233-4"],
 f => { const p = PC.get(f, "etat-postes");
   if (!p || !p.date) return { etat: MANQ, motif: "L'état des postes n'est pas daté." };
   if (!f.dateNotification) return { etat: MANQ, motif: "La date de notification n'est pas renseignée." };
   return p.date > f.dateNotification
     ? { etat: NC, motif: `État des postes daté du ${p.date}, postérieur à la notification du ${f.dateNotification}. Le reclassement s'apprécie au jour du licenciement.` }
     : { etat: CONF, motif: `État des postes du ${p.date}, antérieur à la notification.` }; });

c("CTL-REC-07","Reclassement","Des postes disponibles ont-ils été omis dans les offres ?",["L. 1233-4"],
 f => { if (vide(f.postesDisponibles)) return { etat: MANQ, motif: "Aucun poste disponible renseigné." };
   const off = new Set((f.offresFaites||[]).map(o => (o.intitule||"") + "|" + (o.employeur||"")));
   const omis = f.postesDisponibles.filter(p => !p.motifExclusion &&
     !off.has((p.intitule||"") + "|" + (p.societe||"")));
   return omis.length
     ? { etat: NC, motif: `${omis.length} poste(s) recensés comme disponibles n'ont fait l'objet d'aucune offre et d'aucun motif d'exclusion : ${omis.map(p=>p.intitule+" ("+p.societe+")").join(", ")}.` }
     : { etat: CONF, motif: "Tout poste disponible a été proposé, ou son exclusion est motivée." }; });

c("CTL-REC-08","Reclassement","Les offres sont-elles personnalisées et adressées à chaque salarié ?",["L. 1233-4","D. 1233-2-1"],
 f => { if (vide(f.offresFaites)) return { etat: MANQ, motif: "Aucune offre renseignée." };
   const dest = new Set(f.offresFaites.map(o => o.salarie).filter(Boolean));
   const nb = f.nbLicenciements || 0;
   if (!dest.size) return { etat: RISQ, motif: "Les offres ne désignent aucun destinataire : rien n'établit qu'elles ont été adressées personnellement. La liste collective est admise, mais elle doit alors préciser les critères de départage entre salariés." };
   return dest.size < nb
     ? { etat: NC, motif: `${dest.size} salarié(s) destinataires pour ${nb} licenciements envisagés : ${nb - dest.size} salarié(s) n'ont reçu aucune offre.` }
     : { etat: CONF, motif: `Chacun des ${nb} salariés concernés est destinataire d'au moins une offre.` }; });

c("CTL-REC-09","Reclassement","Un délai et un moyen de réponse ont-ils été indiqués ?",["L. 1233-4"],
 f => { if (vide(f.offresFaites)) return { etat: MANQ, motif: "Aucune offre renseignée." };
   const sans = f.offresFaites.filter(o => vide(o.delaiReponse));
   return sans.length
     ? { etat: RISQ, motif: `${sans.length} offre(s) n'indiquent aucun délai de réponse. Sans délai identifiable, le silence du salarié ne peut pas être opposé comme un refus.` }
     : { etat: CONF, motif: "Chaque offre indique un délai de réponse." }; });

c("CTL-REC-10","Reclassement","Un poste de catégorie inférieure a-t-il été proposé sans accord exprès ?",["L. 1233-4"],
 f => { const inf = (f.offresFaites||[]).filter(o => o.categorieInferieure);
   if (!inf.length) return { etat: SO, motif: "Aucune offre de catégorie inférieure." };
   const sans = inf.filter(o => o.accordExpres !== true);
   return sans.length
     ? { etat: NC, motif: `${sans.length} poste(s) de catégorie inférieure proposés sans accord exprès du salarié.` }
     : { etat: CONF, motif: "Les propositions de catégorie inférieure sont couvertes par un accord exprès." }; });

c("CTL-REC-11","Reclassement","L'absence de poste repose-t-elle sur autre chose qu'une attestation interne ?",["L. 1233-4"],
 f => { if ((f.postesDisponibles||[]).length) return { etat: SO, motif: "Des postes ont été recensés." };
   const a = PC.get(f, "attestation-absence-poste");
   if (!a) return { etat: MANQ, motif: "Aucune attestation d'absence de poste." };
   const externe = a.auteur && !/direction|drh|gérance|président|employeur/i.test(a.auteur);
   return externe
     ? { etat: CONF, motif: `Attestation du ${a.date}, établie par ${a.auteur} — extérieure à la direction.` }
     : { etat: RISQ, motif: `L'absence de poste ne repose que sur une attestation interne (${a.auteur||"auteur non renseigné"}). Un état des mouvements de personnel ou un registre daté vaut mieux qu'une affirmation de l'employeur sur lui-même.` }; });

/* ---------- PROCÉDURE : ce qui manquait ---------- */
c("CTL-CSE-06","Procédure","Le délai entre la convocation et la première réunion est-il suffisant ?",["L. 1233-10","L. 1233-31"],
 f => { const r = M.regimeEco(f);
   if (!r.consultationCSE) return { etat: SO, motif: "Consultation non due." };
   if (vide(f.dateInfoCSE) || vide(f.datesReunionsCSE)) return { etat: MANQ, motif: "Date de convocation ou de réunion non renseignée." };
   const d = jours(f.dateInfoCSE, [...f.datesReunionsCSE].sort()[0]);
   if (d < 0) return { etat: NC, motif: `La convocation du ${f.dateInfoCSE} est postérieure à la première réunion.` };
   if (d < 3) return { etat: RISQ, motif: `${d} jour(s) entre la convocation et la première réunion. Le code ne fixe pas de délai chiffré ici, mais les renseignements devant être adressés « avec la convocation », un délai aussi court prive le comité de tout examen — et c'est sur ce terrain que la consultation est attaquée.` };
   return { etat: CONF, motif: `${d} jours entre la convocation et la première réunion.` }; });

c("CTL-CSE-07","Procédure","L'instance compétente est-elle la bonne ?",["L. 1233-9","L. 2316-1"],
 f => { const r = M.regimeEco(f);
   if (!r.consultationCSE) return { etat: SO, motif: "Consultation non due." };
   if (vide(f.etablissementsDistincts) || f.etablissementsDistincts <= 1)
     return { etat: f.etablissementsDistincts === 1 ? CONF : MANQ,
       motif: f.etablissementsDistincts === 1 ? "Établissement unique : le comité de l'entreprise est seul compétent."
         : "Le nombre d'établissements distincts n'est pas renseigné : on ne peut pas savoir si un comité central devait être réuni." };
   return f.cseCentralConsulte === true
     ? { etat: CONF, motif: `${f.etablissementsDistincts} établissements distincts : le comité central a été réuni, ainsi que les comités d'établissement intéressés.` }
     : { etat: NC, motif: `${f.etablissementsDistincts} établissements distincts, et le comité central n'a pas été réuni. Il doit l'être dès lors que les mesures excèdent le pouvoir des chefs d'établissement ou portent sur plusieurs établissements (L. 1233-9).` }; });

c("CTL-CSE-08","Procédure","Un comité existe-t-il, ou un procès-verbal de carence a-t-il été établi ?",[],
 f => { const r = M.regimeEco(f);
   if (!r.consultationCSE) return { etat: SO, motif: "Consultation non due." };
   if (f.cseExistant === true) return { etat: CONF, motif: "Un comité social et économique est en place." };
   if (f.cseExistant === false)
     return f.pvCarence ? { etat: CONF, motif: "Aucun comité, mais un procès-verbal de carence est produit." }
       : { etat: NC, motif: "Aucun comité et aucun procès-verbal de carence : l'absence d'institution ne dispense pas, elle doit être établie." };
   return { etat: MANQ, motif: "L'existence d'un comité n'est pas renseignée." }; });

c("CTL-CSE-09","Procédure","Une expertise a-t-elle été demandée, et son calendrier tient-il ?",[],
 f => { if (!M.regimeEco(f).pse) return { etat: SO, motif: "Hors du régime où l'expertise est usuelle." };
   if (f.expertise === undefined) return { etat: MANQ, motif: "L'existence d'une expertise du comité n'est pas renseignée : elle décale le calendrier." };
   if (f.expertise === false) return { etat: SO, motif: "Aucune expertise demandée." };
   return { etat: RISQ, motif: "Une expertise est en cours ou demandée : son calendrier doit être articulé avec le délai d'avis, qui ne s'en trouve pas prolongé de plein droit." }; });

c("CTL-CSE-10","Procédure","Les conséquences sur la santé, la sécurité et les conditions de travail sont-elles exposées ?",["L. 1233-10, 7°","L. 1233-31, 7°"],
 f => { const r = M.regimeEco(f);
   if (!r.consultationCSE) return { etat: SO, motif: "Consultation non due." };
   return vide(f.consequencesSSCT)
     ? { etat: RISQ, motif: "Le septième renseignement — les conséquences en matière de santé, de sécurité ou de conditions de travail — n'est pas renseigné. Son omission vicie la consultation." }
     : { etat: CONF, motif: "Les conséquences en matière de santé, de sécurité et de conditions de travail sont exposées." }; });

/* ---------- EFFECTIFS ET PÉRIMÈTRE ---------- */
c("CTL-EFF-01","Effectifs","L'effectif de l'établissement est-il cohérent avec celui de l'entreprise ?",[],
 f => { if (vide(f.effectifEtablissement)) return { etat: MANQ, motif: "L'effectif de l'établissement n'est pas renseigné : le périmètre de consultation et celui des critères d'ordre ne peuvent pas être vérifiés." };
   if (f.effectifEtablissement > f.effectif) return { etat: NC, motif: `Effectif de l'établissement (${f.effectifEtablissement}) supérieur à celui de l'entreprise (${f.effectif}).` };
   return { etat: CONF, motif: `Établissement ${f.effectifEtablissement} salariés, entreprise ${f.effectif}. Les seuils de procédure s'apprécient au niveau de l'entreprise.` }; });

c("CTL-EFF-02","Effectifs","Le périmètre d'application des critères d'ordre est-il licite ?",["L. 1233-5"],
 f => { if (vide(f.perimetreOrdre)) return { etat: MANQ, motif: "Le périmètre d'application des critères d'ordre n'est pas renseigné." };
   if (/etablissement|établissement/i.test(f.perimetreOrdre) && !f.accordPerimetreOrdre)
     return { etat: RISQ, motif: "Le périmètre retenu est l'établissement, sans accord collectif le prévoyant. À défaut d'accord, ce périmètre ne peut être inférieur à la zone d'emplois où sont situés les établissements concernés." };
   return { etat: CONF, motif: `Périmètre retenu : ${f.perimetreOrdre}.` }; });

/* ---------- PLAN DE SAUVEGARDE : contenu ---------- */
c("CTL-PSE-05","Plan de sauvegarde de l'emploi","Les mesures du plan sont-elles chiffrées ?",["L. 1233-62"],
 f => { if (!M.regimeEco(f).pse) return { etat: SO, motif: "Aucun plan n'est dû." };
   const p = f.pse || {};
   const sansChiffre = ["evitement","reclassementInterne","formation","creation"]
     .filter(k => p[k] && !/\d/.test(String(p[k])));
   return sansChiffre.length
     ? { etat: RISQ, motif: `Mesures énoncées sans aucun chiffre : ${sansChiffre.join(", ")}. L'administration apprécie la proportionnalité des moyens ; une mesure non chiffrée n'est pas appréciable.` }
     : { etat: CONF, motif: "Les mesures du plan sont chiffrées." }; });

c("CTL-PSE-06","Plan de sauvegarde de l'emploi","Le plan a-t-il été joint à la convocation du comité ?",["L. 1233-32"],
 f => { if (!M.regimeEco(f).pse) return { etat: SO, motif: "Aucun plan n'est dû." };
   const p = PC.get(f, "pse");
   if (!p || !p.date) return { etat: MANQ, motif: "Le projet de plan n'est pas enregistré comme pièce datée." };
   if (vide(f.dateInfoCSE)) return { etat: MANQ, motif: "La date de convocation n'est pas renseignée." };
   return p.date <= f.dateInfoCSE
     ? { etat: CONF, motif: `Projet de plan daté du ${p.date}, adressé avec la convocation du ${f.dateInfoCSE}.` }
     : { etat: NC, motif: `Projet de plan daté du ${p.date}, postérieur à la convocation du ${f.dateInfoCSE} : il doit être adressé avec elle.` }; });

c("CTL-PSE-07","Plan de sauvegarde de l'emploi","L'accord majoritaire remplit-il la condition de représentativité ?",["L. 1233-24-1"],
 f => { if (!M.regimeEco(f).pse) return { etat: SO, motif: "Aucun plan n'est dû." };
   if ((f.pse||{}).voie !== "accord") return { etat: SO, motif: "Voie du document unilatéral." };
   const s = (f.pse||{}).suffrages;
   if (s === undefined) return { etat: MANQ, motif: "Le pourcentage de suffrages recueilli par les signataires n'est pas renseigné." };
   return s >= 50
     ? { etat: CONF, motif: `${s} % des suffrages exprimés au premier tour des dernières élections : la condition est remplie.` }
     : { etat: NC, motif: `${s} % des suffrages : l'accord doit être signé par des organisations ayant recueilli au moins 50 % des suffrages exprimés au premier tour des dernières élections des titulaires au comité.` }; });

/* ---------- NORMES CONVENTIONNELLES : contenu ---------- */
c("CTL-CCN-02","Normes conventionnelles","La convention versée est-elle celle de l'IDCC déclaré, et à jour ?",[],
 f => { const p = PC.get(f, "convention") || PC.get(f, "conventionJointe");
   if (!f.idcc) return { etat: MANQ, motif: "Aucun IDCC déclaré." };
   if (!p) return { etat: RISQ, motif: `IDCC ${f.idcc} déclaré, mais aucune convention versée comme pièce datée. L'application peut la récupérer dans KALI, mais rien n'établit que c'est celle que vous appliquez.` };
   if (p.version && f.veille && f.veille.convention && f.veille.convention.dernier &&
       !String(f.veille.convention.dernier).includes(String(p.version)))
     return { etat: RISQ, motif: `Version versée « ${p.version} » ; dernier texte publié sur Légifrance : « ${f.veille.convention.dernier} ». L'écart doit être expliqué.` };
   return { etat: CONF, motif: `Convention IDCC ${f.idcc} versée, version ${p.version||"non précisée"}.` }; });

c("CTL-CCN-03","Normes conventionnelles","Les accords versés ont-ils été confrontés aux règles légales ?",["L. 1233-21","L. 1233-24-1","L. 2254-2"],
 f => { if (!f.accordsJoints) return { etat: RISQ, motif: "Aucun accord versé : les règles légales sont appliquées telles quelles, alors qu'un accord peut y déroger sur les modalités de consultation, le contenu du plan et les délais." };
   const lus = PC.norm(f).filter(p => /accord/i.test(p.code) && p.lue === true);
   return lus.length
     ? { etat: CONF, motif: `${lus.length} accord(s) versés et lus, confrontés aux règles correspondantes.` }
     : { etat: RISQ, motif: "Accords annoncés comme versés, mais aucun n'est enregistré comme lu : leur articulation avec la loi n'a pas été faite." }; });

c("CTL-USA-01","Normes conventionnelles","Des usages ou engagements unilatéraux plus favorables existent-ils ?",[],
 f => vide(f.usagesEtEngagements)
   ? { etat: MANQ, motif: "La question des usages, engagements unilatéraux et décisions unilatérales n'est pas renseignée. Ils ne figurent dans aucune base publique et priment lorsqu'ils sont plus favorables." }
   : { etat: RISQ, motif: `Usages ou engagements signalés : ${String(f.usagesEtEngagements).slice(0,160)}. Leur articulation avec la loi et la convention est hors du champ de cette base.` });

c("CTL-CTX-01","Contentieux","Un contentieux ou un contrôle est-il en cours ?",[],
 f => vide(f.contentieuxEnCours)
   ? { etat: MANQ, motif: "L'existence d'un contentieux ou d'un contrôle en cours n'est pas renseignée." }
   : /aucun|non|néant/i.test(String(f.contentieuxEnCours))
     ? { etat: SO, motif: "Aucun contentieux ni contrôle signalé. Ce contrôle ne conclut jamais à la conformité." }
     : { etat: RISQ, motif: `Contentieux ou contrôle signalé : ${String(f.contentieuxEnCours).slice(0,160)}. Il peut modifier la stratégie et les délais ; hors du champ de cette base.` });

module.exports = C;
