/* Deuxième série : contrôler les pièces elles-mêmes, et les points de procédure
   que la première série laissait passer. Ces contrôles ne demandent pas si une
   pièce existe — ils demandent ce qu'elle dit, et si elle contredit le reste. */
const M = require("./moteur.js");
const PC = require("./pieces.js");
const VAL = require("./valider.js");
const CONF = "conforme", NC = "non conforme", RISQ = "risque à vérifier",
      MANQ = "donnée manquante", SO = "sans objet";
const declare = (f, champ) => Object.prototype.hasOwnProperty.call(f, champ);
const neant = (f, champ) => declare(f, champ) && vide(f[champ]);
const vide = x => x === undefined || x === null || x === "" || (Array.isArray(x) && !x.length);
const C = [];
const c = (id, rubrique, objet, fondement, fn) => C.push({ id, rubrique, objet, fondement, verdict: fn });
/* Les écarts de dates passent par moteur/commun/dates.js : une chronologie
   inversée ou une date qui n'existe pas ne rend pas un nombre de jours, elle
   rend un refus de conclure. jours() garde sa signature — il rend le nombre,
   ou null lorsque l'écart n'est pas calculable — et chaque appelant traite le
   null pour son compte. */
const DT = require("./dates.js");
const jours = (a, b) => { const e = DT.ecart(a, b); return e.valide ? e.jours : (e.cause === "ordre" ? e.jours : null); };

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
   if (grp && grp.perimetre && /groupe|secteur/i.test(grp.perimetre)) {
     /* L'étiquette portée sur la pièce est une déclaration, pas un contenu :
        la même réserve que pour CTL-ECO-02. Si des sociétés françaises du
        groupe peuvent relever du même secteur, la pièce doit les nommer. */
     const soeurs = (f.societes || []).filter(s => !s.etranger && s.activite && !/holding/i.test(s.activite));
     if (soeurs.length && vide(f.societesDuSecteur))
       return { etat: RISQ, motif: `La pièce déclare couvrir le périmètre « ${grp.perimetre} », mais les sociétés qui composent ce secteur ne sont pas énumérées. ${soeurs.length} société(s) française(s) du groupe pourraient en relever : ${soeurs.map(s => s.nom + " (" + s.activite + ")").join(", ")}. Une étiquette de périmètre n'est pas une couverture : la pièce doit nommer les sociétés qu'elle agrège.` };
     const nonCouvertes = (f.societesDuSecteur || []).filter(n => !(grp.societesCouvertes || []).includes(n));
     if ((f.societesDuSecteur || []).length && (grp.societesCouvertes || []).length && nonCouvertes.length)
       return { etat: NC, motif: `La pièce déclare couvrir le secteur, mais ${nonCouvertes.length} société(s) du secteur n'y figurent pas : ${nonCouvertes.join(", ")}. Les agrégats ne portent donc pas sur le périmètre à démontrer.` };
     return { etat: CONF, motif: `Les comptes du groupe couvrent le périmètre « ${grp.perimetre} »`
       + ((f.societesDuSecteur || []).length ? `, et les sociétés du secteur sont énumérées : ${f.societesDuSecteur.join(", ")}.` : ".") };
   }
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

/* Une offre à l'étranger ne satisfait pas l'obligation : elle ne peut donc pas
   couvrir un poste omis, ni compter un destinataire servi. Voir CTL-REC-12. */
const horsFrance = f => new Set((f.societes || []).filter(s => s.etranger).map(s => s.nom));
const offresValables = f => (f.offresFaites || []).filter(o => !horsFrance(f).has(o.employeur));
c("CTL-REC-07","Reclassement","Des postes disponibles ont-ils été omis dans les offres ?",["L. 1233-4"],
 f => { if (vide(f.postesDisponibles)) return { etat: MANQ, motif: "Aucun poste disponible renseigné." };
   const off = new Set(offresValables(f).map(o => (o.intitule||"") + "|" + (o.employeur||"")));
   const omis = f.postesDisponibles.filter(p => !p.motifExclusion &&
     !off.has((p.intitule||"") + "|" + (p.societe||"")));
   return omis.length
     ? { etat: NC, motif: `${omis.length} poste(s) recensés comme disponibles n'ont fait l'objet d'aucune offre et d'aucun motif d'exclusion : ${omis.map(p=>p.intitule+" ("+p.societe+")").join(", ")}.` }
     : { etat: CONF, motif: "Tout poste disponible a été proposé, ou son exclusion est motivée." }; });

