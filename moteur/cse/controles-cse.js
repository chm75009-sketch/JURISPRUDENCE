/* Les contrôles du comité social et économique.
   Les règles disent ce que la loi exige ; les contrôles disent si la situation
   décrite y satisfait. Cinq états, et jamais « conforme » sur une déclaration
   que rien ne justifie : une affirmation de l'employeur n'est pas une preuve. */
const M = require("./moteur-cse.js");
const CONF = "conforme", NC = "non conforme", RISQ = "risque à vérifier",
      MANQ = "donnée manquante", SO = "sans objet";
const ETATS = { CONF, NC, RISQ, MANQ, SO };
const vide = x => x === undefined || x === null || x === "" || (Array.isArray(x) && !x.length);
const piece = (f, nom) => Array.isArray(f.pieces) && f.pieces.includes(nom);

const C = [];
const c = (id, rubrique, objet, fondement, fn) => C.push({ id, rubrique, objet, fondement, verdict: fn });

/* ---------------- Mise en place ---------------- */
c("CSE-CTL-MEP-01", "Mise en place", "Le seuil de onze salariés est-il mesuré sur douze mois consécutifs ?", ["L. 2311-2"],
 f => vide(f.effectifsMensuels)
   ? { etat: MANQ, motif: "Les effectifs mensuels des douze derniers mois ne sont pas renseignés : le franchissement du seuil ne peut pas être vérifié." }
   : (() => { const s = M.seuilAtteint(f.effectifsMensuels, 11);
       if (!s.atteint) return { etat: SO, motif: `Le seuil de onze salariés n'est atteint que ${s.consecutifs} mois consécutifs : l'obligation n'est pas née.` };
       return piece(f, "etats-effectifs")
         ? { etat: CONF, motif: `Seuil atteint pendant ${s.consecutifs} mois consécutifs, établi par les états d'effectif versés.` }
         : { etat: RISQ, motif: `Seuil déclaré atteint pendant ${s.consecutifs} mois consécutifs, mais les états d'effectif ne sont pas versés.` }; })());

c("CSE-CTL-MEP-02", "Mise en place", "Un comité existe-t-il, ou un procès-verbal de carence a-t-il été établi ?", ["L. 2314-4", "L. 2314-9"],
 f => vide(f.comiteExistant)
   ? { etat: MANQ, motif: "L'existence d'un comité n'est pas renseignée." }
   : (f.comiteExistant === true
     ? { etat: CONF, motif: "Un comité est en place." }
     : (piece(f, "pv-carence")
       ? { etat: CONF, motif: "Aucun comité, mais un procès-verbal de carence est versé." }
       : { etat: NC, motif: "Aucun comité et aucun procès-verbal de carence versé, alors que l'effectif rend la mise en place obligatoire." })));

c("CSE-CTL-MEP-03", "Mise en place", "Les élections ont-elles été engagées dans le délai de quatre ans ?", ["L. 2314-4", "L. 2314-33"],
 f => vide(f.dateDernieresElections)
   ? { etat: MANQ, motif: "La date des dernières élections n'est pas renseignée." }
   : (() => { const m = M.mandat(f);
       const ecoule = (new Date(f.dateAudit || "2026-08-15") - new Date(f.dateDernieresElections)) / 31557600000;
       return ecoule > m.annees
         ? { etat: NC, motif: `${ecoule.toFixed(1)} ans se sont écoulés depuis les dernières élections, pour un mandat de ${m.annees} ans : le renouvellement est en retard.` }
         : { etat: CONF, motif: `${ecoule.toFixed(1)} ans écoulés depuis les dernières élections, pour un mandat de ${m.annees} ans.` }; })());

c("CSE-CTL-MEP-04", "Mise en place", "La durée de mandat fixée par accord est-elle licite ?", ["L. 2314-34"],
 f => typeof f.dureeAccord !== "number"
   ? { etat: SO, motif: "Aucune durée conventionnelle n'est déclarée : la durée légale de quatre ans s'applique." }
   : (M.mandat(f).licite
     ? { etat: CONF, motif: M.mandat(f).motif }
     : { etat: NC, motif: M.mandat(f).motif }));

