/* Les contrôles : ils ne disent pas ce que la loi exige — les règles le font —
   mais si la situation décrite y satisfait, et sur quelle base.
   Quatre états seulement, et jamais d'état « conforme » sur une déclaration
   non justifiée : une affirmation de l'employeur n'est pas une preuve. */
const M = require("./moteur.js");
const CONF = "conforme", NC = "non conforme", RISQ = "risque à vérifier",
      MANQ = "donnée manquante", SO = "sans objet";
const vide = x => x === undefined || x === null || x === "" ||
                  (Array.isArray(x) && !x.length);
const piece = (f, nom) => Array.isArray(f.pieces) && f.pieces.includes(nom);
/* Une réponse « il n'y en a aucun » n'est pas une absence de réponse. Le champ
   présent et vide vaut déclaration de néant ; le champ absent vaut silence.
   Sans cette distinction, l'employeur ne peut jamais sortir de la réserve. */
const declare = (f, champ) => Object.prototype.hasOwnProperty.call(f, champ);
const neant = (f, champ) => declare(f, champ) && vide(f[champ]);
const P = require("./preuve.js");
/* Le niveau de preuve accompagne chaque verdict : l'état dit si l'exigence est
   satisfaite, le niveau dit sur quoi cette réponse repose. */
const niv = (f, cle, renseigne) => P.niveau(f, cle, renseigne);

const C = [];
const c = (id, rubrique, objet, fondement, fn) => C.push({ id, rubrique, objet, fondement, verdict: fn });

/* ---------------- RECLASSEMENT ---------------- */
c("CTL-REC-01","Reclassement","Un état daté des postes disponibles a-t-il été établi ?",["L. 1233-4"],
 f => vide(f.postesDisponibles)
   ? { etat: MANQ, motif: "Aucune liste de postes disponibles n'a été fournie. L'obligation de reclassement ne peut donc pas être contrôlée." }
   : { etat: piece(f,"etat-postes") ? CONF : RISQ,
       motif: `${f.postesDisponibles.length} poste(s) recensé(s). ` +
         (piece(f,"etat-postes") ? "L'état daté est versé au dossier."
          : "L'existence de cette liste est déclarée mais l'état daté n'est pas versé : la loyauté de la recherche reste invérifiable.") });

c("CTL-REC-02","Reclassement","La recherche couvre-t-elle tout le périmètre de permutation ?",["L. 1233-4"],
 f => !f.groupe ? { etat: SO, motif: "L'entreprise n'appartient à aucun groupe : le périmètre se limite à l'entreprise." }
   : vide(f.societes) ? { etat: MANQ, motif: "Les sociétés du groupe ne sont pas renseignées." }
   : (() => {
       const fr = f.societes.filter(s => !s.etranger).map(s => s.nom);
       const vues = new Set((f.postesDisponibles || []).map(p => p.societe));
       const oubli = fr.filter(n => !vues.has(n));
       return oubli.length
         ? { etat: RISQ, motif: `Aucun poste n'est recensé, ni aucune absence de poste attestée, pour : ${oubli.join(", ")}. Une société du périmètre non interrogée est un manquement.` }
         : { etat: CONF, motif: `Les ${fr.length} sociétés françaises du groupe sont couvertes par l'état des postes.` };
     })());

c("CTL-REC-03","Reclassement","Les offres respectent-elles les six mentions obligatoires ?",["D. 1233-2-1"],
 f => vide(f.offresFaites) ? { etat: MANQ, motif: "Aucune offre de reclassement n'est renseignée." }
   : (() => {
       const REQ = ["intitule","descriptif","employeur","contrat","lieu","remuneration","classification"];
       const def = f.offresFaites.filter(o => REQ.some(k => vide(o[k])));
       return def.length
         ? { etat: NC, motif: `${def.length} offre(s) sur ${f.offresFaites.length} ne comportent pas toutes les mentions exigées : intitulé et descriptif du poste, nom de l'employeur, nature du contrat, localisation, rémunération, classification.` }
         : { etat: f.offresFaites.every(o => o.dateCertaine) ? CONF : RISQ,
             motif: f.offresFaites.every(o => o.dateCertaine)
               ? "Toutes les offres comportent les mentions exigées et ont été adressées par un moyen conférant date certaine."
               : "Les mentions sont complètes, mais toutes les offres n'ont pas été adressées par un moyen conférant date certaine." };
     })());