c("CTL-REC-08","Reclassement","Les offres sont-elles personnalisées et adressées à chaque salarié ?",["L. 1233-4","D. 1233-2-1"],
 f => { if (vide(f.offresFaites)) return { etat: MANQ, motif: "Aucune offre renseignée." };
   const valables = offresValables(f);
   const ecartees = f.offresFaites.length - valables.length;
   const dest = new Set(valables.map(o => o.salarie).filter(Boolean));
   const nb = f.nbLicenciements || 0;
   const mention = ecartees ? ` ${ecartees} offre(s) émanant d'une société non établie sur le territoire national ne sont pas décomptées.` : "";
   if (!dest.size) return { etat: RISQ, motif: "Les offres ne désignent aucun destinataire : rien n'établit qu'elles ont été adressées personnellement. La liste collective est admise, mais elle doit alors préciser les critères de départage entre salariés." };
   return dest.size < nb
     ? { etat: NC, motif: `${dest.size} salarié(s) destinataires pour ${nb} licenciements envisagés : ${nb - dest.size} salarié(s) n'ont reçu aucune offre.${mention}` }
     : { etat: CONF, motif: `Chacun des ${nb} salariés concernés est destinataire d'au moins une offre.${mention}` }; });

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
   if (/etablissement|établissement/i.test(f.perimetreOrdre)) {
     if (!f.accordPerimetreOrdre)
       return { etat: RISQ, motif: "Le périmètre retenu est l'établissement, sans accord collectif le prévoyant. À défaut d'accord, ce périmètre ne peut être inférieur à la zone d'emplois où sont situés les établissements concernés." };
     /* L'accord est déclaré : il reste à le produire. Une déclaration que rien
        ne justifie ne vaut pas conformité — la règle vaut ici comme ailleurs, et
        l'accord est le seul titre auquel le périmètre de l'établissement se
        défende. Le formulaire demande donc le document à la suite de la
        réponse « oui », au lieu de s'en tenir à elle. */
     const a = PC.get(f, "accord-perimetre-ordre");
     if (!a) return { etat: RISQ, motif: "Un accord collectif est déclaré fixer le périmètre d'application des critères d'ordre, mais il n'est pas versé. Le périmètre de l'établissement ne se défend que par cet accord : tant qu'il n'est pas produit, ni son existence, ni son champ, ni sa date ne sont vérifiables." };
     return { etat: CONF, motif: `Périmètre retenu : ${f.perimetreOrdre}, fixé par l'accord collectif versé${a.date ? " du " + a.date : ""}.` };
   }
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
 f => neant(f, "usagesEtEngagements") ? { etat: SO, motif: "Aucun usage ni engagement unilatéral plus favorable n'est déclaré dans l'entreprise." }
   : vide(f.usagesEtEngagements)
   ? { etat: MANQ, motif: "La question des usages, engagements unilatéraux et décisions unilatérales n'est pas renseignée. Ils ne figurent dans aucune base publique et priment lorsqu'ils sont plus favorables." }
   : { etat: RISQ, motif: `Usages ou engagements signalés : ${String(f.usagesEtEngagements).slice(0,160)}. Leur articulation avec la loi et la convention est hors du champ de cette base.` });

c("CTL-CTX-01","Contentieux","Un contentieux ou un contrôle est-il en cours ?",[],
 f => neant(f, "contentieuxEnCours") ? { etat: SO, motif: "Aucun contentieux ni contrôle en cours n'est déclaré." }
   : vide(f.contentieuxEnCours)
   ? { etat: MANQ, motif: "L'existence d'un contentieux ou d'un contrôle en cours n'est pas renseignée." }
   : /aucun|non|néant/i.test(String(f.contentieuxEnCours))
     ? { etat: SO, motif: "Aucun contentieux ni contrôle signalé. Ce contrôle ne conclut jamais à la conformité." }
     : { etat: RISQ, motif: `Contentieux ou contrôle signalé : ${String(f.contentieuxEnCours).slice(0,160)}. Il peut modifier la stratégie et les délais ; hors du champ de cette base.` });


/* ---------------- Reclassement : le territoire national ---------------- */
/* Depuis l'ordonnance n° 2017-1386 du 22 septembre 2017, l'obligation de
   reclassement est limitée au territoire national. Le périmètre de recherche
   était filtré, les offres ne l'étaient pas : une offre à l'étranger nourrissait
   l'obligation sans la satisfaire. */