/* ---------------- Périmètre ---------------- */
c("CSE-CTL-PER-01", "Périmètre", "Le découpage en établissements distincts repose-t-il sur une source régulière ?", ["L. 2313-2", "L. 2313-4"],
 f => f.etablissementsMultiples !== true
   ? { etat: SO, motif: "L'entreprise ne comporte pas plusieurs établissements distincts." }
   : vide(f.sourceDecoupage)
     ? { etat: MANQ, motif: "La source du découpage — accord, décision unilatérale ou décision administrative — n'est pas renseignée." }
     : (f.sourceDecoupage === "accord"
       ? (piece(f, "accord-decoupage") ? { etat: CONF, motif: "Le découpage résulte d'un accord d'entreprise, versé au dossier." }
          : { etat: RISQ, motif: "Un accord de découpage est déclaré, mais il n'est pas versé : sa validité et son périmètre restent invérifiables." })
       : { etat: RISQ, motif: `Découpage fixé par ${f.sourceDecoupage}. L'ordre des sources impose que l'accord ait été recherché d'abord ; l'autonomie de gestion du responsable d'établissement doit être documentée.` }));

c("CSE-CTL-PER-02", "Périmètre", "L'autonomie de gestion des responsables d'établissement est-elle documentée ?", ["L. 2313-4"],
 f => f.etablissementsMultiples !== true
   ? { etat: SO, motif: "Sans objet en l'absence d'établissements distincts." }
   : (piece(f, "delegations-pouvoir")
     ? { etat: CONF, motif: "Les délégations de pouvoir des responsables d'établissement sont versées." }
     : { etat: RISQ, motif: "L'autonomie de gestion n'est établie par aucune pièce. C'est le seul critère du texte, et le juge se prononce au regard de l'ensemble des circonstances de fait." }));

c("CSE-CTL-PER-03", "Périmètre", "Les représentants de proximité ont-ils été institués par accord ?", ["L. 2313-7"],
 f => f.representantsProximite !== true
   ? { etat: SO, motif: "Aucun représentant de proximité n'est déclaré." }
   : (piece(f, "accord-representants-proximite")
     ? { etat: CONF, motif: "L'accord instituant les représentants de proximité est versé." }
     : { etat: NC, motif: "Des représentants de proximité sont déclarés sans accord versé. Ils ne peuvent être mis en place que par l'accord d'entreprise majoritaire de l'article L. 2313-7." }));

/* ---------------- Élections ---------------- */
c("CSE-CTL-ELE-01", "Élections", "Les organisations syndicales ont-elles toutes été invitées à négocier ?", ["L. 2314-5"],
 f => f.electionsEnCours !== true
   ? { etat: SO, motif: "Aucune élection en cours." }
   : vide(f.syndicatsInvites)
     ? { etat: MANQ, motif: "La liste des organisations invitées n'est pas renseignée." }
     : (piece(f, "invitations-syndicats")
       ? { etat: CONF, motif: `${f.syndicatsInvites.length} organisation(s) invitée(s), preuves d'envoi versées.` }
       : { etat: RISQ, motif: `${f.syndicatsInvites.length} organisation(s) déclarées invitées, sans preuve d'envoi versée. L'invitation doit atteindre au-delà des seules organisations représentatives.` }));

c("CSE-CTL-ELE-02", "Élections", "Le premier tour se tient-il dans les quatre-vingt-dix jours de l'information du personnel ?", ["L. 2314-4"],
 f => (vide(f.dateInformationPersonnel) || vide(f.datePremierTour))
   ? { etat: MANQ, motif: "La date d'information du personnel ou celle du premier tour n'est pas renseignée." }
   : (() => { const j = Math.round((new Date(f.datePremierTour) - new Date(f.dateInformationPersonnel)) / 86400000);
       return j > 90
         ? { etat: NC, motif: `${j} jours entre l'information du personnel et le premier tour : le maximum est de quatre-vingt-dix jours.` }
         : { etat: CONF, motif: `${j} jours entre l'information du personnel et le premier tour.` }; })());