c("CTL-REC-04","Reclassement","L'absence de poste est-elle établie, ou seulement affirmée ?",["L. 1233-4"],
 f => (f.postesDisponibles && f.postesDisponibles.length) ? { etat: SO, motif: "Des postes ont été recensés." }
   : piece(f,"attestation-absence-poste")
     ? { etat: CONF, motif: "Une attestation d'absence de poste disponible, datée, est versée." }
     : { etat: RISQ, motif: "L'absence de poste n'est pas attestée. « Il n'y a pas de manquement à l'obligation de reclassement si l'employeur justifie de l'absence de poste disponible » — encore faut-il le justifier (Cass. soc. 2 juillet 2014, n° 13-12.048)." });

c("CTL-REC-05","Reclassement","Les efforts de formation et d'adaptation ont-ils été faits ?",["L. 1233-4"],
 f => vide(f.formationProposee)
   ? { etat: f.cause === "2" ? NC : MANQ,
       motif: f.cause === "2"
         ? "Aucune formation n'est renseignée alors que la cause invoquée est une mutation technologique : c'est le terrain sur lequel le litige se noue."
         : "Aucune action de formation ou d'adaptation n'est renseignée." }
   : { etat: f.formationProposee.every(x => x.reponse) ? CONF : RISQ,
       motif: `${f.formationProposee.length} action(s) proposée(s)` +
         (f.formationProposee.every(x => x.reponse) ? ", chacune avec la réponse du salarié." : " ; certaines réponses ne sont pas documentées.") });

/* ---------------- EMPLOI ET CAUSALITÉ ---------------- */
c("CTL-EMP-01","Emploi","La suppression d'emploi est-elle documentée poste par poste ?",["L. 1233-3, al. 1er"],
 f => vide(f.postesSupprimes) ? { etat: MANQ, motif: "Les postes supprimés ne sont pas renseignés : ni la suppression, ni son étendue ne peuvent être contrôlées." }
   : (() => {
       const s = f.postesSupprimes.reduce((a,p)=>a+((p.avant||0)-(p.apres||0)),0);
       return s === f.nbLicenciements
         ? { etat: CONF, motif: `Les suppressions déclarées (${s}) correspondent au nombre de licenciements envisagés (${f.nbLicenciements}).` }
         : { etat: RISQ, motif: `Écart entre les suppressions déclarées (${s}) et le nombre de licenciements (${f.nbLicenciements}). Un écart non expliqué affaiblit la démonstration.` };
     })());

c("CTL-EMP-02","Emploi","Des recrutements ou des précaires contredisent-ils la suppression ?",["L. 1233-3"],
 f => neant(f, "precaires") ? { etat: CONF, motif: "Aucun contrat à durée déterminée ni intérimaire n'est déclaré sur les emplois supprimés. Réponse déclarative : elle n'est justifiée par aucune pièce et sera vérifiée sur le registre du personnel en cas de contestation." }
   : vide(f.precaires) ? { etat: MANQ, motif: "Les contrats à durée déterminée, l'intérim et les recrutements récents ne sont pas renseignés : c'est la première contradiction que recherchera un contradicteur." }
   : (() => {
       const cat = new Set((f.postesSupprimes||[]).map(p=>p.intitule));
       const conflit = f.precaires.filter(p => cat.has(p.emploi));
       return conflit.length
         ? { etat: NC, motif: `${conflit.length} contrat(s) précaire(s) ou recrutement(s) portent sur un emploi déclaré supprimé : ${conflit.map(p=>p.emploi).join(", ")}.` }
         : { etat: CONF, motif: "Aucun contrat précaire ni recrutement ne porte sur un emploi déclaré supprimé." };
     })());

/* ---------------- CAUSE ÉCONOMIQUE ---------------- */
c("CTL-ECO-01","Cause économique","La démonstration comptable est-elle produite ?",["L. 1233-3, 1°"],
 f => f.cause !== "1" ? { etat: SO, motif: "La cause invoquée n'est pas les difficultés économiques." }
   : (() => {
       const manque = [];
       if (vide(f.trimestres)) manque.push("le tableau trimestriel comparé");
       if (vide(f.resultatExploitation)) manque.push("le résultat d'exploitation sur trois exercices");
       if (vide(f.tresorerie)) manque.push("la trésorerie et l'excédent brut d'exploitation");
       if (manque.length === 3) return { etat: MANQ, motif: "Aucune pièce comptable n'est renseignée." };
       if (manque.length) return { etat: RISQ, motif: `Manquent : ${manque.join(", ")}. Si le seuil trimestriel est écarté, aucun indicateur de repli n'est documenté (Cass. soc. 21 septembre 2022, n° 20-18.511).` };
       return { etat: piece(f,"liasse") ? CONF : RISQ,
                motif: piece(f,"liasse") ? "Les trois séries sont produites et la liasse fiscale est versée."
                  : "Les trois séries sont renseignées, mais la liasse fiscale n'est pas versée : les tableaux restent des documents internes." };
     })());