c("CTL-REC-12","Reclassement","Les offres relèvent-elles du territoire national ?",["L. 1233-4"],
 f => { if (vide(f.offresFaites)) return { etat: MANQ, motif: "Aucune offre de reclassement n'est renseignée." };
   if (f.dateNotification && f.dateNotification < "2017-09-24")
     return { etat: SO, motif: `Notification du ${f.dateNotification} : la limitation de l'obligation de reclassement au territoire national est née de l'ordonnance du 22 septembre 2017. Elle n'est pas opposable à ce licenciement, et les offres à l'étranger comptent.` };
   const etrangeres = new Set((f.societes || []).filter(s => s.etranger).map(s => s.nom));
   if (!etrangeres.size) return { etat: SO, motif: "Aucune société étrangère n'est déclarée dans le groupe." };
   const hors = f.offresFaites.filter(o => etrangeres.has(o.employeur));
   return hors.length
     ? { etat: NC, motif: `${hors.length} offre(s) sur ${f.offresFaites.length} émanent d'une société non établie sur le territoire national : ${[...new Set(hors.map(o => o.employeur))].join(", ")}. L'obligation de reclassement est limitée au territoire national : ces offres ne la satisfont pas et ne peuvent être décomptées.` }
     : { etat: CONF, motif: `Les ${f.offresFaites.length} offre(s) émanent de sociétés établies sur le territoire national.` }; });

/* ---------------- Fermeture de site : la recherche d'un repreneur ---------------- */
/* Le déclencheur est la fermeture d'un établissement, non la cause invoquée :
   la base l'accrochait à la seule cessation d'activité, et ne se déclenchait
   donc jamais sur une fermeture invoquée au titre des difficultés économiques. */
c("CTL-REP-01","Fermeture de site","La recherche d'un repreneur a-t-elle été engagée ?",
 ["L. 1233-57-9","L. 1233-57-10","L. 1233-57-14"],
 f => { if (typeof f.effectif !== "number") return { etat: MANQ, motif: "L'effectif n'est pas renseigné." };
   if (f.effectif < 1000) return { etat: SO, motif: "L'obligation ne vise que les entreprises d'au moins mille salariés." };
   if (vide(f.fermetureEtablissement)) return { etat: MANQ, motif: "La fermeture d'un établissement n'est pas renseignée : l'obligation ne peut pas être vérifiée." };
   if (f.fermetureEtablissement !== true) return { etat: SO, motif: "Aucune fermeture d'établissement déclarée." };
   return vide(f.rechercheRepreneur)
     ? { etat: NC, motif: "Fermeture d'un établissement dans une entreprise d'au moins mille salariés : la recherche d'un repreneur doit être engagée dès l'information du comité, et celui-ci informé de son déroulement. Rien n'est déclaré." }
     : { etat: RISQ, motif: "Une recherche de repreneur est déclarée. Le mandat, le journal des candidats et les motifs d'écartement doivent être versés : le comité peut saisir le tribunal administratif du respect de cette obligation." }; });

/* ---------------- Groupe : l'origine des difficultés ---------------- */
/* Contrôle de détection : il signale une inversion de signe, il ne qualifie
   aucune fraude. La question est posée à l'employeur, aucun texte libre n'est
   analysé. */
c("CTL-FRA-01","Groupe","Les difficultés invoquées peuvent-elles procéder de flux intragroupe ?",["L. 1233-3"],
 f => { const local = (f.resultatExploitation || []).slice(-1)[0];
   const hors = (f.resultatHorsFlux || []).slice(-1)[0];
   if (!local) return { etat: MANQ, motif: "Le résultat d'exploitation n'est pas renseigné." };
   if (!f.groupe) return { etat: SO, motif: "L'entreprise n'appartient à aucun groupe." };
   if (!hors) return { etat: MANQ, motif: "Le résultat d'exploitation reconstitué hors flux intragroupe — redevances de marque, management fees, prix de transfert — n'est pas renseigné : l'inversion du signe ne peut pas être vérifiée." };
   /* La reconstitution doit être arithmétiquement cohérente avec les flux
      déclarés : résultat + flux de l'exercice = résultat reconstitué. Sans ce
      contrôle, la reconstitution reste une affirmation. */
   const flux = (f.fluxIntragroupe || []).find(x => x.annee === hors.annee);
   if (!flux) return { etat: RISQ, motif: `Un résultat reconstitué est déclaré pour ${hors.annee}, mais aucun montant de flux intragroupe n'est renseigné pour cet exercice : la reconstitution est déclarative et ne peut pas être recalculée.` };
   const total = typeof flux.total === "number" ? flux.total
     : (flux.redevanceMarque || 0) + (flux.managementFees || 0) + (flux.prixTransfert || 0);
   const attendu = (local.annee === hors.annee ? local.valeur : (f.resultatExploitation || []).find(x => x.annee === hors.annee)?.valeur);
   if (typeof attendu === "number" && Math.abs(attendu + total - hors.valeur) > 1)
     return { etat: NC, motif: `Reconstitution incohérente pour ${hors.annee} : résultat d'exploitation ${attendu} plus ${total} de flux intragroupe donnent ${attendu + total}, alors que le résultat reconstitué déclaré est ${hors.valeur}. L'écart est de ${hors.valeur - attendu - total}. Une reconstitution qui ne se recalcule pas ne démontre rien.` };
   return (local.valeur < 0 && hors.valeur >= 0)
     ? { etat: RISQ, motif: `Résultat d'exploitation déclaré ${local.valeur} pour ${local.annee}, résultat reconstitué hors flux intragroupe ${hors.valeur} : les difficultés invoquées disparaissent une fois ces flux neutralisés. Ce contrôle ne conclut jamais à la conformité. L'appréciation d'une organisation artificielle des difficultés relève d'un professionnel, et elle écarte la limitation du périmètre d'appréciation au territoire national.` }
     : { etat: RISQ, motif: `Résultat d'exploitation ${local.valeur}, résultat hors flux intragroupe ${hors.valeur} : le signe ne s'inverse pas. Le point reste à documenter, la base ne conclut pas à la conformité sur cette question.` }; });