c("CSE-CTL-ELE-03", "Élections", "Le protocole préélectoral remplit-il la condition de double majorité ?", ["L. 2314-6"],
 f => f.electionsEnCours !== true && vide(f.protocole)
   ? { etat: SO, motif: "Aucun protocole en cause." }
   : vide(f.protocole)
     ? { etat: MANQ, motif: "Le protocole n'est pas renseigné." }
     : (typeof f.protocole.suffragesSignataires !== "number" || typeof f.protocole.nbSignataires !== "number" || typeof f.protocole.nbParticipants !== "number")
       ? { etat: MANQ, motif: "Le nombre de signataires, le nombre de participants ou les suffrages des signataires ne sont pas renseignés : la double majorité ne peut pas être vérifiée." }
       : (() => { const majOrg = f.protocole.nbSignataires > f.protocole.nbParticipants / 2;
           const majSuf = f.protocole.suffragesSignataires > 50;
           return (majOrg && majSuf)
             ? { etat: CONF, motif: `${f.protocole.nbSignataires} signataires sur ${f.protocole.nbParticipants} participants, représentant ${f.protocole.suffragesSignataires} % des suffrages : la double majorité est réunie.` }
             : { etat: NC, motif: `Double majorité non réunie : ${f.protocole.nbSignataires} signataires sur ${f.protocole.nbParticipants} participants, ${f.protocole.suffragesSignataires} % des suffrages. Le protocole n'est pas valable et ne purge donc rien.` }; })());

c("CSE-CTL-ELE-04", "Élections", "La proportion de femmes et d'hommes figure-t-elle au protocole ?", ["L. 2314-13", "L. 2314-31"],
 f => f.electionsEnCours !== true
   ? { etat: SO, motif: "Aucune élection en cours." }
   : (f.protocole && f.protocole.proportionFH === true
     ? { etat: CONF, motif: "Le protocole mentionne la proportion de femmes et d'hommes par collège, et elle a été portée à la connaissance des salariés." }
     : (f.protocole && f.protocole.proportionFH === false
       ? { etat: NC, motif: "Le protocole ne mentionne pas la proportion de femmes et d'hommes composant chaque collège, alors que l'article L. 2314-13 l'exige." }
       : { etat: MANQ, motif: "La mention de la proportion de femmes et d'hommes au protocole n'est pas renseignée." })));

c("CSE-CTL-ELE-05", "Élections", "Les listes déposées respectent-elles la proportion et l'alternance ?", ["L. 2314-30", "L. 2314-32"],
 f => vide(f.listesDeposees)
   ? { etat: MANQ, motif: "Les listes déposées ne sont pas renseignées : la composition ne peut pas être contrôlée." }
   : (() => {
       const ko = [], douteux = [];
       for (const l of f.listesDeposees) {
         const r = M.listeParitaire({ femmes: l.femmesInscrites, hommes: l.hommesInscrits, candidats: (l.candidats || []).length });
         if (!r) { douteux.push(`${l.nom} : données du collège incomplètes`); continue; }
         if (!r.applicable) continue;
         if (r.conflit || r.indifferent) { douteux.push(`${l.nom} : ${r.motif}`); continue; }
         const nF = (l.candidats || []).filter(x => x.sexe === "F").length;
         const nH = (l.candidats || []).filter(x => x.sexe === "H").length;
         if (nF !== r.candidatsFemmes || nH !== r.candidatsHommes)
           ko.push(`${l.nom} : ${nF} femme(s) et ${nH} homme(s) déposés, ${r.candidatsFemmes} et ${r.candidatsHommes} attendus`);
         else {
           const ordre = (l.candidats || []).map(x => x.sexe).join(" · ");
           if (ordre !== r.alternance) ko.push(`${l.nom} : ordre déposé ${ordre}, ordre imposé par l'alternance ${r.alternance}`);
         }
       }
       if (ko.length) return { etat: NC, motif: `Composition irrégulière : ${ko.join(" ; ")}. La sanction est l'annulation de l'élection des élus concernés, sans remplacement possible.` };
       if (douteux.length) return { etat: RISQ, motif: `Composition non tranchée par la base : ${douteux.join(" ; ")}.` };
       return { etat: CONF, motif: `Les ${f.listesDeposees.length} liste(s) déposée(s) respectent la proportion et l'alternance.` };
     })());

c("CSE-CTL-ELE-06", "Élections", "Le vote électronique repose-t-il sur un support régulier ?", ["L. 2314-26", "R. 2314-5"],
 f => f.voteElectronique !== true
   ? { etat: SO, motif: "Le vote électronique n'est pas utilisé." }
   : (piece(f, "accord-vote-electronique") || piece(f, "decision-vote-electronique")
     ? { etat: CONF, motif: "Le recours au vote électronique repose sur un accord ou une décision unilatérale versés." }
     : { etat: RISQ, motif: "Le vote électronique est déclaré sans accord ni décision unilatérale versés." }));