c("CTL-ECO-02","Cause économique","Le périmètre de la démonstration est-il le bon ?",["L. 1233-3"],
 f => !f.groupe ? { etat: SO, motif: "L'entreprise n'appartient à aucun groupe." }
   : vide(f.societes) ? { etat: MANQ, motif: "Les sociétés du groupe ne sont pas renseignées : le secteur d'activité ne peut pas être délimité." }
   : (f.trimestres && f.trimestres.some(t => t.perimetre === "secteur"))
     ? (() => {
         /* L'étiquette « secteur » est une déclaration, pas un contenu. Si une
            société française du groupe exerce la même activité, les agrégats
            doivent la comprendre : le contrôle ne peut pas l'affirmer. */
         const soeurs = (f.societes || []).filter(s => !s.etranger && s.activite && s.nom !== f.entreprise
           && (f.societes || []).some(x => x.nom === f.entreprise ? false : true) && !/holding/i.test(s.activite));
         const memeActivite = soeurs.filter(s => (f.societesDuSecteur || []).includes(s.nom)
           || (f.activite && s.activite && s.activite.toLowerCase() === String(f.activite).toLowerCase()));
         if (memeActivite.length)
           return { etat: RISQ, motif: `Les données déclarent porter sur le secteur d'activité du groupe, et ${memeActivite.length} société(s) française(s) du même secteur sont déclarées : ${memeActivite.map(s=>s.nom).join(", ")}. Que les agrégats les comprennent réellement ne se déduit pas de l'étiquette : la pièce doit le dire poste par poste.` };
         if (soeurs.length && vide(f.societesDuSecteur))
           return { etat: RISQ, motif: `Les données déclarent porter sur le secteur d'activité du groupe, mais les sociétés qui composent ce secteur ne sont pas énumérées. ${soeurs.length} société(s) française(s) du groupe pourraient en relever : ${soeurs.map(s=>s.nom+" ("+s.activite+")").join(", ")}. Le périmètre déclaré doit être nommé pour être vérifiable.` };
         return { etat: CONF, motif: "Les données produites portent sur le secteur d'activité du groupe, et les sociétés qui le composent sont énumérées." };
       })()
     : { etat: RISQ, motif: "Rien n'indique que les données portent sur le secteur d'activité du groupe plutôt que sur la seule entreprise. « Il incombe à l'employeur de démontrer, dans le périmètre pertinent, la réalité et le sérieux du motif » (Cass. soc. 31 mars 2021, n° 19-26.054)." });

c("CTL-ECO-03","Cause économique","La menace sur la compétitivité est-elle établie ?",["L. 1233-3, 3°"],
 f => f.cause !== "3" ? { etat: SO, motif: "La cause invoquée n'est pas la sauvegarde de la compétitivité." }
   : vide(f.menace) ? { etat: MANQ, motif: "La menace n'est pas décrite. Sans elle, la réorganisation ne se distingue pas d'une recherche de rentabilité." }
   : { etat: RISQ, motif: "La menace est décrite. Elle doit être extérieure, datée, chiffrée, et accompagnée d'un scénario de référence montrant ce qu'il advient sans réorganisation (Cass. soc. 1er décembre 1999, n° 98-42.746)." });

c("CTL-ECO-04","Cause économique","La mutation technologique est-elle datée et documentée ?",["L. 1233-3, 2°"],
 f => f.cause !== "2" ? { etat: SO, motif: "La cause invoquée n'est pas une mutation technologique." }
   : vide(f.mutation) ? { etat: MANQ, motif: "La mutation n'est pas décrite : outil abandonné, outil nouveau, date de mise en service, montant." }
   : { etat: CONF, motif: "La mutation est décrite. Les pièces attendues sont la commande, la facture, le procès-verbal de mise en service et la preuve de l'arrêt de l'ancien outil." });