/* ---------------- Ordre des licenciements : la construction des catégories ---------------- */
c("CTL-ORD-02","Ordre des licenciements","Les catégories professionnelles sont-elles construites objectivement ?",["L. 1233-5"],
 f => { if (vide(f.categories)) return { etat: MANQ, motif: "Les catégories professionnelles ne sont pas renseignées." };
   const proteges = new Set((f.salariesProteges || []).map(s => s.nom));
   const uniques = f.categories.filter(c => (typeof c.effectif === "number" ? c.effectif : (c.salaries || []).length) === 1);
   const ciblees = uniques.filter(c => (c.salaries || []).some(s => proteges.has(s.nom)));
   if (ciblees.length) return { etat: NC, motif: `${ciblees.length} catégorie(s) réduite(s) à un seul salarié, occupée(s) par un salarié protégé : ${ciblees.map(c => c.nom).join(" ; ")}. Une catégorie professionnelle regroupe les salariés exerçant des fonctions de même nature supposant une formation professionnelle commune ; une catégorie d'une seule personne désigne cette personne au lieu de la classer, et neutralise les critères d'ordre.` };
   if (uniques.length) return { etat: RISQ, motif: `${uniques.length} catégorie(s) ne comptent qu'un salarié : ${uniques.map(c => c.nom).join(" ; ")}. Le rattachement à une catégorie plus large doit être justifié.` };
   return { etat: CONF, motif: `${f.categories.length} catégories professionnelles, toutes de plus d'un salarié.` }; });


/* ---------------- Le décompte des trente jours ---------------- */
c("CTL-SEU-01","Seuil de dix","Le décompte des trente jours intègre-t-il les licenciements déjà prononcés ?",
 ["L. 1233-28","L. 1233-61"],
 f => { if (typeof f.nbLicenciements !== "number") return { etat: MANQ, motif: "Le nombre de licenciements envisagés n'est pas renseigné." };
   if (typeof f.licenciementsRecents30j !== "number")
     return { etat: MANQ, motif: "Les licenciements économiques déjà prononcés dans les trente jours ne sont pas renseignés : le seuil de dix ne peut pas être vérifié sur la fenêtre légale." };
   const cpt = M.comptes30j(f);
   if (cpt.projet < 10 && cpt.total30j >= 10)
     return { etat: NC, motif: `${cpt.motif} Le projet porte sur moins de dix salariés, mais la fenêtre de trente jours en compte ${cpt.total30j} : le régime du licenciement collectif d'au moins dix salariés s'applique` + (f.effectif >= 50 ? ", plan de sauvegarde de l'emploi compris." : ".") };
   return { etat: CONF, motif: `${cpt.motif} Le décompte retenu est celui de la fenêtre de trente jours.` }; });

c("CTL-SEU-02","Seuil de dix","Les refus de modification du contrat déclenchent-ils le régime collectif ?",["L. 1233-25"],
 f => { if (typeof f.refusModification !== "number") return { etat: MANQ, motif: "Le nombre de salariés ayant refusé une modification d'un élément essentiel de leur contrat n'est pas renseigné." };
   const cpt = M.comptes30j(f);
   if (!cpt.refus) return { etat: SO, motif: "Aucun refus de modification déclaré." };
   return cpt.refusDeclencheur
     ? { etat: NC, motif: `${cpt.motifRefus} Si la procédure a été conduite comme un licenciement de moins de dix salariés, elle est irrégulière.` }
     : { etat: CONF, motif: cpt.motifRefus };
 });

/* Anti-fractionnement : plus de dix licenciements sur trois mois consécutifs
   sans jamais atteindre dix sur trente jours. */