c("CSE-CTL-ELE-07", "Élections", "Des élections partielles sont-elles dues et ont-elles été organisées ?", ["L. 2314-10"],
 f => typeof f.titulairesInitiaux !== "number" || typeof f.titulairesRestants !== "number"
   ? { etat: MANQ, motif: "Le nombre de titulaires initiaux ou restants n'est pas renseigné." }
   : (() => { const e = M.electionsPartielles(f);
       if (!e.dues) return { etat: SO, motif: e.motif };
       return f.partiellesOrganisees === true
         ? { etat: CONF, motif: e.motif + " Des élections partielles ont été organisées." }
         : { etat: NC, motif: e.motif + " Aucune élection partielle n'est déclarée : elles sont dues à l'initiative de l'employeur." }; })());

/* ---------------- Consultations ---------------- */
c("CSE-CTL-CON-01", "Consultations", "Les trois consultations récurrentes ont-elles été conduites ?", ["L. 2312-17", "L. 2312-22"],
 f => (typeof f.effectif !== "number" || f.effectif < 50)
   ? { etat: SO, motif: "Les consultations récurrentes ne sont dues qu'à partir de cinquante salariés." }
   : vide(f.consultationsRecurrentes)
     ? { etat: MANQ, motif: "Les consultations récurrentes conduites ne sont pas renseignées." }
     : (() => { const dues = ["orientations stratégiques", "situation économique et financière", "politique sociale"];
         const oubli = dues.filter(d => !f.consultationsRecurrentes.some(x => (x.objet || "").toLowerCase().includes(d.split(" ")[0])));
         return oubli.length
           ? { etat: NC, motif: `Consultation(s) non conduite(s) : ${oubli.join(", ")}. À défaut d'accord, les trois sont annuelles.` }
           : { etat: CONF, motif: "Les trois consultations récurrentes ont été conduites." }; })());

c("CSE-CTL-CON-02", "Consultations", "Le délai de consultation a-t-il couru depuis la remise effective des informations ?", ["R. 2312-5", "R. 2312-6"],
 f => vide(f.consultation) || vide(f.consultation.dateRemiseInformations)
   ? { etat: MANQ, motif: "La date de remise des informations au comité n'est pas renseignée : le point de départ du délai est inconnu." }
   : (() => { const d = M.delaiConsultation(f.consultation);
       if (vide(f.consultation.dateAvis)) return { etat: RISQ, motif: `Informations remises le ${f.consultation.dateRemiseInformations}, délai de ${d.jours} jours. Aucune date d'avis n'est renseignée : à l'expiration, le comité est réputé avoir rendu un avis négatif.` };
       const j = Math.round((new Date(f.consultation.dateAvis) - new Date(f.consultation.dateRemiseInformations)) / 86400000);
       return j > d.jours
         ? { etat: RISQ, motif: `${j} jours entre la remise des informations et l'avis, pour un délai de ${d.jours} jours : l'avis a été rendu après l'expiration, donc après qu'un avis négatif a été réputé acquis.` }
         : { etat: CONF, motif: `Avis rendu ${j} jours après la remise des informations, dans le délai de ${d.jours} jours.` }; })());

c("CSE-CTL-CON-03", "Consultations", "Le comité a-t-il reçu des informations précises et écrites ?", ["L. 2312-15"],
 f => piece(f, "note-information-cse")
   ? { etat: CONF, motif: "La note d'information remise au comité est versée." }
   : { etat: RISQ, motif: "Aucune note d'information versée. Le comité doit disposer d'informations précises et écrites et de la réponse motivée de l'employeur à ses observations ; à défaut, il peut saisir le président du tribunal judiciaire." });