/* ---------------- PROCÉDURE CSE ---------------- */
c("CTL-CSE-01","Procédure","La consultation du comité était-elle due, et a-t-elle eu lieu ?",["L. 1233-8","L. 1233-28"],
 f => { const r = M.regimeEco(f);
   if (!r.consultationCSE) return { etat: SO, motif: r.note || "La consultation n'est pas due dans cette configuration." };
   if (vide(f.dateInfoCSE)) return { etat: MANQ, motif: "La date de convocation du comité n'est pas renseignée." };
   if (vide(f.datesReunionsCSE)) return { etat: MANQ, motif: "Les dates de réunion ne sont pas renseignées." };
   const n = f.datesReunionsCSE.length;
   const attendu = r.code === "GRAND_COLLECTIF" ? 2 : r.code === "GRAND_PETITE_ENTREPRISE" ? 2 : 1;
   return n < attendu
     ? { etat: NC, motif: `${n} réunion(s) tenue(s) pour ${attendu} exigée(s) dans ce régime.` }
     : { etat: CONF, motif: `${n} réunion(s) tenue(s), le régime en exige ${attendu}.` }; });

c("CTL-CSE-02","Procédure","Les délais entre convocation, réunions et avis sont-ils respectés ?",["L. 1233-29","L. 1233-30"],
 f => { const r = M.regimeEco(f);
   if (!r.consultationCSE || vide(f.datesReunionsCSE)) return { etat: MANQ, motif: "Dates de réunion non renseignées." };
   const d = [...f.datesReunionsCSE].sort();
   if (d.length < 2) return { etat: SO, motif: "Une seule réunion : aucun intervalle à contrôler." };
   const e = require("./dates.js").ecart(d[0], d[1], "la première réunion", "la seconde réunion");
   if (!e.valide) return { etat: MANQ, motif: e.motif };
   const jours = e.jours;
   if (r.code === "GRAND_COLLECTIF")
     return jours >= 15 ? { etat: CONF, motif: `${jours} jours entre les deux réunions, le minimum est de quinze.` }
                        : { etat: NC, motif: `${jours} jours entre les deux réunions : le minimum de quinze jours n'est pas respecté (L. 1233-30, I).` };
   if (r.code === "GRAND_PETITE_ENTREPRISE")
     return jours <= 14 ? { etat: CONF, motif: `${jours} jours entre les deux réunions, le maximum est de quatorze.` }
                        : { etat: NC, motif: `${jours} jours entre les deux réunions : le délai ne peut être supérieur à quatorze jours (L. 1233-29).` };
   return { etat: SO, motif: "Régime sans intervalle imposé." }; });

c("CTL-CSE-03","Procédure","Les renseignements ont-ils été joints à la convocation ?",["L. 1233-10","L. 1233-31"],
 f => { const r = M.regimeEco(f);
   if (!r.consultationCSE) return { etat: SO, motif: "Consultation non due." };
   const art = r.code === "PETIT_COLLECTIF" ? "L. 1233-10" : "L. 1233-31";
   return piece(f,"renseignements-cse")
     ? { etat: CONF, motif: `Le document d'information prévu à l'article ${art} est versé, avec la décharge des membres.` }
     : { etat: RISQ, motif: `Le document des sept renseignements de l'article ${art} n'est pas versé. Il doit être adressé « avec la convocation », non remis en séance.` }; });

/* Une case remplie n'est pas une date. Le questionnaire admet la mention
   « avis non rendu » : la lire comme un avis rendu produirait un faux conforme,
   et l'exigence décisive — la notification intervient-elle après l'expiration
   du délai ? — ne serait jamais contrôlée. */