c("CTL-SEU-03","Seuil de dix","Le projet suit-il une série de licenciements étalée sur trois mois ?",["L. 1233-26"],
 f => { if (typeof f.effectif !== "number") return { etat: MANQ, motif: "L'effectif n'est pas renseigné." };
   if (f.effectif < 50) return { etat: SO, motif: "L'article L. 1233-26 ne vise que les entreprises employant habituellement au moins cinquante salariés." };
   if (typeof f.licenciements3moisGlissants !== "number")
     return { etat: MANQ, motif: "Le total des licenciements économiques des trois mois consécutifs précédents n'est pas renseigné : la règle anti-fractionnement ne peut pas être vérifiée." };
   const cpt = M.comptes30j(f);
   if (f.licenciements3moisGlissants > 10 && cpt.total30j < 10)
     return { etat: NC, motif: `${f.licenciements3moisGlissants} licenciements économiques ont été prononcés sur les trois mois consécutifs précédents, sans jamais atteindre dix sur une même période de trente jours. Tout nouveau licenciement économique envisagé au cours des trois mois suivants est soumis au régime du licenciement collectif d'au moins dix salariés.` };
   return { etat: CONF, motif: `${f.licenciements3moisGlissants} licenciement(s) sur les trois mois précédents : la règle anti-fractionnement de l'article L. 1233-26 ne trouve pas à s'appliquer.` }; });


/* ---------------- Contrôles de cohérence ----------------
   Ils ne lisent pas un champ mais la relation entre deux champs. C'est là que
   se logent les dossiers formellement complets et juridiquement indéfendables. */
c("CTL-COH-01","Cohérence","Un poste est-il déclaré à la fois disponible et supprimé ?",["L. 1233-3","L. 1233-4"],
 f => { if (vide(f.postesDisponibles) || vide(f.postesSupprimes))
     return { etat: MANQ, motif: "Les postes disponibles ou les postes supprimés ne sont pas renseignés : la contradiction ne peut pas être recherchée." };
   const supprimes = new Set(f.postesSupprimes.map(p => (p.intitule || "").trim().toLowerCase()));
   const contradictoires = f.postesDisponibles.filter(p =>
     (!p.societe || p.societe === f.entreprise) && supprimes.has((p.intitule || "").trim().toLowerCase()));
   return contradictoires.length
     ? { etat: NC, motif: `${contradictoires.length} poste(s) déclaré(s) à la fois disponible(s) au reclassement et supprimé(s) dans l'entreprise : ${contradictoires.map(p=>p.intitule).join(", ")}. Un poste ne peut pas être les deux : ou l'emploi est supprimé, ou il est disponible, et la démonstration de la suppression tombe.` }
     : { etat: CONF, motif: "Aucun poste n'est déclaré simultanément disponible et supprimé." }; });

c("CTL-COH-02","Cohérence","Un même poste est-il proposé à plusieurs salariés ?",["L. 1233-4","D. 1233-2-1"],
 f => { if (vide(f.offresFaites)) return { etat: MANQ, motif: "Aucune offre renseignée." };
   const parPoste = {};
   f.offresFaites.forEach(o => { const cle = [o.intitule, o.employeur, o.lieu].join(" | ");
     (parPoste[cle] = parPoste[cle] || new Set()).add(o.salarie); });
   const partages = Object.entries(parPoste).filter(([, s]) => s.size > 1);
   if (!partages.length) return { etat: CONF, motif: `Les ${f.offresFaites.length} offre(s) portent sur des postes distincts.` };
   const detail = partages.map(([cle, s]) => `${cle} — ${s.size} destinataires`).join(" ; ");
   return { etat: NC, motif: `${partages.length} poste(s) proposé(s) simultanément à plusieurs salariés : ${detail}. Le nombre d'offres ne vaut pas nombre de postes : une liste commune est admise, mais elle doit alors préciser les critères de départage entre les salariés candidats au même emploi.` }; });

c("CTL-COH-03","Cohérence","Les quatre critères d'ordre départagent-ils réellement les salariés ?",["L. 1233-5"],
 f => { if (vide(f.categories)) return { etat: MANQ, motif: "Les catégories professionnelles ne sont pas renseignées." };
   const tous = f.categories.flatMap(c => c.salaries || []);
   if (tous.length < 2) return { etat: SO, motif: "Moins de deux salariés renseignés : aucun départage à opérer." };
   const CRIT = { charges: "charges de famille", anciennetePoints: "ancienneté", social: "situation rendant la réinsertion difficile", qualites: "qualités professionnelles" };
   const inertes = Object.keys(CRIT).filter(k => {
     const v = tous.map(s => s[k] ?? 0);
     return v.every(x => x === v[0]);
   });
   if (inertes.length >= 3) return { etat: NC, motif: `${inertes.length} des quatre critères de l'article L. 1233-5 prennent la même valeur pour tous les salariés — ${inertes.map(k => CRIT[k]).join(", ")} — et ne départagent donc personne. Les quatre critères sont formellement présents et matériellement neutralisés : le départage repose en réalité sur ${Object.keys(CRIT).filter(k=>!inertes.includes(k)).map(k=>CRIT[k]).join(" et ")}.` };
   if (inertes.length) return { etat: RISQ, motif: `${inertes.length} critère(s) prennent la même valeur pour tous : ${inertes.map(k => CRIT[k]).join(", ")}. Une identité de valeur peut être exacte, mais elle doit pouvoir être justifiée salarié par salarié.` };
   return { etat: CONF, motif: "Les quatre critères prennent des valeurs différenciées : chacun contribue au départage." }; });