c("CSE-CTL-CON-04", "Consultations", "L'instance consultée est-elle la bonne ?", ["L. 2316-1", "L. 2316-20"],
 f => f.etablissementsMultiples !== true
   ? { etat: SO, motif: "Instance unique : la question ne se pose pas." }
   : vide(f.instanceConsultee)
     ? { etat: MANQ, motif: "L'instance consultée n'est pas renseignée." }
     : (vide(f.mesuresAdaptation)
       ? { etat: RISQ, motif: `Instance consultée : ${f.instanceConsultee}. L'existence de mesures d'adaptation spécifiques à un ou plusieurs établissements n'étant pas renseignée, le niveau de consultation ne peut pas être validé.` }
       : ((f.mesuresAdaptation === true && f.instanceConsultee === "central")
         ? { etat: NC, motif: "Le projet comporte des mesures d'adaptation spécifiques à des établissements : les comités d'établissement doivent également être consultés." }
         : { etat: CONF, motif: `Instance consultée : ${f.instanceConsultee}, cohérente avec le niveau du projet.` })));

c("CSE-CTL-CON-05", "Consultations", "Le nombre de réunions est-il conforme ?", ["L. 2315-27", "L. 2315-28"],
 f => typeof f.effectif !== "number"
   ? { etat: MANQ, motif: "L'effectif n'est pas renseigné." }
   : typeof f.reunionsTenues !== "number"
     ? { etat: MANQ, motif: "Le nombre de réunions tenues sur l'année n'est pas renseigné." }
     : (() => { const u = M.reunions(f); const du = u.parAn;
         if (du === null) return { etat: MANQ, motif: "Le nombre de réunions prévu par l'accord n'est pas renseigné." };
         if (u.sourceAccord && u.licite === false) return { etat: NC, motif: u.motif };
         return f.reunionsTenues < du
           ? { etat: NC, motif: `${f.reunionsTenues} réunion(s) tenue(s) pour ${du} dues. ${u.motif}` }
           : { etat: CONF, motif: `${f.reunionsTenues} réunion(s) tenue(s) pour ${du} dues.` }; })());

c("CSE-CTL-CON-06", "Consultations", "Quatre réunions au moins ont-elles porté sur la santé et la sécurité ?", ["L. 2315-27"],
 f => (typeof f.effectif !== "number" || f.effectif < 50)
   ? { etat: SO, motif: "L'obligation vise les entreprises d'au moins cinquante salariés." }
   : typeof f.reunionsSante !== "number"
     ? { etat: MANQ, motif: "Le nombre de réunions portant sur la santé et la sécurité n'est pas renseigné." }
     : (f.reunionsSante >= 4
       ? { etat: CONF, motif: `${f.reunionsSante} réunion(s) ont porté, en tout ou partie, sur la santé, la sécurité et les conditions de travail.` }
       : { etat: NC, motif: `${f.reunionsSante} réunion(s) sur les quatre exigées ont porté sur la santé, la sécurité et les conditions de travail.` }));

/* ---------------- Moyens ---------------- */
c("CSE-CTL-MOY-01", "Moyens", "Le crédit d'heures accordé atteint-il le minimum légal ?", ["R. 2314-1", "L. 2314-7"],
 f => typeof f.effectif !== "number"
   ? { etat: MANQ, motif: "L'effectif n'est pas renseigné." }
   : typeof f.heuresAccordees !== "number"
     ? { etat: MANQ, motif: "Le volume d'heures de délégation accordé n'est pas renseigné." }
     : (() => { const d = M.delegation(f.effectif);
         if (!d.du) return { etat: SO, motif: d.motif };
         return f.heuresAccordees < d.total
           ? { etat: NC, motif: `${f.heuresAccordees} heures accordées au total, pour un minimum de ${d.total} heures (${d.titulaires} titulaires × ${d.heures} heures, tranche ${d.tranche}).` }
           : { etat: CONF, motif: `${f.heuresAccordees} heures accordées, pour un minimum de ${d.total} heures.` }; })());

c("CSE-CTL-MOY-02", "Moyens", "Le nombre de titulaires élus correspond-il au tableau réglementaire ?", ["R. 2314-1"],
 f => typeof f.effectif !== "number" || typeof f.titulairesElus !== "number"
   ? { etat: MANQ, motif: "L'effectif ou le nombre de titulaires élus n'est pas renseigné." }
   : (() => { const d = M.delegation(f.effectif);
       if (!d.du) return { etat: SO, motif: d.motif };
       return f.titulairesElus < d.titulaires
         ? { etat: RISQ, motif: `${f.titulairesElus} titulaire(s) élu(s) pour ${d.titulaires} prévus par le tableau. L'écart peut résulter d'un protocole modifiant le nombre de sièges, ou de sièges non pourvus faute de candidats : la cause doit être établie.` }
         : { etat: CONF, motif: `${f.titulairesElus} titulaire(s) élu(s), pour ${d.titulaires} prévus par le tableau.` }; })());