const estDate = s => /^\d{4}-\d{2}-\d{2}$/.test(String(s || ""));
c("CTL-CSE-04","Procédure","L'avis a-t-il été rendu, ou le délai est-il expiré ?",["L. 1233-8","L. 1233-30, II"],
 f => { const r = M.regimeEco(f);
   if (!r.consultationCSE) return { etat: SO, motif: "Consultation non due." };
   if (estDate(f.dateAvisCSE)) return { etat: CONF, motif: `Avis rendu le ${f.dateAvisCSE}.` };
   if (!vide(f.dateAvisCSE) && !/non rendu/i.test(String(f.dateAvisCSE)))
     return { etat: MANQ, motif: `Valeur non interprétable : « ${f.dateAvisCSE} ». Attendu : une date au format AAAA-MM-JJ, ou la mention « avis non rendu ».` };
   if (vide(f.datesReunionsCSE)) return { etat: MANQ, motif: "Ni avis rendu, ni dates de réunion : l'expiration du délai ne peut pas être calculée." };
   const mois = M.delaiAvisMois(r);
   /* La première réunion est la plus ancienne, non la première de la liste :
      sans tri, inverser deux lignes du dossier déplace l'expiration du délai. */
   const ordonnees = [...f.datesReunionsCSE].sort();
   const depart = ordonnees[0];
   if (mois === null) return { etat: RISQ, motif: `Aucun avis rendu. Le régime n'exprime pas le délai en mois : ${r.delaiAvis}. La date à laquelle le comité est réputé consulté doit être établie avant toute notification.` };
   const expiration = M.ajouteMois(depart, mois);
   /* L'égalité stricte est le cas où « avant » et « au plus tard » se
      distinguent. Le texte fait courir la présomption « à l'expiration » du
      délai : notifier le jour même n'est ni clairement régulier, ni clairement
      irrégulier. La base le signale au lieu de choisir un signe. */
   if (!vide(f.dateNotification) && f.dateNotification === expiration)
     return { etat: RISQ, motif: `Aucun avis rendu. Le délai de ${r.delaiAvis} expire le ${expiration}, et la notification est fixée au même jour. Le comité est réputé consulté « à l'expiration » du délai : la coïncidence exacte des deux dates n'est tranchée ni par le texte, ni par un arrêt publié du corpus. Décaler la notification d'un jour supprime la difficulté.`, aVerifier: true };
   if (!vide(f.dateNotification) && f.dateNotification < expiration)
     return { etat: NC, motif: `Aucun avis rendu. Le délai de ${r.delaiAvis} court depuis la première réunion du ${depart} et expire le ${expiration} : la notification prévue le ${f.dateNotification} lui est antérieure. Le comité n'est pas encore réputé consulté.` };
   return { etat: RISQ, motif: `Aucun avis rendu. Le délai de ${r.delaiAvis}, courant depuis la première réunion du ${depart}, expire le ${expiration} ; à cette date le comité est réputé avoir été consulté. Aucune notification ne doit intervenir avant.` }; });

c("CTL-CSE-05","Procédure","La notification ou l'information de l'administration est-elle faite ?",["L. 1233-19","L. 1233-46"],
 f => { const r = M.regimeEco(f);
   if (vide(f.dateNotifAdmin)) return { etat: MANQ, motif: "La date de notification ou d'information à l'autorité administrative n'est pas renseignée." };
   if (r.code === "GRAND_COLLECTIF" || r.code === "GRAND_PETITE_ENTREPRISE") {
     const d = [...(f.datesReunionsCSE||[])].sort()[0];
     if (d && f.dateNotifAdmin <= d)
       return { etat: NC, motif: `Notification du ${f.dateNotifAdmin} : elle ne peut intervenir qu'au plus tôt le lendemain de la date prévue pour la première réunion, le ${d} (L. 1233-46).` };
     return { etat: CONF, motif: `Notification du ${f.dateNotifAdmin}, postérieure à la première réunion.` };
   }
   return { etat: CONF, motif: `Information de l'autorité administrative du ${f.dateNotifAdmin}.` }; });

/* ---------------- PLAN DE SAUVEGARDE DE L'EMPLOI ---------------- */
c("CTL-PSE-01","Plan de sauvegarde de l'emploi","Un plan est-il dû, et son contenu couvre-t-il les mesures exigées ?",
  ["L. 1233-61","L. 1233-62","L. 1233-63"],
 f => { const r = M.regimeEco(f);
   if (!r.pse) return { etat: SO, motif: "Aucun plan n'est dû : le seuil de dix licenciements dans une entreprise d'au moins cinquante salariés n'est pas atteint." };
   const p = f.pse || {};
   const EXI = [["evitement","mesures pour éviter les licenciements ou en limiter le nombre"],
                ["reclassementInterne","plan de reclassement interne sur le territoire national"],
                ["formation","actions de formation, de validation des acquis ou de reconversion"],
                ["creation","actions de soutien à la création ou à la reprise d'activité"],
                ["suivi","modalités de suivi de la mise en œuvre"]];
   const abs = EXI.filter(([k]) => vide(p[k])).map(([,l]) => l);
   if (Object.keys(p).length === 0) return { etat: MANQ, motif: "Un plan est obligatoire mais son contenu n'est pas renseigné." };
   return abs.length ? { etat: RISQ, motif: `Le plan ne renseigne pas : ${abs.join(" ; ")}. Ces mesures sont examinées par l'administration au regard des moyens de l'entreprise, de l'unité économique et sociale ou du groupe.` }
                     : { etat: CONF, motif: "Le plan renseigne les cinq catégories de mesures attendues." }; });