/* La donnée est-elle seulement lisible ? Ce contrôle ne juge aucune règle de
   fond : il refuse que le moteur conclue sur une valeur qui ne peut pas exister. */
c("CTL-VAL-01","Cohérence","Les données saisies sont-elles lisibles et cohérentes entre elles ?",[],
 f => { const an = VAL.valider(f);
   return an.length
     ? { etat: NC, motif: `${an.length} donnée(s) impossible(s) ou incohérente(s) : `
         + an.map(x => `${x.champ} = « ${x.valeur} » — ${x.motif}`).join(" ; ")
         + `. Tant qu'elles ne sont pas corrigées, les verdicts qui les utilisent ne valent rien.` }
     : { etat: CONF, motif: "Toutes les données renseignées sont lisibles, et les dates et effectifs sont cohérents entre eux." }; });


/* ---------------- Le droit dans le temps ---------------- */
/* Le moteur savait quelle version de L. 1233-3 s'appliquait, et appliquait
   l'autre. Ce contrôle rend la version visible et la confronte au dossier. */
c("CTL-TMP-01","Droit dans le temps","La version du texte appliquée est-elle celle en vigueur au jour de la notification ?",
 ["L. 1233-3"],
 f => { if (vide(f.dateNotification))
     return { etat: MANQ, motif: "La date de notification n'est pas renseignée : la version applicable de l'article L. 1233-3 ne peut pas être déterminée. Le rapport raisonne alors sur la version en vigueur, ce qui est faux pour tout licenciement antérieur au 24 septembre 2017." };
   const e = M.etatTexte(f.dateNotification);
   const p = M.perimetre(f);
   const ancien = f.dateNotification < "2017-09-24";
   const tresAncien = f.dateNotification < "2016-12-01";
   if (!ancien) return { etat: CONF, motif: `Notification du ${f.dateNotification} : version ${e.etat}, qui porte ${e.contenu}. C'est la version que la base applique.` };
   const etrangeres = (f.societes || []).filter(s => s.etranger).map(s => s.nom);
   return { etat: RISQ, motif: `Notification du ${f.dateNotification} : version « ${e.etat} », qui porte ${e.contenu}. `
     + (tresAncien ? "Le seuil trimestriel chiffré n'existait pas et n'est donc pas opposé au dossier. " : "")
     + `Le périmètre retenu est ${p.niveau}`
     + (etrangeres.length ? `, ${etrangeres.join(" et ")} y étant comprise(s) : la limitation au territoire national ne s'applique pas.` : ".")
     + " Un dossier régi par un texte abrogé appelle une relecture par un professionnel : la base connaît les trois versions, elle ne connaît pas la jurisprudence propre à chacune." }; });

/* ---------------- Cause 4 : la cessation d'activité ---------------- */
c("CTL-ECO-05","Cause économique","La cessation d'activité est-elle complète et définitive ?",["L. 1233-3, 4°"],
 f => { if (f.cause !== "4") return { etat: SO, motif: "La cause invoquée n'est pas la cessation d'activité." };
   if (f.cessationComplete === undefined || f.cessationComplete === null)
     return { etat: MANQ, motif: "Le caractère complet et définitif de la cessation n'est pas renseigné. C'est la condition même de la cause : une cessation partielle ou temporaire ne la constitue pas." };
   if (f.cessationComplete === false)
     return { etat: NC, motif: "La cessation est déclarée incomplète ou non définitive. L'article L. 1233-3, 4° ne vise que la cessation complète et définitive de l'activité de l'entreprise : une cessation partielle relève, le cas échéant, d'un autre cas." };
   /* Une société du groupe qui poursuit la même activité contredit la cessation. */
   const memes = (f.societes || []).filter(s => s.activite && f.activite
     && String(s.activite).toLowerCase() === String(f.activite).toLowerCase());
   if (memes.length)
     return { etat: NC, motif: `La cessation est déclarée complète et définitive, mais ${memes.length} société(s) du groupe exercent la même activité : ${memes.map(s => s.nom + (s.etranger ? " (à l'étranger)" : " (en France)")).join(", ")}. La cessation s'apprécie au niveau de l'entreprise, mais la poursuite de la même activité dans le groupe nourrit le débat sur le caractère réel de la cessation et sur l'obligation de reclassement.` };
   if (vide(f.societesDuSecteur) && f.groupe)
     return { etat: RISQ, motif: "La cessation est déclarée complète et définitive. Les sociétés du groupe exerçant la même activité ne sont pas énumérées : la contradiction ne peut pas être recherchée." };
   return { etat: CONF, motif: "La cessation est déclarée complète et définitive, et aucune société du groupe n'est déclarée exercer la même activité." }; });