c("CSE-CTL-MOY-03", "Moyens", "Les heures de délégation ont-elles été payées à l'échéance normale ?", ["L. 2315-10"],
 f => vide(f.heuresRetenues)
   ? { etat: MANQ, motif: "L'existence de retenues sur les heures de délégation n'est pas renseignée." }
   : (f.heuresRetenues === false
     ? { etat: CONF, motif: "Aucune retenue n'a été opérée sur les heures de délégation." }
     : { etat: NC, motif: "Des heures de délégation ont été retenues sur la paie. Le temps passé est de plein droit du temps de travail payé à l'échéance normale : l'employeur qui conteste doit payer d'abord et saisir le juge ensuite." }));

c("CSE-CTL-MOY-04", "Moyens", "Les formations obligatoires ont-elles été dispensées ?", ["L. 2315-18", "L. 2315-63"],
 f => vide(f.formationsDispensees)
   ? { etat: MANQ, motif: "Les formations dispensées aux élus ne sont pas renseignées." }
   : (f.formationsDispensees.some(x => /sant|sécurit/i.test(x))
     ? { etat: piece(f, "attestations-formation") ? CONF : RISQ,
         motif: piece(f, "attestations-formation")
           ? "La formation en santé, sécurité et conditions de travail a été dispensée, attestations versées."
           : "La formation en santé, sécurité et conditions de travail est déclarée, sans attestation versée." }
     : { etat: NC, motif: "Aucune formation en santé, sécurité et conditions de travail n'est déclarée, alors qu'elle est due à tous les membres de la délégation du personnel, pour cinq jours au minimum." }));

/* ---------------- Commission santé et sécurité ---------------- */
c("CSE-CTL-SST-01", "Santé et sécurité", "La commission santé, sécurité et conditions de travail a-t-elle été mise en place quand elle est due ?", ["L. 2315-36"],
 f => typeof f.effectif !== "number"
   ? { etat: MANQ, motif: "L'effectif n'est pas renseigné." }
   : (() => { const s = M.cssct(f);
       if (!s.obligatoire) return { etat: SO, motif: s.motif + " " + (s.reserve || "") };
       return f.cssct === true
         ? { etat: CONF, motif: "La commission est en place, comme l'exige " + s.texte + "." }
         : (f.cssct === false
           ? { etat: NC, motif: "Aucune commission alors qu'elle est obligatoire : " + s.motif }
           : { etat: MANQ, motif: "L'existence de la commission n'est pas renseignée, alors qu'elle est obligatoire : " + s.motif }); })());

c("CSE-CTL-SST-02", "Santé et sécurité", "La composition de la commission respecte-t-elle le siège réservé au second ou au troisième collège ?", ["L. 2315-39"],
 f => f.cssct !== true
   ? { etat: SO, motif: "Aucune commission en place." }
   : vide(f.membresCssct)
     ? { etat: MANQ, motif: "La composition de la commission n'est pas renseignée." }
     : (() => { const n = f.membresCssct.length;
         const col = M.colleges(f);
         const attendu = col && col.nombre === 3 ? "troisième" : "second";
         const ok = f.membresCssct.some(m => m.college === (col && col.nombre === 3 ? 3 : 2));
         if (n < 3) return { etat: NC, motif: `${n} membre(s) désigné(s) : le minimum est de trois représentants du personnel.` };
         return ok
           ? { etat: CONF, motif: `${n} membres désignés, dont au moins un du ${attendu} collège.` }
           : { etat: NC, motif: `${n} membres désignés, mais aucun du ${attendu} collège. Les dispositions de l'article L. 2315-39 sont d'ordre public.` }; })());