c("CTL-PSE-02","Plan de sauvegarde de l'emploi","Le plan est-il calibré sur les moyens du groupe ?",["L. 1233-57-3"],
 f => { if (!M.regimeEco(f).pse) return { etat: SO, motif: "Aucun plan n'est dû." };
   if (!f.groupe) return { etat: SO, motif: "L'entreprise n'appartient à aucun groupe." };
   return piece(f,"comptes-groupe")
     ? { etat: CONF, motif: "Les comptes consolidés du groupe sont versés : l'administration peut apprécier la proportionnalité des mesures." }
     : { etat: RISQ, motif: "Les comptes du groupe ne sont pas versés. Un plan calibré sur les seuls moyens de la filiale est le motif de refus d'homologation le plus fréquent." }; });

c("CTL-PSE-03","Plan de sauvegarde de l'emploi","La voie retenue est-elle arrêtée : accord majoritaire ou document unilatéral ?",
  ["L. 1233-24-1","L. 1233-57-3"],
 f => { if (!M.regimeEco(f).pse) return { etat: SO, motif: "Aucun plan n'est dû." };
   const v = (f.pse||{}).voie;
   if (vide(v)) return { etat: MANQ, motif: "La voie n'est pas arrêtée. Elle détermine tout le calendrier et se choisit avant la première réunion." };
   return { etat: CONF, motif: v === "accord"
     ? "Accord majoritaire : signature par des syndicats ayant recueilli au moins 50 % des suffrages exprimés au premier tour des dernières élections, puis validation administrative."
     : "Document unilatéral soumis à homologation : l'administration vérifie le contenu, la régularité de la consultation et le respect des articles L. 1233-61 à L. 1233-63." }; });

c("CTL-PSE-04","Plan de sauvegarde de l'emploi","La notification intervient-elle après la décision administrative ?",["L. 1233-39"],
 f => { if (!M.regimeEco(f).pse) return { etat: SO, motif: "Aucun plan n'est dû." };
   const d = (f.pse||{}).dateDecisionAdmin;
   if (vide(d)) return { etat: MANQ, motif: "La date de la décision de validation ou d'homologation n'est pas renseignée." };
   if (f.dateNotification && f.dateNotification <= d)
     return { etat: NC, motif: `Notification prévue le ${f.dateNotification}, décision administrative le ${d} : la notification ne peut intervenir qu'après.` };
   return { etat: CONF, motif: `Décision du ${d}, notification postérieure.` }; });

/* ---------------- SALARIÉS PROTÉGÉS ET SITUATIONS INDIVIDUELLES ---------------- */
/* Une case remplie n'est pas une autorisation. Le champ peut porter un refus,
   une date postérieure à la notification, ou une mention non interprétable :
   dans aucun de ces cas la protection n'est satisfaite. */