c("CTL-ECO-06","Cause économique","La cessation procède-t-elle d'une faute ou d'une légèreté blâmable ?",["L. 1233-3, 4°"],
 f => { if (f.cause !== "4") return { etat: SO, motif: "La cause invoquée n'est pas la cessation d'activité." };
   return { etat: RISQ, motif: "La cessation complète et définitive constitue en elle-même une cause économique, sauf si elle procède d'une faute de l'employeur ou de sa légèreté blâmable. C'est là que se joue ce type de dossier, et la base ne peut pas trancher : la question appelle l'examen d'un professionnel, pièces de gestion à l'appui. Ce contrôle ne conclut jamais à la conformité." }; });


/* ---------------- Procédure collective ----------------
   La règle PCO-01 énonçait le régime, aucun contrôle ne le faisait vivre :
   un dossier en redressement ou en liquidation était audité comme un dossier
   ordinaire. */
const PROC = { sauvegarde: "sauvegarde", redressement: "redressement judiciaire", liquidation: "liquidation judiciaire" };
c("CTL-PCO-01","Procédure collective","Le régime de la procédure collective est-il identifié et l'auteur des licenciements désigné ?",
 ["L. 1233-58"],
 f => { if (f.procedureCollective !== true) return { etat: SO, motif: "Aucune procédure collective déclarée." };
   const manque = [];
   if (vide(f.typeProcedure)) manque.push("la nature de la procédure — sauvegarde, redressement ou liquidation");
   if (vide(f.dateJugement)) manque.push("la date du jugement d'ouverture ou de liquidation");
   if (vide(f.qualiteAuteur)) manque.push("la qualité de celui qui met en œuvre le plan — employeur, administrateur ou liquidateur");
   if (manque.length) return { etat: MANQ, motif: `Procédure collective déclarée, mais ${manque.join(", ")} n'est pas renseigné. Le régime de l'article L. 1233-58 ne peut pas être appliqué.` };
   return { etat: CONF, motif: `${PROC[f.typeProcedure] || f.typeProcedure} ouverte le ${f.dateJugement}, plan de licenciement mis en œuvre par ${f.qualiteAuteur}. La consultation obéit au seuil applicable, et le plan de sauvegarde de l'emploi reste dû dans les conditions des articles L. 1233-61 et L. 1233-62.` }; });

c("CTL-PCO-02","Procédure collective","L'autorité administrative a-t-elle été informée, et le licenciement autorisé par le juge ?",
 ["L. 1233-60"],
 f => { if (f.procedureCollective !== true) return { etat: SO, motif: "Aucune procédure collective déclarée." };
   if (vide(f.ordonnanceJugeCommissaire) && (f.typeProcedure === "redressement" || f.typeProcedure === "liquidation"))
     return { etat: NC, motif: "En redressement comme en liquidation, les licenciements présentant un caractère urgent, inévitable et indispensable sont autorisés par ordonnance du juge-commissaire. Aucune ordonnance n'est déclarée : la notification serait dépourvue de fondement." };
   if (vide(f.dateNotifAdmin))
     return { etat: NC, motif: "L'autorité administrative doit être informée avant qu'il soit procédé aux licenciements, dans les conditions du code de commerce auxquelles renvoie l'article L. 1233-60. Aucune information n'est déclarée." };
   return { etat: CONF, motif: `Ordonnance du juge-commissaire déclarée et autorité administrative informée le ${f.dateNotifAdmin}.` }; });

/* La fenêtre de garantie de l'AGS : quinze jours après le jugement de
   liquidation, vingt et un lorsqu'un plan de sauvegarde de l'emploi est
   élaboré. Notifier hors de cette fenêtre fait perdre la garantie. */