/* ---------------- Budgets ---------------- */
c("CSE-CTL-BUD-01", "Budgets", "La subvention de fonctionnement versée atteint-elle le taux légal ?", ["L. 2315-61"],
 f => typeof f.effectif !== "number" || typeof f.masseSalariale !== "number"
   ? { etat: MANQ, motif: "L'effectif ou la masse salariale brute n'est pas renseigné." }
   : (() => { const b = M.budgetFonctionnement(f.effectif, f.masseSalariale);
       if (!b.du) return { etat: SO, motif: b.motif };
       if (typeof f.subventionVersee !== "number") return { etat: MANQ, motif: `Le montant versé n'est pas renseigné. Le minimum légal est de ${b.montant.toLocaleString("fr-FR")} euros (${b.tauxTexte}).` };
       return f.subventionVersee < b.montant
         ? { etat: NC, motif: `${f.subventionVersee.toLocaleString("fr-FR")} euros versés pour un minimum de ${b.montant.toLocaleString("fr-FR")} euros (${b.tauxTexte} de la masse salariale brute).` }
         : { etat: CONF, motif: `${f.subventionVersee.toLocaleString("fr-FR")} euros versés, pour un minimum de ${b.montant.toLocaleString("fr-FR")} euros.` }; })());

c("CSE-CTL-BUD-02", "Budgets", "La contribution aux activités sociales est-elle au moins égale au rapport de l'année précédente ?", ["L. 2312-81"],
 f => (typeof f.effectif !== "number" || f.effectif < 50)
   ? { etat: SO, motif: "Sans objet en deçà de cinquante salariés." }
   : (typeof f.ascAnneeN !== "number" || typeof f.ascAnneeN1 !== "number" || typeof f.masseSalariale !== "number" || typeof f.masseSalarialeN1 !== "number")
     ? { etat: MANQ, motif: "Les contributions et masses salariales des deux exercices ne sont pas toutes renseignées : le rapport ne peut pas être comparé." }
     : (() => { const rN = f.ascAnneeN / f.masseSalariale, rN1 = f.ascAnneeN1 / f.masseSalarialeN1;
         return rN < rN1
           ? { etat: NC, motif: `Rapport de ${(rN * 100).toFixed(3)} % contre ${(rN1 * 100).toFixed(3)} % l'année précédente : à défaut d'accord, il ne peut être inférieur.` }
           : { etat: CONF, motif: `Rapport de ${(rN * 100).toFixed(3)} %, contre ${(rN1 * 100).toFixed(3)} % l'année précédente.` }; })());

c("CSE-CTL-BUD-03", "Budgets", "L'accès aux activités sociales est-il ouvert sans condition d'ancienneté ?", ["L. 2312-78", "R. 2312-35"],
 f => vide(f.ancienneteASC)
   ? { etat: MANQ, motif: "L'existence d'une condition d'ancienneté pour l'accès aux activités sociales n'est pas renseignée." }
   : (f.ancienneteASC === false
     ? { etat: CONF, motif: "Aucune condition d'ancienneté ne conditionne l'accès aux activités sociales et culturelles." }
     : { etat: NC, motif: "Une condition d'ancienneté conditionne l'accès aux activités sociales et culturelles. L'ouverture du droit ne peut pas y être subordonnée : tous les salariés et les stagiaires y ont vocation." }));

/* ---------------- Expertises ---------------- */
c("CSE-CTL-EXP-01", "Expertises", "Le financement de l'expertise correspond-il au cas de recours ?", ["L. 2315-80"],
 f => vide(f.expertise) || vide(f.expertise.cas)
   ? { etat: SO, motif: "Aucune expertise en cours." }
   : (() => { const e = M.financementExpertise(f.expertise.cas);
       if (!e) return { etat: MANQ, motif: `Le cas de recours « ${f.expertise.cas} » n'est pas reconnu par la base.` };
       if (typeof f.expertise.partEmployeur !== "number") return { etat: MANQ, motif: `Part employeur non renseignée. Le texte prévoit ${e.employeur ?? 0} % à la charge de l'employeur (${e.finance}).` };
       return f.expertise.partEmployeur === (e.employeur ?? 0)
         ? { etat: CONF, motif: `Part employeur de ${f.expertise.partEmployeur} %, conforme à ${e.finance}.` }
         : { etat: NC, motif: `Part employeur de ${f.expertise.partEmployeur} % alors que ${e.finance} en prévoit ${e.employeur ?? 0} %.` }; })());