const sensAutorisation = s => {
  if (vide(s)) return { sens: "absent" };
  if (typeof s === "object") return { sens: s.sens || "absent", date: s.date };
  const t = String(s);
  const d = (t.match(/\d{4}-\d{2}-\d{2}/) || [])[0];
  if (/refus|rejet|refusé/i.test(t)) return { sens: "refus", date: d };
  if (/attente|en cours|instruction/i.test(t)) return { sens: "en attente", date: d };
  if (d && /accord|autoris|accept/i.test(t)) return { sens: "accord", date: d };
  if (d && t.trim() === d) return { sens: "accord", date: d };
  return { sens: "illisible", date: d, brut: t };
};
c("CTL-PRT-01","Salariés protégés","L'autorisation administrative est-elle obtenue pour chaque salarié protégé ?",["L. 2411-1","L. 2411-5"],
 f => vide(f.salariesProteges) ? { etat: SO, motif: "Aucun salarié protégé signalé." }
   : (() => {
       const lu = f.salariesProteges.map(s => ({ ...s, a: sensAutorisation(s.autorisation) }));
       const refus = lu.filter(x => x.a.sens === "refus");
       if (refus.length) return { etat: NC, motif: `${refus.length} salarié(s) protégé(s) dont l'autorisation a été REFUSÉE : ${refus.map(x=>x.nom+" ("+x.mandat+")").join(", ")}. Le licenciement notifié malgré un refus est nul, et le fait de passer outre est pénalement sanctionné.` };
       const absents = lu.filter(x => x.a.sens === "absent" || x.a.sens === "en attente");
       if (absents.length) return { etat: NC, motif: `${absents.length} salarié(s) protégé(s) sans autorisation obtenue : ${absents.map(x=>x.nom+" ("+x.mandat+")").join(", ")}. Aucune notification ne peut intervenir avant l'autorisation.` };
       const illisibles = lu.filter(x => x.a.sens === "illisible");
       if (illisibles.length) return { etat: MANQ, motif: `Mention non interprétable pour ${illisibles.map(x=>x.nom+" : « "+x.a.brut+" »").join(", ")}. Attendu : le sens de la décision — accord, refus ou en attente — et sa date.` };
       const tardives = lu.filter(x => x.a.date && !vide(f.dateNotification) && x.a.date > f.dateNotification);
       if (tardives.length) return { etat: NC, motif: `${tardives.length} autorisation(s) postérieure(s) à la notification du ${f.dateNotification} : ${tardives.map(x=>x.nom+" — "+x.a.date).join(", ")}. L'autorisation doit précéder la notification, non la suivre.` };
       const sansDate = lu.filter(x => !x.a.date);
       if (sansDate.length) return { etat: RISQ, motif: `Autorisations déclarées mais non datées pour ${sansDate.map(x=>x.nom).join(", ")} : l'antériorité par rapport à la notification n'est pas vérifiable.` };
       return { etat: CONF, motif: `Les ${lu.length} salariés protégés disposent d'une autorisation, toutes antérieures à la notification du ${f.dateNotification}.` };
     })());

c("CTL-IND-01","Situations individuelles","Des salariés en arrêt, congé maternité ou inaptitude sont-ils concernés ?",[],
 f => neant(f, "salariesSuspendus") ? { etat: SO, motif: "Aucun salarié en arrêt, en congé maternité ou déclaré inapte n'est déclaré parmi les salariés concernés." }
   : vide(f.salariesSuspendus)
   ? { etat: MANQ, motif: "Les salariés en arrêt, en congé maternité ou déclarés inaptes ne sont pas renseignés. Chacune de ces situations obéit à des règles propres qui peuvent interdire ou retarder la notification." }
   : { etat: RISQ, motif: `${f.salariesSuspendus.length} salarié(s) dans une situation particulière : chacun doit faire l'objet d'un examen distinct, hors du champ de cette base.` });

c("CTL-COE-01","Groupe","Un risque de co-emploi est-il signalé ?",[],
 f => f.coEmploi === true
   ? { etat: RISQ, motif: "Une immixtion de la société mère dans la gestion est signalée. Le co-emploi suppose une confusion d'intérêts, d'activités et de direction, se manifestant par une immixtion permanente de la société mère dans la gestion économique et sociale de la société employeuse, conduisant à la perte totale d'autonomie d'action de cette dernière. Le critère est exigeant : la première moitié de la formule ne suffit pas. La qualification est hors du champ de cette base et appelle un examen distinct." }
   : vide(f.coEmploi) ? { etat: MANQ, motif: "La question de l'immixtion d'une société du groupe dans la gestion n'est pas renseignée." }
   : { etat: SO, motif: "Aucune immixtion signalée. Ce contrôle ne conclut jamais à la conformité : il détecte une situation qui appellerait un examen extérieur à la base." });

/* ---------------- NORMES CONVENTIONNELLES ---------------- */
c("CTL-CCN-01","Normes conventionnelles","La convention et les accords sont-ils versés ?",["L. 1233-5","L. 1233-39"],
 f => (f.conventionJointe && f.accordsJoints)
   ? { etat: CONF, motif: "Convention et accords versés : les règles conventionnelles ont pu être confrontées à la loi." }
   : { etat: RISQ, motif: (!f.conventionJointe ? "La convention collective n'est pas versée. " : "") +
       (!f.accordsJoints ? "Les accords d'entreprise ne sont pas versés. " : "") +
       "Tant qu'ils ne le sont pas, l'audit applique la loi seule, alors que ces textes priment sur les critères d'ordre, les délais et l'indemnité." });