c("CTL-PCO-03","Procédure collective","La notification intervient-elle dans la fenêtre de garantie des créances ?",
 ["L. 3253-8"],
 f => { if (f.procedureCollective !== true) return { etat: SO, motif: "Aucune procédure collective déclarée." };
   if (f.typeProcedure !== "liquidation") return { etat: SO, motif: "La fenêtre de quinze ou vingt et un jours vise les ruptures suivant le jugement de liquidation." };
   if (vide(f.dateJugement) || vide(f.dateNotification))
     return { etat: MANQ, motif: "La date du jugement de liquidation ou celle de la notification n'est pas renseignée : la fenêtre de garantie ne peut pas être vérifiée." };
   const pse = M.regimeEco(f).pse;
   const limite = M.ajouteJours(f.dateJugement, pse ? 21 : 15);
   const e = DT.ecart(f.dateJugement, f.dateNotification, "le jugement de liquidation", "la notification");
   if (!e.valide) return { etat: e.cause === "ordre" ? NC : MANQ, motif: e.motif + (e.cause === "ordre" ? " Une rupture notifiée avant le jugement de liquidation ne relève pas de la fenêtre de garantie, qui court à compter de celui-ci." : "") };
   const j = e.jours;
   return f.dateNotification > limite
     ? { etat: NC, motif: `Jugement de liquidation du ${f.dateJugement}, notification du ${f.dateNotification}, soit ${j} jours. La garantie couvre les ruptures intervenant dans les ${pse ? "vingt et un jours, un plan de sauvegarde de l'emploi étant élaboré" : "quinze jours"} suivant le jugement, soit jusqu'au ${limite}. Hors de cette fenêtre, les créances de rupture ne sont pas garanties.` }
     : { etat: CONF, motif: `Notification ${j} jours après le jugement de liquidation, dans la fenêtre de ${pse ? "vingt et un" : "quinze"} jours qui expire le ${limite}.` }; });


/* ---------------- Entretien préalable : dû ou non ---------------- */
c("CTL-ENT-01","Procédure","Le calendrier suivi est-il celui que le régime commande ?",["L. 1233-38","L. 1233-11"],
 f => { const e = M.entretienDu(f);
   if (e.du === null) return { etat: MANQ, motif: e.motif };
   if (e.du === false)
     return vide(f.dateEntretien)
       ? { etat: CONF, motif: e.motif + " Aucun entretien n'est déclaré, ce qui est conforme au régime." }
       : { etat: RISQ, motif: e.motif + ` Un entretien est pourtant déclaré le ${f.dateEntretien}. Le tenir n'est pas irrégulier, mais il n'ouvre aucun délai opposable : la notification reste commandée par l'avis du comité et, le cas échéant, par la décision administrative. Se régler sur le calendrier individuel exposerait à notifier trop tôt au regard du calendrier collectif.` };
   return vide(f.dateEntretien)
     ? { etat: NC, motif: e.motif + " Aucune date d'entretien n'est déclarée." }
     : { etat: CONF, motif: e.motif + ` Entretien déclaré le ${f.dateEntretien}.` }; });

/* ---------------- Transfert d'entité ---------------- */
c("CTL-TRF-01","Transfert d'entité","Un transfert est-il envisagé, et les licenciements s'y heurtent-ils ?",["L. 1224-1"],
 f => { if (vide(f.transfertEnvisage)) return { etat: MANQ, motif: "L'existence d'un transfert d'entité n'est pas renseignée." };
   if (f.transfertEnvisage !== true) return { etat: SO, motif: "Aucun transfert d'entité économique n'est envisagé." };
   return { etat: RISQ, motif: "Un transfert d'entité est envisagé. Tous les contrats en cours au jour de la modification subsistent avec le nouvel employeur : les licenciements prononcés à l'occasion du transfert se heurtent à l'article L. 1224-1, et la répartition des salariés entre l'entité transférée et celle qui demeure décide de leur sort. Ce contrôle ne conclut jamais à la conformité — l'articulation du transfert avec le projet de licenciement appelle l'examen d'un professionnel." }; });

/* ---------------- Refus d'un accord de performance collective ---------------- */
c("CTL-APC-01","Qualification","Le licenciement consécutif au refus d'un accord de performance collective est-il correctement qualifié ?",
 ["L. 2254-2"],
 f => { if (vide(f.refusAPC)) return { etat: MANQ, motif: "L'existence d'un licenciement consécutif au refus d'un accord de performance collective n'est pas renseignée." };
   if (f.refusAPC !== true) return { etat: SO, motif: "Aucun licenciement consécutif au refus d'un accord de performance collective." };
   return { etat: NC, motif: "Le licenciement du salarié qui refuse l'application d'un accord de performance collective repose sur un motif spécifique qui constitue une cause réelle et sérieuse : il n'est pas un licenciement pour motif économique. Le soumettre au régime de l'article L. 1233-3 — cause économique, critères d'ordre, plan de sauvegarde de l'emploi — est une erreur de qualification. Les développements du présent rapport sur ces points ne lui sont pas applicables." }; });

module.exports = C;