c("CSE-CTL-EXP-02", "Expertises", "La contestation de l'expertise a-t-elle été formée dans les dix jours ?", ["L. 2315-86", "R. 2315-49"],
 f => vide(f.expertise) || vide(f.expertise.dateDepart)
   ? { etat: SO, motif: "Aucune contestation d'expertise en cours." }
   : vide(f.expertise.dateSaisine)
     ? { etat: MANQ, motif: "La date de saisine du juge n'est pas renseignée." }
     : (() => { const j = Math.round((new Date(f.expertise.dateSaisine) - new Date(f.expertise.dateDepart)) / 86400000);
         return j > 10
           ? { etat: NC, motif: `${j} jours entre le point de départ et la saisine : le délai est de dix jours. Le délai ne court qu'à compter du lendemain de l'acte, et la date de saisine s'entend de celle de l'assignation.` }
           : { etat: CONF, motif: `${j} jours entre le point de départ et la saisine, dans le délai de dix jours.` }; })());

c("CSE-CTL-EXP-03", "Expertises", "Une expertise a-t-elle été décidée sur un fondement qui ne la prévoit pas ?", ["L. 1233-34", "L. 2315-92"],
 f => (vide(f.expertise) || typeof f.nbLicenciements !== "number")
   ? { etat: SO, motif: "Aucune expertise liée à un licenciement collectif." }
   : (f.expertise.cas === "licenciement collectif pour motif économique" && f.nbLicenciements < 10
     ? { etat: NC, motif: `Une expertise est décidée sur le fondement de l'article L. 1233-34 pour ${f.nbLicenciements} licenciement(s). Aucune mesure d'expertise n'est prévue en deçà de dix salariés dans une même période de trente jours.` }
     : { etat: CONF, motif: "Le cas de recours à l'expertise correspond au fondement invoqué." }));

/* ---------------- Détection : jamais de conclusion de conformité ---------------- */
const DETECTION = new Set(["CSE-CTL-DET-01", "CSE-CTL-DET-02", "CSE-CTL-DET-03"]);
c("CSE-CTL-DET-01", "À faire examiner", "Un accord collectif prive-t-il le comité d'une prérogative légale ?", ["L. 2262-14"],
 f => vide(f.accordsCse)
   ? { etat: MANQ, motif: "Les accords collectifs applicables au comité ne sont pas renseignés." }
   : { etat: RISQ, motif: `${f.accordsCse.length} accord(s) déclarés. La base ne lit pas leurs stipulations. Un accord peut légalement aménager la périodicité, le contenu et le niveau des consultations, mais non priver le comité d'une prérogative : le comité peut alors en invoquer l'illégalité par voie d'exception, sans condition de délai. Ce point appelle l'examen d'un professionnel.` });

c("CSE-CTL-DET-02", "À faire examiner", "Un contentieux ou une procédure sont-ils en cours devant le juge ?", [],
 f => vide(f.contentieuxCse)
   ? { etat: MANQ, motif: "L'existence d'un contentieux en cours n'est pas renseignée." }
   : { etat: RISQ, motif: "Un contentieux est signalé. La base ne l'apprécie pas : il doit être porté à la connaissance de la direction et du conseil juridique avant toute décision." });

c("CSE-CTL-DET-03", "À faire examiner", "Des faits susceptibles de caractériser une entrave sont-ils signalés ?", ["L. 2317-1"],
 f => vide(f.faitsEntrave)
   ? { etat: MANQ, motif: "Aucun élément n'est renseigné sur ce point." }
   : { etat: RISQ, motif: "Des faits sont signalés. L'entrave est une infraction pénale, et aucun arrêt publié du corpus ne s'y rattache : la base détecte, elle ne qualifie pas. Ce point appelle l'examen d'un professionnel." });

module.exports = { C, ETATS, DETECTION };
if (require.main === module) {
  const ids = C.map(x => x.id);
  console.log(`${C.length} contrôles · ${new Set(ids).size} identifiants distincts · ${DETECTION.size} de détection`);
  /* Un contrôle de détection ne doit jamais pouvoir conclure à la conformité. */
  const src = require("fs").readFileSync(__filename, "utf8");
  for (const id of DETECTION) {
    const bloc = src.split(`c("${id}"`)[1].split("\nc(")[0];
    if (/etat:\s*CONF/.test(bloc)) { console.log("ÉCHEC : " + id + " peut conclure à la conformité."); process.exit(1); }
  }
  console.log("aucun contrôle de détection ne peut conclure à la conformité");
}