/* Chaque contrôle reçoit son niveau de preuve : il se déduit de l'état et de la
   pièce attendue, jamais d'une appréciation. */
const PIECE_ATTENDUE = {
 "CTL-REC-01":"etat-postes", "CTL-REC-02":"etat-postes", "CTL-REC-03":"offres",
 "CTL-REC-04":"attestation-absence-poste", "CTL-REC-05":"formation",
 "CTL-ECO-01":"liasse", "CTL-ECO-02":"comptes-groupe",
 "CTL-CSE-01":"pv-cse", "CTL-CSE-03":"renseignements-cse", "CTL-CSE-04":"pv-cse",
 "CTL-PSE-01":"pse", "CTL-PSE-02":"comptes-groupe", "CTL-PSE-04":"decision-admin",
 "CTL-PRT-01":"autorisations", "CTL-CCN-01":"convention",
};
const A_PRO = new Set(["CTL-ECO-03","CTL-IND-01","CTL-COE-01","CTL-PSE-02","CTL-FRA-01","CTL-REP-01"]);
function niveauDe(x, f, v) {
  if (v.etat === MANQ) return P.NIV.MANQUANT;
  if (v.etat === SO) return "—";
  if (A_PRO.has(x.id) && v.etat !== CONF) return P.NIV.PRO;
  const cle = PIECE_ATTENDUE[x.id];
  if (!cle) return v.etat === CONF ? P.NIV.DECLARE : P.NIV.DECLARE;
  return P.aPiece(f, cle) ? P.NIV.PIECE : P.NIV.DECLARE;
}
C.push(...require('./controles2.js'));

/* ---------------- Ce qu'une contradiction interdit de conclure ----------------

   Les contrôles de cohérence constataient la contradiction, et les contrôles de
   conformité continuaient de prononcer « conforme » sur les mêmes faits. Le
   rapport disait donc, à deux pages d'intervalle, qu'un poste est à la fois
   disponible et supprimé, et que tout poste disponible a bien été proposé.
   Les deux affirmations sont exactes prises séparément ; ensemble elles ne
   veulent rien dire.

   Un constat de conformité suppose que les faits sur lesquels il porte tiennent
   ensemble. Quand la cohérence est rompue, le constat n'est pas faux : il est
   sans objet, et il devient une réserve qui nomme la contradiction. Les
   verdicts « non conforme » ne sont pas touchés — un manquement constaté reste
   un manquement. */
const SUBORDONNE = {
  "CTL-REC-07": ["CTL-COH-01"],   /* « tout poste disponible a été proposé » suppose que les postes disponibles le soient */
  "CTL-REC-03": ["CTL-COH-02"],   /* « les offres sont complètes » suppose qu'elles portent sur des postes distincts */
  "CTL-ORD-02": ["CTL-COH-03"],   /* « les catégories sont objectives » suppose que les critères départagent */
};
for (const [id, sources] of Object.entries(SUBORDONNE)) {
  const cible = C.find(x => x.id === id);
  if (!cible) continue;
  const brut = cible.verdict;
  cible.verdict = f => {
    const v = brut(f);
    if (!v || v.etat !== CONF) return v;
    const rompues = sources.map(s => ({ id: s, v: (() => {
      try { return C.find(x => x.id === s).verdict(f); } catch (e) { return null; } })() }))
      .filter(x => x.v && x.v.etat === NC);
    if (!rompues.length) return v;
    return { etat: RISQ, motif: `${v.motif} Ce constat suppose toutefois que les faits déclarés tiennent ensemble, et ils ne tiennent pas : `
      + rompues.map(x => `${x.id} — ${x.v.motif}`).join(" ") };
  };
}

/* ---------------- Ce qu'une donnée illisible interdit de conclure ----------------
   Voir moteur/commun/recevabilite.js. CTL-VAL-01 est exempté : c'est lui qui
   porte l'anomalie, il doit continuer à la constater. */
require("./recevabilite.js").envelopper(C, require("./valider.js").valider, ["CTL-VAL-01"]);

module.exports = { C, ETATS: { CONF, NC, RISQ, MANQ, SO }, niveauDe, PIECE_ATTENDUE, SUBORDONNE };
